# Phase 5B Chapter 2 boss animation source delivery

Date: 2026-11-23. Branch: asset-delivery/boss-motion-phase5b. Base: source delivery 20e4b004. Deploy v8.2.73 fetched before production.

Source art only. The existing game code, runtime art, registries, gameplay, tests and release version remain intact.

## Coverage

41 planned unique sheets / 364 frames: 35 numeric Chapter 2 roadmap targets (VFX, projectiles and counters), three active ink miniboss idle clips, and three Root Knight clips. 32 sheets use eight frames and nine use twelve. BOSS_OUTLINE814_MAP artwork supplies references where selected; legacy fallback lanes and dive trail remain unchanged.

## Integration notes

- For VFX/projectiles, sourceKey and replaces identify the current art, while frameCount, native dimensions, loop, anchor and suggestedRate describe the new source. Preserve the old duration, hit windows, radii, rewards, movement speed and safe zones.
- referenceContentBounds and contentBounds record visible extents. Calibrate painted warning rings and open sectors against gameplay footprints during wiring, retaining the reference fill descriptor until reviewed.
- Miniboss MB7/MB8/MB9 idle references are the current six-frame idle clips inside their twelve-frame ink atlases. Their wind/strike/recover segments remain intact and are not part of these replacements.
- Root Knight idle uses source indices 0–3; walk and charge share indices 4–7 and one new eight-frame sheet with separate rates; cleave uses 8–11 and expands to twelve frames. Preserve bastion 12/13, oath 12/14 and the existing death/held-state index mappings in the original atlas.
- Body clips are separate textures, never whole-atlas replacements. actorKey, sourceFrames, actions, previousRates, suggestedRates and bodyHeightRatio identify the source segment. BodyHeightRatio measures median alpha silhouette height, including attached equipment/effects, against that reference segment.
- Body anchor bottom-center records the atlas ground reference, not a request to change the runtime actor origin or hitboxes. Keep existing actor origin, display size and facing when wiring.
- vfx_b07_fog_tile is a full-bleed repeating RGBA fog tile. It deliberately covers frame edges, unlike isolated sprites. Mechanical seam packing mirrors a centered generated half-tile into a periodic 2x2 tile; every painted pixel originates in the authored ImageGen texture. Left/right columns and top/bottom rows are byte-identical. Preserve full-screen TileSprite coverage and test frame selection at the actual fog caller.
- Other sheets use actual transparent padding. QA checks per-frame size/grid/alpha/nonempty/distinctness/borders, warning center/span where applicable, and reference silhouette height for body clips.
- Use lazy loading, existing art fallbacks and Reduced Motion/VFX settings when installing. PREVIEW.gif has normalized timing for comparison; suggested rates preserve declared reference cadence.

The two reported phase 4 QA exceptions remain separate. Chapter 3 / Pinnacle art, the shared boss-bullet batch and the later menu/Expedition phase remain future batches.

## Delivered

2026-11-23: all 41 PNG32 sheets / 364 authored frames delivered. Missing files: none. All pass exact dimensions/grid, distinct nonempty frames and hash verification. Isolated sprites/VFX have genuine transparent margins of at least 4% (minimum 2px); body clips match reference median silhouette height within 5%. The full-bleed fog tile instead passes exact opposing-edge RGBA seam checks. Every suggested playback rate preserves the declared source period, including both walk/charge aliases. Status: delivered, awaiting code integration.
