# C2-4 Four-Season Conservatory — QA Gate

Version: 4.42.0  
Stage index: 8  
Status: unlocked (`ready:true`)

## Automated checks

- Four-Season Conservatory background exists.
- Seasonal enemy/objective atlas is transparent PNG 1024×512.
- Season Keeper sheet is transparent PNG 1024×256.
- Chronobloom Orchid sheet is transparent PNG 1024×512.
- Root Throne remains locked.
- Mobile live-enemy cap is 92.
- Boss damage gates match phase transitions at 72% and 38% HP.
- Seasonal arena, Stabilize the Seasons, monster-role AI, miniboss and boss contracts are present.

## Manual smoke route

1. Enter Four-Season Conservatory and confirm all four garden quadrants remain readable around the open combat center.
2. Play all five waves; verify Spring, Summer, Autumn and Winter rotate without stopping player control.
3. Verify Spring heals regular enemies, Summer creates warning hazards, Autumn adds Leafblades, and Winter fires an inward volley with a safe gap.
4. On Stabilize the Seasons, follow the highlighted seasonal sanctuary and confirm only the active circle advances progress.
5. Confirm Frostbell leads player movement, Seasonal Wisp fires a four-shot fan, Leafblade leads its dash, and Equinox Gardener protects nearby allies.
6. At Season Keeper, verify Calendar Sweep, Equinox Guard, Solstice Charge and Calendar Call remain readable.
7. At Chronobloom Orchid, confirm the cinematic completes and damage cannot skip the 72% or 38% transitions.
8. Verify Vine Cleave, Solar Bloom, Frost Crown, Autumn Spiral, Fourfold Garden and Time Break each preserve a visible escape route.
9. Defeat the Orchid; confirm defeat presentation, reward flow and hostile-projectile cleanup.

## Performance acceptance

- No sustained frame collapse at the 92-enemy cap on the target Android device.
- No invisible boss, stuck cinematic, NaN position or disabled boss body.
- Seasonal banners and hazards remain readable without excessive screen shake.
