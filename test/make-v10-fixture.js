// One-off: drives the v10 build to produce a realistic v10 save (test/fixtures/v10-save.json):
// season 1, Week 4, head coach fired and still vacant.
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v10-season-desk.html'), { exportNames: ['newSave', 'advance', 'fireStaff'] });
const S = api.newSave(1111); S.club = 'club-06';
for (let i = 0; i < 3; i++) api.advance(S);
api.fireStaff(S, 'hc');
api.advance(S);
S.revision = 80;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v10-save.json'), JSON.stringify(S));
console.log('v10 save: week', S.seasons[0].completed, 'hc interim', S.staff.clubs['club-06'].hc.interim);
