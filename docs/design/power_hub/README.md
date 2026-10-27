# Power hub — ImageGen design proposal

Implemented as v8.0.56, 2026-10-27. Owner confirmed this is the main Power hub, not Flavor Weave. The concept is a visual reference; runtime draws its own responsive UI. concept.png is the selected built-in ImageGen mockup; all numbers are illustrative. PROMPTS.json contains the exact generation and correction prompts.

## Observations from production source

buildGearPower already provides current vs recommended Power, three numerically ranked powerTips, separate pending reward chips and four Weave/Equipment/Merge/Forge routes. Retain this useful prioritization and actual gain calculations. The page currently paints near-identical rounded rectangles and emoji tip icons. The shortcut loop declares mui_gear_card_<target> but does not render that art. Existing illustrated assets can therefore contribute without generating everything again.

## Proposed design

- Quiet plum workshop background; existing background is attractive but detailed and has a temple identity. Keep text surfaces opaque enough to read, with decorative painting mainly at the sides.
- Compact Power summary, small crystal crest, large live number, accurate progress vs next stage. Avoid a large hero portrait that pushes useful actions down.
- Three recommendation rows with a subtle gold emphasis on the best actual gain; painted icons, clear action labels and mint gains. Keep pending rewards separate from power gains.
- Four comfortable illustrated shortcuts in a responsive2×2grid on portrait. Weave: three cores connected by thread. Equipment: sword/shield/gloves. Merge: three matching equipment items become one higher-rarity item. Forge: anvil plus mod materials. Landscape can retain a wider row.
- Existing global navigation stays intact in implementation; the mockup footer is illustrative. The Claim chip routes to the existing Rank Rewards page, not an invented instant claim.

## Asset scope for implementation

Generate only what existing assets cannot cover: a small Power crest; missing Merge illustration; consistent isolated action icons if old art cannot be reused; a quieter text-free workshop background if required. Existing Weave/Equipment/Forge paintings are reuse candidates. New bitmap assets must be text-free with verified alpha where needed. Draw text, numbers, progress, rounded panels, button states and hit targets in code for responsive clarity. Do not ship the full mockup as a flattened screen.

Reuse the current live gains, price rules, save data, sorting, badges, tutorial targets and routes. Avoid a gain pop-up running over other labels; respect reduced motion. Make short phones adapt by reducing decorative art and spacing while preserving text sizes and touch targets. Verified widths at320/360/390/430/768px and landscape through isolated menu layout contracts; no game screenshot or headless combat capture. Required check/build if implementation follows.

## Review status

Selected concept visually reviewed. Refined Merge from currency crystals to matching shields, currency from gem to wrapped Sugar, and Power bar to83% for1240/1500. Owner approved implementation. The runtime uses one six-icon atlas, existing background plus a quiet veil, live text and accurate progress, first-tip accent, complete dynamically wrapped descriptions, all pending routes and responsive2×2shortcuts. Short phones scroll naturally rather than reducing critical copy below11px. No shortcut or page is flattened into the concept PNG. Original powerTips calculation/sorting/save economy is byte-equivalent after line-ending normalization. Existing global navigation stays intact.


## Production asset and validation

Six new built-in ImageGen paintings in one coherent alpha atlas: Power crest, Weave, Equipment, Merge, Forge and Talent. Exact prompt/source/alpha review/manifest in assets/incoming/power56/. Mechanical scripts/pack-power-56.py crops/resizes/packs cells while preserving alpha. Runtime assets/art/mobile_ui_789/gear_power56_icons.webp is576×384 with six192px cells,183,310bytes/.844MiB decoded, Power-menu lazy and missing-art fallback. Reuse existing background; panels/text/progress remain code-native.

Production menu adapters tests/power-hub-layout.test.cjs verify six viewport layouts, no overlapping hit targets, all shortcut/pending routes, full risk inside dynamically sized cards, empty/missing art, large values, motion preferences/stale callbacks, manifest/source hashes and unchanged actual Power gain calculation. No game screenshots or combat simulation. Owner phone appearance/touch review remains pending.
