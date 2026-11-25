# Stage 4 Continuous Combat experiment

Open the web build with `?combat83=1` and play C1-4 (Frozen Pantry) before its first clear. The flag defaults to off. Replay, tutorial, recipe, rift and boss rush keep their existing paths.

The HUD shows Warm-up (30s), Pressure (45s), Miniboss, Recovery (30s), Escalation (75s), Swarm (60s), and the existing final-boss sequence. Recovery and Escalation share one spawn budget. Ordinary transitions preserve enemies, shots and pickups. The final-boss entrance keeps its existing cleanup. Spawn caps, miniboss chest and final reward paths are reused. Standard mission objectives and their rewards are absent from the experiment, so balance and reward parity still need a hands-on comparison.

## Verification

- Automated Chrome playthrough at 390 × 844 entered C1-4, paused the clock, retained ordinary enemies and EXP across a wave change, fought both bosses, accepted the prize wheel and persisted first-clear mastery. The test shortened timers and used the game's kill handler to exercise the flow.
- The automated runtime test checks the HUD, one EXP settlement per wave budget, seamless continuation and rejection of a stage callback from an exited run.
- Physical phone performance, natural combat pacing and the balance of mission rewards are pending. The usual debug APK points at the production web URL, so a branch APK build alone does not validate this experiment.

Keep the feature opt-in until the live play and balance review.
