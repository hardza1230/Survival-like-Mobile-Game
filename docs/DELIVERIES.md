<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.43 — 🧬 Hunger Mutations for Herald-empowered monsters

Owner: monsters buffed by the Hunger Herald felt plain (only bigger, purple and stronger). Plan approved as proposed.

- `hhEmpower` now calls `hhMutate(e)`, which rolls one mutation (`HH_MUT`). The emoji icon floats above the monster (max 12, `S.mi`) and the name pops up on gain. The pool depends on the chapter: Ch1 (stage < 5) gets `shell`/`bloat`/`split`, Ch2+ gets all six. Split children (`_hhKid`) never mutate.
  - 🛡️ **Candy Shell**: blocks 3 hits, one layer per 0.12 s (`hhShellBlock`, hooked at the top of `damage`). The ring shrinks per layer.
  - 💨 **Frenzy**: every 3 s within 520 px, a red aim line for 0.6 s, then a 0.35 s dash at 560 px/s.
  - 💥 **Bloat**: on death, a red circle (r 95) grows for 0.8 s, then explodes (player damage 8 + 1.5 × stage if inside).
  - 👯 **Split**: on death, 2 small `basic` monsters (×0.75 size, 45% HP).
  - 🔮 **Hex Orbs**: every 3.5 s within 600 px, 3 slow purple shots (`foeShot`).
  - 🔗 **Leech**: every 1 s, heals the nearest hurt monster within 170 px by 8% max HP, with a green tether.
- Reward ("harder = better"): a mutated kill counts double in the Herald payout (`S.mutKills`, "💜 +2"). Everything is code-drawn; no new art.
- Headless (stage 2 and 7): all 6 mutations attach with icons, shell blocks, split spawns 2, kills counted, no errors.
- Tests: `tests/herald-mutations-8243.test.cjs`; `taro-feedback` normalises the new line in `damage`.

# Previous delivery: v8.2.42 — 🌋 Titan lava pool drawn in code · art order 93 (mission card back)

- Owner: Cocoa Titan's lava pool (Blood Rage release / Lava Crater, `cocoaPool` with `0xff3a10`) is now drawn in code by `lavaDraw(q)` and redrawn each tick in `tickCocoaPools`. It has a wobbling dark crust edge, a molten orange body, a yellow core and rising bubbles, and pops in over 0.18 s. Damage, radius, duration and the 12-pool cap are unchanged. The `bpx_cocoa_lava` sheet is removed from `ASSET_FX`, so it no longer loads or ships. The fire pool (`bpx_cocoa_firepool`) is unchanged.
- Art order 93 (`docs/art_orders/93_MISSION_CARD_BACK.md`): shared card back, boss card back, flip glint (3 files). README row added.
- Headless: the pool draws, the old texture is not loaded, no errors.
