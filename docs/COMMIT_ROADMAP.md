# Commit Roadmap (v4.74 →)

แผนแบ่งงานเป็น commit เล็ก ๆ ทีละก้อน · 1 commit = 1 เรื่อง, เล่นได้/ไม่พังหลังทุก commit
ทุก commit: bump `GAME_VERSION` + `CHANGELOG` + validator version → `npm run check` → headless test → อัปเดต CLAUDE.md §4 → push
สถานะ: ⬜ ยังไม่ทำ · 🔄 กำลังทำ · ✅ เสร็จ

## Phase A — Chapter 3 ให้สมบูรณ์ (ยกเว้นอาร์ต)
- ✅ **A1** (v4.85) Story beats + wave cutscene บท 3 (`STAGE_STORY_BEATS[10..14]`) + story panel ก่อนบอสแต่ละด่าน
- ✅ **A2** (v4.85) Epilogue ด่าน C3-1..C3-5 (`STAGE_EPILOGUE[10..14]`) + ฉากจบเกม (victory หลัง The First Planter)
- ⬜ **A3** Bestiary: เพิ่ม mini/boss C3 ทั้ง 10 ตัว + นับ kill ถูก
- ⬜ **A4** กลไกบอส C3-1/C3-2 (ท่าเฉพาะ 2–3 ท่า/ตัว + phase gate แบบ `b.hp<=b.maxhp*X`)
- ⬜ **A5** กลไกบอส C3-3/C3-4
- ⬜ **A6** The First Planter (C3-5) 4 เฟส + ฉากตาย
- ⬜ **A7** มินิบอส C3 ท่าเฉพาะ (5 ตัว)
- ⬜ **A8** Objective/กิมมิคเฉพาะบท 3 (1–2 แบบ) + wave profile ศัตรูตามด่าน
- ⬜ **A9** Balance pass บท 3 (recommendedPower, HP/DMG curve, validator ขยายเป็น 15 ด่าน)

## Phase R — Endgame: Mochi Recipe Maps (แบบ PoE maps ในรูป survival) ← ทำก่อน
แนวคิด: Recipe = ไอเทมแผนที่ (ธีม 1 ใน 15 ด่าน + Tier 1-16 + mods) · รัน = เติม **Hunger Meter** ด้วยการฆ่า (เป้าเฉลี่ย ~2 นาที · เคลียร์เร็ว = จบเร็ว ไม่มีรอ timer) + event กลางรัน → บอสธีมนั้น → ดรอป Recipe ถัดไป/ของ endgame/เศษกุญแจ
ค่าเริ่มต้นที่สมมติไว้ (เปลี่ยนได้): รันเฉลี่ย ~2 นาที (เจ้าของยืนยัน) · Tier 1 ฟรีไม่จำกัด · **ตาย = Recipe หาย** · เปิดครบ 15 ธีม
- ✅ **R1** (v4.75) Data model + save: `Save.data.recipes[]` {uid,theme,tier,mods,rarity} + หน้า 📜 Recipe (Activities) แสดงคลัง + ปุ่มรับ T1 ฟรี
- ✅ **R2** (v4.76) Recipe run mode: Hunger Meter เต็มจากการฆ่า (elite/rare ให้แต้มเยอะ, spawn ไหลแรงให้ build แรงเคลียร์ไว) → บอสโผล่ทันที · Speed bonus: จบเร็วกว่า par ได้รางวัลเพิ่ม + บันทึกเวลาดีที่สุดต่อธีม · mods/tier คูณเข้า `diffMul()` · ตาย = Recipe หาย
- ✅ **R3** (v4.77) Boss drops + loop: ดรอป Recipe tier เท่า/สูงกว่า, เศษกุญแจ Pinnacle, ของ endgame iLv ตาม tier (กฎเหล็ก: tier สูง รางวัลดีกว่า)
- ✅ **R4** (v4.78) Craft Recipe ด้วย currency เดิม (transmute/alt/regal/chaos/exalt/scour) + mod ที่เปลี่ยนกลไก (มอนเร็ว, ระเบิดตอนตาย, ห้ามฮีล ฯลฯ)
- ✅ **R5** (v4.79) Event กลางรัน: ห้องสมบัติ / ศาลบัฟ / พ่อค้า / Rare elite
- ✅ **R6** (v4.80) Atlas board 15 ธีม: บันทึกเคลียร์ต่อ tier + ได้ Atlas point
- ✅ **R7** (v4.81) Atlas passive tree (เพิ่มดรอป, event บ่อยขึ้น, mod พิเศษ ฯลฯ)
- ✅ **R8** (v4.82) Unique ที่เปลี่ยน build + ดรอปเจาะจงจากบอสแต่ละธีม
- ✅ **R9** (v4.83) ย้าย Rift → Recipe (เซฟเก่า riftKeys แปลงเป็นเศษกุญแจ) · Pinnacle ใช้เศษกุญแจ · Boss Rush คงไว้
- ✅ **R10** (v4.84) Balance pass tier 1–16 + validator contract

## Phase B — Endgame เสริม (หลัง Phase R)
- ⬜ **B1** Pinnacle: ท่าโจมตีเฉพาะ + 3 เฟส (แยกจาก First Planter)
- ⬜ **B3** สถิติ/Achievement endgame
- ⬜ **B4** (เลือก) Mochi Pet หรือ Ascendancy สายอาชีพ — แตกเป็น commit ย่อยตอนเริ่ม

## Phase C — ต่ออาร์ตจริง (เมื่อ AI อีกตัวส่งภาพมา)
- ⬜ **C1** ศัตรู C3 `c3_e_*` + พื้น `bg11-15`
- ⬜ **C2** มินิ/บอส C3 + จูน scale/setCircle
- ⬜ **C3** Pinnacle art + validator asset contract บท 3

## Phase D — QA + Polish
- ⬜ **D1** แก้ตาม feedback เล่นจริงบนมือถือ (แตกย่อยตามเคสใน `docs/PLAYTEST_CASES.md`)
- ⬜ **D2** Performance pass (FPS ด่านมอนเยอะ/บอส C3)

## Phase E — Play Store (พักไว้จนเจ้าของสั่ง)
- ⬜ **E1** ปุ่มลบบัญชีในแอป · ⬜ **E2** Store listing + screenshots · ⬜ **E3** Keystore + signed AAB · ⬜ **E4** Closed test · ⬜ **E5** รายได้ (AdMob)

## Mint Build Path Rework — approved 7 Oct 2026

| Commit | Scope | Status |
| --- | --- | --- |
| M1 | Names, focused card pools, Barrage lance cap conversion | ✅ v6.55.79 |
| M2 | Glacier Frost stacks, boss Brittle, bounded chain Shatter | ✅ v6.55.80 |
| M3 | Crystal Impaler charge, Impale stacks, Rupture | ✅ v6.55.81 |
| M4 | Path Evolutions, VFX/readability; user owns mobile review | ✅ code v6.55.82; user playtest pending |

See docs/MINT_BUILD_PATH_REWORK_2026_10_07.md. Monster animation batches remain separate.

Strawberry/Momo are one current hero. S1–S5 implemented together in v6.55.83; details and historical audit: docs/STRAWBERRY_MOMO_AUDIT_2026_10_08.md.

| Work | Status |
| --- | --- |
| S1 focused cards/text/count conversion | ✅ code v6.55.83 |
| S2 Ricochet bounce/visited/growth/boss fallback | ✅ code v6.55.83 |
| S3 one heavy Sniper seed/manual Unique | ✅ code v6.55.83 |
| S4 close-range Shotgun/non-piercing Evolution | ✅ code v6.55.83 |
| S5 path Evolutions/lifecycle/budgets/regression | ✅ code/check/build v6.55.83; user in-game/mobile review pending |

## Story quota / EXP — v6.55.84

✅ Code: all 15 stages, finite shared quotas, linear EXP and Lv18 base completion, replay, Stage 3 hero choice. Automated checks/build pass; user in-game/balance review pending. Details: docs/STORY_WAVE_BUDGET_2026_10_08.md.

## Swarm feedback — v6.55.85

✅ Timed Swarm persists until countdown end; denser controlled spawns and pulses, larger finite objective/replay quotas, unchanged XP budgets. Actual director-loop regressions/checks/build pass; user gameplay review pending.

## Hunt recovery — v6.55.86

✅ Objective-owned retry, reserved slot, pooled visibility/bounds and no duplicate target. Actual-method check/build pass; C1-5 wave4 user retest pending.

## Earned growth P1 — v6.55.87

✅ P1: uncapped earned combat EXP, fixed success rewards, no missing-EXP top-up, earned orb settlement/failure/replay handling. Automated checks/build pass; user gameplay pending. P2 drops/health/magnet and P3–P5 remain planned. Details: docs/EARNED_GROWTH_P1_2026_10_08.md.


## Story growth phases — 8 Oct 2026
- ✅ P1 earned combat/objective EXP (v6.55.87)
- ✅ P2 field pickups and on-kill recovery (v6.55.88)
- ✅ P3 staged Hunts and opening Elite showdown (v6.55.89); owner mobile playtest pending
- ✅ P4 Story Strawberry/Mint draft guarantees and late objective pacing (v6.55.90); owner mobile playtest pending
- ✅ P5 remaining hero draft guarantees (v6.55.91); current balance retained at owner request, mobile/playtest-dependent tuning pending

## Monster animation Batch 7A — v6.55.92

✅ Six Fermented Canopy creatures: generated 16-pose sheets, packed alpha assets, stage loading and presentation integration. Original balance/colliders and separate Crown Sapling Elite identity are preserved. Source, exact prompts, packing and review: assets/incoming/ch2_s1_animations. Crown Sapling animation moves to batch 10; owner mobile visual/FPS review remains pending.

## Monster animation Batch 7B — v6.55.93

✅ Seven Mycelium Marsh creatures including Sporeling: 112 authored poses, packed alpha sheets, stage loading and existing presentation integration. Original combat/colliders, guard aura, Drifter acid, Mold Sac two-child split and capped zero-XP Sporeling spawns remain. Source/manifest/prompts/packing/review: assets/incoming/ch2_s2_animations. Owner mobile visual/FPS review pending. Next: batch 8, Nectar Hive including Tiny Grub.


## Batch 8 delivered — v6.55.94

Seven Nectar Hive creatures including Tiny Grub receive 16 authored poses each. Flying species flap wings; Dartwing has windup/dash, both Pollen Sniper and Choir Moth have preparation/firing, Honey Bomb has a once-per-life low-HP warning. Runtime assets: assets/art/ch2_nectar. Original/raw/packed sources, exact prompts, packing and review: assets/incoming/ch2_s3_animations. Original HP/damage/speed/EXP, circles, wax guard aura and 0.74 guard multiplier, flower targeting, Choir Moth three-shot fan, caps and Story P1–P5 remain. Atlas cell 7 flower fallback, generic Elite and boss/miniboss art remain. Tiny Grub has an existing atlas/type mapping but no current spawn caller or special stat branch; its existing basic stats/1 EXP remain, without adding summons. Owner mobile visual/FPS review pending. Next: batch 9, Four-Season Conservatory and Root Throne.


## Elite and special creatures — v6.55.95

Elite/special art batch B is implemented: Crown Sapling, Mini Jelly, Chapter 3 Elite, Feast Target and Mimic Chest each have 16 authored poses. Packed RGBA PNG/raw/exact prompts/packing/contact/animated review: assets/incoming/elite_summons; runtime lossless alpha WebP: assets/art/elite_summons. Crown Sapling uses C2-1 atlas cell 6 identity; Chapter 3 Elite uses the ash/gold crowned seed knight design from the brief. Feast carries a food plate and uses flee clips, without an attack clip. Mimic is a toothy living chest. Existing world sprite boxes/circle radii/centers are preserved when 62px generic Elite and 48px chest art become 256px frames. Mini Jelly keeps .36 scale and [70,58,70] circle. HP/damage/speed/EXP, Elite gates, Warden half-HP three-child split, Feast timers/Hunger share and Mimic chance/tier/reward remain. Animated Feast pool reuse cancels its escape fade and clears fleeing state; missing sheets retain original art. Boss/miniboss pose/death controllers remain separate. Owner mobile visual/FPS review pending. Ordinary season/root art (batch 9), Chef gear and card/Unique VFX art remain.


## Chef equipment art — v6.55.96

Head Chef Medal and Golden Spoon Ring now use painted 256px RGBA icons through the existing gear image loader and shared equipment/crafting/Bazaar/reward views. Runtime: assets/gear/amulets/am_chef.png and assets/gear/rings/ri_chef.png. Combined sheet, original generation, exact prompt and packing metadata: assets/incoming/chef_gear. Prices, enhancement effects, stats and Royal Chef set bonuses are unchanged. Owner mobile visual review pending. Remaining art: batch 9 (14 ordinary season/root creatures), Unique build card icons and Unique VFX.


## Build card icons — v6.55.97

Fifteen Build upgrade cards now have distinct painted icons: four Sniper, five Shotgun, three Glacier Bloom and three Crystal Impaler cards. The 4x4 source sheet keeps the final cell reserved/transparent. Runtime lossless alpha WebP: assets/art/build_cards; original/normalized sheet, 256px RGBA PNGs, exact prompt, packing and preview: assets/incoming/build_cards. Only upgrade iconKey mappings change; build-selection art, effects, ranks, prices, draft weighting and P1–P5 balance remain. Owner mobile visual review pending. Remaining art: batch 9 (14 ordinary season/root creatures) and Unique VFX.
