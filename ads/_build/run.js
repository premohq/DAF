/* Drives the live Dante's Ad Forge (https://premohq.github.io/DAF/) headlessly. */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const HERE = __dirname, PREP = path.join(HERE, 'prep'), OUT = path.join(HERE, 'out');
const cfg = JSON.parse(fs.readFileSync(path.join(HERE, 'concepts.json'), 'utf8'));
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const SITE = process.env.SITE || 'https://premohq.github.io/DAF/';
const NAMES = { p45: 'feed_4x5', sq: 'square_1x1', reel: 'story_9x16', wide: 'wide_16x9' };
const args = process.argv.slice(2), mode = args[0] || 'all', only = args.slice(1);
const want = id => !only.length || only.some(o => id.startsWith(o));

(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1400, height: 1000 }, acceptDownloads: true })).newPage();
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto(SITE, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: fs.readFileSync(path.join(HERE, 'ext.js'), 'utf8') });
  const fontsOk = await page.evaluate(async () => {
    const fs_ = ['100px Anton', '700 100px Oswald', '600 100px Oswald', '500 100px Oswald', '400 100px Oswald', '700 100px "Zilla Slab"', '800 100px "Baloo 2"'];
    await Promise.all(fs_.map(f => document.fonts.load(f))); await document.fonts.ready;
    return fs_.map(f => document.fonts.check(f));
  });
  console.log('fonts loaded:', fontsOk.join(','));
  if (fontsOk.includes(false)) throw new Error('fonts missing');

  async function download(btn, out) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click(btn)]);
    await dl.saveAs(out); return out;
  }

  async function setSocial(c, fmt) {
    await page.click('.tab[data-tab="social"]');
    await page.click(`#fmts [data-f="${fmt}"]`);
    if (c.photo) {
      await page.evaluate(() => { window.__prev = st.img });
      await page.setInputFiles('#file', path.join(PREP, `${c.id}_${fmt}.jpg`));
      await page.waitForFunction(() => st.img && st.img !== window.__prev && st.img.complete);
    } else {
      await page.evaluate(() => { st.img = null; st.iw = st.ih = 0; document.querySelector('#drop').classList.add('hide') });
    }
    for (const [sel, v] of [['#badge', c.badge], ['#n1', c.n1], ['#n2', c.n2], ['#sub', c.sub]]) await page.fill(sel, v || '');
    await page.click(c.gold ? '#bGold' : '#bEmber');
    await page.setChecked('#priceOn', !!c.price);
    if (c.price) { await page.fill('#dol', c.price[0]); await page.fill('#cts', c.price[1]); }
    await page.evaluate(c => {
      EXT.tag = c.tag || ''; st.darken = c.darken || 1; document.querySelector('#dark').value = st.darken;
      st.cx = st.cy = 0.5; st.zoom = 1; document.querySelector('#zoom').value = 1; draw();
    }, c);
    const warn = await page.evaluate(() => {
      const W = stage.width, H = stage.height, S = Math.min(W, H) / 1080, mx = 64 * S;
      if (!st.price || !st.sub) return '';
      const reserve = priceMetrics(ctx, S).w + 58 * S + 34 * S;
      const sp = fitPx(ctx, st.sub, 'osw', 600, 38 * S, W - 2 * mx, 22 * S); ctx.font = font(sp, 'osw', 600);
      const w = ctx.measureText(st.sub).width, lim = W - mx - reserve + 30 * S;
      return w > lim ? `sub ${Math.round(w)}px > ${Math.round(lim)}px` : '';
    });
    if (warn) console.log('  WARN', c.id, fmt, warn);
  }

  async function video(out, fn, dur) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const fps = 30, N = Math.round(fps * dur);
    const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', out]);
    const done = new Promise((res, rej) => ff.on('close', code => code ? rej(new Error('ffmpeg ' + code)) : res()));
    ff.stderr.on('data', d => process.stderr.write(d));
    for (let i = 0; i < N; i += 15) {
      const frames = await page.evaluate(({ i, n, fps, dur, fn }) => {
        const out = [];
        for (let k = i; k < Math.min(i + 15, n); k++) {
          window[fn](ctx, stage.width, stage.height, { anim: true, t: k / fps, dur });
          out.push(stage.toDataURL('image/jpeg', 0.94).split(',')[1]);
        }
        return out;
      }, { i, n: N, fps, dur, fn });
      for (const b of frames) if (!ff.stdin.write(Buffer.from(b, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await done;
    await page.evaluate(() => draw());
  }

  if (mode === 'social' || mode === 'all') for (const c of cfg.concepts) if (want(c.id)) {
    for (const f of Object.keys(NAMES)) {
      if (!c.crop[f]) continue;
      await setSocial(c, f);
      console.log('png', await download('#png', path.join(OUT, c.id, `${NAMES[f]}.png`)));
    }
  }
  if (mode === 'video' || mode === 'all') for (const c of cfg.concepts) if (want(c.id)) {
    await setSocial(c, 'reel');
    const out = path.join(OUT, c.id, 'reel_9x16.mp4'); await video(out, 'render', 6); console.log('mp4', out);
  }
  if (mode === 'carousel' || mode === 'all') for (const c of cfg.carousel) if (c.photo && want(c.id)) {
    for (const f of ['p45', 'reel']) {
      if (c.photo && !(c.crop || {})[f]) continue;
      await setSocial(c, f);
      console.log('png', await download('#png', path.join(OUT, '14_carousel', `${c.id}_${NAMES[f]}.png`)));
    }
  }
  if (mode === 'roundup' || mode === 'all') {
    const r = cfg.roundup;
    const bg = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(PREP, 'roundup_bg.jpg')).toString('base64');
    await page.click('.tab[data-tab="social"]');
    await page.evaluate(async ({ r, bg }) => {
      const img = new Image(); img.src = bg; await img.decode();
      Object.assign(ROUND, { bg: img, kicker: r.kicker, title: r.title, rows: r.rows });
      st.badge = r.badge; st.badgeGold = false; st.darken = 1;
    }, { r, bg });
    for (const f of ['p45', 'reel', 'sq']) {
      await page.click(`#fmts [data-f="${f}"]`);
      await page.evaluate(() => { renderRoundup(ctx, stage.width, stage.height, { anim: false }) });
      const out = path.join(OUT, r.id, `${NAMES[f]}.png`); fs.mkdirSync(path.dirname(out), { recursive: true });
      const b64 = await page.evaluate(() => stage.toDataURL('image/png').split(',')[1]);
      fs.writeFileSync(out, Buffer.from(b64, 'base64')); console.log('png', out);
    }
    await page.click('#fmts [data-f="reel"]');
    const out = path.join(OUT, r.id, 'reel_9x16.mp4'); await video(out, 'renderRoundup', 9); console.log('mp4', out);
    await page.evaluate(() => { ROUND.bg = null });
  }
  if (mode === 'closer' || mode === 'all') {
    await page.click('.tab[data-tab="social"]');
    await page.evaluate(() => {
      ROUND.closer = [
        { t: 'COME SEE US', fam: 'anton', wt: 400, px: 92, tr: 3, gap: 78 },
        { t: "INSIDE SEDANO'S PLAZA", px: 40, wt: 700, tr: 5, gap: 56 },
        { t: '2305 FL-7 · HOLLYWOOD, FL', px: 32, wt: 500, tr: 4, col: '#C8BCB2', gap: 0 }];
    });
    for (const f of ['p45', 'reel', 'sq']) {
      await page.click(`#fmts [data-f="${f}"]`);
      await page.evaluate(() => { renderCloser(ctx, stage.width, stage.height, { anim: false }) });
      const out = path.join(OUT, '14_carousel', `99_closer_${NAMES[f]}.png`); fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, Buffer.from(await page.evaluate(() => stage.toDataURL('image/png').split(',')[1]), 'base64')); console.log('png', out);
    }
  }
  if (mode === 'window' || mode === 'all') {
    await page.click('.tab[data-tab="monitor"]');
    for (const c of cfg.concepts) if (c.win && want(c.id)) {
      const w = c.win;
      await page.evaluate(() => { window.__prev = mSt.img });
      await page.setInputFiles('#mfile', path.join(PREP, `${c.id}_window.png`));
      await page.waitForFunction(() => mSt.img && mSt.img !== window.__prev && mSt.img.complete);
      await page.fill('#ml1', w.l1); await page.fill('#ml2', w.l2);
      await page.click(`#mncols [data-c="${w.nc}"]`);
      await page.setChecked('#mpriceOn', true);
      await page.fill('#mdol', c.price[0]); await page.fill('#mcts', c.price[1]);
      await page.click(`#mpcols [data-c="${w.pc}"]`);
      await page.click(`#mors [data-o="${w.or || 'land'}"]`);
      console.log('png', await download('#mpng', path.join(OUT, c.id, 'window_display_3840x2160.png')));
    }
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
