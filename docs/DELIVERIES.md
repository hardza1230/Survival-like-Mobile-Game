<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.45 — 🧪 Hunt bottles lobbed (dodgeable) · 🕯️ Wisp soft dome · art order 93 redesigned

- **Hunt the Elite (owner approved order 92 set B):** the Elite no longer fires a straight bottle that always hits. It lobs it in an arc to where the hero stood at the throw. A purple ground mark shrinks toward its centre over 0.85 s (`HUNT_LOB_T`); a bottle shadow grows under the flight. Standing inside the mark (`HUNT_LOB_R` 44, flattened ellipse) when it lands = 1 poison stack + the same damage as before; walking out = dodged. A poison puddle lingers 2 s (visual only). Code-drawn until art 92 arrives. `huntLob` / `huntLobLand`; nothing lands after the run ends.
- **Escort the Wisp (owner approved order 92 set C + the dome idea):** the hard ring is replaced by a thin glowing dome (`wispDome`): soft fill, a wobbling feathered edge, and a glass sheen arc. Gold inside, dim red outside. The bleed outside the zone stays as real damage (unchanged).
- **Docs:** order 92 marks B/C approved with code done; set C becomes a thin dome. Order 93 is rewritten to the owner's ask: one premium card back for every card (boss back dropped), plus a foil shine pass. A20 Ruby lines are approved.
- Tests: new `hunt-lob-wisp-dome-8245`; `mission86-87-a16` follows the bottle into `huntLob`. QA bots hunt + purge completed with 0 errors.

# Previous delivery: v8.2.44 — 🕳️ Hunger Crack as a real Abyss · monsters emerge instead of popping in

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
