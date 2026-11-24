# Phase 5C Chapter 3 and Pinnacle source delivery

Delivered 2026-11-24: 28 PNG32 sheets / 256 authored frames. Twenty sheets use eight frames and eight use twelve. No missing files. Source branch asset-delivery/boss-motion-phase5c, based on 9432fed1. Current deploy v8.2.83 was fetched and all 28 source URL/dimension/count/rate/anchor/loop/fill definitions remain compatible with the saved references.

## Coverage

Six warning rings, six large waves, seven special effects, last-seed effect, two large sweeping actions and six counter objects. Current BOSS_OUTLINE815_MAP art is the reference where available. Six fallback lanes and the stampede trail retain their original art under the roadmap.

## Recovery

The owner deleted the old E: checkout and paused work. Recovered twenty native ImageGen outputs and their actual prompts from generation records. All twenty input-reference SHA256 values match the rebuilt references exactly. Generated only the eight previously unfinished sheets with built-in ImageGen. PROMPTS.json marks recovered records and includes reference hashes. The delivered PNGs are normalized source atlases, not placeholders.

## Integration handoff

- Source art only; game.js, runtime art, tests and release version are unchanged. Runtime wiring and phone appearance review remain with the code owner/owner.
- MANIFEST.json maps key/sourceKey/replaces, exact native cell size, four-column grid, frameCount, anchor, loop and rates. Current outlined art is delivered once for each mapped key.
- Suggested rates preserve reference cycle duration. Keep damage, hit windows, warning duration, release time, radii, rewards and safe zones unchanged when wiring.
- referenceContentBounds and contentBounds record visible extents. Calibrate warning ellipses, beam endpoints and sweep footprints against actual gameplay geometry. Transparent centers provide visibility, not a new safe-zone rule.
- Read frame counts dynamically in manual callers. Keep actor origins, display logic, lazy loading, old visuals as fallbacks and Reduced Motion/VFX settings.
- QA checks exact dimensions/grid, true RGBA transparency, nonempty distinct frames, >=4% transparent safety margins (minimum 2px), and central transparency/span consistency for six warnings. Source format matches the existing RGBA family.
- PREVIEW.gif uses normalized comparison timing. Runtime cadence comes from the manifest and existing gameplay timers.

Shared boss bullets remain the next art batch before phase 6 menus/Ruby/Expedition. The two phase 4 QA exceptions remain reported separately.
