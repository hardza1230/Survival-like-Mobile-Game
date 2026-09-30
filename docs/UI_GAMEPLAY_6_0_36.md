# v6.0.36 — readable progression, shop and equipment

- Loading: 7px mint/cream meter, subdued translucent panel, no moving shine or neon glow.
- Replay HUD: the approved progress artwork is now a runtime asset. Empty and fill frames are sliced by Phaser and the fill is cropped by kill progress. The old thin rectangle is hidden for replays; the art is hidden for story objectives and boss fights.
- Story entry: replaces Challenge Ticket with the existing difficulty levels. Old challenge requests are cleared before starting, including saved UI choices; Endgame's separate curse checkpoints remain available.
- Bazaar: illustrated product grids grouped into equipment and crafting supplies, with Boxes, Orders and Sell tabs. Gear boxes use the existing gacha rarity pool (68% Common / 29% Rare / 3% Epic), not Legendary purchases. Sell lists paginate to fit the screen.
- Heroes: character roster, Talents and Stats share one tab bar. Gear & Power no longer duplicates Talents and Stats. Stats preview includes character talents and item-level bonuses.
- Gear: deterministic inherent ATK ranges for weapons/gloves/rings and Armor ratings for armor/boots/amulets, scaling with base identity, quality, item level and enhancement. Attack rolls add to hits; Armor uses `100 / (100 + armor)` as its damage multiplier. The inventory and comparison show these actual values; no gear instances are deleted or replaced.
- Craft: small integer stats use only distinct value tiers. Vampiric uses three bands (0.1–0.9, 1.0–1.9, 2.0–3.0 HP). Larger-range stats retain the existing geometric tier distribution. All rolling, chance displays and tier locks respect the individual mod's tier count. Existing affix values are preserved while labels are migrated.
- Reroll/Banish: clarify remaining uses and effects, reserve space below cards, remove old button nodes when toggling Banish.

## Suggestions only — not implemented

Weave Thread already comes from Bazaar's Thread Hunt order (12 base threads per regular-stage clear). Suggested next sources: a guaranteed small regular-stage-clear reward (3 / 5 / 8 across Normal / Hard / Hell), an optional daily clear reward of 10, or targeted Endgame farming. Avoid adding more random per-monster drops that clutter combat.

Keep Reroll as the quick route to another build choice and Banish as the way to prune unwanted choices for the current run. Monitor usage after clearer controls before removing either or changing perk investments.

## Validation

`npm run check` and `npm run build:www` pass. New tests cover variable tier distributions and locks, affix-value migration, inherent stats, curse-free story entry, store/entry hit areas at three screen sizes, Heroes routing and replay art hookup. Physical-device visual and combat playtesting have not been performed.
