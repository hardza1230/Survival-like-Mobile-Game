# Yuzu card presentation audit — v8.0.59

Reviewed against the live v54 companion arsenal and v50 timed buffs. This delivery changes presentation only: original card geometry, controls, roll pools, gates, save IDs, rank caps, numeric effects and battle code stay intact. One immortal companion remains the rule.

The complete owned Yuzu combat section is byte-identical to v58 (SHA-256 `03f10844a7c6b9a4e5406546dc84783bb27f8e571780b744f1d0bc39e42536a2`).

## Findings and corrections

- Starter and hero copy still described helping a fallen partner up; now describes an always-ready partner and buff Unique.
- Lime path icon showed multiple citrus minions. All three path icons now show one actual companion with its current weapon.
- Zest Splash mentioned mage orbs. It now explains Pomelo sweep radius, Lime arrow splash plus Vaulting Shot radius, or Blood Orange ground Sigils after choosing a path.
- Swift Ranger omitted Vaulting Shot and Pin & Pierce; Ready Quiver omitted other Lime skills. Their descriptions now cover the real effects without modifying them.
- Sour Snare and Acid Notes use companion-power/vulnerability units to avoid implying an unsupported damage multiplier.
- Extended Focus / Seeking Arrow replace stale Juice Rain / Homing Hop display names; their saved IDs remain `toss_rain` / `toss_home`.
- Honey Notes / Spell Rhythm / Peel Promise update old talent wording while keeping all talent IDs and apply closures.
- Recipe entries use full effects and the same art as the live cards. Unique Power gets a path-specific buff icon and Yuzu-specific copy; the other generic Unique cards retain their shared art.

## Audited card inventory

### Shared upgrades

| Saved ID | Display name | Effect |
| --- | --- | --- |
| `power` | Juicy Bite | Companion hits and Yuzu seeds gain 12% base power per rank. |
| `rate` | Quick Feet | Companion attacks, skills and Yuzu seeds recharge 8% sooner per rank. |
| `family` | Best Friends | +4% companion damage and +8% shield strength per rank. |
| `splash` | Zest Splash | Pomelo sweeps reach farther, Lime arrows splash nearby foes, and Blood Orange ground Sigils cover a wider area. |
| `loyal` | Loyal Guard | Take 6% less damage per rank while within 170px of your active companion. |

### Basic mutations

| Saved ID | Display name | Effect |
| --- | --- | --- |
| `parting` | Citrus Footprints | Dashing leaves a short-lived sour patch behind your companion. |
| `pack` | Side by Side | Your companion hits 20% harder while within 200px of Yuzu. |
| `second` | Second Serving | Every fourth companion hit deals 50% more damage. |
| `hardy` | Hardy Peel | Using Unique grants an extra shield equal to 12% of Yuzu max HP. |

### Lime upgrades

| Saved ID | Display name | Effect |
| --- | --- | --- |
| `p_pulp` | Swift Ranger | Per rank: Lime moves 10% faster; Volley gains +0.10, Vaulting Shot +0.12 and Pin & Pierce +0.15 companion power. |
| `p_feast` | Quick Draw | Lime kills cut its basic attack cooldown by 0.3s per rank. |
| `y_strongarm` | Ready Quiver | Lime skills recharge 10% sooner per rank: Zest Volley, Sour Trap, Vaulting Shot and Pin & Pierce. |
| `y_bigsplat` | Sour Snare | Per rank: Sour Trap gains 15px radius, 0.25s root duration and +0.30 companion power. |
| `y_double` | Wide Volley | Zest Volley fires 2 more arrows per rank. |

### Pomelo upgrades

| Saved ID | Display name | Effect |
| --- | --- | --- |
| `p_heavyPeel` | Pulp Power | Pulp Slam gains 15% power and sweeps gain 10% power per rank. |
| `p_bodyguard` | Close Guard | Yuzu takes 3% less damage per rank while within 170px of Pomelo. |
| `y_fastripe` | Sun Kissed | Pomelo needs 20% fewer own kills per rank to grow. |
| `y_keepripe` | Golden Reach | Pomelo sweeps gain 8px radius per rank. Growth is never lost. |
| `y_giantslam` | Wide Slam | Pulp Slam radius grows 20% per rank. |

### Blood Orange upgrades

| Saved ID | Display name | Effect |
| --- | --- | --- |
| `p_sourMixer` | Acid Notes | Per rank: +0.25 Comet power, +0.02 Sour tick power, +2 points mark vulnerability and +4 points patch vulnerability. |
| `p_sweetHelper` | Spell Rhythm | Flavor spells recharge 10% sooner per rank. |
| `y_seedluck` | Honey Alchemy | Honey Rescue heals 1% more max HP and shields 2% more per rank. |
| `y_longroot` | Steeped Flavor | Sour Garden patches last 1s longer per rank. |
| `y_elder` | Bloom Reach | Aroma grows 30px, Sigils 5px, Comet 10px and Garden 8px per rank. |

### citrusGuardian Unique mutations

| Saved ID | Display name | Effect |
| --- | --- | --- |
| `ripe_fest` | Harvest Festival | Golden Peel Armor grows Pomelo one stage. |
| `ripe_shield` | Ripe Shield | Golden Peel Armor grants an extra 15% max-HP shield. |

### zestSwarm Unique mutations

| Saved ID | Display name | Effect |
| --- | --- | --- |
| `toss_rain` | Extended Focus | Hunter's Focus lasts 1.5s longer. |
| `toss_home` | Seeking Arrow | The Focus finishing arrow homes toward priority enemies. |

### juiceWorkshop Unique mutations

| Saved ID | Display name | Effect |
| --- | --- | --- |
| `grow_burst` | Bloom Burst | Perfect Blend ends with a wider, stronger flavor wave. |
| `grow_grove` | Sacred Grove | Perfect Blend also grants a 20% max-HP shield. |

### Modifiers

| Saved ID | Display name | Effect |
| --- | --- | --- |
| `m_zest` | Peel Pop | 25% of kills burst in citrus |
| `m_crew` | Crew Chain | 10% of hits arc to 2 enemies |
| `m_rally` | Rally Pulse | Every 4s a rally pulse hits around you |
| `m_sour` | Last Squeeze | +50% damage to enemies under 25% HP |
| `m_splash` | Dash Splash | Dashing drops 3 juice bombs |
| `m_bite` | Big Bite | Every 10th hit deals ×3 damage |

### Fusions

| Saved ID | Display name | Effect |
| --- | --- | --- |
| `f_harvest` | Harvest King | 45% of kills burst in citrus |
| `f_parade` | Jam Parade | Every 3s the crew blasts around you |

### Shared Unique upgrades

| Saved ID | Display name | Effect |
| --- | --- | --- |
| `uq_power` | Unique Power | Your Unique deals 20% more damage per rank. |
| `uq_cd` | Quick Recharge | Your Unique recharges 10% faster per rank. |
| `uq_kill` | Kill Charge | Each kill cuts 0.1s off the Unique cooldown per rank. |
| `uq_echo` | Unique Echo | Using your Unique also releases a blast around you. |
| `uq_ready` | Ready Rush | While your Unique is ready: +15% move and attack speed. |

Three build choices and three evolutions remain Pomelo / Pomelo Colossus, Lime / Lime Windranger, Blood Orange / Blood Orange Archwitch. Golden Peel Armor, Hunter’s Focus and Perfect Blend retain their existing timing and effects. Shared flavor infusions and trade-offs keep their existing IDs, effects and art.

## Art delivery

Built-in ImageGen, three 4×4 transparent donors plus one Dash Splash refinement. Identity references are the existing companion sheets; no redesigned characters. Exact prompts and original unmodified PNGs: `assets/incoming/yuzu59/*_PROMPT.json` and `*_source.png`. Contact sheet: `assets/incoming/yuzu59/contact_sheet.jpg` (asset review, not a game capture).

Runtime: `assets/art/build_cards/yuzu59/`, 48 unique 96×96 lossless transparent WebPs, 698,850 bytes total, 1,769,472 bytes decoded (1.69 MiB). Mechanical crop/pad/resize only via `scripts/pack-yuzu-59.py`, preserving generated alpha; per-source/runtime hashes and donor rectangles in `MANIFEST.json`. Blank transparent margins keep icons separated from the native card frame. No baked text.

The48 comprise starter1 + build3 + shared5 + basic mutations4 + path upgrades15 + evolutions3 + buff Unique Power3 + Unique mutations6 + modifiers6 + fusions2. Existing3path keys are retained and point to new single-companion art;45new keys are stage-lazy and requested only for a Yuzu run. Menu Recipe/roster loaders already support `build_cards`. No added boot decode; measured Yuzu remains299MB within300MB cap. Other heroes retain their original card paths and native fallback behavior. Generic Unique/infusion/trade icons reuse the established shared family.

## Validation

`tests/yuzu-cards.test.cjs`: all48 consumed, distinct/hash-verified art, three path-specific evolution/buff choices, full Recipe effects, no stale orb/down copy in the card data, missing-art fallback, other-hero isolation, Yuzu-only stage loading. Existing all-hero draft isolation fixture now imports the new presentation helper. Existing Yuzu mechanics/animation/AI/arsenal checks remain applicable.

Required full `npm run check` and `npm run build:www`; final results recorded in `SESSION_HANDOFF.md`. No game screenshots or headless battle simulation. Owner phone review remains for subjective icon readability and card appearance.
