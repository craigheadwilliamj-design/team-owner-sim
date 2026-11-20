# Team Owner Sim

A largely text-based pro football ownership simulator, set in the fictional
Continental Gridiron League (32 clubs, two conferences, eight divisions). You
buy a franchise, hire the people who run it, and choose when to interfere.

**Play it:** https://craigheadwilliamj-design.github.io/team-owner-sim/

## What's in it

- An 18-week season, playoffs, and a full offseason calendar (February Week 1
  to August Week 4) with a jump-ahead control.
- Every game is simulated play by play from player ratings; your own games
  come as a live broadcast.
- Player season stats, which feed trade value and contract asks.
- Coaches and a GM with ratings, styles and promises you can hold them to;
  firing, interviews, auto-hire and a coaching carousel.
- Depth chart, game-day actives, injured reserve and practice squads.
- Contracts and a salary cap: negotiation, guarantees, the franchise tag,
  rookie options, cap carryover and a salary floor.
- Trades you make, trades your GM proposes, offers from rival clubs, and
  AI clubs trading with each other. Rivals pay a premium inside the
  division and conference.
- A college wire, scouting and the draft.
- Stadium talks and private site visits in open markets, including
  unclaimed markets and relocation targets such as Salt Lake City and
  Calgary.
- Club finances, naming rights, and league votes.
- Broadcast markets on a map: rights deals renew, and fan bases shift with
  coverage.

## Saves

Seasons save automatically in your browser (IndexedDB, compressed), so a
save belongs to the browser and device you play on. Use **Save a copy** to
keep a file you can load anywhere with **Load save**. Saves from older
versions upgrade themselves when opened.

## Development

The whole game is one file, `season-desk.html`. `index.html` is generated
from it for GitHub Pages.

```
npm test        # headless test suite (Node 20+)
npm run build   # regenerate index.html after editing season-desk.html
npm run check   # confirm index.html is up to date (CI runs this)
npm run calibrate  # engine stats vs NFL averages and the old win curve
npm run pbp        # print one simulated game, play by play
```

Every change to the save shape bumps `SCHEMA_VERSION` and adds a migration.
`test/fixtures/` holds real saves from each earlier format, made by the
`test/make-v*-fixture.js` scripts, so every old save is tested as it
upgrades.
