# Affix Forge single-screen UI — v7.8.3
Owner-approved mockups and fixed spacing are implemented in one route. Power, Sustain choices and Utility share the same geometry; the central pool changes content. Other long menus keep scrolling; Forge resets scroll to zero.

- Seven portrait/landscape geometries; baseline 390x844 matches approved positions.
- Equipped instance tags, selected pink borders, inline Equip, real current-tier bands.
- Paged owned items, actual available Family groups, 44px result rows, modal Odds/full details.
- Paid Sustain options replace the pool; compact screens open two choices in the same route.
- Fixed Roll/Tier/Auto footer; original economy, migration, roulette and Stop callbacks preserved.
- Approved ImageGen atlas reused directly as 12 texture frames. Nine cropped Images preserve 10px button/12px panel corners in Canvas and WebGL. No regenerated images.
- Menu-only lazy asset loading; native NunitoUI text and aspect-preserved equipment icons.
- GitHub Pages workflow now runs the complete existing check command before assembling/deploying.
- Real-method menu-only QA is available at forge-review.html with synthetic data and view selectors; no combat simulation or real save writes.

Validation completed: npm run check and web assembly passed on GitHub Actions. Real Phaser Canvas menu rendered successfully in 21 cases (seven viewport sizes × Power/Sustain/Utility), including font and hit bounds, atlas loading, target tracking, paging, modal/family navigation, Equip, paid Choose and native Roll/Tier currency costs. Screenshots of all three baseline states are in docs/forge_ui/. Cached background opacity and equipped badge alignment were corrected and reverified. Android APK build passed on retry after a temporary Maven dependency-download 403. No combat simulation was run. Physical-phone feel/FPS remains owner QA.
