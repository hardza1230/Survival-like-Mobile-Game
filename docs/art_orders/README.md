# 🎨 Art Orders — ใบสั่งงานอาร์ตจริงแทนของชั่วคราว

โฟลเดอร์นี้คือ "สัญญา" ระหว่าง **AI ทำอาร์ต** กับ **AI เขียนโค้ด** ของ Mochi Mayhem
เกมตอนนี้ยังใช้ของชั่วคราว (ภาพวาดด้วยโค้ด canvas / อีโมจิ) ในหลายจุด — แต่ละไฟล์ในโฟลเดอร์นี้คือ 1 ชุดงาน

> ⚠️ เกมไม่มีไฟล์ `.svg` แล้ว (release gate ห้าม SVG) — ของชั่วคราวทั้งหมดเป็น canvas/อีโมจิ · ทุกชิ้นใหม่ต้องเป็น **PNG** (พื้นหลังทึบใช้ **WEBP/PNG** ได้)

## ลำดับการอ่าน
1. `00_STYLE_GUIDE.md` — สไตล์/สี/มุมมอง/กฎเทคนิค (**อ่านก่อนทุกชุด**)
2. **`14_REMAINING_ART.md` — งานที่เหลือทั้งหมด (v6.55.63) ← เริ่มที่นี่** · `NEXT_BATCH_REQUEST.md` = กติกาประหยัดโควต้า §0 (งานในไฟล์นั้นเสร็จแล้ว)
2b. **`NEXT_BATCH_REQUEST.md` — (เดิม) งานที่ต้องทำตอนนั้น (รวมเป็นแผ่นรวม ประหยัดโควต้า) ← เริ่มที่นี่**
3. ใบสั่งรายชุด (01–12) = สเปกละเอียดของแต่ละ key

> 💰 **กฎประหยัดโควต้า:** ห้ามสร้างทีละภาพถ้ารวมได้ — ไอคอน/ของในฉาก/แผ่น node/เฟรมอนิเมชัน ให้สร้างเป็น **แผ่นรวม (sheet) ครั้งเดียว** แล้วฝั่งโค้ดตัดเอง · ดูกติกาใน `NEXT_BATCH_REQUEST.md` §0

## ชุดงาน (Batch) และสถานะ
| # | ไฟล์ | เนื้อหา | จำนวน | ลำดับความสำคัญ | สถานะ |
|---|---|---|---|---|---|
| 01 | `01_FLOORS_SEAMLESS.md` | พื้นด่านแบบต่อขอบ C2-1…C3-5 | 10 | 🔴 สูงสุด (แก้ภาพแตก) | 🟩 ใส่เข้าเกมแล้ว v5.54 (webp ใน assets/art/floors) |
| 02 | `02_MAP_DECOR.md` | ของตกแต่งพื้นรายด่าน (เริ่ม C2-1) | 8/ด่าน | 🔴 | 🟩 C2-1 v5.54 · C2-2 v6.0.7 · C2-3…C3-5 v6.0.8 ใส่เข้าเกมครบแล้ว |
| 03 | `03_CH3_ENEMIES.md` | ศัตรู Chapter 3 (5 บทบาท) | 5 | 🟡 | 🟩 ชีตเดิน 4 เฟรมใส่เกมแล้ว v6.34 |
| 04 | `04_CH3_BOSSES.md` | มินิบอส 5 + บอส 5 ของ Chapter 3 | 10 | 🟠 | 🟩 action sheet 8 เฟรมครบ 10 ตัว ใส่เกม v6.0.0 |
| 05 | `05_TEMPLE_DIG.md` | มินิเกมขุดใต้วิหาร | 16 | 🟡 | 🟩 ใส่เข้าเกมแล้ว v5.67 (webp ใน assets/art/dig) |
| 06 | `06_ICONS_PERKS_RELICS.md` | ไอคอน Rank Perk / Ancient Perk / Relic | 26 | 🟡 | 🟩 ใส่เข้าเกมแล้ว v5.67 (การ์ด/แถว Relic, Rank Perks, Codex) |
| 07 | `07_KITCHEN_PARTS.md` | ไอคอนชิ้นส่วนสูตร Kitchen (WHEN/DO/TWIST) | 55 | 🟢 | 🟩 ใส่เข้าเกมแล้ว v6.0.9 |
| 08 | `08_PINNACLE_BOSS.md` | บอส Endgame "The Hunger Beneath" | 1 ชีต | 🟠 | 🟩 ใส่เข้าเกมแล้ว v6.34 |
| 09A | `09_MENU_UI.md` §9A | การ์ดเลือกด่าน 15 + ปก Chapter 3/Endgame | 17 | 🟠 | 🟩 ใส่เข้าเกมแล้ว (โหลดจาก assets/incoming/menu_stage_cards) |
| 09B | `09_MENU_UI.md` §9B | พื้นหลังหน้าเมนูทุกหน้า | 25 | 🟡 | 🟩 ใส่เข้าเกมแล้ว (โหลดจาก assets/incoming/menu_screens) |
| 09C/D | `09_MENU_UI.md` §9C-D | ปุ่ม Hub 6 + ไทล์เมนูย่อย 19 | 25 | 🟠 | 🟩 ใส่เข้าเกมแล้ว v5.67 (ปุ่ม Hub, ไทล์กลุ่ม, ปุ่ม Depths/Kitchen/Perks) |
| 10 | `10_ATLAS_MAP.md` | แผนที่ Atlas แบบเก่า | — | — | ❌ ยกเลิก (Mochi Delve v6.30 มาแทน → ใช้ 11) |
| 11 | `11_MOCHI_DELVE.md` | แผนที่ Mochi Delve (พื้น 5 รส + แผ่น node + Mochitopia + fog) | 15 | 🔴 | 🟩 ใส่เข้าเกมแล้ว v6.34 |
| 12 | `12_BIOME_SPICY.md` | Biome ในถ้ำ (พื้นต่อรส + ของในฉาก 5 รส) | 13 | 🔴 | 🟩 อาร์ตใส่เกมแล้ว v6.34 · กลไกมีแค่ Spicy |
| 13 | `13_DELVE_BOSSES.md` | บอส Delve ชั้น 10/20 + ของประกอบ | 3 | 🔴 | 🟩 ใส่เกมแล้ว v6.39 + กลไกครบ |
| C2-5 | `C2_5_ROOT_KNIGHT_ANIMATION.md` | Root Knight 16 เฟรม | 1 ชีต | — | 🟩 ใส่เข้าเกมแล้ว v6.0.54 |
| 14 | `14_REMAINING_ART.md` | **งานที่เหลือทั้งหมด:** อนิเมชันมอน Chapter 2 + Elite/Mini Jelly + อุปกรณ์ Chef + ไอคอนการ์ดสาย + VFX Unique ใหม่ | ~40 ชีต | 🔴 | ⬜ รอทำ ← เริ่มที่นี่ |

(อัปเดตคอลัมน์สถานะเป็น 🟨 กำลังทำ / ✅ ส่งแล้ว / 🟩 ใส่เข้าเกมแล้ว)

## 📁 ที่วางไฟล์ (สำคัญที่สุด — ทำให้งานต่อกันได้ไร้รอยต่อ)
```
assets/incoming/<batch>/            ← AI ทำอาร์ต วางไฟล์ "ส่งงาน" ที่นี่
    ├─ <key>.png                    ← ชื่อไฟล์ = key ตามตารางในใบสั่ง (ตัวพิมพ์เล็ก ตรงเป๊ะ)
    ├─ _preview.png                 ← (แนะนำ) รวมทุกชิ้นในแผ่นเดียวไว้ตรวจเร็ว
    └─ MANIFEST.md                  ← รายการไฟล์ + ขนาด + หมายเหตุ (template ด้านล่าง)
assets/art/<batch>/                 ← AI เขียนโค้ด ย้าย/ย่อ/ตรวจแล้วใส่ที่นี่ (ไฟล์ที่เกมโหลดจริง)
```
- `<batch>` = ชื่อโฟลเดอร์ที่**สร้างรอไว้แล้ว**: `floors`, `decor_c21` … `decor_c35`, `ch3_enemies`, `ch3_bosses`, `dig`, `icons`, `kitchen`, `pinnacle`, `menu_stage_cards`, `menu_screens`, `menu_buttons`, `delve`, `biomes`
- แต่ละโฟลเดอร์มี `.gitkeep` ไว้ให้โฟลเดอร์ว่างอยู่ใน git — ไม่ต้องลบ

### แผนที่ batch → ใบสั่ง → โฟลเดอร์
| batch | ใบสั่ง | วางไฟล์ส่งงาน | ไฟล์จริงในเกม |
|---|---|---|---|
| floors | 01 | assets/incoming/floors/ | assets/art/floors/ |
| decor_c21…decor_c35 | 02 | assets/incoming/decor_cXX/ | assets/art/decor_cXX/ |
| ch3_enemies | 03 | assets/incoming/ch3_enemies/ | assets/art/ch3_enemies/ |
| ch3_bosses | 04 | assets/incoming/ch3_bosses/ | assets/art/ch3_bosses/ |
| dig | 05 | assets/incoming/dig/ | assets/art/dig/ |
| icons | 06 | assets/incoming/icons/ | assets/art/icons/ |
| kitchen | 07 | assets/incoming/kitchen/ | assets/art/kitchen/ |
| pinnacle | 08 | assets/incoming/pinnacle/ | assets/art/pinnacle/ |
| menu_stage_cards | 09A | assets/incoming/menu_stage_cards/ | assets/art/menu_stage_cards/ |
| menu_screens | 09B | assets/incoming/menu_screens/ | assets/art/menu_screens/ |
| menu_buttons | 09C/9D | assets/incoming/menu_buttons/ | assets/art/menu_buttons/ |
| delve | 11 | assets/incoming/delve/ | assets/art/delve/ |
| biomes | 12 | assets/incoming/biomes/ | assets/art/biomes/ |
- **ห้ามแก้ไฟล์ใน `assets/` อื่น ๆ หรือ `game.js`** — ฝั่งอาร์ตวางแค่ใน `assets/incoming/`
- ถ้าอัปผ่าน GitHub มือถือ: อัปเข้า `assets/incoming/<batch>/` ได้เลย ชื่อไฟล์ต้องตรง key

### MANIFEST.md (template)
```
batch: floors
artist: <ชื่อ AI/เครื่องมือ>
date: YYYY-MM-DD
| key | file | size | alpha | note |
|---|---|---|---|---|
| bg6 | bg6.png | 1024x1024 | no | ทดสอบต่อ 2x2 แล้วไม่เห็นรอย |
```

## 🔁 ขั้นตอนฝั่ง AI เขียนโค้ด (เมื่อมีไฟล์ใน incoming)
1. ตรวจ: ชื่อตรง key · ขนาดตามสเปก · PNG มี alpha จริง (ถ้าสเปกบอกโปร่งใส) · ไม่มีพื้นเทา/หมากรุกฝังในภาพ
2. ย่อ/ครอปถ้าจำเป็น → ย้ายไป `assets/art/<batch>/`
3. เพิ่ม `key:'assets/art/<batch>/<key>.png'` ใน `ASSET_IMAGES` (path เต็มเสมอ — build-www คัดลอกเฉพาะ path ที่อ้าง)
4. ของชั่วคราวส่วนใหญ่ **ข้ามตัวเองอัตโนมัติ** เมื่อ key มีอยู่แล้ว (ระบุไว้ในแต่ละใบสั่งว่าชิ้นไหนต้องแก้โค้ดเพิ่ม)
5. `npm run check` + เทส headless + screenshot → อัปเดตสถานะในตารางนี้เป็น 🟩 · bump GAME_VERSION/CHANGELOG
6. ลบไฟล์ใน `assets/incoming/<batch>/` ที่ย้ายแล้ว (กัน repo บวม)

## ❓ ถ้าสเปกไม่ชัด
ฝั่งอาร์ตเขียนคำถามไว้ใน `MANIFEST.md` หัวข้อ `questions:` แล้วส่งตามที่คิดว่าดีที่สุด — ฝั่งโค้ดจะตอบ/ปรับให้
