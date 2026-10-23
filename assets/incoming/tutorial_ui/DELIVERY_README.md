# Tutorial UI — art order 38

23 October 2026. All 13 required PNG32 files / 23 frames delivered using built-in ImageGen (five generation jobs; icons combined into one sheet).

Source delivery only. Runtime integration and phone visual/timing/FPS review remain pending. No game.js or GAME_VERSION change.

## Contents and checks

- Nine 256×256 step icons, one 128×128 pointing hand, one 780×600 panel, two horizontal 1536×256 / six-frame VFX strips.
- Actual generated alpha retained; no black-background conversion is needed. Ring centers have alpha 0 except one frame at alpha 1/255, visually transparent. Use NORMAL blend.
- Full PNG decoding and chunk CRCs, exact dimensions/RGBA, SHA256, byte lengths, alpha and six-frame layouts checked. Preview images are offline compositions, not gameplay checks.
- Reviewed all nine icons at 48/72px on light and dark backgrounds, both panel heights, and all VFX frames. Animated GIFs are in preview/. Assets contain no text; preview copy is separate.
- raw/ retains all five original generated images. PROMPTS.json contains the exact prompts. MANIFEST.json records source crops and frame grids. Required PNG sources total 1,813,755 bytes.

## Packing and integration

Keep all new assets tutorial-only lazy loaded, never at boot. Icons: 256→128 WebP. Finger: source 128; pointer tip at (38,2), use normalized origin (0.296875,0.015625). Panel: 780×600, display 390×300; source nine-slice left/top/right/bottom = 80/150/80/80 (packed50% values = 40/75/40/40). Top notch is protected by top band. Intended for fixed displayed width390px and vertical growth; varying width requires separate layout review because the top center contains a notch.

Ring: six 256px cells, suggested8fps loop. Great: six256px cells, suggested12fps once; last frame retains fading sparkles, so destroy on animationcomplete. Do not retain the last frame indefinitely. Preserve the existing missing-texture fallbacks and cleanup on tutorial exit/pause/scene shutdown. Actual animation cadence and phone FPS need owner review.

See docs/art_orders/38_TUTORIAL_UI.md for runtime hook names. This delivery does not assert that the art is already visible in the game.
