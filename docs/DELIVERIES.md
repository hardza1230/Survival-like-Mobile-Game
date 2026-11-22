<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.60 — 🔑 Faster Google sign-in (native account sheet)

**Owner:** signing in with a new Google account was slow on the Google web pages.
- **Native sign-in (Android Credential Manager):** plugin `@capgo/capacitor-social-login` 8.7.7 → account sheet from the bottom of the screen, no browser → Google ID token → Supabase `signInWithIdToken` (SHA-256 nonce). Needs `GOOGLE_WEB_CLIENT_ID` (empty for now) + a new APK; until then the old Custom Tab is used (no break).
- **Fallback path faster:** the browser closes right after the deep link returns; cloud pull is one query (`data,stats`).
- **Timing:** Tele event `login` (`way` native/tab · `ms` · `res`).
- `android.yml` prints the debug signing SHA-1 · owner setup steps: `docs/PLAY_CONSOLE_SETUP.md` (last section).
- Test: `tests/google-native-8260.test.cjs`.

# Previous delivery: v8.2.59 — 🍭 Lollipops: real money buys looks only, never power

- **Owner (22 Nov):** 🧶 Thread buys power (gear Enhance, Weave Rank up, Ancient perks), so it must never be sold. The new real-money currency is **🍭 Lollipops**.
- **Save:** `Save.lollipops / addLollipops / spendLollipops` (`data.lollipops`). It is spent only inside `Cos.pay` (wardrobe items and skins).
- **IAP:** packs are now `lolli_*` (not yet registered in Play Console), and `Iap.grant`, the Mochi Pass instant reward and the daily claim all give 🍭 instead of 🧶. `IAP_ENABLED` is still false, so the shop tab stays hidden.
- **Cosmetics pay either way at the same price:** `Cos.buy(id,cur)` / `Cos.buySkin(id,cur)`. When the player owns any 🍭, the Wardrobe shows two buttons (🧶 | 🍭, `wardPayRow`); with 0 🍭 the screen is unchanged.
- **Other UI:** the shop tab is labelled "🍭 Shop" and its texts show 🍭; the old "Dig in Temple Depths" hint now names the real Thread sources. The lobby shows a 🍭 pill only when the player has some, and GM has "+1,000 Lollipops".
- **Tests:**
  - New `lollipops-8255` scans that `spendLollipops` is only called by `Cos.pay`, that there is no 🍭 → 🧶 conversion, and that power sinks never touch 🍭.
  - `thread-shop`, `bazaar-tabs` and `owner-round149` updated.
  - Headless: GM 🍭 500 → the lobby pill shows, and the Wardrobe buys a pet for 🍭 300 while 🧶 stays untouched.
- Merged the other session's v8.2.55–58 (order 92/93 art, Frozen Pantry army, mission VFX) first.
