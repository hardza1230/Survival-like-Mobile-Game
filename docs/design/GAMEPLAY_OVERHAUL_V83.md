# Gameplay overhaul v8.3 — approved prototype checkpoint
Owner approved Phase 0–1 on 2026-11-25. Base c1cd4c3feb8dda53a6725218a527f6c0cfefa056 (8.2.87). Stage 4 (zero-based index 3), opt-in only; no deployment or global migration.

## Static audit (actual game.js at base)
- beginWave calls startSurvivalWave(w,false), setupWaveObjective, waveTimedSetup and missionIntro; mission cards/banners compete with combat.
- tickStage uses objective completion or waveTimer to enter waveclear. waveclear stops spawning, waits for remaining enemies and flees normal foes after 4 seconds.
- completeWaveObjective may clear foes/enemies and settleStoryBudget; early completion shortens timer to WAVE_WRAP.
- onWaveCleared clears objectives, foes, enemies and pickups, enters breather, schedules 300+3200 ms before next wave. Final boss warning uses 300+3000 ms. These are code timings, not measured downtime.
- startSurvivalWave(w,true) already has a seamless refill path. It still creates crates and stage gimmicks; guard repeat side effects.
- setupSpawnRates resets per-wave budget via beginStoryBudget. Preserve EXP settlement exactly once, existing pickups and level-up queue; audit orb accounting across boundaries before wiring.
- storyCanSpawn/storyLiveCap/storySpawnPace already enforce cap, quota, shooter limits and refill. Reuse them rather than introduce unlimited spawning.
- spawnMiniBoss has levelup queue guard; retain it. Existing onWaveCleared mini path must be adapted without duplicate rewards or clearing ordinary foes.
- Mission deck tests confirm C1 first-play/replay distinctions; exclude replay, tutorial, recipe, rift and boss rush from prototype.

## Phase 1 foundation
scripts/gameplay-timeline-v83.cjs is a pure CommonJS reference state machine, not a browser integration. Default flag off; stageIndex 3 only. Warmup 30s, pressure 45s, mini until defeated, recovery 30s, escalation 75s, swarm 60s, boss until defeated. Total timed combat 240s plus boss fights. Durations provisional; existing GDD targets 8–10 minutes, so shorter prototype requires owner comparison. Delta overshoot is discarded at boundaries deliberately; integration should feed bounded frame deltas and never skip boss gates.
Run node tests/gameplay-timeline-v83.test.cjs. No runtime or release version changed.

## Next implementation
1. Wire a run-local opt-in flag and reset at startStage; bypass mission deal only for eligible run. Keep legacy default.
2. Integrate timeline in tickStage and boss death handlers; retain existing spawn caps, recipes, EXP/loot and boss rewards; no blanket enemy clearing between ordinary phases.
3. Replace mission HUD with phase/time; retain boss warning and level-up pause. Measure playable wall time separately from active simulation time, frame time, live foes, first level-up and transition downtime. Keep telemetry local initially.
4. Test death/revive/replay/exit, queued level-up during boss entry, slow/fast mini kills, reward idempotence, no duplicate timers, legacy modes and mobile FPS.
5. Run npm run check, build and CI; owner phone QA before enabling by default. No art/audio or economy changes.

## Status
Static audit and isolated timeline foundation only. Runtime integration, telemetry, full tests and mobile playtest pending. No claim of playable prototype or deployment.
