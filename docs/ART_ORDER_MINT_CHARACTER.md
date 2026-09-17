# 🌿🧊 ใบสั่งงานอาร์ต — ตัวละครมิ้นต์ใหม่ (Frost Lance Sentinel)

> รีดีไซน์มิ้นต์ให้เข้ากับสกิลใหม่ **Frost Lance** (หอกน้ำแข็งทะลุแนว)
> ต้องการ **2 ไฟล์**: ชีตท่า (action sheet) + ชีตวิ่ง (run atlas) — และมี **ท่าชาร์จ/ปาหอก**
> เมื่อได้อาร์ตจริง → อัปโหลดที่ `assets/incoming/characters/` แล้วบอก Claude ตัดลง `assets/`

---

## 0. คอนเซ็ปต์ตัวละคร
- ชื่อในเกม: **มินต์ (Mint)** — บทบาท "ผู้ควบคุมฝูงสายน้ำแข็ง" นักรบหอกน้ำแข็ง
- ธีม: โมจิ/ลูกกวาดน่ารัก โทน **มินต์เขียวอ่อน + ฟ้าน้ำแข็งขาว** เรืองเย็น
- อาวุธ: **หอกน้ำแข็งคริสตัล (Frost Lance)** — ถือหอกได้ ปาหอกได้
- สไตล์: 2.5D confectionery fantasy, เส้นสะอาด เงานุ่ม แก้มชมพูจาง ตาโต วิบวับน่ารัก (เข้าชุด Strawberry/โกโก้)
- สัดส่วน: หัวโต 2 หัว, ตัวกลม ป้อม, อ่านชัดบนจอมือถือเล็ก ๆ

## ⚠️ สเปกเทคนิคที่ต้องเป๊ะ (ไม่งั้นเกมตัด/แสดงเพี้ยน)
- **พื้นโปร่งใสสนิท** (transparent RGBA) ทุกไฟล์ — ห้ามพื้นดำ/ขาว/สี/เช็คเกอร์บอร์ด
- ตัวละครวาง **กึ่งกลางเซลล์** เท่ากันทุกเฟรม, สเกลตัวเท่ากันทุกเฟรม (สำคัญมาก — เฟรมที่ตัวเล็กกว่าจะทำให้ตัว "หด" ตอนสลับท่า)
- เท้ายืนที่ระดับเดียวกันทุกเฟรม (baseline ล่างตรงกัน)
- หันหน้า **ไปทางขวา** (เกม flip เองเวลาเดินซ้าย)

---

## 1. ไฟล์ A — ชีตท่า (action sheet) `char_mint_frostleaf_sheet.png`
- **เลย์เอาต์:** 8 เฟรมเรียง **แนวนอน 8×1** (8 คอลัมน์ 1 แถว)
- **ขนาดเซลล์:** 128×128 px ต่อเฟรม → ไฟล์รวม **1024×128 px**
- ลำดับเฟรม (ห้ามสลับ):

| # | ชื่อท่า | รายละเอียด |
|---|---------|-----------|
| 0 | **idle** | ยืนปกติถือหอกน้ำแข็งข้างตัว ยิ้มน้อย ๆ |
| 1 | **blink** | เหมือน idle แต่หลับตา (กะพริบตา) |
| 2 | **squash** | ย่อตัวลง (ตอนลงพื้น) หอกกดลงเล็กน้อย |
| 3 | **stretch** | ยืดตัวสูง (ตอนพุ่ง/กระโดด) หอกเหยียด |
| 4 | **cheer** | ดีใจ ชูหอกขึ้น ตายิ้มหลับ (เคลียร์เวฟ) |
| 5 | **hurt** | หน้าเจ็บ เอียงตัว (โดนตี) |
| 6 | **ko** | สลบ ตากากบาท/หมุน ล้มลง (ตาย) |
| 7 | **cast = ชาร์จ/ปาหอก** ⭐ | **ยกหอกน้ำแข็งขึ้นเล็งไปข้างหน้า มีพลังน้ำแข็งเรืองที่ปลายหอกกำลังชาร์จ** — ท่าเท่ ๆ พร้อมปา (ท่านี้โชว์ตอนใช้สกิล Frost Lance) |

## 2. ไฟล์ B — ชีตวิ่ง (run atlas) `char_mint_frostleaf_run_sheet.png`
- **เลย์เอาต์:** 12 เฟรม เรียง **4 คอลัมน์ × 3 แถว** (อ่านซ้าย→ขวา บน→ล่าง = เฟรม 0..11)
- **ขนาดเซลล์:** 128×128 px ต่อเฟรม → ไฟล์รวม **512×384 px**
- เนื้อหา: **วงจรวิ่ง 12 เฟรมต่อเนื่อง** ถือหอกน้ำแข็งวิ่ง (ตัวเด้งดึ๋งน่ารัก แขน/ขาสลับ) เล่นวน loop ได้ลื่น
- **สำคัญ:** ขนาดตัวในชีตวิ่ง **ต้องเท่ากับชีตท่า** (ที่ผ่านมาชีต idle เล็กกว่าชีตวิ่ง เลยต้องใส่ตัวคูณแก้ — คราวนี้ทำให้เท่ากันตั้งแต่ต้น)

---

## 3. เทมเพลตข้อความส่ง AI image

### ชีตท่า (action sheet)
```
A cute chibi mochi/candy warrior girl named "Mint" for a mobile game, holding a
glowing crystalline ICE LANCE (frost spear). Mint-green and icy-white color scheme,
soft pink cheeks, big sparkly eyes, 2-head-tall chibi proportions, adorable 2.5D
confectionery style with clean lines and soft shading. Character faces RIGHT.

Make a sprite sheet: 8 frames in a SINGLE HORIZONTAL ROW (8 columns x 1 row),
each cell 128x128 px, total 1024x128 px. Same character size and same ground line
in every cell, centered. Fully transparent background (no black, no border, no grid).

Frame order (left to right):
1) idle standing holding the ice lance at side, gentle smile
2) same as idle but eyes closed (blink)
3) squashed/crouched down
4) stretched tall
5) cheering, raising the lance up, happy closed eyes
6) hurt/flinching pose
7) knocked out, dizzy, falling
8) CHARGING & THROWING the ice lance forward — lance raised aiming ahead, glowing
   frost energy building at the spear tip, dynamic ready-to-throw pose

Output a single transparent PNG, 1024x128.
```

### ชีตวิ่ง (run atlas)
```
A 12-frame RUN CYCLE sprite sheet of the same cute chibi mochi girl "Mint" holding
a glowing crystalline ice lance, mint-green and icy-white, adorable 2.5D candy style,
facing RIGHT. Layout: 4 columns x 3 rows (read left-to-right, top-to-bottom),
each cell 128x128 px, total 512x384 px. Smooth loopable running animation with bouncy
cute motion. Same character size and ground line in every cell, centered, fully
transparent background (no black, no border, no grid). Output a single transparent PNG.
```

---

## 4. หลังได้ภาพ (สำหรับ Claude)
1. เจ้าของอัป 2 ไฟล์ลง `assets/incoming/characters/` แล้วบอก "วางตัวมิ้นต์ใหม่แล้ว"
2. ตรวจ alpha + สัดส่วนเซลล์ → ตัด/ย่อลง `assets/char_mint_frostleaf_sheet.png` และ `assets/char_mint_frostleaf_run_sheet.png` (คีย์ `char_mint` / `char_mint_run` เดิม — รองรับเซฟเดิม)
3. เช็ก FP (footprint) ใน `animatePlayer` — ถ้าตัวใหม่สัดส่วนต่างจากเดิม อาจต้องปรับ `FP.char_mint` (ตอนนี้ 110) และลบ/แก้ `CHAR_ACTION_SCALE.mint` (1.5) ถ้าชีตท่า/วิ่งขนาดเท่ากันแล้ว (ไม่ต้องคูณอีก)
4. เฟรม cast (index 7) = ท่าชาร์จปาหอก → โชว์อัตโนมัติตอนใช้สกิล (`CF.cast`)
