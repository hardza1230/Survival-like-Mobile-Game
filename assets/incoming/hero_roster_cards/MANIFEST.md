# Reference hero roster — 12 October 2026

Owner reference: image(2).png. Six full-art landscape hero cards with colored magic/backdrops. Generated with the built-in ImageGen tool, one separate call per hero. No embedded names, roles or UI text. Final runtime assets are under `assets/art/hero_roster/` and are registered as `roster_<id>`.

| ID | Runtime file | Size | Alpha | Visual identity |
|---|---|---|---|---|
| momo | momo.webp | 768×460 | Rounded UI corners | Pink hair, strawberry/cream ornaments, heart seed gun, petals |
| mint | mint.webp | 768×460 | Rounded UI corners | Mint hair, ice lance, cyan crystals/snowflakes |
| cocoa | cocoa.webp | 768×460 | Rounded UI corners | Brown hair, bear-ear buns, chocolate gauntlets, amber magic |
| taro | taro.webp | 768×460 | Rounded UI corners | Lavender hair, two rift compasses, violet lightning |
| yuzu | yuzu.webp | 768×460 | Rounded UI corners | Golden hair, citrus slices, leaves, two citrus companions |
| sesame | sesame.webp | 768×460 | Rounded UI corners | Black hair, ivory/gold accents, circular silver mirrors |

Packing: original full-bleed generated PNG → 768×460 WebP quality 89; deterministic 42px rounded UI corner alpha. No character redesign, text baking or sprite changes during packing. Originals remain in the generating conversation; compressed final cards are the repository deliverables.

Integration: load only with Heroes menu group; classify as menu-lazy, release through current texture budget. Current game portraits remain in the top preview/details and other menus. Six card taps preview without modifying the save; the pink footer explicitly selects the previewed hero. Gold frames/checkmarks indicate the saved selection. Locked and development/playtest guards are preserved. Native text and frames stay readable at changing viewport sizes.

Validation: actual-method selection/locked/fallback tests at 320×568, 390×844, 430×764, 768×1024 and 844×390; full check and web build. Display-list renders were inspected at phone/tablet/landscape sizes; these are reconstructed geometry, not live browser screenshots. Live cloud-browser review confirmed all six images and the reference layout at v7.7.12; v7.7.13 corrects wide-portrait name/role spacing. Owner phone touch/FPS review remains pending.
