// One-off: drives the v5 build to produce a realistic v5 save (test/fixtures/v5-save.json).
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v5-season-desk.html'), {
  exportNames: ['newSave', 'playWeek', 'ensureContest', 'submitBid'],
});
const S = api.newSave(6060); S.club = 'club-06';
api.ensureContest(S); api.submitBid(S, 12, 7, true);
for (let i = 0; i < 16; i++) api.playWeek(S);
S.revision = 30;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v5-save.json'), JSON.stringify(S));
console.log('v5 save: week', S.seasons[0].completed, 'meeting', S.league.meeting?.status, 'columbus', S.league.markets.columbus.holder);
