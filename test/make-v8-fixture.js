// One-off: drives the v8 build to produce a realistic v8 save (test/fixtures/v8-save.json): season 2, Week 6.
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v8-season-desk.html'), { exportNames: ['newSave', 'advance', 'jumpTo'] });
const S = api.newSave(9090); S.club = 'club-06';
api.jumpTo(S, 51); for (let i = 0; i < 6; i++) api.advance(S);
S.revision = 60;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v8-save.json'), JSON.stringify(S));
console.log('v8 save: season', S.seasons.at(-1).number, 'week', S.seasons.at(-1).completed, 'staff', JSON.stringify(S.staff));
