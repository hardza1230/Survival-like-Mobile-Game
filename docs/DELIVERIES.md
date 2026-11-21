<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.40 — 🔦 Mission spotlight every stage · short in-play banners

Owner request: give the other missions the same camera spotlight as Hunt the Elite (plan A: the first time each mission appears in a stage), and stop long descriptions popping up in the middle of the screen during play.

- `questFocus` now runs once per mission type per stage (`_qfRun`, reset in `startStage`) instead of the first 3 times ever per save.
- New `questFocusWhenReady(o,type)` retries every 1 s for up to 20 s until the mission's targets exist, so missions whose objects appear later get the spotlight too.
- New targets: Grandma's Golem (the golem or its spawn spot), Clean Air v2 (the fresh-air bubble), Seed Rift (the rift when no carrier is out yet). Hunger Herald now works through the retry.
- `showBanner` during play (any state except menu/title): the title alone in the centre for about 1.1 s. The description moves to one line under the mission bar for 3–4 s.
- `bannerLine()` picks that line: the part after " — " (usually the action), otherwise clauses up to 58 characters, cutting at a comma before falling back to "…". Menu banners are unchanged.
- Headless check: Herald, Golem, Clean Air and Seed Rift all get the spotlight; a second Purge in the same stage is skipped; the banner title hides at about 1 s and the line at about 4 s.
- Test: `tests/banner-spot-8240.test.cjs`.

# Previous delivery: v8.2.39 — 🔓 No more freeze when entering a stage (new hero pick)

Owner bug report from the phone (v8.2.37, 🐞 "stuck" on `menu:char`): after getting Mint at 1-2, tapping Mint did nothing.

- Cause: after the hero pick and Ruby's story scene, `startRun` waits for several loads (all assets → hero art → stage art → warm-up). Each wait sets `_enteringStageArt` and only continues from a load callback. Meanwhile the Heroes screen stays on with no tap zones, and parts of the wait had no loading screen. If a callback never arrives (slow web load in the debug APK), the game stayed stuck.
- New `runWatch(idx)` runs on every wait. It shows the loading screen and keeps it visible (re-shows it every second if hidden). After `RUN_WAIT_MAX` = 45 s per step it clears the flag, sets `_runForce`, and starts the stage with fallback art (telemetry `run_wait_timeout`). The warm-up step now uses the same flag.
- Verified headless: the real flow (1-1 clear → 1-2 → rescue comic → Choose Mint → tap Mint) still starts normally. With stage art forced to hang, the loader stays up and the stage starts after 45 s.
- Test: `tests/run-watch-8239.test.cjs`.
