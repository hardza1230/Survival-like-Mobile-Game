# สรุปโปรเจกต์ Mochi Mayhem

อัปเดตล่าสุด: **v4.47.0 — Production Raster Pickups & Training Ground**
เทคโนโลยี: Phaser 3 + Capacitor + GitHub Actions + GitHub Pages

## สถานะปัจจุบัน

- เกม survival-like สำหรับมือถือแนวตั้ง เล่นได้ครบ **10 ด่าน**: Chapter 1 จำนวน 5 ด่าน และ Chapter 2 จำนวน 5 ด่าน
- ตัวละครเล่นได้ 6 คน พร้อม basic attack/อาวุธประจำตัว, Character Mastery, level-up upgrades และ Unique Skill
- ระบบเมตาหลักพร้อม: equipment, item level/affix, crafting currencies, enhancement, gacha, Daily, Achievement, Bestiary, Ascension และ Midnight Kitchen Endless
- Affix Forge ใช้ flow 3 ขั้น Gear → Affix → Roll, มีรูเล็ตสามช่องที่ชะลอก่อนล็อกผล, random pool 15 ม็อด แยก Offense/Defense/Utility, ผลก่อน→หลัง และยืนยันซ้ำก่อนทำลาย affix
- บอสทุกตัวมี phase transition แบบอมตะชั่วคราวเพื่อป้องกัน burst damage ข้ามเฟส
- Cloud Save ใช้ Supabase โดยเริ่มจาก anonymous session และสามารถเชื่อม Google เพื่อสำรอง/เล่นข้ามเครื่อง

## Chapter 2 — The Ferment Garden

| ด่าน | Field rule | มินิบอส | บอส | สถานะ |
|---|---|---|---|---|
| C2-1 Fermented Canopy | Poison bloom sources | Sporewarden Mantis | Rootmother's Bud | พร้อมเล่น |
| C2-2 Mycelium Marsh | Moving clean-air ring | Fungal Juggernaut | Mycelium Behemoth | พร้อมเล่น |
| C2-3 Nectar Hive | Protect nectar flowers | Royal Stinger | Ferment Hornet Queen | พร้อมเล่น |
| C2-4 Four-Season Conservatory | Rotating seasons | Season Keeper | Chronobloom Orchid | พร้อมเล่น |
| C2-5 Root Throne | Break Crown Roots | Ancient Root Knight | The True Rootmother | พร้อมเล่น |

C2-5 มีเวฟครบ 5 ช่วง, objective Crown Root 4 จุด, Throne Pulse/Crown Recall, ศัตรู 7 บทบาท, บอส 4 เฟสที่ 75%/42%/18% และ epilogue ปิด Chapter 2

## สถานะงานภาพ

- Character, equipment, currency, Chapter 1 และ Chapter 2 ใช้ raster art จริงแทน placeholder หลักแล้ว
- v4.44.0 เปลี่ยน seasonal/root enemy atlas และบอส C2-2 ถึง C2-5 เป็น PNG โปร่งใสชุดใหม่ เพราะไฟล์เดิมมี PNG stream เสีย
- Sprite atlas ใหม่จัดเป็นเซลล์ 256×256, ground line สม่ำเสมอ, silhouette และสีบทบาทอ่านง่ายบนจอมือถือ
- `npm run check` ตรวจ syntax, content contracts, PNG signature/chunk CRC/image stream และ balance contracts ก่อน build
- v4.45.0 เพิ่มฉากหลังห้องคราฟต์และปรับลำดับภาพ/ข้อมูลของ Affix Forge สำหรับมือถือ
- v4.46.0 เพิ่มจังหวะลุ้นแบบรูเล็ตก่อนเปิดผล และเพิ่มม็อดที่มีผลจริงอีก 6 แบบพร้อมสีหมวดที่อ่านง่าย
- v4.47.0 เปลี่ยน pickup 8 ชิ้นและพื้น Training Ground จาก SVG เป็นงาน PNG raster จริง พร้อม release gate ตรวจขนาด, alpha, การ decode และการผูกไฟล์ในเกม

## Build และ Release

- `Build Android APK` สร้าง debug APK สำหรับทดสอบ
- `Deploy Web (GitHub Pages)` อัปเดตเกมที่ APK wrapper โหลดเมื่อเปิดแอป
- `Release Signed AAB` พร้อมใช้งานหลังตั้ง keystore และ GitHub Secrets ตาม `docs/RELEASE_SIGNING.md`
- Store listing draft อยู่ที่ `docs/STORE_LISTING.md`; ยังต้องทำ Feature Graphic, screenshots และกรอกแบบฟอร์ม Play Console

## งานที่เหลือ

1. เล่น Chapter 2 แบบ full run บนมือถือจริงใน Normal/Hard/Hell
2. จูน win rate, reward/gear progression, cutscene duration และ telegraph จากผล playtest
3. ตรวจ FPS และ memory บน Android ระดับล่าง/กลาง โดยเฉพาะ C2-4 และ C2-5
4. ทำ release keystore, ทดสอบ Signed AAB และเตรียม Play Store assets/forms

รายละเอียด implementation ล่าสุดดู `CLAUDE.md`; เช็กลิสต์ C2-5 ดู `docs/C2_5_QA.md`
