# Mobile Focused Crafting

## Player flow

1. Select a gear instance.
2. Tap one affix line, including an empty unlocked line.
3. Pick the exact desired stat from the compatible pool.
4. Review the best possible tier, best-tier value range, required currency and inventory count.
5. Craft once. The stat is guaranteed; tier and value roll within the item's allowed range.

## Rarity and line capacity

| Craft state | Lines | Progression |
|---|---:|---|
| Common | 1 | Magic Sugar opens the first targeted line |
| Magic | 2 | Shifting Cream replaces a selected line; Exalted Core fills an empty line |
| Rare | 4 | Chaos replaces one selected line; Exalted Core fills an empty line |

Royal Decree promotes a full two-line Magic item to Rare and unlocks four lines. Divine Blessing rerolls only the selected value. Annulment removes only the selected line. Scour resets the whole item to Common.

## Item-specific pools

Normal affixes declare compatible equipment slots. The Craft screen lists only stats that can occur on the selected item and excludes duplicate stats already present on other lines. Item Level and base grade jointly determine the best reachable tier.

## Future base-exclusive mods

`SPECIAL_AFFIX_POOL` is an additive registry. A future special mod can declare:

- `baseIds` for exact bases;
- `baseTags` for a family of bases;
- `slots` and `minItemLevel`;
- its own tier bands, formatter and combat application;
- `exclusive: true` for distinct UI treatment.

Normal and exclusive pools merge through `craftAffixPoolForItem`. No special mods are active in v4.2.0, so adding one later does not require rebuilding the Craft screen or save schema.
