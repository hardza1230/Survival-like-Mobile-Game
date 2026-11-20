<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.38 — 💥 Shotgun pellets +25%

Owner request after tester feedback (20 Nov, v8.2.37: "Shotgun build is too hard against bosses").

- New `SG_PELLET_MUL = 0.45 × 1.25` replaces the hard-coded ×0.45 pellet damage in both Momo basic-attack paths (`castSkill` sprinkle and the Berry Seed path). Close-range bonus, slug, Double Barrel and evolution multipliers are unchanged and stack on top.
- `taro-foundation` legacy hash normalises the new text; regression check added to `kitchen-simple-8237`.
- QA bots: nightly report crash fixed earlier today (scripts only).

# Previous delivery: v8.2.37 — 🍳 Kitchen simplified for the Closed test (plan C)

Owner chose plan C: test one question — is it fun when the moves you press (Dash / Unique / getting hit) trigger a bonus?

- `FR_SIMPLE=true` + `FR_PRESETS` (4 signature dishes): Sugar Rush Slam (Dash → Shockwave), Double Helping (Unique → 8-Way Shots), Brain Freeze (Below 30% HP → Freeze), Candy Armor (When Hit → Wipe Enemy Shots).
- Pick 1 (`Save.data.frPick`), tap again to remove, free swap. No HP/AP upkeep. No parts, slots or Rank Points needed. Old part stars ignored (all lv1 + signature bonus).
- New `buildKitchenSimple` screen titled "Flavor Kitchen". Red dot until the first pick. Hub row text updated.
- Expedition: boss every 10 stages gives 🧶 +10 instead of a Recipe Part. The daily chest no longer adds a part.
- Old system kept intact (parts, recipes, slots, upkeep). `FR_SIMPLE=false` restores it. Players' parts are kept.
- Tests: new `tests/kitchen-simple-8237.test.cjs`; `expedition-8232` updated.
