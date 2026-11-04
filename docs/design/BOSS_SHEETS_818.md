# Boss source cuts and missing early animation โ€” 8.1.18

The owner's report exposed two separate gaps. The816packer split original ImageGen atlases on a rigid256px grid before adding output padding, so drawing tips crossing that grid were cut off and neighboring tips could leak into the next frame. Earlier checks verified transport, nonempty frames and padded output edges; they did not establish that source silhouettes were complete. Four early minibosses also remained single static images, and five others had only limited pose sheets.

All15campaign bosses, Pinnacle and15campaign minibosses were reviewed. Thirty identities now use the repaired/completed372frame family. Ancient Root Knight retains its already complete16frame walking/attack set and its five dedicated animations. Its existing connected-component, gutter and gait-baseline regression checks remain intact.

## Source correction

Original21actor drawings are retained and recut at actual transparent source gutters. Every source split must have a five-pixel transparent corridor, leaving two clear pixels on both sides. Two-pixel borders are checked on SOURCE crops, before any output padding can conceal an error. Variable crop rectangles are embedded in nominal coordinates; one common crop/scale/foot transform per actor preserves pose registration. This is mechanical cropping and packing; no alpha masking, background removal or repainting.

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
