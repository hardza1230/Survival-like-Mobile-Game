# Field Item Art Catalog

## Production status

Version 4.47.0 replaces the remaining runtime vector pickups with production raster art generated specifically for mobile readability.

| Texture key | Player-facing item | Asset | Gameplay role |
|---|---|---|---|
| `heal` | Heal Mochi | `assets/items/heal_mochi_heart.png` | Restores HP |
| `gift` | Gear Gift | `assets/items/gear_gift.png` | Drops equipment |
| `item_scent_crystal` | Scent Crystal | `assets/items/gimmick_scent_crystal.png` | Vacuums nearby EXP |
| `item_clean_bubble` | Clean Bubble | `assets/items/gimmick_clean_bubble.png` | Clears slow, heals and guards |
| `item_chili_overcore` | Chili Overcore | `assets/items/gimmick_chili_overcore.png` | Resets cooldowns and boosts speed |
| `item_frost_bell` | Frost Bell | `assets/items/gimmick_frost_bell.png` | Freezes enemies |
| `item_memory_seed` | Memory Seed | `assets/items/gimmick_memory_seed.png` | Heals and converts memories to Sugar |
| `item_ferment_drop` | Pure Ferment Drop | `assets/items/gimmick_ferment_drop.png` | Heals, cleanses and speeds cooldowns |

The existing EXP Candy, Crate, Chest and Vacuum pickups already use production raster art and remain unchanged.

## Runtime integration

- All eight transparent PNGs are registered in `ASSET_IMAGES`.
- `heal` and `gift` directly replace their Boot-generated fallback textures.
- Every `STAGE_GIMMICKS` entry points to its own item texture rather than a skill/passive icon.
- The generated fallbacks remain as a safe loading fallback if an asset is unavailable.

## Visual language

- 256×256 transparent PNG canvas with validated alpha and image stream.
- Thick dark outline and upper-left highlight consistent with the equipment set.
- One dominant silhouette and one identifying symbol per pickup for legibility on mobile.
- Color families follow gameplay meaning: pink for healing, cyan for cleansing, red for haste, blue for freeze, violet for memory and green for fermentation.
- No text or frame is baked into the source art.

## Expansion rule

New chapter gimmicks should receive a unique `item_<id>` texture. Do not reuse combat-skill icons for interactable field pickups; the field silhouette must communicate the pickup before the player reads its label.
