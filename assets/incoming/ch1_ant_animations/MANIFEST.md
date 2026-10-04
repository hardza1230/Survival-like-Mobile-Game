# Chapter 1 ants — monster animation commit 2

Release v6.55.12. Six raster sprite sheets generated from the existing ant identities with built-in imagegen. Source PNGs: 1024×1024, 4×4 cells of 256px, true RGBA. Runtime lossless WebPs: assets/art/ch1_ants, 384×384 with 96px cells. Native frame size matches the original assets, preserving collision circles and base scales. Eight generation calls: six full sheets and two targeted action repairs. See PROMPTS.md and PACKING.json.

| Source | Runtime key | Authored facing | Walk rate |
|---|---|---|---|
| worker_sheet.png | e_ant_worker_animated | Left | 9fps |
| scout_sheet.png | e_ant_scout_animated | Left | 13fps |
| spitter_sheet.png | e_ant_spitter_animated | Left | 8fps |
| soldier_sheet.png | e_ant_soldier_animated | Right | 7fps |
| drone_sheet.png | e_ant_drone_animated | Left | 12fps |
| acid_sheet.png | e_acid_animated | Right | 9fps |

Frames 0–5: actual leg gait / wingbeat. Frames 6–7: idle. Frames 8–11: action. Frames 12–13: additional flinch/recovery poses. Frames 14–15: defeat. Feet anchored to source y=236. One uniform scale per species across every pose; no individual frame stretching. Spitter and Drone action rows were regenerated alone to match walk facing. Facing metadata handles left/right source orientations. Their right-facing defeat ghosts reverse the current sprite flip.

Runtime action mapping: Worker/Soldier bite 8–11 on contact. Scout windup 8–9, dash 10–11. Spitter/Acid windup 8–9 before the unchanged shot timer reaches zero, release/recover 10–11. Drone warning 8–11 once when a living bomber falls to 35% HP; explosion timing/damage remain unchanged. Worker/Scout/Spitter hurt use 8→13 and Drone hurt uses 8→6 to avoid authored turnaround frames; Soldier/Acid use 12→13. All use 14→15 for death on a tracked ghost, so rewards/pool reuse remain immediate.

Stage 1 and elite spawning select animated textures first, then existing readable/static fallbacks. Bomber uses Drone, Shooter uses Spitter; other role mappings and HP/damage/speed/collision values remain unchanged. Both stage-specific and deferred animation registration include the six sheets. Static bestiary portraits remain available.

walk_preview.webp is an animated contact sheet built from the exact six final walk frames, one row for Worker/Scout/Spitter and one for Soldier/Drone/Acid. It is a review artifact, not a runtime texture.

Validation: actual spawn/controller tests for all eight enemy roles; original HP/damage/scales/circles; warning timing/reuse; both authored facing directions; six PNG RGBA dimensions. Transparent bounds and aligned baseline checked during packing. Full npm run check and npm run build:www pass. Phone visual/performance review pending. Remaining monster batches: commits 3–10.
