# Monster animation commit 6 — v6.55.16

Ten generated raster identities replace the existing four-frame walk sheets in play. Sources are packed RGBA PNG sheets, 1024×1024, 4×4 cells of 256px. Runtime lossless WebPs retain alpha: Stage 5 uses 256px frames, Chapter 3 uses 128px frames (512×512 sheet). No grid, labels or baked ground shadows. Exact generation prompts are in PROMPTS.md and targeted repair prompts in REPAIR_PROMPTS.md; bounds and original apparent-size calibration are in PACKING.json.

| Source/runtime stem | Identity | Action |
|---|---|---|
| s5_void_crumb | Void Shard | Contact strike |
| s5_crown_ripper | Crown-Ripper Fiend | Windup / dash |
| s5_banquet_eye | Banquet Eye | Focus / fire |
| s5_maw_truffle | Bomb-Mouth Truffle | Pressure warning |
| s5_royal_oven_sentinel | Crown Oven Guard, including Stage 5 Elite | Punch |
| c3_basic | Ash Mochi | Contact strike |
| c3_fast | Sunseed Sprinter | Windup / dash |
| c3_shooter | Hollow Apple Sniper | Aim / fire |
| c3_bomber | Crownseed Pod | Pressure warning |
| c3_tank | Acorn Shield Knight | Punch |

Frames, row-major: 0–5 movement, 6–7 idle, 8–11 action preparation/release/recovery, 12–13 hurt/recovery, 14–15 defeat. All authored poses face right; facing metadata lets runtime flip toward the player. Repair strips are first uniformly normalized to the original recovery silhouette; low-alpha background residue and isolated narrow scraps touching cell boundaries are cleared. PACKING.json records normalization and cleanup counts. One packing scale per species and a fixed centered lower baseline preserve proportions. Chapter 3 intentionally retains original transparent padding and apparent size; it must not be enlarged to fill its 128px cell. Low defeat poses remain on the same ground line. Flying Void Shard uses this line as a presentation anchor.

Five action strips were repaired independently: Ash Mochi, Sunseed Sprinter, Hollow Apple Sniper, Acorn Shield Knight and Crown Oven Guard. The full sheets were not regenerated. Repair strips are retained under repairs/. Preview WebPs cycle all 16 poses against a review background; the runtime sheets are transparent.

Runtime: assets/art/monster_batch6. New `_animated` keys are included in stage lazy loading and selected only when available; original sheets remain fallback and bestiary references. Existing stats, movement, collision circles, shot cooldowns, dash timings, reward/pool behavior and boss phase art are preserved. Stage 5 firing selects the release clip; windup uses the original last 180ms of the shot cooldown. Bomber low-HP warning is once per pooled life. Authored death creates one tracked non-physics ghost; new keys skip the old Stage 5 death-image helper.

Validation: actual-method tests cover all seven ordinary roles in Stage 5 and all five Chapter 3 stages, Stage 5 Elite, original scaled combat values/colliders, action priority, freeze/thaw, reset, legacy fallback, one death ghost, lazy loading and packed dimensions/baselines. Full checks and web build pass. Phone visual/performance review is pending.

Remaining: commit 7 (Chapter 2 stages 1–2 and Sporeling), 8 (Nectar and Tiny Grub), 9 (seasons/root), 10 (remaining elites/summons including Chapter 3 generic Elite and Mini Jelly, mobile review).

Packing utility: `python scripts/pack-monster-batch6.py source-map.json --repair-map repair-map.json` (Pillow, NumPy, SciPy). Maps use the stems above as keys and local generated PNG paths as values. Originals stay intact.
