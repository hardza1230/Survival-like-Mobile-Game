# Chapter 1 Drain monster animations — v6.55.13

Generated using imagegen from the five existing monster references. Exact prompts are in PROMPTS.md. Technical packing uses one uniform scale per species, centers every pose and places its lowest visible pixel at source baseline 236 within each 256px cell. PACKING.json records bounds and scale. No whole-sheet regenerations or pose repairs were required.

| Species | Source PNG | Runtime WebP | Roles |
|---|---|---|---|
| Drain Slime | slime_sheet.png | assets/art/ch1_drain/slime_sheet.webp | basic |
| Backflow Fiend | dasher_sheet.png | assets/art/ch1_drain/dasher_sheet.webp | fast, dasher |
| Drain Caster | caster_sheet.png | assets/art/ch1_drain/caster_sheet.webp | shooter |
| Drain Bomber | bomber_sheet.png | assets/art/ch1_drain/bomber_sheet.webp | bomber |
| Drain Tank | tank_sheet.png | assets/art/ch1_drain/tank_sheet.webp | tank, siege, elite |

All sheets have transparent backgrounds and a 4×4 grid without visible lines/text. Source PNG: 1024×1024, cells 256px. Runtime lossless WebP: 512×512, cells 128px, preserving the original sprite coordinate system. Art faces right and uses normal blending. Frames 0–5 walk, 6–7 idle, 8–11 action, 12–13 hurt, 14–15 death. Dasher action is split into windup/dash; Caster into windup/release; Bomber pressure warning uses its action row once below 35% HP. Attack and explosion timing, stats and colliders are unchanged. Hurt cannot interrupt committed actions; freeze pauses animation and presentation duration. Death uses a separate tracked ghost while rewards and pooling remain immediate.

Stage loading includes all five sheets; missing animated textures fall back to the originals. Bestiary art stays unchanged. walk_preview.webp is a review animation and is not loaded by the game.

Validation: actual spawn/controller tests cover all seven ordinary roles and Elite, original stage-scaled HP/damage/speed/scales/colliders, freeze, dash priority, Bomber warning/reset and fallback. PNG/WebP dimensions and transparency are checked. Full npm run check and npm run build:www pass. On-device visual/performance review remains pending.

Remaining animation work: commits 4–10 in docs/MONSTER_ANIMATION_PLAN.md; next is Chapter 1 Fire monsters.
