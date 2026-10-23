# Ruby's illustrated early story - v7.9.90

Owner asked for event pictures narrated by Ruby from the first stages, on paper or black instead of a visible Lobby background.

## Story and presentation

Before C1-1 through C1-5, Ruby narrates two short pages per stage: hiding under the pantry with her recipe book; Grandma and the lost jam jar; the machine burning stolen flavor; sweet spirits frozen in the pantry; reaching the Crown Oven. The opening also runs before the first chapter tutorial. Existing optional-ally warnings still run first, and existing post-clear memories remain.

`rubyTalk` now covers the entire screen with an opaque black foundation, then a painted recipe-book page when available. Scene art is contained, never cropped to a phone-shaped background. Ruby's existing expression portraits sit beside the text. Landscape uses an illustration/text spread. Back, Next/Continue and Skip provide manual pacing; 600ms tap protection and a single completion callback prevent accidental double starts. Loading callbacks stop when the dialogue is destroyed; menu rebuilds defer while a Ruby dialogue is open. A missing paper asset keeps an opaque black background and light text.

`Save.data.rubyStorybook` records read/skip completion independently of old speech flags; it is not marked when merely opening a page. Completion also suppresses duplicate in-combat narration and the previous first-stage intro panel. Respect existing noRuby setting. No combat, loot, hero balance or backend changes.

## ImageGen delivery

Built-in ImageGen created four event paintings (pantry, furnace, frozen spirits, Crown Oven) plus one blank paper texture. Pantry generation uses the existing `ruby_talk_normal` as a character-identity reference. Reused `ruby_memory_grandma` and `ruby_memory_jar` make the second stage a two-picture memory sequence.

Original PNGs and exact prompts: `assets/incoming/ruby_storybook/raw/` and `PROMPTS.json`. Runtime: `assets/art/ruby_storybook/`, four768x512 scenes and one512x768 paper, 451,184bytes total /7.5MiB decoded for the entire new set. Only the requested story image plus paper and existing Ruby portraits are requested by narration; never boot/stage-critical assets. `scripts/pack-ruby-storybook.py` resizes/encodes complete source pixels without repainting or cropping compositions. `MANIFEST.json` retains source/runtime SHA256, dimensions and byte counts.

## Validation

- `npm run check`: asset hashes/dimensions/classification, five-stage entry flow, deferred save, once/deduplication, noRuby, first tutorial and optional-ally routing, plus required regression suites.
- `npm run build:www`: 1,920 runtime assets.
- `scripts/build-ruby-story-review.mjs` and `scripts/check-ruby-story-ui.cjs`: real production Phaser Canvas, synthetic narration only, six viewports320x568 through844x390; all five stories, both legacy memories and generic narration; text/portrait/art/touch bounds, page turns, back/skip/debounce, single completion, late callback cleanup, missing-image and missing-paper behavior. Added to Pages CI after existing menu checks.
- Retained real Canvas screenshots in `assets/incoming/ruby_storybook/review/`; no combat or balance simulation. Phone readability, loading feel and touch review remain owner validation.

Publication evidence lives in `docs/SESSION_HANDOFF.md`.
