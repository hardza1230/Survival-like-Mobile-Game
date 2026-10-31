# Yuzu Seedlings (v8.0.67, owner picked 1ก 2ก 3ก 4ข)

Small weak minions next to the one immortal companion.

- Card `seedling` "Seedling Sprout" (shared Yuzu card, max 3): ranks 1/2/3 → 1/3/5 Seedlings, Evolution +2 (max 7). `YZ_SEED_COUNT`, `YZ_SEED_EVO`.
- Each hit ≈ 12–18% of `yuzuPower()` (companion unit), cadence `yuzuCd(1–1.1s)`. Meter source `yuzu.seedling` / `yuzu.seedling_pop`.
- Mortal: every .6s an overlapping enemy removes 1 HP (boss/mini 3). At 0 → pops, regrows after `YZ_SEED_REGROW` 8s.
- Kind by Build (`YZ_SEED_KIND`): before Build `bite` (hp 3, ×.18) · Pomelo `tank` (hp 8, ×.12, `yuzuTaunt` pulls non-boss enemies within 110px) · Lime `throw` (hp 2, keeps ~190px, `yuzuShot` source `seedling`, `mini` = no Zest Splash) · Blood Orange `pop` (hp 2, ×.12, pop = `yuzuArea` r70 ×.6 + Sour tag).
- Art: existing `minion_yuzling` sheet at 30px, tinted per kind. No new textures.
- Code: `yuzuSeedMax / yuzuSeedSpawn / yuzuTickSeeds / yuzuSeedPop / clearYuzuSeeds` (called from `tickYuzuCrew`, cleared in `clearYuzuCrew`, owner/basic/kind/epoch guard).
- Tests: `tests/yuzu-companions.test.cjs` v67 block.
