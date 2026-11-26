<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.3.8 — ECRS app size: 188.3 → 175.7 MB

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

# Previous delivery: v8.3.7 — Portrait layout and visible Chapter 1 waves

The canvas and stage loader now share a portrait frame on wide or square displays, including touch and native viewports. Chapter 1 first-clear waves bring ordinary reinforcement packs and director formations into visible, map-safe positions, with a 420 ms arrival window before damage or contact and a more frequent formation cadence. Updated viewport, spawn grace and timeline regression checks, and verified the loading frame at phone and tablet sizes and across rotation.
