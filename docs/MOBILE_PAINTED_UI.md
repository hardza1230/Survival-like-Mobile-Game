# Painted mobile UI — v7.8.9

Owner approved the compact Hero tab and Select geometry, then requested colors matching the hero, actual ImageGen frames/icons matching the prior Stats concept, and a new Gear & Power design and production asset set.

Hero active tabs and Select follow the preview hero on roster; Stats/Talents follow the equipped hero. Six palettes: coral Strawberry, cyan Mint, warm brown Cocoa, violet Taro, gold Yuzu and silver Sesame. Other roster controls retain their dimensions.

## Production artwork

21 WebP files in `assets/art/mobile_ui_789`: seven Stats frame textures, seven stat icons, an info jewel, five Gear card textures and a courtyard background. MANIFEST records selected generator source filenames, extraction boxes, bounded dimensions and alpha extrema. PROMPTS contains the exact selected built-in ImageGen prompts. Text, stat values, navigation and guide labels are live game elements.

Stats textures have true transparent edges; ordinary cropped Images create Canvas-compatible nine slices with proportional corners. Stat icons use uniform scale. Gear cards intentionally combine painted illustration and border in opaque rectangular textures, shown at their natural aspect ratio. Extra attempted transparent Gear kits did not satisfy alpha quality and are not shipped. New page artwork loads per menu group and is excluded from stage-critical artwork.

## Validation / reproduction

Required `npm run check` and `npm run build:www`; asset contract checks 21 mapped WebP files, bounded resolution/size, Stats alpha and isolated loader groups.

Heroes review: `node scripts/build-heroes-review.mjs`, then `node scripts/check-heroes-live-ui.cjs` with Playwright. Checks seven real Canvas viewports, six hero colors, seven painted frames / fourteen icon objects, preview / confirmation / details / source overlays. Gear review: `node scripts/build-gear-power-review.mjs`, then `node scripts/check-gear-power-ui.cjs`. Checks seven viewports, artwork aspect, text/touch bounds, all five destinations and locked guard. Synthetic menu-only data; no headless combat simulation. Optional HEROES_SHOT_PATH / STATS_SHOT_PATH / GEAR_POWER_SHOT_PATH save screenshots.

Owner's physical-phone feedback remains the final check for visual/touch feel. Raw selected atlas/concept sources and a ZIP containing the production asset set are in this task's outputs directory; runtime files and prompts are committed to the repository.
