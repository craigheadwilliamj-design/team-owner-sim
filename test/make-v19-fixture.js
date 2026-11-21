// One-off: drives the v19 build to produce a realistic v19 save (test/fixtures/v19-save.json): season 1, Week 7,
// with the video boards funded so the upgrade can show an existing project keeps its status.
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v19-season-desk.html'), { exportNames: ['newSave', 'advance', 'fundProject'] });
const S = api.newSave(1919); S.club = 'club-06';
api.fundProject(S, 'upgrade', 'debt');
for (let i = 0; i < 7; i++) api.advance(S);
S.revision = 100;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v19-save.json'), JSON.stringify(S));
console.log('v19 save: week', S.seasons[0].completed, '· projects', S.finance.projects.map(p => p.id + ':' + p.status).join(' '));
