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
| Common | 1 | Spark Sugar imprints the first targeted line |
| Magic | 2 | Twist Cream replaces a selected line; Wish Candy fills an empty line |
| Rare | 4 | Wild Jam replaces a selected line; Wish Candy fills an empty line |

Crown Icing promotes a full two-line Magic item to Rare and unlocks four lines. Crystal Glaze rerolls only the selected value. Fading Gumdrop removes only the selected line. Plain Dough resets the whole item to Common.


## Currency identity and economy

| Color | Player-facing name | Internal key | Primary purpose | Sugar shop price |
|---|---|---|---|---:|
| Blue | Spark Sugar | `transmute` | Imprint the first chosen stat on Common gear | 40 |
| Green | Twist Cream | `alt` | Replace one selected Magic affix | 60 |
| Yellow | Crown Icing | `regal` | Promote full Magic gear to Rare | 120 |
| Orange | Wild Jam | `chaos` | Replace one selected Rare affix | 160 |
| Red | Wish Candy | `exalt` | Add a chosen stat to an empty line | 320 |
| White | Crystal Glaze | `divine` | Reroll the selected value without changing tier | 320 |
| Purple | Fading Gumdrop | `annul` | Remove one selected line | 90 |
| Black | Plain Dough | `scour` | Reset the item to Common with no affixes | 30 |

Internal keys stay unchanged so existing saves remain compatible. The price curve separates common experimentation from build-finishing resources: Spark Sugar, Twist Cream and Plain Dough should remain plentiful; Crown Icing and Wild Jam form the mid-game progression layer; Wish Candy and Crystal Glaze are aspirational Chapter 4–5 resources. Fading Gumdrop should be uncommon despite its lower shop price because targeted removal is strategically powerful.

## Item-specific pools

Normal affixes declare compatible equipment slots. The Craft screen lists only stats that can occur on the selected item and excludes duplicate stats already present on other lines. Item Level and base grade jointly determine the best reachable tier.

## Future base-exclusive mods

`SPECIAL_AFFIX_POOL` is an additive registry. A future special mod can declare:

- `baseIds` for exact bases;
- `baseTags` for a family of bases;
- `slots` and `minItemLevel`;
- its own tier bands, formatter and combat application;
- `exclusive: true` for distinct UI treatment.

Normal and exclusive pools merge through `craftAffixPoolForItem`. No special mods are active in v4.2.1, so adding one later does not require rebuilding the Craft screen or save schema.
