# Taro Sentry Art — 19 assets

Generated from docs/art_orders/17_TARO_SENTRY_ART.md and 00_STYLE_GUIDE.md on 2026-10-15, using the existing sentry.webp as a visual reference.

## Contents
- This directory: 19 PNG32 assets, exact sheet dimensions and names from the order.
- Original high-resolution generated sheets are retained in the ZIP delivered in chat.
- MANIFEST.json: grid, frame size, playback type and SHA-256 for every asset.
- PROMPTS.json: complete final prompts, generated with built-in imagegen.

## Import
Copy assets/incoming/taro_sentry/ into the repository. Use MANIFEST.json for frame dimensions; frames are left-to-right then top-to-bottom. VFX use black background for the project's luminance-to-alpha conversion and NORMAL blending. Turrets and card icons have actual alpha. No WebP compression or runtime wiring has been applied.

## Verification and remaining review
Verified: all 19 names, PNG32/RGBA format, exact sheet dimensions, frame counts and transparent-background presence on all alpha assets. Normalization uses a common crop and scale for each sheet to avoid independently resizing animation phases. Originals remain available in the delivered ZIP for iteration.

This is a generated art delivery for review, not a claim of runtime acceptance. Frame-to-frame pedestal alignment and continuity between deploy/idle/fire/expire still need visual review in the game. Some source glow and peripheral VFX sparks approach cell boundaries. B5 endpoint continuity needs a runtime check when stretched. A5 uses a hollow center; the exact collision-rim alignment and the alpha <=0.45 criterion must be verified after the project's black-to-alpha conversion. Mobile readability, timings, FPS, npm checks and build were not run because runtime integration is outside this art delivery.

## Owner instruction
Upload and store the art only. Do not integrate these assets into runtime or change game behavior. Runtime wiring requires a separate request.
