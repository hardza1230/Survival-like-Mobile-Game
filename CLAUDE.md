# Version line

Current release: **8.2.80**. Next release:8.2.81. Fetch the deploy branch before new work.

Latest delivery: **v8.2.80 — 🫧 Clear the Fog: wider light, creeping darkness** · full notes of the last 2 releases: `docs/DELIVERIES.md` · older: `docs/CLAUDE_HISTORY.md`

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
- `index.html` (โหลด phaser + game.js) · `game.js` = โค้ดเกมทั้งหมด (~25.5k บรรทัด · 22 พ.ย.) · `phaser.min.js` 3.80.1
- `assets/` รูป/เสียงจริง · คีย์อยู่ใน `ASSET_IMAGES` / `ASSET_SHEETS` / `ASSET_FX` / `ASSET_AUDIO` / `TEMPLE_UI` (URL ต้องเป็น literal `'assets/…'` เพราะ build-www คัดลอกเฉพาะที่เจอ) · อาร์ตเข้า `assets/incoming/<batch>/` → pack script `scripts/pack-*.py` → `assets/art/<batch>/` (ใช้ skill wire-art)
- โหลดอาร์ตใหม่แบบ lazy เสมอ (stage/menu/hero) ห้าม boot — งบ GPU บูตเต็ม ~300 MB
- **ขนาดแอป (Google Play ไฟล์หลัก ≤ 200 MB):** ทั้งเกมที่ส่งไปต้อง < 190 MB · มาตรฐานแพ็ก (skill wire-art §2b): WebP q80 (q75 ถ้า >150 KB) · ความละเอียด ≤ 2× ขนาดบนจอ · เพลง 80k · เสียงพูด 56k โมโน · SFX 96k · ตรวจด้วย `python3 scripts/compress-assets.py --dry` · หน้า `*-review.*` ไม่ใส่ในแอป (android.yml / release-aab.yml ลบก่อน sync)
- `docs/art_orders/` ใบสั่งอาร์ต (README = ตารางสถานะ) · `docs/audio_orders/` ใบสั่งเสียง · `docs/LORE.md`/`STORY_CANON.md` เนื้อเรื่อง · `docs/HANDOFF_NEXT_AI.md`
- `tests/*.cjs` (method-extract vm tests; เมธอดใหม่ต้องเพิ่มในรายการ extract ของเทสที่เกี่ยว) · `npm run check` รวมทุกเทส
- Build: `scripts/build-www.mjs` → www/ (esbuild minify) · `.github/workflows/pages.yml` deploy GitHub Pages (live update ของ debug APK ผ่าน `server.url`) · `android.yml` debug APK · `release-aab.yml` signed AAB (`docs/RELEASE_SIGNING.md`)
- โน้ตเทคนิคยุคแรก (VFX flipbook, การตัด sprite, raw assets) อยู่ใน `docs/CLAUDE_HISTORY.md`

## 4. สถานะปัจจุบัน
- ดูเวอร์ชันที่ `GAME_VERSION` + บล็อก Latest delivery ด้านบน · ประวัติทุกเวอร์ชัน `docs/CLAUDE_HISTORY.md`
- ระบบหลักครบ: Story 3 Chapter 15 ด่าน → Mochi Delve/Rift/Pinnacle, Flavor Weave & Rank + Rank Rewards, Temple Expedition (idle · แทน Depths/Dig/Patrol), Gear+Merge (Common→Divine)+Forge (random mods · สกุล 3: Twist Cream/Star Sugar/Recipe Ink), Talent ราย Build, ฮีโร่ 6 ตัว ×3 Build (Sesame เสร็จแล้ว · เจ้าของ 22 พ.ย.), Rewards hub (Login/Daily/Awards)

### บั๊กที่เคยเจอ (กันพลาดซ้ำ)
- Scale.RESIZE คืน logical CSS px แล้ว — อย่าคูณ/หาร DPR เอง ใช้ `config.resolution=RENDER_DPR`
- scrollFactor(0) ไม่รับ camera zoom → UI ใช้ sf1 · `camera.ignore(group)` เป็น snapshot → ต้อง `this.camWorld(obj)` ทุกครั้งที่ spawn
- shape `setInteractive()` กดไม่ติดบนมือถือ → ใช้ tap zone ตรวจพิกัดเอง (`_zone` / `tapZones`)
- pool เต็ม → `getFirstDead` คืน null → ต้อง guard ทุกครั้ง
- `physics.world.timeScale` กลับด้าน (มาก = ช้า): gameSpeed ใช้ `1/s`, hitStop ใช้ค่ามาก
- Graphics ใน vm test stub อาจไม่มี `fillRect`/`setVisible`/`once` → ใช้ optional call หรือ property

## 5. ถัดไป
**ใบ 88/89/90 + A18:** ผูกแล้ว v8.2.31 · รอ QA มือถือ
**Temple Expedition (v8.2.32):** แทน Dig + Patrol · ขั้น 1–2 เสร็จ (แตะ/ด่าน/บอส/ผู้ช่วย/ออฟไลน์/Supplies) · ขั้น 3–4 (สกิล/Prestige/Relic) หลัง Closed test · อาร์ตใบ 91 ผูกแล้ว v8.2.33 · เสียง A19 ผูกแล้ว v8.2.34
**เสียง A20 (ม่านเข้าด่าน Ruby พาไปด่านถัดไป):** เขียนแล้ว 21 พ.ย. · เจ้าของอนุมัติบท · รอเสียง
**ใบ 92 + 93:** ผูกแล้ว v8.2.55 · รอ QA มือถือ
**รออาร์ต/เสียง และรอ QA มือถือ:** ดู `docs/STATUS.md` (ใบสั่งที่ผูกแล้ว/รอเทส) · ตารางใบสั่ง `docs/art_orders/README.md` · งานค้างให้ AI อีกตัว `docs/PENDING_ART_AUDIO_ORDERS.md`

**ECRS ก่อน Closed test (เจ้าของ 22 พ.ย. · `docs/ECRS.md`):** รอบ 1 v8.2.52 (Kitchen ซ่อน · Forge 5→3 สกุล) · รอบ 2 v8.2.54 จากข้อมูลผู้เล่นจริง (Inbox/Miners/Daily chest Expedition เลิก · Play Stats/Ranking ซ่อน · กล่อง Gear จ่าย Sugar · Ch1 ไม่มี Run trait/Mimic) · **v8.2.59 เงินจริง → 🍭 Lollipops (ของแต่งตัวเท่านั้น) · 🧶 Thread ได้จากการเล่นเท่านั้น** · C/R หลัง test

**รอเจ้าของตัดสินใจ / ทำต่อ**
- **Expedition Simplify (เจ้าของ 22 พ.ย. · v8.2.61):** ฮีโร่ตีเอง · บอสลองใหม่เอง · ปุ่ม ⬆ Upgrade all · Supplies เติมเอง · แผนจัดทีม/บทบาท (`docs/IDEAS.md`) เลื่อนหลัง Closed test ดูข้อมูลก่อน
- **Seal the Seed Rift สั้นลง:** เสนอเป้า 8→6 · ตัวขนเมล็ดทุก 2.1→1.4 วิ ระยะ 560→420 · เวฟ 100→75 วิ · **รออนุมัติ**
- ความถี่แท่นเริ่มภารกิจหลังเล่นจริง · Overcharge ลบแล้ว (8.2.36 + 8.2.52)
- **Kitchen:** ซ่อนแล้ว v8.2.52 · หลัง Closed test ตัดสิน Cookbook หรือลบ (`docs/IDEAS.md`)
- ยกเลิกแล้ว: ใบ 35 Yuzu Orchard (→ Citrus Companions 55/56) · ใบ 49 กรอบโปรไฟล์

**ก่อนขึ้น Google Play**
- **เลขเวอร์ชัน:** 8.2.0 = แอปตัวแรกที่ส่ง Closed test (17 พ.ย.) · **เจ้าของเลือก 17 พ.ย.: Closed test ใช้โฆษณาทดสอบ (`ADS_TEST=true`) · `BETA_BUILD=true` (ปุ่ม 🐞 + ส่ง error อัตโนมัติให้ผู้ทดสอบ)** · ตอนขึ้น Production ค่อย `ADS_TEST=false` (+ พิจารณา BETA_BUILD) · release AAB ลบ `server.url` เอง · รายงาน 🐞 ที่ v ≥ 8.2 = จากคนทดสอบจริง (+ เจ้าของเอง)
- ภาพ/เสียงสำรอง (fallback) เก็บไว้กันพังตอน dev ที่โหลดผ่านเว็บ · เจ้าของ 12 พ.ย.: ไม่ต้องแก้ให้รอโหลด เพราะแอป Play Store แพ็กไฟล์ในเครื่อง (เช่น เรื่องเล่า Ruby ที่สลับเป็นหน้าหนังสือเมื่อการ์ตูนโหลดไม่ทัน)
- **รายได้ (เจ้าของแก้ 18 พ.ย. · `docs/LAUNCH_RULES.md` กฎ 4):** ช่วงทดสอบ = โฆษณา rewarded · อนาคต = เติม **🍭 Lollipops** ด้วยเงินจริง (เจ้าของ 22 พ.ย. · v8.2.59) → ซื้อของแต่งตัว/Pass เท่านั้น · 🧶 Thread = ได้จากการเล่นเท่านั้น (Thread ซื้อพลังได้ จึงห้ามขาย) · ของแต่งตัวจ่ายได้ทั้ง 🧶 และ 🍭 · **ห้ามขายพลัง** (เจ้าของ 18 พ.ย.) · ขายได้: Quality of life + ของช่วยบางอย่าง (supplies) เช่น ของกันตีบวกแตก (ต้องมี Play Billing + เซิร์ฟเวอร์ตรวจใบเสร็จก่อนเปิด) · v8.1.140 ต่อ AdMob + UMP แล้ว (โฆษณาทดสอบ) · ตอนปล่อย: `ADS_TEST=false`, `BETA_BUILD=false`, ตั้งข้อความ GDPR ใน AdMob
- GM (รหัส 1234) ปิดเองในแอปที่แพ็กไฟล์ (v8.1.67: เปิดเฉพาะ *.github.io / localhost:port) · **ตรวจว่า release ไม่ใช้ `server.url` ชี้ github.io** · ต้องมีเซิร์ฟเวอร์ตรวจใบเสร็จ/คะแนน

**กฎเจ้าของ**
- ไม่ต้องจำลองเล่น headless เพื่อจูนบาลานซ์ และไม่ต้องถ่ายภาพหน้าจอตรวจ UI — เจ้าของตรวจบนมือถือเอง (headless หาบั๊กได้)

## 6. เอกสาร
**อ่านก่อนเริ่มงาน: `docs/GAME_PILLARS.md` (เกมสนุกตรงไหน · เสาหลัก 3 ข้อ · cut list · ด่านตรวจของใหม่) + `docs/LAUNCH_RULES.md` กฎ 7 ข้อทางไปปล่อยเกม (เป้า Closed test ≤ 13 ธ.ค. · ระบบใหม่เฉพาะที่จำเป็น ไม่งั้นลง `docs/IDEAS.md` · ทุกเวอร์ชันเพิ่มรายการ "รอ QA" ในไฟล์นั้น) + `docs/LESSONS.md` บทเรียนของพวกเรา + กติกาทำงาน** (รวมงานเป็นรอบ · ของปลอมก่อนสั่งอาร์ต · ใบสั่งอาร์ตต้องบอกจุดต่าง · ตรวจทั้งกองก่อนเพิ่มการ์ด · งบหน่วยความจำเป็นกฎเหล็ก · ไม่แน่ใจให้ถามก่อน) · `docs/PLAYTEST_CASES.md` (feedback/บั๊กจากเครื่องจริง) · `docs/LANDSCAPE_FULLSCREEN_UI_KNOWLEDGE.md` · GDD/แผนรวมเป็น artifact เดิม (แก้ให้ publish ทับ)

## 7. เทส / build
**บอท QA หลายบุคลิก** `scripts/qa-bots.cjs` (GitHub Actions "QA Bots" รันทุกคืน 10 เครื่องพร้อมกัน · วิธีใช้ใน `docs/QA_CHECKLIST.md` ท้ายไฟล์) · `bash scripts/ci-checks.sh` (= ทุกอย่างที่ CI ตรวจ · ~3 นาที) ก่อน publish เสมอ · CI: job `deploy` (เทส+build ~1.5 นาที) ขึ้นเว็บเลย + job `visual` (ตรวจหน้าจอ 11 ชุด) รันคู่กันไม่บล็อก · push สาขา deploy กับ session พร้อมกันได้ · ลำดับปล่อยเวอร์ชันอยู่ใน skill release · เทสในเครื่อง `npx serve .` · เจ้าของทดสอบ flow/บาลานซ์/FPS บนมือถือเอง

## 8. คอนเวนชัน
- ทุกเวอร์ชัน: `scripts/bump-version.mjs` (bump `GAME_VERSION` + CHANGELOG + บล็อก Latest ใน `docs/DELIVERIES.md` + บรรทัด Latest ใน CLAUDE.md · บล็อกเก่าสุดไป CLAUDE_HISTORY)
- commit ภาษาอังกฤษ ไม่ใส่ชื่อรุ่นโมเดล · คุยกับเจ้าของภาษาไทย
- ข้อความในเกมเป็นภาษาอังกฤษล้วน (comment ไทยได้) · ใช้ `’` ใน single-quoted literal · ห้ามอักษรไทยใน string
