# Sesame — elemental invocations, revision 8.1.1

Owner feedback, 2 November 2026: independent spell cooldowns; short rune/cast recovery and audible composition; red damage/green speed/blue regeneration; orb-focused cards; radial PMB blast; more spectacle; Rainbow Flare basic; no Brand; all ten recipes. This revision supersedes the four-spell prototype and its shared cooldown.

## Controls and cooldowns

Three P/M/B buttons replace the oldest of three orbiting orbs. Counts determine the spell, not order. Orbs remain after casting. A successful rune tap has 0.16s input recovery; casting has 0.38s shared recovery. Each of the ten recipes has its own cooldown, ticking in parallel during play. Switching recipes never clears a timer. The Unique button previews the selected spell and its remaining cooldown; RECOVER denotes the short cast recovery.

Existing Unique cooldown modifiers apply at cast time. Wind Memory reduces newly cast cooldowns based on green orb count. The cooldown ring uses the actual duration captured for that cast. Kill Charge reduces every pending recipe timer; other legacy selected-Unique recharge events affect the currently selected recipe. Pause and overlays suspend gameplay timers. Pending recipe audio belongs to the run and verifies the current recipe before playing.

## Orb passives and cards

Per orb: P/red +6% damage, M/green +4% move speed, B/blue +0.15% max HP regeneration per second. Bonuses are derived from the current three orbs, never repeatedly applied to permanent player stats. Red damage applies on hit; changing the orbs can change this live passive, while queued spell identity/base power remain captured. Blue regeneration obeys No Heal, healing modifiers and the normal 3% max HP/s shared regeneration cap. Green orb speed is capped at +30% before other temporary movement effects.

| Card | Effect per rank | Max |
|---|---|---:|
| Ember Crown | Each red orb adds another 2% damage | 4 |
| Gale Wings | Each green orb adds another 1.5% speed | 4 |
| Living Tide | Each blue orb adds another 0.075% max HP/s regen | 4 |
| Orb Radiance | Spell and flare splash areas +10% | 3 |
| Threefold Resonance | Each distinct color adds 4% spell power | 3 |
| Orb Reprise | A cast also pulses around the hero for 18 power | 3 |
| Wind Memory | Each green orb reduces new spell cooldowns by 2%, capped at18% | 3 |
| Blue Mantle | Casting grants 5% damage reduction per blue orb for2s, capped at45% | 3 |

No path draft, old Mirror mutation or old Mirror evolution in this kit. Shared Infusion, Unique upgrades, stats and critical healing retain their normal rules. Legacy talent/save investments are stored, not erased; rebuilding the permanent talent trees remains separate work and Sesame keeps its development badge.

## Ten spells

Codes below use canonical count order P → M → B. Other input orders with the same counts are equivalent.

| Recipe | Spell | Base CD | Purpose and execution |
|---|---|---:|---|
| PPP | Solar Cataclysm | 14s | Boss: three delayed meteor impacts around the priority target |
| MMM | Tempest Chakram | 10s | Clear: three spreading chakrams return toward the moving hero; separate hit ownership per arm/leg |
| BBB | Tidal Sanctuary | 18s | Survival: heal8%, stationary protective water field, brief guard and local projectile clearing |
| PPM | Sunlance Barrage | 12s | Boss: a large, fast piercing solar lance with impact bursts |
| PPB | Magma Garden | 14s | Clear: five staggered ground eruptions around the densest nearby crowd |
| PMM | Orbit Reaver | 12s | Clear: orbiting blades cut a ring around the hero, then release a final burst |
| MMB | Cyclone Confluence | 12s | Clear: a travelling vortex settles on the crowd and pulls ordinary foes inward |
| PBB | Crystal Fault | 12s | Clear: five sequential crystal breaks along the attack line |
| MBB | Mistwalk Aegis | 18s | Survival: brief invulnerability, restored Dash, temporary speed/guard and a moving bullet-clearing ward |
| PMB | Prismatic Blast | 16s | Clear: an expanding 360-degree concussive wave with three colored rings; one hit per enemy generation, ordinary-foe knockback and ranged-shot delay |

Boss-oriented spells receive a boss/mini multiplier; clear-oriented spells have a reduced boss multiplier so clear overlaps do not automatically replace dedicated boss casts. These are starting values for the owner phone playtest, not validated balance claims. Bosses/minis, immovable/frozen foes and protected fleeing/Wisp targets are not displaced. No Brand spell or attached-target caster remains in Sesame; that concept is reserved for a future hero.

Rainbow Flare replaces the basic beam: painted rainbow projectiles travel forward and splash on impact, respecting bounded additional-projectile investment. No beam visual or fireBeam call in the new basic attack.

## Original media

- Built-in ImageGen: one original16-motif RGBA sheet, mechanically packed into a16-cell192px lossless atlas plus eight64px card icons. Sources/exact prompt/alpha QA/preview in assets/incoming/sesame_invoker811; runtime in assets/art/sesame_invoker811. All hero-lazy and always deferred at boot, even with Sesame selected.
- Direct ElevenLabs Sound Effects API: six original cues, two donors each: red/green/blue rune taps, recipe confirmation, invocation and impact. Source requests/results/hash ledger and technical QA in assets/incoming/sesame_invoker811_audio; six runtime MP3s in assets/audio/sfx/sesame_invoker811. Mechanical trimming/gain/fades only; no synthetic replacement sounds or imitated game/music. Technical decode/peak/DC checks are not a claim of owner semantic listening approval.
- World orbs reuse three persistent images; invocation/impact flashes, projectile and large-spell actors are bounded. Painted motifs move, rotate, scale and fade in code; clear collision/telegraph geometry remains if textures fail. Reduced motion holds orbit positions and suppresses decorative rotation.

## Delivery checks and scope

New kit applies to ordinary Story and endgame runs after tutorial completion. Explicit tutorial keeps the old teaching fallback. Access remains after C1-5 (v8.1.0). No new stage unlock, lore sequence or permanent point refund is introduced.

Tests exercise ten count recipes, independent timers/short recovery, input ownership, sounds after admitted taps, live bonus hooks, all spell event adapters, radial pool identities/boss push immunity, No Heal, cleanup and exact media. Real static Canvas review checks24 control layouts, ten previews, atlas frames and browser audio decoding. Shared menu contracts and full check/build remain release requirements. Owner reviews thumb comfort, loudness, readability, balance and FPS on the phone; no headless combat playtest or screenshots used to approve aesthetics.
