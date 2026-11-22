<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.62 — 🧭 Expedition easy to find (Activities + red dot)

**Owner:** maybe few players use Expedition because it is buried (Home → Upgrade → Weave & Rank → Expedition).
- **Activities row:** ⚔️ Expedition added to the Activities tab (2 taps from Home) · the Weave buttons stay · Back returns to where you came from (Activities or Weave), bottom tab follows.
- **Red dot fixed:** it died in v8.2.54 with the daily chest · new `Save.expReady()` = away ≥ 1 h (offline 🍪 waiting) or enough 🍪 to upgrade · shows on Activities tab/row and the Weave buttons (no longer on the Upgrade tab).
- **Unlock text:** "Depths… use shovels" → "Expedition is open! … Find it in Activities."
- Group-screen rows get `row_<target>` tap tags (bots/tests).
- Test: `tests/exp-findable-8262.test.cjs`.

# Previous delivery: v8.2.61 — ⚔️ Expedition simplified (no tapping needed)

**Owner:** Expedition asked too much of the player → simplify, don't remove (screen `dig` is #8 of 25 by real visits).
- **Hero fights on its own:** hero auto-attacks (Hero Power = old Tap Power `e.tap`, ×`EXP_HERO_APS`=2/s) · counts offline too · tapping still works but is optional.
- **Boss retries itself:** out of time → train 10 foes → boss again · "Fight Boss" button removed.
- **⬆ Upgrade all:** one button buys the best DPS-per-Crumb upgrades until broke (max `EXP_UPALL_MAX`=200 per tap) · single rows stay.
- **Supplies refill themselves:** last packed supply rebuys on stage start / Expedition open when Crumbs allow · tap it again = auto off.
- Rewards unchanged · old saves work · team/roles plan moved to after Closed test (`docs/IDEAS.md`).
- Test: `tests/exp-simplify-8261.test.cjs` (+ `expedition-8232` updated).
