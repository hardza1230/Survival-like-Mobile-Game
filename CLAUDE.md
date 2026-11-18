# Version line

Current release: **8.2.16**. Next release:8.2.17. Fetch the deploy branch before new work.

# Latest delivery: v8.2.16 — 🧊 Frozen Pantry becomes a frozen army: squads, Captains, General, frozen crates

Owner 18 Nov: Frozen Pantry like a Legion encounter — wider, more and varied monsters, frozen crates, a strong leader. Walking still paints (no damage while frozen; woken monsters keep full HP — owner choice). **Army:** 30 statues (replay 45, `FP_ARMY`) in 5/6 squads across a wider dome (`FP_DOME` 760, was 520). Each squad: 👑 Captain (Tank ×1.3 size, HP ×`FP_CAPTAIN_HP` 1.8, gold tint, aura ring) + Tank + 2 Shooters + basic/fast (dasher from C1-3) — statues sized/tinted per role (`FP_ROLE_LOOK`). Killing a Captain weakens its living squad (speed/damage ×`FP_LEADERLESS` .75, grey tint). **Frost General** now always appears (was replay only), near the jar, with its own big crate (Recipe Ink; Star Sugar on replay). **Frozen crates** (`FP_CRATES`: Sugar, Sugar, Gear, Honey; replay + Recipe Ink, Gear): walk over to paint them like statues; painted crates burst into loot on thaw, unpainted ones shatter (choice: army vs crates in the short paint time, still 12 s / 10 s replay). **Army bonus** (`fpArmyBonus`): defeat ≥50% → Honey Drop, ≥80% → Gear box. Crates are placeholders (ice box + emoji) until the owner has played it; then an art order. `sigSpawnAt` takes an optional role type. Bot `pool:frozenPantry` done, 0 errors. Tests: sig-missions updated.

# Previous delivery: v8.2.15 — 🔓 Yuzu unlocks after C2-1, News shows real update notes, shop rule

Owner 18 Nov feedback: Yuzu was not unlocked after C2-1. Cause: the story gate key (`collectStoryGateKey`) opens the next stage before the boss is beaten, so `stageMastery` was never written and `unlockCoreCharacters` waited for it. Now a hero unlocks once its stage is mastered **or** `unlockedStage` is past it, and `Save.unlockCoreCharacters` also runs on gate-key pickup and boss clear (old saves fix themselves on the next load). **News:** updates 8.1.148–8.2.14 showed "a"/"b" (bump script misuse) → every entry now has real English lines; `bump-version.mjs` refuses items under 12 characters. **Rules (docs):** LAUNCH_RULES rule 1 matches 17 Nov (features allowed with plan approval); rule 4 revenue = rewarded ads now, later real-money 🧶 Thread for fashion + cash shop — no selling power; QoL and some supplies (e.g. enhance-protection) allowed; theme rule lets art be replaced where it fits. Tests: hero-unlock-ch1 updated.

## 1. โปรเจกต์
Mochi Mayhem — เกมมือถือ survival-like ธีมโมจิน่ารัก เป้าหมาย Google Play · เจ้าของทำงานบนมือถือ เป็นผู้กำกับ ให้ AI เขียนโค้ดทั้งหมด

## 2. การตัดสินใจที่ล็อกแล้ว (อย่าเปลี่ยนโดยไม่ถาม)
- **คุมธีมโดยรักษาเกมเดิม (27 ต.ค. · แก้ 18 พ.ย.):** เก็บโครงหน้า ตำแหน่งปุ่ม เส้นทาง ระบบ · **อาร์ตเปลี่ยนได้ตามความเหมาะสม** (สั่งอาร์ตใหม่/แทนของเดิมได้ ถ้าดีกว่าและเข้าธีม) · ภาพ42มุมใน docs/design/unified_theme เป็นแค่ภาพสำรวจ · เปลี่ยนโครงหน้า/ระบบต้องมีคำขอจากเจ้าของ
- Phaser 3 เว็บ → Capacitor → APK/AAB → Play Store
- **เจ้าของ 17 พ.ย.: ยกเลิกกฎ "ไม่เพิ่มฟีเจอร์" (14 พ.ย.) — กลับมาพัฒนาต่อ** · เป้า Closed test จริง **13 ธ.ค.** · ทุกรอบเสนอแผนให้เจ้าของอนุมัติก่อน · เขียนใบสั่งอาร์ต/เสียงได้ (skill art-order · `docs/audio_orders/`) · เสียง Ruby A15 ผูกแล้ว v8.2.12
- **กฎเหล็ก: ยิ่งยาก รางวัลยิ่งดี** (Story ระดับเดียว · endgame ยากตามความลึก Delve `delveLoot` · Boss Rush ซ่อน)
- ผู้เล่นเป้าหมายแบบผสม: ต้นเกมง่ายน่ารัก · ระบบลึกค่อยเปิดหลัง Chapter 2–3 · ห้ามเพิ่มภาระช่วงต้น
- เสียง: ใช้ ElevenLabs ตามใบสั่งเสียง (v8.0.38–39 เจ้าของสั่ง ห้ามใช้เสียงสร้างด้วยโค้ด/Runway แทน)

## 3. โครงไฟล์
- `index.html` (โหลด phaser + game.js) · `game.js` = โค้ดเกมทั้งหมด (~21k บรรทัด) · `phaser.min.js` 3.80.1
- `assets/` รูป/เสียงจริง · คีย์อยู่ใน `ASSET_IMAGES` / `ASSET_SHEETS` / `ASSET_FX` / `ASSET_AUDIO` / `TEMPLE_UI` (URL ต้องเป็น literal `'assets/…'` เพราะ build-www คัดลอกเฉพาะที่เจอ) · อาร์ตเข้า `assets/incoming/<batch>/` → pack script `scripts/pack-*.py` → `assets/art/<batch>/` (ใช้ skill wire-art)
- โหลดอาร์ตใหม่แบบ lazy เสมอ (stage/menu/hero) ห้าม boot — งบ GPU บูตเต็ม ~300 MB
- **ขนาดแอป (Google Play ไฟล์หลัก ≤ 200 MB):** ทั้งเกมที่ส่งไปต้อง < 190 MB · มาตรฐานแพ็ก (skill wire-art §2b): WebP q80 (q75 ถ้า >150 KB) · ความละเอียด ≤ 2× ขนาดบนจอ · เพลง 80k · เสียงพูด 56k โมโน · SFX 96k · ตรวจด้วย `python3 scripts/compress-assets.py --dry` · หน้า `*-review.*` ไม่ใส่ในแอป (android.yml / release-aab.yml ลบก่อน sync)
- `docs/art_orders/` ใบสั่งอาร์ต (README = ตารางสถานะ) · `docs/audio_orders/` ใบสั่งเสียง · `docs/LORE.md`/`STORY_CANON.md` เนื้อเรื่อง · `docs/HANDOFF_NEXT_AI.md`
- `tests/*.cjs` (method-extract vm tests; เมธอดใหม่ต้องเพิ่มในรายการ extract ของเทสที่เกี่ยว) · `npm run check` รวมทุกเทส
- Build: `scripts/build-www.mjs` → www/ (esbuild minify) · `.github/workflows/pages.yml` deploy GitHub Pages (live update ของ debug APK ผ่าน `server.url`) · `android.yml` debug APK · `release-aab.yml` signed AAB (`docs/RELEASE_SIGNING.md`)
- โน้ตเทคนิคยุคแรก (VFX flipbook, การตัด sprite, raw assets) อยู่ใน `docs/CLAUDE_HISTORY.md`

## 4. สถานะปัจจุบัน
- ดูเวอร์ชันที่ `GAME_VERSION` + บล็อก Latest delivery ด้านบน · ประวัติทุกเวอร์ชัน `docs/CLAUDE_HISTORY.md`
- ระบบหลักครบ: Story 3 Chapter 15 ด่าน → Mochi Delve/Pinnacle, Temple Weave/Depths/Rank Rewards, Gear+Merge (Common→Divine)+Forge (random mods, Twist Cream), Talent ราย Build, ฮีโร่ 6 ตัว ×3 Build (Sesame WIP), Rewards hub (Login/Daily/Awards)

### บั๊กที่เคยเจอ (กันพลาดซ้ำ)
- Scale.RESIZE คืน logical CSS px แล้ว — อย่าคูณ/หาร DPR เอง ใช้ `config.resolution=RENDER_DPR`
- scrollFactor(0) ไม่รับ camera zoom → UI ใช้ sf1 · `camera.ignore(group)` เป็น snapshot → ต้อง `this.camWorld(obj)` ทุกครั้งที่ spawn
- shape `setInteractive()` กดไม่ติดบนมือถือ → ใช้ tap zone ตรวจพิกัดเอง (`_zone` / `tapZones`)
- pool เต็ม → `getFirstDead` คืน null → ต้อง guard ทุกครั้ง
- `physics.world.timeScale` กลับด้าน (มาก = ช้า): gameSpeed ใช้ `1/s`, hitStop ใช้ค่ามาก
- Graphics ใน vm test stub อาจไม่มี `fillRect`/`setVisible`/`once` → ใช้ optional call หรือ property

## 5. ถัดไป
**รออาร์ต/เสียง (เจ้าของ 12 พ.ย.: AI ฝั่งอาร์ต/เสียงทำแค่ไฟล์ส่งที่ `assets/incoming/<batch>/` · Claude ฝั่งโค้ดผูกเองด้วย skill wire-art · ใบ 75–78 ก่อนหน้านี้ฝั่งอาร์ตผูกเอง)**
- ใบ 80 หน้าเลือกพิเศษ (ห้องสมบัติ Relic · ทั่ง Evolution · สมุดสูตร Mutation · การ์ด Build Path 15+1) ผูกแล้ว v8.1.137 · v8.1.138 สลับภาพ Glacier/Barrage (`PATHCARD_ART`) · รอ QA มือถือ
- ใบ 82 ภาพการ์ด Build Path เต็มการ์ด ผูกแล้ว v8.1.146 (15 ภาพ · งาดำไม่ใช้) · รอ QA มือถือ
- ใบ 81 ไอคอน Relic 8 · Modifier 36 · Trade-off 5 ผูกแล้ว v8.1.151 · การ์ด Yuzu แนวตั้ง 3 ไม่ใช้ (เจ้าของ) · รอ QA มือถือ
- รวมงานค้างให้ AI อีกตัว: `docs/PENDING_ART_AUDIO_ORDERS.md` · A13 / A12 / 79 / 69 ผูกแล้ว v8.1.108 · รอ QA มือถือ
- ใบ 69 สกินเต็มตัว Festival ครบ 68/68 · 6 ฮีโร่ผ่าน qa-skin69 · ผูกแล้ว (Mint 11 พ.ย. · ยืนยัน v8.1.108) · เจ้าของ 10 พ.ย.: ปีก/ฮาโล/วง เลิกขายแยก → สกินเต็มตัว; ขายแยกเหลือ pet/trail/dash/pop
- A14 เสียงเปิดกล่อง 8 ผูกแล้ว v8.1.147 (`openChest` · fallback เสียงเดิม) · รอฟังบนมือถือ
- (A04 ส่งครบแล้ว · หัวไฟล์ A01–A05 อัปเดตเป็น ✅ 14 พ.ย.)
- **ใบ 83 ท่าโดนตี/ท่าชนะ + สกิน 18/18** ผูกแล้ว v8.2.12 · รอ QA มือถือ
- **ใบ 84 แก้ภาพ 27/27** ผูกแล้ว v8.2.13 · รอ QA มือถือ (มอน/บอสในเกมใช้ชีต ink816 ที่ไม่โดนตัด → ชีตใหม่เป็น fallback)
- **A15 เสียง Ruby 8/8** (Hunger Crack · Clear the Fog · Lure the Crown Root · Seed Rift) ผูกแล้ว v8.2.12 · รอฟังบนมือถือ

**รอ QA บนมือถือของเจ้าของ**
- ล่าสุด: v8.1.101 loot มินิบอส/บอส · v8.1.100 ป้ายคำพูด/การ์ดเลเวลอัป/หัวหน้าจบด่าน · v8.1.99 Mint bloom/หนังสือเปิด
- League missions ครบ 7 phase v8.1.81–87 (`docs/design/OWNER_NOTES_POE_LEAGUES.md`) · Breach จำกัดเปิดรวม 20 วิ (เจ้าของสั่งเอง)
- อาร์ตผูกแล้ว: 70 Patrol + 71–74 v8.1.93 · 75 v8.1.94 · 78 v8.1.95 · 76 v8.1.96 · 77 v8.1.97 · 65 Daily Login 30 วัน + A09 v8.1.43 · 63 v8.0.95 + A06 v8.0.91 · 62 v8.0.85 · 61 v8.0.84 · 50–54 เมนู v8.0.34 · 36 Ruby v7.9.87
- Simple Forge v8.0.83 (ราคา/ความรู้สึก 3 การ์ด) · บาลานซ์ Yuzu/Seedlings, Citrus Command, Rewards hub · FPS ทุกชุดอาร์ต
- Sesame Rune Invoker (เจ้าของอนุมัติ 2 พ.ย., `docs/design/SESAME_RUNE_INVOKER.md`) v8.1.1 รอมือถือ

**รอเจ้าของตัดสินใจ / ทำต่อ**
- ความถี่แท่นเริ่มภารกิจหลังเล่นจริง · Overcharge ปิดไว้ v8.1.103 (`OVERCHARGE_ON`)
- Sesame: บาลานซ์/ความถนัดและ Talent ถาวร (ไม่ทำ Mirror Network ขั้น 2)
- ยกเลิกแล้ว: ใบ 35 Yuzu Orchard (→ Citrus Companions 55/56) · ใบ 49 กรอบโปรไฟล์

**ก่อนขึ้น Google Play**
- **เลขเวอร์ชัน:** 8.2.0 = แอปตัวแรกที่ส่ง Closed test (17 พ.ย.) · **เจ้าของเลือก 17 พ.ย.: Closed test ใช้โฆษณาทดสอบ (`ADS_TEST=true`) · `BETA_BUILD=true` (ปุ่ม 🐞 + ส่ง error อัตโนมัติให้ผู้ทดสอบ)** · ตอนขึ้น Production ค่อย `ADS_TEST=false` (+ พิจารณา BETA_BUILD) · release AAB ลบ `server.url` เอง · รายงาน 🐞 ที่ v ≥ 8.2 = จากคนทดสอบจริง (+ เจ้าของเอง)
- ภาพ/เสียงสำรอง (fallback) เก็บไว้กันพังตอน dev ที่โหลดผ่านเว็บ · เจ้าของ 12 พ.ย.: ไม่ต้องแก้ให้รอโหลด เพราะแอป Play Store แพ็กไฟล์ในเครื่อง (เช่น เรื่องเล่า Ruby ที่สลับเป็นหน้าหนังสือเมื่อการ์ตูนโหลดไม่ทัน)
- **รายได้ (เจ้าของแก้ 18 พ.ย. · `docs/LAUNCH_RULES.md` กฎ 4):** ช่วงทดสอบ = โฆษณา rewarded · อนาคต = เติม 🧶 เส้นด้ายด้วยเงินจริง → ซื้อแฟชั่นและของ cash shop · **ห้ามขายพลัง** (เจ้าของ 18 พ.ย.) · ขายได้: Quality of life + ของช่วยบางอย่าง (supplies) เช่น ของกันตีบวกแตก (ต้องมี Play Billing + เซิร์ฟเวอร์ตรวจใบเสร็จก่อนเปิด) · v8.1.140 ต่อ AdMob + UMP แล้ว (โฆษณาทดสอบ) · ตอนปล่อย: `ADS_TEST=false`, `BETA_BUILD=false`, ตั้งข้อความ GDPR ใน AdMob
- GM (รหัส 1234) ปิดเองในแอปที่แพ็กไฟล์ (v8.1.67: เปิดเฉพาะ *.github.io / localhost:port) · **ตรวจว่า release ไม่ใช้ `server.url` ชี้ github.io** · ต้องมีเซิร์ฟเวอร์ตรวจใบเสร็จ/คะแนน

**กฎเจ้าของ**
- ไม่ต้องจำลองเล่น headless เพื่อจูนบาลานซ์ และไม่ต้องถ่ายภาพหน้าจอตรวจ UI — เจ้าของตรวจบนมือถือเอง (headless หาบั๊กได้)

## 6. เอกสาร
**อ่านก่อนเริ่มงาน: `docs/GAME_PILLARS.md` (เกมสนุกตรงไหน · เสาหลัก 3 ข้อ · cut list · ด่านตรวจของใหม่) + `docs/LAUNCH_RULES.md` กฎ 7 ข้อทางไปปล่อยเกม (เป้า Closed test ≤ 13 ธ.ค. · ระบบใหม่เฉพาะที่จำเป็น ไม่งั้นลง `docs/IDEAS.md` · ทุกเวอร์ชันเพิ่มรายการ "รอ QA" ในไฟล์นั้น) + `docs/LESSONS.md` บทเรียนของพวกเรา + กติกาทำงาน** (รวมงานเป็นรอบ · ของปลอมก่อนสั่งอาร์ต · ใบสั่งอาร์ตต้องบอกจุดต่าง · ตรวจทั้งกองก่อนเพิ่มการ์ด · งบหน่วยความจำเป็นกฎเหล็ก · ไม่แน่ใจให้ถามก่อน) · `docs/PLAYTEST_CASES.md` (feedback/บั๊กจากเครื่องจริง) · `docs/LANDSCAPE_FULLSCREEN_UI_KNOWLEDGE.md` · GDD/แผนรวมเป็น artifact เดิม (แก้ให้ publish ทับ)

## 7. เทส / build
**บอท QA หลายบุคลิก** `scripts/qa-bots.cjs` (GitHub Actions "QA Bots" รันทุกคืน 10 เครื่องพร้อมกัน · วิธีใช้ใน `docs/QA_CHECKLIST.md` ท้ายไฟล์) · `bash scripts/ci-checks.sh` (= ทุกอย่างที่ CI ตรวจ · ~3 นาที) ก่อน publish เสมอ · CI: job `deploy` (เทส+build ~1.5 นาที) ขึ้นเว็บเลย + job `visual` (ตรวจหน้าจอ 11 ชุด) รันคู่กันไม่บล็อก · push สาขา deploy กับ session พร้อมกันได้ · ลำดับปล่อยเวอร์ชันอยู่ใน skill release · เทสในเครื่อง `npx serve .` · เจ้าของทดสอบ flow/บาลานซ์/FPS บนมือถือเอง

## 8. คอนเวนชัน
- ทุกเวอร์ชัน: bump `GAME_VERSION` + CHANGELOG + บล็อก Latest delivery (ย้ายบล็อกเก่าสุดไป CLAUDE_HISTORY ให้เหลือ 2 บล็อก)
- commit ภาษาอังกฤษ ไม่ใส่ชื่อรุ่นโมเดล · คุยกับเจ้าของภาษาไทย
- ข้อความในเกมเป็นภาษาอังกฤษล้วน (comment ไทยได้) · ใช้ `’` ใน single-quoted literal · ห้ามอักษรไทยใน string
