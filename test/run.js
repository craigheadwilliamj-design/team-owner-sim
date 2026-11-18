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
const v4Save = fs.readFileSync(path.join(FIX, 'v4-save.json'), 'utf8');
const v5Save = fs.readFileSync(path.join(FIX, 'v5-save.json'), 'utf8');
const v6Save = fs.readFileSync(path.join(FIX, 'v6-save.json'), 'utf8');
const v7Save = fs.readFileSync(path.join(FIX, 'v7-save.json'), 'utf8');
const NAMES = ['save', 'saveMessage', 'storageKey', 'newSave', 'playWeek', 'upgrade', 'validateSave', 'readSaveFile',
  'embeddableJson', 'tradeQuote', 'counterTrade', 'resolveOffer', 'ownedPicks', 'pickKey', 'describeEvent',
  'rosterView', 'ownershipDesk', 'cur', 'clubs', 'SCHEMA_VERSION',
  'authorizeVisit', 'cancelVisit', 'commissionStudy', 'stadiumView', 'ownershipDesk', 'siteById', 'officialById',
  'fundProject', 'declineProject', 'startNaming', 'approveNaming', 'declineNaming', 'financesView', 'setLossPolicy', 'injuryFactor', 'payroll',
  'ensureContest', 'submitBid', 'withdrawBid', 'callOwner', 'setPlayerVote', 'ownerLean', 'coverage', 'coverageText', 'slotFor', 'voronoiCells', 'mapPoints', 'leagueView', 'drawMap',
  'standings', 'advance', 'jumpTo', 'jumpTargets', 'advanceLabel', 'weekLabel', 'now', 'seedsFor', 'playoffStatus', 'draftOrder', 'draftAvailable', 'ownerPick', 'simToMyPick', 'draftView', 'scoreboard', 'MILESTONES', 'SEASON_TICKS', 'personnel',
  'restructure', 'restructureSavings', 'releaseCost', 'utility', 'agentRead', 'counterTerms', 'priorityFor', 'askFor', 'tagPlayer', 'tagAmount', 'exerciseOption', 'optionAmount', 'limitFor', 'prepayToFloor', 'termsNeeded', 'contractSurplus', 'marketValue', 'CAP_FLOOR', 'capHit', 'capRoom', 'committed', 'deadIfCut', 'ownerRelease', 'extendPlayer', 'extensionTerms', 'makeOffer', 'withdrawOffer', 'setGmHandles', 'rookieTerms', 'contractsView', 'termsHit', 'tradeQuote',
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
  const without = (v, keys) => JSON.parse(JSON.stringify(v, (k, x) => (keys.includes(k) ? undefined : x)));
  for (const k of ['saveId', 'club', 'picks', 'events', 'revision']) assert.deepEqual(S[k], old[k], k);
  assert.deepEqual(without(S.seasons, ['tick']), old.seasons, 'seasons, apart from the new clock');
  assert.deepEqual(without(S.rosters, ['potential', 'contract']), old.rosters, 'rosters, apart from new potential ratings and contracts');
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

test('v3 save upgrades with finances, and stadium talks survive', () => {
  const { api } = load();
  const old = JSON.parse(v3Save);
  const S = api.upgrade(old).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
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
    S.finance.clubCash = 0;
    const p = S.rosters['club-06'].find(x => api.restructureSavings(S, x));
    assert.equal(api.restructure(S, p.id, 'club'), 'ok'); // a cash bonus the club cannot cover
    const x = S.finance.ledger.at(-1);
    assert(x.result < 0 && x.lines.signingBonuses < 0);
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


// ---- Owners, press and markets ---------------------------------------------
const contested = (seed, bid = { annual: 12, years: 7, lobby: true }) => {
  const { api, S } = owned(seed);
  api.ensureContest(S);
  if (bid) api.submitBid(S, bid.annual, bid.years, bid.lobby);
  return { api, S };
};
const liveContest = () => { const { api } = load(); const S = api.save; S.club = 'club-06'; api.ensureContest(S); api.submitBid(S, 12, 7, true); return { api, S }; };
const untilMeeting = (api, S) => { while (!S.league.meeting && api.cur(S).completed < 18) api.playWeek(S); };
const untilVote = (api, S) => { while (S.league.meeting.status !== 'decided') api.playWeek(S); };

test('v4 save upgrades: owners, markets, and the Columbus contest for Cincinnati', () => {
  const { api } = load();
  const old = JSON.parse(v4Save);
  const S = api.upgrade(old).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  assert.deepEqual(S.finance, old.finance);
  assert.equal(Object.keys(S.league.owners).length, 32);
  assert.equal(S.league.contest.marketId, 'columbus');
  assert.equal(S.league.contest.holder, 'club-07');
  assert(S.league.contest.deadlineWeek > old.seasons[0].completed);
});

test('Cincinnati contests Columbus against Cleveland and control changes hands', () => {
  const { api, S } = contested(51);
  const C = S.league.contest;
  assert.equal(C.marketId, 'columbus');
  const fansBefore = { ...S.league.markets.columbus.fans };
  while (C.status === 'open') api.playWeek(S);
  assert.equal(C.winner, 'club-06', 'a max offer with a station visit wins');
  assert.equal(S.league.markets.columbus.holder, 'club-06');
  const cell = api.mapPoints(S).find(p => p.id === 'columbus');
  assert.deepEqual(cell.holders, ['club-06'], 'the map cell now belongs to Cincinnati');
  assert(S.league.markets.columbus.fans['club-07'] >= fansBefore['club-07'], 'Cleveland keeps its fans: control and preference are separate');
  const rival = S.league.owners['club-07'];
  assert.match(rival.memory.at(-1).text, /took the Columbus broadcast rights/);
  assert.match(api.describeEvent(S.events.find(e => e.type === 'rightsWon')), /Cleveland Bulldogs’ \$/);
  assert(S.league.news.some(n => /win Columbus TV rights/.test(n.text)));
});

test('a low offer loses, and no offer means an unopposed renewal', () => {
  const low = contested(52, { annual: 1, years: 3, lobby: false });
  while (low.S.league.contest.status === 'open') low.api.playWeek(low.S);
  assert.equal(low.S.league.contest.winner, 'club-07');
  assert(low.S.events.some(e => e.type === 'rightsLost'));
  const none = contested(53, null);
  while (none.S.league.contest.status === 'open') none.api.playWeek(none.S);
  assert(none.S.events.some(e => e.type === 'rightsRenewed'));
});

test('kickoff windows: both Ohio clubs air in Columbus at different times, only the holder on a conflict', () => {
  const { api, S } = contested(54);
  let both = 0, conflict = 0;
  for (let w = 0; w < 18; w++) {
    const rows = api.coverage(S, 'columbus', w), cin = rows.find(r => r.id === 'club-06'), cle = rows.find(r => r.id === 'club-07');
    if (!cin.slot || !cle.slot) continue;
    if (cin.slot === cle.slot) { conflict++; assert(cle.airs && !cin.airs); assert.match(api.coverageText(S, w), /sees Cleveland, not you/); }
    else { both++; assert(cle.airs && cin.airs); assert.match(api.coverageText(S, w), /Both games air/); }
  }
  assert(both > 0 && conflict > 0, `both ${both}, conflict ${conflict}`);
});

test('the losing owner calls a vote, and it would hand Columbus back', () => {
  const { api, S } = liveContest();
  untilMeeting(api, S);
  const V = S.league.meeting;
  assert.equal(V.sponsor, 'club-07');
  assert(V.reversal);
  assert.match(api.leagueView(), /Columbus would go back to Cleveland/);
  assert(S.events.some(e => e.type === 'meetingCalled'));
});

test('lobbying: calls reveal where owners stand, promises move them and are remembered', () => {
  const { api, S } = contested(56);
  untilMeeting(api, S);
  const V = S.league.meeting, target = Object.keys(S.league.owners).find(id => id !== 'club-06' && id !== V.sponsor);
  const before = api.ownerLean(S, target);
  assert.equal(api.callOwner(S, target, true), 'ok');
  assert(api.ownerLean(S, target) < before - 0.5, 'a promise moves them toward your side');
  assert(target in V.revealed);
  assert.equal(S.league.promises.length, 1);
  assert.match(S.league.owners[target].memory.at(-1).text, /promised to back their next proposal/);
  assert.equal(api.callOwner(S, V.sponsor, false), 'unavailable');
  while (V.callsLeft > 0) api.callOwner(S, Object.keys(S.league.owners).find(id => id !== 'club-06' && id !== V.sponsor), false);
  assert.equal(api.callOwner(S, target, false), 'noCalls');
});

test('the vote counts every owner, and a pass returns Columbus to Cleveland', () => {
  let passedOnce = false, failedOnce = false;
  for (let seed = 60; seed < 90 && !(passedOnce && failedOnce); seed++) {
    const { api, S } = contested(seed);
    untilMeeting(api, S);
    untilVote(api, S);
    const V = S.league.meeting;
    assert.equal(Object.keys(V.votes).length, 32);
    assert.equal(V.votes['club-07'], 'yes');
    assert.equal(V.votes['club-06'], 'no');
    if (V.passed) { passedOnce = true; assert.equal(S.league.markets.columbus.holder, 'club-07'); assert.deepEqual(api.mapPoints(S).find(p => p.id === 'columbus').holders, ['club-07']); }
    else { failedOnce = true; assert.equal(S.league.markets.columbus.holder, 'club-06'); assert.match(S.league.owners['club-07'].memory.at(-1).text, /block/); }
    assert(S.league.news.some(n => /first-refusal rule/.test(n.text)));
  }
  assert(passedOnce && failedOnce, 'votes go both ways across seeds');
});

test('owners who resent subsidies hear about the plane you paid for', () => {
  const { api } = load();
  const S = api.upgrade(JSON.parse(v4Save)).save; // this save's owner paid for the plane personally
  api.playWeek(S);
  const resentful = Object.entries(S.league.owners).filter(([id, o]) => id !== 'club-06' && o.subsidy < -0.3);
  assert(resentful.length > 0);
  for (const [, o] of resentful) assert(o.memory.some(m => /team plane personally/.test(m.text)));
  const others = Object.entries(S.league.owners).filter(([id, o]) => o.subsidy >= -0.3);
  for (const [, o] of others) assert(!o.memory.some(m => /team plane/.test(m.text)));
});

test('owning out-of-market rights shows up in the books', () => {
  const { api, S } = contested(57);
  while (S.league.contest.status === 'open') api.playWeek(S);
  api.playWeek(S);
  assert.notEqual(S.finance.ledger.at(-1).lines.marketRights, 0);
});

test('voronoi cells: one per market, each contains its own city, and they tile the map', () => {
  const { api } = load();
  const pts = api.mapPoints(api.save), cells = api.voronoiCells(pts.map(p => [p.x, p.y]), 760, 590);
  assert.equal(cells.length, 38);
  const area = poly => Math.abs(poly.reduce((a, [x, y], i) => { const [x2, y2] = poly[(i + 1) % poly.length]; return a + x * y2 - x2 * y; }, 0)) / 2;
  const inside = (poly, [px, py]) => poly.every(([x, y], i) => { const [x2, y2] = poly[(i + 1) % poly.length]; return (x2 - x) * (py - y) - (y2 - y) * (px - x) >= -1e-6; }) || poly.every(([x, y], i) => { const [x2, y2] = poly[(i + 1) % poly.length]; return (x2 - x) * (py - y) - (y2 - y) * (px - x) <= 1e-6; });
  pts.forEach((p, i) => assert(inside(cells[i], [p.x, p.y]), p.id));
  assert(Math.abs(cells.reduce((a, c) => a + area(c), 0) - 760 * 590) < 1);
});

test('league page renders with owners, map and headlines, escaped', () => {
  const { api, S } = liveContest();
  untilMeeting(api, S);
  S.league.owners['club-01'].name = '<img src=x> Boss';
  const html = api.leagueView();
  assert(html.includes('marketMap') && html.includes('League meeting') && html.includes('Headlines') && html.includes('Promise support'));
  assert(!html.includes('<img src=x>'));
});


// ---- Calendar, postseason, offseason, draft --------------------------------
const toTick = (api, S, t) => { while (api.now(S) < t) api.advance(S); };
const regular = (api, S) => { while (api.cur(S).completed < 18) api.advance(S); };

test('v5 save upgrades to v6: the clock, potential and a draft class', () => {
  const { api } = load();
  const old = JSON.parse(v5Save);
  const S = api.upgrade(old).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  assert.equal(api.cur(S).tick, old.seasons[0].completed);
  assert(Object.values(S.rosters).flat().every(p => p.potential >= p.rating));
  assert.equal(S.draft.status, 'scouting');
  assert.equal(S.draft.prospects.length, 400);
  assert.equal(S.league.markets.columbus.holder, old.league.markets.columbus.holder);
  toTick(api, S, 23);
  assert.equal(S.history.length, 1, 'the migrated season finishes and is reviewed');
});

test('calendar labels run from the regular season through August', () => {
  const { api } = load();
  assert.equal(api.weekLabel(5), 'Week 5');
  assert.equal(api.weekLabel(19), 'the Wild Card round');
  assert.equal(api.weekLabel(22), 'the Championship Game');
  assert.equal(api.weekLabel(23), 'February Week 1');
  assert.equal(api.weekLabel(28), 'March Week 2');
  assert.equal(api.weekLabel(34), 'April Week 4');
  assert.equal(api.weekLabel(50), 'August Week 4');
});

test('postseason: seven seeds a conference, thirteen games, no ties, a champion', () => {
  const { api, S } = owned(101);
  regular(api, S);
  const seeds = api.seedsFor(S);
  for (const c of ['Charter', 'Union']) {
    assert.equal(seeds[c].length, 7);
    const winners = new Set(api.standings(S).filter(rows => api.clubs.find(t => t.id === rows[0].id).conference === c).map(rows => rows[0].id));
    assert.deepEqual(new Set(seeds[c].slice(0, 4)), winners, 'division winners take seeds 1-4');
  }
  assert.equal(api.advanceLabel(S), 'Play the Wild Card round →');
  for (let i = 0; i < 4; i++) api.advance(S);
  const P = api.cur(S).postseason;
  assert.deepEqual(P.rounds.map(r => r.games.length), [6, 4, 2, 1]);
  for (const g of P.rounds.flatMap(r => r.games)) assert.notEqual(g.score[0], g.score[1]);
  assert(P.champion);
  assert(P.rounds[3].games[0].neutral);
  assert.equal(api.weekLabel(api.now(S)), 'the Championship Game');
  api.advance(S);
  assert.equal(api.weekLabel(api.now(S)), 'February Week 1');
  assert.equal(S.history[0].champion, P.champion);
});

test('a home playoff game shows up in the books', () => {
  for (let seed = 102; seed < 140; seed++) {
    const { api, S } = owned(seed);
    regular(api, S);
    const seeds = api.seedsFor(S), i = seeds[api.clubs.find(t => t.id === 'club-06').conference].indexOf('club-06');
    if (i < 1 || i > 3) continue; // seeds 2-4 host a Wild Card game
    api.advance(S);
    const entry = S.finance.ledger.at(-1);
    assert(entry.playoff && entry.lines.tickets > 0);
    assert(S.events.some(e => e.type === 'playoffResult'));
    return;
  }
  assert.fail('no seed hosted a playoff game');
});

test('jump ahead stops at the draft; skipping past it lets the GM draft', () => {
  const a = owned(110);
  regular(a.api, a.S);
  a.api.jumpTo(a.S, a.api.MILESTONES.draft);
  assert.equal(a.api.now(a.S), 34);
  assert.equal(a.S.draft.status, 'live');
  const b = owned(110);
  regular(b.api, b.S);
  b.api.jumpTo(b.S, b.api.MILESTONES.otas);
  assert.equal(b.S.draft.status, 'done');
  assert(b.S.events.some(e => e.type === 'draftUnattended'));
  assert(b.S.rosters['club-06'].some(p => p.drafted?.season === 1));
});

test('the owner can take over the board and make the pick', () => {
  const { api, S } = owned(111);
  regular(api, S);
  api.jumpTo(S, 34);
  api.simToMyPick(S);
  const slot = S.draft.order[S.draft.pick];
  assert.equal(slot.owner, 'club-06');
  const choice = api.draftAvailable(S.draft)[10];
  assert.equal(api.ownerPick(S, choice.id), 'ok');
  const rookie = S.rosters['club-06'].find(p => p.name === choice.name && p.drafted);
  assert(rookie && rookie.drafted.overall === slot.overall);
  assert.equal(S.draft.picks.at(-1).by, 'owner');
  assert.equal(api.ownerPick(S, api.draftAvailable(S.draft)[0].id), 'notYourPick');
});

test('draft order: worst record first, champion last, traded picks honored', () => {
  const { api, S } = owned(112);
  const pick = S.picks.find(p => p.origin === 'club-29' && p.round === 1);
  pick.owner = 'club-06'; // Arizona's first now belongs to Cincinnati
  regular(api, S);
  for (let i = 0; i < 4; i++) api.advance(S);
  const order = api.draftOrder(S);
  assert.equal(order.length, 224);
  assert.equal(order[31].origin, api.cur(S).postseason.champion);
  const nonPlayoff = api.clubs.map(t => t.id).filter(id => api.playoffStatus(S, id).seed < 0);
  assert(nonPlayoff.includes(order[0].origin));
  assert.equal(order.find(x => x.origin === 'club-29' && x.round === 1).owner, 'club-06');
});

test('new league year: players age, leases tick down, lapsed offers return', () => {
  const { api, S } = owned(113);
  api.authorizeVisit(S, S.world.sites[0].id, plan());
  regular(api, S);
  const ages = Object.fromEntries(Object.values(S.rosters).flat().map(p => [p.id, p.age]));
  const lease = S.world.leases['club-06'].yearsLeft;
  toTick(api, S, 28);
  const survivors = Object.values(S.rosters).flat().filter(p => p.id in ages);
  assert(survivors.every(p => p.age === ages[p.id] + 1));
  assert(survivors.length < Object.keys(ages).length, 'some players retire');
  assert.equal(S.world.leases['club-06'].yearsLeft, Math.max(0, lease - 1));
  assert(S.world.sites.every(x => x.status === 'open'), 'expired offers come back');
  assert.match(api.describeEvent(S.events.find(e => e.type === 'leagueYear'), S), /new league year/);
});

test('stadium talks and studies keep running in the offseason', () => {
  const { api, S } = owned(114);
  regular(api, S);
  toTick(api, S, 30);
  const site = S.world.sites.find(x => x.status === 'open');
  assert.equal(api.authorizeVisit(S, site.id, plan()), 'ok');
  api.advance(S);
  assert(S.events.some(e => e.type === 'visitReport' && e.week === 31));
});

test('final cuts leave every club at 53 with every position covered', () => {
  const { api, S } = owned(115);
  regular(api, S);
  api.jumpTo(S, 50);
  for (const t of api.clubs) {
    assert.equal(S.rosters[t.id].length, 53, t.id);
    for (const [pos, , starters] of [['QB', 3, 1], ['K', 1, 1], ['P', 1, 1], ['LS', 1, 1], ['OT', 4, 2], ['CB', 6, 2]])
      assert(S.rosters[t.id].filter(p => p.pos === pos).length >= starters, t.id + ' ' + pos);
  }
});

test('season 2 opens with a new schedule, and deadlines carry over', () => {
  const { api, S } = owned(116);
  regular(api, S);
  toTick(api, S, 45);
  const site = S.world.sites.find(x => x.status === 'open');
  site.expiresWeek = 55;
  api.jumpTo(S, api.SEASON_TICKS + 1);
  assert.equal(api.cur(S).number, 2);
  assert.equal(api.cur(S).tick, 0);
  assert.equal(api.cur(S).completed, 0);
  assert.equal(site.expiresWeek, 5);
  assert.equal(site.status, 'open');
  assert.equal(S.draft.season, 2);
  assert.equal(api.advanceLabel(S), 'Advance week 1 →');
  api.advance(S);
  assert.equal(api.cur(S).completed, 1);
  assert(S.seasons[0].postseason.champion, 'season 1 is preserved');
});

test('jumping is never locked: from Week 3 straight to the season 2 opener', () => {
  const { api, S } = owned(117);
  for (let i = 0; i < 3; i++) api.advance(S);
  assert(api.jumpTargets(S).some(([t]) => t === 51));
  api.jumpTo(S, 51);
  assert.equal(api.cur(S).number, 2);
  assert.equal(S.draftHistory.length, 1);
  assert.deepEqual(api.validateSave(S), []);
});

test('two seasons are deterministic from the same seed', () => {
  const run = () => { const { api, S } = owned(118); api.jumpTo(S, 51); api.jumpTo(S, 20); return JSON.stringify(S.seasons) + JSON.stringify(S.rosters); };
  assert.equal(run(), run());
});

test('five seasons stay stable: ratings, ages and roster sizes', () => {
  const { api, S } = owned(119);
  const avg = () => { const all = Object.values(S.rosters).flat(); return all.reduce((a, p) => a + p.rating, 0) / all.length; };
  const start = avg();
  for (let n = 0; n < 5; n++) api.jumpTo(S, 51);
  const all = Object.values(S.rosters).flat();
  assert(Math.abs(avg() - start) < 2.5, `avg rating ${start.toFixed(1)} -> ${avg().toFixed(1)}`);
  const age = all.reduce((a, p) => a + p.age, 0) / all.length;
  assert(age > 25.5 && age < 29, `avg age ${age.toFixed(1)}`);
  assert.deepEqual(api.validateSave(S), []);
  console.log(`      five seasons · avg rating ${start.toFixed(1)} → ${avg().toFixed(1)} · save ${Math.round(JSON.stringify(S).length / 1024)}KB`);
});

test('draft and playoff views render', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  assert.match(api.draftView(), /Top of the board/);
  regular(api, S);
  api.advance(S);
  api.jumpTo(S, 34);
  assert.match(api.draftView(), /On the clock/);
  api.simToMyPick(S);
  assert.match(api.draftView(), /Your pick/);
});


// ---- Contracts and the salary cap ------------------------------------------
test('v6 save upgrades to v7: every player under contract, every club near the cap', () => {
  const { api } = load();
  const old = JSON.parse(v6Save);
  const S = api.upgrade(old).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  const all = Object.values(S.rosters).flat();
  assert(all.every(p => p.contract && p.contract.yearsLeft >= 1 && p.contract.salary > 0));
  for (const t of api.clubs) { const room = api.capRoom(S, t.id); assert(room >= 0 && room <= S.cap.limit * 0.15, t.id + ' room ' + room); }
  assert.deepEqual(S.fa.pool, []);
  assert.equal(api.cur(S).completed, old.seasons.at(-1).completed);
});

test('release: salary comes off; this year takes dead money, and guarantees are still owed', () => {
  const { api, S } = owned(201);
  api.jumpTo(S, 30); // March: inside the window where all dead money hits at once
  const p = S.rosters['club-06'].filter(x => x.contract.yearsLeft >= 2).sort((a, b) => b.contract.prorated - a.contract.prorated)[0];
  const before = api.committed(S, 'club-06'), cost = api.releaseCost(S, p), hit = api.capHit(p);
  assert(!cost.split && cost.deadLater === 0);
  api.ownerRelease(S, p.id);
  assert(!S.rosters['club-06'].includes(p));
  assert(Math.abs(api.committed(S, 'club-06') - (before - hit + cost.deadNow)) < 0.02);
  assert.match(api.describeEvent(S.events.at(-1), S), /Dead money/);
});

test('restructure: cap room now, cash now, more cap later; the owner can pay it', () => {
  const { api, S } = owned(202);
  const p = S.rosters['club-06'].find(x => api.restructureSavings(S, x));
  const r = api.restructureSavings(S, p), room = api.capRoom(S, 'club-06'), owner = S.finance.ownerCash, later = p.contract.prorated;
  assert.equal(api.restructure(S, p.id, 'owner'), 'ok');
  assert(Math.abs(api.capRoom(S, 'club-06') - (room + r.savings)) < 0.02, 'clears cap this year');
  assert(Math.abs(S.finance.ownerCash - (owner - r.amount)) < 0.02, 'the owner pays the bonus');
  assert(p.contract.prorated > later, 'later years carry more');
  assert(S.stadium.knowledge.some(f => f.kind === 'ownerFunding' && f.project === 'bonus' && f.knownBy.includes('league')));
});

test('extension: a final-year player signs on, the bonus is paid, and the cap is checked', () => {
  const { api, S } = owned(203);
  const p = S.rosters['club-06'].find(x => x.contract.yearsLeft === 1 && x.rating >= 65);
  const t = api.extensionTerms(S, p);
  assert.equal(api.extendPlayer(S, p.id, 'club'), 'ok');
  assert.equal(p.contract.yearsLeft, t.years + 1);
  if (t.bonus) assert(S.finance.ledger.at(-1).lines.signingBonuses <= -t.bonus + 0.01);
  const q = S.rosters['club-06'].find(x => x.contract.yearsLeft === 1 && x.id !== p.id);
  S.cap.dead['club-06'] = S.cap.limit; // no room at all
  assert.equal(api.extendPlayer(S, q.id, 'club'), 'capShort');
});

test('rookie deals follow the draft slot', () => {
  const { api } = load();
  const S = api.newSave(204);
  assert(api.termsHit(api.rookieTerms(S, 1)) > api.termsHit(api.rookieTerms(S, 32)));
  assert(api.termsHit(api.rookieTerms(S, 32)) > api.termsHit(api.rookieTerms(S, 200)));
  assert.equal(api.rookieTerms(S, 200).salary, S.cap.minSalary);
  S.club = 'club-06';
  api.jumpTo(S, 36);
  const rookies = S.rosters['club-06'].filter(p => p.drafted?.season === 1);
  assert(rookies.length > 0 && rookies.every(p => p.contract.kind === 'rookie' && p.contract.yearsLeft === 4));
  assert(S.finance.ledger.some(x => x.week === 34 && x.lines.signingBonuses < 0), 'rookie bonuses paid in draft week');
});

test('the cap year turns at March Week 2: cap grows, deals lose a year, expired players hit the market', () => {
  const { api, S } = owned(205);
  api.jumpTo(S, 27);
  const limit = S.cap.limit, expiring = new Map(Object.values(S.rosters).flat().filter(p => p.contract.yearsLeft === 1).map(p => [p.id, p.contract]));
  api.advance(S); // March Week 2
  assert.equal(S.cap.limit, Math.round(limit * 1.04 * 100) / 100);
  const now = new Map(Object.values(S.rosters).flat().map(p => [p.id, p.contract]));
  assert([...expiring].every(([id, c]) => now.get(id) !== c), 'no expired deal is still in force; some players re-signed on the open market');
  assert(S.fa.pool.length > 0 && S.fa.pool.every(p => p.ask && !p.contract));
  assert(S.events.some(e => e.type === 'capYear'));
});

test('the GM re-signs keepers by default; with the owner in charge, nobody is kept automatically', () => {
  const on = owned(206); on.api.jumpTo(on.S, 27);
  const e1 = on.S.events.find(e => e.type === 'resignings');
  assert(e1.byGm && e1.kept.length > 0);
  const off = owned(206); off.api.setGmHandles(off.S, false); off.api.jumpTo(off.S, 27);
  const e2 = off.S.events.find(e => e.type === 'resignings');
  assert(!e2.byGm && e2.kept.length === 0 && e2.leaving.length > 0);
});

test('free agency: the owner makes an offer and the player decides when the week advances', () => {
  const { api, S } = owned(207);
  api.setGmHandles(S, false);
  api.jumpTo(S, 28);
  const p = S.fa.pool.filter(x => api.termsHit(x.ask) < api.capRoom(S, 'club-06')).sort((a, b) => b.rating - a.rating)[0];
  assert.equal(api.makeOffer(S, p.id, 'club'), 'ok');
  api.advance(S);
  const e = S.events.find(x => (x.type === 'faSigned' || x.type === 'faLost') && x.player.id === p.id);
  assert(e, 'the player made a decision');
  if (e.type === 'faSigned') assert(S.rosters['club-06'].some(x => x.id === p.id));
  assert(!S.fa.pool.some(x => x.id === p.id));
});

test('trades respect the cap', () => {
  const { api, S } = owned(208);
  S.cap.dead['club-06'] = api.capRoom(S, 'club-06') - 1; // about $1M of room left
  const star = S.rosters['club-17'].sort((a, b) => api.capHit(b) - api.capHit(a)).find(p => !p.out && S.rosters['club-17'].filter(x => x.pos === p.pos).length > 2);
  api.tradeQuote(S, 'club-17', star.id);
  assert.equal(S.offer.status, 'capShort');
});

test('every club opens each season at 53 and under the cap; the owner is forced into compliance if needed', () => {
  const { api, S } = owned(209);
  for (let n = 0; n < 4; n++) {
    api.jumpTo(S, 51);
    for (const t of api.clubs) { assert.equal(S.rosters[t.id].length >= 53, true, t.id); assert(api.capRoom(S, t.id) >= -0.01, t.id + ' over by ' + -api.capRoom(S, t.id)); }
  }
  api.jumpTo(S, 50); // after final cuts
  S.cap.dead['club-06'] = (S.cap.dead['club-06'] ?? 0) + api.capRoom(S, 'club-06') + 20; // $20M over
  api.jumpTo(S, 51);
  assert(api.capRoom(S, 'club-06') >= -0.01);
  assert(S.events.some(e => e.type === 'capCompliance'));
});

test('contracts page renders the cap sheet, expiring deals, free agents and the release check', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  let html = api.contractsView();
  assert(html.includes('Cap sheet') && html.includes('Expiring contracts') && html.includes('Free agency opens'));
  api.jumpTo(S, 29);
  html = api.contractsView();
  assert(html.includes('Offer asking terms'));
  assert(!/<script|onerror/i.test(html));
});


// ---- Contracts phase 2: negotiation, guarantees, tags, options, floor -------
const hasPriority = (api, list, pr) => list.find(p => api.priorityFor(p) === pr);

test('v7 save upgrades to v8: guarantees, rookie options, carryover and tag books', () => {
  const { api } = load();
  const S = api.upgrade(JSON.parse(v7Save)).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  assert(S.cap.deadNext && S.cap.carry && S.cap.tags);
  const firsts = Object.values(S.rosters).flat().filter(p => p.contract.kind === 'rookie' && p.drafted?.round === 1);
  assert(firsts.length > 0 && firsts.every(p => p.contract.option && p.contract.gYears === p.contract.yearsLeft));
  assert(S.fa.pool.every(p => p.ask.gYears !== undefined));
});

test('negotiation: the asking terms work, a lowball does not, and priorities change the read', () => {
  const { api, S } = owned(301);
  api.jumpTo(S, 29);
  const p = S.fa.pool.filter(x => x.ask.years >= 2).sort((a, b) => b.rating - a.rating)[0];
  assert(api.agentRead(S, p, p.ask, 'club-06', p.ask).u >= 0.95);
  assert.equal(api.agentRead(S, p, { ...p.ask, salary: p.ask.salary * 0.6, bonus: 0 }, 'club-06', p.ask).verdict, 'no');
  const roster = Object.values(S.rosters).flat();
  const sec = hasPriority(api, roster, 'security'), mon = hasPriority(api, roster, 'money');
  const gain = q => { const ask = api.askFor(S, q), base = { ...ask, gYears: 0, bonus: 0 }, safe = { ...base, gYears: base.years };
    return api.utility(S, q, safe, 'club-06', ask) - api.utility(S, q, base, 'club-06', ask); };
  assert(gain(sec) > gain(mon), 'security-minded players value guarantees more');
});

test('extension negotiation: a low offer gets a counter, and accepting the counter signs him', () => {
  const { api, S } = owned(302);
  const p = S.rosters['club-06'].find(x => x.contract.yearsLeft === 1 && x.rating >= 65);
  const ask = api.extensionTerms(S, p), low = { ...ask, salary: Math.round(ask.salary * 0.75 * 10) / 10 };
  assert.equal(api.extendPlayer(S, p.id, 'club', low), 'refused');
  const counter = api.counterTerms(S, p, low, 'club-06', ask);
  assert(counter.salary > low.salary);
  assert.equal(api.extendPlayer(S, p.id, 'club', counter), 'ok');
  assert.equal(p.contract.yearsLeft, counter.years + 1);
});

test('free agency: a rich offer beats the market', () => {
  const { api, S } = owned(303);
  api.setGmHandles(S, false);
  api.jumpTo(S, 28);
  const p = S.fa.pool.filter(x => api.termsHit(x.ask) * 1.4 < api.capRoom(S, 'club-06')).sort((a, b) => b.rating - a.rating)[0];
  const years = p.ask.years, rich = { salary: Math.round(p.ask.salary * 1.4 * 100) / 100, years, bonus: Math.round(p.ask.bonus * 1.4 * 100) / 100, gYears: years };
  assert.equal(api.makeOffer(S, p.id, 'club', rich), 'ok');
  api.advance(S);
  assert(S.rosters['club-06'].some(x => x.id === p.id), 'he signs with us');
  assert(S.events.some(e => e.type === 'faSigned' && e.player.id === p.id && e.terms.gYears === years));
});

test('guaranteed salary is owed in cash when a player is released', () => {
  const { api, S } = owned(304);
  api.jumpTo(S, 30);
  const p = S.rosters['club-06'].sort((a, b) => b.contract.salary - a.contract.salary)[0];
  Object.assign(p.contract, { yearsLeft: 3, gYears: 2 }); // two guaranteed years left
  const cost = api.releaseCost(S, p);
  assert(cost.owed >= p.contract.salary - 0.01, 'at least this season’s salary is owed');
  api.ownerRelease(S, p.id);
  assert(S.finance.ledger.at(-1).lines.releasePay <= -cost.owed + 0.01);
  assert(cost.deadNow >= cost.owed);
});

test('June 1: later releases split dead money across two cap years', () => {
  const { api, S } = owned(305);
  api.jumpTo(S, 41); // June Week 3
  const p = S.rosters['club-06'].filter(x => x.contract.yearsLeft >= 3 && x.contract.prorated > 0.5)[0];
  const cost = api.releaseCost(S, p);
  assert(cost.split && cost.deadLater > 0);
  api.ownerRelease(S, p.id);
  assert.equal(S.cap.deadNext['club-06'], cost.deadLater);
  api.jumpTo(S, 51); api.jumpTo(S, 28); // next league year
  assert(S.cap.dead['club-06'] >= cost.deadLater - 0.01, 'deferred dead money lands in the new cap year');
});

test('unused room carries over, up to the limit', () => {
  const { api, S } = owned(306);
  api.jumpTo(S, 27);
  const room = api.capRoom(S, 'club-06');
  api.advance(S);
  assert.equal(S.cap.carry['club-06'], Math.round(Math.max(0, Math.min(25, room)) * 100) / 100);
  assert.equal(api.limitFor(S, 'club-06'), Math.round((S.cap.limit + S.cap.carry['club-06']) * 100) / 100);
});

test('franchise tag: one player, February to March, one year at the top-five average', () => {
  const { api, S } = owned(307);
  api.setGmHandles(S, false);
  const p = S.rosters['club-06'].filter(x => x.contract.yearsLeft === 1).sort((a, b) => b.rating - a.rating)[0];
  assert.equal(api.tagPlayer(S, 'club-06', p.id), 'closed');
  api.jumpTo(S, 24);
  const amount = api.tagAmount(S, p.pos);
  assert.equal(api.tagPlayer(S, 'club-06', p.id), 'ok');
  const q = S.rosters['club-06'].find(x => x.contract.yearsLeft === 1 && x.id !== p.id);
  if (q) assert.equal(api.tagPlayer(S, 'club-06', q.id), 'used');
  api.jumpTo(S, 28);
  assert(S.rosters['club-06'].includes(p), 'tagged player stays');
  assert.equal(p.contract.kind, 'tag');
  assert.equal(p.contract.salary, amount);
  assert.equal(p.contract.yearsLeft, 1);
  assert.equal(p.contract.gYears, 1);
});

test('fifth-year option: first-round rookies can be kept a year at a set price', () => {
  const { api, S } = owned(308);
  api.jumpTo(S, 36); // after the draft
  const p = S.rosters['club-06'].find(x => x.contract.option);
  assert(p, 'a first-round rookie has an option');
  p.contract.yearsLeft = 1; p.contract.gYears = 1; // fast-forward to his final rookie year
  const amount = api.optionAmount(S, p);
  assert.equal(api.exerciseOption(S, 'club-06', p.id), 'ok');
  assert.equal(p.contract.yearsLeft, 2);
  api.jumpTo(S, 51); api.jumpTo(S, 28);
  assert.equal(p.contract.yearsLeft, 1);
  assert(Math.abs(p.contract.salary - amount) < 0.01);
});

test('salary floor: the GM prepays to reach it; an owner in charge is warned, then pays the gap', () => {
  const squeeze = S => { for (const p of S.rosters['club-06']) { p.contract.salary = S.cap.minSalary; p.contract.prorated = 0; } };
  const gm = owned(309);
  squeeze(gm.S);
  for (const p of gm.S.rosters['club-06'].slice(0, 20)) p.contract.yearsLeft = Math.max(3, p.contract.yearsLeft);
  for (let p of gm.S.rosters['club-06'].slice(0, 20)) p.contract.salary = 6;
  while (gm.api.cur(gm.S).completed < 18) gm.api.advance(gm.S);
  assert(gm.S.events.some(e => e.type === 'salaryPrepaid' && e.byGm));
  assert(gm.api.committed(gm.S, 'club-06') >= gm.api.CAP_FLOOR * gm.S.cap.limit - 0.05);
  const me = owned(310);
  me.api.setGmHandles(me.S, false);
  squeeze(me.S);
  me.api.jumpTo(me.S, 23);
  assert(me.S.events.some(e => e.type === 'floorWarning'));
  const e = me.S.events.find(x => x.type === 'floorShortfall');
  assert(e && e.shortfall > 0);
  assert(me.S.finance.ledger.some(x => x.lines.floorShortfall < 0));
});

test('trade prices weigh contracts: a bargain costs more than the same player overpaid', () => {
  const { api, S } = owned(311);
  const p = S.rosters['club-17'].filter(x => x.pos === 'WR').sort((a, b) => b.rating - a.rating)[0];
  const value = api.marketValue(S, p);
  p.contract = { ...p.contract, salary: S.cap.minSalary, prorated: 0, yearsLeft: 3 };
  const cheap = api.termsNeeded(p, null, S);
  p.contract = { ...p.contract, salary: value * 2, prorated: 0, yearsLeft: 3 };
  const dear = api.termsNeeded(p, null, S);
  assert(cheap > dear + 20, `bargain ${cheap} vs overpaid ${dear}`);
});

test('contracts page shows negotiation, tag and option controls', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06'; api.setGmHandles(S, false);
  api.jumpTo(S, 24);
  const html = api.contractsView();
  assert(html.includes('Franchise tag') && html.includes('data-negotiate') && html.includes('Salary floor'));
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
