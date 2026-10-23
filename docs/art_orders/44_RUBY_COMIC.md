# Ruby's three-panel comic scenes - v7.9.95

Owner request: each narrated scene has three pictures that appear one at a time, like a comic.

## Behavior

All five C1-1..C1-5 stories now contain three distinct event shots and three short Ruby captions. The first picture fades in; Next panel reveals the next picture with a420ms fade. Earlier pictures remain on the page. After the third picture, Continue closes the story. Back hides later pictures and returns to the prior cue; Skip remains available. The600ms input guard and exactly-once completion are retained. Reduced motion reveals immediately. Rebuilds and dialogue destruction remove owned reveal tweens, and late asset callbacks cannot revive a closed scene.

Comic composition: one wide establishing panel over two smaller detail panels, with ink borders on the existing paper/black background. Images retain their native aspect and complete painted composition inside each frame. Landscape keeps the comic left and Ruby/text right. The existing two post-clear memories also unfold in three panels, reusing the new story shots. Text-only guidance remains ordinary dialogue.

Existing version1 story-read flags allow the revised comic once more. A version2 flag is written only at completion/skip. No progress, rewards, tutorials or hero balance are reset.

## Art and packing

Built-in ImageGen created five original three-shot sheets,15 different shots total. Reference images preserve Ruby's identity and the previously delivered locations. Original1024x1536 PNG sheets and exact prompts live in `assets/incoming/ruby_comic/raw/` and `PROMPTS.json`.

`scripts/pack-ruby-comic.py` extracts each actual painted row, removes only boundary antialias pixels and resizes to768px wide without stretching. Actual source row boundaries vary, so runtime heights vary as well. No existing art was overwritten. `MANIFEST.json` records every original hash, extraction rectangle, runtime size, byte count and hash. Runtime15WebPs total1,050,148bytes; whole new set17,630,208decoded RGBA bytes. Only the current scene's three pictures are requested by narration, through menu-only loading; none are boot or stage-critical art.

`PANEL_GALLERY.png` is a mechanical contact sheet for checking extraction, not a replacement for the generated art. Real Canvas screenshots and a three-step proof are retained under `review/`.

## Validation

Required check/build plus source/runtime/hash/crop/lazy tests. Real production Canvas review checks1/2/3-panel accumulation, prior-picture retention, Back/Continue/Skip, debounce, missing art/paper, fade/reduced motion, tween cleanup and text/portrait/image/touch bounds in five portrait sizes plus844x390 landscape. No combat simulation. Pages CI runs the same narration review. Publication evidence is recorded in `docs/SESSION_HANDOFF.md`.
