# Batch 8 — Nectar Hive (v6.55.94)

| Stem | Original atlas cell | Species / role |
|---|---|---|
| c23_drone | 0 | Nectar Drone / basic |
| c23_dartwing | 1 | Dartwing / fast and dasher |
| c23_pollen_sniper | 2 | Pollen Sniper / shooter |
| c23_honey_bomb | 3 | Honey Bomb / bomber |
| c23_wax_guard | 4 | Wax Shieldbearer / tank |
| c23_choir_moth | 5 | Choir Moth / siege and shooter |
| c23_grub | 6 | Tiny Grub / existing unused type |

All face right. Dartwing windup uses 8–9 and dash uses 10–11. Both shooters prepare in 8–9, fire/recover in 10–11, within the existing final 180ms shot cooldown. Honey Bomb pressure warning uses 8–11. Atlas cell 7 retains the flower fallback.

Seven Nectar Hive creatures including Tiny Grub receive 16 authored poses each. Flying species flap wings; Dartwing has windup/dash, both Pollen Sniper and Choir Moth have preparation/firing, Honey Bomb has a once-per-life low-HP warning. Runtime assets: assets/art/ch2_nectar. Original/raw/packed sources, exact prompts, packing and review: assets/incoming/ch2_s3_animations. Original HP/damage/speed/EXP, circles, wax guard aura and 0.74 guard multiplier, flower targeting, Choir Moth three-shot fan, caps and Story P1–P5 remain. Atlas cell 7 flower fallback, generic Elite and boss/miniboss art remain. Tiny Grub has an existing atlas/type mapping but no current spawn caller or special stat branch; its existing basic stats/1 EXP remain, without adding summons. Owner mobile visual/FPS review pending. Next: batch 9, Four-Season Conservatory and Root Throne.

Generated with built-in imagegen using the original Nectar atlas as identity reference. Unmodified selected outputs in raw/. Exact prompt set in PROMPTS.md. Packed PNG: 1024×1024 RGBA, 4×4 256px cells. Runtime lossless alpha WebP. Frames 0–5 movement, 6–7 idle, 8–11 action, 12–13 hurt/recovery, 14–15 defeat. One uniform scale per species calibrated to its original atlas footprint; fixed 236px baseline. Packer: python scripts/pack-canopy-animations.py source-map.json --batch nectar. Whole alpha components preserve complete wings/limbs and detached details. PACKING.json records original bounds, order and scale. Review: nectar_contact.png and nectar_preview.webp. Test: node tests/nectar-animation.test.cjs.

Validation: full npm run check and npm run build:www passed at v6.55.94. Contact sheet inspected for complete wings/shields, clean alpha, separate poses and consistent baseline. Build includes all seven new runtime sheets. Source spacing corrections use built-in imagegen and are recorded in PROMPTS.md. On-device gameplay/visual/FPS review remains pending.
