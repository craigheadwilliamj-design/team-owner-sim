// Calibrates the play-by-play engine against NFL per-team-game averages and
// against the drive sim it replaced, whose talent-to-wins curve rosters, trades
// and the AI GMs were tuned on (OLD_CURVE, measured on the same matchups).
//   node scripts/calibrate.js [games]       stats table
//   node scripts/calibrate.js --pbp [seed]  one game, play by play
'use strict';
const path = require('path');
const { loadGame } = require('../test/harness');

const { api } = loadGame(path.join(__dirname, '..', 'season-desk.html'), {
  exportNames: ['newSave', 'clubUnits', 'playGame', 'clubs', 'rngFor'],
});
const args = process.argv.slice(2);
// Stronger side's win % in the old drive sim, by strength gap bucket (0-4, 5-9, ... 30+).
const OLD_CURVE = { 0: 54.6, 5: 63.6, 10: 72.8, 15: 81.2, 20: 86.4, 25: 91.4, 30: 95.6 };

// A pool of real club units from a few fresh leagues.
function unitPool(leagues) {
  const pool = [];
  for (let n = 0; n < leagues; n++) {
    const S = api.newSave(1000 + n);
    for (const t of api.clubs) {
      const u = api.clubUnits(S, t.id), c = u.chart, first = (pos, n) => c[pos].filter(p => !p.out).slice(0, n);
      // Each featured player's rating against his group: pass targets, backs, cover men.
      const groups = [[...first('WR', 3), ...first('TE', 1), ...first('RB', 1)], first('RB', 2), [...first('CB', 2), ...first('S', 2), ...first('LB', 3)]];
      const rel = new Map();
      for (const g of groups) { const mean = g.reduce((a, p) => a + p.rating, 0) / g.length; for (const p of g) if (!rel.has(p.id) || g === groups[1]) rel.set(p.id + (g === groups[1] ? '/rb' : ''), p.rating - mean); }
      pool.push({ id: t.id, abbr: t.abbr, u, rel, key: n + '/' + t.id });
    }
  }
  return pool;
}

const clock = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
function spot(p, abbr) {
  if (p.yl === 50) return '50';
  return p.yl < 50 ? abbr[p.off] + ' ' + p.yl : abbr[1 - p.off] + ' ' + (100 - p.yl);
}
const downText = p => ['1st', '2nd', '3rd', '4th'][p.down - 1] + ' & ' + (p.yl + p.toGo >= 100 ? 'Goal' : p.toGo);

if (args[0] === '--pbp') {
  const seed = Number(args[1] ?? 7);
  const pool = unitPool(1), r = api.rngFor({ seed, state: seed });
  const [h, a] = [pool[seed % 32], pool[(seed * 7 + 3) % 32 === seed % 32 ? (seed + 1) % 32 : (seed * 7 + 3) % 32]];
  const g = api.playGame(h.u, a.u, r, { log: true });
  const abbr = [h.abbr, a.abbr];
  console.log(a.abbr + ' at ' + h.abbr + '\n');
  for (const p of g.plays) {
    const q = p.q > 4 ? 'OT' : 'Q' + p.q;
    const head = p.kind === 'play' ? abbr[p.off] + ' ' + downText(p) + ' at ' + spot(p, abbr) + '  ' : '';
    console.log((q + ' ' + clock(p.clock)).padEnd(10) + head + p.text + '   [' + abbr[0] + ' ' + p.score[0] + ' ' + abbr[1] + ' ' + p.score[1] + ']');
  }
  const t = g.box.teams;
  console.log('\nFinal: ' + h.abbr + ' ' + g.score[0] + ', ' + a.abbr + ' ' + g.score[1] + (g.ot ? ' (OT)' : ''));
  for (const [i, ab] of abbr.entries()) {
    const x = t[i];
    console.log(ab + ': ' + x.yards + ' yds (' + x.passYards + ' pass, ' + x.rushYards + ' rush), ' + x.comp + '/' + x.passAtt + ', ' +
      x.firstDowns + ' first downs, 3rd ' + x.third[1] + '/' + x.third[0] + ', TOP ' + clock(x.top) + ', turnovers ' + (x.ints + x.fumblesLost));
  }
  process.exit(0);
}

const N = Number(args[0] ?? 20000);
const pool = unitPool(20);
const r = api.rngFor({ seed: 99, state: 99 });
const sum = {}, add = (k, v) => { sum[k] = (sum[k] ?? 0) + v; };
const strength = x => x.u.offense + x.u.defense;
const bins = new Map(); // strength gap -> [new wins, games]
const indiv = new Map(); // league/club/player -> accumulated stats and rating gap
let homeWins = 0, ties = 0, ots = 0, decided = 0;
const t0 = process.hrtime.bigint();
let engineNs = 0n;
for (let n = 0; n < N; n++) {
  const h = pool[Math.floor(r() * pool.length)];
  let a = pool[Math.floor(r() * pool.length)];
  while (a === h) a = pool[Math.floor(r() * pool.length)];
  const s0 = process.hrtime.bigint();
  const g = api.playGame(h.u, a.u, r);
  engineNs += process.hrtime.bigint() - s0;
  if (g.ot) ots++;
  if (g.score[0] === g.score[1]) ties++;
  else { decided++; if (g.score[0] > g.score[1]) homeWins++; }
  for (const x of g.box.teams) {
    for (const k of ['plays', 'yards', 'passYards', 'rushYards', 'passAtt', 'comp', 'sacked', 'ints', 'fumblesLost', 'firstDowns',
      'penalties', 'top', 'drives', 'punts', 'fga', 'fgm']) add(k, x[k]);
    add('thirdAtt', x.third[0]); add('thirdConv', x.third[1]); add('fourthAtt', x.fourth[0]); add('fourthConv', x.fourth[1]);
  }
  add('points', g.score[0] + g.score[1]);
  for (const p of Object.values(g.box.players)) {
    add('carries', p.carries ?? 0); add('passTd', p.passTd ?? 0); add('rushTd', p.rushTd ?? 0);
    const team = p.side === 0 ? h : a, k = team.key + '/' + p.id;
    const x = indiv.get(k) ?? { pos: p.pos, rel: team.rel.get(p.id), relRb: team.rel.get(p.id + '/rb'), games: 0 };
    x.games++;
    for (const f of ['targets', 'rec', 'recYards', 'carries', 'rushYards', 'targeted', 'yardsAllowed', 'defInts', 'sacks']) x[f] = (x[f] ?? 0) + (p[f] ?? 0);
    indiv.set(k, x);
  }
  // Win rate of the stronger side by strength gap, both engines.
  const gap = Math.abs(strength(h) - strength(a)), key = Math.min(30, Math.floor(gap / 5) * 5);
  const strongHome = strength(h) >= strength(a);
  const b = bins.get(key) ?? [0, 0];
  const win = s => s[0] === s[1] ? .5 : (s[0] > s[1]) === strongHome ? 1 : 0;
  b[0] += win(g.score); b[1]++;
  bins.set(key, b);
}
const elapsed = Number(process.hrtime.bigint() - t0) / 1e6;
const per = k => sum[k] / (N * 2);
const rows = [
  ['Points per team', per('points'), 22.0],
  ['Offensive plays (incl. sacks)', per('plays'), 63],
  ['Drives', per('drives'), 11],
  ['Total yards', per('yards'), 330],
  ['Net passing yards', per('passYards'), 215],
  ['Rushing yards', per('rushYards'), 115],
  ['Pass attempts', per('passAtt'), 33.5],
  ['Completion %', 100 * sum.comp / sum.passAtt, 64.5],
  ['Yards per carry', sum.rushYards / sum.carries, 4.3],
  ['Carries', per('carries'), 26.5],
  ['Sacks taken', per('sacked'), 2.3],
  ['Interceptions', per('ints'), .8],
  ['Fumbles lost', per('fumblesLost'), .45],
  ['First downs', per('firstDowns'), 19.5],
  ['3rd-down conversion %', 100 * sum.thirdConv / sum.thirdAtt, 39],
  ['4th-down attempts', per('fourthAtt'), 1.2],
  ['Punts', per('punts'), 4.0],
  ['FG attempts', per('fga'), 1.75],
  ['FG %', 100 * sum.fgm / sum.fga, 85],
  ['Offensive TDs', (sum.passTd + sum.rushTd) / (N * 2), 2.35],
  ['Accepted penalties', per('penalties'), 6.0],
  ['Time of possession (min)', per('top') / 60, 30],
];
console.log('Per team per game, ' + N + ' games\n');
console.log('Stat'.padEnd(32) + 'engine'.padStart(8) + 'NFL'.padStart(8));
for (const [label, v, nfl] of rows) console.log(label.padEnd(32) + v.toFixed(2).padStart(8) + String(nfl).padStart(8));
console.log('\nHome win %'.padEnd(33) + (100 * homeWins / decided).toFixed(1).padStart(8) + '55'.padStart(8));
console.log('Overtime %'.padEnd(32) + (100 * ots / N).toFixed(1).padStart(8) + '5.5'.padStart(8));
console.log('Ties %'.padEnd(32) + (100 * ties / N).toFixed(2).padStart(8) + '0.3'.padStart(8));
console.log('\nStronger side win % by strength gap (offense + defense)');
console.log('gap'.padEnd(8) + 'engine'.padStart(8) + 'old'.padStart(8) + 'games'.padStart(8));
for (const [k, [nw, c]] of [...bins].sort((x, y) => x[0] - y[0])) {
  console.log((k + '-' + (k + 4) + (k === 30 ? '+' : '')).padEnd(8) + (100 * nw / c).toFixed(1).padStart(8) + OLD_CURVE[k].toFixed(1).padStart(8) + String(c).padStart(8));
}
function bucketTable(title, filter, relOf, cols) {
  const edges = [-Infinity, -8, -3, 3, 8, Infinity], names = ['8+ worse', '3-8 worse', 'even', '3-8 better', '8+ better'];
  console.log('\n' + title + ' (rating vs. his group)');
  console.log(''.padEnd(12) + cols.map(([l]) => l.padStart(14)).join(''));
  for (let b = 0; b < 5; b++) {
    const xs = [...indiv.values()].filter(x => filter(x) && relOf(x) !== undefined && relOf(x) >= edges[b] && relOf(x) < edges[b + 1]);
    if (!xs.length) continue;
    const t = f => xs.reduce((s, x) => s + (x[f] ?? 0), 0);
    console.log(names[b].padEnd(12) + cols.map(([, fn]) => fn(t).toFixed(2).padStart(14)).join('') + ('  n=' + xs.length).padStart(9));
  }
}
bucketTable('Receivers', x => x.targets > 0 && x.rel !== undefined && ['WR', 'TE'].includes(x.pos), x => x.rel,
  [['targets/gm', t => t('targets') / t('games')], ['catch %', t => 100 * t('rec') / t('targets')], ['yds/target', t => t('recYards') / t('targets')]]);
bucketTable('Running backs', x => x.pos === 'RB' && x.carries > 0, x => x.relRb,
  [['carries/gm', t => t('carries') / t('games')], ['yds/carry', t => t('rushYards') / t('carries')]]);
bucketTable('Cover men', x => x.targeted > 0 && ['CB', 'S'].includes(x.pos), x => x.rel,
  [['targeted/gm', t => t('targeted') / t('games')], ['yds/target', t => t('yardsAllowed') / t('targeted')], ['INT/100 tgt', t => 100 * t('defInts') / t('targeted')]]);
console.log('\nEngine time: ' + (Number(engineNs) / 1e6 / N).toFixed(3) + ' ms per game (' + (Number(engineNs) / 1e6).toFixed(0) + ' ms for ' + N + '); whole run ' + elapsed.toFixed(0) + ' ms');
