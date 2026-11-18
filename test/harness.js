// Loads a season-desk HTML build in Node with a stub DOM and in-memory storage,
// and returns the script's internal functions for testing.
'use strict';
const fs = require('fs');

function stubElement() {
  const target = {};
  return new Proxy(target, {
    get(t, k) {
      if (k in t) return t[k];
      if (k === 'textContent' || k === 'innerHTML') return '';
      if (k === 'value') return 'All';
      if (k === 'dataset' || k === 'style') return (t[k] = {});
      if (typeof k === 'string') return () => stubElement();
      return undefined;
    },
    set(t, k, v) { t[k] = v; return true; },
  });
}

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: k => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => { data.set(k, String(v)); },
    removeItem: k => { data.delete(k); },
  };
}

// exportNames: identifiers to expose from the page script's scope.
function loadGame(htmlPath, { storage = memoryStorage(), embedded = null, exportNames = [], window: windowExtras = {} } = {}) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const seed = html.match(/<script id="seed"[^>]*>([\s\S]*?)<\/script>/)[1];
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  const code = scripts[scripts.length - 1][1];
  const elements = new Map();
  const document = {
    querySelector(sel) {
      if (sel === '#seed') return { textContent: seed };
      if (sel === '#initialSeason') return { textContent: embedded ?? 'null' };
      if (!elements.has(sel)) elements.set(sel, stubElement());
      return elements.get(sel);
    },
    createElement: () => stubElement(),
    addEventListener() {},
    documentElement: stubElement(),
  };
  const sandbox = { document, localStorage: storage, window: { scrollTo() {}, ...windowExtras }, confirm: () => false };
  // A name exports that binding; "key:expression" exports an expression (use a function for live values).
  const exportLine = ';return {' + exportNames.map(n => n.includes(':') ? n : n + ':typeof ' + n + "==='undefined'?undefined:" + n).join(',') + '};';
  // eslint-disable-next-line no-new-func
  const run = new Function(...Object.keys(sandbox), code + exportLine);
  const api = run(...Object.values(sandbox));
  return { api, storage, elements, html };
}

// In-memory stand-in for the db and user capabilities, enforcing the 256 KiB document limit.
function fakeClaude(store = new Map(), userId = 'viewer-1') {
  const doc = path => ({
    get: async () => { const d = store.get(path); return { exists: d !== undefined, data: () => (d === undefined ? undefined : JSON.parse(d)) }; },
    set: async data => { const text = JSON.stringify(data); if (Buffer.byteLength(text) > 262144) throw { code: 'invalid_argument' }; store.set(path, text); },
    delete: async () => { store.delete(path); },
  });
  const db = { collection: p => ({ doc: id => doc(p + '/' + id) }) };
  return { store, claude: { use: async name => (name === 'db' ? db : name === 'user' ? { id: async () => userId } : null) } };
}

module.exports = { loadGame, memoryStorage, fakeClaude };
