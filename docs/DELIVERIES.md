<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.3.9 — Store test APK finds new versions

- **"Mochi Store Test" update check:** on start, the app (id ending `.store`) reads the live `version.json` on GitHub Pages.
  - If it is newer than the app's `GAME_VERSION`, the existing "📲 New app version" popup opens once the menu is up.
  - **⬇ Download update** opens the `store-apk-latest` APK in the browser.
  - **Later** stays quiet for that version until tomorrow.
  - Offline, or same/older version: nothing shows.
- Other builds keep their old checks: the live-update APK uses `MIN_APK_VERSION`, and the Play Store build updates through Play.
- Test: `tests/store-apk-update-839.test.cjs`.

# Previous delivery: v8.3.8 — ECRS app size: 188.3 → 175.7 MB

- **S (audio):** all 1,465 shipped MP3s re-encoded with the new packing standard. 53.7 → 42.0 MB.
  - Music/story: 64k, channels kept.
  - Voice/acting: 48k mono.
  - SFX: 64k mono.
  - `scripts/compress-assets.py`, the wire-art skill and CLAUDE.md now use these numbers. The ledger `assets/RECOMPRESSED.json` was refreshed, so delivery tests still match the original masters.
- **E (art):** removed 17 asset keys that no code reads (0.5 MB): unused currency icons, gear_card_* tiles, old Taro icons/beacon ring, minion attack sheets, buckshot card. Files stay in the repo and are no longer shipped.
  - Kept on purpose: Patrol art (Expedition uses it) and Kitchen recipe icons (in-run recipes use them).
- Also re-packed 47 WebP that were still above the existing standard (−0.5 MB).
- **Store-like test APK:** android.yml job `store` bundles the game like the Play Store build. Release `store-apk-latest`, app "Mochi Store Test".
- Tests: mobile-ui-art skips the retired tiles; the A23 test reads the recompression ledger. CI passes, shipped app 175.7 MB.
