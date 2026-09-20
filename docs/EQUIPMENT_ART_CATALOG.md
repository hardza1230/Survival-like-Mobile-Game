# Equipment Art Catalog

## Production status

All 44 equipment bases now have production vector art. The 22 weapon icons were already present; v4.2.4 adds the remaining 22 wearable icons.

| Slot | Production icons | Folder |
|---|---:|---|
| Weapon | 22 | `assets/gear/weapons/` |
| Gloves | 4 | `assets/gear/gloves/` |
| Armor | 4 | `assets/gear/armor/` |
| Boots | 5 | `assets/gear/boots/` |
| Amulet | 5 | `assets/gear/amulets/` |
| Ring | 4 | `assets/gear/rings/` |

Starter `None` entries intentionally keep their slot symbols and do not need item art.

## Wearable asset mapping

| Slot | Item IDs |
|---|---|
| Gloves | `gl_mitt`, `gl_silk`, `gl_iron`, `gl_dragon` |
| Armor | `ar_apron`, `ar_quilt`, `ar_plate`, `ar_royal` |
| Boots | `bo_soft`, `bo_magnet`, `bo_swift`, `bo_wind`, `lg_comet` |
| Amulet | `am_ribbon`, `am_clover`, `am_star`, `am_moon`, `lg_phoenix` |
| Ring | `ri_copper`, `ri_silver`, `ri_gold`, `ri_diamond` |

Every asset is registered as `gear_<item id>` in `ASSET_IMAGES`. Existing Equipment, Compare and Craft screens already request that texture key and fall back to emoji only when an asset is missing.

## Visual language

- 256×256 transparent SVG canvas.
- Thick dark-brown outline matching the weapon set.
- Soft upper-left lighting, restrained glow and readable silhouettes at mobile size.
- Common: simple materials and limited decoration.
- Rare: stronger construction, contrast and secondary material.
- Epic: ornate candy-fantasy motifs and brighter glow.
- Legendary: unique silhouette, multi-color energy and the strongest rim light.
- No text, frames, characters, hands, feet or mannequins inside the source art.

## Future expansion rule

When a new gear base is added, create its icon in the matching slot folder and register it as `gear_<item id>`. Chapter identity should change silhouette and material, not only hue.
