<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.36 — 🧹 ECRS E1: retired code removed (old Dig board, Patrol screen, Overcharge, Lobby motion sheets)

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

# Previous delivery: v8.2.35 — 📦 App size 187.7 → 173.3 MB (unused files out of the build) + Ruby tip crash fix

- **Lobby hero motion sheets (order 34), ~14 MB:** off since v7.9.61 (`LH_USE_SHEETS=false`) but still shipped. `scripts/build-www.mjs` now has a `NOT_SHIPPED` list, so these files stay out of the build while the flag is false. The source files stay in the repo.
- **Old Patrol track `tea_for_two_temple`, ~1 MB:** removed from `ASSET_AUDIO`. The `patrol` music entry now plays the main menu music.
- **Old Dig board art (16 files in `assets/art/dig/`):** no longer registered. `dig_bg` and `dig_shovel` stay, and so does the `menu_orders` dig art, which is part of a tracked set.
- **Fix:** the Ruby first-time tips for Atlas and Expedition called `VoiceActing.play` without its `valid` callback, which threw "valid is not a function" when the voice finished loading. Both calls now pass a screen check.
- **Check:** a headless boot through hub, Loadout, Weave, Activities and Expedition shows no 404s and no page errors. App size is 173.3 MB (limit 190).
