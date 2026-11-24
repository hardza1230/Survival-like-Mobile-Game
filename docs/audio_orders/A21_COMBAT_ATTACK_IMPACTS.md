# A21 — Hero attack and material-hit variations

สถานะ: ✅ ผูกแล้ว v8.2.85 (สุ่มเสียงใน `Sfx.playFile` · โหลดของฮีโร่ที่เล่นก่อนตอนเข้าด่าน) · รอฟังบนมือถือ · 24 พ.ย. 2026

Owner approved recommendations 1–2: improve hero attack identity and add short impact variations. Source-only delivery, based on deploy `ef18630cb0f8ae3a94ab79a6678ea758179ac293` / v8.2.84. A20 is already integrated on this base. This order does not add new Unique skills, voices, enemies, materials or gameplay rules.

## Scope and existing-source review

Current registry and relevant combat helpers were inspected. Build-specific sound files already exist; many events select one fixed file and apply slight playback-rate variation. This delivery adds independently generated alternatives rather than claiming these attacks are entirely silent. `Sfx.pop()` still references a generic hit, and `Sfx.crit()` has both a base and an accent. `taroSound()` maps Spark to the same chain key. `yuzuSound()` dynamically maps `yz_*`. `sesRuneFireFlares()` has no dedicated release cue in its own body; rune-button sounds remain separate.

Existing reference keys below were verified against actual Git blobs. Technical source inspection does not establish subjective sound quality or owner listening approval.

- `sfx_shoot` → `assets/audio/sfx/event_refresh/shoot.mp3` (9,135 bytes; source exists at base commit).
- `sfx_strawberry_sniper_shot` → `assets/audio/sfx/build_paths/strawberry_sniper_shot.mp3` (7,881 bytes; source exists at base commit).
- `sfx_shotgun` → `assets/audio/sfx/event_refresh/shotgun.mp3` (9,135 bytes; source exists at base commit).
- `sfx_mint_lance_launch` → `assets/audio/sfx/build_paths/mint_lance_launch.mp3` (6,627 bytes; source exists at base commit).
- `sfx_mint_barrage_volley` → `assets/audio/sfx/build_paths/mint_barrage_volley.mp3` (8,508 bytes; source exists at base commit).
- `sfx_cocoa_fire_fist` → `assets/audio/sfx/build_paths/cocoa_fire_fist.mp3` (6,627 bytes; source exists at base commit).
- `sfx_cocoa_fire_finisher` → `assets/audio/sfx/build_paths/cocoa_fire_finisher.mp3` (9,135 bytes; source exists at base commit).
- `sfx_cocoa_rocket_launch` → `assets/audio/sfx/build_paths/cocoa_rocket_launch.mp3` (7,881 bytes; source exists at base commit).
- `sfx_cocoa_titan_slam` → `assets/audio/sfx/build_paths/cocoa_titan_slam.mp3` (9,135 bytes; source exists at base commit).
- `sfx_taro_chain` → `assets/audio/sfx/taro_t6/sfx_taro_chain.mp3` (1,567 bytes; source exists at base commit).
- `sfx_yz_arrow` → `assets/audio/yuzu/sfx_yz_arrow.mp3` (2,552 bytes; source exists at base commit).
- `sfx_yz_bite` → `assets/audio/yuzu/sfx_yz_bite.mp3` (2,239 bytes; source exists at base commit).
- `sfx_yz_orb` → `assets/audio/yuzu/sfx_yz_orb.mp3` (2,866 bytes; source exists at base commit).
- `sfx_hit` → `assets/audio/sfx/event_refresh/hit.mp3` (6,627 bytes; source exists at base commit).
- `sfx_crit` → `assets/audio/sfx/event_refresh/crit.mp3` (9,135 bytes; source exists at base commit).

## Delivery table

All filenames are `sfx_a21_<family>_<variant>.mp3`, with variants numbered from 1. Key equals filename without `.mp3`. These are 45 attack cues (15 families × 3) and 24 impacts (six families × 4), 69 total.

| Family | Files | Maximum per file | Existing reference | Suggested event/search anchor |
|---|---:|---:|---|---|
| `momo_ricochet` | 3 | 0.40s | `sfx_shoot` | castBerry / berrySeed release |
| `momo_sniper` | 3 | 0.60s | `sfx_strawberry_sniper_shot` | releaseBerryCharge actual projectile release |
| `momo_shotgun` | 3 | 0.65s | `sfx_shotgun` | shotgun volley release; one cue per volley |
| `mint_needle` | 3 | 0.40s | `sfx_mint_lance_launch` | castFrostLance / releaseImpalerCharge actual release |
| `mint_shard` | 3 | 0.38s | `sfx_mint_barrage_volley` | ice-shard volley release, once per volley |
| `cocoa_firefist` | 3 | 0.42s | `sfx_cocoa_fire_fist` | cocoaFireFist normal launch |
| `cocoa_finisher` | 3 | 0.62s | `sfx_cocoa_fire_finisher` | cocoaFireFist finisher launch |
| `cocoa_rocket` | 3 | 0.55s | `sfx_cocoa_rocket_launch` | rocket release, once per salvo; not impact |
| `cocoa_titan` | 3 | 0.75s | `sfx_cocoa_titan_slam` | Titan basic landing impact; not takeoff or Unique |
| `taro_arc` | 3 | 0.45s | `sfx_taro_chain` | taroSound(chain) / taroArcBolt actual chain release |
| `taro_spark` | 3 | 0.38s | `sfx_taro_chain` | castTaroSpark / sentry discharge, once per burst |
| `sesame_flare` | 3 | 0.48s | No dedicated release cue | sesRuneFireFlares normal projectile release; no dedicated cue here; do not replace rune taps |
| `lime_arrow` | 3 | 0.40s | `sfx_yz_arrow` | yuzuShot Lime arrow release; companion and quieter minions |
| `pomelo_punch` | 3 | 0.45s | `sfx_yz_bite` | Pomelo accepted punch impact; companion and quieter minions |
| `bloodorange_spell` | 3 | 0.48s | `sfx_yz_orb` | Blood Orange elemental spell release; companion and quieter minions |
| `hit_mochi` | 4 | 0.38s | `sfx_hit` | Accepted impact only |
| `hit_armor` | 4 | 0.42s | `sfx_hit` | Accepted impact only |
| `hit_ice` | 4 | 0.40s | `sfx_hit` | Accepted impact only |
| `hit_plant` | 4 | 0.40s | `sfx_hit` | Accepted impact only |
| `hit_crystal` | 4 | 0.42s | `sfx_hit` | Accepted impact only |
| `critical` | 4 | 0.48s | `sfx_crit` | Accepted impact only |

## Sound and format

- Original ElevenLabs Sound Effects generations only, one independently generated request per variation. Exact prompts, API request parameters, request IDs when available and raw-source SHA-256 are in PROMPTS.json. No generated speech, music, Runway or code-synthesized sound.
- MP3 mono 44.1 kHz 128 kbps, no loop; true peak ≤ −1 dBTP and leading silence < 5 ms. Limits in the table include the MP3 container duration. Short release tails, soft treble and mobile-audible midrange are prompt targets; subjective balance still requires listening.
- Frequent shards, sparks, minion arrows and ordinary impacts have lower target peaks than heavy shots/slams. No blanket loudness boost. Mechanical processing is limited to silence trimming, bounded pitch-preserving duration fitting, short boundary fades, gain and MP3 encoding. No musical notes or impacts were synthesized by code.
- Files in `assets/incoming/audio_combat_a21/`, with MANIFEST.json, PROMPTS.json, one-line-per-file QA_REPORT.json and AUDITION.html. Preserve all existing sources/runtime files.

## Integration handoff — for the code owner only

This is a proposal, not implemented behavior. Recheck the current code before wiring.

1. Use the existing Sfx registry/backend and literal asset URLs after packing to the normal SFX bitrate. Load the active hero's bank with the stage, not at boot. Keep the old cue as fallback; do not preload every variation or introduce a new AudioContext.
2. Choose one variant per accepted event, avoiding an immediate repeat. Replace that event's old cue rather than stacking all variants or playing old and new together. A volley is one launch sound, not one per pellet, shard or fan projectile.
3. Attack sounds occur at actual release. Titan basic slam and Pomelo punch are impact cues, not launch cues: choose them OR the generic material hit on that same contact. Do not play a second material sound over the same punch/slam. Rockets here are launch-only; preserve existing explosion cues separately.
4. Material families are suggested matches for enemies already visually classified as mochi, armored, ice, plant or crystal. Use existing metadata or an explicit reviewed map; if unknown, retain the generic fallback. Do not invent weaknesses, damage bonuses or a new material mechanic.
5. Critical is a self-contained alternative hit cue, not another high-frequency accent. Choose it OR material hit. Suppress the old crit accent at the replaced event so three cues do not stack.
6. Keep regular attack gain and cooldown protections. Suggested starting values, subject to phone listening: attack voice cap 2, global regular impact cap 2, minimum ordinary-impact gap 70–100 ms. Companions quieter than hero; minion release cues substantially quieter and shared-throttled across the minion group, not multiplied by minion count. Boss warnings and speech retain priority.
7. `mint_needle` is for the slim spear release; `mint_shard` is a quiet shard volley, not a global frost replacement. `taro_arc` is the connected zap, `taro_spark` the lighter projectile/discharge. `sesame_flare` is the basic rainbow projectile release, not rune presses or ten spell casts. Keep rune red/fire, green/wind and blue/water cues unchanged.
8. Preserve damage, timings, projectile counts, radii, card logic and all Unique voices/cues. Wiring, tests and release are separate work and were not performed in this delivery.

## ส่งมอบ

- วันที่: 24 พ.ย. 2026 · สาขา `asset-delivery/combat-sfx-a21`
- ส่งครบ **69/69 MP3** · ไฟล์เสียงรวม 496,555 bytes · ไฟล์ที่ขาด: ไม่มี
- QA ผ่าน 69/69: decode/format, duration, true peak, leading silence, non-silent; all 69 SHA-256 values distinct and verified against the actual files
- MANIFEST.json, PROMPTS.json, QA_REPORT.json และ AUDITION.html ครบ · ยังไม่ผูกเข้าเกม/ไม่แก้ game.js/โค้ด/เทส/เวอร์ชัน
- รอฝั่งโค้ดผูก และรอเจ้าของฟังบนมือถือ; no listening approval is implied by mechanical QA
