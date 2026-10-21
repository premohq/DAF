/* DAF Helper: drives the Gemini page in the add-on's own pinned tab for Dante's Ad Forge.
   Attach the photo, type the prompt, press Send, wait for the answer, hand back the image (or the text).
   Gemini's page changes now and then, so each step tries a few ways before giving up. */
(() => {
if (window.__dafGemini) return;
window.__dafGemini = true;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const all = (sel, root) => Array.from((root || document).querySelectorAll(sel));
const shown = el => !!el && el.isConnected && el.getClientRects().length > 0;
const norm = s => String(s || '').replace(/\s+/g, ' ').trim();
const fail = (code, message) => Object.assign(new Error(message), {code});
async function until(fn, ms, step) {
  const end = Date.now() + ms;
  for (;;) {
    let v = null;
    try { v = fn() } catch (e) {}
    if (v) return v;
    if (Date.now() > end) return null;
    await sleep(step || 250);
  }
}

/* ---------- finding things ---------- */
const EDITOR = ['rich-textarea .ql-editor[contenteditable="true"]', '.ql-editor[contenteditable="true"]',
  'div[contenteditable="true"][role="textbox"]', 'div[contenteditable="true"][aria-label]', 'main textarea', 'textarea'];
function editor() {
  for (const s of EDITOR) { const el = all(s).find(shown); if (el) return el }
  return null;
}
const iconButtons = name => all('mat-icon[fonticon="' + name + '"], mat-icon[data-mat-icon-name="' + name + '"]').map(i => i.closest('button'));
function nearEditor(list) { /* the candidate that shares the smallest box with the prompt field */
  list = [...new Set(list)].filter(b => b && shown(b));
  const ed = editor();
  if (!ed || list.length < 2) return list[0] || null;
  for (let n = ed.parentElement; n; n = n.parentElement) { const b = list.find(x => n.contains(x)); if (b) return b }
  return list[0];
}
function sendButton() {
  return nearEditor(all('button.send-button, button[aria-label*="Send" i], button[data-test-id*="send" i], .send-button-container button')
    .concat(iconButtons('send')).filter(b => b && !/feedback|share|stop/i.test(b.getAttribute('aria-label') || '')));
}
function stopButton() {
  return nearEditor(all('button[aria-label*="Stop" i], button.stop, button[data-test-id*="stop" i]').concat(iconButtons('stop')));
}
const ready = b => !!b && !b.disabled && b.getAttribute('aria-disabled') !== 'true';
function composer() { /* the box that holds the prompt field and the Send button */
  const ed = editor(), s = sendButton();
  if (!ed) return null;
  for (let n = ed.parentElement; n; n = n.parentElement) if (s && n.contains(s)) return n;
  return ed.parentElement;
}
function signedOut() {
  return !!all('a[href*="accounts.google.com/ServiceLogin"], a[href*="accounts.google.com/v3/signin"], a[href*="accounts.google.com/signin"]').find(shown);
}
function responses() {
  for (const s of ['model-response', '[data-test-id*="model-response"]', '.model-response-container', '[class*="model-response"]']) {
    const r = all(s);
    if (r.length) return r;
  }
  return [];
}
const turns = () => all('user-query, [data-test-id*="user-query"], .user-query-container').length;

/* ---------- 1. attach the photo ---------- */
function toFile(img, i) {
  const [head, b64] = String(img.data).split(',');
  const type = (/data:([^;,]+)/.exec(head) || [])[1] || img.type || 'image/jpeg';
  const bin = atob(b64), u = new Uint8Array(bin.length);
  for (let k = 0; k < bin.length; k++) u[k] = bin.charCodeAt(k);
  return new File([u], img.name || 'bottle-' + (i + 1) + (type === 'image/png' ? '.png' : '.jpg'), {type, lastModified: Date.now()});
}
function attached() { /* thumbnails, file chips and remove buttons near the prompt field */
  const box = composer() || document.body;
  return all('img, [aria-label*="Remove" i], [class*="preview"], [class*="attachment"], [data-test-id*="file"]', box).length +
    all('img[src^="blob:"], img[src^="data:"]').filter(i => !i.closest('user-query, model-response')).length;
}
async function attach(files) {
  /* it worked when a thumbnail shows up, or when Send wakes up with nothing typed yet */
  const ed = editor(), box = composer() || document.body, before = attached(), sendBefore = ready(sendButton());
  const took = () => attached() > before || (!sendBefore && ready(sendButton()));
  const dt = () => { const d = new DataTransfer(); files.forEach(f => d.items.add(f)); return d };
  ed.focus();
  ed.dispatchEvent(new ClipboardEvent('paste', {clipboardData: dt(), bubbles: true, cancelable: true}));
  if (await until(took, 5000)) return;
  const zones = [all('input-area-v2, [class*="input-area"], [class*="drop-zone"], [class*="dropzone"]').find(shown), box, ed, document.body];
  for (const z of [...new Set(zones)].filter(Boolean)) {
    const d = dt();
    for (const type of ['dragenter', 'dragover', 'drop']) z.dispatchEvent(new DragEvent(type, {dataTransfer: d, bubbles: true, cancelable: true}));
    if (await until(took, 4000)) return;
  }
  const input = all('input[type="file"]').find(i => !i.disabled);
  if (input) {
    input.files = dt().files;
    input.dispatchEvent(new Event('input', {bubbles: true}));
    input.dispatchEvent(new Event('change', {bubbles: true}));
    if (await until(took, 5000)) return;
  }
  throw fail('attach', 'Gemini would not take the photo. Press “Open the Gemini tab” to check that it works there.');
}

/* ---------- 2. type the prompt ---------- */
const typed = t => { const ed = editor(); return !!ed && norm(ed.tagName === 'TEXTAREA' ? ed.value : ed.innerText).includes(norm(t).slice(0, 60)) };
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
async function type(text) {
  const ed = editor();
  ed.focus();
  if (ed.tagName === 'TEXTAREA') {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(ed, text);
    ed.dispatchEvent(new Event('input', {bubbles: true}));
  } else {
    const sel = getSelection(), r = document.createRange();
    r.selectNodeContents(ed); sel.removeAllRanges(); sel.addRange(r);
    try { document.execCommand('insertText', false, text) } catch (e) {}
    await sleep(250);
    if (!typed(text)) { /* the editor rebuilds itself from its own markup */
      ed.innerHTML = text.split('\n').map(l => '<p>' + (l ? esc(l) : '<br>') + '</p>').join('');
      ed.dispatchEvent(new InputEvent('input', {bubbles: true, inputType: 'insertText', data: text}));
    }
  }
  if (!await until(() => typed(text), 3000)) throw fail('type', 'Could not type the prompt into Gemini.');
}

/* ---------- 3. send ---------- */
function uploading() {
  const c = composer();
  return !!c && !!all('mat-progress-spinner, mat-spinner, [role="progressbar"], [class*="spinner"], [class*="uploading"]', c).find(shown);
}
async function send(text) {
  await sleep(600);
  const btn = await until(() => { const b = sendButton(); return ready(b) && !uploading() ? b : null }, 120000, 500);
  if (!btn) throw fail('send', 'Gemini’s Send button never became ready. The photo may still be uploading; press “Open the Gemini tab” to look.');
  const t0 = turns(), sent = () => turns() > t0 || !!stopButton() || !typed(text);
  btn.click();
  if (await until(sent, 8000)) return;
  const ed = editor();
  if (ed) {
    ed.focus();
    for (const type of ['keydown', 'keypress', 'keyup'])
      ed.dispatchEvent(new KeyboardEvent(type, {key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true}));
  }
  if (await until(sent, 8000)) return;
  throw fail('send', 'Gemini did not send the message. Press “Open the Gemini tab” and press Send there.');
}

/* ---------- 4. wait for the answer ---------- */
function pictures(root, skip) {
  const pref = all('generated-image img, single-image img, [class*="generated-image"] img', root);
  return (pref.length ? pref : all('img', root)).filter(im => {
    const s = im.currentSrc || im.src || '';
    if (!/^(https?:|blob:|data:image\/(png|jpe?g|webp))/.test(s) || (skip && skip.has(s))) return false;
    if (im.closest('user-query, [data-test-id*="user-query"], .user-query-container, rich-textarea')) return false;
    const w = im.naturalWidth || 0, h = im.naturalHeight || 0, box = im.getBoundingClientRect();
    if (w && h && Math.max(w, h) < 200) return false;
    if (!w && box.width && box.width < 120) return false;
    return true;
  });
}
function drawing(root) { /* spinners or shimmering placeholders still in the answer */
  return !!all('mat-progress-spinner, mat-spinner, [role="progressbar"], [class*="loading"], [class*="shimmer"], [class*="skeleton"]', root).find(shown);
}
async function answer(op, before, skip, port) {
  const t0 = Date.now();
  let sig = '', calm = 0, changed = Date.now(), woke = false;
  const mo = new MutationObserver(() => { changed = Date.now() });
  mo.observe(document.body, {subtree: true, childList: true, characterData: true, attributes: true});
  try {
    for (;;) {
      await sleep(1000);
      const rs = responses(), r = rs.length > before ? rs[rs.length - 1] : null;
      const root = r || (rs.length ? null : document.querySelector('main') || document.body);
      const busy = !!stopButton(), pics = root ? pictures(root, skip) : [], text = r ? norm(r.innerText) : '';
      const now = pics.map(p => p.currentSrc || p.src).join(' ') + '|' + text.length + '|' + busy;
      calm = now === sig ? calm + 1 : 0;
      sig = now;
      const secs = Math.round((Date.now() - t0) / 1000);
      port.postMessage({kind: 'progress', step: 'wait', secs, text: op === 'image'
        ? (pics.length ? 'Gemini is finishing the image…' : 'Gemini is making the image… ' + secs + 's')
        : 'Gemini is reading the label… ' + secs + 's'});
      if (!busy && root) {
        if (op === 'image' && pics.length && calm >= 2) return {pics, text};
        if (op === 'image' && !pics.length && r && text && calm >= 8 && !drawing(r)) return {pics, text};
        if (op === 'ask' && text && calm >= 2) return {pics: [], text};
      }
      if (!woke && Date.now() - changed > 45000) { woke = true; port.postMessage({kind: 'wake'}) }
      if (Date.now() - t0 > 330000) throw fail('timeout', 'Gemini took more than 5 minutes. Press “Open the Gemini tab” to see what happened.');
    }
  } finally { mo.disconnect() }
}
function readData(blob) {
  return new Promise((res, rej) => { const f = new FileReader(); f.onload = () => res(f.result); f.onerror = rej; f.readAsDataURL(blob) });
}
async function handOff(pics) {
  const out = [];
  for (const im of pics) {
    const src = im.currentSrc || im.src, info = {src, w: im.naturalWidth || 0, h: im.naturalHeight || 0};
    if (/^(blob:|data:)/.test(src)) {
      try { info.data = await readData(await (await fetch(src)).blob()) } catch (e) {
        try {
          const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
          c.getContext('2d').drawImage(im, 0, 0); info.data = c.toDataURL('image/png');
        } catch (e2) {}
      }
    }
    out.push(info);
  }
  return out;
}

/* ---------- the job ---------- */
async function run(m, port) {
  const say = (step, text) => port.postMessage({kind: 'progress', step, text});
  say('page', 'Waiting for Gemini to load…');
  if (await until(() => editor() ? 'in' : signedOut() ? 'out' : null, 30000, 300) !== 'in' || signedOut())
    throw fail('signin', 'Gemini wants you to sign in. Press “Open the Gemini tab”, sign in to your Google account, then try again.');
  await sleep(800);
  const files = (m.images || []).map(toFile);
  if (files.length) { say('attach', 'Attaching your photo…'); await attach(files) }
  say('type', 'Typing the prompt…');
  await type(m.prompt);
  const before = responses().length, skip = new Set(all('img').map(i => i.currentSrc || i.src));
  say('send', files.length ? 'Uploading the photo and sending…' : 'Sending…');
  await send(m.prompt);
  const a = await answer(m.op, before, skip, port);
  if (m.op !== 'image') return {images: [], text: a.text};
  return {images: await handOff(a.pics), text: a.text};
}

/* the add-on's own download failed: try from the page, which has Gemini's cookies */
async function grabHere(src) {
  const im = all('img').find(i => (i.currentSrc || i.src) === src);
  try {
    const r = await fetch(src, {credentials: 'include'});
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const b = await r.blob();
    if (!/^image\//.test(b.type)) throw new Error('not an image');
    return {src, data: await readData(b), w: im ? im.naturalWidth : 0, h: im ? im.naturalHeight : 0};
  } catch (e) {
    if (im && im.complete && im.naturalWidth) try { /* only works when the server allows it */
      const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
      c.getContext('2d').drawImage(im, 0, 0);
      return {src, data: c.toDataURL('image/png'), w: c.width, h: c.height};
    } catch (e2) {}
    return {src, error: e.message};
  }
}

chrome.runtime.onConnect.addListener(port => {
  if (port.name !== 'daf-run') return;
  port.onMessage.addListener(async m => {
    if (m.kind === 'grab') { const r = await grabHere(m.src); try { port.postMessage(Object.assign({kind: 'grabbed'}, r)) } catch (e) {} return }
    if (m.kind !== 'run') return;
    try { port.postMessage(Object.assign({kind: 'result'}, await run(m, port))) }
    catch (e) { try { port.postMessage({kind: 'error', code: e.code || 'error', message: e.message || String(e)}) } catch (e2) {} }
  });
});
})();
