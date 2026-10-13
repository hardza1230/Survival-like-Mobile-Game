# Taro rework — work packages

Status: T0/T1 complete; T2 Tempest implemented and checked in v7.8.11, publication pending. See [TARO_T0_CONTRACT.md](TARO_T0_CONTRACT.md), [TARO_T1_FOUNDATION.md](TARO_T1_FOUNDATION.md) and [TARO_T2_TEMPEST.md](TARO_T2_TEMPEST.md). T3 Chain is next; Chain/Smite currently retain legacy combat.

## Goal and baseline

Make three paths change how Taro plays: Chain clears crowds, Smite focuses priority targets, Tempest earns damage through movement. Retain Taro's mobile-friendly automatic attacks and current hero identity.

Current runtime already has path IDs storm/smite/tempest, path talents and capstones, a chain-lightning Unique that restores Dash, a Dash shockwave passive, and a mob-hit Storm Charge/Judgment system. Reuse or deliberately replace these; do not stack duplicate triggers. Preserve hero unlocks, equipment, saved path/talent IDs and purchased talent ranks. Inspect relevant existing tests before adding coverage.

## Ordered work packages

| Package | Scope | Reviewable result / acceptance | Depends on |
|---|---|---|---|
| T0 — Rules and existing-system map | Trace basic attacks, Unique, Dash passive, Storm Charge, path talents, evolution and relic interactions. Specify trigger ownership, target rules, charge limits, cooldowns, damage scaling and behavior during pause/level-up/death. Decide how the existing Unique interacts with each path. | One design contract with a reuse/replace table and initial tuning values. Each damage event has one owner. Save compatibility strategy is explicit. | None |
| T1 — Shared Taro integration | Implement only helpers required by T0: target selection, per-run state, charge accounting and cleanup. Keep old behavior until each replacement path is integrated. | Existing Taro still works; new state cannot leak across runs or paths. No broad game.js refactor. | T0 |
| T2 — Tempest prototype | #9 Flash Step + #10 Static Discharge + #35 Thunder Dash Bomb. Count actual movement distance; define Dash charge contribution separately; nova at full charge; one bomb at Dash origin. Reconcile the existing shockwave rather than adding both blindly. | On phone, moving builds readable charge, Dash produces one intended effect, and standing still cannot generate movement charge. Pause, teleport/reposition and respawn do not produce false distance. | T1 |
| T3 — Chain prototype | #1 Chain Arc + #20 Superconductor + #24 Crispy Taro Shrapnel. Bounded chain targets and damage growth. Shrapnel is a terminal effect, not a new recursive chain. Reconcile basic and Unique targeting/damage rules. | Crowds show a clear chain sequence; no repeated victim within one chain; one valid kill produces one shrapnel event. Boss-only damage remains weaker than Smite's intended role. | T1; integrate after T2 |
| T4 — Smite prototype | #3 Thunder Smite + #29 Judgement Strike + #33 Lightning Rod. Automatic Boss > Elite > high-HP targeting with stable target handling; explicit repeat-strike timing. Reconcile existing Judgment/Storm Charge. | Priority target remains readable among adds; no duplicate Judgment from old and new hooks. Target death, loss of range or despawn has defined fallback behavior. | T1; integrate after T3 |
| T5 — Talents and progression | Map existing roots, branches, three exclusive capstones, mutations and evolution to each new loop. Update concise English descriptions and source information. Resolve existing purchased ranks by preserving compatible IDs or an explicit migration if unavoidable. | Talents change meaningful behavior, descriptions match runtime, and old saves retain their earned progress. No accidental cross-path benefit. | T2–T4 and phone feedback |
| T6 — Visuals, sound and mobile UX | Start prototypes with existing art/simple effects. After mechanics settle, create only missing ImageGen icons/effects with saved prompts/manifests; generate sound using the established project pipeline. Violet Taro identity; different silhouettes for chain, strike and movement nova. | Charge/target/bomb can be read on a small phone; enemy hazards remain visible. Bound simultaneous effects and asset load costs. No unnecessary extra combat button. | T5; art brief can be prepared earlier |
| T7 — Verification and release | Required npm check/build plus focused meaningful targeting, trigger, state and save checks. Menu QA on small phones. Owner conducts real combat playtests; no headless combat simulation. Fix issues, bump runtime version/changelog, publish on the authorized branch, verify Pages and live version/assets. | All three paths, old saves and hero menus pass; mobile combat feedback is recorded; deployment is verified before claiming live. | T6 |

## Phone playtest sheet

- Tempest: open area, narrow route, surrounded enemies, boss alone; compare moving versus stationary play and confirm Dash remains usable as an escape.
- Chain: sparse enemies, dense crowds, an enemy dying mid-chain, boss alone; check readability and bounded effects.
- Smite: boss with adds, several elites, selected target dying before the repeat strike; check priority and fallback.
- Shared: early/late progression, Unique plus Dash together, pause/level-up/resume, death/retry, switching paths on the next run, existing talent saves. Record actual damage/cooldown values and device observations; do not claim gameplay balance from static checks.

## Scope boundaries and checkpoints

#25 Taro Boba Capacitor is deferred optional work after the three paths are tuned. No fourth path, Toast Meter restoration, turret system or unrelated hero/UI rework in this plan.

T0, T1 and T2 implementation are complete. T3 Chain is the next executable task after T2 publication and owner review. Recommended implementation order: T0 → T1 → T2 → T3 → T4 → T5 → T6 → T7. Prototype review happens after each path, not only at the end. All packages modifying game.js integrate sequentially to avoid conflicting edits. Separate art preparation can proceed after the mechanics/art contract stabilizes; this plan does not start agents or separate chats.

After each package update SESSION_HANDOFF with completed package, changed files, real checks, unresolved decisions and exact next package. Save recoverable commits when appropriate. Do not deploy partial prototypes as a finished rework. Publish only within the owner's implementation scope.
