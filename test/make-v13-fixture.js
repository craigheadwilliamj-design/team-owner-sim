// One-off: drives the v13 build to produce a realistic v13 save (test/fixtures/v13-save.json): season 1, Week 7.
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v13-season-desk.html'), { exportNames: ['newSave', 'advance'] });
const S = api.newSave(1414); S.club = 'club-06';
for (let i = 0; i < 7; i++) api.advance(S);
S.revision = 100;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v13-save.json'), JSON.stringify(S));
console.log('v13 save: week', S.seasons[0].completed, 'markets', Object.keys(S.league.markets).length, 'contest', S.league.contest?.marketId);
