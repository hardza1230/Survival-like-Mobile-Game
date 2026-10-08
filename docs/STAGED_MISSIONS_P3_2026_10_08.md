# P3 — Staged Story missions (v6.55.89)

Story Hunt missions in all 15 stages now alternate two steps per marked target: defeat ordinary foes to reveal the Elite, then find and defeat that Elite. Each round requires 6 kills in Chapter 1, 8 in Chapter 2, or 10 in Chapter 3. Existing marked-target counts remain unchanged. Killing other foes while the Elite is revealed does not prepay the next round. Minibosses, bosses and marked targets do not count toward the clear step.

The opening fill mission keeps its existing kill goal, then transitions to one marked Elite showdown. HUD shows Step 1/2 then Step 2/2. It does not clear enemies, collect EXP, resolve a bonus, reset pickups or pay mission rewards at the intermediate transition.

HUD displays the current step and its kill count or Elite instruction; the progress bar includes progress within the current clear step. Existing Capture, Escort/purification, survival and stage-specific objectives keep their authored rules. This phase introduces staged combat in Hunt/fill, rather than changing every mission into the same sequence. Replay's dedicated kill meter and midpoint miniboss remain unchanged.

Elite spawning uses the existing objective-owned retry deadline. Clear steps suppress Elite spawning and Hunter’s Curse. Elite steps retain target recovery, arena bounds, full-pool retries, hard live caps, and upgrade-pause handling. Between rounds kill progress resets. If reserves are exhausted in a clear step, reinforcements can replace only the shortfall between remaining required kills and live enemies, still subject to live/shooter caps. This prevents lost or despawned foes from permanently blocking the mission; Elite steps have no extra ordinary quota exemption.

Final completion alone resolves bonuses, grants Sugar and settles P1 earned EXP plus the existing fixed objective reward. No minimum-level compensation or intermediate reward is introduced. P2 pickup state and limits persist. Recipe/Rift/Boss Rush/Endless/Tutorial do not use the new clear-to-Elite gates.

Validation: actual-method tests cover all 15 stages, exact kill gates, sequential rounds, HUD, full-pool/pause/missing-target retries, exhausted reserves and hard caps, single final settlement, opening fill transition and special-mode isolation. Added to npm run check. Existing P1/P2/Hunt regressions are retained. Real-phone flow, readability, difficulty and pacing still require owner playtesting; these kill goals are initial tuning values. P4 and P5 remain pending.

Final verification: npm run check and npm run build:www both passed with the repository runtime assets and source-sheet test fixtures present.
