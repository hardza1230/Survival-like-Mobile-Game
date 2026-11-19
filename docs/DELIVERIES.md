<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.28 — ✨ SCAMPER round 2: golden waves, first-time missions, boss missions

- **Golden wave** (`goldWaveRoll`, 5 %): Story waves only, not the first C1-1 run, replay meter, Delve or tutorial. Normal monsters turn gold (`GOLD_TINT`) and mission rewards are doubled: Sugar, the mission currency drop and gear boxes, plus the half reward when time runs out. A "✨ GOLDEN WAVE!" banner shows at the start.
- **First time a mission appears** (`missionLog` not set): the wave gets +20 % time (`FIRST_TIME_MUL`) and a "🆕 New mission" banner shows its steps. The spotlight focus on the target is forced (`missionIntroExtra`).
- **Boss missions** (`BOSS_MISSION`, stages 5–14 only, so nothing new in Chapter 1): at 60 % boss HP the boss calls a mission that fits it. The mission uses the side-mission system for 45 s, and finishing it pays the side-mission reward.
  - Missions: Rootmother's Bud and True Rootmother and First Planter → Creeping Roots; Mycelium Behemoth and Harvest Colossus → Seed Rift; Hornet Queen and Seedwarden → Shake the Trees; Chronobloom and Hollow Bloom → Last Light; Glass Gardener → Mirror Path.
  - The mission ends when the boss dies. Boss music still has priority.
- Test: `tests/scamper-8228.test.cjs` + headless boss check (stages 6, 7, 10, 12: mission starts at 60 % and clears on boss death).

# Previous delivery: v8.2.27 — 🃏 SCAMPER round 1: side arrow, reroll, reward on cards, Double Clear, mission juice

- **Side-mission arrow:** a blue arrow (outer ring) points at the side mission's next target, using `questFocusTargets` inside `stackRun` (refreshed every 0.25 s). Main arrow unchanged.
- **Deal cards:** the lifted card now shows its reward line (`🎁 <mission reward> · 🍬 Sugar`). **Reroll** button under the row: 1 free per deal, then 1 more by rewarded ad (`showRewardedAd`). Rerolls the whole set except the stage card; the lesson plan (C1-1 first run) cannot reroll.
- **Easy→hard:** dealt cards stay random but are ordered by `MISSION_TIER` (general → stage signature → big missions).
- **Curse pads:** show `Win: 🍬 +N` (the real pot gain for that round) instead of `% loot`.
- **Less text:** `floatText` keeps at most `FLOAT_MAX`=5 on screen; repeats within 0.6 s and 90 px merge into one; "Empowered!" became 💜.
- **Mission finish juice:** `missionJuice` = hit-stop 90 ms + gold flash + small shake + ring; mission Sugar pops then flies to the hero after 0.6 s (`MISSION_PULL_MS`).
- **Double Clear:** main + side mission done in the same wave → a Gear box + extra Sugar + banner (`doubleClearMark`).
- **Shorter big missions:** Trial 200→150 s, Golem/Pot 120→100 s, Vault Altar 150→120 s.
- Test: `tests/scamper-8227.test.cjs`.
