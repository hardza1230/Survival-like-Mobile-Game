# C2-4 Four-Season Conservatory — art order19

22 PNG32 files,126 frames, delivered2026-10-16 Asia/Bangkok. Source: docs/art_orders/19_C24_FOUR_SEASON_ART.md, revisionf5e7cc0d66bb1253b169d7e71bf02fa861dc4744.

## Contents

- A1: four separate spring/summer/autumn/winter screen-edge transition sheets.
- A2–A11: spring heal, Bloom Sprout, summer burn/ignite, autumn warning/slash, winter patch/freeze, HUD season states and trial success.
- B1–B8: Vine Cleave warning/slash, Solar Bloom, frost/leaf projectiles, Time Break, quarter-ring season seal and metamorph.
- MANIFEST.json: exact cell sizes, grids, anchor intent, playback/state maps and SHA-256.
- PROMPTS.json: complete final built-in imagegen prompts and reference provenance.
- QA_REPORT.json: per-file technical checks and remaining game-side review.

Existing floor, decor, seven existing enemy types, Season Keeper and boss animation art were not regenerated or changed. Bloom Sprout uses the existing Budling's candy-plant materials as a style reference; the metamorph matches the existing Chronobloom orchid/glass/clockwork palette.

## Frame contract

Frames read left to right then top to bottom; no separators. All VFX are opaque black sources for later luminance-to-alpha conversion with NORMAL blending. Bloom Sprout, HUD icons and the two projectiles have actual alpha. No WebP packing or runtime registration is included.

Bloom Sprout: run frames0–5, hurt6, defeat7. Its main body uses a common scale and bottom-center groundline236/256 across all8frames; do not loop all8. HUD columns are spring/summer/autumn/winter; pending0–3, passed4–7. Passed states retain bright seasonal colors and gold outlines; their integrated visible brightness exceeds pending counterparts.

Autumn lane/slash: four frames stacked vertically,1024x96 and1024x128 respectively. Vines: B1 is a vertical stack, B2 a horizontal strip, both512x256 perframe with left-middle origin. B3 frames0–2 warn and3 flashes on impact. B7 contains one upper-right quarter of a white barrier; its circle pivot remains at the cell center so rotated copies can form three sealed quadrants. Do not crop/recenter its occupied arc.

## Verification

All22 files are8-bit RGBA PNG with exact requested dimensions, complete CRC-checked chunks/IEND, fully decoded zlib streams and expected scanline counts. Hashes match the manifest. Each alpha frame has a transparent background and opaque foreground. Every screen-edge frame leaves the central64percent of both axes exactly black; summer/winter were refined to keep motifs at the edge. Near-black background noise was canonicalized at7percent for screen-edge sheets and2percent for other VFX. Other VFX have black frame corners.

The22 source sheets and final representative gallery were visually reviewed. Technical normalization preserves common event-sheet scale, aligns the enemy body groundline, retains the seal pivot and normalizes fan/long-lane anchors.

Runtime conversion, exact warning-versus-hit geometry (especially the projected60-degree vine fan), stretched/tiled seam continuity, sprite timing,22px HUD readability, dark/light floor readability and mobile FPS still require game-side review. No runtime/build/combat testing is claimed for this incoming-only delivery.

## Owner instruction

Store these files in assets/incoming/c24_seasons_vfx/ only. Do not wire them into the game, change mechanics/version, replace current production art or regenerate build outputs under this task.
