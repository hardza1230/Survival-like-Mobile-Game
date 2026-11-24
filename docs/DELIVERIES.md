<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.83 — ⚡ Spark volley · ⚠️ Boss twists · 🌀 Seed Rift event · 🖼️ Stage loading cover

Owner approved all four ("ทำเลยครับ · A · ภารกิจ ใช่ลูกเล่น · Seedrift สุ่ม").
- **Taro Spark Unique (Storm Mark), option A:**
  - The 18 Sparks fire at once as a fan (spread 1.1 rad, speed ×1.35) aimed at the mark, not a spinning spray.
  - They explode on contact with the boss/mini/mark. Mark 2 → 1 s (Echo +0.75).
  - Same damage numbers, the whole cast lands in about 1 s.
- **Boss twists replace boss missions (Ch2–3, `BOSS_MISSION_ON=false`):**
  - At 60% and 30% boss HP, one 15 s twist with no mission bar.
  - Twists: 🌱 Root Surge (3 roots crawl from the boss and spit monsters), 🌰 Seed Rain (step on seeds before they hatch in 3 s), 🍎 Falling Fruit (bomb circles), 🌑 Frenzy Dark (screen dims, monsters +30% speed), 🪞 Boss Shadows (3 shadow elites).
  - Surviving gives 🍬. The Gear box moved to the boss kill for Ch2–3 stages.
- **Seed Rift = random event:**
  - Removed from every mission pool: C3-1 lead, side-mission pool, deck, roam.
  - From Ch2, 15% per wave (C3-1 35%), opens 8–20 s into the wave for 20 s with a gentle pull.
  - Seed carriers run in. Each one fed grows the rift and spills 2 monsters; each one killed gives 🍬. Never extends or blocks the wave. Rift/carrier art loads on Ch2–3 stages.
- **Stage loading screen:** the stage card art as the background, the stage name and tips (4 new), shown for at least 0.8 s. It is a DOM image, so it uses no game GPU memory.
- Tests: `spark-burst-8283`, `events-8283`; `scamper-8228`, `special-picks`, `sig-missions` updated. Headless browser: all 5 twists run and end, the rift event spawns carriers and closes, the loader cover hides after play starts.

# Previous delivery: v8.2.82 — 🧹 Free old stage art before the next stage

- **Owner:** after playing a while the game stops loading art and shows fallback graphics (no crash).
- **Cause:** entering a run freed menu art, other heroes and unused endgame art, but **never other stages' art**. Every stage played stayed decoded in GPU memory, and `texBudget` only ran on menu screens. Once memory filled, new loads failed or stalled, and after the long-load watchdog the stage opened with fallback art.
- **Fix:**
  - `texFreeStages(idx)` runs before loading the next stage (and for each Boss Rush boss). It frees stage-class art that is not in `stageArtKeys(idx)` and not in the shared battle group (`texStageKeep`).
  - `texFreeForRun(idx)` does the same at run start.
  - A failed image load during play calls `texMemRelief()`: unshown textures are freed (LRU) down to 70% of `TEX_BUDGET_MB` (throttled to once per 3 s). The loader re-kicks itself every 0.6 s.
- **Headless:** loading stage 10 art 411 → 511 MB; switching to stage 3 frees 62 textures → 411 MB; a load error relieves 511 → 364 MB.
- Tests: new `tests/tex-stage-free-8282.test.cjs`, `gpu-memory-budget` updated.
