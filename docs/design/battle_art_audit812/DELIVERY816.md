# Boss body motion and clarity — 8.1.16

The ordered body/clarity pass covers all15campaign bosses, Pinnacle and5Chapter3minibosses:21identities /22visual forms /264new drawings. Eleven original ImageGen character atlases plus one transparency correction retain the existing faces, equipment and palettes while simplifying outlines. B01 uses256px runtime frames at its previous world size; Great Hunger's mouth/eyes and Rootmother's Bud's upright bud/face/roots have different silhouettes. No new gameplay form, character lore change or flat body overlay.

Actual Sprite textures replace the old pose sheet during battle. Common uniform packing preserves original projected root/foot bounds. A ratio of256/originalFrame rescales Sprite scale/baseScale and circle source radius/offset inversely, preserving the world collider and display footprint. Cleanup reverses the transform and leaves the physics actor alive for pooling. Normal enemy, Delve and missing-art paths keep their original behavior.

Idle, anticipation, strike and recovery use an owned wall clock. Explicit charge cues switch from wind to strike at the existing release callback. Other authored pose durations retain their original intervals. Pausing/freezing holds time; Low/reduced settings retain readable key poses. Intro idle callbacks stay on the new body, phase2 highlights preserve geometry, and current-pose cosmetic ghosts keep existing defeat/cutscene cleanup. C3 escort presentation actions use this clock and cannot leave stale normal-enemy action state.

Validation includes exact source/runtime hashes and264distinct cells; analytic geometry, actor ownership, pause/freeze/intro/Low/phase2 and pool restoration tests; real Phaser Arcade/Canvas before/after/restore world bounds for21sprites across six layouts. This is a static rendering/physics contract, not combat simulation or a phone FPS measurement. Runtime19,902,866bytes /69,206,016decoded across the full family; stage-lazy subsets preserve boot loading budgets.

Owner waived agent phone testing and will playtest himself. The remaining ordered batch is16animated boss projectiles; C3 miniboss art is included in this body delivery.
