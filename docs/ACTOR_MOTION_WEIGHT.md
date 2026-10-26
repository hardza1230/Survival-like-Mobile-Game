# Hero and enemy motion weight · v8.0.52

Owner chose the first two art priorities: main hero motion/attack identity, and enemy role/anticipation/hit identity. Existing hero run/attack/charged-lance sheets and enemy walk/idle/windup/attack/hurt sheets already cover this pass. Reuse those original assets; no ImageGen request, new textures, sounds or GPU cost needed.

## Heroes

- All seven supported heroes keep continuous12frame gait. Phase advances with actual speed relative to base speed, clamped .35–1.6×; base-speed cadence remains16FPS. Stopping pauses phase and resuming continues it. Moving attacks retain running legs.
- Short damped lean, stop settle and Dash landing recovery add weight. Landing no longer requests a150ms full-body squash hold, so it does not interrupt walking or replace a hurt pose. Existing Dash duration, velocity and invulnerability remain.
- Sniper, Impaler, Shotgun, Titan and magic have distinct recoil/anticipation profiles. Maximum new rotational offset is .17rad; no extra position offsets or new scale expansion. Existing source-padding compensation and tight scale bounds remain.
- Auto Sniper/Impaler and held Unique charging reuse the first two attack preparation frames while stationary. Movement retains run animation. Release starts in the release section rather than replaying preparation. Repeated rapid attacks do not reset a stationary clip during its first55%; all shots/damage remain on their original schedule.
- Existing Chocolate bespoke Titan/Flicker/build poses retain their own controller. General springs now use bounded120Hz substeps for every hero, preventing unstable long-frame recovery. All original appearance compensation remains.
- State belongs to player/hero/path/art epoch, resets through character-renderer reset and lazily on ownership changes. Pause does not advance pose/weight clocks. Reduced motion removes added lean/recoil/settle, suppresses dust/Dash decorative trails and renders steady base scale.

## Enemies

The common presentation controller assigns cached roles: heavy (siege, slow movement or tank/guard silhouette), swift (Dash/fast), ranged (shooter/acid) or normal. Authored walk animation tempo follows current velocity relative to species speed; heavy .78× and swift1.3× produce different weight. Small role-specific sway reinforces this without changing AI movement or attack schedules.

Successful nonlethal hits add a160ms directional recoil, weighted by critical/damage fraction. Heavy bodies respond more subtly. No new knockback, hit stun, HP changes or velocity edits are introduced. Authored hurt clips remain in use where present; missing hurt art can still show small recoil. Windup/attack/Dash keep priority and suppress added hit rotation, preserving danger cues. Frozen actors pause animation and weight together. Death/pool reset clears all weight state; bosses/minibosses remain on their existing phase presentation system.

## Limits and verification

No added sprites/tweens/timers/FX pools, new asset downloads or additional GPU textures. Configured physics circles, existing scale limits, world coordinates, attack damage/cooldowns/projectiles/rewards remain. Weight changes sprite rotation and frame cadence; it does not implement new attacks or AI.

`tests/actor-weight.test.cjs` runs production presentation helpers only, across7heroes at30/60/120FPS: gait speed/continuity, stop/Dash, charge-to-release, rapid clip retention, recoil, long-frame springs, paused/reduced/owner changes, heavy/swift/ranged tempo, directional hit, warning/freeze/pool/boss guards, unchanged coordinates/velocity/configured radius and no gameplay calls in new helpers. Existing Mint/Chocolate/enemy tests remain. Taro resolver hash normalizes only the new presentation hook, preserving the old damage-body snapshot. Content validator now checks the continuous gait expression instead of the old fixed-clock spelling.

Full checks/build/publication status are recorded in the handoff. No combat simulation or automatic game screenshots. Owner phone review remains for subjective weight, charge-frame alignment and low-FPS readability.
