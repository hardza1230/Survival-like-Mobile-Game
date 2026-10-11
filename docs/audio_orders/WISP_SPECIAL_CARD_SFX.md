# Escort Wisp purification + special-card SFX

Owner requested charging sound while Wisp purifies a stone and a separate sound identity when collecting special cards. Six ElevenLabs files generated, decoded/non-silent. Assets only; runtime unchanged at v7.1.0, base 68ab2738cb26b55d185c03d42d21b102eeee7f44. Human listening/mix QA pending.

## Wisp: actual live code

- tickPurifyWisp: w._state switches travel -> channel near a core. Progress increments only while player is near (escort radius), pauses when away; accumulated progress is NOT reset on walking away. Use ONE loop voice wisp_purify_charge only while channel + near + valid target + objective live. Detect transition once; do not call playFile every tick. Pause/fade charge while player is away, resume when back; volume or pitch can gently follow clamped channel progress without restarting sound. Static loop deliberately has no built-in final swell; timing belongs to real t.channel. Do not change game channel duration.
- purifyCore(node): guard active/non-purified, STOP charge BEFORE one wisp_purify_complete, before destroyWaveObjectiveNode can complete/clear objective. Set final cue once per successful node. Suppress any generic clear/levelup used for that same purification. Retain independent quest completion only if intentional and sequential, not duplicate fanfare at final stone.
- wisp_purify_interrupt optional: soft cue only a deliberate transition to interrupted channel/snuffed-out Wisp. Walking near radius edge can chatter: minimum 1.5s debounce, and no interrupt during successful completion/normal scene cleanup. Pause may simply be silent instead.
- STOP/destroy loop on killPurifyWisp, clearWaveObjective, no target, death, leave scene, mute. Pause on game pause or card selection; resume only if original channel still valid. Respect SFX slider and audio unlock. No leaked timer/audio callbacks. Existing game Sfx backend only; no separate HTML Audio/AudioContext. Single Wisp charge voice, completion takes its place. Background combat remains audible; do not claim all sounds globally cannot overlap.

## Special card: do not infer provenance from pendingLvl

Current openLevelUp sets state/pause then plays levelup if !_forcedOpts; relic choices are constructed AFTER that check, so guaranteed Relic levels 6/12/18 can wrongly play normal fanfare. Also chest pick / map reward can increment pendingLvl even when no actual hero level rose. Fix event classification AFTER final choices and origin are known, BEFORE playing a sound; preserve gameplay counters and existing two-tap selection.

1. special_card_pickup: at actual battlefield acquisition of a special/relic/card reward, once when accepted. Do not reuse sfx_levelup or play the pickup on every popup redraw. Read current collect/openPrize/grant paths to tag reward source explicitly. Mixed coin/gear reward is not automatically a special card.
2. special_card_offer: opening a special reward selection (treasure/relic/forced reward) replaces normal levelup and generic card_offer_open. Prefer ONE principal arrival cue: if pickup immediately opens offer, use offer only or a short pickup followed by deliberate sequential offer; never stack both at full level.
3. special_card_confirm: accepting special card replaces generic card_confirm only when no more-specific cue exists. Existing relic_acquire/build_path_select/infusion_apply/modifier_acquire/tradeoff_acquire/evolution take priority; never add generic special-confirm on top. First focus remains card_focus. Card's special field alone is not proof the whole panel came from treasure; ordinary level-up panels can include a special option.
4. Actual hero XP level rise uses ordinary levelup identity. If actual level gain produces guaranteed Relic offer, choose special offer as principal cue rather than both. Forced selection by itself is not level gain. Do not globally alter all openLevelUp to special.
5. Keep pending source through apply/close until consumed, reset on new run and cancel. Handle queue of normal XP picks + special reward without stale origin flag. Need explicit acceptance checks: ordinary XP -> normal; chest -> special; guaranteed Relic -> special; Build/Evolution -> existing semantic cue; repeated render -> silence.

## Register / delivery

Register literal paths from assets/audio/sfx/wisp_special/MANIFEST.json in ASSET_AUDIO via current Boot/build pipeline. Use existing Sfx.ev backend for one shots; charge needs a controlled looping voice (gap/cooldown alone cannot enforce one instance). No runtime code in this commit. Next AI wires alongside the 41-file playtest revision, bumps version/changelog, checks and deploys per CLAUDE.md.

| ID | Seconds | Loop |
|---|---:|---|
| wisp_purify_charge | 3 | yes |
| wisp_purify_complete | 2.76 | no |
| wisp_purify_interrupt | 0.8 | no |
| special_card_pickup | 1.6 | no |
| special_card_offer | 2.28 | no |
| special_card_confirm | 2.68 | no |

## Request to next AI

อ่าน docs/audio_orders/WISP_SPECIAL_CARD_SFX.md แล้วผูกเสียง Wisp ชาร์จเฉพาะตอนชำระหินที่กำลังเดินจริง หยุด/พักเมื่อไม่ channel หรือผู้เล่นไม่อยู่ใกล้ ก่อนเสียงชำระสำเร็จ และแยก source ของการ์ดพิเศษจาก XP level-up ห้ามใช้ pendingLvl เป็นตัวตัดสินอย่างเดียว จัดหนึ่งเสียงหลักต่อเหตุการณ์ ใช้ Sfx เดิม ฟังจูน/check/version/push/deploy ตาม CLAUDE.md
