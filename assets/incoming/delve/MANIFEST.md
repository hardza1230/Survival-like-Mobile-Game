# R1 — Delve map sheet

## `delve_sheet.png`

2048 × 1024, 4 columns × 2 rows, 512 × 512 cells, true transparent background.
Coordinates below are **1-based**. Index is **0-based**, reading left to right, top to bottom.

| Row | Column | Index | Key |
|---|---|---|---|
| 1 | 1 | 0 | `delve_node_normal` |
| 1 | 2 | 1 | `delve_node_vault` |
| 1 | 3 | 2 | `delve_node_shrine` |
| 1 | 4 | 3 | `delve_node_elite` |
| 2 | 1 | 4 | `delve_node_city` |
| 2 | 2 | 5 | `delve_node_boss` |
| 2 | 3 | 6 | `delve_home` |
| 2 | 4 | 7 | `delve_cleared_mark` |

## Prompt 6 (English)

"Single 2048x1024 transparent sprite sheet, invisible 4 columns x 2 rows, equal 512x512 cells, exactly eight separate centered objects with generous transparent padding. Cute pastel mochi candy world-map tokens, consistent 3/4 top-down view, soft dark outline, hand-painted glossy 2.5D highlights, upper-left light, no ground shadows, grid, labels, text or watermark. Row 1: round stone plate with thick rim and broad empty recessed center; gold treasure-chest-shaped plate with empty central surface; candy shrine plate with candy pillars around rim, soft halo and empty platform; dark plum plate with red rim spikes and empty central disc. Row 2: tiny festive mochi town on a plate; purple-gold crown and giant-maw plate with teeth around an empty middle; cozy Mochitopia village on a floating island; small gold stamp/flag token. Keep code-overlay node centers empty. Avoid vivid green. Output whole unsliced sheet."

## QA

- Eight distinct tokens, correct row/column order, genuine alpha.
- Empty surfaces provided for code overlays on normal, vault, shrine, elite and boss nodes; city and home are composed landmarks.
- Every cell's rendered bounds checked below 80% width and height.
- Reduced full-sheet preview inspected for coherent lighting, silhouette and cell separation. Real-device 40px node review after integration remains pending.

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
