<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.47 — 🧊 Fix: Ice Cage Sealing (C1-4 boss) columns now really hit

- **Bug (owner, phone):** the Ice Cream Golem's "Ice Cage Sealing" drew 6 full-height column warnings, but only a small circle (r45) at the player's row did damage, so standing in a lit column usually did nothing. New `iceCageSlam(x,py,d)`: when the bars slam (760 ms), each warned column flashes and hits anywhere along it (half-width 30, ±490 px) once, plus a short slow. The one gap column stays safe. The old hazard circle and bar art are kept. Damage per hit is unchanged.
- Tests: new `ice-cage-8247`.

# Previous delivery: v8.2.46 — 🃏 Fix: Start / Reroll on the mission deal could not be tapped · description text removed

- **Bug (owner, phone):** after the deal (v8.2.41), tapping "▶ Start the stage" or "Reroll missions" did nothing, so the stage could not start. In play the UI camera is zoomed by `RENDER_DPR`, but the deal's tap handler compared raw screen-pixel pointers with UI coordinates (a 1.5× mismatch on the phone). `missionDealShow` → `onTap` now divides by `RENDER_DPR` like the other in-play taps (hit area +14 px). Reproduced and verified with a headless touch run: Reroll re-deals, Start enters the stage. QA bots never caught it because they call `_finishDeal` directly.
- **Owner:** the long description under each lifted card (name, description, reward) was unreadable and too much. It is removed; the card is lifted and flipped with no text.
- Tests: new `deal-tap-8246`; `hunt-throw-8222` and `scamper-8227` updated for the removed text.
