<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.27 — 🃏 SCAMPER round 1: side arrow, reroll, reward on cards, Double Clear, mission juice

- **Side-mission arrow:** a blue arrow (outer ring) points at the side mission's next target, using `questFocusTargets` inside `stackRun` (refreshed every 0.25 s). Main arrow unchanged.
- **Deal cards:** the lifted card now shows its reward line (`🎁 <mission reward> · 🍬 Sugar`). **Reroll** button under the row: 1 free per deal, then 1 more by rewarded ad (`showRewardedAd`). Rerolls the whole set except the stage card; the lesson plan (C1-1 first run) cannot reroll.
- **Easy→hard:** dealt cards stay random but are ordered by `MISSION_TIER` (general → stage signature → big missions).
- **Curse pads:** show `Win: 🍬 +N` (the real pot gain for that round) instead of `% loot`.
- **Less text:** `floatText` keeps at most `FLOAT_MAX`=5 on screen; repeats within 0.6 s and 90 px merge into one; "Empowered!" became 💜.
- **Mission finish juice:** `missionJuice` = hit-stop 90 ms + gold flash + small shake + ring; mission Sugar pops then flies to the hero after 0.6 s (`MISSION_PULL_MS`).
- **Double Clear:** main + side mission done in the same wave → a Gear box + extra Sugar + banner (`doubleClearMark`).
- **Shorter big missions:** Trial 200→150 s, Golem/Pot 120→100 s, Vault Altar 150→120 s.
- Test: `tests/scamper-8227.test.cjs`.

# Previous delivery: v8.2.26 — 📦 App size 194.6 → 185.4 MB: unused boss tracks removed, WAV → OGG/MP3, size gate in CI

Owner 19 Nov approved items 1 + 4 of the size plan. The shipped app (www/ without `*-review.*`) was 194.6 MB, over the 190 MB house limit. (1) Removed `bgm_b02`–`bgm_b15` from `ASSET_AUDIO` and deleted the files (−8.4 MB): boss music has come from the owner's chapter themes since v8.1.144/153 (`bgm_c11_boss` / `bgm_c2_boss` / `bgm_c3_boss` in `bgmKeyFor`), so those keys were never reached; `bgm_b01` stays for the tutorial boss. (4) The last 16 WAV SFX: `sfx_btn` → MP3 96k mono, the 15 rhythm `sfx_beat_*` → OGG Vorbis q4 (no MP3 encoder delay, gapless `sfx_beat_loop`) (−1.1 MB). New `scripts/check-app-size.mjs` runs in `ci-checks.sh` after build-www: prints the shipped size, lists the largest files above 185 MB, fails above 190 MB. Now 185.4 MB. Tests: all pass.
