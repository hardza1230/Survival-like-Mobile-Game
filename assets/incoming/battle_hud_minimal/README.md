# Minimal battle HUD - built-in ImageGen source kit

Four original transparent ImageGen assets replace the compact stat island, mission strip, boss strip and round button material. Soft dark plum glass, thin cream edges, tiny sugar glints, mint active state and a rose boss accent. No text is baked in. The compact v8.0.12 layout and hit targets remain the same.

Original donors live in originals/. Exact prompts are in PROMPTS.json; original generation paths are in PROVENANCE.json. MANIFEST.json records source dimensions, frames, source/runtime SHA256 and sizes, and source-pixel nineSlice margins. QA_REPORT.json records RGBA, alpha and frame bounds. contact_sheet.png is a mechanical neutral-gray source review.

Run scripts/pack-minimal-battle-hud.py from the repo to crop, resize and pack the originals; all PNG/WebP writes are atomic and decoded again. Three button frames share one scale so mint glow does not shrink the active disc. Runtime sibling files: assets/art/hud_minimal/ (four WebPs, 24,016 bytes total). Original art47 sources/runtime files are retained.

Existing HUD keys stay stage-lazy, with code fallback if art is unavailable. Dynamic text, fills and button hit areas remain in code. No phone touch/FPS or new live-screenshot claim for this release; owner reviews the game on phone.
