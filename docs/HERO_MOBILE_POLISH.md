# Hub / Heroes mobile polish — v7.8.8

More moved to a native 44 × 44 gear beside the version pill; it opens the same Settings / Guide group. Version still opens Updates. Existing five main cards, unlock conditions, badges and motion lifecycle remain.

Heroes tabs share `rosterTabLayout`: narrower widths, 36–48px height and content top that clears the tabs. Native rounded controls replace stretched tab/footer/badge textures; existing preview, character and roster art remain. Select footer is 44–60px tall, role chip fits its label and Details becomes a 32px ! in the top-right preview corner. Preview does not equip; confirmation still saves once and locked heroes show details.

Stats follows the ImageGen concept generated from the owner's current Stats and accepted Hub screenshots. Larger one-line labels and values, quieter navy panels, colored edges, source ! and one footer replace tiny formula subtitles. Each full row opens the existing source modal with original calculations and formulas. Original hero/background art remains; the generated screenshot is a design reference, not a runtime bitmap UI.

## Reproduce menu QA

- `npm run check` and `npm run build:www`.
- `node scripts/build-hub-review.mjs`; `node scripts/check-hub-live-ui.cjs` with Playwright and `FORGE_BROWSER_CHANNEL=chrome` where installed.
- `node scripts/build-heroes-review.mjs`; `node scripts/check-heroes-live-ui.cjs` with Playwright. Synthetic menu-only save; no combat simulation. Real Canvas text bounds, compact tab geometry, preview / confirmation / details and stat source routes across seven viewports. Small/landscape content retains game's existing scrolling.
- Screenshot paths are optional `HUB_SHOT_PATH`, `HEROES_SHOT_PATH`, `STATS_SHOT_PATH`.

ImageGen built-in prompt and output saved in the task's outputs as hero-stats-prompt.txt and hero-stats-concept.png. Phone visual and touch feel remains the owner's physical-device review.
