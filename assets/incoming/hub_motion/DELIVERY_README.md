# Art order 25 — Hub menu motion

25 PNG32 assets /81 frames: all20 required A/B/C files plus5 optional animated menu icons. Source canvas1080x1920; cropped layer top-left positions, local pivots, z order, grid/state/loop data and exact SHA-256/byte lengths are in MANIFEST.json.

The user explicitly approved Python extraction from the original. Visible Momo/flowers use original pixels, with no pose or facial redraw. Built-in ImageGen supplies occluded fill, the completed staff head beyond the old frame, blink states, atmospheric/VFX sources and icon animation. Final prompts, reference identities and auxiliary source identifiers are recorded in PROMPTS.json and EXTRACTION_PLAN.json.

QA: all25 RGBA PNGs passed decode, CRC, alpha, grid, size and hash checks. Decoded source size is 28.208 MiB (<40 MiB). Direct source placement is0px displacement. 427,490 fully opaque interior pixels match original RGB exactly. Alpha edges and newly uncovered background differ by design; the whole reassembly is not asserted to have identical RGB. See reference comparison/diff, blink alignment, -6/0/+6-degree joint tests, puppet motion and C1/C7 loop previews.

Coordinate contract: layer canvasX/Y are global neutral coordinates, not offsets to add twice. B2/B3/B4/B5/B7 inherit B1 motion; B6 inherits B5. PivotX/Y are local to each cropped file. A staff file can extend outside the1080x1920 scene, completing the previously clipped head. A4 is three independent cloud frames; use recommended alpha/sky clip. C1-C7 are opaque pure-black sheets for luminance-to-alpha conversion. D sheets have real alpha and preserve the existing icon identities; Play follows the actual mascot icon rather than the order's mistaken bunny-ear wording.

Incoming artwork only. Runtime packing to941/1080, A1 replacing the old background, C/D lazy loading, tween cleanup, reduced-motion behavior, actual boot budget and phone FPS remain integration work. No game version bump or runtime wiring is included. Full GitHub byte verification is recorded after publication.
