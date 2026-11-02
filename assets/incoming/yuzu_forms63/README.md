# Art order63 — Yuzu companion forms

Eight sourcePNG assets /59frames, generated with built-in ImageGen from the existing three companion sprite references. This is an incoming source delivery; no runtime or balance changes.

- Six character sheets:1024x512,4x2,256px cells. Walk0–3,attack4–7. RealRGBA, no ground shadow. Common scale across each sheet and full-pose extraction from clear curved gutters retain wide shields/capes. Feet end at y248, cell borders transparent.
- yz_fx_evolve:1024x512,4x2,8frames,solidblack background. White/cream/palegold for future tinting. Revision1 remains archived; final uses revision2 with contained pillar tips.
- yz_form_badge:192x64,3x1,RGBA. One/two/three leaves for forms1/2/3.

MANIFEST records full file hashes, dimensions, source rectangles, clips and anchors; PROMPTS records actual requests/references. Unchanged ImageGen donors are in originals/. Run python assets/incoming/yuzu_forms63/prepare_source.py from the repo root to reproduce normalized PNGs and reviews. No painting or generated animation frames are synthesized by the packing script.

Review review.png at native360px width for mobile-size form comparisons. Per-form contact sheets show all8 poses. Walk/attack GIFs and yz_fx_evolve.gif show frame timing. Owner phone visual/FPS review remains pending.

Runtime handoff: follow63_YUZU_COMPANION_FORMS.md. Pack six characters andFX50% to128px frames, NORMAL blend luminance-to-alpha forblackFX, retain base fallback and hero-lazy loading. Remap yz_48 attack8–15 into4–7, not frame%8 blindly. Verify GPU budget before release; do not boot-load these sheets. This source delivery has no game.js changes, version bump or deployment claim.

## Integration update

All8 assets integrated in runtime8.0.95 using scripts/pack-yuzu-forms-63.py; productionfiles/manifest in assets/art/yuzu_forms63/. Original sourcekit above remains unchanged. Phonevisual/FPSreview pending.
