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

Validation: JS syntax compiled; viewport geometry checked. Full CI and visual review results must be recorded after the workflow finishes.
