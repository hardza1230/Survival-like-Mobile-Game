# R2 — Pinnacle: The Hunger Beneath

## Delivery
- File: `boss_pinnacle.png`; PNG RGBA, 1280 × 640.
- Grid: 4 columns × 2 rows; 320 × 320 cells; no gutters.
- Key: `boss_pinnacle`.
- Same purple-gold candy maw, root mound, multiple eyes and cutlery fangs throughout.
- 1-based row/column coordinates; 0-based indices.

| Row | Column | Index | Action |
|---|---|---|---|
| 1 | 1 | 0 | idle |
| 1 | 2 | 1 | breath |
| 1 | 3 | 2 | wind-up |
| 1 | 4 | 3 | bite/slam |
| 2 | 1 | 4 | summon |
| 2 | 2 | 5 | hurt |
| 2 | 3 | 6 | enrage |
| 2 | 4 | 7 | defeat |

## Technical export and QA
- One built-in image generation, native 1774 × 887.
- ImageMagick export packs the eight poses into exact equal cells with true alpha.
- One uniform scale across all eight poses; approximate floor anchor x=160, y=293. Action silhouette height changes intentionally.
- All rendered bounds below 80% width/height of cell, including summon wisps and enrage aura.
- No ground shadow; no text, labels or grid.
- `_preview.png` is review-only, flattened on a dark backing.
- PNG decode, exact dimensions, alpha and all eight populated cells verified; sheet visually reviewed.
- These are eight action poses as ordered, not eight frames of one looping motion. Timing, transitions, scale/hitbox and phone-size readability remain for integration review.

## Integration handoff
- Preserve action-to-index mapping.
- Register the dedicated `boss_pinnacle` key; use in Pinnacle runs and remove the old tint when appropriate.
- Do not alter story-mode bosses as part of this delivery.
- No gameplay files changed.

## English production prompt
> Use case: stylized-concept. ONE production action sprite sheet for Mochi Mayhem's ultimate endgame boss PINNACLE, The Hunger Beneath. Requested 1280x640, landscape aspect ratio 2:1, invisible equal 4 columns x2 rows, exactly EIGHT frames each320x320. Same giant boss identity in all frames: enormous primordial candy-maw emerging from a compact dark-purple root-and-sugary-cake mound, ornate curved spoon and fork fangs like silver/gold cutlery, multiple glowing purple-gold eyes, gold root tendrils, impressive purple-gold crown-like rim. Palette dark plum #2a1040 purple #6b2fa0 warm gold #ffd166. Looks most powerful boss in cute 2.5D confectionery fantasy, ominous and imposing but playful candy stylization, NO human gore. Soft dark outline glossy candy highlights, clear mobile silhouette upper-left lighting, 3/4 top-down facing viewer slightly right. All sprites same footprint and approximate core body scale, centered per cell with anchor at x50% y86%; silhouette stays inside central78% cell area even attack. Actions left-to-right top-to-bottom: frame0 IDLE composed closed resting maw; frame1 BREATH slightly expanded upper body subtle purple mouth glow; frame2 WIND-UP raised fanged jaw contracted preparing slam; frame3 BITE/SLAM maw snaps open downward dynamic cutlery teeth and compact impact sparks within cell; frame4 SUMMON maw opens with three small floating golden seed wisps tightly above rim; frame5 HURT boss flinches eyes squeezed cracked glow; frame6 ENRAGE intensified purple-gold eyes, lifted fangs and compact aura; frame7 DEFEAT collapsed flattened maw eyes dark gold root tendrils droop. Each cell ONE same monster at same scale and anchor; no detached large effects crossing cells. GENUINE TRANSPARENT BACKGROUND all sheet; no ground shadows, no scene background, no labels, no borders, no grid, no text watermark. Whole unsliced sheet, eight distinct poses.

