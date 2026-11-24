# Phase 6 menu, Ruby and Expedition animation sources

Date: 2026-11-24. Branch: asset-delivery/menu-motion-phase6. Base: 3fe60e3b. Latest deploy v8.2.83 fetched first. Source art only; game code, runtime art, tests and release version unchanged.

## Coverage

Fifteen planned eight-frame sheets / 120 frames: Ruby pointing, six rear-view Expedition heroes, level-card border effect, firefly, moon twinkle and five illustrated hub icons. Seventeen roadmap UI-state/fallback sheets remain unchanged; their indices select states or variants rather than motion.

## Code-owner handoff

- Use native cell sizes and four-column/two-row grids from MANIFEST. Keep art identity, existing origins, display sizes, UI structure, equipment and existing fallback images. The new art does not redesign any screen.
- Hero rear poses face away from the viewer into the scene, maintaining the original hair, costume, weapon and ground reference. Body anchor bottom-center records atlas registration; preserve the runtime actor origin and hitbox logic.
- The original Expedition caller displays source frames [1,2,3,0] at [0,55,110,165] ms. New pose order is idle0, begin-windup1, mid-windup2, strike3, follow4, recover5, settling6, near-idle7. Suggested playback [1,2,3,4,5,6,7,0] at [0,27.5,55,82.5,110,137.5,151.25,165] ms preserves the old strike/recovery/idle times. Review this mapping against the actual artwork when wiring; retain the existing attack cadence and yoyo movement. Manual-timed hero clips intentionally have no generic suggested FPS.
- Ruby currently uses named cell frames and a 180ms timer over four cells. Eight cells at 90ms each preserve its 720ms loop. Keep named-frame handling and the existing pointing direction.
- Normal FX/icon suggested rates preserve their old declared cycle periods. Keep menu frequency, card reveal duration, Reduced Motion/VFX settings, cleanup, lazy loading and GPU budgets when wiring.
- referenceContentBounds/contentBounds expose alpha extents for border/footprint calibration. Level-card interior stays transparent. All source PNGs use real alpha, with safe margins and distinct nonempty frames. BodyHeightRatio is median alpha silhouette height compared with the reference, including hair/equipment.
- PREVIEW.gif normalizes playback speed for comparison and is not a runtime timing specification. Appearance on the phone remains owner review after wiring.

The two source QA exceptions from phase 4 stay reported separately. Original UI state sheets, intentionally retained short/fallback clips and deferred unused keys are not missing deliverables in this batch.

## Delivered

2026-11-24: all 15 PNG32 sheets / 120 authored frames delivered; no missing in phase 6. All pass exact native dimensions, four-column/two-row grids, real transparency, nonempty distinct frames and >=4% safety margins per axis (minimum 2px). Body sheets pass reference median silhouette height within 5%; the card-border center remains clear. Manual hero timing and named Ruby cell timing are explicitly recorded instead of blindly doubling an FPS. Status: delivered, awaiting code integration and owner phone review.
