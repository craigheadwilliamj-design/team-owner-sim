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
const v2Save = fs.readFileSync(path.join(FIX, 'v2-save.json'), 'utf8');
const v3Save = fs.readFileSync(path.join(FIX, 'v3-save.json'), 'utf8');
const NAMES = ['save', 'saveMessage', 'storageKey', 'newSave', 'playWeek', 'upgrade', 'validateSave', 'readSaveFile',
  'embeddableJson', 'tradeQuote', 'counterTrade', 'resolveOffer', 'ownedPicks', 'pickKey', 'describeEvent',
  'rosterView', 'ownershipDesk', 'cur', 'clubs', 'SCHEMA_VERSION',
  'authorizeVisit', 'cancelVisit', 'commissionStudy', 'stadiumView', 'ownershipDesk', 'siteById', 'officialById',
  'fundProject', 'declineProject', 'startNaming', 'approveNaming', 'declineNaming', 'financesView', 'setLossPolicy', 'injuryFactor', 'payroll',
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
  assert.equal(storage.getItem('cgl.save.default.before-v' + api.SCHEMA_VERSION), v1Save);
  assert.equal(storage.getItem('cgl.regular-season.v1.default'), v1Save, 'old key left untouched');
  assert.equal(JSON.parse(storage.getItem('cgl.save.default')).schemaVersion, api.SCHEMA_VERSION);
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
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
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



// ---- Stadium talks ---------------------------------------------------------
const owned = (seed = 11, club = 'club-06') => { const { api } = load(); const S = api.newSave(seed); S.club = club; return { api, S }; };
const plan = (o = {}) => ({ who: 'president', discretion: 'quiet', ask: 'publicMoney', signal: 'serious', ...o });

test('v2 save upgrades with markets, sites and leases, and nothing else changes', () => {
  const { api } = load();
  const old = JSON.parse(v2Save);
  const S = api.upgrade(old).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  assert.equal(S.world.markets.length, 8);
  assert.equal(S.world.sites.length, 16);
  assert.equal(Object.keys(S.world.leases).length, 32);
  assert(S.world.sites.every(x => x.expiresWeek > old.seasons[0].completed), 'deadlines start after the current week');
  for (const k of ['saveId', 'club', 'seasons', 'rosters', 'picks', 'events', 'revision']) assert.deepEqual(S[k], old[k], k);
});

test('v2 browser save upgrades on boot and keeps a backup', () => {
  const storage = memoryStorage({ 'cgl.save.default': v2Save });
  const { api } = load({ storage });
  assert.match(api.saveMessage, new RegExp('from format v2 to v' + api.SCHEMA_VERSION));
  assert.equal(storage.getItem('cgl.save.default.before-v' + api.SCHEMA_VERSION), v2Save);
  assert.equal(api.save.club, 'club-06');
});

test('compare two sites, authorize a visit, advance, and get a report that follows the instructions', () => {
  const { api, S } = owned();
  const site = S.world.sites.find(x => x.kind === 'edge');
  const offer = site.publicOffer;
  assert.equal(api.authorizeVisit(S, site.id, plan({ who: 'both', ask: 'publicMoney', signal: 'serious' })), 'ok');
  assert.equal(api.authorizeVisit(S, S.world.sites[0].id, plan()), 'busy', 'one visit a week');
  api.playWeek(S);
  const e = S.events.at(-1);
  assert.equal(e.type, 'visitReport');
  const text = api.describeEvent(e);
  assert.match(text, /together/);
  assert.match(text, /serious about moving/);
  assert.match(text, /kept it quiet/);
  assert(site.publicOffer > offer, 'serious ask for public money raises the offer');
  assert.match(text, new RegExp('\\$' + offer + 'M to \\$' + site.publicOffer + 'M'));
  const fact = S.stadium.knowledge[0];
  assert.deepEqual(fact.knownBy.slice(0, 3), ['owner', 'president', site.sponsor]);
});

test('each priority changes what the visit gets', () => {
  const run = ask => { const { api, S } = owned(21); const site = S.world.sites[2]; const before = { ...site }; api.authorizeVisit(S, site.id, plan({ ask })); api.playWeek(S); return { before, site, e: S.events.at(-1) }; };
  const d = run('deadline'); assert(d.site.expiresWeek > d.before.expiresWeek);
  const l = run('landTerms'); assert(l.site.parking > l.before.parking);
  const h = run('listen'); assert(h.site.infraKnown); assert.equal(h.e.revealed.infra, h.site.infraTrue);
});

test('quiet visits by the president rarely leak; open visits with the owner usually do', () => {
  const leaks = p => { let n = 0; for (let seed = 1; seed <= 200; seed++) { const { api, S } = owned(seed); api.authorizeVisit(S, S.world.sites[0].id, plan(p)); api.playWeek(S); if (S.events.find(e => e.type === 'visitReport').leaked) n++; } return n / 200; };
  const quiet = leaks({ who: 'president', discretion: 'quiet' }), loud = leaks({ who: 'owner', discretion: 'open' });
  console.log(`      leak rate · quiet president ${(quiet * 100).toFixed(0)}% · open owner ${(loud * 100).toFixed(0)}%`);
  assert(quiet < 0.15 && loud > 0.5);
});

test('a leak tells the press and the home city, and lowers home mood', () => {
  for (let seed = 1; seed < 50; seed++) {
    const { api, S } = owned(seed);
    api.authorizeVisit(S, S.world.sites[0].id, plan({ who: 'owner', discretion: 'open' }));
    api.playWeek(S);
    const e = S.events.find(x => x.type === 'visitReport');
    if (!e.leaked) continue;
    assert(S.stadium.knowledge[0].knownBy.includes('press') && S.stadium.knowledge[0].knownBy.includes('home'));
    assert(S.stadium.homeAware && S.stadium.homeMood < 60);
    assert.match(api.describeEvent(e), /Cincinnati papers/);
    return;
  }
  assert.fail('no leak in 50 seeds');
});

test('a feasibility study reports true costs after two weeks', () => {
  const { api, S } = owned(5);
  const site = S.world.sites.find(x => x.issue) ?? S.world.sites[0];
  assert.equal(api.commissionStudy(S, site.id), 'ok');
  api.playWeek(S);
  assert(!site.infraKnown);
  api.playWeek(S);
  assert(site.infraKnown && site.issueKnown);
  const e = S.events.find(x => x.type === 'studyReport');
  assert.equal(e.infra, site.infraTrue);
  if (site.issue) assert.match(api.describeEvent(e), new RegExp(site.issue.text));
});

test('offers expire on schedule, and the owner hears about ones they touched', () => {
  const { api, S } = owned(8);
  const site = S.world.sites.slice().sort((a, b) => a.expiresWeek - b.expiresWeek)[0];
  api.commissionStudy(S, site.id);
  while (api.cur(S).completed < site.expiresWeek) api.playWeek(S);
  assert.equal(site.status, 'expired');
  assert(S.events.some(e => e.type === 'siteExpired' && e.siteId === site.id));
  assert.equal(api.authorizeVisit(S, site.id, plan()), 'unavailable');
});

test('cancelling a planned visit leaves no trace in who knows', () => {
  const { api, S } = owned();
  api.authorizeVisit(S, S.world.sites[1].id, plan());
  api.cancelVisit(S);
  assert.equal(S.stadium.knowledge.length, 0);
  assert.equal(S.stadium.visits.length, 0);
});

test('stadium pages render, with hostile official names escaped', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  S.world.markets[0].officials[0].name = '<b>Boss</b> "Hogg"';
  api.authorizeVisit(S, S.world.sites[0].id, plan());
  const html = api.stadiumView() + api.ownershipDesk();
  assert(!html.includes('<b>Boss'));
  assert(html.includes('Compare sites') && html.includes('Who knows') && html.includes('Visit to San Antonio this week'));
});


// ---- Money and authority ---------------------------------------------------
const mandate = (o = {}) => ({ minAnnual: 6, maxYears: 25, exclude: [], authority: 'sign', ...o });
const playAll = (api, S) => { while (api.cur(S).completed < api.cur(S).weeks.length) api.playWeek(S); };

test('v3 save upgrades to v4 with finances, and stadium talks survive', () => {
  const { api } = load();
  const old = JSON.parse(v3Save);
  const S = api.upgrade(old).save;
  assert.equal(S.schemaVersion, 4);
  assert.deepEqual(S.stadium, old.stadium);
  assert.deepEqual(S.world, old.world);
  assert.equal(S.finance.ledger.length, 0);
  assert(S.finance.projects.every(p => p.status === 'proposed'));
  api.playWeek(S);
  assert.equal(S.finance.ledger.length, 1, 'reports start with the next played week');
});

test('every week posts an operating report, and the books balance', () => {
  const { api, S } = owned(31);
  const start = { club: S.finance.clubCash, owner: S.finance.ownerCash };
  playAll(api, S);
  const F = S.finance;
  assert.equal(F.ledger.length, 18);
  const result = F.ledger.reduce((a, x) => a + x.result, 0), income = F.ledger.reduce((a, x) => a + x.ownerIncome, 0);
  const borrowed = F.ledger.reduce((a, x) => a + x.borrowed, 0);
  assert(Math.abs(start.club + result + borrowed - F.clubCash) < 0.05, 'club cash = start + results + shortfall borrowing');
  assert(Math.abs(start.owner + income - F.ownerCash) < 0.05, 'owner cash = start + distributions');
  const homeWeeks = F.ledger.filter(x => x.lines.tickets > 0).length;
  assert(homeWeeks >= 8 && homeWeeks <= 9);
  for (const x of F.ledger) for (const v of Object.values(x.lines)) assert(Number.isFinite(v));
  console.log(`      season result ${result.toFixed(1)}M · receipts ${F.ledger.reduce((a, x) => a + Object.values(x.lines).filter(v => v > 0).reduce((p, v) => p + v, 0), 0).toFixed(0)}M`);
});

test('funding a project: club account, borrowing, or the owner personally', () => {
  const { api, S } = owned(32);
  const F = S.finance;
  F.clubCash = 50;
  assert.equal(api.fundProject(S, 'plane', 'club'), 'clubShort');
  const owner = F.ownerCash;
  assert.equal(api.fundProject(S, 'plane', 'owner'), 'ok');
  assert.equal(F.ownerCash, Math.round((owner - 85) * 100) / 100);
  assert.equal(F.contributions.capital, 85);
  const fact = S.stadium.knowledge.at(-1);
  assert.equal(fact.kind, 'ownerFunding');
  assert(fact.knownBy.includes('league'), 'the league finance committee knows the owner paid');
  const debt = F.debt;
  assert.equal(api.fundProject(S, 'upgrade', 'debt'), 'ok');
  assert.equal(F.debt, debt + 60);
  F.debt = 440;
  assert.equal(api.fundProject(S, 'facility', 'debt'), 'debtLimit');
  api.declineProject(S, 'facility');
  assert.equal(F.projects.find(p => p.id === 'facility').status, 'declined');
});

test('projects take effect when built: the plane cuts travel and injuries', () => {
  const { api, S } = owned(33);
  const before = api.injuryFactor(S);
  api.fundProject(S, 'plane', 'owner');
  for (let i = 0; i < 3; i++) api.playWeek(S);
  assert.equal(S.finance.projects.find(p => p.id === 'plane').status, 'building');
  api.playWeek(S);
  assert.equal(S.finance.projects.find(p => p.id === 'plane').status, 'active');
  assert(S.events.some(e => e.type === 'projectDone'));
  api.playWeek(S);
  const last = S.finance.ledger.at(-1).lines;
  assert.equal(last.travel, -Math.round(3 / 18 * 100) / 100);
  assert(api.injuryFactor(S) < before);
});

test('loss policy: borrow by default, or the owner covers the shortfall', () => {
  for (const policy of ['borrow', 'owner']) {
    const { api, S } = owned(34);
    api.setLossPolicy(S, policy);
    let week; for (week = 0; week < 18; week++) { S.finance.clubCash = 0; api.playWeek(S); if (S.finance.ledger.at(-1).result < 0) break; }
    const x = S.finance.ledger.at(-1);
    assert(x.result < 0, 'found a losing week');
    if (policy === 'borrow') assert(x.borrowed > 0 && x.ownerOperating === 0);
    else assert(x.ownerOperating > 0 && S.finance.contributions.operating > 0);
  }
});

test('trades change payroll', () => {
  const { api, S } = owned(35);
  const before = api.payroll(S, 'club-06');
  const qb = S.rosters['club-32'].filter(p => p.pos === 'QB').sort((a, b) => b.rating - a.rating)[0];
  const ours = S.rosters['club-06'].filter(p => p.pos === 'QB').sort((a, b) => a.rating - b.rating)[0];
  S.rosters['club-06'].push(qb); S.rosters['club-32'].splice(S.rosters['club-32'].indexOf(qb), 1);
  S.rosters['club-06'].splice(S.rosters['club-06'].indexOf(ours), 1); S.rosters['club-32'].push(ours);
  assert(api.payroll(S, 'club-06') > before);
});

test('delegated naming rights: the president signs within the mandate without asking', () => {
  const { api, S } = owned(36);
  const old = S.world.leases['club-06'].stadium;
  assert.equal(api.startNaming(S, mandate({ authority: 'sign' })), 'ok');
  api.playWeek(S);
  assert.equal(S.finance.naming.status, 'signed');
  const d = S.finance.naming.deal;
  assert(d.delegated && d.annual >= 6 && d.years <= 25);
  assert.equal(S.world.leases['club-06'].stadium, d.newName);
  assert.match(api.describeEvent(S.events.find(e => e.type === 'namingSigned')), new RegExp('Inside your terms.*' + old + ' becomes'));
  api.playWeek(S);
  assert.equal(S.finance.ledger.at(-1).lines.namingRights, Math.round(d.annual / 18 * 100) / 100);
  const fact = S.stadium.knowledge.find(f => f.kind === 'namingTalks');
  assert(fact.knownBy.includes('press'), 'a signed deal is public');
});

test('report-first mandate brings the offer to the owner, who can sign or decline', () => {
  const { api, S } = owned(37);
  api.startNaming(S, mandate({ authority: 'report' }));
  api.playWeek(S);
  assert.equal(S.finance.naming.status, 'awaiting');
  assert.equal(S.finance.naming.outside, false);
  api.approveNaming(S);
  assert.equal(S.finance.naming.status, 'signed');
  assert.equal(S.finance.naming.deal.delegated, false);
});

test('an impossible mandate comes back after three rounds with the best offer and the reason', () => {
  const { api, S } = owned(38);
  api.startNaming(S, mandate({ minAnnual: 60, authority: 'sign' }));
  api.playWeek(S); api.playWeek(S);
  assert.equal(S.finance.naming.status, 'negotiating');
  api.playWeek(S);
  const N = S.finance.naming;
  assert.equal(N.status, 'awaiting');
  assert(N.outside);
  assert.match(N.offer.reason, /below your \$60M floor/);
  assert.match(api.describeEvent(S.events.at(-1)), /nobody met your terms/);
  api.playWeek(S); api.playWeek(S);
  assert.equal(S.finance.naming.status, 'none', 'unanswered offers lapse');
});

test('excluded categories are never signed', () => {
  for (let seed = 40; seed < 70; seed++) {
    const { api, S } = owned(seed);
    const all = Object.keys({ bank: 1, insurance: 1, airline: 1, telecom: 1, sportsbook: 1, crypto: 1, energy: 1, grocery: 1 });
    api.startNaming(S, mandate({ exclude: ['sportsbook', 'crypto'] }));
    for (let i = 0; i < 3; i++) api.playWeek(S);
    const N = S.finance.naming;
    if (N.status === 'signed') assert(!['sportsbook', 'crypto'].includes(N.deal.category));
    if (N.status === 'awaiting' && N.outside && ['sportsbook', 'crypto'].includes(N.offer.category)) assert.match(N.offer.reason, /ruled out/);
    assert(all.length === 8);
  }
});

test('finances page renders every state without raw markup', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  let html = api.financesView();
  assert(html.includes('Operating report') && html.includes('Funding decisions') && html.includes('Naming rights'));
  api.startNaming(S, mandate({ minAnnual: 60 }));
  for (let i = 0; i < 3; i++) api.playWeek(S);
  html = api.financesView() + api.ownershipDesk();
  assert(html.includes('Sign the deal') && html.includes('Needs your decision'));
  assert(!/<script|onerror/i.test(html));
});

// ---- Save files ------------------------------------------------------------
test('season files load as JSON, and old cgl-week HTML copies still load', () => {
  const { api } = load();
  const S = api.newSave(5);
  assert.equal(api.readSaveFile(JSON.stringify(S)).saveId, S.saveId);
  assert.equal(api.readSaveFile(v1Copy).schemaVersion, api.SCHEMA_VERSION);
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
