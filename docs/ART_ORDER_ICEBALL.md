# 🧊 ใบสั่งงานอาร์ต — ลูกบอลน้ำแข็งโคจรของมิ้นต์ (proj_iceball)

> ใช้เป็นลูกบอลกลม ๆ ที่โคจรรอบตัวมิ้นต์ (Ice Orbit Balls) · ตอนนี้เกมใช้ texture ลูกฟองกลมชั่วคราว
> เมื่อได้อาร์ตจริง → อัปโหลด `assets/incoming/vfx/proj_iceball.png` แล้วบอก Claude เสียบคีย์ `proj_iceball`

## สเปกเทคนิค (สำคัญ)
- **ชื่อไฟล์:** `proj_iceball.png`
- **พื้น:** โปร่งใสสนิท (transparent RGBA) — ห้ามพื้นดำ/สี/กรอบ
- **ขนาด:** จตุรัส ~128×128 px (เกมย่อเอง)
- **รูปทรง:** ลูกกลมสมมาตร อยู่กึ่งกลางเฟรมพอดี (เกมหมุน/ย่อ ถ้าไม่กลมจะเห็นเบี้ยว)
- **โทนสี:** ฟ้า–ขาวน้ำแข็ง (icy blue/white) เรืองแสงนุ่ม · เกมจะย้อม (tint) เพิ่มได้ ให้เน้นทรง+ไฮไลต์
- **สไตล์:** เข้าชุดกับเกม (2.5D confectionery, ลูกกวาด/คริสตัลน่ารัก) — ลูกน้ำแข็งกลมมันวาว มีไฮไลต์แสง 1-2 จุด + ประกายเล็กน้อย
- **ส่ง PNG ไฟล์เดียว**

## เทมเพลตข้อความส่ง AI image (ก๊อปวางได้เลย)
```
A cute round ice ball / frost orb for a candy-themed mobile game, centered in the frame.
A glossy crystalline sphere of pale icy blue and white, softly glowing, with 1–2 bright
highlights and a few tiny sparkles/frost flecks around it. Smooth, symmetrical, spherical.

Style: adorable 2.5D confectionery fantasy, clean soft shading, gem-like/candy-like sheen.

STRICT REQUIREMENTS:
- Fully transparent background (no black, no color fill, no square border)
- Square image 128x128 px, the orb perfectly round and exactly centered
- Light icy blue / near-white tones (it will be tinted at runtime) — keep it bright and readable
- Single glossy sphere (a projectile orb), no text

Output a single transparent PNG.
```

## หลังได้ภาพ (สำหรับ Claude)
1. เจ้าของอัป `assets/incoming/vfx/proj_iceball.png` แล้วบอก "วางลูกบอลน้ำแข็งแล้ว"
2. ตรวจ alpha/ย่อ → `assets/generated/proj_iceball.png`
3. เพิ่มคีย์ `proj_iceball` ใน `ASSET_IMAGES` → โค้ดสลับใช้อัตโนมัติ (มี `textures.exists('proj_iceball')` เช็คแล้ว)
