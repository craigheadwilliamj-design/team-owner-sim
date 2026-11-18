// Headless tests for season-desk.html. Run: node test/run.js
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const { loadGame, memoryStorage } = require('./harness');

const GAME = path.join(__dirname, '..', 'season-desk.html');
const FIX = path.join(__dirname, 'fixtures');
const v1Save = fs.readFileSync(path.join(FIX, 'v1-save.json'), 'utf8');
const v1Copy = fs.readFileSync(path.join(FIX, 'v1-copy.html'), 'utf8');
const NAMES = ['save', 'saveMessage', 'storageKey', 'newSave', 'playWeek', 'upgrade', 'validateSave', 'readSaveFile',
  'embeddableJson', 'tradeQuote', 'counterTrade', 'resolveOffer', 'ownedPicks', 'pickKey', 'describeEvent',
  'rosterView', 'ownershipDesk', 'cur', 'clubs', 'SCHEMA_VERSION',
  'live:()=>({save,saveMessage})'];
const load = opts => loadGame(GAME, { exportNames: NAMES, ...opts });
const playSeason = (api, S) => { while (api.cur(S).completed < api.cur(S).weeks.length) api.playWeek(S); return S; };

const tests = [];
const test = (name, fn) => tests.push([name, fn]);

// ---- 1. Save wrapper, migrations, validation on every load ----------------
test('a new save validates', () => {
  const { api } = load();
  assert.deepEqual(api.validateSave(api.save), []);
  assert.equal(api.save.schemaVersion, api.SCHEMA_VERSION);
});

test('schedule: 17 games per club, nobody twice in a week, division home and away', () => {
  const { api } = load();
  for (let n = 0; n < 50; n++) {
    const s = api.cur(api.newSave());
    const count = {}, division = {};
    for (const week of s.weeks) {
      const seen = new Set();
      for (const g of week) {
        for (const id of [g.home, g.away]) { assert(!seen.has(id)); seen.add(id); count[id] = (count[id] || 0) + 1; }
        const [h, a] = [g.home, g.away].map(id => api.clubs.find(t => t.id === id));
        if (h.conference === a.conference && h.division === a.division) division[g.home + '>' + g.away] = true;
      }
    }
    assert(Object.values(count).every(c => c === 17));
    assert.equal(Object.keys(division).length, 8 * 12); // each ordered pair inside each division, once
  }
});

test('v1 browser save migrates on boot, keeps progress, and keeps a backup', () => {
  const storage = memoryStorage({ 'cgl.regular-season.v1.default': v1Save });
  const { api } = load({ storage });
  const old = JSON.parse(v1Save);
  assert.match(api.saveMessage, /Upgraded this browser save from format v1/);
  assert.equal(api.save.club, old.office.club);
  assert.equal(api.cur().completed, old.completed);
  assert.deepEqual(api.cur().weeks, old.weeks);
  assert.equal(storage.getItem('cgl.save.default.before-v2'), v1Save);
  assert.equal(storage.getItem('cgl.regular-season.v1.default'), v1Save, 'old key left untouched');
  assert.equal(JSON.parse(storage.getItem('cgl.save.default')).schemaVersion, 2);
  assert.equal(api.save.offer.status, 'opening', 'open quote carried over');
});

test('second boot reads the migrated save, not the legacy key', () => {
  const storage = memoryStorage({ 'cgl.regular-season.v1.default': v1Save });
  const first = load({ storage }).api;
  const s = first.save;
  first.playWeek(s);
  storage.setItem('cgl.save.default', JSON.stringify(s));
  const second = load({ storage }).api;
  assert.equal(second.cur().completed, JSON.parse(v1Save).completed + 1);
  assert.equal(second.saveMessage, 'Saved in this browser.');
});

test('v1 staff sentences become structured events and read the same', () => {
  const { api } = load();
  const S = api.upgrade(JSON.parse(v1Save)).save;
  const old = JSON.parse(v1Save).office.notes;
  assert.equal(S.events.length, old.length);
  assert(S.events.every(e => e.type !== 'legacy'), 'every v1 sentence parsed');
  const trades = S.events.filter(e => e.type === 'trade');
  assert.equal(trades.length, 3);
  const swap = trades.find(e => e.outgoing);
  assert.equal(swap.seller, 'club-21');
  assert.equal(swap.pick.round, 2);
  assert(swap.incoming.id, 'incoming player linked to a roster id');
  // Newest-first notes map to oldest-first events with identical wording
  // (the hand-added pre-labelling note gains a position label).
  const rendered = [...S.events].reverse().map(api.describeEvent);
  old.forEach((n, i) => {
    if (/^Acquired [A-Z][a-z]/.test(n.text)) assert.match(rendered[i], /^Acquired [A-Z]+ /);
    else assert.equal(rendered[i], n.text);
  });
});

test('v1 downloaded season copy imports through Load save', () => {
  const { api } = load();
  const S = api.readSaveFile(v1Copy);
  assert.equal(S.schemaVersion, 2);
  assert.equal(api.cur(S).completed, JSON.parse(v1Save).completed);
});

test('opening a v1 copy file boots it into its own slot', () => {
  const embedded = v1Copy.match(/id="initialSeason"[^>]*>([\s\S]*?)<\/script>/)[1];
  const { api } = load({ embedded });
  const old = JSON.parse(v1Save);
  assert.equal(api.storageKey, 'cgl.save.' + old.saveId + '.' + old.completed);
  assert.equal(api.cur().completed, old.completed);
});

test('every load path validates: corrupt browser save is set aside, not run', () => {
  const bad = JSON.parse(v1Save); bad.weeks[0][0].home = 'club-99';
  const storage = memoryStorage({ 'cgl.save.default': JSON.stringify({ ...load().api.save, seasons: 'nope' }), 'cgl.regular-season.v1.default': JSON.stringify(bad) });
  const { api } = load({ storage });
  assert.match(api.saveMessage, /could not be opened because No seasons are recorded\. It was set aside/);
  assert.match(api.saveMessage, /A new season has started\./);
  assert([...storage.data.keys()].some(k => k.startsWith('cgl.save.default.unreadable-')));
  assert.equal(api.cur().completed, 0);
  assert.throws(() => api.upgrade(bad), /unknown club/);
});

test('saves from a newer build are refused with a clear reason', () => {
  const { api } = load();
  assert.throws(() => api.upgrade({ ...api.save, schemaVersion: 99 }), /newer build/);
  assert.throws(() => api.upgrade({ hello: 1 }), /not a league save/);
});

// ---- 2. Structured events, escaping ---------------------------------------
test('hostile and punctuated names are escaped on render', () => {
  const { api } = load();
  const p = api.save.rosters['club-01'][0]; // rosterView shows the selected club, club-01 on boot
  p.name = '<img src=x onerror=alert(1)> "Guarantees" & Co';
  const html = api.rosterView();
  assert(!html.includes('<img'));
  assert(html.includes('&lt;img src=x onerror=alert(1)&gt; &quot;Guarantees&quot; &amp; Co'));
});

test('season copies survive names containing </script> and quotes', () => {
  const { api } = load();
  const S = api.save;
  S.rosters['club-01'][0].name = 'Bo "The Closer" </script><b>Jones';
  const page = '<html><script id="initialSeason" type="application/json">' + api.embeddableJson(S) + '</script></html>';
  assert.equal(api.readSaveFile(page).rosters['club-01'][0].name, 'Bo "The Closer" </script><b>Jones');
});

test('import still rejects prototype-polluting keys', () => {
  const { api } = load();
  const page = '<script id="initialSeason">{"__proto__":{"x":1}}</script>';
  assert.throws(() => api.readSaveFile(page), /invalid season data/);
});

// ---- 3. Seeded randomness --------------------------------------------------
test('same seed, same season; different seed, different season', () => {
  const { api } = load();
  const a = playSeason(api, api.newSave(12345)), b = playSeason(api, api.newSave(12345)), c = playSeason(api, api.newSave(54321));
  assert.equal(JSON.stringify(a), JSON.stringify(b));
  assert.notEqual(JSON.stringify(a.seasons), JSON.stringify(c.seasons));
});

test('reloading mid-season does not change what happens next', () => {
  const { api } = load();
  const S = api.newSave(777); S.club = 'club-06';
  for (let i = 0; i < 5; i++) api.playWeek(S);
  const reloaded = api.upgrade(JSON.parse(JSON.stringify(S))).save;
  playSeason(api, S); playSeason(api, reloaded);
  assert.equal(JSON.stringify(S), JSON.stringify(reloaded));
});

// ---- 4. Overtime and seller roster needs -----------------------------------
test('ties are rare once overtime exists', () => {
  const { api } = load();
  let games = 0, ties = 0, ot = 0;
  for (let n = 1; n <= 300; n++) {
    for (const g of playSeason(api, api.newSave(n)).seasons[0].weeks.flat()) {
      games++; if (g.ot) ot++; if (g.score[0] === g.score[1]) ties++;
    }
  }
  console.log(`      ${games} games · overtime ${(100 * ot / games).toFixed(1)}% · ties ${(100 * ties / games).toFixed(2)}%`);
  assert(ties / games < 0.01);
});

test('a club will not sell its only kicker for a pick, but will take a kicker back', () => {
  const { api } = load();
  const S = api.newSave(42); S.club = 'club-06';
  const theirK = S.rosters['club-29'].find(p => p.pos === 'K');
  const ourK = S.rosters['club-06'].find(p => p.pos === 'K');
  api.tradeQuote(S, 'club-29', theirK.id);
  assert.equal(S.offer.status, 'needsDepth');
  assert.equal(S.offer.firm, false);
  api.counterTrade(S, 'none', api.pickKey(api.ownedPicks(S)[0]));
  assert.equal(S.offer.status, 'needsDepth', 'a better pick does not change the answer');
  api.counterTrade(S, ourK.id, api.pickKey(api.ownedPicks(S)[0]));
  assert.notEqual(S.offer.status, 'needsDepth');
  assert(S.offer.firm);
  api.resolveOffer(S, true);
  assert.equal(S.rosters['club-29'].filter(p => p.pos === 'K').length, 1);
  assert.equal(S.rosters['club-06'].filter(p => p.pos === 'K')[0].id, theirK.id);
  assert.equal(S.events.at(-1).type, 'trade');
});

test('ordinary depth trades still go through', () => {
  const { api } = load();
  const S = api.newSave(43); S.club = 'club-06';
  const wr = S.rosters['club-32'].filter(p => p.pos === 'WR').sort((a, b) => a.rating - b.rating)[0];
  api.tradeQuote(S, 'club-32', wr.id);
  assert.equal(S.offer.status, 'opening');
  api.resolveOffer(S, true);
  assert(S.rosters['club-06'].some(p => p.id === wr.id));
});


// ---- Save files ------------------------------------------------------------
test('season files load as JSON, and old cgl-week HTML copies still load', () => {
  const { api } = load();
  const S = api.newSave(5);
  assert.equal(api.readSaveFile(JSON.stringify(S)).saveId, S.saveId);
  assert.equal(api.readSaveFile(v1Copy).schemaVersion, 2);
});

test('the page never relies on confirm() or a page-started download', () => {
  const html = fs.readFileSync(GAME, 'utf8');
  assert(!/\bconfirm\(/.test(html));
  assert(!/\.download\s*=/.test(html));
});

let failed = 0;
(async () => {
for (const [name, fn] of tests) {
  try { await fn(); console.log('  ok   ' + name); }
  catch (e) { failed++; console.log('  FAIL ' + name + '\n       ' + String(e.stack || e).split('\n').slice(0, 3).join('\n       ')); }
}
console.log(failed ? `\n${failed} of ${tests.length} failed` : `\nall ${tests.length} passed`);
process.exit(failed ? 1 : 0);
})();
