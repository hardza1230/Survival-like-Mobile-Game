<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.31 — 🎨 Art and voice for Pact Relics, Mission Atlas and the new mission events (orders 88/89/90 + A18)

- **Packed:** `scripts/pack-orders88-90.py` → 20 WebP, 310 KB, 5.4 MiB decoded. `scripts/pack-audio-a18.py` → 8 Ruby lines (56k mono) + 10 SFX (96k). App size 185.9 MB.
- **88 Pact Relic icons:** `relic_<key>` in `assets/art/relics88/`, stage-lazy like relics81. Cards pick them up automatically; the emoji stays as fallback.
- **89 Mission Atlas (menu-lazy `atlas89`, loaded by `maArtLoad`):**
  - Node icons go on the tree and list rows.
  - The 3-state nine-slice node frames show only on WebGL.
  - The emblem sits in the header, and the Atlas button is drawn with art.
- **90 mission events (stage-lazy `ev90_`):**
  - Image arrows replace the gold/blue ➤ text (`arrowArt`, which follows the text's position and angle).
  - Gold shimmer follows golden monsters (`goldShimAdd` / `goldShimTick`: every other monster, 16 max, the monster stays visible).
  - Gold burst at the start of a golden wave. Double Clear burst.
  - Red boss-mission chip. Reroll icon (free / ad). Cursed Crown curse icon pops above the hero.
- **A18 audio:**
  - Ruby voice: golden, double, bossmission, newmission, reroll, curse and jackpot reacts, plus the Atlas tip on first open.
  - SFX: reroll, golden wave, double clear, boss mission, mission impact, curse, Atlas star / pick / remove, jackpot.
  - Missing files fall back to the old sounds.
- Test: `tests/orders88-90-a18.test.cjs`. Headless: Atlas renders with art (6 nine-slices), golden shimmer follows 2 of 4 gold monsters, both image arrows show, no errors.

# Previous delivery: v8.2.30 — 🗺️ Mission Atlas: one ⭐ pool, a tree for every mission, choose what to master

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
