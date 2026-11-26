# Game source (v8.3.11)

`game.js` is **generated**: `scripts/build-game.mjs` joins `src/NN-*.js` in file-name order, byte for byte. The files stay plain classic-script code with shared globals, and the order matters.

**Edit the files here, never `game.js`.** Then:

```bash
npm run build:game
```

- `npm run check`, `bash scripts/ci-checks.sh` and the deploy-push hook fail if `game.js` ≠ `src/`.
- `build:game` refuses to overwrite a `game.js` that was edited directly. Move that edit into `src/`, or use `--force` to discard it.
- `game.js` stays committed, so tests, `build-www`, pack scripts and asset scans keep reading one file.
- `scripts/bump-version.mjs` edits `GAME_VERSION` (00) and `CHANGELOG` (01), then rebuilds.

Files 20–29 are **slices of one `class Game extends Phaser.Scene { … }`**. File 20 opens the class and file 29 closes it, so those files are not valid JS on their own. Keep a new `Game` method in the file of its system. To move a method between files, cut and paste the whole method; class method order does not matter.

| File | What is inside |
|---|---|
| 00-config | header, HUD rows, COLORS/BALANCE, run traits, `GAME_VERSION`, C1 wave plan / combat director constants |
| 01-changelog | `CHANGELOG` (player-facing News) |
| 02-audio | `Sfx` (SFX/BGM playback) |
| 03-assets-images | `ASSET_IMAGES` |
| 04-assets-sheets-fx | `ASSET_SHEETS`, `ASSET_FX`, enemy action animations |
| 05-assets-audio-loading | `ASSET_AUDIO`, voice catalogs, loaders, `artClass`/lazy-loading rules |
| 06-boot-scenes | `Boot` and `Opening` scenes |
| 07-heroes-cards-talents | skills, heroes, Build Paths, cards, talents, ranks, Expedition helpers |
| 08-economy-gear-shop | Flavor Recipes, IAP/Cosmetics, hub groups, Gear/affixes, ads, store, daily/login |
| 09-save-stats-cloud-gm | `Save`, `Stats`, `Cloud`, `GM` |
| 10-stages-bosses-story | `STAGES`, props, `BOSS_KITS`, Ruby tips, story reactions, motion comics |
| 11-wave-objectives | `WAVE_OBJECTIVES` (missions) |
| 20-game-core-hud | `class Game` start: constructor, create, camera, HUD, bars |
| 21-game-menu-hub | lobby/menu navigation, hub, archive, tutorial, rank screens |
| 22-game-menu-heroes-expedition-forge | heroes, Expedition, Gear/Forge, shop screens |
| 23-game-run-waves | run start, stage loading, waves, continuous combat HUD, card deal |
| 24-game-missions | mission logic (Escort, Frozen Pantry, Hunger Crack, …), C1 combat director |
| 25-game-story-clear | boss intros, story voice, stage clear and rewards |
| 26-game-cards-attacks | level-up cards, hero basic attacks |
| 27-game-hero-skills | hero uniques/skills (Yuzu, Cocoa, Taro, Sesame, …) |
| 28-game-combat-enemies | damage, kills, enemy behaviour |
| 29-game-bosses-vfx-update | boss AI, VFX helpers, `update()`, end of `class Game` |
| 30-bootstrap | canvas sizing, Phaser config, `new Phaser.Game` |
