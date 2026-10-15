# Taro Arc / Spark / Sentry — v7.8.18

Owner approved 2026-10-15. Rift Needle remains the starter; outgoing Arc remains the chain build. The former Smite and Tempest slots become Spark and Sentry. Unique is Storm Beacon on every build, including before path selection.

## Mechanics

- Arc: existing outgoing root bolts, distinct growing chains and terminal shards remain.
- Spark: starts with three moving sparks, wandering trajectories and swept reflection against world bounds/solid props. One hit per victim per projectile. Extra Sparks adds count, capped10/cast; overflow converts to bounded damage. Piercing Current adds pierce, cap3; overflow converts to bounded damage. Live Current adds15% lifetime/rank; Fast Sparks adds12% speed/rank. Life cap3s, speed cap440, targeting/travel range cap900. Split Spark creates two terminal children on the first accepted hit, excludes already-hit victims, and cannot split again. Child damage starts35%, lifetime at most0.8s. Total Spark/child budget36.
- Sentry: automatically places fixed temporary nodes near Taro while a target is in range. Two regular nodes maximum; oldest is replaced. Each sends slow Ball Lightning toward nearby foes. Orbs move straight through foes and pulse on each victim at most once per0.30 active seconds. Reserve Cell extends node life (+0.35s per mapped arc rank, cap8s); Wide Conductor expands orb collision radius (cap40% bonus); Rapid Pulse gives10% shorter pulse interval/rank. Orbs across regular nodes and Beacon share cap12. Deployment interval has0.55s floor; pulse interval0.35s floor.
- Storm Beacon: one separate node, replacing itself on recast, cooldown8.5s. Unique levels1–4 increase damage and lifetime5/6/7/8s. Echo Map adds2s lifetime and40 targeting range. No path required. Uses existing Unique Mastery costs/gates; no free extra regular node slots.

## Compatibility and ownership

Saved IDs remain storm=Arc, smite=Spark, tempest=Sentry. Raw starter definitions and original path upgrade effect/max values remain; new run cards add new IDs. Existing paid Talent IDs, effects, max ranks, TP costs and exclusive capstones remain. Display overlays describe the new skill scopes. Spark range investments extend travel lifetime; Sentry cadence investments affect deployment and pulses. Original Dash cooldown card remains Dash-only. Do not restore old Smite/Tempest runtime dispatch based on retained historical helper names.

Node/projectile lifetimes use active gameplay time. Pause hides visuals and suspends progress; path/player/run epoch changes, death and shutdown clear ownership. Enemy spawn identities prevent recycled enemies inheriting prior hits. Children and orbs carry terminal secondary provenance through central damage; they do not recursively emit new innate attacks. Shared gear/Forge damage and reward ownership remain central. Node art is NORMAL blend, 58px display; live nodes/projectiles use bounded persistent visuals separate from the existing20 transient lightning FX cap. No active movement-charge/Dash-bomb/Rod hooks on new paths.

## Art and verification

New built-in ImageGen asset: assets/art/taro_swarm/sentry.webp, transparent128x128 lossless WebP. Exact generation prompt and raw source SHA: PROMPTS.json; runtime dimensions, alpha and SHA: MANIFEST.json in the same folder. Spark and Ball Lightning are code-native shapes; existing T6 sounds reused.

npm run check and npm run build:www passed (1313 assets). New taro-swarm test covers pure profiles, geometry and isolated actual adapters for caps, split terminality, orb hit gap, pooled identities, pause/epochs, cleanup and pre-path Beacon. Historical taro-tempest and taro-smite prototype suites remain in history but are retired from the required check because their live paths were replaced. Shared foundation, Arc, starter, saved Talent and unrelated-hero tests remain required; old isolation assertions now explicitly admit the approved Taro changes.

Static real Canvas visual gallery passed320x740,390x844,430x932, actual texture alpha/visibility/lifecycle and decoding of five existing cues. Real Codex four views plus all path Talent scopes passed320x568,390x844,430x932,768x1024,844x390. These menu/static presentation checks do not simulate combat. Owner phone combat balance, touch readability and FPS remain pending. Publication status is in SESSION_HANDOFF.

## Verified publication

Runtime02432667de9863d7ad08aea3babd00dcac5a368a; exact tested/published tree ede68e7347d6e279fb05ef4fd2ff0db68370ed74. Pages38607096940 succeeded2026-10-15. Live version.json7.8.18, full source after removing only two build-injected asset manifests, and new Sentry SHA-256 b94cc0d07d24072edc8c34d3d0927ebd15ea6ad3a61406fb7b4c34074f6c2f84 match local. Owner phone review remains pending.

## v7.8.19 Sentry rework (owner approved all proposals 2026-10-15)

- Deploy: castTaroSentry places only when fewer than 2 regular nodes, or when the farthest node is more than TARO_SENTRY_LEASH (350px) from Taro (that node is replaced). Live nodes refresh pulse/damage/radius/range/overload/link from the current profile on every cast. Node lifetime is no longer cut by deploy cadence; rate cards/talents now read as pulse speed.
- Orb cap TARO_ORB_CAP 16 (was 12). Orb visual outer ring = real hit radius.
- Orbs (every 0.30s, hit radius) and Sparks (16px) call hitCratesInRadius.
- Storm Beacon: on cast deals strike = (2.5+n)·dm·(1+0.22(n−1)) to every foe within TARO_BEACON_STRIKE_R (200px) as source 'beacon' (terminal), breaks crates, big strike visual + ring + shake. While a Beacon stands, regular nodes pulse TARO_OVERCHARGE (1.5×) faster.
- Cards: p_gale (Quick Reposition) removed from the Sentry path list. New p_sentry_overload (max 2: regular sentry orbs burst on natural fade for 1.5×rank orb damage, radius ×1.4, once; never on epoch/run clear; Beacon orbs excluded) and p_sentry_link (max 2: two regular nodes within 420px link every 0.5s, foes within 26px(+size) of the segment take 0.8×rank orb damage). taroGaleCooldown still reads p_gale (now always 0 for Sentry).
- Tests: tests/taro-swarm.test.cjs extended (leash/no churn/refresh, strike+overcharge, crates, Overload once-only, Tesla Link range/tick).

## v7.8.20 Sentry art wiring

19 delivered PNGs packed by scripts/pack-taro-sentry-art.py into assets/art/taro_sentry/*.webp (turret sheets and Beacon strike halved to 128px cells; black VFX converted to luminance alpha; NORMAL blend) and six icons into assets/art/build_paths/taro_*.webp. ASSET_FX keys bpx_taro_* (artHero → Taro-only lazy hero class). taroArt(key,x,y,w,{h,life,tint,then,depth}) draws tracked sprites (life 0 = persistent). Node: deploy chained to idle (Beacon: tall idle), fire on each orb, launch flash, expire (Beacon: orb burst) on natural expiry/replacement via taroRemoveNode(node,true); overcharge aura child while a Beacon stands. Orbs use bpx_taro_ball sized radius×2/0.84 (Beacon orbs tinted gold), orb hits show bpx_taro_orb_zap, Overload uses bpx_taro_orb_burst, Tesla Link is a persistent stretched bpx_taro_tesla beam (taroLinkBeam), Beacon cast plays bpx_taro_beacon_strike (anchor bottom) + bpx_taro_beacon_ring. Every call falls back to the previous code-drawn visuals when a texture is missing. Unique button shows ic_taro_storm_beacon (syncUniqueIcon in drawUniqueRing). Static Chromium gallery on a light floor colour checked alpha/framing; no combat simulation.
