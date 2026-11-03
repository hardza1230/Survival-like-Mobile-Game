# cocoa painted-outline VFX — 8.1.10

Original built-in ImageGen source delivery and runtime integration. 3 selected transparent PNG32 source atlases, 12 clips, 72 individually authored frames. Runtime lossless WebP: 3625238 bytes, 18874368 decoded bytes. Mechanical crop/resize/packing only; original alpha preserved.

Clips: slam, shockwave, rage, crater, fist, fireball, gauntlet, explosion, shadowfist, dashtrail, dashring, punch.

PROMPTS.json records actual prompts and style-reference roles; MANIFEST.json records exact source/runtime bytes and SHA256; QA_REPORT.json checks alpha, six unique visible frame hashes per clip and transparent borders. preview.png and preview.gif show source-frame playback on #261e30, not captured gameplay. scripts/pack-cocoa-outline810.py reproduces runtime packing.

Loaded only for the selected hero, always deferred at boot. Existing character bodies, attacks, damage, hitboxes, targeting, audio and card rules remain. Owned animation uses gameplay time; pause/Low/reduced, missing-art fallback and stage/pool/shutdown cleanup retained. Phone timing, preference, readability and FPS still need owner review.

fire_draft.png is the rejected white-matte generation; fire_source.png is the genuine-alpha ImageGen correction. The draft is never packed or used by the game.
