# Ancient Root Knight — C2-5 sprite and animation repair

Version: v6.0.54. Runtime: `assets/mb10_ancient_root_knight_sheet.png`.

The old sheet mixed idle and cleave as a two-frame walking loop, had silhouettes crossing cell boundaries, and used the summon pose for the defeat ghost. The replacement retains the bark-armored knight, crowned head, pink heart, shield and thorn sword.

| Frames | Runtime use |
| --- | --- |
| 0–3 | Idle breathing |
| 4–7 | Alternating walk; faster loop during charge |
| 8–11 | Cleave anticipation, wind-up, sweep, recovery |
| 12–13 | Shield raise / brace |
| 12 → 14 | Oath summon, then hold |
| 15 | Collapsed defeat ghost |

Boot and lazy stage loading register the same animation definitions. Pose expiry returns to idle or walk according to velocity, with death, texture and token guards. Spawn/reuse invalidates old timers. Attack timers, damage and projectiles remain unchanged. The render scale compensates for the cleaner transparent padding; the miniboss world collision radius is preserved (about 50.74 px). Escorts use the walk loop.

Packing: `python scripts/pack_root_knight.py SOURCE.png` (Pillow). Generated alpha is retained, foot baselines are aligned and cells are uniformly resampled, and a transparent gutter separates all runtime frames. Preview: `docs/previews/root_knight_walk.gif`. Automated checks cover frame bounds and pose lifecycle; mobile combat review is pending.

Generation used the built-in imagegen tool. Reference: old runtime knight sheet. Initial request:

Use case: identity-preserve. Asset type: production miniboss animation sprite sheet for Ancient Root Knight, C2-5 mobile fantasy game. Input image is character identity reference; replace the defective four-pose atlas with a clean animation atlas. Preserve this exact dark bark armored crowned knight, pink magenta heart crystal, root cloak, enormous pink edged thorn greatsword, ornate root shield, same 3/4 camera facing slightly left. Create ONE square 4 by 4 grid containing exactly sixteen equally sized cells, transparent background with real alpha, no grid lines labels text shadows floor or particles outside the character. Each cell contains a complete isolated character with at least 10% padding, same body scale and bottom foot baseline. Sword never crosses cell boundary. Read left to right top to bottom: row1 four subtle idle breathing frames (sword held downward); row2 four distinct walking frames with alternating forward/back legs, cloak swing and stable head (sword held downward); row3 four sequential greatsword cleave frames: anticipation, wind-up, forward sweep, recovery, character body center stable; row4 cells: shield raise, shield fully braced, oath summon with lifted hand, collapsed defeated knight. Consistent silhouette/materials and illustration detail; sprite clarity at small sizes, clean anti-aliased alpha edges, no red matte pixels or rectangular cutout remnants. The knight should fill about 75% cell height, weapons within 85% cell width. Keep magenta glow confined to sword and heart, no large halos. Image 2048x2048 if possible.

Final spacing correction prompt:

Edit target: Ancient Root Knight sixteen-frame atlas. Production correction: REBUILD THE LAYOUT FROM SCRATCH. EXACT 4 columns x 4 rows, equal square cells. Make all sixteen figures MUCH SMALLER: every figure INCLUDING swords, capes, hands and all effects must fit INSIDE the central 60% of its cell width and central 65% of its height. This leaves very wide transparent 20% gutters on each side. Absolutely NO sprite pixels may cross these invisible gutters. Keep four idle poses row1, four alternating walk poses row2, four sword cleave phases row3, shield standing/shield crouch/oath hand raised/collapsed defeat row4. Preserve dark wooden crowned armor, pink heart, sword, root shield and character identity. Keep the SWORD SHORT ENOUGH to fit inside the central 60% rectangle even while fully extended. All figures same head/body scale except defeated pose. Full sheet real transparent alpha. Remove all scraps of OTHER figures along the cell edges. No red fringe, no detached particles. Completely isolated miniatures centered in sixteen clearly widely separated cells; prioritize very large spacing and clean silhouettes over large characters. No text no dividers no background.
