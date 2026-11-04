# Chapter 1 boss outline effects — 8.1.13

Eight original ImageGen PNG32 atlases, each 1536×1024 / 6 columns × 4 rows. Each row contains six authored animation frames; 32 clips / 192 frames total. Original cute candy-fantasy identities with crisp dark contours, colored shapes and restrained bright cores. Cocoa outline810 is a style reference only.

`PROMPTS.json` records all ten actual prompts, including the rejected directional frost-breath draft, radial correction and final transparency correction. Drafts are provenance only. Final frost breath is radial to match the existing pillar-shelter attack.

`CLIPS.json` maps source rows to legacy/runtime keys. `LEGACY.json` snapshots the original registry. Run `C:/Python313/python.exe scripts/pack-boss-outline813.py` from the repository to reproduce runtime WebPs, manifests, PNG/GIF previews and QA. Packing uses one common crop/transform for each six-frame row, retargeted to the original visible projected rectangle. Rectangular strips retain their original frame dimensions, anchors and display geometry. Genuine alpha is retained without matte subtraction.

Runtime: 32 lossless WebP sheets, 8,653,898 bytes total; 43,253,760 decoded bytes if every clip were resident together. Stage-specific effects load only for their C1 stage, plus four shared body effects. Nothing is added to boot/menu core loading. Sources/drafts/previews are not runtime assets.

`MANIFEST.json` stores source/runtime lengths and SHA-256. `QA_REPORT.json` checks dimensions, alpha, distinct visible frames and clear two-pixel runtime borders. `preview.png` and `preview.gif` show source-frame playback on #261e30; they are not gameplay captures. Phone appearance/readability/FPS still need owner review.
