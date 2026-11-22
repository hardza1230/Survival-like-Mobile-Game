<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.68 — Smoother hero hit reactions

Phase 3A converts the four-frame hurt sheets for Cocoa, Yuzu, Mint, Taro, and Sesame to eight-frame one-shots, for their default and Festival outfits. The update keeps the existing hit reaction windows and corresponding skin swap, frame size, body scale, and floor anchors. Momo’s two already-eight-frame hurt sheets remain the active art. The ten transparent sources, prompts, QA and preview are in assets/incoming/hero-hurt3a; pack script writes ten WebP atlases. Tests play all eight frames for both outfits, check the existing non-Cocoa and Cocoa hit windows, and verify that each run requests only its own hero and equipped skin.

# Previous delivery: v8.2.67 — Smoother mission props and effects

Phase 2C converts ten active mission loops from four frames to eight. Hunt's corked poison bottle has eight painted rotation poses and now follows the registered animation frame range. The Wisp tether and Hunger Herald beam carry subtle moving highlights. Hunger Splinter, Grandma’s pot, Mirror Path crystal, Last Light lantern, the Trial altar and seed, and the Golem oven keep their original footprints and add subtle light or steam motion. Every loop keeps its original cycle duration and mission loading, with atlas sizes at or below 1024 px per side. The prior art-order donors remain available. The new atlas and loading contract completes phase 2 in the animation roadmap.
