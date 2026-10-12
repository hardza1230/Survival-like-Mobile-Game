# Focused Affix Forge — v7.7.23

Owner approved the portrait concept and asked why Remove Affix / Reset Item are rarely useful.

## Assessment

Direct selected-line replacement already preserves the other lines. Target selection only configures an auto-roll stopping condition: it never guarantees the next stat. Single rolls use the weighted compatible pool; auto-roll spends currency each attempt and retains its Stop control.

Remove spends Fading Gumdrop to delete one chosen line. Reset spends Plain Dough, deletes all lines and downgrades to Common. Both are situational cleanup choices, not necessary preparation for a reroll. Adding a mandatory deletion step would create extra taps and cost without a useful choice. Preserve both operations and existing inventory balances; demote their controls into Advanced and explain their consequences. Keep second-tap confirmation and locked guards.

The legacy Upgrade Rarity control also promises extra slots even though common/magic/rare now all have the same three-mod cap. It is omitted from this focused UI; its old helper remains for compatibility. No new rarity-cap economy is introduced.

## Implementation

- Shared roster header, Nunito and painted pink/plum controls.
- Six slot selectors; item chooser shown only when more than one item is available. Selected item thumbnail, name and metadata grouped once.
- Fixed implicit separated from three selectable mod rows.
- Six compatible weighted result cards per page. “Track a target · rolls stay random” clarifies the actual behavior.
- Optional Odds & tiers reveals readable tier rows and existing target threshold selection.
- Actual currency art, wallet and per-use cost, including a saved tier-lock surcharge. Direct roll callback retained so gear tutorial can locate it.
- Reroll tier stays prominent; destructive controls are collapsed under Advanced.
- Scroll bounds refreshed after direct craft rebuilds, including expanded sections and animation results. Original save, roulette, auto-roll, currency costs and weighted chances remain.

## Validation

Actual menu-method tests cover 320/390/430/768/844 px widths, empty/full lines, item pages, locked guards, odds/advanced visibility, target tracking without spending, selected-line replacement preserving other lines, and two-tap removal confirmation. Full `npm run check` and `npm run build:www` required. No headless combat simulation; phone feel/visual review remains with owner.

## Follow-up

If real playtests continue to show no use for destructive crafting, a separate economy change can remove these currencies and migrate balances into useful resources. Do not silently delete existing holdings in a UI redesign. Assess whether any current base-stat scaling benefits from zero mods before proposing such a migration.
