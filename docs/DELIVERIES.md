<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.77 — 🛡️ Forge Barrier no longer makes heroes untouchable

**Owner:** the gold-hexagon Barrier (Forge gear mods) let heroes take no damage → approved all 3 limits.
- Cap 25% → **15% max HP** (Barrier Capacity: 50% → **30%**).
- All sources together (Overflow Cream, Critical Barrier, Mark, …) add at most **4% max HP per second**.
- After the barrier breaks, **no new barrier for 3 s**.
- Constants `FORGE_BARRIER_BASE/MAX/RATE/LOCK` in `forgeBarrier` · tests: `forge-150` updated to the new numbers, `tests/forge-barrier-8277.test.cjs`.

# Previous delivery: v8.2.76 — 🍓 Shotgun no longer melts bosses up close

**Owner:** Strawberry Shotgun pressed against a boss was far too strong ("the boss melts") → approved A + B.
- **A:** bosses and minibosses no longer take the ×2 point-blank pellet bonus inside 120px (now ×(1+close bonus), the same as 120–200px). Regular foes keep ×2.8.
- **B:** in one blast, pellets 7+ that hit the same boss/miniboss deal half (`SG_BOSS_FULL_PELLETS=6`, per-blast id `b.sgBlast`).
- Expected boss damage up close ≈ −60%; Shotgun is still the strongest close-range build.
- Test: `tests/shotgun-boss-8276.test.cjs` · `strawberry-builds` boss expectation and the Taro `castSkill` hash updated.
