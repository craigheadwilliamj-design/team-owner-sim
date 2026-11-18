// One-off: drives the v6 build to produce a realistic v6 save (test/fixtures/v6-save.json):
// season 2, early regular season, after a full offseason and draft.
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v6-season-desk.html'), { exportNames: ['newSave', 'advance', 'jumpTo'] });
const S = api.newSave(7070); S.club = 'club-06';
api.jumpTo(S, 51); api.advance(S); api.advance(S);
S.revision = 40;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v6-save.json'), JSON.stringify(S));
console.log('v6 save: season', S.seasons.at(-1).number, 'week', S.seasons.at(-1).completed, Math.round(JSON.stringify(S).length / 1024) + 'KB');
