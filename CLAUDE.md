# Version line

Current release: **8.3.25**. Next release:8.3.26. Fetch the deploy branch before new work.

Latest delivery: **v8.3.25 — Vault Altar curse popup with frozen time, bigger Grandma’s Pot ring** · full notes of the last 2 releases: `docs/DELIVERIES.md` · older: `docs/CLAUDE_HISTORY.md`

## 1. โปรเจกต์
Mochi Mayhem — เกมมือถือ survival-like ธีมโมจิน่ารัก เป้าหมาย Google Play · เจ้าของทำงานบนมือถือ เป็นผู้กำกับ ให้ AI เขียนโค้ดทั้งหมด

## 2. กฎเจ้าของ + การตัดสินใจที่ล็อกแล้ว (อย่าเปลี่ยนโดยไม่ถาม)
- **คุยกับเจ้าของเป็นภาษาไทยเสมอ (26 พ.ย.):** ทุกคำตอบ คำถาม สรุป และตัวเลือกใน AskUserQuestion ต้องเป็นภาษาไทย (ชื่อไฟล์/โค้ด/คีย์ใช้อังกฤษได้) · ข้อความในเกมและ commit ยังเป็นอังกฤษตาม §8
- **ถามตอบก่อนแก้ (26 พ.ย.):**
  1. สรุปกลับสั้น ๆ ว่าเข้าใจอะไร จะเปลี่ยนอะไร และใช้ตัวเลขอะไร
  2. จุดไม่ชัดให้ถาม 1–4 ข้อพร้อมตัวเลือก (AskUserQuestion) → รอยืนยัน → แล้วค่อยแก้และปล่อย
  3. ห้ามเดาตัวเลขหรือดีไซน์เอง
  4. **บอกข้อดี–ข้อเสียก่อนให้เจ้าของตัดสินใจ (26 พ.ย.):** ทุกข้อเสนอหรือทางเลือก ต้องบอกว่าได้อะไร เสียอะไร กระทบระบบไหน และความเสี่ยงคืออะไร พร้อมคำแนะนำ 1 ทาง
  5. **ยกเว้น (ทำเลย):** บั๊กชัดเจน · ผูกอาร์ต/เสียงตามใบสั่ง · คำสั่งที่ระบุตัวเลขหรือวิธีแล้ว · งานเอกสาร
- **เปลี่ยนแค่อาร์ต ไม่เปลี่ยนโครงเกม (27 ต.ค. · แก้ 18 พ.ย.):**
  - เก็บโครงหน้า ตำแหน่งปุ่ม เส้นทาง และระบบไว้ตามเดิม
  - อาร์ตเปลี่ยนหรือสั่งใหม่ได้ ถ้าดีกว่าและเข้าธีม
  - จะเปลี่ยนโครงหน้าหรือระบบ ต้องมีคำขอจากเจ้าของ
- **ฟีเจอร์และเป้าหมาย:** เพิ่มฟีเจอร์ได้ (17 พ.ย.) แต่เสนอแผนให้เจ้าของอนุมัติทุกรอบ · เป้า Closed test **13 ธ.ค.** · ระบบใหม่เฉพาะที่จำเป็น ที่เหลือลง `docs/IDEAS.md`
- **กฎเหล็ก: ยิ่งยาก รางวัลยิ่งดี:** Story มีระดับเดียว · endgame ยากตามความลึก Delve (`delveLoot`) · Boss Rush ซ่อน
- **ผู้เล่นแบบผสม:** ต้นเกมง่ายน่ารัก · ระบบลึกค่อยเปิดหลัง Chapter 2–3 · **ห้ามเพิ่มภาระช่วงต้น**
- **เสียงใช้ ElevenLabs ตามใบสั่งเท่านั้น:** ห้ามใช้เสียงสร้างด้วยโค้ดหรือ Runway · ใบสั่งอาร์ตใช้ skill art-order · ใบสั่งเสียงอยู่ `docs/audio_orders/`
- **รายได้ (`docs/LAUNCH_RULES.md` กฎ 4):** **ห้ามขายพลัง**
  - ช่วงทดสอบใช้โฆษณา rewarded
  - เงินจริงซื้อ 🍭 Lollipops ใช้ได้กับของแต่งตัวและ Pass เท่านั้น
  - 🧶 Thread ได้จากการเล่นเท่านั้น ห้ามขาย
  - QoL และ supplies ขายได้ หลังมี Play Billing + เซิร์ฟเวอร์ตรวจใบเสร็จ
- **ไม่ต้องรัน headless หรือถ่ายภาพหน้าจอ:** ไม่ต้องจูนบาลานซ์ด้วย headless และไม่ต้องตรวจ UI ด้วยภาพหน้าจอ เจ้าของตรวจบนมือถือเอง (headless ใช้หาบั๊กได้)
- **เลิก/ซ่อนแล้ว อย่าทำงานให้:** ดู `docs/STATUS.md` · งานรอ QA และรอตัดสินใจก็อยู่ที่ไฟล์นั้น

## 3. โครงไฟล์
- **โค้ดเกมอยู่ใน `src/NN-*.js`:** 23 ไฟล์ แผนที่อยู่ที่ `src/README.md` · **แก้ที่ src แล้วรัน `npm run build:game`**
  - `game.js` สร้างจาก src และ commit ไว้ · ห้ามแก้ตรง (check, CI และ hook จะล้มถ้าไม่ตรงกัน)
  - `index.html` โหลด `phaser.min.js` 3.80.1 + `game.js`
- **asset:** ไฟล์อยู่ใน `assets/` · คีย์อยู่ใน `ASSET_IMAGES` / `ASSET_SHEETS` / `ASSET_FX` / `ASSET_AUDIO` / `TEMPLE_UI`
  - URL ต้องเขียนเป็น literal `'assets/…'` เพราะ build-www คัดลอกเฉพาะที่เจอ
  - อาร์ตใหม่: `assets/incoming/<batch>/` → `scripts/pack-*.py` → `assets/art/<batch>/` (skill wire-art)
- **โหลดอาร์ตใหม่แบบ lazy เสมอ (stage/menu/hero) ห้าม boot:** งบ GPU ตอนบูตเต็มแล้ว (~300 MB)
- **ขนาดแอป < 190 MB (ไฟล์หลัก Play ≤ 200 MB):**
  - มาตรฐานแพ็ก (wire-art §2b): WebP q80 (q75 ถ้า > 150 KB) · ความละเอียด ≤ 2× ขนาดบนจอ · เพลง 64k · เสียงพูด 48k โมโน · SFX 64k โมโน
  - ตรวจด้วย `python3 scripts/compress-assets.py --dry` · หน้า `*-review.*` ไม่ใส่ในแอป
- **build และ deploy:**
  - `scripts/build-www.mjs` → `www/` (esbuild minify)
  - `pages.yml` deploy GitHub Pages (เป็น live update ของ debug APK)
  - `android.yml` = debug APK (live update) + job `store` = **APK แบบแอป Play Store** (ฝังไฟล์ในแอป · release `store-apk-latest` · เช็กเวอร์ชันใหม่เอง) · เห็นภาพสำรองในตัวนี้ = ไม่มีอาร์ตจริง
  - `release-aab.yml` = signed AAB (`docs/RELEASE_SIGNING.md`)
- **เอกสาร:** ใบสั่งอาร์ต `docs/art_orders/` (README = ตารางสถานะ) · เนื้อเรื่อง `docs/LORE.md`, `docs/STORY_CANON.md` · `docs/HANDOFF_NEXT_AI.md` · โน้ตเทคนิคยุคแรกอยู่ใน `docs/CLAUDE_HISTORY.md`

## 4. บั๊กที่เคยเจอ (กันพลาดซ้ำ)
- Scale.RESIZE คืน logical CSS px แล้ว — อย่าคูณ/หาร DPR เอง ใช้ `config.resolution=RENDER_DPR`
- scrollFactor(0) ไม่รับ camera zoom → UI ใช้ sf1 · `camera.ignore(group)` เป็น snapshot → ต้อง `this.camWorld(obj)` ทุกครั้งที่ spawn
- shape `setInteractive()` กดไม่ติดบนมือถือ → ใช้ tap zone ตรวจพิกัดเอง (`_zone` / `tapZones`)
- pool เต็ม → `getFirstDead` คืน null → ต้อง guard ทุกครั้ง
- `physics.world.timeScale` กลับด้าน (มาก = ช้า): gameSpeed ใช้ `1/s`, hitStop ใช้ค่ามาก
- Graphics ใน vm test stub อาจไม่มี `fillRect`/`setVisible`/`once` → ใช้ optional call หรือ property

## 5. ก่อนขึ้น Google Play
- **Closed test (เจ้าของเลือก 17 พ.ย.):** 8.2.0 คือแอปแรกที่ส่ง Closed test
  - ใช้ `ADS_TEST=true` + `BETA_BUILD=true` (ปุ่ม 🐞 + ส่ง error อัตโนมัติ)
  - ตอนขึ้น Production ให้ตั้ง `ADS_TEST=false`, พิจารณา `BETA_BUILD`, ตั้งข้อความ GDPR ใน AdMob
- **release AAB ต้องไม่มี `server.url`:** สคริปต์ลบให้เองแล้ว แต่ต้องตรวจว่า release ไม่ชี้ github.io
- **GM (รหัส 1234):** เปิดเฉพาะ *.github.io / localhost:port
- **ภาพ/เสียงสำรอง (fallback):** มีไว้กันพังตอน dev ผ่านเว็บ · แอป Play Store แพ็กไฟล์ในเครื่อง
- **ยังต้องมี:** เซิร์ฟเวอร์ตรวจใบเสร็จและคะแนน

## 6. เอกสารที่ต้องอ่านก่อนเริ่มงาน
- `docs/GAME_PILLARS.md` — เสาหลัก 3 ข้อ, cut list, ด่านตรวจของใหม่
- `docs/LAUNCH_RULES.md` — กฎ 7 ข้อทางไปปล่อยเกม
- `docs/LESSONS.md` — บทเรียนและกติกาทำงาน
- `docs/STATUS.md` — งานรอ QA / รออาร์ต / รอตัดสินใจ
- อื่น ๆ: `docs/PLAYTEST_CASES.md` · `docs/QA_PENDING.md` (รายการรอ QA รายเวอร์ชัน) · GDD/แผนรวมเป็น artifact เดิม (แก้ให้ publish ทับ)

## 7. เทส / build
- **ก่อน publish รัน `bash scripts/ci-checks.sh` เสมอ:** เท่ากับทุกอย่างที่ CI ตรวจ ใช้เวลาประมาณ 3 นาที
- **`npm run check` พิมพ์เฉพาะเทสที่ล้ม:** ถ้าผ่านหมดจะเหลือบรรทัดสรุป (`scripts/run-checks.mjs`) · เทสใหม่ให้ต่อท้าย `"check:tests"` ใน package.json · `CHECK_VERBOSE=1` ดูผลทั้งหมด
- **ลำดับปล่อยเวอร์ชัน:** skill release · CI job `deploy` ขึ้นเว็บ + job `visual` รันคู่กัน
- **บอท QA:** `scripts/qa-bots.cjs` รันทุกคืน (`docs/QA_CHECKLIST.md`)

## 8. คอนเวนชัน
- **ทุกเวอร์ชันใช้ `scripts/bump-version.mjs`:** แก้ `GAME_VERSION` และ CHANGELOG ใน src แล้ว rebuild · อัปเดตบล็อก Latest ใน `docs/DELIVERIES.md` และบรรทัด Latest ใน CLAUDE.md · บล็อกเก่าสุดย้ายไป CLAUDE_HISTORY
- **ภาษา:** commit ภาษาอังกฤษ ไม่ใส่ชื่อรุ่นโมเดล · คุยกับเจ้าของภาษาไทย
- **ข้อความในเกมเป็นภาษาอังกฤษล้วน:** comment ไทยได้ · ใช้ `’` ใน single-quoted literal · ห้ามอักษรไทยใน string
