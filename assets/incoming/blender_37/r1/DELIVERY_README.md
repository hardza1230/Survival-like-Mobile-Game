# Art37 R1 — Sour Ant Nest

23 October 2026. Source art delivery only; runtime integration and owner acceptance pending.

Nine assets: floor_c11 (1024 RGB seamless PNG) and eight dec_c11 PNG32 sprites (256 RGBA).
Native Blender geometry and toon shaders, Standard color management, shared upper-left Sun at 60 degrees.
Decor camera is orthographic at 55 degrees, ortho scale 5.15; floor is orthographic at 90 degrees, scale 10.
Freestyle warm umber outlines are 3.25px at 256. Fine detail curves and transparent contact shadows are excluded from outline tracing.

## Review

- `_review_c11.png`: larger light/dark art gallery.
- `_alpha_edges_c11.png`: every sprite over both light and dark backgrounds.
- `_sheet_c11.png`: all eight sprites, each at a 60px canvas, on their own floor.
- `_preview_floor_c11_3x3.png`: nine floor tiles with no visible grid seams.
- `_preview_floor_c11_ingame.png`: offline 360x780 proof, floor at 0.8 and a bright 60px player proxy.

MANIFEST.json records each asset, camera, lighting, dimensions, source and hash.
QA_REPORT.json records measured PNG/alpha/margins/luma/edge checks and upload verification.
All source files are in src/; style_preset.blend establishes the shared R1 look for later rounds.
The floor uses native periodic geometry and 3x3 copies. A one-pixel averaged export guard makes opposite pixel-center samples exactly equal after downsampling.
Soft transparent contact shadows are rendered in Blender, with no background plane color baked into the sprites.
No external textures are used; pack_all was called on each source.

## Reproduce

Run Blender in background with `--python src/build_r1.py -- OUTPUT_DIR`, then run `python src/finish_r1.py OUTPUT_DIR` with Pillow and NumPy available.
Blender creates temporary supersampled renders in OUTPUT_DIR/raw. These are intermediates and are excluded from the GitHub delivery and archive.
Native build script uses a fixed random seed (3701). Source files have individual editable geometry, lighting and cameras.

## Acceptance gate

R1 is delivered for owner review. Do not start R2 before owner approval as required by art order37.
No game.js, production WebP, runtime asset registry or game version changes are included.
