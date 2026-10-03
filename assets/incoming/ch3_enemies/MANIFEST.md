# R2 — Chapter 3 walk animation sheet

## Delivery
- File: `c3_walk_sheet.png`; PNG RGBA, 1024 × 1280.
- Grid: 4 columns × 5 rows; 256 × 256 cells; no gutters.
- All five original identities referenced from `assets/art/ch3_enemies/c3_e_*.png`.
- Right-facing, 3/4 top-down; no ground shadows; true transparent background.
- Read left to right, then top to bottom. Coordinates below are 1-based; indices are 0-based.

| Row | Key | Cell indices | Actions |
|---|---|---|---|
| 1 | `c3_e_basic` | 0–3 | Four-frame mochi waddle |
| 2 | `c3_e_fast` | 4–7 | Four-frame seed run |
| 3 | `c3_e_shooter` | 8–11 | Walk; column 3 (index 10) includes firing pose |
| 4 | `c3_e_bomber` | 12–15 | Four-frame pod waddle |
| 5 | `c3_e_tank` | 16–19 | Four-frame armored acorn stomp |

## Technical export and QA
- One built-in image generation, using the five existing stills as identity references.
- Native generated size 1122 × 1402. Artwork was packed into exact equal cells for delivery using ImageMagick; source row spacing was not perfectly uniform.
- One fixed export scale per enemy row, preserving scale across its four poses. Transparent padding added; no separately cut sprites delivered.
- Every rendered silhouette fits below 80% of cell width/height. Feet baseline is approximately y=234 (alpha > 8), within one pixel across frames in each row.
- `_preview.png` is a reduced sheet on a dark backing for review, not an integration asset.
- Full PNG decoding, dimensions, alpha, populated cells, bounds and baseline verified; reduced-sheet appearance reviewed.
- In-game animation timing, hitboxes and device readability are for the integrating AI to review. Four frames are short loops, not a high-frame-count run cycle.

## Integration handoff
- Cut rows into four-frame strips or register the atlas with the exact 256px cell size.
- Keys and frame ordering match the source art order.
- If downsampling to 128px frames for existing animation registration, apply the same ratio to all four frames of each enemy.
- Keep game-drawn shadows; do not bake new shadows into these sprites.
- No gameplay files changed.

## English production prompt
> Use case: stylized-concept. Production game animation asset for Mochi Mayhem. Create ONE complete transparent sprite sheet, exact 1024x1280 portrait aspect 4:5, invisible equal 4 columns x 5 rows, each cell 256x256. Exactly 20 sprites. The FIVE reference images are identity references in row order, not edit targets: 1 ash mochi sprout basic; 2 swift sunflower seed; 3 hollow apple seed-gun shooter; 4 cracked swollen seed pod bomber; 5 armored acorn knight tank. Match each reference's anatomy, colors, materials, golden roots and purple glowing eyes closely. Every sprite faces RIGHT, 3/4 top-down with face visible. Four columns depict coherent 4-frame looping walk animation: right foot forward, passing, left foot forward, passing. Alternate natural limbs, subtle body bounce, constant body size per row; shooter column 3 has small muzzle opening/recoil as firing pose while keeping gun. Basic waddles, fast leans running, bomber gently waddles, tank stomps. Keep all sprites centered on identical per-cell x coordinate and consistent feet baseline at 86% cell height; all artwork entirely within central 78% cell width and height. Basic body approx60%, fast50%, shooter60%, bomber60%, tank78%. Cute confectionery fantasy hand-painted glossy 2.5D soft brown/plum outlines, muted ash browns purple gold, upper-left lighting, clear silhouettes, match refs. GENUINE alpha transparency, NO ground shadows, no floor, no drop shadow, no grid, no dividers, no labels, no text or watermark. Return one whole unsliced sheet.

