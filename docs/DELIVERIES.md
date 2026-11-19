<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.32 — ⚔️ Temple Expedition: a tap-RPG idle mode replaces Temple Depths (Dig) and Mochi Patrol

- **Where:** Weave → Expedition (the old Depths tile and badge, unlocked after Chapter 1). The Patrol row is removed from Activities.
- **Tap to fight:** tap the scene to hit the foe in the middle. Crits are 5% for ×3; damage numbers and squash on each hit.
- **Stages:** 10 foes per stage. Foe HP grows ×1.25 per stage, and each kill gives 🍪 Crumbs.
- **Bosses:** every 5 stages. A boss has ×6 HP and a 30 s timer. If time runs out, you farm the previous stage until you tap ⚔️ Fight Boss.
- **Upgrades:** Tap Power, plus helpers (Ruby + each owned hero) who deal DPS on their own. Helper DPS doubles every 25 levels.
- **Offline:** helpers keep fighting at 50% for up to 8 h. On return a "While you were away" toast shows the result.
- **Main-game rewards** (these replace what Dig used to give):
  - First clear of each boss: 🍬 Sugar and 🧶 Thread, plus a Recipe Part every 10 stages and currency every 25.
  - Daily chest: Sugar, Thread and a Recipe Part, scaled by the best stage reached.
- **Crumbs help real stages (Supplies):** pack 1 supply for your next Story or Delve stage. It is used up when that stage starts. Options: 🫧 start with a shield, ⭐ +25% EXP, 🍬 +20% Sugar, ❤️ +15% max HP.
- **Migration:**
  - Shovels convert to Crumbs (×40). Shovel drops (minibosses, Treasure Sense, rewards) now give Crumbs.
  - Threads waiting with the Miners and pending Patrol loot are collected automatically.
  - The Daily quest "Dig 5 tiles" becomes "Defeat 30 Expedition foes".
- **Art:** placeholders for now (Patrol scene + scaled Patrol foes + hero sprite). Art order 91 covers back-view heroes, front-facing titans, bosses, deep backgrounds, hit FX and icons.
- **Later (after the Closed test):** active skills, Prestige and Temple Relics.
- Test: `tests/expedition-8232.test.cjs`. Headless: offline crumbs, taps clear stage 4 → boss 5 → stage 6, daily chest, upgrades, supplies, and the mode stops when leaving the screen.

# Previous delivery: v8.2.31 — 🎨 Art and voice for Pact Relics, Mission Atlas and the new mission events (orders 88/89/90 + A18)

- **Packed:** `scripts/pack-orders88-90.py` → 20 WebP, 310 KB, 5.4 MiB decoded. `scripts/pack-audio-a18.py` → 8 Ruby lines (56k mono) + 10 SFX (96k). App size 185.9 MB.
- **88 Pact Relic icons:** `relic_<key>` in `assets/art/relics88/`, stage-lazy like relics81. Cards pick them up automatically; the emoji stays as fallback.
- **89 Mission Atlas (menu-lazy `atlas89`, loaded by `maArtLoad`):**
  - Node icons go on the tree and list rows.
  - The 3-state nine-slice node frames show only on WebGL.
  - The emblem sits in the header, and the Atlas button is drawn with art.
- **90 mission events (stage-lazy `ev90_`):**
  - Image arrows replace the gold/blue ➤ text (`arrowArt`, which follows the text's position and angle).
  - Gold shimmer follows golden monsters (`goldShimAdd` / `goldShimTick`: every other monster, 16 max, the monster stays visible).
  - Gold burst at the start of a golden wave. Double Clear burst.
  - Red boss-mission chip. Reroll icon (free / ad). Cursed Crown curse icon pops above the hero.
- **A18 audio:**
  - Ruby voice: golden, double, bossmission, newmission, reroll, curse and jackpot reacts, plus the Atlas tip on first open.
  - SFX: reroll, golden wave, double clear, boss mission, mission impact, curse, Atlas star / pick / remove, jackpot.
  - Missing files fall back to the old sounds.
- Test: `tests/orders88-90-a18.test.cjs`. Headless: Atlas renders with art (6 nine-slices), golden shimmer follows 2 of 4 gold monsters, both image arrows show, no errors.
