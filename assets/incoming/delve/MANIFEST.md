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

---

# R3 — Fog and boss-floor cards

## `delve_fog.png`
- Key: `delve_fog`.
- PNG RGBA, 512 × 512; translucent dark plum clouds; no objects or text.
- One built-in image generation, native 1254 × 1254.
- Resized to exact dimensions; periodic tile-aware smoothing applied in ImageMagick to color and alpha, so the wrap boundary has no abrupt step.
- Delivered alpha range: 163–250. Transparency is intentionally subtle because this covers unexplored areas; the integrating AI can tune overlay opacity.
- Mean opposite-edge differences per RGBA channel, on 0–255 scale: horizontal 0.389 / 0.305 / 0.328 / 0.432; vertical 0.594 / 0.516 / 0.627 / 0.504.
- Full decoding, size, real alpha and wrapped-edge continuity checked.

## `delve_bossfloor_sheet.png`
- PNG RGBA, 1536 × 1296, fully opaque.
- Grid: 2 columns × 3 rows; each cell 768 × 432.
- Black inset 8px inside each cell. Adjacent insets form exact 16px black gutters while retaining the requested total canvas and cell dimensions.
- Five cave entrances; sixth cell solid black and empty. No text or characters.
- Cut cell coordinates below are 0-based top-left. Coordinates row/column are 1-based.
- If the consumer wants border-free card content, crop the 752 × 416 inner region at (cell_x + 8, cell_y + 8).

| Row | Column | Index | Key | Cell top-left |
|---|---|---|---|---|
| 1 | 1 | 0 | `delve_bossfloor_spicy` | (0, 0) |
| 1 | 2 | 1 | `delve_bossfloor_frosty` | (768, 0) |
| 2 | 1 | 2 | `delve_bossfloor_sweet` | (0, 432) |
| 2 | 2 | 3 | `delve_bossfloor_sour` | (768, 432) |
| 3 | 1 | 4 | `delve_bossfloor_fermented` | (0, 864) |
| 3 | 2 | 5 | Empty, solid black | (768, 864) |

- One built-in image generation, native 1366 × 1151; five scene interiors repacked into exact cells with exact black gutters using ImageMagick.
- `_preview_r3.png` is a reduced boss-floor sheet for review.
- PNG decoding, dimensions, full opacity, gutters, and empty last cell verified; appearance reviewed.

## Handoff and scope
- R3 has two image generations; R2 has two. Together these complete generations 8–11 in `NEXT_BATCH_REQUEST.md`.
- Whole sheets remain in incoming. Cutting, WEBP conversion, asset registration and mobile testing belong to the integrating AI.
- Do not generate cancelled `delve_bg_*` or `delve_path` assets.
- Existing R1 sheet and its mapping above are retained.
- No files outside `assets/incoming/` changed by the delivery.

## English production prompts
### Fog
> Use case: stylized-concept. ONE square 512x512 seamless tileable TRANSPARENT dark fog overlay texture for Mochi Delve unexplored map areas in cute confectionery fantasy mobile game. Entire tile softly distributed smoke/cloud vapor, muted deep plum-charcoal #201526 #302037 with soft low-opacity lavender variation; diffuse airbrushed mist, broad organic cloud patches and wispy translucent gaps, low contrast. GENUINE varied alpha transparency across the image so cave-map background remains subtly visible through it. Edge-to-edge repeating texture, ALL FOUR edges match seamlessly both color and alpha; no central isolated cloud, no vignette, no hard perimeter, no focal point, no corner fade, no directional light hotspot. Flat top-down 2D texture, even spread of clouds reaching boundaries; no objects, characters, sparkles, stars, text, frames or watermark. This is a continuous looping game fog overlay, not a smoke object cutout. Soft dark clouds, translucent gaps.

### Boss-floor cards
> Use case: stylized-concept. ONE opaque production environment card sheet for Mochi Mayhem Delve boss-floor selection. EXACT 1536x1296 canvas, invisible 2 columns x3 rows of equal768x432 cells. FIVE landscape 16:9 scenes in row-major order, SIXTH cell pure black empty. Each scene depicts a grand inviting yet ominous BOSS CAVE ENTRANCE in a cute mochi candy world, no boss visible. Consistent 2.5D hand-painted pastel confectionery fantasy, rounded rock forms, soft dark outlines glossy candy highlights, calm readable composition. Same camera frontal 3/4 elevated view into cave entrance, dark centrally located cavern doorway, lower foreground pathway and environmental detail framing sides, no UI text. Central cave has room to overlay interface. Keep light upper-left and environment highlights restrained. Row1 col1 SPICY: dark chili-red volcanic candy rocks forming huge cavern mouth, sparse orange lava cracks ember glow, warm magma path. Row1 col2 FROSTY: pale blue sugar-ice cave arch, icy crystalline stalactites and frost-sugar ground, deep cool blue cave opening. Row2 col1 SWEET: dusty pink frosting and cream cavern arch with embedded sprinkles and rounded candy formations, dark magenta mouth, soft warm cream path. Row2 col2 SOUR: muted lemon-yellow/lime-olive citrus rock cavern arch, glossy juice drips, bubbling acid pool along path sides, deep green cave opening. Row3 col1 FERMENTED: muted plum purple moss-teal cavern arch with small mushrooms and soft faint spores, mysterious violet cave opening. Row3 col2 completely pure black #000000 blank, no scene. IMPORTANT production layout: EXACT six equal cells, no collage varying sizes. Every scene cell has an8px black inset frame INSIDE its768x432 cell, creating16px continuous black gutters between neighboring scenes without changing total canvas1536x1296. No other frames or borders, no grid marks, labels, typography, characters, numbers, logo or watermark. Entire background fully opaque.
