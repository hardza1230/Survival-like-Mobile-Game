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
