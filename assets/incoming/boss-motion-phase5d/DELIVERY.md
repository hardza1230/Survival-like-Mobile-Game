# Phase 5D shared boss projectile and counter-ring sources

Delivered 2026-11-24: 12 PNG32 sheets / 96 frames, all mechanical QA passed, no missing. Eleven roadmap projectile targets plus the shared vfx_counter_ring. Based on phase5C source a5ab2cbd; deploy v8.2.83 fetched before work. Source-only, no game/runtime/tests/release changes.

Every shot keeps its original identity, palette, right-facing head and compact footprint. Only small tail/highlight details animate. Five roadmap fallback variants 01/04/07/11/15 remain unchanged. Their Story stages suppress boss shots; the caller separately handles Delve actors and Pinnacle styles. Reassess any additional consumers before promoting those fallback rows.

MANIFEST contains exact grids, source URLs, baseProjectileKey, anchors, visible bounds and suggested rates. Use four columns/two rows, 128px cells. New 8@16FPS retains the old 4@8FPS half-second cycle. Keep damage, projectile size, speed, lifetimes, hitboxes, split/homing behavior and safe zones unchanged when wiring. Calibrate visible bounds as needed while preserving head orientation and caller origin.

The current tickBossShotLoops manually samples floor(t*8)%4. The code owner must make that playback consume the registered frame count/rate when wiring, preserving pause, Reduced Motion, pooling and stale-owner cleanup. The source art alone does not change the runtime player. vfx_counter_ring uses the existing bpAnim caller and neutral gold palette for tint compatibility.

QA covers exact dimensions/grid, true RGBA transparency, nonempty distinct frames and >=4% safe borders (at least 2px). PREVIEW.gif has normalized comparison timing. Earlier phase 4 QA exceptions remain reported. Next phase is the menu/Ruby/Expedition animation group.
