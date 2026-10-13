# Long-menu scrolling — v7.8.1

Owner reported strange scrolling on long pages. Fixes shared by Forge and other scrollable menu pages:

- Measure unscrolled content on every rebuild; remove prior filler and exclude viewport backdrops/fixed footers. Tall panels and interactive extents count. Preserve/clamp the same page position; reset when navigating to another screen.
- Painted backdrops and veils stay in viewport coordinates, including images loaded after scrolling.
- Incremental vertical dragging reverses immediately at either bound, avoiding the old overscroll dead zone. Lock gesture direction; shorter frame-independent momentum, with stale release/cancel/stop-tap guards retained.
- Roulette/Gacha overlays cannot scroll; wheel input clears momentum.
- Local tap feedback transform replaces the old mutable wrapper, which leaked after a missed tap. Fixed footer hit areas retain compensation.
- A slim viewport scrollbar shows the current position without adding content height.

Validation: existing touch/momentum regression plus actual-method layout tests at 568/844/390px heights, repeated rebuilds, tall panels, shrink/navigation/filler cleanup, edge reversal, overlays/axes and missed taps. Full check/build required. Owner phone touch/feel review remains pending; no headless gameplay simulation.
