# Working on Team Owner Sim

- `season-desk.html` is the only source file. It is written for the Claude
  artifact viewer (no doctype or head of its own). After editing it, run
  `npm run build` to regenerate `index.html` for GitHub Pages, and commit both.
- Run `npm test` before committing. The harness (`test/harness.js`) loads the
  page script in Node with a stub DOM; tests use `owned(seed)` for a seeded
  save with Cincinnati (club-06) as the owner's club.
- Changing the save shape: bump `SCHEMA_VERSION`, add `migrateVn`, and add a
  fixture made by the previous build (`test/make-v*-fixture.js`) plus a test
  that the old save upgrades.
- Randomness is seeded from the save (`rngFor(S.rng)`); never use
  `Math.random` in game logic.
- All text that reaches `innerHTML` goes through `esc()`.
- Design notes: the game follows the owner's design bible (kept outside the
  repository).
