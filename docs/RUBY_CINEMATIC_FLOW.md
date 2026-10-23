# Ruby cinematic narration and learning flow

Owner request: make narration feel alive, use spotlights for teaching, and remove jumps between training, stories and stages. Version7.9.96,24 October2026.

## Player route

Title -> training welcome -> live spotlight exercises -> training rewards -> action-led Weave upgrade -> Stage1 story -> stage title/loading curtain -> prepared arena.

Normal clear -> earned box opening -> stage epilogue (or first eligible Ruby memory at Stage1/5) -> reward summary -> Hub unlocks/contextual guidance -> next selected stage. Clear memories end with the causal connection: freed ants/poisoned drains or escaped crown seed/Fermented Canopy. They no longer trigger during arbitrary Hub visits. Optional ally selection remains before narration so the player does not leave a story midway to pick a hero.

## Presentation

Active painted shot is large; earlier shots remain in a small memory strip. Slow 3-second contained zoom,520ms entrance/fade, staggered caption/portrait, dim full-canvas painting and12 bounded ambient motes create depth. Ice falls, furnace/oven embers rise, warm memories glow. Existing story audio cues respect normal sound settings. Controls stay manual: Back,Follow,Enter stage/Continue,Skip. Reduced motion removes movement/particles and makes arrival immediate. Destroy/rebuild cancels owned tweens; late asset callbacks cannot reopen a closed scene.

Existing fifteen ImageGen comic crops and Ruby portraits are reused. No new raster art was generated for this update; runtime asset count and bytes are unchanged. Original prompts/source provenance remain in assets/incoming/ruby_comic/. Source illustrations are not repainted or falsely described as newly generated. Caption/story direction is code-native; runtime particles and motion do not require a new asset download.

The reader supports two or more shots. Early entries keep three narrative images; first Stage1/5 clear memories use four beats, with the fourth supplying the next-stage bridge. Read-state versions1/2 migrate to3 only when completed or skipped; rewards, mastery and other progress are unchanged.

## Teaching

No storybook renderer for generic advice. Stars highlight the real stage box with a small Ruby hint. Weave uses its existing target/button routing with concise explanatory labels. Action lessons keep their active instruction/spotlight and remove redundant pre-action full-screen intros. Welcome,health and finish context remain. Build/Mutation/Evolution show one short hint in the already-reserved area below the actual choices and outline the choices, rather than covering the last card with a separate multi-page lesson.

## Verification and proof

Required check/build plus real Phaser Canvas review across320x568,360x640,360x780,390x844,412x915,844x390. Tests cover story/memory navigation,4-beat bridge, real intermediate fade, aspect/text/touch bounds, missing-art/late-loader fallback, reduced motion, cleanup, stage-title arrival and reserved card hint layout. Real Lobby review covers360 dialogue states plus actual stage-box spotlight bounds and persistence. Flow tests use inert dependencies, not combat simulation.

assets/incoming/ruby_cinematic/review/ contains real Canvas stills and MOTION_STORY.gif sampled from36 native screenshots. GIF timing uses measured capture intervals (not an idealized animation rate). No combat, balance or phone-FPS claim is made. Production publication details live in SESSION_HANDOFF.md.
