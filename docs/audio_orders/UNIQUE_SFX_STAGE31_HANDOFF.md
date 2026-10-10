# Unique SFX spectacle + Stage 3-1 music handoff

Owner request: shotgun pump before charged blast; sniper CRACK then fweeeew; fully charged Titan colossal ground THOOM; other heroes equally distinct. 26 SFX + one music composition (original and prepared loop). Delivered on v6.79.0 base e70ff380ef3d32f295d5d0ab3f062e9e45a8a816; assets only, runtime NOT wired. Existing 35 Build sounds were integrated in v6.73.0; do not integrate that batch again.

## Next AI implementation

Use current Sfx.bp / bpLoopStart / bpLoopStop and current audio map + Boot preload. Register proposed keys from assets/audio/sfx/unique_skills/MANIFEST.json with literal asset paths (build-www detects them). Do not use independent audio backend. Keep gameplay timing/damage unchanged.

### Shotgun Momo

- startSnipeCharge only when blast=true: uq_shotgun_pump once. This is the shuck-CHAK the owner wants, not a magical hum. Do not loop mechanical rack.
- tickSnipe blast full transition: uq_shotgun_full once, replace shared ready cue. Full charge is 450ms; confirm pump timing fits after listening.
- releaseBerryBlast inside fire(): uq_shotgun_blast exactly at damage/muzzle flash, replacing Sfx.boom there. Double-shot repeats only blast (not pump/ready) at existing 350ms callback.
- Basic shotgun retains ordinary sfx_shotgun; these are manual Unique sounds. No loud blast for button press or canceled charge.

### Sniper Momo

- startSnipeCharge sniper: uq_sniper_charge low-volume loop; tickSnipe full once: uq_sniper_full. Stop loop in cancelSnipe / release / death / pause or state transition / mute / scene shutdown. Prevent contention with basic automatic charge loop; prioritize manual Unique, resume basic only if still actively charging.
- releaseSnipe actual beam: uq_sniper_fire replaces BOTH boom+beam. The file already includes crack and projectile whistle: do not add extra beam/whoosh over it. Use same full shot at reduced volume/pitch for partial charge rather than invent another sound.
- uq_sniper_bolt optional after shot with bounded delay, only if scene/player/epoch still valid. Do not change cooldown or block inputs to match audio. If delayed railgun capstone fires again, play one reduced shot at its actual callback, not one per split beam.

### Titan Cocoa

- Start uq_titan_charge low loop only on actual Unique hold; stop when release/cancel/context ends. Do not replace basic-punch audio.
- Actual rage max threshold: uq_titan_full once per hold. Honor titanMaxLv (including talents); no cue every UI update.
- castCocoaUnique titan windup: uq_titan_drop instead of ordinary leap cue; delayed main impact: uq_titan_slam_full when released Rage reaches actual max. Below max retain existing cocoa_colossus_slam or scale gain carefully.
- uq_titan_aftershock only on existing delayed second hit, lower volume than first. Preserve 350ms landing / 650ms follow-up timings. No giant slam at pointerup before fist hits ground.

### Other heroes

- Fire Rocket Gauntlet: uq_rocket_salvo once on first real launch, replace per-rocket ordinary launch cue for this Unique; uq_rocket_detonation on first actual heavy detonation. Existing small sticky-burst sound remains for repeated ticks. Tag Unique bullets and reset tags when pooled.
- Dash Phantom Rush: uq_phantom_enter once on activation; uq_phantom_strike on each actual leap landing. It includes step+impact: suppress ordinary dash landing sound for this event.
- Mint Barrage Unique is Mint Gale (castWindRush), NOT legacy Diamond Dust. uq_mint_gale on activation instead of dash+magnet. uq_mint_lance_release in releaseFrostLance, uq_mint_bloom_full in full-charge releaseGlacierBloom (partial keeps existing bloom). Keep old dedicated Glacier shatter.
- Ricochet Unique activation: uq_rebound_burst replaces strawberry_pinball_cast; ordinary bounces keep existing short sound.
- Taro castPathRecall: uq_taro_chain_cast on first real discharge, uq_taro_chain_hit as sparse fork accent. Remove duplicate Sfx.zap at banner/end when new cue plays; do not play per enemy or chain segment.
- Sesame castOathWard: uq_sesame_prism_charge for initial gather; uq_sesame_prism_volley once per actual volley (140ms intervals). It is 700ms long, so truncate tail/throttle/cap to avoid a pile-up. Start with ~0.18s minimum gap and cap 2 voices or use selected volleys. Not once per beam.
- Yuzu citrusParade: uq_yuzu_parade once when _yuzuParadeT starts. uq_yuzu_crew_hit is optional sparse accent for empowered group strikes; never every companion every frame. No fake manual charge on instant skills.
- Taro/Sesame/Yuzu currently share their Unique across paths. These sounds follow real ability families; do not add nonexistent path Uniques. Legacy voidPull/jamOverdrive are not active playable-hero targets in this batch.

## Stage 3-1 music

Stage 3-1 = Ashen Seedfields, stageIndex 10 / global stage 11, current bgm_s11. Trial: assets/audio/bgm/incoming_stage31/bgm_stage31_ashen_seedfields_loop.mp3. Source retained separately. Requested 64s instrumental, 120 BPM D minor, ash/harvest fantasy combat. Prepared loop ~62.032s with 2s circular linear crossfade and -18 LUFS normalization target. Generated beat/tempo and musical seam have NOT been verified by listening.

After owner listens, point bgm_s11 only to trial path (or put reviewed file at current path). Do not change bgm_s03: that is global stage 3, NOT Chapter 3-1. Use current Sfx.playStageBgm loop/volume; do not play source file or restart track per wave. Boss/mini music unchanged. MP3 gapless behavior depends on decoder; listen over several repeats on mobile, adjust bar-aligned cut/crossfade if needed. No native loop flag exists in music request: loop was prepared locally.

## QC / delivery

All 28 MP3 (26 SFX + music source + loop) decode and contain audio; technical QA is not listening approval. Listen for pumping, hiss, perceived impact, voice overlap and music seam. SFX originals kept; tune runtime gain, trim tails, cap voices. Honor sfx/music sliders and mute. After runtime edits bump version/changelog, npm check and relevant contracts; owner does actual mobile playtest.

## Keys / event map

| Key | Group | Search anchor / event | Loop |
|---|---|---|---|
| sfx_uq_shotgun_pump | Momo Shotgun | startSnipeCharge blast | no |
| sfx_uq_shotgun_full | Momo Shotgun | tickSnipe blast full | no |
| sfx_uq_shotgun_blast | Momo Shotgun | releaseBerryBlast fire | no |
| sfx_uq_sniper_charge | Momo Sniper | startSnipeCharge sniper | yes |
| sfx_uq_sniper_full | Momo Sniper | tickSnipe sniper full | no |
| sfx_uq_sniper_fire | Momo Sniper | releaseSnipe beam | no |
| sfx_uq_sniper_bolt | Momo Sniper | after releaseSnipe | no |
| sfx_uq_titan_charge | Cocoa Titan | Titan hold rage | yes |
| sfx_uq_titan_full | Cocoa Titan | titan rage reaches max | no |
| sfx_uq_titan_drop | Cocoa Titan | castCocoaUnique titan takeoff | no |
| sfx_uq_titan_slam_full | Cocoa Titan | castCocoaUnique titan actual impact | no |
| sfx_uq_titan_aftershock | Cocoa Titan | titan delayed aftershock | no |
| sfx_uq_rocket_salvo | Cocoa Fire | castCocoaUnique brawler first release | no |
| sfx_uq_rocket_detonation | Cocoa Fire | Unique gauntlet explosion | no |
| sfx_uq_phantom_enter | Cocoa Dash | castCocoaUnique dashboxer start | no |
| sfx_uq_phantom_strike | Cocoa Dash | Phantom actual leap landing | no |
| sfx_uq_mint_gale | Mint Barrage | castWindRush | no |
| sfx_uq_mint_lance_release | Mint Impaler | releaseFrostLance | no |
| sfx_uq_mint_bloom_full | Mint Glacier | releaseGlacierBloom full | no |
| sfx_uq_rebound_burst | Momo Ricochet | Strawberry Rebound activation | no |
| sfx_uq_taro_chain_cast | Taro | castPathRecall first discharge | no |
| sfx_uq_taro_chain_hit | Taro | chain fork accent not each foe | no |
| sfx_uq_sesame_prism_charge | Sesame | castOathWard initial gather | no |
| sfx_uq_sesame_prism_volley | Sesame | castOathWard one volley | no |
| sfx_uq_yuzu_parade | Yuzu | useCharacterSkill citrusParade | no |
| sfx_uq_yuzu_crew_hit | Yuzu | empowered crew attack grouped | no |
