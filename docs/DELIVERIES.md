<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.3.14 — Store app update prompt fixed
Owner: Store-like APK (appId .store) on 8.3.12 never prompted for 8.3.13. Causes: the web version check ran once per launch (2.5 s after boot) and the popup lived in `this.menu`, so any menu rebuild (removeAll) wiped it silently. Fix in `src/27-game-hero-skills.js`: `checkStoreApkUpdate` stores `_storeLatest` and sets `_apkPending`; new `storeShowLoop` re-shows the popup every 1.5 s on the Hub while pending (token-guarded, stops on Download/Later); new `storeUpdateTick` re-checks on Hub return (≥60 s gap, hook in `showMenu`) and on app resume (≥5 s, `storeResumeHook` = Capacitor `appStateChange` + `visibilitychange`). `checkApkUpdate` keeps routing to the tick after the first launch. Updates page (`buildNews`): in the Store app shows "vX available" and a pulsing gold "Download vX now" button; the button now opens the Store APK via the Browser plugin (before it downloaded the debug APK = wrong app). Test: `tests/store-apk-update-839.test.cjs` extended (re-show after wipe, Hub-only, stop on choice, Updates redraw, throttle).

# Previous delivery: v8.3.13 — Owner round: shorter waves, wider camera, smaller EXP gems, tap side events, first chest fixed

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
