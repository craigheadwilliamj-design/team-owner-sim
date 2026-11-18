// One-off: drives the original v1 build to produce a realistic v1 save.
// Output: test/fixtures/v1-save.json and v1-copy.html (a "Download season copy" file).
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');

const fixture = path.join(__dirname, 'fixtures', 'v1-season-desk.html');
const { api, storage, html } = loadGame(fixture, {
  exportNames: ['season', 'tradeQuote', 'counterTrade', 'resolveOffer', 'playWeek', 'clubs', 'ownedPicks', 'pickKey', 'persist'],
});
const { season: s, tradeQuote, counterTrade, resolveOffer, playWeek, ownedPicks, pickKey } = api;
s.office.club = 'club-06'; // Cincinnati

// Pick-only trade for a kicker, then a player swap, across a few weeks.
const kicker = s.rosters['club-29'].find(p => p.pos === 'K');
tradeQuote(s, 'club-29', kicker.id);
resolveOffer(s, true);
playWeek(s); playWeek(s); playWeek(s);
const de = s.rosters['club-21'].filter(p => p.pos === 'DE' && !p.out).sort((a, b) => b.rating - a.rating)[0];
tradeQuote(s, 'club-21', de.id);
const mine = s.rosters['club-06'].filter(p => p.pos === 'DE' && !p.out).sort((a, b) => b.rating - a.rating)[0];
counterTrade(s, mine.id, pickKey(ownedPicks(s).find(p => p.round === 2)));
resolveOffer(s, true);
for (let i = 0; i < 6; i++) playWeek(s);
// Leave an open quote, and add a pre-labelling trade note as older builds wrote it.
const wr = s.rosters['club-32'].find(p => p.pos === 'WR' && !p.out);
tradeQuote(s, 'club-32', wr.id);
s.office.notes.push({ week: 0, text: 'Acquired ' + s.rosters['club-06'][0].name + ' from Arizona Dust Devils for ARI round 7.' });

const json = JSON.stringify(s);
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v1-save.json'), JSON.stringify(s, null, 1));
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v1-copy.html'),
  html.replace('<script id="initialSeason" type="application/json">null</script>',
    '<script id="initialSeason" type="application/json">' + json + '</script>'));
console.log('completed', s.completed, 'notes', s.office.notes.length, 'offer', !!s.office.offer, 'storage keys', [...storage.data.keys()]);
console.log(s.office.notes.map(n => n.week + ': ' + n.text).join('\n'));
