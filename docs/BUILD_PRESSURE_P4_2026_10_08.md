# P4 — Story build choices and late-wave pressure (v6.55.90)

## Build choices

Normal Story drafts for Strawberry/Momo and Mint with a chosen Build Path reserve their first selection for an eligible path upgrade. The second selection reserves an eligible shared Basic Attack upgrade when space allows. Remaining selections keep the existing weighted path/shared/universal pool, including modifiers, trades and stat cards. Selection is without replacement; rarity, potency, rank caps, path exclusions and previous investment remain unchanged.

When HP is below 40%, Sweet Recovery keeps a slot while preserving a path choice. Two-card drafts may replace the shared attack slot with recovery. A one-card normal draft prioritizes the path choice. Maxed or banished upgrades are never revived to fulfill a guarantee; exhausted pools fall back to existing shared/universal choices. Path selection, Infusion, Mutation, Evolution, Fusion and forced Relic screens keep their existing gates and behavior. No free mastery, EXP or guaranteed Evolution is added.

Recipe/Rift/Boss Rush/Endless/Tutorial and noSpecial random loot rolls keep weighted selection without the new guarantees. Story replay uses the same draft guarantees, while its dedicated combat meter remains unchanged. Other characters retain their current card behavior; extending character-specific builds remains P5 work.

## Late objective pacing

Story stages 3–15, including ordinary Hunt/fill/Capture/Escort and authored objective waves, use faster reinforcement cadence in the last two wave slots. Earlier waves and stages 1–2 keep their existing cadence.

| Wave slot | Refill interval | Batch | Refill threshold |
|---|---:|---:|---:|
| 1–3 | 1.6 s | existing 4 | 80% of live cap |
| 4 | 1.4 s | 5 | 80% of live cap |
| 5 | 1.2 s | 6 | 80% of live cap |

Timed Swarm keeps its prior cadence. Replay, special modes, miniboss and boss modes do not use this late-objective pacing. Live/shooter caps, finite reinforcement quotas, P3 limited kill-gate recovery, objective goals/rewards and P1 earned EXP remain unchanged. Faster kills can still run down finite reserves; no difficulty scaling is tied to player damage, level or build choice. Enemy HP, damage, boss mechanics and P2 recovery limits are unchanged.

## Validation

`tests/story-build-pressure.test.cjs` calls actual draft and director methods across six paths and all 15 stages. It verifies available path/shared choices, duplicate prevention, critical healing, one-card drafts, banish/exhaustion, weighted loot and special-mode isolation, Mutation/Evolution screens, late cadence, hard live caps, finite quotas and replay exclusion. Added to `npm run check`; prior P1/P2/P3 and hero build regressions remain included.

Cadence values are initial tuning. Owner mobile playtesting remains needed for card readability, build pacing and pre-boss difficulty, especially stage 3 and the final objective of each chapter. P5 remains pending.

Final verification: npm run check and npm run build:www both passed.
