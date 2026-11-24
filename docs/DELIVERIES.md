<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.86 — 🎨 Art 94 + 95: Crown Root, poison fog, Abyss Brute, rift warning, badges, boss twists

- **Order 94 (14 sheets):**
  - **Lure the Crown Root:** burrowing head, warning crack, root strike, anchor break, and the stuck crown head (12-frame loop over the tank hitbox via `artFollow`) with hurt flashes and the final burst.
  - **Clear the Fog:** the scrolling `fg94_fog_tile` replaces the flat fill, the hero's light gets a misty `fg94_lantern_edge` rim, and painted `fg94_dark_claw` frames point inward.
  - **Hunger Crack:** Abyss Brute painted walk sheet.
  - **Seed Rift event:** 1.5 s ground-tremble warning (`SR_EVENT_WARN`) before the rift opens.
  - Perfect Dodge / Root combo badges behind the text.
- **Order 95 (14 sheets, boss twists):**
  - Root tiles + spitting root tips.
  - Seeds drop / idle / pop / hatch.
  - Fruit fall + splat (lands when the 760 ms warning ends).
  - Frenzy vignette + up to 20 monster auras.
  - Shadow summon + shadow auras.
  - A twist chip on screen with icon, name and seconds left.
- `scripts/pack-art94-95.py` → 28 WebP, 1.47 MB (black-background VFX → luminance alpha). All `stage`-lazy, loaded only with the stages or missions that use them. Boot memory unchanged.
- Every hook keeps the old code-drawn visual as fallback. Twists and the rift clean up at stage end.
- Test: `tests/art94-95.test.cjs`. Headless browser: all hooks ran on C2-5 (Crown Root to finale, fog, brute, rift warning, 5 twists) with no errors.

# Previous delivery: v8.2.85 — 🔊 A21 combat sounds: attack and hit variations

- **A21 combat SFX (69 files, 365 KB):** 15 hero attack families × 3 (Momo ricochet/sniper/shotgun · Mint needle/shard · Cocoa fire fist/finisher/rocket/Titan · Taro arc/spark · Sesame flare · Lime arrow/Pomelo punch/Blood Orange spell) + material hits (mochi/armor/ice/plant/crystal ×4) + critical ×4.
- **Wiring:**
  - `Sfx.playFile` swaps each old cue (`A21_REF`, and `sfx_shoot` for Momo) for a random loaded variant, never the same one twice in a row. The old cue stays as fallback when a file isn't loaded.
  - Critical replaces the crit + accent pair.
  - Kills play a material hit (`a21Mat`: tank/siege/elite/mini = armor · C1-4 ice · C2 plant · C3-2..5 crystal · else mochi). Visual-only guess, no damage effect.
  - Taro Spark and Sesame flares get their own cue (once per volley).
  - The active hero's bank + hits load with the stage audio.
- **Audio order renamed:** my boss-twist order is now **A22** (A21 was taken by this delivery). `head_hit` dropped from A22, it reuses `hit_plant`.
- Test: `tests/audio-a21-combat.test.cjs`. Headless: all 69 load, variants rotate, material/critical play.
