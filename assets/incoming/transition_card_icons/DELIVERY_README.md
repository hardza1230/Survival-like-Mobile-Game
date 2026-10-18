# Art order 26 — transition and card icons

Delivered 82 PNG32 source files / 90 frames: 77 card icons and 5 transition assets. Built-in ImageGen was used for each artwork; final prompts, references and mechanical export notes are in PROMPTS.json. MANIFEST.json lists exact filenames, dimensions, grids and SHA-256 values. Yuzu is excluded as requested.

## Contents

Relic 4, modifier 30, fusion 10, mutation 13, evolution 6, tradeoff 8, infusion 4, basic 2; transition 5. All 77 card icons are 256×256 RGBA with at least 16px safe margins. Distinct artwork was reviewed at 24px and 90px, including hero palettes and category cues.

Transition sources: curtain 1080×1920 fully opaque; frosting edge 160×1920 with opaque left attachment and transparent right; emblem 512×512 with real alpha; sparkle 1024×512 with four 256×512 frames; puff 768×512 with six 256×256 frames. The A3 table's 1×4 notation conflicts with its explicit horizontal dimensions: supplied as 4 columns × 1 row. VFX use opaque pure black for additive blending, with black borders on every frame. Puff ends on a fully black frame.

## Review and export

QA_REPORT.json records decode, PNG32, CRC, dimensions/grids, alpha, safe margins, byte lengths and hashes. QA_icons_24px.png, QA_icons_90px.png and QA_hero_families.png show all icons. Tile pairs, individual VFX GIFs, QA_transition_forward_back.gif and its montage document visual review. Curtain and frosting were corrected with ImageGen, then naturally repeating source regions were cropped; boundary values remain recorded rather than claiming identical edge pixels. Frosting near-opaque alpha 254 was rounded to 255 at export to satisfy the attachment requirement. Artwork RGB was not repainted. Sparkle uses one shared packing translation across all frames.

## Integration handoff

Incoming art only: no runtime wiring or game-version change in this delivery. The two-direction preview is an offline composition, not a device performance test. Source decoded size is 32.832 MiB; this is not the boot texture allocation. The brief reports Cocoa near the 300 MiB limit. Integrators should pack the curtain at 540×960, use 128×128 card icons loaded lazily by hero, and reuse/reduce transition textures as needed. Measure the actual boot GPU budget and phone FPS before accepting runtime integration. Prior art orders 23–25 are already integrated in v7.8.59; preserve newer runtime v7.8.67 changes.

All 100 initial delivery files were read back from GitHub at 1c770afb3aaf699fe43c816fb01dc4e1f8566b8a and matched byte length, SHA-256 and Git blob SHA. The full proof is UPLOAD_VERIFICATION.json. This metadata follow-up does not change source art.
