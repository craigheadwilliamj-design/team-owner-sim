# Team Owner Sim

A largely text-based pro football ownership simulator, set in the fictional
Continental Gridiron League (32 clubs, two conferences, eight divisions). You
buy a franchise, hire the people who run it, and choose when to interfere.

**Play it:** https://craigheadwilliamj-design.github.io/team-owner-sim/

## What's in it

- An 18-week season, playoffs, and a full offseason calendar (February Week 1
  to August Week 4) with a jump-ahead control.
- Coaches and a GM with ratings, styles and promises you can hold them to;
  firing, interviews, and a coaching carousel.
- Depth chart, game-day actives, injured reserve and practice squads.
- Contracts and a salary cap: negotiation, guarantees, the franchise tag,
  rookie options, cap carryover and a salary floor.
- Trades you make, trades your GM proposes, offers from rival clubs, and
  AI clubs trading with each other.
- A college wire, scouting and the draft.
- Stadium talks in open markets, club finances, naming rights, broadcast
  markets on a map, and league votes.

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
```

Every change to the save shape bumps `SCHEMA_VERSION` and adds a migration.
`test/fixtures/` holds real saves from each earlier format, made by the
`test/make-v*-fixture.js` scripts, so every old save is tested as it
upgrades.
