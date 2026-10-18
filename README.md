# 🍡 Mochi Mayhem: FLAVORBOUND

เกม **survival-like สำหรับมือถือแนวตั้ง** สร้างด้วย Phaser 3 + Capacitor ผู้พิทักษ์จาก Mochi Core ต่อสู้เพื่อกู้รสชาติให้โลก Mochitopia รองรับ Android และเว็บ รวมถึงคีย์บอร์ดบนคอมพิวเตอร์

> หนึ่งชีวิต สองร่าง: Core Form และ Awakened Fighter คือคนเดียวกัน
>
> สถานะเอกสาร: **18 ตุลาคม 2026 · โค้ดเกม v7.8.56** (ปรับสมดุล 18 ต.ค.) เกมอยู่ระหว่างพัฒนาและทดสอบบนมือถือ เลขเวอร์ชันใน `game.js` → `GAME_VERSION` เป็นแหล่งอ้างอิงหลัก

[เล่นบนเว็บ](https://hardza1230.github.io/Survival-like-Mobile-Game/) · [ดาวน์โหลด APK ทดสอบ](https://github.com/hardza1230/Survival-like-Mobile-Game/releases/download/latest/mochi-mayhem-debug.apk) · [GitHub Actions](https://github.com/hardza1230/Survival-like-Mobile-Game/actions) · [สรุปสถานะและงานถัดไป](docs/PROJECT_SUMMARY_TH.md)

## สิ่งที่มีในเกมปัจจุบัน

- **Story 3 Chapter รวม 15 ด่าน**: Rise from Below → The Ferment Garden → Throne of the First Seed พร้อมมินิบอส บอส และบทส่งท้าย
- **6 ฮีโร่ใน roster**: Strawberry/Momo, Mint, Cocoa, Taro, Yuzu และ Sesame แต่ละคนมี 3 Build Path, อาวุธประจำตัว, Unique และ Talent; Berry Core เก็บไว้รองรับข้อมูลเก่า แต่ไม่อยู่ใน roster ปัจจุบัน
- Endgame **Mochi Delve**, บอส Delve/Pinnacle, Boss Rush และ Midnight Kitchen Endless
- Gear, enhancement, Bazaar/Sugar Orders, Kitchen Recipe (WHEN → DO → TWIST), Temple Weave/Depths/Rank Perks, Daily และ Achievement
- **Affix Forge หน้าเดียว**: Power / Sustain / Playstyle & Utility มีแค็ตตาล็อก **150 ม็อด: ใช้งานจริง 78, วางแผนไว้ 72**; ม็อด planned ไม่อยู่ใน pool สุ่ม ดู [รายละเอียด Forge](docs/FORGE_150_ROLLOUT.md)
- Play Stats และ Combat Meter สำหรับเปรียบเทียบผลเล่นจริง; การส่ง Share Play Stats เป็นตัวเลือกและยังมีงาน backend ค้างตาม [checkpoint](docs/SESSION_HANDOFF.md)
- ภาพตัวละคร มอนสเตอร์ บอส เมนู และ VFX ต่อเข้า runtime แล้วหลายชุด; การมีไฟล์และโค้ดไม่ได้แปลว่าผ่าน visual/FPS QA บนมือถือทุกชุด

## อัปเดตล่าสุด

| เวอร์ชัน | สิ่งที่เปลี่ยน |
|---|---|
| v7.8.56 | C2-4 Seasonal Wisp ลด HP ฐาน 260 → 130; Spark ลดดาเมจต่อมินิบอส 15% รวม Static Charge/Storm Mark |
| v7.8.55 | C2-4 เปลี่ยนเป็น **Seasonal Harvest**: ฤดูเปลี่ยนทุก 10 วินาที เก็บ 12 กลีบต่อฤดูให้ครบ 4 ฤดู ไม่มีสอบตก; กลีบส่วนเกินจากฤดูที่เต็มช่วยเติมฤดูที่ขาด |
| v7.8.51–54 | ปรับการโดนเป้า/เลี้ยวของ Taro Spark, ดาเมจบอสของ Sentry และ Static Charge เป็น 40 hits ต่อ strike |
| v7.8.49–50 | ต่อ Temple Weave + Flavor Passives ครบ 34 ชิ้น ปรับสี แสง และ layout ให้พอดีจอเตี้ย |
| v7.8.45–46 | ต่อ Hero VFX ครบ 21/21 รวมไฟล์ Cocoa landing dust ที่อัปใหม่ครบแล้ว |
| v7.8.47–48 | Replay ใช้จำนวน kill เป็นเกณฑ์เรียกมินิบอส/บอส ไม่มี timer ข้าม progress |

ประวัติอัปเดตในเกมอยู่ที่ `CHANGELOG` ใน `game.js`; ประวัติพัฒนาเก่าอยู่ที่ [CLAUDE_HISTORY](docs/CLAUDE_HISTORY.md)

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

หลักฐานตรวจเมื่อ 18 ต.ค.: [APK ของ v7.8.55 build สำเร็จ](https://github.com/hardza1230/Survival-like-Mobile-Game/actions/runs/39042341016) แต่ [Pages ของสาขาหลักถูกยกเลิก](https://github.com/hardza1230/Survival-like-Mobile-Game/actions/runs/39042341134) และ [รันสาขาอื่นล้มเหลว](https://github.com/hardza1230/Survival-like-Mobile-Game/actions/runs/39042552545) จึงยังไม่ยืนยันว่าเว็บ live เป็น v7.8.55 จากผลเหล่านี้

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
| `docs/PROJECT_SUMMARY_TH.md` | สถานะระบบ ลำดับงานและข้อจำกัดปัจจุบัน |
| `docs/art_orders/README.md` | ดัชนีใบสั่งอาร์ตและสถานะส่ง/ต่อเข้าเกม |
| `AGENTS.md`, `CLAUDE.md`, `docs/SESSION_HANDOFF.md` | กติกาทำงานและ checkpoint สำหรับผู้พัฒนาต่อ |

`www/`, `android/` และ `node_modules/` สร้างตอน build ไม่ commit; `build-www.mjs` คัดลอกเฉพาะ runtime assets ที่อ้างอิงและสร้าง `version.json` จากเกม

## งานถัดไป

1. ตรวจ deployment สาขาหลักและยืนยันเวอร์ชันเว็บ live
2. เจ้าของทดลอง C2-4 Seasonal Harvest และเทียบ Taro Arc / Spark / Sentry ด้วย Combat Meter
3. ตรวจ Temple Weave/Passives และ VFX ล่าสุดบนมือถือ: ความอ่านง่าย ขอบจอ การแตะ และ FPS
4. จูน Story ทั้ง 3 Chapter, economy/Forge และ Endgame จากผลเล่นจริง
5. งาน Play Store พักไว้ตามแผนเดิม: ยืนยัน signed AAB, account deletion/privacy/data safety, listing และการทดสอบก่อนเผยแพร่

## จุดเริ่มต้น

สร้าง repository **23 สิงหาคม 2026 เวลา 07:45 น. (ไทย)**; [คอมมิตต้นแบบแรก](https://github.com/hardza1230/Survival-like-Mobile-Game/commit/dc610539d72919d7d9f1efd616fa6dd97cbdf9a7) เวลา 08:32 น. วันเดียวกัน ถึงวันที่ตรวจเอกสารนี้ผ่านมา 56 วัน เป็นเวลาปฏิทิน ไม่ใช่ชั่วโมงทำงานสะสม
