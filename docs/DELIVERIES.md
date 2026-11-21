<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.42 — 🌋 Titan lava pool drawn in code · art order 93 (mission card back)

- Owner: Cocoa Titan's lava pool (Blood Rage release / Lava Crater, `cocoaPool` with `0xff3a10`) is now drawn in code by `lavaDraw(q)` and redrawn each tick in `tickCocoaPools`. It has a wobbling dark crust edge, a molten orange body, a yellow core and rising bubbles, and pops in over 0.18 s. Damage, radius, duration and the 12-pool cap are unchanged. The `bpx_cocoa_lava` sheet is removed from `ASSET_FX`, so it no longer loads or ships. The fire pool (`bpx_cocoa_firepool`) is unchanged.
- Art order 93 (`docs/art_orders/93_MISSION_CARD_BACK.md`): shared card back, boss card back, flip glint (3 files). README row added.
- Headless: the pool draws, the old texture is not loaded, no errors.

# Previous delivery: v8.2.41 — ▶ Mission deal waits for your choice

Owner request: after the mission cards are dealt, stop and let the player choose to continue or reroll.

- `missionDealShow`: when a reroll is on offer (free, or the ad reroll), the deal no longer starts the stage on its own and a tap on empty space no longer skips. A pulsing "▶ Start the stage" button appears under the Reroll button once the cards are laid out.
- With no reroll left (after the ad reroll, or the C1-1 tutorial plan), the old auto-start stays.
- Headless check: the deal stayed open for over 12 s; tapping Start began the stage.
- Ideas logged in `docs/IDEAS.md` (owner 21 Nov): art on the back of mission cards; Escort the Wisp as a thin dome.
