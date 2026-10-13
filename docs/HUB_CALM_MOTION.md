# Calmer, livelier Hub — v7.8.7

Owner requested subtle movement, less decorative density and color contrast while retaining the attractive overall art. The castle/Strawberry illustration is a single image; it stays intact. Existing logo and button icons stay; no new raster generation or simulated character rig.

Main-menu chrome uses quiet Canvas rounded panels and slim accents instead of repeating floral frames: coral Play, mint Heroes, indigo Gear, warm gold Activities, cyan Codex and neutral More. Smaller icons, plain chevrons, matte currency/version pills, unframed hero caption and no decorative bottom divider leave more breathing room. A fixed lower shade keeps the illustration from competing with menu text. Native fill colors support Canvas; gradient calls have solid fallbacks, including the gold next-action tag.

Motion is limited to eight small translucent drifting petal/mote shapes over the art, a 1.5px logo float, Play outline breathing, and a 1.2% background zoom. Buttons/text/hit zones remain fixed. Tracked tweens are removed on menu rebuild, leaving Hub, stage start and scene shutdown. Motes are destroyed explicitly. System prefers-reduced-motion disables these animations. No texture downloads, particle emitters or per-frame allocations added.

Routes, tutorial/unlock guards, currency, notification badges, next-action guide and claim logic remain. Full check/build and native Canvas browser QA passed: seven viewports × motion/reduced-motion, text/touch bounds, actual changing mote positions, four consecutive rebuilds with bounded tween counts and navigation cleanup. No headless combat simulation. Physical-phone motion feel/FPS remains owner QA.

Reproduce: npm run build:www; node scripts/build-hub-review.mjs; NODE_PATH pointing to Playwright and FORGE_BROWSER_CHANNEL=chrome when using installed Chrome, then node scripts/check-hub-live-ui.cjs. HUB_SHOT_PATH optionally saves a screenshot. Review uses synthetic menu-only data without saving user progress.
