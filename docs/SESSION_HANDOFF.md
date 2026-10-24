# Combat HUD v8.0.7 — verified, publishing

Owner asked to redesign the arena UI from a phone screenshot. Fetched/reconciled concurrent owner releases through b93c358/v8.0.6, preserving joystick and story fixes. New grouping: plum/gold status header and mission card, separated wave pips/objective/progress/bonus, bounded seasonal icons, boss backing, relocation of relic/trait lines, solid action discs and skill tray. Native code/established art;zero added texture bytes. All gameplay/input hit areas/settings unchanged.

Changed game.js, CLAUDE.md, this checkpoint, docs/COMBAT_HUD_REDESIGN.md; new static HUD build/check scripts and four proofs in docs/reviews/combat_hud/. Full npm check passes; npm build:www copies2039runtimeassets, no new textures (local minifier fallback when npx unavailable). Static production Canvas four sizes × wave/hunt/season/boss/replay passes text bounds/separation and hide/resume. Existing control tests pass all sizes/hands/hold/release/ownership. No combat simulation.

Next: stage and publish through GitHub connector with exact local/remote tree equality and expected-head lease; read back actual bytes; verify Pages/APK and published8.0.7. Phone feel/FPS remains owner review. Source order45 work already complete and owner integrated it in8.0.2;do not recreate it.
