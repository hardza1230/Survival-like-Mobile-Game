<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.84 — 🎞️ Animation phases 5C/5D/6 + phase 4 fixes · 🔊 A20 Ruby stage entry

- **Animation phase 5C** (Ch3 + Pinnacle boss VFX, 28 sheets: warning rings, waves, beams, sweeps, counters), **5D** (11 boss shots + shared counter ring) and **6** (Ruby point, 6 Expedition rear heroes, level-card border, hub firefly/moon, 5 hub buttons) are wired as 8/12-frame sheets.
  - `scripts/pack-motion-phase5c-6.py` → `scripts/motion-phase5c-6.json`, 55 sheets, 3.5 MB.
  - Same cycle time as before. Damage, timing and hitboxes unchanged.
- **Manual players updated:**
  - `tickBossShotLoops` reads the registered frames/rate (8@16 = the old 0.5 s loop).
  - Expedition rear strike plays `[1..7,0]` over the old 165 ms.
  - Ruby point plays 8 cells × 90 ms (old 720 ms loop).
  - The rear-hero sheets stay in `expedition91/` so they keep loading lazily with the menu (checked with `artClass`).
- **Phase 4 fixes:** Ant Drone attack/windup and Equinox Guardian attack now use 8 frames (appended clips, `motion-phase4.json` 51 atlases).
- **A20 audio** (26 files, 472 KB): the stage-entry curtain plays curtain in/out, a chapter stinger (boss stinger on stages 5/10/15), footsteps and Ruby's intro line the first time (`vo_ruby_go_01..15`), and a short repeat line 50% of the time after that.
  - Respects the Ruby-off setting. A20 SFX preload with stage audio.
- Older art tests read game.js through the legacy view (`tests/lib/motion-phase5c-6-legacy.json`). New test `motion-phase5c-6-a20`. Boss-shot review check reads the frame count. App size 179.8 MB.

# Previous delivery: v8.2.83 — ⚡ Spark volley · ⚠️ Boss twists · 🌀 Seed Rift event · 🖼️ Stage loading cover

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
