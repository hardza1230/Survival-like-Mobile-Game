<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.30 — 🗺️ Mission Atlas: one ⭐ pool, a tree for every mission, choose what to master

- **Unlock:** after Chapter 2 (`maUnlocked`: storyCleared ≥ 10).
- **Points (`maEarn`, saved in `Save.data.matlas`):** +1 per mission, +1 more for a bonus clear, ×2 in a Golden Wave. A side mission gives +1. A Double Clear gives +1.
- **Cap (`maCap`):** 15 at the start, +15 after Chapter 3, +2 every 5 Delve depths, 90 max. Filling every tree costs 138, so players must choose.
- **Tree (`MA_TREE`):** all 23 missions have 3 tiers; on each tier the player picks 1 of 2.
  - Tier 1 (1 ⭐): ⏳ +15% time or 💠 +1 currency.
  - Tier 2 (2 ⭐): 🔥 25% harder, rewards ×1.35; or 🎁 35% chance of a Gear box.
  - Tier 3 (3 ⭐): 🎰 12% chance of ×3 rewards; or 👑 40% harder, rewards ×1.6 and +1 Star Sugar.
  - Tiers unlock in order. Tapping a chosen node again removes it and every tier above it. Reset is free.
  - "Harder" raises the goal count. For small or timed goals it shortens the time instead.
- **Focus (`maToggleFocus`):** a starred mission has ×2 weight in the deck. Slots unlock at 20, 50 and 90 earned points.
- **Screen:** Recipe Book → Missions → **🗺️ Atlas** (NEW badge). It shows a list of 23 missions, 8 per page, each with its card face and tier icons. Tap a mission to open its tree. The header shows free / used / cap.
- Test: `tests/mission-atlas-8230.test.cjs`. Headless: the Atlas list, mission select and node picks work.

# Previous delivery: v8.2.29 — ⚖️ Pact Relics: the drawback goes to the stage, the reward gets better

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
