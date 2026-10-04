# Chapter 1 Fire monster animations — v6.55.14

Generated with built-in imagegen from the five existing Fire monster references. PROMPTS.md preserves exact prompts. Five initial sheets plus three targeted repair calls: an initial Chili dash attempt was superseded by a two-pose dash/recovery repair, and Pressure Pot received a six-pose walk repair after its original walking row overlapped. No whole-sheet rerender. Final repairs are preserved as chili_action_repair.png (frames 10–11) and bomber_walk_repair.png (frames 0–5). The extra Pressure Pot recovery poses from the original generation are omitted.

| Species | Source PNG | Runtime WebP | Gameplay roles | Native facing |
|---|---|---|---|---|
| Boiling Mochi Ember | ember_sheet.png | assets/art/ch1_fire/ember_sheet.webp | basic | right |
| Dashing Chili | chili_sheet.png | assets/art/ch1_fire/chili_sheet.webp | fast, dasher | left |
| Air-Gun Chili Grinder | grinder_sheet.png | assets/art/ch1_fire/grinder_sheet.webp | shooter | right |
| Chili Pressure Pot | bomber_sheet.png | assets/art/ch1_fire/bomber_sheet.webp | bomber | left |
| Charcoal Furnace Golem | golem_sheet.png | assets/art/ch1_fire/golem_sheet.webp | tank, siege, elite | right |

Each transparent RGBA source is 1024×1024, a 4×4 sheet of 256px cells. Runtime lossless WebP is 512×512 with native 128px frames, keeping existing sprite coordinates. No grid lines/text or baked ground shadows. Frames 0–5 are movement, 6–7 idle, 8–11 action, 12–13 hurt, 14–15 death. Chili action is split into windup/dash; Grinder into windup/release; Pressure Pot displays one warning when living HP falls below 35%, without delaying or changing explosion behavior.

Technical packing applies ONE common scale to all poses of each species, centers each visible pose and uses ground baseline 236 within the source cell. PACKING.json records bounds and scale. Separate repair files are normalized to the source gait size before common packing. Main connected silhouette bounds exclude isolated neighboring-cell scraps. No runtime movement squash. Native-facing metadata flips all clips consistently toward the target. Normal blend preserves the painted shading.

All seven ordinary Fire role mappings plus Golem Elite select the new sheets with static fallback. Stage loading registers all five. Freeze pauses clip/presentation timers; hurt cannot interrupt committed attacks; pooled presentation clears between lives. Defeat animation uses the existing tracked ghost; damage, HP, speed, scales, collision circles, loot and combat timing remain unchanged. Bestiary keeps original images. walk_preview.webp is review-only.

Validation: actual spawn/controller tests cover seven ordinary roles and Elite with original stage-scaled values and role-specific colliders, Grinder windup/freeze, Chili action priority, Pressure Pot warning/reuse and fallback. Asset tests cover stage load registration, facing, dimensions, transparent PNG sources, centered bounds and common ground line. Full npm run check and npm run build:www pass. On-device visual/performance verification remains pending.

Remaining work: commits 5–10 in docs/MONSTER_ANIMATION_PLAN.md. Next: Chapter 1 Ice monsters (Wisp, Shard, Caster, Bubble, Guardian).
