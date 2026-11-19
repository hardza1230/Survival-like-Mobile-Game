<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.35 — 📦 App size 187.7 → 173.3 MB (unused files out of the build) + Ruby tip crash fix

- **Lobby hero motion sheets (order 34), ~14 MB:** off since v7.9.61 (`LH_USE_SHEETS=false`) but still shipped. `scripts/build-www.mjs` now has a `NOT_SHIPPED` list, so these files stay out of the build while the flag is false. The source files stay in the repo.
- **Old Patrol track `tea_for_two_temple`, ~1 MB:** removed from `ASSET_AUDIO`. The `patrol` music entry now plays the main menu music.
- **Old Dig board art (16 files in `assets/art/dig/`):** no longer registered. `dig_bg` and `dig_shovel` stay, and so does the `menu_orders` dig art, which is part of a tracked set.
- **Fix:** the Ruby first-time tips for Atlas and Expedition called `VoiceActing.play` without its `valid` callback, which threw "valid is not a function" when the voice finished loading. Both calls now pass a screen check.
- **Check:** a headless boot through hub, Loadout, Weave, Activities and Expedition shows no 404s and no page errors. App size is 173.3 MB (limit 190).

# Previous delivery: v8.2.34 — 🔊 Temple Expedition sound (A19): taps, titans, boss timer, helpers, music, Ruby

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
