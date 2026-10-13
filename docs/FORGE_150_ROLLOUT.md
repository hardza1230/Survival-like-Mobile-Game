# Three-row Forge — approved 150-mod rollout

## v7.8.0 foundation

150 unique entries: 32 Power / 32 Sustain / 86 Playstyle & Utility. **78 active; 72 planned and excluded from all roll pools.** Registration is not completion of an effect.

- Spark Sugar rolls Power. Twist Cream offers two distinct saved Sustain choices. Wild Jam rolls a selected compatible Playstyle/Utility family. Crystal Glaze keeps the existing tier-reroll cost/behavior.
- Replacing a mod preserves relative tier position across differing tier counts. New values belong to the new mod. Power auto-roll stops on mod identity; it cannot promise an improved tier. Sustain requires a player choice.
- Paid choices persist on the item before presentation and cannot be double-charged. Pending items cannot be manually sold or salvaged. Old mods remain until selection.
- Migration keeps legacy mods, values, implicit, UID and inbox/equipment identity. Legacy same-category mods occupy free rows until replaced. No old mod is deleted merely for a category mismatch.
- Half merged Cream becomes Jam at the same 110 Sugar purchase price. Old Crown/Wish become Spark. Gumdrop/Dough convert at original purchase value into Cream/Spark; fractional value refunds Sugar. Migration is persisted once.
- Farm modifiers snapshot at stage start. Bonuses cap at 30% per supported mechanism. Bonus parcels do not recurse. Target currencies reweight eligible pools. Difficulty loot eligibility and combat EXP stay authoritative.
- Timed capped HP barriers absorb both contact and ranged damage, display their amount on HUD, and reset per stage. Forge healing respects no-heal rules and Story recovery limits.

Registry: data/forge-mods.json. Sync runtime using scripts/sync-forge-catalog.mjs; --check verifies parity. Legacy definitions remain compatibility-only.

## Remaining effect batches

1. Combat source tags and attack events: basic, minion, charged, combo, active and projectile provenance.
2. Status and zone ownership/expiration/stack rules; no secondary-trigger loops.
3. Companion count, range, targeting and hit/kill events; boss fallback.
4. Eligible loot quality/target bases and drop-stamped salvage/sale bonuses; one-use supply discounts.
5. Dash collection, reserved magnets, conserved merged piles, map radar/secrets, gear choice chests and Delve rest services.
6. Incoming DoT/projectile/trap/contact tags, control/knockback rules, delayed-damage accounting and decoy lifecycle.

Each planned entry needs a real consumer and regression tests before activation. Do not substitute generic damage just to reach 150 live effects. Owner mobile feel/balance/FPS playtest remains pending; no headless gameplay simulation.

## Catalog (strongest-tier initial tuning)

Values are percentages except HP/Armor, Regen in tenths HP/s, and Last Crumb once per run. Conditional formulas/caps are in runtime helpers. Planned values are provisional.

| # | Mod | Row / family | Max | Status | Effect |
|---:|---|---|---:|---|---|
| 1 | Might | power / power | 16 | active | Damage for every attack |
| 2 | Rapid Rhythm | power / power | 12 | active | Faster basic attack cycles |
| 3 | Precision | power / power | 5 | active | Critical hit chance |
| 4 | Deadly Sweet | power / power | 60 | active | Critical hit damage |
| 5 | Heavy Batter | power / power | 25 | active | Stronger direct hits, slower basic attacks |
| 6 | Wide Recipe | power / power | 12 | active | Larger supported attack areas |
| 7 | Lingering Flavor | power / power | 20 | active | Damage over time |
| 8 | Lingering Touch | power / power | 20 | planned | Longer supported enemy statuses |
| 9 | Pack Leader | power / power | 20 | planned | Minion damage |
| 10 | Executioner | power / power | 20 | active | Damage against enemies below 30% HP |
| 11 | Opening Bite | power / power | 24 | active | Damage against enemies above 90% HP |
| 12 | Giant Slayer | power / power | 21 | active | Damage against elites, minibosses and bosses |
| 13 | Vital Dough | sustain / sustain | 100 | active | Maximum HP |
| 14 | Hard Shell | sustain / sustain | 18 | active | Armor rating |
| 15 | Slow Recovery | sustain / sustain | 14 | active | HP regeneration per second |
| 16 | Fresh Meal | sustain / sustain | 5 | active | HP recovered on kill, rate limited |
| 17 | Vampiric Bite | sustain / sustain | 10 | active | Direct-hit recovery, rate limited |
| 18 | Critical Barrier | sustain / sustain | 12 | active | Critical hits grant a timed HP barrier |
| 19 | Quiet Recovery | sustain / sustain | 12 | active | Extra regeneration after avoiding HP damage |
| 20 | Emergency Coating | sustain / sustain | 14 | active | Damage reduction below 40% HP |
| 21 | Dash Guard | sustain / sustain | 12 | active | Damage reduction after a dash |
| 22 | Crowd Padding | sustain / sustain | 20 | planned | Armor while surrounded |
| 23 | Elite Rations | sustain / sustain | 8 | active | Recover HP after repeated hits on elites and bosses |
| 24 | Overflow Cream | sustain / sustain | 20 | active | Excess recovery becomes a capped timed barrier |
| 25 | Third Beat | play / rhythm | 20 | active | Every third direct hit gains damage |
| 26 | Patient Bite | play / rhythm | 20 | active | A direct hit after an attack gap gains damage |
| 27 | Single Serving | play / rhythm | 20 | active | Repeated direct hits on one enemy gain damage |
| 28 | Critical Tempo | play / rhythm | 20 | planned | Critical hits grant temporary attack speed |
| 29 | Dash Primer | play / movement | 20 | active | First direct hit after a dash gains damage |
| 30 | Running Recipe | play / movement | 20 | planned | Travel distance prepares the next attack |
| 31 | Steady Hands | play / movement | 20 | active | Damage while standing still |
| 32 | Close Quarters | play / movement | 20 | active | Damage to nearby enemies |
| 33 | Brittle Shell | play / status | 20 | active | Damage to chilled or frozen enemies |
| 34 | Deep Flavor | play / status | 20 | planned | Hits extend a damage-over-time status, capped |
| 35 | Mixed Recipe | play / status | 20 | active | Damage per distinct enemy status, up to three |
| 36 | Aftertaste | play / status | 20 | planned | Damage window after an applied status expires |
| 37 | Marked Prey | play / companions | 20 | planned | Mark a target to improve companion damage |
| 38 | Pack Rhythm | play / companions | 20 | planned | Companion hits prepare the owner attack |
| 39 | Shared Feast | play / companions | 20 | planned | Companion kills or repeated boss hits heal the owner |
| 40 | Lone Companion | play / companions | 20 | planned | Stronger companion while exactly one is active |
| 41 | Last Bite | play / survival | 20 | active | Damage below 40% HP |
| 42 | Perfect Glaze | play / survival | 20 | active | Damage above 90% HP |
| 43 | Shielded Strike | play / survival | 20 | active | Direct-hit damage while a barrier is present |
| 44 | Measured Revenge | play / survival | 20 | active | HP damage prepares the next direct hit |
| 45 | Gathering Pace | play / harvest | 20 | active | Collecting combat EXP grants temporary move speed |
| 46 | Stored Sweetness | play / harvest | 20 | active | Collected EXP prepares a stronger direct hit |
| 47 | Fresh Delivery | play / harvest | 20 | planned | Healing pickups grant temporary healing effectiveness |
| 48 | Growing Appetite | play / harvest | 20 | active | Level-ups grant a temporary damage bonus |
| 49 | Distant Bite | power / power | 20 | active | Damage against distant enemies |
| 50 | Point Blank | power / power | 20 | active | Direct-hit damage to close enemies |
| 51 | Armor Breaker | power / power | 20 | planned | Partial enemy armor bypass |
| 52 | Focused Recipe | power / power | 20 | active | Damage with few nearby enemies |
| 53 | Crowd Appetite | power / power | 20 | active | Damage while surrounded, capped |
| 54 | Charged Sugar | power / power | 20 | planned | Charged attack damage |
| 55 | Combo Flour | power / power | 20 | planned | Combo finisher damage |
| 56 | Active Essence | power / power | 20 | planned | Active skill damage |
| 57 | Quick Preparation | power / power | 20 | active | Active skill cooldown reduction |
| 58 | Persistent Zone | power / power | 20 | planned | Longer damaging zones, same DPS |
| 59 | Companion Tempo | power / power | 20 | planned | Companion attack speed |
| 60 | Patient Ferment | power / power | 20 | planned | Damage over time ramps with status age |
| 61 | Barrier Capacity | sustain / sustain | 15 | active | Higher maximum forge barrier |
| 62 | Lasting Coating | sustain / sustain | 25 | active | Longer forge barrier duration |
| 63 | Efficient Recovery | sustain / sustain | 25 | active | Healing effectiveness |
| 64 | Boss Padding | sustain / sustain | 20 | active | Damage reduction during boss and miniboss encounters |
| 65 | Crowd Filter | sustain / sustain | 20 | active | Damage reduction outside boss and miniboss encounters |
| 66 | Impact Cushion | sustain / sustain | 20 | active | Mitigate a large hit, with cooldown |
| 67 | Steady Shell | sustain / sustain | 20 | active | Extra armor while stationary |
| 68 | Moving Cover | sustain / sustain | 20 | active | Movement grants a small barrier, with cooldown |
| 69 | Control Resistance | sustain / sustain | 20 | planned | Shorter incoming control statuses |
| 70 | Clean Glaze | sustain / sustain | 20 | planned | Dash cleanses one eligible harmful status |
| 71 | Broken Shell | sustain / sustain | 20 | active | Barrier destruction grants temporary protection |
| 72 | Companion Shelter | sustain / sustain | 20 | planned | Nearby companions grant capped armor |
| 73 | Long Flight | play / projectile | 20 | planned | Projectile damage scales with distance travelled |
| 74 | Piercing Momentum | play / projectile | 20 | planned | Piercing distinct targets empowers a projectile |
| 75 | Ricochet Focus | play / projectile | 20 | planned | Bouncing to a new target grants damage |
| 76 | Clean Finish | play / projectile | 20 | planned | Projectile kills prepare the next basic attack |
| 77 | Combo Guard | play / melee | 20 | planned | Combo finishers grant a barrier |
| 78 | Closing Step | play / melee | 20 | planned | Entering melee range empowers the first melee attack |
| 79 | Packed Punch | play / melee | 20 | planned | A multi-target melee hit empowers the next attack |
| 80 | Duel Rhythm | play / melee | 20 | planned | Repeated melee hits grant temporary move speed |
| 81 | Prepared Release | play / active | 20 | planned | Basic hits charge the next active skill |
| 82 | Follow Through | play / active | 20 | planned | An active skill empowers the next three basic attacks |
| 83 | Emergency Cast | play / active | 20 | planned | Casting at low HP grants a barrier |
| 84 | Patient Reserve | play / active | 20 | planned | Holding a ready active skill builds a capped bonus |
| 85 | Settled Ground | play / zones | 20 | planned | Zone damage ramps while an enemy stays inside |
| 86 | Home Recipe | play / zones | 20 | planned | Standing in an owner-created zone grants armor |
| 87 | Crossing Flavors | play / zones | 20 | planned | Two different overlapping zones gain damage |
| 88 | Last Serving | play / zones | 20 | planned | An expired zone deals one final hit, with cooldown |
| 89 | Hunter’s Mark | play / marks | 20 | active | Direct hits mark one target for increased owner damage |
| 90 | Cash Out | play / marks | 20 | active | Repeated hits consume a mark for bonus damage |
| 91 | Claimed Reward | play / marks | 20 | active | Marked kills or repeated boss hits grant a barrier |
| 92 | Passing Target | play / marks | 20 | active | Marked kills transfer the remaining mark duration |
| 93 | Heavy Recipe | play / barrier | 20 | active | Armor grants capped direct-hit damage |
| 94 | Stored Barrier | play / barrier | 20 | active | Spend part of a barrier to empower a direct hit |
| 95 | Breaking Point | play / barrier | 20 | active | Barrier destruction grants attack speed |
| 96 | Guarded Focus | play / barrier | 20 | active | A maintained barrier grants critical chance |
| 97 | Earned Edge | play / growth | 20 | active | Kills build a temporary damage bonus |
| 98 | Elite Lesson | play / growth | 20 | active | Elite kills build a capped run-long damage bonus |
| 99 | Adaptive Recipe | play / growth | 20 | planned | Collected EXP strengthens the most used attack tag |
| 100 | Second Course | play / growth | 20 | active | Level-ups refund part of the active cooldown |
| 101 | Reliable Batter | power / power | 40 | active | Raise the minimum of the gear attack damage range |
| 102 | Swift Delivery | power / power | 20 | planned | Projectile travel speed |
| 103 | Firm Push | power / power | 20 | planned | Strength of existing knockback |
| 104 | Sticky Flavor | power / power | 20 | planned | Chance to apply an existing supported status |
| 105 | Shield Cracker | power / power | 20 | planned | Damage to enemy shields |
| 106 | Stagger Baker | power / power | 20 | planned | Stagger accumulation |
| 107 | Thorn Glaze | power / power | 20 | planned | Rate-limited contact damage reflection |
| 108 | Clean Recipe | power / power | 20 | active | Damage to enemies without owner-applied statuses |
| 109 | Slow-Burn Resistance | sustain / sustain | 20 | planned | Incoming damage-over-time reduction |
| 110 | Projectile Padding | sustain / sustain | 20 | planned | Incoming enemy projectile damage reduction |
| 111 | Safe Soles | sustain / sustain | 20 | planned | Incoming trap and ground hazard reduction |
| 112 | Firm Footing | sustain / sustain | 20 | planned | Incoming knockback distance reduction |
| 113 | Buffered Bite | sustain / sustain | 20 | planned | Delay part of incoming HP damage without deleting it |
| 114 | First-Hit Guard | sustain / sustain | 20 | active | Mitigate the first hit after a damage-free interval |
| 115 | Last Crumb | sustain / sustain | 1 | active | Survive one lethal hit at 1 HP per run |
| 116 | Sweet Decoy | sustain / sustain | 20 | planned | Low HP creates a temporary enemy decoy |
| 117 | Treasure Aroma | play / quantity | 15 | active | Additional chance for an eligible equipment drop |
| 118 | Currency Sprinkles | play / quantity | 15 | active | Additional chance for an eligible currency drop |
| 119 | Twin Parcel | play / quantity | 12 | active | An equipment drop can add an independently rolled box |
| 120 | Extra Pinch | play / quantity | 15 | active | A currency pickup can contain one extra unit |
| 121 | Elite Pockets | play / quantity | 15 | active | Elites and minibosses can grant an extra currency |
| 122 | Boss Pantry | play / quantity | 25 | active | Bosses can grant an extra currency parcel |
| 123 | Fine Ingredients | play / quality | 20 | planned | Better base quality weights within the eligible table |
| 124 | Polished Parcel | play / quality | 20 | planned | Better mod tiers on dropped equipment |
| 125 | Careful Selection | play / quality | 20 | planned | Avoid the lowest value rolls on dropped equipment |
| 126 | Signature Scent | play / quality | 20 | planned | More eligible special equipment bases |
| 127 | Weapon Seeker | play / target_farming | 20 | planned | Bias equipment toward weapons and gloves |
| 128 | Armor Seeker | play / target_farming | 20 | planned | Bias equipment toward armor and boots |
| 129 | Trinket Seeker | play / target_farming | 20 | planned | Bias equipment toward amulets and rings |
| 130 | Spark Collector | play / target_farming | 50 | active | Bias currency toward Spark Sugar |
| 131 | Cream Collector | play / target_farming | 50 | active | Bias currency toward Twist Cream |
| 132 | Jam Collector | play / target_farming | 50 | active | Bias currency toward Wild Jam |
| 133 | Tier Collector | play / target_farming | 50 | active | Bias currency toward Crystal Glaze |
| 134 | Base Tracker | play / target_farming | 20 | planned | Bias equipment toward one selected eligible base |
| 135 | Clean Salvage | play / economy | 20 | planned | Drop-stamped bonus salvage materials |
| 136 | Scrap Surprise | play / economy | 20 | planned | Drop-stamped chance for currency when salvaged |
| 137 | Trade Stamp | play / economy | 20 | planned | Drop-stamped bonus sale Sugar |
| 138 | Patient Shopper | play / economy | 20 | planned | A stage clear grants one non-stacking supply discount |
| 139 | Quick Pull | play / collection | 40 | active | Faster movement of already attracted loot |
| 140 | Dash Retrieval | play / collection | 20 | planned | Collect nearby drops along a dash path |
| 141 | Magnet Reserve | play / collection | 20 | planned | A redundant magnet grants a capped reserve charge |
| 142 | Medic’s Choice | play / collection | 10 | active | Low HP grants a rate-limited extra healing-drop chance |
| 143 | Fresh Storage | play / collection | 20 | active | A full-HP healing pickup stores capped recovery |
| 144 | Field Organizer | play / collection | 20 | planned | Merge nearby same-currency piles without changing totals |
| 145 | Treasure Compass | play / exploration | 20 | planned | Direction to an existing nearby treasure |
| 146 | Elite Radar | play / exploration | 20 | planned | Direction to an existing nearby elite |
| 147 | Hazard Survey | play / exploration | 20 | planned | Reveal eligible hidden traps early |
| 148 | Secret Aroma | play / exploration | 20 | planned | Chance for one additional eligible treasure location |
| 149 | Choice Parcel | play / exploration | 20 | planned | Eligible gear chests can offer one of two items |
| 150 | Deep Preparation | play / exploration | 20 | planned | One extra service choice at a Delve rest point |
