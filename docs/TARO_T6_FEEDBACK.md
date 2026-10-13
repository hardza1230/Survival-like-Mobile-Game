# Taro T6 — visual, sound and mobile feedback
Implemented 2026-10-13, runtime v7.8.15. Owner authorized T6 after T0-T5. Real phone combat feedback is pending; these are presentation changes, not measured balance/FPS results.

## Readable roles
- Chain: short violet lightning links and small three-spoke shard feedback. Distinct victims/roots/growth and terminal shrapnel stay T3.
- Smite: gold brackets plus an arrow identify the stable Rod target, scaled for camera zoom/target size and drawn above enemies. Short vertical gold strikes identify impacts. Target choice, repeat fuse and splash remain T4.
- Tempest: segmented cyan nova outline and violet diamond bomb outline have open interiors, retaining visibility of floor hazards. Pending bombs use one new painted 128px ImageGen sprite, displayed 40 world pixels, with a fuse arc from the existing active clock. Dash chevrons are throttled to one per 0.07 active seconds. Existing bomb cap/fuse and damage remain T2.
- STATIC percentage/READY: 82px plate with 12px label and 72px progress bar, kept at screen size by inverse camera zoom. READY cue occurs once per held-full transition; an immediately consumed nova does not show a false held state. No additional combat button.

Existing hero sheets, path/Talent/upgrade icons, Unique art/audio and acquired modifier effects are reused. New art is only the missing Dash bomb. Taro lightning presentation routes apply only while a selected Taro path is enabled; pre-path and other heroes retain existing visual helpers. External lightning effects on selected Taro share the path styling without gaining any Taro gameplay trigger.

## Limits and lifecycle
At most 20 simultaneous transient Taro visuals, additionally respecting the shared frame FX budget. Pending bomb feedback is mandatory for the existing maximum three jobs: marker/icon/fuse (nine objects) plus one charge HUD. Smite has one reused Rod graphic. Skipping a transient graphic does not alter damage or defer work. Nova/bomb rings have no solid interior fill or screen flash. No new tweens, wall-clock damage callbacks or particles.

Transient fades, fuse arcs and Dash trails use existing active Taro time. Pause/levelup/invalid time hides all current visible feedback; resume restores that visibility without restarting fuses. Bomb job completion removes all attached art/fuse objects. Existing run/path/death/retry/shutdown cleanup clears the tracked objects. The new visual helpers own no damage, targeting, charge or gameplay scheduler.

## Reproducible assets/audio
Art kit: assets/art/taro_t6/PROMPTS.json and MANIFEST.json. Exact selected ImageGen prompt/source hash retained. Actual alpha verified; downsampled to 128x128 lossless WebP, 17,278 bytes, 65,536 decoded RGBA bytes, NORMAL blend. Runtime key fx_taro_dash_bomb participates in existing hero lazy classification.

Audio: assets/audio/sfx/taro_t6/MANIFEST.json; five mono 44.1kHz effects, authored durations below 0.3 seconds. Generate with jsfxr 1.4.1 using scripts/gen_sfx_jsfxr.cjs --taro-only <wav-output>, then scripts/encode_mp3.py <wav-output> assets/audio/sfx/taro_t6 96 (lameenc). Exact deterministic seeds/recipes remain in the generator; the isolated batch avoids regenerating existing sounds. Chain/Smite have per-cast cues; nova/bomb cue on pulse; READY is transition-based. Sfx.bp applies mute/volume and per-cue throttles; no sound per chain bounce or secondary victim. Existing Unique and generic Dash sounds remain.

## Verification and owner review
Required npm run check/build; new tests/taro-feedback.test.cjs validates presentation allocation/cleanup, pause visibility, READY idempotence, camera scaling, open silhouettes and asset hashes/budgets. A fixture captured from shipped T5 compares 13 gameplay resolvers exactly, allowing only two explicit sound dispatch replacements. Existing T1-T5 contracts remain. The T2 HUD hash remains attached to its historical fixture; new presentation is checked separately.

scripts/build-taro-feedback-review.mjs and scripts/check-taro-feedback-ui.cjs render actual production helpers on Phaser Canvas with static sample positions and artwork. They never invoke combat updates, damage, targeting or enemy spawning. Three portrait sizes check text bounds, reused HUD, pause visibility and asset availability; browser audio decoder checks five new files/durations/peak/DC. Heroes/Stats retain the existing seven-viewport review. Deployment/source/asset verification state is in SESSION_HANDOFF.

Owner phone sheet: Chain dense packs (follow links/shards); Smite boss with adds (gold marker visible and stable); Tempest standing versus walking, held READY, Dash origin bomb/fuse and nova over hazards; then pause/resume, death/retry and low/high FX quality. Check audible distinctions, actual readability and FPS on the phone. T7 records that feedback and handles final fixes/release; #25 remains deferred.

## Verified delivery
Final npm run check/build passed (1312 runtime assets), Canvas static presentation three portrait sizes, five browser-decoded audio files and unchanged Heroes/Stats seven-viewport review passed. Runtime bf98ac1b5185ef5b1147dc39f3815d04def64664, exact tested tree da87d7b0e735c4b8f63489f35b7aafabf81df8ee. Pages 38430627438 succeeded. Live version.json v7.8.15 and full source verified; published bomb art and all five MP3 hashes equal local. Verified 2026-10-13. Owner real phone combat feedback remains pending for T7.
