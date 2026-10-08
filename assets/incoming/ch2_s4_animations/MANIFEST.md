# Batch 9 — Four-Season Conservatory

Generated with built-in imagegen. Exact prompts: PROMPTS.json; unmodified images: raw; extraction/scale/frame mapping: PACKING.json. Runtime sheets: assets/art/ch2_seasons. Each PNG/WebP is a 4x4 grid of 256px RGBA cells, fixed baseline 236px and common per-species scale.

Frames 0–5 movement, 6–7 idle, 8–11 action, 12–13 hurt, 14–15 collapse/defeat. Shooter actions divide into preparation 8–9 and firing 10–11; dasher actions divide into windup 8–9 and dash 10–11. All authored facing is right; runtime flips with existing movement. Missing sheets retain original atlas/frame fallback.

Batch 9 is implemented: seven Four-Season Conservatory and seven Root Throne species each have 16 authored movement/idle/action/hurt/death poses (224 total). Runtime lossless-alpha WebP: assets/art/ch2_seasons and assets/art/ch2_root. Raw/packed PNGs, exact prompts, manifest, packing and animated review: assets/incoming/ch2_s4_animations and assets/incoming/ch2_s5_animations. Equinox Colossus Elite shares the existing golem identity while retaining .42 scale and [48,80,80] circle. Four shooters have preparation/fire clips, both dashers have windup/dash and both bombers warn once per life. Existing stats, colliders, aura values (.76 Seasons/.78 Root), five/six-shot siege volleys, objective nodes, boss/miniboss controllers and P1–P5 balance remain. Root identity references use atlas cells 0/1/6/2/3/4/5 in named species order; the old generic fallback retains its original type/frame mapping. Batch 9 regression fixtures capture original combat at v6.55.98. All scoped art orders A–E are delivered; owner mobile visual/FPS and gameplay review remain pending.

| Key | Identity atlas cell |
|---|---|
| c24_budling | 0 |
| c24_sunscarab | 1 |
| c24_leafblade | 2 |
| c24_frostbell | 3 |
| c24_stormfruit | 4 |
| c24_equinox | 5 |
| c24_season_wisp | 6 |
