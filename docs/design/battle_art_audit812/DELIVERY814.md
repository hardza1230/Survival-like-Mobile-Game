# Chapter 2 boss VFX — 8.1.14

Second audit batch:28clips /168original painted frames across seven transparent atlases. Five elemental impact/wave/lane sets plus Root Breach, Full Bloom, Spore Mortar, Heartstorm, Honey Wall, Dive Trail, both botanical clock hands, Crown Cage, Choir Note, Memory Eclipse, Pod Shield and Root Band.

All new keys are stage-lazy for stages5–9, registered before the stage-key snapshot. B06 Pod Shield also loads in stage9 because True Rootmother uses the same pod mechanic. Existing C1 body-move textures are reused in C2; main-boss impact aliases retain the elemental stage art. The C3/Pinnacle route and missing-image fallback retain original art. Nothing is added to the boot/core image set.

The owned six-frame clock now recognizes both C1 and C2. Direct clock-hand/pod-shield sprites join that clock and clean up through the existing sprite/scene ownership. Honey walls preserve their designated-frame hold. Clock-hand origin, rotation, length and hit distance stay tied to the original live geometry. The existing large-effect opacity gate recognizes new aliases, including C1 Eclipse, to preserve battlefield visibility.

The Mycelium stationary charge, fixed distant air bubble and timed blast are preserved. Fog tile, safe bubble, original warning keys, hitboxes, damage, bullet gaps, safe corridors and attack timings are unchanged. The C2 body-impact name uses two-digit formatting throughB10; the existing760ms cosmetic delay remains aligned with hazard damage.

Validation: exact source/runtime hashes, dimensions, original projected footprints/anchors, six distinct visible frames per clip, actual alpha and clear cell borders; production-helper adapters for stage aliases/fallback/Pinnacle, held honey gates, live clock-hand/pod sprites, opacity and ownership; combined C1/C2 static real Canvas gallery60clips /360frames with pause/Low/reduced checks across six layouts. These are asset/event contracts, not combat simulation or phone appearance tests.

Remaining art queue: C3 effects/projectile motion and boss body pose extensions. All existing811 projectile sizing,812 Plasma and813 C1 effects are retained. Phone readability/FPS review remains pending.

Packed runtime:28lossless WebP sheets,6,206,150bytes total; aggregate decoded31,825,920bytes across the full C2 kit. Only stage subsets load. Sources/previews remain outside the runtime asset list.
