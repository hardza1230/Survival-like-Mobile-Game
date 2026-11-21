<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.44 — 🕳️ Hunger Crack as a real Abyss · monsters emerge instead of popping in

Owner: compare Hunger Crack with Path of Exile's Abyss (longer, slower, monsters trickle out), and make mission spawns less abrupt. Both plans approved.

**Hunger Crack (`capture`)**
- The crack is longer: 10 segments in Ch1, 13 in Ch2+ (~1,400–1,900 px), still kept inside the map.
- No touch needed. It creeps at 60/72 px/s, only while the hero is within 260 px of the tip. If the hero leaves, it waits and says "Stay near the crack!" (at most once every 6 s).
- While it moves, 1–2 monsters crawl out of the crack behind the tip every 2 s (Ch1) or 1.5 s (Ch2+).
- Middle holes (3) stream 6 (Ch1) or 9 (Ch2+) monsters, one every 0.6 s. Clearing a hole's whole stream gives loot at the hole (`hungerCrackHoleLoot`).
- Final hole: 3 waves of 4 (Ch1) or 6 (Ch2+), 3 s apart, then an Elite. Clearing it (or the 45 s fallback) gives the **Abyss chest**: a Sugar burst plus a min-rare gear drop (tier 2 from Ch3/endgame).
- `MISSION_WAVE_DUR.capture` 80 → 115.

**Mission spawn animation (`emergeFoe`)**
- `ground`: a dark crack spreads under the feet, the monster rises with a squash & stretch bounce, and dirt flies out.
- `portal`: a purple swirl opens, the monster steps out with a flash, and the swirl collapses. Used for Herald gates and minions.
- For 0.52 s the monster does not move, deal contact damage or take damage.
- Full effects are capped at 8 at once; past that, only the rise. Sprite-replaced (`artFollow`) monsters scale their art sprite.
- Applied in `sigSpawnAt` (all signature-mission spawns) and in Hunger Crack spawns. Normal edge spawns are unchanged.

**Checks:** QA pool bots `capture`, `hungerHerald` and `seedRift` all complete with 0 errors. Tests: `hunger-crack` rewritten for the new flow; `taro-feedback` normalises the new `damage` guard.

# Previous delivery: v8.2.43 — 🧬 Hunger Mutations for Herald-empowered monsters

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
