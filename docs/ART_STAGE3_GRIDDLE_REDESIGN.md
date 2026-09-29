# Stage 3 — Mr. Griddle redesign

Delivered in game version 6.0.29. This is the Chapter 1 Stage 3 boss, not a Chapter 3 boss.

## Runtime asset

`assets/boss3_sheet.png` is a transparent 1024×512 PNG, arranged as four columns and two rows of 256×256 frames. The existing `boss3` texture registration consumes this file in combat, the Bestiary and boss previews.

| Frame | Pose | Existing consumer |
| --- | --- | --- |
| 0 | Idle | `boss3_idle` |
| 1 | Engine rumble | `boss3_idle` |
| 2 | Furnace overheat | Furnace Overheat |
| 3 | Chili spray | Chili Rain |
| 4 | Conveyor charge | Conveyor Charge |
| 5 | Spinning blade arms | Flavor Grinder |
| 6 | Enraged overheat | Phase transitions |
| 7 | Defeated | Reserved artwork; existing defeat behavior retained |

Attack logic, damage, timing, collision and phase invulnerability are unchanged.

## Art direction and prompt

Generated with the built-in image tool. The previous session's reported new sheet could not be recovered from saved files, so this delivery recreates that direction.

Production prompt: An imposing cursed cast-iron griddle/chili furnace machine, squat blackened iron boiler torso, orange furnace mouth, fierce amber eyes, frying-pan shoulder armor, brass rivets, pepper hopper/chimney, mechanical arms and wheeled base. Polished 2.5D candy fantasy illustration with readable silhouettes and consistent three-quarter viewpoint. Eight transparent sprites in a 4×2 grid: idle, rumble, overheat, chili spray, rightward charge, spinning blade arms, enraged overheat, defeated. No text, scenery or grid lines.

Correction prompt: Preserve the design and pose order; fit each complete sprite and its effects within a square cell with transparent margins, shorten spray/trails as needed, and align the idle pair. The final sheet is scaled to the runtime resolution with its alpha preserved.

## Validation

- Inspect all eight frames for correct order, alpha and cell boundaries.
- Run `npm run check` for source, content and balance validation.
- Run `npm run build:www` to validate deployment packaging and cache hashes.
- Confirm the packaged sheet matches the source asset and the attack implementation matches the parent commit.
