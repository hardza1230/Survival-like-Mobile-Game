# 🧊 ใบสั่งงานอาร์ต — หอกน้ำแข็งของมิ้นต์ (proj_frostlance)

> ใช้เป็นหัวกระสุน "หอกน้ำแข็ง" ที่มิ้นต์พุ่งเจาะทะลุแนว (Frost Lance)
> ตอนนี้เกมใช้ texture ชั่วคราว (proj_boomer) → เมื่อได้อาร์ตจริงอัปโหลด
> `assets/incoming/vfx/proj_frostlance.png` แล้วบอก Claude เสียบคีย์ `proj_frostlance`

## สเปกเทคนิค (สำคัญ)
- **ชื่อไฟล์:** `proj_frostlance.png`
- **พื้น:** โปร่งใสสนิท (transparent RGBA) — ห้ามพื้นดำ/สี/กรอบ
- **ขนาด:** ~256×128 px (แนวนอน — หอกยาว)
- **ทิศ:** ปลายแหลม **ชี้ไปทางขวา** (เกมหมุน sprite ตามทิศพุ่งด้วย faceVel — วาดชี้ขวาคือ 0°)
- **จุดกึ่งกลาง:** ก้านหอกอยู่กลางแนวตั้งของเฟรม (เกมหมุนรอบจุดกลางภาพ)
- **โทนสี:** ฟ้า–ขาวน้ำแข็ง เรืองแสงเย็น · เกมย้อม (tint) เพิ่มได้ ให้เน้นทรง+ไฮไลต์
- **สไตล์:** เข้าชุดเกม (2.5D confectionery/คริสตัลน่ารัก) — หอกคริสตัลน้ำแข็งมันวาว ปลายแหลมคม มีหางเกล็ดน้ำแข็ง/ไอเย็นพลิ้วด้านท้าย ประกายเล็กน้อย
- **ส่ง PNG ไฟล์เดียว**

## เทมเพลตข้อความส่ง AI image (ก๊อปวางได้เลย)
```
A cute crystalline ICE LANCE / frost spear projectile for a candy-themed mobile game,
pointing to the RIGHT, centered vertically. A glossy pale-blue and white crystal spear
with a sharp pointed tip, faceted like a gem/candy, softly glowing cold, with a short
trailing wisp of frost/ice shards and a few tiny sparkles at the back.

Style: adorable 2.5D confectionery fantasy, clean soft shading, gem-like icy sheen.

STRICT REQUIREMENTS:
- Fully transparent background (no black, no color fill, no square border)
- Horizontal image 256x128 px, the spear tip pointing exactly to the right
- The lance shaft centered on the vertical middle line
- Light icy blue / near-white tones (it will be tinted at runtime) — bright and readable
- A single spear/lance projectile, no text
Output a single transparent PNG.
```

## หลังได้ภาพ (สำหรับ Claude)
1. เจ้าของอัป `assets/incoming/vfx/proj_frostlance.png` แล้วบอก "วางหอกน้ำแข็งแล้ว"
2. ตรวจ alpha/ย่อ → `assets/generated/proj_frostlance.png`
3. เพิ่มคีย์ `proj_frostlance` ใน `ASSET_IMAGES` → โค้ดสลับใช้อัตโนมัติ (มี `textures.exists('proj_frostlance')` เช็คแล้ว)
