# taro painted-outline VFX — 8.1.10

Original built-in ImageGen source delivery and runtime integration. 2 selected transparent PNG32 source atlases, 8 clips, 48 individually authored frames. Runtime lossless WebP: 2559608 bytes, 12582912 decoded bytes. Mechanical crop/resize/packing only; original alpha preserved.

Clips: bolt, hit, spark, burst, core, field, plasma, strike.

PROMPTS.json records actual prompts and style-reference roles; MANIFEST.json records exact source/runtime bytes and SHA256; QA_REPORT.json checks alpha, six unique visible frame hashes per clip and transparent borders. preview.png and preview.gif show source-frame playback on #261e30, not captured gameplay. scripts/pack-taro-outline810.py reproduces runtime packing.

Loaded only for the selected hero, always deferred at boot. Existing character bodies, attacks, damage, hitboxes, targeting, audio and card rules remain. Owned animation uses gameplay time; pause/Low/reduced, missing-art fallback and stage/pool/shutdown cleanup retained. Phone timing, preference, readability and FPS still need owner review.
