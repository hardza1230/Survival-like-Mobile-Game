# momo painted-outline VFX — 8.1.10

Original built-in ImageGen source delivery and runtime integration. 3 selected transparent PNG32 source atlases, 12 clips, 72 individually authored frames. Runtime lossless WebP: 3458572 bytes, 18874368 decoded bytes. Mechanical crop/resize/packing only; original alpha preserved.

Clips: sniperhit, pellethit, seedpop, pinball, charged, dash, bounce, link, muzzle, blast, scope, seed.

PROMPTS.json records actual prompts and style-reference roles; MANIFEST.json records exact source/runtime bytes and SHA256; QA_REPORT.json checks alpha, six unique visible frame hashes per clip and transparent borders. preview.png and preview.gif show source-frame playback on #261e30, not captured gameplay. scripts/pack-momo-outline810.py reproduces runtime packing.

Loaded only for the selected hero, always deferred at boot. Existing character bodies, attacks, damage, hitboxes, targeting, audio and card rules remain. Owned animation uses gameplay time; pause/Low/reduced, missing-art fallback and stage/pool/shutdown cleanup retained. Phone timing, preference, readability and FPS still need owner review.

Existing functional aim line/cone guides remain. New art covers Sniper/charged seed, shotgun muzzle/Berry Blast, Ricochet link/bounce/finisher, seed hits, charge wreath and Dash. Normal seed overlays obey a shared 48-effect cap; actual bullet bodies are unchanged.
