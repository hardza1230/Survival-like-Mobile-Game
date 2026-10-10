# System consolidation plan (owner approved 10 Oct 2026)

Goal: fewer overlapping power systems, easier balance, lighter `damage()`.
Rule: anything stored in a save is refunded (points, Sugar, parts) — never lost.
Status: ⬜ todo · 🟨 in progress · ✅ done

## A. In-run cards (resets every stage, no save migration)
- ✅ A1 Cut Tag Sets bonuses (2/4/6 tiers, tag labels on cards, pause tag grid, HUD tag counts). Trade-off/Unique ignite/chill flags stay.
- ✅ A1 Cut Dual Infusion offer (second element at Lv22).
- ✅ A2 Merge Modifier cards into the Relic pool (offered via offerRelic, share RELIC_CAP).
- ✅ A3 Merge Trade-off cards into the Relic pool as "trade" relics.
- ✅ A4 Merge conditional endless cards (c_low, c_dash, c_still, c_full, c_boss, c_streak, c_close) into the Relic pool.
- ✅ A5 Fusion → Evolution bonus when the matching relic is held (no separate card).
- ✅ A6 Card rarity: no change needed — fixed to common since v6.55.30, frame code inert.

## B. In-stage
- ✅ B1 Sugar Courier / Supply Cache become Bonus Challenge variants.
- ✅ B2 Miniboss chest: already prize wheel + Mimic only (no change).

## C. Meta (save migration + refunds)
- ✅ C1 Overcap folded into Weave core levels.
- ✅ C2 Special Cores + Ancient Perks folded into Rank Perks tree.
- ✅ C3 Bestiary gives Sugar/collection only (no stats).
- ✅ C4 Kitchen gated behind Chapter 2 clear (owner chose gate; recipes kept, inactive while locked).
- ✅ C5 Idle miners shown inside Depths only; Sugar Orders removed (refund).

## D. Gear
- ✅ D1 Set deposit collection removed (worn sets only; refund deposits as shards).
- ✅ D2 One shop: Gacha + Trade-in + Bazaar in one screen.
- ✅ D3 Currency 8 → 4–5 kinds (convert old stock).

## E. Endgame
- ⬜ E1 Delve boss needs one goal (Hunger or Mission, not both).
- ⬜ E2 Remove Zone Modifiers and Endless/Ascension entry points.
- ⬜ E3 Atlas passives + Pact milestones → one depth-reward track.

## F. Dead code removal (no player-visible change)
- ⬜ F1 Endgame Build, Recipe draft/Sugar Rush, Rift, Cookbook, slot level-up, openUpgradePanel, legacy PASSIVES/SKILLDEFS paths, castDiamondDust.
