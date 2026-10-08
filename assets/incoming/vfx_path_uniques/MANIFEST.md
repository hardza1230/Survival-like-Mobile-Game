# Build path VFX — v6.55.98

Generated with the built-in imagegen tool. Exact generation and packing-repair prompts are saved alongside both original images. `generated-original.png` is the repaired source; `generated-first-pass.png` is its input.

The source has eight columns and five rows. `packing.json` records the actual source rectangles, alpha bounds and common scale per animation. The final runtime strips have equal frame sizes, preserve relative frame growth, and retain true RGBA alpha. Pixels with alpha at most 16 are removed as generation noise. WebP decoding has exact RGBA parity with packed PNGs.

| Row | Runtime key | Frames | Frame size | Direction / anchor |
|---|---|---|---|---|
| 0 | vfx_berry_blast | 8 | 384×256 | Right / left middle |
| 1 | vfx_shotgun_muzzle | 8 | 192×128 | Right / left middle |
| 2 | vfx_glacier_bloom | 8 | 384×384 | Top-down / center |
| 3 | vfx_glacier_shatter | 8 | 192×192 | Radial / center |
| 4, column 0 | vfx_frost_lance_trail | 1 | 512×96 | Horizontal / left middle |

Row 4 columns 1–7 are unused. No left-facing variant: directional art rotates with the existing attack angle. Runtime files are in `assets/vfx`. Use NORMAL blend. `preview.png` shows every frame; `preview.gif` plays all five effects together.

Runtime integration preserves combat geometry/timing and missing-art fallback. All new effects are tracked for transition cleanup; the trail uses its original three-second lifetime and 0.4-second damage interval. Owner phone visual/FPS review remains pending.
