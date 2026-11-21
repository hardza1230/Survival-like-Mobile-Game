<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.51 — 👻 Fix: monsters turning invisible (only their shadow showed)

- **Bug (owner, phone):** after playing a while, some monsters had no art; only their shadow was visible. Mission monsters with a painted overlay (`artFollow`, e.g. Seed Rift carriers, Herald minions) hide the real sprite at alpha .01 and draw the overlay on top. If the overlay was destroyed elsewhere first, `artFollowTick` dropped it without restoring the monster's alpha, so the monster stayed see-through.
- **Fix:**
  - `artFollowTick` restores alpha and clears `_artOv` when it finds a dead overlay.
  - Safety net in the enemy update loop: a live monster with alpha < .05 and no live overlay is set back to alpha 1. Fleeing fades and `_hideOk` are exempt.
- Tests: new `invisible-foe-8251`. QA bots seedRift + defendNectar completed with 0 errors.

# Previous delivery: v8.2.50 — 🔊 Boss voice lines louder during fights

- **Owner:** boss voice acting was too quiet during the fight. `VoiceActing.play` now plays boss keys (`vo_bNN_*`) during play at `VO_BOSS_VOL` = 1.0 (other voice lines stay at .65, both × the SFX volume setting). It also ducks the music to .42 instead of .7 while the line plays.
- Tests: new `boss-vo-vol-8250`.
