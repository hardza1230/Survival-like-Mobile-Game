# P5 — Extend Story build drafts to all heroes (v6.55.91)

P4 draft guarantees now extend to Yuzu, Cocoa, Taro and Sesame across their 12 existing paths. Strawberry/Momo and Mint retain their existing specialized eligibility rules and six paths. Generic path upgrades form the path pool; the hero’s base attack upgrades and unlocked infusion upgrade form the shared pool. No new paths, attacks, assets or power values are introduced.

Berry has no authored Build Path, so Story drafts reserve an eligible core attack upgrade instead. Before choosing a path, every hero gets the same core-choice protection. Available selected-path upgrades take priority in the first slot; an eligible shared core attack fills the second when space allows. Remaining slots use the existing P4 weighted pool. Card rarity/potency, upgrade caps and authored effects remain unchanged; other paths never enter the upgrade pool.

When HP is below 40%, a recovery option may replace an extra choice but preserves one selected-path upgrade, or one eligible core attack when no path upgrade remains. A one-card normal draft prioritizes that build choice. Maxed/banished upgrades never return to satisfy a guarantee. If attack pools are exhausted, existing modifier/trade/stat/recovery fallbacks remain available. Path selection, Infusion, Mutation, Evolution, Fusion and forced Relic screens retain their current gates; no mastery or EXP is added for free.

New guarantees are Story-only, including Story replay. Recipe/Rift/Boss Rush/Endless/Tutorial and noSpecial random loot keep their prior behavior. Strawberry/Mint specialized grouping is unchanged in those modes. P1 earned EXP and rewards, P2 pickups/recovery, P3 staged Hunts and P4 reinforcement cadence/caps remain unchanged.

## Validation

`tests/all-hero-drafts.test.cjs` exercises actual draft methods for the 12 additional paths and all seven heroes before path selection, including Berry. It covers path/core choices, no other-path leakage, duplicate prevention, HP recovery with 1/2/3 slots, every path upgrade’s real rank/effect application, maxed/banished/exhausted pools, stage-local path replacement, milestone screens and mode/random-loot isolation. Added to `npm run check` alongside P1–P4 regressions.

## Playtest-dependent tuning

Owner confirmed P4 has not yet been played and requested keeping current values. No crowd, cadence, enemy/hero power or boss balance is retuned in P5. Implementation of the P1–P5 sequence is complete; mobile gameplay and balance validation remain pending. Future tuning requires actual feedback, especially the 12 newly covered paths, Berry before bosses, recovery-versus-build choices and stage 3 late objectives. Automated results do not establish mobile balance or frame rate.

Final verification: npm run check and npm run build:www both passed.
