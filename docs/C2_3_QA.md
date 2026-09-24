# C2-3 Nectar Hive — QA Gate

Version: 4.41.0  
Stage index: 7  
Status: unlocked (`ready:true`)

## Automated checks

- Nectar Hive background exists.
- Enemy/objective atlas is transparent PNG 1024×512 (4×2 cells).
- Royal Stinger sheet is transparent PNG 1024×256 (4 frames).
- Ferment Hornet Queen sheet is transparent PNG 1024×512 (8 frames).
- Future Chapter 2 stages remain locked.
- Mobile live-enemy cap is 96.
- Boss damage gates match phase transitions at 70% and 35% HP.
- Defend Nectar, hive role AI, miniboss and boss attack contracts are present.

## Manual smoke route

1. Open Nectar Hive from stage select and confirm the honey-garden background.
2. Play all five waves; verify three flowers appear for Defend Nectar.
3. Confirm Drones, Honey Bombs and Dartwings pressure flowers while standing near a flower restores it.
4. Confirm Pollen Sniper leads movement, Choir Moth fires a three-shot spread, and Wax Shieldbearer reduces nearby ally damage.
5. At the miniboss, verify Royal Dive has a red lane, Wax Cage leaves two exits, and phase two summons guards.
6. At the boss, verify the cinematic completes, controls return, and HP cannot skip 70% or 35% transitions.
7. Verify Royal Dive, Pollen Fan, Honey Prison, Swarm Coronation, Ferment Spiral and Queen's Decree each show a readable warning.
8. Defeat the queen; confirm the defeat presentation, reward flow, and no remaining hostile bullets.

## Performance acceptance

- No sustained frame collapse with the 96-enemy cap on the target Android device.
- No invisible boss, stuck cinematic, NaN position, or disabled boss body.
- Objective arrows target a living nectar flower when no boss is active.
