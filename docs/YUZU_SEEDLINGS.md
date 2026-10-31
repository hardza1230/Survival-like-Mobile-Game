# Yuzu Seedlings (v8.0.67, owner picked 1ก 2ก 3ก 4ข)

Small weak minions next to the one immortal companion.

- Card `seedling` "Seedling Sprout" (shared Yuzu card, max 3): ranks 1/2/3 → 1/3/5 Seedlings, Evolution +2 (max 7). `YZ_SEED_COUNT`, `YZ_SEED_EVO`.
- Each hit ≈ 12–18% of `yuzuPower()` (companion unit), cadence `yuzuCd(1–1.1s)`. Meter source `yuzu.seedling` / `yuzu.seedling_pop`.
- Mortal: every .6s an overlapping enemy removes 1 HP (boss/mini 3). At 0 → pops, regrows after `YZ_SEED_REGROW` 8s.
- Kind by Build (`YZ_SEED_KIND`): before Build `bite` (hp 3, ×.18) · Pomelo `tank` (hp 8, ×.12, `yuzuTaunt` pulls non-boss enemies within 110px) · Lime `throw` (hp 2, keeps ~190px, `yuzuShot` source `seedling`, `mini` = no Zest Splash) · Blood Orange `pop` (hp 2, ×.12, pop = `yuzuArea` r70 ×.6 + Sour tag).
- Art v8.0.69 / order56: four dedicated8-frame sheets at30px, pop/regrow/seed-shot/sour-burst effects and card icon. Native `minion_yuzling`/oldFX remain fallbacks. Exact sources/delivery: `assets/incoming/yuzu_seedlings/`; half-size runtime: `assets/art/yuzu_seedlings/`. Stage-only Yuzu loading, no extra boot decode.
- Code: `yuzuSeedMax / yuzuSeedSpawn / yuzuTickSeeds / yuzuSeedPop / clearYuzuSeeds` (called from `tickYuzuCrew`, cleared in `clearYuzuCrew`, owner/basic/kind/epoch guard).
- Tests: `tests/yuzu-companions.test.cjs` v67 block.

## Order56 presentation (v8.0.69)

Manual sim-time poses keep feet at120/128;4walk frames follow distance, anticipation uses the last.1s of existing cooldown, release follows the existing hit and recovers through frames5–7. Rendering never emits damage. Pause/reduced/stale owner/epoch/missing art supported; up to7small owned shadows cleaned on pop/path/count/menu. Regrowth reuses the dead actor sprite in the last.45s of the unchanged8s timer (reduced: final still.12s). The minion remains dead until the original respawn call.

Six-frame death/sour effects share the existing4sprite budget; black donor is mechanically converted to straight alpha for NORMAL blend. Throw retains original18px projectile/speed/collision/pool with4painted frames. New card icon isic_yz_seedling; v59icon manifest still48, total bound art now49. All v67numeric effects/AI unchanged. See tests/yuzu-seedlings-art.test.cjs and incoming QA_REPORT.json. No battle simulation/game screenshots; owner phone appearance/FPS review pending.
