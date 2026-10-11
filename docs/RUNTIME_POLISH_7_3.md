# v7.3.0 runtime delivery

Base: v7.2.0 / 0b72b51. Inspected other AI latest delivery; retained its controls, proximity objects, mimic and audio work. Integrated actual pending sound routes and new owner requests.

- New SFX: Capture charging/complete, Mint charging, Slot loop/jackpot (5 files). Stop loops before outcomes; separate controlled channels prevent Wisp/Mint fighting over one loop slot.
- Hunter curse is an actual persistent drain state; toxic named hazards are damage events, not a timer-based poison status. UI says CURSED vs TOXIC HIT, poison cue only on real HP loss.
- Glacier Unique: +10% hit power; Frost Burn initial/shatter stack, max 5, 8s refresh, 8% base hit power per stack/sec through guarded damage pipeline. No ticks through boss phase immunity.
- Unique level-up: 2.4s highlighted notice over draft, Ready/cooldown reset, pulse and dedicated cue.
- Seven ImageGen transparent screen overlays cover all playable heroes including Berry Core, appear briefly on Unique casts/rank. Center unobstructed, no input targets.
- Deliberately unused prior assets: standalone enhance_start (results contain hammer sequence, no live delayed forge); dig_find_item (no actual gear branch); item_roll_* alternatives (actual wheel uses Slot loop), extra mine variants. Do not invent mechanics merely to use every file.

Checks: full npm check, focused Frost Burn/audio channel regression, registered new paths + build output/version verification. Human phone playtest still needed: Bloom burn damage across normal/boss/frozen targets, transition immunity, capture exit/re-enter/pause, Wisp + ice charging together, wheel STOP/result, mute, Unique notice on a level-up panel, portrait/landscape alpha effect readability.
