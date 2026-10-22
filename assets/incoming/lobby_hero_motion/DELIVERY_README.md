# Art order 34 — Lobby hero motion

48 PNG32 sheets /372 frames for Momo, Yuzu, Mint, Cocoa, Taro and Sesame. Built-in ImageGen source art, matching the existing card designs. Eight sets each: idle, greet, act1–4, tap and poke. Optional victory sheets omitted.

All frames are512×640. Sheets are horizontal:4096×640 for8 frames,3072×640 for6-frame tap. Grounded alpha bounds end at y600. Idle7 and every one-shot first/last frame are exact pixel copies of that hero's idle0. Timings are in the manifests. Cocoa uses a496px neutral body silhouette (approximately500px) to preserve side margins; other neutral silhouettes are520px. Crouches, raised arms and floating props change visible bounds. Per-sheet scale is anchored to the neutral pose, without individually resizing action poses.

Open index.html for all48 looping previews, each combining the actual light stage_card_s01 and dark stage_card_s11 at360px canvas height. Per-hero qa_all_sets.png shows all sets in row-major order: idle/greet, act1/act2, act3/act4, tap/poke. qa_silhouettes.png is Momo, Yuzu, Mint, Cocoa, Taro, Sesame. PROMPTS.json records exact selected prompts, reference commit, provenance and mechanical packing. Per-hero manifest/prompts/QA are supplied as well as root copies.

Source checks: PNG32 dimensions, complete PNG stream and every CRC, real alpha, safe16px frame margins, hash/byte counts, exact idle endpoints and GIF frame counts. Storyboards were visually reviewed. The previews support owner review of timing, facial consistency and small-pose transitions; final visual/FPS checks on the owner's phone remain pending.

## Integration handoff

This is source art delivery. Runtime integration remains a separate step in order34: verify manifest hashes; pack each cell to75% WebP (384×480); lazy-load only the selected hero and its needed sheet in buildLobby. Never add these sources to boot loading. Keep idle/greet resident and clear temporary action textures on hero/menu changes. Preserve static-card fallback, existing shadow and hero size. Timed idle actions8–14s, tap/poke thresholds and low-FPS/reduced-graphics behavior are specified in the order. Sesame remains in development; no Sesame runtime art wiring is changed by this delivery.

No game.js, GAME_VERSION, balance, hero systems or boot loading change in this source delivery. Review qa_report and upload verification before consuming these assets.
