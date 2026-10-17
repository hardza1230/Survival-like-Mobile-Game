# Temple Weave UI — source delivery 21

34 PNG32 sources / 64 cells, made with built-in imagegen against the two saved reference mockups. These are separate text-free components; live text, currency, level, status and existing gameplay icons remain the code's responsibility.

## Contents

- `MANIFEST.json`: exact dimensions and cell layout, state names, transparency, SHA-256 and `nineSlice` margins in source pixels `[left, top, right, bottom]`.
- `PROMPTS.json`: selected prompt per asset and original generated dimensions.
- `QA_REPORT.json`: actual byte lengths, SHA-256, Git blob SHA, per-cell alpha, complete PNG CRC/IEND/zlib/decode checks, background readability measurements and proof links.
- `qa/all_states_*.jpg`: every source state/frame on a contrasting background for review. Labels exist only in these QA proofs, never in source PNGs.
- `qa/*_nine_slice.jpg`: native-size 0.6x/2.2x horizontal stretch proof for every state of all 20 stretchable sources; each corner is checked pixel-for-pixel.
- `qa/A1_landscape.jpg`, `qa/B1_landscape.jpg`: center 16:9 crops of the opaque portrait backgrounds.

## Technical notes

The two backgrounds are opaque 1080×1920. Thirty-one UI assets have real alpha with transparent corners. The six-frame sparkle sheet intentionally has opaque RGB0 background for game-side brightness-to-alpha packing.

Generated cells were separated at transparent gaps and normalized to the requested dimensions with transparent padding inside each cell. Card/button interiors were made consistently opaque; outer alpha and antialiasing are preserved and external low-alpha haze is bounded to 12 source pixels. Glow A3 retains translucent native alpha. Native source generation may differ in canvas dimensions; the delivered files and manifest use the exact art-order dimensions.

Use manifest margins per frame, not for the entire sheet. All stated tests keep height unchanged while resizing width. Keep decorated endcaps at their native size and stretch only the middle; ordinary scaleX is not the tested operation. Some endcaps are deliberately large to preserve the icon medallions and divider. Fit text and separately overlaid icons to the final bounds at narrow sizes.

## Integration handoff

Pack into `assets/art/temple_ui/`, register image/cell frames and apply Phaser nine-slice using the manifest's source margins in Phaser argument order. A3's three cells are independent core glows, not an animation. A6/A9/A12/A13/B4/B6/B12/B15/C1 are state sheets, not looping animations. Only C4 is the six-frame sparkle animation.

Keep the current code graphics as load fallbacks. Existing core/perk/tab/currency icons are reused. Currency and perk descriptions must follow runtime values, not text in the mockups. This delivery does not change gameplay, runtime UI registration or the game version. Mobile layout, touch sizing, rendering memory and FPS need review after integration.
