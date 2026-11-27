/* ---- ไฟล์เสียงจริง (SFX + BGM) ---- */
const ASSET_AUDIO = {
  sfx_a22_twist_roots: 'assets/audio/sfx/a22/sfx_a22_twist_roots.mp3',
  sfx_a22_twist_seeds: 'assets/audio/sfx/a22/sfx_a22_twist_seeds.mp3',
  sfx_a22_twist_fruit: 'assets/audio/sfx/a22/sfx_a22_twist_fruit.mp3',
  sfx_a22_twist_dark: 'assets/audio/sfx/a22/sfx_a22_twist_dark.mp3',
  sfx_a22_twist_shadows: 'assets/audio/sfx/a22/sfx_a22_twist_shadows.mp3',
  sfx_a22_twist_survive: 'assets/audio/sfx/a22/sfx_a22_twist_survive.mp3',
  sfx_a22_seed_pop: 'assets/audio/sfx/a22/sfx_a22_seed_pop.mp3',
  sfx_a22_seed_hatch: 'assets/audio/sfx/a22/sfx_a22_seed_hatch.mp3',
  sfx_a22_fruit_splat: 'assets/audio/sfx/a22/sfx_a22_fruit_splat.mp3',
  sfx_a22_root_burrow: 'assets/audio/sfx/a22/sfx_a22_root_burrow.mp3',
  sfx_a22_root_warn: 'assets/audio/sfx/a22/sfx_a22_root_warn.mp3',
  sfx_a22_root_strike: 'assets/audio/sfx/a22/sfx_a22_root_strike.mp3',
  sfx_a22_anchor_break: 'assets/audio/sfx/a22/sfx_a22_anchor_break.mp3',
  sfx_a22_perfect_dodge: 'assets/audio/sfx/a22/sfx_a22_perfect_dodge.mp3',
  sfx_a22_root_combo: 'assets/audio/sfx/a22/sfx_a22_root_combo.mp3',
  sfx_a22_head_burst: 'assets/audio/sfx/a22/sfx_a22_head_burst.mp3',
  sfx_a22_rift_warn: 'assets/audio/sfx/a22/sfx_a22_rift_warn.mp3',
  sfx_a22_rift_open: 'assets/audio/sfx/a22/sfx_a22_rift_open.mp3',
  sfx_a22_rift_feed: 'assets/audio/sfx/a22/sfx_a22_rift_feed.mp3',
  sfx_a22_rift_close: 'assets/audio/sfx/a22/sfx_a22_rift_close.mp3',

  // v8.1.108 ใบ A12 (assets/incoming/audio_a12): SFX ภารกิจ League / Trial / Forge / Memory / Patrol 36
  sfx_lg_breach_open: 'assets/audio/sfx/a12/lg_breach_open.mp3',
  sfx_lg_breach_collapse: 'assets/audio/sfx/a12/lg_breach_collapse.mp3',
  sfx_lg_splinter_pick: 'assets/audio/sfx/a12/lg_splinter_pick.mp3',
  sfx_lg_breach_chest: 'assets/audio/sfx/a12/lg_breach_chest.mp3',
  sfx_lg_hunger_stone: 'assets/audio/sfx/a12/lg_hunger_stone.mp3',
  sfx_lg_hand_lord: 'assets/audio/sfx/a12/lg_hand_lord.mp3',
  sfx_lg_domain_open: 'assets/audio/sfx/a12/lg_domain_open.mp3',
  sfx_lg_breachlord: 'assets/audio/sfx/a12/lg_breachlord.mp3',
  /* v8.2.24 A16 เสียงประกอบภารกิจ (เล่นผ่าน a12('a16_…') · ไม่มีไฟล์ = เสียงเดิม) */
  sfx_a16_bottle_throw: 'assets/audio/sfx/a16/sfx_a16_bottle_throw.mp3',
  sfx_a16_bottle_shatter: 'assets/audio/sfx/a16/sfx_a16_bottle_shatter.mp3',
  sfx_a16_herald_beam: 'assets/audio/sfx/a16/sfx_a16_herald_beam.mp3',
  sfx_a16_empower: 'assets/audio/sfx/a16/sfx_a16_empower.mp3',
  sfx_a16_heal_pulse: 'assets/audio/sfx/a16/sfx_a16_heal_pulse.mp3',
  sfx_a16_crate_shatter: 'assets/audio/sfx/a16/sfx_a16_crate_shatter.mp3',
  sfx_a16_side_mission: 'assets/audio/sfx/a16/sfx_a16_side_mission.mp3',
  sfx_a18_reroll: 'assets/audio/sfx/a18/sfx_a18_reroll.mp3',
  sfx_a18_golden_wave: 'assets/audio/sfx/a18/sfx_a18_golden_wave.mp3',
  sfx_a18_double_clear: 'assets/audio/sfx/a18/sfx_a18_double_clear.mp3',
  sfx_a18_boss_mission: 'assets/audio/sfx/a18/sfx_a18_boss_mission.mp3',
  sfx_a18_mission_impact: 'assets/audio/sfx/a18/sfx_a18_mission_impact.mp3',
  sfx_a18_curse: 'assets/audio/sfx/a18/sfx_a18_curse.mp3',
  sfx_a18_atlas_star: 'assets/audio/sfx/a18/sfx_a18_atlas_star.mp3',
  sfx_a18_atlas_pick: 'assets/audio/sfx/a18/sfx_a18_atlas_pick.mp3',
  sfx_a18_atlas_remove: 'assets/audio/sfx/a18/sfx_a18_atlas_remove.mp3',
  sfx_a18_jackpot: 'assets/audio/sfx/a18/sfx_a18_jackpot.mp3',
  sfx_a16_time_up: 'assets/audio/sfx/a16/sfx_a16_time_up.mp3',
  sfx_a16_moth_steal: 'assets/audio/sfx/a16/sfx_a16_moth_steal.mp3',
  sfx_a16_sapper_boom: 'assets/audio/sfx/a16/sfx_a16_sapper_boom.mp3',
  sfx_m_mission_start: 'assets/audio/sfx/a17/sfx_m_mission_start.mp3',
  sfx_m_thaw_hit: 'assets/audio/sfx/a17/sfx_m_thaw_hit.mp3',
  sfx_m_mission_clear: 'assets/audio/sfx/a17/sfx_m_mission_clear.mp3',
  sfx_lg_jar_open: 'assets/audio/sfx/a12/lg_jar_open.mp3',
  sfx_lg_statue_wake: 'assets/audio/sfx/a12/lg_statue_wake.mp3',
  sfx_lg_statue_refreeze: 'assets/audio/sfx/a12/lg_statue_refreeze.mp3',
  sfx_lg_herald_horn: 'assets/audio/sfx/a12/lg_herald_horn.mp3',
  sfx_lg_gates_shut: 'assets/audio/sfx/a12/lg_gates_shut.mp3',
  sfx_lg_pot_ritual: 'assets/audio/sfx/a12/lg_pot_ritual.mp3',
  sfx_lg_pot_flavor: 'assets/audio/sfx/a12/lg_pot_flavor.mp3',
  sfx_lg_dish_served: 'assets/audio/sfx/a12/lg_dish_served.mp3',
  sfx_lg_golem_part: 'assets/audio/sfx/a12/lg_golem_part.mp3',
  sfx_lg_golem_bake: 'assets/audio/sfx/a12/lg_golem_bake.mp3',
  sfx_lg_golem_slam: 'assets/audio/sfx/a12/lg_golem_slam.mp3',
  sfx_lg_golem_crumble: 'assets/audio/sfx/a12/lg_golem_crumble.mp3',
  sfx_lg_root_cut: 'assets/audio/sfx/a12/lg_root_cut.mp3',
  sfx_lg_siege_gate: 'assets/audio/sfx/a12/lg_siege_gate.mp3',
  sfx_lg_siege_break: 'assets/audio/sfx/a12/lg_siege_break.mp3',
  sfx_tr_curse_pick: 'assets/audio/sfx/a12/tr_curse_pick.mp3',
  sfx_tr_round_won: 'assets/audio/sfx/a12/tr_round_won.mp3',
  sfx_tr_take: 'assets/audio/sfx/a12/tr_take.mp3',
  sfx_tr_risk: 'assets/audio/sfx/a12/tr_risk.mp3',
  sfx_tr_fail: 'assets/audio/sfx/a12/tr_fail.mp3',
  sfx_ui_forge_row_up: 'assets/audio/sfx/a12/ui_forge_row_up.mp3',
  sfx_ui_forge_ink_move: 'assets/audio/sfx/a12/ui_forge_ink_move.mp3',
  sfx_ui_codex_up: 'assets/audio/sfx/a12/ui_codex_up.mp3',
  sfx_ui_memory_gain: 'assets/audio/sfx/a12/ui_memory_gain.mp3',
  sfx_ui_domain_button: 'assets/audio/sfx/a12/ui_domain_button.mp3',
  sfx_pt_pop: 'assets/audio/sfx/a12/pt_pop.mp3',
  sfx_pt_loot: 'assets/audio/sfx/a12/pt_loot.mp3',
  sfx_pt_ambient_loop: 'assets/audio/sfx/a12/pt_ambient_loop.mp3',
  // v8.1.65 ใบ A11 (assets/incoming/audio_a11): SFX ฉากเงียบ 26 + Sesame เสียงร่ายเวท 10
  sfx_ses_cast_ppp: 'assets/audio/sfx/sesame_a10/ses_cast_ppp.mp3',
  sfx_ses_cast_mmm: 'assets/audio/sfx/sesame_a10/ses_cast_mmm.mp3',
  sfx_ses_cast_bbb: 'assets/audio/sfx/sesame_a10/ses_cast_bbb.mp3',
  sfx_ses_cast_ppm: 'assets/audio/sfx/sesame_a10/ses_cast_ppm.mp3',
  sfx_ses_cast_ppb: 'assets/audio/sfx/sesame_a10/ses_cast_ppb.mp3',
  sfx_ses_cast_pmm: 'assets/audio/sfx/sesame_a10/ses_cast_pmm.mp3',
  sfx_ses_cast_mmb: 'assets/audio/sfx/sesame_a10/ses_cast_mmb.mp3',
  sfx_ses_cast_pbb: 'assets/audio/sfx/sesame_a10/ses_cast_pbb.mp3',
  sfx_ses_cast_mbb: 'assets/audio/sfx/sesame_a10/ses_cast_mbb.mp3',
  sfx_ses_cast_pmb: 'assets/audio/sfx/sesame_a10/ses_cast_pmb.mp3',
  sfx_ui_thread_buy: 'assets/audio/sfx/a11/ui_thread_buy.mp3',
  sfx_ui_thread_first_bonus: 'assets/audio/sfx/a11/ui_thread_first_bonus.mp3',
  sfx_ui_pass_claim: 'assets/audio/sfx/a11/ui_pass_claim.mp3',
  sfx_ui_shop_soon: 'assets/audio/sfx/a11/ui_shop_soon.mp3',
  sfx_ui_wardrobe_open: 'assets/audio/sfx/a11/ui_wardrobe_open.mp3',
  sfx_ui_cos_buy: 'assets/audio/sfx/a11/ui_cos_buy.mp3',
  sfx_ui_cos_equip: 'assets/audio/sfx/a11/ui_cos_equip.mp3',
  sfx_ui_cos_unequip: 'assets/audio/sfx/a11/ui_cos_unequip.mp3',
  sfx_ui_cos_dye: 'assets/audio/sfx/a11/ui_cos_dye.mp3',
  sfx_cos_dash_bubble: 'assets/audio/sfx/a11/cos_dash_bubble.mp3',
  sfx_cos_dash_confetti: 'assets/audio/sfx/a11/cos_dash_confetti.mp3',
  sfx_cos_dash_cream: 'assets/audio/sfx/a11/cos_dash_cream.mp3',
  sfx_ui_rank_open: 'assets/audio/sfx/a11/ui_rank_open.mp3',
  sfx_ui_rank_top3: 'assets/audio/sfx/a11/ui_rank_top3.mp3',
  sfx_ui_name_saved: 'assets/audio/sfx/a11/ui_name_saved.mp3',
  sfx_mission_bonus_get: 'assets/audio/sfx/a11/mission_bonus_get.mp3',
  sfx_mission_loot_burst: 'assets/audio/sfx/a11/mission_loot_burst.mp3',
  sfx_pickup_sugar_piece: 'assets/audio/sfx/a11/pickup_sugar_piece.mp3',
  sfx_pickup_gear_rare: 'assets/audio/sfx/a11/pickup_gear_rare.mp3',
  sfx_ui_codex_open: 'assets/audio/sfx/a11/ui_codex_open.mp3',
  sfx_ui_page_flip: 'assets/audio/sfx/a11/ui_page_flip.mp3',
  sfx_ui_map_open: 'assets/audio/sfx/a11/ui_map_open.mp3',
  sfx_ui_stage_swipe: 'assets/audio/sfx/a11/ui_stage_swipe.mp3',
  sfx_ui_bossrush_open: 'assets/audio/sfx/a11/ui_bossrush_open.mp3',
  sfx_ui_curse_open: 'assets/audio/sfx/a11/ui_curse_open.mp3',
  sfx_ui_pact_claim: 'assets/audio/sfx/a11/ui_pact_claim.mp3',
  // v8.0.91 ใบเสียง A06 (ElevenLabs 28 เสียง)
  sfx_forge_roll_good:'assets/audio/new_features/sfx_forge_roll_good.mp3',
  sfx_forge_roll_bad:'assets/audio/new_features/sfx_forge_roll_bad.mp3',
  sfx_forge_lv_up:'assets/audio/new_features/sfx_forge_lv_up.mp3',
  sfx_forge_remove_paid:'assets/audio/new_features/sfx_forge_remove_paid.mp3',
  sfx_merge_rarity_mythic:'assets/audio/new_features/sfx_merge_rarity_mythic.mp3',
  sfx_merge_rarity_ancient:'assets/audio/new_features/sfx_merge_rarity_ancient.mp3',
  sfx_merge_rarity_divine:'assets/audio/new_features/sfx_merge_rarity_divine.mp3',
  sfx_relic_synergy:'assets/audio/new_features/sfx_relic_synergy.mp3',
  sfx_st_burn:'assets/audio/new_features/sfx_st_burn.mp3',
  sfx_st_chill:'assets/audio/new_features/sfx_st_chill.mp3',
  sfx_st_freeze:'assets/audio/new_features/sfx_st_freeze.mp3',
  sfx_st_shock:'assets/audio/new_features/sfx_st_shock.mp3',
  sfx_st_stun:'assets/audio/new_features/sfx_st_stun.mp3',
  sfx_st_mark:'assets/audio/new_features/sfx_st_mark.mp3',
  sfx_st_sour:'assets/audio/new_features/sfx_st_sour.mp3',
  sfx_st_cleanse:'assets/audio/new_features/sfx_st_cleanse.mp3',
  sfx_st_barrier_break:'assets/audio/new_features/sfx_st_barrier_break.mp3',
  sfx_yz_evolve_f2:'assets/audio/new_features/sfx_yz_evolve_f2.mp3',
  sfx_yz_evolve_f3:'assets/audio/new_features/sfx_yz_evolve_f3.mp3',
  sfx_yz_aftershock:'assets/audio/new_features/sfx_yz_aftershock.mp3',
  sfx_yz_triple_arrow:'assets/audio/new_features/sfx_yz_triple_arrow.mp3',
  sfx_yz_storm_final:'assets/audio/new_features/sfx_yz_storm_final.mp3',
  sfx_taro_deploy:'assets/audio/new_features/sfx_taro_deploy.mp3',
  sfx_taro_extra_sentry:'assets/audio/new_features/sfx_taro_extra_sentry.mp3',
  sfx_login_day30:'assets/audio/new_features/sfx_login_day30.mp3',
  sfx_dig_unlock:'assets/audio/new_features/sfx_dig_unlock.mp3',
  sfx_dig_ancient_locked:'assets/audio/new_features/sfx_dig_ancient_locked.mp3',
  sfx_dig_ancient_open:'assets/audio/new_features/sfx_dig_ancient_open.mp3',
  // Original ElevenLabs SFX: A01–A05, music pending separate access.
  sfx_merge_select:'assets/audio/menu_progress/sfx_merge_select.mp3',
  sfx_merge_fuse:'assets/audio/menu_progress/sfx_merge_fuse.mp3',
  sfx_merge_rarity_rare:'assets/audio/menu_progress/sfx_merge_rarity_rare.mp3',
  sfx_merge_rarity_epic:'assets/audio/menu_progress/sfx_merge_rarity_epic.mp3',
  sfx_merge_rarity_legend:'assets/audio/menu_progress/sfx_merge_rarity_legend.mp3',
  sfx_merge_keep_mod:'assets/audio/menu_progress/sfx_merge_keep_mod.mp3',
  sfx_forge_pick:'assets/audio/menu_progress/sfx_forge_pick.mp3',
  sfx_forge_add:'assets/audio/menu_progress/sfx_forge_add.mp3',
  sfx_forge_swap:'assets/audio/menu_progress/sfx_forge_swap.mp3',
  sfx_forge_star_up:'assets/audio/menu_progress/sfx_forge_star_up.mp3',
  sfx_forge_remove:'assets/audio/menu_progress/sfx_forge_remove.mp3',
  sfx_forge_lucky:'assets/audio/menu_progress/sfx_forge_lucky.mp3',
  sfx_forge_no_points:'assets/audio/menu_progress/sfx_forge_no_points.mp3',
  sfx_login_open:'assets/audio/menu_progress/sfx_login_open.mp3',
  sfx_login_claim:'assets/audio/menu_progress/sfx_login_claim.mp3',
  sfx_login_day7:'assets/audio/menu_progress/sfx_login_day7.mp3',
  sfx_dq_done:'assets/audio/menu_progress/sfx_dq_done.mp3',
  sfx_dq_box_s:'assets/audio/menu_progress/sfx_dq_box_s.mp3',
  sfx_dq_box_m:'assets/audio/menu_progress/sfx_dq_box_m.mp3',
  sfx_dq_box_l:'assets/audio/menu_progress/sfx_dq_box_l.mp3',
  sfx_dq_reroll:'assets/audio/menu_progress/sfx_dq_reroll.mp3',
  sfx_dq_week:'assets/audio/menu_progress/sfx_dq_week.mp3',
  sfx_aw_star:'assets/audio/menu_progress/sfx_aw_star.mp3',
  sfx_aw_title:'assets/audio/menu_progress/sfx_aw_title.mp3',
  sfx_aw_claim_all:'assets/audio/menu_progress/sfx_aw_claim_all.mp3',
  sfx_aw_secret:'assets/audio/menu_progress/sfx_aw_secret.mp3',
  sfx_best_tier:'assets/audio/menu_progress/sfx_best_tier.mp3',
  sfx_best_new:'assets/audio/menu_progress/sfx_best_new.mp3',
  sfx_recipe_complete:'assets/audio/menu_progress/sfx_recipe_complete.mp3',
  sfx_dig_lantern:'assets/audio/menu_progress/sfx_dig_lantern.mp3',
  sfx_miners_collect:'assets/audio/menu_progress/sfx_miners_collect.mp3',
  sfx_rank_pick:'assets/audio/menu_progress/sfx_rank_pick.mp3',
  sfx_power_tick:'assets/audio/menu_progress/sfx_power_tick.mp3',
  sfx_power_up:'assets/audio/menu_progress/sfx_power_up.mp3',
  sfx_stage_star_1:'assets/audio/menu_progress/sfx_stage_star_1.mp3',
  sfx_stage_star_2:'assets/audio/menu_progress/sfx_stage_star_2.mp3',
  sfx_stage_star_3:'assets/audio/menu_progress/sfx_stage_star_3.mp3',
  sfx_feature_unlock:'assets/audio/menu_progress/sfx_feature_unlock.mp3',
  sfx_feature_fly:'assets/audio/menu_progress/sfx_feature_fly.mp3',
  sfx_arena_warn:'assets/audio/battle_events/sfx_arena_warn.mp3',
  sfx_arena_sweep:'assets/audio/battle_events/sfx_arena_sweep.mp3',
  sfx_arena_grid_burn:'assets/audio/battle_events/sfx_arena_grid_burn.mp3',
  sfx_arena_freeze_breath:'assets/audio/battle_events/sfx_arena_freeze_breath.mp3',
  sfx_arena_pillar_crack:'assets/audio/battle_events/sfx_arena_pillar_crack.mp3',
  sfx_arena_pod_shield:'assets/audio/battle_events/sfx_arena_pod_shield.mp3',
  sfx_arena_shield_break:'assets/audio/battle_events/sfx_arena_shield_break.mp3',
  sfx_arena_fog:'assets/audio/battle_events/sfx_arena_fog.mp3',
  sfx_arena_clock_tick:'assets/audio/battle_events/sfx_arena_clock_tick.mp3',
  sfx_arena_ring_close:'assets/audio/battle_events/sfx_arena_ring_close.mp3',
  sfx_arena_scythe:'assets/audio/battle_events/sfx_arena_scythe.mp3',
  sfx_arena_decoy_reveal:'assets/audio/battle_events/sfx_arena_decoy_reveal.mp3',
  sfx_counter_spawn:'assets/audio/battle_events/sfx_counter_spawn.mp3',
  sfx_counter_kick:'assets/audio/battle_events/sfx_counter_kick.mp3',
  sfx_counter_hit:'assets/audio/battle_events/sfx_counter_hit.mp3',
  sfx_counter_fuse:'assets/audio/battle_events/sfx_counter_fuse.mp3',
  sfx_kill_freeze:'assets/audio/battle_events/sfx_kill_freeze.mp3',
  sfx_kill_slowmo:'assets/audio/battle_events/sfx_kill_slowmo.mp3',
  sfx_mission_tube_pop:'assets/audio/battle_events/sfx_mission_tube_pop.mp3',
  sfx_wave_start:'assets/audio/battle_events/sfx_wave_start.mp3',
  sfx_quest_focus:'assets/audio/battle_events/sfx_quest_focus.mp3',
  sfx_poison_tick:'assets/audio/battle_events/sfx_poison_tick.mp3',
  sfx_bleed_tick:'assets/audio/battle_events/sfx_bleed_tick.mp3',
  sfx_out_of_zone:'assets/audio/battle_events/sfx_out_of_zone.mp3',
  sfx_ruby_pop_in:'assets/audio/battle_events/sfx_ruby_pop_in.mp3',
  sfx_ruby_alert:'assets/audio/battle_events/sfx_ruby_alert.mp3',
  sfx_speed_change_x2:'assets/audio/battle_events/sfx_speed_change_x2.mp3',
  sfx_speed_change_x3:'assets/audio/battle_events/sfx_speed_change_x3.mp3',
  sfx_speed_change_x4:'assets/audio/battle_events/sfx_speed_change_x4.mp3',
  sfx_run_trait:'assets/audio/battle_events/sfx_run_trait.mp3',
  sfx_stage_title:'assets/audio/battle_events/sfx_stage_title.mp3',
  sfx_tutorial_great:'assets/audio/battle_events/sfx_tutorial_great.mp3',
  sfx_yz_seed:'assets/audio/yuzu/sfx_yz_seed.mp3',
  sfx_yz_bite:'assets/audio/yuzu/sfx_yz_bite.mp3',
  sfx_yz_pounce:'assets/audio/yuzu/sfx_yz_pounce.mp3',
  sfx_yz_sweep:'assets/audio/yuzu/sfx_yz_sweep.mp3',
  sfx_yz_slam:'assets/audio/yuzu/sfx_yz_slam.mp3',
  sfx_yz_roll:'assets/audio/yuzu/sfx_yz_roll.mp3',
  sfx_yz_rush:'assets/audio/yuzu/sfx_yz_rush.mp3',
  sfx_yz_grow:'assets/audio/yuzu/sfx_yz_grow.mp3',
  sfx_yz_arrow:'assets/audio/yuzu/sfx_yz_arrow.mp3',
  sfx_yz_volley:'assets/audio/yuzu/sfx_yz_volley.mp3',
  sfx_yz_trap:'assets/audio/yuzu/sfx_yz_trap.mp3',
  sfx_yz_orb:'assets/audio/yuzu/sfx_yz_orb.mp3',
  sfx_yz_sweet:'assets/audio/yuzu/sfx_yz_sweet.mp3',
  sfx_yz_sour:'assets/audio/yuzu/sfx_yz_sour.mp3',
  sfx_yz_spicy:'assets/audio/yuzu/sfx_yz_spicy.mp3',
  sfx_yz_down:'assets/audio/yuzu/sfx_yz_down.mp3',
  sfx_yz_revive:'assets/audio/yuzu/sfx_yz_revive.mp3',
  sfx_yz_fortress:'assets/audio/yuzu/sfx_yz_fortress.mp3',
  sfx_yz_rain:'assets/audio/yuzu/sfx_yz_rain.mp3',
  sfx_yz_infusion:'assets/audio/yuzu/sfx_yz_infusion.mp3',
  sfx_pow_crack:'assets/audio/story_music/sfx_pow_crack.mp3',
  sfx_pow_thud:'assets/audio/story_music/sfx_pow_thud.mp3',
  sfx_pow_pop:'assets/audio/story_music/sfx_pow_pop.mp3',
  sfx_pow_shatter:'assets/audio/story_music/sfx_pow_shatter.mp3',
  sfx_pow_krak:'assets/audio/story_music/sfx_pow_krak.mp3',
  sfx_type_tick:'assets/audio/story_music/sfx_type_tick.mp3',
  sfx_story_title:'assets/audio/story_music/sfx_story_title.mp3',
  sfx_book_open:'assets/audio/story_music/sfx_book_open.mp3',
  sfx_stage_victory:'assets/audio/story_music/sfx_stage_victory.mp3',
  sfx_stage_defeat:'assets/audio/story_music/sfx_stage_defeat.mp3',
  sfx_chapter_clear:'assets/audio/story_music/sfx_chapter_clear.mp3',
  // v8.1.147 audio order A14: chest opening (build-up · 4 rarity bursts · confetti · item land · duplicate→Thread)
  sfx_chest_shake_build:'assets/audio/sfx/chest_a14/chest_shake_build.mp3',
  sfx_chest_burst_common:'assets/audio/sfx/chest_a14/chest_burst_common.mp3',
  sfx_chest_burst_rare:'assets/audio/sfx/chest_a14/chest_burst_rare.mp3',
  sfx_chest_burst_epic:'assets/audio/sfx/chest_a14/chest_burst_epic.mp3',
  sfx_chest_burst_legend:'assets/audio/sfx/chest_a14/chest_burst_legend.mp3',
  sfx_chest_confetti:'assets/audio/sfx/chest_a14/chest_confetti.mp3',
  sfx_chest_item_land:'assets/audio/sfx/chest_a14/chest_item_land.mp3',
  sfx_chest_duplicate:'assets/audio/sfx/chest_a14/chest_duplicate.mp3',
  sfx_box_reveal_common:'assets/audio/story_music/sfx_box_reveal_common.mp3',
  sfx_box_reveal_rare:'assets/audio/story_music/sfx_box_reveal_rare.mp3',
  sfx_box_reveal_epic:'assets/audio/story_music/sfx_box_reveal_epic.mp3',
  sfx_box_reveal_legend:'assets/audio/story_music/sfx_box_reveal_legend.mp3',
  vo_ruby_blip_1:'assets/audio/voices/vo_ruby_blip_1.mp3',
  vo_ruby_blip_2:'assets/audio/voices/vo_ruby_blip_2.mp3',
  vo_ruby_blip_3:'assets/audio/voices/vo_ruby_blip_3.mp3',
  vo_ruby_blip_4:'assets/audio/voices/vo_ruby_blip_4.mp3',
  vo_ruby_happy:'assets/audio/voices/vo_ruby_happy.mp3',
  vo_ruby_alert:'assets/audio/voices/vo_ruby_alert.mp3',
  vo_ruby_sad:'assets/audio/voices/vo_ruby_sad.mp3',
  vo_ruby_cheer:'assets/audio/voices/vo_ruby_cheer.mp3',
  vo_momo_greet:'assets/audio/voices/vo_momo_greet.mp3',
  vo_momo_tap:'assets/audio/voices/vo_momo_tap.mp3',
  vo_momo_poke:'assets/audio/voices/vo_momo_poke.mp3',
  vo_mint_greet:'assets/audio/voices/vo_mint_greet.mp3',
  vo_mint_tap:'assets/audio/voices/vo_mint_tap.mp3',
  vo_mint_poke:'assets/audio/voices/vo_mint_poke.mp3',
  vo_cocoa_greet:'assets/audio/voices/vo_cocoa_greet.mp3',
  vo_cocoa_tap:'assets/audio/voices/vo_cocoa_tap.mp3',
  vo_cocoa_poke:'assets/audio/voices/vo_cocoa_poke.mp3',
  vo_taro_greet:'assets/audio/voices/vo_taro_greet.mp3',
  vo_taro_tap:'assets/audio/voices/vo_taro_tap.mp3',
  vo_taro_poke:'assets/audio/voices/vo_taro_poke.mp3',
  vo_yuzu_greet:'assets/audio/voices/vo_yuzu_greet.mp3',
  vo_yuzu_tap:'assets/audio/voices/vo_yuzu_tap.mp3',
  vo_yuzu_poke:'assets/audio/voices/vo_yuzu_poke.mp3',
  vo_boss_c1_blip_1:'assets/audio/voices/vo_boss_c1_blip_1.mp3',
  vo_boss_c1_blip_2:'assets/audio/voices/vo_boss_c1_blip_2.mp3',
  vo_boss_c1_blip_3:'assets/audio/voices/vo_boss_c1_blip_3.mp3',
  vo_boss_c2_blip_1:'assets/audio/voices/vo_boss_c2_blip_1.mp3',
  vo_boss_c2_blip_2:'assets/audio/voices/vo_boss_c2_blip_2.mp3',
  vo_boss_c2_blip_3:'assets/audio/voices/vo_boss_c2_blip_3.mp3',
  vo_boss_c3_blip_1:'assets/audio/voices/vo_boss_c3_blip_1.mp3',
  vo_boss_c3_blip_2:'assets/audio/voices/vo_boss_c3_blip_2.mp3',
  vo_boss_c3_blip_3:'assets/audio/voices/vo_boss_c3_blip_3.mp3',
  vo_boss_defeat:'assets/audio/voices/vo_boss_defeat.mp3',
  sfx_event_capture_charge:'assets/audio/sfx/runtime_polish/capture_charge.mp3',
  sfx_event_capture_complete:'assets/audio/sfx/runtime_polish/capture_complete.mp3',
  sfx_event_mint_ice_charge:'assets/audio/sfx/runtime_polish/mint_ice_charge.mp3',
  sfx_event_slot_spin_power:'assets/audio/sfx/runtime_polish/slot_spin_power.mp3',
  sfx_wheel_clack:'assets/audio/sfx/wheel/wheel_clack.mp3', sfx_wheel_roll:'assets/audio/sfx/wheel/wheel_roll.mp3', sfx_wheel_win:'assets/audio/sfx/wheel/wheel_win.mp3',   // v7.5.1 วงล้อสไตล์คาสิโน (scripts/gen_wheel_sfx.py)
  sfx_event_slot_reward_power:'assets/audio/sfx/runtime_polish/slot_reward_power.mp3',
  // v6.73 Build path SFX (docs/audio_orders/BUILD_PATH_SFX_INTEGRATION.md)
  sfx_cocoa_fire_fist: 'assets/audio/sfx/build_paths/cocoa_fire_fist.mp3',
  sfx_cocoa_fire_finisher: 'assets/audio/sfx/build_paths/cocoa_fire_finisher.mp3',
  sfx_cocoa_fire_explosion: 'assets/audio/sfx/build_paths/cocoa_fire_explosion.mp3',
  sfx_cocoa_rocket_launch: 'assets/audio/sfx/build_paths/cocoa_rocket_launch.mp3',
  sfx_cocoa_rocket_stick_burst: 'assets/audio/sfx/build_paths/cocoa_rocket_stick_burst.mp3',
  sfx_cocoa_meteor_impact: 'assets/audio/sfx/build_paths/cocoa_meteor_impact.mp3',
  sfx_cocoa_titan_leap: 'assets/audio/sfx/build_paths/cocoa_titan_leap.mp3',
  sfx_cocoa_titan_slam: 'assets/audio/sfx/build_paths/cocoa_titan_slam.mp3',
  sfx_uq_mint_bloom_full: 'assets/audio/sfx/unique_skills/uq_mint_bloom_full.mp3',
  sfx_uq_mint_gale: 'assets/audio/sfx/unique_skills/uq_mint_gale.mp3',
  sfx_uq_mint_lance_release: 'assets/audio/sfx/unique_skills/uq_mint_lance_release.mp3',
  sfx_uq_phantom_enter: 'assets/audio/sfx/unique_skills/uq_phantom_enter.mp3',
  sfx_uq_phantom_strike: 'assets/audio/sfx/unique_skills/uq_phantom_strike.mp3',
  sfx_uq_rebound_burst: 'assets/audio/sfx/unique_skills/uq_rebound_burst.mp3',
  sfx_uq_rocket_detonation: 'assets/audio/sfx/unique_skills/uq_rocket_detonation.mp3',
  sfx_uq_rocket_salvo: 'assets/audio/sfx/unique_skills/uq_rocket_salvo.mp3',
  sfx_ses811_tap_p: 'assets/audio/sfx/sesame_invoker811/ses811_tap_p.mp3',
  sfx_ses815_tap_p: 'assets/audio/sfx/sesame_orb815/ses811_tap_p.mp3',
  sfx_ses816_tap_p: 'assets/audio/sfx/sesame_orb816/ses811_tap_p.mp3',
  sfx_ses816_tap_m: 'assets/audio/sfx/sesame_orb816/ses811_tap_m.mp3',
  sfx_ses815_tap_m: 'assets/audio/sfx/sesame_orb815/ses811_tap_m.mp3',
  sfx_ses815_tap_b: 'assets/audio/sfx/sesame_orb815/ses811_tap_b.mp3',
  sfx_ses811_tap_m: 'assets/audio/sfx/sesame_invoker811/ses811_tap_m.mp3',
  sfx_ses811_tap_b: 'assets/audio/sfx/sesame_invoker811/ses811_tap_b.mp3',
  sfx_ses811_recipe: 'assets/audio/sfx/sesame_invoker811/ses811_recipe.mp3',
  sfx_ses811_cast: 'assets/audio/sfx/sesame_invoker811/ses811_cast.mp3',
  sfx_ses811_impact: 'assets/audio/sfx/sesame_invoker811/ses811_impact.mp3',
  sfx_uq_sesame_prism_charge: 'assets/audio/sfx/unique_skills/uq_sesame_prism_charge.mp3',
  sfx_uq_sesame_prism_volley: 'assets/audio/sfx/unique_skills/uq_sesame_prism_volley.mp3',
  sfx_uq_shotgun_blast: 'assets/audio/sfx/unique_skills/uq_shotgun_blast.mp3',
  sfx_uq_shotgun_full: 'assets/audio/sfx/unique_skills/uq_shotgun_full.mp3',
  sfx_uq_shotgun_pump: 'assets/audio/sfx/unique_skills/uq_shotgun_pump.mp3',
  sfx_uq_sniper_bolt: 'assets/audio/sfx/unique_skills/uq_sniper_bolt.mp3',
  sfx_uq_sniper_charge: 'assets/audio/sfx/unique_skills/uq_sniper_charge.mp3',
  sfx_uq_sniper_fire: 'assets/audio/sfx/unique_skills/uq_sniper_fire.mp3',
  sfx_uq_sniper_full: 'assets/audio/sfx/unique_skills/uq_sniper_full.mp3',
  sfx_taro_chain: 'assets/audio/sfx/taro_t6/sfx_taro_chain.mp3',
  sfx_taro_smite: 'assets/audio/sfx/taro_t6/sfx_taro_smite.mp3',
  sfx_taro_nova: 'assets/audio/sfx/taro_t6/sfx_taro_nova.mp3',
  sfx_taro_bomb: 'assets/audio/sfx/taro_t6/sfx_taro_bomb.mp3',
  sfx_taro_ready: 'assets/audio/sfx/taro_t6/sfx_taro_ready.mp3',
  sfx_uq_taro_chain_cast: 'assets/audio/sfx/unique_skills/uq_taro_chain_cast.mp3',
  sfx_uq_taro_chain_hit: 'assets/audio/sfx/unique_skills/uq_taro_chain_hit.mp3',
  sfx_uq_titan_aftershock: 'assets/audio/sfx/unique_skills/uq_titan_aftershock.mp3',
  sfx_uq_titan_charge: 'assets/audio/sfx/unique_skills/uq_titan_charge.mp3',
  sfx_uq_titan_drop: 'assets/audio/sfx/unique_skills/uq_titan_drop.mp3',
  sfx_uq_titan_full: 'assets/audio/sfx/unique_skills/uq_titan_full.mp3',
  sfx_uq_titan_slam_full: 'assets/audio/sfx/unique_skills/uq_titan_slam_full.mp3',
  sfx_uq_yuzu_crew_hit: 'assets/audio/sfx/unique_skills/uq_yuzu_crew_hit.mp3',
  sfx_uq_yuzu_parade: 'assets/audio/sfx/unique_skills/uq_yuzu_parade.mp3',
  sfx_cocoa_rage_charge: 'assets/audio/sfx/build_paths/cocoa_rage_charge.mp3',
  sfx_cocoa_rage_level: 'assets/audio/sfx/build_paths/cocoa_rage_level.mp3',
  sfx_cocoa_colossus_slam: 'assets/audio/sfx/build_paths/cocoa_colossus_slam.mp3',
  sfx_cocoa_flicker_step: 'assets/audio/sfx/build_paths/cocoa_flicker_step.mp3',
  sfx_cocoa_dash_landing: 'assets/audio/sfx/build_paths/cocoa_dash_landing.mp3',
  sfx_cocoa_shadow_fist: 'assets/audio/sfx/build_paths/cocoa_shadow_fist.mp3',
  sfx_cocoa_phantom_start: 'assets/audio/sfx/build_paths/cocoa_phantom_start.mp3',
  sfx_cocoa_shadow_mark: 'assets/audio/sfx/build_paths/cocoa_shadow_mark.mp3',
  sfx_mint_lance_launch: 'assets/audio/sfx/build_paths/mint_lance_launch.mp3',
  sfx_mint_barrage_volley: 'assets/audio/sfx/build_paths/mint_barrage_volley.mp3',
  sfx_mint_hailstorm_cast: 'assets/audio/sfx/build_paths/mint_hailstorm_cast.mp3',
  sfx_mint_impaler_charge: 'assets/audio/sfx/build_paths/mint_impaler_charge.mp3',
  sfx_mint_impale_stack: 'assets/audio/sfx/build_paths/mint_impale_stack.mp3',
  sfx_mint_crystal_rupture: 'assets/audio/sfx/build_paths/mint_crystal_rupture.mp3',
  sfx_mint_glacier_bloom: 'assets/audio/sfx/build_paths/mint_glacier_bloom.mp3',
  sfx_mint_glacier_shatter: 'assets/audio/sfx/build_paths/mint_glacier_shatter.mp3',
  sfx_strawberry_sniper_charge: 'assets/audio/sfx/build_paths/strawberry_sniper_charge.mp3',
  sfx_strawberry_sniper_shot: 'assets/audio/sfx/build_paths/strawberry_sniper_shot.mp3',
  sfx_strawberry_sniper_impact: 'assets/audio/sfx/build_paths/strawberry_sniper_impact.mp3',
  sfx_strawberry_ricochet_bounce: 'assets/audio/sfx/build_paths/strawberry_ricochet_bounce.mp3',
  sfx_strawberry_pinball_cast: 'assets/audio/sfx/build_paths/strawberry_pinball_cast.mp3',
  sfx_strawberry_pinball_final: 'assets/audio/sfx/build_paths/strawberry_pinball_final.mp3',
  sfx_shared_unique_charge_start: 'assets/audio/sfx/build_paths/shared_unique_charge_start.mp3',
  sfx_shared_unique_charge_full: 'assets/audio/sfx/build_paths/shared_unique_charge_full.mp3',
  sfx_shared_build_evolution: 'assets/audio/sfx/build_paths/shared_build_evolution.mp3',
  sfx_boss_shield_break: 'assets/audio/sfx/build_paths/boss_shield_break.mp3',
  sfx_boss_phase_transition: 'assets/audio/sfx/build_paths/boss_phase_transition.mp3',
  sfx_strawberry_soft_shot: 'assets/audio/sfx/strawberry/soft_seed_shot.mp3',
  sfx_shoot:      'assets/audio/sfx/event_refresh/shoot.mp3',
  sfx_hit:        'assets/audio/sfx/event_refresh/hit.mp3',
  sfx_xp:         'assets/audio/sfx/event_refresh/xp.mp3',
  sfx_dash:       'assets/audio/sfx/event_refresh/dash.mp3',
  sfx_levelup:    'assets/audio/sfx/playtest_revision/levelup.mp3',   // v5.19.1 เสียงเดียว (เดิม fanfare ฟังซ้อน)
  sfx_chest:      'assets/audio/sfx/event_refresh/chest.mp3',
  sfx_btn:        'assets/audio/sfx/sfx_btn_click.mp3',
  sfx_craft_result_open:'assets/audio/sfx/event_refresh/craft_result_open.mp3',
  sfx_craft_result_count:'assets/audio/sfx/event_refresh/craft_result_count.mp3',
  sfx_craft_result_reveal:'assets/audio/sfx/event_refresh/craft_result_reveal.mp3',
  sfx_craft_result_important:'assets/audio/sfx/event_refresh/craft_result_important.mp3',
  sfx_craft_result_double:'assets/audio/sfx/event_refresh/craft_result_double.mp3',
  sfx_craft_progress_core:'assets/audio/sfx/temple_short/temple_core_short.mp3',
  sfx_craft_progress_talent:'assets/audio/sfx/playtest_revision/temple_talent.mp3',
  sfx_craft_progress_overcap:'assets/audio/sfx/event_refresh/craft_progress_overcap.mp3',
  sfx_craft_progress_promotion:'assets/audio/sfx/temple_short/temple_weave_short.mp3',
  sfx_craft_progress_perk:'assets/audio/sfx/event_refresh/craft_progress_perk.mp3',
  sfx_craft_progress_ancient:'assets/audio/sfx/event_refresh/craft_progress_ancient.mp3',
  sfx_craft_progress_daily:'assets/audio/sfx/event_refresh/craft_progress_daily.mp3',
  sfx_craft_progress_achievement:'assets/audio/sfx/event_refresh/craft_progress_achievement.mp3',
  sfx_craft_progress_quest:'assets/audio/sfx/event_refresh/craft_progress_quest.mp3',
  sfx_craft_progress_claim:'assets/audio/sfx/event_refresh/craft_progress_claim.mp3',
  sfx_craft_gear_equip:'assets/audio/sfx/event_refresh/craft_gear_equip.mp3',
  sfx_craft_gear_lock:'assets/audio/sfx/event_refresh/craft_gear_lock.mp3',
  sfx_craft_gear_unlock:'assets/audio/sfx/event_refresh/craft_gear_unlock.mp3',
  sfx_craft_gear_enhance_success:'assets/audio/sfx/playtest_revision/enhance_success.mp3',
  sfx_craft_gear_enhance_break:'assets/audio/sfx/playtest_revision/enhance_fail.mp3',
  sfx_craft_gear_enhance_destroy:'assets/audio/sfx/playtest_revision/enhance_destroy.mp3',
  sfx_craft_gear_dismantle:'assets/audio/sfx/event_refresh/craft_gear_dismantle.mp3',
  sfx_craft_gear_sell:'assets/audio/sfx/event_refresh/craft_gear_sell.mp3',
  sfx_craft_capacity:'assets/audio/sfx/event_refresh/craft_capacity.mp3',
  sfx_craft_reroll:'assets/audio/sfx/event_refresh/craft_reroll.mp3',
  sfx_craft_remove:'assets/audio/sfx/event_refresh/craft_remove.mp3',
  sfx_craft_reset:'assets/audio/sfx/event_refresh/craft_reset.mp3',
  sfx_craft_start:'assets/audio/sfx/event_refresh/craft_start.mp3',
  sfx_craft_tick:'assets/audio/sfx/event_refresh/craft_tick.mp3',
  sfx_craft_slow:'assets/audio/sfx/event_refresh/craft_slow.mp3',
  sfx_craft_common:'assets/audio/sfx/event_refresh/craft_common.mp3',
  sfx_craft_rare:'assets/audio/sfx/event_refresh/craft_rare.mp3',
  sfx_craft_jackpot:'assets/audio/sfx/event_refresh/craft_jackpot.mp3',
  sfx_craft_near:'assets/audio/sfx/event_refresh/craft_near.mp3',
  sfx_craft_cancel:'assets/audio/sfx/event_refresh/craft_cancel.mp3',
  sfx_craft_exhaust:'assets/audio/sfx/event_refresh/craft_exhaust.mp3',
  sfx_ui_click:'assets/audio/sfx/event_refresh/ui_click.mp3',
  sfx_ui_back:'assets/audio/sfx/event_refresh/ui_back.mp3',
  sfx_ui_confirm:'assets/audio/sfx/event_refresh/ui_confirm.mp3',
  sfx_ui_error:'assets/audio/sfx/event_refresh/ui_error.mp3',
  sfx_frost:      'assets/audio/sfx/event_refresh/frost.mp3',
  sfx_ult_bomb:   'assets/audio/sfx/event_refresh/ult_bomb.mp3',
  sfx_ult_vortex: 'assets/audio/sfx/event_refresh/ult_vortex.mp3',
  sfx_donut:      'assets/audio/sfx/event_refresh/donut.mp3',
  sfx_hazard:     'assets/audio/sfx/event_refresh/hazard.mp3',
  sfx_crit: 'assets/audio/sfx/event_refresh/crit.mp3',   // v4.99 สร้างด้วย jsfxr (public domain)
  sfx_kill_big: 'assets/audio/sfx/event_refresh/kill_big.mp3',   // v4.99 สร้างด้วย jsfxr (public domain)
  sfx_hurt: 'assets/audio/sfx/event_refresh/hurt.mp3',   // v5.19.1 เสียงนุ่ม (เดิม sfx_hurt.wav แตก)   // v4.99 สร้างด้วย jsfxr (public domain)
  sfx_heal: 'assets/audio/sfx/event_refresh/heal.mp3',   // v4.99 สร้างด้วย jsfxr (public domain)
  sfx_magnet: 'assets/audio/sfx/event_refresh/magnet.mp3',   // v4.99 สร้างด้วย jsfxr (public domain)
  sfx_thunder: 'assets/audio/sfx/event_refresh/thunder.mp3',   // v4.99 สร้างด้วย jsfxr (public domain)
  sfx_punch: 'assets/audio/sfx/event_refresh/punch.mp3',
  sfx_shotgun: 'assets/audio/sfx/event_refresh/shotgun.mp3',
  sfx_beat_tick:'assets/audio/sfx/gen/sfx_beat_tick.ogg', sfx_beat_loop:'assets/audio/sfx/gen/sfx_beat_loop.ogg', sfx_beat_hold:'assets/audio/sfx/gen/sfx_beat_hold.ogg', sfx_beat_rush:'assets/audio/sfx/gen/sfx_beat_rush.ogg', sfx_beat_gun:'assets/audio/sfx/gen/sfx_beat_gun.ogg', sfx_beat_cyclone:'assets/audio/sfx/gen/sfx_beat_cyclone.ogg', sfx_beat_titan:'assets/audio/sfx/gen/sfx_beat_titan.ogg', sfx_beat_juggle:'assets/audio/sfx/gen/sfx_beat_juggle.ogg', sfx_beat_rainbow:'assets/audio/sfx/gen/sfx_beat_rainbow.ogg', sfx_beat_fever:'assets/audio/sfx/gen/sfx_beat_fever.ogg', sfx_beat_cue:'assets/audio/sfx/gen/sfx_beat_cue.ogg', sfx_beat_start:'assets/audio/sfx/gen/sfx_beat_start.ogg', sfx_beat_perfect:'assets/audio/sfx/gen/sfx_beat_perfect.ogg', sfx_beat_good:'assets/audio/sfx/gen/sfx_beat_good.ogg', sfx_beat_miss:'assets/audio/sfx/gen/sfx_beat_miss.ogg',
  sfx_punch_jab:'assets/audio/sfx/event_refresh/punch_jab.mp3', sfx_punch_heavy:'assets/audio/sfx/event_refresh/punch_heavy.mp3', sfx_punch_frenzy:'assets/audio/sfx/event_refresh/punch_frenzy.mp3',   // v5.53 คอมโบโกโก้   // v4.99 สร้างด้วย jsfxr (public domain)
  sfx_beam: 'assets/audio/sfx/event_refresh/beam.mp3',   // v4.99 สร้างด้วย jsfxr (public domain)
  sfx_burn: 'assets/audio/sfx/event_refresh/burn.mp3',   // v4.99 สร้างด้วย jsfxr (public domain)
  sfx_card: 'assets/audio/sfx/event_refresh/card.mp3',   // v4.99 สร้างด้วย jsfxr (public domain)
  sfx_legend: 'assets/audio/sfx/playtest_revision/legend.mp3',   // v4.99 สร้างด้วย jsfxr (public domain)
  sfx_victory: 'assets/audio/sfx/event_refresh/victory.mp3',   // v5.2 แฟนแฟร์ยาว (gen_stingers_synth)
  sfx_boss_clear: 'assets/audio/sfx/event_refresh/boss_clear.mp3',
  sfx_chest_spin: 'assets/audio/sfx/event_refresh/chest_spin.mp3',   // v5.19 เปิดกล่องแบบ VS
  sfx_chest_tick: 'assets/audio/sfx/event_refresh/chest_tick.mp3',
  sfx_dig_hit: 'assets/audio/sfx/playtest_revision/dig_hit.mp3',   // v5.26 Temple Depths
  sfx_dig_break: 'assets/audio/sfx/playtest_revision/dig_break.mp3',
  sfx_dig_find: 'assets/audio/sfx/playtest_revision/dig_find_resource.mp3',
  sfx_recipe_fire: 'assets/audio/sfx/event_refresh/recipe_fire.mp3',
  sfx_recipe_merge: 'assets/audio/sfx/event_refresh/recipe_merge.mp3',
  sfx_dig_rare: 'assets/audio/sfx/playtest_revision/dig_find_rare.mp3',
  sfx_dig_trap: 'assets/audio/sfx/playtest_revision/dig_trap.mp3',
  sfx_dig_descend: 'assets/audio/sfx/playtest_revision/dig_descend.mp3',
  sfx_slot_spin: 'assets/audio/sfx/playtest_revision/slot_spin.mp3',   // v5.45 auto-roll
  sfx_slot_miss: 'assets/audio/sfx/playtest_revision/slot_miss.mp3',
  sfx_slot_near: 'assets/audio/sfx/playtest_revision/slot_near.mp3',
  sfx_slot_jackpot: 'assets/audio/sfx/playtest_revision/slot_jackpot.mp3',
  sfx_chest_win: 'assets/audio/sfx/event_refresh/chest_win.mp3',   // v5.2 ท่อนชนะตอนล้มบอส
  sfx_defeat: 'assets/audio/sfx/event_refresh/defeat.mp3',   // v4.99 สร้างด้วย jsfxr (public domain)
  sfx_boss_warn: 'assets/audio/sfx/event_refresh/boss_warn.mp3',   // v5.1 scripts/gen_stingers_synth.cjs (กลองศึก+ไซเรนทุ้ม)
  bgm_main:       'assets/audio/bgm/menu/bgm_menu_moonlit_rose_lite.mp3',
  bgm_a04_bgm_title:'assets/audio/story_music/bgm_title.mp3',
  bgm_a04_bgm_story_calm:'assets/audio/story_music/bgm_story_calm.mp3',
  bgm_a04_bgm_story_tension:'assets/audio/story_music/bgm_story_tension.mp3',
  bgm_a04_bgm_story_hope:'assets/audio/story_music/bgm_story_hope.mp3',
  bgm_a04_bgm_story_finale:'assets/audio/story_music/bgm_story_finale.mp3',
  bgm_a04_bgm_bazaar:'assets/audio/story_music/bgm_bazaar.mp3',
  bgm_menu_depths:  'assets/audio/bgm/menu/bgm_menu_depths.mp3',   // ห้องขุดใต้วิหาร
  bgm_menu_kitchen: 'assets/audio/bgm/menu/bgm_menu_kitchen.mp3',  // ครัวสูตร
  /* v8.1.139 ขนาดแอป: ลบเพลงสำรองยุคเก่า bgm/min + bgm_ch2/ch3 (สร้างด้วยโค้ด) 11 MB · ทุกด่านมีเพลง ElevenLabs bgm_sNN/bgm_bNN ครบ 15 ด่าน */
  // v5.4+ เพลงประจำด่าน 1 ด่าน 1 เพลง (scripts/gen_stage_bgm.cjs) · ต้องเขียน path เต็ม (build-www คัดลอกเฉพาะ path ที่เห็นในโค้ด)
  bgm_s01: 'assets/audio/bgm/elevenlabs_campaign/c1/bgm_s01.mp3',
  bgm_c11_stage: 'assets/audio/bgm/clockmakers_tea_break.mp3',   // v8.1.142 owner: C1-1 = owner tracks (supplied 2026-09-07) · tutorial keeps bgm_s01
  bgm_c11_boss: 'assets/audio/bgm/gates_of_the_calamity.mp3',
  /* v8.2.25 A17 เพลงภารกิจใหญ่ (bgm_ = โหลดตอนใช้ผ่าน _lateTrack) */
  bgm_m_frozen_still: 'assets/audio/bgm/missions_a17/bgm_m_frozen_still.mp3',
  /* v8.2.34 A19 Temple Expedition */
  bgm_ex_expedition: 'assets/audio/bgm/expedition_a19/bgm_ex_expedition.mp3',
  sfx_a21_momo_ricochet_1: 'assets/audio/sfx/a21/sfx_a21_momo_ricochet_1.mp3',
  sfx_a21_momo_ricochet_2: 'assets/audio/sfx/a21/sfx_a21_momo_ricochet_2.mp3',
  sfx_a21_momo_ricochet_3: 'assets/audio/sfx/a21/sfx_a21_momo_ricochet_3.mp3',
  sfx_a21_momo_sniper_1: 'assets/audio/sfx/a21/sfx_a21_momo_sniper_1.mp3',
  sfx_a21_momo_sniper_2: 'assets/audio/sfx/a21/sfx_a21_momo_sniper_2.mp3',
  sfx_a21_momo_sniper_3: 'assets/audio/sfx/a21/sfx_a21_momo_sniper_3.mp3',
  sfx_a21_momo_shotgun_1: 'assets/audio/sfx/a21/sfx_a21_momo_shotgun_1.mp3',
  sfx_a21_momo_shotgun_2: 'assets/audio/sfx/a21/sfx_a21_momo_shotgun_2.mp3',
  sfx_a21_momo_shotgun_3: 'assets/audio/sfx/a21/sfx_a21_momo_shotgun_3.mp3',
  sfx_a21_mint_needle_1: 'assets/audio/sfx/a21/sfx_a21_mint_needle_1.mp3',
  sfx_a21_mint_needle_2: 'assets/audio/sfx/a21/sfx_a21_mint_needle_2.mp3',
  sfx_a21_mint_needle_3: 'assets/audio/sfx/a21/sfx_a21_mint_needle_3.mp3',
  sfx_a21_mint_shard_1: 'assets/audio/sfx/a21/sfx_a21_mint_shard_1.mp3',
  sfx_a21_mint_shard_2: 'assets/audio/sfx/a21/sfx_a21_mint_shard_2.mp3',
  sfx_a21_mint_shard_3: 'assets/audio/sfx/a21/sfx_a21_mint_shard_3.mp3',
  sfx_a21_cocoa_firefist_1: 'assets/audio/sfx/a21/sfx_a21_cocoa_firefist_1.mp3',
  sfx_a21_cocoa_firefist_2: 'assets/audio/sfx/a21/sfx_a21_cocoa_firefist_2.mp3',
  sfx_a21_cocoa_firefist_3: 'assets/audio/sfx/a21/sfx_a21_cocoa_firefist_3.mp3',
  sfx_a21_cocoa_finisher_1: 'assets/audio/sfx/a21/sfx_a21_cocoa_finisher_1.mp3',
  sfx_a21_cocoa_finisher_2: 'assets/audio/sfx/a21/sfx_a21_cocoa_finisher_2.mp3',
  sfx_a21_cocoa_finisher_3: 'assets/audio/sfx/a21/sfx_a21_cocoa_finisher_3.mp3',
  sfx_a21_cocoa_rocket_1: 'assets/audio/sfx/a21/sfx_a21_cocoa_rocket_1.mp3',
  sfx_a21_cocoa_rocket_2: 'assets/audio/sfx/a21/sfx_a21_cocoa_rocket_2.mp3',
  sfx_a21_cocoa_rocket_3: 'assets/audio/sfx/a21/sfx_a21_cocoa_rocket_3.mp3',
  sfx_a21_cocoa_titan_1: 'assets/audio/sfx/a21/sfx_a21_cocoa_titan_1.mp3',
  sfx_a21_cocoa_titan_2: 'assets/audio/sfx/a21/sfx_a21_cocoa_titan_2.mp3',
  sfx_a21_cocoa_titan_3: 'assets/audio/sfx/a21/sfx_a21_cocoa_titan_3.mp3',
  sfx_a21_taro_arc_1: 'assets/audio/sfx/a21/sfx_a21_taro_arc_1.mp3',
  sfx_a21_taro_arc_2: 'assets/audio/sfx/a21/sfx_a21_taro_arc_2.mp3',
  sfx_a21_taro_arc_3: 'assets/audio/sfx/a21/sfx_a21_taro_arc_3.mp3',
  sfx_a21_taro_spark_1: 'assets/audio/sfx/a21/sfx_a21_taro_spark_1.mp3',
  sfx_a21_taro_spark_2: 'assets/audio/sfx/a21/sfx_a21_taro_spark_2.mp3',
  sfx_a21_taro_spark_3: 'assets/audio/sfx/a21/sfx_a21_taro_spark_3.mp3',
  sfx_a21_sesame_flare_1: 'assets/audio/sfx/a21/sfx_a21_sesame_flare_1.mp3',
  sfx_a21_sesame_flare_2: 'assets/audio/sfx/a21/sfx_a21_sesame_flare_2.mp3',
  sfx_a21_sesame_flare_3: 'assets/audio/sfx/a21/sfx_a21_sesame_flare_3.mp3',
  sfx_a21_lime_arrow_1: 'assets/audio/sfx/a21/sfx_a21_lime_arrow_1.mp3',
  sfx_a21_lime_arrow_2: 'assets/audio/sfx/a21/sfx_a21_lime_arrow_2.mp3',
  sfx_a21_lime_arrow_3: 'assets/audio/sfx/a21/sfx_a21_lime_arrow_3.mp3',
  sfx_a21_pomelo_punch_1: 'assets/audio/sfx/a21/sfx_a21_pomelo_punch_1.mp3',
  sfx_a21_pomelo_punch_2: 'assets/audio/sfx/a21/sfx_a21_pomelo_punch_2.mp3',
  sfx_a21_pomelo_punch_3: 'assets/audio/sfx/a21/sfx_a21_pomelo_punch_3.mp3',
  sfx_a21_bloodorange_spell_1: 'assets/audio/sfx/a21/sfx_a21_bloodorange_spell_1.mp3',
  sfx_a21_bloodorange_spell_2: 'assets/audio/sfx/a21/sfx_a21_bloodorange_spell_2.mp3',
  sfx_a21_bloodorange_spell_3: 'assets/audio/sfx/a21/sfx_a21_bloodorange_spell_3.mp3',
  sfx_a21_hit_mochi_1: 'assets/audio/sfx/a21/sfx_a21_hit_mochi_1.mp3',
  sfx_a21_hit_mochi_2: 'assets/audio/sfx/a21/sfx_a21_hit_mochi_2.mp3',
  sfx_a21_hit_mochi_3: 'assets/audio/sfx/a21/sfx_a21_hit_mochi_3.mp3',
  sfx_a21_hit_mochi_4: 'assets/audio/sfx/a21/sfx_a21_hit_mochi_4.mp3',
  sfx_a21_hit_armor_1: 'assets/audio/sfx/a21/sfx_a21_hit_armor_1.mp3',
  sfx_a21_hit_armor_2: 'assets/audio/sfx/a21/sfx_a21_hit_armor_2.mp3',
  sfx_a21_hit_armor_3: 'assets/audio/sfx/a21/sfx_a21_hit_armor_3.mp3',
  sfx_a21_hit_armor_4: 'assets/audio/sfx/a21/sfx_a21_hit_armor_4.mp3',
  sfx_a21_hit_ice_1: 'assets/audio/sfx/a21/sfx_a21_hit_ice_1.mp3',
  sfx_a21_hit_ice_2: 'assets/audio/sfx/a21/sfx_a21_hit_ice_2.mp3',
  sfx_a21_hit_ice_3: 'assets/audio/sfx/a21/sfx_a21_hit_ice_3.mp3',
  sfx_a21_hit_ice_4: 'assets/audio/sfx/a21/sfx_a21_hit_ice_4.mp3',
  sfx_a21_hit_plant_1: 'assets/audio/sfx/a21/sfx_a21_hit_plant_1.mp3',
  sfx_a21_hit_plant_2: 'assets/audio/sfx/a21/sfx_a21_hit_plant_2.mp3',
  sfx_a21_hit_plant_3: 'assets/audio/sfx/a21/sfx_a21_hit_plant_3.mp3',
  sfx_a21_hit_plant_4: 'assets/audio/sfx/a21/sfx_a21_hit_plant_4.mp3',
  sfx_a21_hit_crystal_1: 'assets/audio/sfx/a21/sfx_a21_hit_crystal_1.mp3',
  sfx_a21_hit_crystal_2: 'assets/audio/sfx/a21/sfx_a21_hit_crystal_2.mp3',
  sfx_a21_hit_crystal_3: 'assets/audio/sfx/a21/sfx_a21_hit_crystal_3.mp3',
  sfx_a21_hit_crystal_4: 'assets/audio/sfx/a21/sfx_a21_hit_crystal_4.mp3',
  sfx_a21_critical_1: 'assets/audio/sfx/a21/sfx_a21_critical_1.mp3',
  sfx_a21_critical_2: 'assets/audio/sfx/a21/sfx_a21_critical_2.mp3',
  sfx_a21_critical_3: 'assets/audio/sfx/a21/sfx_a21_critical_3.mp3',
  sfx_a21_critical_4: 'assets/audio/sfx/a21/sfx_a21_critical_4.mp3',
  sfx_a20_curtain_in: 'assets/audio/sfx/a20/sfx_a20_curtain_in.mp3',
  sfx_a20_steps: 'assets/audio/sfx/a20/sfx_a20_steps.mp3',
  sfx_a20_title_ch1: 'assets/audio/sfx/a20/sfx_a20_title_ch1.mp3',
  sfx_a20_title_ch2: 'assets/audio/sfx/a20/sfx_a20_title_ch2.mp3',
  sfx_a20_title_ch3: 'assets/audio/sfx/a20/sfx_a20_title_ch3.mp3',
  sfx_a20_title_boss: 'assets/audio/sfx/a20/sfx_a20_title_boss.mp3',
  sfx_a20_curtain_out: 'assets/audio/sfx/a20/sfx_a20_curtain_out.mp3',
  bgm_ex_boss: 'assets/audio/bgm/expedition_a19/bgm_ex_boss.mp3',
  sfx_ex_tap_1: 'assets/audio/sfx/a19/sfx_ex_tap_1.mp3',
  sfx_ex_tap_2: 'assets/audio/sfx/a19/sfx_ex_tap_2.mp3',
  sfx_ex_tap_3: 'assets/audio/sfx/a19/sfx_ex_tap_3.mp3',
  sfx_ex_crit: 'assets/audio/sfx/a19/sfx_ex_crit.mp3',
  sfx_ex_foe_pop: 'assets/audio/sfx/a19/sfx_ex_foe_pop.mp3',
  sfx_ex_crumbs: 'assets/audio/sfx/a19/sfx_ex_crumbs.mp3',
  sfx_ex_stage_up: 'assets/audio/sfx/a19/sfx_ex_stage_up.mp3',
  sfx_ex_boss_appear: 'assets/audio/sfx/a19/sfx_ex_boss_appear.mp3',
  sfx_ex_boss_tick: 'assets/audio/sfx/a19/sfx_ex_boss_tick.mp3',
  sfx_ex_boss_down: 'assets/audio/sfx/a19/sfx_ex_boss_down.mp3',
  sfx_ex_boss_fail: 'assets/audio/sfx/a19/sfx_ex_boss_fail.mp3',
  sfx_ex_hire: 'assets/audio/sfx/a19/sfx_ex_hire.mp3',
  sfx_ex_milestone: 'assets/audio/sfx/a19/sfx_ex_milestone.mp3',
  sfx_ex_upgrade: 'assets/audio/sfx/a19/sfx_ex_upgrade.mp3',
  sfx_ex_daily_chest: 'assets/audio/sfx/a19/sfx_ex_daily_chest.mp3',
  sfx_ex_supply: 'assets/audio/sfx/a19/sfx_ex_supply.mp3',
  sfx_ex_welcome_back: 'assets/audio/sfx/a19/sfx_ex_welcome_back.mp3',
  bgm_m_frozen_fight: 'assets/audio/bgm/missions_a17/bgm_m_frozen_fight.mp3',
  bgm_m_breach: 'assets/audio/bgm/missions_a17/bgm_m_breach.mp3',
  bgm_m_ritual: 'assets/audio/bgm/missions_a17/bgm_m_ritual.mp3',
  bgm_m_trial: 'assets/audio/bgm/missions_a17/bgm_m_trial.mp3',
  bgm_m_siege: 'assets/audio/bgm/missions_a17/bgm_m_siege.mp3',
  bgm_m_herald: 'assets/audio/bgm/missions_a17/bgm_m_herald.mp3',
  bgm_m_domain: 'assets/audio/bgm/missions_a17/bgm_m_domain.mp3',
  bgm_c2_boss: 'assets/audio/bgm/skyfall_sprint.mp3',   // v8.1.153 owner: Skyfall Sprint = Chapter 2 boss theme
  bgm_c3_boss: 'assets/audio/bgm/skyfire_pursuit.mp3',   // v8.1.153 owner: Skyfire Pursuit = Chapter 3 boss theme
  bgm_s02: 'assets/audio/bgm/elevenlabs_campaign/c1/bgm_s02.mp3',
  bgm_s03: 'assets/audio/bgm/elevenlabs_campaign/c1/bgm_s03.mp3',
  bgm_s04: 'assets/audio/bgm/elevenlabs_campaign/c1/bgm_s04.mp3',
  bgm_s05: 'assets/audio/bgm/elevenlabs_campaign/c1/bgm_s05.mp3',
  bgm_s06: 'assets/audio/bgm/elevenlabs_campaign/c2/bgm_s06.mp3',
  bgm_s07: 'assets/audio/bgm/elevenlabs_campaign/c2/bgm_s07.mp3',
  bgm_s08: 'assets/audio/bgm/elevenlabs_campaign/c2/bgm_s08.mp3',
  bgm_s09: 'assets/audio/bgm/elevenlabs_campaign/c2/bgm_s09.mp3',
  bgm_s10: 'assets/audio/bgm/elevenlabs_campaign/c2/bgm_s10.mp3',
  bgm_s11: 'assets/audio/bgm/elevenlabs_campaign/c3/bgm_s11.mp3',
  bgm_s12: 'assets/audio/bgm/elevenlabs_campaign/c3/bgm_s12.mp3',
  bgm_s13: 'assets/audio/bgm/elevenlabs_campaign/c3/bgm_s13.mp3',
  bgm_s14: 'assets/audio/bgm/elevenlabs_campaign/c3/bgm_s14.mp3',
  bgm_s15: 'assets/audio/bgm/elevenlabs_campaign/c3/bgm_s15.mp3',
  // v5.8 เพลงสู้มินิบอสประจำด่าน (gen_stage_bgm.cjs MINIS)
  bgm_m01: 'assets/audio/bgm/elevenlabs_campaign/c1/bgm_m01.mp3',
  bgm_m02: 'assets/audio/bgm/elevenlabs_campaign/c1/bgm_m02.mp3',
  bgm_m03: 'assets/audio/bgm/elevenlabs_campaign/c1/bgm_m03.mp3',
  bgm_m04: 'assets/audio/bgm/elevenlabs_campaign/c1/bgm_m04.mp3',
  bgm_m05: 'assets/audio/bgm/elevenlabs_campaign/c1/bgm_m05.mp3',
  bgm_m06: 'assets/audio/bgm/elevenlabs_campaign/c2/bgm_m06.mp3',
  bgm_m07: 'assets/audio/bgm/elevenlabs_campaign/c2/bgm_m07.mp3',
  bgm_m08: 'assets/audio/bgm/elevenlabs_campaign/c2/bgm_m08.mp3',
  bgm_m09: 'assets/audio/bgm/elevenlabs_campaign/c2/bgm_m09.mp3',
  bgm_m10: 'assets/audio/bgm/elevenlabs_campaign/c2/bgm_m10.mp3',
  bgm_m11: 'assets/audio/bgm/elevenlabs_campaign/c3/bgm_m11.mp3',
  bgm_m12: 'assets/audio/bgm/elevenlabs_campaign/c3/bgm_m12.mp3',
  bgm_m13: 'assets/audio/bgm/elevenlabs_campaign/c3/bgm_m13.mp3',
  bgm_m14: 'assets/audio/bgm/elevenlabs_campaign/c3/bgm_m14.mp3',
  bgm_m15: 'assets/audio/bgm/elevenlabs_campaign/c3/bgm_m15.mp3',
  // v6.81 บอสรายด่าน (ElevenLabs campaign)
  bgm_b01: 'assets/audio/bgm/elevenlabs_campaign/c1/bgm_b01.mp3',
  bgm_endgame:      'assets/audio/bgm/bgm_endgame.mp3',        // v5.3 Recipe Maps (แจ๊ซ+ชิปทูน กลางดึก)
  bgm_endgame_boss: 'assets/audio/bgm/bgm_endgame_boss.mp3',   // v5.3 บอส Recipe + Pinnacle
  // v7.1 event SFX refresh (assets/audio/sfx/event_refresh, new event identities)
  sfx_event_ui_panel_open: 'assets/audio/sfx/event_refresh/ui_panel_open.mp3',
  sfx_event_ui_panel_close: 'assets/audio/sfx/event_refresh/ui_panel_close.mp3',
  sfx_event_ui_tab_change: 'assets/audio/sfx/event_refresh/ui_tab_change.mp3',
  sfx_event_ui_toggle_on: 'assets/audio/sfx/event_refresh/ui_toggle_on.mp3',
  sfx_event_ui_toggle_off: 'assets/audio/sfx/event_refresh/ui_toggle_off.mp3',
  sfx_event_ui_compare_open: 'assets/audio/sfx/event_refresh/ui_compare_open.mp3',
  sfx_event_ui_item_focus: 'assets/audio/sfx/event_refresh/ui_item_focus.mp3',
  sfx_event_ui_purchase_success: 'assets/audio/sfx/event_refresh/ui_purchase_success.mp3',
  sfx_event_hero_select: 'assets/audio/sfx/event_refresh/hero_select.mp3',
  sfx_event_hero_unlock: 'assets/audio/sfx/event_refresh/hero_unlock.mp3',
  sfx_event_card_offer_open: 'assets/audio/sfx/playtest_revision/card_offer_open.mp3',
  sfx_event_card_flip: 'assets/audio/sfx/event_refresh/card_flip.mp3',
  sfx_event_card_focus: 'assets/audio/sfx/playtest_revision/card_focus.mp3',
  sfx_event_card_confirm: 'assets/audio/sfx/playtest_revision/card_confirm.mp3',
  sfx_event_card_reroll: 'assets/audio/sfx/event_refresh/card_reroll.mp3',
  sfx_event_build_path_select: 'assets/audio/sfx/event_refresh/build_path_select.mp3',
  sfx_event_infusion_apply: 'assets/audio/sfx/event_refresh/infusion_apply.mp3',
  sfx_event_relic_acquire: 'assets/audio/sfx/event_refresh/relic_acquire.mp3',
  sfx_event_modifier_acquire: 'assets/audio/sfx/event_refresh/modifier_acquire.mp3',
  sfx_event_tradeoff_acquire: 'assets/audio/sfx/event_refresh/tradeoff_acquire.mp3',
  sfx_event_skill_rank_up: 'assets/audio/sfx/event_refresh/skill_rank_up.mp3',
  sfx_event_skill_awaken: 'assets/audio/sfx/event_refresh/skill_awaken.mp3',
  sfx_event_unique_rank_up: 'assets/audio/sfx/event_refresh/unique_rank_up.mp3',
  sfx_event_codex_rank_up: 'assets/audio/sfx/event_refresh/codex_rank_up.mp3',
  sfx_event_growth_summary_level: 'assets/audio/sfx/event_refresh/growth_summary_level.mp3',
  sfx_event_growth_mastery: 'assets/audio/sfx/event_refresh/growth_mastery.mp3',
  sfx_event_wave_start: 'assets/audio/sfx/event_refresh/wave_start.mp3',
  sfx_event_wave_clear: 'assets/audio/sfx/event_refresh/wave_clear.mp3',
  sfx_event_stage_clear: 'assets/audio/sfx/event_refresh/stage_clear.mp3',
  sfx_event_miniboss_arrival: 'assets/audio/sfx/event_refresh/miniboss_arrival.mp3',
  sfx_event_miniboss_defeat: 'assets/audio/sfx/event_refresh/miniboss_defeat.mp3',
  sfx_event_boss_attack_telegraph: 'assets/audio/sfx/event_refresh/boss_attack_telegraph.mp3',
  sfx_event_story_panel_open: 'assets/audio/sfx/event_refresh/story_panel_open.mp3',
  sfx_event_story_advance: 'assets/audio/sfx/event_refresh/story_advance.mp3',
  sfx_event_portal_enter: 'assets/audio/sfx/event_refresh/portal_enter.mp3',
  sfx_event_revive: 'assets/audio/sfx/event_refresh/revive.mp3',
  sfx_event_pickup_sugar: 'assets/audio/sfx/event_refresh/pickup_sugar.mp3',
  sfx_event_pickup_currency: 'assets/audio/sfx/event_refresh/pickup_currency.mp3',
  sfx_event_pickup_gear: 'assets/audio/sfx/event_refresh/pickup_gear.mp3',
  sfx_event_loot_common_reveal: 'assets/audio/sfx/playtest_revision/loot_common_reveal.mp3',
  sfx_event_loot_magic_reveal: 'assets/audio/sfx/playtest_revision/loot_magic_reveal.mp3',
  sfx_event_loot_rare_reveal: 'assets/audio/sfx/playtest_revision/loot_rare_reveal.mp3',
  sfx_event_loot_epic_reveal: 'assets/audio/sfx/playtest_revision/loot_epic_reveal.mp3',
  sfx_event_loot_unique_reveal: 'assets/audio/sfx/playtest_revision/loot_unique_reveal.mp3',
  sfx_event_buff_pickup: 'assets/audio/sfx/event_refresh/buff_pickup.mp3',
  sfx_event_gear_favorite_on: 'assets/audio/sfx/event_refresh/gear_favorite_on.mp3',
  sfx_event_gear_favorite_off: 'assets/audio/sfx/event_refresh/gear_favorite_off.mp3',
  sfx_event_gear_bulk_cleanup: 'assets/audio/sfx/event_refresh/gear_bulk_cleanup.mp3',
  sfx_streak_real: 'assets/audio/sfx/procedural_replacements/sfx_streak_real.mp3',
  sfx_heartbeat_real: 'assets/audio/sfx/procedural_replacements/sfx_heartbeat_real.mp3',
  sfx_crit_accent_real: 'assets/audio/sfx/procedural_replacements/sfx_crit_accent_real.mp3',
  sfx_bigkill_accent_real: 'assets/audio/sfx/procedural_replacements/sfx_bigkill_accent_real.mp3',
  sfx_event_slot_stop: 'assets/audio/sfx/playtest_revision/slot_stop.mp3',
  sfx_event_item_roll_start: 'assets/audio/sfx/playtest_revision/item_roll_start.mp3',
  sfx_event_item_roll_loop: 'assets/audio/sfx/playtest_revision/item_roll_loop.mp3',
  sfx_event_dig_find_item: 'assets/audio/sfx/playtest_revision/dig_find_item.mp3',
  sfx_event_dig_find_currency: 'assets/audio/sfx/playtest_revision/dig_find_currency.mp3',
  sfx_event_poison_apply: 'assets/audio/sfx/playtest_revision/poison_apply.mp3',
  sfx_event_dig_find_thread: 'assets/audio/sfx/playtest_revision/dig_find_thread.mp3',
  sfx_event_dig_find_thread_rare: 'assets/audio/sfx/playtest_revision/dig_find_thread_rare.mp3',
  sfx_event_enhance_start: 'assets/audio/sfx/playtest_revision/enhance_start.mp3',
  sfx_event_dig_find_scroll: 'assets/audio/sfx/playtest_revision/dig_find_scroll.mp3',
  sfx_event_dig_find_part: 'assets/audio/sfx/playtest_revision/dig_find_part.mp3',
  sfx_event_dig_ladder_found: 'assets/audio/sfx/playtest_revision/dig_ladder_found.mp3',
  sfx_event_hunt_threat_start: 'assets/audio/sfx/playtest_revision/hunt_threat_start.mp3',
  sfx_event_hunt_threat_complete: 'assets/audio/sfx/playtest_revision/hunt_threat_complete.mp3',
  sfx_event_hunt_curse_apply: 'assets/audio/sfx/playtest_revision/hunt_curse_apply.mp3',
  sfx_event_wisp_purify_charge: 'assets/audio/sfx/wisp_special/wisp_purify_charge.mp3',
  sfx_event_wisp_purify_complete: 'assets/audio/sfx/wisp_special/wisp_purify_complete.mp3',
  sfx_event_wisp_purify_interrupt: 'assets/audio/sfx/wisp_special/wisp_purify_interrupt.mp3',
  sfx_event_special_card_pickup: 'assets/audio/sfx/wisp_special/special_card_pickup.mp3',
  sfx_event_special_card_offer: 'assets/audio/sfx/wisp_special/special_card_offer.mp3',
  sfx_event_special_card_confirm: 'assets/audio/sfx/wisp_special/special_card_confirm.mp3',
};
// เลือกเพลงตามด่าน: Ch1 (ด่าน 1-5) ใช้เพลงรายด่าน · Ch2 (6-10) / Ch3 (11-15) ใช้เพลงประจำบท ถ้าไฟล์หาย fallback เพลงด่าน 5
let BGM_MODE=null;   // 'endgame' = Recipe Maps / Pinnacle ใช้เพลง endgame แทนเพลงประจำด่าน (ตั้งใน startRun)

// A07: source-authored dialogue is loaded only for the visible line, never at boot.
// A23: stage-selected effects and ambience; voice lines are loaded on demand.
Object.assign(ASSET_AUDIO,{
  sfx_a23_boss_ambience_s05: 'assets/audio/a23/sfx_a23_boss_ambience_s05.mp3',
  sfx_a23_boss_ambience_s10: 'assets/audio/a23/sfx_a23_boss_ambience_s10.mp3',
  sfx_a23_boss_ambience_s15: 'assets/audio/a23/sfx_a23_boss_ambience_s15.mp3',
  sfx_a23_pattern_ambush_warning_1: 'assets/audio/a23/sfx_a23_pattern_ambush_warning_1.mp3',
  sfx_a23_pattern_ambush_warning_2: 'assets/audio/a23/sfx_a23_pattern_ambush_warning_2.mp3',
  sfx_a23_pattern_ambush_arrival_1: 'assets/audio/a23/sfx_a23_pattern_ambush_arrival_1.mp3',
  sfx_a23_pattern_ambush_arrival_2: 'assets/audio/a23/sfx_a23_pattern_ambush_arrival_2.mp3',
  sfx_a23_pattern_ambush_release_1: 'assets/audio/a23/sfx_a23_pattern_ambush_release_1.mp3',
  sfx_a23_pattern_ambush_release_2: 'assets/audio/a23/sfx_a23_pattern_ambush_release_2.mp3',
  sfx_a23_pattern_stampede_warning_1: 'assets/audio/a23/sfx_a23_pattern_stampede_warning_1.mp3',
  sfx_a23_pattern_stampede_warning_2: 'assets/audio/a23/sfx_a23_pattern_stampede_warning_2.mp3',
  sfx_a23_pattern_stampede_arrival_1: 'assets/audio/a23/sfx_a23_pattern_stampede_arrival_1.mp3',
  sfx_a23_pattern_stampede_arrival_2: 'assets/audio/a23/sfx_a23_pattern_stampede_arrival_2.mp3',
  sfx_a23_pattern_stampede_release_1: 'assets/audio/a23/sfx_a23_pattern_stampede_release_1.mp3',
  sfx_a23_pattern_stampede_release_2: 'assets/audio/a23/sfx_a23_pattern_stampede_release_2.mp3',
  sfx_a23_pattern_commander_warning_1: 'assets/audio/a23/sfx_a23_pattern_commander_warning_1.mp3',
  sfx_a23_pattern_commander_warning_2: 'assets/audio/a23/sfx_a23_pattern_commander_warning_2.mp3',
  sfx_a23_pattern_commander_arrival_1: 'assets/audio/a23/sfx_a23_pattern_commander_arrival_1.mp3',
  sfx_a23_pattern_commander_arrival_2: 'assets/audio/a23/sfx_a23_pattern_commander_arrival_2.mp3',
  sfx_a23_pattern_commander_release_1: 'assets/audio/a23/sfx_a23_pattern_commander_release_1.mp3',
  sfx_a23_pattern_commander_release_2: 'assets/audio/a23/sfx_a23_pattern_commander_release_2.mp3',
  sfx_a23_pattern_barrage_warning_1: 'assets/audio/a23/sfx_a23_pattern_barrage_warning_1.mp3',
  sfx_a23_pattern_barrage_warning_2: 'assets/audio/a23/sfx_a23_pattern_barrage_warning_2.mp3',
  sfx_a23_pattern_barrage_arrival_1: 'assets/audio/a23/sfx_a23_pattern_barrage_arrival_1.mp3',
  sfx_a23_pattern_barrage_arrival_2: 'assets/audio/a23/sfx_a23_pattern_barrage_arrival_2.mp3',
  sfx_a23_pattern_barrage_release_1: 'assets/audio/a23/sfx_a23_pattern_barrage_release_1.mp3',
  sfx_a23_pattern_barrage_release_2: 'assets/audio/a23/sfx_a23_pattern_barrage_release_2.mp3',
  sfx_a23_pattern_pincer_warning_1: 'assets/audio/a23/sfx_a23_pattern_pincer_warning_1.mp3',
  sfx_a23_pattern_pincer_warning_2: 'assets/audio/a23/sfx_a23_pattern_pincer_warning_2.mp3',
  sfx_a23_pattern_pincer_arrival_1: 'assets/audio/a23/sfx_a23_pattern_pincer_arrival_1.mp3',
  sfx_a23_pattern_pincer_arrival_2: 'assets/audio/a23/sfx_a23_pattern_pincer_arrival_2.mp3',
  sfx_a23_pattern_pincer_release_1: 'assets/audio/a23/sfx_a23_pattern_pincer_release_1.mp3',
  sfx_a23_pattern_pincer_release_2: 'assets/audio/a23/sfx_a23_pattern_pincer_release_2.mp3',
  sfx_a23_pattern_hunter_pack_warning_1: 'assets/audio/a23/sfx_a23_pattern_hunter_pack_warning_1.mp3',
  sfx_a23_pattern_hunter_pack_warning_2: 'assets/audio/a23/sfx_a23_pattern_hunter_pack_warning_2.mp3',
  sfx_a23_pattern_hunter_pack_arrival_1: 'assets/audio/a23/sfx_a23_pattern_hunter_pack_arrival_1.mp3',
  sfx_a23_pattern_hunter_pack_arrival_2: 'assets/audio/a23/sfx_a23_pattern_hunter_pack_arrival_2.mp3',
  sfx_a23_pattern_hunter_pack_release_1: 'assets/audio/a23/sfx_a23_pattern_hunter_pack_release_1.mp3',
  sfx_a23_pattern_hunter_pack_release_2: 'assets/audio/a23/sfx_a23_pattern_hunter_pack_release_2.mp3',
  sfx_a23_pattern_fortress_warning_1: 'assets/audio/a23/sfx_a23_pattern_fortress_warning_1.mp3',
  sfx_a23_pattern_fortress_warning_2: 'assets/audio/a23/sfx_a23_pattern_fortress_warning_2.mp3',
  sfx_a23_pattern_fortress_arrival_1: 'assets/audio/a23/sfx_a23_pattern_fortress_arrival_1.mp3',
  sfx_a23_pattern_fortress_arrival_2: 'assets/audio/a23/sfx_a23_pattern_fortress_arrival_2.mp3',
  sfx_a23_pattern_fortress_release_1: 'assets/audio/a23/sfx_a23_pattern_fortress_release_1.mp3',
  sfx_a23_pattern_fortress_release_2: 'assets/audio/a23/sfx_a23_pattern_fortress_release_2.mp3',
  sfx_a23_pattern_hazard_shift_warning_1: 'assets/audio/a23/sfx_a23_pattern_hazard_shift_warning_1.mp3',
  sfx_a23_pattern_hazard_shift_warning_2: 'assets/audio/a23/sfx_a23_pattern_hazard_shift_warning_2.mp3',
  sfx_a23_pattern_hazard_shift_arrival_1: 'assets/audio/a23/sfx_a23_pattern_hazard_shift_arrival_1.mp3',
  sfx_a23_pattern_hazard_shift_arrival_2: 'assets/audio/a23/sfx_a23_pattern_hazard_shift_arrival_2.mp3',
  sfx_a23_pattern_hazard_shift_release_1: 'assets/audio/a23/sfx_a23_pattern_hazard_shift_release_1.mp3',
  sfx_a23_pattern_hazard_shift_release_2: 'assets/audio/a23/sfx_a23_pattern_hazard_shift_release_2.mp3',
  sfx_a23_pattern_loot_rush_warning_1: 'assets/audio/a23/sfx_a23_pattern_loot_rush_warning_1.mp3',
  sfx_a23_pattern_loot_rush_warning_2: 'assets/audio/a23/sfx_a23_pattern_loot_rush_warning_2.mp3',
  sfx_a23_pattern_loot_rush_arrival_1: 'assets/audio/a23/sfx_a23_pattern_loot_rush_arrival_1.mp3',
  sfx_a23_pattern_loot_rush_arrival_2: 'assets/audio/a23/sfx_a23_pattern_loot_rush_arrival_2.mp3',
  sfx_a23_pattern_loot_rush_release_1: 'assets/audio/a23/sfx_a23_pattern_loot_rush_release_1.mp3',
  sfx_a23_pattern_loot_rush_release_2: 'assets/audio/a23/sfx_a23_pattern_loot_rush_release_2.mp3',
  sfx_a23_pattern_last_stand_warning_1: 'assets/audio/a23/sfx_a23_pattern_last_stand_warning_1.mp3',
  sfx_a23_pattern_last_stand_warning_2: 'assets/audio/a23/sfx_a23_pattern_last_stand_warning_2.mp3',
  sfx_a23_pattern_last_stand_arrival_1: 'assets/audio/a23/sfx_a23_pattern_last_stand_arrival_1.mp3',
  sfx_a23_pattern_last_stand_arrival_2: 'assets/audio/a23/sfx_a23_pattern_last_stand_arrival_2.mp3',
  sfx_a23_pattern_last_stand_release_1: 'assets/audio/a23/sfx_a23_pattern_last_stand_release_1.mp3',
  sfx_a23_pattern_last_stand_release_2: 'assets/audio/a23/sfx_a23_pattern_last_stand_release_2.mp3',
  sfx_a23_event_breach_open: 'assets/audio/a23/sfx_a23_event_breach_open.mp3',
  sfx_a23_event_breach_progress: 'assets/audio/a23/sfx_a23_event_breach_progress.mp3',
  sfx_a23_event_breach_complete: 'assets/audio/a23/sfx_a23_event_breach_complete.mp3',
  sfx_a23_event_breach_close: 'assets/audio/a23/sfx_a23_event_breach_close.mp3',
  sfx_a23_event_ritual_open: 'assets/audio/a23/sfx_a23_event_ritual_open.mp3',
  sfx_a23_event_ritual_progress: 'assets/audio/a23/sfx_a23_event_ritual_progress.mp3',
  sfx_a23_event_ritual_complete: 'assets/audio/a23/sfx_a23_event_ritual_complete.mp3',
  sfx_a23_event_ritual_close: 'assets/audio/a23/sfx_a23_event_ritual_close.mp3',
  sfx_a23_event_legion_open: 'assets/audio/a23/sfx_a23_event_legion_open.mp3',
  sfx_a23_event_legion_progress: 'assets/audio/a23/sfx_a23_event_legion_progress.mp3',
  sfx_a23_event_legion_complete: 'assets/audio/a23/sfx_a23_event_legion_complete.mp3',
  sfx_a23_event_legion_close: 'assets/audio/a23/sfx_a23_event_legion_close.mp3',
  sfx_a23_event_ultimatum_open: 'assets/audio/a23/sfx_a23_event_ultimatum_open.mp3',
  sfx_a23_event_ultimatum_progress: 'assets/audio/a23/sfx_a23_event_ultimatum_progress.mp3',
  sfx_a23_event_ultimatum_complete: 'assets/audio/a23/sfx_a23_event_ultimatum_complete.mp3',
  sfx_a23_event_ultimatum_close: 'assets/audio/a23/sfx_a23_event_ultimatum_close.mp3',
  sfx_a23_event_frozen_pantry_open: 'assets/audio/a23/sfx_a23_event_frozen_pantry_open.mp3',
  sfx_a23_event_frozen_pantry_progress: 'assets/audio/a23/sfx_a23_event_frozen_pantry_progress.mp3',
  sfx_a23_event_frozen_pantry_complete: 'assets/audio/a23/sfx_a23_event_frozen_pantry_complete.mp3',
  sfx_a23_event_frozen_pantry_close: 'assets/audio/a23/sfx_a23_event_frozen_pantry_close.mp3',
  sfx_a23_event_hunger_herald_open: 'assets/audio/a23/sfx_a23_event_hunger_herald_open.mp3',
  sfx_a23_event_hunger_herald_progress: 'assets/audio/a23/sfx_a23_event_hunger_herald_progress.mp3',
  sfx_a23_event_hunger_herald_complete: 'assets/audio/a23/sfx_a23_event_hunger_herald_complete.mp3',
  sfx_a23_event_hunger_herald_close: 'assets/audio/a23/sfx_a23_event_hunger_herald_close.mp3',
  sfx_a23_event_defend_nectar_open: 'assets/audio/a23/sfx_a23_event_defend_nectar_open.mp3',
  sfx_a23_event_defend_nectar_progress: 'assets/audio/a23/sfx_a23_event_defend_nectar_progress.mp3',
  sfx_a23_event_defend_nectar_complete: 'assets/audio/a23/sfx_a23_event_defend_nectar_complete.mp3',
  sfx_a23_event_defend_nectar_close: 'assets/audio/a23/sfx_a23_event_defend_nectar_close.mp3',
  sfx_a23_event_hunger_crack_open: 'assets/audio/a23/sfx_a23_event_hunger_crack_open.mp3',
  sfx_a23_event_hunger_crack_progress: 'assets/audio/a23/sfx_a23_event_hunger_crack_progress.mp3',
  sfx_a23_event_hunger_crack_complete: 'assets/audio/a23/sfx_a23_event_hunger_crack_complete.mp3',
  sfx_a23_event_hunger_crack_close: 'assets/audio/a23/sfx_a23_event_hunger_crack_close.mp3',
  sfx_a23_ambience_s01_1: 'assets/audio/a23/sfx_a23_ambience_s01_1.mp3',
  sfx_a23_ambience_s02_1: 'assets/audio/a23/sfx_a23_ambience_s02_1.mp3',
  sfx_a23_ambience_s03_1: 'assets/audio/a23/sfx_a23_ambience_s03_1.mp3',
  sfx_a23_ambience_s04_1: 'assets/audio/a23/sfx_a23_ambience_s04_1.mp3',
  sfx_a23_ambience_s05_1: 'assets/audio/a23/sfx_a23_ambience_s05_1.mp3',
  sfx_a23_ambience_s06_1: 'assets/audio/a23/sfx_a23_ambience_s06_1.mp3',
  sfx_a23_ambience_s07_1: 'assets/audio/a23/sfx_a23_ambience_s07_1.mp3',
  sfx_a23_ambience_s08_1: 'assets/audio/a23/sfx_a23_ambience_s08_1.mp3',
  sfx_a23_ambience_s09_1: 'assets/audio/a23/sfx_a23_ambience_s09_1.mp3',
  sfx_a23_ambience_s10_1: 'assets/audio/a23/sfx_a23_ambience_s10_1.mp3',
  sfx_a23_ambience_s11_1: 'assets/audio/a23/sfx_a23_ambience_s11_1.mp3',
  sfx_a23_ambience_s12_1: 'assets/audio/a23/sfx_a23_ambience_s12_1.mp3',
  sfx_a23_ambience_s13_1: 'assets/audio/a23/sfx_a23_ambience_s13_1.mp3',
  sfx_a23_ambience_s14_1: 'assets/audio/a23/sfx_a23_ambience_s14_1.mp3',
  sfx_a23_ambience_s15_1: 'assets/audio/a23/sfx_a23_ambience_s15_1.mp3',
  sfx_a23_monster_insect_spawn_1: 'assets/audio/a23/sfx_a23_monster_insect_spawn_1.mp3',
  sfx_a23_monster_insect_spawn_2: 'assets/audio/a23/sfx_a23_monster_insect_spawn_2.mp3',
  sfx_a23_monster_insect_attack_1: 'assets/audio/a23/sfx_a23_monster_insect_attack_1.mp3',
  sfx_a23_monster_insect_attack_2: 'assets/audio/a23/sfx_a23_monster_insect_attack_2.mp3',
  sfx_a23_monster_insect_hurt_1: 'assets/audio/a23/sfx_a23_monster_insect_hurt_1.mp3',
  sfx_a23_monster_insect_hurt_2: 'assets/audio/a23/sfx_a23_monster_insect_hurt_2.mp3',
  sfx_a23_monster_insect_death_1: 'assets/audio/a23/sfx_a23_monster_insect_death_1.mp3',
  sfx_a23_monster_insect_death_2: 'assets/audio/a23/sfx_a23_monster_insect_death_2.mp3',
  sfx_a23_monster_jelly_spawn_1: 'assets/audio/a23/sfx_a23_monster_jelly_spawn_1.mp3',
  sfx_a23_monster_jelly_spawn_2: 'assets/audio/a23/sfx_a23_monster_jelly_spawn_2.mp3',
  sfx_a23_monster_jelly_attack_1: 'assets/audio/a23/sfx_a23_monster_jelly_attack_1.mp3',
  sfx_a23_monster_jelly_attack_2: 'assets/audio/a23/sfx_a23_monster_jelly_attack_2.mp3',
  sfx_a23_monster_jelly_hurt_1: 'assets/audio/a23/sfx_a23_monster_jelly_hurt_1.mp3',
  sfx_a23_monster_jelly_hurt_2: 'assets/audio/a23/sfx_a23_monster_jelly_hurt_2.mp3',
  sfx_a23_monster_jelly_death_1: 'assets/audio/a23/sfx_a23_monster_jelly_death_1.mp3',
  sfx_a23_monster_jelly_death_2: 'assets/audio/a23/sfx_a23_monster_jelly_death_2.mp3',
  sfx_a23_monster_ember_spawn_1: 'assets/audio/a23/sfx_a23_monster_ember_spawn_1.mp3',
  sfx_a23_monster_ember_spawn_2: 'assets/audio/a23/sfx_a23_monster_ember_spawn_2.mp3',
  sfx_a23_monster_ember_attack_1: 'assets/audio/a23/sfx_a23_monster_ember_attack_1.mp3',
  sfx_a23_monster_ember_attack_2: 'assets/audio/a23/sfx_a23_monster_ember_attack_2.mp3',
  sfx_a23_monster_ember_hurt_1: 'assets/audio/a23/sfx_a23_monster_ember_hurt_1.mp3',
  sfx_a23_monster_ember_hurt_2: 'assets/audio/a23/sfx_a23_monster_ember_hurt_2.mp3',
  sfx_a23_monster_ember_death_1: 'assets/audio/a23/sfx_a23_monster_ember_death_1.mp3',
  sfx_a23_monster_ember_death_2: 'assets/audio/a23/sfx_a23_monster_ember_death_2.mp3',
  sfx_a23_monster_ice_spawn_1: 'assets/audio/a23/sfx_a23_monster_ice_spawn_1.mp3',
  sfx_a23_monster_ice_spawn_2: 'assets/audio/a23/sfx_a23_monster_ice_spawn_2.mp3',
  sfx_a23_monster_ice_attack_1: 'assets/audio/a23/sfx_a23_monster_ice_attack_1.mp3',
  sfx_a23_monster_ice_attack_2: 'assets/audio/a23/sfx_a23_monster_ice_attack_2.mp3',
  sfx_a23_monster_ice_hurt_1: 'assets/audio/a23/sfx_a23_monster_ice_hurt_1.mp3',
  sfx_a23_monster_ice_hurt_2: 'assets/audio/a23/sfx_a23_monster_ice_hurt_2.mp3',
  sfx_a23_monster_ice_death_1: 'assets/audio/a23/sfx_a23_monster_ice_death_1.mp3',
  sfx_a23_monster_ice_death_2: 'assets/audio/a23/sfx_a23_monster_ice_death_2.mp3',
  sfx_a23_monster_plant_spawn_1: 'assets/audio/a23/sfx_a23_monster_plant_spawn_1.mp3',
  sfx_a23_monster_plant_spawn_2: 'assets/audio/a23/sfx_a23_monster_plant_spawn_2.mp3',
  sfx_a23_monster_plant_attack_1: 'assets/audio/a23/sfx_a23_monster_plant_attack_1.mp3',
  sfx_a23_monster_plant_attack_2: 'assets/audio/a23/sfx_a23_monster_plant_attack_2.mp3',
  sfx_a23_monster_plant_hurt_1: 'assets/audio/a23/sfx_a23_monster_plant_hurt_1.mp3',
  sfx_a23_monster_plant_hurt_2: 'assets/audio/a23/sfx_a23_monster_plant_hurt_2.mp3',
  sfx_a23_monster_plant_death_1: 'assets/audio/a23/sfx_a23_monster_plant_death_1.mp3',
  sfx_a23_monster_plant_death_2: 'assets/audio/a23/sfx_a23_monster_plant_death_2.mp3',
  sfx_a23_monster_stone_spawn_1: 'assets/audio/a23/sfx_a23_monster_stone_spawn_1.mp3',
  sfx_a23_monster_stone_spawn_2: 'assets/audio/a23/sfx_a23_monster_stone_spawn_2.mp3',
  sfx_a23_monster_stone_attack_1: 'assets/audio/a23/sfx_a23_monster_stone_attack_1.mp3',
  sfx_a23_monster_stone_attack_2: 'assets/audio/a23/sfx_a23_monster_stone_attack_2.mp3',
  sfx_a23_monster_stone_hurt_1: 'assets/audio/a23/sfx_a23_monster_stone_hurt_1.mp3',
  sfx_a23_monster_stone_hurt_2: 'assets/audio/a23/sfx_a23_monster_stone_hurt_2.mp3',
  sfx_a23_monster_stone_death_1: 'assets/audio/a23/sfx_a23_monster_stone_death_1.mp3',
  sfx_a23_monster_stone_death_2: 'assets/audio/a23/sfx_a23_monster_stone_death_2.mp3',
  sfx_a23_monster_crystal_spawn_1: 'assets/audio/a23/sfx_a23_monster_crystal_spawn_1.mp3',
  sfx_a23_monster_crystal_spawn_2: 'assets/audio/a23/sfx_a23_monster_crystal_spawn_2.mp3',
  sfx_a23_monster_crystal_attack_1: 'assets/audio/a23/sfx_a23_monster_crystal_attack_1.mp3',
  sfx_a23_monster_crystal_attack_2: 'assets/audio/a23/sfx_a23_monster_crystal_attack_2.mp3',
  sfx_a23_monster_crystal_hurt_1: 'assets/audio/a23/sfx_a23_monster_crystal_hurt_1.mp3',
  sfx_a23_monster_crystal_hurt_2: 'assets/audio/a23/sfx_a23_monster_crystal_hurt_2.mp3',
  sfx_a23_monster_crystal_death_1: 'assets/audio/a23/sfx_a23_monster_crystal_death_1.mp3',
  sfx_a23_monster_crystal_death_2: 'assets/audio/a23/sfx_a23_monster_crystal_death_2.mp3',
  sfx_a23_monster_shadow_spawn_1: 'assets/audio/a23/sfx_a23_monster_shadow_spawn_1.mp3',
  sfx_a23_monster_shadow_spawn_2: 'assets/audio/a23/sfx_a23_monster_shadow_spawn_2.mp3',
  sfx_a23_monster_shadow_attack_1: 'assets/audio/a23/sfx_a23_monster_shadow_attack_1.mp3',
  sfx_a23_monster_shadow_attack_2: 'assets/audio/a23/sfx_a23_monster_shadow_attack_2.mp3',
  sfx_a23_monster_shadow_hurt_1: 'assets/audio/a23/sfx_a23_monster_shadow_hurt_1.mp3',
  sfx_a23_monster_shadow_hurt_2: 'assets/audio/a23/sfx_a23_monster_shadow_hurt_2.mp3',
  sfx_a23_monster_shadow_death_1: 'assets/audio/a23/sfx_a23_monster_shadow_death_1.mp3',
  sfx_a23_monster_shadow_death_2: 'assets/audio/a23/sfx_a23_monster_shadow_death_2.mp3',
});
const A23_VOICES={"vo_a23_ruby_reaction_1":{"url":"assets/audio/a23/vo_a23_ruby_reaction_1.mp3","text":"They’re coming from both sides!","role":"ruby","duration":1758},"vo_a23_ruby_reaction_2":{"url":"assets/audio/a23/vo_a23_ruby_reaction_2.mp3","text":"Keep a path open!","role":"ruby","duration":980},"vo_a23_ruby_reaction_3":{"url":"assets/audio/a23/vo_a23_ruby_reaction_3.mp3","text":"Something’s waking up nearby!","role":"ruby","duration":1707},"vo_a23_ruby_reaction_4":{"url":"assets/audio/a23/vo_a23_ruby_reaction_4.mp3","text":"That’s it — keep going!","role":"ruby","duration":1277},"vo_a23_ruby_reaction_5":{"url":"assets/audio/a23/vo_a23_ruby_reaction_5.mp3","text":"All clear! Take a breath.","role":"ruby","duration":1950},"vo_a23_ruby_reaction_6":{"url":"assets/audio/a23/vo_a23_ruby_reaction_6.mp3","text":"The boss is coming!","role":"ruby","duration":1155},"vo_a23_strawberry_reaction_1":{"url":"assets/audio/a23/vo_a23_strawberry_reaction_1.mp3","text":"Let’s make some room!","role":"strawberry","duration":1981},"vo_a23_strawberry_reaction_2":{"url":"assets/audio/a23/vo_a23_strawberry_reaction_2.mp3","text":"I’ve got a clear shot!","role":"strawberry","duration":1906},"vo_a23_strawberry_reaction_3":{"url":"assets/audio/a23/vo_a23_strawberry_reaction_3.mp3","text":"Stay sharp!","role":"strawberry","duration":1114},"vo_a23_strawberry_reaction_4":{"url":"assets/audio/a23/vo_a23_strawberry_reaction_4.mp3","text":"One step at a time.","role":"strawberry","duration":1621},"vo_a23_strawberry_reaction_5":{"url":"assets/audio/a23/vo_a23_strawberry_reaction_5.mp3","text":"That felt good!","role":"strawberry","duration":1725},"vo_a23_strawberry_reaction_6":{"url":"assets/audio/a23/vo_a23_strawberry_reaction_6.mp3","text":"Together — now!","role":"strawberry","duration":1116},"vo_a23_mint_reaction_1":{"url":"assets/audio/a23/vo_a23_mint_reaction_1.mp3","text":"A little chill should help.","role":"mint","duration":1565},"vo_a23_mint_reaction_2":{"url":"assets/audio/a23/vo_a23_mint_reaction_2.mp3","text":"Hold still for me.","role":"mint","duration":1418},"vo_a23_mint_reaction_3":{"url":"assets/audio/a23/vo_a23_mint_reaction_3.mp3","text":"I see an opening.","role":"mint","duration":1277},"vo_a23_mint_reaction_4":{"url":"assets/audio/a23/vo_a23_mint_reaction_4.mp3","text":"Steady as snow.","role":"mint","duration":1646},"vo_a23_mint_reaction_5":{"url":"assets/audio/a23/vo_a23_mint_reaction_5.mp3","text":"A clean finish.","role":"mint","duration":1524},"vo_a23_mint_reaction_6":{"url":"assets/audio/a23/vo_a23_mint_reaction_6.mp3","text":"Let’s move as one!","role":"mint","duration":1791},"vo_a23_cocoa_reaction_1":{"url":"assets/audio/a23/vo_a23_cocoa_reaction_1.mp3","text":"Time to turn up the heat!","role":"cocoa","duration":2044},"vo_a23_cocoa_reaction_2":{"url":"assets/audio/a23/vo_a23_cocoa_reaction_2.mp3","text":"Make way!","role":"cocoa","duration":529},"vo_a23_cocoa_reaction_3":{"url":"assets/audio/a23/vo_a23_cocoa_reaction_3.mp3","text":"I’m just warming up!","role":"cocoa","duration":2515},"vo_a23_cocoa_reaction_4":{"url":"assets/audio/a23/vo_a23_cocoa_reaction_4.mp3","text":"Keep the fire going!","role":"cocoa","duration":1092},"vo_a23_cocoa_reaction_5":{"url":"assets/audio/a23/vo_a23_cocoa_reaction_5.mp3","text":"Now that’s a finish!","role":"cocoa","duration":2459},"vo_a23_cocoa_reaction_6":{"url":"assets/audio/a23/vo_a23_cocoa_reaction_6.mp3","text":"Hit it together!","role":"cocoa","duration":2078},"vo_a23_taro_reaction_1":{"url":"assets/audio/a23/vo_a23_taro_reaction_1.mp3","text":"I’ll break their line.","role":"taro","duration":1342},"vo_a23_taro_reaction_2":{"url":"assets/audio/a23/vo_a23_taro_reaction_2.mp3","text":"Watch the sparks.","role":"taro","duration":1425},"vo_a23_taro_reaction_3":{"url":"assets/audio/a23/vo_a23_taro_reaction_3.mp3","text":"Here comes the charge.","role":"taro","duration":1092},"vo_a23_taro_reaction_4":{"url":"assets/audio/a23/vo_a23_taro_reaction_4.mp3","text":"We can hold this.","role":"taro","duration":702},"vo_a23_taro_reaction_5":{"url":"assets/audio/a23/vo_a23_taro_reaction_5.mp3","text":"Grounded at last.","role":"taro","duration":1331},"vo_a23_taro_reaction_6":{"url":"assets/audio/a23/vo_a23_taro_reaction_6.mp3","text":"Follow my lead!","role":"taro","duration":1031},"vo_a23_yuzu_reaction_1":{"url":"assets/audio/a23/vo_a23_yuzu_reaction_1.mp3","text":"Everyone — with me!","role":"yuzu","duration":1455},"vo_a23_yuzu_reaction_2":{"url":"assets/audio/a23/vo_a23_yuzu_reaction_2.mp3","text":"We’ve got this covered!","role":"yuzu","duration":1359},"vo_a23_yuzu_reaction_3":{"url":"assets/audio/a23/vo_a23_yuzu_reaction_3.mp3","text":"Find their opening!","role":"yuzu","duration":1281},"vo_a23_yuzu_reaction_4":{"url":"assets/audio/a23/vo_a23_yuzu_reaction_4.mp3","text":"Stay close, friends.","role":"yuzu","duration":1418},"vo_a23_yuzu_reaction_5":{"url":"assets/audio/a23/vo_a23_yuzu_reaction_5.mp3","text":"Good work, everyone!","role":"yuzu","duration":1422},"vo_a23_yuzu_reaction_6":{"url":"assets/audio/a23/vo_a23_yuzu_reaction_6.mp3","text":"All together — now!","role":"yuzu","duration":1009},"vo_a23_sesame_reaction_1":{"url":"assets/audio/a23/vo_a23_sesame_reaction_1.mp3","text":"The runes are listening.","role":"sesame","duration":3445},"vo_a23_sesame_reaction_2":{"url":"assets/audio/a23/vo_a23_sesame_reaction_2.mp3","text":"A new path unfolds.","role":"sesame","duration":2286},"vo_a23_sesame_reaction_3":{"url":"assets/audio/a23/vo_a23_sesame_reaction_3.mp3","text":"I have the pattern.","role":"sesame","duration":3044},"vo_a23_sesame_reaction_4":{"url":"assets/audio/a23/vo_a23_sesame_reaction_4.mp3","text":"Breathe, then begin.","role":"sesame","duration":2604},"vo_a23_sesame_reaction_5":{"url":"assets/audio/a23/vo_a23_sesame_reaction_5.mp3","text":"All returns to stillness.","role":"sesame","duration":2554},"vo_a23_sesame_reaction_6":{"url":"assets/audio/a23/vo_a23_sesame_reaction_6.mp3","text":"Our stars align.","role":"sesame","duration":1912},"vo_a23_pomelo_reaction_1":{"url":"assets/audio/a23/vo_a23_pomelo_reaction_1.mp3","text":"I’ll hold the line!","role":"pomelo","duration":2210},"vo_a23_pomelo_reaction_2":{"url":"assets/audio/a23/vo_a23_pomelo_reaction_2.mp3","text":"Right beside you!","role":"pomelo","duration":2270},"vo_a23_lime_reaction_1":{"url":"assets/audio/a23/vo_a23_lime_reaction_1.mp3","text":"A clear shot — together!","role":"lime","duration":1564},"vo_a23_lime_reaction_2":{"url":"assets/audio/a23/vo_a23_lime_reaction_2.mp3","text":"I’ve got your back!","role":"lime","duration":1381},"vo_a23_bloodorange_reaction_1":{"url":"assets/audio/a23/vo_a23_bloodorange_reaction_1.mp3","text":"Let our magic meet.","role":"bloodorange","duration":2276},"vo_a23_bloodorange_reaction_2":{"url":"assets/audio/a23/vo_a23_bloodorange_reaction_2.mp3","text":"A perfect resonance.","role":"bloodorange","duration":2063}};
const A23_STAGE_FAMILY=['insect','jelly','ember','ice','shadow','plant','plant','insect','plant','plant','stone','plant','crystal','crystal','shadow'];
const A23_EVENT_REF={lg_breach_open:'breach_open',lg_breach_collapse:'breach_close',lg_splinter_pick:'breach_progress',lg_breach_chest:'breach_complete',lg_statue_wake:'legion_open',lg_statue_refreeze:'legion_close',lg_herald_horn:'hunger_herald_open',lg_gates_shut:'hunger_herald_close',lg_pot_ritual:'ritual_open',lg_pot_flavor:'ritual_progress',lg_dish_served:'ritual_complete',tr_curse_pick:'ultimatum_open',tr_round_won:'ultimatum_progress',tr_take:'ultimatum_complete',tr_fail:'ultimatum_close',lg_jar_open:'frozen_pantry_open',a16_nectar_bloom:'defend_nectar_open'};
function a23StageKeys(index){const family=A23_STAGE_FAMILY[index]||'shadow',ambient='sfx_a23_ambience_s'+String(index+1).padStart(2,'0')+'_1';const boss='sfx_a23_boss_ambience_s'+String(Math.floor(index/5)*5+5).padStart(2,'0');return Object.keys(ASSET_AUDIO).filter(k=>k===ambient||k===boss||k.startsWith('sfx_a23_pattern_')||k.startsWith('sfx_a23_event_')||k.startsWith('sfx_a23_monster_'+family+'_'));}
const A07_CATALOG = {"vo_ruby_story_00":{"url":"assets/audio/acting/vo_ruby_story_00.mp3","text":"You found the Heart Seed and became a person again! I’m Ruby.","role":"ruby","duration":3468},"vo_ruby_story_01":{"url":"assets/audio/acting/vo_ruby_story_01.mp3","text":"The Empress is beaten and Mint is free! Grandma’s recipes are down these pipes.","role":"ruby","duration":4384},"vo_ruby_story_02":{"url":"assets/audio/acting/vo_ruby_story_02.mp3","text":"So hot! This machine burns stolen flavor. Cocoa is free now!","role":"ruby","duration":3726},"vo_ruby_story_03":{"url":"assets/audio/acting/vo_ruby_story_03.mp3","text":"The frozen mochi here were people once. Taro is free!","role":"ruby","duration":3236},"vo_ruby_story_04":{"url":"assets/audio/acting/vo_ruby_story_04.mp3","text":"A Crown root drinks this kitchen. Yuzu is here — let’s cut it!","role":"ruby","duration":3409},"vo_ruby_story_05":{"url":"assets/audio/acting/vo_ruby_story_05.mp3","text":"The root slid into the garden. Grandma’s flavor is still in the Crown.","role":"ruby","duration":5025},"vo_ruby_story_06":{"url":"assets/audio/acting/vo_ruby_story_06.mp3","text":"These spores eat memories. Stay close to me!","role":"ruby","duration":2185},"vo_ruby_story_07":{"url":"assets/audio/acting/vo_ruby_story_07.mp3","text":"The bees once made honey for everyone. Now they guard it for the Hunger.","role":"ruby","duration":4084},"vo_ruby_story_08":{"url":"assets/audio/acting/vo_ruby_story_08.mp3","text":"Time stopped here when the curse began.","role":"ruby","duration":1944},"vo_ruby_story_09":{"url":"assets/audio/acting/vo_ruby_story_09.mp3","text":"All the roots lead to one place. The Hunger is growing a body.","role":"ruby","duration":3389},"vo_ruby_story_10":{"url":"assets/audio/acting/vo_ruby_story_10.mp3","text":"The fields are empty. The Hunger is reaching for the First Tree.","role":"ruby","duration":3155},"vo_ruby_story_11":{"url":"assets/audio/acting/vo_ruby_story_11.mp3","text":"These flowers were eaten hollow. Stay sharp!","role":"ruby","duration":2626},"vo_ruby_story_12":{"url":"assets/audio/acting/vo_ruby_story_12.mp3","text":"The glass shows the old kingdom. Look — people, not mochi!","role":"ruby","duration":4374},"vo_ruby_story_13":{"url":"assets/audio/acting/vo_ruby_story_13.mp3","text":"The first seeds sleep here. The First Tree is close!","role":"ruby","duration":3076},"vo_ruby_story_14":{"url":"assets/audio/acting/vo_ruby_story_14.mp3","text":"This is the First Tree. Thank you for bringing me this far.","role":"ruby","duration":2860},"vo_ruby_book_1_1":{"url":"assets/audio/acting/vo_ruby_book_1_1.mp3","text":"Long ago, a Crown turned everyone in Mochitopia into mochi — and began eating their flavor.","role":"ruby","duration":6428},"vo_ruby_book_1_2":{"url":"assets/audio/acting/vo_ruby_book_1_2.mp3","text":"I’m Ruby, a jam spirit. Grandma made me to guard her recipe book and one sleeping seed.","role":"ruby","duration":5412},"vo_ruby_book_1_3":{"url":"assets/audio/acting/vo_ruby_book_1_3.mp3","text":"Today the floor cracked, you fell, and the Heart Seed woke in your hands. You’re a person again!","role":"ruby","duration":6150},"vo_ruby_book_2_1":{"url":"assets/audio/acting/vo_ruby_book_2_1.mp3","text":"The Empress is free and her flavor came home. These pipes lead to where Grandma hid her jar.","role":"ruby","duration":6258},"vo_ruby_book_2_2":{"url":"assets/audio/acting/vo_ruby_book_2_2.mp3","text":"Before the Hunger caught her, Grandma dropped her jar into the cracks to keep it safe.","role":"ruby","duration":4186},"vo_ruby_book_2_3":{"url":"assets/audio/acting/vo_ruby_book_2_3.mp3","text":"Inside: Grandma’s Battle Recipes! Three seed styles for your Heart Seed; choose one on each floor.","role":"ruby","duration":7340},"vo_ruby_book_3_1":{"url":"assets/audio/acting/vo_ruby_book_3_1.mp3","text":"This furnace burns the flavor the Hunger steals. Every spark is a piece of someone.","role":"ruby","duration":4637},"vo_ruby_book_3_2":{"url":"assets/audio/acting/vo_ruby_book_3_2.mp3","text":"Look at those jars. Cursed mochi are trapped inside, drained of everything they are.","role":"ruby","duration":5913},"vo_ruby_book_3_3":{"url":"assets/audio/acting/vo_ruby_book_3_3.mp3","text":"Stop the furnace and their flavor comes home — then your seed can break their curse!","role":"ruby","duration":5220},"vo_ruby_book_4_1":{"url":"assets/audio/acting/vo_ruby_book_4_1.mp3","text":"Cursed mochi are frozen in here as fuel. Their voices tremble beneath the frost.","role":"ruby","duration":4537},"vo_ruby_book_4_2":{"url":"assets/audio/acting/vo_ruby_book_4_2.mp3","text":"That gentle voice… Grandma! She froze herself so the Hunger could not eat her last page.","role":"ruby","duration":7626},"vo_ruby_book_4_3":{"url":"assets/audio/acting/vo_ruby_book_4_3.mp3","text":"Her flavor is locked inside the Crown itself. We free the others now — then we go get hers.","role":"ruby","duration":6129},"vo_ruby_book_5_1":{"url":"assets/audio/acting/vo_ruby_book_5_1.mp3","text":"The Crown Oven. A root of the Crown comes up here to drink the whole kitchen’s flavor.","role":"ruby","duration":4674},"vo_ruby_book_5_2":{"url":"assets/audio/acting/vo_ruby_book_5_2.mp3","text":"I’m frightened. But Grandma is waiting, and the First Tree is starving.","role":"ruby","duration":3994},"vo_ruby_book_5_3":{"url":"assets/audio/acting/vo_ruby_book_5_3.mp3","text":"Let’s cut this root together. Then we follow it — all the way to the Crown.","role":"ruby","duration":4898},"vo_ruby_tip_survive":{"url":"assets/audio/acting/vo_ruby_tip_survive.mp3","text":"Stay alive until the timer ends. Keep moving!","role":"ruby","duration":2391},"vo_ruby_tip_fill":{"url":"assets/audio/acting/vo_ruby_tip_fill.mp3","text":"Beat monsters to fill the Meter!","role":"ruby","duration":1679},"vo_ruby_tip_purge":{"url":"assets/audio/acting/vo_ruby_tip_purge.mp3","text":"Keep the Wisp safe. Outside, you bleed!","role":"ruby","duration":2411},"vo_ruby_tip_capture":{"url":"assets/audio/acting/vo_ruby_tip_capture.mp3","text":"Touch the crack — it races to the next hole!","role":"ruby","duration":2623},"vo_ruby_tip_defendNectar":{"url":"assets/audio/acting/vo_ruby_tip_defendNectar.mp3","text":"Protect the flower! Stay close.","role":"ruby","duration":1598},"vo_ruby_tip_seasonCycle":{"url":"assets/audio/acting/vo_ruby_tip_seasonCycle.mp3","text":"Grab petals for all 4 seasons!","role":"ruby","duration":1844},"vo_ruby_tip_breakRoots":{"url":"assets/audio/acting/vo_ruby_tip_breakRoots.mp3","text":"Lure the root into the anchor stones!","role":"ruby","duration":2136},"vo_ruby_tip_cleanAir":{"url":"assets/audio/acting/vo_ruby_tip_cleanAir.mp3","text":"Grab the fresh air and free everyone in the poison fog!","role":"ruby","duration":2461},"vo_ruby_tip_counter":{"url":"assets/audio/acting/vo_ruby_tip_counter.mp3","text":"Dash into the glowing item to kick it at the boss!","role":"ruby","duration":2819},"vo_ruby_tip_mini":{"url":"assets/audio/acting/vo_ruby_tip_mini.mp3","text":"A Miniboss! Beat it to spin the reward wheel!","role":"ruby","duration":2390},"vo_ruby_tip_boss":{"url":"assets/audio/acting/vo_ruby_tip_boss.mp3","text":"The Boss! Dash away from red warnings, then hit back!","role":"ruby","duration":2964},"vo_ruby_tip_magnet":{"url":"assets/audio/acting/vo_ruby_tip_magnet.mp3","text":"A Magnet! It pulls in all your EXP.","role":"ruby","duration":3154},"vo_ruby_tip_heal":{"url":"assets/audio/acting/vo_ruby_tip_heal.mp3","text":"A Heal Mochi! Grab it to get HP back.","role":"ruby","duration":2554},"vo_ruby_tip_chest":{"url":"assets/audio/acting/vo_ruby_tip_chest.mp3","text":"A Treasure Chest! Open it for a free upgrade.","role":"ruby","duration":3078},"vo_ruby_guide_dig":{"url":"assets/audio/acting/vo_ruby_guide_dig.mp3","text":"Depths is open! Use shovels to dig under the temple. Find the ladder to go deeper.","role":"ruby","duration":4904},"vo_ruby_guide_rewards":{"url":"assets/audio/acting/vo_ruby_guide_rewards.mp3","text":"Rewards is open! Your daily login gift, Daily Quests and Awards are all here.","role":"ruby","duration":5437},"vo_ruby_guide_bazaar":{"url":"assets/audio/acting/vo_ruby_guide_bazaar.mp3","text":"The Bazaar is open! Open treasure chests and shop for gear with your Sugar and Thread.","role":"ruby","duration":4527},"vo_ruby_guide_gActivity":{"url":"assets/audio/acting/vo_ruby_guide_gActivity.mp3","text":"Activities: daily goals and side fun that pay out rewards.","role":"ruby","duration":3853},"vo_ruby_guide_daily":{"url":"assets/audio/acting/vo_ruby_guide_daily.mp3","text":"Daily Quests reset every day — finish them for reward boxes!","role":"ruby","duration":4116},"vo_ruby_guide_achievements":{"url":"assets/audio/acting/vo_ruby_guide_achievements.mp3","text":"Awards count your big moments and pay Sugar for each one.","role":"ruby","duration":3262},"vo_ruby_guide_news":{"url":"assets/audio/acting/vo_ruby_guide_news.mp3","text":"News shows what changed in each update.","role":"ruby","duration":1931},"vo_ruby_guide_gearInbox":{"url":"assets/audio/acting/vo_ruby_guide_gearInbox.mp3","text":"Mail keeps loot that did not fit your bag. Check it often!","role":"ruby","duration":3012},"vo_ruby_guide_gear":{"url":"assets/audio/acting/vo_ruby_guide_gear.mp3","text":"Equipment! Put on the gear you find — it lives in the Upgrade tab.","role":"ruby","duration":4014},"vo_ruby_guide_craft":{"url":"assets/audio/acting/vo_ruby_guide_craft.mp3","text":"The Affix Forge lets you reroll the powers on your gear (Upgrade tab).","role":"ruby","duration":4691},"vo_ruby_guide_char":{"url":"assets/audio/acting/vo_ruby_guide_char.mp3","text":"Heroes! A new friend has joined — switch heroes and spend Talent points here.","role":"ruby","duration":5190},"vo_ruby_guide_gCodex":{"url":"assets/audio/acting/vo_ruby_guide_gCodex.mp3","text":"The Recipe Book remembers every Build card, relic and monster you meet.","role":"ruby","duration":4334},"vo_strawberry_lobby_1":{"url":"assets/audio/acting/vo_strawberry_lobby_1.mp3","text":"Poke me again. I dare you!","role":"strawberry","duration":1505},"vo_strawberry_lobby_2":{"url":"assets/audio/acting/vo_strawberry_lobby_2.mp3","text":"Pew pew! Did you see that?","role":"strawberry","duration":1566},"vo_strawberry_lobby_3":{"url":"assets/audio/acting/vo_strawberry_lobby_3.mp3","text":"Let’s go! My feet are bouncy!","role":"strawberry","duration":1753},"vo_mint_lobby_1":{"url":"assets/audio/acting/vo_mint_lobby_1.mp3","text":"Chill. I’ve got your back.","role":"mint","duration":1398},"vo_mint_lobby_2":{"url":"assets/audio/acting/vo_mint_lobby_2.mp3","text":"Too hot? I can fix that.","role":"mint","duration":1487},"vo_mint_lobby_3":{"url":"assets/audio/acting/vo_mint_lobby_3.mp3","text":"Brr! …That was me. Sorry.","role":"mint","duration":1845},"vo_cocoa_lobby_1":{"url":"assets/audio/acting/vo_cocoa_lobby_1.mp3","text":"Cookie? I always carry two.","role":"cocoa","duration":1609},"vo_cocoa_lobby_2":{"url":"assets/audio/acting/vo_cocoa_lobby_2.mp3","text":"Hide behind me, little one.","role":"cocoa","duration":1243},"vo_cocoa_lobby_3":{"url":"assets/audio/acting/vo_cocoa_lobby_3.mp3","text":"Big hug or big punch? Pick!","role":"cocoa","duration":1661},"vo_taro_lobby_1":{"url":"assets/audio/acting/vo_taro_lobby_1.mp3","text":"Zap! …Mostly on purpose.","role":"taro","duration":1997},"vo_taro_lobby_2":{"url":"assets/audio/acting/vo_taro_lobby_2.mp3","text":"My compass says: adventure!","role":"taro","duration":1599},"vo_taro_lobby_3":{"url":"assets/audio/acting/vo_taro_lobby_3.mp3","text":"Ooh, sparkly! Can I touch it?","role":"taro","duration":1467},"vo_yuzu_lobby_1":{"url":"assets/audio/acting/vo_yuzu_lobby_1.mp3","text":"Yuzlings! Look busy!","role":"yuzu","duration":1213},"vo_yuzu_lobby_2":{"url":"assets/audio/acting/vo_yuzu_lobby_2.mp3","text":"Tiny crew, big trouble!","role":"yuzu","duration":1270},"vo_yuzu_lobby_3":{"url":"assets/audio/acting/vo_yuzu_lobby_3.mp3","text":"Citrus squad, roll out!","role":"yuzu","duration":1393},"vo_b01_intro":{"url":"assets/audio/acting/vo_b01_intro.mp3","text":"If I stop obeying, who will keep my children safe?","role":"boss1","duration":2480},"vo_b01_fight_1":{"url":"assets/audio/acting/vo_b01_fight_1.mp3","text":"No! The crystal promised they would be safe!","role":"boss1","duration":1761},"vo_b01_fight_2":{"url":"assets/audio/acting/vo_b01_fight_2.mp3","text":"Workers, stay behind me!","role":"boss1","duration":1415},"vo_b01_release":{"url":"assets/audio/acting/vo_b01_release.mp3","text":"The orders are quiet… please, keep the eggs warm.","role":"boss1","duration":2989},"vo_b02_intro":{"url":"assets/audio/acting/vo_b02_intro.mp3","text":"You call it waste. I can still hear their names.","role":"boss2","duration":3117},"vo_b02_fight_1":{"url":"assets/audio/acting/vo_b02_fight_1.mp3","text":"I will not let another memory wash away!","role":"boss2","duration":2370},"vo_b02_fight_2":{"url":"assets/audio/acting/vo_b02_fight_2.mp3","text":"The pipes are full. There is nowhere left to keep them!","role":"boss2","duration":3651},"vo_b02_release":{"url":"assets/audio/acting/vo_b02_release.mp3","text":"The water is clear… I can hear each voice again.","role":"boss2","duration":3696},"vo_b03_intro":{"url":"assets/audio/acting/vo_b03_intro.mp3","text":"The stove must stay lit. Someone is still waiting for dinner.","role":"boss3","duration":3300},"vo_b03_fight_1":{"url":"assets/audio/acting/vo_b03_fight_1.mp3","text":"Just one more tray. Then everyone can eat.","role":"boss3","duration":2355},"vo_b03_fight_2":{"url":"assets/audio/acting/vo_b03_fight_2.mp3","text":"Why does every meal smell like smoke?","role":"boss3","duration":1749},"vo_b03_release":{"url":"assets/audio/acting/vo_b03_release.mp3","text":"At last… I can let the stove cool.","role":"boss3","duration":3606},"vo_b04_intro":{"url":"assets/audio/acting/vo_b04_intro.mp3","text":"If the ice melts, what will protect them from forgetting?","role":"boss4","duration":2658},"vo_b04_fight_1":{"url":"assets/audio/acting/vo_b04_fight_1.mp3","text":"Stay frozen. Stay safe. That was the order.","role":"boss4","duration":2686},"vo_b04_fight_2":{"url":"assets/audio/acting/vo_b04_fight_2.mp3","text":"Do not take the last shelter I can give them!","role":"boss4","duration":2477},"vo_b04_release":{"url":"assets/audio/acting/vo_b04_release.mp3","text":"Their voices… they are warmer than I remember.","role":"boss4","duration":2902},"vo_b05_intro":{"url":"assets/audio/acting/vo_b05_intro.mp3","text":"A kingdom that cannot remember hunger can never complain.","role":"boss5","duration":3715},"vo_b05_fight_1":{"url":"assets/audio/acting/vo_b05_fight_1.mp3","text":"Give me the taste you are trying to save.","role":"boss5","duration":2113},"vo_b05_fight_2":{"url":"assets/audio/acting/vo_b05_fight_2.mp3","text":"You cannot empty a hunger by feeding it!","role":"boss5","duration":2447},"vo_b05_release":{"url":"assets/audio/acting/vo_b05_release.mp3","text":"You have cut one root. I have so many more.","role":"boss5","duration":3019},"vo_b06_intro":{"url":"assets/audio/acting/vo_b06_intro.mp3","text":"Mother said I would bloom forever if I brought enough flavor.","role":"boss6","duration":3464},"vo_b06_fight_1":{"url":"assets/audio/acting/vo_b06_fight_1.mp3","text":"Do not let my petals fall before she sees me!","role":"boss6","duration":2100},"vo_b06_fight_2":{"url":"assets/audio/acting/vo_b06_fight_2.mp3","text":"Every spore carries a memory. I need them all!","role":"boss6","duration":2541},"vo_b06_release":{"url":"assets/audio/acting/vo_b06_release.mp3","text":"Mother… was any of this garden ever mine?","role":"boss6","duration":2069},"vo_b07_intro":{"url":"assets/audio/acting/vo_b07_intro.mp3","text":"One heart cannot bear to lose another voice.","role":"boss7","duration":2814},"vo_b07_fight_1":{"url":"assets/audio/acting/vo_b07_fight_1.mp3","text":"Stay together. No one leaves the colony!","role":"boss7","duration":3483},"vo_b07_fight_2":{"url":"assets/audio/acting/vo_b07_fight_2.mp3","text":"Breathe with us. Forget the world outside!","role":"boss7","duration":2972},"vo_b07_release":{"url":"assets/audio/acting/vo_b07_release.mp3","text":"So many names… they can finally go home.","role":"boss7","duration":3755},"vo_b08_intro":{"url":"assets/audio/acting/vo_b08_intro.mp3","text":"My workers brought this home. It has to be enough.","role":"boss8","duration":3094},"vo_b08_fight_1":{"url":"assets/audio/acting/vo_b08_fight_1.mp3","text":"Every drop belongs in the royal stores!","role":"boss8","duration":2260},"vo_b08_fight_2":{"url":"assets/audio/acting/vo_b08_fight_2.mp3","text":"Do not show my workers an empty flower!","role":"boss8","duration":2051},"vo_b08_release":{"url":"assets/audio/acting/vo_b08_release.mp3","text":"The honey… we were feeding them the curse.","role":"boss8","duration":2261},"vo_b09_intro":{"url":"assets/audio/acting/vo_b09_intro.mp3","text":"One more moment. I can still save this day.","role":"boss9","duration":2242},"vo_b09_fight_1":{"url":"assets/audio/acting/vo_b09_fight_1.mp3","text":"Spring will mend it. Winter will keep it. Again!","role":"boss9","duration":3763},"vo_b09_fight_2":{"url":"assets/audio/acting/vo_b09_fight_2.mp3","text":"If the hands stop, nothing else has to change!","role":"boss9","duration":3044},"vo_b09_release":{"url":"assets/audio/acting/vo_b09_release.mp3","text":"Tomorrow… I had forgotten there could be a tomorrow.","role":"boss9","duration":4783},"vo_b10_intro":{"url":"assets/audio/acting/vo_b10_intro.mp3","text":"I kept every voice alive. Why do they all ask to leave?","role":"boss10","duration":3467},"vo_b10_fight_1":{"url":"assets/audio/acting/vo_b10_fight_1.mp3","text":"My roots have held this kingdom for centuries!","role":"boss10","duration":2066},"vo_b10_fight_2":{"url":"assets/audio/acting/vo_b10_fight_2.mp3","text":"Do not ask a mother to loosen her hold!","role":"boss10","duration":2123},"vo_b10_release":{"url":"assets/audio/acting/vo_b10_release.mp3","text":"The one who planted me… he is still waiting.","role":"boss10","duration":3028},"vo_b11_intro":{"url":"assets/audio/acting/vo_b11_intro.mp3","text":"There must be one more row. Someone is still hungry.","role":"boss11","duration":4157},"vo_b11_fight_1":{"url":"assets/audio/acting/vo_b11_fight_1.mp3","text":"The granaries cannot be empty. I harvested everything!","role":"boss11","duration":3217},"vo_b11_fight_2":{"url":"assets/audio/acting/vo_b11_fight_2.mp3","text":"Stand back. I have not finished the last row!","role":"boss11","duration":2647},"vo_b11_release":{"url":"assets/audio/acting/vo_b11_release.mp3","text":"The fields were green once… plant something for them.","role":"boss11","duration":3885},"vo_b12_intro":{"url":"assets/audio/acting/vo_b12_intro.mp3","text":"If I take just one more taste, perhaps I will feel it.","role":"boss12","duration":3319},"vo_b12_fight_1":{"url":"assets/audio/acting/vo_b12_fight_1.mp3","text":"I remember sweetness. Why can I not taste yours?","role":"boss12","duration":3313},"vo_b12_fight_2":{"url":"assets/audio/acting/vo_b12_fight_2.mp3","text":"Do not leave me empty again!","role":"boss12","duration":1429},"vo_b12_release":{"url":"assets/audio/acting/vo_b12_release.mp3","text":"So quiet… I can finally hear the orchard breathe.","role":"boss12","duration":3483},"vo_b13_intro":{"url":"assets/audio/acting/vo_b13_intro.mp3","text":"Outside, everything breaks. Here, I can still keep them whole.","role":"boss13","duration":5387},"vo_b13_fight_1":{"url":"assets/audio/acting/vo_b13_fight_1.mp3","text":"That reflection is the kingdom before we failed it!","role":"boss13","duration":2772},"vo_b13_fight_2":{"url":"assets/audio/acting/vo_b13_fight_2.mp3","text":"I will not let another future shatter!","role":"boss13","duration":1888},"vo_b13_release":{"url":"assets/audio/acting/vo_b13_release.mp3","text":"Let them grow in the sun… even if the glass cannot follow.","role":"boss13","duration":4935},"vo_b14_intro":{"url":"assets/audio/acting/vo_b14_intro.mp3","text":"I know that seed. One has been missing all this time.","role":"boss14","duration":6084},"vo_b14_fight_1":{"url":"assets/audio/acting/vo_b14_fight_1.mp3","text":"A closed vault cannot make another mistake!","role":"boss14","duration":2246},"vo_b14_fight_2":{"url":"assets/audio/acting/vo_b14_fight_2.mp3","text":"If one seed changed everything, what might another do?","role":"boss14","duration":2519},"vo_b14_release":{"url":"assets/audio/acting/vo_b14_release.mp3","text":"Then take them… plant them well. Do not keep them as I did.","role":"boss14","duration":4807},"vo_b15_intro":{"url":"assets/audio/acting/vo_b15_intro.mp3","text":"I wanted no one to go hungry. Tell me that was not wrong.","role":"boss15","duration":2821},"vo_b15_fight_1":{"url":"assets/audio/acting/vo_b15_fight_1.mp3","text":"I did it to feed the world! Why did their faces disappear?","role":"boss15","duration":3750},"vo_b15_fight_2":{"url":"assets/audio/acting/vo_b15_fight_2.mp3","text":"If I take it off, who will keep them safe from hunger?","role":"boss15","duration":2709},"vo_b15_release":{"url":"assets/audio/acting/vo_b15_release.mp3","text":"Every flavor… every person. I remember why I planted it now.","role":"boss15","duration":4185},"vo_story_s00_1":{"url":"assets/audio/acting/vo_story_s00_1.mp3","text":"Long ago, Mochitopia was a kingdom of people — and every home was full of flavor.","role":"ruby","duration":5164},"vo_story_s00_2":{"url":"assets/audio/acting/vo_story_s00_2.mp3","text":"The First Planter set a Crown on the First Tree… and the Crown grew hungry.","role":"ruby","duration":4454},"vo_story_s00_3":{"url":"assets/audio/acting/vo_story_s00_3.mp3","text":"In one night, everyone became mochi — and the Crown began to eat their flavor.","role":"ruby","duration":4511},"vo_story_s01_1":{"url":"assets/audio/acting/vo_story_s01_1.mp3","text":"Hundreds of years later, a little strawberry mochi is tidying a quiet pantry…","role":"ruby","duration":4774},"vo_story_s01_2":{"url":"assets/audio/acting/vo_story_s01_2.mp3","text":"…when the starving Hunger’s roots burst up through the floor!","role":"ruby","duration":3580},"vo_story_s01_3":{"url":"assets/audio/acting/vo_story_s01_3.mp3","text":"…and a little strawberry mochi falls into the dark!","role":"ruby","duration":2523},"vo_story_s01_4":{"url":"assets/audio/acting/vo_story_s01_4.mp3","text":"She lands with a thump in a sour ant nest. Something pale is moving in the dark…","role":"ruby","duration":4863},"vo_story_s01_5":{"url":"assets/audio/acting/vo_story_s01_5.mp3","text":"Blank, flavorless mochi creep closer — toward a little jam spirit hiding behind a crystal.","role":"ruby","duration":6383},"vo_story_s01_6":{"url":"assets/audio/acting/vo_story_s01_6.mp3","text":"“This way!” squeaks Ruby. The two of them dash between the old roots.","role":"ruby","duration":4805},"vo_story_s01_7":{"url":"assets/audio/acting/vo_story_s01_7.mp3","text":"There, among the roots, something tiny is glowing — a sleeping seed.","role":"ruby","duration":4960},"vo_story_s01_8":{"url":"assets/audio/acting/vo_story_s01_8.mp3","text":"The Heart Seed wakes at her touch…","role":"ruby","duration":1745},"vo_story_s01_9":{"url":"assets/audio/acting/vo_story_s01_9.mp3","text":"…and the curse breaks. Strawberry is a person again!","role":"ruby","duration":2650},"vo_story_s01_10":{"url":"assets/audio/acting/vo_story_s01_10.mp3","text":"“I’m Ruby, Grandma’s jam spirit! That seed can free everyone. Let’s go!”","role":"ruby","duration":4811},"vo_strawberry_start_1":{"url":"assets/audio/acting/vo_strawberry_start_1.mp3","text":"Ready, Ruby? Let’s go!","role":"strawberry","duration":1283},"vo_strawberry_start_2":{"url":"assets/audio/acting/vo_strawberry_start_2.mp3","text":"One step at a time!","role":"strawberry","duration":1502},"vo_strawberry_unique_1":{"url":"assets/audio/acting/vo_strawberry_unique_1.mp3","text":"Taste this!","role":"strawberry","duration":864},"vo_strawberry_unique_2":{"url":"assets/audio/acting/vo_strawberry_unique_2.mp3","text":"Full flavor, coming through!","role":"strawberry","duration":1673},"vo_strawberry_levelup_1":{"url":"assets/audio/acting/vo_strawberry_levelup_1.mp3","text":"Getting the hang of it!","role":"strawberry","duration":984},"vo_strawberry_levelup_2":{"url":"assets/audio/acting/vo_strawberry_levelup_2.mp3","text":"A little stronger!","role":"strawberry","duration":1309},"vo_strawberry_evolve_1":{"url":"assets/audio/acting/vo_strawberry_evolve_1.mp3","text":"Now we’re cooking!","role":"strawberry","duration":1355},"vo_strawberry_evolve_2":{"url":"assets/audio/acting/vo_strawberry_evolve_2.mp3","text":"Let’s try this!","role":"strawberry","duration":1067},"vo_strawberry_boss_1":{"url":"assets/audio/acting/vo_strawberry_boss_1.mp3","text":"Whoa. That’s a big one.","role":"strawberry","duration":1175},"vo_strawberry_boss_2":{"url":"assets/audio/acting/vo_strawberry_boss_2.mp3","text":"We can do this together!","role":"strawberry","duration":1092},"vo_strawberry_lowhp_1":{"url":"assets/audio/acting/vo_strawberry_lowhp_1.mp3","text":"Ouch! Need a moment.","role":"strawberry","duration":1487},"vo_strawberry_lowhp_2":{"url":"assets/audio/acting/vo_strawberry_lowhp_2.mp3","text":"Still on my feet!","role":"strawberry","duration":1157},"vo_strawberry_revive_1":{"url":"assets/audio/acting/vo_strawberry_revive_1.mp3","text":"Back for another helping!","role":"strawberry","duration":1455},"vo_strawberry_revive_2":{"url":"assets/audio/acting/vo_strawberry_revive_2.mp3","text":"I’m not done yet!","role":"strawberry","duration":945},"vo_strawberry_win_1":{"url":"assets/audio/acting/vo_strawberry_win_1.mp3","text":"We did it, Ruby!","role":"strawberry","duration":1196},"vo_strawberry_win_2":{"url":"assets/audio/acting/vo_strawberry_win_2.mp3","text":"Flavor saved!","role":"strawberry","duration":946},"vo_mint_start_1":{"url":"assets/audio/acting/vo_mint_start_1.mp3","text":"Stay close.","role":"mint","duration":781},"vo_mint_start_2":{"url":"assets/audio/acting/vo_mint_start_2.mp3","text":"Let’s keep this cool.","role":"mint","duration":1172},"vo_mint_unique_1":{"url":"assets/audio/acting/vo_mint_unique_1.mp3","text":"Winter, answer me.","role":"mint","duration":995},"vo_mint_unique_2":{"url":"assets/audio/acting/vo_mint_unique_2.mp3","text":"Freeze.","role":"mint","duration":697},"vo_mint_levelup_1":{"url":"assets/audio/acting/vo_mint_levelup_1.mp3","text":"That should help.","role":"mint","duration":1265},"vo_mint_levelup_2":{"url":"assets/audio/acting/vo_mint_levelup_2.mp3","text":"A little sharper.","role":"mint","duration":1471},"vo_mint_evolve_1":{"url":"assets/audio/acting/vo_mint_evolve_1.mp3","text":"Colder. Better.","role":"mint","duration":919},"vo_mint_evolve_2":{"url":"assets/audio/acting/vo_mint_evolve_2.mp3","text":"Now it’s ready.","role":"mint","duration":740},"vo_mint_boss_1":{"url":"assets/audio/acting/vo_mint_boss_1.mp3","text":"I’ll slow it down.","role":"mint","duration":1346},"vo_mint_boss_2":{"url":"assets/audio/acting/vo_mint_boss_2.mp3","text":"Keep your distance.","role":"mint","duration":1246},"vo_mint_lowhp_1":{"url":"assets/audio/acting/vo_mint_lowhp_1.mp3","text":"I’m still standing.","role":"mint","duration":1174},"vo_mint_lowhp_2":{"url":"assets/audio/acting/vo_mint_lowhp_2.mp3","text":"That was close.","role":"mint","duration":1105},"vo_mint_revive_1":{"url":"assets/audio/acting/vo_mint_revive_1.mp3","text":"Not cold enough yet.","role":"mint","duration":1279},"vo_mint_revive_2":{"url":"assets/audio/acting/vo_mint_revive_2.mp3","text":"I’m back. Focus.","role":"mint","duration":1335},"vo_mint_win_1":{"url":"assets/audio/acting/vo_mint_win_1.mp3","text":"Everyone safe? Good.","role":"mint","duration":1232},"vo_mint_win_2":{"url":"assets/audio/acting/vo_mint_win_2.mp3","text":"That will do.","role":"mint","duration":1023},"vo_cocoa_start_1":{"url":"assets/audio/acting/vo_cocoa_start_1.mp3","text":"All right. I’m up.","role":"cocoa","duration":1079},"vo_cocoa_start_2":{"url":"assets/audio/acting/vo_cocoa_start_2.mp3","text":"Let’s get moving.","role":"cocoa","duration":844},"vo_cocoa_unique_1":{"url":"assets/audio/acting/vo_cocoa_unique_1.mp3","text":"Big punch coming!","role":"cocoa","duration":1246},"vo_cocoa_unique_2":{"url":"assets/audio/acting/vo_cocoa_unique_2.mp3","text":"Here comes the heavy bit!","role":"cocoa","duration":1208},"vo_cocoa_levelup_1":{"url":"assets/audio/acting/vo_cocoa_levelup_1.mp3","text":"Feeling stronger.","role":"cocoa","duration":1093},"vo_cocoa_levelup_2":{"url":"assets/audio/acting/vo_cocoa_levelup_2.mp3","text":"That woke me up.","role":"cocoa","duration":828},"vo_cocoa_evolve_1":{"url":"assets/audio/acting/vo_cocoa_evolve_1.mp3","text":"Now we’re talking!","role":"cocoa","duration":1332},"vo_cocoa_evolve_2":{"url":"assets/audio/acting/vo_cocoa_evolve_2.mp3","text":"These fists are ready.","role":"cocoa","duration":1227},"vo_cocoa_boss_1":{"url":"assets/audio/acting/vo_cocoa_boss_1.mp3","text":"That one’s big. Good.","role":"cocoa","duration":1504},"vo_cocoa_boss_2":{"url":"assets/audio/acting/vo_cocoa_boss_2.mp3","text":"I’ll take the front.","role":"cocoa","duration":1096},"vo_cocoa_lowhp_1":{"url":"assets/audio/acting/vo_cocoa_lowhp_1.mp3","text":"Ow. Careful now.","role":"cocoa","duration":1011},"vo_cocoa_lowhp_2":{"url":"assets/audio/acting/vo_cocoa_lowhp_2.mp3","text":"Still got a little fight.","role":"cocoa","duration":1342},"vo_cocoa_revive_1":{"url":"assets/audio/acting/vo_cocoa_revive_1.mp3","text":"Not done yet!","role":"cocoa","duration":921},"vo_cocoa_revive_2":{"url":"assets/audio/acting/vo_cocoa_revive_2.mp3","text":"Back on my feet.","role":"cocoa","duration":1087},"vo_cocoa_win_1":{"url":"assets/audio/acting/vo_cocoa_win_1.mp3","text":"Nap time. Earned it.","role":"cocoa","duration":1525},"vo_cocoa_win_2":{"url":"assets/audio/acting/vo_cocoa_win_2.mp3","text":"Anyone bring cookies?","role":"cocoa","duration":1070},"vo_taro_start_1":{"url":"assets/audio/acting/vo_taro_start_1.mp3","text":"Adventure this way!","role":"taro","duration":1102},"vo_taro_start_2":{"url":"assets/audio/acting/vo_taro_start_2.mp3","text":"I know a shortcut. Maybe.","role":"taro","duration":1733},"vo_taro_unique_1":{"url":"assets/audio/acting/vo_taro_unique_1.mp3","text":"Storm, this way!","role":"taro","duration":1108},"vo_taro_unique_2":{"url":"assets/audio/acting/vo_taro_unique_2.mp3","text":"Let’s light it up!","role":"taro","duration":1082},"vo_taro_levelup_1":{"url":"assets/audio/acting/vo_taro_levelup_1.mp3","text":"That’s a good discovery!","role":"taro","duration":1143},"vo_taro_levelup_2":{"url":"assets/audio/acting/vo_taro_levelup_2.mp3","text":"New route unlocked!","role":"taro","duration":1139},"vo_taro_evolve_1":{"url":"assets/audio/acting/vo_taro_evolve_1.mp3","text":"Now that’s electric!","role":"taro","duration":1197},"vo_taro_evolve_2":{"url":"assets/audio/acting/vo_taro_evolve_2.mp3","text":"A brilliant connection!","role":"taro","duration":1392},"vo_taro_boss_1":{"url":"assets/audio/acting/vo_taro_boss_1.mp3","text":"Big trouble ahead!","role":"taro","duration":1196},"vo_taro_boss_2":{"url":"assets/audio/acting/vo_taro_boss_2.mp3","text":"I’ve got a plan! Sort of.","role":"taro","duration":1843},"vo_taro_lowhp_1":{"url":"assets/audio/acting/vo_taro_lowhp_1.mp3","text":"Oh. That hurt.","role":"taro","duration":1197},"vo_taro_lowhp_2":{"url":"assets/audio/acting/vo_taro_lowhp_2.mp3","text":"Time to rethink the route!","role":"taro","duration":1221},"vo_taro_revive_1":{"url":"assets/audio/acting/vo_taro_revive_1.mp3","text":"Back on the map!","role":"taro","duration":1117},"vo_taro_revive_2":{"url":"assets/audio/acting/vo_taro_revive_2.mp3","text":"I’m not lost yet!","role":"taro","duration":1277},"vo_taro_win_1":{"url":"assets/audio/acting/vo_taro_win_1.mp3","text":"We found our way!","role":"taro","duration":937},"vo_taro_win_2":{"url":"assets/audio/acting/vo_taro_win_2.mp3","text":"I meant to do that!","role":"taro","duration":1548},"vo_yuzu_start_1":{"url":"assets/audio/acting/vo_yuzu_start_1.mp3","text":"Citrus squad, with me!","role":"yuzu","duration":1280},"vo_yuzu_start_2":{"url":"assets/audio/acting/vo_yuzu_start_2.mp3","text":"All accounted for? Move out!","role":"yuzu","duration":1279},"vo_yuzu_unique_1":{"url":"assets/audio/acting/vo_yuzu_unique_1.mp3","text":"Together, now!","role":"yuzu","duration":966},"vo_yuzu_unique_2":{"url":"assets/audio/acting/vo_yuzu_unique_2.mp3","text":"Squad, show them!","role":"yuzu","duration":1207},"vo_yuzu_levelup_1":{"url":"assets/audio/acting/vo_yuzu_levelup_1.mp3","text":"Good work, team!","role":"yuzu","duration":963},"vo_yuzu_levelup_2":{"url":"assets/audio/acting/vo_yuzu_levelup_2.mp3","text":"Room to grow!","role":"yuzu","duration":958},"vo_yuzu_evolve_1":{"url":"assets/audio/acting/vo_yuzu_evolve_1.mp3","text":"Squad, new formation!","role":"yuzu","duration":1440},"vo_yuzu_evolve_2":{"url":"assets/audio/acting/vo_yuzu_evolve_2.mp3","text":"Look how you’ve grown!","role":"yuzu","duration":1313},"vo_yuzu_boss_1":{"url":"assets/audio/acting/vo_yuzu_boss_1.mp3","text":"Team, focus that one!","role":"yuzu","duration":1369},"vo_yuzu_boss_2":{"url":"assets/audio/acting/vo_yuzu_boss_2.mp3","text":"Big target! Stay together!","role":"yuzu","duration":1300},"vo_yuzu_lowhp_1":{"url":"assets/audio/acting/vo_yuzu_lowhp_1.mp3","text":"Hold the line, crew!","role":"yuzu","duration":1201},"vo_yuzu_lowhp_2":{"url":"assets/audio/acting/vo_yuzu_lowhp_2.mp3","text":"I need a little cover!","role":"yuzu","duration":1287},"vo_yuzu_revive_1":{"url":"assets/audio/acting/vo_yuzu_revive_1.mp3","text":"Back in command!","role":"yuzu","duration":918},"vo_yuzu_revive_2":{"url":"assets/audio/acting/vo_yuzu_revive_2.mp3","text":"The squad’s not done!","role":"yuzu","duration":1465},"vo_yuzu_win_1":{"url":"assets/audio/acting/vo_yuzu_win_1.mp3","text":"That’s my wonderful squad!","role":"yuzu","duration":1271},"vo_yuzu_win_2":{"url":"assets/audio/acting/vo_yuzu_win_2.mp3","text":"Everyone gets an orange!","role":"yuzu","duration":1137},"vo_b01_slip_1":{"url":"assets/audio/acting/vo_b01_slip_1.mp3","text":"My eggs… where are they?","role":"boss1","duration":1288},"vo_b01_slip_2":{"url":"assets/audio/acting/vo_b01_slip_2.mp3","text":"Please, leave the little ones alone.","role":"boss1","duration":1747},"vo_b02_slip_1":{"url":"assets/audio/acting/vo_b02_slip_1.mp3","text":"Those voices… I remember them.","role":"boss2","duration":2736},"vo_b02_slip_2":{"url":"assets/audio/acting/vo_b02_slip_2.mp3","text":"Please, let the water flow.","role":"boss2","duration":1694},"vo_b03_slip_1":{"url":"assets/audio/acting/vo_b03_slip_1.mp3","text":"Someone is waiting for a warm meal.","role":"boss3","duration":2415},"vo_b03_slip_2":{"url":"assets/audio/acting/vo_b03_slip_2.mp3","text":"I only wanted to feed them.","role":"boss3","duration":1359},"vo_b04_slip_1":{"url":"assets/audio/acting/vo_b04_slip_1.mp3","text":"Were they cold all this time?","role":"boss4","duration":1697},"vo_b04_slip_2":{"url":"assets/audio/acting/vo_b04_slip_2.mp3","text":"I wanted to keep them safe.","role":"boss4","duration":1288},"vo_b05_slip_1":{"url":"assets/audio/acting/vo_b05_slip_1.mp3","text":"So hungry… why am I hungry?","role":"boss5","duration":2601},"vo_b05_slip_2":{"url":"assets/audio/acting/vo_b05_slip_2.mp3","text":"The root is pulling me apart.","role":"boss5","duration":1573},"vo_b06_slip_1":{"url":"assets/audio/acting/vo_b06_slip_1.mp3","text":"Mother… can you hear me?","role":"boss6","duration":1149},"vo_b06_slip_2":{"url":"assets/audio/acting/vo_b06_slip_2.mp3","text":"I wanted a garden of my own.","role":"boss6","duration":1532},"vo_b07_slip_1":{"url":"assets/audio/acting/vo_b07_slip_1.mp3","text":"These voices… they have names.","role":"boss7","duration":3177},"vo_b07_slip_2":{"url":"assets/audio/acting/vo_b07_slip_2.mp3","text":"I can’t hold them all.","role":"boss7","duration":1276},"vo_b08_slip_1":{"url":"assets/audio/acting/vo_b08_slip_1.mp3","text":"My hive… did they have enough?","role":"boss8","duration":2068},"vo_b08_slip_2":{"url":"assets/audio/acting/vo_b08_slip_2.mp3","text":"That honey tastes wrong.","role":"boss8","duration":1785},"vo_b09_slip_1":{"url":"assets/audio/acting/vo_b09_slip_1.mp3","text":"Was there another season?","role":"boss9","duration":1174},"vo_b09_slip_2":{"url":"assets/audio/acting/vo_b09_slip_2.mp3","text":"I’m afraid to let today go.","role":"boss9","duration":1370},"vo_b10_slip_1":{"url":"assets/audio/acting/vo_b10_slip_1.mp3","text":"The garden… it is so heavy.","role":"boss10","duration":2409},"vo_b10_slip_2":{"url":"assets/audio/acting/vo_b10_slip_2.mp3","text":"There is someone beneath the roots.","role":"boss10","duration":1578},"vo_b11_slip_1":{"url":"assets/audio/acting/vo_b11_slip_1.mp3","text":"These fields need time to rest.","role":"boss11","duration":1983},"vo_b11_slip_2":{"url":"assets/audio/acting/vo_b11_slip_2.mp3","text":"Did anything survive the harvest?","role":"boss11","duration":1353},"vo_b12_slip_1":{"url":"assets/audio/acting/vo_b12_slip_1.mp3","text":"Was the orchard always so quiet?","role":"boss12","duration":1494},"vo_b12_slip_2":{"url":"assets/audio/acting/vo_b12_slip_2.mp3","text":"I remember something sweet.","role":"boss12","duration":1571},"vo_b13_slip_1":{"url":"assets/audio/acting/vo_b13_slip_1.mp3","text":"Can they grow beyond the glass?","role":"boss13","duration":2632},"vo_b13_slip_2":{"url":"assets/audio/acting/vo_b13_slip_2.mp3","text":"I only wanted to keep them safe.","role":"boss13","duration":1835},"vo_b14_slip_1":{"url":"assets/audio/acting/vo_b14_slip_1.mp3","text":"Seeds need soil, don’t they?","role":"boss14","duration":1625},"vo_b14_slip_2":{"url":"assets/audio/acting/vo_b14_slip_2.mp3","text":"What good is a seed that never grows?","role":"boss14","duration":1797},"vo_b15_slip_1":{"url":"assets/audio/acting/vo_b15_slip_1.mp3","text":"I wanted everyone to have enough.","role":"boss15","duration":1751},"vo_b15_slip_2":{"url":"assets/audio/acting/vo_b15_slip_2.mp3","text":"When did my wish become this?","role":"boss15","duration":1414},"vo_mint_unlock":{"url":"assets/audio/acting/vo_mint_unlock.mp3","text":"Chill. I’ve got your back.","role":"mint","duration":1337},"vo_cocoa_unlock":{"url":"assets/audio/acting/vo_cocoa_unlock.mp3","text":"Free at last. Can I nap now?","role":"cocoa","duration":2025},"vo_taro_unlock":{"url":"assets/audio/acting/vo_taro_unlock.mp3","text":"I’m free! Which way is adventure?","role":"taro","duration":2031},"vo_yuzu_unlock":{"url":"assets/audio/acting/vo_yuzu_unlock.mp3","text":"Citrus squad, ready to grow?","role":"yuzu","duration":1453},"vo_story_s02_1":{"url":"assets/audio/acting/vo_story_s02_1.mp3","text":"The Empress is free and her flavor came home. These pipes lead to where Grandma hid her jar.","role":"ruby","duration":5589},"vo_story_s02_2":{"url":"assets/audio/acting/vo_story_s02_2.mp3","text":"Before the Hunger caught her, Grandma dropped her jar into the cracks to keep it safe.","role":"ruby","duration":4339},"vo_story_s02_3":{"url":"assets/audio/acting/vo_story_s02_3.mp3","text":"Inside: Grandma’s Battle Recipes! Three seed styles for your Heart Seed; choose one on each floor.","role":"ruby","duration":7148},"vo_story_s03_1":{"url":"assets/audio/acting/vo_story_s03_1.mp3","text":"This furnace burns the flavor the Hunger steals. Every spark is a piece of someone.","role":"ruby","duration":5208},"vo_story_s03_2":{"url":"assets/audio/acting/vo_story_s03_2.mp3","text":"Look at those jars. Cursed mochi are trapped inside, drained of everything they are.","role":"ruby","duration":5092},"vo_story_s03_3":{"url":"assets/audio/acting/vo_story_s03_3.mp3","text":"Stop the furnace and their flavor comes home — then your seed can break their curse!","role":"ruby","duration":5242},"vo_story_s04_1":{"url":"assets/audio/acting/vo_story_s04_1.mp3","text":"Cursed mochi are frozen in here as fuel. Their voices tremble beneath the frost.","role":"ruby","duration":4504},"vo_story_s04_2":{"url":"assets/audio/acting/vo_story_s04_2.mp3","text":"That gentle voice… Grandma! She froze herself so the Hunger could not eat her last page.","role":"ruby","duration":7465},"vo_story_s04_3":{"url":"assets/audio/acting/vo_story_s04_3.mp3","text":"Her flavor is locked inside the Crown itself. We free the others now — then we go get hers.","role":"ruby","duration":5682},"vo_story_s05_1":{"url":"assets/audio/acting/vo_story_s05_1.mp3","text":"The Crown Oven. A root of the Crown comes up here to drink the whole kitchen’s flavor.","role":"ruby","duration":5339},"vo_story_s05_2":{"url":"assets/audio/acting/vo_story_s05_2.mp3","text":"I’m frightened. But Grandma is waiting, and the First Tree is starving.","role":"ruby","duration":3878},"vo_story_s05_3":{"url":"assets/audio/acting/vo_story_s05_3.mp3","text":"Let’s cut this root together. Then we follow it — all the way to the Crown.","role":"ruby","duration":4522},"vo_story_s06_1":{"url":"assets/audio/acting/vo_story_s06_1.mp3","text":"A cursed friend is trapped here, drained of flavor…","role":"ruby","duration":2799},"vo_story_s06_2":{"url":"assets/audio/acting/vo_story_s06_2.mp3","text":"The Heart Seed glows in Strawberry’s hands.","role":"ruby","duration":2589},"vo_story_s06_3":{"url":"assets/audio/acting/vo_story_s06_3.mp3","text":"The curse breaks!","role":"ruby","duration":1125},"vo_story_s06_4":{"url":"assets/audio/acting/vo_story_s06_4.mp3","text":"Mint, the village healer, is a person again — and her frost can freeze the sour drains!","role":"ruby","duration":5165},"vo_story_s07_1":{"url":"assets/audio/acting/vo_story_s07_1.mp3","text":"A cursed friend is trapped here, drained of flavor…","role":"ruby","duration":2994},"vo_story_s07_2":{"url":"assets/audio/acting/vo_story_s07_2.mp3","text":"The Heart Seed glows in Strawberry’s hands.","role":"ruby","duration":2243},"vo_story_s07_3":{"url":"assets/audio/acting/vo_story_s07_3.mp3","text":"The curse breaks!","role":"ruby","duration":1128},"vo_story_s07_4":{"url":"assets/audio/acting/vo_story_s07_4.mp3","text":"Cocoa, the old gate guard, is back — ready to punch through the iron machines!","role":"ruby","duration":4679},"vo_story_s08_1":{"url":"assets/audio/acting/vo_story_s08_1.mp3","text":"A cursed friend is trapped here, drained of flavor…","role":"ruby","duration":3090},"vo_story_s08_2":{"url":"assets/audio/acting/vo_story_s08_2.mp3","text":"The Heart Seed glows in Strawberry’s hands.","role":"ruby","duration":2765},"vo_story_s08_3":{"url":"assets/audio/acting/vo_story_s08_3.mp3","text":"The curse breaks!","role":"ruby","duration":1057},"vo_story_s08_4":{"url":"assets/audio/acting/vo_story_s08_4.mp3","text":"Taro, the kingdom’s mapmaker, is free — his lightning leaps from guard to guard!","role":"ruby","duration":4572},"vo_story_s09_1":{"url":"assets/audio/acting/vo_story_s09_1.mp3","text":"A cursed friend is trapped here, drained of flavor…","role":"ruby","duration":3514},"vo_story_s09_2":{"url":"assets/audio/acting/vo_story_s09_2.mp3","text":"The Heart Seed glows in Strawberry’s hands.","role":"ruby","duration":2363},"vo_story_s09_3":{"url":"assets/audio/acting/vo_story_s09_3.mp3","text":"The curse breaks!","role":"ruby","duration":1291},"vo_story_s09_4":{"url":"assets/audio/acting/vo_story_s09_4.mp3","text":"Yuzu, the orange grower, is herself again — with her little Yuzling close by!","role":"ruby","duration":4955},"vo_story_s11_1":{"url":"assets/audio/acting/vo_story_s11_1.mp3","text":"The Crown Oven goes cold. The wounded root tears itself free…","role":"ruby","duration":4427},"vo_story_s11_2":{"url":"assets/audio/acting/vo_story_s11_2.mp3","text":"…and burrows down through the earth, toward the garden below.","role":"ruby","duration":3888},"vo_story_s12_1":{"url":"assets/audio/acting/vo_story_s12_1.mp3","text":"The wounded root fled into the Fermented Canopy…","role":"ruby","duration":2847},"vo_story_s12_2":{"url":"assets/audio/acting/vo_story_s12_2.mp3","text":"…and there it grows the Hunger a new body from stolen memories.","role":"ruby","duration":3587},"vo_story_s13_1":{"url":"assets/audio/acting/vo_story_s13_1.mp3","text":"The Root Throne falls. Freed memories drift home like tiny lights.","role":"ruby","duration":5076},"vo_story_s13_2":{"url":"assets/audio/acting/vo_story_s13_2.mp3","text":"The Heart Seed blazes and points the way — toward the First Tree.","role":"ruby","duration":4362},"vo_story_s14_1":{"url":"assets/audio/acting/vo_story_s14_1.mp3","text":"Beyond the garden, the fields are grey. Every flavor here is already gone.","role":"ruby","duration":4563},"vo_story_s14_2":{"url":"assets/audio/acting/vo_story_s14_2.mp3","text":"On the far hill stands the First Tree, black roots climbing its trunk. The Hunger is almost there.","role":"ruby","duration":6976},"vo_story_s15_1":{"url":"assets/audio/acting/vo_story_s15_1.mp3","text":"Broken mirrors hold the kingdom’s memories — people laughing, before the Crown.","role":"ruby","duration":4303},"vo_story_s15_2":{"url":"assets/audio/acting/vo_story_s15_2.mp3","text":"One mirror shows a pink-haired girl with her family. Strawberry remembers.","role":"ruby","duration":4304},"vo_story_s16_1":{"url":"assets/audio/acting/vo_story_s16_1.mp3","text":"The First Planter kneels and lifts the Crown from the First Tree.","role":"ruby","duration":3769},"vo_story_s16_2":{"url":"assets/audio/acting/vo_story_s16_2.mp3","text":"The Crown cracks apart!","role":"ruby","duration":1334},"vo_story_s16_3":{"url":"assets/audio/acting/vo_story_s16_3.mp3","text":"Strawberry plants the Heart Seed at the roots.","role":"ruby","duration":2252},"vo_story_s16_4":{"url":"assets/audio/acting/vo_story_s16_4.mp3","text":"A new tree grows, and the stolen flavor rushes back to every home.","role":"ruby","duration":4990},"vo_story_s16_5":{"url":"assets/audio/acting/vo_story_s16_5.mp3","text":"One by one, the people of Mochitopia become themselves again.","role":"ruby","duration":3737},"vo_story_s16_6":{"url":"assets/audio/acting/vo_story_s16_6.mp3","text":"Grandma is free. Ruby hugs her and will not let go.","role":"ruby","duration":3244},"vo_story_s16_7":{"url":"assets/audio/acting/vo_story_s16_7.mp3","text":"Deep below, the Hunger curls up and falls asleep… for now.","role":"ruby","duration":3565},"vo_story_s17_1":{"url":"assets/audio/acting/vo_story_s17_1.mp3","text":"In the dark beneath Mochitopia, the Hunger opens one eye.","role":"ruby","duration":3632},"vo_story_s17_2":{"url":"assets/audio/acting/vo_story_s17_2.mp3","text":"The way down is open. Together, the friends step into the Delve.","role":"ruby","duration":3787},"vo_story_b01_memory_1":{"url":"assets/audio/acting/vo_story_b01_memory_1.mp3","text":"The Empress once bargained with the Crown to keep her eggs alive.","role":"ruby","duration":3755},"vo_story_b01_memory_2":{"url":"assets/audio/acting/vo_story_b01_memory_2.mp3","text":"The crystal saved the nursery — then ordered even its youngest workers into battle.","role":"ruby","duration":5212},"vo_story_b02_memory_1":{"url":"assets/audio/acting/vo_story_b02_memory_1.mp3","text":"Clogmaw kept the scraps and forgotten flavors that washed into the drains.","role":"ruby","duration":4075},"vo_story_b02_memory_2":{"url":"assets/audio/acting/vo_story_b02_memory_2.mp3","text":"The Crown twisted his care into hoarding, until no water or memory could escape.","role":"ruby","duration":3848},"vo_story_b03_memory_1":{"url":"assets/audio/acting/vo_story_b03_memory_1.mp3","text":"Mr. Griddle once kept the royal kitchen warm for everyone.","role":"ruby","duration":3084},"vo_story_b03_memory_2":{"url":"assets/audio/acting/vo_story_b03_memory_2.mp3","text":"The Crown made him burn stolen memories. He forgot every recipe except: keep the fire alive.","role":"ruby","duration":6223},"vo_story_b04_memory_1":{"url":"assets/audio/acting/vo_story_b04_memory_1.mp3","text":"The Golem believed that people frozen in his prison would be safe from the Hunger.","role":"ruby","duration":4345},"vo_story_b04_memory_2":{"url":"assets/audio/acting/vo_story_b04_memory_2.mp3","text":"But the ice could not stop their names from fading. Grandma’s cure still lay beyond it, inside the Crown.","role":"ruby","duration":7594},"vo_story_b05_memory_1":{"url":"assets/audio/acting/vo_story_b05_memory_1.mp3","text":"This creature was only the mouth of one root beneath the Crown Oven.","role":"ruby","duration":3628},"vo_story_b05_memory_2":{"url":"assets/audio/acting/vo_story_b05_memory_2.mp3","text":"It grew from a wish to end hunger, then learned to feed on the kingdom’s flavor.","role":"ruby","duration":4365},"vo_story_b06_memory_1":{"url":"assets/audio/acting/vo_story_b06_memory_1.mp3","text":"The wounded root grew a daughter from flavors stolen from the garden.","role":"ruby","duration":3278},"vo_story_b06_memory_2":{"url":"assets/audio/acting/vo_story_b06_memory_2.mp3","text":"The Bud gathered more memories, hoping her mother would finally call her a real flower.","role":"ruby","duration":4711},"vo_story_b07_memory_1":{"url":"assets/audio/acting/vo_story_b07_memory_1.mp3","text":"The Behemoth held the marsh’s memories together inside one great fungal body.","role":"ruby","duration":4311},"vo_story_b07_memory_2":{"url":"assets/audio/acting/vo_story_b07_memory_2.mp3","text":"Every stranger felt like a wound. Poison became the only protection the colony remembered.","role":"ruby","duration":5666},"vo_story_b08_memory_1":{"url":"assets/audio/acting/vo_story_b08_memory_1.mp3","text":"The Hornet Queen once shared her hive’s nectar with the whole garden.","role":"ruby","duration":4061},"vo_story_b08_memory_2":{"url":"assets/audio/acting/vo_story_b08_memory_2.mp3","text":"The Crown spoiled the royal stores. Too proud to admit it, she fed her workers the curse.","role":"ruby","duration":6193},"vo_story_b09_memory_1":{"url":"assets/audio/acting/vo_story_b09_memory_1.mp3","text":"When the curse began, the Orchid stopped time to save one perfect bloom.","role":"ruby","duration":4865},"vo_story_b09_memory_2":{"url":"assets/audio/acting/vo_story_b09_memory_2.mp3","text":"Centuries passed outside. Inside, all four seasons struggled through the same unfinished day.","role":"ruby","duration":6780},"vo_story_b10_memory_1":{"url":"assets/audio/acting/vo_story_b10_memory_1.mp3","text":"The garden’s stolen flavors gathered inside the Hunger’s new heart.","role":"ruby","duration":4285},"vo_story_b10_memory_2":{"url":"assets/audio/acting/vo_story_b10_memory_2.mp3","text":"The Rootmother called them her children — and would not let a single memory go home.","role":"ruby","duration":4824},"vo_story_b11_memory_1":{"url":"assets/audio/acting/vo_story_b11_memory_1.mp3","text":"The Colossus had sworn to leave no field ungathered while anyone was hungry.","role":"ruby","duration":4878},"vo_story_b11_memory_2":{"url":"assets/audio/acting/vo_story_b11_memory_2.mp3","text":"Even after the Crown took every crop, he kept harvesting ash rather than break his oath.","role":"ruby","duration":4251},"vo_story_b12_memory_1":{"url":"assets/audio/acting/vo_story_b12_memory_1.mp3","text":"She had been the orchard’s last flower before the Crown stole her sweetness.","role":"ruby","duration":4400},"vo_story_b12_memory_2":{"url":"assets/audio/acting/vo_story_b12_memory_2.mp3","text":"She tried filling that empty place with other flavors. Every stolen taste made it larger.","role":"ruby","duration":5679},"vo_story_b13_memory_1":{"url":"assets/audio/acting/vo_story_b13_memory_1.mp3","text":"The Gardener hid the old kingdom’s memories inside living glass.","role":"ruby","duration":3627},"vo_story_b13_memory_2":{"url":"assets/audio/acting/vo_story_b13_memory_2.mp3","text":"He cut away every future that might hurt them — including the path that could set them free.","role":"ruby","duration":5612},"vo_story_b14_memory_1":{"url":"assets/audio/acting/vo_story_b14_memory_1.mp3","text":"For centuries, the Seedwarden counted seeds that had never touched soil.","role":"ruby","duration":4817},"vo_story_b14_memory_2":{"url":"assets/audio/acting/vo_story_b14_memory_2.mp3","text":"A new seed might repeat the curse. A locked vault felt safer than choosing hope.","role":"ruby","duration":4540},"vo_story_b15_memory_1":{"url":"assets/audio/acting/vo_story_b15_memory_1.mp3","text":"The First Planter crowned the First Tree because he feared another famine.","role":"ruby","duration":3535},"vo_story_b15_memory_2":{"url":"assets/audio/acting/vo_story_b15_memory_2.mp3","text":"He called the Crown salvation. Defeat finally made him face what his wish had cost.","role":"ruby","duration":5032},"vo_b01_fight_3":{"url":"assets/audio/acting/vo_b01_fight_3.mp3","text":"You will not win, mochi!","role":"boss1","duration":1683},"vo_b02_fight_3":{"url":"assets/audio/acting/vo_b02_fight_3.mp3","text":"Clogged forever!","role":"boss2","duration":1440},"vo_b03_fight_3":{"url":"assets/audio/acting/vo_b03_fight_3.mp3","text":"The stove never sleeps!","role":"boss3","duration":1741},"vo_b04_fight_3":{"url":"assets/audio/acting/vo_b04_fight_3.mp3","text":"You will freeze solid!","role":"boss4","duration":1409},"vo_b05_fight_3":{"url":"assets/audio/acting/vo_b05_fight_3.mp3","text":"Feed me more!","role":"boss5","duration":1068},"vo_b06_fight_3":{"url":"assets/audio/acting/vo_b06_fight_3.mp3","text":"Breathe it in!","role":"boss6","duration":1054},"vo_b07_fight_3":{"url":"assets/audio/acting/vo_b07_fight_3.mp3","text":"The swamp is alive!","role":"boss7","duration":1207},"vo_b08_fight_3":{"url":"assets/audio/acting/vo_b08_fight_3.mp3","text":"Bzzz!","role":"boss8","duration":699},"vo_b09_fight_3":{"url":"assets/audio/acting/vo_b09_fight_3.mp3","text":"Time is up for you!","role":"boss9","duration":1083},"vo_b10_fight_3":{"url":"assets/audio/acting/vo_b10_fight_3.mp3","text":"My roots run deep!","role":"boss10","duration":1240},"vo_b11_fight_3":{"url":"assets/audio/acting/vo_b11_fight_3.mp3","text":"My scythe is hungry!","role":"boss11","duration":1782},"vo_b12_fight_3":{"url":"assets/audio/acting/vo_b12_fight_3.mp3","text":"Nothing tastes good!","role":"boss12","duration":1294},"vo_b13_fight_3":{"url":"assets/audio/acting/vo_b13_fight_3.mp3","text":"Look, but do not touch!","role":"boss13","duration":1367},"vo_b14_fight_3":{"url":"assets/audio/acting/vo_b14_fight_3.mp3","text":"Give up, mochi!","role":"boss14","duration":1236},"vo_b15_fight_3":{"url":"assets/audio/acting/vo_b15_fight_3.mp3","text":"Why do you fight me?","role":"boss15","duration":1172},"vo_sesame_start_1":{"url":"assets/audio/acting/vo_sesame_start_1.mp3","text":"Let’s begin quietly.","role":"sesame","duration":1387},"vo_sesame_start_2":{"url":"assets/audio/acting/vo_sesame_start_2.mp3","text":"I’ll find the right combination.","role":"sesame","duration":1742},"vo_sesame_unique_1":{"url":"assets/audio/acting/vo_sesame_unique_1.mp3","text":"Runes, come together.","role":"sesame","duration":1625},"vo_sesame_unique_2":{"url":"assets/audio/acting/vo_sesame_unique_2.mp3","text":"Let the elements answer.","role":"sesame","duration":1115},"vo_sesame_levelup_1":{"url":"assets/audio/acting/vo_sesame_levelup_1.mp3","text":"A clearer pattern.","role":"sesame","duration":1159},"vo_sesame_levelup_2":{"url":"assets/audio/acting/vo_sesame_levelup_2.mp3","text":"The runes feel warmer.","role":"sesame","duration":1362},"vo_sesame_evolve_1":{"url":"assets/audio/acting/vo_sesame_evolve_1.mp3","text":"A new combination.","role":"sesame","duration":927},"vo_sesame_evolve_2":{"url":"assets/audio/acting/vo_sesame_evolve_2.mp3","text":"I think I understand.","role":"sesame","duration":1197},"vo_sesame_boss_1":{"url":"assets/audio/acting/vo_sesame_boss_1.mp3","text":"Stay close to me.","role":"sesame","duration":1014},"vo_sesame_boss_2":{"url":"assets/audio/acting/vo_sesame_boss_2.mp3","text":"That is a powerful aura.","role":"sesame","duration":1170},"vo_sesame_lowhp_1":{"url":"assets/audio/acting/vo_sesame_lowhp_1.mp3","text":"I need a moment.","role":"sesame","duration":1057},"vo_sesame_lowhp_2":{"url":"assets/audio/acting/vo_sesame_lowhp_2.mp3","text":"The runes are fading.","role":"sesame","duration":1182},"vo_sesame_revive_1":{"url":"assets/audio/acting/vo_sesame_revive_1.mp3","text":"I can still cast.","role":"sesame","duration":1392},"vo_sesame_revive_2":{"url":"assets/audio/acting/vo_sesame_revive_2.mp3","text":"The pattern holds.","role":"sesame","duration":1170},"vo_sesame_win_1":{"url":"assets/audio/acting/vo_sesame_win_1.mp3","text":"The light is calm again.","role":"sesame","duration":1230},"vo_sesame_win_2":{"url":"assets/audio/acting/vo_sesame_win_2.mp3","text":"We found our way.","role":"sesame","duration":1260},"vo_sesame_lobby_1":{"url":"assets/audio/acting/vo_sesame_lobby_1.mp3","text":"Oh! You saw me. Hi.","role":"sesame","duration":1986},"vo_sesame_lobby_2":{"url":"assets/audio/acting/vo_sesame_lobby_2.mp3","text":"Shh… the mirrors are napping.","role":"sesame","duration":2276},"vo_sesame_lobby_3":{"url":"assets/audio/acting/vo_sesame_lobby_3.mp3","text":"I polished you a safe spot.","role":"sesame","duration":1624},"vo_ruby_tip_yuzuAim":{"url":"assets/audio/acting/vo_ruby_tip_yuzuAim.mp3","text":"Yuzu’s seeds fly where you walk. Your buddy hits the marked target first!","role":"ruby","duration":4623},"vo_ruby_tip_hunt":{"url":"assets/audio/acting/vo_ruby_tip_hunt.mp3","text":"Beat the leader with the mark fast — its poison grows!","role":"ruby","duration":3124},"vo_ruby_tip_huntClear":{"url":"assets/audio/acting/vo_ruby_tip_huntClear.mp3","text":"Clear the crowd, then beat the marked leader!","role":"ruby","duration":2065},"vo_strawberry_unique_sniper_1":{"url":"assets/audio/acting/vo_strawberry_unique_sniper_1.mp3","text":"Bullseye, berry style!","role":"strawberry","duration":1160.63},"vo_strawberry_unique_sniper_2":{"url":"assets/audio/acting/vo_strawberry_unique_sniper_2.mp3","text":"Hold still… gotcha!","role":"strawberry","duration":944.06},"vo_strawberry_unique_sniper_3":{"url":"assets/audio/acting/vo_strawberry_unique_sniper_3.mp3","text":"One shot, all flavor!","role":"strawberry","duration":1056.37},"vo_strawberry_unique_shotgun_1":{"url":"assets/audio/acting/vo_strawberry_unique_shotgun_1.mp3","text":"Berry blast!","role":"strawberry","duration":688.57},"vo_strawberry_unique_shotgun_2":{"url":"assets/audio/acting/vo_strawberry_unique_shotgun_2.mp3","text":"Up close and juicy!","role":"strawberry","duration":1258.89},"vo_strawberry_unique_shotgun_3":{"url":"assets/audio/acting/vo_strawberry_unique_shotgun_3.mp3","text":"Pop pop POP!","role":"strawberry","duration":975.19},"vo_strawberry_unique_ricochet_1":{"url":"assets/audio/acting/vo_strawberry_unique_ricochet_1.mp3","text":"Bounce, little hearts!","role":"strawberry","duration":1250.18},"vo_strawberry_unique_ricochet_2":{"url":"assets/audio/acting/vo_strawberry_unique_ricochet_2.mp3","text":"Ping, ping, ping!","role":"strawberry","duration":802.29},"vo_strawberry_unique_ricochet_3":{"url":"assets/audio/acting/vo_strawberry_unique_ricochet_3.mp3","text":"Find them, hearts!","role":"strawberry","duration":1230.25},"vo_mint_unique_glacier_1":{"url":"assets/audio/acting/vo_mint_unique_glacier_1.mp3","text":"Bloom, glacier.","role":"mint","duration":1253.65},"vo_mint_unique_glacier_2":{"url":"assets/audio/acting/vo_mint_unique_glacier_2.mp3","text":"Stay frozen.","role":"mint","duration":589.59},"vo_mint_unique_glacier_3":{"url":"assets/audio/acting/vo_mint_unique_glacier_3.mp3","text":"Cold, isn’t it?","role":"mint","duration":894.63},"vo_mint_unique_barrage_1":{"url":"assets/audio/acting/vo_mint_unique_barrage_1.mp3","text":"Snowfall.","role":"mint","duration":1158.16},"vo_mint_unique_barrage_2":{"url":"assets/audio/acting/vo_mint_unique_barrage_2.mp3","text":"Don’t move.","role":"mint","duration":1152.9},"vo_mint_unique_barrage_3":{"url":"assets/audio/acting/vo_mint_unique_barrage_3.mp3","text":"Let it snow.","role":"mint","duration":1171.16},"vo_mint_unique_pierce_1":{"url":"assets/audio/acting/vo_mint_unique_pierce_1.mp3","text":"Through you.","role":"mint","duration":872.29},"vo_mint_unique_pierce_2":{"url":"assets/audio/acting/vo_mint_unique_pierce_2.mp3","text":"Ice lance.","role":"mint","duration":1114.4},"vo_mint_unique_pierce_3":{"url":"assets/audio/acting/vo_mint_unique_pierce_3.mp3","text":"One clean line.","role":"mint","duration":1253.72},"vo_cocoa_unique_brawler_1":{"url":"assets/audio/acting/vo_cocoa_unique_brawler_1.mp3","text":"Fire fists, go!","role":"cocoa","duration":879.39},"vo_cocoa_unique_brawler_2":{"url":"assets/audio/acting/vo_cocoa_unique_brawler_2.mp3","text":"Toasty punches!","role":"cocoa","duration":824.01},"vo_cocoa_unique_brawler_3":{"url":"assets/audio/acting/vo_cocoa_unique_brawler_3.mp3","text":"Hot cocoa, extra hot!","role":"cocoa","duration":1242.74},"vo_cocoa_unique_titan_1":{"url":"assets/audio/acting/vo_cocoa_unique_titan_1.mp3","text":"Ground, shake!","role":"cocoa","duration":749.39},"vo_cocoa_unique_titan_2":{"url":"assets/audio/acting/vo_cocoa_unique_titan_2.mp3","text":"Big bear stomp!","role":"cocoa","duration":932.29},"vo_cocoa_unique_titan_3":{"url":"assets/audio/acting/vo_cocoa_unique_titan_3.mp3","text":"Everybody, down!","role":"cocoa","duration":844.15},"vo_cocoa_unique_dashboxer_1":{"url":"assets/audio/acting/vo_cocoa_unique_dashboxer_1.mp3","text":"Bear rush!","role":"cocoa","duration":753.67},"vo_cocoa_unique_dashboxer_2":{"url":"assets/audio/acting/vo_cocoa_unique_dashboxer_2.mp3","text":"Coming through!","role":"cocoa","duration":762.59},"vo_cocoa_unique_dashboxer_3":{"url":"assets/audio/acting/vo_cocoa_unique_dashboxer_3.mp3","text":"Hug incoming!","role":"cocoa","duration":775.42},"vo_taro_unique_storm_1":{"url":"assets/audio/acting/vo_taro_unique_storm_1.mp3","text":"Chain lightning!","role":"taro","duration":798.12},"vo_taro_unique_storm_2":{"url":"assets/audio/acting/vo_taro_unique_storm_2.mp3","text":"Jump, sparks, jump!","role":"taro","duration":1190.52},"vo_taro_unique_storm_3":{"url":"assets/audio/acting/vo_taro_unique_storm_3.mp3","text":"Everyone gets a zap!","role":"taro","duration":823.63},"vo_taro_unique_tempest_1":{"url":"assets/audio/acting/vo_taro_unique_tempest_1.mp3","text":"Sentries, on duty!","role":"taro","duration":1259.82},"vo_taro_unique_tempest_2":{"url":"assets/audio/acting/vo_taro_unique_tempest_2.mp3","text":"Guard this spot!","role":"taro","duration":997.14},"vo_taro_unique_tempest_3":{"url":"assets/audio/acting/vo_taro_unique_tempest_3.mp3","text":"Zap anything weird!","role":"taro","duration":1257.48},"vo_taro_unique_smite_1":{"url":"assets/audio/acting/vo_taro_unique_smite_1.mp3","text":"Lightning, right there!","role":"taro","duration":864.74},"vo_taro_unique_smite_2":{"url":"assets/audio/acting/vo_taro_unique_smite_2.mp3","text":"Spark strike!","role":"taro","duration":1250.63},"vo_taro_unique_smite_3":{"url":"assets/audio/acting/vo_taro_unique_smite_3.mp3","text":"Bonk! …With thunder.","role":"taro","duration":1030.09},"vo_yuzu_unique_citrusGuardian_1":{"url":"assets/audio/acting/vo_yuzu_unique_citrusGuardian_1.mp3","text":"Pomelo, smash!","role":"yuzu","duration":942.68},"vo_yuzu_unique_citrusGuardian_2":{"url":"assets/audio/acting/vo_yuzu_unique_citrusGuardian_2.mp3","text":"Big peel, big punch!","role":"yuzu","duration":1256.71},"vo_yuzu_unique_citrusGuardian_3":{"url":"assets/audio/acting/vo_yuzu_unique_citrusGuardian_3.mp3","text":"Shield up, squad!","role":"yuzu","duration":1250.7},"vo_yuzu_unique_zestSwarm_1":{"url":"assets/audio/acting/vo_yuzu_unique_zestSwarm_1.mp3","text":"Lime, take aim!","role":"yuzu","duration":1254.94},"vo_yuzu_unique_zestSwarm_2":{"url":"assets/audio/acting/vo_yuzu_unique_zestSwarm_2.mp3","text":"Right through them!","role":"yuzu","duration":739.59},"vo_yuzu_unique_zestSwarm_3":{"url":"assets/audio/acting/vo_yuzu_unique_zestSwarm_3.mp3","text":"Sharp and sour!","role":"yuzu","duration":899.32},"vo_yuzu_unique_juiceWorkshop_1":{"url":"assets/audio/acting/vo_yuzu_unique_juiceWorkshop_1.mp3","text":"Blood Orange, now!","role":"yuzu","duration":936.35},"vo_yuzu_unique_juiceWorkshop_2":{"url":"assets/audio/acting/vo_yuzu_unique_juiceWorkshop_2.mp3","text":"Stir up a storm!","role":"yuzu","duration":834.22},"vo_yuzu_unique_juiceWorkshop_3":{"url":"assets/audio/acting/vo_yuzu_unique_juiceWorkshop_3.mp3","text":"Seeds, find them!","role":"yuzu","duration":805.42},"vo_sesame_unique_3":{"url":"assets/audio/acting/vo_sesame_unique_3.mp3","text":"Mirror, remember.","role":"sesame","duration":894.35},"vo_sesame_unique_4":{"url":"assets/audio/acting/vo_sesame_unique_4.mp3","text":"Quietly… now.","role":"sesame","duration":804.1},"vo_pomelo_duo_1":{"url":"assets/audio/acting/vo_pomelo_duo_1.mp3","text":"Hmph!","role":"pomelo","duration":268.57},"vo_pomelo_duo_2":{"url":"assets/audio/acting/vo_pomelo_duo_2.mp3","text":"Pomelo… SMASH!","role":"pomelo","duration":840.73},"vo_lime_duo_1":{"url":"assets/audio/acting/vo_lime_duo_1.mp3","text":"Loosed.","role":"lime","duration":419.48},"vo_lime_duo_2":{"url":"assets/audio/acting/vo_lime_duo_2.mp3","text":"Got it!","role":"lime","duration":377.07},"vo_bloodorange_duo_1":{"url":"assets/audio/acting/vo_bloodorange_duo_1.mp3","text":"Burn sweet.","role":"bloodorange","duration":837.64},"vo_bloodorange_duo_2":{"url":"assets/audio/acting/vo_bloodorange_duo_2.mp3","text":"Seek.","role":"bloodorange","duration":567.91}};
/* v8.1.43 A09 Ruby ในด่าน: เตือนสั้น 14 + ปฏิกิริยา 14 */
Object.assign(A07_CATALOG,{"vo_sesame_spell_ppp":{"url":"assets/audio/acting/vo_sesame_spell_ppp.mp3","text":"Fall, little suns.","role":"sesame","duration":1127},"vo_sesame_spell_mmm":{"url":"assets/audio/acting/vo_sesame_spell_mmm.mp3","text":"Spin, winds.","role":"sesame","duration":1103},"vo_sesame_spell_bbb":{"url":"assets/audio/acting/vo_sesame_spell_bbb.mp3","text":"Tide, hold me.","role":"sesame","duration":1203},"vo_sesame_spell_ppm":{"url":"assets/audio/acting/vo_sesame_spell_ppm.mp3","text":"Sunlance.","role":"sesame","duration":782},"vo_sesame_spell_ppb":{"url":"assets/audio/acting/vo_sesame_spell_ppb.mp3","text":"Bloom, magma.","role":"sesame","duration":1044},"vo_sesame_spell_pmm":{"url":"assets/audio/acting/vo_sesame_spell_pmm.mp3","text":"Shine brighter.","role":"sesame","duration":840},"vo_sesame_spell_mmb":{"url":"assets/audio/acting/vo_sesame_spell_mmb.mp3","text":"Gather in.","role":"sesame","duration":884},"vo_sesame_spell_pbb":{"url":"assets/audio/acting/vo_sesame_spell_pbb.mp3","text":"Crack open.","role":"sesame","duration":1054},"vo_sesame_spell_mbb":{"url":"assets/audio/acting/vo_sesame_spell_mbb.mp3","text":"Into the mist.","role":"sesame","duration":852},"vo_sesame_spell_pmb":{"url":"assets/audio/acting/vo_sesame_spell_pmb.mp3","text":"All three… now.","role":"sesame","duration":1186},"vo_ruby_objective_safe":{"url":"assets/audio/acting/vo_ruby_objective_safe.mp3","text":"We did it! Another little piece of flavor is safe. Nice work!","role":"ruby","duration":3010},"vo_ruby_guide_rank_1":{"url":"assets/audio/acting/vo_ruby_guide_rank_1.mp3","text":"Rank up! You earned a Rank Reward.","role":"ruby","duration":1484},"vo_ruby_guide_rank_2":{"url":"assets/audio/acting/vo_ruby_guide_rank_2.mp3","text":"Tap Rank Rewards to pick one. It stays forever.","role":"ruby","duration":2257},"vo_ruby_guide_stars_1":{"url":"assets/audio/acting/vo_ruby_guide_stars_1.mp3","text":"Each floor has three stars: clear it, finish with 70% HP, and never fall below 30% HP.","role":"ruby","duration":5450},"vo_ruby_guide_stars_2":{"url":"assets/audio/acting/vo_ruby_guide_stars_2.mp3","text":"New stars give bonus Sugar. Tap the stage box any time to replay a floor.","role":"ruby","duration":4192},"vo_sesame_unlock":{"url":"assets/audio/acting/vo_sesame_unlock.mp3","text":"I remember now… let’s go together.","role":"sesame","duration":1823},"vo_ruby_tut_welcome":{"url":"assets/audio/acting/vo_ruby_tut_welcome.mp3","text":"Hi, I’m Ruby! The Heart Seed broke your curse — you’re a person again! Let’s get you ready to save the others.","role":"ruby","duration":5964},"vo_ruby_tut_move":{"url":"assets/audio/acting/vo_ruby_tut_move.mp3","text":"Slide one finger to walk. Lift it to stop.","role":"ruby","duration":2201},"vo_ruby_tut_attack":{"url":"assets/audio/acting/vo_ruby_tut_attack.mp3","text":"Your Heart Seed fights on its own. Just walk near the sour critters!","role":"ruby","duration":3809},"vo_ruby_tut_sweets":{"url":"assets/audio/acting/vo_ruby_tut_sweets.mp3","text":"Beaten foes drop stolen sweets. Walk over them to take them back!","role":"ruby","duration":3411},"vo_ruby_tut_cards":{"url":"assets/audio/acting/vo_ruby_tut_cards.mp3","text":"Full EXP bar = 3 flavor cards. Tap one to read, tap again to take it.","role":"ruby","duration":5440},"vo_ruby_tut_dash":{"url":"assets/audio/acting/vo_ruby_tut_dash.mp3","text":"Green button: zoom past danger. It needs a moment to recharge.","role":"ruby","duration":3218},"vo_ruby_tut_unique":{"url":"assets/audio/acting/vo_ruby_tut_unique.mp3","text":"Pink button: your seed’s big attack. It charges up again over time.","role":"ruby","duration":3340},"vo_ruby_tut_hp":{"url":"assets/audio/acting/vo_ruby_tut_hp.mp3","text":"HP at zero ends the stage. Pink mochi hearts heal you.","role":"ruby","duration":2897},"vo_ruby_tut_ready":{"url":"assets/audio/acting/vo_ruby_tut_ready.mp3","text":"Training complete! Use your starter Sugar to upgrade one core, then enter the pantry.","role":"ruby","duration":4873},"vo_ruby_tut_move_go":{"url":"assets/audio/acting/vo_ruby_tut_move_go.mp3","text":"Slide your finger to walk","role":"ruby","duration":1311},"vo_ruby_tut_attack_go":{"url":"assets/audio/acting/vo_ruby_tut_attack_go.mp3","text":"Defeat the enemies","role":"ruby","duration":1268},"vo_ruby_tut_sweets_go":{"url":"assets/audio/acting/vo_ruby_tut_sweets_go.mp3","text":"Pick up the sweets","role":"ruby","duration":957},"vo_ruby_tut_cards_go":{"url":"assets/audio/acting/vo_ruby_tut_cards_go.mp3","text":"Pick a card","role":"ruby","duration":793},"vo_ruby_tut_dash_go":{"url":"assets/audio/acting/vo_ruby_tut_dash_go.mp3","text":"TAP Dash two times","role":"ruby","duration":1475},"vo_ruby_tut_unique_go":{"url":"assets/audio/acting/vo_ruby_tut_unique_go.mp3","text":"TAP your Unique","role":"ruby","duration":1174}});   /* v8.1.65 ใบ A11 ส่วน A2/C */
Object.assign(A07_CATALOG,{"vo_ruby_short_yuzuAim":{"url":"assets/audio/acting/vo_ruby_short_yuzuAim.mp3","text":"Walk toward an enemy to mark it!","role":"ruby","duration":1324},"vo_ruby_short_survive":{"url":"assets/audio/acting/vo_ruby_short_survive.mp3","text":"Hang on until the timer ends!","role":"ruby","duration":1380},"vo_ruby_short_fill":{"url":"assets/audio/acting/vo_ruby_short_fill.mp3","text":"Fill the meter!","role":"ruby","duration":706},"vo_ruby_short_hunt":{"url":"assets/audio/acting/vo_ruby_short_hunt.mp3","text":"Chase the marked Elite!","role":"ruby","duration":1110},"vo_ruby_short_huntClear":{"url":"assets/audio/acting/vo_ruby_short_huntClear.mp3","text":"Clear the crowd, then the marked Elite!","role":"ruby","duration":1619},"vo_ruby_short_purge":{"url":"assets/audio/acting/vo_ruby_short_purge.mp3","text":"Keep the Wisp safe from red raiders!","role":"ruby","duration":1799},"vo_ruby_short_capture":{"url":"assets/audio/acting/vo_ruby_short_capture.mp3","text":"Touch the crack, clear the holes!","role":"ruby","duration":1775},"vo_ruby_short_defendNectar":{"url":"assets/audio/acting/vo_ruby_short_defendNectar.mp3","text":"Protect the flower!","role":"ruby","duration":838},"vo_ruby_short_seasonCycle":{"url":"assets/audio/acting/vo_ruby_short_seasonCycle.mp3","text":"Gather petals for all four seasons!","role":"ruby","duration":1657},"vo_ruby_short_breakRoots":{"url":"assets/audio/acting/vo_ruby_short_breakRoots.mp3","text":"Make the root hit the stones!","role":"ruby","duration":1636},"vo_ruby_short_cleanAir":{"url":"assets/audio/acting/vo_ruby_short_cleanAir.mp3","text":"Free them from the fog!","role":"ruby","duration":1344},"vo_ruby_short_counter":{"url":"assets/audio/acting/vo_ruby_short_counter.mp3","text":"Dash into the glowing item!","role":"ruby","duration":1313},"vo_ruby_short_mini":{"url":"assets/audio/acting/vo_ruby_short_mini.mp3","text":"Beat the Miniboss!","role":"ruby","duration":938},"vo_ruby_short_boss":{"url":"assets/audio/acting/vo_ruby_short_boss.mp3","text":"Defeat the Boss!","role":"ruby","duration":858},"vo_ruby_react_objdone_1":{"url":"assets/audio/acting/vo_ruby_react_objdone_1.mp3","text":"Objective done! Nice!","role":"ruby","duration":1319},"vo_ruby_react_objdone_2":{"url":"assets/audio/acting/vo_ruby_react_objdone_2.mp3","text":"That’s it — perfect!","role":"ruby","duration":697},"vo_ruby_react_bossdown_1":{"url":"assets/audio/acting/vo_ruby_react_bossdown_1.mp3","text":"You did it! The flavor’s coming back!","role":"ruby","duration":1784},"vo_ruby_react_bossdown_2":{"url":"assets/audio/acting/vo_ruby_react_bossdown_2.mp3","text":"Boss down! We’re winning!","role":"ruby","duration":1172},"vo_ruby_react_lowhp_1":{"url":"assets/audio/acting/vo_ruby_react_lowhp_1.mp3","text":"Careful! Grab a Heal Mochi!","role":"ruby","duration":1589},"vo_ruby_react_lowhp_2":{"url":"assets/audio/acting/vo_ruby_react_lowhp_2.mp3","text":"You’re hurt — step back a bit!","role":"ruby","duration":1070},"vo_ruby_react_wave_1":{"url":"assets/audio/acting/vo_ruby_react_wave_1.mp3","text":"Here they come — a big wave!","role":"ruby","duration":1432},"vo_ruby_react_wave_2":{"url":"assets/audio/acting/vo_ruby_react_wave_2.mp3","text":"Lots of monsters! Keep moving!","role":"ruby","duration":1237},"vo_ruby_react_timer_1":{"url":"assets/audio/acting/vo_ruby_react_timer_1.mp3","text":"Almost there — ten more seconds!","role":"ruby","duration":1648},"vo_ruby_react_timer_2":{"url":"assets/audio/acting/vo_ruby_react_timer_2.mp3","text":"Just a little longer!","role":"ruby","duration":944},"vo_ruby_react_revive_1":{"url":"assets/audio/acting/vo_ruby_react_revive_1.mp3","text":"Phew… you’re back!","role":"ruby","duration":1048},"vo_ruby_react_revive_2":{"url":"assets/audio/acting/vo_ruby_react_revive_2.mp3","text":"Up you get! I believe in you!","role":"ruby","duration":1189},"vo_ruby_react_clear_1":{"url":"assets/audio/acting/vo_ruby_react_clear_1.mp3","text":"Stage clear! Great job!","role":"ruby","duration":1277},"vo_ruby_react_clear_2":{"url":"assets/audio/acting/vo_ruby_react_clear_2.mp3","text":"We did it! On to the next one!","role":"ruby","duration":1443}});
Object.assign(A07_CATALOG,{"vo_ruby_core_1":{"url":"assets/audio/acting/vo_ruby_core_1.mp3","text":"That Sugar is flavor the Hunger stole. We just took some back!","role":"ruby","duration":4203},"vo_ruby_core_2":{"url":"assets/audio/acting/vo_ruby_core_2.mp3","text":"Grandma wove three Flavor Cores into the Heart Seed: Life Core, Flavor Spark and Oath Shell.","role":"ruby","duration":5478},"vo_ruby_core_3":{"url":"assets/audio/acting/vo_ruby_core_3.mp3","text":"Feed them Sugar and the Seed holds your true form tighter. Every friend we free shares that strength too!","role":"ruby","duration":5479},"vo_ruby_tip_seedRift":{"url":"assets/audio/acting/vo_ruby_tip_seedRift.mp3","text":"Catch the seed carriers before they feed the rift!","role":"ruby","duration":2723},"vo_ruby_tip_shakeTrees":{"url":"assets/audio/acting/vo_ruby_tip_shakeTrees.mp3","text":"Stand under each tree to shake it. Fruit, or a surprise!","role":"ruby","duration":3950},"vo_ruby_tip_mirrorPath":{"url":"assets/audio/acting/vo_ruby_tip_mirrorPath.mp3","text":"Stand by each mirror to charge it. Then the crystal blasts!","role":"ruby","duration":3027},"vo_ruby_tip_vaultAltar":{"url":"assets/audio/acting/vo_ruby_tip_vaultAltar.mp3","text":"Pick a curse, then take the loot or risk it for more!","role":"ruby","duration":2912},"vo_ruby_tip_ultimatum":{"url":"assets/audio/acting/vo_ruby_tip_ultimatum.mp3","text":"Each round adds a curse. Take the pot, or risk it for more!","role":"ruby","duration":3204},"vo_ruby_tip_lastLight":{"url":"assets/audio/acting/vo_ruby_tip_lastLight.mp3","text":"Keep one lantern burning! Stand close to rekindle them.","role":"ruby","duration":2945},"vo_ruby_tip_frozenPantry":{"url":"assets/audio/acting/vo_ruby_tip_frozenPantry.mp3","text":"Open the sugar jar, then walk near the frozen mochi to wake them!","role":"ruby","duration":3713},"vo_ruby_tip_hungersMouth":{"url":"assets/audio/acting/vo_ruby_tip_hungersMouth.mp3","text":"Touch the Hunger’s hand! Kills inside keep the breach open.","role":"ruby","duration":3933},"vo_ruby_tip_creepingRoots":{"url":"assets/audio/acting/vo_ruby_tip_creepingRoots.mp3","text":"Roots crawl to the flower! Stand on each root mother to cut it.","role":"ruby","duration":3437},"vo_ruby_tip_hungerHerald":{"url":"assets/audio/acting/vo_ruby_tip_hungerHerald.mp3","text":"That Herald opens gates! Hunt it down to shut them.","role":"ruby","duration":3438},"vo_ruby_tip_grandmasPot":{"url":"assets/audio/acting/vo_ruby_tip_grandmasPot.mp3","text":"Step into Grandma’s ring! Beat the hungry mochi in the light to fill the pot.","role":"ruby","duration":4275},"vo_ruby_tip_grandmasGolem":{"url":"assets/audio/acting/vo_ruby_tip_grandmasGolem.mp3","text":"Collect golem parts, bake them in the oven, then beat the golem!","role":"ruby","duration":4277},"vo_ruby_tip_hungerSiege":{"url":"assets/audio/acting/vo_ruby_tip_hungerSiege.mp3","text":"Hold the circle! Every kill inside fills the pot.","role":"ruby","duration":3612},"vo_ruby_tip_hungerDomain":{"url":"assets/audio/acting/vo_ruby_tip_hungerDomain.mp3","text":"The whole cave is a breach! Survive, then beat the Breachlord!","role":"ruby","duration":3488},"vo_ruby_short_seedRift":{"url":"assets/audio/acting/vo_ruby_short_seedRift.mp3","text":"Catch the seed carriers!","role":"ruby","duration":1396},"vo_ruby_short_shakeTrees":{"url":"assets/audio/acting/vo_ruby_short_shakeTrees.mp3","text":"Shake every tree!","role":"ruby","duration":1242},"vo_ruby_short_mirrorPath":{"url":"assets/audio/acting/vo_ruby_short_mirrorPath.mp3","text":"Charge every mirror!","role":"ruby","duration":1257},"vo_ruby_short_vaultAltar":{"url":"assets/audio/acting/vo_ruby_short_vaultAltar.mp3","text":"Pick a curse, then take or risk!","role":"ruby","duration":1507},"vo_ruby_short_ultimatum":{"url":"assets/audio/acting/vo_ruby_short_ultimatum.mp3","text":"Take the pot or risk it!","role":"ruby","duration":1580},"vo_ruby_short_lastLight":{"url":"assets/audio/acting/vo_ruby_short_lastLight.mp3","text":"Keep a lantern lit!","role":"ruby","duration":988},"vo_ruby_short_frozenPantry":{"url":"assets/audio/acting/vo_ruby_short_frozenPantry.mp3","text":"Walk near the frozen mochi!","role":"ruby","duration":2090},"vo_ruby_short_hungersMouth":{"url":"assets/audio/acting/vo_ruby_short_hungersMouth.mp3","text":"Keep fighting inside the breach!","role":"ruby","duration":1500},"vo_ruby_short_creepingRoots":{"url":"assets/audio/acting/vo_ruby_short_creepingRoots.mp3","text":"Cut the root mothers!","role":"ruby","duration":1434},"vo_ruby_short_hungerHerald":{"url":"assets/audio/acting/vo_ruby_short_hungerHerald.mp3","text":"Hunt the Herald!","role":"ruby","duration":1316},"vo_ruby_short_grandmasPot":{"url":"assets/audio/acting/vo_ruby_short_grandmasPot.mp3","text":"Fight inside the pot ring!","role":"ruby","duration":1533},"vo_ruby_short_grandmasGolem":{"url":"assets/audio/acting/vo_ruby_short_grandmasGolem.mp3","text":"Bake the golem parts!","role":"ruby","duration":1239},"vo_ruby_short_hungerSiege":{"url":"assets/audio/acting/vo_ruby_short_hungerSiege.mp3","text":"Hold the circle!","role":"ruby","duration":1219},"vo_ruby_short_hungerDomain":{"url":"assets/audio/acting/vo_ruby_short_hungerDomain.mp3","text":"Survive, then the Breachlord!","role":"ruby","duration":1765}});   // v8.1.108 A13: Ruby core lore 3 + signature/League mission tips 14 + shorts 14
Object.assign(A07_CATALOG,{"vo_ruby_react_golden_1":{"url":"assets/audio/acting/vo_ruby_react_golden.mp3","text":"A golden wave! Everything’s worth double!","role":"ruby","duration":2170},"vo_ruby_react_double_1":{"url":"assets/audio/acting/vo_ruby_react_double.mp3","text":"Double clear! Both missions in one wave!","role":"ruby","duration":2183},"vo_ruby_react_bossmission_1":{"url":"assets/audio/acting/vo_ruby_react_bossmission.mp3","text":"The boss is calling the stage — finish that mission too!","role":"ruby","duration":2986},"vo_ruby_react_newmission_1":{"url":"assets/audio/acting/vo_ruby_react_newmission.mp3","text":"Something new! Let me show you how this works.","role":"ruby","duration":2584},"vo_ruby_react_reroll_1":{"url":"assets/audio/acting/vo_ruby_react_reroll.mp3","text":"New cards, new luck!","role":"ruby","duration":1207},"vo_ruby_react_curse_1":{"url":"assets/audio/acting/vo_ruby_react_curse.mp3","text":"A curse on this wave — but the rewards are bigger!","role":"ruby","duration":2579},"vo_ruby_react_jackpot_1":{"url":"assets/audio/acting/vo_ruby_react_jackpot.mp3","text":"Jackpot! Triple rewards!","role":"ruby","duration":1581},"vo_ruby_tip_atlas":{"url":"assets/audio/acting/vo_ruby_tip_atlas.mp3","text":"Spend Atlas stars to upgrade the missions you love. You can’t have them all, so choose!","role":"ruby","duration":4583}});   /* v8.2.31 A18 */
Object.assign(A07_CATALOG,{"vo_ruby_react_exboss_1":{"url":"assets/audio/acting/vo_ruby_react_exboss.mp3","text":"A boss! Tap as fast as you can!","role":"ruby","duration":1781},"vo_ruby_react_exfail_1":{"url":"assets/audio/acting/vo_ruby_react_exfail.mp3","text":"So close! Let’s get a bit stronger first.","role":"ruby","duration":1718},"vo_ruby_react_exwelcome_1":{"url":"assets/audio/acting/vo_ruby_react_exwelcome.mp3","text":"Welcome back! Our helpers kept fighting!","role":"ruby","duration":1850},"vo_ruby_tip_expedition":{"url":"assets/audio/acting/vo_ruby_tip_expedition.mp3","text":"Tap to fight! Hire helpers — they keep going even when you’re away.","role":"ruby","duration":4173}});   /* v8.2.34 A19 */
Object.assign(A07_CATALOG,{"vo_ruby_tip_hungerHerald":{"url":"assets/audio/acting/vo_ruby_tip_hungerHerald.mp3","text":"The Herald can’t be hurt — beat the monsters it powers up!","role":"ruby","duration":3136},"vo_ruby_short_hungerHerald":{"url":"assets/audio/acting/vo_ruby_short_hungerHerald.mp3","text":"Beat the powered-up ones!","role":"ruby","duration":1580},"vo_ruby_tip_hunt":{"url":"assets/audio/acting/vo_ruby_tip_hunt.mp3","text":"Dodge its poison bottles and beat the marked Elite!","role":"ruby","duration":2972},"vo_ruby_short_hunt":{"url":"assets/audio/acting/vo_ruby_short_hunt.mp3","text":"Dodge the bottles!","role":"ruby","duration":1004},"vo_ruby_tip_frozenPantry":{"url":"assets/audio/acting/vo_ruby_tip_frozenPantry.mp3","text":"Open the sugar jar, then walk through the frozen army and crates!","role":"ruby","duration":3580},"vo_ruby_short_frozenPantry":{"url":"assets/audio/acting/vo_ruby_short_frozenPantry.mp3","text":"Walk through the frozen army!","role":"ruby","duration":1504},"vo_ruby_react_captain_1":{"url":"assets/audio/acting/vo_ruby_react_captain.mp3","text":"Their Captain is down — the squad is weaker now!","role":"ruby","duration":2552},"vo_ruby_react_side_1":{"url":"assets/audio/acting/vo_ruby_react_side.mp3","text":"A side mission! Let’s try to do both!","role":"ruby","duration":2178},"vo_ruby_react_hurry_1":{"url":"assets/audio/acting/vo_ruby_react_hurry.mp3","text":"Hurry, the wave is almost over!","role":"ruby","duration":1596},"vo_ruby_react_half_1":{"url":"assets/audio/acting/vo_ruby_react_half.mp3","text":"We got halfway — that still counts!","role":"ruby","duration":1985},"vo_ruby_react_early_1":{"url":"assets/audio/acting/vo_ruby_react_early.mp3","text":"Done early! Let’s catch our breath.","role":"ruby","duration":1757},"vo_ruby_react_empowered_1":{"url":"assets/audio/acting/vo_ruby_react_empowered.mp3","text":"Watch out, that one got stronger!","role":"ruby","duration":1374}});   // v8.2.24 A16: Ruby Herald/Hunt/Frozen Pantry tips + 6 new reacts (captain/side/hurry/half/early/empowered)
Object.assign(A07_CATALOG,{"vo_ruby_go_01":{"url":"assets/audio/acting/vo_ruby_go_01.mp3","text":"Down we go — into the Sour Ant Nest!","role":"ruby","duration":2784},"vo_ruby_go_02":{"url":"assets/audio/acting/vo_ruby_go_02.mp3","text":"Hold your nose. The Rotting Drain is next!","role":"ruby","duration":2655},"vo_ruby_go_03":{"url":"assets/audio/acting/vo_ruby_go_03.mp3","text":"Feel that heat? The Chili Engine Room!","role":"ruby","duration":2920},"vo_ruby_go_04":{"url":"assets/audio/acting/vo_ruby_go_04.mp3","text":"Brr… someone is trapped in the Frost Prison.","role":"ruby","duration":2586},"vo_ruby_go_05":{"url":"assets/audio/acting/vo_ruby_go_05.mp3","text":"The Crown Oven. Stay close to me.","role":"ruby","duration":2006},"vo_ruby_go_06":{"url":"assets/audio/acting/vo_ruby_go_06.mp3","text":"Up into the garden — the Fermented Canopy!","role":"ruby","duration":2416},"vo_ruby_go_07":{"url":"assets/audio/acting/vo_ruby_go_07.mp3","text":"Mycelium Marsh. Don’t breathe the spores!","role":"ruby","duration":2919},"vo_ruby_go_08":{"url":"assets/audio/acting/vo_ruby_go_08.mp3","text":"The Nectar Hive smells so sweet… too sweet.","role":"ruby","duration":2868},"vo_ruby_go_09":{"url":"assets/audio/acting/vo_ruby_go_09.mp3","text":"Four seasons in one room? Let’s go see!","role":"ruby","duration":1715},"vo_ruby_go_10":{"url":"assets/audio/acting/vo_ruby_go_10.mp3","text":"The Root Throne. This is where it’s been hiding.","role":"ruby","duration":2600},"vo_ruby_go_11":{"url":"assets/audio/acting/vo_ruby_go_11.mp3","text":"The Seedfields are all ash… we have to keep going.","role":"ruby","duration":2941},"vo_ruby_go_12":{"url":"assets/audio/acting/vo_ruby_go_12.mp3","text":"Hollow Orchard. Don’t trust the shiny fruit!","role":"ruby","duration":2549},"vo_ruby_go_13":{"url":"assets/audio/acting/vo_ruby_go_13.mp3","text":"Look at the glass — it’s showing old memories!","role":"ruby","duration":2634},"vo_ruby_go_14":{"url":"assets/audio/acting/vo_ruby_go_14.mp3","text":"The Seed Vault. Every lost flavor is in here!","role":"ruby","duration":2574},"vo_ruby_go_15":{"url":"assets/audio/acting/vo_ruby_go_15.mp3","text":"The First Seed’s throne. Let’s end this — together.","role":"ruby","duration":2946},"vo_ruby_go_again_1":{"url":"assets/audio/acting/vo_ruby_go_again_1.mp3","text":"Back again? Let’s go!","role":"ruby","duration":1557},"vo_ruby_go_again_2":{"url":"assets/audio/acting/vo_ruby_go_again_2.mp3","text":"I remember this place!","role":"ruby","duration":1305},"vo_ruby_go_again_3":{"url":"assets/audio/acting/vo_ruby_go_again_3.mp3","text":"Ready when you are!","role":"ruby","duration":1218},"vo_ruby_go_again_4":{"url":"assets/audio/acting/vo_ruby_go_again_4.mp3","text":"One more time — stay sharp!","role":"ruby","duration":1745}});   /* v8.2.84 A20 Ruby พาเข้าด่าน */
/* A22: owner-approved Ruby boss-twist and Crown Root lines, loaded on demand. */
Object.assign(A07_CATALOG,{"vo_ruby_twist_roots":{"url":"assets/audio/acting/vo_ruby_twist_roots.mp3","text":"Roots! Watch where they pop out!","role":"ruby","duration":2336},"vo_ruby_twist_seeds":{"url":"assets/audio/acting/vo_ruby_twist_seeds.mp3","text":"Step on the seeds before they hatch!","role":"ruby","duration":1804},"vo_ruby_twist_fruit":{"url":"assets/audio/acting/vo_ruby_twist_fruit.mp3","text":"Fruit’s falling — keep moving!","role":"ruby","duration":1757},"vo_ruby_twist_dark":{"url":"assets/audio/acting/vo_ruby_twist_dark.mp3","text":"It’s getting dark… they’re getting angry!","role":"ruby","duration":2340},"vo_ruby_twist_shadows":{"url":"assets/audio/acting/vo_ruby_twist_shadows.mp3","text":"Shadows of the boss? Don’t let them surround you!","role":"ruby","duration":2335},"vo_ruby_rift_event":{"url":"assets/audio/acting/vo_ruby_rift_event.mp3","text":"A Seed Rift! Catch the carriers for Sugar!","role":"ruby","duration":2343},"vo_ruby_perfect":{"url":"assets/audio/acting/vo_ruby_perfect.mp3","text":"Perfect dodge!","role":"ruby","duration":950},"vo_ruby_crown_stuck":{"url":"assets/audio/acting/vo_ruby_crown_stuck.mp3","text":"It’s stuck! Hit it now!","role":"ruby","duration":1198}});
const A07_BY_TEXT=new Map();
for(const [key,r] of Object.entries(A07_CATALOG)){const id=r.role+'|'+String(r.text).replace(/[\[\]]/g,'');if(!A07_BY_TEXT.has(id))A07_BY_TEXT.set(id,key);}
const VoiceActing={active:null,pending:null,serial:0,lastBark:-Infinity,history:{},recentBarks:[],
  lookup(role,text){return A07_BY_TEXT.get(role+'|'+String(text||'').replace(/\s+·\s+\d+\/\d+$/,'').replace(/[\[\]]/g,''))||null;},   /* v8.1.43 ตัด ' · 3/10' ก่อนหาเสียง */
  caption(role,text){const exact=this.lookup(role,text);if(exact)return exact;for(const [k,v] of Object.entries(A07_CATALOG))if(v.role===role&&v.text.length>12&&String(text||'').includes(v.text))return k;return null;},
  enabled(){return typeof Save!=='undefined'&&Save.data?.settings?.voices!==false&&!Sfx.muted&&Sfx.sv>0;},
  busy(){return !!(this.pending||this.active?.sound?.isPlaying||DuoVoice.busy());},
  stop(owner){if(owner&&this.active?.owner!==owner&&this.pending?.owner!==owner)return;this.serial++;if(!owner||this.pending?.owner===owner){if(this.pending?.timer)clearTimeout(this.pending.timer);this.pending=null;}if(!owner||this.active?.owner===owner){const a=this.active;this.active=null;try{a?.sound?.stop();a?.sound?.destroy();if(a?.key&&!a.key.includes('_unique_'))a.scene?.cache?.audio?.remove(a.key);if(a){clearTimeout(Sfx._duckTimer);Sfx.bgmIntense?.(Sfx._bgmIntense);}}catch(e){}}},
  play(scene,key,valid,owner,onStart){const row=A07_CATALOG[key]||(typeof A23_VOICES!=='undefined'&&A23_VOICES[key]);if(!row||!scene||!this.enabled()||this.busy())return false;if(!scene._a07AudioShutdown&&scene.events?.once){scene._a07AudioShutdown=true;scene.events.once('shutdown',()=>{this.stop();StoryMusic.stop();scene._a07AudioShutdown=false;});}const serial=++this.serial,pending=this.pending={serial,key,owner};pending.timer=setTimeout(()=>{if(this.pending===pending)this.pending=null;},8000);
    const go=()=>{if(this.pending!==pending||this.serial!==serial){if(this.pending?.key!==key)try{scene.cache?.audio?.remove(key);}catch(e){}return;}clearTimeout(pending.timer);this.pending=null;if(!this.enabled()||!valid()||!scene.cache?.audio?.exists(key)||this.active?.sound?.isPlaying)return;
      const bossVo=/^vo_b\d/.test(key)&&scene.state==='play';   /* v8.2.50 เจ้าของ: เสียงพากย์บอสตอนสู้เบาไป → ดังขึ้น + กดเพลงลงมากกว่า */
      try{const sound=scene.sound.add(key,{volume:(bossVo?(typeof VO_BOSS_VOL!=='undefined'?VO_BOSS_VOL:1):.65)*Sfx.sv,rate:1});const active=this.active={sound,owner,scene,key,end:performance.now()+row.duration};sound.once('complete',()=>{if(this.active===active)this.active=null;try{sound.destroy();if(this.pending?.key!==key&&!key.includes('_unique_'))scene.cache?.audio?.remove(key);}catch(e){}});if(sound.play()===false){this.active=null;try{sound.destroy();}catch(e){}return;}Sfx.duckBgm?.(Math.max(1000,row.duration+250),bossVo?.42:.7);onStart?.(row);}
      catch(e){this.active=null;}};
    try{if(scene.cache?.audio?.exists(key)){go();return true;}if(!scene.load?.audio){clearTimeout(pending.timer);this.pending=null;return false;}const onError=f=>{if(f?.key!==key)return;scene.load.off?.('loaderror',onError);if(this.pending===pending){clearTimeout(pending.timer);this.pending=null;}};scene.load.on?.('loaderror',onError);scene.load.once('filecomplete-audio-'+key,()=>{scene.load.off?.('loaderror',onError);go();});scene.load.audio(key,verUrl(row.url));if(!scene.load.isLoading())scene.load.start();return true;}catch(e){if(this.pending===pending){clearTimeout(pending.timer);this.pending=null;}return false;}
  },
  text(scene,role,text,valid,owner){const key=this.lookup(role,text);return key?this.play(scene,key,valid,owner):false;},
  /* v8.1.36 เจ้าของ: ใช้ Unique = มีเสียงทุกครั้ง · ตัดเสียงต่อสู้ของฮีโร่ที่กำลังพูดได้ (ไม่ตัด Ruby/ฉากเรื่อง) · หมุนประโยค ไม่ซ้ำติดกัน · มีประโยคราย Build (vo_<hero>_unique_<path>_N) ก็ใช้ร่วม · เก็บไฟล์ไว้ในแคช */
  /* v8.1.41 โหลดเสียง Unique ของฮีโร่ล่วงหน้าตอนเข้าด่าน (ทุก Build) → ใช้ครั้งแรกไม่หน่วง · เก็บในแคชตามกติกา _unique_ */
  preloadUnique(scene){try{if(!scene?.load?.audio||!this.enabled())return 0;const role=scene.character==='momo'?'strawberry':scene.character,pre='vo_'+role+'_unique_';let n=0;for(const k in A07_CATALOG)if(k.startsWith(pre)&&!scene.cache?.audio?.exists(k)){scene.load.audio(k,verUrl(A07_CATALOG[k].url));n++;}if(n&&!scene.load.isLoading())scene.load.start();return n;}catch(e){return 0;}},
  unique(scene){if(scene.state!=='play'||!scene.player?.active||scene._ruby||!this.enabled())return false;const player=scene.player;
    const role=scene.character==='momo'?'strawberry':scene.character,path=scene.basicAttack?.path,keys=[];
    if(role==='sesame'&&scene.sesRuneRecipe&&performance.now()-(this._sesVoAt||0)<2500)return false;   /* v8.1.67 เช็กช่วงเว้นก่อนตัดเสียงเดิม (เดิมร่ายถี่ = ตัดประโยคแล้วเงียบ) */
    if(this.busy()){if(this.active?.owner===player||this.pending?.owner===player)this.stop(player);else return false;}
    if(role==='sesame'&&scene.sesRuneRecipe){const now=performance.now();this._sesVoAt=now;const rk=scene.sesRuneRecipe?.()?.key,sk='vo_sesame_spell_'+rk;if(rk&&A07_CATALOG[sk]&&Math.random()<.6){const epoch=scene._artEpoch;return this.play(scene,sk,()=>scene.state==='play'&&scene.player===player&&scene._artEpoch===epoch&&!scene._ruby,player,r=>{this.lastBark=performance.now();scene.showSpeechBubble?.(r.text,Math.max(1400,r.duration+200));});}}   /* v8.1.65 A11 Sesame เรียกชื่อเวท 60% */
    for(const pre of [path?'vo_'+role+'_unique_'+path+'_':null,'vo_'+role+'_unique_'])if(pre)for(let i=1;i<=4;i++)if(A07_CATALOG[pre+i])keys.push(pre+i);
    if(typeof A23_VOICES!=='undefined'&&A23_VOICES['vo_a23_'+role+'_reaction_6'])keys.push('vo_a23_'+role+'_reaction_6');if(!keys.length)return false;let n=this.uniqueTurn=((this.uniqueTurn??-1)+1)%keys.length,key=keys[n];if(key===this.lastUnique&&keys.length>1){n=this.uniqueTurn=(n+1)%keys.length;key=keys[n];}
    const epoch=scene._artEpoch;return this.play(scene,key,()=>scene.state==='play'&&scene.player===player&&scene._artEpoch===epoch&&!scene._ruby,player,r=>{this.lastUnique=key;this.lastBark=performance.now();scene.showSpeechBubble?.(r.text,Math.max(1600,r.duration+200));});},
  reaction(scene,index,role){
    if(scene.state!=='play'||!scene.player?.active||scene._inTutorial||scene._ruby||scene._speech||!this.enabled()||this.busy()||performance.now()-this.lastBark<20000)return false;
    role=role||(scene.character==='momo'?'strawberry':scene.character);const key='vo_a23_'+role+'_reaction_'+index;
    if(typeof A23_VOICES==='undefined'||!A23_VOICES[key])return false;const player=scene.player,epoch=scene._artEpoch;
    return this.play(scene,key,()=>scene.state==='play'&&scene.player===player&&scene._artEpoch===epoch&&!scene._ruby,player,r=>{this.lastBark=performance.now();scene.showSpeechBubble?.(r.text,Math.max(1600,r.duration+150));});
  },
  bark(scene,event){if((event==='boss'||event==='lowhp')&&Math.random()<.4&&this.reaction?.(scene,event==='boss'?2:4))return true;if(scene.state!=='play'||!scene.player?.active||scene._ruby||scene._speech||!this.enabled()||this.busy())return false;const role=scene.character==='momo'?'strawberry':scene.character,base='vo_'+role+'_'+event+'_',now=performance.now();if(now-this.lastBark<12000)return false;const previous=this.history[base]||0,choices=[previous===1?2:1,previous===1?1:2].filter(i=>A07_CATALOG[base+i]&&!this.recentBarks.includes(base+i));if(!choices.length)return false;const index=choices[0],key=base+index,row=A07_CATALOG[key];const player=scene.player,epoch=scene._artEpoch;const accepted=this.play(scene,key,()=>scene.state==='play'&&scene.player===player&&scene._artEpoch===epoch&&!scene._ruby&&!scene._speech,player,r=>{this.lastBark=performance.now();this.history[base]=index;this.recentBarks.push(key);if(this.recentBarks.length>3)this.recentBarks.shift();scene.showSpeechBubble?.(r.text,Math.max(2000,r.duration+250));});return accepted;}
};
// A08: brief companion reply after Yuzu finishes speaking; load only when used.
const DuoVoice={serial:0,until:0,last:{},key:null,scene:null,
  stop(){this.serial++;this.until=0;try{if(this.key)this.scene?.sound?.stopByKey?.(this.key);}catch(e){}this.key=null;this.scene=null;},
  busy(){return performance.now()<this.until;},
  play(scene,kind,buff){
    if(!['pomelo','lime','bloodorange'].includes(kind)||!VoiceActing.enabled())return false;
    const player=scene.player,epoch=scene._artEpoch||0,serial=++this.serial,started=performance.now();
    const valid=()=>this.serial===serial&&scene.state==='play'&&scene.player===player&&player?.active&&(scene._artEpoch||0)===epoch&&scene._yzBuff===buff&&VoiceActing.enabled();
    const choices=['vo_'+kind+'_duo_1','vo_'+kind+'_duo_2'];if(typeof A23_VOICES!=='undefined')for(let i=1;i<=2;i++){const k='vo_a23_'+kind+'_reaction_'+i;if(A23_VOICES[k])choices.push(k);}const n=((this.last[kind]??-1)+1)%choices.length,key=choices[n],row=A07_CATALOG[key]||(typeof A23_VOICES!=='undefined'&&A23_VOICES[key]);
    const go=()=>{if(!valid()||performance.now()-started>2400)return;if(VoiceActing.busy()){scene.time?.delayedCall?.(80,go);return;}if(!scene.cache?.audio?.exists(key))return;
      if(Sfx.playFile(key,.55,1)){this.last[kind]=n;this.key=key;this.scene=scene;this.until=performance.now()+row.duration;}};
    try{if(scene.cache.audio.exists(key)){go();return true;}if(!scene.load?.audio)return false;scene.load.once('filecomplete-audio-'+key,go);scene.load.audio(key,verUrl(row.url));if(!scene.load.isLoading())scene.load.start();return true;}catch(e){return false;}
  }
};
const StoryMusic={serial:0,
  play(scene,key,valid,volume=.24){const token=++this.serial;if(!key||!ASSET_AUDIO[key]||!scene?.load)return false;if(key==='bgm_a04_bgm_title'&&window.LoaderMusic?.playing?.())return true;   // v8.1.35 เพลงหน้าโหลดคือเพลงเดียวกัน → เล่นต่อ ไม่เริ่มใหม่
    const go=()=>{if(token!==this.serial||!valid()||!scene.cache?.audio?.exists(key))return;try{window.LoaderMusic?.stop?.();const previous=Sfx._currentBgmKey;Sfx._bgmIntense=false;if(Sfx._playTrack(key,volume)&&previous&&previous!==key&&previous.startsWith('bgm_a04_'))setTimeout(()=>{if(Sfx._currentBgmKey!==previous){try{scene.sound?.removeByKey?.(previous);scene.cache?.audio?.remove(previous);}catch(e){}}},900);}catch(e){}};
    try{if(scene.cache.audio.exists(key)){go();return true;}scene.load.once('filecomplete-audio-'+key,go);scene.load.audio(key,verUrl(ASSET_AUDIO[key]));if(!scene.load.isLoading())scene.load.start();return true;}catch(e){return false;}},
  stop(){this.serial++;}
};

function bgmKeyFor(kind,stageNum){
  /* v8.1.142 owner 🐞: C1-1 and the tutorial shared one track → real C1-1 runs use the owner's "Clockmaker's Tea Break" + boss "Gates of the Calamity" */
  if(kind==='boss'&&stageNum>=2&&stageNum<=5&&BGM_MODE!=='endgame'&&ASSET_AUDIO.bgm_c11_boss)return 'bgm_c11_boss';
  if(kind==='boss'&&BGM_MODE!=='endgame'){ if(stageNum>=6&&stageNum<=10&&ASSET_AUDIO.bgm_c2_boss)return 'bgm_c2_boss'; if(stageNum>=11&&stageNum<=15&&ASSET_AUDIO.bgm_c3_boss)return 'bgm_c3_boss'; }   /* v8.1.153 owner: Ch2 / Ch3 boss themes */   /* v8.1.144 owner: Gates of the Calamity = boss theme for all of Chapter 1 (Ch2–3 tracks coming from the owner) */
  if(stageNum===1&&BGM_MODE!=='endgame'&&(kind==='stage'||kind==='boss')){ let tut=true; try{ const g=window.__g&&window.__g.scene.getScene('Game'); tut=!(typeof Save!=='undefined'&&Save.data&&Save.data.tutorialDone)||!!(g&&(g._inTutorial||g._forceCoachTutorial)); }catch(e){} const k=kind==='stage'?'bgm_c11_stage':'bgm_c11_boss'; if(!tut&&ASSET_AUDIO[k])return k; }
  if(BGM_MODE==='endgame'){const k='bgm_endgame'+(kind==='boss'?'_boss':'');if(ASSET_AUDIO[k])return k;}
  if(kind==='mini'){const k='bgm_m'+String(stageNum).padStart(2,'0');return ASSET_AUDIO[k]?k:null;}
  if(kind==='stage'){const k='bgm_s'+String(stageNum).padStart(2,'0');if(ASSET_AUDIO[k])return k;}
  if(kind==='boss'){const k='bgm_b'+String(stageNum).padStart(2,'0');if(ASSET_AUDIO[k])return k;}   // v6.81 per-stage boss   // เพลงประจำด่าน (ใหม่)
  const n=String(Math.max(1,Math.min(15,stageNum|0||1))).padStart(2,'0');return (kind==='boss'?'bgm_b':'bgm_s')+n;   // v8.1.139 เพลงสำรองเก่าถูกลบ → ใช้เพลงประจำด่านที่ใกล้สุด
}

/* v8.1.143 owner: simple battle FX drawn by code instead of 352×366×8 sheets (5 sheets ≈ 19.5 MB GPU → ≈ 1.3 MB) · same keys, same anims */
const CODE_FX={
  fx_wave:  {fw:128,fh:128,frames:8,rate:26,anchor:'center'},
  fx_bubble:{fw:128,fh:128,frames:8,rate:22,anchor:'center'},
  fx_aura:  {fw:128,fh:128,frames:8,rate:14,anchor:'center',loop:true},
  fx_slash: {fw:128,fh:128,frames:8,rate:30,anchor:'left'},
  fx_beam:  {fw:128,fh:48, frames:8,rate:26,anchor:'left'},
};
function makeCodeFx(scene){ if(typeof document==='undefined'||!scene||!scene.textures)return; const TAU=Math.PI*2;
  const draw={
    fx_wave:(c,i,n,w,h)=>{ const t=i/(n-1),r=8+t*(w/2-10); c.lineWidth=Math.max(2,10*(1-t)); c.strokeStyle='rgba(255,236,214,'+(1-t*.85)+')'; c.beginPath(); c.arc(w/2,h/2,r,0,TAU); c.stroke(); c.lineWidth=2; c.strokeStyle='rgba(255,190,220,'+(.7*(1-t))+')'; c.beginPath(); c.arc(w/2,h/2,r*.82,0,TAU); c.stroke(); },
    fx_bubble:(c,i,n,w,h)=>{ const t=i/(n-1),pop=t>.7; if(!pop){ const r=10+t/.7*(w/2-14),g=c.createRadialGradient(w/2-r*.3,h/2-r*.3,r*.1,w/2,h/2,r); g.addColorStop(0,'rgba(255,255,255,.9)'); g.addColorStop(.6,'rgba(200,235,255,.35)'); g.addColorStop(1,'rgba(160,220,255,.8)'); c.fillStyle=g; c.beginPath(); c.arc(w/2,h/2,r,0,TAU); c.fill(); }
      else { const k=(t-.7)/.3; c.fillStyle='rgba(220,245,255,'+(1-k)+')'; for(let j=0;j<10;j++){ const a=j/10*TAU,d=(w/2-14)*(1+k*.3); c.beginPath(); c.arc(w/2+Math.cos(a)*d,h/2+Math.sin(a)*d,3*(1-k)+1,0,TAU); c.fill(); } } },
    fx_aura:(c,i,n,w,h)=>{ const t=i/n,r=w/2-8,g=c.createRadialGradient(w/2,h/2,r*.55,w/2,h/2,r); g.addColorStop(0,'rgba(255,170,215,0)'); g.addColorStop(.8,'rgba(255,190,225,'+(.35+.15*Math.sin(t*TAU))+')'); g.addColorStop(1,'rgba(255,220,240,0)'); c.fillStyle=g; c.beginPath(); c.arc(w/2,h/2,r,0,TAU); c.fill();
      c.fillStyle='rgba(255,240,250,.85)'; for(let j=0;j<6;j++){ const a=t*TAU+j/6*TAU; c.beginPath(); c.arc(w/2+Math.cos(a)*r*.86,h/2+Math.sin(a)*r*.86,2.5,0,TAU); c.fill(); } },
    fx_slash:(c,i,n,w,h)=>{ const t=i/(n-1),sweep=Math.min(1,t*1.6),fade=t<.6?1:1-(t-.6)/.4; c.strokeStyle='rgba(255,240,210,'+fade+')'; c.lineCap='round'; c.lineWidth=10*fade+2; c.beginPath(); c.arc(-12,h/2,w-24,-.55,-.55+1.1*sweep); c.stroke(); c.lineWidth=3; c.strokeStyle='rgba(255,255,255,'+fade+')'; c.beginPath(); c.arc(-12,h/2,w-24,-.55,-.55+1.1*sweep); c.stroke(); },
    fx_beam:(c,i,n,w,h)=>{ const t=i/(n-1),th=(h/2-4)*(t<.25?t/.25:1-(t-.25)/.75*.9),g=c.createLinearGradient(0,h/2-th,0,h/2+th); g.addColorStop(0,'rgba(255,224,138,0)'); g.addColorStop(.5,'rgba(255,250,220,'+(1-t*.6)+')'); g.addColorStop(1,'rgba(255,224,138,0)'); c.fillStyle=g; c.fillRect(0,h/2-th,w,th*2); },
  };
  for(const k in CODE_FX){ if(scene.textures.exists(k))continue; const d=CODE_FX[k],cv=document.createElement('canvas'); cv.width=d.fw*d.frames; cv.height=d.fh; const c=cv.getContext('2d'); if(!c)continue;
    for(let i=0;i<d.frames;i++){ c.save(); c.translate(i*d.fw,0); c.beginPath(); c.rect(0,0,d.fw,d.fh); c.clip(); draw[k](c,i,d.frames,d.fw,d.fh); c.restore(); }
    try{ scene.textures.addSpriteSheet(k,cv,{frameWidth:d.fw,frameHeight:d.fh}); if(!scene.anims.exists(k))scene.anims.create({key:k,frames:scene.anims.generateFrameNumbers(k,{start:0,end:d.frames-1}),frameRate:d.rate,repeat:d.loop?-1:0}); }catch(e){} } }

let ASSET_VER = '';   // build-www ใส่เลข build → append ?v= กันรูปค้าง cache (แก้รูปแล้วโหลดใหม่เสมอ)
let ASSET_FILE_VERSIONS = null; // build-www ใส่ hash ของแต่ละไฟล์ → เปลี่ยน URL เฉพาะไฟล์ที่แก้จริง
let ASSET_FILE_SIZES = null; // v6.48.2 build-www ใส่ขนาดไฟล์ (byte) → หลอดโหลดเดียวบอก MB ที่เหลือ/ความเร็ว
const LoadMeter={ total:0, done:0, dev:0, seen:new Set(), t0:0, hist:[],
  sizeOf(u){ const k=String(u||'').split('?')[0]; return (ASSET_FILE_SIZES&&ASSET_FILE_SIZES[k])||0; },
  plan(){ if(this.total)return; const urls=new Set(),hero=Save.data.character||'momo',SO=stageOnlyArtKeys(),add=(k,u)=>{if(u&&!SO.has(k)&&!lazyArt(k,u,hero))urls.add(u);}; for(const k in ASSET_IMAGES)add(k,ASSET_IMAGES[k]); for(const k in ASSET_SHEETS)add(k,ASSET_SHEETS[k].url); for(const k in ASSET_FX)add(k,ASSET_FX[k].url); for(const k in ASSET_AUDIO)if(!k.startsWith('sfx_a22_')&&!k.startsWith('sfx_a23_')&&!/^bgm_/.test(k)&&(!k.startsWith('sfx_yz_')||hero==='yuzu'))urls.add(ASSET_AUDIO[k]); let t=0;urls.forEach(u=>t+=this.sizeOf(u));this.total=t;this.count=urls.size;this.t0=performance.now(); },
  mark(u,fromDev){ const k=String(u||'').split('?')[0]; if(!k||this.seen.has(k))return; this.seen.add(k); const z=this.sizeOf(k); this.done+=z; if(fromDev)this.dev+=z; const n=performance.now(); this.hist.push([n,this.done]); while(this.hist.length>2&&n-this.hist[0][0]>3000)this.hist.shift(); },
  show(){ const L=window.GameLoader; if(!L)return; this.plan(); const mb=b=>(b/1048576).toFixed(1);
    if(!this.total){ const p=this.count?this.seen.size/this.count:0; L.set(p,'Loading game data… '+this.seen.size+' / '+this.count+' files'); return; }
    const p=Math.min(1,this.done/this.total), left=Math.max(0,this.total-this.done), h=this.hist, dt=h.length>1?(h[h.length-1][0]-h[0][0])/1000:0, sp=dt>0.3?(h[h.length-1][1]-h[0][1])/dt:0;
    const net=this.done-this.dev; let t=(this.dev>net?'Preparing game data… ':'Loading game data… ')+mb(this.done)+' / '+mb(this.total)+' MB · '+mb(left)+' MB left'; if(sp>0)t+=' · '+(sp/1048576).toFixed(1)+' MB/s'+(left>0?' · ~'+Math.ceil(left/sp)+'s':''); t+='\n'+mb(this.dev)+' MB from device · '+mb(net)+' MB downloaded'; L.set(p,t); } };
// v6.50.9 ทริกบนหน้าโหลด: patch จาก game.js (index.html อาจโดนแคชเก่า) · ข้อความเดิม (MB/label) ไม่โชว์แล้ว
(function(){ const L=window.GameLoader; if(!L||L._tipPatched)return; L._tipPatched=true;
  const TIPS=['Dash makes you briefly invincible — dash through enemy attacks.','Red circles on the ground explode — step out fast.','Pick cards that boost your main attack early.','Elites drop more EXP and loot — hunt them down.','Grab hearts when HP is low; magnets pull in every EXP orb.','Your Unique skill charges over time — save it for bosses.','Higher difficulty gives better rewards.','Spend Sugar in the Temple to grow stronger between runs.','Keep moving — standing still lets the swarm surround you.','Watch the mission text above your hero to know what to do.'];
  let i=Math.floor(Math.random()*TIPS.length); const put=()=>{ const el=document.getElementById('load-status'); if(el)el.textContent='💡 '+TIPS[i]; };
  if(L._tipT){clearInterval(L._tipT);L._tipT=null;} put(); setInterval(()=>{ i=(i+1)%TIPS.length; put(); },4000);
  L.set=function(progress,label){ const p=Math.max(0,Math.min(1,Number(progress)||0)),f=document.getElementById('load-fill'),pc=document.getElementById('load-percent'); if(f)f.style.width=Math.round(p*100)+'%'; if(pc&&L._stageActive)pc.textContent=Math.round(p*100)+'%';else if(pc){ const n=LoadMeter.count||0,D=window.__dlPhase,net=LoadMeter.done-LoadMeter.dev; pc.textContent=D?'⬇️ Downloading '+Math.round(p*100)+'%  ('+D.n+' / '+D.N+')':(n&&LoadMeter.seen.size?(LoadMeter.dev>=net?'📦 Preparing ':'⬇️ Loading ')+Math.round(p*100)+'%  ('+Math.min(n,LoadMeter.seen.size)+' / '+n+')':Math.round(p*100)+'%'); } if(L._stageActive&&label){const phase=document.getElementById('load-phase');if(phase)phase.textContent=label;}put(); };   /* v7.9.91 เจ้าของ: แยก Downloading (เน็ต) กับ Preparing (ไฟล์ในเครื่อง) */   /* v6.96.1 file count (xx / yy) */
})();
function fileFromDevice(f){ try{ const x=f&&f.xhrLoader; return !!(x&&x.getResponseHeader&&x.getResponseHeader('x-mochi-cache')==='hit'); }catch(e){ return false; } }
function verUrl(u){ const v=ASSET_FILE_VERSIONS&&ASSET_FILE_VERSIONS[u];return v?(u+'?v='+v):(ASSET_VER?(u+'?v='+ASSET_VER):u); }
// เฟรมของสไปรต์ตัวละคร (ต้องเรียงตามไฟล์สตริป)
// [0 idle,1 blink,2 squash,3 stretch(พุ่ง),4 cheer(ดีใจ),5 hurt(เจ็บ),6 ko(สลบ),7 cast(ร่ายอัลติ)]
const CF = { idle:0, blink:1, squash:2, stretch:3, cheer:4, hurt:5, ko:6, cast:7 };
function registerRootKnightAnimations(scene){
  const key='mb10_ancient_root_knight';if(!scene.textures.exists(key))return;
  const defs={idle:{frames:[16,17,18,19,20,21,22,23],rate:8,repeat:-1},cleave:{frames:[32,33,34,35,36,37,38,39,40,41,42,43],rate:12,repeat:0},bastion:{frames:[12,13],rate:4,repeat:-1,yoyo:true},oath:{frames:[12,14],rate:3,repeat:0},charge:{frames:[24,25,26,27,28,29,30,31],rate:24,repeat:-1}};   /* v8.2.75 เฟส 5B: 8/12 เฟรม ต่อท้ายชีต · เวลาเท่าเดิม */
  for(const [name,def] of Object.entries(defs))if(!scene.anims.exists(key+'_'+name))scene.anims.create({key:key+'_'+name,frames:def.frames.map(frame=>({key,frame})),frameRate:def.rate,repeat:def.repeat,yoyo:!!def.yoyo});
}

function isArtKey(k){ return ASSET_IMAGES[k]||ASSET_SHEETS[k]; }
const STAGE_SHEETS=[
  ['boss1','e_ant_worker_animated','e_ant_scout_animated','e_ant_spitter_animated','e_ant_soldier_animated','e_ant_drone_animated','e_acid_animated'],['boss2','e_drain_slime_animated','e_drain_dasher_animated','e_drain_caster_animated','e_drain_bomber_animated','e_drain_tank_animated'],['boss3','e_fire_ember_animated','e_fire_chili_animated','e_fire_grinder_animated','e_fire_bomber_animated','e_fire_golem_animated'],['boss4','e_ice_wisp_animated','e_ice_shard_animated','e_ice_caster_animated','e_ice_bomber_animated','e_ice_guardian_animated'],['boss5_sovereign','boss5','mb5_banquet_executioner','e_void_crumb_animated','e_crown_ripper_animated','e_banquet_eye_animated','e_maw_truffle_animated','e_royal_oven_sentinel_animated'],
  ['c21_crown_sapling_animated','boss6_rootmother','mb6_sporewarden','ch2_enemy_atlas','ch2_prop_atlas','c21_sprout_animated','c21_vine_hunter_animated','c21_spore_lantern_animated','c21_fruit_pod_animated','c21_root_beetle_animated','c21_thorn_oracle_animated'],
  ['boss7_mycelium_behemoth','mb7_fungal_juggernaut','ch2_mycelium_enemy_atlas','ch2_prop_atlas','c22_drifter_animated','c22_hopper_animated','c22_sniper_animated','c22_mold_sac_animated','c22_bulwark_animated','c22_oracle_animated','c22_sporeling_animated'],
  ['boss8_hornet_queen','mb8_royal_stinger','ch2_nectar_enemy_atlas','ch2_prop_atlas','c23_drone_animated','c23_dartwing_animated','c23_pollen_sniper_animated','c23_honey_bomb_animated','c23_wax_guard_animated','c23_choir_moth_animated','c23_grub_animated'],
  ['boss9_chronobloom_orchid','mb9_season_keeper','ch2_seasons_enemy_atlas','c24_budling_animated','c24_sunscarab_animated','c24_leafblade_animated','c24_frostbell_animated','c24_stormfruit_animated','c24_equinox_animated','c24_season_wisp_animated','c24_bloom_sprout_animated','ui_c24_season_icons','proj_c24_frost_shard','proj_c24_autumn_leaf','vfx_c24_season_shift_spring','vfx_c24_season_shift_summer','vfx_c24_season_shift_autumn','vfx_c24_season_shift_winter','vfx_c24_spring_heal','vfx_c24_summer_burn','vfx_c24_summer_ignite','vfx_c24_trial_pass','vfx_c24_autumn_lane','vfx_c24_autumn_slash','vfx_c24_winter_patch','vfx_c24_winter_freeze','vfx_c24_vine_fan','vfx_c24_vine_slash','vfx_c24_solar_ring','vfx_c24_time_break','vfx_c24_season_seal','vfx_c24_metamorph'],
  ['boss10_true_rootmother','mb10_ancient_root_knight','ch2_root_enemy_atlas','c25_rootling_animated','c25_thorn_charger_animated','c25_bramble_assassin_animated','c25_sap_oracle_animated','c25_seed_bomb_animated','c25_bark_guard_animated','c25_root_choir_animated'],
  ...[1,2,3,4,5].map(n=>['c3_elite_animated','c3_mini'+n,'c3_boss'+n,'c3_e_basic_animated','c3_e_fast_animated','c3_e_shooter_animated','c3_e_bomber_animated','c3_e_tank_animated'])
];
/* v6.93 คีย์ภาพที่ใช้เฉพาะในด่าน */
let _stageOnlyArt=null;
function stageOnlyArtKeys(){ if(_stageOnlyArt)return _stageOnlyArt; const s=new Set(STAGE_SHEET_KEYS); try{ for(const i in STAGE_DECOR){ const d=STAGE_DECOR[i]; if(d&&d.items)for(const it of d.items)s.add(it.key); } }catch(e){} for(const k in ASSET_IMAGES)if(/^floor_c\d/.test(k))s.add(k); for(const k of [...s])if(bootKeep(k))s.delete(k); return _stageOnlyArt=s; }
function deferredImage(k){return k.startsWith('stage_card_s')||k.startsWith('floor_c')||k.startsWith('dec_c')||k.startsWith('codex_c3_')||k.startsWith('epilogue_s')||/^bg(?:[2-9]|1[0-5])$/.test(k);}
const PLAY_UI_KEYS=["lvl_title_banner_sheet", "lvl_title_burst", "lvl_held_chip_sheet", "lvl_held_bar", "lvl_card_base", "lvl_card_accent", "lvl_tpl_normal", "lvl_tpl_mutation", "lvl_tpl_relic", "lvl_tpl_unique", "lvl_tpl_crest", "lvl_tpl_fx_mutation", "lvl_tpl_fx_relic", "lvl_tpl_fx_unique", "lvl_card_glow", "lvl_card_select", "lvl_icon_socket", "lvl_ribbon_sheet", "lvl_pill_sheet", "lvl_combo_chip_sheet", "lvl_type_badge_sheet", "lvl_sparkle_sheet", "lvl_shine_strip", "vfx_lvl_open", "vfx_lvl_card_in", "vfx_lvl_confirm", "vfx_lvl_special_confirm", "pause_crest", "pause_title_divider", "pause_chip", "pause_stat_bar", "pause_stat_sep", "pause_panel", "pause_panel_header_line", "pause_tile", "pause_detail_strip", "pause_skill_slot", "pause_level_badge", "pause_relic_row", "pause_count_badge", "pause_btn_resume", "pause_btn_settings", "pause_btn_quit", "pause_icon_sheet", "pause_loot_icon_sheet"];PLAY_UI_KEYS.forEach(k=>STAGE_SHEETS.forEach(s=>s.push(k)));
const HUD_KEYS=["hud_top_panel","hud_mission_card","hud_exp_frame","hud_exp_fill","hud_level_badge","hud_counter_pill","hud_mission_bar_frame","hud_mission_bar_fill","hud_boss_bar_frame","hud_boss_bar_fill","hud_boss_plate","hud_ic_kill","hud_ic_sugar","hud_wave_pips","hud_ic_pause","hud_ic_sound","hud_round_btn","hud_speed_ring"];HUD_KEYS.forEach(k=>STAGE_SHEETS.forEach(s=>s.push(k)));   // v8.0.10 ใบ 47 HUD ส่วนบน (stage-lazy)
const XP_ORB_KEYS=['xp_orbs','xp_orb_shadow','vfx_xp_pickup','vfx_xp_pickup_big','vfx_xp_trail','vfx_xp_merge','xp_bar_icon'];XP_ORB_KEYS.forEach(k=>STAGE_SHEETS.forEach(s=>s.push(k)));   // v7.9.26 ใบ 29 โหลดพร้อมทุกด่าน ไม่ใช่บูต
const PICKUP_SIZE=.75,XP_ORB_PX=[0,22,26,31,37,44,56].map(v=>Math.round(v*PICKUP_SIZE)),   // v8.3.13 เจ้าของ: เม็ด EXP + ไอเทมเล็กลง 25%
 XP_TIER_COL=[0,0xff8fb5,0x8be6a4,0x7fc9ff,0xb98cff,0xffd75e,0xfff0a0];   // ขนาดเม็ดในโลก (ส่วนที่เห็น ~75% ของเฟรม) · สีย้อม VFX ตามระดับ
const CARD_ICON_KEYS=["ic_evo_momo", "ic_evo_cocoa", "ic_evo_berry", "ic_evo_mint", "ic_evo_taro", "ic_evo_sesame", "ic_fus_heartburst", "ic_fus_crownseed", "ic_fus_glacier", "ic_fus_shardstorm", "ic_fus_quakeking", "ic_fus_lastbear", "ic_fus_tempest", "ic_fus_skyjudge", "ic_fus_prismnova", "ic_fus_horizon", "ic_mod_bloom", "ic_mod_love", "ic_mod_heart", "ic_mod_aim", "ic_mod_jam", "ic_mod_spray", "ic_mod_icemine", "ic_mod_shatter", "ic_mod_flurry", "ic_mod_throw", "ic_mod_glide", "ic_mod_coldarc", "ic_mod_quake", "ic_mod_stomp", "ic_mod_rage", "ic_mod_crush", "ic_mod_ko", "ic_mod_after", "ic_mod_over", "ic_mod_field", "ic_mod_step", "ic_mod_judge", "ic_mod_ion", "ic_mod_focus", "ic_mod_prism", "ic_mod_lens", "ic_mod_scope", "ic_mod_refract", "ic_mod_mirror", "ic_mod_exec", "ic_mut_momo_ricochet", "ic_mut_momo_fan", "ic_mut_cocoa_rush", "ic_mut_cocoa_breaker", "ic_mut_cocoa_counter", "ic_mut_berry_seeker", "ic_mut_berry_sticky", "ic_mut_mint_blizzard", "ic_mut_mint_permafrost", "ic_mut_taro_chainlord", "ic_mut_taro_stormcaller", "ic_mut_sesame_fortress", "ic_mut_sesame_retaliate", "ic_trade_glass", "ic_trade_burn", "ic_trade_armor", "ic_trade_rush", "ic_trade_berserk", "ic_trade_core", "ic_trade_feast", "ic_trade_oath", "ic_inf_spicy", "ic_inf_sour", "ic_inf_sweet", "ic_inf_minty", "ic_cocoa_dashp", "ic_cocoa_drum", "ic_uq_power", "ic_uq_cd", "ic_uq_kill", "ic_uq_echo", "ic_uq_ready", "ic_path_p_arc_twin", "ic_path_p_spark_shock", "ic_path_p_bar_echo", "ic_path_r_spark", "ic_path_p_streak", "ic_uqm_snipe_refund", "ic_uqm_snipe_guard", "ic_uqm_blast_stun", "ic_uqm_blast_rain", "ic_uqm_reb_shield", "ic_uqm_reb_double", "ic_uqm_bloom_field", "ic_uqm_bloom_heal", "ic_uqm_lance_mines", "ic_uqm_lance_guard", "ic_uqm_gale_blades", "ic_uqm_gale_tail", "ic_uqm_rocket_ring", "ic_uqm_rocket_heat", "ic_uqm_rage_after", "ic_uqm_rage_guard", "ic_uqm_phantom_refund", "ic_uqm_phantom_slam", "ic_uqm_plasma_wide", "ic_uqm_plasma_twin", "ic_uqm_mark_jump", "ic_uqm_mark_nova", "ic_uqm_over_long", "ic_uqm_over_finale", "ic_path_p_arc_shock", "ic_path_p_arc_ground", "ic_path_p_sentry_ward", "ic_path_p_sentry_pulse", "ic_path_p_bar_wide", "ic_path_p_bar_chain", "ic_path_p_leapstun", "ic_path_p_recharge"];CARD_ICON_KEYS.forEach(k=>STAGE_SHEETS.forEach(s=>s.push(k)));   // v7.8.68 ใบ 26: ไอคอนการ์ดโหลดพร้อมด่าน (ไม่กินงบบูต)   // v7.8.59 ชิ้น UI เลเวลอัพ/หยุดเกม โหลดพร้อมด่าน (ไม่กินงบบูต)
if(typeof ASSET_FX!=="undefined")for(const k in ASSET_FX){const m=/^(?:vfx|arena)_b(\d\d)_/.exec(k);if(m){STAGE_SHEETS[+m[1]-1]?.push(k);if(k==='vfx_b06_pod_shield')STAGE_SHEETS[9]?.push(k);}else if(/^(vfx_bpin_|counter_pin_)/.test(k))STAGE_SHEETS[14]?.push(k);else{const c=/^counter_c(\d)(\d)_/.exec(k);if(c)STAGE_SHEETS[(+c[1]-1)*5+(+c[2])-1]?.push(k);else if(/^vfx_counter_/.test(k))STAGE_SHEETS.forEach(z=>z.push(k));}}   // v7.8.57 ใบ 22: ชุด VFX บอส vfx_bNN_* โหลดพร้อมด่าน NN
for(let i=0;i<15;i++){STAGE_SHEETS[i]?.push('bshot_'+String(i+1).padStart(2,'0'));if([0,3,6,10,14].includes(i))STAGE_SHEETS[i]?.push('vfx_body_shockwave','vfx_body_skydrop','vfx_body_sweep','vfx_body_charge');}STAGE_SHEETS[14]?.push('bshot_pin');   // v8.0.80 ใบ 60 โหลดต่อด่าน
for(const [old,key]of Object.entries(BOSS_OUTLINE813_MAP)){const m=/^vfx_b(0[1-5])_/.exec(old);if(m)STAGE_SHEETS[+m[1]-1].push(key);else if(old.startsWith('vfx_body_'))for(let i=0;i<5;i++)STAGE_SHEETS[i].push(key);}
for(const [old,key]of Object.entries(BOSS_OUTLINE814_MAP)){const n=+old.slice(5,7)-1;STAGE_SHEETS[n]?.push(key);if(old==='vfx_b06_pod_shield')STAGE_SHEETS[9].push(key);}for(let i=5;i<10;i++)for(const [old,key]of Object.entries(BOSS_OUTLINE813_MAP))if(old.startsWith('vfx_body_'))STAGE_SHEETS[i].push(key);
for(const [old,key]of Object.entries(BOSS_OUTLINE815_MAP))STAGE_SHEETS[old.startsWith('vfx_bpin_')?14:+old.slice(5,7)-1]?.push(key);for(let i=10;i<15;i++)for(const [old,key]of Object.entries(BOSS_OUTLINE813_MAP))if(old.startsWith('vfx_body_'))STAGE_SHEETS[i].push(key);
for(const d of Object.values(BOSS_BODY816_MAP))STAGE_SHEETS[d.stage]?.push(d.key);
for(let i=0;i<15;i++)STAGE_SHEETS[i]?.push(BOSS_SHOT817_MAP['bshot_'+String(i+1).padStart(2,'0')]);STAGE_SHEETS[14]?.push(BOSS_SHOT817_MAP.bshot_pin);
const STAGE_SHEET_KEYS=new Set(STAGE_SHEETS.flat());
// v6.37 โหลดเร็วขึ้น: ภาพที่ใช้เฉพาะหน้าย่อย/ในด่าน + VFX ทั้งหมด ไม่โหลดตอนบูต → โหลดเบื้องหลังหลังเข้าเมนู (ensureDeferred)
// v6.38 บูตโหลดเฉพาะของที่เมนูหลักใช้ · ที่เหลือทั้งหมดโหลดเบื้องหลัง (ensureDeferred) ก่อนเข้าด่าน/หน้าย่อย
function bootKeep(k){return /^hub_btn_|^hub_ui_|^hub_(?:momo|fg|sky|window|cloud)_|^vfx_hub_|^menu_hub|^vfx_poof$|^replay_progress_art$|^chapter\d_cover$|^chapter_endgame_cover$|^tile___/.test(k);}
// v6.43 (เจ้าของ: แยกโหลดเฉพาะหน้าที่เข้า) แต่ละหน้าเมนูรอแค่โฟลเดอร์ของตัวเอง · ที่เหลือโหลดเบื้องหลังตามเดิม
// v7.8.49 Temple Weave UI: key → [cellW, cellH, cols, nineSlice [l,t,r,b] | null] (จาก assets/art/temple/ui/MANIFEST.json)
// v7.8.59 ใบ 25: ชั้นหน้าเมนู [key, x, y, w, h (พิกัดผืน 1080×1920), originX, originY (pivot), anchorX, anchorY] เรียงหลัง→หน้า
const HUB_LAYERS=[["hub_sky_glow",0,0,1080,420,null,null,null,null],["hub_window_lights",0,81,1080,938,null,null,null,null],["hub_cloud_sheet",0,0,400,160,null,null,null,null],["hub_momo_cape",24,493,533,340,0.8405,0.0824,null,null],["hub_momo_braid",156,419,287,244,0.8676,0.1189,null,null],["hub_momo_body",140,197,574,729,0.6551,0.8642,null,null],["hub_momo_blink",476,362,175,93,null,null,null,null],["hub_momo_hairflower",337,195,159,165,0.5535,0.7455,null,null],["hub_momo_arm",483,-107,717,764,0.1158,0.877,null,null],["hub_momo_ribbon",715,242,268,251,0.8134,0.0,null,null],["hub_fg_flowers_left",0,715,633,297,0.3949,1.0943,null,null],["hub_fg_flowers_right",679,877,327,175,0.6758,0.9886,null,null],["vfx_hub_petals",0,0,64,64,null,null,null,null],["vfx_hub_wand_sparkle",0,0,256,256,null,null,1000,100],["vfx_hub_flag",0,0,128,128,null,null,487,49],["vfx_hub_firefly",0,0,48,48,null,null,null,null],["vfx_hub_moon_twinkle",0,0,64,64,null,null,null,null],["vfx_hub_logo_shine",0,0,512,160,null,null,null,null],["vfx_hub_play_shimmer",0,0,512,128,null,null,null,null],["hub_btn_play_anim",0,0,128,128,null,null,null,null],["hub_btn_heroes_anim",0,0,128,128,null,null,null,null],["hub_btn_gear_anim",0,0,128,128,null,null,null,null],["hub_btn_activity_anim",0,0,128,128,null,null,null,null],["hub_btn_codex_anim",0,0,128,128,null,null,null,null]];
const TEMPLE_UI={screen_temple_weave:[720,1280,1,null],temple_altar_trio:[600,360,1,null],temple_altar_glow_sheet:[200,200,3,null],temple_title_frame:[700,100,1,[160,30,160,30]],temple_rank_ribbon:[600,55,1,[70,18,70,18]],temple_tab_sheet:[280,65,1,[72,18,38,18]],temple_power_bar:[700,40,1,[55,12,55,12]],temple_power_fill:[600,20,1,[12,6,12,6]],temple_core_card_sheet:[880,200,1,[225,40,280,40]],temple_core_card_max:[880,200,1,[260,40,250,40]],temple_star_sheet:[64,64,3,null],temple_buy_btn_sheet:[240,60,1,[75,16,40,16]],temple_weave_btn_sheet:[500,110,1,[135,30,75,30]],temple_ribbon_knot:[200,100,1,null],screen_temple_perks:[720,1280,1,null],perk_tier_banner:[440,45,1,[90,12,45,12]],perk_tier_line:[600,12,1,null],perk_card_sheet:[280,230,3,[32,32,32,32]],perk_pip_sheet:[40,40,3,null],perk_btn_sheet:[200,45,1,[27,12,27,12]],ui_lock_icon:[96,96,1,null],perk_req_chip:[210,40,1,[58,11,30,11]],perk_special_banner:[920,80,1,[240,22,220,22]],perk_compass_icon:[160,160,1,null],perk_ancient_banner:[550,40,1,[90,11,40,11]],perk_ancient_card_sheet:[300,100,1,[110,20,35,20]],perk_scroll_chip:[160,40,1,[50,11,20,11]],ic_scroll:[128,128,1,null],perk_reset_btn:[500,70,1,[55,19,55,19]],ic_reset:[96,96,1,null],temple_back_btn:[180,60,1,[60,16,32,16]],temple_currency_chip:[180,60,1,[75,16,28,16]],ui_notify_dot:[64,64,1,null],temple_sparkle_sheet:[64,64,6,null]};
// v8.0.34 ImageGen orders 50–54: half-size, menu-only, source manifests retained.
const MENU_ORDER_ART={"rar_frame":[104,122,4,[20.0,20.0,20.0,20.0],4,false,"NORMAL"],"rar_cell":[58,58,4,[12.0,12.0,12.0,12.0],4,false,"NORMAL"],"rar_gem":[24,24,4,null,4,false,"NORMAL"],"merge_slot_empty":[104,122,1,null,1,false,"NORMAL"],"ic_merge":[64,64,1,null,1,false,"NORMAL"],"ic_forge_point":[32,32,1,null,1,false,"NORMAL"],"ic_star_up":[32,32,1,null,1,false,"NORMAL"],"ic_mod_remove":[32,32,1,null,1,false,"NORMAL"],"ic_lucky":[32,32,1,null,1,false,"NORMAL"],"vfx_merge_fuse":[192,192,8,null,8,false,"NORMAL"],"vfx_rarity_up":[128,128,6,null,6,false,"NORMAL"],"vfx_star_up":[96,96,6,null,6,false,"NORMAL"],"vfx_lucky":[128,128,6,null,6,false,"NORMAL"],"vfx_forge_hit":[96,96,6,null,6,false,"NORMAL"],"login_panel":[336,330,1,[45.0,60.0,45.0,30.0],1,false,"NORMAL"],"login_cell":[70,70,3,[18.0,18.0,18.0,18.0],3,false,"NORMAL"],"login_stamp":[64,64,1,null,1,false,"NORMAL"],"login_glow":[96,96,6,null,6,true,"ADD"],"day_reward":[64,64,4,null,4,false,"NORMAL"],"dq_box":[64,64,6,null,6,false,"NORMAL"],"dq_band":[32,32,3,null,3,false,"NORMAL"],"dq_week_pip":[32,32,2,null,2,false,"NORMAL"],"ic_reroll":[32,32,1,null,1,false,"NORMAL"],"aw_medal":[64,64,8,null,8,false,"NORMAL"],"aw_star":[32,32,3,null,3,false,"NORMAL"],"aw_secret":[64,64,1,null,1,false,"NORMAL"],"aw_secret_open":[96,96,6,null,6,false,"NORMAL"],"aw_title_ribbon":[160,32,1,[30.0,10.0,30.0,10.0],1,false,"NORMAL"],"aw_claim_all":[64,64,1,null,1,false,"NORMAL"],"vfx_aw_claim":[96,96,6,null,6,false,"NORMAL"],"bs_card":[160,84,3,[20.0,20.0,20.0,20.0],3,false,"NORMAL"],"bs_unknown":[64,64,1,null,1,false,"NORMAL"],"bs_tier_pip":[24,24,3,null,3,false,"NORMAL"],"bs_weak":[32,32,1,null,1,false,"NORMAL"],"bs_detail_panel":[320,380,1,[30.0,40.0,30.0,30.0],1,false,"NORMAL"],"rb_page":[360,640,1,null,1,false,"NORMAL"],"rb_chip":[110,44,2,[15.0,15.0,15.0,15.0],2,false,"NORMAL"],"rb_unknown":[48,48,1,null,1,false,"NORMAL"],"rb_complete":[64,64,1,null,1,false,"NORMAL"],"dig_lantern":[64,64,2,null,2,false,"NORMAL"],"vfx_dig_light":[192,192,6,null,6,false,"ADD"],"dig_hint_badge":[32,32,4,null,4,false,"NORMAL"],"dig_miner":[64,64,4,null,4,true,"NORMAL"],"rank_reward_icons":[64,64,5,null,10,false,"NORMAL"]};
/* v8.1.43 ใบ 65 Daily Login 30 วัน (ภาพ 2× ของขนาดบนจอ) */
Object.assign(MENU_ORDER_ART,{"l30_panel":[672,848,1,[56,56,56,56],1,false,"NORMAL"],"l30_header":[600,150,1,null,1,false,"NORMAL"],"l30_ruby":[256,256,1,null,1,false,"NORMAL"],"l30_cell":[96,96,4,null,4,false,"NORMAL"],"l30_cell30":[96,96,2,null,2,false,"NORMAL"],"l30_stamp":[96,96,1,null,1,false,"NORMAL"],"l30_today_fx":[160,160,6,null,6,true,"ADD"],"l30_reward":[96,96,6,null,6,false,"NORMAL"],"l30_reward30":[192,192,1,null,1,false,"NORMAL"],"l30_button":[480,92,2,[48,20,48,20],1,false,"NORMAL"],"l30_claim_burst":[192,192,8,null,8,false,"ADD"]});
Object.assign(MENU_ORDER_ART,{
  vfx78_ink_move:[256,256,8,null,8,false,'NORMAL'],
  vfx78_codex_up:[256,256,8,null,8,false,'NORMAL'],
});
for(const [k,d] of Object.entries(MENU_ORDER_ART))TEMPLE_UI[k]=d.slice(0,4);

Object.assign(TEMPLE_UI,{"sc79_header_plate":[512,192,1,[48,40,48,40]],"sc79_star_socket":[128,128,2,null]});   // v8.1.108 ใบ 79
Object.assign(TEMPLE_UI,{"lvl_title_banner_sheet":[500,48,1,[50,16,50,16]],"lvl_title_burst":[320,160,1,null],"lvl_held_chip_sheet":[64,64,3,null],"lvl_held_bar":[800,44,1,[16,12,16,12]],"lvl_card_base":[384,150,1,[32,28,32,28]],"lvl_tpl_normal":[384,150,1,[32,28,32,28]],"lvl_tpl_mutation":[384,150,1,[32,28,32,28]],"lvl_tpl_relic":[384,150,1,[32,28,32,28]],"lvl_tpl_unique":[384,150,1,[32,28,32,28]],"lvl_tpl_crest":[96,96,4,null],"lvl_tpl_fx_mutation":[384,150,6,null],"lvl_tpl_fx_relic":[384,150,6,null],"lvl_tpl_fx_unique":[384,150,6,null],"lvl_card_accent":[384,150,1,[32,28,32,28]],"lvl_card_glow":[416,182,1,[40,40,40,40]],"lvl_card_select":[400,166,1,[40,36,40,36]],"lvl_icon_socket":[96,96,2,null],"lvl_ribbon_sheet":[180,28,1,[24,8,24,8]],"lvl_pill_sheet":[120,22,1,[12,8,12,8]],"lvl_combo_chip_sheet":[48,48,2,null],"lvl_type_badge_sheet":[64,64,7,null],"lvl_sparkle_sheet":[64,64,4,null],"lvl_shine_strip":[48,256,1,null],"pause_crest":[500,180,1,null],"pause_title_divider":[400,20,1,null],"pause_chip":[200,32,1,[20,12,20,12]],"pause_stat_bar":[850,64,1,[60,24,60,24]],"pause_stat_sep":[8,64,1,null],"pause_panel":[440,150,1,[30,40,30,25]],"pause_panel_header_line":[350,16,1,[16,6,24,6]],"pause_tile":[270,100,1,[24,24,24,24]],"pause_detail_strip":[800,32,1,[20,12,20,12]],"pause_skill_slot":[128,128,3,null],"pause_level_badge":[64,64,1,null],"pause_relic_row":[800,110,1,[135,32,120,32]],"pause_count_badge":[96,64,1,[24,24,24,24]],"pause_btn_resume":[850,130,1,[220,32,100,32]],"pause_btn_settings":[410,100,1,[40,32,40,32]],"pause_btn_quit":[410,100,1,[40,32,40,32]],"pause_icon_sheet":[128,128,4,null],"pause_loot_icon_sheet":[160,160,3,null],"hub_cloud_sheet":[174,70,3,null],"hub_momo_blink":[152,81,3,null]});   // v7.8.59 ใบ 23/24 ชิ้น UI (tuPanel/tuImg ใช้ร่วม)
Object.assign(TEMPLE_UI,{"jr_page_bg":[540,960,1,null],"jr_header_plaque":[450,75,1,null],"jr_btn_back":[180,55,2,null],"jr_chip_currency":[190,50,1,[16,12,16,12]],"jr_chip_plus":[36,36,1,null],"jr_panel":[400,200,1,[70,50,70,50]],"jr_panel_inset":[350,120,1,[50,30,50,30]],"jr_divider":[380,14,1,null],"jr_section_title_deco":[32,32,1,null],"jr_warning_ribbon":[500,40,1,[90,9,90,9]],"jr_slot":[80,90,4,null],"jr_bag_cell":[90,90,3,null],"jr_tag_level":[60,26,1,[9,6,9,6]],"jr_badge_new":[28,28,1,null],"jr_row":[750,60,1,[50,11,50,11]],"jr_icon_ring":[56,56,4,null],"jr_star":[28,28,2,null],"jr_chip_pct":[80,32,1,[10,8,10,8]],"jr_checkbox":[32,32,2,null],"jr_radio":[32,32,2,null],"jr_lock_cell":[32,32,1,null],"jr_btn_primary":[750,100,1,[165,22,60,22]],"jr_btn_secondary":[380,75,1,[50,16,50,16]],"jr_btn_accent":[260,75,1,[38,18,38,18]],"jr_btn_icon":[50,50,2,null],"jr_btn_pill":[220,40,1,[30,10,30,10]],"jr_btn_pager":[75,45,3,null],"jr_icon_sheet":[64,64,4,null],"jr_forge_summary":[750,150,1,[250,35,50,35]],"jr_forge_footer":[750,150,1,[90,35,90,50]],"bk_page_turn":[432,768,3,null],"bk_page_shadow":[216,384,3,null],"bk_spine":[51,1536,1,null],"vfx_bk_dust":[102,102,6,null],"bk_cover_closed":[864,1536,1,null],"bk_cover_open":[432,768,5,null],"bk_cover_glow":[410,410,1,null]});   // v7.9.10 ใบ 27 สมุด (jr_) + ใบ 28 หนังสือ (bk_) · [cellW,cellH,cols,nineSlice] หลังแพ็ก
Object.assign(TEMPLE_UI,{"ic_lb_settings":[128,128,1,null],"lb_currency_plain":[192,40,1,[22,0,22,0]],"lb_stage_panel":[320,110,1,[45,30,45,30]],"lb_battle_btn":[320,90,1,[64,0,64,0]],"lb_arrow_btn":[48,60,1,null],"lb_side_btn":[80,80,1,[16,16,16,16]],"lb_profile_frame":[260,75,1,[35,18,35,18]],"lb_avatar_ring":[75,75,1,null],"lb_currency_pill":[150,45,1,[24,0,42,0]],"ic_lb_battle":[128,128,1,null],"ic_nav_home":[128,128,1,null],"ic_nav_heroes":[128,128,1,null],"ic_nav_play":[128,128,1,null],"ic_nav_gear":[128,128,1,null],"ic_nav_activities":[128,128,1,null],"ic_side_codex":[128,128,1,null],"ic_side_inbox":[128,128,1,null],"ic_side_news":[128,128,1,null],"ic_side_daily":[128,128,1,null],"ic_side_awards":[128,128,1,null],"lb_nav_bg":[540,75,1,[18,0,18,0]],"lb_nav_active":[150,70,1,[30,14,30,14]],"lb_nav_divider":[3,50,1,null],"lb_star":[48,48,1,null],"lb_power_pill":[210,40,1,[24,0,24,0]],"lb_hero_shadow":[200,60,1,null],"vfx_lb_battle_shine":[320,90,6,null],"vfx_lb_sparkle":[64,64,2,null]});   // v7.9.51 ใบ 33 Lobby UI (scripts/pack-lobby-ui.py)
/* v7.9.58 ใบสั่งอาร์ต 34: ฮีโร่ขยับในหน้า Lobby (แพ็ก 75% = 384×480/เฟรม, เท้า y450) · โหลดเฉพาะฮีโร่ที่เลือก ไม่โหลดตอนบูต · Sesame ผูกด้วย (เจ้าของ 22 ต.ค.) */
/* v8.2.36 E1: LH_SHEETS/LH_USE_SHEETS ลบแล้ว (ใบ 34 ปิดตั้งแต่ v7.9.61) */
const CODE_TELEGRAPH=true;
const CA_LANTERN=[200,150],CA_LOBES=9,CA_CLAWS=7;   /* v8.2.80 เจ้าของ: Clear the Fog แสงรอบตัวกว้างขึ้น (130→85 เดิม) · ขอบมืดขยับน่ากลัว */
const CR_ESC_SPD=.18,CR_WARN=[.9,.12,.6],CR_LOCK_D=190,CR_LOCK_T=2.2,CR_PULL_R=170,CR_HIT_R=120,CR_PERFECT=.35,CR_STUCK=8,CR_HEAD_HP=6,CR_HEAD_POP=.1;   /* v8.2.81 Lure the Crown Root SCAMPER 1–4 */
const CAPTURE_CRACK=true,HC_NEAR=95,HC_SEC=22,HC_TOUCH=70,HC_SPEED=460,HC_HOLES=[.3,.55,.8,1];
/* v8.2.44 เจ้าของ: แบบ Abyss ใน PoE — รอยแยกยาว/ช้า คืบเมื่อผู้เล่นอยู่ใกล้ปลาย · มอนค่อย ๆ คลานออกตามรอยแยก · หลุมปล่อยมอนต่อเนื่อง (ฆ่าครบ = ของ) · ปลายทาง 3 ระลอก + Elite + หีบ Abyss · [Ch1, Ch2+] */
const HC_SEGS=[10,13],HC_CRAWL=[60,72],HC_FOLLOW=260,HC_TRICKLE=[2,1.5],HC_HOLE_N=[6,9],HC_HOLE_GAP=.6,HC_FINAL_WAVES=4,HC_FINAL_PER=[6,10],HC_FINAL_GAP=3,HC_FINAL_MAX=50,HC_FINAL_TAIL=2,HC_FINAL_TAIL_SEC=6,HC_FINAL_STREAM=.35,HC_FINAL_TANKS=[0,1,2,0],HC_FINAL_CAP=30,HC_BRUTE={scale:1.4,hp:3,tint:0x8a5cc8},HC_CHEST_MUL=1.5;   /* v8.2.48 เจ้าของ: หลุมสุดท้ายมอนเยอะ + มีตัวถึก (4 ระลอก × 10 · Ch1 × 6 · ระลอก 2/3 มี tank · Abyss Brute ปิดท้ายพร้อม Elite · หีบ Sugar ×1.5) */
/* v8.2.44 เจ้าของ: มอนในภารกิจโผล่เฉย ๆ → ค่อย ๆ ขึ้นจากพื้น/ก้าวออกจากประตู · ระหว่างเกิดไม่เดิน ไม่ตี ไม่โดนตี · เอฟเฟกต์เต็มพร้อมกันได้ ≤ 8 */
const EMERGE_MS=520,EMERGE_FX_MAX=8;   /* v8.2.7 เจ้าของ: แบบ Abyss จริง — แตะรอยแยก → วิ่งเองเร็วไปหลุมถัดไป · หลุมแตก = มอน + ของ · หลุมสุดท้ายมอนเยอะ ฆ่าหมด = จบ */   /* v8.2.4 เจ้าของ: Capture the Zone (วงกลม+ตัวเลข) → 🕳️ Hunger Crack (แนว PoE Abyss) · รอยแยกงอกคดเคี้ยวไปทั่วแมพ เดินตามปลายรอยแยกให้มันงอกต่อ มอนคลานออกมาตลอดทาง ปลายทางคือหลุม → ปิดหลุม = รางวัลระเบิด · ไม่มีตัวเลข ไม่มีวง · false = วงเดิม */
const CLEANAIR_V2=true;   /* v8.1.162 เจ้าของ: Clean Air ใหม่ = ป่ามืด (Viridian/Wildwood) · เดินหา Wisp ที่กระจายทั่วแมพ · ชาร์จ 1.5 วิ แล้วระเบิดแสง · false = แบบวงเดินตาม (v8.1.161) */
const CLEANAIR_FOGWAR=true;   /* v8.1.159 เจ้าของ: Clean Air หมอกมืดทั้งจอ เปิดตามทาง Wisp (false = หมอกพิษลอยแบบ v8.1.154) */
const CODE_VFX={bolt:true,aim:true,cocoa:true,xp:true,generic:true,bossWave:['b01'],lane:true,taroBurst:true,bubble:true,sparkle:true,trail:true,dust:true,heal:true};   /* v8.1.156 เจ้าของ: CODE_VS_ART รอบ 2 ข้อ 2–7 · ปิดทีละข้อได้ (false / [] = กลับเป็นภาพเดิม) */   /* v8.1.155 เจ้าของ: วงเตือนท่าบอส/hazard วาดด้วยโค้ด · false = ภาพ vfx_bXX_warn เดิม */
Object.assign(TEMPLE_UI,{"tut_ic_welcome":[128,128,1,null],"tut_ic_move":[128,128,1,null],"tut_ic_attack":[128,128,1,null],"tut_ic_sweets":[128,128,1,null],"tut_ic_cards":[128,128,1,null],"tut_ic_dash":[128,128,1,null],"tut_ic_unique":[128,128,1,null],"tut_ic_hp":[128,128,1,null],"tut_ic_ready":[128,128,1,null],"tut_finger":[128,128,1,null],"tut_card_frame":[390,300,1,[40,75,40,40]],"vfx_tut_great":[128,128,6,null]});
const TUT_KEYS=["tut_ic_welcome", "tut_ic_move", "tut_ic_attack", "tut_ic_sweets", "tut_ic_cards", "tut_ic_dash", "tut_ic_unique", "tut_ic_hp", "tut_ic_ready", "tut_finger", "tut_card_frame", "vfx_tut_great"];
const LB_KEYS=["lb_dialog_speech","lb_dialog_thought","ic_lb_settings","lb_currency_plain","ic_nav_bazaar","ic_nav_upgrade","ic_side_mail","lb_stage_panel","lb_battle_btn","lb_arrow_btn","lb_side_btn","lb_profile_frame","lb_avatar_ring","lb_currency_pill","ic_lb_battle","ic_nav_home","ic_nav_heroes","ic_nav_play","ic_nav_gear","ic_nav_activities","ic_side_codex","ic_side_inbox","ic_side_news","ic_side_daily","ic_side_awards","lb_nav_bg","lb_nav_active","lb_nav_divider","lb_star","lb_power_pill","lb_hero_shadow","vfx_lb_battle_shine","vfx_lb_sparkle"];
const JR_REQ=['jr_page_bg','jr_header_plaque','jr_btn_back','jr_chip_currency','jr_panel','jr_divider','jr_warning_ribbon','jr_slot','jr_bag_cell','jr_row','jr_icon_ring','jr_checkbox','jr_btn_primary','jr_btn_secondary','jr_btn_accent','jr_btn_icon','jr_btn_pill','jr_btn_pager','jr_icon_sheet','jr_forge_summary','jr_forge_footer','jr_badge_new'];
// สีตัวหนังสือธีมม่วง → หมึกบนกระดาษ (เกรด/ดาวใช้เฉดเข้มของสีเดิม)
const JR_INK=(()=>{const I='#3b2416',S='#6b4a33',G='#2f7a3c',R='#a8323e',Y='#8a5a00',m={};const put=(c,l)=>l.forEach(x=>m[x]=c);
  put(I,['#ffffff','#fff','#fff0df','#fff0e7','#f1e5ef','#e9dce8','#f5e6f3','#fff1d8','#efe4f7','#e9e2f2','#e9dcff','#fff3f3','#d8cde2','#e6ddef']);
  put(S,['#b9abc5','#9a90ab','#c5b6ce','#bfaecd','#9a8aa7','#a99fbb','#c8b8d4','#c9bdd6','#b7abc9','#6f6283','#5e5062','#8a809a','#bbaabd','#8d8195','#b9a7be','#c7bdd6']);
  put('#8a1f2c',['#ffb3cf','#ff7ba8','#ff9ec4']); put(Y,['#ffd166','#ffd9a0','#ffe39b','#ffe08a']); put(G,['#8bd3a0','#7de0a1','#a2e1bc','#a8f0bf','#9fd4bc','#5df08a','#7ee08f','#75ddb4']);
  put(R,['#ff8da2','#ff6b81']); put('#8a6400',['#ffcf5a']); put('#6d3aa8',['#c9a3ff','#c891ff']); put('#b4531a',['#ff8f3a','#ffae3d','#ffb27a']); put('#1f5fa8',['#6fb8ff','#8bd3ff']); put('#2a7a6a',['#8be0c8']); return m;})();
Object.assign(TEMPLE_UI,{"bk_open_long":[432,768,4,null],"bk_page_riffle":[432,768,4,null],"bk_clasp":[256,256,6,null],"bk_emblem_spin":[256,256,8,null],"vfx_bk_magic":[256,256,8,null],"vfx_bk_burst":[512,512,6,null],"bk_cover_clean_plate":[432,768,1,null],"ic_nav_bazaar":[256,256,1,null],"ic_nav_upgrade":[256,256,1,null],"ic_side_mail":[256,256,1,null]});
Object.assign(TEMPLE_UI,{"hud_top_panel":[739,56,1,[24,8,24,8]],"hud_mission_card":[738,68,1,[24,8,24,8]],"hud_exp_frame":[300,14,1,[6,5,6,5]],"hud_exp_fill":[280,8,1,[3,3,3,3]],"hud_level_badge":[52,32,1,[11,11,11,11]],"hud_counter_pill":[80,28,1,[12,11,12,11]],"hud_mission_bar_frame":[240,12,1,[5,4,5,4]],"hud_mission_bar_fill":[230,8,1,[3,3,3,3]],"hud_boss_bar_frame":[320,22,1,[15,9,15,9]],"hud_boss_bar_fill":[300,12,1,[5,5,5,5]],"hud_boss_plate":[737,59,1,[24,8,24,8]],"hud_ic_kill":[32,32,1,null],"hud_ic_sugar":[32,32,1,null],"hud_wave_pips":[24,24,3,null],"hud_ic_pause":[32,32,1,null],"hud_ic_sound":[32,32,2,null],"hud_round_btn":[107,107,3,null],"hud_speed_ring":[64,64,4,null]});   // v8.0.10 ใบ 47 (scripts/pack-battle-hud-top.py)
Object.assign(TEMPLE_UI,{chest_silver_open:[256,256,6,null],chest_gold_open:[256,256,6,null],bz_chest_card:[390,200,1,[32,32,32,32]]});   // v7.9.79 ใบ 40
const CHEST_KEYS=['chest_silver','chest_gold','chest_silver_open','chest_gold_open','bz_chest_card'];
const RUBY_STAGE_KEYS=['mascot_ruby','mascot_ruby_happy','mascot_ruby_alert','mascot_ruby_think','mascot_ruby_cheer','mascot_ruby_sad','ruby_point','vfx_ruby_sparkle'];
const RUBY_COMIC_KEYS=['ruby_comic_s1_1','ruby_comic_s1_2','ruby_comic_s1_3','ruby_comic_s2_1','ruby_comic_s2_2','ruby_comic_s2_3','ruby_comic_s3_1','ruby_comic_s3_2','ruby_comic_s3_3','ruby_comic_s4_1','ruby_comic_s4_2','ruby_comic_s4_3','ruby_comic_s5_1','ruby_comic_s5_2','ruby_comic_s5_3'];
const RUBY_STORY_KEYS=['ruby_story_pantry','ruby_story_furnace','ruby_story_frozen','ruby_story_crown','ruby_story_paper'];
const RUBY_MENU_KEYS=['ruby_talk_normal','ruby_talk_explain','ruby_talk_proud','ruby_talk_worried','ruby_memory_grandma','ruby_memory_jar'];
Object.assign(TEMPLE_UI,{ruby_point:[128,128,4,null],vfx_ruby_sparkle:[64,64,6,null]});
const BKP_KEYS=["bk_open_long", "bk_clasp", "bk_emblem_spin", "vfx_bk_magic", "bk_cover_clean_plate"];
const BOOK_KEYS=['bk_page_turn','bk_page_shadow','bk_spine','vfx_bk_dust','bk_cover_closed','bk_cover_open','bk_cover_glow'];
const MENU_GROUPS=[
  [/^gLoadout$/,/assets\/art\/mobile_ui_789\/gear_/],
  [/^hub$/,/assets\/art\/(?:hub_reference|menu_buttons)\//],
  [/^(upgrade|perks)$/,/assets\/(?:art\/temple\/|ui\/temple\/|art\/icons\/|ui\/currency\/)/],
  [/^kitchen$/,/assets\/(?:art\/kitchen\/|art\/icons\/)/],
  [/^dig$/,/assets\/art\/dig\//],
  [/^(atlas|recipes|rift|recipeprep|recipebag|egbuild|pact)$/,/assets\/(?:art\/delve\/|art\/pinnacle\/|art\/build_(?:paths|cards)\/|art\/biomes\/)/],
  [/^craft$/,/assets\/(?:gear\/|ui\/currency\/|art\/hero_roster_ui\/|art\/forge_ui\/|art\/journal\/)/],
  [/^(gear|bazaar|gearInbox|tradein|stats)$/,/assets\/(?:gear\/|ui\/currency\/|character_cards\/|art\/hero_roster_ui\/|art\/journal\/)/],
  [/^(char|chars|talents)$/,/assets\/(?:character_cards\/|art\/(?:build_(?:paths|cards)|talents|hero_roster(?:_ui)?)\/|art\/mobile_ui_789\/stat_)/],
  [/^(skills|bestiary)$/,/assets\/(?:art\/icons\/|gear\/|art\/build_(?:paths|cards)\/|art\/ch3_bosses\/|art\/ch3_enemies\/)/],
];
const UI_ART_RE=/assets\/(?:art\/menu_(?:screens|stage_cards)\/|ui\/|art\/(?:menu_orders|ui|icons|temple|kitchen|dig|delve\/|menu_buttons|hub_reference|hero_roster(?:_ui)?|mobile_ui_789|forge_ui|build_(?:paths|cards)|talents|rewards|entry)|incoming\/|gear\/|character_cards\/|icons\/)/;
function menuGroupRe(s){ const g=MENU_GROUPS.find(m=>m[0].test(s||'')),base0=g?g[1]:/assets\/(?:art\/icons\/|ui\/currency\/)/,base=new RegExp(base0.source+'|assets/art/menu74/(?!vfx78_)'+(s==='craft'?'|assets/art/menu74/vfx78_ink_move':s==='bestiary'?'|assets/art/menu74/vfx78_codex_up':'')+(/^(patrol|gActivity|hub|dig)$/.test(s||'')?'|assets/art/patrol70/':'')+(s==='dig'?'|assets/art/expedition91/':''));   /* v8.1.93 ไอคอนใหม่โหลดทุกหน้าเมนู (เล็ก) · Patrol โหลดหน้า Patrol/Activities */
  const extra=/^(gear|craft|merge|gLoadout)$/.test(s)?'rar_|merge_|ic_merge|ic_forge_|ic_star_up|ic_mod_remove|vfx_merge_|vfx_rarity_|vfx_star_up|vfx_forge_':s==='daily'?'login_|day_reward|dq_|ic_reroll':s==='achievements'?'aw_|vfx_aw_':/^(skills|bestiary)$/.test(s)?'bs_|rb_':/^(dig|perks|upgrade)$/.test(s)?'dig_|vfx_dig_|rank_reward_icons':s==='hub'?'dig_miner':null;
  return extra?new RegExp(base.source+'|assets/art/menu_orders/(?:'+extra+')'):base; }
// v6.45: ของ tier1 ที่มาถึงหลังเริ่มด่านได้ (ใช้ตอนเลเวลอัพ/หน้าสรุป · ทุกจุดเช็ค textures.exists แล้ว)
const STAGE_LATE_RE=/assets\/(?:art\/(?:build_(?:paths|cards)|talents|rewards|menu_buttons|icons|ui|mobile_ui_789)\/|ui\/(?:currency|results)\/|ui\/chapter|gear\/|icons\/levelup\/|ui_talent_hall)/;
const ENDGAME_ART_RE=/assets\/art\/(?:biomes|delve_bosses|pinnacle)\//;
// ของที่ต้องมีก่อนเข้าด่าน = tier1 ลบ (ของตัวละครอื่น + ของมาทีหลัง + อาร์ต endgame ถ้าไม่ใช่ endgame)
function stageCritical(k,u,ch,endgame){
  if(/^ruby_comic_/.test(k)||RUBY_MENU_KEYS.includes(k)||RUBY_STORY_KEYS.includes(k))return false;
  const m=/^(?:char|bpx)_([a-z]+)/.exec(k); if(m&&m[1]!==ch)return false; if((k.startsWith('minion_')||k.startsWith('yz_'))&&ch!=='yuzu')return false;
  if(!endgame&&['mini_jelly_animated','feast_target_animated'].includes(k))return false;
  if(STAGE_LATE_RE.test(u||''))return false; if(!endgame&&ENDGAME_ART_RE.test(u||''))return false; return true; }
const MENU_ONLY_RE=/assets\/(?:art\/menu_(?:screens|stage_cards)\/|art\/(?:menu_orders|temple|kitchen|delve|dig|forge_ui|mobile_ui_789|story)\/|incoming\/|character_cards\/|ui\/temple\/)/;
function bootKeepAudio(k){return k==='bgm_main'||k.startsWith('sfx_ui_');}
// v7.4 แผนหน่วยความจำกราฟิก: core = ถอดรหัสเข้า GPU ตอนบูต · lazy = ดาวน์โหลดเก็บเครื่องอย่างเดียว ถอดรหัสเมื่อใช้ และคืน GPU ได้
const HERO_ART_IDS=['momo','mint','cocoa','taro','sesame','yuzu','berry'];
function artHero(k){ if(k.startsWith('sg92_')||k==='sg_new_primary')return 'momo'; if(k.startsWith('ic_ses811_'))return 'sesame'; if(/^ses_(rune_btn|orb_[pmb]|spell_icons|cast_[pmb]{3}|talent_icons)$/.test(k))return 'sesame'; if(k.startsWith('minion_')||k.startsWith('yz_'))return 'yuzu'; if(k.startsWith('vfx_glacier_'))return 'mint'; const m=/^(?:char|bpx|hero_screen|fx)_([a-z]+)/.exec(k); return m&&HERO_ART_IDS.includes(m[1])?m[1]:null; }
const LAZY_MENU_ART_RE=/assets\/(?:art\/(?:menu74|patrol70|atlas89|expedition91)\/|art\/menu_(?:screens|stage_cards)\/|incoming\/|art\/(?:menu_orders|login30|cosmetics|wardrobe_wings|wardrobe_motion|chest|journal|book|lobby|tutorial|temple|delve|talents|hero_roster(?:_ui)?|forge_ui|mobile_ui_789|story)\/|ui\/temple\/|character_cards\/|art\/skins69\/)/;
const LAZY_MENU_KEYS=new Set(['craft_bench_bg','ui_talent_hall','dig_bg','reveal_theater']);   // พื้นหลังหน้าเมนูใหญ่ (_screenBg โหลดเอง)
function artUrl(k){ return ASSET_IMAGES[k]||(ASSET_SHEETS[k]&&ASSET_SHEETS[k].url)||(ASSET_FX[k]&&ASSET_FX[k].url)||''; }
// null = core · 'hero' (ฮีโร่ตัวอื่น) · 'stage' (ภาพเฉพาะด่าน) · 'endgame' · 'menu' (หน้าเมนูย่อย)
const ST62_ICON={frozen:0,chill:1,brittle:2,burn:3,sour:4,stun:5,mark:6,lured:7,enraged:8,p_slow:9,p_poison:10,p_bleed:11,p_haste:12,p_guard:13,p_barrier:14,p_shell:15,p_regen:16,p_starving:17,shock:18};   // v8.0.85 ใบ 62 ช่องใน st_icons
const ST62_LOOP={stun:'st_stun',shock:'st_shock',mark:'st_mark',sour:'st_sour',burn:'st_burn',brittle:'st_brittle',chill:'st_chill'},ST62_COL={stun:0xffe08a,frozen:0x9fe8ff,shock:0x8ff3ff,mark:0xff5d73,sour:0xfff27a,burn:0xff8a3d,brittle:0xd8f4ff,chill:0xbfe6ff};
/* v8.1.138 เจ้าของ: ภาพ Glacier Bloom กับ Barrage สลับกัน (ภาพพายุหิมะ = Glacier · ภาพหนามน้ำแข็งแตก = Barrage) */
const PATHCARD_ART={glacier:'pathcard80_barrage',barrage:'pathcard80_glacier'};
function pathCardKey(id){ return PATHCARD_ART[id]||'pathcard80_'+id; }
function artClass(k,u){ if(bootKeep(k))return null; u=u||artUrl(k); if(!u)return null; if(/^(?:cr94|fg94|hc94|sr94|fb94|tw95)_/.test(k))return 'stage';   /* v8.2.86 */ if(/^(?:vault80|forge80|book80|pathcard80|pathuq82)_/.test(k))return 'stage'; if(/assets\/art\/relics8[18]\//.test(u))return 'stage'; if(/^ev90_/.test(k))return 'stage'; if(/^ma89_/.test(k))return 'menu'; if(/^(?:cb93|hn92|ws92|hc_new)_/.test(k)||/assets\/art\/mission-vfx-next\//.test(u))return 'stage'; if(/^(?:fp|hm|hh|gp|gg|hs|ult|msn71|brm|fp85|mp85|ll85|ult85|hs85|hh85|mc86|hn87|hh87|st87|cr87|sr87|gg87|ui87)_|^cr_root_/.test(k)||/assets\/art\/vfx78\//.test(u))return 'stage'; if(/assets\/art\/(?:menu74|patrol70)\//.test(u))return 'menu';   /* v8.1.93 อาร์ตภารกิจ = stage · ไอคอน/Patrol = menu */ if(k.startsWith('yzs_')||k==='vfx_yzs_sour_burst'||k==='ic_yz_seedling')return 'stage'; if(k.startsWith('yc59_'))return 'stage'; if(k.startsWith('st_'))return 'stage'; if(k.startsWith('core79_'))return 'menu'; if(k.startsWith('bv46_')||k.startsWith('sc44_')||k.startsWith('sc79_')||k.startsWith('cr_')||k==='fx_mint_dash_shard'||k==='fx_mint_snowstorm')return 'stage'; if(RUBY_STAGE_KEYS.includes(k))return 'stage'; if(/^ruby_comic_/.test(k)||RUBY_MENU_KEYS.includes(k)||RUBY_STORY_KEYS.includes(k))return 'menu'; const h=artHero(k); if(h)return k==='char_'+h?null:'hero';
  if(/^bg\d+$/.test(k))return k==='bg1'?null:'stage'; if(stageOnlyArtKeys().has(k)||deferredImage(k))return 'stage';
  if(ENDGAME_ART_RE.test(u))return 'endgame'; if(LAZY_MENU_KEYS.has(k)||LAZY_MENU_ART_RE.test(u))return 'menu'; return null; }
function lazyArt(k,u,hero){ if(k.startsWith('sg92_')||k==='sg_new_primary')return true; if(/^(?:char|card|roster)_[a-z]+.*__[a-z]+$/.test(k))return true;   /* v8.1.90 สกิน (key__tag) ไม่โหลดตอนบูต · runArtKeys/skinLoad โหลดเฉพาะสกินที่ใส่ */ const c=artClass(k,u); return /\/(?:hero_poses83|hero_motion823|taro-motion3c|hero-motion-phase3|yuzu-motion3b|hero-hurt3a|yuzu_forms63|bloodorange_skill96|yuzu_hierarchy97|sesame_vfx817|mint_outline819|mint_needle821|cocoa_outline810|taro_outline810|yuzu_outline810|momo_outline810|sesame_invoker811)\//.test(u||artUrl(k))||!!c&&!(c==='hero'&&artHero(k)===hero); }
let _lowMemFlag=false; try{ _lowMemFlag=localStorage.getItem('mochi_lowmem')==='1'; }catch(e){}
try{ if(!localStorage.getItem('mochi_lowmem_reset122')){ localStorage.setItem('mochi_lowmem_reset122','1'); localStorage.removeItem('mochi_lowmem'); _lowMemFlag=false; } }catch(e){}   /* v8.1.122 เจ้าของ: ติดโหมดหน่วยความจำต่ำถาวรจนเกมวนโหลด → ล้างครั้งเดียว */
const MENU_TEX_SOFT_MB=300;
const STAGE_MOOD=[0xffb35c,0x5fd6c0,0xff6a3d,0x8fd8ff,0xff8a4d,0x9be86b,0x7fd6b0,0xffc95c,0xc9a8ff,0x56e5bd,0xffa86b,0xffd18a,0xa8e6ff,0xffe08a,0xd9a6ff];   // v8.1.128 สีบรรยากาศประจำด่าน (ขอบจอ/ก้อนแป้ง)
const TEX_BUDGET_MB=(_lowMemFlag||Number(navigator.deviceMemory||8)<=4)?340:(Number(navigator.deviceMemory||0)>=8?520:420);   /* v8.1.122 low 250 → 340 (lobby ต้องใช้ ~430 · ต่ำกว่านี้ = ลบแล้วโหลดใหม่วน) · 8 GB 600 → 520 */   // v7.9.72 เจ้าของ: เครื่อง RAM ≥8 GB ได้ 600 MB
function clearLowMem(){ _lowMemFlag=false; try{ localStorage.removeItem('mochi_lowmem'); }catch(e){} }   // ผู้เล่นเลือก Performance เอง = ปิดโหมดหน่วยความจำต่ำ (มีผลเปิดเกมครั้งหน้า)

