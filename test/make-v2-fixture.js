// One-off: drives the v2 build to produce a realistic v2 save (test/fixtures/v2-save.json).
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v2-season-desk.html'), {
  exportNames: ['newSave', 'playWeek', 'tradeQuote', 'resolveOffer'],
});
const S = api.newSave(20261118); S.club = 'club-06';
for (let i = 0; i < 4; i++) api.playWeek(S);
const wr = S.rosters['club-32'].filter(p => p.pos === 'WR').sort((a, b) => a.rating - b.rating)[0];
api.tradeQuote(S, 'club-32', wr.id); api.resolveOffer(S, true);
api.playWeek(S); S.revision = 9;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v2-save.json'), JSON.stringify(S));
console.log('v2 save: week', S.seasons[0].completed, 'events', S.events.length, Math.round(JSON.stringify(S).length / 1024) + 'KB');
