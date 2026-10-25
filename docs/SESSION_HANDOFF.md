# v8.0.36 — hidden Bonus Challenges removed and published

Owner requested deleting wave Bonus Challenges entirely. Removed speed/hit/kill conditions, timers/hooks, failure Elite ambushes, random challenge Relic/currency payouts and bonus HUD objects/layout. Main objectives, normal EXP/completion rewards/healing, Hunt Elites and optional Supply Cache / Sugar Courier retained. No EXP/spawn rebalancing in this change.

Validation: npm run check and npm run build:www passed; built version 8.0.36 verified. Story mission regression rejects challenge payouts/ambushes and checks absent runtime hooks, with all 15 stage Hunt progression/recovery passing. No local gameplay/browser/screenshots; owner phone review pending.

Published runtime a53e05f612efba7a439b0aaf2f2c035fb978fc55 on claude/vampire-survival-mobile-game-yo9e8w. Immutable readback verified all 5 files / 3,062,238 bytes. Synced concurrent remote audio-order docs from a0b6a4d before editing. Changes: game.js, tests/story-missions.test.cjs, tests/hunt-recovery.test.cjs, CLAUDE.md, this checkpoint.

Deployment checked once: Pages 40163299927 and APK 40163299926 were in_progress; live website was 8.0.35. Let deployment finish in background. Preserve unrelated untracked art review files.
