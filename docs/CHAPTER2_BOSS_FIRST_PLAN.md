# Chapter 2 — Boss-First Implementation Plan

> Status: approved design contract. Runtime content stays unchanged until each stage passes its QA gate.
> Target chapter: **Chapter 2 · The Ferment Garden**
> Core success metric: memorable, readable boss fights on a vertical mobile screen.

## 1. Non-negotiable design rules

1. Chapter 2 contains five stages: global stage indexes 5–9 (C2-1 through C2-5).
2. Unfinished stages must remain locked and must never be selectable.
3. Every stage introduces a distinct field rule, monster family, miniboss, boss, and visual identity.
4. Difficulty must come from readable decisions and enemy cooperation—not HP inflation alone.
5. Every lethal attack needs a clear telegraph before damage.
6. Bosses are invulnerable during phase transitions.
7. Normal difficulty at recommended Power is the balance baseline.
8. Higher difficulty and Zone Modifiers must continue to grant better rewards.
9. Art must remain readable on a phone with many enemies active.
10. Each implementation commit must leave the current released game playable.

## 2. Chapter structure

| Stage | Location | Field rule | Miniboss | Boss |
|---|---|---|---|---|
| C2-1 | The Fermented Canopy | Poison blooms expand until their source is destroyed | Sporewarden Mantis | Rootmother's Bud |
| C2-2 | Mycelium Marsh | A moving clean-air ring forces constant repositioning | Fungal Juggernaut | Mycelium Behemoth |
| C2-3 | Nectar Hive | Protect nectar flowers while flying enemies attack from lanes | Royal Stinger | Ferment Hornet Queen |
| C2-4 | Four-Season Conservatory | The field rotates through heat, frost, toxic rain, and storm | Season Keeper | Chronobloom Orchid |
| C2-5 | Root Throne | Break three ancient roots to disable parts of the final boss kit | Ancient Root Knight | The True Rootmother |

### Story correction

The current C2-1 Rootmother encounter becomes **Rootmother's Bud**, an avatar grown from the crown seed. The true Rootmother is reserved for C2-5 so the chapter has escalation and a proper climax.

## 3. Stage pacing contract

Each stage keeps five major beats but changes the player's task:

1. Teach one new enemy with low pressure.
2. Combine it with an existing role.
3. Miniboss encounter with light reinforcements.
4. Stage-specific objective under pressure.
5. Short, intense mixed wave leading into the boss.

Target duration: **7–9 minutes** per first clear.

Chapter 2 must restore objective variety. The current runtime leaves the objective bag empty for stage indexes 5 and above; the foundation work must replace that hard-coded Chapter 1 boundary with chapter-aware objective pools.

## 4. C2-2 vertical slice

C2-2 is the quality benchmark for the rest of the chapter.

### Monster family

| Role | Monster | Combat identity |
|---|---|---|
| Basic | Mycelium Drifter | Leaves a short-lived spore patch on death |
| Fast | Cap Hopper | Telegraphs a leap to the player's future position |
| Shooter | Puffcap Sniper | Fires predictive shots instead of aiming at the current position |
| Bomber | Mold Sac | Bursts into two weak sporelings |
| Tank | Mycelium Bulwark | Grants damage reduction to nearby enemies |
| Siege/Elite | Threadweaver Oracle | Connects two hazardous fungal threads across the arena |

These are new silhouettes and game assets, not recolors of Chapter 1 enemies.

### Miniboss — Fungal Juggernaut

- **Spore Charge:** 0.8 s line telegraph, charge, then a poison trail.
- **Mushroom Wall:** creates a semicircle that constrains escape routes.
- **Burst Colony:** below 50% HP, summons mushrooms; destroying them creates temporary safe ground.
- Target: a player who ignores mechanics must not be able to face-tank the fight.

### Boss — Mycelium Behemoth

- Phase 1 (100–70%): readable slam, spore fan, and root charge.
- Transition at 70%: invulnerable transformation; exposes the glowing core.
- Phase 2 (70–35%): links to three mushrooms that heal and accelerate the boss until destroyed.
- Transition at 35%: arena darkens and the root crown opens.
- Phase 3 (35–0%): shrinking safe area, attack combinations, and a clearly telegraphed ultimate.
- Target fight length on Normal at recommended Power: **75–110 seconds**.

## 5. C2-2 balance targets versus C2-1

| Target | Multiplier/change |
|---|---:|
| Regular enemy HP | ×1.35 |
| Regular enemy damage | ×1.30 |
| Movement speed | +8% |
| Live enemy pressure | +20% |
| Elite frequency | +30% |
| Miniboss HP | ×1.45 |
| Miniboss damage | ×1.35 |
| Miniboss attack cadence | 15% faster |
| Boss HP | ×1.55 |
| Boss damage | ×1.40 |
| Boss attack cadence | 12–15% faster |

Normal-difficulty guardrails:

- No single clearly avoidable hit should exceed roughly 35% of expected Max HP.
- Heavy attacks need 0.65–1.0 s telegraphs.
- A capable first-time player should finish C2-2 with roughly 35–60% total HP loss.
- First-attempt completion target at recommended Power: 60–70%.
- Standing still or trading contact damage must fail.

## 6. Art production contract

### Standard enemy art

- Transparent PNG.
- Strong role-specific silhouette at phone scale.
- Bottom-centred character with consistent ground line.
- Avoid thin details that disappear below 64 px display size.
- Unique palette per stage while preserving hostile red/purple danger cues.
- New enemy art must not rely on tinting an old Chapter 1 sprite.

### Boss pose atlas

Preferred format: **1024×512 transparent PNG**, 4 columns × 2 rows, 256×256 per frame.

Frame order:

0. Idle
1. Move/float
2. Attack wind-up
3. Attack release
4. Summon/cast
5. Phase transformation
6. Hurt/stagger
7. Defeat/collapse

The eight poses are animated with code-driven squash, recoil, movement, camera work, particles, and separate VFX. This provides a large presentation gain without loading dozens of full-resolution boss frames on mobile.

### Boss presentation layers

- Back aura / silhouette glow
- Boss sprite
- Attack-specific foreground VFX
- Ground telegraph
- Particles and debris
- Short hit-stop only on major impacts
- Controlled camera zoom for phase changes
- Unique intro, phase transition, and death sequence
- Reduced screen shake; visual clarity takes priority

## 7. Commit plan

Each commit must pass syntax/validation checks and keep unfinished content inaccessible.

1. **docs: lock Chapter 2 boss-first production contract**
   - Add this plan, asset specifications, balance targets, QA gates, and commit boundaries.
   - No runtime change.

2. **refactor: make stage/chapter scaling support C2-1 through C2-5**
   - Remove hard-coded maximum stage index 5 where inappropriate.
   - Add safe stage metadata for indexes 6–9, initially locked.
   - Make Zone Level, scaling curves, chapter ranges, rewards, backgrounds, and selectors data-driven.
   - Restore chapter-aware objective pools.
   - Do not expose unfinished stages.

3. **feat: build C2-2 Mycelium Marsh and monster family**
   - New stage rule and objective flow.
   - Six new enemy roles and placeholder/final art integration.
   - Balance against C2-1 targets.

4. **feat: add Fungal Juggernaut miniboss encounter**
   - Three bespoke attacks, telegraphs, phase behavior, art, and VFX.

5. **feat: add Mycelium Behemoth boss fight**
   - Three phases, two invulnerable transitions, pose atlas, VFX, intro, and death sequence.
   - Unlock C2-2 only after the complete fight passes QA.

6. **balance: pass C2-2 full-run/mobile QA and unlock**
   - Lock explicit C2-2 versus C2-1 HP, damage, speed, and live-enemy budgets.
   - Validate save-safe unlock flow, boss phase gates, telegraphs, and mobile limits.
   - Unlock Mycelium Marsh while keeping C2-3 through C2-5 inaccessible.

7. **feat: add C2-3 Nectar Hive**
   - New monsters, defend objective, Royal Stinger, and Ferment Hornet Queen.

8. **feat: add C2-4 Four-Season Conservatory**
   - Seasonal arena system, new monsters, Season Keeper, and Chronobloom Orchid.

9. **feat: add C2-5 Root Throne finale**
   - Root-disabling objective, final monster family, Ancient Root Knight, and True Rootmother.
   - Chapter epilogue and completion rewards.

10. **balance: complete Chapter 2 progression and mobile QA**
   - Full Normal/Hard/Hell tuning.
   - Reward and gear progression.
   - Performance, save migration, unlock flow, and regression tests.

11. **art: final Chapter 2 polish pass**
    - Replace remaining placeholders.
    - Standardize scale, ground line, hit flashes, shadows, VFX visibility, and asset compression.

## 8. QA gate for every playable-stage commit

A stage is not unlocked until all checks pass:

- Game boots with zero page errors.
- Existing Chapter 1 stages remain selectable and completable.
- Old saves load without migration loss.
- New stage locks/unlocks at the intended progression point.
- Five wave beats and boss completion can run end-to-end.
- Miniboss and boss cannot disappear when the enemy pool is full.
- Phase transitions cannot be skipped by burst damage.
- Telegraph timing matches actual damage timing.
- No required objective can spawn inside solid scenery.
- Touch controls and HUD remain usable on a vertical phone viewport.
- Enemy count and VFX stay within the mobile performance budget.
- Version and changelog are updated only when runtime content changes.

## 9. Stage 1 difficulty follow-up

The current opening-stage easing can stack to approximately 40.8% enemy HP early in a new save (0.60 × 0.85 × 0.80), before additional Power Guide assistance. This explains why Stage 1 can be cleared without meaningful HP loss.

Adjust this only in a dedicated balance commit after telemetry/playtesting:

- Raise the Stage 1 HP easing factor from 0.60 toward 0.78.
- Keep the first 25-kill easing as onboarding protection.
- Remove tutorial easing after the Training Ground has been completed.
- Verify that Stage 1 teaches movement without becoming a damage sponge.
