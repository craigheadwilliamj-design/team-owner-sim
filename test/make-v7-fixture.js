// One-off: drives the v7 build to produce a realistic v7 save (test/fixtures/v7-save.json):
// season 2, March Week 3, free agency open, with first-round rookies on the roster.
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v7-season-desk.html'), { exportNames: ['newSave', 'advance', 'jumpTo'] });
const S = api.newSave(8080); S.club = 'club-06';
api.jumpTo(S, 51); api.jumpTo(S, 29);
S.revision = 50;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v7-save.json'), JSON.stringify(S));
console.log('v7 save: season', S.seasons.at(-1).number, 'tick', S.seasons.at(-1).tick, 'pool', S.fa.pool.length, Math.round(JSON.stringify(S).length / 1024) + 'KB');
