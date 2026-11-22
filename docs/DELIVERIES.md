<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.63 — 👻 Phantom Rush costs your Dashes

**Owner:** Phantom Rush (Cocoa · Dash Boxer) was too strong and could be used too often → spend Dash charges + refund cap.
- **Spends all Dash charges:** needs ≥ 1 charge ("Need a Dash" otherwise) · +1 leap per charge spent (max +5) · replaces the old "Dash before casting" bonus · Dash is empty after the cast (free shadow Dashes still there to dodge).
- **Free shadow-mode Dashes no longer cut the cooldown.**
- **Refund cap 40%:** Dash refunds, kill refunds and Ghost Refund together cut at most 40% of the cooldown per cast (20s → 12s fastest) · Unique Cooldown gear still applies · other paths unchanged (`phRefund`).
- Tests: `tests/phantom-rush-8263.test.cjs` · cocoa-builds + Taro doDash fixtures updated for the intended change.

# Previous delivery: v8.2.62 — 🧭 Expedition easy to find (Activities + red dot)

**Owner:** maybe few players use Expedition because it is buried (Home → Upgrade → Weave & Rank → Expedition).
- **Activities row:** ⚔️ Expedition added to the Activities tab (2 taps from Home) · the Weave buttons stay · Back returns to where you came from (Activities or Weave), bottom tab follows.
- **Red dot fixed:** it died in v8.2.54 with the daily chest · new `Save.expReady()` = away ≥ 1 h (offline 🍪 waiting) or enough 🍪 to upgrade · shows on Activities tab/row and the Weave buttons (no longer on the Upgrade tab).
- **Unlock text:** "Depths… use shovels" → "Expedition is open! … Find it in Activities."
- Group-screen rows get `row_<target>` tap tags (bots/tests).
- Test: `tests/exp-findable-8262.test.cjs`.
