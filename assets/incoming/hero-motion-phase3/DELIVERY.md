# Phase 3 hero animation source delivery

Date: 2026-11-23. Base: 8ad09f6e / v8.2.73. Delivery branch: asset-delivery/hero-motion-phase3.

Source art only. No runtime, gameplay, test, asset registry or release files are changed. Newly generated PNG sheets live beside this document. MANIFEST.json records exact grids, reference paths, source aliases and suggested rates; PROMPTS.json records the actual built-in ImageGen prompts; QA_REPORT.json has one result per sheet. Existing finished hero hurt reactions, Yuzu shield/Infusion/fallback slam/rain and four Taro sentry/buff sheets remain at their existing delivery paths.

## Integration notes for the code owner

- Prefer these modern outlined keys over their old fallback aliases. Multiple old Taro/Cocoa/Momo keys resolve to the same outlined file, so the delivery contains each unique sheet once. sourceKeys lists the applicable roadmap aliases.
- Yuzu rain maps to the active trap ring. Its source has twelve frames; its fixed silhouette and hollow center are retained. Yuzu slam also has twelve frames. Other new sheets have eight.
- Read frameCount and columns from the manifest. Existing Yuzu outlined playback explicitly assumes six frames, and the seed projectile may use a manual frame range; those callers need the code owner's attention when wiring.
- suggestedRate preserves the old declared animation period. Effect lifetimes, damage, hit windows, radii and actor sizes still need to stay unchanged when wired.
- Keep lazy loading and previous art fallbacks. Nothing from this delivery is installed at boot or registered in game.js in this branch.
- Aim lines keep their original wide cell sizes. All sheets use RGBA transparency to match their existing source family, including electrical and flame effects.
- Items marked keep-four/state/fallback/deferred in the roadmap have no newly generated replacement here. Six-frame impact flashes already meeting the plan and the eight-frame Yuzling sheet remain unchanged.

Visual appearance and phone play remain for owner review after the code owner installs these sources.

## Delivered

2026-11-23: 40 PNG32 sheets / 328 frames, all mechanical checks passed; missing files: none. Yuzu 8 sheets, Mint 9 (including 3 modern replacements plus fallback sources), Taro 7, Chocolate 10, Momo 6. Every frame is nonempty and distinct, with at least 4% transparent padding (minimum 2px). Hollow floor-ring centers are at least 60% transparent in the central test area. One shared transform per sheet retains relative frame registration. PREVIEW.gif compares all sheets; its preview timing is normalized and does not prescribe game timing.
