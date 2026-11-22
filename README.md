# Team Owner Sim

A largely text-based pro football ownership simulator, set in the fictional
Continental Gridiron League (32 clubs, two conferences, eight divisions). You
buy a franchise, hire the people who run it, and choose when to interfere.

**Play it:** https://craigheadwilliamj-design.github.io/team-owner-sim/

## What's in it

- An owner of your own: a name, a hometown, and where you made your
  fortune. Seven backgrounds (tech, oil and gas, real estate, private
  equity, old family money, media, a hometown business) set your starting
  cash and give you one edge and one weakness.
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
- A college wire, scouting and the draft. Real college programs come in
  tiers: blue bloods produce the elite and carry the hype, and small schools
  hide sleepers. Rivalry games, title games and a playoff swing draft stock.
- Stadium talks and private site visits in open markets, including
  unclaimed markets and relocation targets such as Salt Lake City and
  Calgary.
- Relocation: after three seasons in a city you can file to move to an open
  site. It costs a league fee, your share of a new stadium and a lease exit,
  the home fans turn on you the day you file, and three quarters of the owners
  must approve after you lobby them. If it passes, the club becomes the new
  city's team when the next season opens (optionally under a new nickname),
  the league realigns divisions to fit, and the city you left joins the open
  markets.
- AI clubs relocate too, rarely: at most one move every six seasons, only
  for a market at least twice the size with the lease nearly up, or a public
  offer that pays for most of the stadium, and only if the owners vote it
  through. You get a vote, and hear about it in your inbox.
- Club brand: rename the club, change its abbreviation and pick new colors,
  once a season in the offseason. A new name costs more and stings the home
  faithful; either kind of rebrand lifts sponsorship for the first season in
  the new look, and the colors carry through a move.
- Customize teams (in the settings menu): rename, re-abbreviate and recolor
  any other club for free, set up your own club for free once before Week 1
  of your first season (after that it goes through Brand), and upload a logo for any club, yours included.
  Logos are shrunk to 128×128 and kept in the save, so they travel with
  Save a copy.
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
