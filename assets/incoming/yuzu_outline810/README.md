# yuzu painted-outline VFX — 8.1.10

Original built-in ImageGen source delivery and runtime integration. 3 selected transparent PNG32 source atlases, 12 clips, 72 individually authored frames. Runtime lossless WebP: 4196614 bytes, 18874368 decoded bytes. Mechanical crop/resize/packing only; original alpha preserved.

Clips: slam, peel, roll, guardian, arrow, volley, pierce, trap, comet, sigil, bloom, honey.

PROMPTS.json records actual prompts and style-reference roles; MANIFEST.json records exact source/runtime bytes and SHA256; QA_REPORT.json checks alpha, six unique visible frame hashes per clip and transparent borders. preview.png and preview.gif show source-frame playback on #261e30, not captured gameplay. scripts/pack-yuzu-outline810.py reproduces runtime packing.

Loaded only for the selected hero, always deferred at boot. Existing character bodies, attacks, damage, hitboxes, targeting, audio and card rules remain. Owned animation uses gameplay time; pause/Low/reduced, missing-art fallback and stage/pool/shutdown cleanup retained. Phone timing, preference, readability and FPS still need owner review.

Elemental Minion projectiles reuse the newly painted Cocoa fireball, Mint819 ice shard and Taro Spark under Yuzu-specific lazy texture keys. No duplicated source image or gameplay change. Fighter accents are limited to 3 per 120ms; major Companion effects share the existing four-sprite budget and 420px size cap.
