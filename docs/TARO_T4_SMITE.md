# Taro T4 - Smite prototype

Implemented 2026-10-13, runtime v7.8.13. Scope: #3 Thunder Smite, #29 Judgement Strike, #33 Lightning Rod from TARO_T0_CONTRACT.md. Numbers are prototype starting values; owner reviews actual phone combat.

## Target and primary attack

Lightning Rod automatically marks a damageable enemy within basic root range, Boss > Mini/Elite > normal. Within a tier choose highest current HP, nearest distance, stable spawn ID. Retain a valid same-tier mark despite HP changes; promote on higher tier, replace when dead, out of range, recycled or phase protected. One tracked gold ring follows the target, hides on pause, and is destroyed on death/reset/exit. No manual aim, taunt or global debuff. Basic upgrade sync does not clear a valid mark/pending repeat.

Primary interval 1.35C and damage 1.80D, using the existing shared pure profile and weapon/infusion/Forge adapter (historical taroTempestProfile name). Gear/talent range works once, root radius 520 / awakened 760, cap 900. Extra raw roots from surge, skill/awaken, gear, talents, mutation/evolution convert to +8% primary/repeat damage each, capped +40%, rather than additional full strikes.

## Repeat and add splash

One accepted primary hit on a surviving Boss/Mini/Elite queues a repeat after 0.22 active seconds, damage 0.90D with the same extra-root factor. Offensive profile, attack ID, range and original spawn identity are captured. No retarget: death/despawn/pool reuse/range loss/phase protection makes it fizzle. New primary casts can pick normally. Unique, Dash, gear and terminal hits cannot schedule repeats. Pre-path Storm Charge remains legacy; selected Smite no longer enters the ten-charge x6 Judgment branch.

Arc ranks/weapon chains/Chainlord +2/evolution +3 convert to up to three add splashes within 150 of primary impact, 0.25D each. Excess arc capacity adds +5% splash damage each, cap +25%. Snapshot candidate generations before the primary damage callbacks; exclude the primary, select distinct nearest valid adds at the next active update, revalidate each before damage. No newly spawned/recycled victims enter that volley. Queue the splash before critical/kill callbacks can open level-up, so a legitimate lethal primary keeps its earned splash after resume. No ordinary chain bounce or extra-root multiplier on splash.

Repeat/splash are terminal: retain central scalar/crit/defense/reward/recovery handling, suppress hit/crit/kill combat emissions, nth-hit counters and recursion. The existing queue is bounded at 64 jobs. Active-play time follows gameSpeed, freezes on overlays/pause/level-up, rejects background catch-up and cancels on death before revival, retry/stage/path/player changes, exit/shutdown. No wall-clock damage callbacks.

## Unique and progression compatibility

Shared Chain Bolt prefers a valid Rod first target within its own 760 radius, otherwise applies priority to the cast-snapshotted candidates. If the preferred identity becomes invalid before execution, use the same priority fallback, never a recycled replacement. Remaining jumps/forks retain nearest distinct targeting and the original level damage/range/count, max 18 shared victims / jump distance 400. Smite Unique makes no repeat/splash/shrapnel; no target makes a harmless ring and keeps existing Dash-ready/haste/iframe rewards.

One-shot direct entry tickets for Smite primary/Unique validate the original generation after nested pre-hit emissions and before final kill handling. External same-victim gear/recipe kills cannot steal ownership, damage a recycled replacement, or grant duplicate rewards. Primary secondary admission occurs directly after health subtraction, before critical recipes/reward callbacks. All saved IDs/ranks/costs, capstone exclusivity, basic gates and purchased scalar/range/conditional investments remain; p_judge big-target and p_overload lightning damage remain. Existing Chain/Tempest resolvers and innate Smite Dash shockwave stay. T5 revises complete progression wording; T6 handles final assets.

## Verification and phone checklist

Full npm check passed. Pure formulas and isolated actual central-damage adapters cover priority/stability, tier promotion, ring reuse/cleanup, D/count/range conversions, one repeat and snapshot/fizzle, bounded terminal splash, pause/speed/epoch, lethal primary level-up, pool callbacks, external ownership and Unique priority/escape. Finished T2 method hashes and T3 Chain resolver body hashes stay identical. Build passed (1306 assets). Real Canvas Heroes/Stats seven sizes/all six previews and Hub seven sizes normal/reduced motion passed. Smite definition/save/progression fields match the prior baseline except its description. Publication state is in SESSION_HANDOFF.md. No headless combat simulation or measured balance/FPS claims.

1. Smite against a lone boss: one primary, one smaller repeat; no mob-charge requirement.
2. Boss with adds / several elites: gold mark prefers priority and stays stable among equal tiers.
3. Target dies, phases, or leaves range before repeat: repeat fizzles without jumping to another enemy.
4. Compare Arc versus surge investments: limited nearby add splash versus stronger primary/repeat. Test old saved talents, mutations and evolution.
5. Unique starts from the valid marked priority target, then ordinary chain; Dash escape benefits remain. No target is harmless.
6. Pause/level-up/resume, death/revive/retry, another path next run: no delayed pre-death hits or stale marks. Compare finished Chain/Tempest behavior.

Next: T5 talents/progression descriptions, with owner combat feedback. No T6 artwork or #25 capacitor in this package.
