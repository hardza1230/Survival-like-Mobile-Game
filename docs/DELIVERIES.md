<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.3.10 — Shorter Chapter 1 waves, preview cards, side events you have met

- **Shorter C1 waves (owner):** `C1_WAVE_SEC` 30/45/–/105/60 → **24/35/–/80/45 s** (recovery at the start of wave 4: 30 → 20 s). About 75 s less before the boss.
  - Side events start 4–9 s into wave 2/4 and need ≥16 s left.
- **Side events only after you have met them:** `C1_SIDE_EVENTS[].home`.
  - Hunger’s Mouth from C1-2, Grandma’s Pot from C1-3, Frozen Pantry from C1-4.
  - The stage’s own event comes first. C1-1 has none.
- **Card deal before C1 stages:** "In this stage" preview, no reroll (`c1PreviewDeal`).
  - Cards show Warm-up / Pressure / Miniboss / Escalation / Swarm / Boss.
  - The side event replaces its wave's card (wave 2 and 4) with a gold border.
  - The event that fires is exactly the one on the card (`_c1Combat.plan`).
- Timeline model + test synced to the new seconds. Headless: C1-1 (no events) and C1-4 (Frozen Pantry fired in wave 2 as dealt) ran to the reward screen with no errors.

# Previous delivery: v8.3.9 — Store test APK finds new versions

- **"Mochi Store Test" update check:** on start, the app (id ending `.store`) reads the live `version.json` on GitHub Pages.
  - If it is newer than the app's `GAME_VERSION`, the existing "📲 New app version" popup opens once the menu is up.
  - **⬇ Download update** opens the `store-apk-latest` APK in the browser.
  - **Later** stays quiet for that version until tomorrow.
  - Offline, or same/older version: nothing shows.
- Other builds keep their old checks: the live-update APK uses `MIN_APK_VERSION`, and the Play Store build updates through Play.
- Test: `tests/store-apk-update-839.test.cjs`.
