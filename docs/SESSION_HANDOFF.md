# Latest checkpoint — v7.8.56 Wisp / Spark balance

Updated 2026-10-18 Asia/Bangkok. Owner authorized the proposed C2-4 Seasonal Wisp reduction and slightly harder miniboss fights for the current build, interpreted explicitly as Spark (smite). Base 22a7c52eacbb7d307f52be1168227cf938da1718 on claude/vampire-survival-mobile-game-yo9e8w.

Implemented: stageIndex 8 siege base HP 260→130 only; existing Wisp fan shots, guard reduction, stats/scaling and other stage siege HP preserved. Spark miniboss damage ×.85 once in taroDealDamage, including spark/sparkChild Static Charge and Storm Mark. Bosses, mobs, elites and other Taro paths unchanged. GAME_VERSION/English CHANGELOG 7.8.56; README/summary/CLAUDE/C2-4 QA updated.

Verification: isolated actual-method tests cover Spark target/path scoping, once-only Static Charge scale and stale pooled target guards. Batch9 compares original combat fixture with one explicit Wisp HP exception for both animated/fallback art. npm run check and npm run build:www both passed before publication; no headless gameplay session. Owner phone feel/balance/FPS acceptance remains pending.

Publication procedure: one non-forced expected-head commit to main game branch only; exact local/remote tree equality required before branch update. Verify Pages deployment/live version after publication. Commit containing this checkpoint identifies the exact change. No art, cloud, secrets or workflow modifications.

Next: owner tests C2-4 Wisp kill time and Spark miniboss fight on x1; compare same equipment/talents. Do not stack further nerfs based on pre-v7.8.54 logs. Play Store remains parked.
