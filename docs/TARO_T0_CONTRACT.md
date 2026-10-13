# Taro T0 — combat design contract

Completed: 2026-10-13. Scope: source audit and executable design; no runtime edits. Baseline local and remote HEAD: 7ba55ce5e4617900e9df83d37cfe87c1ea61935a, game v7.8.9. The owner authorized T0. The values below are the chosen prototype starting point, not measured combat balance. T1 prepares the required helpers; T2–T4 implement paths sequentially.

## 1. Identity and decisions

- Keep the Rift Bolt Compass, violet Storm explorer identity, existing joystick, Dash and Unique buttons. No new combat button or manual target selection.
- Internal paths remain `storm`, `smite`, `tempest`; display names Chain, Smite, Tempest. Chain benefits from crowded targets; Smite attacks important targets; Tempest turns deliberate movement into damage.
- Keep Unique `pathRecall` / Taro Chain Bolt as a shared chain attack and escape reset. Do not turn it into three separate skills in this rework.
- Replace the old universal mob-hit Judgment mechanic after choosing a path. Smite gets its repeat strike directly, including against a boss without adds. Tempest alone gets movement charge. Chain gets increasing bounce power and terminal shrapnel. Before path choice, retain the existing attack and Storm Charge.
- Preserve unlock, base hero stats, economy, difficulty/rewards, equipment and Unique Mastery costs. No Taro Boba Capacitor in the first three-path implementation.

## 2. Verified runtime map

References are symbols, with baseline line numbers as navigation aids; implementations will move them.

| Existing system | Verified behavior in game.js | Rework decision |
|---|---|---|
| `CHARACTERS.taro` (3146), `CORE_UNLOCK_STAGE` | Weapon riftCompass, Unique pathRecall; speed 1.14, damage 1.02; unlock stage index 5 | Keep |
| `BASIC_ATTACKS.taro` (3270), `syncBasicAttack` (11845) | power +12%/rank; rate uses 0.92^rank cooldown; arc/surge add counts. Basic skill level rises with mastery, capped at 5 | Keep keys/rank/mastery rules; adapt arc/surge by selected path below |
| `BASIC_PATHS.taro` (3359), `pathMods` (3512) | storm damage 0.75/count +1; smite damage 1.8/cooldown 1.35; tempest damage 0.65/cooldown 0.62. Path damage and cooldown already enter shared calculation | Replace path bases once, not again inside each hit |
| `castSkill('thunder')` (12793) | Closest roots within 520 (awakened 760); extra roots from skill level/surge/count. Each root chains with its own hit set, bounce damage 0.7 of root. Different roots can currently revisit victims | Preserve pre-path; selected-path dispatch uses bounded ownership and hit sets |
| `taroChargeGain` (12064) | At 10 hits on non-Boss/non-Mini targets, strike a live Boss/Mini for 6x passed damage. Elites currently count as charge targets. Holds full without a Boss/Mini; next call can release it | Pre-path only. Clear charge when selecting a path; never run beside new path effects |
| `castPathRecall` (6805) | Unique L: 4+L victims, jump range 250+16L; Echo Map adds 2 victims/+40 range. L>=3 has two forks with a shared hit set. Damage (9+7L)*player.dmgMul*(1+0.22*(L-1)), losing 4.5% per jump. Starts at nearest within 760 | Keep formula and levels. Smite chooses its marked priority victim as first target. No additional `uniquePower()` multiplication: current function already has its own level curve |
| Unique escape rewards | Sets Dash ready/cooldown zero; haste duration 1+0.38L (+0.55 Echo Map), movement multiplier 1.18; iframe at least 0.32+0.06L | Keep. Does not execute a Dash or create a bomb by itself |
| `doDash` (6539), `charPassiveOnDash` (15345) | Dash starts at player position, speed 560, duration 0.2s, base recharge 1.1s, iframe >=0.28. Passive hits radius 95 for (10+4*stageIndex)*player.dmgMul*charPassiveScale | Chain/Smite keep origin shockwave. Tempest replaces it with the Flash Step sweep; never fire both |
| `CHAR_TALENTS.taro` (3855), `CHAR_PASSIVES` | hp/spd/cdr/crit/echoPath plus universal Unique Mastery; passive scaling 1..1.9 from character level | Keep ranks and their effects. Echo Map's current description incorrectly mentions recorded path/blast; update description to actual chains/range/haste in implementation |
| `PATH_TALENTS` (3973), `talentBranch` / `applyPathTalents` | root/a1/a2/b1/b2 overrides; c1/c2 inherit generic HP/guard; capA/B/C are exclusive. Save keys `pt_<path>_<slot>` | Keep IDs, costs, ranks and exclusive-cap rule. Initial prototypes keep current effects; required interpretation below |
| `chainlord` / `stormcaller` mutation and `evolved` | chainlord adds 2 bounces and 1.4 jump range; stormcaller adds 2 roots and 1.2 damage. Evolution adds 3 bounces/2 roots, 1.5 jump range and 1.2 damage | Preserve Chain semantics with bounds. Convert counts for Smite/Tempest below; shared 1.2 damage bonuses apply once |
| `m_over/m_field/m_step/m_judge/m_ion/m_focus` (3455), fusion `f_tempest/f_skyjudge` (3496) | Extra arcs, pulse, Dash nova, boss bonus, kill burst, nth hit; Living Tempest arc proc and Sky Judge boss bonus | Retain acquisition/IDs. Direct path hits may trigger existing hooks; secondary effects cannot trigger further hit/kill combat procs |
| `damage` / `killEnemy` (14164/14218) | Central pipeline applies attack rolls, conditional path/gear/Forge/relic bonuses, infusions, hit/crit hooks, phase gates and kill rewards | Extend with Taro-scoped event context. Keep central damage/reward handling; no second custom health subtraction |
| `initBasicAttack`, `resetRelics`, `resetStageLoadout`, stage/retry initialization, `update` | Basic state is run-local; charge reset by resetRelics. Main update advances only in play with gameSpeed-scaled dt. Some existing delayed attacks allow levelup | New Taro effects use play-time scheduling, run/path epochs and pooled-enemy spawn identity. Suspend while not playing |
| `castEchoStep` (13801) | Separate echoStep skill uses recorded trail and echoPath | Leave alone. It is not the current Taro Unique, despite stale talent wording |

## 3. Damage and cooldown units

All radii/distances below are world pixels, not UI pixels. Seconds mean active game time; gameSpeed changes their real-time duration with the rest of combat.

Define D as one non-path Taro thunder root's pre-target damage at current basic skill level L:

`D = (14 + 4.2*L) * player.dmgMul * BALANCE.skillPower.thunder * signatureWeaponDamage * (1 + 0.12*powerRank) * infusionDirect * mutationDamage * evolutionDamage * pathUpgradeAndTalentDamage`

`pathUpgradeAndTalentDamage` excludes the path's BASE multiplier, which is specified in section 4. Build D from the existing damage factors; do not divide an already multiplied amount or multiply basic._pm.dmg twice. Damage passed to central `damage()` has not yet received critical, flat/rolled attack, target, Forge, conditional or relic multipliers. Each target applies those once. Never calculate a secondary hit from the victim's final damage number.

Define C as the existing non-path attack interval at current L, including rate rank, weapon cooldown, player cooldown and Forge cadence, excluding the path BASE cooldown. `_cdBase('thunder', L)` is max(1.4, 2.2-0.08L); existing Awaken adjustments stay. Keep the minimum cadence consistent with global caps; selected Taro attacks additionally have a 0.35s final minimum. Only basic attack rate modifies basic cadence; it does not accelerate Dash, bombs or movement-charge thresholds.

For delayed repeat/bomb/shrapnel, snapshot D and offensive build inputs at creation. Conditional target bonuses, defenses and phase protection resolve at impact. This prevents upgrades during a pending event from charging the multiplier twice.

## 4. Initial path rules and numbers

### Chain (`storm`)

- Basic interval 1.00C. Root damage 0.75D. Select nearest valid enemy within 520; awakened uses 760 as before.
- Start with 3 bounces (4 total victims). Add current arc rank, weaponChains, chainlord +2 and evolved +3; total victims per root capped at 10. Excess count past this cap becomes +3% chain damage per excess, capped +15%.
- Bounce j deals `0.75D * min(1.60, 1+0.12*j)`, where root j=0. This replaces old 0.7 bounce damage; never combine both formulas.
- Jump distance 180, multiplied by chainlord 1.4 and evolution 1.5. Range investments apply once; total jump distance capped at 360.
- Root count uses the current raw thunder root count, including storm +1, surge, skill-level/awaken, count gear/talents/mutation/evolution; cap at 3. Excess roots give +5% basic-chain damage each, capped +25%. Roots resolve in order with one shared victim set per volley; a boss alone receives one hit per volley. Unique is a separate attack.
- A lethal direct Chain basic/Unique hit creates one Crispy Taro shrapnel event at the victim position after 0.08s: up to 3 closest distinct live enemies within 130, each taking 0.30D. No hit on the corpse, no shrapnel-on-shrapnel, no chain-on-shrapnel. Queue cap 8 per 0.25s active-time bucket; overflow coalesces visual feedback only, no saved future burst. Initial prototype uses bounded instant shard hits; projectile artwork comes later.
- Strength: dense packs and longer bounces. Weakness: lone-target damage and lack of charge nova.

### Smite (`smite`)

- Basic interval 1.35C. Primary strike 1.80D. Target automatically chosen within 520 (760 awakened): Boss, then Mini/Elite, then normal enemy. Within a tier: highest current HP, then nearest, then stable spawn ID. Exclude dummy/dead/phase-invulnerable targets from offensive selection.
- Keep a Lightning Rod mark while the target is valid/in range. Re-evaluate if a higher tier enters range or the mark becomes invalid. Do not swap within the same tier merely because HP changes. Mark is Taro targeting information, not a taunt/global damage debuff.
- Primary hit on Boss/Mini/Elite schedules one repeat after 0.22s for 0.90D. Repeat retains the original spawn identity and target; no retarget if it dies/despawns/leaves range/becomes invulnerable. No repeat-on-repeat. New basic cast may select another target normally.
- Unique first target prefers the current valid Rod target, then the same priority helper within its own 760 range. Other auto-acquired skills, allied summons and gear procs retain their targeting. Thus #33 directs Taro's primary lightning/Unique, not every unrelated attack in the game.
- No normal Chain bounce. Arc-derived bounce capacity instead produces up to 3 nearby add splashes within 150 of primary impact, each 0.25D; a victim can be hit once per volley and primary is excluded. Splash is terminal. Excess above 3 gives +5% splash damage each, capped +25%.
- Additional raw roots (surge, skill-level, gear count, mutation/evolution) become +8% primary/repeat damage per extra root, capped +40%; do not schedule extra full strikes. `p_judge` retains +15% big-target damage/rank; `p_overload` retains +10% lightning damage/rank.
- Old 10-charge x6 Judgment is disabled. New repeat works on a lone boss immediately.
- Strength: important targets. Weakness: slower attacks and limited add clear.

### Tempest (`tempest`)

- Basic interval 0.85C (replaces 0.62C), primary nearest-target damage 0.65D; one basic root, no Chain bounces. The rest of its budget goes into movement effects.
- Charge 0..100, initially 0. Walk 720 world px to fill (+100/720 per accepted px). Count actual intentional joystick/keyboard movement; no wall-pushing, knockback, teleport, reposition or menu motion. Measure post-physics segments; reject discontinuities and rebase the sample on pause/resume/reset. Clamp accepted movement against actual movement-speed envelope, rather than trusting raw coordinate changes or joystick input alone.
- An accepted Dash adds exactly 15 charge once. Exclude its travel distance from walking charge. Failed Dash and merely restoring Dash readiness add nothing. Clamp at 100; no overflow banking. No charge decay while stationary.
- At full charge, automatically emit one Static Discharge centered on the player's current position when a damageable enemy exists within radius 180: 1.40D to each victim once. Consume 100, with minimum 1.5s between nova releases; full charge holds if there are no valid targets or the cooldown is running. No charge from damage/kills/Unique/nova/bomb.
- Flash Step: follow actual Dash segments for up to the current 0.2s Dash, swept half-width 32; 0.35D per crossed enemy, once per Dash. Stun normal enemies 0.35s; Boss/Mini/Elite receive damage but no hard stun. Does not extend distance, bypass collision rules or add iframe time. Replaces the old origin shockwave on this path. Apply current character-passive scale to sweep damage only, preserving passive progression.
- One Thunder Dash Bomb at each accepted Dash origin: fuse 0.45s, radius 120, damage 0.65D, each victim once, terminal. At most 3 pending bombs; rejected-overflow bombs do not explode early. Dash is never rejected because the bomb pool is full. Existing baseline cooldown makes this cap unlikely, but Unique can refund Dash.
- Arc-derived capacity (arc, weapon chains, chainlord +2, evolution +3) adds 8px nova radius each, capped +60px. Chainlord's range multiplier becomes +15% nova radius; evolution's 1.5 range becomes +15% nova radius, total final nova radius capped 280. Do not apply those multipliers to basic range or Dash sweep.
- Extra raw roots convert to +8% nova/bomb damage each, capped +40%; no extra nova, bomb or sweep. Keep stormcaller/evolution 1.2 damage factors once in D. `p_gale` becomes -6% Dash recharge/rank, not basic cadence; `p_farstrike` retains +12% damage beyond 300px/rank where its condition can actually apply (primarily basic attacks).
- Strength: kite paths and escape damage. Weakness: trapped/slow movement. Standing still retains weaker auto attack, stored charge and existing generic modifier effects, but produces no new movement charge.

## 5. Shared Unique contract

Keep the audited level formula, jump count/range, fork threshold and Echo Map bonuses. Maximum 18 distinct victims per cast across forks, jump distance <=400 and no negative jump coefficient. Retain current 8.5s base cooldown and existing Unique Mastery scaling/costs (levels 1–4, TP 3/5/8). Existing cooldown modifiers remain.

- Chain: ordinary Unique chains; does not inherit Superconductor growth, extra basic roots or mutation counts. Direct Unique kills can create shrapnel.
- Smite: priority first victim, ordinary remaining chain sequence; no automatic repeat from Unique. Rod is a target preference only.
- Tempest: ordinary Unique chain; Dash readiness/haste reward supports movement. No free charge/nova/bomb at Unique press. A later actual Dash creates its normal effects.
- No valid Unique target: consume existing cooldown and give escape rewards; replace unreachable damaging fallback with a harmless cast ring. No free damage around the player without a valid target.
- No refund stacking: setting Dash ready a second time while already ready does not store a second Dash. An active Dash is not restarted by Unique.

## 6. Effect ownership and proc policy

Each event has run epoch, path epoch, source kind, attack ID and target spawn identity (object reference alone is unsafe for pooled enemies). Validate active player/state/path and target at execution.

| Source | Owner | Existing hit/crit combat procs | New secondary effects |
|---|---|---|---|
| Pre-path thunder | Existing thunder branch | Existing behavior | Old Storm Charge only |
| Chain direct root/bounces / shared Unique | Taro primary resolver | Allowed existing behavior with current generic guards | Chain lethal hits can create one shrapnel; no other path effects |
| Smite primary | Taro primary resolver | Allowed | One repeat for a big target; optional bounded add splash |
| Tempest weak basic | Taro primary resolver | Allowed | None |
| Chain/Smite origin passive | Existing passive | Existing behavior | None |
| Tempest sweep | Taro Dash resolver | Allowed once per victim | None; charge is attached to accepted Dash, not hits |
| Repeat, add splash, shrapnel, nova, bomb | Taro secondary resolver | Suppress new hit/crit/on-kill COMBAT emissions, nth-hit counters and recursion; keep numeric conditional bonuses/crit | None |
| External gear/Forge/relic/infusion/recipe damage | Existing subsystem | Keep existing policy | Cannot earn Taro charge/repeat/shrapnel |

Central damage still respects phase gates, armor/shields, crit scaling and reward accounting. Every legitimate kill still counts once for EXP/loot, quests, objectives, character progress and non-combat recovery. Secondary kills must not emit m_ion/relic/Forge/recipe combat explosions. Classify mixed reward/combat hooks explicitly in T1; do not suppress all kill handling. For numeric modifier evaluation, keep static boss/far/close/etc bonuses but skip counter-mutating nth-hit effects on secondaries. Avoid changing other heroes or external damage semantics globally.

For effects that loop targets, snapshot the live candidate list before applying damage; death/spawn callbacks must not mutate iteration into hitting a pooled replacement. Mark terminal context through nested callbacks with try/finally or immutable event metadata; do not leave a global suppression flag set after an exception.

## 7. Talents, mutations, evolution and saves

Persisted core keys: hp/spd/cdr/crit/echoPath/unique in `Save.data.charProg.taro.tal`. Persisted path keys: `pt_storm_*`, `pt_smite_*`, `pt_tempest_*`, slots root/a1/a2/b1/b2/c1/c2/capA/capB/capC. Preserve every rank, TP balance, level/EXP, cost and capstone exclusivity. Unknown keys remain untouched. No new save migration needed because identifiers/rank limits stay unchanged. Run-local basic path/lv/ranks/mutation/evolved remain in their current structure; charge/marks/bombs are not persistent progression.

Initial T2–T4 prototypes must honor all purchased talents immediately; do not defer real effects until T5:

- Current scalar damage, basic cooldown, big/low/far bonuses, range and generic HP/guard continue, applied once. `_pm.range` currently does not enter thunder's root/bounce selection; the new resolver must make authored range investments effective (root radius multiplier 1+range; basic root radius cap 900). Do not promise that old live targeting already used those bonuses.
- storm capA +2 count feeds bounded root conversion; capB damage +20% stays; capC moving guard stays.
- smite capA big-target +40%, capB damage +30%/basic cadence 10% slower, capC still guard stay.
- tempest capA -25% basic cooldown stays initially; capB far damage +35% and capC moving guard stay. These still function even though nova is close-range. T5 may improve descriptions/branch mechanics with documented one-to-one mappings; must not erase investment or silently reinterpret a survival capstone as damage.
- `rate` remains basic cadence. `arc` and `surge` path interpretations use full existing ranks. Count effects such as `p_squall` use integer levels as now. Preserve tags and rarity potency rules; recomputing helpers must be idempotent.
- Mutation/evolution milestones and auto-fusion triggers remain existing gates. No early free mutation/evolution from choosing a path. Chainlord and Stormcaller remain alternative mutations on all paths with the conversions above. `Stormstep Sovereign` remains the saved/authored evolution identity; its descriptive text must explain path-specific effects rather than claim all paths become screen-wide chains.
- Keep m_step Dash nova and other acquired modifiers as distinct earned effects; these are not the old innate shockwave. Do not silently remove acquired effects to enforce one innate bomb. They cannot feed new Taro effects. Fusion Living Tempest still has its bounded generic arc proc, Sky Judge its damage bonus.

On choosing a path, discard old Storm Charge and initialize that path's new state without emitting damage. On subsequent basic upgrades, recalculate formulas once without resetting charge or firing events. Normal gameplay chooses one path per run; forced/review path changes clear old state and apply fresh path talents. Never mutate a previously applied `_pt.fx` list by appending the same ranks again.

## 8. Pause, death and cleanup

- Pause, level-up, story/boss overlay that suspends combat: freeze countdowns, distance sampling, sweep collision and damage. Preserve charge, mark and pending events only while the same run/path is alive. Resume rebases position before earning distance.
- All delayed effects use an active-play scheduler, not wall-clock callbacks that damage in levelup. No catch-up burst after a long pause/background gap; clamp simulation step and maintain remaining fuse/repeat time.
- Enemy target invalidation checks spawn generation, alive/active, range and phase protection. Rod chooses a replacement on the next active update; an already scheduled repeat fizzles rather than jumping to it.
- Death (even if later revived), leaving combat, scene shutdown, retry/new stage, hero/path change: increment epoch, clear queued repeats/bombs/shrapnel, remove marks/visuals, reset walking sample and sweep set. Clear charge to 0. Revival cannot release effects queued before death. Phase transitions do not accumulate free charge from invincible hits.
- Cleanup must be called from the actual lifecycle hooks found above, including retry/resetRelics/resetStageLoadout and exit, and be safe when called twice.

## 9. T1 implementation checklist and acceptance

T1 introduces Taro-only helpers/state without switching runtime behavior: profile/damage units, stable enemy identity, priority target validity, primary/terminal event context, play-time queue, movement samples, per-run/per-path cleanup, pure upgrade conversion and range bounds. New state can live under one scene `_taro` object; do not use persistent Save state. Implement the source-policy adapter before adding any new kill effect.

Inspect/reuse `tests/all-hero-drafts.test.cjs` (Taro path drafts, ranks/caps/milestones/modes), `tests/unique-talent.test.cjs` (levels/cost/refund), `tests/talent-icons.test.cjs` and `tests/hero-roster.test.cjs` (asset/menu contracts). These do not demonstrate Taro combat balance. Future tests should target pure formulas, target priority/stability, event invalidation, proc ownership and save invariance, not simulate headless combat. Run required check/build for runtime work. Owner conducts the real combat playtest after each integrated path.

T0 acceptance met: audited source map, unique decision, path loops/initial numbers, one-owner proc policy, progression compatibility and lifecycle/T1 contract are written. No runtime test/build or release is needed for this documentation-only package. Open tuning questions (nova radius/damage, movement distance, chain growth, repeat damage) require phone feedback, but do not block T1 scaffolding.
