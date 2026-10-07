# Mint Build Path Rework — 7 Oct 2026

Status: APPROVED — M1 v6.55.79 and M2 v6.55.80 implemented; M3–M4 remain planned.

Runtime audit: actual current IDs are `glacier / barrage / pierce`. Keep these IDs unchanged; the earlier `freeze / piercer` references described display labels, not runtime IDs.
Branch target: `claude/vampire-survival-mobile-game-yo9e8w`

## Goal
Mint should feel like three different characters after choosing a Build Path, while keeping Frost Lance as the shared basic attack.

Current problem from playtest:
- Barrage already has the clearest identity and was previously too strong/too expensive for mobile performance.
- Freeze/Glacier and Piercer do not change moment-to-moment play enough.
- Generic stat cards can blur the paths back together.
- Some card interactions become inert when projectile caps or Evolution overrides them.
- Freeze talents overlap with Mint's old Diamond Sovereign Ascendancy concept.

## Core rule
Each path must own a different combat question:

| Runtime ID | Display name | Player question | Primary strength | Primary weakness |
| --- | --- | --- | --- | --- |
| `barrage` | **Barrage** | How many attacks can I maintain? | sustained DPS + crowd clear | weak hit value, projectile/performance cap |
| `glacier` | **Glacier Bloom** | How many enemies can I freeze and shatter together? | control + chain AoE | needs setup, weaker raw single-hit damage |
| `pierce` | **Crystal Impaler** | Can I line up one devastating lance? | elite/boss burst + penetration | slow cadence, overkill vs trash |

Internal IDs should stay unchanged initially to avoid save migration; change only player-facing names when implemented.

---

# 1. Barrage

## Fantasy
Mint becomes a mobile frost artillery platform. Many smaller lances, relentless rhythm, visible projectile pressure.

## Mechanical identity
- Fast cadence.
- Maximum normal volley remains performance-safe.
- Damage is won by maintaining fire, not one large hit.
- Extra-projectile rewards past the cap must convert into another useful stat instead of becoming dead cards.

## Keep / change current talents

| Current | Decision | Rework direction |
| --- | --- | --- |
| Volley | KEEP | cadence identity |
| Crystal Payload | KEEP | shard payoff belongs here |
| Focus Fire | KEEP+BUFF READABILITY | repeated hits on same target build a visible Focus stack |
| Wide Volley | CHANGE | avoid a pure spread stat; make outer lances seek nearby enemies slightly |
| Extra Lance | CHANGE | never silently exceed mobile budget; at cap convert to shard/focus bonus |
| Mint Breeze | REPLACE | generic healing does not sell Barrage fantasy |
| Lance Guard | KEEP | defensive identity through projectile density is distinctive |
| Hailstorm | KEEP | strong visual capstone |
| Splitting Ice | KEEP | shard-specialist capstone |
| Blizzard Cloak | CHANGE | avoid excessive projectile spam during Gale; use orbiting/queued lances instead |

## Proposed path cards

### Core upgrades
1. **Rapid Volley** — attack interval -10% per rank, diminishing near path cap.
2. **Crystal Payload** — shard damage +15%; shards gain slightly wider acquire radius.
3. **Focus Fire** — successive lances hitting the same elite/boss add Focus; each stack +6% Barrage damage, max 5, expires after target switch/short delay.
4. **Seeking Flanks** — side lances bend toward nearby secondary targets instead of merely increasing spread.
5. **Packed Quiver** — +1 lance until the safe volley cap; if already capped, converts to +18% shard damage and +8% Focus gain.
6. **Lance Guard** — a lance that collides with an enemy projectile destroys it; internal cooldown prevents a permanent shield.

### Evolution options
- **Hailstorm Arsenal** — every few seconds a compact six-lance rain attacks around Mint without increasing her normal volley count.
- **Splitting Ice** — shards split one extra time with reduced child damage.
- **Frozen Arsenal** — three spectral lances orbit Mint and fire sequentially when the normal attack fires. Visual count is high but active projectile budget remains bounded.

## Balance target
Barrage should win long sustained fights only if Mint can keep attacking. It must not have the best single-hit boss burst.

---

# 2. Glacier Bloom

## Fantasy
Mint freezes the battlefield, builds brittle frost inside enemies, then detonates groups in chain shatters.

## Mechanical loop
`Frost Lance hit -> Chill -> Freeze/Brittle -> Frost stacks -> Shatter -> chain reaction`

Bosses and freeze-immune targets must still participate through **Brittle** so the path never becomes dead in boss fights.

## New status model
### Chill
Normal slow/control buildup.

### Brittle
Applied to targets that cannot be fully Frozen, especially bosses/minibosses.
- Does not stop movement/action.
- Stores Glacier stacks.
- At threshold, triggers Crystal Rupture damage instead of hard freeze.

This means the same path works on trash and bosses without pretending bosses can be permanently frozen.

## Keep / change current talents

| Current | Decision | Rework direction |
| --- | --- | --- |
| Frostbite | KEEP | faster freeze/brittle setup |
| Deep Chill | CHANGE | reward stacks/shatter rather than generic frozen multiplier |
| Shatter | CORE | becomes the central mechanic, not just kill explosion |
| Long Winter | KEEP | utility branch |
| Icebound Echo+ | KEEP | supports group setup |
| Frost Armor | KEEP BUT LOWER IMPORTANCE | survival branch only |
| Cold Blood | CHANGE | retaliation Chill/Brittle pulse, not free hard-freeze |
| Absolute Zero | KEEP NAME | major chain-shatter evolution |
| Permafrost Field | KEEP | zone/control evolution |
| Glacial Heart | CHANGE | current low-HP emergency freeze is too disconnected from path offense |

## Proposed path cards
1. **Frostbite** — Chill/Brittle threshold reduced; bosses gain Brittle faster.
2. **Deep Freeze** — hitting a Frozen/Brittle target adds one Frost stack; max 3.
3. **Glacier Bloom** — at max Frost stacks, next lance triggers a radial Shatter.
4. **Chain Shatter** — Shatter applies Chill and one Frost stack to nearby enemies; chain depth capped.
5. **Icebound Echo** — Frost Lance impact releases a small Chill wave; larger against already chilled targets.
6. **Permafrost** — Shatter leaves a short frost field that slows and periodically applies Chill.

### Boss conversion
- Freeze immune: Chill threshold becomes Brittle.
- 3 Frost stacks -> **Crystal Rupture**.
- Crystal Rupture receives an elite/boss bonus but is capped, avoiding %HP abuse.

### Evolution options
- **Absolute Zero** — first Shatter in a chain has greatly increased radius; chain can propagate one additional step.
- **Permafrost Field** — Shatter zones persist and overlap, but overlapping damage is capped.
- **Frozen Heart** — every N successful Shatters grants a brief Frost Guard and instantly primes nearby enemies with Chill. This replaces the disconnected low-HP panic button.

## Balance target
Best crowd control and safest high-density clear. Boss DPS should become respectable through Brittle/Rupture, but stay below Crystal Impaler's perfect single-target burst.

---

# 3. Crystal Impaler

## Fantasy
Mint stops spraying spears and becomes a precision javelin hunter. Every throw should feel heavy, deliberate and dangerous.

## Mechanical loop
`Acquire priority target -> brief charge -> heavy lance -> Impale stack -> Crystal Rupture`

## Key mechanic: Impale
Elite/boss hits apply **Impale**.
- Max 3 stacks.
- At 3 stacks, the next heavy lance consumes all stacks for **Crystal Rupture**.
- Normal enemies can be impaled but usually die before the full loop.
- Rupture is flat/scaled attack damage with a boss multiplier, not uncapped % max HP.

## Keep / change current talents

| Current | Decision | Rework direction |
| --- | --- | --- |
| Heavy Lance | KEEP | base identity |
| Shatterpoint | CHANGE | becomes Impale generation/boss payoff |
| Executioner | KEEP | natural finisher branch |
| Fracture Line | CHANGE | raw +pierce is too generic; reward penetration |
| Long Reach | KEEP | useful positioning tool |
| Steady Stance | CHANGE | charging grants stability/DR briefly |
| Recoil Step | CHANGE | successful heavy hit can refund dash instead of every shot |
| Skewer | KEEP CONCEPT | reward late penetrations |
| Javelin Rain | REPLACE | rain belongs too close to Barrage |
| Spear Wall | REPLACE | defensive wall conflicts with heavy hunter fantasy |

## Proposed path cards
1. **Heavy Draw** — adds a short charge; fully charged lance gains large damage and size. Partial charge still fires at reduced power.
2. **Impaler** — elite/boss hit adds Impale. Normal enemies struck by a fully charged lance gain a temporary armor-break style mark.
3. **Shatterpoint** — hitting an Impaled target increases lance damage and accelerates the final Rupture.
4. **Overpenetration** — after penetrating an enemy, lance damage does not decay; later hits gain a small bonus up to a cap.
5. **Executioner** — bonus damage to low-HP targets; Crystal Rupture gets extra execute value without instant-killing bosses.
6. **Long Reach** — range and projectile speed increase; at max rank the lance becomes visually larger only while fully charged.

### Evolution options
- **Heaven Piercer** — every third fully charged attack becomes a giant crystal lance with very high penetration and Rupture bonus.
- **Perfect Skewer** — every target pierced before the priority target increases impact damage, capped to prevent pack-stacking abuse.
- **Frost Rail** — full-charge lance leaves a delayed fracture line that erupts once. One heavy follow-up, not projectile rain.

## Balance target
Highest elite/boss burst when the player lands full charges and maintains Impale. Lowest trash-clearing comfort of the three paths unless enemies line up well.

---

# 4. Card pool rules after choosing a path

Choosing a path must visibly change future level-up choices.

Recommended distribution after path lock:
- 65% path-specific Mint cards
- 20% shared Mint utility cards
- 15% universal survivability/stat cards

Do not offer another path's signature mechanic after lock.
Examples:
- Barrage cannot roll Heavy Draw/Impaler.
- Glacier Bloom cannot roll Extra Lance as a projectile-count card.
- Crystal Impaler cannot roll rapid-fire-only Barrage cards.

Shared Mint cards may include movement, dash, generic frost utility and defensive options, but they should not outperform signature cards at defining the run.

---

# 5. Anti-dead-card rules

1. Every projectile-count bonus has an explicit conversion at cap.
2. Bosses receive Brittle instead of being immune to the entire Glacier loop.
3. Evolution upgrades must preserve earlier card investment rather than overwrite it.
4. If a mutation replaces an attack behavior, all earlier relevant modifiers must be mapped deliberately.
5. Card description must say when conversion occurs, e.g. `At max lances: +18% shard damage instead.`

---

# 6. Visual language

The player should recognize the chosen Mint path without reading the UI.

- **Barrage:** many thin lances, fast cadence, small crisp impacts, orbit/arsenal motifs.
- **Glacier Bloom:** expanding cracks, circular frost blooms, frozen silhouettes, chain-shatter pulses.
- **Crystal Impaler:** wind-up pose, larger lance, narrow bright trail, heavy hit-stop, spear-point rupture.

Avoid solving identity only with larger damage numbers.

---

# 7. Relationship to Mint Ascendancy

The current old Ascendancy draft overlaps too much with the new runtime paths, especially Diamond Sovereign vs Glacier Bloom.

Recommended future direction:
- Build Path = attack transformation chosen during/for the run.
- Ascendancy = character-wide playstyle modifier that can support any Mint Build Path.

Candidate Mint Ascendancies to revisit later:
1. **Blizzard Rush** — movement/dash/frost trail. Works with all three paths.
2. **Frost Sentinel** — positioning/guard/precision mechanic rather than another Freeze/Shatter package.

Do not implement this Ascendancy cleanup in the first Mint Build Path code commit.

---

# 8. Implementation order (later, after design approval)

Commit M1 — data/text/card-pool split only
- keep runtime IDs glacier/barrage/pierce
- rename display Freeze -> Glacier Bloom, Piercer -> Crystal Impaler
- make post-choice card weighting/path exclusions explicit
- implement dead-card conversion at Barrage projectile cap

Commit M2 — Glacier mechanics
- Frost stack + Shatter
- Brittle boss conversion
- chain cap and tests

Commit M3 — Crystal Impaler mechanics
- charge attack
- Impale stacks + Crystal Rupture
- priority target/boss interaction

Commit M4 — Evolutions + polish
- bounded VFX/projectile budget
- hit-stop/readability
- mobile FPS tests
- card description cleanup

## Acceptance criteria
- Three Mint runs with equal upgrade count feel mechanically different within 60 seconds of path selection.
- No path card is inert because of caps/evolution replacement.
- Glacier still functions against bosses.
- Crystal Impaler has the best correct-play single-target burst, but not the best general wave clear.
- Barrage remains performance-safe on mobile and does not regain unlimited projectile scaling.
- Path choice visibly changes subsequent level-up offerings.

## M1 delivery — v6.55.79

- ✅ Rename player-facing paths to Glacier Bloom / Barrage / Crystal Impaler; existing IDs and Talent keys retained.
- ✅ Ordinary post-choice Mint rolls use category weights 65 path / 20 shared / 15 universal. These are per-draw weights, not a fixed ratio in each three-card screen; empty groups are renormalized. Critical HP still guarantees Recovery. Path choice, Infusion, Mutation, Evolution and Fusion screens keep their existing progression. Recipe runs with a prebuilt loadout continue to use stat cards.
- ✅ Shared weapon cards: Frost Lance Edge, Rime Mark, Frost Reach, Deep Flavor. Swift Ice Draw belongs to Barrage after lock; Shard Bloom belongs to Barrage/Glacier after lock. Prior investments keep their effects. Only the chosen path’s upgrade list is offered. Existing modifier/trade cards enter the shared group instead of replacing a drawn path card; their mechanics are unchanged.
- ✅ Packed Quiver adds one lance with an explicit cap conversion. Barrage raw lance count includes base volley, path, card, Talent and gear bonuses. Each lance above the three-lance cap grants +18% shard damage, recalculated on every cast, including after Evolution. Direct lance damage and active projectile cap are unchanged. Non-Barrage cap behavior is unchanged. Focus mechanics are not introduced in M1.
- ✅ Endgame editor uses the same upgrade exclusions for new investment, but keeps already invested off-path ranks visible, costed and applied so existing builds do not silently lose points/effects.
- ✅ Regression coverage exercises actual card-roll and cast methods, exclusions, statistical weights, exhausted pools, critical HP, special progression, preserved old ranks and capped volley damage. Full checks and web build pass.
- Browser smoke test could not run: Chromium is not installed and its download returned an invalid/truncated ZIP. Phone visual and balance review remains pending.

Next: M2 Glacier Frost stacks / boss Brittle / bounded chain Shatter. M3 charge and Impale, and M4 Evolutions/VFX, are not implemented by this delivery. Existing Glacier Bloom and Frost Lance Charge Unique skills are retained.

## M2 delivery — v6.55.80

- ✅ Glacier-only loop: Chill reaches existing freeze threshold → ordinary enemy freezes; boss/miniboss or `freezeImmune` enemy gains Brittle for 3s. Existing `azero`/Permafrost setup thresholds remain supported. The setup hit does not count as a Frost hit.
- ✅ Later frost hits on Frozen/Brittle targets add Frost, max 3; next hit consumes the stacks for Shatter/Rupture. Frost expires after 3s without refresh. Deep Freeze (`p_froststack`, max 2) adds +1 stack per hit/rank.
- ✅ Deep Chill (`p_deepchill`), path/Talent Frozen multipliers and the Shatter modifier work on Brittle too. Bosses remain mobile and their phase gate/invulnerability rejects damage and Frost buildup. Icebound Echo also triggers on fresh Brittle; echoes cannot generate recursive echoes or Frost-hit detonations.
- ✅ Shatter scales from current unmodified Frost Lance hit power: root ×1.4, boss/immune root ×1.8, nearby splash ×0.55 within 110px. Normal damage calculation then applies gear ATK, crit and target modifiers once. No %max-HP damage.
- ✅ Chain Shatter (`p_chainshatter`, max 2) adds one Chill and one Frost to surviving nearby targets; a fully primed Frozen/Brittle target may chain. Two depth steps max; six bursts per reaction and per 200ms scene window; 24 nearby targets per burst; three painted shatter effects per window; 450ms per-target burst cooldown. No extra shard projectiles or recursive delayed chain timers.
- ✅ Pool/spawn resets clear Chill, Frost, Brittle, burst cooldown and advance a dedicated lifetime token. Unique’s existing freeze/delayed explosion remains, but the timer now uses the run-scoped art lifecycle and checks lifetime tokens. It primes normal Frost and applies boss Brittle immediately; a phase-immune target cannot be newly primed.
- ✅ Actual-method regression tests cover normal/elite freeze, boss/miniboss/immune Brittle, expiry, Deep Freeze, echo non-recursion, chain depth and crowd budgets, non-Glacier preservation, damage bonus/phase gates, pool resets and delayed Unique cancellation/reuse. Full `npm run check` and `npm run build:www` pass.

In-game/mobile testing and balance feedback belong to the user, as explicitly requested on 7 Oct. Automated checks do not certify combat feel or phone performance. New cards reuse existing painted icons/VFX; dedicated visual polish and path Evolutions remain M4. Next implementation: M3 Crystal Impaler charge/Impale/Rupture.
