# Remaining procedural SFX — audit and handoff

ตรวจ 2026-10-11 จาก v6.99.3. “ไฟล์จริง” หมายถึงไฟล์ audio ที่โหลด ไม่ใช่ต้องบันทึกเสียงจากโลกจริง: ไฟล์ synth/jsfxr ที่มีอยู่ก็นับเป็นไฟล์แล้ว

## รายการที่สร้างใหม่ทั้งหมด

| Key | จังหวะ | สถานะเดิม |
|---|---|---|
| sfx_streak_real | คอมโบต่อเนื่อง / Sfx.streak(step) | สร้างด้วยโค้ดล้วน ไม่มี file-backed cue |
| sfx_heartbeat_real | หัวใจเต้น HP ต่ำ / Sfx.heartbeat(intensity) | สร้างด้วยโค้ดล้วน ไม่มี file-backed cue |
| sfx_crit_accent_real | ping เสริมคริติคอล / Sfx.crit() | มีไฟล์เสียงหลัก แต่ชั้นเสริมยังเป็น oscillator/noise |
| sfx_bigkill_accent_real | ชั้นทุ้มและแตกกระจายตอนฆ่าตัวใหญ่ / Sfx.bigKill() | มีไฟล์เสียงหลัก แต่ชั้นเสริมยังเป็น oscillator/noise |

## สิ่งที่มีไฟล์แล้วและมี synth สำรอง / layers

รายการทั้งหมดของ Sfx methods ที่เรียก tone/noise/seq ใน source (ไม่รวม helper เอง): fallback หมายถึงใช้โค้ดเมื่อเล่นไฟล์ไม่ได้ ไม่ใช่เสียงที่ยังไม่มีไฟล์

| Method | สถานะ | File references in method |
|---|---|---|
| shoot | file-backed fallback / dynamic file path | sfx_shoot |
| pop | file-backed fallback / dynamic file path | sfx_hit |
| streak | pure procedural | dynamic key / see code |
| xp | file-backed fallback / dynamic file path | sfx_xp |
| crit | file + unconditional procedural accent | sfx_crit, sfx_hit |
| bigKill | file + unconditional procedural accent | sfx_kill_big, sfx_ult_bomb |
| hurt | file-backed fallback / dynamic file path | sfx_hurt, sfx_hit |
| dash | file-backed fallback / dynamic file path | sfx_dash |
| ult | file-backed fallback / dynamic file path | sfx_ult_vortex, sfx_ult_bomb |
| beatTick | file-backed fallback / dynamic file path | sfx_beat_tick |
| beatStart | file-backed fallback / dynamic file path | sfx_beat_start |
| beatGrade | file-backed fallback / dynamic file path | sfx_beat_ |
| legend | file-backed fallback / dynamic file path | sfx_legend |
| zap | file-backed fallback / dynamic file path | sfx_donut |
| boom | file-backed fallback / dynamic file path | sfx_ult_bomb |
| frost | file-backed fallback / dynamic file path | sfx_frost |
| levelup | file-backed fallback / dynamic file path | sfx_levelup |
| chest | file-backed fallback / dynamic file path | sfx_chest |
| ui | file-backed fallback / dynamic file path | sfx_ui_ |
| craft | file-backed fallback / dynamic file path | sfx_craft_ |
| clear | file-backed fallback / dynamic file path | sfx_levelup |
| victory | file-backed fallback / dynamic file path | sfx_victory |
| chestTick | file-backed fallback / dynamic file path | sfx_chest_tick |
| digHit | file-backed fallback / dynamic file path | sfx_dig_hit |
| digBreak | file-backed fallback / dynamic file path | sfx_dig_break |
| digFind | file-backed fallback / dynamic file path | sfx_dig_find |
| digRare | file-backed fallback / dynamic file path | sfx_dig_rare |
| recipe | file-backed fallback / dynamic file path | sfx_recipe_fire |
| recipeMerge | file-backed fallback / dynamic file path | sfx_recipe_merge |
| digTrap | file-backed fallback / dynamic file path | sfx_dig_trap |
| digDescend | file-backed fallback / dynamic file path | sfx_dig_descend |
| slotSpin | file-backed fallback / dynamic file path | sfx_slot_spin |
| slotMiss | file-backed fallback / dynamic file path | sfx_slot_miss |
| slotNear | file-backed fallback / dynamic file path | sfx_slot_near |
| slotJackpot | file-backed fallback / dynamic file path | sfx_slot_jackpot |
| chestWin | file-backed fallback / dynamic file path | sfx_chest_win |
| bossClear | file-backed fallback / dynamic file path | sfx_boss_clear |
| dead | file-backed fallback / dynamic file path | sfx_defeat |
| heal | file-backed fallback / dynamic file path | sfx_heal |
| heartbeat | pure procedural | dynamic key / see code |

## Registered SFX inventory

162 static registered keys; 0 referenced paths missing in Git tree. Does not count runtime-composed key strings as separate definitions. No listening QC performed.

| Key | Path | File present |
|---|---|---|
| sfx_cocoa_fire_fist | assets/audio/sfx/build_paths/cocoa_fire_fist.mp3 | yes |
| sfx_cocoa_fire_finisher | assets/audio/sfx/build_paths/cocoa_fire_finisher.mp3 | yes |
| sfx_cocoa_fire_explosion | assets/audio/sfx/build_paths/cocoa_fire_explosion.mp3 | yes |
| sfx_cocoa_rocket_launch | assets/audio/sfx/build_paths/cocoa_rocket_launch.mp3 | yes |
| sfx_cocoa_rocket_stick_burst | assets/audio/sfx/build_paths/cocoa_rocket_stick_burst.mp3 | yes |
| sfx_cocoa_meteor_impact | assets/audio/sfx/build_paths/cocoa_meteor_impact.mp3 | yes |
| sfx_cocoa_titan_leap | assets/audio/sfx/build_paths/cocoa_titan_leap.mp3 | yes |
| sfx_cocoa_titan_slam | assets/audio/sfx/build_paths/cocoa_titan_slam.mp3 | yes |
| sfx_uq_mint_bloom_full | assets/audio/sfx/unique_skills/uq_mint_bloom_full.mp3 | yes |
| sfx_uq_mint_gale | assets/audio/sfx/unique_skills/uq_mint_gale.mp3 | yes |
| sfx_uq_mint_lance_release | assets/audio/sfx/unique_skills/uq_mint_lance_release.mp3 | yes |
| sfx_uq_phantom_enter | assets/audio/sfx/unique_skills/uq_phantom_enter.mp3 | yes |
| sfx_uq_phantom_strike | assets/audio/sfx/unique_skills/uq_phantom_strike.mp3 | yes |
| sfx_uq_rebound_burst | assets/audio/sfx/unique_skills/uq_rebound_burst.mp3 | yes |
| sfx_uq_rocket_detonation | assets/audio/sfx/unique_skills/uq_rocket_detonation.mp3 | yes |
| sfx_uq_rocket_salvo | assets/audio/sfx/unique_skills/uq_rocket_salvo.mp3 | yes |
| sfx_uq_sesame_prism_charge | assets/audio/sfx/unique_skills/uq_sesame_prism_charge.mp3 | yes |
| sfx_uq_sesame_prism_volley | assets/audio/sfx/unique_skills/uq_sesame_prism_volley.mp3 | yes |
| sfx_uq_shotgun_blast | assets/audio/sfx/unique_skills/uq_shotgun_blast.mp3 | yes |
| sfx_uq_shotgun_full | assets/audio/sfx/unique_skills/uq_shotgun_full.mp3 | yes |
| sfx_uq_shotgun_pump | assets/audio/sfx/unique_skills/uq_shotgun_pump.mp3 | yes |
| sfx_uq_sniper_bolt | assets/audio/sfx/unique_skills/uq_sniper_bolt.mp3 | yes |
| sfx_uq_sniper_charge | assets/audio/sfx/unique_skills/uq_sniper_charge.mp3 | yes |
| sfx_uq_sniper_fire | assets/audio/sfx/unique_skills/uq_sniper_fire.mp3 | yes |
| sfx_uq_sniper_full | assets/audio/sfx/unique_skills/uq_sniper_full.mp3 | yes |
| sfx_uq_taro_chain_cast | assets/audio/sfx/unique_skills/uq_taro_chain_cast.mp3 | yes |
| sfx_uq_taro_chain_hit | assets/audio/sfx/unique_skills/uq_taro_chain_hit.mp3 | yes |
| sfx_uq_titan_aftershock | assets/audio/sfx/unique_skills/uq_titan_aftershock.mp3 | yes |
| sfx_uq_titan_charge | assets/audio/sfx/unique_skills/uq_titan_charge.mp3 | yes |
| sfx_uq_titan_drop | assets/audio/sfx/unique_skills/uq_titan_drop.mp3 | yes |
| sfx_uq_titan_full | assets/audio/sfx/unique_skills/uq_titan_full.mp3 | yes |
| sfx_uq_titan_slam_full | assets/audio/sfx/unique_skills/uq_titan_slam_full.mp3 | yes |
| sfx_uq_yuzu_crew_hit | assets/audio/sfx/unique_skills/uq_yuzu_crew_hit.mp3 | yes |
| sfx_uq_yuzu_parade | assets/audio/sfx/unique_skills/uq_yuzu_parade.mp3 | yes |
| sfx_cocoa_rage_charge | assets/audio/sfx/build_paths/cocoa_rage_charge.mp3 | yes |
| sfx_cocoa_rage_level | assets/audio/sfx/build_paths/cocoa_rage_level.mp3 | yes |
| sfx_cocoa_colossus_slam | assets/audio/sfx/build_paths/cocoa_colossus_slam.mp3 | yes |
| sfx_cocoa_flicker_step | assets/audio/sfx/build_paths/cocoa_flicker_step.mp3 | yes |
| sfx_cocoa_dash_landing | assets/audio/sfx/build_paths/cocoa_dash_landing.mp3 | yes |
| sfx_cocoa_shadow_fist | assets/audio/sfx/build_paths/cocoa_shadow_fist.mp3 | yes |
| sfx_cocoa_phantom_start | assets/audio/sfx/build_paths/cocoa_phantom_start.mp3 | yes |
| sfx_cocoa_shadow_mark | assets/audio/sfx/build_paths/cocoa_shadow_mark.mp3 | yes |
| sfx_mint_lance_launch | assets/audio/sfx/build_paths/mint_lance_launch.mp3 | yes |
| sfx_mint_barrage_volley | assets/audio/sfx/build_paths/mint_barrage_volley.mp3 | yes |
| sfx_mint_hailstorm_cast | assets/audio/sfx/build_paths/mint_hailstorm_cast.mp3 | yes |
| sfx_mint_impaler_charge | assets/audio/sfx/build_paths/mint_impaler_charge.mp3 | yes |
| sfx_mint_impale_stack | assets/audio/sfx/build_paths/mint_impale_stack.mp3 | yes |
| sfx_mint_crystal_rupture | assets/audio/sfx/build_paths/mint_crystal_rupture.mp3 | yes |
| sfx_mint_glacier_bloom | assets/audio/sfx/build_paths/mint_glacier_bloom.mp3 | yes |
| sfx_mint_glacier_shatter | assets/audio/sfx/build_paths/mint_glacier_shatter.mp3 | yes |
| sfx_strawberry_sniper_charge | assets/audio/sfx/build_paths/strawberry_sniper_charge.mp3 | yes |
| sfx_strawberry_sniper_shot | assets/audio/sfx/build_paths/strawberry_sniper_shot.mp3 | yes |
| sfx_strawberry_sniper_impact | assets/audio/sfx/build_paths/strawberry_sniper_impact.mp3 | yes |
| sfx_strawberry_ricochet_bounce | assets/audio/sfx/build_paths/strawberry_ricochet_bounce.mp3 | yes |
| sfx_strawberry_pinball_cast | assets/audio/sfx/build_paths/strawberry_pinball_cast.mp3 | yes |
| sfx_strawberry_pinball_final | assets/audio/sfx/build_paths/strawberry_pinball_final.mp3 | yes |
| sfx_shared_unique_charge_start | assets/audio/sfx/build_paths/shared_unique_charge_start.mp3 | yes |
| sfx_shared_unique_charge_full | assets/audio/sfx/build_paths/shared_unique_charge_full.mp3 | yes |
| sfx_shared_build_evolution | assets/audio/sfx/build_paths/shared_build_evolution.mp3 | yes |
| sfx_boss_shield_break | assets/audio/sfx/build_paths/boss_shield_break.mp3 | yes |
| sfx_boss_phase_transition | assets/audio/sfx/build_paths/boss_phase_transition.mp3 | yes |
| sfx_shoot | assets/audio/sfx/sfx_skill_sprinkle.wav | yes |
| sfx_hit | assets/audio/sfx/gen/sfx_hit.wav | yes |
| sfx_xp | assets/audio/sfx/gen/sfx_xp.wav | yes |
| sfx_dash | assets/audio/sfx/sfx_jump_squish.wav | yes |
| sfx_levelup | assets/audio/sfx/gen/sfx_levelup_soft.mp3 | yes |
| sfx_chest | assets/audio/sfx/sfx_chest_open.wav | yes |
| sfx_btn | assets/audio/sfx/sfx_btn_click.wav | yes |
| sfx_craft_result_open | assets/audio/sfx/results/result_open.wav | yes |
| sfx_craft_result_count | assets/audio/sfx/results/result_count.wav | yes |
| sfx_craft_result_reveal | assets/audio/sfx/results/result_reveal.wav | yes |
| sfx_craft_result_important | assets/audio/sfx/results/result_important.wav | yes |
| sfx_craft_result_double | assets/audio/sfx/results/result_double.wav | yes |
| sfx_craft_progress_core | assets/audio/sfx/progress/progress_core.wav | yes |
| sfx_craft_progress_talent | assets/audio/sfx/progress/progress_talent.wav | yes |
| sfx_craft_progress_overcap | assets/audio/sfx/progress/progress_overcap.wav | yes |
| sfx_craft_progress_promotion | assets/audio/sfx/progress/progress_promotion.wav | yes |
| sfx_craft_progress_perk | assets/audio/sfx/progress/progress_perk.wav | yes |
| sfx_craft_progress_ancient | assets/audio/sfx/progress/progress_ancient.wav | yes |
| sfx_craft_progress_daily | assets/audio/sfx/progress/progress_daily.wav | yes |
| sfx_craft_progress_achievement | assets/audio/sfx/progress/progress_achievement.wav | yes |
| sfx_craft_progress_quest | assets/audio/sfx/progress/progress_quest.wav | yes |
| sfx_craft_progress_claim | assets/audio/sfx/progress/progress_claim.wav | yes |
| sfx_craft_gear_equip | assets/audio/sfx/gear/gear_equip.wav | yes |
| sfx_craft_gear_lock | assets/audio/sfx/gear/gear_lock.wav | yes |
| sfx_craft_gear_unlock | assets/audio/sfx/gear/gear_unlock.wav | yes |
| sfx_craft_gear_enhance_success | assets/audio/sfx/gear/gear_enhance_success.wav | yes |
| sfx_craft_gear_enhance_break | assets/audio/sfx/gear/gear_enhance_break.wav | yes |
| sfx_craft_gear_enhance_destroy | assets/audio/sfx/gear/gear_enhance_destroy.wav | yes |
| sfx_craft_gear_dismantle | assets/audio/sfx/gear/gear_dismantle.wav | yes |
| sfx_craft_gear_sell | assets/audio/sfx/gear/gear_sell.wav | yes |
| sfx_craft_capacity | assets/audio/sfx/craft/craft_capacity.wav | yes |
| sfx_craft_reroll | assets/audio/sfx/craft/craft_reroll.wav | yes |
| sfx_craft_remove | assets/audio/sfx/craft/craft_remove.wav | yes |
| sfx_craft_reset | assets/audio/sfx/craft/craft_reset.wav | yes |
| sfx_craft_start | assets/audio/sfx/craft/craft_start.wav | yes |
| sfx_craft_tick | assets/audio/sfx/craft/craft_tick.wav | yes |
| sfx_craft_slow | assets/audio/sfx/craft/craft_slow.wav | yes |
| sfx_craft_common | assets/audio/sfx/craft/craft_common.wav | yes |
| sfx_craft_rare | assets/audio/sfx/craft/craft_rare.wav | yes |
| sfx_craft_jackpot | assets/audio/sfx/craft/craft_jackpot.wav | yes |
| sfx_craft_near | assets/audio/sfx/craft/craft_near.wav | yes |
| sfx_craft_cancel | assets/audio/sfx/craft/craft_cancel.wav | yes |
| sfx_craft_exhaust | assets/audio/sfx/craft/craft_exhaust.wav | yes |
| sfx_ui_click | assets/audio/sfx/ui/ui_click.wav | yes |
| sfx_ui_back | assets/audio/sfx/ui/ui_back.wav | yes |
| sfx_ui_confirm | assets/audio/sfx/ui/ui_confirm.wav | yes |
| sfx_ui_error | assets/audio/sfx/ui/ui_error.wav | yes |
| sfx_frost | assets/audio/sfx/sfx_skill_frost.wav | yes |
| sfx_ult_bomb | assets/audio/sfx/sfx_ult_sugarbomb.wav | yes |
| sfx_ult_vortex | assets/audio/sfx_vfx_ult_cocoavortex.wav | yes |
| sfx_donut | assets/audio/sfx_vfx_proj_donut.wav | yes |
| sfx_hazard | assets/audio/sfx_vfx_telegraph_hazard.wav | yes |
| sfx_crit | assets/audio/sfx/gen/sfx_crit.wav | yes |
| sfx_kill_big | assets/audio/sfx/gen/sfx_kill_big.wav | yes |
| sfx_hurt | assets/audio/sfx/gen/sfx_hurt_soft.mp3 | yes |
| sfx_heal | assets/audio/sfx/gen/sfx_heal.wav | yes |
| sfx_magnet | assets/audio/sfx/gen/sfx_magnet.wav | yes |
| sfx_thunder | assets/audio/sfx/gen/sfx_thunder.wav | yes |
| sfx_punch | assets/audio/sfx/gen/sfx_punch.wav | yes |
| sfx_shotgun | assets/audio/sfx/gen/sfx_shotgun.wav | yes |
| sfx_beat_tick | assets/audio/sfx/gen/sfx_beat_tick.wav | yes |
| sfx_beat_loop | assets/audio/sfx/gen/sfx_beat_loop.wav | yes |
| sfx_beat_hold | assets/audio/sfx/gen/sfx_beat_hold.wav | yes |
| sfx_beat_rush | assets/audio/sfx/gen/sfx_beat_rush.wav | yes |
| sfx_beat_gun | assets/audio/sfx/gen/sfx_beat_gun.wav | yes |
| sfx_beat_cyclone | assets/audio/sfx/gen/sfx_beat_cyclone.wav | yes |
| sfx_beat_titan | assets/audio/sfx/gen/sfx_beat_titan.wav | yes |
| sfx_beat_juggle | assets/audio/sfx/gen/sfx_beat_juggle.wav | yes |
| sfx_beat_rainbow | assets/audio/sfx/gen/sfx_beat_rainbow.wav | yes |
| sfx_beat_fever | assets/audio/sfx/gen/sfx_beat_fever.wav | yes |
| sfx_beat_cue | assets/audio/sfx/gen/sfx_beat_cue.wav | yes |
| sfx_beat_start | assets/audio/sfx/gen/sfx_beat_start.wav | yes |
| sfx_beat_perfect | assets/audio/sfx/gen/sfx_beat_perfect.wav | yes |
| sfx_beat_good | assets/audio/sfx/gen/sfx_beat_good.wav | yes |
| sfx_beat_miss | assets/audio/sfx/gen/sfx_beat_miss.wav | yes |
| sfx_punch_jab | assets/audio/sfx/gen/sfx_punch_jab.wav | yes |
| sfx_punch_heavy | assets/audio/sfx/gen/sfx_punch_heavy.wav | yes |
| sfx_punch_frenzy | assets/audio/sfx/gen/sfx_punch_frenzy.wav | yes |
| sfx_beam | assets/audio/sfx/gen/sfx_beam.wav | yes |
| sfx_burn | assets/audio/sfx/gen/sfx_burn.wav | yes |
| sfx_card | assets/audio/sfx/gen/sfx_card.wav | yes |
| sfx_legend | assets/audio/sfx/gen/sfx_legend.wav | yes |
| sfx_victory | assets/audio/sfx/gen/sfx_victory.mp3 | yes |
| sfx_boss_clear | assets/audio/sfx/gen/sfx_boss_clear.mp3 | yes |
| sfx_chest_spin | assets/audio/sfx/gen/sfx_chest_spin.mp3 | yes |
| sfx_chest_tick | assets/audio/sfx/gen/sfx_chest_tick.mp3 | yes |
| sfx_dig_hit | assets/audio/sfx/gen/sfx_dig_hit.mp3 | yes |
| sfx_dig_break | assets/audio/sfx/gen/sfx_dig_break.mp3 | yes |
| sfx_dig_find | assets/audio/sfx/gen/sfx_dig_find.mp3 | yes |
| sfx_recipe_fire | assets/audio/sfx/gen/sfx_recipe_fire.mp3 | yes |
| sfx_recipe_merge | assets/audio/sfx/gen/sfx_recipe_merge.mp3 | yes |
| sfx_dig_rare | assets/audio/sfx/gen/sfx_dig_rare.mp3 | yes |
| sfx_dig_trap | assets/audio/sfx/gen/sfx_dig_trap.mp3 | yes |
| sfx_dig_descend | assets/audio/sfx/gen/sfx_dig_descend.mp3 | yes |
| sfx_slot_spin | assets/audio/sfx/gen/sfx_slot_spin.mp3 | yes |
| sfx_slot_miss | assets/audio/sfx/gen/sfx_slot_miss.mp3 | yes |
| sfx_slot_near | assets/audio/sfx/gen/sfx_slot_near.mp3 | yes |
| sfx_slot_jackpot | assets/audio/sfx/gen/sfx_slot_jackpot.mp3 | yes |
| sfx_chest_win | assets/audio/sfx/gen/sfx_chest_win.mp3 | yes |
| sfx_defeat | assets/audio/sfx/gen/sfx_defeat.wav | yes |
| sfx_boss_warn | assets/audio/sfx/gen/sfx_boss_warn.mp3 | yes |

## Next AI integration

Assets only; runtime NOT integrated by this delivery. Register 4 literal paths from MANIFEST.json in existing ASSET_AUDIO/preload, use Sfx.playFile and current gain/voice limits.

- streak(step): play sfx_streak_real once, bounded playback rate based on step. Replace both unconditional tones only when file playback succeeds, keep oscillator fallback when file unavailable. Avoid repeated stinger overlap; start with ~0.10s cooldown.
- heartbeat(intensity): sfx_heartbeat_real contains ONE lub-DUB pair. Play once per existing _hbAcc interval; never loop it, since low-HP severity already changes timing. It is 0.5s: shorten trailing silence after listening so strongest existing 0.34s interval does not layer. Scale gain softly with severity. Stop pending low-HP voices on death/heal/menu/mute as appropriate.
- crit: existing sfx_crit main hit stays. New sfx_crit_accent_real replaces ONLY unconditional 1480Hz triangle ping. Play softly; trim tail for high hit rates and respect existing .09s throttle. Do not double original tone + new accent.
- bigKill: main sfx_kill_big (and existing ult fallback) stays. New sfx_bigkill_accent_real replaces ONLY unconditional 90Hz tone + debris noise. Preserve BGM duck and .18s gap; no duplicate bass/noise.
- Keep tone/noise/seq fallback helpers: missing/blocked asset should still have fallback. Do not delete synth BGM, which is unrelated backup, or rebuild all existing 101+ file-backed UI/craft/reward sounds.
- Minimum generation duration .5s: original outputs retained, listening/tail trimming and runtime gains still required. No gameplay/balance changes. Version/check/deploy only when runtime integration is done, per CLAUDE.md.
