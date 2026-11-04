# Animated painted boss shots — 8.1.17

16 existing projectile identities, four authored frames each. Four original ImageGen sources preserve the old outline, palette and compact right-facing head. Source images are natively1254×1254; the packer normalizes their4×4grid only during mechanical packing. Raw sources and exact prompts are retained. No manual matte removal or generated background replacement.

Runtime:16lossless WebP strips,512×128,128px cells,4frames at8fps,575,618bytes total. True alpha, clear cell borders, four distinct cells per projectile; see MANIFEST.json and QA_REPORT.json. Rebuild with scripts/pack-boss-shots817.py. preview.png and preview.gif are source compositions, not gameplay recordings.

Wired as stage-lazy texture replacements on the original pooled physics bullets. No additional projectile objects or timers; previous scale/angle/velocity/damage/lifetime/behaviour/collider rules remain. The owned loop holds on pause and a steady keyframe on Low/reduced effects; cleanup detaches without destroying pooled actors.

Static actual Phaser Arcade contracts verify before/after/restore bounds, angles, frame progression and pool cleanup for all16styles across six layouts. Source/hash/alpha/geometry/ownership tests also pass. Phone appearance and FPS are for the owner to review; agent phone testing was explicitly waived.
