# Taro T2 — Tempest prototype, v7.8.11

T0 contract: [TARO_T0_CONTRACT.md](TARO_T0_CONTRACT.md). Foundation: [TARO_T1_FOUNDATION.md](TARO_T1_FOUNDATION.md). This package implements Tempest only; pre-path, Chain and Smite keep their audited legacy resolvers until T3/T4. No saved ID, rank, unlock, cost, economy or new combat control changes.

## Implemented loop

- One nearest damageable weak basic bolt: 0.65D every 0.85C, final cadence floor 0.35s. D/C come from the pure profile, including purchased scalar talents, signature weapon, infusion, mutations/evolution and Forge cadence exactly once. Return the interval divided by player cooldown to the existing scheduler, which applies that factor once. Range investments affect basic targeting; count investments convert to bounded nova/bomb damage.
- Intentional walking earns 100 charge per 720 world pixels. Scene POST_UPDATE is registered after Arcade World.postUpdate, which copies collision-resolved positions (verified in vendored Phaser 3.80.1). The previous movement command owns that displacement. Dash/coasting/forced velocity/discontinuous teleport/paused or long-gap samples earn nothing; charge clamps to 100 without banking overflow. Resume rebases. The indicator above Taro shows STATIC charge or STATIC READY.
- Each accepted Dash adds 15 once. Capture its event before generic Dash procs can open level-up, so the queued bomb is preserved and suspended correctly. Failed Dash and restoring readiness do nothing. Existing speed 560, duration 0.2s and invulnerability remain. The Tempest innate origin shockwave is replaced by an actual segment sweep of half-width 32: 0.35D × character passive scale per distinct spawn ID, with 0.35s stun only on normal enemies. Earned m_step/gear/relic Dash effects remain separate.
- Each accepted Dash leaves one bomb at its original point: 0.45 active seconds, radius 120, 0.65D × bounded extra-strike bonus. Offense is snapshotted at creation; current conditional target defenses resolve centrally at impact. At most three pending bombs; overflow discards only that bomb, never denies Dash or explodes early.
- Full charge emits one 1.40D nova when a damageable enemy is within its current radius. Radius starts at 180, arc/mutation/evolution conversion caps at 280; count damage bonus caps at 1.40. Minimum gap 1.5 active seconds. No enemy or cooldown active means full charge holds. Nova/bomb are terminal sources, retaining rewards/recovery while suppressing combat recursion.
- Gale retains ID/rank limit and now applies 0.94^rank to Dash recharge; its generic FX is empty because the Dash adapter owns that effect. It no longer speeds basic cadence. Far Strike and existing capstones/scalar progression remain effective. Echo Map wording now describes the actual shared chain/range/haste bonus.

## Unique and lifecycle

Tempest uses the same Chain Bolt damage, jumps, forks, 760 root range and escape rewards. Its forks use active-play jobs, frozen candidate spawn identities and one shared victim set (max 18, jump range max 400, nonnegative damage coefficient). No-target casts show a harmless ring and keep escape rewards. Unique neither adds charge nor creates a bomb; an already active Dash cannot be restarted even if readiness is refunded. Legacy paths retain their original Unique code until their own integration.

Opt-in is attached to every new Tempest run/path/player state, including revival/retry. It clears legacy Storm Charge at initialization; repeated upgrade sync preserves new charge. Pause/levelup suspend distance and queue execution. Death clears before revival, and exit/reset/shutdown/path/player changes invalidate jobs and remove all tracked geometry/indicator. The independent postupdate hook is removed on shutdown. Geometry uses the current simple prototype effects; ImageGen polish stays in T6.

## Verification and limits

Required npm check and build:www passed; 1306 assets built. Isolated pure helper/resolver adapters cover geometry, actual directional distance, wall/forced/gap rejection, sweep dedup/stun, bomb origin/offensive snapshot/cap/fuse, nova hold/cooldown, pause/revival, source provenance and Unique escape semantics. All original attack-method hashes still match after undoing only explicit Tempest dispatch additions. Original talent compatibility hash normalizes only the corrected Echo Map wording; Cocoa isolation still checks every other unchanged hero plus Taro Chain/Smite definitions.

Real Canvas Heroes/Stats passed seven viewports and all six previews; Hub passed seven sizes with normal/reduced motion. No headless combat simulation was performed. Automated checks do not establish balance, gameplay feel or device FPS; the owner tests real combat.

## Phone playtest

1. Select Taro → Tempest. Walking raises STATIC; standing/coasting or pushing against a wall does not. With no nearby enemies, STATIC READY holds.
2. Dash through a pack: one sweep hit per crossed enemy; normal enemies briefly stop, bosses/elites do not. One bomb remains at the start and detonates after the fuse. Dash adds 15, and travel earns no extra walking charge.
3. Reach full charge near enemies: one nova consumes the meter. Check open arena, narrow route, surrounded case and boss alone; compare moving against stationary play.
4. Pause/level-up during a fuse, then resume. Effects freeze and continue without a catch-up burst. Die/revive or restart: old bombs and charge disappear.
5. Unique restores Dash/haste without creating a bomb or charge. Pressing Dash during an already active refunded Dash does not restart it. Gale improves recharge while rate/capA remain basic cadence upgrades.

Next: T3 Chain (#1/#20/#24), then T4 Smite. Preserve this scoped opt-in and the T0 proc/save contract.

Published runtime 0fdd5003c4f7dd2e880799d9cf269fd79c4fc953, tree 1d4fa011d4b78ed8a4a80aabc7fe90f2512c91fa. Pages run 38402307395 succeeded; live v7.8.11 and final admission ordering verified.
