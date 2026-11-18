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
function loadGame(htmlPath, { storage = memoryStorage(), embedded = null, exportNames = [] } = {}) {
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
  const sandbox = { document, localStorage: storage, window: { scrollTo() {} }, confirm: () => true };
  const exportLine = ';return {' + exportNames.map(n => n + ':typeof ' + n + "==='undefined'?undefined:" + n).join(',') + '};';
  // eslint-disable-next-line no-new-func
  const run = new Function(...Object.keys(sandbox), code + exportLine);
  const api = run(...Object.values(sandbox));
  return { api, storage, elements, html };
}

module.exports = { loadGame, memoryStorage };
