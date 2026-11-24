<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.82 — 🧹 Free old stage art before the next stage

- **Owner:** after playing a while the game stops loading art and shows fallback graphics (no crash).
- **Cause:** entering a run freed menu art, other heroes and unused endgame art, but **never other stages' art**. Every stage played stayed decoded in GPU memory, and `texBudget` only ran on menu screens. Once memory filled, new loads failed or stalled, and after the long-load watchdog the stage opened with fallback art.
- **Fix:**
  - `texFreeStages(idx)` runs before loading the next stage (and for each Boss Rush boss). It frees stage-class art that is not in `stageArtKeys(idx)` and not in the shared battle group (`texStageKeep`).
  - `texFreeForRun(idx)` does the same at run start.
  - A failed image load during play calls `texMemRelief()`: unshown textures are freed (LRU) down to 70% of `TEX_BUDGET_MB` (throttled to once per 3 s). The loader re-kicks itself every 0.6 s.
- **Headless:** loading stage 10 art 411 → 511 MB; switching to stage 3 frees 62 textures → 411 MB; a load error relieves 511 → 364 MB.
- Tests: new `tests/tex-stage-free-8282.test.cjs`, `gpu-memory-budget` updated.

# Previous delivery: v8.2.81 — 🐛 Lure the Crown Root gets meaner (and more fun)

Owner: "Lure the Crown Root จืดเกินไป" → SCAMPER, owner picked items 1–4.
- **(1) Escalation:** each smashed stone = root +18% faster and warning 0.9 → 0.78 → 0.66 s; after the 2nd stone the root **splits into 2 heads**. It locks on as soon as it is within 190 px or after 2.2 s (was 150 px / 4 s waiting).
- **(2) Pull + combo:** the warning circle pulls normal monsters in (170 px); the strike kills normal monsters in 120 px (elites take 30%). 2+ kills = "Root combo ×N" +N 🍬.
- **(3) Perfect Dodge:** be inside the circle in the last 0.35 s and get out before it lands → slow-mo, +3 🍬, root stays stuck 1.6 s. The "Missed" text is gone.
- **(4) Finale:** the 3rd stone no longer ends the mission at once. The Crown Root head gets stuck (a 6× HP tank under `_timeStop`) for 8 s. Every 10% of its HP lost = 🍬 pop; killing it or timing out = burst + mission complete.
- Constants `CR_*`. Tests: new `tests/crown-root-8281.test.cjs`, `mission-reworks-828` updated. Headless browser: finale, pops, timeout burst OK with no errors.
