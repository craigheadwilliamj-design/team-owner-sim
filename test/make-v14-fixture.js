// One-off: drives the v14 build to produce a realistic v14 save (test/fixtures/v14-save.json): season 1, Week 7.
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v14-season-desk.html'), { exportNames: ['newSave', 'advance'] });
const S = api.newSave(1515); S.club = 'club-06';
for (let i = 0; i < 7; i++) api.advance(S);
S.revision = 100;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v14-save.json'), JSON.stringify(S));
console.log('v14 save: week', S.seasons[0].completed, 'wire weeks', S.draft.wire.length);
