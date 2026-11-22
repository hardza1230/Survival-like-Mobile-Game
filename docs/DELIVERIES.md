<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.61 — ⚔️ Expedition simplified (no tapping needed)

**Owner:** Expedition asked too much of the player → simplify, don't remove (screen `dig` is #8 of 25 by real visits).
- **Hero fights on its own:** hero auto-attacks (Hero Power = old Tap Power `e.tap`, ×`EXP_HERO_APS`=2/s) · counts offline too · tapping still works but is optional.
- **Boss retries itself:** out of time → train 10 foes → boss again · "Fight Boss" button removed.
- **⬆ Upgrade all:** one button buys the best DPS-per-Crumb upgrades until broke (max `EXP_UPALL_MAX`=200 per tap) · single rows stay.
- **Supplies refill themselves:** last packed supply rebuys on stage start / Expedition open when Crumbs allow · tap it again = auto off.
- Rewards unchanged · old saves work · team/roles plan moved to after Closed test (`docs/IDEAS.md`).
- Test: `tests/exp-simplify-8261.test.cjs` (+ `expedition-8232` updated).

# Previous delivery: v8.2.60 — 🔑 Faster Google sign-in (native account sheet)

**Owner:** signing in with a new Google account was slow on the Google web pages.
- **Native sign-in (Android Credential Manager):** plugin `@capgo/capacitor-social-login` 8.7.7 → account sheet from the bottom of the screen, no browser → Google ID token → Supabase `signInWithIdToken` (SHA-256 nonce). Needs `GOOGLE_WEB_CLIENT_ID` (empty for now) + a new APK; until then the old Custom Tab is used (no break).
- **Fallback path faster:** the browser closes right after the deep link returns; cloud pull is one query (`data,stats`).
- **Timing:** Tele event `login` (`way` native/tab · `ms` · `res`).
- `android.yml` prints the debug signing SHA-1 · owner setup steps: `docs/PLAY_CONSOLE_SETUP.md` (last section).
- Test: `tests/google-native-8260.test.cjs`.
