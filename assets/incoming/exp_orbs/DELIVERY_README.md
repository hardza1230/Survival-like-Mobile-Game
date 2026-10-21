# Art order 29 — Flavor Drops

Delivered 21 October 2026: 7 PNG32 source assets / 61 frames, built-in ImageGen. Exact dimensions and grids in MANIFEST.json; final prompts, selected-source SHA-256 and the big-pickup correction in PROMPTS.json. Every PNG decodes completely, has genuine alpha and transparent frame borders. Shadow alpha capped at 30%. Pixel extraction/resampling/padding and faint-alpha cleanup only; no procedural replacement art.

`packed/` contains seven WebP candidates at the same dimensions, total **136,794 bytes**, below the 250,000-byte budget. These are delivery candidates; they are not registered or loaded by the game. Check MANIFEST.json hashes before copying.

## Source sheets
- xp_orbs.png — 576×576, 6 rows ×6 columns, 96×96 cells. Rows T1–T6; animate each row separately at 10 fps.
- xp_orb_shadow.png — 64×32.
- vfx_xp_pickup.png — 768×128, six 128×128 cells, white/pale-gold tint-ready.
- vfx_xp_pickup_big.png — 1536×192, eight 192×192 cells.
- vfx_xp_trail.png — 256×128, four 64×128 cells, points upward, tint-ready.
- vfx_xp_merge.png — 480×96, five 96×96 cells.
- xp_bar_icon.png — 96×96.

## QA evidence
QA_actual_sizes.png: all tiers beside original assets/candy.png on five representative solid stage colors (not actual stage textures). QA_all_frames.png: every frame at 16px and enlarged 48px. QA_200_drops.png: seeded offline density proof. QA_loop_10fps.gif: source loop contact strip. QA_effects.png: four effect strips. These proofs do not simulate gameplay or measure FPS. Phone review on actual stages remains pending.

## Integration next
Source delivery only: game.js and GAME_VERSION are unchanged. Follow the order for stage-lazy registration, xp_t1…xp_t6 animations, pools, throttle and fallback. Do not preload at boot. Preserve physics/pickup radius, value accounting, merge limit and story-budget semantics. Measure at 300 orbs on phone; static T1/T2 frames are the fallback.

**Current behavior supersedes the older order:** v7.9.12 removed boss-kill auto-vacuum and wave-end auto collection; EXP stays on the ground for the player to pick up. Do not restore automatic boss vacuum while integrating B3. Use trail art for existing pickup magnets only. Sesame and Yuzu remain WIP and are outside this art delivery.

UPLOAD_VERIFICATION.json is added after successful byte-for-byte readback from the published commit.
