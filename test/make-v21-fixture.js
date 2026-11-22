// One-off: drives the v21 build to produce a realistic v21 save (test/fixtures/v21-save.json): season 1, Week 7,
// with an owner profile (private equity, hometown Cincinnati) so the upgrade can show the profile carries over.
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v21-season-desk.html'), { exportNames: ['newSave', 'advance', 'claimClub'] });
const S = api.newSave(2121);
api.claimClub(S, 'club-06', { name: 'Pat Morgan', fortune: 'finance', hometown: 'cincinnati' });
for (let i = 0; i < 7; i++) api.advance(S);
S.revision = 100;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v21-save.json'), JSON.stringify(S));
console.log('v21 save: week', S.seasons[0].completed, '· owner', JSON.stringify(S.owner));
