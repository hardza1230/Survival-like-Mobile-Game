# Taro Unique / Static Arc art — order 18 extensions

Delivered 2026-10-16 Asia/Bangkok. Source: `docs/art_orders/18_TARO_SPARK_BALL_LIGHTNING_ART.md`, revision `98a2774bb7030c9c86e426cf0da6e984ad1081f0`.

## Scope
- E1–E3: Plasma Field ring, cast and hit.
- F1–F2: Sentry overload and detonation.
- G1–G2: Shock stack counter and full-stack aura.
- H1–H2: Plasma Field and Overcharge icons.
- I1–I5: Static Arc, Overload Loop, hit effects and card icon.

Total: 14 PNG32 files. A/B/C were already delivered and integrated in v7.8.25; they were not replaced. D1–D3 and H3 were cancelled in v7.8.27 and are intentionally absent. The directory name remains taro_unique_needle because the order specifies that destination; no needle assets were created.

## Import contract
Use MANIFEST.json for exact frame width/height, rows, columns and playback. Frames run left to right then top to bottom. G1 is not an animation: select frame0 for1 stack through frame4 for5 stacks. I1 and I3 are vertical stacks of four horizontal beam frames. VFX are opaque pure-black sources for the project's later luminance-to-alpha conversion and NORMAL blending; icons retain actual generated alpha. E1 is a circular ring with an empty center; radius is controlled by the game.

## Creation and verification
Generated using built-in imagegen with the existing Sentry as the icon style reference. Final prompts are in PROMPTS.json. Technical normalization sets exact frame sizes, retains a common crop/scale within event sheets, canonicalizes near-black VFX background pixels, and aligns Arc beam endpoints to the cell midline. No game asset registration or WebP packing was performed.

QA_REPORT.json records all14 dimensions/grids, actual icon alpha, opaque black VFX corners, SHA-256 values, the1–5 detected Shock bolt counts and the empty central half-diameter of every Plasma ring frame. Arc beam endpoints are numerically verified within1pixel of the cell midline. All generated source sheets and the final representative gallery were visually reviewed.

Game-side review still needs to check timing/phase transitions, the Plasma damage rim after luminance conversion, stretched beam appearance, readability on light/dark stages and mobile FPS. These are not claimed as tested.

## Owner scope
Store art in incoming only. Do not wire into runtime, change mechanics, modify game.js, update the game version or regenerate build outputs under this delivery. Integration requires a separate request.
