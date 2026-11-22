# สรุปโปรเจกต์ Mochi Mayhem: FLAVORBOUND

ตรวจล่าสุด: **22 พฤศจิกายน 2026 (Asia/Bangkok)** · ตรวจกับโค้ดจริง
ฐานโค้ด: **v8.2.53** · `game.js` ~25.5k บรรทัด
สาขาหลัก/เผยแพร่: `claude/vampire-survival-mobile-game-yo9e8w` · เป้า **Closed test บน Google Play 13 ธ.ค.** (แพ็กเกจ `com.oheart.mochimayhem`)

## ขอบเขตปัจจุบัน

เกม survival-like มือถือแนวตั้ง Phaser 3 + Capacitor + GitHub Actions + GitHub Pages · Story **3 Chapter / 15 ด่าน**

| ส่วน | สถานะในโค้ด |
|---|---|
| Story | Rise from Below (0–4) · The Ferment Garden (5–9) · Throne of the First Seed (10–14) · ฉากการ์ตูน Ruby ด่าน 1–5 · ม่านชื่อด่านทุกด่าน |
| ฮีโร่ | 6 ตัว: momo, mint, cocoa, taro, yuzu, sesame (เสร็จทุกตัว · `HEROES_WIP=[]`) · 3 Build Path ต่อคน · สกิน Festival · Berry Core เก็บไว้รองรับเซฟเก่า |
| ภารกิจ | 23 แบบใน `WAVE_OBJECTIVES` · ภารกิจประจำด่าน 15 · แจกการ์ดก่อนเข้าด่าน + Reroll (ฟรี 1 / ดูโฆษณา 1) · ภารกิจสุ่มข้ามด่านหลังผ่าน Ch1 · Pact Relics · Mission Atlas |
| Endgame | Mochi Delve (Recipe Maps) · Rift · Pinnacle · ห้อง Trial/Siege/Domain · Boss Rush ซ่อน · Midnight Kitchen Endless เลิกแล้ว |
| ความก้าวหน้า | Gear + Merge · Affix Forge (150 catalog · 78 active / 72 planned · สกุล 3: Twist Cream / Star Sugar / Recipe Ink) · Flavor Weave & Rank + Rank Rewards · Talent ราย Build · Temple Expedition (idle · แทน Dig/Patrol) · Bazaar · Rewards (Login 30 วัน / Daily / Awards) · Codex |
| ปิด/ซ่อน | Kitchen (`KITCHEN_ON=false` v8.2.52) · Overcharge (ลบ) · Dig/Patrol (ลบ v8.2.36) |
| รายได้ | โฆษณา rewarded (AdMob + UMP · `ADS_TEST=true` ช่วงทดสอบ) · 🧶 Threads → ของแต่งตัว · ห้ามขายพลัง |
| QA | ปุ่ม 🐞 + ส่ง error อัตโนมัติ (`BETA_BUILD=true` → Supabase `qa_reports`) · บอท QA หลายบุคลิกรันทุกคืน (GitHub Actions) · `bash scripts/ci-checks.sh` |
| Cloud | Cloud Save (Google sign-in) · ทำเนียบ/Ranking |

สถานะในโค้ดไม่ได้ยืนยันว่าผ่านบาลานซ์/FPS บนมือถือทุกระบบ — เจ้าของทดสอบบนมือถือเอง รายการรอตรวจอยู่ที่ `docs/LAUNCH_RULES.md` (รอ QA)

## งานถัดไป (22 พ.ย.)

1. เจ้าของ QA มือถือตามรายการ "รอ QA" (`LAUNCH_RULES.md`) และเคสหมวด J ใน `PLAYTEST_CASES.md`
2. ECRS ก่อน Closed test (`ECRS.md`): รอบ 1 ทำแล้ว v8.2.52 · รอเลือกข้อ E ถัดไป
3. รอตัดสินใจ: Expedition แบบ idle เน้นวางแผน (`IDEAS.md`) · Seed Rift สั้นลง (CLAUDE.md §5)
4. รออาร์ต/เสียง: ใบ 92 · ใบ 93 · A20 (`STATUS.md` · `PENDING_ART_AUDIO_ORDERS.md`)
5. Closed test 13 ธ.ค. → เก็บตัวเลข D1/D7 → แก้ → Production (`ADS_TEST=false`, `BETA_BUILD=false`, ตรวจว่า release ไม่ใช้ `server.url`)

## Build / deployment

- ปล่อยเวอร์ชันด้วย skill `release` · ตรวจ run **Deploy Web (GitHub Pages)** + **Build Android APK** ทุกครั้ง
- Debug APK โหลดเกมจาก Pages (`server.url`) · release AAB (`release-aab.yml`) ลบ `server.url` และฝังไฟล์ในแอป · ขนาดแอปต้อง < 190 MB (`scripts/check-app-size.mjs`)
- Store listing ฉบับใช้จริง: `STORE_LISTING.md` · ภาพ `store/screenshots_v8_1/`

## ประวัติย่อ

เริ่ม repo 23 ส.ค. 2026 เวลา 07:45 น. ไทย; root commit dc61053 เวลา 08:32 น. เป็น Phaser prototype พร้อม joystick/dash, ศัตรู 3 แบบและ level-up 24 ส.ค. เริ่ม art pipeline; กันยายนเพิ่ม VFX, progression/equipment และ Android release infrastructure; 11 ต.ค. เข้า v7 พร้อม desktop controls/เสียง; 17 ต.ค. ถึง v7.8.55

ถึง 18 ต.ค. ผ่านมา **56 วันปฏิทิน** · ถึง 22 พ.ย. **91 วัน** (v8.2.53) GitHub ไม่ได้บันทึกชั่วโมงทำงานจริง ไม่มีเปอร์เซ็นต์ completion ที่รับรองจาก tests; ควรประเมินจาก acceptance ของรุ่นที่ต้องการปล่อย

## แหล่งอ้างอิงและวิธีอัปเดต

- Runtime: GAME_VERSION / CHANGELOG / CHAPTERS / STAGES / CHAR_ORDER ใน game.js
- Forge: [registry](../data/forge-mods.json), [rollout](FORGE_150_ROLLOUT.md), [single-screen](FORGE_SINGLE_SCREEN.md)
- ผู้พัฒนา: [CLAUDE](../CLAUDE.md), [workflow](AGENT_WORKFLOW.md), [handoff](HANDOFF_NEXT_AI.md), [สถานะอาร์ต/เสียง/QA](STATUS.md)
- ทิศทาง: [GAME_PILLARS](GAME_PILLARS.md), [LAUNCH_RULES](LAUNCH_RULES.md), [ECRS](ECRS.md), [IDEAS](IDEAS.md)
- Release: [signing](RELEASE_SIGNING.md), [store draft](STORE_LISTING.md)
- ประวัติ: [CLAUDE_HISTORY](CLAUDE_HISTORY.md), Git commit log

เมื่อ runtime เปลี่ยน ให้ปรับเลขเวอร์ชัน/วันอ้างอิงและส่วนที่เกี่ยวข้องใน README กับสรุปนี้ แยก implemented, QA pending และ deployed เสมอ เอกสารอย่างเดียวไม่ต้อง bump GAME_VERSION
