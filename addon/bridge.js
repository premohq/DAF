/* DAF Helper: the bridge between Dante's Ad Forge (this page) and the add-on.
   The Forge posts {dafHelper:'to-ext', kind, ...}; answers come back as {dafHelper:'from-ext', kind, id, ...}. */
(() => {
  if (window.__dafBridge) return;
  window.__dafBridge = true;
  const version = chrome.runtime.getManifest().version;
  const post = m => window.postMessage(Object.assign({dafHelper: 'from-ext'}, m), '*');
  const jobs = new Map();
  document.documentElement.setAttribute('data-daf-helper', version);

  window.addEventListener('message', e => {
    const m = e.data;
    if (e.source !== window || !m || m.dafHelper !== 'to-ext') return;
    if (m.kind === 'ping') return post({kind: 'hello', version});
    if (m.kind === 'show') {
      try { chrome.runtime.sendMessage({kind: 'show'}, () => void chrome.runtime.lastError) } catch (err) {}
      return;
    }
    if (m.kind === 'cancel') {
      const p = jobs.get(m.id);
      if (p) try { p.postMessage({kind: 'cancel'}) } catch (err) {}
      return;
    }
    if (m.kind !== 'job') return;
    let port, done = false;
    try { port = chrome.runtime.connect({name: 'daf-job'}) } catch (err) {
      return post({kind: 'error', id: m.id, code: 'reload', message: 'The DAF Helper add-on was updated or turned off. Reload this page.'});
    }
    /* a message now and then keeps the add-on awake through long Gemini jobs */
    const beat = setInterval(() => { try { port.postMessage({kind: 'beat'}) } catch (err) {} }, 10000);
    const end = () => { done = true; clearInterval(beat); jobs.delete(m.id) };
    jobs.set(m.id, port);
    port.onMessage.addListener(r => {
      if (r.kind === 'done' || r.kind === 'error') end();
      post(Object.assign({}, r, {id: m.id}));
      if (done) port.disconnect();
    });
    port.onDisconnect.addListener(() => {
      if (!done) post({kind: 'error', id: m.id, code: 'gone', message: 'The DAF Helper add-on stopped before Gemini finished. Try again.'});
      end();
    });
    port.postMessage({kind: 'job', op: m.op, prompt: m.prompt, images: m.images || [], opts: m.opts || {}});
  });
  post({kind: 'hello', version});
})();
