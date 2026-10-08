# Latest delivery: v6.55.89 — P3 staged Story missions

Story Hunts alternate clear-to-Elite steps (6/8/10 ordinary kills per round by chapter), retaining marked-target counts. Opening fill ends with one Elite showdown. HUD displays step progress. Intermediate transitions pay no reward and preserve P1 earned EXP/P2 pickups. Objective-owned Elite retries survive upgrade pauses and missing targets; clear steps suppress Elite spawning/curse. Exhausted clear-step reserves replenish only missing required foes within live caps. Recipe/Rift/Boss Rush/Endless/Tutorial and replay meter retain their flows. See docs/STAGED_MISSIONS_P3_2026_10_08.md. P4/P5 remain pending; owner gameplay/mobile tuning remains required.

# Previous delivery: v6.55.88 — P2 field recovery and earned-EXP magnets

P2 is implemented for Story across all 15 stages. Hearts heal 18% max HP with item bonuses (35% max HP ceiling), remain usable later at full HP, and obey a shared 2-ground/4-per-stage cap and 25s drop interval; mini can bypass the interval only. Elite heart chance stays 18%, crate chance is 20%, ordinary foes never drop hearts. Magnets use 1-ground/3-per-stage/35s limits, require earned ground EXP for combat drops, and have kill-weighted bad-luck protection. No guaranteed post-mini Story magnet; P1 already gathers earned orbs. Empty Story magnets remain on the ground. Story lifesteal/lifeOnKill share 3% max HP recovery per active second and respect no-heal/pact rules; Hungry Pact disables items only as its description promises. Stage entry resets limits; wave transitions retain them and ground items. Story crowds, kill EXP and rewards from P1 remain. Special modes keep prior drop rules/heal amount, while full-HP/zero-effect heart preservation is shared. Actual-method pickup regressions, full checks and www build pass. User owns all gameplay/mobile/balance testing. P3–P5 remain pending. See docs/FIELD_PICKUPS_P2_2026_10_08.md.

# Previous delivery: v6.55.87 — P1 earned growth

P1 is implemented: story combat EXP is earned per defeated enemy, no combat issuance cap and no automatic missing-EXP top-up. storyEnemyXp uses 2x authored enemy EXP, Hunt target 24 and miniboss 60. Five successful encounter rewards are fixed 20/30/40/50/60 (200 total), not a guaranteed end-stage level. Failed/timeout objectives only collect earned orbs. Settlement tracks questPaid to prevent duplicate reward; replay mini gets 40, final progress pays remaining 160, without changing shared quota. Story orb allocation failure pays earned EXP immediately; normal collection/completion each apply XP multiplier once. Final-boss escorts also grant earned EXP; boss defeat gathers their earned orbs without a second objective bonus. Linear Story level curve, spawn caps/quotas/timed Swarm, Hunt recovery, optional Mint in Stage 3 and boss HP tuning stay. Tutorial/Recipe/Rift/Boss Rush/Endless retain original EXP. Tests now prove more actual kills -> more EXP and levels, harder targets matter, collected/uncollected earned parity, no completion compensation, failure/replay idempotence, full orb pool fallback and multipliers across 15 stages. Full checks/www build pass; actual gameplay balance remains user-owned. P2 health/magnet/drop balance and subsequent quest/card phases are pending, not included in P1. See docs/EARNED_GROWTH_P1_2026_10_08.md. Old quota/guaranteed-Lv18 notes below are historical.

# Previous delivery: v6.55.86 — recover missing Hunt targets

Reported C1-5 wave4 Hunt stuck with no monsters. Found a lost-retry path: failed spawn used a one-shot timer whose callback dropped the retry if level-up was open. Hunt now owns a retry deadline and actual objective tick ensures one marked target while playing; failures retry every 1s, defeated targets have a 700ms gap. Recovery handles a disappeared target without crediting a kill, avoids duplicate targets, and has no delayed callback crossing objectives/runs. Story ordinary reinforcements reserve one live slot when Hunt lacks a target; reserved target bypasses ordinary quota but shares hard live cap. Target resets pooled alpha/flee/blink state and cancels old tweens. Spawn and active target positions clamp inside arena; flee stops at the arena edge. Quest targets/progress/rewards, Swarm tuning and Story XP budget are unchanged. Actual-method tests cover C1-5 wave4 cap exhaustion plus level-up, full pool, all 15 stages sequential Hunt completion, disappearance, dedup, arena bounds and objective/mode replacement. Full check/build pass; user owns in-game/mobile verification.

# Previous delivery: v6.55.85 — restore timed Swarm pressure

Player feedback: v6.55.84 reduced crowds too far and timed Survive the Swarm exhausted its reinforcement quota before the countdown. Timed story Swarm now replenishes until waveTimer reaches zero, with hard live caps and unchanged bounded EXP. This exemption is only active timed Story survive, not objective/replay/mini/boss/Endgame. Base story live caps 18/22/26/30/34 (+4 per later chapter); Swarm adds 6, movement objectives use 80%. Timed refill: groups 6–8 every 1.2s below 85% cap, surge pulses at ~10s then every 14s, max 10–14 in available slots. Other objective/replay refill: 4–5 every 1.6s below 80%. Finite objective quotas now 50/56/64/72/80; replay shared quota 240. XP per enemy still uses original 30/32/36/40/44 units (replay 182), so more reinforcements do not dilute early EXP. Combat/settlement cap remains 1020 base EXP total and Lv5/8/11/14/18 milestones. Timed reinforcements can grant normal Sugar within the fixed encounter duration, but cannot extend its timer or EXP budget. Mini/boss caps, Stage 3 free hero choice and Story HP scaling remain v6.55.84. Actual stage-loop regressions prove new enemies still arrive in the final five seconds under rapid clears, live caps hold for slow clears, and settlement EXP matches both. Full checks/build pass; user owns in-game/mobile balance review.

# Previous delivery: v6.55.84 — finite story waves and fair EXP

All 15 story stages use finite shared spawn quotas, lower live caps and a linear in-stage EXP curve (next level = 12 + 6*(level-1)). Five encounter budgets 84/126/180/234/396 total 1020 base EXP and milestones Lv5/8/11/14/18; slot 3 is the existing mandatory miniboss, not an extra quest. Combat gets rounded 60%, completion pays the remainder plus unused combat budget, collecting issued active orbs first. Failed orb allocation does not consume budget; settlement is idempotent and EXP multipliers apply once. Quotas 30/32/36/40/44 include ordinary elites, summons and boss escorts; Hunt targets are reserved outside reinforcement quota but share live caps. Base live caps 12/14/16/18/20, +4 per later chapter; movement objectives use 75%, shooters max 2/3/4. Spawn batches 3–4 every 2.4s, refill below 60%; no extra story swarm burst or pressure expansion. Miniboss live caps 8/10/12 and final-boss caps 4/6/8; final adds have a separate finite 8/12/16 quota, no EXP. Quota limits prevent unbounded EXP and Sugar farming. Kill-count HP escalation is disabled for finite story waves; boss level HP growth is 2.5%/level (Endgame stays 5.5%). Stage 3 forced Mint gate removed, optional introduction retained. Existing quest types/targets/art remain, fill target matches quota, story overtime preserves bounded EXP. Successful quests clear remaining enemies immediately and pause for all queued cards. Cleared-stage replay: one shared 182 quota, goal 140 progress, 390 base XP checkpoint at mini defeat, 1020 total before final boss. Existing scheduleStageEvent waits through upgrades. Recipe/Rift/Boss Rush/Endless/tutorial retain their own rules. Automated checks and www build pass; user owns all in-game/mobile/balance testing, especially Stage 1–2 regression and Stage 3 Mint feedback. See docs/STORY_WAVE_BUDGET_2026_10_08.md.

# Previous delivery: v6.55.83 — Strawberry/Momo S1–S5

Strawberry/Momo is one hero (runtime momo). S1–S5 code is complete: focused ordinary cards use path/shared/universal 65/20/15 weights, with foreign-path exclusion, critical-HP Recovery and exhausted-pool fallback. Basic and Unique descriptions are distinct; count overflow converts to power, and existing upgrade IDs/ranks remain stored and visible in Recipe builds. Sniper automatically charges one heavy seed (340ms +60ms per Heavy Draw rank); dash/hurt releases a weaker partial shot. Extra seed investment adds 12% power each. Heart Railgun grants full Basic +30% power/10 target penetration and fully charged manual Unique +40% damage. Shotgun caps at 12 pellets, overflow +8% power each; Petal Breacher grants +35% power, +20% close impact and a heavy center pellet without automatic piercing. Ricochet still bounces after Evolution, visits each enemy lifetime once, caps at 8 bounces and additive 2.2x growth; Heart Pinball adds two bounces and a 25% final splash. Isolated surviving bosses receive a bounded fallback impact (max 80% seed base power). New path cards: Heavy Draw, Heart Slug, Seeking Hearts and Lone Heart. Shared active seed cap 32, splash max 16 targets, painted splash VFX max 3/200ms. Basic volleys, charges and delayed Unique hits guard run epoch and basic identity; pooled metadata resets. Actual-method regression/stress checks, full npm check and www build pass. User performs all in-game/mobile/balance/FPS testing; those results remain pending. Reused existing painted art. See docs/STRAWBERRY_MOMO_AUDIT_2026_10_08.md. Mint and monster batches remain independent.

# Previous delivery: v6.55.82 — Mint M4 path Evolutions + Strawberry/Momo audit

Mint M1–M4 implementation is complete. Existing path/evolved save fields now select Hailstorm Arsenal (barrage: six queued 70%-power lances every 4s), Absolute Zero (glacier: +65% opening Shatter radius, +1 chain step up to 3, still six bursts), or Heaven Piercer (pierce: every third successful evolved full throw +35% power, 8+rank penetration and +35% Rupture). Partial/capped shots do not advance the evolved cycle. Cards/Codex/Recipe editor show path Evolutions. All Mint lances/shards share a 24-active cap; shards max 6/burst and 12/200ms; reaction VFX max 3/200ms. Glacier blooms replace shard spray and map Shard Bloom investment to power; excess Glacier lance count becomes +12% bloom power each. Standard lance fallback timers and Arsenal use run-scoped artDelay; stale projectile epochs reject hits. Heavy impact is throttled to 25ms hit-stop/350ms. Actual-method stress/regression checks and www build pass; user performs all in-game/mobile/balance/FPS testing. Reused painted art, no new sprite assets. Strawberry/Momo are one hero (runtime momo); audit documents Ricochet losing bounces after Evolution, count/text inconsistencies and proposed S1–S5, not implemented. See docs/STRAWBERRY_MOMO_AUDIT_2026_10_08.md. Monster batches remain independent.

# Previous delivery: v6.55.81 — Mint Crystal Impaler M3

Crystal Impaler automatically charges one heavy lance (320ms, +80ms per Heavy Draw rank). Dash/hurt releases a weaker partial shot without adding or consuming Impale. Full hits add Impale (max 3, expires after 5s); the next full hit triggers Crystal Rupture with a 600ms target cooldown. Targeting prefers boss/miniboss, then elite, then ordinary enemies. Heavy Draw, Impaler and Executioner cards added; Overpenetration preserves the old p_coldblood ID. Extra lance investment converts to +12% damage per extra lance; old Shard Bloom ranks improve Rupture. Existing Unique can apply full-charge Impale. Phase gates, pooled resets, run cancellation and duplicate overlap are covered by actual-method tests. Full automated checks and web build pass. User owns in-game/mobile testing. Next: M4 path Evolutions and visual polish; monster batches remain independent.

# Previous delivery: v6.55.80 — Mint Glacier M2

Glacier now builds three Frost stacks on Frozen/Brittle targets; the next frost hit triggers Shatter or Crystal Rupture. Bosses/minibosses and explicit freeze-immune foes use three-second Brittle without hard freeze. Existing Frozen path/Talent/mod bonuses also affect Brittle. New cards Deep Freeze and Chain Shatter retain existing path IDs and all prior ranks. Reaction caps: two propagation steps, six bursts per reaction and per 200ms window, 24 neighbors per burst, three painted VFX per window, 450ms target cooldown. All damage scales from Frost Lance power, never max HP. Phase immunity is respected; spawn/pool reset clears stacks and uses a separate lifetime token. Glacier Unique detonation is run-scoped/cancelable and guards recycled targets. Full automated checks and web build pass. User owns in-game/mobile testing; balance/visual acceptance awaits their feedback. Next: M3 Crystal Impaler charge/Impale/Rupture, then M4 Evolutions/polish. Monster art batches remain independent.

# Previous delivery: v6.55.79 — Mint build paths M1

Glacier Bloom / Barrage / Crystal Impaler names now share existing runtime IDs glacier/barrage/pierce. Ordinary Mint rolls use 65/20/15 path/shared/universal weights with exhausted-pool fallback and critical-HP Recovery; foreign path upgrades and rapid-fire cards on non-Barrage paths are excluded. Packed Quiver and all excess Barrage lance bonuses convert above the three-lance cap into +18% shard damage per excess lance, including after Evolution. Existing Talent/gear IDs and invested ranks remain valid; Endgame old off-path investment stays visible/costed/applied. Regression tests, full checks and web build pass. Browser smoke/phone visual review pending (Chromium download invalid ZIP). Next Mint task: M2 Glacier Frost stacks/Brittle/chain Shatter; M3/M4 remain planned. See docs/MINT_BUILD_PATH_REWORK_2026_10_07.md. Monster animation 7A/7B status is independent and unchanged.

# Previous delivery: v6.55.16 — monster animation commit 6

Ten real 16-pose sheets cover Chapter 1 stage 5 and Chapter 3 ordinary monsters, plus Stage 5 Elite. Runtime: assets/art/monster_batch6; source/manifest/prompts/packing/review: assets/incoming/monster_batch6. Original Chapter 3 apparent sizes, combat stats, collision circles and action timers are preserved. New Stage 5 keys use one authored defeat ghost. Actual-method tests, full checks and web build pass; phone visual/performance review is pending. Remaining commits 7–10; next is Chapter 2 stages 1–2 including Sporeling. Chapter 3 generic Elite remains in commit 10. See docs/MONSTER_ANIMATION_PLAN.md.

## Previous delivery: v6.55.15 — monster animation commit 5

Chapter 1 Ice monsters now use five real 16-frame painted sheets (Wisp, Shard, Caster, Frost Bubble, Guardian), including Guardian Elite. Runtime: assets/art/ch1_ice; sources/manifest/exact prompts/packing/review: assets/incoming/ch1_ice_animations. Combat values, timers, original collision circles and frostbite flags are preserved. Actual-method tests, full checks and web build pass; phone visual/performance review is pending. Remaining monster animation commits 6–10; next is commit 6 (existing Chapter 1 stage 5 and Chapter 3 sheets). See docs/MONSTER_ANIMATION_PLAN.md.

## Previous delivery: v6.55.14 — monster animation commit 4

Chapter 1 Fire monsters now use five real 16-frame painted sheets (Ember, Chili, Grinder, Pressure Pot, Golem), including Golem Elite. Runtime: assets/art/ch1_fire; source/manifest/exact prompts/packing/review: assets/incoming/ch1_fire_animations. Chili has left-facing art and separately repaired dash/recovery poses; Pressure Pot also has left-facing art; Ember, Grinder and Golem face right. Combat values, colliders and timers are preserved. Actual-method tests, full checks and web build pass; phone visual/performance review is pending. Remaining monster animation commits 5–10; next is commit 5 (Ice). See docs/MONSTER_ANIMATION_PLAN.md.

## Previous delivery: v6.55.13 — monster animation commit 3

Chapter 1 Drain monsters now use five real 16-frame painted sheets (Slime, Dasher, Caster, Bomber, Tank), including the Tank Elite. Runtime assets: assets/art/ch1_drain; source/manifest/prompts/review: assets/incoming/ch1_drain_animations. Combat stats, hitboxes and attack timing are unchanged. Tests and web build pass. Phone visual/performance review is pending. Next requested batch is commit 4 (Fire); commits 4–10 remain. See docs/MONSTER_ANIMATION_PLAN.md.

## Current release — v6.55.12 (Monster animation commit 2)

Six Chapter 1 ant species have generated raster walk/idle/action/hurt/death sheets. PNG sources, prompts, packing report and animated review preview: assets/incoming/ch1_ant_animations. Runtime WebPs: assets/art/ch1_ants. Animated selection precedes old readable/static fallback; source frame size stays 96px. Spitter/Acid prepare shots without changing cadence; Scout windup/dash and contact bite hooks use authored frames; living injured bombers show a one-time warning. Both authored facing directions are supported. Actual-method tests prove eight role mappings and original HP/damage/scales/circles. Full checks/web build pass; phone review pending. Remaining monster commits 3–10; next: Drain monsters. See docs/MONSTER_ANIMATION_PLAN.md.

## Current release — v6.55.11 (Monster animation commit 1)

Central monster presentation now owns idle/move and timed action poses, pauses animation while frozen, clears pooled state, and keeps walk-sheet proportions stable. Existing Acid Ant and stage 5 reset timers were removed. Hunt and Mini Jelly texture overrides reset presentation correctly. Optional action/death clips can be registered by later art batches; no new monster art in this commit. Actual-method tests and full checks/web build pass; phone visual review pending. Next: commit 2, Chapter 1 ant animation. Full 10-commit plan and integration schema: docs/MONSTER_ANIMATION_PLAN.md.

## Current release — v6.55.10 (VFX art batch 5)

Painted Recipe meteor, orbiting lollipops and Dango helper replace runtime emoji presentation. Source PNGs: assets/incoming/vfx_recipe_summons; lossless WebPs: assets/vfx. Meteor warning/impact reuse batch 4 shock art. Combat and targeting values remain unchanged. All summon art clears on transitions; meteor epoch guard prevents damage crossing runs. Actual-method tests cover meteor timings/damage/cancellation, summon reuse/expiry and original helper shots. Full checks/web build pass; phone visual/performance review pending. All five scoped VFX batches are created and integrated; see assets/incoming/vfx_mint/NEXT_BATCHES.md.

## Current release — v6.55.9 (VFX art batch 4)

Eight painted Recipe effects: shock, burst, freeze, sour, cleanse, immunity, burning ground and pulling hole. PNG sources: assets/incoming/vfx_recipe_fields; runtime WebPs: assets/vfx. Original combat values are preserved. Zone tweens stop at expiry; all tracked art and recipe zone references clear on transitions. Full automated checks/web build required; phone visual review pending. Remaining: batch 5 meteor, orbiting candy and helper.

# ส่งงานต่อให้ AI ตัวถัดไป (อัปเดต v6.55.12 · 4 ต.ค. 2026)

> อ่าน `CLAUDE.md` ให้จบก่อนทุกครั้ง (กติกา สาขา และวิธี release อยู่ในนั้น)
> **สาขาเดียว:** `claude/vampire-survival-mobile-game-yo9e8w` · คุยกับเจ้าของเป็นภาษาไทย · ข้อความในเกมเป็นภาษาอังกฤษ
> **วิธีทำงานกับเจ้าของ:** อ่านหัวข้อ C แล้ว **เสนอเป็นตัวเลือกให้เจ้าของเลือกเองก่อนลงมือ** (เจ้าของเป็นผู้กำกับ ไม่เขียนโค้ด)

## Previous handoff — v6.55.8

VFX art batch 3 is integrated too: purple Void Pull, jam Relic and Great Hunger metamorph. Run-scoped art timers cancel on transition; original combat/phase parameters retained. Remaining: batches 4–5.

VFX art batches 1 and 2 are integrated: Mint shards/shatter/Gale; Strawberry charge/wind; shield bubble. See assets/incoming/vfx_mint/NEXT_BATCHES.md for batches 3–5. Preserve existing combat timing/colliders. Review on phone; automated cleanup/pooling/shield tests and web build pass.

Source of truth: the latest branch/game.js, not historical task/version entries below. Work continued from v6.55.5 (6a36a21).

Implemented: painted Strawberry/Momo Sniper projectile for automatic shots and charged Unique; Boss Loot/Mystery card lifecycle cleanup including cancelled reveals and duplicate Keep guard; Mint Piercer damage 1.60 → 1.75. New VFX retains the original projectile collider and is cleaned on pool reuse/expiry/stage exit.

Checks: full automated suite and web build pass. Local Chromium unavailable; phone playtest remains necessary. Next review: Boss Loot Keep/Double/Reroll then start a new stage; pink projectile direction/readability; modest Piercer damage buff. Older pending-art and version entries below are historical and must be checked against current runtime before acting.

## A. ขั้นตอน release (ทุกครั้ง)
1. bump `GAME_VERSION` (game.js ~บรรทัด 45) และเพิ่ม `CHANGELOG` ต่อจาก `const CHANGELOG = [` (ข้อความภาษาอังกฤษ)
2. แก้บรรทัด 8 ของ `scripts/validate-game-content.mjs` ให้เป็นเวอร์ชันเดียวกัน
3. `node --check game.js && npm run check`
4. เทสแบบ headless ด้วย playwright:
   - chromium อยู่ที่ `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
   - เปิด server ด้วย `npx serve -l 8934 .`
   - รอให้ `__g.scene.getScene('Game').state==='menu'` แล้วค่อยเรียก `startRun(i)`
   - ต้องไม่มี `pageerror`
5. อัปเดต CLAUDE.md หมวด §4 (บรรทัดหัว "สถานะปัจจุบัน" + bullet ใหม่ใต้หัว)
6. commit เป็นภาษาอังกฤษ แล้ว push ด้วยลูปนี้ (มี AI ทำอาร์ตอีกตัว push สาขาเดียวกันอยู่):
   ```sh
   for i in 1 2 3; do git pull -q --no-rebase origin <branch> && node --check game.js && git push -q -u origin <branch> && break; sleep 3; done
   ```

## B. งานที่ยังค้าง (เรียงตามความสำคัญ)
**Sugar Orders v5.84:** ดู `docs/SUGAR_ORDERS.md` · Bazaar มีแท็บ Orders และรางวัลตอนเคลียร์ด่านปกติ · รอทดสอบมือถือ/ราคา · `game.js` กู้ไฟล์เต็มแล้ว ตรวจขนาดและ `node --check` ทุกครั้งก่อน push
**Feedback เล่นจริง 14 ข้อ:** `docs/PLAYTEST_FEEDBACK_2026_09_27.md` เป็น checklist หลัก · v5.82–5.83 ลงโค้ดข้อ 1–5, 7, 10–14 แล้ว แต่ยังรอเล่นมือถือ · ข้อ 6/8/9 ยังต้องตรวจสาย/การ์ด Mint และความต่าง Cocoa
**Strawberry Build Path:** ดู `docs/STRAWBERRY_BUILD_FEEDBACK_2026_09_27.md` · v5.82.0 ทำโค้ด Shotgun/Ricochet/Sniper/Unique แล้ว รอเล่นจริงบนมือถือก่อนจูนเพิ่ม · ชื่อสายแสดงบนการ์ดตั้งแต่ v5.81.0
**Feedback 27 ก.ย. — ทำแยก commit:** 1 พลั่ว ✅ v5.72.0 · 2 Daily Challenge ✅ v5.73.0 · 3 สัญญาณ Mimic ✅ v5.74.0 · 4 badge งาน/รางวัล/อัปเดต ✅ v5.75.0 · 5 ตัวละครหลักปลดตามด่าน: Mint/Cocoa ✅ v5.76.0; Taro/Sesame รอพัฒนา (แผนใน CHARACTER_UNLOCK_PLAN.md) · 6 Chapter 1 ด่าน 1–3 แบบกำหนด ✅ v5.77.0 · 7 กิจกรรมเสริม Sugar Courier/Supply Cache ✅ v5.80.0

**ทุกข้อด้านล่างยังไม่มีใครเล่นจริงบนมือถือ ต้องรอผลจากเจ้าของมาจูน**

1. **จูนด่านแรกให้ผู้เล่นใหม่ (v5.71)**
   - ตอนนี้ด่าน 1 ระดับ Normal ใช้ `newbieGuard()` ลดดาเมจที่รับเหลือ ×0.6
   - ตัวที่ไม่ใช่ basic ถูกเปลี่ยนเป็น basic 55% (ใน `spawnWaveEnemy`)
   - ถามเจ้าของว่าตอนนี้ง่ายไปหรือยากไป
2. **ภารกิจเห็นชัดขึ้น (v5.71)**
   - `waveObjTxt` ขนาด 15px, เด้งเตือนทุก 12 วินาที, banner "MISSION:" ค้าง 3.8 วินาที
   - ถ้าเจ้าของยังบอกว่าไม่เห็น ไอเดียต่อไป: ลูกศรชี้เป้าให้ใหญ่ขึ้น, ข้อความแนะนำใต้ตัวละคร, หยุดเกม 1 วินาทีตอนเริ่มภารกิจ
3. **เพลงบอส (v5.70.2)**
   - `Sfx.duckBgm` ไม่ลดเสียงเพลงแล้วสำหรับเสียงสั้นกว่า 1 วินาที ระหว่าง `_bgmIntense`
   - รอเจ้าของยืนยันว่าเพลงไม่ติด ๆ หาย ๆ แล้ว
4. **โกโก้ (v5.53–5.70) ยังต้องจูนจากการเล่นจริง**
   - ระบบที่เกี่ยวข้อง: คอมโบ 5 จังหวะ, dash ชาร์จ `_dpCh`, Bear Beat Rush (กดค้าง ลากเส้น ปัดลูกศร)
   - ค่าที่อาจต้องจูน: `RHYTHM`, `cocoaDashRecharge`, `PER`, `unit` ใน `cocoaBeatBurst`
   - ไอเดียที่ค้าง: แตะเปลี่ยนหมัด 1 ตัว, โหมด Auto
5. **อาร์ตจาก AI อีกตัว**
   - ไฟล์เข้ามาที่ `assets/incoming/<batch>/` → แปลงเป็น webp (PIL q82–85) ไปไว้ `assets/art/<batch>/` → เพิ่มเข้า `ASSET_IMAGES`
   - อัปเดตสถานะใน `docs/art_orders/README.md` เป็น 🟩
   - ที่ยังรอ: ศัตรู/มินิ/บอส Ch3 (03/04), Kitchen icons `fr_*` (07, ต้องเพิ่ม hook), Pinnacle (08), การ์ดด่าน/พื้นหลังหน้า `stage_card_sNN`/`screen_*` (09A–B, ต้องเพิ่ม hook), decor ด่านอื่นนอกจาก C2-1 (`STAGE_DECOR`)
6. **ระบบที่เพิ่งเสร็จแต่ยังไม่ได้จูน**
   - Flavor Recipe/Kitchen, Temple Depths (กระดานใหญ่ พลั่วอาจไม่พอ), Recipe Maps endgame
   - กล่องมินิบอสแบบวงล้อ, Affix slot, Relic, Bonus Challenge
7. **พักไว้ตามที่เจ้าของสั่ง (Play Store)**
   - ปุ่มลบบัญชีในแอป, store listing, keystore, closed test 12 คน × 14 วัน, Data safety

## C. ความเห็นจากมุม "ผู้เล่น" (AI ตัวก่อนเขียนไว้) → เสนอให้เจ้าของเลือก
ความรู้สึกรวม: เกมมีระบบเยอะมากและหลายระบบลึก แต่ผู้เล่นใหม่จะงงและเหนื่อย ปัญหาหลักตอนนี้ไม่ใช่ "ขาดฟีเจอร์" แต่เป็น **ความชัดเจน ความลื่น และจังหวะความสนุกช่วงแรก**

**กลุ่ม 1 — ผู้เล่นใหม่ (แนะนำทำก่อน)**
1. **30 นาทีแรกเปิดทีละระบบ:** ตอนนี้ Hub มีทั้ง Weave, Gear, Craft, Bazaar, Kitchen, Depths, Rank Perks, Codex… ควรล็อกแล้วปลดทีละอย่างตามด่านที่ผ่าน พร้อมป้าย "NEW!" และไกด์สั้น ๆ 1 หน้า
2. **หน้าตายต้องบอก "ทำอะไรต่อ" ชัดกว่านี้:** เช่น "มินิบอสพุ่ง → กด Dash ตอนเห็นเส้นแดง" (ทิปตามสาเหตุที่ตาย)
3. **คำเตือนก่อนโดนท่าแรง:** ตัวพุ่งและมินิบอสควรมีเส้น/วงเตือนที่ใหญ่และชัดกว่านี้ในด่าน 1–3

**กลุ่ม 2 — ความรู้สึกตอนเล่น (game feel)**
4. **มอนตายต้องสะใจกว่านี้:** เสียงและเอฟเฟกต์ตอนตายเป็นกลุ่ม, เก็บ EXP แบบดูดเข้าตัวเป็นสาย
5. **ช่วงกลางรันสั้นลง:** เวฟ survive บางด่านยาวจนเบื่อ ควรลดเวลาหรือใส่ event เล็ก ๆ (กล่องตกจากฟ้า, ฝูงทองวิ่งผ่าน)
6. **อ่านจอง่ายขึ้นเวลามอนเยอะ:** กระสุนศัตรูควรมีขอบสว่าง/สีเดียวกันทั้งเกม ไม่กลืนกับพื้น

**กลุ่ม 3 — เหตุผลให้กลับมาเล่นทุกวัน**
7. **ภารกิจรายวัน 3 ข้อ** (ฆ่า 300 ตัว, ผ่านด่านด้วยตัว X, ขุด 5 ครั้ง) ได้รางวัลด้าย/พลั่ว
8. **Login streak 7 วัน** (วันที่ 7 ได้ของดี)
9. **เป้าหมายระยะยาวที่เห็นบนหน้า Hub:** แถบ "ถัดไปปลดอะไร" หรือเส้นทาง Chapter

**กลุ่ม 4 — เนื้อหา**
10. **Chapter 3 ยังเป็นอาร์ตชั่วคราว** และบอสใช้ท่าทั่วไป → ควรมีท่าเฉพาะตัวละ 1–2 ท่าเหมือน Chapter 2
11. **ตัวละครแต่ละตัวยังต่างกันแค่อาวุธ:** เพิ่ม "ท่าไม้ตายวิดีโอสั้น" หรือเนื้อเรื่องเล็ก ๆ ของแต่ละตัว
12. **Pet ติดตัว 1 ตัว** (ยิงช่วย/ดูดของ) = ความน่ารักตรงธีมโมจิ และขายสกินได้ในอนาคต

**กลุ่ม 5 — ความเสถียร**
13. **Performance บนมือถือรุ่นกลาง:** ให้เจ้าของลองเล่นด่าน C2 ตอนมอนเยอะ แล้วรายงาน FPS (มี `tickPerf` ปรับอัตโนมัติแล้ว แต่ยังไม่มีใครเทสบนเครื่องจริง)
14. **Save/Cloud:** เทสเปลี่ยนเครื่องแล้วเซฟตามมาครบไหม ก่อนขึ้น Store

**คำแนะนำให้ AI ตัวถัดไปพูดกับเจ้าของ:**
> "ผมแนะนำเริ่มจากกลุ่ม 1 (ข้อ 1–3) เพราะคนเล่นใหม่เลิกเล่นเร็วที่สุดตรงนี้ จากนั้นกลุ่ม 3 (ข้อ 7–8) ให้คนกลับมาทุกวัน อยากเริ่มข้อไหนครับ? เลือกได้หลายข้อ"

ให้ทำทีละข้อ ข้อละ 1 commit/เวอร์ชัน และถามผลจากการเล่นจริงทุกครั้ง
