# Batch 7B — Mycelium Marsh (v6.55.93)

Seven original C2-2 creatures receive 16 authored raster poses each. Built-in image generation uses assets/ch2_mycelium_enemy_atlas.png as identity reference. Exact prompts are in PROMPTS.md; unmodified originals remain in raw/. Packed sources are 1024×1024 RGBA PNGs, a 4×4 grid of 256px frames. Runtime lossless alpha WebPs live in assets/art/ch2_mycelium.

| Stem | Original atlas cell | Identity / role | Facing |
|---|---|---|---|
| c22_drifter | 0 | Mycelium Drifter / basic | right |
| c22_hopper | 1 | Cap Hopper / fast and dasher | right |
| c22_sniper | 2 | Puffcap Sniper / shooter | right |
| c22_mold_sac | 3 | Mold Sac / bomber | right |
| c22_bulwark | 4 | Mycelium Bulwark / tank | right |
| c22_oracle | 5 | Threadweaver Oracle / siege and shooter | right |
| c22_sporeling | 6 | Sporeling / summoned zero-XP creature | right |

Packed frames row-major: 0–5 movement, 6–7 idle, 8–11 preparation/release/recovery, 12–13 hurt/recovery, 14–15 defeat. Hopper splits windup 8–9 and dash 10–11. Sniper and Oracle both split preparation 8–9 and firing 10–11. Mold Sac uses the authored pressure poses for a once-per-life low-HP warning. All poses stay on a fixed 236px baseline; one scale per species calibrates against the original atlas footprint. Sporeling keeps its original smaller footprint, .26 runtime scale, [34,94,94] collision circle and zero EXP.

The existing stage loader and central presentation controller handle move/idle/actions, freeze/thaw, pooled reset and one tracked non-physics defeat ghost. Missing or partially loaded animated keys fall back to the matching original atlas species frame. Original HP, damage, speed, rewards, cooldowns, dash/lead behavior, live caps, Drifter acid, Mold Sac split and Bulwark aura/guard remain. Both shooters prepare visually within the existing final 180ms cooldown. No new combat delays are introduced.

The old atlas remains loaded for fallback and the Clean Air objective Wisp in cell 7. Generic Elite and boss/miniboss art remain outside 7B.

Packing reuses `python scripts/pack-canopy-animations.py source-map.json --batch mycelium` (Pillow/NumPy); the default Canopy mode is unchanged. Whole alpha components preserve limbs/weapons crossing nominal source grid edges; detached details follow the nearest pose. PACKING.json records all bounds/scales/order. Review: mycelium_preview.webp and mycelium_contact.png. Test: `node tests/mycelium-animation.test.cjs`. On-device visual/FPS review belongs to the owner and remains pending. Next: batch 8, Nectar Hive including Tiny Grub.

Validation: full npm run check and npm run build:www passed. Contact sheet reviewed for complete silhouettes, alpha edges, fixed baseline and defeat poses. Runtime build includes all seven sheets at v6.55.93. Bulwark's slightly rectangular source is packed without stretching its anatomy. Phone gameplay/visual/FPS review remains pending.
