<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.46 — 🃏 Fix: Start / Reroll on the mission deal could not be tapped · description text removed

- **Bug (owner, phone):** after the deal (v8.2.41), tapping "▶ Start the stage" or "Reroll missions" did nothing, so the stage could not start. In play the UI camera is zoomed by `RENDER_DPR`, but the deal's tap handler compared raw screen-pixel pointers with UI coordinates (a 1.5× mismatch on the phone). `missionDealShow` → `onTap` now divides by `RENDER_DPR` like the other in-play taps (hit area +14 px). Reproduced and verified with a headless touch run: Reroll re-deals, Start enters the stage. QA bots never caught it because they call `_finishDeal` directly.
- **Owner:** the long description under each lifted card (name, description, reward) was unreadable and too much. It is removed; the card is lifted and flipped with no text.
- Tests: new `deal-tap-8246`; `hunt-throw-8222` and `scamper-8227` updated for the removed text.

# Previous delivery: v8.2.45 — 🧪 Hunt bottles lobbed (dodgeable) · 🕯️ Wisp soft dome · art order 93 redesigned

- **Hunt the Elite (owner approved order 92 set B):** the Elite no longer fires a straight bottle that always hits. It lobs it in an arc to where the hero stood at the throw. A purple ground mark shrinks toward its centre over 0.85 s (`HUNT_LOB_T`); a bottle shadow grows under the flight. Standing inside the mark (`HUNT_LOB_R` 44, flattened ellipse) when it lands = 1 poison stack + the same damage as before; walking out = dodged. A poison puddle lingers 2 s (visual only). Code-drawn until art 92 arrives. `huntLob` / `huntLobLand`; nothing lands after the run ends.
- **Escort the Wisp (owner approved order 92 set C + the dome idea):** the hard ring is replaced by a thin glowing dome (`wispDome`): soft fill, a wobbling feathered edge, and a glass sheen arc. Gold inside, dim red outside. The bleed outside the zone stays as real damage (unchanged).
- **Docs:** order 92 marks B/C approved with code done; set C becomes a thin dome. Order 93 is rewritten to the owner's ask: one premium card back for every card (boss back dropped), plus a foil shine pass. A20 Ruby lines are approved.
- Tests: new `hunt-lob-wisp-dome-8245`; `mission86-87-a16` follows the bottle into `huntLob`. QA bots hunt + purge completed with 0 errors.
