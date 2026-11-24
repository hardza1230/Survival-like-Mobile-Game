<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.78 — 🛡️ Barrier refills like an Energy Shield · Dash no longer shortens Phantom Rush

- **Forge Barrier = Energy Shield style (owner):** gain ≤2% max HP/s (was 4%) · any hit pauses refilling for 2 s · still capped 15% HP (30% with Barrier Capacity) and 3 s lockout after it breaks.
- **Forge damage reduction cap 30%** (`FORGE_DR_CAP` was higher) so stacked DR mods can't make a hero untouchable.
- **Chocolate Phantom Rush:** Dash no longer lowers its cooldown at all. Talent *Quick Refund* now = Phantom Rush cooldown −5% per rank.
- Tests: forge-150 (2%/s, pause, lock), forge-barrier-8277, forge-caps, phantom-rush-8263 (no dash refund), taro fixtures updated.

# Previous delivery: v8.2.77 — 🛡️ Forge Barrier no longer makes heroes untouchable

**Owner:** the gold-hexagon Barrier (Forge gear mods) let heroes take no damage → approved all 3 limits.
- Cap 25% → **15% max HP** (Barrier Capacity: 50% → **30%**).
- All sources together (Overflow Cream, Critical Barrier, Mark, …) add at most **4% max HP per second**.
- After the barrier breaks, **no new barrier for 3 s**.
- Constants `FORGE_BARRIER_BASE/MAX/RATE/LOCK` in `forgeBarrier` · tests: `forge-150` updated to the new numbers, `tests/forge-barrier-8277.test.cjs`.
