# Phase 5A Chapter 1 boss animation source delivery

Date: 2026-11-23. Branch: asset-delivery/boss-motion-phase5a. Base: source delivery 8e74afb4; deploy v8.2.73 fetched before work.

Source art only. Original atlases, game.js, runtime registrations, gameplay, tests and release files remain unchanged.

## Coverage

The Chapter 1 numeric targets from the animation roadmap resolve to 22 unique sheets: five warning loops, four large waves, six special skill loops, four counter objects, the burrow ground effect, the sludge band and frost breath. Seventeen use eight frames and five use twelve, 196 planned frames. Modern BOSS_OUTLINE813_MAP artwork is the reference where available. The five lane fallbacks, B01 wave fallback and static ice-pillar state cells retain their current art under the roadmap.

## Handoff to the code owner

- MANIFEST.json maps each delivered key to its sourceKey and existing reference URL, exact native frame sizes, four-column grid, frameCount, anchor and loop setting.
- previousRate and suggestedRate preserve the declared reference animation period. Keep gameplay warning duration, release time, damage, hazard radii and safe zones unchanged when installing the assets.
- referenceContentBounds and contentBounds record the visible alpha extents before and after atlas packing. Calibrate the visible warning ellipse against the real hazard footprint when wiring; safety padding is inside the frame. fill preserves the existing descriptor for review, rather than authorizing any gameplay boundary change.
- The new sources use genuine RGBA transparency, matching their existing runtime family. Interpret background as transparent when packing these sources.
- Warning loops keep their base ellipse and center opening in the prompts. QA records central occupancy and alpha span variation as well as dimensions, grid, per-frame safety margins and distinct nonempty frames. Human review of the painted contour and safe-zone alignment still belongs to the code owner/owner playtest.
- New frame counts need to reach any manual frame ranges, shader timing or frame-index callers used by these effects. Continue using lazy loading, prior visuals as fallbacks and existing VFX/Reduced Motion settings.
- PREVIEW.gif uses normalized timing so the sheets can be compared. The manifest rates govern intended cadence when installed.

Phase 5B/5C (Chapters 2 and 3, including later boss/miniboss art and bullets) remain separate work. The two QA exceptions from phase 4 remain documented in that delivery.

## Delivered

2026-11-23: all 22 source PNG32 sheets / 196 authored frames delivered. Missing files: none. All mechanical checks pass for exact dimensions/grid, real transparency, distinct nonempty frames and >=4% transparent margins (minimum 2px). Five warning loops also pass central transparency and alpha-span consistency checks. The suggested rates preserve the existing declared cycle periods. Original files remain intact. Status: delivered, awaiting code integration.
