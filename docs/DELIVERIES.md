<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.85 — 🔊 A21 combat sounds: attack and hit variations

- **A21 combat SFX (69 files, 365 KB):** 15 hero attack families × 3 (Momo ricochet/sniper/shotgun · Mint needle/shard · Cocoa fire fist/finisher/rocket/Titan · Taro arc/spark · Sesame flare · Lime arrow/Pomelo punch/Blood Orange spell) + material hits (mochi/armor/ice/plant/crystal ×4) + critical ×4.
- **Wiring:**
  - `Sfx.playFile` swaps each old cue (`A21_REF`, and `sfx_shoot` for Momo) for a random loaded variant, never the same one twice in a row. The old cue stays as fallback when a file isn't loaded.
  - Critical replaces the crit + accent pair.
  - Kills play a material hit (`a21Mat`: tank/siege/elite/mini = armor · C1-4 ice · C2 plant · C3-2..5 crystal · else mochi). Visual-only guess, no damage effect.
  - Taro Spark and Sesame flares get their own cue (once per volley).
  - The active hero's bank + hits load with the stage audio.
- **Audio order renamed:** my boss-twist order is now **A22** (A21 was taken by this delivery). `head_hit` dropped from A22, it reuses `hit_plant`.
- Test: `tests/audio-a21-combat.test.cjs`. Headless: all 69 load, variants rotate, material/critical play.

# Previous delivery: v8.2.84 — 🎞️ Animation phases 5C/5D/6 + phase 4 fixes · 🔊 A20 Ruby stage entry

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
