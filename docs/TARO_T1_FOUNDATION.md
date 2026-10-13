# Taro T1 foundation — v7.8.10

T0 contract: [TARO_T0_CONTRACT.md](TARO_T0_CONTRACT.md). Work packages: [TARO_REWORK_PLAN.md](TARO_REWORK_PLAN.md).

## What is ready

- Pure `taroCombatProfile` / `taroInvestments` calculate non-path D/C and bounded path counts/ranges without reading/writing Save, mutating ranks or multiplying existing `_pm` base factors twice. Callers supply signature weapon, infusion and Forge cadence factors explicitly. Future path dispatch must use the profile's conversion bonuses once; it must not reuse already-final victim damage.
- Each actual enemy acquisition route (`spawnEnemy`, `spawnElite`, `spawnMiniBoss`, `spawnBossEscorts`, `spawnFinalBoss`) tags Taro's enemies with a monotonically increasing spawn generation, including recycling live pool entries. `taroEnemyToken` and `taroTargetValid` reject recycled, dead, dummy, out-of-range and phase-protected victims.
- `taroPriorityTarget` keeps a valid mark within its tier, promotes it for Boss > Mini/Elite > normal, and uses HP/distance/spawn ID to break initial ties.
- Pure `taroMovementSample` returns accepted directional distance and charge gain. It excludes Dash, forced motion, discontinuities, wall-pushing and non-playing samples. T2 must call it after physics with the movement intent/speed/displacement flags for that segment; it is not collecting charge yet.
- One `_taro` run state has path/player identity, epochs, charge/sample/mark, active-play queue and tracked visuals. `syncTaroCombat` is idempotent for an unchanged path/player. Cleanup is connected to resetRelics, clearArtVfx, an independent once-per-scene shutdown hook, death before revival guards and path/player changes. Dormant state also clears when the hero changes.
- Queue capacity 64, bomb capacity 3, shrapnel admission 8 per 0.25 active seconds. Large wall-time gaps do not advance it; ordinary steps follow gameSpeed. Pausing during a callback holds other due events rather than dropping or executing them. Epoch or target generation invalidation cancels stale events.
- `taroWithDamage` / `taroDealDamage` keep source provenance through nested calls, reject invalid targets and always restore context with try/finally. Terminal events cannot downgrade themselves to a primary source. The actual central `damage`/`killEnemy` pipeline remains responsible for health, phase protection and legitimate rewards.

## Mixed reward/proc classification

Terminal context is Taro-only and currently absent from legacy live attacks:

- Skip infusion/tag status emissions, modifier hit/kill procs, nth-hit advancement, gear critical arcs, Unique critical bursts, splinter arcs and relic burst explosions. Existing enemy-owned hazards/splitting remain enemy mechanics.
- Keep ordinary damage scalars/crit, quests/EXP/loot/objectives, Forge kill accounting/barrier recovery, relic leech/harvest/shell/trophy, gear kill shields and existing recovery limits.
- Forge static conditional/direct numeric bonuses remain, while terminal hits do not advance its hit/mark counters or consume its direct-hit priming resources. Existing direct/DoT behavior remains unchanged.
- Recipes emitted from terminal hits/kills can use only heal/recover/shield/immune/cdr/vacuum/haste/cleanse. Damaging recipe emissions are skipped before counters or delayed jobs are created. Delayed noncombat recipe effects retain terminal provenance via `taroCarryContext`, and cancel on run invalidation; an indirect heal cannot reopen a damaging recipe chain later.

## Dormant boundary and next task

`taroNewState` always starts with `enabled:false`. No production code turns it on in T1. The old Basic Attack, three path definitions, Dash passive, Unique and Storm Charge remain live. Their attack methods are SHA-256 checked against a v7.8.9 baseline fixture. No save identifier/rank/cost or asset changes were made.

T2 must opt in ONLY the completed Tempest path, then implement its weak basic, accepted-Dash ownership, sweep, bomb, distance charge and nova using these helpers. Do not enable Chain/Smite or replace the old universal attack branch globally. On first Tempest opt-in, clear legacy `_taroCharge` and replace innate Dash shockwave only for that path. Keep old behavior elsewhere until T3/T4. Define enabled initialization consistently for retry/revival/path sync, not as a flag set once on the level-up card.

## Verification

`tests/taro-foundation.test.cjs` covers pure profiles/movement/target priority, pooled identities, queue caps and active-time/pause behavior, context restoration/recursion, cleanup/idempotence, numeric versus combat modifiers, healing/shields, Forge counters and delayed recipe provenance. It also checks the legacy attack-method baseline and lifecycle/acquisition hook coverage. Included in npm check. No Phaser combat simulation or balance claims.

Required full check/build passed (1306 assets). Real Canvas Heroes/Stats passed seven viewports/six previews; Hub passed seven sizes with normal/reduced motion. Pages run 38397981572 succeeded for runtime commit 5ef9937cfa920a24ea116f735fdffcaba1ab8f2a. Published version.json/GAME_VERSION 7.8.10 and dormant T1 helper/state/shutdown symbols were verified. See SESSION_HANDOFF for recovery.
