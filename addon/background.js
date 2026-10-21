/* DAF Helper background: runs Dante's Ad Forge jobs in one pinned Gemini tab, one job at a time.
   A job is {op:'image'|'ask', prompt, images:[{name,type,data}]}. Each one opens a fresh Gemini chat,
   gemini.js does the typing and clicking, and images come back to the Forge as data URLs. */
const GEMINI = 'https://gemini.google.com/app';
const FORGE = 'https://premohq.github.io/DAF/';
let chain = Promise.resolve();

const fail = (code, message) => Object.assign(new Error(message), {code});
const sleep = ms => new Promise(r => setTimeout(r, ms));

chrome.action.onClicked.addListener(() => chrome.tabs.create({url: FORGE}));

chrome.runtime.onMessage.addListener((m, sender, reply) => {
  if (m && m.kind === 'show') { showWorker().then(() => reply({ok: true}), () => reply({ok: false})); return true }
});

chrome.runtime.onConnect.addListener(port => {
  if (port.name !== 'daf-job') return;
  let open = true, stop = false;
  const send = m => { if (open) try { port.postMessage(m) } catch (e) { open = false } };
  port.onDisconnect.addListener(() => { open = false; stop = true });
  port.onMessage.addListener(m => {
    if (m.kind === 'cancel') stop = true;
    if (m.kind !== 'job') return;
    const job = {op: m.op === 'ask' ? 'ask' : 'image', prompt: String(m.prompt || ''), images: m.images || [],
      opts: m.opts || {}, from: port.sender && port.sender.tab, stopped: () => stop};
    chain = chain.then(() => run(job, send)).then(
      r => send(Object.assign({kind: 'done'}, r)),
      e => send({kind: 'error', code: e.code || 'error', message: e.message || String(e)}));
  });
});

async function run(job, send) {
  if (job.stopped()) throw fail('cancelled', 'Stopped.');
  send({kind: 'progress', step: 'open', text: 'Opening Gemini…'});
  const tab = await workerTab(job.from);
  if (job.opts.visible) await focus(tab);
  try {
    try { await chrome.scripting.executeScript({target: {tabId: tab.id}, files: ['gemini.js']}) }
    catch (e) {
      /* we can only see the address while it's still Gemini; anywhere else means a sign-in page */
      const now = await chrome.tabs.get(tab.id).catch(() => null);
      if (!now || !/^https:\/\/gemini\.google\.com\//.test(now.url || ''))
        throw fail('signin', 'Gemini wants you to sign in. Press “Open the Gemini tab”, sign in to your Google account, then try again.');
      throw fail('load', 'The Gemini tab could not be used (' + e.message + '). Press “Open the Gemini tab” to look.');
    }
    return await inTab(tab.id, job, send);
  } finally {
    if (job.opts.visible && job.from) await focus(job.from).catch(() => {});
  }
}

/* the pinned worker tab: reused between jobs, reloaded to a fresh chat for each one */
async function workerTab(from) {
  const s = await chrome.storage.session.get('worker');
  let tab = s.worker != null ? await chrome.tabs.get(s.worker).catch(() => null) : null;
  if (tab) return load(tab.id, false);
  tab = await chrome.tabs.create({url: GEMINI, active: false, pinned: true, windowId: from ? from.windowId : undefined});
  await chrome.storage.session.set({worker: tab.id});
  return load(tab.id, true);
}
function load(id, fresh) {
  return new Promise((res, rej) => {
    let seen = fresh;
    const t = setTimeout(() => { off(); rej(fail('load', 'Gemini did not finish loading. Check your connection and try again.')) }, 60000);
    const on = (tid, info, tab) => {
      if (tid !== id) return;
      if (info.status === 'loading') seen = true;
      if (info.status === 'complete' && seen) { off(); res(tab) }
    };
    const off = () => { clearTimeout(t); chrome.tabs.onUpdated.removeListener(on) };
    chrome.tabs.onUpdated.addListener(on);
    if (fresh) chrome.tabs.get(id).then(tab => { if (tab.status === 'complete') { off(); res(tab) } }, () => {});
    else chrome.tabs.update(id, {url: GEMINI}).catch(e => { off(); rej(fail('closed', 'The Gemini tab could not be reused: ' + e.message)) });
  });
}
async function focus(tab) {
  await chrome.tabs.update(tab.id, {active: true});
  if (tab.windowId != null) await chrome.windows.update(tab.windowId, {focused: true});
}
async function showWorker() {
  const s = await chrome.storage.session.get('worker');
  const tab = s.worker != null ? await chrome.tabs.get(s.worker).catch(() => null) : null;
  if (tab) return focus(tab);
  const t = await chrome.tabs.create({url: GEMINI, active: true, pinned: true});
  await chrome.storage.session.set({worker: t.id});
}
/* a hidden tab can stall while drawing; showing it for a moment lets it finish */
async function wake(id, from) {
  try {
    await chrome.tabs.update(id, {active: true});
    await sleep(2500);
    if (from) await chrome.tabs.update(from.id, {active: true});
  } catch (e) {}
}

function inTab(id, job, send) {
  return new Promise((res, rej) => {
    const p = chrome.tabs.connect(id, {name: 'daf-run'});
    let over = false;
    const end = (fn, v) => { if (over) return; over = true; clearTimeout(t); clearInterval(iv); try { p.disconnect() } catch (e) {} fn(v) };
    const t = setTimeout(() => end(rej, fail('timeout', 'Gemini took more than 6 minutes. Open the Gemini tab to see what happened.')), 360000);
    const iv = setInterval(() => { if (job.stopped()) end(rej, fail('cancelled', 'Stopped.')) }, 1000);
    const asks = new Map();
    const ask = src => new Promise(r => { asks.set(src, r); p.postMessage({kind: 'grab', src}) });
    p.onMessage.addListener(m => {
      if (m.kind === 'progress') send(m);
      else if (m.kind === 'wake') wake(id, job.from);
      else if (m.kind === 'grabbed' && asks.has(m.src)) { asks.get(m.src)(m); asks.delete(m.src) }
      else if (m.kind === 'result') {
        if (job.op !== 'image' || !(m.images || []).length) return end(res, {images: [], text: m.text || ''});
        send({kind: 'progress', step: 'fetch', text: 'Bringing the image back…'});
        Promise.all(m.images.map(im => grab(im, ask))).then(images => end(res, {images, text: m.text || ''}), e => end(rej, e));
      }
      else if (m.kind === 'error') end(rej, fail(m.code || 'error', m.message || 'Gemini failed.'));
    });
    p.onDisconnect.addListener(() => end(rej, fail('closed', 'The Gemini tab was closed or reloaded before it finished.')));
    p.postMessage({kind: 'run', op: job.op, prompt: job.prompt, images: job.images});
  });
}

/* Gemini shows a scaled preview; Google's image server gives the original for "=s0" */
function sizes(src) {
  const out = [];
  try {
    const u = new URL(src);
    if (/(^|\.)googleusercontent\.com$/.test(u.hostname) && !u.search) {
      const base = src.replace(/=[\w-]*$/, '');
      out.push(base + '=s0', base + '=s2048');
    }
  } catch (e) {}
  out.push(src);
  return [...new Set(out)];
}
/* the add-on's own download first (no cross-site limits), then the Gemini page's (its own cookies) */
async function grab(im, ask) {
  if (im.data) return im;
  let why = '';
  for (const url of sizes(im.src)) {
    try {
      const r = await fetch(url, {credentials: 'include'});
      if (!r.ok) { why = 'HTTP ' + r.status; continue }
      const b = await r.blob();
      if (!/^image\//.test(b.type)) { why = 'not an image'; continue }
      let w = 0, h = 0;
      try { const bm = await createImageBitmap(b); w = bm.width; h = bm.height; bm.close() } catch (e) { why = 'unreadable'; continue }
      if (im.w && w < im.w) { why = 'smaller than the preview'; continue }
      return {src: im.src, w, h, data: await dataURL(b)};
    } catch (e) { why = e.message }
  }
  const r = await ask(im.src);
  if (r && r.data) return {src: im.src, w: r.w || 0, h: r.h || 0, data: r.data};
  if (r && r.error) why += '; ' + r.error;
  throw fail('fetch', 'Gemini made the image, but it could not be downloaded (' + why + '). Open the Gemini tab and save it from there.');
}
async function dataURL(b) {
  const u = new Uint8Array(await b.arrayBuffer());
  let s = '';
  for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
  return 'data:' + (b.type || 'image/png') + ';base64,' + btoa(s);
}
