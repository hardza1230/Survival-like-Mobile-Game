# Yuzu: always-ready companions · v8.0.50

Visual refinement v8.0.51: [YUZU_UNIQUE_SPECTACLE.md](YUZU_UNIQUE_SPECTACLE.md) adds ImageGen opening/finishing clips, active accents, small impact/trails and aligned existing ElevenLabs cues. Mechanics below remain unchanged.

Approved direction: empower the single existing companion with a timed Unique. No extra minions. This supersedes companion HP, down/revival and the three old Unique mechanics in the original companion plan.

## Always ready

Companions take no damage, cannot fall and never need touch rescue. Their HP gauge is removed. They do not intercept/delete hostile projectiles; Yuzu still takes damage normally. Pomelo retains its ordinary-enemy taunt. Compatibility HP/down fields remain internal, always healthy/zero, for old callers. Growth and animation continue without a damage interruption.

## Unique buffs

All retain the existing 13s base cooldown, Unique power scaling and original saved path/upgrade IDs. Durations use game time and pause with menus/cards. Royal Parade adds 2s; relevant path talents add 2s. Casting again cancels the old buff without its finisher. Existing 48 animation and 49 painted VFX are reused, with a small colored countdown ring and remaining seconds beside the companion. No new texture/GPU cost.

| Companion | Base buff | Behavior | Expiry attack |
|---|---|---|---|
| Pomelo | Golden Peel Armor, 6s | Yuzu shield 25% max HP (+4 points per Unique rank after first); sweeps gain 35px and damage ×(1+.45×Unique power). Every .8s, push nearby ordinary foes 18px; no boss/mini/mission displacement. | 180px heavy slam (+Slam talent), base ×(4+.45×extra Unique ranks)×Unique power; ordinary foes stagger .45s. |
| Lime | Hunter’s Focus, 6s | Normal attack becomes 3 short piercing arrows at 0/.07/.14s; each deals 48% normal-arrow damage ×Unique power. Pierce 2, evolved 4. Successful Focus hits build up to 12 marks shared across targets; killing/changing targets preserves them. | Heavy piercing arrow, base ×(4+.25×marks)×Unique power, pierce 6, speed 620. First impact has a small 55px burst (+Rain talent). |
| Blood Orange | Perfect Blend, 7s | Yuzu shield 18% max HP (+3 points per extra Unique rank). New normal orbs deal ×(1.25+.05×extra ranks), retain 2 bounces, apply a 3s Sour tag and burst in a 60px fire splash at their end. | Flavor wave around Yuzu, 180px, base ×(3.6+.4×extra ranks)×Unique power, with burn. |

Infused Sour tags increase incoming damage by 15% (+2 points per Sour Mixer rank + Sour talent); the stronger Sour patch replaces this multiplier rather than multiplying again. Tags use pooled spawn identity, expire and cap at 64. Infused projectiles may finish after the buff expires, but never after changing owner/path/run. Focus marks belong to the buff; queued arrows cancel when it ends. Existing projectile cap 48, zones 10, legacy FX 8 and painted FX 4 remain.

### Saved investments

- Best Friends (`family`): +4% companion hit and +8% Yuzu shield strength per rank.
- Hardy mutation: Unique grants an extra 12% max-HP shield.
- Bodyguard (`p_bodyguard`): 3% less damage per rank for Yuzu near Pomelo.
- Keep Ripe (`y_keepripe`), renamed Golden Reach: +8px sweep per rank; Pomelo growth is never lost.
- Former HP talents (`yzHp`): +15% Yuzu shield strength per rank.
- Former recovery talents (`yzRecover`): companion primary skills recharge 4% sooner per rank, additive with Skill talent, total reduction capped at 65%.
- Former revive-shield talent: Unique grants an extra 12% max-HP shield.
- `ripe_fest`: grow Pomelo one step; `ripe_shield`: extra 15% max-HP shield.
- `toss_rain`: Focus +1.5s; `toss_home`: finisher homes toward priority targets.
- `grow_burst`: final wave +50px and +.5 base multiplier; `grow_grove`: extra 20% max-HP shield.

IDs, allocated talent points and Recipe Book discoveries remain intact. EXP, rewards and monster counts are unchanged.

## Target decisions

Priority: marked mission enemy → raider threatening an active purge Wisp → boss → miniboss → elite/courier → ordinary foe. Exclude invulnerable/phase-locked enemies, training dummies and cores requiring Wisp purification.

Recheck priority every .15s; keep same-priority targets for .55s with distance hysteresis to reduce flicker. Priority pursuit reaches 720px from Yuzu, with a 740px return leash. Ordinary targeting/return retain shorter limits. Lime and Blood Orange approach a priority target to their shooting distance rather than waiting on the normal player tether. They retreat when crowded and return if left behind.

Normal fire and homing favor the priority enemy; piercing arrows, bounces, sweeps, traps and brews still clear surrounding mobs. Pomelo's slam weighs priority plus local density, allowing a dense crowd to win over an isolated boss. The rest of its attacks continue boss focus. This is not pathfinding through terrain.

## Verification

Isolated production helper tests cover all three buffs at 30/60/120FPS, pause, once-only finishers, stale/dead owner, recast/clear, bounded Focus bursts, transferable marks, pooled Sour expiry, mission/boss preemption, phase exclusions, ranged approach, crowd selection and no hostile-bullet interception. Existing animation and VFX contracts remain. Required full checks and web build are recorded in the session handoff. No gameplay simulation or automatic screenshots; phone balance, timing and crowd readability remain owner playtests.
