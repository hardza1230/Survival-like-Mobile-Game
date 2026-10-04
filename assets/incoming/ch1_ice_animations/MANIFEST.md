# Chapter 1 Ice monster animations — v6.55.15

Generated using built-in imagegen, preserving identity/style from the five original Ice monster references. Exact prompts: PROMPTS.md and REPAIR_PROMPTS.md. Five initial 16-pose sheets plus two targeted repair calls: Caster preparation/release (frames 9–10) and Bubble warning row (frames 8–11), to remove long/clipped effects. All five face right. No whole-sheet regeneration. Final repair files are caster_action_repair.png and bomber_warning_repair.png.

| Species | Source PNG | Runtime WebP | Roles |
|---|---|---|---|
| Frozen Sugar Spirit | wisp_sheet.png | assets/art/ch1_ice/wisp_sheet.webp | basic |
| Dashing Ice Shard | shard_sheet.png | assets/art/ch1_ice/shard_sheet.webp | fast, dasher |
| Cold Syrup Turret | caster_sheet.png | assets/art/ch1_ice/caster_sheet.webp | shooter |
| Frost Pressure Bubble | bomber_sheet.png | assets/art/ch1_ice/bomber_sheet.webp | bomber |
| Frozen Gate Warden | guardian_sheet.png | assets/art/ch1_ice/guardian_sheet.webp | tank, siege, elite |

All source sheets are transparent RGBA PNG, 1024×1024, 4×4 cells of 256px. Runtime lossless WebP is 512×512 with native 128px frames to preserve collision coordinates. Frame order: 0–5 movement, 6–7 idle, 8–11 action, 12–13 hurt, 14–15 defeat. Shard actions split into windup/dash; Caster into windup/release; Frost Bubble warning plays once on living HP below 35%, preserving original explosion behavior. Normal blending and native-facing metadata keep art shading and target orientation consistent.

Packing uses ONE common scale for all poses of a species, centers the main connected silhouette and places its lowest point at baseline 236 within the source cell. Transparent bounds exclude isolated neighboring-cell scraps. Separate repairs are normalized with a common scale to the original gait width before final packing. PACKING.json records scale and per-frame bounds. Runtime does not squash moving bodies. Source pixel dimensions and native frame coordinates are preserved across both new spawns and pooled reuse.

All seven ordinary Ice role mappings and Guardian Elite select the new art with original static fallback. Stage loading includes all five sheets. Freeze pauses frames and presentation duration; hurt cannot override committed actions; pooled state clears between lives; death uses tracked non-physics ghosts. Original HP, damage, speed, scale, collision circles, frostbite flags, loot and attack timings are unchanged. Bestiary still uses original static images. walk_preview.webp is review-only.

Validation: actual spawn/controller tests cover seven ordinary roles plus Elite, original stage-scaled stats and role-specific colliders, frostbite, Caster preparation/freeze, Shard action priority, Bubble warning/reset and fallback. Assets are checked for RGBA alpha, dimensions, complete frames, native facing, lazy stage loading, centered bounds and a common baseline. Full npm run check and npm run build:www pass. Phone visual/performance review remains pending.

Remaining work: commits 6–10 in docs/MONSTER_ANIMATION_PLAN.md. Commit 6: existing Chapter 1 stage 5/Chapter 3 sheets. Commits 7–9: Chapter 2. Commit 10: remaining Elite/summon coverage and mobile review.
