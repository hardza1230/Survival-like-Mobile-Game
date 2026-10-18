# Latest session checkpoint — project documentation refresh

Updated 2026-10-18 Asia/Bangkok. Owner requested README and project details brought up to date.

## Verified base

Repository hardza1230/Survival-like-Mobile-Game, branch claude/vampire-survival-mobile-game-yo9e8w, parent e32cc3703a541c680cf712690399d1959dfd85c5 (GAME_VERSION 7.8.55, 17 Oct).
Read AGENTS.md, CLAUDE.md and AGENT_WORKFLOW.md. Confirmed runtime via the GitHub blob route (the file-content tool returned empty for the >2 MB game.js; blob fetch returned full source).

- Story: 3 ready chapters / 15 stages; CHAR_ORDER has Momo, Mint, Cocoa, Taro, Yuzu, Sesame. Berry is outside current roster.
- Forge registry: 150 entries, exactly 78 active / 72 planned.
- C2-4: Seasonal Harvest, 10s seasons, 12 petals each, 1 per regular kill / 3 Elite, 50% overflow credit, no failed trials.
- Hero VFX 20: fully wired 21/21 v7.8.45–46. Temple UI 21: fully wired 34/34 v7.8.49; layout/color polish v7.8.50. Do not redo integration.
- APK at base passed: Actions 39042341016. Main-branch Pages 39042341134 cancelled; other-branch Pages 39042552545 failed. Live v7.8.55 not confirmed.
- Store icon, feature graphic and four screenshots exist; freshness/acceptance not verified. Signed AAB workflow bundles the game; debug APK uses Pages.
- Earlier v7.8.44 notes say run_stats backend was not created. Backend/cloud/secrets were not queried or modified in this task.

## Documentation changes

README.md, docs/PROJECT_SUMMARY_TH.md, CLAUDE.md, docs/HANDOFF_NEXT_AI.md, docs/SESSION_HANDOFF.md, docs/C2_4_QA.md, docs/RELEASE_SIGNING.md, docs/STORE_LISTING.md, docs/art_orders/README.md and docs/art_orders/16_CURRENT_ART_BACKLOG.md.

Updated current counts/version/features, art integration status, QA route, build/deployment distinctions, project start history and release draft. Historical handoff entries are explicitly labelled historical. No game.js, assets, package version or workflows changed; no GAME_VERSION bump.

## Checks and publication

Documentation facts checked against current source, Forge registry, workflow scripts, art orders and Actions evidence. Relative Markdown file links checked against the repository tree and the changed-file set. Inspect the commit containing this checkpoint for the final change and publication SHA; it is intentionally not embedded in its own body.

Publication record: this checkpoint belongs to the documentation-refresh commit on the main game branch; use that commit and branch history for the final SHA. The publishing procedure uses a non-forced expected-head update and exact changed-file read-back. Documentation paths do not trigger current APK/Pages push filters; do not claim this refresh redeployed the game. No gameplay tests, combat simulation, secret access or production service updates are required for this documentation-only change.

## Next work

First resolve/verify main-branch Pages deployment and published version.json if owner requests live update. Then owner phone QA: C2-4 first clear/replay, equal-gear Taro Arc/Spark/Sentry benchmarks, Temple UI and Hero VFX readability/FPS. Preserve current gameplay while collecting evidence. Play Store remains parked.
