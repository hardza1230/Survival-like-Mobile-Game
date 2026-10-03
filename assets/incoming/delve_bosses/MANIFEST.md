# Delve-only bosses — floors 10 and 20

Source order: `docs/art_orders/13_DELVE_BOSSES.md`, plus `00_STYLE_GUIDE.md` and `NEXT_BATCH_REQUEST.md §0`, read from source commit `e67cf6a4dcd6e348973ada4a8f3de2037ad3cc01`.

Exactly **three built-in image generations**: one sheet per boss and one shared props sheet. No full-sheet regeneration, no extra individual asset generation.

## Files
| File | Key | Size | Grid / cell | Background |
|---|---|---|---|---|
| `boss_delve10_sheet.png` | `boss_delve10` | 1280 × 640 | 4 × 2 / 320 × 320 | True alpha |
| `boss_delve20_sheet.png` | `boss_delve20` | 1280 × 640 | 4 × 2 / 320 × 320 | True alpha |
| `delve_boss_props_sheet.png` | Props below | 1024 × 512 | 4 × 2 / 256 × 256 | True alpha |

All PNG files are 8-bit-per-channel RGBA (32-bit PNG). Whole sheets are delivered; no separately cut frames.

## Boss frame mapping
Row and column coordinates below are **0-based**, matching art order 13. Frame index reads left to right, top to bottom.

| Row | Column | Index | Jelly Warden — `boss_delve10` | Madame Candlewick — `boss_delve20` |
|---|---|---|---|---|
| 0 | 0 | 0 | idle | idle |
| 0 | 1 | 1 | breath / slight compression | three head flames sway |
| 0 | 2 | 2 | crouch / jump wind-up | raise ladle |
| 0 | 3 | 3 | airborne pose | splash hot wax |
| 1 | 0 | 4 | slam / flattened jelly and small splashes | point to light candles |
| 1 | 1 | 5 | hurt / flinch | hurt / flinch |
| 1 | 2 | 6 | enrage / red tint and cracks | blow lights out / puffed cheeks, dark wicks and smoke |
| 1 | 3 | 7 | defeat / jelly chunks, spilled candies, key and cap | defeat / collapsed wax puddle and ladle |

The Jelly Warden has translucent mint gelatin, visible pink swallowed candy, gold candy keyring inside its body, and a dark-plum warden cap. Madame Candlewick has a cream wax-chef body, purple shadows, three birthday-candle wicks/flames, and a ladle of hot wax.

## Props mapping
| Row | Column | Index | Key | Description |
|---|---|---|---|---|
| 0 | 0 | 0 | `delve10_minijelly` | Mini Jelly Warden, matching face/material/cap |
| 0 | 1 | 1 | `delve10_puddle` | Top-down mint jelly puddle |
| 0 | 2 | 2 | `delve10_keyring` | Gold ring with three candy-shaped keys |
| 0 | 3 | 3 | `delve10_cage` | Mint gelatin cage, transparent openings, candy padlock |
| 1 | 0 | 4 | `delve20_candle_lit` | Tall cream wax candle, lit |
| 1 | 1 | 5 | `delve20_candle_out` | Matching candle, extinguished, smoke |
| 1 | 2 | 6 | `delve20_wax_pool` | Top-down hot wax pool |
| 1 | 3 | 7 | `delve20_flame_ring` | Top-down circular fire ring, transparent center |

## Export and alignment
- Native generated canvases were 1774 × 887. Production exports were repacked into exact equal square cells, without visible dividers.
- Upper-left lighting and glossy chibi 2.5D confectionery rendering reference existing Chapter 3 and Pinnacle art. Props reference the two newly generated bosses directly.
- **One uniform export factor for all eight poses of each boss:** Warden 0.4844621514; Candlewick 0.4571428571. Frames were not independently resized.
- A shared local body reference at x=160 and a virtual ground/bottom anchor near y=294 are used for each 320px cell. Visible alpha >8 bottom is y=293 for grounded frames (Warden defeat y=292).
- Warden crouch, slam and defeat intentionally deform the body. Candlewick defeat intentionally collapses vertically. This changes silhouette bounds, not the export scale.
- The airborne Warden retains the common virtual ground reference. Apply actual jump displacement in code rather than changing sprite origin for this frame.
- Lit/unlit prop candles share one export scale and the same bottom baseline (visible alpha >8 bottom y=229), with matched wax bodies.
- The generated Candlewick poses had overlapping bounding rectangles. Connected alpha selection separated each existing pose before packing, preventing adjacent-pose bleed; no new art was drawn.
- No shadows are baked under bosses; leave ground shadows to the game.

## Verified
- All three final PNGs fully decoded successfully.
- Exact canvas dimensions, RGBA mode and genuine transparent background verified.
- Each sheet has eight populated cells, in the order above.
- Visible bounds fit below 80% of cell width and height; transparent margins prevent cross-cell bleed.
- Boss ground lines and candle-pair baselines checked numerically.
- Flame-ring center alpha is 0. Cage openings remain transparent.
- Final sheets visually reviewed for matching identities, pose meaning, lighting and no text/grid.
- In-game animation transitions, timing, boss scale/hitboxes and phone-size readability still require integrating-AI review; these are eight ordered action poses, not a full multi-frame animation for every action.

## Integration handoff
- Art only. No gameplay, story bosses, asset registry or code files changed.
- Floor 10 boss is endgame-only: jump/slam leaves a slowing jelly puddle; the intended 50%-HP mechanic spawns three mini jellies.
- Floor 20 boss is endgame-only: light arena candles, emit fire rings, allow candles to be extinguished; the intended 40%-HP phase blows arena lights out.
- Implement mechanics on the code side using the keys above.
- Preserve frame mapping, 320px boss frames and 256px prop cells. Cut/convert/register as needed.

## English production prompts
### Generation 1 — Warden
> Use case: stylized-concept. Production game sprite atlas for Mochi Mayhem. EXACTLY ONE transparent landscape sheet, requested1280x640, invisible equal4 columns x2 rows, cell320x320, eight actions row-major. Input images are STYLE references ONLY for existing Chapter3/Pinnacle boss rendering: borrow glossy 2.5D confectionery materials, chibi mass, rich soft dark outline and upper-left lighting, DO NOT borrow their monster anatomy, roots, mouths or purple-gold palette. NEW character THE JELLY WARDEN: huge fat round translucent mint-green gelatin creature #7fe0c0, humorous stern cute face with two dark eyes and grumpy brow, pink swallowed candy pieces #ff9bd0 suspended inside its transparent body, clearly visible golden candy keyring #ffd166 INSIDE belly, wearing a compact dark-plum prison-warden peaked CAP with gold badge (not crown). Stubby little gelatin feet, consistent features and internal candy count throughout. Rounded glossy hand-painted chibi 2.5D, 3/4 top-down facing camera slightly RIGHT; menacing weight but cute, no gore. Match same identity, core body mass, cap, face and scale across all eight poses. ALL cells same virtual ground anchor x160 y294; feet/bottom grounded poses aligned y294. Airborne pose also same bottom anchor: physically rounded airborne shape with dangling feet; actual vertical jump displacement will be applied by game, DO NOT move sprite across cell. Death fragments remain centered on same anchor. Keep generous transparent margin, all art including splashes occupies at most78% of each cell width AND height, center horizontally, NEVER touch/cross cells. Anatomy must not shrink to fit action: design ALL poses to fit same body scale. Top row: frame0 idle rounded standing; frame1 breath slight jelly contraction, face and hat steady; frame2 crouch compress vertically and slightly widen before jump; frame3 airborne rounded stretched spring shape, dangling tiny feet and hat lifted a little, no floor. Bottom row: frame4 ground slam flattened wide jelly with SMALL mint splash droplets contained in cell; frame5 hurt recoil dent in jelly body, squint one eye, hat tilts; frame6 enraged slight coral-red tint mixed into mint body and visible fine cracks, same hat and keyring; frame7 defeat shatters into mint jelly chunks with pink candy and golden keyring spilling out, cap falling, face gone. NO ground shadows, NO drop shadows, no gray/white/checkerboard background, no environment, no grid lines, no labels, no text numbers watermark. GENUINE alpha transparency across entire background; translucent jelly itself retains detailed visible color. Deliver whole unsliced sheet.

### Generation 2 — Candlewick
> Use case: stylized-concept. Production boss sprite atlas for Mochi Mayhem. ONE transparent landscape1280x640 sheet, invisible equal4 columns x2 rows, eight320x320 cells row-major. Existing Chapter3/Pinnacle images are STYLE references ONLY: same hand-painted glossy 2.5D confectionery fantasy with soft dark outlines, chibi silhouette and upper-left lighting; don't copy their identities. NEW boss MADAME CANDLEWICK: elegant but comically ominous chibi birthday-CANDLE CHEF, entire body formed of creamy melting wax #fff1d6, tallish chef silhouette but compact chibi proportions, scalloped chef coat/apron made of dripping wax, stubby wax shoes, expressive face with dark plum eyes and brows, EXACTLY THREE orange flames #ff8a3d growing from three short wicks atop crown of head instead of hair. NO big chef hat concealing flames. Holds ONE ornate dark-plum and brass LADLE containing hot cream/orange WAX; wax trails/drips integrate with ladle. Rich muted plum shadow #4a2a5a, orange flame highlights, warm cream. 3/4 top-down camera, same slight-right orientation in every pose. Consistent same body, face, apron, ladle, three wicks, color, core dimensions and render scale across frames. Every cell same virtual floor anchor x160 y294; feet/bottom aligned y294; no pose drifting left/right. All art stays inside central78% width/height, including flames and wax droplets; KEEP BODY SAME SCALE, not smaller in attack frames. Raised ladle should bend sideways above shoulder within allotted margin. Clear mobile silhouette. Top row frame0 IDLE calm standing ladle beside body, three flames; frame1 FLAME SWAY same stance body while three flames lean and ripple; frame2 RAISE LADLE raised above shoulder pre-attack, three flames; frame3 SPLASH WAX ladle tips toward right, short compact stream of wax and droplets to side contained within cell, same core body scale, three flames. Bottom row frame4 POINT TO LIGHT CANDLES points free hand outwards with tiny orange spark at finger tip, ladle retained, three flames; frame5 HURT recoils and squints, small wax crack, flame tilts, same ladle; frame6 BLOW LIGHTS OUT cheeks visibly PUFFED, pursed lips exhale a SMALL soft pale gust to right, her three hair flames visibly guttering/extinguishing (all three wicks remain), ladle retained; frame7 DEFEAT melted into LOW creamy wax puddle retaining collapsed face and ladle on same floor anchor, flames gone with three dark wicks faint smoke. No additional characters or props apart from own ladle/sparks. GENUINE transparent background, no ground shadows, no floor, no cast shadow, no background checkerboard, no grid lines borders numbers labels text watermark. Deliver whole unsliced eight-pose sheet.

### Generation 3 — props
> Use case: stylized-concept. Production hazard/prop sprite atlas for Mochi Mayhem endgame. ONE complete transparent landscape sheet requested1024x512, invisible equal4 columns x2 rows, eight256x256 cells. The two reference images show finished Jelly Warden and Madame Candlewick: use them as DESIGN/MATERIAL references only. Preserve matching mint gelatin, pink candy, gold keys, creamy dripping wax, orange fire, dark-plum outlines; same glossy hand-painted chibi2.5D confectionery style, lighting from upper-left. EXACTLY one separated prop centered per equal cell, whole object no crop, artwork no more than78% cell width AND height, consistent roomy transparent padding. Row1 col1 MINI JELLY: single small mint translucent round jelly child with same grumpy cute face as Jelly Warden, one pink candy visible inside, compact tiny warden cap matching reference, no additional grown boss; row1 col2 JELLY PUDDLE: one flat irregular glossy mint gelatin pool straight TOP-DOWN, soft round edges, no character face; row1 col3 CANDY KEYRING: one gold loop holding THREE clearly distinct small golden candy-shaped KEYS, same material/style as key inside Warden, readable reward icon; row1 col4 JELLY CAGE: one cage made of thick translucent mint gelatin vertical bars and rounded gelatin dome, empty dark transparent middle, tiny gold candy padlock, 3/4 top-down. Row2 col1 LIT CANDLE: one tall creamy melting birthday candle on compact wax base, one wick and bright orange flame, same wax/fire material as Madame; row2 col2 UNLIT CANDLE: EXACT same candle shape, height, base, wax drips and color as col1, same wick but NO flame, small soft gray-plum smoke wisp above wick; row2 col3 HOT WAX POOL: one flat irregular cream-gold glossy liquid wax puddle top-down, subtle orange heated center, no face or container; row2 col4 FLAME RING: one perfectly round THIN ring of orange fire straight TOP-DOWN, dynamic flames along circumference, a LARGE EMPTY FULLY TRANSPARENT CENTER, outer glow small and controlled. Keep same position and scale for lit/unlit candles: baseline82% cell, smoking wick must fit without shrinking candle. No ground shadows, no floors, no drop shadows. No backgrounds, labels, text, digits, grid lines, dividers, frames, watermark. GENUINE alpha transparency including cage openings and flame ring center. All8 cells populated, no extra props. Return whole unsliced sheet.

