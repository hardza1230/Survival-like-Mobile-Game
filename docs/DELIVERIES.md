<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.34 — 🔊 Temple Expedition sound (A19): taps, titans, boss timer, helpers, music, Ruby

- **Packed:** `scripts/pack-audio-a19.py` → 17 SFX (96k mono, `assets/audio/sfx/a19/`), 2 loops (80k stereo, `assets/audio/bgm/expedition_a19/`), 4 Ruby lines (56k mono).
- **Loading:** `exAudioLoad` loads the Expedition SFX and Ruby lines when the screen opens, because menu screens don't preload SFX. The music loads on demand through `menuMusic('dig')`.
- **Hooks:**
  - Tap: one of 3 variants at random, throttled to 70 ms; crit has its own sound.
  - Kill: pop + crumbs. Stage up has a sound.
  - Boss: appear + boss loop + Ruby "A boss!"; a clock tick each second for the last 5 s; boss down returns to the expedition loop.
  - Boss fail: sound + Ruby comfort line.
  - Helpers: hire, plus a milestone sound at each ×2 level. Tap upgrade and supply have their own sounds. Daily chest has a sound.
  - Welcome back: sound + Ruby line. The Ruby tip plays the first time the screen opens.
- **Fallback:** missing files fall back to the old dig/chest sounds or stay silent.
- Test: `tests/audio-a19.test.cjs`. Headless: all Expedition audio is in the cache after opening the screen and `bgm_ex_expedition` plays.

# Previous delivery: v8.2.33 — 🎨 Temple Expedition art (order 91) + sound order A19

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
