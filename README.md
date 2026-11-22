# 🍡 Mochi Mayhem: FLAVORBOUND

เกม **survival-like สำหรับมือถือแนวตั้ง** สร้างด้วย Phaser 3 + Capacitor ผู้พิทักษ์จาก Mochi Core ต่อสู้เพื่อกู้รสชาติให้โลก Mochitopia รองรับ Android และเว็บ รวมถึงคีย์บอร์ดบนคอมพิวเตอร์

> หนึ่งชีวิต สองร่าง: Core Form และ Awakened Fighter คือคนเดียวกัน
>
> สถานะเอกสาร: **22 พฤศจิกายน 2026 · โค้ดเกม v8.2.53** · กำลังเตรียม Closed test บน Google Play (เป้า 13 ธ.ค.) · เวอร์ชันล่าสุดและรายละเอียดดู `CLAUDE.md` บรรทัด Latest delivery

[เล่นบนเว็บ](https://hardza1230.github.io/Survival-like-Mobile-Game/) · [ดาวน์โหลด APK ทดสอบ](https://github.com/hardza1230/Survival-like-Mobile-Game/releases/download/latest/mochi-mayhem-debug.apk) · [GitHub Actions](https://github.com/hardza1230/Survival-like-Mobile-Game/actions) · [สรุปสถานะและงานถัดไป](docs/PROJECT_SUMMARY_TH.md)

## สิ่งที่มีในเกมปัจจุบัน

- **Story 3 Chapter รวม 15 ด่าน** (Rise from Below → The Ferment Garden → Throne of the First Seed) แต่ละด่านมี **ภารกิจประจำด่าน** + การ์ดภารกิจที่แจกก่อนเข้าด่าน (Reroll ได้) · มินิบอส · บอสพร้อมฉากเรื่อง/เสียงพากย์
- **6 ฮีโร่** Strawberry/Momo · Mint · Cocoa · Taro · Yuzu · Sesame (เสร็จครบทุกตัว) คนละ 3 Build Path + Unique + Talent ราย Build · สกิน Festival
- ภารกิจ 23 แบบ (เช่น Hunger Crack แบบ Abyss, Escort the Wisp, Hunger Herald, Seed Rift, Frozen Pantry) · Pact Relics · Mission Atlas
- **Endgame:** Mochi Delve (Recipe Maps) · Rift · Pinnacle Boss · ยิ่งลึกยิ่งยาก ยิ่งได้ของดี (Boss Rush ซ่อนไว้)
- **ความก้าวหน้า:** Gear + Merge + Affix Forge (สกุล 3 ตัว: Twist Cream · Star Sugar · Recipe Ink) · Flavor Weave & Rank + Rank Rewards · Temple Expedition (idle) · Bazaar · Rewards (Login 30 วัน / Daily / Awards) · Codex (Recipe Book / Bestiary)
- **บริการ:** Cloud Save (Google) · โฆษณา rewarded แบบทดสอบ (`ADS_TEST=true`) · ปุ่ม 🐞 รายงานบั๊ก/ส่ง error อัตโนมัติ (`BETA_BUILD=true` → Supabase `qa_reports`) · บอท QA เล่นอัตโนมัติทุกคืน
- ระบบที่ซ่อน/เลิกแล้ว: Kitchen (ซ่อน v8.2.52) · Dig/Patrol (→ Expedition v8.2.32) · Overcharge · Midnight Kitchen Endless

## อัปเดตล่าสุด

ดู `CLAUDE.md` (Latest delivery) และ `docs/DELIVERIES.md` (2 รุ่นล่าสุดแบบเต็ม) · ประวัติในเกมอยู่ที่ `CHANGELOG` ใน `game.js` · ประวัติเก่า [CLAUDE_HISTORY](docs/CLAUDE_HISTORY.md)

| ช่วง | สิ่งที่เปลี่ยน |
|---|---|
| v8.2.52–53 | ECRS รอบ 1: ซ่อน Kitchen · สกุล Forge 5 → 3 · Sesame นับเป็นฮีโร่ที่เสร็จแล้ว |
| v8.2.44–51 | Hunger Crack แบบ Abyss + หลุมสุดท้ายมอนเต็ม · มอนค่อย ๆ โผล่ · ขวดพิษ Hunt โยนโค้ง · โดม Wisp · แก้กด Start/Reroll · แก้มอนล่องหน |
| v8.2.32–34 | Temple Expedition แทน Dig + Patrol (อาร์ตใบ 91 + เสียง A19) |

## การควบคุม

- มือถือ: ลากจอยสติ๊กเพื่อเดิน ใช้ปุ่ม Dash และ Unique บน HUD; Unique บางสายต้องกดค้างแล้วปล่อย ดูคำแนะนำ TAP/HOLD ในเกม
- อาวุธหลักโจมตีอัตโนมัติ เก็บ EXP และเลือกอัปเกรดระหว่างรัน
- คอมพิวเตอร์: WASD/ลูกศรเดิน, Space/Shift แดช, E/J ใช้ Unique, F สลับ Cocoa Flicker, Esc/P หยุดเกม, 1–4 เลือกการ์ด
- คอมพิวเตอร์แสดงเกมในกรอบแนวตั้ง 9:16; ข้อความที่ผู้เล่นเห็นในเกมเป็นภาษาอังกฤษ

## รันและตรวจงานในเครื่อง

ใช้ Node.js 22 สำหรับ workflow Android; Pages workflow ปัจจุบันใช้ Node.js 20

```sh
npm install
npm run check
npm run build:www
python3 -m http.server 8080 --directory www
```

เปิด http://localhost:8080/ หรือใช้ `npx serve .` เพื่อดู source โดยตรง การตรวจอัตโนมัติครอบคลุม syntax, content/balance contracts, asset และ regression หลายระบบ แต่ยังต้องเล่นบนมือถือจริงเพื่อยืนยันความสนุก สมดุล การแตะ และ FPS

## Android, เว็บ และการอัปเดต

| รูปแบบ | วิธีทำงาน | ใช้สำหรับ |
|---|---|---|
| Debug APK | Capacitor โหลดเกมจาก GitHub Pages ตาม `server.url` | ทดสอบ; อัปเดตเกมหลัง Pages deploy สำเร็จ ส่วนการเปลี่ยน native shell อาจต้องลง APK ใหม่ |
| เว็บ / PWA | GitHub Pages พร้อม service worker cache | เล่นผ่านเบราว์เซอร์; cache อาจทำให้ยังเห็นรุ่นเก่า ต้องตรวจเลขเวอร์ชัน |
| Signed AAB | Release workflow ลบ `server.url` แล้ว bundle เกมในแอป | เตรียมขึ้น Play Store; ต้องมี signing และทดสอบ release จริง ไม่ใช้ live update จาก Pages |

### รับ APK ทดสอบ

1. ใช้ลิงก์ APK ด้านบน หรือ Actions → **Build Android APK** → เลือกรันที่สำเร็จ → artifact `mochi-mayhem-debug-apk`
2. แตก ZIP แล้วติดตั้ง `mochi-mayhem-debug.apk` บน Android
3. Workflow บนสาขาหลักของเกมอัปเดต rolling release `latest`; tag `v*` สร้าง release แยกรุ่น

### เผยแพร่เว็บ

สาขาที่ใช้จริงคือ **`claude/vampire-survival-mobile-game-yo9e8w`** เท่านั้น แม้ workflow จะ trigger จากสาขาอื่น แต่ environment ปัจจุบันไม่ยอมให้สาขาอื่น deploy และรันเหล่านั้นอาจยกเลิกรันหลักผ่าน concurrency group เดียวกัน

ตั้ง Settings → Pages → Source: GitHub Actions แล้วตรวจ **Deploy Web (GitHub Pages)** ของสาขานี้จนสำเร็จ ก่อนอ้างว่าเว็บ/แอป live อัปเดต ตรวจ `version.json` ของเว็บเทียบกับ `GAME_VERSION` เสมอ

ทุกครั้งที่ปล่อยเวอร์ชัน ตรวจว่า run **Deploy Web (GitHub Pages)** และ **Build Android APK** ของสาขานี้สำเร็จก่อนบอกว่า live (ขั้นตอนอยู่ใน skill `release`)

ขั้นตอน signed release: [RELEASE_SIGNING](docs/RELEASE_SIGNING.md) · ร่างข้อมูลสโตร์: [STORE_LISTING](docs/STORE_LISTING.md)

## โครงสร้างและเอกสาร

| ที่อยู่ | หน้าที่ |
|---|---|
| `game.js` | Runtime เกม, `GAME_VERSION`, `CHANGELOG`, คอนเทนต์และระบบหลัก |
| `index.html`, `phaser.min.js` | หน้าเริ่มเกมและเอนจิน Phaser ที่เก็บใน repo |
| `assets/art/`, `assets/vfx/`, `assets/gear/` | ตัวอย่างที่เก็บภาพ runtime; ใช้ path ที่ลงทะเบียนจริงในเกมเป็นหลัก |
| `assets/incoming/` | ต้นฉบับอาร์ต, manifest, prompts และหลักฐาน QA |
| `data/forge-mods.json` | แค็ตตาล็อก Forge และสถานะ active/planned |
| `scripts/`, `tests/` | Build, packing, validation และ regression |
| `capacitor.config.json`, `.github/workflows/` | Native shell และ workflow APK / Pages / AAB |
| `docs/PROJECT_SUMMARY_TH.md` · `docs/STATUS.md` | ภาพรวมระบบ · สถานะอาร์ต/เสียง/QA ปัจจุบัน |
| `docs/art_orders/README.md` | ดัชนีใบสั่งอาร์ตและสถานะส่ง/ต่อเข้าเกม |
| `AGENTS.md`, `CLAUDE.md`, `docs/HANDOFF_NEXT_AI.md` | กติกาทำงานและ checkpoint สำหรับผู้พัฒนาต่อ |
| `docs/GAME_PILLARS.md` · `docs/LAUNCH_RULES.md` · `docs/ECRS.md` | เสาหลักของเกม · กฎทางไปปล่อยเกม · แผนลดระบบ |

`www/`, `android/` และ `node_modules/` สร้างตอน build ไม่ commit; `build-www.mjs` คัดลอกเฉพาะ runtime assets ที่อ้างอิงและสร้าง `version.json` จากเกม

## งานถัดไป

1. เจ้าของ QA บนมือถือตามรายการ "รอ QA" ใน `docs/LAUNCH_RULES.md`
2. ECRS ก่อน Closed test (`docs/ECRS.md`) — รอเจ้าของเลือกข้อถัดไป
3. รออาร์ต/เสียง: ใบ 92 · ใบ 93 · A20 (`docs/STATUS.md`)
4. รอตัดสินใจ: Expedition แบบ idle วางแผน · Seed Rift สั้นลง
5. Closed test 13 ธ.ค. → ดูตัวเลขผู้เล่น (D1/D7) → แก้ → Production (`ADS_TEST=false` · `BETA_BUILD=false`)

## จุดเริ่มต้น

สร้าง repository **23 สิงหาคม 2026 เวลา 07:45 น. (ไทย)**; [คอมมิตต้นแบบแรก](https://github.com/hardza1230/Survival-like-Mobile-Game/commit/dc610539d72919d7d9f1efd616fa6dd97cbdf9a7) เวลา 08:32 น. วันเดียวกัน ถึงวันที่ตรวจเอกสารนี้ผ่านมา 56 วัน เป็นเวลาปฏิทิน ไม่ใช่ชั่วโมงทำงานสะสม
