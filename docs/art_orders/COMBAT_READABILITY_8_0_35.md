# Combat readability — v8.0.35

User approved all six recommended improvements on25October2026. Built-in ImageGen produced seven alpha sprites; source kit assets/incoming/combat_readability, runtime assets/art/combat_readability. Source prompts/provenance/compact-bolt revision and contact QA retained.

| Area | Delivered |
|---|---|
| Hostile projectiles | Compact coral pointed bolt with short tail, distinct from EXP crystals. Same128px native texture canvas, scale, body, damage, velocity and lifetime. |
| Warnings | Shared circular spawnHazard: transparent-center rim and exact native-radius760ms countdown arc. Original r+8 hit condition and damage/timing remain. Other authored boss warnings retained. |
| Player | One reused thin foot marker plus same-frame silhouette outline behind the hero. No changes to player physics/position/scale. |
| Large VFX | Friendly animated effects at180px+ capped at.68alpha, selected huge boss overlays.58, persistent Mint snowfall.62. Small impacts and danger-boundary art retained. |
| Elite / windup | At most12crests; windup cue triggers once per windup, not continuously. Shared transient spark cap10; pool/scene cleanup retained. |
| Drops / numbers | Common gear/currency retain quieter rings but no beams. Higher rarity retains beam plus small glint. Critical text has independent spam gating, thinner stroke/shorter lifetime; painted spark replaces emoji. Forced numbers remain. |

Automated contracts: source/runtime hashes, native128px projectile/body/velocity parity, native warning radius/760ms, actor reuse, Elite/spark budgets, windup edge trigger, cleanup, opacity exclusions, loot hierarchy and crit throttling. Full npm check/build required before publish. No local gameplay simulation/screenshots; owner phone visual/FPS review pending. No gameplay/reward tuning.
