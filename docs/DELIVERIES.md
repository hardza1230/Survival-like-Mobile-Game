<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.79 — 🕳️ Hunger Crack no longer hangs at the end

- **Owner bug "Hunger Crack ชอบค้างตอนจบ":** the final hole waited until *every* tagged monster died (or 60 s), so 1–2 stragglers far away kept the wave open with nothing on screen.
  - Now: when ≤2 crack monsters are left for 6 s, the crack seals and the wave goes on; the stragglers become normal monsters (`HC_FINAL_TAIL=2`, `HC_FINAL_TAIL_SEC=6`).
  - Hard cap for the final phase 60 → 50 s (`HC_FINAL_MAX`).
  - Holes are clamped onto the path (`Math.min(L,…)`) so a very short crack can't leave its last hole unreachable.
- Test: `tests/hunger-crack.test.cjs` (5 left keeps going · ≤2 for 6 s completes · stragglers untagged · holes on path).

# Previous delivery: v8.2.78 — 🛡️ Barrier refills like an Energy Shield · Dash no longer shortens Phantom Rush

- **Forge Barrier = Energy Shield style (owner):** gain ≤2% max HP/s (was 4%) · any hit pauses refilling for 2 s · still capped 15% HP (30% with Barrier Capacity) and 3 s lockout after it breaks.
- **Forge damage reduction cap 30%** (`FORGE_DR_CAP` was higher) so stacked DR mods can't make a hero untouchable.
- **Chocolate Phantom Rush:** Dash no longer lowers its cooldown at all. Talent *Quick Refund* now = Phantom Rush cooldown −5% per rank.
- Tests: forge-150 (2%/s, pause, lock), forge-barrier-8277, forge-caps, phantom-rush-8263 (no dash refund), taro fixtures updated.
