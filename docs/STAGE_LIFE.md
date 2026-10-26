# Subtle stage life · v8.0.53

Owner requested a modest amount of environmental life. Reuse existing stage-lazy decoration art and the existing glow texture. No new ImageGen, audio, texture downloads or GPU allocations are needed.

## Campaign themes

| Stage | Ambient detail |
|---|---|
| C1-1 | Warm cellar dust |
| C1-2 | Occasional muted drain drips |
| C1-3 | Small rising furnace embers |
| C1-4 | Sparse slow snow flecks |
| C1-5 | Muted violet dust |
| C2-1 | Drifting leaf fragments |
| C2-2 | Slow mushroom spores |
| C2-3 | Honey-colored pollen |
| C2-4 | Seasonal petals |
| C2-5 | Faint root spores |
| C3-1 | Falling ash |
| C3-2 | Dry leaf fragments |
| C3-3 | Cool greenhouse dust |
| C3-4 | Warm vault dust |
| C3-5 | Faint violet spores |

Existing background foliage/reeds/grass/flowers/petals/vines sway≤.025rad, roots≤.006rad. Lamps, glow caps, crystals and puddles softly vary from88–100% of their original opacity over a slow cycle. Flash-off keeps these objects at original opacity. Existing physical room props, navigation and hazard art remain untouched.

## Readability and budget

- Six reused ambient Images max, three when Auto has reduced detail, two during bosses. Low effects, Low performance, Auto lowest detail and reduced motion disable new ambient movement and restore props.
- At most eight existing background props animated; three during bosses. Refresh visible candidates every.5s, not the entire world every frame.
- Particles spawn only in narrow left/right rim bands. Glow motes are3–4px, drips3×9px and painted leaves/pollen12px. Opacity≤.22, NORMAL blend, no warning rings/solid fog/full-screen overlay.
- Keep165world pixels around the player clear,220around an active boss and120around the Wisp. All added images remain on background depth below actors and combat warnings.
- Local deterministic visual noise never consumes gameplay random numbers. Ambient time uses unscaled delta; x4 combat does not turn it into a storm. Pause freezes clocks.

## Ownership

Stage props/decor construction builds the layer for all15campaign settings, including stages without streamed decor. Player/stage/art-epoch changes replace it. Clear stage props, central art clear and scene shutdown destroy its six-image pool and restore sampled original prop transforms. Streamed prop reuse checks the exact original metadata object before applying/restoring transforms. Tutorial and Recipe/Delve retain their own environments and bypass this layer. Missing theme textures use the old glow; missing all usable textures skips airborne particles.

No changes to physics, AI, damage, hazards, rewards, stage progression or existing Chapter2 parallax layers.

## Verification

`tests/stage-life.test.cjs` executes only production ambient adapters:15profiles, finite reused images, size/opacity/background depth/central clearance, performance/Low/High/boss budgets, pause/reduced motion, player/stage/epoch/shutdown, texture failure, recycled-prop restoration and RNG isolation. Required full checks/build and exact publication status are in the handoff. No gameplay simulation or game screenshots; owner phone review remains for how much motion is visible and device FPS.
