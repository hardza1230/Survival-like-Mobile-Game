# Complete SFX event refresh — 133 sounds

Owner explicitly requested auditing all sound events, including existing/reused sounds, then generating appropriate ElevenLabs prompts. 133 new generated files: 85 original core replacements + 48 distinct event cues. Audited game v7.0.0; delivery latest v7.0.1, base 478a7b0de15a2b00c96b34144551f09741c4b7bf. Runtime NOT changed. Generated audio is real file-based media but technical checks are NOT listening approval.

## Audit evidence / scope

SFX_ALL_CALLSITES.json contains all 458 static Sfx callsites detected outside the Sfx declaration, including BGM helpers and guarded legacy calls; context_method is a heuristic search hint, not exact AST ownership or proof of reachability. JOBS/MANIFEST includes every replacement and candidate new hook. Not all cues have an existing dedicated hook; silent/ambiguous UI events are explicitly new-event candidates.

Findings: Sfx.clear uses sfx_levelup for unrelated successes; Sfx.select uses generic UI cue on cards, items, tabs and blocked actions; pickCardAt plays shared_unique_charge_full on ordinary card acceptance; card-offer visibility has no separate dedicated cue; ordinary skill growth/Unique auto-upgrade/relic/build/infusion/mastery lack distinct mapping. Existing 35 Build, 26 Unique and 4 procedural-replacement assets are retained. Legacy beat bank retained as fallback (not regenerated). sfx_btn aliases fresh ui_click to avoid duplicate generation. Existing file presence never means distinct event identity or good sound quality.

## Next AI: register / mix

- assets/audio/sfx/event_refresh/MANIFEST.json is authoritative: replace_existing_file uses existing key, new_event_identity gets sfx_event_ID. Register literal path in existing ASSET_AUDIO and existing Boot preload/build-www. Manifest alone does not activate playback. Keep all previous files until runtime QA.
- Preserve current Sfx backend, mute, SFX slider, audio unlock, per-key cooldowns and voice caps. Do not add independent HTML Audio or AudioContext.
- Use semantic dispatch/helper for new events. NEVER globally replace Sfx.clear with levelup or generic success again. Select event based on actual successful game action and context.
- Existing craft/result/progress/gear keys have fresh drop-in audio via same keys. Dynamic Sfx.craft('gear_*'/'progress_*'/'result_*') prefix structure stays intact.
- uiAction already consolidates nested taps: extend its semantic priority/queue as needed so a tab/select/confirm/error event produces one cue. No generic click + event click double playback. Blocked actions play ui_error, not success. Do not play on renderer refresh, passive hover every frame or scrolling every pixel.
- Freely trim silence/tails after listening; API originals are 0.5s+ and are NOT all ready-length for 45–100ms repeated ticks. Reel/count/xp/impact caps required. Do not loop tick files.
- chest_spin and slot_spin are loop=true assets: use one controlled loop voice, stop on result/cancel/menu/death/mute; if current helper is one-shot, adapt it deliberately rather than piling repeated instances.
- Major reveal/level-up cues may duck BGM briefly; frequent UI/XP must not repeatedly duck boss music. Start from existing gains, hear with current shotgun/Unique sounds; no blanket volume=1.

## Exact high-value event routing

1. HERO level-up: sfx_levelup only when actual run level increases/openLevelUp for a genuine level notification. Forced chest/relic/path offer must not pretend to be hero level-up.
2. card_offer_open: once when the entire option container becomes visible after options are built, never per drawReadableChoiceCard/per layout refresh. Can play a small delayed paper layer after level-up, but do not stack multiple fanfares.
3. pickCardAt first tap: card_focus replaces select. Second accepted tap: card_confirm. Remove shared_unique_charge_full from ordinary card picks. Preserve two-tap mechanics.
4. Choose ONE principal growth/reveal cue by priority: evolution (existing dedicated cue) > awaken > unique_rank_up > build_path_select/relic_acquire/infusion_apply/modifier_acquire/tradeoff_acquire > skill_rank_up > generic card_confirm. A tiny dry card tap may accompany a rare major cue if listening supports it; never layer levelup+clear+Unique-ready.
5. checkUniqueAutoUpgrade: unique_rank_up replaces clear. Skill Awakened apply: skill_awaken replaces clear. Actual ordinary skill-rank upgrade: skill_rank_up (inspect card apply semantics; no rank-up noise for healing cards). Existing Evolution cue retained; remove extra clear levelup layer there.
6. Build Path / Infusion / Relic / Modifier / Trade-off apply get respective semantic cues only once on successful apply. AutoFusion is currently automatic; retain existing evolution/fusion behavior and don't revive disabled card systems just to use sounds. card_reroll is supplied only if reroll flow exists/enabled; do not reintroduce removed reroll UI.
7. summary: existing 5 result keys have refreshed files; growth_summary_level and growth_mastery only when those milestones actually occur, choose between them and result_important to avoid redundant fanfare.
8. ui_tab_change / panel_open / panel_close / compare / item_focus route to actual user navigation, not buildMenuScreen every redraw. Toggles distinguish on/off only on changed state. hero_select and hero_unlock are distinct; locked hero inspection is not unlock.
9. wave_start/wave_clear differ from stage_clear. Miniboss arrival/defeat differ from boss_warn/boss_clear. boss_attack_telegraph differs from boss arrival; don't alter damage or telegraph timing. Existing per-phase sound retained.
10. Loot: Sugar and currency differ from XP; Gear Gift differs from generic menu click. Common/Magic/Rare/Epic/Unique reveal distinct; Legendary can use refreshed sfx_legend. Map actual rarity names from latest code rather than guessing. Reveal only actual item once (grantGear and reveal panel cannot both play).
11. Gear favorite/cleanup/compare augment existing equip/lock/enhance/sell/dismantle cues. Batch cleanup one grouped cue, not per item. Purchase success only if currency actually spent.
12. Story panel/page/portal/revive only when corresponding flow succeeds. New candidate cues may remain unused where no live event exists: document this rather than wiring into dead code.
13. All new assets are delivered for integration; audit does not certify artistic quality. Listen on phone, trim frequent tails, validate .muted / sliders / canceled callbacks / scene changes. Runtime implementation must bump version/changelog and npm check as usual; owner playtests, no headless gameplay sims. Preserve ongoing game work and push live branch per CLAUDE.md.

## Generated sound list / prompts

Each prompt is explicit in JOBS.json. Shared style: cute premium fantasy, immediate dry transient, smooth highs, no voice/music. No generative artist imitation.

| Group | ID | Mode | Hook / existing key | Duration | Loop |
|---|---|---|---|---:|---|
| Combat | shoot | replace_existing_file | sfx_shoot | 0.7 | no |
| Combat | hit | replace_existing_file | sfx_hit | 0.5 | no |
| Combat | xp | replace_existing_file | sfx_xp | 0.5 | no |
| Combat | dash | replace_existing_file | sfx_dash | 0.7 | no |
| Progress | levelup | replace_existing_file | sfx_levelup | 1.1 | no |
| Loot | chest | replace_existing_file | sfx_chest | 0.7 | no |
| Results | craft_result_open | replace_existing_file | sfx_craft_result_open | 0.7 | no |
| Results | craft_result_count | replace_existing_file | sfx_craft_result_count | 0.5 | no |
| Results | craft_result_reveal | replace_existing_file | sfx_craft_result_reveal | 0.7 | no |
| Results | craft_result_important | replace_existing_file | sfx_craft_result_important | 1.1 | no |
| Results | craft_result_double | replace_existing_file | sfx_craft_result_double | 0.7 | no |
| Progress | craft_progress_core | replace_existing_file | sfx_craft_progress_core | 0.7 | no |
| Progress | craft_progress_talent | replace_existing_file | sfx_craft_progress_talent | 0.7 | no |
| Progress | craft_progress_overcap | replace_existing_file | sfx_craft_progress_overcap | 0.7 | no |
| Progress | craft_progress_promotion | replace_existing_file | sfx_craft_progress_promotion | 1.1 | no |
| Progress | craft_progress_perk | replace_existing_file | sfx_craft_progress_perk | 0.7 | no |
| Progress | craft_progress_ancient | replace_existing_file | sfx_craft_progress_ancient | 1.1 | no |
| Progress | craft_progress_daily | replace_existing_file | sfx_craft_progress_daily | 0.7 | no |
| Progress | craft_progress_achievement | replace_existing_file | sfx_craft_progress_achievement | 0.7 | no |
| Progress | craft_progress_quest | replace_existing_file | sfx_craft_progress_quest | 0.7 | no |
| Progress | craft_progress_claim | replace_existing_file | sfx_craft_progress_claim | 0.7 | no |
| Gear | craft_gear_equip | replace_existing_file | sfx_craft_gear_equip | 0.7 | no |
| Gear | craft_gear_lock | replace_existing_file | sfx_craft_gear_lock | 0.7 | no |
| Gear | craft_gear_unlock | replace_existing_file | sfx_craft_gear_unlock | 0.7 | no |
| Gear | craft_gear_enhance_success | replace_existing_file | sfx_craft_gear_enhance_success | 0.7 | no |
| Gear | craft_gear_enhance_break | replace_existing_file | sfx_craft_gear_enhance_break | 0.7 | no |
| Gear | craft_gear_enhance_destroy | replace_existing_file | sfx_craft_gear_enhance_destroy | 0.7 | no |
| Gear | craft_gear_dismantle | replace_existing_file | sfx_craft_gear_dismantle | 0.7 | no |
| Gear | craft_gear_sell | replace_existing_file | sfx_craft_gear_sell | 0.7 | no |
| Craft | craft_capacity | replace_existing_file | sfx_craft_capacity | 0.7 | no |
| Craft | craft_reroll | replace_existing_file | sfx_craft_reroll | 0.7 | no |
| Craft | craft_remove | replace_existing_file | sfx_craft_remove | 0.7 | no |
| Craft | craft_reset | replace_existing_file | sfx_craft_reset | 0.7 | no |
| Craft | craft_start | replace_existing_file | sfx_craft_start | 0.7 | no |
| Craft | craft_tick | replace_existing_file | sfx_craft_tick | 0.5 | no |
| Craft | craft_slow | replace_existing_file | sfx_craft_slow | 0.7 | no |
| Craft | craft_common | replace_existing_file | sfx_craft_common | 0.7 | no |
| Craft | craft_rare | replace_existing_file | sfx_craft_rare | 1.1 | no |
| Craft | craft_jackpot | replace_existing_file | sfx_craft_jackpot | 1.6 | no |
| Craft | craft_near | replace_existing_file | sfx_craft_near | 0.7 | no |
| Craft | craft_cancel | replace_existing_file | sfx_craft_cancel | 0.7 | no |
| Craft | craft_exhaust | replace_existing_file | sfx_craft_exhaust | 0.7 | no |
| UI | ui_click | replace_existing_file | sfx_ui_click | 0.5 | no |
| UI | ui_back | replace_existing_file | sfx_ui_back | 0.7 | no |
| UI | ui_confirm | replace_existing_file | sfx_ui_confirm | 0.7 | no |
| UI | ui_error | replace_existing_file | sfx_ui_error | 0.7 | no |
| Combat | frost | replace_existing_file | sfx_frost | 0.7 | no |
| Combat | ult_bomb | replace_existing_file | sfx_ult_bomb | 0.7 | no |
| Combat | ult_vortex | replace_existing_file | sfx_ult_vortex | 0.7 | no |
| Combat | donut | replace_existing_file | sfx_donut | 0.7 | no |
| Combat | hazard | replace_existing_file | sfx_hazard | 0.7 | no |
| Combat | crit | replace_existing_file | sfx_crit | 0.7 | no |
| Combat | kill_big | replace_existing_file | sfx_kill_big | 0.7 | no |
| Combat | hurt | replace_existing_file | sfx_hurt | 0.7 | no |
| Combat | heal | replace_existing_file | sfx_heal | 0.7 | no |
| Combat | magnet | replace_existing_file | sfx_magnet | 0.7 | no |
| Combat | thunder | replace_existing_file | sfx_thunder | 0.7 | no |
| Combat | punch | replace_existing_file | sfx_punch | 0.7 | no |
| Combat | shotgun | replace_existing_file | sfx_shotgun | 0.7 | no |
| Combat | punch_jab | replace_existing_file | sfx_punch_jab | 0.5 | no |
| Combat | punch_heavy | replace_existing_file | sfx_punch_heavy | 0.7 | no |
| Combat | punch_frenzy | replace_existing_file | sfx_punch_frenzy | 0.7 | no |
| Combat | beam | replace_existing_file | sfx_beam | 0.7 | no |
| Combat | burn | replace_existing_file | sfx_burn | 0.7 | no |
| Cards | card | replace_existing_file | sfx_card | 0.7 | no |
| Loot | legend | replace_existing_file | sfx_legend | 1.6 | no |
| Stage | victory | replace_existing_file | sfx_victory | 1.6 | no |
| Stage | boss_clear | replace_existing_file | sfx_boss_clear | 1.6 | no |
| Loot | chest_spin | replace_existing_file | sfx_chest_spin | 2 | yes |
| Loot | chest_tick | replace_existing_file | sfx_chest_tick | 0.5 | no |
| DigKitchen | dig_hit | replace_existing_file | sfx_dig_hit | 0.5 | no |
| DigKitchen | dig_break | replace_existing_file | sfx_dig_break | 0.7 | no |
| DigKitchen | dig_find | replace_existing_file | sfx_dig_find | 0.7 | no |
| DigKitchen | recipe_fire | replace_existing_file | sfx_recipe_fire | 0.7 | no |
| DigKitchen | recipe_merge | replace_existing_file | sfx_recipe_merge | 0.7 | no |
| DigKitchen | dig_rare | replace_existing_file | sfx_dig_rare | 1.1 | no |
| DigKitchen | dig_trap | replace_existing_file | sfx_dig_trap | 0.7 | no |
| DigKitchen | dig_descend | replace_existing_file | sfx_dig_descend | 0.7 | no |
| Loot | slot_spin | replace_existing_file | sfx_slot_spin | 2 | yes |
| Loot | slot_miss | replace_existing_file | sfx_slot_miss | 0.7 | no |
| Loot | slot_near | replace_existing_file | sfx_slot_near | 0.7 | no |
| Loot | slot_jackpot | replace_existing_file | sfx_slot_jackpot | 1.6 | no |
| Loot | chest_win | replace_existing_file | sfx_chest_win | 0.7 | no |
| Stage | defeat | replace_existing_file | sfx_defeat | 0.7 | no |
| Stage | boss_warn | replace_existing_file | sfx_boss_warn | 0.7 | no |
| UI | ui_panel_open | new_event_identity | menu modal open | 0.5 | no |
| UI | ui_panel_close | new_event_identity | menu modal close | 0.5 | no |
| UI | ui_tab_change | new_event_identity | menu tabs / Heroes / Equipment tabs | 0.5 | no |
| UI | ui_toggle_on | new_event_identity | settings toggle enabled | 0.5 | no |
| UI | ui_toggle_off | new_event_identity | settings toggle disabled | 0.5 | no |
| UI | ui_compare_open | new_event_identity | gear Compare panel | 0.5 | no |
| UI | ui_item_focus | new_event_identity | gear inventory selection / detail | 0.5 | no |
| UI | ui_purchase_success | new_event_identity | successful shop purchase | 0.6 | no |
| Progress | hero_select | new_event_identity | Heroes roster selection | 0.6 | no |
| Progress | hero_unlock | new_event_identity | hero unlock reward / purchase | 1.3 | no |
| Cards | card_offer_open | new_event_identity | openLevelUp after cards become visible | 0.7 | no |
| Cards | card_flip | new_event_identity | reward card flip animation | 0.5 | no |
| Cards | card_focus | new_event_identity | pickCardAt first tap / highlightCard | 0.5 | no |
| Cards | card_confirm | new_event_identity | pickCardAt second tap accepted / closeLevelUp | 0.6 | no |
| Cards | card_reroll | new_event_identity | actual card reroll if enabled | 0.6 | no |
| Cards | build_path_select | new_event_identity | rollBasicChoices Build Path apply | 1 | no |
| Cards | infusion_apply | new_event_identity | Flavor Infusion apply | 0.8 | no |
| Cards | relic_acquire | new_event_identity | rollRelicChoices apply / actual relic grant | 1 | no |
| Cards | modifier_acquire | new_event_identity | modCard apply | 0.7 | no |
| Cards | tradeoff_acquire | new_event_identity | tradeCard apply | 0.8 | no |
| Progress | skill_rank_up | new_event_identity | ordinary skill card upgrade success | 0.65 | no |
| Progress | skill_awaken | new_event_identity | Skill Awakened / SKILL_AWAKEN_LV apply | 1.3 | no |
| Progress | unique_rank_up | new_event_identity | checkUniqueAutoUpgrade | 1 | no |
| Progress | codex_rank_up | new_event_identity | killEnemy Codex Rank Unlocked | 0.8 | no |
| Progress | growth_summary_level | new_event_identity | playSummaryGrowth levelup / permanent hero gains | 1 | no |
| Progress | growth_mastery | new_event_identity | playSummaryGrowth mastery / first stage mastery | 1.2 | no |
| Stage | wave_start | new_event_identity | startWave / actual wave event start | 0.7 | no |
| Stage | wave_clear | new_event_identity | next wave breather / wave complete | 0.8 | no |
| Stage | stage_clear | new_event_identity | victoryStage / story stage completion | 1.8 | no |
| Stage | miniboss_arrival | new_event_identity | spawnMiniBoss intro | 1.1 | no |
| Stage | miniboss_defeat | new_event_identity | killEnemy isMini / actual miniboss death | 1.2 | no |
| Stage | boss_attack_telegraph | new_event_identity | boss hazard warning / actual attack telegraph | 0.6 | no |
| Stage | story_panel_open | new_event_identity | showEpilogue / narrative panel | 0.8 | no |
| Stage | story_advance | new_event_identity | epilogue next page / continue | 0.5 | no |
| Stage | portal_enter | new_event_identity | stage portal / transition accepted | 1 | no |
| Stage | revive | new_event_identity | actual revive success | 1.2 | no |
| Loot | pickup_sugar | new_event_identity | sugar coin collection | 0.5 | no |
| Loot | pickup_currency | new_event_identity | currency pickup / reward | 0.5 | no |
| Loot | pickup_gear | new_event_identity | field Gear Gift collected | 0.6 | no |
| Loot | loot_common_reveal | new_event_identity | gacha / chest common item reveal | 0.65 | no |
| Loot | loot_magic_reveal | new_event_identity | gacha / chest magic item reveal | 0.8 | no |
| Loot | loot_rare_reveal | new_event_identity | gacha / chest rare item reveal | 1 | no |
| Loot | loot_epic_reveal | new_event_identity | gacha / chest epic item reveal | 1.2 | no |
| Loot | loot_unique_reveal | new_event_identity | unique gear reveal / grantGear unique | 1.6 | no |
| Loot | buff_pickup | new_event_identity | collect stage gimmick powerup | 0.7 | no |
| Gear | gear_favorite_on | new_event_identity | favorite item set | 0.5 | no |
| Gear | gear_favorite_off | new_event_identity | favorite item removed | 0.5 | no |
| Gear | gear_bulk_cleanup | new_event_identity | successful bulk sell / dismantle | 0.9 | no |

## Retained banks

- sfx_cocoa_fire_fist: assets/audio/sfx/build_paths/cocoa_fire_fist.mp3
- sfx_cocoa_fire_finisher: assets/audio/sfx/build_paths/cocoa_fire_finisher.mp3
- sfx_cocoa_fire_explosion: assets/audio/sfx/build_paths/cocoa_fire_explosion.mp3
- sfx_cocoa_rocket_launch: assets/audio/sfx/build_paths/cocoa_rocket_launch.mp3
- sfx_cocoa_rocket_stick_burst: assets/audio/sfx/build_paths/cocoa_rocket_stick_burst.mp3
- sfx_cocoa_meteor_impact: assets/audio/sfx/build_paths/cocoa_meteor_impact.mp3
- sfx_cocoa_titan_leap: assets/audio/sfx/build_paths/cocoa_titan_leap.mp3
- sfx_cocoa_titan_slam: assets/audio/sfx/build_paths/cocoa_titan_slam.mp3
- sfx_uq_mint_bloom_full: assets/audio/sfx/unique_skills/uq_mint_bloom_full.mp3
- sfx_uq_mint_gale: assets/audio/sfx/unique_skills/uq_mint_gale.mp3
- sfx_uq_mint_lance_release: assets/audio/sfx/unique_skills/uq_mint_lance_release.mp3
- sfx_uq_phantom_enter: assets/audio/sfx/unique_skills/uq_phantom_enter.mp3
- sfx_uq_phantom_strike: assets/audio/sfx/unique_skills/uq_phantom_strike.mp3
- sfx_uq_rebound_burst: assets/audio/sfx/unique_skills/uq_rebound_burst.mp3
- sfx_uq_rocket_detonation: assets/audio/sfx/unique_skills/uq_rocket_detonation.mp3
- sfx_uq_rocket_salvo: assets/audio/sfx/unique_skills/uq_rocket_salvo.mp3
- sfx_uq_sesame_prism_charge: assets/audio/sfx/unique_skills/uq_sesame_prism_charge.mp3
- sfx_uq_sesame_prism_volley: assets/audio/sfx/unique_skills/uq_sesame_prism_volley.mp3
- sfx_uq_shotgun_blast: assets/audio/sfx/unique_skills/uq_shotgun_blast.mp3
- sfx_uq_shotgun_full: assets/audio/sfx/unique_skills/uq_shotgun_full.mp3
- sfx_uq_shotgun_pump: assets/audio/sfx/unique_skills/uq_shotgun_pump.mp3
- sfx_uq_sniper_bolt: assets/audio/sfx/unique_skills/uq_sniper_bolt.mp3
- sfx_uq_sniper_charge: assets/audio/sfx/unique_skills/uq_sniper_charge.mp3
- sfx_uq_sniper_fire: assets/audio/sfx/unique_skills/uq_sniper_fire.mp3
- sfx_uq_sniper_full: assets/audio/sfx/unique_skills/uq_sniper_full.mp3
- sfx_uq_taro_chain_cast: assets/audio/sfx/unique_skills/uq_taro_chain_cast.mp3
- sfx_uq_taro_chain_hit: assets/audio/sfx/unique_skills/uq_taro_chain_hit.mp3
- sfx_uq_titan_aftershock: assets/audio/sfx/unique_skills/uq_titan_aftershock.mp3
- sfx_uq_titan_charge: assets/audio/sfx/unique_skills/uq_titan_charge.mp3
- sfx_uq_titan_drop: assets/audio/sfx/unique_skills/uq_titan_drop.mp3
- sfx_uq_titan_full: assets/audio/sfx/unique_skills/uq_titan_full.mp3
- sfx_uq_titan_slam_full: assets/audio/sfx/unique_skills/uq_titan_slam_full.mp3
- sfx_uq_yuzu_crew_hit: assets/audio/sfx/unique_skills/uq_yuzu_crew_hit.mp3
- sfx_uq_yuzu_parade: assets/audio/sfx/unique_skills/uq_yuzu_parade.mp3
- sfx_cocoa_rage_charge: assets/audio/sfx/build_paths/cocoa_rage_charge.mp3
- sfx_cocoa_rage_level: assets/audio/sfx/build_paths/cocoa_rage_level.mp3
- sfx_cocoa_colossus_slam: assets/audio/sfx/build_paths/cocoa_colossus_slam.mp3
- sfx_cocoa_flicker_step: assets/audio/sfx/build_paths/cocoa_flicker_step.mp3
- sfx_cocoa_dash_landing: assets/audio/sfx/build_paths/cocoa_dash_landing.mp3
- sfx_cocoa_shadow_fist: assets/audio/sfx/build_paths/cocoa_shadow_fist.mp3
- sfx_cocoa_phantom_start: assets/audio/sfx/build_paths/cocoa_phantom_start.mp3
- sfx_cocoa_shadow_mark: assets/audio/sfx/build_paths/cocoa_shadow_mark.mp3
- sfx_mint_lance_launch: assets/audio/sfx/build_paths/mint_lance_launch.mp3
- sfx_mint_barrage_volley: assets/audio/sfx/build_paths/mint_barrage_volley.mp3
- sfx_mint_hailstorm_cast: assets/audio/sfx/build_paths/mint_hailstorm_cast.mp3
- sfx_mint_impaler_charge: assets/audio/sfx/build_paths/mint_impaler_charge.mp3
- sfx_mint_impale_stack: assets/audio/sfx/build_paths/mint_impale_stack.mp3
- sfx_mint_crystal_rupture: assets/audio/sfx/build_paths/mint_crystal_rupture.mp3
- sfx_mint_glacier_bloom: assets/audio/sfx/build_paths/mint_glacier_bloom.mp3
- sfx_mint_glacier_shatter: assets/audio/sfx/build_paths/mint_glacier_shatter.mp3
- sfx_strawberry_sniper_charge: assets/audio/sfx/build_paths/strawberry_sniper_charge.mp3
- sfx_strawberry_sniper_shot: assets/audio/sfx/build_paths/strawberry_sniper_shot.mp3
- sfx_strawberry_sniper_impact: assets/audio/sfx/build_paths/strawberry_sniper_impact.mp3
- sfx_strawberry_ricochet_bounce: assets/audio/sfx/build_paths/strawberry_ricochet_bounce.mp3
- sfx_strawberry_pinball_cast: assets/audio/sfx/build_paths/strawberry_pinball_cast.mp3
- sfx_strawberry_pinball_final: assets/audio/sfx/build_paths/strawberry_pinball_final.mp3
- sfx_shared_unique_charge_start: assets/audio/sfx/build_paths/shared_unique_charge_start.mp3
- sfx_shared_unique_charge_full: assets/audio/sfx/build_paths/shared_unique_charge_full.mp3
- sfx_shared_build_evolution: assets/audio/sfx/build_paths/shared_build_evolution.mp3
- sfx_boss_shield_break: assets/audio/sfx/build_paths/boss_shield_break.mp3
- sfx_boss_phase_transition: assets/audio/sfx/build_paths/boss_phase_transition.mp3
- sfx_btn: assets/audio/sfx/sfx_btn_click.wav
- sfx_beat_tick: assets/audio/sfx/gen/sfx_beat_tick.wav
- sfx_beat_loop: assets/audio/sfx/gen/sfx_beat_loop.wav
- sfx_beat_hold: assets/audio/sfx/gen/sfx_beat_hold.wav
- sfx_beat_rush: assets/audio/sfx/gen/sfx_beat_rush.wav
- sfx_beat_gun: assets/audio/sfx/gen/sfx_beat_gun.wav
- sfx_beat_cyclone: assets/audio/sfx/gen/sfx_beat_cyclone.wav
- sfx_beat_titan: assets/audio/sfx/gen/sfx_beat_titan.wav
- sfx_beat_juggle: assets/audio/sfx/gen/sfx_beat_juggle.wav
- sfx_beat_rainbow: assets/audio/sfx/gen/sfx_beat_rainbow.wav
- sfx_beat_fever: assets/audio/sfx/gen/sfx_beat_fever.wav
- sfx_beat_cue: assets/audio/sfx/gen/sfx_beat_cue.wav
- sfx_beat_start: assets/audio/sfx/gen/sfx_beat_start.wav
- sfx_beat_perfect: assets/audio/sfx/gen/sfx_beat_perfect.wav
- sfx_beat_good: assets/audio/sfx/gen/sfx_beat_good.wav
- sfx_beat_miss: assets/audio/sfx/gen/sfx_beat_miss.wav

## Owner request to next AI

อ่าน docs/audio_orders/FULL_EVENT_SFX_133_HANDOFF.md แล้วผูกเสียงชุดใหม่ 133 เสียงตาม MANIFEST ใน assets/audio/sfx/event_refresh/ แยก hero level-up, card offer/focus/confirm, skill/Unique upgrade, UI และรางวัลตามบริบท ห้ามใช้ Sfx.clear/levelup เหมารวม ห้ามคืนระบบที่ถูกตัดออก จูนเสียง/trim tail และใช้ Sfx เดิม ตรวจและ push ตาม CLAUDE.md
