<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.87 — A22 boss twists and Crown Root audio

28 direct ElevenLabs masters delivered and wired: 20 SFX plus eight owner-approved Ruby lines with the existing A07 voice. Packed SFX96k/voice56k total334,195bytes, all packed true peaks≤−1dBTP. Literal ASSET_AUDIO/A07_CATALOG URLs; stageCh2+ SFX loading, Ruby on demand, excluded from menu/core and deferred preload. Hooks cover all five twist starts/survival, seed pop/hatch/fruit impact, Crown Root loop/warn/strike/anchor/Perfect/combo/stuck/head burst and random Seed Rift warn/open/feed/close. Shared root loop stops on no burrowing heads, finale, cleanup, pause/mute/death and scene shutdown. Voice noRuby/once/stage-epoch/owner guards prevent stale playback; old cues remain fallback and A21 supplies head hits. Gameplay values unchanged. Updated the voice-catalogue contract from552 to560 for the eight approved A22 lines; added tests/audio-a22.test.cjs to npm run check for28 source/runtime assets, exact text, fallback, voice validity and loop/rift lifecycle. Validation: all260 package checks and all11 Chrome UI contracts passed via bash scripts/ci-checks.sh, build/www181.9MB; packed-only compression audit found0 changes. Live deployment is verified after publication; owner phone listening remains.

# Previous delivery: v8.2.86 — 🎨 Art 94 + 95: Crown Root, poison fog, Abyss Brute, rift warning, badges, boss twists

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
