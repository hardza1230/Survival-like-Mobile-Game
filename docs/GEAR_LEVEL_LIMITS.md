# Gear level limits

Early gear has fewer active Forge rows and a lower enhancement ceiling. Limits follow the item's own level, independently of rarity and account progress.

| Item level | Active Forge rows | Enhancement ceiling |
| --- | --- | --- |
| 1–11 | Power | +3 |
| 12–24 | Power, Sustain | +5 |
| 25–44 | Power, Sustain, Play | +7 |
| 45–100 | Power, Sustain, Play | +10 |

The existing random-drop row thresholds (12 and 25) now apply to crafting too. The enhancement steps preserve a reason to replace early gear throughout Story progression. Implicits retain their existing item-level gates.

## Existing items and pending rolls

Saved mods and enhancement levels are preserved. Rows above the item's limit are shown as inactive and do not contribute to equipment comparisons, preview stats, equipped stats, or weapon-local modifiers. Enhancement stats use the effective ceiling; the stored level remains intact. Replacing an active row retains other saved rows.

If an older save contains a paid choice on a now-locked row, its results remain visible. Keeping the current mod refunds one roll in the original currency (legacy aliases are converted). The pending choice is cleared in the same save, preventing duplicate refunds. A choice on an unlocked row can still be selected without another payment.

Forge Roll, Auto, Tier +1 and pending-choice selection enforce row eligibility before mutation or payment. Enhancement checks its ceiling in the save method; inventory callbacks recheck the current item before spending, including a stale or removed selection.

The first Forge tutorial still grants three Twist Cream once and opens Power. Returning with an unavailable row selected redirects the lesson to Power. A saved paid choice remains selectable or refundable through the tutorial.

## Verification

`tests/gear-level-limits.test.cjs` covers every boundary, all equipment slots, malformed/direct calls, legacy effective stats, preserved investments, pending-choice refunds, stale inventory callbacks and the first crafting lesson. Existing Forge and Equipment tests cover the locked rows and refund route across seven layout sizes using their existing UI doubles. Phone playtesting remains with the owner; no game window or screenshots were used.
