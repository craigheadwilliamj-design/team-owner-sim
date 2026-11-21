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
const v8Save = fs.readFileSync(path.join(FIX, 'v8-save.json'), 'utf8');
const v9Save = fs.readFileSync(path.join(FIX, 'v9-save.json'), 'utf8');
const v10Save = fs.readFileSync(path.join(FIX, 'v10-save.json'), 'utf8');
const v11Save = fs.readFileSync(path.join(FIX, 'v11-save.json'), 'utf8');
const v12Save = fs.readFileSync(path.join(FIX, 'v12-save.json'), 'utf8');
const v13Save = fs.readFileSync(path.join(FIX, 'v13-save.json'), 'utf8');
const v14Save = fs.readFileSync(path.join(FIX, 'v14-save.json'), 'utf8');
const v15Save = fs.readFileSync(path.join(FIX, 'v15-save.json'), 'utf8');
const v16Save = fs.readFileSync(path.join(FIX, 'v16-save.json'), 'utf8');
const NAMES = ['waitingItems', 'justDecided', 'rightsContext', 'leagueUi:()=>leagueUi', 'aiRelocations', 'aiMoveCandidates', 'fileRelocation', 'withdrawRelocation', 'relocationBlock', 'relocationCosts', 'realignmentPlan', 'applyIdentity', 'relocationLean', 'freeNicknames', 'groups', 'KNOWN_MARKETS', 'RELOCATION_FILING', 'LEGACY_COLLEGES', 'COLLEGE_TIERS', 'collegeTier', 'makeSlate', 'openRenewals', 'contestFor', 'stationRange', 'bidCap', 'shiftFans', 'OPEN_MARKETS', 'RELOCATION_MARKETS', 'mapLabels', 'save', 'saveMessage', 'storageKey', 'newSave', 'playWeek', 'upgrade', 'validateSave', 'readSaveFile',
  'embeddableJson', 'tradeQuote', 'counterTrade', 'resolveOffer', 'ownedPicks', 'pickKey', 'describeEvent',
  'rosterView', 'ownershipDesk', 'cur', 'clubs', 'SCHEMA_VERSION',
  'authorizeVisit', 'cancelVisit', 'commissionStudy', 'stadiumView', 'ownershipDesk', 'siteById', 'officialById',
  'fundProject', 'declineProject', 'startNaming', 'approveNaming', 'declineNaming', 'financesView', 'setLossPolicy', 'injuryFactor', 'payroll',
  'ensureContest', 'submitBid', 'withdrawBid', 'callOwner', 'setPlayerVote', 'ownerLean', 'coverage', 'coverageText', 'slotFor', 'voronoiCells', 'mapPoints', 'leagueView', 'drawMap',
  'standings', 'advance', 'jumpTo', 'jumpTargets', 'advanceLabel', 'weekLabel', 'now', 'seedsFor', 'playoffStatus', 'draftOrder', 'draftAvailable', 'ownerPick', 'simToMyPick', 'draftView', 'scoreboard', 'MILESTONES', 'SEASON_TICKS', 'personnel',
  'restructure', 'restructureSavings', 'releaseCost', 'trueGrade', 'scoutProspect', 'toggleWatch', 'setScoutAssign', 'scoutingReport', 'pointsPerWeek', 'rookieFrom', 'draftUi', 'priceFor', 'aiTradeIdea', 'leagueView', 'rivalFactor', 'executeTrade', 'gmTradeIdea', 'aiOfferIdea', 'needsCall', 'tradeRead', 'tradeWindow', 'processTradeTalk', 'starterIds', 'tradeSummary', 'activesFor', 'inactivesFor', 'moveDepth', 'resetDepth', 'toggleActive', 'placeOnIR', 'activateFromIR', 'canReturn', 'promote', 'releasePractice', 'fillPractice', 'poachPractice', 'practiceOf', 'rosterCount', 'rosterAlerts', 'manageRoster', 'depthView', 'staffReview', 'trackStarts', 'finishMedicalWeek', 'clubUnits', 'devFactor', 'perceivedGrade', 'fireStaff', 'interview', 'hire', 'staffView', 'setDirective', 'approveProposal', 'declineProposal', 'bestFor', 'negotiationView', 'carousel', 'fillOpenings', 'hcOf', 'gmOf', 'weekLines', 'tradeFactor', 'developPlayers', 'rngFor', 'utility', 'agentRead', 'counterTerms', 'priorityFor', 'askFor', 'tagPlayer', 'tagAmount', 'exerciseOption', 'optionAmount', 'limitFor', 'prepayToFloor', 'termsNeeded', 'contractSurplus', 'marketValue', 'CAP_FLOOR', 'capHit', 'capRoom', 'committed', 'deadIfCut', 'ownerRelease', 'extendPlayer', 'extensionTerms', 'makeOffer', 'withdrawOffer', 'setGmHandles', 'rookieTerms', 'contractsView', 'termsHit', 'tradeQuote',
  'playGame', 'rngFor', 'statLine', 'statEdge', 'statText', 'statNote', 'statLeaders', 'perceivedRating', 'tradeValue', 'leadersView', 'broadcastView', 'bcDrive', 'canWatch', 'bc', 'broadcast:()=>broadcastGame',
  'live:()=>({save,saveMessage})', 'inkable', 'contrast', 'setTeamColors', 'routeOf', 'routeFromHash', 'hashOf', 'navHtml', 'SECTIONS', 'VIEWS', 'ownersView', 'marketsView', 'newsView', 'dueBy', 'scoreboardCells', 'confirmHtml', 'pendingItems', 'tradesView', 'urgency', 'findPlayer', 'findPlayers', 'playerView', 'showPlayer', 'playerFromHash', 'card:()=>({cardPlayer,cardTab})', 'draftBook', 'corkBoard', 'clipboard', 'draftGroupOf', 'clubView', 'clubsView', 'clubFromHash', 'standingsView', 'setClub:(id,t)=>{selected=id;clubTab=t;}', 'setCard:(id,t)=>{cardPlayer=id;cardTab=t||"overview";}'];
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
  const S = api.newSave(44); S.club = 'club-06';
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
  assert.equal(S.world.markets.length, 17);
  assert.equal(S.world.sites.length, 34);
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
  assert.deepEqual(S.stadium, { ...old.stadium, application: null, coolingUntil: 0 });
  assert.deepEqual(S.world.markets.slice(0, old.world.markets.length), old.world.markets);
  assert.deepEqual(S.world.sites.slice(0, old.world.sites.length), old.world.sites);
  assert.deepEqual(S.world.leases, old.world.leases);
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
// Puts Columbus (held by Cleveland) up for renewal this season.
const columbusUp = (api, S) => {
  S.league.markets.columbus.renewal = api.cur(S).number;
  S.league.contests = S.league.contests.filter(c => c.marketId !== 'columbus');
  api.openRenewals(S);
  return api.contestFor(S, 'columbus');
};
const contested = (seed, bid = { annual: 12, years: 7, lobby: true }) => {
  const { api, S } = owned(seed);
  columbusUp(api, S);
  if (bid) assert.equal(api.submitBid(S, 'columbus', bid.annual, bid.years, bid.lobby), 'ok');
  return { api, S };
};
const liveContest = () => { const { api } = load(); const S = api.save; S.club = 'club-06'; columbusUp(api, S); api.submitBid(S, 'columbus', 12, 7, true); return { api, S }; };
const untilMeeting = (api, S) => { while (!S.league.meeting && api.cur(S).completed < 18) api.playWeek(S); };
const untilVote = (api, S) => { while (S.league.meeting.status !== 'decided') api.playWeek(S); };
const untilDecided = (api, S, id = 'columbus') => { const C = api.contestFor(S, id); while (C.status === 'open') api.playWeek(S); return C; };

test('v4 save upgrades: owners, markets with renewal seasons, and this season’s renewals', () => {
  const { api } = load();
  const old = JSON.parse(v4Save);
  const S = api.upgrade(old).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  assert.deepEqual(S.finance, old.finance);
  assert.equal(Object.keys(S.league.owners).length, 32);
  assert.equal(S.league.rules.firstRefusal, false);
  const season = api.cur(S).number;
  const due = Object.entries(S.league.markets).filter(([, M]) => !M.holder || M.renewal <= season).map(([id]) => id).sort();
  assert.deepEqual(S.league.contests.map(c => c.marketId).sort(), due);
  assert(due.includes('austin'), 'unclaimed markets are open');
  assert(S.league.contests.every(c => c.deadlineWeek > old.seasons[0].completed));
});

test('Cincinnati contests Columbus against Cleveland and control changes hands', () => {
  const { api, S } = contested(51);
  const fansBefore = { ...S.league.markets.columbus.fans };
  const C = untilDecided(api, S);
  assert.equal(C.winner, 'club-06', 'a max offer with a station visit wins');
  const M = S.league.markets.columbus;
  assert.equal(M.holder, 'club-06');
  assert.equal(M.fee, 12);
  assert.equal(M.renewal, api.cur(S).number + 7, 'the deal runs seven seasons');
  assert.deepEqual(api.mapPoints(S).find(p => p.id === 'columbus').holders, ['club-06'], 'the map cell now belongs to Cincinnati');
  assert(M.fans['club-07'] >= fansBefore['club-07'] - 5, 'Cleveland keeps most of its fans: control and preference are separate');
  assert.match(S.league.owners['club-07'].memory.at(-1).text, /took the Columbus broadcast rights/);
  assert.match(api.describeEvent(S.events.find(e => e.type === 'rightsWon')), /Cleveland Bulldogs’ \$/);
  assert(S.league.news.some(n => /win Columbus TV rights/.test(n.text)));
});

test('a low offer loses, and with no offer Cleveland renews quietly', () => {
  const low = contested(52, { annual: 1, years: 3, lobby: false });
  assert.equal(untilDecided(low.api, low.S).winner, 'club-07');
  assert(low.S.events.some(e => e.type === 'rightsLost'));
  const none = contested(53, null);
  const C = untilDecided(none.api, none.S);
  assert.equal(C.winner, 'club-07');
  assert(none.S.league.markets.columbus.renewal > none.api.cur(none.S).number);
  assert(!none.S.events.some(e => /^rights/.test(e.type)), 'nothing for the owner’s inbox');
});

test('a market you hold and do not bid on is lost', () => {
  const { api, S } = owned(54);
  Object.assign(S.league.markets.columbus, { holder: 'club-06', fee: 5 });
  columbusUp(api, S);
  const C = untilDecided(api, S);
  assert.notEqual(S.league.markets.columbus.holder, 'club-06');
  assert.equal(C.winner, S.league.markets.columbus.holder);
  assert.match(api.describeEvent(S.events.find(e => e.type === 'rightsLapsed')), /Columbus/);
});

test('kickoff windows: both Ohio clubs air in Columbus at different times, only the holder on a conflict', () => {
  const { api, S } = contested(54);
  let both = 0, conflict = 0;
  for (let w = 0; w < 18; w++) {
    const rows = api.coverage(S, 'columbus', w), cin = rows.find(r => r.id === 'club-06'), cle = rows.find(r => r.id === 'club-07');
    if (!cin.slot || !cle.slot) continue;
    if (cin.slot === cle.slot) { conflict++; assert(cle.airs && !cin.airs); assert.match(api.coverageText(S, 'columbus', w), /sees Cleveland, not you/); }
    else { both++; assert(cle.airs && cin.airs); assert.match(api.coverageText(S, 'columbus', w), /Both games air/); }
  }
  assert(both > 0 && conflict > 0, `both ${both}, conflict ${conflict}`);
});

test('fans shift: the holder gains, a blacked-out rival loses, and with no undecided fans left the holder takes them from rivals', () => {
  const { api, S } = contested(55);
  untilDecided(api, S);
  S.league.meeting = null; // no vote to hand Columbus back mid-test
  const at = { ...S.league.markets.columbus.fans };
  while (api.cur(S).completed < 18) api.playWeek(S);
  const end = S.league.markets.columbus.fans;
  assert(end['club-06'] > at['club-06'] + 4, `Cincinnati ${at['club-06']} → ${end['club-06']}`);
  assert(end['club-07'] < at['club-07'], `Cleveland ${at['club-07']} → ${end['club-07']}`);
  const M = S.league.markets.columbus;
  M.fans = { 'club-06': 50, 'club-07': 48 };
  const w = [...Array(18).keys()].find(i => { const r = api.coverage(S, 'columbus', i); return r.every(x => x.slot && x.airs); });
  api.shiftFans(S, 'columbus', w);
  assert(M.fans['club-06'] > 50 && M.fans['club-07'] < 48, 'the holder takes fans from a rival even when both games air');
});

test('first refusal: once it is a rule, a holder keeps its market by matching an offer within a quarter of its own', () => {
  let matched = 0, beaten = 0;
  for (let seed = 60; seed < 90 && !(matched && beaten); seed++) {
    const { api, S } = owned(seed);
    S.league.rules.firstRefusal = true;
    const [, hi] = api.stationRange(S, 'columbus');
    columbusUp(api, S);
    api.submitBid(S, 'columbus', Math.round((hi + 0.5) * 2) / 2, 7, true);
    const C = untilDecided(api, S);
    if (C.matched) {
      matched++;
      assert.equal(S.league.markets.columbus.holder, 'club-07');
      assert.equal(S.league.markets.columbus.fee, C.bid.annual, 'Cleveland pays what we offered');
      assert(C.bid.annual <= C.bids['club-07'].annual * 1.25);
      assert.match(api.describeEvent(S.events.find(e => e.type === 'rightsLost')), /first refusal/);
    } else if (C.winner === 'club-06') { beaten++; assert(C.bid.annual > C.bids['club-07'].annual * 1.25); }
  }
  assert(matched && beaten, `matched ${matched}, beaten ${beaten}`);
});

test('deals run out: every season the due markets come up, and the league map changes without the owner', () => {
  const { S, api } = owned(77); // the owner makes no offers
  const start = Object.fromEntries(Object.entries(S.league.markets).map(([id, M]) => [id, M.holder]));
  for (let season = 1; season <= 4; season++) {
    const n = api.cur(S).number, due = Object.entries(S.league.markets).filter(([, M]) => !M.holder || M.renewal <= n).map(([id]) => id).sort();
    assert.deepEqual(S.league.contests.map(c => c.marketId).sort(), due, 'season ' + n);
    api.jumpTo(S, 6);
    assert(S.league.contests.every(c => c.status === 'decided'));
    assert(Object.values(S.league.markets).every(M => !M.holder || M.renewal > n), 'every held deal runs past this season');
    api.jumpTo(S, api.SEASON_TICKS + 1);
  }
  const changed = Object.keys(start).filter(id => S.league.markets[id].holder !== start[id]);
  assert(changed.length >= 3, 'changed hands: ' + changed.join(', '));
  assert(S.league.news.some(n => /claim the unclaimed|win .* TV rights from/.test(n.text)));
});

test('the bid cap follows the price: Mexico City takes far more than $12M', () => {
  const { api, S } = owned(56);
  S.league.markets['mexico-city'].renewal = 1; api.openRenewals(S);
  const [, hi] = api.stationRange(S, 'mexico-city');
  assert(hi > 12 && api.bidCap(S, 'mexico-city') >= hi);
  assert.equal(api.submitBid(S, 'mexico-city', Math.ceil(hi), 5, false), 'ok');
  assert.equal(api.submitBid(S, 'mexico-city', api.bidCap(S, 'mexico-city') + 1, 5, false), 'invalid');
  assert.equal(api.submitBid(S, 'columbus', 5, 5, false), api.contestFor(S, 'columbus') ? 'ok' : 'closed');
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

test('the vote counts every owner; a pass returns Columbus to Cleveland and makes first refusal a rule', () => {
  let passedOnce = false, failedOnce = false;
  for (let seed = 60; seed < 90 && !(passedOnce && failedOnce); seed++) {
    const { api, S } = contested(seed);
    untilMeeting(api, S);
    untilVote(api, S);
    const V = S.league.meeting;
    assert.equal(Object.keys(V.votes).length, 32);
    assert.equal(V.votes['club-07'], 'yes');
    assert.equal(V.votes['club-06'], 'no');
    if (V.passed) {
      passedOnce = true;
      assert.equal(S.league.markets.columbus.holder, 'club-07');
      assert.deepEqual(api.mapPoints(S).find(p => p.id === 'columbus').holders, ['club-07']);
      assert.equal(S.league.rules.firstRefusal, true);
    } else {
      failedOnce = true;
      assert.equal(S.league.markets.columbus.holder, 'club-06');
      assert.equal(S.league.rules.firstRefusal, false);
      assert.match(S.league.owners['club-07'].memory.at(-1).text, /block/);
    }
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
  untilDecided(api, S);
  api.playWeek(S);
  assert.notEqual(S.finance.ledger.at(-1).lines.marketRights, 0);
});

test('voronoi cells: one per market, each contains its own city, and they tile the map', () => {
  const { api } = load();
  const pts = api.mapPoints(api.save), cells = api.voronoiCells(pts.map(p => [p.x, p.y]), 760, 590);
  assert.equal(cells.length, 50);
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
  const site = S.world.sites.find(x => x.status === 'open') ?? S.world.sites[0];
  site.status = 'open'; site.expiresWeek = 55;
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
  assert(all.every(p => !p.stats || (p.stats.length <= 3 && p.stats.every((L, i) => !i || L.season > p.stats[i - 1].season))), 'three seasons of stats at most, oldest first');
  console.log(`      five seasons · avg rating ${start.toFixed(1)} → ${avg().toFixed(1)} · save ${Math.round(JSON.stringify(S).length / 1024)}KB`);
});

test('draft and playoff views render', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  assert.match(api.draftView(), /Big board/);
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
  // Seed 209 once sent Tampa Bay into a cap spiral: re-signings that ignored next
  // year's dead money, cuts that turned salary into dead money, and final cuts of
  // guaranteed rookies. No club should carry more than a fifth of the cap in dead money.
  const { api, S } = owned(209);
  for (let n = 0; n < 4; n++) {
    api.jumpTo(S, 51);
    for (const t of api.clubs) {
      assert.equal(S.rosters[t.id].length >= 53, true, t.id);
      assert(api.capRoom(S, t.id) >= -0.01, t.id + ' over by ' + -api.capRoom(S, t.id));
      if (t.id !== 'club-06') assert((S.cap.dead[t.id] ?? 0) < S.cap.limit * 0.2, t.id + ' carries ' + S.cap.dead[t.id] + ' in dead money');
    }
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
  const p = S.fa.pool.filter(x => x.ask.years >= 2 && api.priorityFor(x) !== 'winning').sort((a, b) => b.rating - a.rating)[0];
  assert(api.agentRead(S, p, p.ask, 'club-06', p.ask).u >= 0.95); // winners-first players mark down weak teams, so test a different priority
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
  // A contender can still outbid 1.4x now and then (about one league in seven); try a few.
  let api, S, p, years;
  for (const seed of [303, 305, 306]) {
    ({ api, S } = owned(seed));
    api.setGmHandles(S, false);
    api.jumpTo(S, 28);
    p = S.fa.pool.filter(x => api.termsHit(x.ask) * 1.4 < api.capRoom(S, 'club-06')).sort((a, b) => b.rating - a.rating)[0];
    years = p.ask.years;
    const rich = { salary: Math.round(p.ask.salary * 1.4 * 100) / 100, years, bonus: Math.round(p.ask.bonus * 1.4 * 100) / 100, gYears: years };
    assert.equal(api.makeOffer(S, p.id, 'club', rich), 'ok');
    api.advance(S);
    if (S.rosters['club-06'].some(x => x.id === p.id)) break;
  }
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


// ---- Coaches and front office ----------------------------------------------
test('v8 save upgrades to v9: every club has a head coach and a GM', () => {
  const { api } = load();
  const old = JSON.parse(v8Save);
  const S = api.upgrade(old).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  for (const t of api.clubs) { assert(S.staff.clubs[t.id].hc.ratings.offense); assert(S.staff.clubs[t.id].gm.ratings.scouting); }
  assert.equal(S.staff.president.name, old.staff.president.name);
  assert.deepEqual(S.staff.directives, { focus: 'none', approach: 'gm', approvalOver: null, tradeAuthority: 'all', rosterMoves: 'gm' });
  assert.equal(api.cur(S).completed, old.seasons.at(-1).completed);
});

test('the coach shapes the units: scheme sets the pass rate, ratings move the numbers', () => {
  const { api, S } = owned(401);
  const hc = api.hcOf(S, 'club-06');
  Object.assign(hc.style, { offense: 'pass' }); hc.ratings.offense = 90;
  const pass = api.clubUnits(S, 'club-06');
  Object.assign(hc.style, { offense: 'run' }); hc.ratings.offense = 40;
  const run = api.clubUnits(S, 'club-06');
  assert(pass.passRate > run.passRate);
  assert(pass.passing > run.passing + 3);
});

test('lineups: youth coaches start the younger of two close players; a promised QB starts', () => {
  const { api, S } = owned(402);
  const hc = api.hcOf(S, 'club-06'), wrs = S.rosters['club-06'].filter(p => p.pos === 'WR').sort((a, b) => b.rating - a.rating);
  wrs.forEach((p, i) => { p.rating = i < 2 ? 90 : 50; p.age = 27; delete p.out; }); // two clear starters, the rest far behind
  const [a, b] = [wrs[2], wrs[3]]; // the battle for the third spot
  a.rating = 75; a.age = 32; b.rating = 74; b.age = 22;
  hc.style.lineup = 'veteran';
  assert(api.clubUnits(S, 'club-06').chart.WR.slice(0, 3).includes(a));
  hc.style.lineup = 'youth';
  assert(api.clubUnits(S, 'club-06').chart.WR.slice(0, 3).includes(b));
  const qb3 = S.rosters['club-06'].filter(p => p.pos === 'QB').sort((x, y) => x.rating - y.rating)[0];
  hc.qbStarter = qb3.id;
  assert.equal(api.clubUnits(S, 'club-06').chart.QB[0], qb3);
});

test('development coaches grow young players faster', () => {
  const grow = dev => { const { api, S } = owned(403); for (const t of api.clubs) api.hcOf(S, t.id).ratings.development = dev;
    const young = Object.values(S.rosters).flat().filter(p => p.age <= 23); const before = young.reduce((a, p) => a + p.rating, 0);
    api.developPlayers(S, api.rngFor({ state: 5 })); return young.reduce((a, p) => a + p.rating, 0) - before; };
  assert(grow(90) > grow(40));
});

test('better scouting reads the draft board more accurately', () => {
  const { api, S } = owned(404);
  const err = scouting => { api.gmOf(S, 'club-06').ratings.scouting = scouting;
    return S.draft.prospects.slice(0, 80).reduce((a, p) => a + Math.abs(api.perceivedGrade(S, 'club-06', p) - Math.round(.55 * p.potential + .45 * p.rating)), 0); };
  assert(err(90) < err(45));
});

test('a better negotiator pays less in trades and contracts', () => {
  const { api, S } = owned(405);
  const p = S.rosters['club-17'].sort((a, b) => b.rating - a.rating)[0], mine = S.rosters['club-06'].find(x => x.contract.yearsLeft === 1);
  api.gmOf(S, 'club-06').ratings.negotiation = 90;
  const good = [api.termsNeeded(p, null, S), api.extensionTerms(S, mine).salary];
  api.gmOf(S, 'club-06').ratings.negotiation = 35;
  const bad = [api.termsNeeded(p, null, S), api.extensionTerms(S, mine).salary];
  assert(good[0] < bad[0] && good[1] < bad[1]);
});

test('firing pays out the contract and installs an interim; interviews talk about your roster', () => {
  const { api, S } = owned(406);
  const old = api.hcOf(S, 'club-06'), cost = old.contract.salary * old.contract.years;
  assert.equal(api.fireStaff(S, 'hc'), 'ok');
  assert(api.hcOf(S, 'club-06').interim);
  assert(S.finance.ledger.at(-1).lines.staffBuyout <= -cost + 0.01);
  const c = S.staff.market.hc[0];
  api.interview(S, 'hc', c.id);
  const names = S.rosters['club-06'].map(p => p.name);
  assert(c.interview.statements.some(t => names.some(n => t.includes(n))), 'mentions real players');
  assert.equal(api.hire(S, 'hc', c.id), 'ok');
  assert.equal(api.hcOf(S, 'club-06'), c);
  assert.deepEqual(c.commitments, c.interview.commitments);
  assert.equal(api.hire(S, 'hc', S.staff.market.hc[0].id), 'filled');
});

test('the February review checks promises against what happened', () => {
  const { api, S } = owned(407);
  api.fireStaff(S, 'hc');
  const c = S.staff.market.hc.find(x => x.style.lineup !== 'merit'); // merit coaches may call QB an open competition
  api.interview(S, 'hc', c.id); api.hire(S, 'hc', c.id);
  c.commitments.push({ type: 'needPosition', pos: 'LS' }); // a request the GM will not fill
  api.jumpTo(S, 23);
  const e = S.events.find(x => x.type === 'staffReview');
  assert(e);
  const coach = e.report.find(x => x.role === 'hc');
  assert(coach.results.some(x => /start at QB/.test(x.text)));
  assert(coach.results.some(x => x.blame === 'gm'), 'an unfilled request is blamed on the GM');
  assert.match(api.describeEvent(e, S), /blames the GM/);
});

test('approvals: big GM signings wait for the owner, and approving sends the offer', () => {
  const { api, S } = owned(409); // about one seed in twelve draws no signing worth asking about
  api.setDirective(S, 'approvalOver', 2);
  api.setDirective(S, 'approach', 'win-now'); // so the GM chases veterans too
  api.jumpTo(S, 27);
  let P; for (let i = 0; i < 10 && !P; i++) { api.advance(S); P = S.staff.proposals.find(x => x.kind === 'fa' && S.fa.pool.some(p => p.id === x.playerId)); }
  assert(P, 'the GM asked first');
  assert(api.termsHit(P.terms) > 2);
  assert(!S.rosters['club-06'].some(p => p.id === P.playerId));
  assert.equal(api.approveProposal(S, P.id), 'ok');
  assert(S.fa.offers[P.playerId]);
  const Q = S.staff.proposals[0];
  if (Q) { api.declineProposal(S, Q.id); assert(!S.staff.proposals.includes(Q)); }
});

test('focus: the owner’s priority shows up on the GM’s draft board', () => {
  let focused = 0, unfocused = 0;
  for (let seed = 410; seed < 430; seed++) {
    const { api, S } = owned(seed);
    const pool = S.draft.prospects;
    if (api.bestFor(S, 'club-06', pool).pos === 'QB') unfocused++;
    api.setDirective(S, 'focus', 'QB');
    if (api.bestFor(S, 'club-06', pool).pos === 'QB') focused++;
  }
  assert(focused > unfocused, `QB first ${focused} vs ${unfocused}`);
});

test('the coach objects to trading away one of his starters', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  const starter = api.clubUnits(S, 'club-06').chart.WR[0];
  const target = S.rosters['club-17'].filter(p => p.pos === 'CB').sort((a, b) => a.rating - b.rating)[0];
  api.tradeQuote(S, 'club-17', target.id);
  S.offer.draftOut = starter.id;
  assert.match(api.negotiationView(S), /does not want to lose/);
});

test('the carousel: AI clubs replace staff after bad years and hire from the shared pool', () => {
  const { api, S } = owned(431);
  api.jumpTo(S, 22);
  for (const t of api.clubs) if (t.id !== 'club-06') api.hcOf(S, t.id).hired = { season: 0 };
  api.advance(S); // February Week 1: review and firings
  assert(S.staff.openings.length > 0);
  api.fireStaff(S, 'hc');
  const fav = S.staff.market.hc[0];
  api.interview(S, 'hc', fav.id);
  for (const o of S.staff.openings) o.role = 'hc';
  let guard = 0; while (S.staff.market.hc.includes(fav) && guard++ < 20) api.fillOpenings(S, api.rngFor({ state: guard }));
  if (!S.staff.market.hc.includes(fav)) assert(S.events.some(e => e.type === 'candidateLost'));
  api.jumpTo(S, 31);
  assert.equal(S.staff.openings.length, 0, 'every opening is filled by April');
});

test('staff salaries are part of football operations in the books', () => {
  const { api, S } = owned(432);
  const g = api.cur(S).weeks[0].find(x => x.home === 'club-06' || x.away === 'club-06');
  const base = api.weekLines(S, g).footballOps;
  api.hcOf(S, 'club-06').contract.salary += 9;
  assert(api.weekLines(S, g).footballOps < base - 0.4);
});

test('staff page renders cards, instructions and a candidate search', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  let html = api.staffView();
  assert(html.includes('Head coach') && html.includes('instructions to the GM'));
  api.fireStaff(S, 'gm');
  html = api.staffView();
  assert(html.includes('General manager search') && html.includes('data-interview'));
  assert(!/<script|onerror/i.test(html));
});


// ---- Depth chart, game day, injured reserve, practice squad ------------------
test('v9 save upgrades to v10: practice squads, depth chart and IR books', () => {
  const { api } = load();
  const S = api.upgrade(JSON.parse(v9Save)).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  for (const t of api.clubs) assert.equal(api.practiceOf(S, t.id).length, 16);
  assert.deepEqual(S.depth, { order: {}, inactive: [], active: [], overrides: 0 });
  assert.equal(S.staff.directives.rosterMoves, 'gm');
  assert(Object.values(S.staff.clubs).every(c => c.hc.trust === 70));
});

test('game day: 48 dress, inactives do not play, and the owner can force either way', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  const act = api.activesFor(S, 'club-06');
  assert(act.length <= 48);
  const sitting = api.inactivesFor(S, 'club-06');
  assert(sitting.length >= 1);
  const chart = Object.values(api.clubUnits(S, 'club-06').chart).flat();
  assert(sitting.every(p => !chart.includes(p)), 'inactive players are not on the game chart');
  api.toggleActive(S, sitting[0].id);
  assert(api.activesFor(S, 'club-06').includes(sitting[0]));
  const starter = api.clubUnits(S, 'club-06').chart.WR[0];
  api.toggleActive(S, starter.id);
  assert(!api.activesFor(S, 'club-06').includes(starter));
});

test('the owner can overrule the coach’s depth chart, and the coach keeps count', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  const hc = api.hcOf(S, 'club-06'), trust = hc.trust;
  const qbs = api.clubUnits(S, 'club-06').chart.QB, backup = qbs[1];
  assert.equal(api.moveDepth(S, backup.id, -1), 'ok');
  assert.equal(api.clubUnits(S, 'club-06').chart.QB[0], backup);
  assert.equal(S.depth.overrides, 1);
  assert(hc.trust < trust);
  api.resetDepth(S);
  assert.equal(api.clubUnits(S, 'club-06').chart.QB[0], qbs[0]);
  for (let i = 0; i < 24; i++) { const q = api.clubUnits(S, 'club-06').chart.QB; api.moveDepth(S, q[1].id, -1); } // every other swap restores his choice
  assert(S.events.some(e => e.type === 'coachUnhappy'));
});

test('benching the quarterback the coach promised to start is blamed on the owner', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  api.fireStaff(S, 'hc');
  const c = S.staff.market.hc[0]; api.interview(S, 'hc', c.id); api.hire(S, 'hc', c.id);
  const promise = c.commitments.find(x => x.type === 'qbStarter') ?? (c.commitments.push({ type: 'qbStarter', playerId: api.clubUnits(S, 'club-06').chart.QB[0].id, name: 'him' }), c.commitments.at(-1));
  c.qbStarter = promise.playerId;
  const other = S.rosters['club-06'].find(p => p.pos === 'QB' && p.id !== promise.playerId);
  S.depth.order.QB = [other.id, promise.playerId];
  while (api.cur(S).completed < 18) api.advance(S);
  api.staffReview(S);
  const e = S.events.at(-1), res = e.report.find(x => x.role === 'hc').results.find(x => /start at QB/.test(x.text));
  assert.equal(res.blame, 'owner');
  assert.match(api.describeEvent(e, S), /your call/);
});

test('injured reserve: the GM moves a long-term injury off the 53 and fills the spot', () => {
  const { api, S } = owned(501);
  const p = S.rosters['club-06'].find(x => x.pos === 'WR');
  p.out = 10;
  api.manageRoster(S, api.rngFor({ state: 1 }));
  assert(p.ir, 'on IR');
  assert.equal(api.rosterCount(S, 'club-06'), 53, 'replacement promoted or signed');
  assert(S.events.some(e => e.type === 'rosterMoves'));
  for (let i = 0; i < 10; i++) api.advance(S);
  assert(!p.ir, 'back from IR once healthy');
  assert(S.irReturns.counts['club-06'] >= 1, 'his return is counted (other injuries may add more)');
  assert.equal(api.rosterCount(S, 'club-06'), 53);
});

test('an owner running the roster gets alerts instead of automatic moves', () => {
  const { api, S } = owned(502);
  api.setDirective(S, 'rosterMoves', 'owner');
  const p = S.rosters['club-06'].find(x => x.pos === 'OT');
  p.out = 9;
  api.manageRoster(S, api.rngFor({ state: 2 }));
  assert(!p.ir);
  assert(api.rosterAlerts(S).some(a => /injured reserve/.test(a)));
  const ps = api.practiceOf(S, 'club-06')[0];
  assert.equal(api.promote(S, 'club-06', ps.id), 'rosterFull');
  assert.equal(api.placeOnIR(S, 'club-06', p.id), 'ok');
  assert.equal(api.promote(S, 'club-06', ps.id), 'ok');
  assert(S.rosters['club-06'].includes(ps) && ps.contract.kind === 'minimum');
});

test('practice squads: cheap, on the cap, refilled from young cuts, expired each league year', () => {
  const { api, S } = owned(503);
  const before = api.committed(S, 'club-06');
  api.releasePractice(S, 'club-06', api.practiceOf(S, 'club-06')[0].id);
  assert(api.committed(S, 'club-06') < before, 'practice salaries count against the cap');
  api.jumpTo(S, 28);
  assert(api.clubs.every(t => api.practiceOf(S, t.id).length === 0), 'deals expire at the league year');
  api.jumpTo(S, 50);
  for (const t of api.clubs) { const ps = api.practiceOf(S, t.id); assert(ps.length === 16 && ps.every(p => p.age <= 26 && p.contract.kind === 'practice'), t.id); }
});

test('other clubs can poach practice-squad players', () => {
  const { api, S } = owned(504);
  const star = api.practiceOf(S, 'club-06')[0]; star.rating = 70;
  api.poachPractice(S, () => 0);
  assert(!api.practiceOf(S, 'club-06').includes(star));
  assert(S.events.some(e => e.type === 'practicePoached'));
});

test('depth chart page renders roster, IR and practice squad', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  const p = S.rosters['club-06'].find(x => x.pos === 'S'); p.out = 8; api.placeOnIR(S, 'club-06', p.id);
  p.name = '<img src=x> Safety';
  const html = api.depthView();
  assert(html.includes('Practice squad') && html.includes('Injured reserve') && html.includes('data-depth'));
  assert(!html.includes('<img src=x>'));
});


// ---- Auto-hire, GM trade proposals, offers from other clubs ------------------
const advanceUntil = (api, S, cond, weeks = 18) => { for (let i = 0; i < weeks && !cond(); i++) api.advance(S); return cond(); };

test('v10 save upgrades to v11, and an open job is filled after four weeks', () => {
  const { api } = load();
  const S = api.upgrade(JSON.parse(v10Save)).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  assert.equal(S.staff.directives.tradeAuthority, 'all');
  assert(api.hcOf(S, 'club-06').interim && api.hcOf(S, 'club-06').vacantSince);
  for (let i = 0; i < 4; i++) api.advance(S);
  assert(!api.hcOf(S, 'club-06').interim, 'the president hired someone');
  const e = S.events.find(x => x.type === 'autoHired');
  assert(e && /president/.test(api.describeEvent(e, S)));
  assert(api.hcOf(S, 'club-06').commitments.length > 0, 'his interview promises are on record');
});

test('the GM brings trade ideas, and approving one makes the trade', () => {
  const { api, S } = owned(602); // about one seed in ten draws no idea before the deadline
  assert(advanceUntil(api, S, () => S.staff.proposals.some(P => P.kind === 'trade')), 'the GM proposed something');
  const P = S.staff.proposals.find(x => x.kind === 'trade');
  assert.match(api.tradeSummary(S, P), /^Trade for /);
  assert(api.tradeRead(S, P.trade).text.length > 10);
  const res = api.approveProposal(S, P.id);
  if (res === 'ok') {
    assert(S.rosters['club-06'].some(p => p.id === P.trade.targetId));
    for (const k of P.trade.picks) assert.equal(S.picks.find(p => p.origin === k.origin && p.round === k.round).owner, P.trade.seller);
    assert(S.events.some(e => e.type === 'trade'));
  }
});

test('with authority, the GM trades on his own; first-round picks and starters still need a call under the middle setting', () => {
  const { api, S } = owned(602);
  api.setDirective(S, 'tradeAuthority', 'none');
  api.setDirective(S, 'approach', 'win-now'); // a rebuilding GM rightly refuses to buy veterans with early picks
  assert(advanceUntil(api, S, () => S.events.some(e => (e.type === 'trade' || e.type === 'tradeAway') && e.by === 'gm'), 80), 'the GM made a deal'); // AI clubs compete for targets now
  api.setDirective(S, 'tradeAuthority', 'big');
  const seller = S.rosters['club-17'][0];
  assert.equal(api.needsCall(S, { buyer: 'club-06', seller: 'club-17', targetId: seller.id, outId: null, picks: [{ origin: 'club-06', round: 1 }] }), true);
  const backup = S.rosters['club-06'].find(p => !api.starterIds(S, 'club-06').has(p.id));
  assert.equal(api.needsCall(S, { buyer: 'club-06', seller: 'club-17', targetId: seller.id, outId: backup.id, picks: [{ origin: 'club-06', round: 5 }] }), false);
});

test('other clubs make offers; accepting sends the player away for their picks', () => {
  // About three leagues in four see an offer within 30 weeks; try a few seeds rather than depend on one.
  let api, S;
  for (const seed of [603, 605, 606, 607, 608]) {
    ({ api, S } = owned(seed));
    if (advanceUntil(api, S, () => S.staff.proposals.some(P => P.kind === 'offer'), 30)) break;
  }
  assert(S.staff.proposals.some(P => P.kind === 'offer'), 'an offer arrived');
  const P = S.staff.proposals.find(x => x.kind === 'offer');
  assert.match(api.tradeSummary(S, P), / offer /);
  assert.match(api.tradeRead(S, P.trade).text, /cap room/);
  assert.equal(api.approveProposal(S, P.id), 'ok');
  assert(!S.rosters['club-06'].some(p => p.id === P.trade.targetId));
  for (const k of P.trade.picks) assert.equal(S.picks.find(p => p.origin === k.origin && p.round === k.round).owner, 'club-06');
  assert(S.events.some(e => e.type === 'tradeAway'));
});

test('unanswered trade proposals and offers expire after a week', () => {
  const { api, S } = owned(604);
  assert(advanceUntil(api, S, () => S.staff.proposals.some(P => P.kind === 'trade' || P.kind === 'offer'), 30));
  const P = S.staff.proposals.find(x => x.kind === 'trade' || x.kind === 'offer');
  api.advance(S);
  assert(!S.staff.proposals.includes(P));
  assert(S.events.some(e => e.type === 'tradeExpired'));
});

test('trade deadline after Week 10; trading reopens at the new league year', () => {
  const { api, S } = owned(605);
  for (let i = 0; i < 11; i++) api.advance(S);
  assert(!api.tradeWindow(S));
  const target = S.rosters['club-17'].find(p => p.pos === 'WR');
  api.tradeQuote(S, 'club-17', target.id);
  assert.equal(S.offer, null);
  assert.equal(api.executeTrade(S, { buyer: 'club-06', seller: 'club-17', targetId: target.id, picks: [] }), 'closed');
  const before = S.staff.proposals.filter(P => P.trade).length;
  api.advance(S);
  assert.equal(S.staff.proposals.filter(P => P.trade && P.week === api.now(S)).length, 0, 'no new trade talk after the deadline');
  api.jumpTo(S, 28);
  assert(api.tradeWindow(S));
  assert(before >= 0);
});

test('executeTrade checks the cap and both rosters', () => {
  const { api, S } = owned(606);
  const k = S.rosters['club-17'].find(p => p.pos === 'K');
  assert.equal(api.executeTrade(S, { buyer: 'club-06', seller: 'club-17', targetId: k.id, picks: [] }), 'depth', 'a club keeps its only kicker');
  const big = S.rosters['club-17'].sort((a, b) => api.capHit(b) - api.capHit(a))[0];
  S.cap.dead['club-06'] = api.capRoom(S, 'club-06');
  assert.equal(api.executeTrade(S, { buyer: 'club-06', seller: 'club-17', targetId: big.id, picks: [] }), 'cap');
});


test('rivals pay a premium: division +20%, conference +8%, nothing across conferences', () => {
  const { api, S } = owned(701); // Cincinnati: Charter North
  assert.equal(api.rivalFactor('club-06', 'club-07'), 1.2);   // Cleveland, same division
  assert.equal(api.rivalFactor('club-06', 'club-01'), 1.08);  // Buffalo, same conference
  assert.equal(api.rivalFactor('club-06', 'club-21'), 1);     // Chicago, other conference
  const p = S.rosters['club-07'].filter(x => x.pos === 'WR').sort((a, b) => b.rating - a.rating)[0];
  const div = api.termsNeeded(p, null, S, 'club-07'), conf = api.termsNeeded(p, null, S, 'club-01'), other = api.termsNeeded(p, null, S, 'club-21');
  assert(div > conf && conf > other, `${div} > ${conf} > ${other}`);
  const mine = S.rosters['club-06'].filter(x => x.pos === 'DE').sort((a, b) => b.rating - a.rating)[0];
  const offer = buyer => ({ buyer, seller: 'club-06', targetId: mine.id, outId: null, picks: [{ origin: buyer, round: 2 }] });
  const fromRival = api.tradeRead(S, offer('club-07')), fromAfar = api.tradeRead(S, offer('club-21'));
  assert(fromRival.ratio < fromAfar.ratio, 'the same picks are worth less coming from a rival');
  assert.match(fromRival.text, /division rival/);
  api.tradeQuote(S, 'club-07', p.id);
  assert.match(api.negotiationView(S), /division rival, so they want a premium/);
});


test('AI clubs trade with each other inside the window, on the same rules', () => {
  const { api, S } = owned(702);
  api.jumpTo(S, 51);
  const tx = S.league.transactions.filter(x => x.season === 1);
  assert(tx.length >= 5, `${tx.length} trades`);
  assert(tx.every(x => x.week <= 10 || x.week >= 28), 'nothing between the deadline and the league year');
  const players = tx.map(x => x.player.id);
  assert.equal(new Set(players).size, players.length, 'nobody is flipped twice in a season');
  for (const t of api.clubs) { assert.equal(api.rosterCount(S, t.id), 53); assert(api.capRoom(S, t.id) >= -0.01); }
  const p = S.rosters['club-08'].sort((a, b) => b.rating - a.rating)[0];  // Pittsburgh, Charter North
  assert(api.priceFor(S, 'club-07', 'club-08', p, null) > api.priceFor(S, 'club-21', 'club-08', p, null), 'division rivals pay more');
});

test('in-season trades keep both clubs at 53', () => {
  const { api, S } = owned(703);
  for (let i = 0; i < 9; i++) api.advance(S);
  for (const t of api.clubs) assert.equal(api.rosterCount(S, t.id), 53, t.id);
  assert(S.league.transactions.length > 0);
});


// ---- Scouting and the college wire --------------------------------------------
test('v11 save upgrades to v12: prospect traits, a wire, and the owner’s scouting', () => {
  const { api } = load();
  const S = api.upgrade(JSON.parse(v11Save)).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  assert(S.draft.prospects.every(p => p.workEthic && p.durability && p.athletic && Array.isArray(p.notes) && ['JR', 'SR'].includes(p.year)));
  assert.deepEqual(S.draft.wire, []);
  assert(S.scouting.points >= 2 && S.scouting.assign === 'gm');
});

test('v13 save upgrades to v14: twelve more open markets and renewals, nothing else moves', () => {
  const { api } = load();
  const old = JSON.parse(v13Save);
  const S = api.upgrade(old).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  assert.equal(Object.keys(S.league.markets).length, 20);
  for (const [id, M] of Object.entries(old.league.markets)) { const { renewal, fee, ...rest } = S.league.markets[id], { fee: oldFee, ...was } = M; assert.deepEqual(rest, was, id); assert(renewal > 1, id + ' renews in a later season'); assert(fee >= 1, id + ' fee follows market size'); }
  assert.equal(old.league.contest.status, 'decided');
  assert.equal(S.league.markets.columbus.renewal, 6, 'Cleveland renewed Columbus for five seasons');
  assert.equal(S.league.contest, undefined);
  const open = S.league.contests.filter(c => c.status === 'open').map(c => c.marketId);
  for (const id of ['austin', 'calgary', 'guadalajara', 'monterrey', 'vancouver']) assert(open.includes(id), id + ': unclaimed markets open now');
  for (const id of open) { const M = S.league.markets[id]; assert(!M.holder || M.renewal <= api.cur(S).number, id + ' is due'); }
  assert(S.league.contests.every(c => c.deadlineWeek === api.cur(S).tick + 4 || c.status === 'decided'));
  assert.deepEqual(S.world.markets.slice(0, 8), old.world.markets);
  assert.deepEqual(S.world.sites.slice(0, 16), old.world.sites);
  const added = S.world.sites.slice(16);
  assert.equal(added.length, 18, 'two sites in each of the nine new relocation markets');
  assert(added.every(x => x.status === 'open' && x.expiresWeek > api.cur(S).tick));
  assert(!S.world.markets.some(m => m.id === 'milwaukee'), 'TV-only markets have no stadium sites');
  api.playWeek(S);
});

test('open markets: twenty broadcast markets, some unclaimed, the bigger ones open to relocation', () => {
  const { api, S } = owned(901);
  assert.equal(api.OPEN_MARKETS.length, 20);
  assert.equal(S.world.markets.length, api.RELOCATION_MARKETS.length);
  assert.equal(S.world.sites.length, 2 * api.RELOCATION_MARKETS.length);
  const unclaimed = Object.entries(S.league.markets).filter(([, M]) => M.holder === null).map(([id]) => id).sort();
  assert.deepEqual(unclaimed, ['austin', 'calgary', 'guadalajara', 'monterrey', 'vancouver']);
  for (const id of unclaimed) assert.equal(Object.keys(S.league.markets[id].fans).length, 2, id + ': the two nearest clubs have a following');
  assert.deepEqual(S.world.markets.find(m => m.id === 'monterrey').officials.map(o => o.title), ['Mayor', 'Governor']);
  assert.deepEqual(S.world.markets.find(m => m.id === 'mexico-city').officials.map(o => o.title), ['Head of Government', 'Tourism Secretary']);
  const before = { ...S.league.markets.austin.fans };
  for (let i = 0; i < 4; i++) api.playWeek(S);
  assert(Object.keys(before).some(id => S.league.markets.austin.fans[id] > before[id]), 'fans grow in an unclaimed market');
  assert.match(api.leagueView(), /Unclaimed/);
});

test('map labels do not overlap', () => {
  const { api } = load();
  const boxes = api.mapLabels(api.mapPoints(api.save), s => s.length * 6.5).map(l => l.box);
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const [a, b] = [boxes[i], boxes[j]];
    assert(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y, 'labels ' + i + ' and ' + j + ' overlap');
  }
});

test('the college wire runs all fall: varied items, prospect histories, moving stock', () => {
  const { api, S } = owned(801);
  for (let i = 0; i < 8; i++) api.advance(S);
  assert.equal(S.draft.wire.length, 8);
  for (const w of S.draft.wire) { const ids = w.items.filter(x => x.pid).map(x => x.pid); assert.equal(new Set(ids).size, ids.length, 'one item per prospect per week'); }
  const featured = S.draft.prospects.filter(p => p.notes.length);
  assert(featured.length >= 15);
  assert(featured.some(p => p.grade !== p.startGrade));
});

test('scouting: points each week, three visits per prospect, and the truth replaces the hype', () => {
  const { api, S } = owned(802);
  api.setScoutAssign(S, 'owner');
  const p = S.draft.prospects[30];
  p.grade = Math.round(api.trueGrade(p)) + 12; // the wire has hyped him
  const before = Math.abs(api.perceivedGrade(S, 'club-06', p) - api.trueGrade(p));
  S.scouting.points = 5;
  for (let i = 0; i < 3; i++) assert.equal(api.scoutProspect(S, p.id), 'ok');
  assert.equal(api.scoutProspect(S, p.id), 'maxed');
  const after = Math.abs(api.perceivedGrade(S, 'club-06', p) - api.trueGrade(p));
  assert(after < before, `error ${before.toFixed(1)} -> ${after.toFixed(1)}`);
  assert(api.perceivedGrade(S, 'club-07', p) > api.trueGrade(p) + 3, 'unscouted rivals still believe the hype');
  assert(api.scoutingReport(S, p).some(t => /overrated/.test(t)));
  S.scouting.points = 0;
  assert.equal(api.scoutProspect(S, S.draft.prospects[31].id), 'noPoints');
  api.advance(S);
  assert.equal(S.scouting.points, api.pointsPerWeek(S), 'points refresh weekly');
});

test('the GM spends leftover scouting points unless the owner keeps them', () => {
  const gm = owned(803); gm.api.advance(gm.S); gm.api.advance(gm.S);
  assert(Object.keys(gm.S.scouting.levels).length > 0);
  const me = owned(803); me.api.setScoutAssign(me.S, 'owner'); me.api.advance(me.S); me.api.advance(me.S);
  assert.equal(Object.keys(me.S.scouting.levels).length, 0);
});

test('January declarations send juniors back to school; they return as seniors next year', () => {
  const { api, S } = owned(804);
  api.jumpTo(S, 21);
  const back = S.draft.nextClass;
  assert(back.length > 0 && back.every(p => p.year === 'JR' && p.notes.some(n => /Returned/.test(n.text))));
  assert(!S.draft.prospects.some(p => back.some(b => b.id === p.id)));
  api.jumpTo(S, 26);
  assert(S.draft.combineDone);
  assert(S.draft.wire.some(w => w.week === 26));
  api.jumpTo(S, 51);
  const returned = S.draft.prospects.filter(p => back.some(b => b.id === p.id));
  assert.equal(returned.length, back.length);
  assert(returned.every(p => p.year === 'SR'));
});

test('drafted players keep their college story, and work ethic shapes their ceiling', () => {
  const { api, S } = owned(805);
  const lazy = { rating: 60, potential: 85, workEthic: 30, durability: 50, notes: [] }, driven = { ...lazy, workEthic: 95 };
  assert(api.rookieFrom(driven).potential > api.rookieFrom(lazy).potential);
  api.jumpTo(S, 33);
  for (const p of S.draft.prospects.slice(0, 40)) api.toggleWatch(S, p.id);
  api.jumpTo(S, 35);
  const rookies = S.rosters['club-06'].filter(p => p.drafted?.season === 1);
  assert(rookies.length && rookies.every(p => Array.isArray(p.collegeNotes) && p.durability));
  const e = S.events.find(x => x.type === 'draftDone');
  if (e.picks.some(x => x.seen)) assert.match(api.describeEvent(e, S), /You followed him/);
});

test('draft page shows the wire, the board and a prospect profile', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  for (let i = 0; i < 3; i++) api.advance(S);
  const p = S.draft.prospects.find(x => x.notes.length);
  api.draftUi.profile = p.id;
  const html = api.draftView();
  assert(html.includes('College wire') && html.includes('Big board') && html.includes('data-scoutp') && html.includes(p.notes[0].text.slice(0, 20)));
  assert(!/<script|onerror/i.test(html));
});

const FICTIONAL = /Allegheny State|Bayou Tech|Cascade|Central Prairie|Delta A&M|Eastern Ridge|Great Lakes Tech|Gulf State|High Plains|Iron Range|Keystone Valley|Lakeshore|Magnolia|North Woods|Ozark State|Palmetto(?! Bowl)|Piedmont|Red River(?! Rivalry)|Sierra Tech|Tidewater|Twin Rivers|Western Plateau/;
test('v14 save upgrades: the class in progress moves to real schools by talent, and its stories follow', () => {
  const { api } = load();
  const old = JSON.parse(v14Save);
  const S = api.upgrade(old).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  assert.deepEqual(S.draft.prospects.map(p => p.id).sort(), old.draft.prospects.map(p => p.id).sort(), 'same prospects');
  const real = new Set(api.COLLEGE_TIERS.flat());
  assert(S.draft.prospects.every(p => real.has(p.college)), 'every prospect at a real school');
  assert(!FICTIONAL.test(JSON.stringify(S.draft)), 'no fictional school left in the class, its wire or its notes');
  const was = new Map(old.draft.prospects.map(p => [p.id, p]));
  const featured = S.draft.wire.flatMap(w => w.items).filter(it => it.pid && /\(/.test(it.text));
  assert(featured.length > 5 && featured.every(it => it.text.includes('(' + S.draft.prospects.find(p => p.id === it.pid).college + ')')), 'wire items name his new school');
  const elite = [...S.draft.prospects].sort((a, b) => (.55 * b.potential + .45 * b.rating) - (.55 * a.potential + .45 * a.rating)).slice(0, 48);
  assert(elite.filter(p => api.collegeTier(p.college) === 0).length > elite.filter(p => api.collegeTier(p.college) === 3).length * 3, 'schools follow talent');
  const p = S.draft.prospects.find(x => api.collegeTier(x.college) === 3);
  assert.equal(p.grade - was.get(p.id).grade, -4, 'a small-school kid picks up the sleeper discount');
  assert(S.draft.slate.length >= 14 && S.draft.slate.every(g => !g.winner));
  for (let i = 0; i < 7; i++) api.playWeek(S);
  assert(S.draft.slate.filter(g => g.week <= 7).every(g => !g.winner), 'games already past are skipped');
  assert(S.draft.slate.some(g => g.week > 7 && g.week <= api.now(S) && g.winner), 'later big games are played');
});

test('v15 save upgrades to v16: real schools stay put, fictional ones in history get real names', () => {
  const { api } = load();
  const old = JSON.parse(v15Save);
  const S = api.upgrade(old).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  assert.deepEqual(S.draft.prospects, [...old.draft.prospects].sort((a, b) => b.grade - a.grade), 'a real-school class is untouched');
  const T = JSON.parse(v15Save);
  T.draftHistory = [{ season: 0, picks: [{ overall: 1, round: 1, club: 'club-01', name: 'Ty Old', pos: 'QB', college: 'Bayou Tech' }] }];
  const vet = Object.values(T.rosters)[0][0];
  vet.drafted = { season: 0, round: 1, overall: 1, college: 'Palmetto' };
  vet.collegeNotes = [{ season: 0, week: 13, text: 'Had 3 sacks against Red River.' }];
  T.draft.wire[0].items.push({ kind: 'score', text: 'Elsewhere: Iron Range 24, Twin Rivers 10.' }, { kind: 'game', text: 'The Palmetto Bowl: South Carolina 20, Clemson 17.' });
  const U = api.upgrade(T).save;
  assert.equal(U.draftHistory[0].picks[0].college, 'LSU');
  const v = Object.values(U.rosters).flat().find(p => p.id === vet.id);
  assert.equal(v.drafted.college, 'South Carolina');
  assert.equal(v.collegeNotes[0].text, 'Had 3 sacks against Oklahoma.');
  const items = U.draft.wire[0].items.map(x => x.text);
  assert(items.includes('Elsewhere: Minnesota 24, Iowa 10.'));
  assert(items.includes('The Palmetto Bowl: South Carolina 20, Clemson 17.'), 'the real Palmetto Bowl is left alone');
  assert.equal(new Set(Object.values(api.LEGACY_COLLEGES)).size, 22);
});

test('schools follow the talent: blue bloods get the elite and the hype, small schools hide sleepers', () => {
  const { api } = load();
  const elite = [0, 0, 0, 0], hype = [[], [], [], []], volume = [0, 0, 0, 0];
  for (const seed of [901, 902, 903, 904, 905, 906, 907, 908]) {
    const S = api.newSave(seed), all = [...S.draft.prospects];
    assert.equal(new Set(all.map(p => p.college)).size > 50, true, 'most programs show up in a class');
    assert(all.every(p => api.COLLEGE_TIERS.flat().includes(p.college)));
    all.sort((a, b) => (.55 * b.potential + .45 * b.rating) - (.55 * a.potential + .45 * a.rating)).slice(0, 48).forEach(p => elite[api.collegeTier(p.college)]++);
    for (const p of all) { hype[api.collegeTier(p.college)].push(p.grade - api.trueGrade(p)); volume[api.collegeTier(p.college)]++; }
  }
  const per = volume.map((n, t) => n / 8 / api.COLLEGE_TIERS[t].length);
  assert(per[0] > 9 && per[3] < 2.5 && per[0] > per[1] && per[1] > per[2] && per[2] > per[3], 'prospects per school by tier: ' + per.map(x => x.toFixed(1)));
  assert(elite[0] > elite[1] && elite[1] > elite[2] && elite[2] > elite[3], 'elite talent by tier: ' + elite);
  assert(elite[3] > 0, 'a few elite prospects come from small schools');
  const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
  assert(mean(hype[0]) > mean(hype[3]) + 4, 'blue bloods are overrated next to small schools');
});

test('big games: rivalry week floods the wire with duels and big swings, then the playoff plays out', () => {
  const { api, S } = owned(906);
  api.jumpTo(S, 13);
  const week = S.draft.wire.find(w => w.week === 13);
  const ids = week.items.flatMap(x => [x.pid, x.pid2]).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length, 'one item per prospect per week');
  assert(week.items.some(x => x.kind === 'game' && /^The Iron Bowl: /.test(x.text)));
  assert(week.items.filter(x => x.kind === 'game').length === 8, 'eight rivalry games');
  assert(week.items.some(x => x.kind === 'game' && /^The Bayou Classic: /.test(x.text)));
  assert(S.draft.wire.find(w => w.week === 2).items.some(x => x.kind === 'game' && /^The Border War: Kansas \d+, Missouri \d+\.$/.test(x.text)), 'the Border War opens the fall');
  assert(week.items.length > 10, 'rivalry week is the busiest week of the wire');
  const games = S.draft.slate.filter(g => g.week === 13);
  assert(games.every(g => g.winner && g.score[0] !== g.score[1] && [g.home, g.away].includes(g.winner)));
  const featured = S.draft.prospects.filter(p => p.notes.some(n => n.week === 13 && /Iron Bowl|The Game|Palmetto|Sunshine|Egg Bowl|Governor|Bayou|Notre Dame|USC/.test(n.text)));
  assert(featured.length >= 4);
  api.jumpTo(S, 19);
  const k = kind => S.draft.slate.filter(g => g.kind === kind && g.winner);
  assert.equal(k('title').length, 2);
  assert.equal(k('quarterfinal').length, 4);
  assert.equal(k('semifinal').length, 2);
  assert.equal(k('final').length, 1);
  assert(k('semifinal').every(g => k('quarterfinal').some(q => q.winner === g.home)), 'the bracket advances winners');
  assert(S.draft.wire.some(w => w.items.some(x => /^The national championship: /.test(x.text))));
});

test('draft page lists the big games ahead and a prospect’s program', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  api.advance(S);
  let html = api.draftView();
  assert.match(html, /Big games ahead/);
  assert.match(html, /Red River Rivalry/);
  api.draftUi.profile = S.draft.prospects[0].id;
  html = api.draftView();
  assert.match(html, /blue blood|power program|FBS program|small school/);
});

// ---- Play-by-play engine --------------------------------------------------
const engineGames = (api, n, opts = {}) => {
  const S = api.newSave(31), units = api.clubs.map(t => api.clubUnits(S, t.id)), r = api.rngFor({ seed: 5, state: 5 });
  return Array.from({ length: n }, (_, i) => api.playGame(units[i % 32], units[(i * 7 + 3) % 32 === i % 32 ? (i + 1) % 32 : (i * 7 + 3) % 32], r, opts));
};
test('play engine: the same seed plays the same game, with or without the play log', () => {
  const { api } = load();
  const S = api.newSave(8), h = api.clubUnits(S, 'club-06'), a = api.clubUnits(S, 'club-07');
  const one = api.playGame(h, a, api.rngFor({ seed: 3, state: 3 }));
  const two = api.playGame(h, a, api.rngFor({ seed: 3, state: 3 }), { log: true });
  assert.deepEqual(one.score, two.score);
  assert.deepEqual(one.box, two.box);
  assert(two.plays.length > 120 && !one.plays);
  assert.deepEqual(two.plays.at(-1).score, two.score);
});
test('play engine: games finish, the clock only runs down, and the log adds up', () => {
  const { api } = load();
  for (const g of engineGames(api, 300, { log: true })) {
    let q = 1, clock = 900;
    for (const p of g.plays) {
      assert(p.clock >= 0);
      if (p.kind === 'play') assert(p.down >= 1 && p.down <= 4 && p.yl >= 0 && p.yl <= 100);
      if (p.q === q) assert(p.clock <= clock, 'clock went up in quarter ' + q);
      q = p.q; clock = p.clock;
    }
    assert(['Final.', 'Final in overtime.'].includes(g.plays.at(-1).text));
    if (!g.ot) assert.notEqual(g.score[0], g.score[1]);
    const t = g.box.teams;
    for (const x of t) assert.equal(x.yards, x.passYards + x.rushYards);
    if (!g.ot) assert.equal(t[0].top + t[1].top, 3600);
  }
});
test('play engine: playoff games never end tied; regular-season ties are rare', () => {
  const { api } = load();
  assert(engineGames(api, 400, { playoff: true }).every(g => g.score[0] !== g.score[1]));
  const ties = engineGames(api, 2000).filter(g => g.score[0] === g.score[1]).length;
  assert(ties < 40, ties + ' ties');
});
test('play engine: league-wide numbers look like pro football', () => {
  const { api } = load();
  const games = engineGames(api, 1500), teams = games.flatMap(g => g.box.teams);
  const avg = k => teams.reduce((a, x) => a + x[k], 0) / teams.length;
  const points = games.reduce((a, g) => a + g.score[0] + g.score[1], 0) / teams.length;
  assert(points > 18 && points < 26, 'points ' + points);
  assert(avg('yards') > 290 && avg('yards') < 380, 'yards ' + avg('yards'));
  assert(avg('plays') > 56 && avg('plays') < 72, 'plays ' + avg('plays'));
  const comp = teams.reduce((a, x) => a + x.comp, 0) / teams.reduce((a, x) => a + x.passAtt, 0);
  assert(comp > .58 && comp < .7, 'completion ' + comp);
  const home = games.filter(g => g.score[0] > g.score[1]).length / games.filter(g => g.score[0] !== g.score[1]).length;
  assert(home > .5 && home < .62, 'home ' + home);
});

test('player ratings: a star receiver draws more targets and does more with them', () => {
  const { api } = load();
  const S = api.newSave(44), id = 'club-06';
  const wr2 = api.clubUnits(S, id).chart.WR[1];
  const run = () => {
    const h = api.clubUnits(S, id), r = api.rngFor({ seed: 9, state: 9 }), tally = { targets: 0, recYards: 0, games: 0 };
    for (let i = 0; i < 400; i++) {
      const opp = api.clubUnits(S, api.clubs[(i % 31) + (i % 31 >= 5 ? 1 : 0)].id);
      const p = api.playGame(h, opp, r).box.players[wr2.id];
      tally.targets += p?.targets ?? 0; tally.recYards += p?.recYards ?? 0; tally.games++;
    }
    return tally;
  };
  const before = run();
  const old = wr2.rating;
  wr2.rating = Math.min(99, old + 20);
  const after = run();
  wr2.rating = old;
  assert(after.targets > before.targets * 1.3, before.targets + ' -> ' + after.targets + ' targets');
  assert(after.recYards / after.targets > before.recYards / before.targets, 'more yards per target');
});
test('player ratings: interceptions go to the man in coverage, sacks to the pass rush', () => {
  const { api } = load();
  for (const g of engineGames(api, 200)) for (const p of Object.values(g.box.players)) {
    if (p.defInts) assert(['CB', 'S', 'LB'].includes(p.pos), p.pos + ' intercepted');
    if (p.sacks) assert(['DE', 'DT', 'LB'].includes(p.pos), p.pos + ' sacked');
    if (p.targeted) assert(['CB', 'S', 'LB'].includes(p.pos));
  }
});
test('broadcast: the owner’s game keeps its plays, and the view presents it live', () => {
  const { api } = load();
  const S = api.newSave(12); S.club = 'club-06';
  while (!api.cur(S).weeks[api.cur(S).completed].some(g => g.home === S.club || g.away === S.club)) api.playWeek(S);
  assert(api.canWatch(S));
  api.playWeek(S);
  const B = api.broadcast(), g = api.cur(S).weeks[api.cur(S).completed - 1].find(x => x.home === S.club || x.away === S.club);
  assert(B && B.home === g.home && B.away === g.away);
  assert.deepEqual(B.score, g.score);
  assert.deepEqual(B.plays.at(-1).score, g.score);
  api.bc.i = 0;
  let html = api.broadcastView();
  assert(html.includes('LIVE') && html.includes('<svg') && !html.includes('Box score'));
  api.bc.i = 40;
  html = api.broadcastView();
  assert(html.includes('<rect') && html.includes('class="bar"'));
  api.bc.i = B.plays.length;
  html = api.broadcastView();
  assert(!html.includes('LIVE') && html.includes('Final') && html.includes('Box score'));
  assert(!/<script|onerror/i.test(html));
});
test('broadcast: the drive chart clears when the ball changes hands', () => {
  const { api } = load();
  const [g] = engineGames(api, 1, { log: true });
  for (let i = 1; i <= g.plays.length; i++) {
    const d = api.bcDrive(g.plays, i);
    assert(d.every(p => p.kind === 'play' && p.off === d[0].off));
    if (g.plays[i - 1].kind === 'kick') assert.equal(d.length, 0);
  }
});
test('broadcast: no watch button on a bye', () => {
  const { api } = load();
  const S = api.newSave(12); S.club = 'club-06';
  while (api.cur(S).weeks[api.cur(S).completed].some(g => g.home === S.club || g.away === S.club)) api.playWeek(S);
  assert(!api.canWatch(S));
});

// ---- Player season stats -----------------------------------------------------
const everyone = S => [...Object.values(S.rosters).flat(), ...Object.values(S.practice ?? {}).flat(), ...(S.fa?.pool ?? [])];
test('season stats: box scores add up, starters start, playoffs are not counted', () => {
  const { api, S } = owned(61);
  for (let i = 0; i < 6; i++) api.playWeek(S);
  const season = api.cur(S).number, lines = everyone(S).map(p => [p, api.statLine(p, season)]).filter(([, L]) => L);
  const total = k => lines.reduce((a, [, L]) => a + (L[k] ?? 0), 0);
  assert.equal(total('comp'), total('rec'), 'every completion is a catch');
  assert(total('passYards') > 0 && total('sacks') > 0 && total('fgm') > 0);
  const played = id => api.cur(S).weeks.slice(0, 6).filter(w => w.some(g => g.home === id || g.away === id)).length;
  for (const t of api.clubs) {
    const qb = S.rosters[t.id].filter(p => p.pos === 'QB' && api.statLine(p, season)).sort((a, b) => (api.statLine(b, season).gs ?? 0) - (api.statLine(a, season).gs ?? 0))[0];
    assert(api.statLine(qb, season).gs >= 1 && api.statLine(qb, season).gp <= played(t.id));
  }
  for (const [p, L] of lines) {
    assert(L.gp >= (L.gs ?? 0) && L.gp <= 6, p.id);
    assert(Object.entries(L).every(([k, v]) => k === 'club' ? v === p.stats.at(-1).club : Number.isInteger(v) && (v !== 0 || k === 'gp')), p.id + ' keeps only counts');
  }
  assert.deepEqual(api.validateSave(S), []);
  while (api.cur(S).completed < api.cur(S).weeks.length) api.playWeek(S);
  const lines_ = () => Object.fromEntries(everyone(S).map(p => [p.id, JSON.stringify(p.stats ?? null)]));
  const before = lines_();
  api.advance(S); api.advance(S);
  assert(api.cur(S).postseason?.rounds.length >= 1);
  const after = lines_(); // players can leave the pool in the playoffs; compare the ones still here
  assert.deepEqual(after, Object.fromEntries(Object.keys(after).map(id => [id, before[id] ?? 'null'])), 'playoff games leave season lines alone');
});

test('season stats move trade prices: a big year costs more, a bad one less', () => {
  const { api, S } = owned(62);
  for (let i = 0; i < 12; i++) api.playWeek(S);
  const season = api.cur(S).number;
  const wr = Object.entries(S.rosters).filter(([id]) => id !== S.club).flatMap(([, r]) => r)
    .filter(p => p.pos === 'WR' && (api.statLine(p, season)?.targets ?? 0) > 40 && !p.out).sort((a, b) => a.rating - b.rating)[3];
  const L = api.statLine(wr, season), keep = { ...L };
  const price = () => api.termsNeeded(wr, null, S);
  Object.assign(L, { rec: Math.round(L.targets * .8), recYards: L.targets * 15, recTd: Math.round(L.targets / 6), fumblesLost: 0 });
  const hot = [price(), api.statEdge(S, wr), api.tradeValue(S, wr)];
  assert.match(api.statNote(S, wr), /pricing him like a \d+, not the \d+ he is/);
  Object.assign(L, { rec: Math.round(L.targets * .3), recYards: L.targets * 3, recTd: 0, fumblesLost: 3 });
  const cold = [price(), api.statEdge(S, wr), api.tradeValue(S, wr)];
  assert.match(api.statNote(S, wr), /below the \d+ he is/);
  Object.assign(L, keep);
  assert(hot[1] > 2 && cold[1] < -2, hot[1] + ' / ' + cold[1]);
  assert(hot[0] > price() && price() > cold[0], hot[0] + ' > ' + price() + ' > ' + cold[0]);
  assert(hot[2] > cold[2]);
  assert(api.perceivedRating(S, wr) >= 40 && api.perceivedRating(S, wr) <= 99);
  // Linemen have no numbers to go on.
  const ot = S.rosters['club-10'].find(p => p.pos === 'OT');
  assert.equal(api.statEdge(S, ot), 0);
  // A season-one player with no games has no edge either way.
  assert.equal(api.statEdge(S, { ...wr, stats: [] }), 0);
});

test('season stats move contract asks: a big year asks more, a bad one less, the true market value holds', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06'; // the page renders the live save
  for (let i = 0; i < 12; i++) api.playWeek(S);
  const season = api.cur(S).number;
  const qb = S.rosters[S.club].filter(p => p.pos === 'QB' && (api.statLine(p, season)?.att ?? 0) > 150)[0];
  qb.contract.yearsLeft = 1; // on the expiring list
  const L = api.statLine(qb, season), keep = { ...L }, market = api.marketValue(S, qb);
  const ask = () => api.termsHit(api.extensionTerms(S, qb));
  const base = ask();
  Object.assign(L, { passYards: L.att * 10, passTd: Math.round(L.att / 12), ints: 0 });
  const hot = ask();
  assert.match(api.contractsView(), /big season, asking more/);
  Object.assign(L, { passYards: L.att * 4, passTd: 0, ints: Math.round(L.att / 15) });
  const cold = ask();
  assert.match(api.contractsView(), /down season, asking less/);
  assert.equal(api.marketValue(S, qb), market, 'market value is still talent alone');
  Object.assign(L, keep);
  assert(hot > base && base > cold, hot + ' > ' + base + ' > ' + cold);
});

test('season stats: last season still counts in the offseason, and the views show them', () => {
  const { api, S } = owned(63);
  api.jumpTo(S, 51);
  const n = api.cur(S).number, prev = n - 1;
  const qb = Object.values(S.rosters).flat().filter(p => p.pos === 'QB' && api.statLine(p, prev)?.att > 300).sort((a, b) => Math.abs(api.statEdge(S, b)) - Math.abs(api.statEdge(S, a)))[0];
  assert(qb && !api.statLine(qb, n) && api.statEdge(S, qb) !== 0, 'last season’s numbers carry into the offseason');
  assert.match(api.statText(qb, api.statLine(qb, prev)), /yds · \d+ TD · \d+ INT$/);
  const leaders = api.statLeaders(S, prev, 'passYards');
  assert.equal(leaders.length, 5);
  assert(leaders.every((x, i) => !i || leaders[i - 1].v >= x.v));
  leaders[0].p.name = '<b>Bold</b> & Co';
  const html = api.leadersView(S);
  assert(html.includes('League leaders · Season ' + prev) && html.includes('&lt;b&gt;Bold&lt;/b&gt; &amp; Co') && !html.includes('<b>Bold'));
});

test('v12 save upgrades to v13: no stats yet, and they start with the next game', () => {
  const { api } = load();
  const S = api.upgrade(JSON.parse(v12Save)).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  assert(S.migrations.some(m => m.from === 12 && m.to === 13));
  assert(Object.values(S.rosters).flat().every(p => p.stats === undefined));
  api.playWeek(S);
  const season = api.cur(S).number;
  assert(Object.values(S.rosters).flat().some(p => api.statLine(p, season)?.gp === 1));
  assert.deepEqual(api.validateSave(S), []);
  S.rosters['club-01'][0].stats = [{ season: 1, gp: -1, club: 'club-01' }];
  assert(api.validateSave(S).some(e => /invalid season stats/.test(e)));
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
  const downloads = html.match(/\.download\s*=/g) ?? [];
  assert(downloads.length <= 1 && /if\(!d&&standalone\)\{downloadDirect/.test(html), 'only a standalone page downloads files itself');
});

// ---- Relocation --------------------------------------------------------------
// A save in the offseason of season 3, after the new league year: the first moment a move can be filed.
const readyCache = {};
const ready = (club = 'club-06') => {
  const { api } = load();
  if (!readyCache[club]) {
    const S = api.newSave(5); S.club = club;
    while (api.cur(S).number < 3 || api.cur(S).tick < 28) api.advance(S);
    readyCache[club] = JSON.stringify(S);
  }
  const S = JSON.parse(readyCache[club]); api.applyIdentity(S);
  return { api, S };
};
const readyLive = (club = 'club-06') => {
  const { api, S } = ready(club);
  for (const k of Object.keys(api.save)) delete api.save[k];
  Object.assign(api.save, S);
  return { api, S: api.save };
};
const siteIn = (S, marketId, kind = 'downtown') => S.world.sites.find(x => x.marketId === marketId && x.kind === kind);
const runVote = (api, S) => { while (S.league.meeting.status === 'scheduled') api.advance(S); return S.league.meeting; };
const openSeason = (api, S) => { api.jumpTo(S, api.SEASON_TICKS + 1); };

test('v16 save upgrades to v17: no moves yet, no application, nothing else changes', () => {
  const { api } = load();
  const old = JSON.parse(v16Save);
  const S = api.upgrade(old).save;
  assert.equal(S.schemaVersion, api.SCHEMA_VERSION);
  assert.deepEqual(S.relocations, []);
  assert.equal(S.stadium.application, null);
  assert.equal(S.stadium.coolingUntil, 0);
  assert.deepEqual(S.rosters, old.rosters);
  assert.deepEqual(S.seasons, old.seasons);
  assert.deepEqual(S.world, old.world);
  assert.deepEqual(api.validateSave(S), []);
});

test('relocation is rare: tenure, a pending application, a denial and a late calendar each block it', () => {
  const { api } = load();
  const young = api.newSave(7); young.club = 'club-06';
  assert.equal(api.relocationBlock(young), 'tenure');
  const { api: a, S } = ready();
  assert.equal(a.relocationBlock(S), null);
  assert.equal(a.fileRelocation(S, siteIn(S, 'toronto').id), 'ok');
  assert.equal(a.relocationBlock(S), 'pending');
  assert.equal(a.fileRelocation(S, siteIn(S, 'toronto', 'edge').id), 'pending');
  assert.equal(a.withdrawRelocation(S), 'ok');
  assert.equal(a.relocationBlock(S), null);
  S.stadium.coolingUntil = a.cur(S).number + 1;
  assert.equal(a.relocationBlock(S), 'cooling');
  S.stadium.coolingUntil = 0;
  a.cur(S).tick = 49;
  assert.equal(a.relocationBlock(S), 'late');
});

test('filing sets money aside, shows the city’s estimate but charges the true figure, and refuses what you cannot cover', () => {
  const { api, S } = ready();
  const site = siteIn(S, 'toronto');
  assert(!site.infraKnown);
  assert.equal(api.relocationCosts(S, site, true).infra, site.infraEstimate);
  assert.equal(api.relocationCosts(S, site).infra, site.infraTrue);
  const F = S.finance, cash = F.ownerCash, debt = F.debt;
  assert.equal(api.fileRelocation(S, site.id, { funding: 'mix' }), 'ok');
  const A = S.stadium.application, total = api.relocationCosts(S, site).total;
  assert.equal(A.costs.total, total);
  assert.equal(A.paid.owner + A.paid.debt, total);
  assert(A.paid.debt > 0 && F.debt <= 450, 'borrows what the league allows first');
  assert.equal(F.ownerCash, +(cash - A.paid.owner - api.RELOCATION_FILING).toFixed(2));
  assert.equal(F.debt, +(debt + A.paid.debt).toFixed(2));
  assert.equal(api.withdrawRelocation(S), 'ok');
  assert.equal(F.ownerCash, +(cash - api.RELOCATION_FILING).toFixed(2), 'the filing cost is not refunded');
  assert.equal(F.debt, debt);
  F.ownerCash = 5;
  assert.equal(api.fileRelocation(S, site.id), 'short');
  assert.equal(S.stadium.application.status, 'withdrawn');
  F.ownerCash = 5000;
  assert.equal(api.fileRelocation(S, site.id, { funding: 'owner' }), 'ok');
  assert.equal(S.stadium.application.paid.debt, 0);
  assert.equal(api.fileRelocation(S, 'nowhere'), 'pending');
});

test('filing is public: the press and home city know, and the fans turn on you', () => {
  const { api, S } = ready();
  const mood = S.stadium.homeMood;
  api.fileRelocation(S, siteIn(S, 'toronto').id);
  const f = S.stadium.knowledge.at(-1);
  assert.equal(f.kind, 'relocation');
  assert(['press', 'home', 'league'].every(w => f.knownBy.includes(w)));
  assert(S.stadium.homeAware);
  assert.equal(S.stadium.homeMood, Math.max(0, mood - 25));
  assert.equal(S.league.meeting.kind, 'relocation');
  assert(S.events.some(e => e.type === 'relocationFiled') && S.league.news.at(-1).text.includes('Toronto'));
  assert.equal(api.fileRelocation(S, siteIn(S, 'toronto').id), 'pending');
});

test('the vote: a big new market passes, a weak move fails, the deposit comes back, and the owners will not hear it again soon', () => {
  const good = ready();
  good.api.fileRelocation(good.S, siteIn(good.S, 'mexico-city').id);
  const V = runVote(good.api, good.S);
  assert(V.passed && V.yes >= 24);
  assert.equal(good.S.stadium.application.status, 'approved');
  assert.equal(good.S.stadium.application.moveSeason, good.api.cur(good.S).number + 1);
  assert(good.S.events.some(e => e.type === 'relocationVote'));

  const { api, S } = ready();
  const cash = S.finance.ownerCash, debt = S.finance.debt;
  api.fileRelocation(S, siteIn(S, 'oklahoma-city').id);
  const W = runVote(api, S);
  assert(!W.passed && W.yes < 24);
  assert.equal(S.stadium.application.status, 'denied');
  assert.equal(S.finance.ownerCash, +(cash - api.RELOCATION_FILING).toFixed(2));
  assert.equal(S.finance.debt, debt);
  assert.equal(S.stadium.coolingUntil, api.cur(S).number + 2);
  assert.equal(api.relocationBlock(S), 'cooling');
  assert(S.stadium.homeMood >= 50, 'the home city is relieved');
  assert.equal(S.relocations.length, 0);
});

test('calls move owners toward a move, and a bigger market raises their lean', () => {
  const { api, S } = ready();
  api.fileRelocation(S, siteIn(S, 'san-antonio').id);
  const t = api.clubs.find(c => c.id !== S.club && api.relocationLean(S, c.id) < 0);
  const before = api.relocationLean(S, t.id);
  assert.equal(api.callOwner(S, t.id, false), 'ok');
  assert(api.relocationLean(S, t.id) > before);
  assert.equal(S.league.meeting.revealed[t.id], api.relocationLean(S, t.id));
  const big = ready(); big.api.fileRelocation(big.S, siteIn(big.S, 'mexico-city').id);
  const mean = (a, S) => a.clubs.filter(c => c.id !== S.club).reduce((x, c) => x + a.relocationLean(S, c.id), 0) / 31;
  assert(mean(big.api, big.S) > mean(api, S) + .2);
});

test('the move happens as the new season opens: market, nickname, stadium, markets, books and schedule all follow', () => {
  const { api, S } = ready();
  S.finance.projects.find(p => p.id === 'upgrade').status = 'active';
  S.finance.naming = { status: 'signed', deal: { annual: 9, years: 5, newName: 'X Field', company: 'X', week: 3 } };
  const site = siteIn(S, 'toronto');
  assert.equal(api.fileRelocation(S, site.id, { nickname: 'Voyagers' }), 'ok');
  assert(runVote(api, S).passed);
  api.jumpTo(S, 36);
  assert.equal(api.clubs.find(c => c.id === 'club-06').market, 'Cincinnati', 'still in Cincinnati until the season opens');
  openSeason(api, S);
  const me = api.clubs.find(c => c.id === 'club-06');
  assert.deepEqual([me.market, me.marketId, me.nickname, me.abbr], ['Toronto', 'toronto', 'Voyagers', 'TOR']);
  assert(!api.clubs.some(c => c.market === 'Cincinnati'));
  assert.equal(new Set(api.clubs.map(c => c.abbr)).size, 32);
  assert.deepEqual(api.validateSave(S), []);
  assert(!api.OPEN_MARKETS.some(m => m.id === 'toronto') && api.OPEN_MARKETS.some(m => m.id === 'cincinnati' && m.relocation));
  assert.deepEqual(Object.keys(S.league.markets).sort(), api.OPEN_MARKETS.map(m => m.id).sort());
  assert(S.league.markets.cincinnati.fans['club-06'] > 0 && S.league.markets.cincinnati.holder === null);
  assert(S.world.sites.filter(x => x.marketId === 'toronto').every(x => x.status === 'taken'));
  assert.equal(S.world.sites.filter(x => x.marketId === 'cincinnati' && x.status === 'open').length, 2);
  assert(S.world.markets.find(m => m.id === 'cincinnati').officials.length === 2);
  const L = S.world.leases['club-06'];
  assert.deepEqual([L.stadium.startsWith('Toronto '), L.capacity, L.yearsLeft, L.condition, L.parking], [true, site.maxSeats, 30, 'Modern', site.parking]);
  assert.equal(S.finance.naming.status, 'none');
  assert.equal(S.finance.projects.find(p => p.id === 'upgrade').status, 'proposed', 'video boards stay behind');
  assert.equal(S.stadium.homeMood, 75 + 8);
  assert(!S.stadium.homeAware);
  assert.equal(S.stadium.application.status, 'done');
  assert(S.events.some(e => e.type === 'relocated'));
  // The new season is drawn with the club's new identity, and the books use the new city.
  const counts = {};
  for (const week of api.cur(S).weeks) for (const g of week) for (const id of [g.home, g.away]) counts[id] = (counts[id] || 0) + 1;
  assert(Object.values(counts).every(n => n === 17));
  assert(api.groups.every(g => g.length === 4));
  for (let i = 0; i < 4; i++) api.advance(S);
  assert.deepEqual(api.validateSave(S), []);
  const home = S.finance.ledger.filter(x => x.season === 4 && x.lines.tickets > 0);
  assert(home.length && home.every(x => x.lines.concessions > 0) && S.finance.ledger.at(-1).lines.stadiumRent < 0);
  // A move can be undone by a later move: the old city is still a market, and the club can go back.
  assert.equal(api.relocationBlock(S), 'tenure');
});

test('realignment: a club that moves next to a new division swaps places with one of its clubs, and the schedule still works', () => {
  const { api, S } = ready('club-01'); // Buffalo
  const site = siteIn(S, 'columbus');
  const dest = S.world.markets.find(m => m.id === 'columbus');
  const plan = api.realignmentPlan(S, dest);
  assert(plan && plan.newMean < plan.ownMean * .85);
  api.fileRelocation(S, site.id);
  for (const t of api.clubs) S.league.meeting.lobby[t.id] = 3;
  assert(runVote(api, S).passed);
  assert.equal(api.relocationLean(S, plan.swap) > 0, true);
  const old = api.clubs.find(c => c.id === 'club-01'), from = { conference: old.conference, division: old.division };
  openSeason(api, S);
  const me = api.clubs.find(c => c.id === 'club-01'), other = api.clubs.find(c => c.id === plan.swap);
  assert.deepEqual([me.conference, me.division], [plan.to.conference, plan.to.division]);
  assert.deepEqual([other.conference, other.division], [from.conference, from.division]);
  assert(api.groups.length === 8 && api.groups.every(g => g.length === 4));
  const division = {};
  for (const week of api.cur(S).weeks) for (const g of week) {
    const [h, a] = [g.home, g.away].map(id => api.clubs.find(t => t.id === id));
    if (h.conference === a.conference && h.division === a.division) division[g.home + '>' + g.away] = true;
  }
  assert.equal(Object.keys(division).length, 8 * 12);
  assert(S.league.owners[plan.swap].memory.some(m => /out of their division/.test(m.text)));
  assert.deepEqual(api.validateSave(S), []);
});

test('a moved club is replayed from the save: reload, JSON round trip, and a new league starts from the original map', () => {
  const { api, S } = ready();
  api.fileRelocation(S, siteIn(S, 'toronto').id, { nickname: 'Voyagers' });
  runVote(api, S); openSeason(api, S);
  const again = load().api, T = again.upgrade(JSON.parse(JSON.stringify(S))).save;
  again.applyIdentity(T);
  assert.deepEqual(again.clubs, api.clubs);
  assert.deepEqual(again.OPEN_MARKETS, api.OPEN_MARKETS);
  assert.deepEqual(again.groups.map(g => g.map(t => t.id)), api.groups.map(g => g.map(t => t.id)));
  const fresh = again.newSave(3);
  assert.deepEqual(fresh.relocations, []);
  assert(again.clubs.some(c => c.market === 'Cincinnati' && c.nickname === 'Rivermen'));
  assert(again.OPEN_MARKETS.some(m => m.id === 'toronto') && !again.OPEN_MARKETS.some(m => m.id === 'cincinnati'));
  assert.deepEqual(again.validateSave(fresh), []);
});

test('relocation pages render in every state, and names are escaped', () => {
  const { api, S } = readyLive();
  S.world.sites.find(x => x.marketId === 'toronto').name = '<img src=x onerror=1>';
  let html = api.stadiumView();
  assert(html.includes('Relocation') && html.includes('File the application') && html.includes('Public money'));
  assert(!html.includes('<img src=x'));
  api.fileRelocation(S, siteIn(S, 'toronto').id);
  html = api.stadiumView();
  assert(html.includes('Withdraw the application') && html.includes('set aside'));
  assert(!html.includes('<img src=x'));
  const league = api.leagueView();
  assert(league.includes('You have asked the owners') && league.includes('Promise support') && !league.includes('Your vote'));
  runVote(api, S);
  assert(api.stadiumView().includes('approved the move'));
  assert(api.leagueView().includes('Result'));
  openSeason(api, S);
  html = api.stadiumView();
  assert(html.includes('Moves so far') && html.includes('Toronto'));
  assert(api.leagueView().includes('Cincinnati') && api.ownershipDesk().length > 0);
  assert(api.mapPoints(S).some(p => p.id === 'toronto' && !p.open) && api.mapPoints(S).some(p => p.id === 'cincinnati' && p.open));
});

// ---- AI relocation -----------------------------------------------------------
const aiYear = (api, seed, season = 10) => { const S = api.newSave(seed); S.club = 'club-06'; api.cur(S).number = season; return S; };
const tryMove = (api, S, tries = 80) => {
  for (let i = 0; i < tries && !S.relocations.length; i++) { S.rng.state = (i * 7919 + 13) >>> 0; api.aiRelocations(S, api.rngFor(S.rng)); }
  return S.relocations[0];
};

test('AI clubs relocate rarely, and only for a market twice the size with the lease nearly up, or nearly free public money', () => {
  const { api } = load();
  let moves = 0, years = 0;
  for (let seed = 1; seed <= 150; seed++) {
    const S = aiYear(api, seed); years++;
    const cands = api.aiMoveCandidates(S);
    api.aiRelocations(S, api.rngFor(S.rng));
    if (!S.relocations.length) continue;
    moves++;
    const m = S.relocations[0], site = S.world.sites.find(x => x.id === m.siteId), c = cands.find(x => x.club === m.club && x.site.id === m.siteId);
    assert(c, 'the move was one of the qualifying cases');
    assert(m.ai && m.club !== 'club-06');
    assert(m.reason === 'free' ? site.publicOffer - site.infraTrue >= 0.85 * (650 + (site.maxSeats - 60000) / 1000 * 12) : c.ratio >= 2);
  }
  assert(moves >= 1 && moves <= 25, 'about one eligible year in ten, got ' + moves + ' of ' + years);
});

test('no AI moves early, none within six seasons of another move, and none while the owner has an application in', () => {
  const { api } = load();
  const never = S => { for (let i = 0; i < 60; i++) { S.rng.state = i * 104729; api.aiRelocations(S, api.rngFor(S.rng)); } return S.relocations.length; };
  assert.equal(never(aiYear(api, 4, 5)), 0, 'season 5 is too early');
  const gap = aiYear(api, 4, 10);
  gap.relocations.push({ season: 8, club: 'club-02', from: {}, to: { market: 'X', marketId: 'x', nickname: 'Y', abbr: 'XX', conference: 'Charter', division: 'East' }, destination: { id: 'nowhere' } });
  assert.equal(never(gap), 1, 'a move two seasons ago blocks another');
  const busy = aiYear(api, 4, 10);
  busy.stadium.application = { status: 'pending' };
  assert.equal(never(busy), 0, 'the owner’s own application comes first');
});

test('an AI club that moves takes its new identity at once; the old city opens up, the new one closes, and the owners’ vote shows in the inbox', () => {
  const { api } = load();
  const S = aiYear(api, 21);
  for (const l of Object.values(S.world.leases)) l.yearsLeft = 10; // no upgrade cases, only the free stadium
  const target = S.world.sites.find(x => x.marketId === 'toronto' && x.kind === 'edge');
  target.publicOffer = 3000; // outrageous free public money
  for (const o of Object.values(S.league.owners)) { o.tradition = -.5; o.sponsorAffinity = .3; }
  const m = tryMove(api, S);
  assert(m, 'the club moved'); assert.equal(m.reason, 'free');
  const t = api.clubs.find(c => c.id === m.club);
  assert.deepEqual([t.market, t.marketId, t.abbr], ['Toronto', 'toronto', m.to.abbr]);
  assert(!api.OPEN_MARKETS.some(x => x.id === 'toronto'));
  assert.equal(api.OPEN_MARKETS.some(x => x.id === m.from.marketId), !!m.vacated);
  assert(S.world.sites.filter(x => x.marketId === 'toronto').every(x => x.status === 'taken'));
  assert.deepEqual(Object.keys(S.league.markets).sort(), api.OPEN_MARKETS.map(x => x.id).sort());
  assert.equal(api.clubs.find(c => c.id === 'club-06').market, 'Cincinnati', 'the owner’s club stays put');
  assert.equal(new Set(api.clubs.map(c => c.abbr)).size, 32);
  assert(api.groups.every(g => g.length === 4));
  const e = S.events.find(x => x.type === 'clubRelocated');
  const text = api.describeEvent(e, S);
  assert(/voted \d+–\d+ to let the/.test(text) && /public offer/.test(text) && /You voted (yes|no)/.test(text));
  assert(S.league.news.some(n => n.text.includes('will become the')));
  assert.deepEqual(api.validateSave(S), []);
  // The owner's own tenure is counted from the owner's club, not the league's last move.
  assert.equal(api.relocationBlock(S), null, 'another club’s move does not reset the owner’s tenure');
  const again = load().api, T = again.upgrade(JSON.parse(JSON.stringify(S))).save;
  again.applyIdentity(T);
  assert.deepEqual(again.clubs, api.clubs);
});

test('AI clubs are turned down when the owners do not want it', () => {
  const { api } = load();
  const S = aiYear(api, 21);
  for (const l of Object.values(S.world.leases)) l.yearsLeft = 10;
  S.world.sites.find(x => x.marketId === 'salt-lake-city' && x.kind === 'edge').publicOffer = 3000;
  for (const o of Object.values(S.league.owners)) { o.tradition = .5; o.sponsorAffinity = -.3; }
  for (let i = 0; i < 80; i++) { S.rng.state = i * 7919 + 13; api.aiRelocations(S, api.rngFor(S.rng)); }
  assert.equal(S.relocations.length, 0);
  assert(S.league.news.some(n => /turn down/.test(n.text)));
});

test('team colors: every club gets a shade that carries white text, and no club before one is owned', () => {
  const { api } = load();
  for (const t of api.clubs) {
    const c = api.inkable(t.primary);
    assert.match(c, /^#[0-9a-f]{6}$/);
    assert(api.contrast(c, '#ffffff') >= 4.5, t.id + ' ' + t.primary + ' -> ' + c);
  }
  assert(api.contrast(api.inkable('#ffe2a3'), '#ffffff') >= 4.5, 'a pale color is darkened until it passes');
  assert.equal(api.inkable('#193c56'), '#193c56', 'a dark color is left alone');
  const { S } = owned();
  assert.equal(api.setTeamColors(S)['--team'], api.inkable(api.clubs.find(t => t.id === 'club-06').primary));
  assert.equal(api.setTeamColors({ club: null })['--team'], '#1e5b37');
});

test('navigation: every page belongs to one section, routes round-trip through the address bar, old tab names still work', () => {
  const { api } = load();
  const pages = api.SECTIONS.flatMap(x => x.views.map(([id]) => id));
  assert.equal(new Set(pages).size, pages.length, 'no page in two sections');
  for (const id of pages) {
    assert(typeof api.VIEWS[id] === 'function', id + ' has a view');
    assert.equal(api.routeFromHash(api.hashOf(id)), id);
  }
  assert.equal(api.hashOf('desk'), '#desk');
  assert.equal(api.hashOf('depth'), '#football/depth');
  assert.equal(api.routeFromHash('#game'), 'game');
  assert.equal(api.routeFromHash('#business/depth'), null, 'a page under the wrong section is not a route');
  assert.equal(api.routeFromHash('#nowhere'), null);
  assert.equal(api.routeFromHash('#__proto__'), null);
  for (const [old, route] of [['Owner desk', 'desk'], ['League', 'markets'], ['Club directory', 'clubs'], ['Team schedule', 'club'], ['Rosters', 'club'], ['Game', 'game']]) assert.equal(api.routeOf(old), route);
  assert.equal(api.routeOf('constructor'), null);
  const nav = api.navHtml('contracts');
  assert.match(nav.top, /data-section="football" aria-current="page"/);
  assert.match(nav.sub, /data-tab="contracts" aria-current="page"/);
  assert.equal(api.navHtml('desk').sub, '', 'a one-page section has no sub-tabs');
});

test('league office pages split the old League tab without losing anything', () => {
  const { api, S } = owned();
  api.save.club = S.club;
  const whole = api.marketsView() + api.ownersView() + api.newsView();
  assert.match(api.marketsView(), /Broadcast rights/);
  assert.match(api.ownersView(), /Owners and votes/);
  assert.match(api.ownersView(), /What they remember/, 'owners are listed even with no vote scheduled');
  assert.match(api.newsView(), /Headlines/);
  assert(whole.length > 0);
});

test('Advance lists exactly the offers and proposals that lapse when the clock moves', () => {
  const { api, S } = owned(5);
  let checked = 0;
  for (let w = 0; w < 40 && api.cur(S).number === 1; w++) {
    const t = api.now(S), due = api.dueBy(S, t + 1);
    const listed = new Set(due.map(x => x.title));
    const before = S.staff.proposals.filter(P => ['trade', 'offer', 'fa'].includes(P.kind));
    const quote = !!S.offer;
    if (quote) assert(due.some(x => /price on/.test(x.title)), 'an open quote is listed');
    api.advance(S);
    const after = new Set(S.staff.proposals.map(P => P.id));
    for (const P of before) {
      const title = P.kind === 'fa' ? 'Sign free agent ' + P.pos + ' ' + P.name : api.tradeSummary(S, P);
      assert.equal(!after.has(P.id), listed.has(title), (after.has(P.id) ? 'still open but listed: ' : 'lapsed but not listed: ') + title);
      checked++;
    }
    if (quote) assert.equal(S.offer, null);
  }
  assert(checked > 0, 'the season produced proposals to check');
});

test('Jump ahead offers the nearest milestone first, and the confirm names what comes due on the way', () => {
  const { api, S } = owned();
  const targets = api.jumpTargets(S);
  assert.deepEqual(targets.map(([t]) => t), [...targets.map(([t]) => t)].sort((a, b) => a - b));
  assert.match(targets[0][1], /trade deadline/);
  S.finance.naming = { status: 'awaiting', expiresWeek: 6, offer: { company: 'Ohio Valley Bank' } };
  assert(!api.dueBy(S, api.now(S) + 1).some(x => /Naming/.test(x.title)), 'not due on this advance');
  assert(api.dueBy(S, 10).some(x => /Ohio Valley Bank/.test(x.title)), 'due on the way to week 10');
  const html = api.confirmHtml(S, { kind: 'jump', target: targets[0][0] });
  assert.match(html, /Ohio Valley Bank/);
  assert.match(html, /role="dialog"/);
  const cells = api.scoreboardCells(S);
  assert.deepEqual(cells.map(c => c[0]), ['Record', 'Week', 'Cap room', 'Cash']);
  assert.equal(cells[1][1], 'PRE');
});

test('one list of pending items drives the desk inbox, the nav badges and the Advance count', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  for (let i = 0; i < 6 && !S.staff.proposals.some(P => P.kind === 'trade' || P.kind === 'offer'); i++) api.playWeek(S);
  S.finance.naming = { status: 'awaiting', expiresWeek: api.now(S) + 2, offer: { company: 'Ohio Valley <b>Bank</b>' } };
  const items = api.pendingItems(S);
  assert(items.some(x => x.route === 'finances'), 'the naming offer is waiting');
  for (const x of items) {
    assert(typeof x.title === 'string' && x.title && api.VIEWS[x.route], x.id);
    assert(x.actions.length > 0, x.id + ' can be acted on');
  }
  const desk = api.ownershipDesk();
  assert(desk.includes(items.length + (items.length === 1 ? ' thing needs' : ' things need')));
  assert(!desk.includes('<b>Bank'), 'item text is escaped');
  const nav = api.navHtml('desk', items);
  assert.match(nav.top, new RegExp('data-section="desk".*?<span class="full">Desk</span><span class="badge"[^>]*>' + items.length + '<'));
  const biz = items.filter(x => x.route === 'finances' || x.route === 'stadium').length;
  assert.match(nav.top, new RegExp('<span class="full">Business</span>' + (biz ? '<span class="badge"[^>]*>' + biz + '<' : '</button>')));
  const expiring = items.filter(x => api.urgency(S, x) === 'expire').map(x => x.id).sort();
  assert.deepEqual(api.dueBy(S, api.now(S) + 1).map(x => x.id).sort(), expiring, 'Advance counts exactly the items decided this week');
  const talk = S.staff.proposals.find(P => P.kind === 'trade' || P.kind === 'offer');
  if (talk) assert(api.tradesView().includes('data-approve="' + talk.id + '"'), 'trade talk can be answered on the Trades page');
  assert(api.tradesView().includes('GM’s trade desk'));
  assert(api.depthView().includes('Medical report'));
  S.club = null;
  assert.deepEqual(api.pendingItems(S), []);
});

test('player card: every player has a card on every tab, other clubs get a trade button, and hostile names are escaped', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  for (let i = 0; i < 3; i++) api.playWeek(S);
  const mine = S.rosters['club-06'][0], theirs = S.rosters['club-01'].find(p => !p.out);
  theirs.name = 'Evil <img src=x onerror=alert(1)> Guy';
  assert.equal(api.findPlayer(S, mine.id).club, 'club-06');
  assert.equal(api.findPlayer(S, 'nobody'), null);
  for (const tab of ['overview', 'contract', 'stats', 'history']) {
    api.setCard(mine.id, tab);
    const html = api.playerView();
    assert(html.includes('data-release="' + mine.id + '"'), 'your own player can be released from his card');
    assert(html.includes('aria-selected="true">' + { overview: 'Overview', contract: 'Contract', stats: 'Stats', history: 'History' }[tab]));
    api.setCard(theirs.id, tab);
    const other = api.playerView();
    assert(!other.includes('<img src=x'), 'name escaped on ' + tab);
    assert(!other.includes('data-release'), 'no release button for another club');
  }
  api.setCard(theirs.id, 'overview');
  assert(api.playerView().includes('data-pquote="club-01/' + theirs.id + '"'));
  api.setCard('gone', 'overview');
  assert.match(api.playerView(), /No longer in the league/);
  const hits = api.findPlayers(S, mine.name.split(' ').at(-1));
  assert(hits.length > 0 && hits.length <= 8);
  assert(hits.some(h => h.p.id === mine.id));
  assert.deepEqual(api.findPlayers(S, 'a'), [], 'one letter is not a search');
  assert.equal(api.routeFromHash('#player/' + encodeURIComponent(mine.id)), 'player');
  assert.equal(api.playerFromHash('#player/' + encodeURIComponent(mine.id)), mine.id);
  assert.equal(api.routeFromHash('#player'), null);
  assert(api.depthView().includes('data-player="' + mine.id + '"') || S.rosters['club-06'].some(p => api.depthView().includes('data-player="' + p.id + '"')), 'depth chart names link to cards');
});

test('draft room: cork board tiers, a sortable and filterable clipboard, and taken players marked on draft day', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  for (let i = 0; i < 3; i++) api.advance(S);
  const D = S.draft;
  D.prospects[0].name = 'Bad <img src=x onerror=alert(1)>';
  api.draftUi.view = 'board';
  let html = api.draftView();
  assert(html.includes('class="cork"') && html.includes('1st round') && html.includes('Day 2'));
  assert(!html.includes('<img src=x'), 'prospect names are escaped on the board');
  const B = api.draftBook(S);
  const top = B.ranked.slice(0, 32);
  for (const p of top) assert(html.includes('data-profile="' + p.id + '"'), 'every first-round grade is on the board');
  api.draftUi.view = 'list'; api.draftUi.group = 'qb'; api.draftUi.sort = 'grade'; api.draftUi.dir = -1;
  html = api.draftView();
  const ids = [...html.matchAll(/class="plink" data-profile="([^"]+)"/g)].map(m => m[1]);
  assert(ids.length > 0);
  for (const id of ids) assert.equal(api.draftGroupOf(D.prospects.find(p => p.id === id).pos), 'qb', 'only quarterbacks with the QB chip');
  const grades = ids.map(id => B.grade(D.prospects.find(p => p.id === id)));
  assert.deepEqual(grades, [...grades].sort((a, b) => b - a), 'sorted by your grade, high to low');
  api.draftUi.group = 'All'; api.draftUi.q = D.prospects[5].name;
  assert(api.draftView().includes('data-profile="' + D.prospects[5].id + '"'));
  api.draftUi.q = ''; api.draftUi.watchOnly = true;
  assert.match(api.draftView(), /0 of \d+ prospects|Nobody on the sheet/);
  api.draftUi.watchOnly = false;
  api.jumpTo(S, 34);
  api.simToMyPick(S);
  api.draftUi.view = 'board';
  html = api.draftView();
  assert.match(html, /On the clock/);
  const taken = S.draft.picks[0];
  if (taken) assert(html.includes('#' + taken.overall), 'a taken prospect carries his pick sticker');
  api.draftUi.view = 'list';
  assert(api.draftView().includes('data-draft='), 'your pick can be made from the clipboard');
  Object.assign(api.draftUi, { view: 'board', group: 'All', q: '' });
});

test('club pages: one page per club with schedule and roster, a directory, and club names that link to it', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  for (let i = 0; i < 2; i++) api.playWeek(S);
  const dir = api.clubsView();
  for (const t of api.clubs) assert(dir.includes('data-id="' + t.id + '"'), t.id + ' is in the directory');
  S.league.owners['club-03'].name = 'Rich <script>x</script>';
  api.setClub('club-03', 'schedule');
  let html = api.clubView();
  assert(html.includes('Schedule') && html.includes('Toward you') && !html.includes('<script>x'));
  assert.match(html, /data-id="club-\d\d"/, 'opponents link to their club pages');
  api.setClub('club-03', 'roster');
  html = api.clubView();
  assert(html.includes('data-player="' + S.rosters['club-03'][0].id + '"') || S.rosters['club-03'].some(p => html.includes('data-player="' + p.id + '"')), 'roster names open player cards');
  api.setClub('club-06', 'schedule');
  assert(api.clubView().includes('<dd>You</dd>'), 'your own club shows you as owner');
  assert.equal(api.routeFromHash('#club/club-03'), 'club');
  assert.equal(api.clubFromHash('#club/club-03'), 'club-03');
  assert.equal(api.routeFromHash('#club/club-99'), null);
  assert(api.standingsView().includes('data-id="club-06"'), 'standings link to club pages');
});


test('TV rights on the desk: open markets are one optional item, a bid waits on the station, and the result lands on the desk', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-06';
  const C = columbusUp(api, S);
  const open = S.league.contests.filter(c => c.status === 'open');
  let items = api.pendingItems(S);
  const summary = items.find(x => x.id === 'rights-open');
  assert(summary, 'markets taking offers show up even before any bid');
  assert(summary.title.startsWith(open.length + ' market'));
  assert(summary.detail.includes('Columbus') && summary.detail.startsWith('Optional.'));
  assert.equal(summary.deadline, Math.min(...open.map(c => c.deadlineWeek)));
  assert.deepEqual(api.waitingItems(S), []);
  assert.equal(api.submitBid(S, 'columbus', 12, 7, true), 'ok');
  items = api.pendingItems(S);
  assert(!items.some(x => x.id === 'rights-columbus'), 'a market you bid on is no longer a decision');
  assert(!api.dueBy(S, C.deadlineWeek).some(x => x.id === 'rights-columbus'), 'nor does it count toward Advance');
  const waiting = api.waitingItems(S);
  assert.equal(waiting.length, 1);
  assert.match(waiting[0].detail, /Your offer: \$12M a year for 7 years, and you visited the station\. Station range \$[\d.]+–[\d.]+M a year · likely rivals .*CLE/);
  assert.deepEqual(waiting[0].actions, [['Revise offer', 'rights', 'columbus']]);
  let desk = api.ownershipDesk();
  assert(desk.includes('Waiting on others') && desk.includes('data-rights="columbus"'));
  assert(!desk.includes('Just decided'));
  while (C.status === 'open') api.advance(S);
  const decided = api.justDecided(S);
  assert.equal(decided.length, 1);
  assert.equal(decided[0].marketName, 'Columbus');
  desk = api.ownershipDesk();
  assert(desk.includes('Just decided') && desk.includes('Broadcast rights in Columbus'));
  assert(!desk.includes('Waiting on others'));
  api.advance(S);
  assert.deepEqual(api.justDecided(S), [], 'the result moves off the desk after the next advance');
});

test('a market you hold without an offer is a decision with the station range, and its button opens that market', () => {
  const { api } = load();
  const S = api.save; S.club = 'club-07';
  columbusUp(api, S);
  const x = api.pendingItems(S).find(i => i.id === 'rights-columbus');
  assert(x && x.detail.startsWith('You hold these rights'));
  assert.match(x.detail, /Station range/);
  assert.deepEqual(x.actions, [['Make an offer', 'rights', 'columbus']]);
  assert(!api.pendingItems(S).find(i => i.id === 'rights-open')?.detail.includes('Columbus'), 'not double-listed as optional');
});
let failed = 0;
(async () => {
const only = process.env.ONLY; // ONLY=relocation npm test runs the tests whose names contain it
for (const [name, fn] of tests) {
  if (only && !name.includes(only)) continue;
  try { await fn(); console.log('  ok   ' + name); }
  catch (e) { failed++; console.log('  FAIL ' + name + '\n       ' + String(e.stack || e).split('\n').slice(0, +process.env.LINES || 3).join('\n       ')); }
}
console.log(failed ? `\n${failed} of ${tests.length} failed` : `\nall ${tests.length} passed`);
process.exit(failed ? 1 : 0);
})();
