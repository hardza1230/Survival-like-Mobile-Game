# Boss source cuts and missing early animation โ€” 8.1.18

The owner's report exposed two separate gaps. The816packer split original ImageGen atlases on a rigid256px grid before adding output padding, so drawing tips crossing that grid were cut off and neighboring tips could leak into the next frame. Earlier checks verified transport, nonempty frames and padded output edges; they did not establish that source silhouettes were complete. Four early minibosses also remained single static images, and five others had only limited pose sheets.

All15campaign bosses, Pinnacle and15campaign minibosses were reviewed. Thirty identities now use the repaired/completed372frame family. Ancient Root Knight retains its already complete16frame walking/attack set and its five dedicated animations. Its existing connected-component, gutter and gait-baseline regression checks remain intact.

## Source correction

Original21actor drawings are retained and recut at actual transparent source gutters. Every source split must have a five-pixel corridor with alpha below16, leaving two clear pixels on both sides. This threshold identifies painted silhouette contours; packed output borders must still have zero alpha. Two-pixel borders are checked on SOURCE crops, before any output padding can conceal an error. Variable crop rectangles are embedded in nominal coordinates; one common crop/scale/foot transform per actor preserves pose registration. This is mechanical cropping and packing; no alpha masking, background removal or repainting.

Five new original ImageGen paired atlases preserve the existing earlier-miniboss faces, shapes, props and palettes. Nine selected characters add108idle/wind/strike/recovery frames. The newly generated Root Knight draft is retained for provenance but not selected, protecting the original's richer animation set. Exact prompts, original generator paths, references, manifests, source partitions and QA live in assets/incoming/boss_body818.

Independent source decoding checks all384generated/source cells and verifies complete exclusive partitions. Selected372frames recover1111painted pixels lost by rigid cuts and exclude1111neighboring pixels (717of each in the original21actors). All372runtime drawings were inspected as eight frame-by-frame source compositions. No gameplay screenshot was used to judge appearance.

## Runtime integration

The existing body map and logical texture keys now cover30identities, with stage-lazy literal URLs in boss_body818. Four former static images retain their original160/192/140/140px geometry through the existing inverse texture-frame ratio. Actual physics Sprites are reused; no flat body overlay is added. Original scales/circles/offsets, positions, velocity, damage, AI and attack intervals remain.

Earlier-miniboss pose hooks now use the owned body clock. The old four-pose handlers use frame1 for an attack; this is explicitly translated to the new attack sequence, rather than being mistaken for idle. Missing-art fallback remains. Pause/freeze/Low/reduced, player/stage/epoch and pool cleanup continue through the existing renderer. The complete original Root Knight remains outside this replacement map.

Runtime family:28,292,916bytes /97,517,568decoded bytes across all30sheets, loaded only in stage subsets. The source originals and unused drafts are not shipped as runtime assets.

## Verification

- Independent PNG decoding checks actual source seams and source coverage; known rigid-grid failures must exist in the fixture, and recovered/excluded pixel counts must match the selected frame records.
- Production-method tests cover30body profiles, four static-image origins, inverse geometry restoration, old frame1 attack translation and earlier-chapter escorts.
- Actual Phaser Arcade/Canvas checks measure world circles/offsets/display size before replacement, during wind/strike and after restoration in six layouts; pause/freeze/reduced-motion checks remain.
- Existing Root Knight16frame animation, component, gutter and gait tests remain active.
- Full game checks, final build and all ten browser contracts passed locally. Publication and live asset verification are tracked in the release closure below. Owner explicitly waived agent phone tests and will review device appearance and FPS himself.

## Publication closure — 5November2026

Runtime [9a13495](https://github.com/hardza1230/Survival-like-Mobile-Game/commit/9a13495e95355cb6f19927f2d646b3a78f703ab3) is published. [Pages41936748491](https://github.com/hardza1230/Survival-like-Mobile-Game/actions/runs/41936748491) and [Android41936748513](https://github.com/hardza1230/Survival-like-Mobile-Game/actions/runs/41936748513) succeeded. All62changed files /58,146,613bytes were fetched from the immutable commit, compared byte-for-byte and decoded where applicable; local and remote Git trees matched.

The [live game](https://hardza1230.github.io/Survival-like-Mobile-Game/) reports8.1.18. Version/code and all143active boss-art files /1028frame cells /53,563,971bytes match their source-manifest hashes and lengths:96VFXclips,30repaired/completed body sheets,16projectiles and the original16frame Root Knight. The repaired/completed body subset is372frames; including the unchanged Root Knight, all31boss/miniboss identities have388body frames. These are active frame counts, not a claim that all were newly drawn in this release.

Rigid-grid source errors affected11of the existing21body actors: B02/B04/B05/B06/B07/B08/B10, Pinnacle, C3boss4 and C3mini2/5. The corrected splitter also caught nominal-grid drift in new source drawings before they reached runtime. The four static early minis and five limited-pose minis now have complete12frame sets. The old four-pose frame1 attack translation is verified in both unit and real Arcade contracts.

Owner phone tests were explicitly waived; device appearance/feel/FPS review remains with the owner.
