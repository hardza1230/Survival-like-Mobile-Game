# Painted boss body animation — 8.1.16

21original character identities:15campaign bosses, Pinnacle and five Chapter3 minibosses. Eleven ImageGen atlases1536×1024 /6columns×4rows contain264authored drawings. Each actor has six idle and six anticipation/strike/recovery drawings. The final knight also has a second12frame highlight form for its existing phase2; no ability or stat changes. Twelve actual prompts include the transparency-only correction to pair02; the gray-alpha draft is retained for provenance.

Reference pairs contain original registered sprites in three existing poses. Preserve the original game identities, with crisp ink edges and simpler readable shapes. B01 now has256px runtime frames instead of160; Great Hunger keeps its dominant maw/radial eyes, while Rootmother's Bud retains an upright small face/bud-throne silhouette. No pasted aura or separate PNG body overlay is used: the actual Sprite changes texture/frame.

Reproduce with `C:/Python313/python.exe scripts/pack-boss-body816.py`. One common uniform transform per actor fits the original visible pose union and foot anchor, retains genuine alpha and clear borders. All21lossless WebP sheets total19,902,866bytes /69,206,016decoded aggregate, loaded only in their stage groups. Source PNGs/references/drafts/previews are excluded from runtime loading.

`MANIFEST.json` records exact source/runtime lengths and SHA-256; `QA_REPORT.json` checks264distinct frames, alpha and borders. PNG/GIF previews show source frame playback, not gameplay. Original world circle/offset/display footprint is preserved when changing B01's frame size; the ratio is reversed on cleanup. Actual Arcade/Canvas contracts verify before/after/restore bounds for all21actors at six layouts.

The owned frame clock respects pause, freeze, reduced/Low settings, cinematic boss introductions, player/stage/spawn/epoch ownership and pooled cleanup. Charge wind/strike follows the original release cue. Existing damage, cooldowns, movement, AI and collider geometry remain unchanged. Owner explicitly chose to do phone appearance/FPS testing himself.
