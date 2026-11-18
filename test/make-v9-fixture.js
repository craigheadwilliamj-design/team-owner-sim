// One-off: drives the v9 build to produce a realistic v9 save (test/fixtures/v9-save.json): season 1, Week 9.
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v9-season-desk.html'), { exportNames: ['newSave', 'advance'] });
const S = api.newSave(1010); S.club = 'club-06';
for (let i = 0; i < 9; i++) api.advance(S);
S.revision = 70;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v9-save.json'), JSON.stringify(S));
console.log('v9 save: week', S.seasons[0].completed, 'injured on CIN', S.rosters['club-06'].filter(p => p.out).length);
