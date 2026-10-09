# Build Path Art — All five batches

Base: v6.60.2. Delivery: 44 PNG assets, 296 frames. Generated with the built-in image_gen tool; no gameplay changes.

Incoming art only: runtime WebP packing, sprite registration, blend/alpha conversion and timing integration remain with the code owner. Delivered: Batch 1 Titan (12), Batch 2 Fire Fist (10), Batch 3 Dash/shared (9), Batch 4 Mint (8), Batch 5 Strawberry (5).

Final cells are 256×256 except the three impale stack markers (128×128), row-major, RGBA PNG. Character origin x128; grounded baseline y235. Deliberate jump offsets are recorded in ATLAS_METADATA.json. The small fire fist occupies up to104px versus208px for the finisher; pellet impacts occupy64px. Black VFX require additive blending or the existing black-to-alpha pipeline. Keep floor debris/crater alpha as supplied.

Technical export: intact character components extracted from generated masters (some native frames cross the nominal grid), uniform scale per atlas, centred and grounded, intentional lift applied. VFX retain one scale and crop origin per atlas; non-square native cells are packed without stretching. Native masters are preserved in the local outputs/build-path-art-masters folder. Metadata includes source dimensions and crop rectangles.

Preview: PREVIEW.html — animation, pause, single-frame stepping, speed, dark/light backgrounds, 64px and 192px displays.

| Key | Grid | Frames | Loop | Background |
|---|---|---:|---|---|
| [cocoa_titan_leap_slam_sheet](cocoa_titan/cocoa_titan_leap_slam_sheet.png) | 4×3 | 12 | no | alpha |
| [cocoa_titan_light_hop_sheet](cocoa_titan/cocoa_titan_light_hop_sheet.png) | 4×2 | 8 | no | alpha |
| [cocoa_titan_charge_sheet](cocoa_titan/cocoa_titan_charge_sheet.png) | 4×2 | 8 | yes | alpha |
| [cocoa_titan_charge_walk_sheet](cocoa_titan/cocoa_titan_charge_walk_sheet.png) | 4×3 | 12 | yes | alpha |
| [cocoa_titan_colossus_sheet](cocoa_titan/cocoa_titan_colossus_sheet.png) | 4×4 | 16 | no | alpha |
| [vfx_titan_landing_crack](cocoa_titan/vfx_titan_landing_crack.png) | 4×2 | 8 | no | alpha |
| [vfx_titan_shockwave](cocoa_titan/vfx_titan_shockwave.png) | 4×2 | 8 | no | black |
| [vfx_titan_rage_aura_lv1](cocoa_titan/vfx_titan_rage_aura_lv1.png) | 4×2 | 8 | yes | black |
| [vfx_titan_rage_aura_lv2](cocoa_titan/vfx_titan_rage_aura_lv2.png) | 4×2 | 8 | yes | black |
| [vfx_titan_rage_aura_lv3](cocoa_titan/vfx_titan_rage_aura_lv3.png) | 4×2 | 8 | yes | black |
| [vfx_titan_crush_burst](cocoa_titan/vfx_titan_crush_burst.png) | 4×3 | 12 | no | black |
| [vfx_titan_lava_crater](cocoa_titan/vfx_titan_lava_crater.png) | 4×1 | 4 | yes | alpha |
| [cocoa_fire_jab_sheet](cocoa_fire/cocoa_fire_jab_sheet.png) | 4×2 | 8 | no | alpha |
| [cocoa_fire_finisher_sheet](cocoa_fire/cocoa_fire_finisher_sheet.png) | 4×2 | 8 | no | alpha |
| [cocoa_rocket_launch_sheet](cocoa_fire/cocoa_rocket_launch_sheet.png) | 4×2 | 8 | no | alpha |
| [vfx_fire_fist_proj](cocoa_fire/vfx_fire_fist_proj.png) | 4×1 | 4 | yes | black |
| [vfx_fireball_big](cocoa_fire/vfx_fireball_big.png) | 4×1 | 4 | yes | black |
| [vfx_fireball_explode](cocoa_fire/vfx_fireball_explode.png) | 4×2 | 8 | no | black |
| [vfx_rocket_gauntlet](cocoa_fire/vfx_rocket_gauntlet.png) | 4×1 | 4 | yes | black |
| [vfx_gauntlet_stick](cocoa_fire/vfx_gauntlet_stick.png) | 4×2 | 8 | no | black |
| [vfx_fire_pool](cocoa_fire/vfx_fire_pool.png) | 4×1 | 4 | yes | alpha |
| [vfx_fire_meteor](cocoa_fire/vfx_fire_meteor.png) | 4×2 | 8 | no | black |
| [cocoa_dash_leap_sheet](cocoa_dash/cocoa_dash_leap_sheet.png) | 4×2 | 8 | no | alpha |
| [cocoa_dash_jab_sheet](cocoa_dash/cocoa_dash_jab_sheet.png) | 4×2 | 8 | yes | alpha |
| [cocoa_phantom_rush_sheet](cocoa_dash/cocoa_phantom_rush_sheet.png) | 4×2 | 8 | no | alpha |
| [vfx_dash_afterimage](cocoa_dash/vfx_dash_afterimage.png) | 1×1 | 1 | no | alpha |
| [vfx_dash_slam_ring](cocoa_dash/vfx_dash_slam_ring.png) | 4×2 | 8 | no | black |
| [vfx_shadow_fist](cocoa_dash/vfx_shadow_fist.png) | 4×1 | 4 | yes | black |
| [vfx_chain_leap_line](cocoa_dash/vfx_chain_leap_line.png) | 4×1 | 4 | no | black |
| [cocoa_hurt_sheet](cocoa_shared/cocoa_hurt_sheet.png) | 4×1 | 4 | no | alpha |
| [cocoa_victory_sheet](cocoa_shared/cocoa_victory_sheet.png) | 4×2 | 8 | no | alpha |
| [vfx_barrage_volley](mint/vfx_barrage_volley.png) | 4×2 | 8 | no | black |
| [vfx_hailstorm](mint/vfx_hailstorm.png) | 4×2 | 8 | no | black |
| [vfx_impaler_charge](mint/vfx_impaler_charge.png) | 4×2 | 8 | yes | black |
| [vfx_impale_stack_1](mint/vfx_impale_stack_1.png) | 1×1 | 1 | no | alpha |
| [vfx_impale_stack_2](mint/vfx_impale_stack_2.png) | 1×1 | 1 | no | alpha |
| [vfx_impale_stack_3](mint/vfx_impale_stack_3.png) | 1×1 | 1 | no | alpha |
| [vfx_crystal_rupture](mint/vfx_crystal_rupture.png) | 4×2 | 8 | no | black |
| [mint_lance_throw_charged_sheet](mint/mint_lance_throw_charged_sheet.png) | 4×2 | 8 | no | alpha |
| [vfx_sniper_impact](strawberry/vfx_sniper_impact.png) | 4×1 | 4 | no | black |
| [vfx_pellet_hit](strawberry/vfx_pellet_hit.png) | 4×1 | 4 | no | black |
| [vfx_ricochet_bounce](strawberry/vfx_ricochet_bounce.png) | 4×1 | 4 | no | black |
| [vfx_ricochet_link](strawberry/vfx_ricochet_link.png) | 4×1 | 4 | yes | black |
| [vfx_heart_pinball_splash](strawberry/vfx_heart_pinball_splash.png) | 4×2 | 8 | no | black |

## Validation and integration

QA_REPORT.json records dimensions, alpha, non-empty frame checks, distinct frame counts and SHA-256 hashes. All296 frames decoded successfully. PREVIEW.html was opened in browser and checked on dark/light backgrounds and at64px. Character grounded bounds were aligned; generated pose interpolation and final gameplay timing still require in-game integration/playtesting. This delivery does not claim final combat smoothness.

## Actual prompts

### cocoa_titan_leap_slam_sheet

Use case: stylized-concept. Production game character sprite sheet, cocoa_titan_leap_slam_sheet. Reference images are identity/style references only: preserve EXACT chibi chocolate girl with chestnut side ponytail, cream candy ornament, brown confection armour, very oversized teddy-bear boxing gloves, large amber eyes, soft brown outlines and glossy candy highlights. Generate NEW Titan jumping double-fist ground slam animation, not a collage of reference images. True transparent background, no ground shadow, no text, no watermark, no grid lines. EXACT canvas 1024 by 768 pixels, 4 columns by 3 rows, exactly 12 equal 256x256 cells read left to right then top to bottom. Character always facing screen-right 3/4 top-down. Ground anchor local x128,y235 in each cell. Normal standing figure about 150px high, leave headroom for jumps; centre consistent, do not recenter airborne frames. Frames 0-1 squat anticipation; 2-4 rise jumping, both bear fists overhead, toes lift away from ground; 5 highest point fists together; 6-7 descend; 8 powerful two-fist ground impact, broad squash; 9-11 rebound and return to original guard. Consecutive poses connected, no duplicates, no background dust/rocks baked into character; VFX delivered separately. No clipped gloves/hair. Stay readable at 64px.

### cocoa_titan_light_hop_sheet

Production sprite atlas for Mochi Mayhem, 3/4 top-down screen-right chibi chocolate bear-glove girl. The input sheets are identity/style references: match face, chestnut side ponytail, cream candy hair ornament, confection brown armour, oversized teddy bear gauntlets, amber eyes, soft dark brown outline and candy highlights. Draw new poses. True RGBA transparency, no shadow, no letters, no grid lines, no watermark. Equal cells, left-to-right then top-to-bottom. All sprites fully inside cells, 8% safe margins. Fixed camera, identical head/body scale across frames; normal feet anchor at 92% cell height, x50%; jump offsets deliberate, never auto-centre each pose. Exactly eight frames, 4 columns x2 rows; output 1024x512. Fast low single-fist hopping slam: 0 ready,1 crouch,2 small upward hop,3 leading fist lifted,4 descent,5 single-glove floor strike with squashed body,6 rebound,7 original guard. No fire, no ground debris. Only a small hop; two intact bear gloves.

### cocoa_titan_charge_sheet

Production sprite atlas for Mochi Mayhem, 3/4 top-down screen-right chibi chocolate bear-glove girl. The input sheets are identity/style references: match face, chestnut side ponytail, cream candy hair ornament, confection brown armour, oversized teddy bear gauntlets, amber eyes, soft dark brown outline and candy highlights. Draw new poses. True RGBA transparency, no shadow, no letters, no grid lines, no watermark. Equal cells, left-to-right then top-to-bottom. All sprites fully inside cells, 8% safe margins. Fixed camera, identical head/body scale across frames; normal feet anchor at 92% cell height, x50%; jump offsets deliberate, never auto-centre each pose. Exactly eight frames,4 columns x2 rows; output1024x512. Blood Rage charging LOOP: firm wide stance, fists clenched at hips, subtle breathing and trembling, increasingly tense expression, restrained red vapour and red eye glow. Feet at same ground position every frame. Frame7 smoothly returns to frame0. Keep body identity consistent; fists do not punch. No ground shadow.

### cocoa_titan_charge_walk_sheet

Production sprite atlas for Mochi Mayhem, 3/4 top-down screen-right chibi chocolate bear-glove girl. The input sheets are identity/style references: match face, chestnut side ponytail, cream candy hair ornament, confection brown armour, oversized teddy bear gauntlets, amber eyes, soft dark brown outline and candy highlights. Draw new poses. True RGBA transparency, no shadow, no letters, no grid lines, no watermark. Equal cells, left-to-right then top-to-bottom. All sprites fully inside cells, 8% safe margins. Fixed camera, identical head/body scale across frames; normal feet anchor at 92% cell height, x50%; jump offsets deliberate, never auto-centre each pose. Exactly12 frames,4 columns x3 rows,1024x768. Heavy slow WALK LOOP while charging Blood Rage: complete left/right gait, clenched bear fists held tense, subdued red aura trails, eyes slightly red. Feet alternate naturally on fixed floor baseline. No leap, no impact, no attack. Frame11 flows into frame0. Body and head remain same scale; facing RIGHT, no turned backs.

### cocoa_titan_colossus_sheet

Production sprite atlas for Mochi Mayhem, 3/4 top-down screen-right chibi chocolate bear-glove girl. The input sheets are identity/style references: match face, chestnut side ponytail, cream candy hair ornament, confection brown armour, oversized teddy bear gauntlets, amber eyes, soft dark brown outline and candy highlights. Draw new poses. True RGBA transparency, no shadow, no letters, no grid lines, no watermark. Equal cells, left-to-right then top-to-bottom. All sprites fully inside cells, 8% safe margins. Fixed camera, identical head/body scale across frames; normal feet anchor at 92% cell height, x50%; jump offsets deliberate, never auto-centre each pose. Exactly16 frames,4 columns x4 rows,1024x1024. Colossus Fist ultimate high jump:0 crouch,1 compress,2 launch,3 rise,4 higher (character appears slightly smaller because high up);5-7 apex with huge expanding bear gloves raised overhead;8-10 dive down;11 tremendous two-glove ground slam, low broad squash;12-15 gradually stand up in original guard. Large gloves remain below8%cellgutter, no clipped parts. NO crater/ground/dust/shadow baked in. Jump poses clearly airborne, normal character size returns at landing.

### vfx_titan_landing_crack

Use case: stylized-concept. Production VFX sprite sheet for cute pastel confection fantasy game. Exactly8 frames in4 columns x2 rows,1024x512, eachcell256 square; uniform8% transparent safety margin. True transparent alpha, no background. 3/4 top-down flattened floor star-shaped CHOCOLATE ROCK CRACK and debris burst after heavy fist landing. Frame0 tiny central fissure;1-3 branching radial cracks spread;4-5 chocolate stone chips fly outward and settle;6-7 cracks and chips fade. Dark brown/gold edges, chunky readable cartoon forms, no character, no face, no fist, no ground shadow, no letters, no grid lines. Crack remains centred identical origin perframe, no adjacent-frame overlap.

### vfx_titan_shockwave

Initial generation:

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. Atlas 4 columns by 2 rows, 8 frames, intended 1024x512px. Orange-gold impact shockwave. Eight chronological frames: small hot elliptical floor ring, rapidly expand to broad ring, sparks separate and fade. Pure black #000 background; only emissive effect.

Layout repair:

Edit this atlas ONLY to repair frame layout and completeness. Keep the style, palette, subjects, exact chronological order and 4 columns by 2 rows. Repaint EACH frame smaller with generous BLACK GUTTERS: all art must fit in the middle 65% of each equal cell. Reconstruct clipped top of giant bear glove and all clipped ring edges where necessary. NO sprite touches frame edge or neighbouring sprite. No grid lines/text. Pure black #000 background. Orange-gold impact shockwave. Eight chronological frames: small hot elliptical floor ring, rapidly expand to broad ring, sparks separate and fade. Pure black #000 background; only emissive effect.

### vfx_titan_rage_aura_lv1

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. Atlas 4 columns by 2 rows, 8 frames, intended 1024x512px. Blood Rage level 1 orange fire aura surrounding an EMPTY character space. Eight seamless cyclic flickering frames, low orange wisps rising from a narrow elliptical base, restrained intensity. Pure black #000 background, no character.

### vfx_titan_rage_aura_lv2

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. Atlas 4 columns by 2 rows, 8 frames, intended 1024x512px. Blood Rage level 2 red-orange fire aura surrounding an EMPTY character space. Eight seamless cyclic frames, medium height denser red-orange wisps rising from elliptical base, visibly stronger than level 1. Pure black #000 background, no character.

### vfx_titan_rage_aura_lv3

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. Atlas 4 columns by 2 rows, 8 frames; intended 1024 by 512px. Blood Rage level 3 intense DEEP RED fire aura around EMPTY character space, frequent bright golden sparks, strongest tier. Eight seamless cyclic frames with stable elliptical base, no expansion progression. Pure black #000 background, no character. Keep upper flame tips clear of frame edges.

### vfx_titan_crush_burst

Initial generation:

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. Atlas 4 columns by 3 rows, 12 frames; intended 1024 by 768px. Colossus Fist level 3 burst. Exactly twelve frames: 0-2 red-gold pillar charges; 3-5 a giant luminous translucent teddy-bear gauntlet descends; 6 huge impact with wide orange gold ground ring; 7-9 ring expands and column collapses;10-11 fading sparks. No girl, isolated spectral bear fist only. Pure black #000 background.

Layout repair:

Edit this atlas ONLY to repair frame layout and completeness. Keep the style, palette, subjects, exact chronological order and 4 columns by 3 rows. Repaint EACH frame smaller with generous BLACK GUTTERS: all art must fit in the middle 65% of each equal cell. Reconstruct clipped top of giant bear glove and all clipped ring edges where necessary. NO sprite touches frame edge or neighbouring sprite. No grid lines/text. Pure black #000 background. Colossus Fist level 3 burst. Exactly twelve frames: 0-2 red-gold pillar charges; 3-5 a giant luminous translucent teddy-bear gauntlet descends; 6 huge impact with wide orange gold ground ring; 7-9 ring expands and column collapses;10-11 fading sparks. No girl, isolated spectral bear fist only. Pure black #000 background.

### vfx_titan_lava_crater

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. Atlas 4 columns by 1 rows, 4 frames; intended 1024 by 256px. Four-frame seamless looping chocolate lava crater on the floor. Flattened elliptical brown chunky chocolate rim, molten orange-red chocolate center bubbles gently flickering, stable silhouette and size in all four frames. True transparent RGBA background. No surrounding floor, no shadow, no rising pillar.

### cocoa_fire_jab_sheet

Initial generation:

Production sprite atlas for Mochi Mayhem, 3/4 top-down screen-right chibi chocolate bear-glove girl. The input sheets are identity/style references: match face, chestnut side ponytail, cream candy hair ornament, confection brown armour, oversized teddy bear gauntlets, amber eyes, soft dark brown outline and candy highlights. Draw new poses. True RGBA transparency, no shadow, no letters, no grid lines, no watermark. Equal cells, left-to-right then top-to-bottom. All sprites fully inside cells, 8% safe margins. Fixed camera, identical head/body scale across frames; normal feet anchor at 92% cell height, x50%; jump offsets deliberate, never auto-centre each pose.  EXACT 4 columns × 2 rows, 8 frames in chronological row-major order. VERY generous separation: each sprite contained in central 65% of its cell, no touching neighbouring cells. Eight frames: right jab anticipation, extension, firing follow-through, retract (0-3), left jab same rhythm (4-7). Fiery teddy bear gloves, shoulder rotation, facing RIGHT, planted feet. No projectile detached from character.

Layout repair:

Preserve first row. Redraw ALL FOUR bottom row poses facing screen-RIGHT like top row. Left-arm jab means using opposite arm while still striking RIGHT; NEVER mirror the girl's whole body to face left. Retain identity/costume/chocolate bear gloves, flames, 4x2 eight-frame grid, transparent background. All figures fully contained with20% gutter.

### cocoa_fire_finisher_sheet

Production sprite atlas for Mochi Mayhem, 3/4 top-down screen-right chibi chocolate bear-glove girl. The input sheets are identity/style references: match face, chestnut side ponytail, cream candy hair ornament, confection brown armour, oversized teddy bear gauntlets, amber eyes, soft dark brown outline and candy highlights. Draw new poses. True RGBA transparency, no shadow, no letters, no grid lines, no watermark. Equal cells, left-to-right then top-to-bottom. All sprites fully inside cells, 8% safe margins. Fixed camera, identical head/body scale across frames; normal feet anchor at 92% cell height, x50%; jump offsets deliberate, never auto-centre each pose.  EXACT 4 columns × 2 rows, 8 frames in chronological row-major order. VERY generous separation: each sprite contained in central 65% of its cell, no touching neighbouring cells. Eight frames: heavy fifth-punch finisher. 0-2 draw gauntlet back, 3 flame swells, 4-5 extend heavy punch toward RIGHT leaning forward, 6 recoil, 7 recover. Same girl and bear gloves. No floor FX.

### cocoa_rocket_launch_sheet

Production sprite atlas for Mochi Mayhem, 3/4 top-down screen-right chibi chocolate bear-glove girl. The input sheets are identity/style references: match face, chestnut side ponytail, cream candy hair ornament, confection brown armour, oversized teddy bear gauntlets, amber eyes, soft dark brown outline and candy highlights. Draw new poses. True RGBA transparency, no shadow, no letters, no grid lines, no watermark. Equal cells, left-to-right then top-to-bottom. All sprites fully inside cells, 8% safe margins. Fixed camera, identical head/body scale across frames; normal feet anchor at 92% cell height, x50%; jump offsets deliberate, never auto-centre each pose.  EXACT 4 columns × 2 rows, 8 frames in chronological row-major order. VERY generous separation: each sprite contained in central 65% of its cell, no touching neighbouring cells. Eight frames: Unique Rocket Gauntlet. Raise right arm aiming upward 0-2, gauntlet flies off hand 3-4, bare hand with small sparks 5, glove regrows 6-7. Girl remains grounded, facing right, no shadow.

### vfx_fire_fist_proj

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 1 rows, 4 frames in chronological row-major order. VERY generous separation: each sprite contained in central 65% of its cell, no touching neighbouring cells. Four seamless looping small teddy-bear gauntlet fire projectile frames heading RIGHT, orange fiery bear glove with flame tail trailing LEFT, pure BLACK.

### vfx_fireball_big

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 1 rows, 4 frames chronological. Keep art within central 65% of each cell, completely separate sprites. Four seamless looping large finisher fireball frames heading RIGHT, yellow-white hot core, orange outer flames, long leftward tail, twice the small projectile size, pure BLACK.

### vfx_fireball_explode

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 2 rows, 8 frames chronological. Keep art within central 65% of each cell, completely separate sprites. Eight chronological fire explosion frames with faint teddy bear head silhouette in central fire, expanding orange flame ring, chocolate-brown smoke then fading embers. Pure BLACK.

### vfx_rocket_gauntlet

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 1 rows, 4 frames chronological. Keep art within central 65% of each cell, completely separate sprites. Four seamless looping rocket teddy bear glove projectile frames moving RIGHT, jet flames trailing LEFT. Cute chocolate glove bear face, luminous orange fire exhaust. Pure BLACK.

### vfx_gauntlet_stick

Initial generation:

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 2 rows, 8 frames chronological. Keep art within central 65% of each cell, completely separate sprites. Eight frames: teddy bear gauntlet stuck stationary on unseen target, pulsates increasingly red 0-2 then small explosion3-4, settles5-7. No enemy or girl. Same gauntlet origin. Pure BLACK.

Layout repair:

Edit the FIRST image (8-frame4x2 stick/explosion atlas). SECOND image is identity reference for the actual Chocolate rocket glove. Replace the pink strawberry bear glove in ALL8 frames with the CHOCOLATE-BROWN teddy bear gauntlet from image2, cream cuff, warm orange fire motif. Remove pink hearts and ribbons. Red warning pulsation0-2; small orange-gold explosion3-4; settle5-7. Keep a stable glove shape and origin across frames. Pure black background, generous15% gutters, no character or text. Preserve8 chronological frames4columns2rows.

### vfx_fire_pool

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 1 rows, 4 frames chronological. Keep art within central 65% of each cell, completely separate sprites. Four seamless looping chocolate fire pool frames, flattened elliptical floor lava with small orange flames, no floor background, true transparency.

### vfx_fire_meteor

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 2 rows, 8 frames chronological. Keep art within central 65% of each cell, completely separate sprites. Eight frames: flaming chocolate meteor falls from upper left toward center floor0-3, impacts4, expanding fiery floor ring5-6, fades7. Pure BLACK.

### cocoa_dash_leap_sheet

Initial generation:

Production sprite atlas for Mochi Mayhem, 3/4 top-down screen-right chibi chocolate bear-glove girl. The input sheets are identity/style references: match face, chestnut side ponytail, cream candy hair ornament, confection brown armour, oversized teddy bear gauntlets, amber eyes, soft dark brown outline and candy highlights. Draw new poses. True RGBA transparency, no shadow, no letters, no grid lines, no watermark. Equal cells, left-to-right then top-to-bottom. All sprites fully inside cells, 8% safe margins. Fixed camera, identical head/body scale across frames; normal feet anchor at 92% cell height, x50%; jump offsets deliberate, never auto-centre each pose.  EXACT 4 columns × 2 rows, 8 frames. Every frame faces RIGHT, never mirrored left even alternating arms. At least20% empty gutter around each sprite. Eight frames: squat0, leap diagonally RIGHT body tilted45 degrees with leading bear fist1-4, plunge5, floor slam6, rise7. Purple motion accents no fire. Fixed ground anchor; deliberate airborne height. No shadow.

Layout repair:

Repair layout: exactly8 poses in4x2 grid, make every pose and purple trail at most60% cell width and65%height, generous empty transparent gutters. No adjacent effects overlap. Preserve girl identity and same leap-plunge-slam order. ALL face RIGHT. Reduce purple effect size; no ground explosion attached to character, floor VFX separate. Reconstruct clipped trail on rightmost top pose. No shadows.

### cocoa_dash_jab_sheet

Production sprite atlas for Mochi Mayhem, 3/4 top-down screen-right chibi chocolate bear-glove girl. The input sheets are identity/style references: match face, chestnut side ponytail, cream candy hair ornament, confection brown armour, oversized teddy bear gauntlets, amber eyes, soft dark brown outline and candy highlights. Draw new poses. True RGBA transparency, no shadow, no letters, no grid lines, no watermark. Equal cells, left-to-right then top-to-bottom. All sprites fully inside cells, 8% safe margins. Fixed camera, identical head/body scale across frames; normal feet anchor at 92% cell height, x50%; jump offsets deliberate, never auto-centre each pose.  EXACT 4 columns × 2 rows, 8 frames. Every frame faces RIGHT, never mirrored left even alternating arms. At least20% empty gutter around each sprite. Eight cyclic fast light boxing jab footwork frames, springy steps, alternating fists toward RIGHT, subtle purple magical accents, NO fire. Same bear gauntlets and girl. No shadow.

### cocoa_phantom_rush_sheet

Production sprite atlas for Mochi Mayhem, 3/4 top-down screen-right chibi chocolate bear-glove girl. The input sheets are identity/style references: match face, chestnut side ponytail, cream candy hair ornament, confection brown armour, oversized teddy bear gauntlets, amber eyes, soft dark brown outline and candy highlights. Draw new poses. True RGBA transparency, no shadow, no letters, no grid lines, no watermark. Equal cells, left-to-right then top-to-bottom. All sprites fully inside cells, 8% safe margins. Fixed camera, identical head/body scale across frames; normal feet anchor at 92% cell height, x50%; jump offsets deliberate, never auto-centre each pose.  EXACT 4 columns × 2 rows, 8 frames. Every frame faces RIGHT, never mirrored left even alternating arms. At least20% empty gutter around each sprite. Eight successive purple translucent phantom leap-slam poses facing RIGHT. Exactly one primary girl plus TWO faint purple afterimages closely behind her WITHIN each cell. Body leaning45degrees, fist leading, ending slam. No fire, no shadow.

### vfx_dash_afterimage

Production sprite atlas for Mochi Mayhem, 3/4 top-down screen-right chibi chocolate bear-glove girl. The input sheets are identity/style references: match face, chestnut side ponytail, cream candy hair ornament, confection brown armour, oversized teddy bear gauntlets, amber eyes, soft dark brown outline and candy highlights. Draw new poses. True RGBA transparency, no shadow, no letters, no grid lines, no watermark. Equal cells, left-to-right then top-to-bottom. All sprites fully inside cells, 8% safe margins. Fixed camera, identical head/body scale across frames; normal feet anchor at 92% cell height, x50%; jump offsets deliberate, never auto-centre each pose.  EXACT 1 columns × 1 rows, 1 frames. Every frame faces RIGHT, never mirrored left even alternating arms. At least20% empty gutter around each sprite. Single translucent PURPLE silhouette of the reference chocolate girl leaping toward RIGHT, leading huge teddy-bear gauntlet, soft fading edges, no full-color opaque girl, transparent trail overlay.

### vfx_dash_slam_ring

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 2 rows, 8 frames. Keep all subjects in central65% of each cell, no clipped edges. Every character faces RIGHT, never mirroring. Eight chronological small pale purple floor impact dust ring and star crack frames, expands then fades. Pure BLACK, no girl.

### vfx_shadow_fist

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 1 rows, 4 frames. Keep all subjects in central65% of each cell, no clipped edges. Every character faces RIGHT, never mirroring. Four seamless looping purple shadow teddy bear fist projectile frames moving RIGHT, long violet translucent tail trailing LEFT. Pure BLACK.

### vfx_chain_leap_line

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 1 rows, 4 frames. Keep all subjects in central65% of each cell, no clipped edges. Every character faces RIGHT, never mirroring. Four frames of short purple diagonal magical streak connecting two unseen targets, brighten extend then dissipate, no targets/characters visible, Pure BLACK.

### cocoa_hurt_sheet

Production sprite atlas for Mochi Mayhem, 3/4 top-down screen-right chibi chocolate bear-glove girl. The input sheets are identity/style references: match face, chestnut side ponytail, cream candy hair ornament, confection brown armour, oversized teddy bear gauntlets, amber eyes, soft dark brown outline and candy highlights. Draw new poses. True RGBA transparency, no shadow, no letters, no grid lines, no watermark. Equal cells, left-to-right then top-to-bottom. All sprites fully inside cells, 8% safe margins. Fixed camera, identical head/body scale across frames; normal feet anchor at 92% cell height, x50%; jump offsets deliberate, never auto-centre each pose.  EXACT 4 columns × 1 rows, 4 frames. Keep all subjects in central65% of each cell, no clipped edges. Every character faces RIGHT, never mirroring. Four grounded flinch frames: startled reaction, recoil, teddy-bear gloves raised to guard face, recover. Girl faces RIGHT, no damage text or shadow.

### cocoa_victory_sheet

Production sprite atlas for Mochi Mayhem, 3/4 top-down screen-right chibi chocolate bear-glove girl. The input sheets are identity/style references: match face, chestnut side ponytail, cream candy hair ornament, confection brown armour, oversized teddy bear gauntlets, amber eyes, soft dark brown outline and candy highlights. Draw new poses. True RGBA transparency, no shadow, no letters, no grid lines, no watermark. Equal cells, left-to-right then top-to-bottom. All sprites fully inside cells, 8% safe margins. Fixed camera, identical head/body scale across frames; normal feet anchor at 92% cell height, x50%; jump offsets deliberate, never auto-centre each pose.  EXACT 4 columns × 2 rows, 8 frames. Keep all subjects in central65% of each cell, no clipped edges. Every character faces RIGHT, never mirroring. Eight victory celebration frames: relaxed guard, excited smile, raises both bear fists, cheerful small bounce, fists high triumphant, settle. Facing RIGHT. No confetti or shadow.

### vfx_barrage_volley

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 2 rows, 8 frames. All effects completely inside their cell with20% empty margin; no clipped weapons or sprites. Eight chronological frames of THREE mint-cyan ice lances firing simultaneously toward RIGHT as a narrow FAN, snowy sparkles, icy candy crystal tips, then dissipate. Pure BLACK.

### vfx_hailstorm

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 2 rows, 8 frames. All effects completely inside their cell with20% empty margin; no clipped weapons or sprites. Eight frames: multiple icy mint-cyan crystal lances rain diagonally downward onto a floor area, snowflakes and small ice splashes, build then fade. Pure BLACK.

### vfx_impaler_charge

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 2 rows, 8 frames. All effects completely inside their cell with20% empty margin; no clipped weapons or sprites. Eight looping charge glow frames, mint-cyan crystal light gathers around an EMPTY lance-tip origin, icy star facets gather and pulse, stable small center. No whole weapon or character. Pure BLACK.

### vfx_impale_stack_1

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 1 columns × 1 rows, 1 frames. All effects completely inside their cell with20% empty margin; no clipped weapons or sprites. Exactly ONE mint-cyan jagged ice crystal impalement marker, diagonal crystal shard with faint frost at base, overlay for unseen enemy. NO enemy, no text. Single frame128x128px transparent.

### vfx_impale_stack_2

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 1 columns × 1 rows, 1 frames. All effects completely inside their cell with20% empty margin; no clipped weapons or sprites. Exactly TWO mint-cyan jagged ice crystals impalement marker forming short fan, consistent crystal styling, faint frost at shared base, overlay for unseen enemy. NO enemy/text. Single frame128x128px transparent.

### vfx_impale_stack_3

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 1 columns × 1 rows, 1 frames. All effects completely inside their cell with20% empty margin; no clipped weapons or sprites. Exactly THREE mint-cyan jagged ice crystals impalement marker forming fan, consistent crystal styling, faint frost at shared base, overlay for unseen enemy. NO enemy/text. Single frame128x128px transparent.

### vfx_crystal_rupture

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 2 rows, 8 frames. All effects completely inside their cell with20% empty margin; no clipped weapons or sprites. Eight chronological frames: central mint-cyan crystal cluster builds pressure, explodes radial shards, icy snow spray expands then fades. No enemy. Pure BLACK.

### mint_lance_throw_charged_sheet

Initial generation:

Use case: stylized-concept. Character animation atlas. Use input image only as identity reference: exact chibi mint-haired ice lance girl, mint ponytail curls, pale icy blue confection dress/armour, icy head ornament and icy lance. Cute pastel confectionery fantasy, soft outlines and candy highlights, 3/4 top-down facing RIGHT throughout. Transparent no shadow. EXACT 4 columns × 2 rows, 8 frames. All effects completely inside their cell with20% empty margin; no clipped weapons or sprites. Reference mint-haired girl with ice lance. Eight frames: slowly wind back and charge lance0-3 with mint crystal glow at spear tip, powerful throw toward RIGHT4-5, follow-through6, recover7. Same identity/costume as mint references, grounded y235, no shadow.

Layout repair:

Intermediate repair:

Repair this8-frame4x2 atlas. Repaint each girl+weapon pose SMALLER inside central60% cell width/height. Bottom row poses MUST NOT touch/overlap adjacent poses; especially the thrown lance in bottom row second cell. Preserve exact mint girl identity and pose sequence charging0-3 then strong throw4-7 toward RIGHT, transparent background, no shadow. Every lance and glow complete and contained.

Final repair:

Edit ONLY frame5 (bottom row, SECOND column) of this4x2 eight-frame atlas. REMOVE the detached airborne spear and its entire long cyan trail to the RIGHT of her outstretched fingers. Keep only the girl throwing with empty outstretched hand and a SMALL cyan sparkle near fingers. This frame must be no wider than the girl in adjacent frame6; no effect crosses into frame6. Retain every other frame unchanged, transparency, exact mint girl identity, facing right. No grid or shadow.

### vfx_sniper_impact

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 1 rows, 4 frames. Each effect must fit central65% of equal cell. Four frames heavy heart seed sniper impact, concentrated bright rose-pink heart core then sharp star sparks expand and fade. Pure BLACK.

### vfx_pellet_hit

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 1 rows, 4 frames. Each effect must fit central65% of equal cell. Four frames very SMALL lightweight berry-pink pellet impact, tiny spark puff, only a few sparkles, intended frequent cheap hits, minimal density. Pure BLACK.

### vfx_ricochet_bounce

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 1 rows, 4 frames. Each effect must fit central65% of equal cell. Four frames pink heart-shaped seed ricochet flash, compact heart sparkle with bent bounce arc, fade. Pure BLACK.

### vfx_ricochet_link

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 1 rows, 4 frames. Each effect must fit central65% of equal cell. Four looping pink magic ribbon connecting two unseen ricochet targets, thin softly glowing ribbon horizontally across cell, gentle wave and heart particles, endpoints stable. Pure BLACK.

### vfx_heart_pinball_splash

Use case: stylized-concept. Production animation sprite atlas for a cute pastel confectionery fantasy mobile game. Glossy candy highlights, softly outlined chunky readable magical effects, 3/4 top-down view. Exactly equal cells in row-major chronological order, no text, watermark, borders or grid lines. Each frame completely contained in its own cell with at least 8% empty margin; identical fixed camera and effect origin. Not a scene, no character or scenery. EXACT 4 columns × 2 rows, 8 frames. Each effect must fit central65% of equal cell. Eight frames final pinball heart burst: tiny pink heart grows, bursts into many bright candy heart sparkles, radial petals expand then fade. Pure BLACK.
