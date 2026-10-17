# Hero VFX gaps — art order 20

21 PNG32 source sheets / 100 frames, produced with built-in imagegen and normalized to the exact requested grids and frame dimensions. Solid black RGB0 background; opaque alpha is intentional. Sources only; runtime integration is pending.

`MANIFEST.json` contains the requested keys, filenames, grid, frame sizes/count, background, loop and anchors. `PROMPTS.json` preserves the selected prompt for every sheet. `QA_REPORT.json` records dimensions, per-frame content, PNG CRC/zlib verification, SHA-256 and Git blob hashes.

## Packing and review

- Square effects use one shared sequence crop and scale; this preserves relative expansion and shrinking instead of fitting each frame independently. Black padding is inside cells, with no gutters between cells.
- Vertical source sheets were separated at actual dark row gaps before packing, avoiding adjacent-frame fragments. C7/S2/M5 are resized to their narrow frame dimensions.
- C1, C4 and C7 were regenerated after review to remove a clipped paw, an unwanted bear head, and capped ribbon ends respectively. A representative source gallery was reviewed after normalization.
- M2 is state-controlled: formation 0–3, hold 4 while frozen, shatter 5. Do not play all six as an ordinary loop.
- C7/S2/M5 extend through both horizontal borders. Their generated edge profiles are visually close but not pixel-identical: final seam filtering and repeated-tile review are still needed during game packing.
- S3 is left-aligned with a decorative flower at the apex. Its painted fan is illustrative; validate the exact apex offset and 60-degree gameplay footprint when integrating.
- C1/C5/C8 retain some chocolate/ground detail in their final source frames. Apply an opacity envelope at the end of their one-shot playback to complete the fade.
- Loop flags describe intended playback. Review the last-to-first transition, timing, world pivot and scale in the game before accepting runtime behavior.

## Next step for game-side work

Pack sources into WebP using the project's brightness-to-alpha process (lum × 1.35), register hero-lazy `ASSET_FX`, use NORMAL blending, and keep code fallbacks. High-priority effects must bypass the ordinary VFX quota. Limit frequent S1/M1 instances. U1 is white-gold for hero tinting.

No gameplay code, sounds, version number or production asset registration changed in this delivery. Mobile readability, timing and FPS review remain pending.
