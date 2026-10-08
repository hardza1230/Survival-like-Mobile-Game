# Elite and special creatures — v6.55.95

Built-in imagegen; exact prompts in PROMPTS.md. Unmodified selected originals in raw/. Five packed RGBA PNG sources, each 1024×1024, 4×4 grid of 256px frames. Runtime lossless alpha WebP: assets/art/elite_summons. All face right. Frames 0–5 move, 6–7 idle, 8–11 attack (Feast: fast fleeing), 12–13 hurt/recovery, 14–15 defeat.

| Stem | Reference / role | Runtime use |
|---|---|---|
| c21_crown_sapling | C2-1 atlas cell 6 | C2-1 Elite; original .42 scale/circle |
| mini_jelly | original delve10_minijelly green guard | Warden half-HP split; three children, .36 scale/circle unchanged |
| c3_elite | crowned ash/gold seed knight per art brief | Elites in all five Chapter 3 stages |
| feast_target | plump mochi with food plate per brief | Delve/Recipe Feast; fast fleeing frames, no attack clip |
| mimic_chest | original chest brown/gold/red gem, living teeth | Miniboss chest conversion; authored bite |

`applySpecialEnemyArt` preserves world frame width and circle radius/center by converting source coordinates to the 256px frame. Example: old 62px Elite at 1.55 becomes scale 1.55×62/256; old radius 26 at 1.55 stays 40.3 world pixels. Mimic remains 64px box and 26.88px radius. Mini Jelly is already a 256px reference: scale .36, circle [70,58,70], 5% Warden HP, 45% Warden damage, original tank speed/EXP. Feast HP×2.2, 22s lifetime, 6s first/16s repeated cadence, 15% Hunger share remain. Mimic HP×2.6, speed×1.6, damage×1.15, 0.9s reveal freeze, chance/tier/reward are untouched. Boss sheets/pose/death code stay independent.

Crown and C3 Elite use stage-specific sheets. Mini Jelly/Feast are critical only in endgame; Mimic loads for battles. Missing sheets fall back to matching original textures/atlas frames. The shared controller handles action priorities, freeze/thaw, hurt, pool reset and one tracked non-physics death ghost. Animated Feast reuse cancels its expiry fade and clears fleeing state. Mimic fallback also resets presentation after changing to the chest.

Packing: `python scripts/pack-canopy-animations.py source-map.json --batch elite` (Pillow/NumPy). Whole alpha components preserve complete anatomy/detached details. Uniform species scale against original normalized footprint, fixed 236px baseline. Crown's slightly rectangular source is normalized without stretching. Mimic generated 18 poses in rows 6/4/4/4; selected source indices [0,1,2,3,4,5,6,7,8,9,10,11,14,15,16,17] preserve six moves, two idle, four bites, two hurt and two defeats in the final strict 4×4 sheet. PACKING.json records source geometry/order/scales. Default ordinary batches retain their original extraction/order.

Review: elite_contact.png and elite_preview.webp. Regression: tests/elite-special-animation.test.cjs uses actual game methods to compare original/new combat and world collider geometry, exercise Feast flee/expiry/Hunger, Mimic bite/reward/fallback, Warden split, freeze/pool/death and loading. Full device gameplay/visual/FPS review belongs to the owner and remains pending. Ordinary season/root batch 9 is still pending.

Validation: full npm run check and npm run build:www passed at v6.55.95. Packed contact sheet inspected for complete silhouettes, alpha edges, frame separation and defeat poses. Build includes all five runtime sheets. On-device visual/gameplay/FPS review remains pending.
