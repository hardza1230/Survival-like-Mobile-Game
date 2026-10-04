# VFX art batch 3 — Void, jam and boss transformation

Created and integrated 4 Oct 2026, runtime v6.55.8.

| Source PNG | Dimensions | Runtime file | Usage |
|---|---|---|---|
| void_pull.png | 512×512 | assets/vfx/void_pull.webp | Purple inward vortex, follows player and rotates during Void Pull |
| relic_jam_blob.png | 512×512 | assets/vfx/relic_jam_blob.webp | Three illustrated jam deposits along the dash, then existing explosion |
| hunger_metamorph_sheet.png | 1280×640 | assets/vfx/hunger_metamorph_sheet.webp | Great Hunger phase transformation; 4×2 cells, 320×320, 8 frames at 8fps |

Built-in imagegen prompts: (1) purple/indigo inward energy spiral with dark central depth, no brown chocolate; (2) compact glossy ruby jam with attached splashes and a seed; (3) eight chronological stages of a dark-violet eclipse/crown seal fracturing, expanding and fading into violet/gold fragments. Actual alpha, no characters, labels or grid. Source images packed/resized with transparent margins; runtime WebP copies use NORMAL blend.

Inspected existing assets/vfx/vfx_ult_cocoavortex.png. Its brown chocolate theme contradicts the purple-only requirement already documented in castVoidPull, so it is retained but not reused here.

Integration preserves original combat values and boss phase logic. Run-scoped timer cancellation and epoch guards protect against callbacks affecting the next run. Timers, images and tweens clean up on transitions/shutdown.

Validation: image decoding/alpha/dimensions, nonempty sheet frames and safe gutters; interruption/natural-completion fixtures; full npm check and web build. Phone visual/performance review pending.

Remaining: Recipe effects (batch 4) and meteor/orbit/helper (batch 5).
