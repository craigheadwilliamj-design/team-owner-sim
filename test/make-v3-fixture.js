// One-off: drives the v3 build to produce a realistic v3 save (test/fixtures/v3-save.json).
'use strict';
const fs = require('fs');
const path = require('path');
const { loadGame } = require('./harness');
const { api } = loadGame(path.join(__dirname, 'fixtures', 'v3-season-desk.html'), {
  exportNames: ['newSave', 'playWeek', 'authorizeVisit', 'commissionStudy'],
});
const S = api.newSave(4242); S.club = 'club-14'; // Kansas City
api.authorizeVisit(S, S.world.sites[0].id, { who: 'president', discretion: 'quiet', ask: 'deadline', signal: 'serious' });
api.commissionStudy(S, S.world.sites[3].id);
for (let i = 0; i < 6; i++) api.playWeek(S);
S.revision = 14;
fs.writeFileSync(path.join(__dirname, 'fixtures', 'v3-save.json'), JSON.stringify(S));
console.log('v3 save: week', S.seasons[0].completed, 'events', S.events.map(e => e.type).join(','), 'facts', S.stadium.knowledge.length);
