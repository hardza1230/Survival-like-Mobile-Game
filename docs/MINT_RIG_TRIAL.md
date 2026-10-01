# Mint 2D cutout rig trial — v6.0.56

Mint gameplay uses a lightweight rigid cutout skeleton implemented in Phaser. This is a working joint hierarchy with painted body parts, not frame-by-frame sprite animation. It does not use weighted mesh deformation, Spine or external animation runtimes.

## Art and runtime

- Source: `assets/incoming/mint_rig/mint_rig_parts_source.png` (built-in imagegen, referenced original Frostleaf sheet).
- Packed runtime: `assets/characters/mint_rig_parts.png`, 512×512 RGBA, sixteen separate transparent parts.
- Fifteen bones; fourteen visible skins. Back hair cap is retained for future use; closed head replaces the open head during blink.
- Parent transforms drive shoulders → forearms → lance, hips → thighs → boots, torso → head → ponytails. Skin ordering stays fixed.
- Idle breathing/blink, continuous locomotion, upper-body attack while running, joint interpolation, hair sway, dash, hurt and collapsed death presentation.
- Short dash snapshots throttled to 90ms, expire after 220ms, cancel on character replacement/shutdown.
- Mint rig silhouette height approximately 56px. Attack/dash do not change character scale. Existing invisible physics sprite retains collider, velocity, HP, projectile handling, camera targeting and all saved progression.
- Original sprite remains available for missing-texture fallback. Other heroes, cards, selection portraits and skills retain their previous implementation.

## Reproduce

1. With development dependencies installed: `node scripts/pack-mint-rig.cjs`.
2. If source art changes, copy `frames.json` into `MINT_RIG_FRAMES` in `game.js`, then tune bone offsets/origins against assembled poses.
3. `node scripts/preview-mint-rig.cjs` renders 480 frames at 60 FPS from the actual production rig into `/tmp/mint-rig-preview/` and a contact sheet.
4. Encode frames at 60fps into a GIF or video for motion review.
5. `npm run check` and `npm run build:www`.

The packer isolates the main connected silhouette of each source part, excludes layout separators, preserves RGBA, and normalizes with transparent gutters. The source lance requires a dedicated horizontal crop because its generated tip extends beyond the nominal source cell.

## Generation brief

Built-in imagegen; transparent background; reference `assets/char_mint_frostleaf_sheet.png`. Preserve Mint twin ponytails, teal eyes, white/mint armor dress and blue crystal lance, cute chibi painted 2.5D style. Request sixteen detached parts in a four-by-four atlas: two ponytails, open head, rear hair cap, torso, upper left arm, forearm left, upper right arm, forearm right, thigh left, boot left, thigh right, boot right, horizontal lance, front skirt flap, closed head. Require full hidden joint overlaps, clean transparent edges and no text. Generated source is archived; do not regenerate it when rebuilding.

## Verification

Automated tests exercise production forward kinematics, moving casts, constant scale, dash/hurt/blink, mirror/tint/depth/visibility, texture fallback, character switching and cleanup. The preview renders production poses, rather than the game scene. Full in-game mobile review is still required: Mint at normal size, high attack speed, moving cast, repeated dash, left/right turns, hit flash, pause/level-up, death/revive, stage transition and returning to menu. Measure device frame time before migrating other heroes. No device performance claim is made by the fixture tests.

## v6.0.57 gait and grip correction

User device review found the first gait unnatural. Opposed thigh swings could cross the feet in frontal projection. The cast also translated the lance away from its hand joint. Replaced the gait with two-bone IK (8/12px links), separate left/right foot lanes, 2.3px swing lift, 0.65px depth stride and fixed upright boots. Chibi legs are shorter; presentation root is shifted 8px to meet the existing ground shadow. Walk phase follows distance, and stop does not drift the gait clock. Reduced torso and hair movement. The weapon joint is fixed to the hand; arm extension performs the attack. Updated production-pose previews and regression tests. Mobile review remains required; the attachment is a still image and cannot establish the exact timing of the reported animation.

## v6.0.58 neutral limb art rebuild

The v6.0.57 preview still exposed the first source atlas defect: limbs had diagonal poses baked into the paint, while joints were driven as straight bones. Correcting timing did not correct the painted silhouette. Eight replacement neutral limbs are archived in `assets/incoming/mint_rig/mint_neutral_limbs_source.png`. The built-in imagegen tool used the original Mint sheet and prior parts atlas as references. No head, torso, hair or weapon artwork was replaced.

Generation brief: four columns by two rows, one detached limb per cell, transparent background, no separators or labels. Left upper arm, left forearm plus relaxed hand, right upper arm, right forearm plus gripping fist; left thigh, left calf plus boot, right thigh, right calf plus boot. Require straight vertical bind pose, centered top/bottom joints, matched limb thickness and length, short chibi proportions, soft painted mint/white ice fantasy details, complete hidden overlaps, no baked bent elbows or knees and forward-facing matched boots.

`node scripts/pack-mint-rig.cjs` now automatically overlays the replacement limbs via `scripts/pack-mint-rig-limbs.cjs` and refreshes inline runtime frame bounds. Upper arm links are 8px; right palm attachment is at local (0,8.5). All arm skin joints have centered horizontal origins. Shoulders are calibrated against torso artwork at (-7.5,-4) and (8,-4). Preview contact sheet and 96-frame GIF reviewed. Automated checks/build pass; user review in gameplay is still pending.

## v6.0.59 flowing run

Accepted neutral limbs retained. Added visibly bent elbows and free-arm pumping; both arms participate in locomotion while the right arm also casts. Free arm layers over the dress rather than disappearing behind it. Toe lift uses a squared positive sine for softer lift/landing; swing clearance increased to 4.1px, stride to 1.65px. Hip bob uses a smooth double-step cosine, torso leans into travel with head counter-motion, and hair blends more slowly than arm joints. Idle/run blend and continuous distance-based gait remain. Tests cover visible arm range, bent running elbow, swing clearance, draw ordering, stop blend, no crossed feet, grip attachment and 30/60 FPS phase. Focused run/run-cast preview: `docs/previews/mint_run_v6_0_59.gif`. Real-device feel review remains pending.

## v6.0.60 directional run correction

The v6.0.59 free forearm flexed toward the rear and the frontal lane solver looked like a sideways shuffle. Free elbow flexion now points forward, and counter-swing follows the forward/back stride. Both knees bend toward the rear, with hip origins narrowed to ±2.5px. Swing travels rear → front with toe lift; stance travels front → rear. Feet may pass in projection, which is normal for this view; skin identity and far/near layering stay fixed. Regression checks replace frontal no-crossing constraints with knee bend direction, bounded toe angle, fixed leg skins and an 8px minimum sagittal stride.

Built-in imagegen generated two matched right-facing three-quarter profile boots with vertical calves, complete overlap joints, the existing mint/white crystal palette, no front-facing toes, no opposite-facing shoes, no text or ground shadow. Reference: packed Mint parts atlas. Source: `assets/incoming/mint_rig/mint_profile_boots_source.png`. `scripts/pack-mint-rig-boots.cjs` overlays slots 10/12 after the neutral-limb packer and updates frame bounds. Full pipeline: `node scripts/pack-mint-rig.cjs`. Preview: `docs/previews/mint_run_v6_0_60.gif`; six-phase contact sheet: `docs/previews/mint_run_cycle_v6_0_60.png`. Automated tests/build and preview inspection pass; real-device feel review remains pending.

## v6.0.61 smooth joint motion

Accepted art, bend directions and run silhouette retained. Joint positions/angles, movement weight and boot roll now use analytic critically damped springs, preserving velocity when the target changes. Moving targets are sampled in 120Hz substeps. Hair uses a softer spring than limb joints. Cubed positive-sine toe lift/roll gives continuous acceleration at lift/landing. Casting still overlays locomotion and repeated casts do not reset joint velocities.

Tests compare joint trajectories at 20/30/60/120 FPS, target-change continuity and repeated cast velocity alongside directional knee/skin/grip checks. Production preview generator renders 480 native frames at 60 FPS. `docs/previews/mint_run_v6_0_61_60fps.mp4` contains 240 frames over four seconds; `docs/previews/mint_run_v6_0_61.gif` is sampled at 30 FPS. Previous 16 FPS GIFs were insufficient for assessing smoothness. Automated tests and preview rendering do not establish the device rendering frame rate; gameplay feel/performance still requires mobile review.

### v6.0.62 — Spear throw
- Added raised weapon-arm wind-up, forward release and smooth return; locomotion keeps running independently.
- Frost Lance launches at 192ms (40% of a 480ms throw), with a state/player guard on the delayed launch. Original sprite fallback remains immediate.
- Held spear disappears at release and fades back during recovery; dash ghosts preserve weapon alpha.
- Wind Rush retains its previous thrust animation. Attack cadence, projectile damage/count/speed remain unchanged; rig Frost Lance now has a 192ms anticipation delay.
- Mobile visual/timing QA remains pending.
