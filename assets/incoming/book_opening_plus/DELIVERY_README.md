# Art order39 — Book opening plus

23 October2026. Delivered all9 requested PNG32 files /51 frames. The order summary said54, but its table sums to12+6+8+8+8+6+1+1+1 =51. A separate clean-cover helper is supplied to prevent a duplicate static gold emblem behind the animated emblem.

## What is delivered

- bk_open_long:1728×2304,4×3,432×768 perframe,12frames at100ms. Revised per owner choice: all12 opening poses are AI-painted, then extracted and registered to a common height and left hinge. First frame is a painted visual match, not pixel-identical to the old cover. Frame12 contains only a faint painted shadow.
- bk_clasp:1536×256,6frames. bk_emblem_spin and vfx_bk_magic:2048×256,8frames each. Clasp stays attached at the latch while its released strap falls; hide clasp overlay before cover rotates.
- bk_page_riffle:1728×1536,4×2,432×768,8frames; final frame is exactly transparent.
- vfx_bk_burst:3072×512,6frames. Bazaar, Upgrade and Mail icons:256×256 each.
- Black VFX are actual opaque black, intended for ADD or the existing brightness-alpha packing pipeline. Transparent sheets retain native generated alpha and use NORMAL blend. Avoid double alpha conversion.
- raw/ retains selected ImageGen sources, including opening_ai_v2.png. PROMPTS records the exact revised prompt and explicit owner choice. OPENING_SOURCE.json records extraction/registration. The geometric opening and its renderer are superseded and retained only in history/; do not run the historical renderer over the active sheet.

## Clean cover and emblem

The old gold emblem is baked into bk_cover_closed. Do not draw another complete gold emblem over it. Optional helper bk_cover_clean_plate.png removes the old emblem region while preserving original outer corners/spine/stitch pixels. HELPER_MANIFEST records size/placement. On a432×768 cover viewport, animated emblem center=(222,359), displayed size=(340,380). Scale these values with cover transform. The helper and animated emblem are shown in previews/cover_clean_emblem_comparison.png.

Before rotating, briefly crossfade the assembled static cover directly into the newly AI-painted bk_open_long frame0 (suggest150ms), then play frames0–11. Its design is a painted match, not exact original pixels. Previews are offline compositions against the retained order33 Lobby proof, not evidence of the latest deployed UI.

## Packing budget and loading

webp_candidates/ contains exact-size WebP candidates at q78: required9 total1,212,176bytes; including clean-cover helper1,285,026bytes (<1,500,000). Required sheet dimensions are unchanged. Candidate black VFX remain black and can use ADD; converting them to alpha requires rechecking packed size. PNG source sheets are authoring sources; never boot-load these. Load only with opening/menu groups and discard temporary overlay state after skip/finish/scene shutdown. Existing order28 fallback stays available.

Native PNG decode/chunk CRC/hash/bytes/dimensions, alpha, grids, registered opening hinge/height, exact emblem loop endpoints and empty final riffle frame passed. Native28/56px light/dark icon gallery and12-frame opening composition reviewed. Owner phone animation cadence, touch-to-skip and FPS remain pending. No runtime wiring or GAME_VERSION change is included in this source delivery.
