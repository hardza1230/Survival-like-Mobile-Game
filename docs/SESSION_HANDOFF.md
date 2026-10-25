# v8.0.36 — remove hidden wave Bonus Challenges

Owner requested deleting Bonus Challenges entirely. Removed speed/hit/kill conditions, timers and callbacks, failure Elite ambushes, random challenge Relic/currency payouts and all bonus HUD objects/layout. Main objectives, normal EXP/completion rewards/healing, Hunt Elites and optional Supply Cache / Sugar Courier are unchanged. Existing story-missions tests now reject challenge-only payouts/ambushes; all 15 stage Hunt recovery still passes. Version/changelog updated.

Synced remote a0b6a4d before editing, preserving concurrent audio-order docs. Changes: game.js, tests/story-missions.test.cjs, tests/hunt-recovery.test.cjs, CLAUDE.md and this checkpoint. Validation: npm run check and npm run build:www passed; built version 8.0.36 verified. Next: commit, publish vampire branch, immutable byte verification and one deployment check. No local combat/browser/screenshots. Preserve unrelated untracked review art.
