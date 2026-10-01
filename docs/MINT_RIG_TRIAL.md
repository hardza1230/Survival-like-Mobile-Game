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
3. `node scripts/preview-mint-rig.cjs` renders 240 frames from the actual production rig into `/tmp/mint-rig-preview/` and a contact sheet.
4. Encode frames at 30fps into a GIF or video for motion review.
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
