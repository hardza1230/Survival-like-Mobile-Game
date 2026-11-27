# Wardrobe animation sheets

The painted shop images are indexed by the manifests in `wardrobe_wings` and `wardrobe_accessories`. The accessory shop atlas has one item per cell. Use the separate WebP sheets listed in this folder's `MANIFEST.json` for animation.

Each sheet has 8 frames in a tight 4×2 grid, played left to right across each row, and transparent RGBA. Anchor coordinates are frame-local pixels. Divide by the frame width and height for a normalized origin.

| Item | Cell size | Anchor | Suggested rate | Playback |
|---|---:|---:|---:|---|
| Wings ×8 | 320×288 | 160, 172 | 8 fps | Loop |
| Pudding Fox ×1 | 144×144 | 72, 72 | 8 fps | Loop |
| Trail ×7 | 144×144 | 72, 72 | 14 fps | Once |
| Dash ×4 | 144×144 | 72, 72 | 20 fps | Once, source motion points right |
| Pop ×4 | 144×144 | 72, 72 | 18 fps | Once |

The sheets were rendered from the same painted art as the shop icons, using independent wing panels, floating motion for the fox, and timed movement and opacity for the effects. The existing pets already have HD animation sheets under `assets/art/cosmetics/`.

Manifest paths are repository-relative. QA verifies alpha, distinct frames and at least 6 px clear margin for every frame. Equipment and engine registration remain integration work.
