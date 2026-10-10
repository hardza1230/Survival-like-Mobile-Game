# Build Path SFX — AI integration handoff

สถานะ: สร้างและส่งมอบไฟล์แล้ว 35 MP3; ยังไม่ลงทะเบียน/เรียกใน runtime และยังไม่ผ่าน listening QC. เจ้าของให้ AI อีกตัวผูกเสียงต่อ ห้ามเข้าใจว่า commit นี้ผูกแล้ว

Generated for v6.70.0; delivery based on latest remote 8aaef151fa74c064258051554da751c812f992c8 (v6.72.0). ตรวจชื่อฟังก์ชันใน game.js ล่าสุดอีกครั้ง อย่าใช้เลขบรรทัดเก่า. ไม่เปลี่ยน balance, animation timing, version หรือระบบ consolidation ในงานส่งไฟล์นี้

## สิ่งที่ได้รับ

- assets/audio/sfx/build_paths/: 35 original ElevenLabs v2 MP3
- MANIFEST.json: proposed audio key, path, event, search hint, loop
- GENERATION_REPORT.json: generation results and SHA256
- TECHNICAL_QA.json: all 35 decode and are non-silent; not listening QA
- docs/audio_orders/BUILD_PATH_SFX_PROMPTS.json: prompts; 3 P2 optional jobs NOT generated

## Instructions for the next AI

1. Read AGENTS.md / CLAUDE.md and latest branch first. This delivery adds files only. Keep current game work intact.
2. Register MANIFEST files in the existing audio map and existing Boot audio preload path. Use existing Sfx playback/mute/volume/unlock infrastructure; do not add an independent AudioContext or HTML Audio backend.
3. Add build-specific Sfx helpers and event hooks using the table below. A function hint is a search anchor, not a verified drop-in insertion point. Inspect collision, pool lifecycle and Unique branches before editing.
4. Replace the generic fallback for the selected event rather than playing both. Preserve generic sound for other characters/paths. Do not make these global replacements for frost, shoot, punch, boom or clear.
5. For projectiles trigger launch once on actual release, impact on actual hit/explosion. Do not sound at visual-only VFX creation. Store/reset any per-bullet audio tag when recycling pools.
6. Use one shot per volley (Barrage / gauntlet start), throttle impacts across enemies to roughly 60–100ms and cap voices; tune after mobile listening. Do not play each pellet or shard.
7. Loop keys: cocoa_rage_charge, mint_impaler_charge, strawberry_sniper_charge. At most one charge voice for the active hero. Start at low volume, fade/pitch with charge if useful; stop on release, cancel, dash/hurt interruption, death, scene/menu transition, loadout change, mute and game shutdown. Auto-charge happens often: skip loop if it becomes tiring. No repeated full-volume restart every update.
8. Rage level / Impale stack: one shared file per mechanic, bounded pitch variation by level. Trigger only when stack/threshold actually increases, not per-frame UI refresh.
9. shared_unique_charge_start/full belongs to manual Unique only; full cue once per charge. Avoid overlap with path charge sounds.
10. Boss phase cue once per real phase transition. Shield-break cue only when weak points finish breaking shield; replace Sfx.clear for that event. Keep attack telegraph/bossWarn cues elsewhere.
11. Listen on mobile; trim silence/long tails for frequent hits, balance gains against current softened hurt/level-up. Keep original files as source; do not assume technical QA proves good loudness/loop seams.
12. Bump version/changelog when runtime integration is delivered per repo rules; run required npm check and relevant sound contracts. Owner performs actual playtest; no headless gameplay sims. Confirm Pages on live branch after pushing.

## Mapping

| Proposed key | Event | Search hint | Existing fallback | Loop |
|---|---|---|---|---|
| sfx_cocoa_fire_fist | Fire Fist launch | cocoaFireFist | comboPunch jab | no |
| sfx_cocoa_fire_finisher | Fire finisher launch | cocoaFireFist | comboPunch heavy | no |
| sfx_cocoa_fire_explosion | Fireball / gauntlet explosion | castCocoaUnique | generic explosion | no |
| sfx_cocoa_rocket_launch | Rocket Gauntlet launch | castCocoaUnique | Sfx.shoot | no |
| sfx_cocoa_rocket_stick_burst | Repeated burst on boss | castCocoaUnique | beatFx titan | no |
| sfx_cocoa_meteor_impact | Finisher meteors | cocoaFireFist | no dedicated call in meteor callback | no |
| sfx_cocoa_titan_leap | Titan jump windup | titan / castCocoaUnique | shared movement/punch | no |
| sfx_cocoa_titan_slam | Titan basic landing | Titan basic combat | comboPunch heavy | no |
| sfx_cocoa_rage_charge | Rage charge | titanRage | shared punch / beat cues | yes |
| sfx_cocoa_rage_level | Rage threshold reached | titanRage | comboPunch heavy | no |
| sfx_cocoa_colossus_slam | Colossus Unique landing | castCocoaUnique | beatFx titan | no |
| sfx_cocoa_flicker_step | Flicker / Dash Leap travel | cocoaDashLeap / flicker | Sfx.dash | no |
| sfx_cocoa_dash_landing | Dash Leap landing | cocoaDashLeap / trail finale | comboPunch heavy | no |
| sfx_cocoa_shadow_fist | Evolution shadow fist launch | cocoaEvoDash | no dedicated launch call | no |
| sfx_cocoa_phantom_start | Phantom Rush activation | castCocoaUnique | beatFx rush | no |
| sfx_cocoa_shadow_mark | Shadow Mark increment | castCocoaUnique | comboPunch heavy on landing | no |
| sfx_mint_lance_launch | Ice lance launch | castFrostLance / releaseImpalerCharge | Sfx.frost | no |
| sfx_mint_barrage_volley | Barrage evolved volley start | Barrage volley | Sfx.frost | no |
| sfx_mint_hailstorm_cast | Hailstorm / Diamond Dust start | Diamond Dust / Hailstorm | Sfx.frost | no |
| sfx_mint_impaler_charge | Impaler auto charge | castImpalerLance | no dedicated charge call | yes |
| sfx_mint_impale_stack | Impale stack increment | applyImpale | no dedicated stack call | no |
| sfx_mint_crystal_rupture | Crystal Rupture | applyImpale | mintHeavyImpact shared cue | no |
| sfx_mint_glacier_bloom | Glacier bloom cast | Glacier bloom | Sfx.frost | no |
| sfx_mint_glacier_shatter | Glacier mass shatter | Glacier frozen-target detonation | Sfx.boom | no |
| sfx_strawberry_sniper_charge | Sniper auto charge | cast Berry charge / _berryCharge | no dedicated charge call | yes |
| sfx_strawberry_sniper_shot | Heavy Seed / Heart Railgun release | releaseBerryCharge | shared shoot / beam | no |
| sfx_strawberry_sniper_impact | Sniper impact | Sniper berrySeed impact | shared hit / crit | no |
| sfx_strawberry_ricochet_bounce | Seed bounce | Ricochet berrySeed impact | shared hit | no |
| sfx_strawberry_pinball_cast | Heart Pinball / Rebound activation | Strawberry Rebound | Sfx.shoot | no |
| sfx_strawberry_pinball_final | Last bounce splash | Heart Pinball last impact | shared hit | no |
| sfx_shared_unique_charge_start | Manual Unique charge start | begin Unique charge | beatFx hold | no |
| sfx_shared_unique_charge_full | Manual Unique fully charged | tick Unique charge | beatFx cue | no |
| sfx_shared_build_evolution | Build Evolution confirmed | Build evolution reward | Sfx.clear / levelup | no |
| sfx_boss_shield_break | Boss weak-point shield break | boss weak-point shield broken | Sfx.clear | no |
| sfx_boss_phase_transition | Boss phase transition | boss phase transition | Sfx.bossWarn | no |

## Concrete event routing

- Chocolate brawler: cocoaFireFist launch normal/finisher; bullet explosion for fire explosion; meteor delayed impact callback for meteor; castCocoaUnique brawler actual rocket release and delayed boss stick burst.
- Chocolate titan: takeoff vs landing separate; Rage threshold cue in actual level increment; Colossus impact at delayed hit, not Unique button press.
- Chocolate dashboxer: actual flicker / Dash Leap travel, trail finale landing, cocoaEvoDash shadow fist release, castCocoaUnique dashboxer activation, Shadow Mark increment. Reuse short step/landing in Phantom leaps; no full start sound every leap.
- Mint: castFrostLance and releaseImpalerCharge actual launch; Barrage evolved volley start; Diamond Dust/Hailstorm first cast; castImpalerLance start and releaseImpalerCharge stop; applyImpale stack increase vs rupture branch; Glacier bloom and actual shatter event. Keep ordinary frost for non-target paths.
- Strawberry (momo): _berryCharge start / releaseBerryCharge stop and shot; berrySeed sniper hit; Ricochet successful bounce to next target; last splash once; Rebound/Heart Pinball activation once.
- Existing sfx_shotgun remains: optional replacement was not generated. Existing UI/reward/gear/progression/win/lose audio remains.

## Owner copy/paste request

อ่าน docs/audio_orders/BUILD_PATH_SFX_INTEGRATION.md แล้วผูก 35 เสียงใน assets/audio/sfx/build_paths/ กับเกมล่าสุด ใช้ audio/Sfx เดิม แยกเสียงตาม Build, จัดการ charge loop และเสียงที่เล่นถี่ ห้ามเปลี่ยน balance หรือ consolidation ตรวจ npm check แล้ว push สาขา live ตาม CLAUDE.md
