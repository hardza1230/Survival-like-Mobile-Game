<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.37 — 🍳 Kitchen simplified for the Closed test (plan C)

Owner chose plan C: test one question — is it fun when the moves you press (Dash / Unique / getting hit) trigger a bonus?

- `FR_SIMPLE=true` + `FR_PRESETS` (4 signature dishes): Sugar Rush Slam (Dash → Shockwave), Double Helping (Unique → 8-Way Shots), Brain Freeze (Below 30% HP → Freeze), Candy Armor (When Hit → Wipe Enemy Shots).
- Pick 1 (`Save.data.frPick`), tap again to remove, free swap. No HP/AP upkeep. No parts, slots or Rank Points needed. Old part stars ignored (all lv1 + signature bonus).
- New `buildKitchenSimple` screen titled "Flavor Kitchen". Red dot until the first pick. Hub row text updated.
- Expedition: boss every 10 stages gives 🧶 +10 instead of a Recipe Part. The daily chest no longer adds a part.
- Old system kept intact (parts, recipes, slots, upkeep). `FR_SIMPLE=false` restores it. Players' parts are kept.
- Tests: new `tests/kitchen-simple-8237.test.cjs`; `expedition-8232` updated.

# Previous delivery: v8.2.36 — 🧹 ECRS E1: retired code removed (old Dig board, Patrol screen, Overcharge, Lobby motion sheets)

- **Removed (~46 KB of game.js, 3.95 MB → 3.91 MB source):**
  - Old Dig board: `buildDig` body, `digCell`/`drawDigCell`/`digResolve`/`digDescend`/`digLightAt`/`digFinish`/`digChestOpen`, the FX helpers, `DIG_ITEMS`/`digTable`/`digMakeBoard`, and the free/shop shovel helpers. `buildDig` now just opens the Expedition.
  - Patrol screen: `buildPatrol`/`patrolTick`/`patrolHud`/`patrolDimOn`/`patrolFps`. The `patrol` route opens the Expedition. `patrolStop`/`patrolData`/`patrolCollect` stay so old saves still collect their pending loot.
  - Overcharge mission (off since v8.1.103): `overchargeOffer`/`Tick`/`End` and their two call sites.
  - Lobby motion sheets (order 34, off since v7.9.61): `LH_SHEETS`/`LH_USE_SHEETS` and `lhKey`/`lhLoad`/`lhPlay`/`lhTap`/… The lobby hero uses the warp/static path as before.
- **Kept:**
  - Boss Rush, because Pinnacle runs on the same code.
  - `Save.dig()` as a minimal record for the Expedition migration.
  - Expedition's reuse of `patrolScene`/`patrolPop`.
- **Tests:** removed `depths-polish` and `dig-lifecycle` (they tested the old board). Six tests lost their retired Patrol/Overcharge/Dig assertions.
- **Check:** a method/const diff shows only the intended names removed. A headless pass over hub, Loadout, Weave, Activities, Expedition and the old Patrol route had no errors or 404s.
