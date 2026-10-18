# Boss attack VFX C1-C2 — art order 22

59 PNG32 source sheets / 278 frames, produced 18 October 2026 with built-in ImageGen. Stage kits: 40 files, 180 frames. Signatures: 19 files, 98 frames. All requested filenames and cell contracts are recorded in MANIFEST.json. PROMPTS.json contains the final prompt for every selected source.

## Source contract

Opaque RGBA on pure black, for later brightness-to-alpha conversion. Frames read left to right, then top to bottom, without gutters. Apply the order 20 conversion: alpha = min(255, int(max(R,G,B) * 1.35)); values below 8 become transparent; unpremultiply RGB and render with NORMAL blending. Do not load these opaque source sheets directly with NORMAL blending.

The four stage-kit keys use the requested stage palette, with no runtime tint assumed. Waves have open centers and a narrow damage perimeter. All 1x4 strips use left-center anchors; the giant crown slash also uses left-center. Center anchors apply to the other sources. Do not crop individual frames to their visible bounds.

Ice bars and honey wall have six frames: growth at 0-3, intact hold pose at index 4, release/breakup at 5. Hold frame 4 until the existing attack releases it. Crown Cage retains one broad opening on the right-front side across all four frames.

## Packaging and checks

Generated grids were resampled cell by cell to the exact requested dimensions. Near-black noise is canonicalized at RGB channel level 5 (7 for the Chronobloom wave). Horizontal strip boundaries use a 12-pixel smooth crossfade to shared edge samples. Actual PNG bytes were saved atomically and re-read, decoded completely, and checked for chunk CRC/zlib integrity, RGBA mode, opaque alpha, exact grids, SHA-256 and byte length.

QA_gallery_01-03.png show every source. QA_floor_b01-b10.png show all four warning frames over the actual corresponding production floor, using the same alpha conversion as order 20. QA_floor_gallery.png combines those ten tests. QA_lane_gallery.png and QA_lane_loops.gif show three adjacent copies of each of the twelve horizontal strips. These QA images and labels are review material, not game textures.

## Integration handoff

Incoming art only. Runtime registration, WebP packing, attack hooks, exact visual/damage footprint alignment, stretched-strip playback, loop timing, and phone FPS acceptance remain for integration. Read the implementation notes in docs/art_orders/22_BOSS_ATTACK_VFX_C1_C2.md. Keep the existing fallback effects, depth below characters, attack ranges/timing/damage, and proj_foe unchanged. This delivery does not change game.js, the game version, or deployed gameplay.

QA_REPORT.json records source checks and upload verification separately. Final remote byte/hash verification is performed against the published incoming files before delivery is declared complete.
