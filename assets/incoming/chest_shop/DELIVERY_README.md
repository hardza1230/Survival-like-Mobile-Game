# Art order40 — Bazaar chests and Thread

23 October2026. All7 required PNG32 assets /22 frames delivered. Built-in ImageGen supplied6 original sheets/images; opening poses are AI-painted, with foot-baseline translation only. Raw donors and exact prompts are retained.

## Assets

- chest_silver/chest_gold:512×512. Silver wood/metal/cream cloth/mochi latch; premium gold icing trim and pink gemstone.
- chest_silver_open/chest_gold_open:3072×512, six512px cells each, left-to-right. Frame0 is exact closed artwork. Suggested timings100/90/90/110/140/500ms; play once and hold frame5. Only the initial frame is copied from the matching closed asset; frames1–5 are authored ImageGen poses. Registration offsets are in QA_REPORT.
- vfx_chest_rays:3072×512 /6frames, strict grayscale on opaque pure black. Suggested10fps loop, ADD blend, runtime rarity tint. If using the existing black-to-alpha conversion, recheck size and blend after conversion. Do not NORMAL-blend opaque black over the reward.
- ic_thread:256×256, pink/blue candy thread and gold needle, reviewed at20/28/40/64px.
- bz_chest_card:780×400. Native nine-slice L/T/R/B =64/64/64/64. If packing50%, use32/32/32/32. Empty dark interior supports white runtime text. All source assets contain no text.

Source PNGs total5,509,168bytes. Exact-size WebP candidates total844,676bytes (~0.84MB) at q82, stored separately in webp_candidates/. Candidates are ready for the runtime author to evaluate; source delivery does not register textures or change gameplay.

## Verified

Full PNG decode/chunk CRC, SHA256/bytes, exact dimensions/RGBA, frame grids, genuine alpha and exact closed→frame0 matching passed. Rays are neutral grayscale with pure black empty areas. Offline six-frame contacts/GIFs, closed/open comparisons, native tiny Thread gallery, four current-runtime rarity colors and two nine-slice card compositions reviewed. These are offline proofs, not phone/gameplay tests. Owner phone cadence, reward readability and FPS remain pending.

## Runtime integration notes

Load only with Bazaar/Chests, preserving current missing-art fallbacks. Keep chest body size, origin and foot baseline consistent when switching from static image to spritesheet. Retain the existing grant/pity/cost/free-daily logic; animation only changes presentation. Cancel timed callbacks and destroy temporary ray/animation objects on close/skip/menu rebuild.

There is an existing combat texture key ic_thread in game.js, currently mapped to assets/ic_thread.png and used by a world Knot effect (current v7.9.77). This new requested source filename is also ic_thread.png. Use a distinct currency texture alias or explicitly review the existing combat call site before replacing the shared key globally. Do not silently change the Knot effect while adding Lobby/Bazaar currency art.

No game.js or GAME_VERSION changes in this source delivery. Runtime wiring and owner phone visual/timing/FPS review are next.
