# Monster animation upgrade plan

Audited v6.55.10; foundation delivered in v6.55.11. Scope: ordinary monsters, elite variants, objective targets and summoned creatures. Boss/miniboss phase animation remains a separate project. Each art batch includes runtime integration, manifest, checks and a remaining-work update.

| Commit | Scope | Status |
|---|---|---|
| 1 | Central presentation controller, freeze, pool reuse, stable proportions and action registration | Complete — v6.55.11 |
| 2 | Chapter 1 stage 1: Worker, Scout, Spitter, Soldier, Drone and Acid Ant | Complete — v6.55.12 |
| 3 | Chapter 1 stage 2: Drain Slime, Dasher, Caster, Bomber and Tank | Pending |
| 4 | Chapter 1 stage 3: Ember, Chili, Grinder, Pressure Pot and Golem | Pending |
| 5 | Chapter 1 stage 4: Wisp, Shard, Caster, Bubble and Guardian | Pending |
| 6 | Chapter 1 stage 5 and Chapter 3: improve existing walk sheets, add missing action clips | Pending |
| 7 | Chapter 2 stages 1–2: root/ferment and mycelium creatures, including Sporeling | Pending |
| 8 | Chapter 2 stage 3: Nectar creatures, including Tiny Grub | Pending |
| 9 | Chapter 2 stages 4–5: season and root creatures | Pending |
| 10 | Elite/summon coverage including Mini Jelly; full visual and mobile performance review | Pending |

## Audit findings

Chapter 1 stages 1–4 mostly use individual still images (the Acid Ant has a walk sheet). Chapter 2 atlases contain different species per cell, not consecutive animation poses. Chapter 1 stage 5 and Chapter 3 already have four-frame walk clips. The previous enemy update additionally rotated and stretched all monsters during movement, including sheet-driven monsters. Freeze stopped AI velocity but did not pause sprite animation. Acid Ant and stage 5 action pose reset callbacks could survive pool reuse.

## Foundation in commit 1

`resetEnemyPresentation` runs for normal and elite spawns. It stops old clips, restores playback speed/rotation/hit scales, clears action/freeze state, retains the species atlas frame and resets initial velocity. Hunt Sugar Stalker and Delve Mini Jelly explicitly reset after changing their texture. Death/clearEnemies stop presentation before reuse.

`tickEnemyPresentation` runs before the frozen/knockback and distant-AI early returns. It selects idle/walk from actual velocity, scales walk playback with movement speed, and avoids restarting a clip every tick. Frozen monsters pause their current animation and action countdown; both resume after thaw. Movement no longer stretches body proportions. Existing walk sheets do not receive fallback rotation. Still images receive only a small walking sway; hit deformation is capped at ±3% for walk-sheet art and ±8% for stills.

`enemyAction` owns timed windup/attack/dash/hurt poses in the update loop. Stage 5 poses and Acid Ant firing no longer use delayed reset callbacks. Hurt cannot replace a windup/attack/dash; missing hurt art uses brief scale feedback without stopping the walk cycle. Shooter/dasher presentation hooks preserve combat and telegraph timings.

`playEnemyDeath` can play authored death on a tracked non-physics ghost, while the original monster immediately returns to the pool and existing loot is awarded. Missing death clips retain the previous death-fling effect. Existing boss/miniboss pose and phase logic stays independent.

## Art integration contract for commits 2–10

Keep the existing monster design, fixed silhouette size, matching foot baseline and transparent gutters. Prefer 6–8 walk frames and 4–6 action frames where appropriate; flying creatures animate wings/body parts instead of legs. Use separate attack preparation, release and recovery poses. Do not encode damage or hitbox changes in animation.

Existing `ASSET_SHEETS[key].anim` remains the walk definition. Optional `actions` registers additional clips during Boot, stage loading and deferred loading:

```js
// Illustrative schema; not existing art.
actions: {
  idle: {frames: [0, 1], rate: 4},
  windup: {start: 8, frames: 4, rate: 10},
  attack: {start: 12, frames: 4, rate: 12},
  hurt: {start: 16, frames: 2, rate: 12},
  death: {texture: 'monster_death_sheet', frames: 6, rate: 12}
}
```

Clips use `key_state`. Idle/walk loop by default; actions default to a single play. An explicit `repeat` or `yoyo` can override this. Separate texture keys must also be registered and included in the stage asset load list. The controller falls back to the original atlas species frame when an action or idle clip is absent. Pose frames passed by the existing stage 5 helper remain supported.

## Validation

Actual-method tests cover idle/walk transitions, loop reuse, speed scaling, freeze/thaw, frozen pose duration, action precedence, pool reuse between an animated attacker and a still atlas species, ghost death and idempotent action registration. Full `npm run check` and `npm run build:www` pass. On-device visual/performance verification is pending. No new monster images are delivered in commit 1; remaining work is commits 2–10.

## Commit 2 delivery

Six painted ant sheets and runtime integration delivered in v6.55.12. Source and review preview: assets/incoming/ch1_ant_animations; runtime: assets/art/ch1_ants. Six walk frames, two idle frames and separate action/hurt/death clips per species. Spitter/Drone action rows were repaired independently. Authored facing and defeat ghost flip are documented in the manifest. New tests execute actual spawn/controller methods and prove original HP/damage/collision values. Remaining: commits 3–10; next is Drain monsters.
