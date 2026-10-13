# Taro T3 — Chain prototype, v7.8.12

Contract: [TARO_T0_CONTRACT.md](TARO_T0_CONTRACT.md). Previous path: [TARO_T2_TEMPEST.md](TARO_T2_TEMPEST.md). Chain (`storm`) now opts in alongside completed Tempest; pre-path and Smite stay legacy until T4. No new save keys, ranks, unlocks, costs, economy, combat controls or artwork.

## Chain loop

- Cadence 1.00C, root 0.75D. Bounce j grows by 12% per jump, capped at 1.60; the old 0.7 bounce multiplier is bypassed. Each volley snapshots eligible spawn identities and uses one shared victim set across all roots. A lone boss takes one basic hit even with extra roots.
- Start with four total victims per root (three bounces). Arc/weapon chains, Chainlord +2 and evolution +3 feed capacity capped at ten victims; excess gives +3% basic chain damage each, capped +15%.
- Raw root count retains level/awaken, storm +1, surge, Squall, gear/path talents, Stormcaller and evolution. Cap three roots; excess adds +5% basic chain damage per root, capped +25%. Roots resolve in order, each beginning with the nearest unused valid enemy within root range.
- Root range starts at 520 (760 awakened), applies purchased range/gear area once and caps at 900. Bounce range starts at 180, includes Chainlord ×1.4, evolution ×1.5 and range investment, capped at 360. Ignore dead/dummy/phase-protected targets; stop when the current run suspends or changes.
- D/C use the existing pure profile and shared signature weapon/infusion/Forge adapter (historical method name taroTempestProfile retained). Current power/rate/talents and mutation/evolution damage enter once. The basic scheduler applies player cooldown once and respects the 0.35s final cadence floor.

## Crispy Taro shrapnel and kill ownership

A lethal direct Chain basic or shared Chain Bolt hit queues one event at the victim's position, after 0.08 active seconds. Its offensive damage is snapshotted as 0.30D, independent of the Unique's own damage formula or victim's final rolled damage. At impact, choose up to three closest distinct live identities within 130. Exclude the corpse object/ID, revalidate each snapshotted victim and use central damage/rewards. Terminal shrapnel cannot emit further shards, combat hit/crit/kill procs or nth-hit progression; ordinary scalar bonuses, crit, loot/EXP and allowed recovery remain.

Admission cap eight per 0.25 active seconds. Overflow makes at most one small visual per bucket, with no delayed damage banking. Jobs follow gameSpeed; pause/level-up freezes their fuse, background gaps do not catch up, and death (before revival), retry, path/player changes, exit and shutdown cancel pending work.

Direct damage carries a one-shot entry ticket consumed at central damage entry. A nested external gear/infusion/recipe hit cannot inherit that ticket, even on the same enemy. The direct victim is revalidated after nested pre-damage emissions and before applying health; final kill handling checks the original active generation again after critical recipe emissions. This prevents stale pooled replacements and duplicate kill rewards. Queue lethal shrapnel immediately after health subtraction, before crit/kill callbacks can open level-up. No global suppression changes for unrelated heroes.

## Shared Unique and compatibility

Chain uses the existing active-play Unique implementation, shared with Tempest: unchanged level damage/jumps/forks/Echo Map/escape formula, at most 18 shared distinct victims and jump range <=400. Unique does not inherit basic root counts or growing bounce damage. Its direct Chain-path kills alone gain shrapnel. No-target cast is harmless but retains Dash readiness/haste/invulnerability. Tempest receives no shrapnel or extra charge/bombs from this reuse. Chain retains its original innate Dash origin shockwave and earned Dash procs; those are not Chain basic/Unique kills and cannot produce shards.

All purchased ranks/TP and exclusive capstones retain their effects and identifiers. Static Build damage, Squall counts, count/range excess conversions and existing scalar/conditional talent effects work now. T5 refines the complete three-path progression wording after Smite integration; T6 handles artwork.

## Verification and phone review

Required full npm check/build passed after final central guards; 1306 assets. Pure/helper/isolated actual central damage adapters verify growing/distinct roots, caps and investments, lone boss, candidate generation snapshots, lethal source tickets, nested same-victim/recycled/critical recipe cases, once-only rewards, terminal shrapnel targets/damage/caps/fuse/pause/revival and shared Unique formulas. T2 production movement/Dash/basic/nova/profile method hashes match the captured baseline. Original pre-path/Smite attack bodies still hash-match after reversing only scoped dispatch additions; Cocoa tests preserve Smite and all unrelated heroes. T1 proc/reward/Forge/recipe and T2 Tempest checks also pass.

Real Canvas Heroes/Stats passed seven sizes/all six previews, Hub passed seven sizes with normal/reduced motion. Final runtime changes after menu QA were confined to central combat guards. No headless combat simulation, measured balance or device FPS claims.

Phone checklist:
1. Taro → Chain in a pack: follow growing bounce damage, compare Arc and Squall upgrades; each victim should take one basic hit per volley.
2. Boss alone: extra roots must not repeatedly strike that boss; Chain should emphasize crowded targets.
3. Direct basic/Unique kill near adds: up to three nearby shards shortly afterward. Shard kills, gear effects and innate Dash must not recursively create shards.
4. Pause/level-up after a kill: shard fuse freezes. Death/revival/retry clears all pending shards. Test phase-protected bosses among adds and ordinary targets.
5. Compare saved talents/mutations/evolution and Tempest's walking/Dash loop; existing investment and Tempest behavior remain.

Next implementation: T4 Smite only (#3/#29/#33), using stable priority targeting and a terminal repeat. Preserve completed Chain/Tempest and shared ownership/cleanup.
