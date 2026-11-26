<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.3.13 — Owner round: shorter waves, wider camera, smaller EXP gems, tap side events, first chest fixed

- **C1 waves ≤ 30 s:** `C1_WAVE_SEC` 24/30/–/30/30. Recovery at the start of wave 4 is 8 s (`C1_RECOVERY_SEC`). The timeline model and test are synced.
- **Camera sees 20% more:**
  - `computeViewZoom` BASE 0.74 → 0.74/1.2.
  - Boss/mini zoom-out is only 8% more than before (`0.58×1.2/1.08`, `0.68×1.2/1.08`).
- **EXP gems and pickups 25% smaller** (`PICKUP_SIZE=.75` on `XP_ORB_PX` and `showPickupCue` incl. glow/ring).
- **Slower late levels:** `storyXpNext` ×(1+2%/level above 10) → Lv 20 needs ~20% more (`XP_LATE_GROW`).
- **Side events can be tapped:**
  - Tapping within 84 px of the object starts it. Walking onto it still works.
  - Label "Tap to start". The input listener is removed with the objects.
- **First chest is fixed:** the very first chest/flavor box a player opens gives one Common item (`firstChestDone`). Owner: a Legend dropped during the tutorial.
- **Lobby art after the tutorial:**
  - `lobbyPreload` now runs on the tutorial-complete screen.
  - The hero-card retry keeps polling while Ruby guide overlays are open, instead of giving up.
- Tests updated: zoom asserts, story-budget level 18 → 17, timeline. Headless: tapping Hunger’s Mouth on C1-2 starts it, no errors.

# Previous delivery: v8.3.12 — Chapter 1: combat situations every wave, opt-in side events, smarter Combat Director

- **Main missions = combat situations (owner):** every C1 wave (1, 2, 4, 5) has a named situation with a banner hint (`C1_SITUATIONS`, 5 stages × 4).
  - Situations include C1-1 Tunnel Ambush / Soldier Line / Spitter Barrage / Colony Swarm, C1-2 Pipe Burst / Clog Commander / Sewage Shift / Flood Swarm, etc.
  - It starts 2 s into the wave (wave 4: after the 20 s recovery).
  - Goal within `C1_SIT_SEC` 20 s: `pack` = defeat the marked group · `leader` = defeat the commander · `dodge` = no hazard hit.
  - Meeting the goal gives an **EXP burst** (50% of the next level, 6 orbs). Missing it just passes.
- **Side missions = map objects for the whole stage:**
  - Each stage has its own event plus 1 met earlier (C1-1 has Hunger Herald only). New short versions: Hunger Herald (C1-1) and Grandma’s Golem (C1-5).
  - Walk onto an object to start it. Ignoring it has no penalty. One at a time.
  - The Director pauses spawns while one runs. The timed auto-start is gone.
  - Objects stay across waves and are cleared on stage start, menu and death.
- **Combat Director picks by conditions:** `chapterCombatPick` scores stage identity (`C1_STAGE_PATTERN_WEIGHT`) × time in wave (heavy late) × field fill.
  - ≥70% live cap → heavy patterns ×0.15 · ≤30% → heavy ×1.5.
  - The last 2 patterns never repeat. Random only on ties.
- **No HP scaling from player power in C1 continuous combat:**
  - The `getPowerGuide` "over recommended" bonus (enemy HP/dmg) is off.
  - `bossHpMul` ignores player level.
  - Other modes keep their rule.
- **Card before the stage:** shows each wave’s situation name + "Side events: …".
- Test `tests/c1-situations-8312.test.cjs`. Headless:
  - C1-1: situations won/lost, Herald started by touch.
  - C1-4: leader/pack/dodge all won, 2 side objects.
  - No errors.
