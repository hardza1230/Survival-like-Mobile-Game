# Three companion arsenals · v8.0.54

Owner approved the full kit and requested all necessary assets through ImageGen alongside implementation. Single immortal companion, original saved path/card/talent IDs, mission→boss priority AI and buff Uniques remain. This release intentionally changes companion attacks and adds skills; phone balance review is required.

## Blood Orange: ground magic

Normal **Flavor Sigil** replaces the live homing-orb normal attack. After an owned.24s preparation and release, a small painted ground sigil bursts after.24s at a captured position. It never follows a dodging target. Radius48+8Splash+5BloomReach, damage×.9 (evolved1.1), existing1.25s base interval. Perfect Blend strengthens it by×(1.25+.05extraUniqueRanks), applies a3s Sour tag and adds a small delayed fire burst. Existing Yuzu-player seed shots remain separate.

| Skill | Behavior | Base cooldown |
|---|---|---|
| Crimson Comet | Orb falls130px over.6s onto a captured point, radius105+10BloomReach, damage×(3.4+.25AcidNotes). Prefers priority targets. | 9s |
| Sour Garden | Three sequential small flowers plant Sour patches; each impact×.6, patch radius65+8BloomReach,3s+SteepedFlavor+Duration talent. | 10s |
| Spicy Bloom | Three expanding annular petal bursts,65/120/175px,×1.8/1.5/1.2 with burn. A spawn is hit only once across the rings. | 9s |
| Honey Rescue | When Yuzu falls below70%HP: heal4%+1point/HoneyAlchemy+Heal talent; shield8%+2points/HoneyAlchemy. | 10s |

AI chooses Comet against important/isolated targets, Garden against clusters or unweakened priority targets, Bloom as an area alternative, Honey when needed. It does not spend damaging casts with no target. One Comet/Garden/Bloom may be active at a time. Perfect Blend increases their direct damage by×(1+.15UniquePower), Comet also plants Sour ground and Bloom adds fire. Its original final wave waits once for an active large spell to finish; recast/cancel/owner invalidation cancels a pending old finisher. No extra minions.

Existing Flavor Brew helper remains for compatibility; live AI uses the new spells. Old orb helper remains for existing projectile adapters, not the live mage normal. Archwitch evolves Sigil power and makes flavor skills recharge20%sooner. Existing IDs/Recipe discoveries/talent points remain.

## Pomelo: three-hit Peel Combo

Normal attacks cycle straight punch→wide sweep→radial heavy punch. Relative hit multipliers.85/1/1.45; base radii78/110/125 before existing cards/buff. Preparation/recovery durations.26/.3/.4s; original normal cooldown scaling remains. Third hit reaches behind Pomelo. Own-kill growth and Golden Peel Armor apply as before.

**Rind Breaker**: when a priority target or cluster is within380px, prepare.3s and send four ground-wave samples at75/150/225/300px. Each spawn takes one×2.6 growth-scaled hit across the whole wave;9s base cooldown. Existing Pulp Slam and full-growth Rolling Pomelo remain, with skills serialized through the owned action controller.

## Lime: precision and bypass

**Vaulting Shot** arcs over frontline enemies,90px visual rise/.55s flight; at landing deals×(1.9+.12Pulp) in48+8Splash radius.8s base cooldown. Prefers targets screened by two foes or farther than320px.

**Pin & Pierce** marks the priority target with a small hit, then at.75s sends a650px line strike, half-width30+target radius,×(2.35+.15Pulp). Its own marked spawn takes×1.25; pooled reuse/death/expiry invalidates the mark.10s base cooldown. First-hit crit and long-range talents apply. Existing straight normal arrows, piercing Volley, retreat Trap and Hunter’s Focus remain.

## Timing, ownership and limits

Cooldowns use existing rate/Skill/Recover/path modifiers, ticking through action windup/recovery. Actions serialize; at most12owned spell descriptors, existing48projectiles/10zones/8legacyFX/4paintedFX caps remain. Spell events use simulation time, pause with cards/menu, save victim spawn IDs and advance once. A level-up interrupt resumes remaining victims instead of replaying earlier damage. Player/basic/path/kind/art epoch/death/clear guards cancel stale effects and hits. No new physics bodies, timer callbacks, EXP sources or monster spawns.

All spell damage uses central yuzuHit/damage with context restored. New Sour patches use quiet painted flowers at18%opacity and preserve original vulnerability behavior. Normal Sigil keeps a short still cue on Low VFX; optional big decoration is suppressed. Reduced motion uses brief still frames. Source shapes have transparent centers and large effects retain≤.5opacity/420px cap.

## ImageGen source kit

Built-in ImageGen generated three original atlases concurrently:20mage frames,8Pomelo frames and12Lime frames. Exact prompt sets and donors:

- `assets/incoming/yuzu54/bloodorange_PROMPT.json` and `bloodorange_source.png`
- `assets/incoming/yuzu54/pomelo_PROMPT.json` and `pomelo_source.png`
- `assets/incoming/yuzu54/lime_PROMPT.json` and `lime_source.png`

Mechanical `scripts/pack-yuzu-54.py` detects alpha-energy gutters, crops subjects at a common row scale, preserves alpha and pads128px cells. No artistic effect synthesis/background removal by code. `assets/art/yuzu54/MANIFEST.json` records source/final hashes, crop rectangles and all10clip offsets. Three lossless WebPs total531,640bytes/2,621,440decoded bytes. Hero-lazy; Yuzu GPU-budget contract299MB under300cap. No more hero textures should be added without freeing space or improving path loading.

`assets/incoming/yuzu54/alpha_review.png` is the visually inspected dark-matte proof of all40frames, not gameplay. Existing original ElevenLabs cues are reused for preparation/release/impact; no new audio generated.

## Verification

Companion component adapters cover delayed/dodgeable ground sigils,30/60/120FPS timings, one-big-spell lock, pause/clear/stale/dead owner, interrupted AoE resume, ring bands/burn/Sour/Honey, one-hit ground wave, pin pool identity, deferred Unique, situation AI, three Peel strikes and finite queues. Art tests verify all10clip offsets/40frames, hashes/alpha/lazy registration and essential Low cue. Existing animation, talents, ownership and VFX tests remain. Required fullcheck/build and publication evidence are in the session handoff. No combat simulation/game screenshots; owner phone balance/alignment/FPS review pending.
