# Chapter 2 boss outline effects — 8.1.14

Seven original ImageGen PNG32 atlases, each1536×1024 / six columns × four rows. Four clips per atlas, six authored drawings per clip:28clips /168frames. Style reference: C1 crown_source.png, used for ink/paint treatment only. Rootmother's Bud uses cream buds/sage leaves/chestnut roots; Mycelium uses teal/violet fungal shapes; Hornet uses amber honey; Chronobloom uses ivory/brass orchid hands; True Rootmother uses heavy burgundy thorn roots.

`PROMPTS.json` records actual generation prompts and input roles. `CLIPS.json` maps atlas rows to original and new runtime keys; `LEGACY.json` snapshots the original geometry/period. Reproduce with `C:/Python313/python.exe scripts/pack-boss-outline814.py`. The packer retains genuine alpha, crops each six-frame row with one shared transform and retargets it to the original projected visible rectangle. No procedural repainting or matte subtraction. Rectangular lanes/hands retain their legacy frame dimensions and left anchor.

`MANIFEST.json` records exact source/runtime lengths and SHA-256. `QA_REPORT.json` checks distinct visible frames, actual alpha and clear runtime borders. PNG/GIF previews are source-frame playback on #261e30, not gameplay. Phone readability/FPS remain pending.

Only C2 stage groups load these textures; the B06 pod shield is also available for B10's existing pod mechanic. Four C1 neutral body clips are reused by C2 without duplicate source files. Mycelium fog tile and air bubble, warning keys, damage, collision geometry, safe corridors and all attack/shelter timings remain unchanged. No boss body pose sheets or Chapter3 art are included.

Packed runtime:28lossless WebP sheets,6,206,150bytes total; aggregate decoded31,825,920bytes across the full C2 kit. Only stage subsets load. Sources/previews remain outside the runtime asset list.
