# Yuzu Unique v2 — owner picked A (Citrus Command), implemented v8.0.64

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

## Implemented (v8.0.64)
- Input reuses the hold-charge path (`_snipe.kind='yuzu'`): `isYuzuCommand`, `yuzuCmdAim` draws the aim (circle / Lime line), `yuzuCmdPoint` = drag direction × min(380, max(160, drag×2.2)) or auto (🎯 mark → `yuzuTarget` 440 → 220px walking direction), clamped 380 + `inMapPt`. Release → `_yzCmdPt` → `useCharacterSkill` → `yuzuParadeCast` → `yuzuCommand`. Button text 'AIM'; camera zoom-out while aiming (shared).
- Pomelo/Yuzling: `yuzuMotion(...,'command')` leap (air arc), landing `yuzuCommandLand` r160/120 (+Slam talent), ×6/×3 (+.5/Unique level) × uniquePower, stun .8s on small enemies (taunt from the draft replaced by stun — no taunt system now).
- Lime: one `command_arrow` (yz_51 art, 98px, pierce 99, speed 950, focusFinal splash 55+Raincaller), ×5 (+.4/level); first boss/mini/elite/mission hit gets the 🎯 for 6s. Seeking Arrow mutation = homing.
- Blood Orange: `u.storm` 3 pulses (4 with Bloom Burst) every .45s, r150 ×2.2 (+.2/level), pulls small enemies 14px per pulse (`yuzuTickStorm` inside `yuzuTickBuff`, paused/stale-safe).
- In Sync = the old buff (`_yzBuff`, `cmd:true`) for 4s (+2 Royal Parade, +UniqueTime, +1.5 Extended Focus); old end finishers skipped (`yuzuEndBuff(u,!u.cmd)`); 🎯 bonus ×1.5 while it lasts. Shields/Unique Mutations as before; texts renamed (Meteor Peel / Piercing Shot / Flavor Storm), talents Fortress Captain / Raincaller / Grand Alchemist reworded. No new art.

## v8.0.65 polish (owner picked ก+ข+ค+ง)
- Camera zoom-out while aiming only after 250ms of holding (a quick tap no longer pulses the zoom).
- Lime: a dragged aim fires along the drag angle (`pt.ang`, 800px line) instead of companion → point.
- Pomelo/Yuzling: `yuzuCmdLeapPt` caps the leap at 450px from the companion; duration .35 + d/1200 (≤.7s); aim circle drawn at the capped spot.
- Flavor Storm pull 14 → 35px per pulse (never past 10px from the centre).
