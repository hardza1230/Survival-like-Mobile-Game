# Batch 7A — Fermented Canopy (v6.55.92)

Validation: full `npm run check` and `npm run build:www` pass. The built output includes all six new runtime sheets. Packed action/idle/death contact images were visually inspected; actual mobile visual/FPS acceptance remains pending.

Six original C2-1 species now have generated painted raster animation. Built-in image generation was used with `assets/ch2_enemy_atlas.png` as the identity reference. Exact prompts are in PROMPTS.md. Unmodified generated sheets stay in raw/. Packed sources are 1024×1024 RGBA PNGs, 4×4 cells of 256px; runtime lossless RGBA WebPs are in assets/art/ch2_canopy. No text, grid or baked ground shadows.

| Stem | Original atlas cell | Role | Facing |
|---|---|---|---|
| c21_sprout | 0 | Ferment Sprout / basic | right |
| c21_vine_hunter | 1 | Vine Hunter / fast and dasher | right |
| c21_spore_lantern | 2 | Spore Lantern / shooter | right |
| c21_fruit_pod | 3 | Rotten Fruit Pod / bomber | right |
| c21_root_beetle | 4 | Root-Back Beetle / tank | right |
| c21_thorn_oracle | 5 | Thorn Oracle / siege | right |

Packed poses in row-major order: 0–5 movement, 6–7 idle, 8–11 preparation/release/recovery, 12–13 hurt/recovery, 14–15 defeat. Vine Hunter splits 8–9 windup and 10–11 dash. Spore Lantern splits 8–9 charge and 10–11 release. The lantern raw source placed charge in slot 7 and firing in slot 9; packing reorders existing authored poses to [0,1,2,3,4,5,6,11,8,7,9,10,12,13,14,15]. Other source sheets keep their row-major order. PACKING.json records source dimensions, pose order, atlas bounds, one uniform scale per species and centered fixed baseline (236px). Shapes are never independently stretched to fit a frame.

Runtime selects animated keys when available and retains the original species atlas frame as fallback. Existing stage lazy loading and the central presentation controller own idle/walk/actions/freeze/pool reuse/death. Spore Lantern uses the last 180ms of its original shot cooldown for visual preparation; Rotten Fruit Pod has a once-per-life low-HP pressure warning. Hit reaction cannot interrupt attack preparation. An authored death is one tracked non-physics ghost; loot and original entity recycling are unchanged.

**Elite audit:** the older art order incorrectly labels Root-Back Beetle as the stage Elite. Actual `spawnElite` uses atlas cell 6, a distinct Crown Sapling. This six-creature batch preserves Crown Sapling cell 6, role, scale, collision circle and combat values. Its separate animation remains in batch 10. Boss/miniboss art is outside 7A.

Packing: `python scripts/pack-canopy-animations.py source-map.json` with a map of the six stems to local generated PNG paths (Pillow/NumPy). Whole alpha components are assigned to each pose before normalization, so leaves/legs/staff crossing a nominal raw grid edge are retained. Detached details follow their nearest body; isolated specks smaller than four pixels and alpha at or below 16 are removed. All source poses have clear canvas margins. Review animation: canopy_preview.webp. Test: `node tests/canopy-animation.test.cjs`. On-device visual/FPS review belongs to the owner and remains pending. Next batch: 7B, seven Mycelium Marsh creatures including Sporeling.
