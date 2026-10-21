# Art order30 — C3 and Pinnacle boss VFX

48/48 PNG32 source assets (226/226 frames) delivered; complete C3 and Pinnacle source delivery. See PRODUCTION_STATUS.json for exact pending keys.

MANIFEST.json is an ARRAY compatible with the order22 packer. A/B sources use opaque pure-black backgrounds; C sources preserve real alpha. Rows are frame-major left-to-right, then next row. Anchors use center/left; dome shard holdFrame=4. Final dimensions, bytes and SHA-256 are recorded per file. Source prompts and selected source hashes are retained.

Source-art delivery only. No game.js, stage registration, attack timing, radius, damage, pool or projectile changes. Runtime v7.9.28 preserved. Pack with existing C1-C2 max-channel alpha/unpremultiply pipeline; counters bypass black conversion. Stage-lazy loading only. Read the original order for bossKit expansion, Pinnacle STAGE_SHEETS[14] loading, arena hooks and fallbacks.

Technical checks: full PNG decode, all chunk CRCs, zlib Adler, exact dimensions/grid, preserved encoded pixels, actual C alpha, frame occupancy and tile seam checks. Proof pages under qa/ embed exact assets/art/floors/floor_c31…c35.webp bytes (Pinnacle uses c35); Counter samples display at44px. They are offline source-art proofs, not gameplay tests. Browser execution, frame timing/contact alignment and phone FPS remain pending because the execution environment is offline.

Counter C1-C2 extras are outside this order. UPLOAD_VERIFICATION.json records exact byte readback at the source commit.
