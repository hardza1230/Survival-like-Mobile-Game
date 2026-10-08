# Monster animation upgrade plan

Audited v6.55.10; foundation delivered in v6.55.11. Scope: ordinary monsters, elite variants, objective targets and summoned creatures. Boss/miniboss phase animation remains a separate project. Each art batch includes runtime integration, manifest, checks and a remaining-work update.

| Commit | Scope | Status |
|---|---|---|
| 1 | Central presentation controller, freeze, pool reuse, stable proportions and action registration | Complete — v6.55.11 |
| 2 | Chapter 1 stage 1: Worker, Scout, Spitter, Soldier, Drone and Acid Ant | Complete — v6.55.12 |
| 3 | Chapter 1 stage 2: Drain Slime, Dasher, Caster, Bomber and Tank | Complete — v6.55.13 |
| 4 | Chapter 1 stage 3: Ember, Chili, Grinder, Pressure Pot and Golem | Complete — v6.55.14 |
| 5 | Chapter 1 stage 4: Wisp, Shard, Caster, Bubble and Guardian | Complete — v6.55.15 |
| 6 | Chapter 1 stage 5 and Chapter 3: improve existing walk sheets, add missing action clips | Complete — v6.55.16 |
| 7A | Chapter 2 stage 1: Fermented Canopy — 6 creatures | Complete — v6.55.92; owner mobile review pending |
| 7B | Chapter 2 stage 2: Mycelium Marsh — 7 creatures including Sporeling | Complete — v6.55.93; owner mobile review pending |
| 8 | Chapter 2 stage 3: Nectar creatures, including Tiny Grub | Complete — v6.55.94; owner mobile review pending |
| 9 | Chapter 2 stages 4–5: season and root creatures | Pending |
| 10 | Elite/special art including Mini Jelly and C2-1 Crown Sapling; full visual and mobile performance review | Art/code complete — v6.55.95; owner mobile review pending |

## Commit 7 split

The original commit 7 was too large, so it is now two independent delivery commits. Commit 7A covers only C2-1 Fermented Canopy: Ferment Sprout, Vine Hunter, Spore Lantern, Rotten Fruit Pod, Root-Back Beetle and Thorn Oracle. Commit 7B covers only C2-2 Mycelium Marsh: Mycelium Drifter, Cap Hopper, Puffcap Sniper, Mold Sac, Mycelium Bulwark, Threadweaver Oracle and Sporeling. Each commit must include its own generated sheets, runtime integration, MANIFEST, tests/checks, version bump and documentation update. Do not wait for 7B before validating or shipping 7A.

## Audit findings

Batch 7A audit: C2-1 Elite is the separate Crown Sapling in atlas cell 6, not Root-Back Beetle (cell 4). Preserve its current identity in 7A; its animation belongs to batch 10.

Chapter 1 stages 1–4 mostly use individual still images (the Acid Ant has a walk sheet). Chapter 2 atlases contain different species per cell, not consecutive animation poses. Chapter 1 stage 5 and Chapter 3 already have four-frame walk clips. The previous enemy update additionally rotated and stretched all monsters during movement, including sheet-driven monsters. Freeze stopped AI velocity but did not pause sprite animation. Acid Ant and stage 5 action pose reset callbacks could survive pool reuse.

## Foundation in commit 1

`resetEnemyPresentation` runs for normal and elite spawns. It stops old clips, restores playback speed/rotation/hit scales, clears action/freeze state, retains the species atlas frame and resets initial velocity. Hunt Sugar Stalker and Delve Mini Jelly explicitly reset after changing their texture. Death/clearEnemies stop presentation before reuse.

`tickEnemyPresentation` runs before the frozen/knockback and distant-AI early returns. It selects idle/walk from actual velocity, scales walk playback with movement speed, and avoids restarting a clip every tick. Frozen monsters pause their current animation and action countdown; both resume after thaw. Movement no longer stretches body proportions. Existing walk sheets do not receive fallback rotation. Still images receive only a small walking sway; hit deformation is capped at ±3% for walk-sheet art and ±8% for stills.

`enemyAction` owns timed windup/attack/dash/hurt poses in the update loop. Stage 5 poses and Acid Ant firing no longer use delayed reset callbacks. Hurt cannot replace a windup/attack/dash; missing hurt art uses brief scale feedback without stopping the walk cycle. Shooter/dasher presentation hooks preserve combat and telegraph timings.

`playEnemyDeath` can play authored death on a tracked non-physics ghost, while the original monster immediately returns to the pool and existing loot is awarded. Missing death clips retain the previous death-fling effect. Existing boss/miniboss pose and phase logic stays independent.

## Art integration contract for commits 2–10

Keep the existing monster design, fixed silhouette size, matching foot baseline and transparent gutters. Prefer 6–8 walk frames and 4–6 action frames where appropriate; flying creatures animate wings/body parts instead of legs. Use separate attack preparation, release and recovery poses. Do not encode damage or hitbox changes in animation.

Existing `ASSET_SHEETS[key].anim` remains the walk definition. Optional `actions` registers additional clips during Boot, stage loading and deferred loading. Clips use `key_state`. Idle/walk loop by default; actions default to a single play. Separate texture keys must also be registered and included in the stage asset load list. The controller falls back to the original atlas species frame when an action or idle clip is absent.

## Validation

Actual-method tests cover idle/walk transitions, loop reuse, speed scaling, freeze/thaw, frozen pose duration, action precedence, pool reuse between an animated attacker and a still atlas species, ghost death and idempotent action registration. Full `npm run check` and `npm run build:www` pass. On-device visual/performance verification is pending.

## Commit 2 delivery

Six painted ant sheets and runtime integration delivered in v6.55.12. Source and review preview: assets/incoming/ch1_ant_animations; runtime: assets/art/ch1_ants.

## Commit 3 delivery

Five painted Drain sheets delivered in v6.55.13. Source/review: assets/incoming/ch1_drain_animations; runtime: assets/art/ch1_drain.

## Commit 4 delivery

Five painted Fire sheets delivered in v6.55.14. Source/review: assets/incoming/ch1_fire_animations; runtime: assets/art/ch1_fire.

## Commit 5 delivery

Five painted Ice sheets delivered in v6.55.15. Source/review: assets/incoming/ch1_ice_animations; runtime: assets/art/ch1_ice.

## Commit 6 delivery

Ten generated 16-pose sheets delivered in v6.55.16: five Chapter 1 stage 5 identities and five Chapter 3 identities, including Stage 5 Elite. Source/review: assets/incoming/monster_batch6; runtime: assets/art/monster_batch6. Full checks/web build pass; phone visual/performance review pending.

## Commit 7A delivery

Six generated 16-pose sheets delivered in v6.55.92. Source/raw/manifest/exact prompts/packing/review: assets/incoming/ch2_s1_animations; runtime lossless alpha WebPs: assets/art/ch2_canopy. Whole-component extraction preserves leaves, limbs and staffs crossing nominal raw cell boundaries; one scale per species and fixed 236px baseline preserve proportions. Lantern source poses are reordered to separate idle/charge/release. Existing attack, cooldown, dash, freeze, collider and combat behavior is unchanged. Crown Sapling Elite (atlas cell 6) retains its original identity and moves to batch 10. Actual-method regressions cover all seven normal roles, partial-load fallback, authored actions/death, freeze/thaw and pool reuse. Mobile visual/FPS review remains pending.

## Commit 7B delivery

Seven generated 16-pose sheets delivered in v6.55.93, including the smaller zero-XP Sporeling. Source/raw/manifest/exact prompts/packing/review: assets/incoming/ch2_s2_animations; runtime lossless alpha WebPs: assets/art/ch2_mycelium. Existing packer accepts --batch mycelium while Canopy remains the default. Both Sniper and Oracle use preparation/release clips; Hopper uses windup/dash; Mold Sac has a once-per-life pressure warning. Original combat values, circles, Bulwark aura/guard, Drifter acid, two-child Mold Sac split and shared live caps are preserved. Original atlas stays for fallback and Clean Air Wisp. Generic Elite and boss/miniboss art are outside 7B. Actual-method regressions cover eight roles, partial-load fallback, actions/freeze/pool reuse/death and the original death hooks with capped zero-XP child spawns. Mobile visual/FPS acceptance remains pending. Remaining: 8, 9 and 10. Next: 8 C2-3 Nectar Hive including Tiny Grub.


## Batch 8 delivered — v6.55.94

Seven Nectar Hive creatures including Tiny Grub receive 16 authored poses each. Flying species flap wings; Dartwing has windup/dash, both Pollen Sniper and Choir Moth have preparation/firing, Honey Bomb has a once-per-life low-HP warning. Runtime assets: assets/art/ch2_nectar. Original/raw/packed sources, exact prompts, packing and review: assets/incoming/ch2_s3_animations. Original HP/damage/speed/EXP, circles, wax guard aura and 0.74 guard multiplier, flower targeting, Choir Moth three-shot fan, caps and Story P1–P5 remain. Atlas cell 7 flower fallback, generic Elite and boss/miniboss art remain. Tiny Grub has an existing atlas/type mapping but no current spawn caller or special stat branch; its existing basic stats/1 EXP remain, without adding summons. Owner mobile visual/FPS review pending. Next: batch 9, Four-Season Conservatory and Root Throne.


## Elite and special creatures — v6.55.95

Elite/special art batch B is implemented: Crown Sapling, Mini Jelly, Chapter 3 Elite, Feast Target and Mimic Chest each have 16 authored poses. Packed RGBA PNG/raw/exact prompts/packing/contact/animated review: assets/incoming/elite_summons; runtime lossless alpha WebP: assets/art/elite_summons. Crown Sapling uses C2-1 atlas cell 6 identity; Chapter 3 Elite uses the ash/gold crowned seed knight design from the brief. Feast carries a food plate and uses flee clips, without an attack clip. Mimic is a toothy living chest. Existing world sprite boxes/circle radii/centers are preserved when 62px generic Elite and 48px chest art become 256px frames. Mini Jelly keeps .36 scale and [70,58,70] circle. HP/damage/speed/EXP, Elite gates, Warden half-HP three-child split, Feast timers/Hunger share and Mimic chance/tier/reward remain. Animated Feast pool reuse cancels its escape fade and clears fleeing state; missing sheets retain original art. Boss/miniboss pose/death controllers remain separate. Owner mobile visual/FPS review pending. Ordinary season/root art (batch 9), Chef gear and card/Unique VFX art remain.
