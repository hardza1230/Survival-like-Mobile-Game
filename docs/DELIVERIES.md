<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.29 — ⚖️ Pact Relics: the drawback goes to the stage, the reward gets better

- **Reworked 3:** the drawback now lands on the stage instead of the hero.
  - Heavy Armor: no more slow walk; Elites come 50% more often, and Elites drop gear 50% more.
  - Sugar Rush trade-off: no more extra damage taken; monsters move 15% faster, and +20% Sugar.
  - Cracked Crystal: no more −25% HP; monsters have +20% HP, and gear rolls a higher rarity 25% more often.
- **New 8 (from Chapter 2, `ch2`):**
  - 🏮 Storm Lantern: +30% vs shocked. Mirror Path / Last Light shadows and moths twice as often. Those missions give +1 currency.
  - 🍯 Golden Appetite: +30% Sugar. Monsters 10% faster. Golden Wave chance rises to 12%.
  - 🪝 Elite Bait: +20% vs Elites, minibosses and bosses. Twice the Elites, and they drop gear 50% more.
  - 👑 Cursed Crown: each wave rolls a curse (Swarm, Elite Pack or Fast Monsters). Mission rewards +50%.
  - 🧊 Frost Debt: +20% vs frozen. Frozen Pantry armies +30%. Pantry rewards ×1.5.
  - 🌱 Root Pact: +20% damage in root missions. Creeping roots grow 25% faster. +1 currency from root missions.
  - ⏳ Hasty Clock: −10% cooldowns. Mission waves 15% shorter. Mission rewards +40%.
  - 🪟 Glass Garden: +25% damage. Monster bullets 20% faster. +1 Star Sugar on stage clear.
- **Cards:** the Relic card shows the gain, then 🔴 Stage and 🎁 reward lines; Trade-off cards add 🎁.
- **Code:** stage effects come from `RP_FX` through `rpMul` / `rpAdd` / `rpMsnRw` / `rpCurPlus`. The Cursed Crown curses are listed in `RP_CURSES`.
- Icons are placeholders (emoji). An art order comes later.
- Test: `tests/pact-relics-8229.test.cjs`. Headless check: new relics are offered in Chapter 2 but not in Chapter 1, the card screen renders, and a wave with all of them held runs without errors.

# Previous delivery: v8.2.28 — ✨ SCAMPER round 2: golden waves, first-time missions, boss missions

- **Golden wave** (`goldWaveRoll`, 5 %): Story waves only, not the first C1-1 run, replay meter, Delve or tutorial. Normal monsters turn gold (`GOLD_TINT`) and mission rewards are doubled: Sugar, the mission currency drop and gear boxes, plus the half reward when time runs out. A "✨ GOLDEN WAVE!" banner shows at the start.
- **First time a mission appears** (`missionLog` not set): the wave gets +20 % time (`FIRST_TIME_MUL`) and a "🆕 New mission" banner shows its steps. The spotlight focus on the target is forced (`missionIntroExtra`).
- **Boss missions** (`BOSS_MISSION`, stages 5–14 only, so nothing new in Chapter 1): at 60 % boss HP the boss calls a mission that fits it. The mission uses the side-mission system for 45 s, and finishing it pays the side-mission reward.
  - Missions: Rootmother's Bud and True Rootmother and First Planter → Creeping Roots; Mycelium Behemoth and Harvest Colossus → Seed Rift; Hornet Queen and Seedwarden → Shake the Trees; Chronobloom and Hollow Bloom → Last Light; Glass Gardener → Mirror Path.
  - The mission ends when the boss dies. Boss music still has priority.
- Test: `tests/scamper-8228.test.cjs` + headless boss check (stages 6, 7, 10, 12: mission starts at 60 % and clears on boss death).
