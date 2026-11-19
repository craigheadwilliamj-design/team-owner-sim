// One-off: drives the v11 build to produce a realistic v11 save (test/fixtures/v11-save.json): season 1, Week 7.
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v11-season-desk.html'), { exportNames: ['newSave', 'advance'] });
const S = api.newSave(1212); S.club = 'club-06';
for (let i = 0; i < 7; i++) api.advance(S);
S.revision = 90;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v11-save.json'), JSON.stringify(S));
console.log('v11 save: week', S.seasons[0].completed, 'prospects', S.draft.prospects.length);
