// One-off: drives the v12 build to produce a realistic v12 save (test/fixtures/v12-save.json): season 1, Week 7.
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v12-season-desk.html'), { exportNames: ['newSave', 'advance'] });
const S = api.newSave(1313); S.club = 'club-06';
for (let i = 0; i < 7; i++) api.advance(S);
S.revision = 95;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v12-save.json'), JSON.stringify(S));
console.log('v12 save: week', S.seasons[0].completed, 'markets', Object.keys(S.league.markets).length, 'contest', S.league.contest?.marketId);
