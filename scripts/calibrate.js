// Calibrates the play-by-play engine against NFL per-team-game averages and
// against the old drive sim's sense of how much talent matters.
//   node scripts/calibrate.js [games]       stats table
//   node scripts/calibrate.js --pbp [seed]  one game, play by play
'use strict';
const path = require('path');
const { loadGame } = require('../test/harness');

const { api } = loadGame(path.join(__dirname, '..', 'season-desk.html'), {
  exportNames: ['newSave', 'clubUnits', 'playGame', 'simulate', 'clubs', 'rngFor'],
});
const args = process.argv.slice(2);

// A pool of real club units from a few fresh leagues.
function unitPool(leagues) {
  const pool = [];
  for (let n = 0; n < leagues; n++) {
    const S = api.newSave(1000 + n);
    for (const t of api.clubs) pool.push({ id: t.id, abbr: t.abbr, u: api.clubUnits(S, t.id) });
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
const bins = new Map(); // strength gap -> [new wins, old wins, games]
let homeWins = 0, ties = 0, ots = 0, oldOts = 0, oldPts = 0, decided = 0;
const t0 = process.hrtime.bigint();
let engineNs = 0n;
for (let n = 0; n < N; n++) {
  const h = pool[Math.floor(r() * pool.length)];
  let a = pool[Math.floor(r() * pool.length)];
  while (a === h) a = pool[Math.floor(r() * pool.length)];
  const s0 = process.hrtime.bigint();
  const g = api.playGame(h.u, a.u, r);
  engineNs += process.hrtime.bigint() - s0;
  const old = api.simulate(h.u, a.u, r);
  oldPts += old.score[0] + old.score[1];
  if (old.ot) oldOts++;
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
  }
  // Win rate of the stronger side by strength gap, both engines.
  const gap = Math.abs(strength(h) - strength(a)), key = Math.min(30, Math.floor(gap / 5) * 5);
  const strongHome = strength(h) >= strength(a);
  const b = bins.get(key) ?? [0, 0, 0];
  const win = s => s[0] === s[1] ? .5 : (s[0] > s[1]) === strongHome ? 1 : 0;
  b[0] += win(g.score); b[1] += win(old.score); b[2]++;
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
console.log('Overtime %'.padEnd(32) + (100 * ots / N).toFixed(1).padStart(8) + '5.5'.padStart(8) + '   (old sim ' + (100 * oldOts / N).toFixed(1) + ')');
console.log('Ties %'.padEnd(32) + (100 * ties / N).toFixed(2).padStart(8) + '0.3'.padStart(8));
console.log('Old sim points per team'.padEnd(32) + (oldPts / (N * 2)).toFixed(2).padStart(8));
console.log('\nStronger side win % by strength gap (offense + defense)');
console.log('gap'.padEnd(8) + 'engine'.padStart(8) + 'old'.padStart(8) + 'games'.padStart(8));
for (const [k, [nw, ow, c]] of [...bins].sort((x, y) => x[0] - y[0])) {
  console.log((k + '-' + (k + 4) + (k === 30 ? '+' : '')).padEnd(8) + (100 * nw / c).toFixed(1).padStart(8) + (100 * ow / c).toFixed(1).padStart(8) + String(c).padStart(8));
}
console.log('\nEngine time: ' + (Number(engineNs) / 1e6 / N).toFixed(3) + ' ms per game (' + (Number(engineNs) / 1e6).toFixed(0) + ' ms for ' + N + '); whole run ' + elapsed.toFixed(0) + ' ms');
