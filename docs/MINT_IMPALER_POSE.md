# Mint — Impaler charge character animation (8.0.55)

The charge now animates the existing player sprite. The old floating glow and separate charge-effect plane are no longer created by castImpalerLance. Their old asset registrations remain for compatibility.

- Stationary: eight preparation frames driven by original charge progress (320ms +80ms per Heavy Draw rank).
- Moving: eight authored running-with-lance frames use the existing speed-based gait, preserving phase when movement resumes. No duplicated character follows behind.
- Release: eight authored throw/recovery frames. Existing charge-aware animation skips repeated preparation and goes directly into release; moving releases retain normal gait priority.
- Hurt and Dash preempt the charge pose; actual hurt still causes the original partial shot. Missing art falls back to original poses. Pause freezes presentation; reduced motion holds charge frame5.
- Player/basic/path/epoch/death checks reject stale presentation or release. Clear cancels timers and charge audio.

All three clips are 1024×128 lossless alpha WebP, eight128px cells, common source scale and foot baseline122. They use the normal player scale and preserve configured collider, coordinates and velocity. GPU cost1.5MiB, Mint-only lazy loading. Damage, cooldown, charge duration, target selection, projectile and Impale/Rupture rules retain their formulas.

## Provenance and review

Built-in ImageGen generated24full-body poses from original Mint attack/run references; a second built-in edit refined spacing and removed excessive ribbons/orbs. Original and selected source, exact generation/edit prompts, dark-matte proof and slower art-only GIF live in assets/incoming/mint55/. Runtime MANIFEST records source/original/output SHA-256, crop rectangles, destinations and common scale. scripts/pack-mint-55.py only crops, resizes and packs generated images; it does not paint new artwork.

Art preview: assets/incoming/mint55/pose_preview.gif (three clips side-by-side,110ms/frame; not a gameplay capture).

## Validation

Production presentation/casting adapters exercise30/60/120FPS, all charge frames, moving gait, release/partial, pause/reduced motion, hurt/Dash/stale/death, fallback, no charge-plane allocation, scale/foot/collider contracts and hashes. Existing Impaler numerical tests remain. Required full project check and production build; source alpha proof inspected, no combat simulation or game screenshots. Phone appearance/pacing/FPS need owner review.
