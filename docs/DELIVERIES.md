<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.39 — 🔓 No more freeze when entering a stage (new hero pick)

Owner bug report from the phone (v8.2.37, 🐞 "stuck" on `menu:char`): after getting Mint at 1-2, tapping Mint did nothing.

- Cause: after the hero pick and Ruby's story scene, `startRun` waits for several loads (all assets → hero art → stage art → warm-up). Each wait sets `_enteringStageArt` and only continues from a load callback. Meanwhile the Heroes screen stays on with no tap zones, and parts of the wait had no loading screen. If a callback never arrives (slow web load in the debug APK), the game stayed stuck.
- New `runWatch(idx)` runs on every wait. It shows the loading screen and keeps it visible (re-shows it every second if hidden). After `RUN_WAIT_MAX` = 45 s per step it clears the flag, sets `_runForce`, and starts the stage with fallback art (telemetry `run_wait_timeout`). The warm-up step now uses the same flag.
- Verified headless: the real flow (1-1 clear → 1-2 → rescue comic → Choose Mint → tap Mint) still starts normally. With stage art forced to hang, the loader stays up and the stage starts after 45 s.
- Test: `tests/run-watch-8239.test.cjs`.

# Previous delivery: v8.2.38 — 💥 Shotgun pellets +25%

Owner request after tester feedback (20 Nov, v8.2.37: "Shotgun build is too hard against bosses").

- New `SG_PELLET_MUL = 0.45 × 1.25` replaces the hard-coded ×0.45 pellet damage in both Momo basic-attack paths (`castSkill` sprinkle and the Berry Seed path). Close-range bonus, slug, Double Barrel and evolution multipliers are unchanged and stack on top.
- `taro-foundation` legacy hash normalises the new text; regression check added to `kitchen-simple-8237`.
- QA bots: nightly report crash fixed earlier today (scripts only).
