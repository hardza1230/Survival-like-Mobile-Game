<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.52 — ✂️ ECRS round 1 (Eliminate + Simplify before the Closed test)

- **Owner:** apply ECRS before the Closed test, doing E and S first.
- **E · Kitchen hidden:** `KITCHEN_ON=false`; `kitchenOpen()` returns false and the Activities row is gone. Flip it to bring it back after the test.
- **E · Overcharge leftovers:** the dead `msn71_overcharge_pad` is no longer preloaded with every stage's mission art (the rest of the code was removed in 8.2.36).
- **S · Forge currencies 5 → 3:** 🍓 Berry Jam and 🍯 Honey Drop fold into 🟢 Twist Cream.
  - Twist Cream now adds/removes mods and upgrades rows 1–3. ⭐ Star Sugar upgrades rows 4–6. 🖋️ Recipe Ink moves a mod.
  - The old keys alias to Twist Cream, so any old drop still works.
  - Mission rewards, League drops, drop pools and Grandma's Table were re-pointed.
  - Old saves convert each Jam/Honey into 2 Twist Cream (`_cur8252`).
  - The Forge wallet line drops the two icons.
- **Not cut, after checking:** the ~15 signature missions are each stage's identity, and Chapter 1's first playthrough already uses a fixed teaching plan with no roaming missions. Boss Rush stays hidden.
- Tests: new `ecrs-8252`; updated mission-template, missions71-74-art, reforge-rows, forge-redesign, forge-simple and sig-missions. The frozenPantry QA bot completed with 0 errors.

# Previous delivery: v8.2.51 — 👻 Fix: monsters turning invisible (only their shadow showed)

- **Bug (owner, phone):** after playing a while, some monsters had no art; only their shadow was visible. Mission monsters with a painted overlay (`artFollow`, e.g. Seed Rift carriers, Herald minions) hide the real sprite at alpha .01 and draw the overlay on top. If the overlay was destroyed elsewhere first, `artFollowTick` dropped it without restoring the monster's alpha, so the monster stayed see-through.
- **Fix:**
  - `artFollowTick` restores alpha and clears `_artOv` when it finds a dead overlay.
  - Safety net in the enemy update loop: a live monster with alpha < .05 and no live overlay is set back to alpha 1. Fleeing fades and `_hideOk` are exempt.
- Tests: new `invisible-foe-8251`. QA bots seedRift + defendNectar completed with 0 errors.
