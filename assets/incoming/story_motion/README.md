# Story Motion Comic — art order 45

All three source-art batches delivered: 103 PNG32 assets, 54 FX frames, S00–S17.
54 original ImageGen donor PNGs and exact prompts retained in _sources/ and PROMPTS.json. Raw originals include the superseded short shaft and cropped team donor; final manifests reference the completed versions.

## Review

review/S01-motion.gif is an11.2-second,112-frame offline assembly from the actual delivered layers. It is a staging proof, not a game capture. Fourteen360×780 keyshots cover S01 plus S00/S02/S04/S12/S15/S16/S17; all assets also appear on gray contact sheets. Preview captions are code annotations and are absent from PNG assets.

## Files and integration

ASSET_INDEX.json lists20per-folder manifests; each folder has MANIFEST.json, PROMPTS.json and QA_REPORT.json. MANIFEST keys, pivots, dimensions, source crops, blends and SHA256 refer to actual PNGs. The S01 shaft is1242×3840; other far layers are1242×1920. All14mid/foreground overlays reserve their lower28% for dialogue. Puppets/props have24px transparent padding. FX contain exact horizontal frame grids and8px gutters; ADD uses solid black and NORMAL preserves true alpha.

Shared puppets are in shared/; all10FX are in shared_fx/. Scene-specific layers/props are in s00/ through s17/. Existing ruby_talk_proud and hero card art are reused as requested. Do not transform Ruby: she is Grandma's jam spirit. Only cursed humans return to human form. Grandma remains frozen until the final restoration. Sesame story art does not enable Sesame gameplay.

This delivery contains source art, reproducible mechanical packers and offline reviews. Runtime game.js is unchanged by this art delivery. Follow the integration section of docs/art_orders/45_STORY_MOTION_COMIC.md for the separate data-driven player: pack50%WebP, lazy-load only the active shot, release textures between shots, retain current story fallback, tap-to-advance and Skip. Avoid loading the entire kit at boot. The uncompressed all-scene PNG kit is intentionally not a runtime memory budget.

Eye overlays are independent cutouts: align/rotate each eye to the slumbering Hunger face at integration time. The complete team is one movable group. Growth swaps sprout/sapling/young_tree on one ground anchor. S16 city reuses S00 far_city; S17 sleep reuses S16 far_hunger_sleep. Generated frame sequences are painted key poses: code controls frame timing, interpolation/crossfade and dramatic pauses.

## Reproduce

Run scripts/pack-story-motion-sources.py, scripts/pack-story-motion-fx.py, scripts/document-story-motion.py, scripts/qa-story-motion.py, scripts/preview-story-motion.py and scripts/preview-story-motion-scenes.py from repository root. CONFIG.json is the curated extraction specification. Original donors are never changed. Read QA_REPORT.json for exact current hashes/sizes.
