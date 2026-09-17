# 🍫🐻 ใบสั่งงานอาร์ต — ตัวละครช็อกโกแลต (โกโก้ · Bear Core Combo)

> โกโก้เป็นสายหมัดประชิด (Bear Core Combo) + ท่าไม้ตาย Flicker Strike วาร์ปฟันรัว
> ต้องการ **2 ไฟล์**: ชีตท่า (action sheet) + ชีตวิ่ง (run atlas) — และต้องมี **ท่าออกหมัด/ต่อยคอมโบ**
> ทำแบบเดียวกับมิ้นต์ · เมื่อได้อาร์ตจริงอัปโหลด `assets/incoming/characters/` แล้วบอก Claude ตัดลง `assets/`

---

## 0. คอนเซ็ปต์ตัวละคร
- ชื่อในเกม: **โกโก้ (Chocolate)** — บทบาท "จอมพลังแนวหน้า" หมีช็อกโกแลตทุบหนัก ยืนแลกได้
- ธีม: หมีโมจิช็อกโกแลต โทน **น้ำตาลช็อกโกแลต + ครีม + ม่วงอุ่นเรือง** (สีพลัง Flicker = ม่วง #9f6bff)
- อาวุธ: **ถุงมือ/กำปั้นตราหมี (Bear Gauntlet)** — ต่อยหมัดหนัก มีพลังม่วงที่หมัด
- สไตล์: 2.5D confectionery fantasy เส้นสะอาด เงานุ่ม แก้มชมพูจาง ตาโต ป้อม ๆ น่ารักแต่ดูแข็งแรง (เข้าชุด Strawberry/มิ้นต์)
- สัดส่วน: หัวโต ~2 หัว ตัวกลมล่ำ อ่านชัดบนมือถือเล็ก

## ⚠️ สเปกเทคนิคที่ต้องเป๊ะ (ไม่งั้นเกมตัด/แสดงเพี้ยน)
- **พื้นโปร่งใสสนิท** (transparent RGBA) ทุกไฟล์ — ห้ามพื้นดำ/ขาว/สี/เช็คเกอร์บอร์ด
- ตัวละครวาง **กึ่งกลางเซลล์** เท่ากันทุกเฟรม + **สเกลตัวเท่ากันทุกเฟรม** (ชีตท่า/ชีตวิ่งขนาดตัวต้องเท่ากัน)
- เท้ายืนระดับเดียวกันทุกเฟรม (baseline ล่างตรงกัน)
- หันหน้า **ไปทางขวา** (เกม flip เองเวลาเดินซ้าย)

---

## 1. ไฟล์ A — ชีตท่า (action sheet) `char_cocoa_sheet.png`
- **เลย์เอาต์:** 8 เฟรม **แนวนอน 8×1** · เซลล์ 128×128 px → รวม **1024×128 px**
- ลำดับเฟรม (ห้ามสลับ):

| # | ชื่อท่า | รายละเอียด |
|---|---------|-----------|
| 0 | **idle** | ยืนกำหมัด/ถุงมือหมี ท่าพร้อมสู้ ยิ้มมั่นใจ |
| 1 | **blink** | เหมือน idle แต่หลับตา (กะพริบตา) |
| 2 | **squash** | ย่อตัวลง (ตอนลงพื้น) |
| 3 | **stretch** | ยืดตัวสูง (ตอนพุ่ง/กระโดด) |
| 4 | **cheer** | ดีใจ ชูกำปั้นขึ้น ตายิ้มหลับ (เคลียร์เวฟ) |
| 5 | **hurt** | หน้าเจ็บ เอียงตัว (โดนตี) |
| 6 | **ko** | สลบ ตากากบาท/หมุน ล้มลง (ตาย) |
| 7 | **cast = ออกหมัด/ต่อยคอมโบ** ⭐ | **เหวี่ยงหมัด/ถุงมือตราหมีไปข้างหน้าเต็มแรง มีพลังม่วง (#9f6bff) วาบที่กำปั้น** — ท่าต่อยเท่ ๆ (โชว์ตอนโจมตี + ตอนใช้ Flicker Strike) |

## 2. ไฟล์ B — ชีตวิ่ง (run atlas) `char_cocoa_run_sheet.png`
- **เลย์เอาต์:** 12 เฟรม **4 คอลัมน์ × 3 แถว** (ซ้าย→ขวา บน→ล่าง = เฟรม 0..11) · เซลล์ 128×128 → รวม **512×384 px**
- เนื้อหา: วงจรวิ่ง 12 เฟรมต่อเนื่อง (หมีวิ่งเด้งดึ๋งน่ารัก กำหมัด) loop ลื่น · **ขนาดตัวเท่าชีตท่า**

---

## 3. เทมเพลตข้อความส่ง AI image

### ชีตท่า (action sheet)
```
A cute chibi mochi bear-boy warrior named "Chocolate", a chocolate/cream colored bear
with big paw gauntlets, warm purple glowing power (#9f6bff) accents. Soft pink cheeks,
big sparkly eyes, 2-head-tall chibi proportions, adorable 2.5D confectionery style,
clean lines and soft shading. Character faces RIGHT, looks strong but cute.

Make a sprite sheet: 8 frames in a SINGLE HORIZONTAL ROW (8 columns x 1 row), each cell
128x128 px, total 1024x128 px. Same character size and same ground line in every cell,
centered. Fully transparent background (no black, no border, no grid).

Frame order (left to right):
1) idle, fists/paw-gauntlets up in a ready stance, confident smile
2) same as idle but eyes closed (blink)
3) squashed/crouched down
4) stretched tall
5) cheering, raising a fist, happy closed eyes
6) hurt/flinching
7) knocked out, dizzy, falling
8) PUNCHING forward hard with the bear paw-gauntlet, purple energy (#9f6bff) flaring on
   the fist, dynamic combo-punch pose

Output a single transparent PNG, 1024x128.
```

### ชีตวิ่ง (run atlas)
```
A 12-frame RUN CYCLE sprite sheet of the same cute chibi chocolate bear-boy "Chocolate"
with paw gauntlets, chocolate/cream + warm purple, adorable 2.5D candy style, facing
RIGHT. Layout 4 columns x 3 rows (left-to-right, top-to-bottom), each cell 128x128 px,
total 512x384 px. Smooth loopable bouncy run. Same character size and ground line every
cell, centered, fully transparent background (no black, no border, no grid).
Output a single transparent PNG.
```

---

## 4. หลังได้ภาพ (สำหรับ Claude)
1. เจ้าของอัป 2 ไฟล์ลง `assets/incoming/characters/` แล้วบอก "วางตัวโกโก้แล้ว"
2. ตัด/ย่อ (segmentation + bottom-align แบบเดียวกับมิ้นต์) → `assets/char_cocoa_sheet.png` + `assets/char_cocoa_run_sheet.png` (คีย์ `char_cocoa` / `char_cocoa_run` เดิม)
3. เช็ก `FP.char_cocoa` (110) — ถ้าสัดส่วนต่างจากเดิมปรับให้ตรง
4. เฟรม cast (index 7) = ท่าต่อย → โชว์อัตโนมัติตอนโจมตี/Flicker Strike (`CF.cast`)
