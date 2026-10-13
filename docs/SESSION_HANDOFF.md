# Latest session checkpoint
Updated: 2026-10-13 (Asia/Bangkok).

## Objective completed locally — publication next
Forge v7.8.5: fix Back loop, use one random currency roll on all rows, shorten mod text.
- Back now exits Forge to Gear & Power; next Back reaches Hub.
- Sustain installs one result immediately. Utility rolls the whole compatible row without family selection. Auto uses selected row/currency.
- Short effect labels; full conditions in details. Previously paid Sustain choices stay recoverable without another charge.
- Existing mods, tier retention, effects and balances preserved; catalog remains 150 / 78 active / 72 gated.

## Verification completed
Full npm check/build passed. Real Phaser menu: 21 states across seven viewports, all-row Roll/Auto, exact currency charges, old paid choices, text/touch bounds and details. Separate native-menu navigation check confirms Forge → Gear & Power → Hub. No headless combat simulation. Phone feel remains owner QA.

## Files and recovery
Changed: game.js, tests/forge-150.test.cjs, tests/forge-redesign.test.cjs, CLAUDE.md, docs/CLAUDE_HISTORY.md, docs/FORGE_SIMPLIFICATION.md, this checkpoint.
Checkout: C:/Users/Norrasates/Documents/Codex/2026-10-13/new-chat-2/work/game. Local QA logs/scripts in its parent work directory (ui-check-785.cjs, ui-back-785.cjs).
Branch claude/vampire-survival-mobile-game-yo9e8w. Remote rechecked at a3fef4d2575cdeadbb5cea8e28a8b3cc894e3ce4; previous live v7.8.4.

## Exact next action
Create recoverable local commit, upload with connected GitHub tree/commit/ref tools; require exact tree equality and expected remote head. Verify Pages success and published version.json / GAME_VERSION 7.8.5, then update this checkpoint. All changes currently local only; no publication claimed yet.
