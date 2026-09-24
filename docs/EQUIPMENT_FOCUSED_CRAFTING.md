# Mobile Affix Forge

## Player flow

1. Select a gear instance.
2. Tap one affix line, including an empty unlocked line.
3. Review the compatible random-roll pool, best possible tier and value range.
4. Spend the contextual currency to roll one compatible stat at random.
5. Read the before-and-after result strip. The rolled stat, tier and value are all shown immediately.

The player chooses the item and exact affix line, but not the resulting stat. This distinction is intentional: the screen is called **Affix Forge** rather than Focused Crafting so the UI does not imply a guaranteed chosen outcome.

## Rarity and line capacity

| Craft state | Lines | Progression |
|---|---:|---|
| Common | 1 | Spark Sugar rolls the first line |
| Magic | 2 | Spark Sugar fills an empty line; Twist Cream rerolls a selected line |
| Rare | 4 | Wish Candy fills an empty line; Wild Jam rerolls a selected line |

Crown Icing promotes a full two-line Magic item to Rare and unlocks four lines. Crystal Glaze rerolls only the selected value. Fading Gumdrop removes only the selected line. Plain Dough resets the whole item to Common.


## Currency identity and economy

| Color | Player-facing name | Internal key | Primary purpose | Sugar shop price |
|---|---|---|---|---:|
| Blue | Spark Sugar | `transmute` | Roll a new random stat on Common or Magic gear | 40 |
| Green | Twist Cream | `alt` | Replace one selected Magic affix | 60 |
| Yellow | Crown Icing | `regal` | Promote full Magic gear to Rare | 120 |
| Orange | Wild Jam | `chaos` | Replace one selected Rare affix | 160 |
| Red | Wish Candy | `exalt` | Roll a new random stat into an empty Rare line | 320 |
| White | Crystal Glaze | `divine` | Reroll the selected value without changing tier | 320 |
| Purple | Fading Gumdrop | `annul` | Remove one selected line | 90 |
| Black | Plain Dough | `scour` | Reset the item to Common with no affixes | 30 |

Internal keys stay unchanged so existing saves remain compatible. The price curve separates common experimentation from build-finishing resources: Spark Sugar, Twist Cream and Plain Dough should remain plentiful; Crown Icing and Wild Jam form the mid-game progression layer; Wish Candy and Crystal Glaze are aspirational Chapter 4–5 resources. Fading Gumdrop should be uncommon despite its lower shop price because targeted removal is strategically powerful.

### Successful-drop weights

The existing 72% chance for a currency drop remains unchanged. When a currency drop succeeds, its reward pool uses these weights:

| Reward tier | Currency weights |
|---|---|
| Common | Spark Sugar 45%, Plain Dough 30%, Twist Cream 25% |
| Rare | Twist Cream 35%, Spark Sugar 30%, Crown Icing 15%, Plain Dough 15%, Fading Gumdrop 5% |
| Epic | Twist Cream 25%, Crown Icing 25%, Wild Jam 25%, Fading Gumdrop 10%, Wish Candy 8%, Crystal Glaze 7% |
| Legendary | Wild Jam 25%, Wish Candy 25%, Crystal Glaze 25%, Crown Icing 15%, Fading Gumdrop 10% |

Fading Gumdrop no longer appears in Common rewards. Wish Candy and Crystal Glaze begin at Epic, while Legendary rewards focus on build-finishing resources.

### Icon assets

The production icon set is stored in `assets/ui/currency/` as eight transparent 512×512 PNG files. Each icon has a different silhouette in addition to its color so it remains identifiable when displayed at mobile UI size.

### Mobile Affix Forge layout

The screen uses a visible **Gear → Affix → Roll** rail, production equipment art in the slot tabs, a compact random-result pool, contextual currency art and a dedicated confectionery workshop background. Base quality is shown separately from affix capacity (`2/4 affixes`) so the two rarity systems are not visually conflated.

The successful result appears in a before-and-after strip. Utility actions remain in a 2×2 grid and explain their effect in plain language. Removing one line or resetting the whole item requires a second tap within three seconds. The full Currency Pouch was removed from this screen because it duplicated information and pushed the primary action below the mobile fold.

The main menu uses taller cards, fixed icon geometry and short subtitles so labels remain inside each button at portrait width.


## Item-specific pools

Normal affixes declare compatible equipment slots. The Craft screen lists only stats that can occur on the selected item and excludes duplicate stats already present on other lines. Item Level and base grade jointly determine the best reachable tier.

## Future base-exclusive mods

`SPECIAL_AFFIX_POOL` is an additive registry. A future special mod can declare:

- `baseIds` for exact bases;
- `baseTags` for a family of bases;
- `slots` and `minItemLevel`;
- its own tier bands, formatter and combat application;
- `exclusive: true` for distinct UI treatment.

Normal and exclusive pools merge through `craftAffixPoolForItem`. No special mods are active in v4.2.3, so adding one later does not require rebuilding the Craft screen or save schema.
