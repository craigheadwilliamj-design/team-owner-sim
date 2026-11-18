// One-off: drives the v4 build to produce a realistic v4 save (test/fixtures/v4-save.json).
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v4-season-desk.html'), {
  exportNames: ['newSave', 'playWeek', 'fundProject', 'startNaming'],
});
const S = api.newSave(5150); S.club = 'club-06'; // Cincinnati
api.fundProject(S, 'plane', 'owner');
api.startNaming(S, { minAnnual: 6, maxYears: 20, exclude: ['crypto'], authority: 'sign' });
for (let i = 0; i < 3; i++) api.playWeek(S);
S.revision = 21;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v4-save.json'), JSON.stringify(S));
console.log('v4 save: week', S.seasons[0].completed, 'naming', S.finance.naming.status, 'facts', S.stadium.knowledge.map(f => f.kind).join(','));
