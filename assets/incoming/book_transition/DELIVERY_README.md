# Art order 28 — Book page and cover transition

Delivered 20 October 2026. **7 PNG32 sources / 26 frames** (6+6+1+6+1+5+1, including three stills). The earlier summary 30 was an arithmetic error; every named row is included.

`MANIFEST.json` records grids, dimensions, hashes, pivots and recommended runtime frame sizes. `PROMPTS.json` records built-in ImageGen prompts and corrections, including technical registration of the generated cover poses into five equal portrait cells. `QA_REPORT.json` and `ANIMATION_CHECKS.json` distinguish source-art QA from runtime behavior.

See `previews/page_turn_forward.gif`, `page_turn_back.gif` (6 frames over **340ms**, plus preview holds), `cover_open.gif` (150ms hold + 5 frames over **400ms**) and `ANIMATION_CONTACT.jpg`. These composites use the original owner mockups underneath. They are **offline asset previews**, not recordings of new game behavior.

## Packing and memory

Full-resolution PNG sources decode to **34.473 MiB**, above the 24 MB target if loaded directly. Pack each frame at **80%** of source dimensions: page/cover frames 432x768, shadow 216x384, and the other per-frame sizes in the manifest. Repack rows/columns after frame-wise resizing; do not round the whole atlas in a way that changes frame boundaries. Trial WebP quality 85 totals about **0.96 MB**; decoded allocation is **22.061 MiB** (about 23.13 MB), below the target. These are measured trial pack estimates, not active boot allocation.

Do not add any `bk_*` texture to boot preload. Load after the first menu appears, set `bookReady` only when the whole kit is ready, and retain order 26's curtain while loading or on failure. Source delivery adds **zero boot memory** because no runtime asset registration was changed.

## Playback contract

- Page turn: next menu below + optional old snapshot; spine fade in 0–60ms; page/shadow frames 0–320ms; dust near 280ms; cleanup by 360ms. No input block beyond 380ms.
- Shadow texture draw alpha **0.4** gives a translucent warm brown shadow. Source shadow opacity is intentionally controllable in code; do not render it at full source alpha.
- Dust frame alpha envelope: `[0.7, 0.95, 1, 0.6, 0.25, 0]`, then destroy. These are source frames, not a looping dust effect.
- Back: same frames with flipX; move spine and dust to the right.
- First menu after launch/return from a stage: closed cover 150ms + glow; five open-cover frames over 400ms; then dispose. Show once per entry and support tap to skip.
- Reduced motion / low VFX: 120ms fade. Keep curtain fallback for an incomplete/failed load, and cancel tweens/listeners on navigation or shutdown.

Register only in the lazy book group, use `ASSET_FX` once animations as the original order specifies, and wire `menuTransition` / `showMenu` only when implementing runtime integration. Source PNG backgrounds are real alpha except the intentionally opaque closed cover. No letters or numbers are baked in.

Pending: runtime integration of lazy loading, skip/reduced-motion/fallback/lifecycle handling and owner phone FPS/visual approval. Runtime version is still v7.9.9.
