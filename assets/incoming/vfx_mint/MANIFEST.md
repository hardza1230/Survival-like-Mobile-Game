# VFX art batch 1 — Mint

Created 4 Oct 2026 for runtime v6.55.6. Integrated in runtime v6.55.7: optimized WebP copies in assets/vfx; pool-safe projectile overlay and NORMAL-blended shatter/Gale animations.

| File | Dimensions | Layout | Intended use |
|---|---|---|---|
| proj_mint_ice_shard.png | 384×256 | Single image, facing right | Replace blue-tinted `proj_sprinkle` in `frostShatterBurst` |
| fx_mint_lance_shatter_sheet.png | 1280×640 | 4×2, eight 320×320 cells | Crystal burst at the lance impact / maximum range |
| fx_mint_gale_sheet.png | 1280×640 | 4×2, eight 320×320 cells | Gale activation gust in `castWindRush`; existing small trail can remain |

All PNGs are RGBA with real transparency. Sheets run left-to-right, top-to-bottom, frames 0–7. Transparent 24px gutters keep adjacent frames separate. Production packing uses a uniform scale across all frames to retain the growth/fade sequence; no backgrounds were painted into the source images.

Suggested integration: use NORMAL blend so the white highlights do not wash out bright floors. Start with 20fps, one-shot playback. Sheets are activation/burst sequences, not seamless idle loops. Match the existing combat radius and timing; do not change collision sizes to match the full VFX image. The projectile's trail is decorative: use a small collider at its solid head, or preserve the current bullet collider with a separate image.

Generation: built-in imagegen. Prompts: (1) a pointed faceted mint/cyan ice-candy projectile facing right with a short frosty trail; (2) eight stages of a compact crystal flash expanding into an ice-shard burst and fading; (3) eight stages of an airy mint wind ring unfurling, expanding and fading. All use the game's glossy 2.5D confectionery style, no characters, labels or grids.

Validation: PNG decoding, alpha extrema, exact dimensions, eight nonempty cells and transparent edge gutters checked. Generated art visually inspected; runtime/mobile motion review remains pending.
