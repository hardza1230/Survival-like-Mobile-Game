# Battle HUD redesign — v8.0.7

The owner screenshot showed bright objective, timer, progress and bonus text scattered over a busy arena, with transparent skill buttons blending into pickups. The new hierarchy uses a plum/gold status header, then a separate mission card. Level/EXP stays first, controls stay top-right, counters sit on one quieter row. Wave pips, mission label, progress and optional bonus have separate rows. Phase/bonus copy loses repeated decorative icons. Boss HP gains a backing; relic and trait lines move below it. Bottom skills share a small tray; Dash and Unique use solid discs with their original colored rings.

No new raster assets or texture loads. Existing hit radii, left-handed/size options, cooldowns, hold/release, dash charges, player health, enemies and rewards are unchanged. The owner's movement-stick and story updates through8.0.6 are preserved.

## Validation

Required npm run check and npm run build:www pass. Static real Phaser Canvas invokes production HUD methods with synthetic values, without combat simulation. Four viewports320×568,360×780,412×915,844×390 cover wave/hunt/season/boss/replay; text bounds/separation and HUD hide/resume pass. Existing combat-controls tests additionally cover all button sizes and both hands, charge/release and pointer ownership. Phone feel/FPS remains owner review.

Reproduce after build: node scripts/build-combat-hud-review.mjs, then node scripts/check-combat-hud-ui.cjs with Playwright on NODE_PATH. Four PNGs in reviews/combat_hud/ are static presentation proofs, not live combat captures.
