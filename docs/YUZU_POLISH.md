# Yuzu companion polish · v8.0.47

Owner requested animation timing/states, AI and more distinctive attacks for Pomelo/Lime/Blood Orange. No companion count increase, damage/EXP/reward formula or card/talent id changes. Normal cadence now respects authored preparation/recovery and can wait while a special or landing plays; phone feel/balance remains owner review.

## Timing and ownership

Owned actions replace immediate ranged emissions: arrow160+200ms, orb240+220ms, volley260+300ms, brew320+250ms, trap200+180ms (prepare+recover). Fast attack investments compress the pose to the existing attack period. Release is once on crossing the threshold, even at30/60/120FPS. Pause/cards freeze progress; owner player/basic/path/art-epoch/down/clear/menu/death guards cancel stale releases. Dash preempts casts rather than leaving a delayed projectile. Normal Pomelo sweep still hits at55% of its300ms lunge, now with a visible painted crescent; Slam/Pounce gain160ms preparation and220ms landing recovery, Roll120ms preparation and its own curled pose. Slam impact uses existing preference-aware short shake/hitstop and ElevenLabs cue. Original projectile speed/life/swept hit radius/damage/pierce/bounces remain; motion victims additionally use pooled spawn identity.

## AI

Targets persist for550ms and only switch afterward when materially closer, or immediately on death/recycle/out-of-range. New targets must remain within500px of Yuzu; Pomelo selection weights danger close to Yuzu. Empty searches are throttled. Lime/Blood Orange start retreat below145px and keep retreating until215px; basic shots wait below95px and Lime volley below110px. Lime tether240px/preferred reach365; Blood Orange tether155px/reach300 supports its aura. Beyond440px, return at boosted speed to within110px; emergency relocation only beyond1200px, with a bounded visual. Positions clamp to existing map bounds. Offensive brews and trap placements wait for a target; Sweet may heal an injured Yuzu between fights. Existing taunt and target exclusions remain.

## Visuals and art

Explicit pose resolver: idle/move, windup/release/recovery, leap/roll/Dash, landing, hurt, down and revive. Supplementary images retain each companion’s identity while down; missing supplementary art retains its old companion sheet. Blood Orange has distinct gold Sweet/green Sour/orange Spicy release poses and aroma orb art; Lime draws/releases a seed arrow; Pomelo uses its sweep crescent and slam/roll silhouettes. All three keep old walk/attack sheets. Optional stretch/roll rotation honors reduced motion; no full-screen new flash.

Four new ImageGen alpha sheets/28frames (24poses+4attack cells), lossless256px cells,1,317,802bytes/7MiB decoded for Yuzu only. Runtime assets/art/yuzu47/MANIFEST.json records source/final SHA256 and crops. Source PNGs + exact prompts assets/incoming/yuzu47; Blood Orange v2 edit removes cross-cell flame/clipped staff, original retained. scripts/pack-yuzu-47.py performs only mechanical crop/common scale/alpha encoding. Prefix yz_ retains hero-lazy loading and exclusion from other heroes. The existing8FX/48shots/10zones budgets and cleanup remain.

## Validation

Existing yuzu-companions contracts cover HP/taunt/crit/bounce/swept collision/Unique/card/talent ownership and original40frames. New tests/yuzu-polish.test.cjs covers release timing at3FPS rates, recovery/tempo/pause/cancellation/Dash, own down/revive/cast/roll images, sticky targets/recycled identity/retreat/leash/search budget and new source/runtime hashes. Static production Canvas scripts/build-yuzu-polish-review.mjs + check-yuzu-polish-ui.cjs:168poses+24projectiles at320×568/390×844/844×390, normal/reduced, actual atlas cells/bounds/cleanup/browser errors. Source and phone-size screenshots visually reviewed. No combat simulation. Actual phone pacing, AI behavior in crowded arenas, balance/audio/FPS remains owner QA.
