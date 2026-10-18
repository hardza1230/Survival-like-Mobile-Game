# C2-4 Four-Season Conservatory — QA Gate

Reviewed against **v7.8.56**, 2026-10-18.
Stage index: 8. Implemented and unlocked in code; owner mobile acceptance remains pending.

This supersedes the v4.42 sanctuary route and v7.8.29–54 Season Storm trials. The objective keeps internal type `seasonCycle` but is displayed as **Seasonal Harvest**.

## Current contracts to check

- v7.8.56: Seasonal Wisp (siege) base HP is 130 instead of 260, before stage/wave scaling; its five-shot fan and Equinox guard reduction remain unchanged. Spark Build deals 15% less damage to minibosses (including Static Charge/Storm Mark); normal-enemy/boss damage and other build paths are unchanged. Compare first-clear/replay and all three Taro paths on owner phone.

- Seasons rotate every 10 seconds: Spring → Summer → Autumn → Winter.
- Each non-boss kill credits 1 petal to the current season; Elites credit 3. Each season needs 12.
- Once a season is full, excess petals contribute at 50% to the emptiest unfinished season, retaining fractional spill between kills.
- Full seasons are marked complete and their hazards stop. Filling all 4 completes the objective; there is no failed trial or reset at a season boundary.
- HUD reports current season, petal count, time until next season and total full seasons.
- Enemy spawning continues during unfinished harvest so an exhausted wave reserve cannot leave the objective stuck.
- Replay progression is kill-only (v7.8.48 onward); miniboss/boss arrival must not skip to a timer.
- Order 19 season/boss art is wired in assets/art/c24_seasons since v7.8.32, with procedural fallbacks. Old trial-specific artwork is not proof the old trial rules are still active.

## Owner phone smoke route

1. Start a first clear of C2-4. Check the seasonal intro, HUD and open combat center at the device's actual screen size.
2. Reach Seasonal Harvest. Defeat regular enemies and Elites; observe 1/3-petal credit without requiring manual pickup.
3. Cross several 10-second boundaries. Counts must persist; taking damage or a failed dodge must not restart a trial.
4. Fill a season. Confirm the completion marker, calm hazard state for that season and spill progress into the emptiest unfinished season.
5. Continue until all four reach 12. Check harvest → remaining waves/hunt → boss → reward without an empty-field stall.
6. At Season Keeper and Chronobloom Orchid, inspect attack telegraphs, transitions, safe routes, sprite visibility and projectile cleanup.
7. Clear the stage, then replay. Verify progress follows kills and reaches miniboss/boss/rewards without a time skip.
8. Test pause/resume, restart/death, VFX off and missing-art fallback where practical; no prior-run counters or visuals may remain.

## Performance and release evidence

- On target Android devices, record FPS, touch responsiveness, screen size and game speed during the busiest seasonal wave and boss attacks.
- No invisible boss, stuck transition, NaN position, disabled body or persistent visual after exit.
- Seasonal labels, count, timer and hazard safe spaces must remain legible on narrow/short phones.
- Use npm run check and npm run build:www for runtime changes, plus relevant regression/menu checks. Automated contracts and existing browser notes do not replace owner gameplay acceptance.
- This documentation refresh did not run combat simulation or certify balance/FPS. Record owner results and exact version before marking the gate passed.
