<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.50 — 🔊 Boss voice lines louder during fights

- **Owner:** boss voice acting was too quiet during the fight. `VoiceActing.play` now plays boss keys (`vo_bNN_*`) during play at `VO_BOSS_VOL` = 1.0 (other voice lines stay at .65, both × the SFX volume setting). It also ducks the music to .42 instead of .7 while the line plays.
- Tests: new `boss-vo-vol-8250`.

# Previous delivery: v8.2.49 — ⚔️ Fix: Expedition hero grew bigger with every tap

- **Bug (owner, phone):** in Temple Expedition, rapid tapping made the hero (and the art inside the tap area) grow. The generic menu "press bounce" (`_pressBounce`) shrinks then pops everything inside the tapped zone. A new press during the 160 ms pop-back captured the already-enlarged scale as its base, so every tap compounded it. Measured headless: 12 fast taps took the hero from 0.82 to 1.04 scale.
- **Fix:**
  - The Expedition tap area is `noBounce`; it has its own hit feedback.
  - `_pressBounce` now remembers each object's pre-press transform (`_pbBase`) and reuses it for repeat presses, so no button can grow cumulatively.
  - Verified headless: the scale stays at 0.82 under rapid taps.
- Tests: new `exp-tap-scale-8249`.
