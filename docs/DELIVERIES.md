<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.33 — 🎨 Temple Expedition art (order 91) + sound order A19

- **Packed:** `scripts/pack-expedition91.py` → 13 WebP, 677 KB, 18 MiB decoded. Menu-lazy: the art loads only with the Expedition (`dig`) screen through `menuGroupRe`.
- **Deep backgrounds:** `ex91_bg_c1..3` follow the Chapter cycle (every 25 stages). Fallback: the Patrol scene.
- **Titans:** front-facing `ex91_titans` (4 per Chapter). Bosses use `ex91_bosses`.
- **Hit flash:** the hit flash is now a white tint fill, so art keeps its colours.
- **Main hero:** back-view `ex91_back_<hero>`, with feet on the scene floor. Each tap plays attack frames 1→2→3→0.
- **Helpers:** small back sprites. Ruby keeps the emoji badge.
- **Tap FX:** `ex91_hit` plays at a random spot on the titan, tinted with the hero colour.
- **Crumbs icon:** shown on the stats line.
- **Audio order A19:** 17 SFX (3 soft tap variants, crit, pop, boss appear/tick/down/fail, hire, milestone, chest, supply, welcome back), 2 loops (expedition / boss) and 4 Ruby lines.
- Test: `tests/expedition91-art.test.cjs`. Headless: all art loads on the screen and the titan, back-view hero and hit FX are used.

# Previous delivery: v8.2.32 — ⚔️ Temple Expedition: a tap-RPG idle mode replaces Temple Depths (Dig) and Mochi Patrol

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
