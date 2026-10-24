# Art47 - Battle HUD top source kit

18 text-free RGBA PNG assets generated with built-in ImageGen. Exact dimensions, frame layouts, SHA256, sizes and source-pixel nineSlice margins are in MANIFEST.json. Render artwork at 50% source size; slice margins must be scaled with the artwork. Display sizes in the manifest describe logical target bounds, with flexible mission card height.

Scope: top HUD, mission/boss bars and pause/speed/sound controls only. No bottom control assets or game logic changed. This is a source-art delivery, not runtime integration. Follow the code notes in docs/art_orders/47_BATTLE_HUD_TOP.md for lazy loading, packing, fallbacks and touch targets.

PROMPTS.json retains exact prompts; originals/ retains all 18 ImageGen donors. pack_source.py mechanically crops/resizes/packs them; FRAME_CROPS.json records ring alignment and CROP_LOG.json records crop provenance. The x1 speed-ring frame is intentionally fully transparent. Button states use a common scale so the active glow does not shrink the disc. White/cream mission fill is suitable for runtime tinting. All centers remain free of text and numbers.

QA_REPORT.json records pixel dimensions, RGBA/alpha counts, per-frame bounds and manual text-free review. contact_sheet.png shows the actual exported assets over neutral gray. proof_360x780.png (normal) and proof_412x915.png (boss) are OFFLINE source compositions, not live game captures. compose_review.py places the kit over the owner reference and renders sample text separately. A solid code-rendered header underlay hides pre-existing HUD pixels at the screenshot edges. Lower controls/gameplay remain the original reference pixels. QA does not claim gameplay, phone touch or performance testing.

Reproduce source packing and proofs using Pillow: python pack_source.py; python compose_review.py. Originals are never overwritten.
