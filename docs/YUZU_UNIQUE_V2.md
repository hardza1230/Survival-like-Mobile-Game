# Yuzu Unique v2 — design draft (awaiting owner pick)

Problem with the current Unique (Golden Peel Armor / Hunter's Focus / Perfect Blend):
press → the companion is buffed for 6–7s → finisher. The player does not choose anything,
and nothing connects it to the new seed mark (walk to aim).

Goal: the Unique is a **command** — the player picks where / who, the companion does one big
move there. Keep: card ids, Unique Mutation ids, talent points, CD 13s, single immortal buddy,
mission/boss priority. Art budget is full (Yuzu ~299/300 MB), so reuse existing sheets
(yuzu51 finishers: peel rupture, light arrow, petal bloom; yuzu54 sigil/comet).

## A. Citrus Command (recommended)
Hold the Unique button → a ground marker appears in the walking direction (or on the 🎯 mark
if one exists), max 380px. Drag the move stick to steer it. Release (or 1.2s auto) → the
companion leaps there and does its path move. Tap without holding = target the 🎯 / nearest
priority enemy (same as Momo Sniper hold/tap pattern).

| Path | Command move | After (4s "In Sync") |
|---|---|---|
| Pomelo | Meteor Peel: leap + slam r160, ×6 companion power, knock non-boss, taunt 3s | shield 15% max HP (old Golden Peel), sweeps wider |
| Lime | Piercing Shot: one light arrow along the line companion → marker, pierces all, ×5, marks the first big target 6s | arrows pierce +2 (old Focus) |
| Blood Orange | Flavor Storm: big Sigil at the marker, 3 pulses ×2.2 each, pulls non-boss 40px | spells recharge 50% faster (old Blend) |

All paths: while In Sync the 🎯 bonus is ×1.5 instead of ×1.25.
Unique Mutations remap (same ids): ripe_fest → Pomelo grows 1 stage on slam hit · ripe_shield → +15% shield ·
toss_rain → In Sync +1.5s · toss_home → arrow bends to the nearest priority enemy ·
grow_burst → Storm 4th pulse · grow_grove → Storm also gives 20% shield.

## B. Ripe Meter
Unique has no cooldown; companion hits on the 🎯 fill a meter (0–100). Tap anytime: power
scales with the meter (50% at 30, 100% at 100). Rewards aiming, but weaker when there is no
mark and harder to read.

## C. Juice Swap
Tap → Yuzu and the companion swap places with a burst at both points (escape + engage).
Strong survival, little damage identity; conflicts with Dash.

Recommendation: **A** (B's idea can be added later as "In Sync" lasting longer per mark hit).
