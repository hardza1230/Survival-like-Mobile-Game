# Taro T5 - talents and progression
Implemented 2026-10-13, runtime v7.8.14. Owner authorized T5. No save migration, refund or new combat loop. Existing prototype values stay pending phone feedback; this package clarifies scope and restores authored rarity potency.

## One source for progression descriptions
Immutable taroAttackInfo overlays the selected path on the existing BASIC_ATTACKS.taro IDs, max ranks, icons and gates. Basic upgrade cards, mutation/evolution cards and Weapon Codex use the same descriptors. No path returns the unchanged legacy definition. Evolution keeps the Stormstep Sovereign identity. Codex offers three 44px Taro path buttons, stacked complete descriptions and navigation after content; normal menu scrolling exposes long content. Taro Talent details reserve more vertical space for effect and scope text. Other hero attack definitions are unchanged.

| Investment | Chain | Smite | Tempest |
|---|---|---|---|
| power | +12% base path attack power/rank, including D-based secondaries | same | same |
| rate | basic interval x0.92/rank | same | weak basic only; no faster movement charge or Dash |
| arc | +1 victim/root; max 10, overflow +3% bolt damage each, max +15% | +1 nearby splash, max 3; overflow +5% splash damage each, max +25% | +8px base nova radius; added radius max +60px, final max 280px |
| surge | +1 shared-target root; max 3, overflow +5% bolt damage each, max +25% | +8% primary/repeat power per extra root; max +40% | +8% nova/bomb power per extra root; max +40% |
| Chainlord | +2 victims, x1.4 jump range, existing caps | +2 splash capacity; no normal bounce | +16px base nova radius, x1.15 radius, existing caps |
| Stormcaller | +20% D and +2 roots | +20% D and two extra-root damage steps | +20% D and two nova/bomb damage steps |
| Evolution | +20% D, +3 victims, +2 roots, x1.5 jump range | +20% D, +3 splash capacity, two extra-root damage steps | +20% D, +24px base radius, x1.15 radius, two nova/bomb damage steps |

Count overflow and range caps are still the T0-T4 rules. No extra shrapnel from power/rate, no repeat-on-repeat, no movement charge from damage. Unique retains its separate level formula; basic power/mutation/count effects do not multiply it. Echo Map retains +2 Unique targets, +40 jump range and +0.55s haste. Conditional big/far/low hit bonuses still apply centrally, including valid Unique hits.

## Existing path Talents and capstones
All root/a1/a2/b1/b2/c1/c2/capA/capB/capC save IDs, maxima, prices, prerequisites and exclusive-capstone rule remain. Every node effect is compared against T4 in tests/fixtures/taro-t4-talents.json. Only scope labels changed; no survival capstone became a damage bonus.

- Chain: root +5% D/rank, a1 +6% D/rank, a2 +10% big-target hit damage/rank; b1 x0.96 basic interval/rank, b2 +8% basic root/jump range/rank. CapA +2 basic roots using overflow, capB +20% D, capC moving guard -20% damage taken.
- Smite: root +6% D/rank, a1 +10% big-target hit damage/rank, a2 +10% hit damage while player HP below 50%/rank; b1 x0.96 basic interval/rank, b2 +8% priority selection range/rank. CapA +40% big-target hit damage, capB +30% D / x1.10 basic interval, capC still 0.6s guard -40% damage taken.
- Tempest: root and b1 each x0.96 weak basic interval/rank; a1 +6% D/rank, a2 +10% hit damage beyond 300px/rank; b2 +8% weak basic selection range/rank. CapA x0.75 weak basic interval, capB +35% hit damage beyond 300px, capC moving guard -20% damage taken. Basic range/interval nodes do not alter nova radius, walking distance, Dash or effect fuses. Far bonuses require a target actually beyond 300px; they do not give a free close-range nova bonus.
- All three retain generic c1 +6% max HP/rank and c2 -5% damage taken/rank, core HP/speed/cooldown/crit and Unique Mastery TP costs 3/5/8. Core cooldown remains global skill cadence, not active effect fuses.

Path scalar D factors are multiplicative per rank; big/far/low conditional bonuses use the existing additive path fields before central damage. No double application of _pm.dmg into the shared D profile. Path effects activate only for the selected path; scalar projection reconstructs fx rather than appending ranks. Unknown saved talent keys remain untouched.

## Rare-card potency correction
Selected-path scalar upgrades previously read purchase count lv even though the card stored/showed a higher rolled ranks value. T5 uses rolled ranks (falling back to lv for old inputs), bounded at authored max x1.55: Static Build/Overload D, Judgment/Far Strike conditional fields and Gale Dash cooldown. Basic power/rate already used ranked potency. Integer count upgrades such as Squall use purchase count, preserving exactly +1/rank and rarity count policy. No reroll, free rank, refund or persistence change. Gale is x0.94 per effective rank in both pure profile and the actual accepted Dash cooldown; basic interval and nova/bomb/sweep/repeat fuses unchanged.

## Checks and phone review
Final full npm check/build and browser QA state are recorded in SESSION_HANDOFF.md. Pure definition/profile and isolated adapters compare all saved Talent effects/costs/caps with T4, verify unknown-key preservation, immutable descriptors, count/scalar distinction and Gale scope. T1-T4 suites retain all combat resolver bodies; the Dash hash normalizes only the authorized Gale expression replacement. No headless combat simulation or measured balance/FPS claim.

Phone: compare displayed Arc/surge/mutation/evolution against each path, try rare scalar cards versus ordinary cards, check existing saved Talents/capstone lock/TP price, compare Gale with basic rate, and review readability/feel. T6 art/sound/mobile feedback is next when authorized; #25 deferred.
