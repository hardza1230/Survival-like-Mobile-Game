# R1 — Biome floors and props

## Separate floors

| File / key | Size | Alpha |
|---|---|---|
| `biome_spicy_floor.png` / `biome_spicy_floor` | 1024 × 1024 | Fully opaque |
| `biome_frosty_floor.png` / `biome_frosty_floor` | 1024 × 1024 | Fully opaque |
| `biome_sweet_floor.png` / `biome_sweet_floor` | 1024 × 1024 | Fully opaque |
| `biome_sour_floor.png` / `biome_sour_floor` | 1024 × 1024 | Fully opaque |
| `biome_fermented_floor.png` / `biome_fermented_floor` | 1024 × 1024 | Fully opaque |

The same five floor files serve cavern gameplay and the corresponding Delve map bands. No `delve_bg_*` duplicates.

## `biome_props_sheet.png`

2048 × 1536, 4 columns × 3 rows, 512 × 512 cells, true transparent background.
Coordinates below are **1-based**, ordered left to right, then top to bottom. Index is **0-based**.

| Row | Column | Index | Key |
|---|---|---|---|
| 1 | 1 | 0 | `biome_spicy_vent` |
| 1 | 2 | 1 | `biome_spicy_ember` |
| 1 | 3 | 2 | `biome_frosty_pillar` |
| 1 | 4 | 3 | `biome_frosty_slick` |
| 2 | 1 | 4 | `biome_sweet_bomb` |
| 2 | 2 | 5 | `biome_sweet_trail` |
| 2 | 3 | 6 | `biome_sour_pool` |
| 2 | 4 | 7 | `biome_sour_drip` |
| 3 | 1 | 8 | `biome_fermented_pod` |
| 3 | 2 | 9 | `biome_fermented_patch` |
| 3 | 3 | 10 | Empty, fully transparent |
| 3 | 4 | 11 | Empty, fully transparent |

## Prompt set (English)

Shared floor prompt: "One opaque 1024x1024 seamless tileable ground texture, straight orthographic top-down, cute pastel confectionery fantasy mobile game, soft painted 2.5D candy materials, low contrast, evenly distributed small details, no focal points, all four edges tile, no large objects, characters, text, border, watermark, vignette or perspective."

1. Spicy: "Muted dark-red volcanic candy rock with sparse subtly glowing orange lava hairline cracks."
2. Frosty: "Muted pale-blue sugar ice, tiny embedded sugar-crystal flakes and subtle rounded icy stone texture."
3. Sweet: "Dusty pink cream cave rock, softly rounded flat stone patches with sparse tiny candy sprinkles embedded flush in the stone."
4. Sour: "Muted lemon-yellow and subdued olive/lime-green cave stone with tiny glossy fruit-juice droplets."
5. Fermented: "Muted purple and moss/teal-green soil, small granular texture, sparse tiny flat mushroom caps and faint soft spores."
7. Props: "One 2048x1536 transparent sheet, invisible 4x3 equal-cell grid. One top-down candy fantasy hazard centered per cell, generous margins, soft dark outline, glossy highlights, upper-left lighting, no ground shadows, labels or grid. Row 1: volcanic chili/cauldron lava vent; small ember/fire pile; pale-blue sugar-ice pillar; flat glossy ice slick. Row 2: pink candy bomb with curled lit fuse; irregular pink syrup trail; isolated yellow-chartreuse acid pool with bubbles; one small acid droplet. Row 3: plump purple spore pod with muted teal accents; flat purple mold patch; empty; empty. Avoid vivid green."

## QA

- All five floors checked as repeated 2x2 tiles in both directions; no obvious straight seams at mobile-scale preview.
- Props have 10 distinct populated cells; indices 10 and 11 are fully transparent.
- Transparent margins and object bounds checked against the 80% cell limit.
- Readability checked in reduced whole-sheet preview. Real-device review after code integration remains pending.

## Production notes

- R1 only, seven image generations total: five separate floors, one Delve sheet, one biome prop sheet. No replacement generations.
- Source: `docs/art_orders/00_STYLE_GUIDE.md` and `docs/art_orders/NEXT_BATCH_REQUEST.md` at source commit `36265b1`.
- Built-in image generation; no individual prop/node generation.
- Exported PNG RGBA at the exact requested sizes. Native generator dimensions differed; full canvases were normalized for delivery.
- Sheets remain whole, with no separately extracted cell files. A uniform 76% cell-space inset was applied during whole-canvas export to ensure padding below the 80% limit; genuine alpha retained with premultiplied resampling. Invisible alpha=1 encoding noise removed.
- Lighting from upper left; no text, grid lines, labels, or ground shadows.
- `_preview.png` is a reduced full-sheet preview on a dark backing for review only. Use the original transparent sheet for integration.
- Code integration, cutting and WEBP conversion are left to the code side. No files outside `assets/incoming/` are changed.

## questions:

- None blocking. The chili/cauldron vent is interpreted as a rounded volcanic stone bowl with a lava opening. The cleared mark is a gold flag on a small stamp base.
