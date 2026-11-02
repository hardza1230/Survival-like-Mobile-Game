# Sesame — Rune Invoker

Status: core concept approved by the owner, 2 November 2026. Four-spell runtime prototype prepared for v8.0.98; release verification is recorded in SESSION_HANDOFF.md. Full hero is not complete.

This replaces the planned Mirror Network paths/Glass World direction in [the previous design](../SESAME_MIRROR_NETWORK.md). Keep the previous document as implementation history. Do not continue those three paths by default.

## Approved gameplay contract

- Sesame has no three-way Build selection. Rune recipes and upgrade choices define the build.
- Three rune buttons summon three distinct rune types. Working English names: Power, Motion, Binding; final names/art remain open.
- Up to three small orbs orbit Sesame. Pressing a fourth rune replaces the oldest orb (FIFO).
- Recipe identity depends on counts, not order: Power/Power/Binding and Binding/Power/Power produce the same spell.
- Three rune types, exactly three orbs, produce ten possible recipes.
- The existing Unique button shows the current spell icon and short name before casting. The preview changes immediately when the recipe changes.
- Unique casts the current recipe. Orbs remain after casting; no mandatory three-button re-entry for the same spell.
- Normal attacks continue automatically while moving, choosing runes and casting. Dash remains a separate control.
- Use three small rune buttons above the larger Unique control, with Dash below. Preserve playfield visibility and existing movement controls.

This is direct rune composition during combat. It replaces the earlier suggestion of choosing three prepared recipe slots; do not add both interfaces.

## A normal combat loop

1. Move/dodge while automatic attacks provide a dependable baseline.
2. Tap runes to compose a spell for the situation.
3. Read the spell preview on Unique, then tap Unique when ready.
4. Keep the recipe for repeated use, or replace orbs to switch spells.

Prototype starts with three Power orbs so the first cast is immediately understandable. Before three orbs exist during initialization, no incomplete recipe can cast or consume cooldown.

## Ten recipe identities — proposed spell set

Only the three-rune/count-based interaction above is approved. Spell names, exact effects, numbers, unlock rules and balance below are working proposals, not additional owner decisions.

| Key | Power | Motion | Binding | Working spell | Distinct purpose |
|---|---:|---:|---:|---|---|
| ppp | 3 | 0 | 0 | Core Collapse | Delayed heavy impact against priority enemies |
| mmm | 0 | 3 | 0 | Returning Chakram | Outgoing/returning weapon; movement changes its return line |
| bbb | 0 | 0 | 3 | Pursuing Brand | Persistent attached caster; detaches and retargets after defeat |
| ppm | 2 | 1 | 0 | Driving Lance | Moving piercing strike with a strong terminal impact |
| ppb | 2 | 0 | 1 | Rupture Brand | Attached charge with a visible, bounded automatic detonation |
| mmp | 1 | 2 | 0 | Orbit Release | Brief orbiting weapons, then an outward release |
| mmb | 0 | 2 | 1 | Gathering Ring | Travelling ring that settles and gathers ordinary enemies |
| bbp | 1 | 0 | 2 | Linked Verdict | A small set of marked targets share a bounded damage event |
| bbm | 0 | 1 | 2 | Warding Passage | Brief corridor that separates pursuers and opens an escape route |
| pmb | 1 | 1 | 1 | Threefold Rite | Short gather → sweep → impact sequence |

Do not add a second press-to-detonate mode to the first prototype: Unique must consistently mean cast the displayed recipe. Establish the basic control loop before optional advanced recast mechanics.

## Prototype first

Build the real production input/state layer plus four recipes first: ppp (single target), mmm (movement/clear), bbb (persistent Brand), mmb (space control). Clearly label unavailable recipes in a development-only prototype; never show a misleading spell preview or silently cast a different recipe. Finish all ten before claiming the full hero is complete.

The prototype should answer whether changing a recipe while moving is comfortable. Test two layouts on the owner's phone if the three buttons conflict with thumb reach; no additional permanent panel over the combat area.

## Control and presentation requirements

- Use count-based recipe lookup independent of FIFO display order. FIFO determines replacement only.
- Give each rune a distinct shape/symbol as well as color. The oldest orb must be identifiable before a replacement.
- Spell preview is derived from current orbs, not a separately selected spell slot.
- A rune tap must not also trigger Unique, Dash, movement or a world interaction. Track pointer ownership and handle pointer cancel/release outside the button.
- Rune changes do not cast, spend resources or reset cooldown.
- Use one shared Unique cooldown initially; switching a recipe never bypasses it. The HUD reflects the same authoritative cooldown.
- A running spell captures its recipe when cast. Replacing orbs afterward does not mutate an existing Brand, projectile or delayed impact.
- Pause, level-up, story/tutorial overlays and run end block rune/cast input consistently with existing battle controls.
- Orbs and UI belong to the current run/player; destroy them and clear queued callbacks when leaving combat. Reduced motion uses stable, readable orb positions.
- English player-facing names/copy. Reuse existing theme; no unrelated menu redesign.

## Progression without paths

- No Sesame Build draft and no path-specific card dependencies in the new mode.
- Cards can strengthen an owned spell, modify a rune family, or reward switching/repeating recipes. Final pool and unlock cadence must be designed before release.
- Avoid granting all spells equal maximum strength simultaneously; specialization should come from limited upgrade picks.
- Automatic attack, Rune spell damage and Unique upgrades need explicit ownership so shared mods do not double-apply.
- Preserve normal/special/tutorial draft precedence and shared mutation/evolution screens for other heroes.

## Existing saves and integration audit

Do not delete or reinterpret old Sesame investments silently. Inventory character talents, pt_prism/pt_lens/pt_sentinel node IDs, loadout fields and old path/card/mod/fusion assumptions. Define and test a migration/refund policy before enabling the replacement on existing saves; the final policy is not yet selected.

Current code integration points to inspect:

- CHARACTERS.sesame, BASIC_ATTACKS.sesame, BASIC_PATHS.sesame and HEROES_WIP.
- oathMirror Unique definition/dispatch, cooldown UI and Dash passive hooks.
- Build draft, card filters, mutation/evolution and path talent menus.
- castMirrorBeam, sesPlaceMirror/tickSesMirrors/clearSesMirrors and old Mirror Mark hooks.
- Character switching, run initialization/cleanup, save compatibility, tutorial locks and objective/boss targeting.

Keep current live behavior until the new mode's contract and migration are tested. Remove Sesame from HEROES_WIP only when the complete replacement is playable and its cards/talents/UI agree.

## Delivery order and acceptance

1. Rune state/recipe lookup, FIFO replacement, controls and live Unique preview; no cooldown bypass or pointer bleed.
2. Four contrasting prototype spells with target/actor lifetime limits, pooled-enemy identity checks, bounded retargeting and cleanup.
3. Owner phone check: compose while moving, identify oldest orb, understand current spell, fight both crowds and a lone boss.
4. Refine the remaining six recipes, progression, save migration and all pathless menu/draft integration.
5. Produce the missing original art/audio, integrate lazily and run required release checks.

Use isolated production-method/state tests and real static UI checks as appropriate. Do not use headless combat to judge balance or screenshots to approve visuals; the owner reviews phone gameplay/readability/FPS. This design commit does not bump the game version, deploy gameplay or claim implementation.

## Prototype98 implementation checkpoint

- Normal Story runs with Sesame after tutorial completion use Rune Invoker automatically. Explicit tutorial and endgame preparation/runs retain the old Mirror kit for this prototype.
- Production state/input/HUD, three persistent FIFO orbs and ten count-based recipe identities are implemented; PPP, MMM, BBB and MMB cast, the other six display NOT READY and cannot spend cooldown. All four share base8s cooldown with existing Unique cooldown modifiers. Rune changes never reset it.
- Auto attack is a simple Rune Needle, with four basic card families (needle damage/rate, shared reach, spell power). No Build choice, old mutation or old Evolution in prototype drafts. Shared Infusion/Unique/stat/recovery cards retain normal precedence.
- No old save fields/points are deleted, refunded or remapped. Path talent effects are not selected in the pathless Story prototype; the old kit still uses those investments in endgame. A permanent migration and replacement talent interface remain future work.
- Actor lifetime/cap, cast power/recipe snapshot, generation-safe Brand retargeting, chakram outbound/return hit ownership, boss/runner/Wisp pull exclusions, shared source restoration and run/menu/death/shutdown cleanup are bounded. Orbs use stable positions under reduced motion; gameplay telegraphs stay readable with VFX off.
- Art is temporary code-drawn telegraphs/runes plus existing beam/audio cues; no final ImageGen art or new audio was produced. Phone readability/thumb reach, fun, damage balance and FPS need the owner playtest. No headless balance simulation or screenshots were used for visual approval.
- Tests: tests/sesame-runes.test.cjs; static production Canvas review scripts/build-sesame-rune-review.mjs and scripts/check-sesame-rune-ui.cjs. Retained Taro legacy hash adapter strips only the new Sesame guard when comparing pre-existing bodies.
