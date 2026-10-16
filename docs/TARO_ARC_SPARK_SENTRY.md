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

## v7.8.21 Splitting Sparks (owner phone feedback: longer, faster, pierce; nothing to bounce off)

Base life 2s (cap 3.5), speed 380 (cap 560), pierce 2 (+1 per Piercing Current, cap 5; overflow damage past 5). On-hit split removed. Fission by flight time: every TARO_SPARK_SPLIT_AT (0.42s) a Spark of gen<TARO_SPARK_GENS (2) splits into 2 sparkChild at ±0.45 rad with the remaining life, power ×split (0.55, or 0.75 with Split Spark), inherited victim set and remaining pierce (min 1); parent ends only if at least one child spawned (36 live Spark cap). Gen scale 1.25/0.9/0.65 for visual and hit radius. Children stay terminal (no procs). taro-swarm test updated.

## v7.8.22 Ball Lightning size/cadence

Owner: orbs too big, want faster hits. Sentry orb radius 36→57 (was 60→95), Beacon orb 46 (was 72); per-victim hit gap TARO_ORB_HIT_GAP 0.2s (was 0.30). Damage per hit unchanged.

## v7.8.23 Bouncing Sparks

Owner: fire from all around Taro and bounce off the screen edge. castTaroSpark spreads count evenly over 360° from a random start (still needs a foe in range to cast). Sparks reflect off the camera worldView (10px inset, taroBounceView) in addition to solid props/world bounds; the travel-range cutoff now applies only to orbs. Life 3.5s base (cap 5). Fission unchanged.

## v7.8.24 PoE Ball Lightning + lightning swing

Owner: Taro cannot clear C1-4 (other heroes at C2-4); lightning should swing wide; Sentry orbs should be PoE Ball Lightning. Orbs (Sentry/Beacon) no longer hit on contact: taroOrbZap every TARO_BL_TICK 0.15s zaps up to 6 nearest foes within radius (Sentry 85→120 with Wide Conductor, Beacon 95), drawing max 2 bolts per tick; speed TARO_BL_SPEED 110; zap damage unitD×0.30 (was ×0.22 per contact hit). Spark power unitD×0.60 (was ×0.36). taroLightningRoll() 0.2–1.8 (mean 1) multiplies Spark/orb/Beacon strike/Overload/Tesla hits at the call sites (taroDealDamage body is hash-locked). Orb visual: small bright core + faint zap-radius field (old big ring sprite no longer used). New art order docs/art_orders/18_TARO_SPARK_BALL_LIGHTNING_ART.md.

## v7.8.25 Plasma Field, Overcharge Detonation, Shock, spike needles, Spark/Ball art

- Unique per build via TARO_UNIQUES + uniqueInfo: pre-path Plasma Field (castTaroPlasma/taroTickPlasma: ring 24→280+30(n−1)px in 0.9s and back, follows Taro, each foe once per direction, damage (1.5+.5n)dm→(6+2.5n)dm·(1+.22(n−1)) by distance, source unique); Sentry Overcharge Detonation (castTaroOvercharge: fill to 2 sentries, each fires 6 orbs and explodes 150px for (3+1.2n)dm·(1+.22(n−1)), then 2 fresh sentries, t.overUntil 4s pulses ×1.5); Arc/Spark keep Storm Beacon. Routed inside castStormBeacon (castPathRecall string kept).
- Shock (Sentry only): orb/detonation hits add e._shock (max 5, 3s, reset on spawn); Sentry-family damage ×(1+.05·stacks) (taroShockMul/taroShockAdd).
- Rift Needle: taroFireNeedle spawns a piercing bullet (getBullet, proj_frostlance tinted violet, 950px/s, seedPierce, life=range/speed, ×1.35 power) instead of an instant ray.
- Spark/Ball art: 11 VFX + 5 icons packed by scripts/pack-taro-spark-ball-art.py to assets/art/taro_spark_ball/ (bpx_taro_spark*, bpx_taro_ball_*) and build_paths/taro_*.webp; spark sprite/split/bounce/hit/burst, ball core (gold for Beacon) + attached zap-radius field, zap bolt + zap hit, fade. All fall back to code visuals.
- Art order additions D–H in docs/art_orders/18_TARO_SPARK_BALL_LIGHTNING_ART.md (incoming folder taro_unique_needle).

## v7.8.26 Sparks vs bosses

Owner: Spark weak on bosses because it spreads. Sparks within TARO_SPARK_SEEK (260px) of a boss/mini steer toward it (TARO_SPARK_TURN 5 rad/s); boss/mini hits do not consume pierce and the same spark may re-hit that boss every TARO_SPARK_BOSS_GAP (0.3s). Normal foes still once per spark.

## v7.8.27 Static Arc starter, Overload Loop, Arc Plasma Field, Spark buff, Unique power fix

- Pre-path normal attack castTaroNeedle now casts Static Arc: roots = needle shots (1–3), each jumps up to 3 (+1 per Arc Reach rank, cap 6) within TARO_ARC_JUMP 180, power ×TARO_ARC_STARTER 0.75 growing +12%/jump, direct damage(). Spike-needle bullet (taroFireNeedle) is no longer called. Starter cards renamed Arc Power / Quick Arc / Arc Reach / Extra Arcs; skill name Static Arc; Codex tab Starter.
- Overload Loop (starter + castTaroChainBasic): when a chain has no new target, remaining jumps hit the last target at TARO_ARC_LOOP 0.6 (Arc Build ×(1+0.15·p_arc_overload)), rolled. New Arc card p_arc_overload (max 3). Hash fixtures taro-t3-baseline / taro-t5-resolvers updated for castTaroChainBasic.
- Arc Build Unique = Plasma Field (arc variant): each ring hit fires one Arc jump (50% of the ring hit) to the nearest other foe; with none it loops twice at 0.6 into the same foe (taroPlasmaArc).
- Bug: Unique damage used tiny dm multipliers. Plasma min/max (6+3n)/(18+8n)·dm·(1+.22(n−1)); Storm Beacon strike (8+4n)·dm; Overcharge boom (10+5n)·dm.
- Spark: +1 base count (count+3), speed 460 (cap 640).

## v7.8.30 Plasma, Arc and Shock art (order 18 E–I)
- Plasma Field: persistent `bpx_taro_plasma_ring` sprite sized `r×2/0.92` each tick; `plasma_cast` on cast, `plasma_hit` per ring hit (visual budget).
- Overcharge Detonation: `sentry_overload` on every node, then `sentry_detonate` (fallback `orb_burst` → ring).
- Shock: `taroShockMark` shows `shock_marker` frame = stacks−1 above the foe, `shock_aura` loop at 5 stacks; cap 40, refreshed/removed in `taroTickShockMarks`.
- Static Arc / Arc chains: `taroArcBolt` stretches `arc_bolt` (normal jump) or `arc_loop` (Overload Loop) + `arc_hit` / `arc_overload_hit`; falls back to `chainBolt`.
- Unique icon per build: Plasma Field (pre-path/Arc), Overcharge (Sentry), Storm Beacon (Spark). Card icon `ic_taro_arc_overload`.

## v7.8.31 Arc focus + Plasma vs bosses
- Arc build: boss/mini within root range → every root and every jump strikes it at 100% (× 1+0.15 per Overload Loop rank); no boss → normal chain + Overload Loop.
- Plasma Field: ×1.75 damage to bosses/minis (`TARO_PLASMA_BOSS`).

## v7.8.33 Spark Storm Unique + Spark +25%
- Spark Build Unique replaces Storm Beacon: 16 (+4/Unique level, +4 Echo) Sparks every 0.05s in a spiral; each pierces, homes on bosses (one hit per boss) and is forced to detonate after 1.1s or when pierce runs out (radius 72, (5+2.5n)·dm). Spark hit (3+1.5n)·dm. No fission.
- Spark basic damage ×0.75 unitD (was ×0.60).
- `castTaroBeacon` keeps the old Storm Beacon (not bound to any button).

## v7.8.34 Static Charge
- Every 10 Spark hits on the same boss/mini → lightning strike for that Spark’s damage ×8 (per-boss counter, reset each run). Normal foes never reach 10, so clear speed is unchanged.
