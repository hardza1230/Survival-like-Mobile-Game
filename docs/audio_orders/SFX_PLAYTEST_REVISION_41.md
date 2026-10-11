# Playtest SFX revision — 41 sounds

Owner played v7.1.0 and requested nine areas: stronger Slot, card/level-up, poison/Hunt events, item draw, Temple upgrade, digging, ladder descent, differentiated mine discoveries, and nostalgic MMORPG anvil-style enhancement. Earlier cues were too short/understated. These are original ElevenLabs generated sounds; no RO recordings or samples. Runtime unchanged; latest delivery base v7.1.0 / a8922a29755840521d75bfd8b7e4e171afbde7b4.

## Sound design / evidence

Rewards have immediate attack, structured buildup and 2–4.5 second decay, instead of uniformly short UI pings. Frequent mining strike stays 0.9s. Longer duration is not proof of greater subjective quality. Files are decoded/non-silent and hashes checked; human listening and in-game gain/tail tuning remain necessary. Phone-audible midrange requested; no blanket loudness boost. Prompts and original API responses retained.

Actual latest v7.1.0 has 133 + 4 prior files registered and partially integrated. Current slotSpin is still one-shot; prior loot rarity identities are registered but unused. Mine digReward branches share digFind/digRare, and gift plays digRare + chestWin together. Temple uses progress(core/talent/promotion), Enhance uses equipmentEnhance(success/break/destroy). Fix routing as below; simply generating longer sounds cannot prevent overlap or make unused assets audible.

## Integration: keep existing Sfx backend and game balance

1. MANIFEST keys/paths are the registry plan. Repoint existing keys, register genuinely new ones as literal ASSET_AUDIO paths via existing boot/build tooling. Preserve mute/slider/audio unlock, fallback, uiAction queue and voice limits. Assets-only delivery does not bump runtime. Implementer must bump version/changelog, checks and live deploy according to CLAUDE.
2. Slot: start ONE controlled slot_spin loop, stop before result/reel-end. slot_stop is optional final stop accent, not all three calls plus old tick. Slot jackpot/miss/near are mutually exclusive outcome cues. Do not play jackpot + chestWin + generic clear. Stop loops on cancel, navigation, scene shutdown and mute; never start a fresh three-second loop on every tick. Do not replace unrelated crafting with Slot fanfare.
3. Hero level-up: new levelup replaces sfx_levelup. Card offer/open and final selection must not stack three long cues. Actual hero level-up -> levelup principal cue; chest/relic-only container -> card_offer_open. First tap uses short card_focus; accepted ordinary pick card_confirm. Build/Unique/Evolution semantic cue stays principal for those picks; do not also add generic confirm/clear. Do not truncate long reward to a 250ms uiAction timeout.
4. Draw: item_roll_start once, item_roll_loop optional single controlled anticipation voice while actual animation runs, then stop it BEFORE ONE rarity outcome. Existing rarity labels are normal/magic/rare/epic/legend; inspect actual unique flag (Unique is not a substitute for rarity). Unique cue replaces, not stacks on top of, Legendary. Small Common 1.2s; Legendary 4.5s. Start cue already contains initial anticipation; don't immediately stack loop at full gain. Never replay reveal on list redraw or passive inspect.
5. Temple: buyTal/buySpecialCore successful -> temple_core (existing progress_core); hero talent node -> temple_talent (progress_talent); successful promote -> temple_weave (progress_promotion). Failure stays error, silent render. Select one principal success sound; do not pair generic click, clear or old success. Keep rapid successive upgrades to one progression voice, superseding previous tail with 60–100ms fade.
6. Enhance: equipmentEnhance('success') -> enhance_success; 'break' -> enhance_fail; 'destroy' -> enhance_destroy. Inspect Save.enhance meaning: break means failure/downgrade, not item destruction. Result clips already contain hammer buildup: don't also play enhance_start immediately with result. enhance_start is ONLY for a genuinely delayed forge animation, stop/fade it before result. Do not delay inventory mutations just to fit sound; don't change enhancement odds.
7. Mine: dig_hit follows actual initial strike, dig_break at block fracture. Current fracture follows about 170ms later, so long strike tail overlaps break: fade/stop strike at fracture (or trim strike to about 160ms from original). Single mining action channel; never leave 0.9s strikes accumulating. At actual discovery, let break fall to a quiet tail and ONE reward cue take priority. No fixed delayed callback surviving navigation.
8. Mine discoveries route by actual digReward c.c: thread/sugar legacy branch that awards THREAD -> dig_find_thread; valuable multi-thread reward may use dig_find_thread_rare. ore actually awards SUGAR -> dig_find_currency (stylized reward clinks; not literal metal ore mining); core stone -> dig_find_resource or dig_find_rare; scroll -> dig_find_scroll; part -> dig_find_part; chest/gift -> dig_find_rare or actual awarded-item cue; ONE cue for mixed gift, remove digRare+chestWin double. Equipment-specific dig_find_item is supplied for a real gear find only; do not invent a gear reward if current mine grants threads/parts/currency. Normal dig_find_resource is fallback.
9. Mine gem/ladder discovery -> dig_ladder_found; secret stair passage can use same discovery or rare cue. Actual accepted digDescend -> dig_descend; stop pending dig/reward channel before descent so ladder discovery and descent don't collide. 3s audio does not require blocking controls for 3s. Cancel on screen leave. No continuous ladder footsteps.
10. Hunt the Threat is the real objective name (not Hunt the Thread). hunt_threat_start at first actual marked-elite reveal/spawnObjectiveElite or objective entry, choose ONE occurrence per objective/round according to displayed banner. Do not play on every spawn retry/render/tick. hunt_threat_complete at completed full Hunt, not every normal kill or intermediate round. Hunter's Curse transition false->true in tickHuntCurse uses hunt_curse_apply instead of generic hurt; don't repeat on HP drain ticks. Reset latches on new objective/endRun.
11. poison_apply once on actual status transition or accepted poison contact, NOT every hazard tick or enemy poison projectile launch. Current snapshot contains toxic/poison-named hazards but no clear dedicated player poison timer in keyword audit. Inspect actual hazard state: if there is no poison status, cue only first accepted toxic hazard damage with cooldown (suggest >=3s and per-zone entry latch), never add a new gameplay poison mechanic. Do not label generic fire hazard as poison. Hunter curse is separate.
12. Event channels: at most one long reward/menu progression voice and one warning voice; successive events stop/fade the earlier voice in their channel. Warning can duck BGM/ordinary effects mildly and briefly; not every dig tap. Background combat may still sound during poison/Hunt warning—cannot guarantee global silence without deliberate arbitration. Owner previously requested avoiding overlaps; guarantee same-channel non-overlap by explicit stop/fade, not cooldown alone. Keep boss telegraph higher priority than progression.

## Files / duration / planned key

| Group | ID | Seconds | Loop | Key |
|---|---|---:|---|---|
| Slot | slot_spin | 3 | yes | sfx_slot_spin |
| Slot | slot_stop | 1.2 | no | sfx_event_slot_stop |
| Slot | slot_near | 2 | no | sfx_slot_near |
| Slot | slot_miss | 1.28 | no | sfx_slot_miss |
| Slot | slot_jackpot | 4 | no | sfx_slot_jackpot |
| Growth | levelup | 3 | no | sfx_levelup |
| Cards | card_offer_open | 1.76 | no | sfx_event_card_offer_open |
| Cards | card_focus | 0.8 | no | sfx_event_card_focus |
| Cards | card_confirm | 2.2 | no | sfx_event_card_confirm |
| Loot | item_roll_start | 2.2 | no | sfx_event_item_roll_start |
| Loot | item_roll_loop | 3 | yes | sfx_event_item_roll_loop |
| Loot | loot_common_reveal | 1.2 | no | sfx_event_loot_common_reveal |
| Loot | loot_magic_reveal | 1.68 | no | sfx_event_loot_magic_reveal |
| Loot | loot_rare_reveal | 2.28 | no | sfx_event_loot_rare_reveal |
| Loot | loot_epic_reveal | 3 | no | sfx_event_loot_epic_reveal |
| Loot | loot_unique_reveal | 3.76 | no | sfx_event_loot_unique_reveal |
| Loot | legend | 4.48 | no | sfx_legend |
| Temple | temple_weave | 3.2 | no | sfx_craft_progress_promotion |
| Temple | temple_talent | 3 | no | sfx_craft_progress_talent |
| Temple | temple_core | 2.68 | no | sfx_craft_progress_core |
| Mine | dig_hit | 0.88 | no | sfx_dig_hit |
| Mine | dig_break | 1.76 | no | sfx_dig_break |
| Mine | dig_descend | 3 | no | sfx_dig_descend |
| Mine | dig_find_resource | 1.48 | no | sfx_dig_find |
| Mine | dig_find_item | 2.2 | no | sfx_event_dig_find_item |
| Mine | dig_find_rare | 3.2 | no | sfx_dig_rare |
| Mine | dig_find_currency | 1.6 | no | sfx_event_dig_find_currency |
| Mine | dig_trap | 1.36 | no | sfx_dig_trap |
| Events | poison_apply | 1.36 | no | sfx_event_poison_apply |
| Mine | dig_find_thread | 2.76 | no | sfx_event_dig_find_thread |
| Mine | dig_find_thread_rare | 2.76 | no | sfx_event_dig_find_thread_rare |
| Enhance | enhance_start | 1.76 | no | sfx_event_enhance_start |
| Enhance | enhance_success | 3.2 | no | sfx_craft_gear_enhance_success |
| Enhance | enhance_fail | 2.4 | no | sfx_craft_gear_enhance_break |
| Enhance | enhance_destroy | 2.76 | no | sfx_craft_gear_enhance_destroy |
| Mine | dig_find_scroll | 2.2 | no | sfx_event_dig_find_scroll |
| Mine | dig_find_part | 1.76 | no | sfx_event_dig_find_part |
| Mine | dig_ladder_found | 2 | no | sfx_event_dig_ladder_found |
| Events | hunt_threat_start | 2.56 | no | sfx_event_hunt_threat_start |
| Events | hunt_threat_complete | 3 | no | sfx_event_hunt_threat_complete |
| Events | hunt_curse_apply | 1.48 | no | sfx_event_hunt_curse_apply |

Two generated silk-based cues were reassigned to mine thread discoveries after code audit clarified the Hunt name. original_generation_id preserves this provenance; API text was not rewritten after generation. Compare PREVIEW originals before wiring.

## Send to next AI

อ่าน docs/audio_orders/SFX_PLAYTEST_REVISION_41.md แล้วผูกเสียงแก้จาก feedback 41 เสียงใน assets/audio/sfx/playtest_revision/MANIFEST.json แทนเสียงเดิมตามบริบท เพิ่ม Hunt the Threat/curse/poison และแยกของในเหมือง เล่นหนึ่ง outcome ต่อ action หยุด loop ก่อนผลลัพธ์และคุมช่องเสียงไม่ให้หางทับกัน ฟังจูนในเกม โดยไม่เปลี่ยนกลไกเกม จากนั้น version/check/push/deploy ตาม CLAUDE.md
