<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.41 — ▶ Mission deal waits for your choice

Owner request: after the mission cards are dealt, stop and let the player choose to continue or reroll.

- `missionDealShow`: when a reroll is on offer (free, or the ad reroll), the deal no longer starts the stage on its own and a tap on empty space no longer skips. A pulsing "▶ Start the stage" button appears under the Reroll button once the cards are laid out.
- With no reroll left (after the ad reroll, or the C1-1 tutorial plan), the old auto-start stays.
- Headless check: the deal stayed open for over 12 s; tapping Start began the stage.
- Ideas logged in `docs/IDEAS.md` (owner 21 Nov): art on the back of mission cards; Escort the Wisp as a thin dome.

# Previous delivery: v8.2.40 — 🔦 Mission spotlight every stage · short in-play banners

Owner request: give the other missions the same camera spotlight as Hunt the Elite (plan A: the first time each mission appears in a stage), and stop long descriptions popping up in the middle of the screen during play.

- `questFocus` now runs once per mission type per stage (`_qfRun`, reset in `startStage`) instead of the first 3 times ever per save.
- New `questFocusWhenReady(o,type)` retries every 1 s for up to 20 s until the mission's targets exist, so missions whose objects appear later get the spotlight too.
- New targets: Grandma's Golem (the golem or its spawn spot), Clean Air v2 (the fresh-air bubble), Seed Rift (the rift when no carrier is out yet). Hunger Herald now works through the retry.
- `showBanner` during play (any state except menu/title): the title alone in the centre for about 1.1 s. The description moves to one line under the mission bar for 3–4 s.
- `bannerLine()` picks that line: the part after " — " (usually the action), otherwise clauses up to 58 characters, cutting at a comma before falling back to "…". Menu banners are unchanged.
- Headless check: Herald, Golem, Clean Air and Seed Rift all get the spotlight; a second Purge in the same stage is skipped; the banner title hides at about 1 s and the line at about 4 s.
- Test: `tests/banner-spot-8240.test.cjs`.
