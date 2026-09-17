# 🍡✨ ใบสั่งงานอาร์ต — โลโก้เกม "Mochi Mayhem"

> โลโก้ใช้ **2 ที่**: (A) หน้าเมนูหลัก (แทนข้อความ title ที่วาดด้วยโค้ด) + (B) ทำเป็น **ไอคอนแอป Play Store**
> ทำ **1 ไฟล์หลัก** (โลโก้พื้นโปร่ง) ก่อน · ถ้าจะทำไอคอนแอปแยกด้วยยิ่งดี (ชิ้นที่ 2)

---

## 0. คอนเซ็ปต์
- ชื่อเกม (ตัวสะกดเป๊ะ): **MOCHI MAYHEM**
- ธีม: น่ารัก ลูกกวาด/โมจิ พาสเทล (เข้าชุดกับตัวละคร Strawberry/มิ้นต์/โกโก้)
- โทนสี: ชมพูอ่อน #ffb3c8 · มิ้นต์ #a8e6cf · ครีม #fff3d6 · ขอบเส้นน้ำตาลเข้มนุ่ม
- อารมณ์: สดใส เด้งดึ๋ง สนุก แต่ดูมีคุณภาพระดับเกมสโตร์

## ⚠️ สเปกเทคนิคที่ต้องเป๊ะ
- **พื้นโปร่งใสสนิท (transparent PNG)** — ห้ามพื้นดำ/ขาว/สี/เช็คเกอร์บอร์ด
- ความละเอียดสูง (แนะนำด้านกว้าง ≥ 1536 px) เผื่อย่อคมชัดบนมือถือ
- ตัวอักษรอ่านออกชัดแม้ย่อเล็ก · ห้ามมีข้อความอื่นนอกจาก "MOCHI MAYHEM"

---

## ชิ้นที่ 1 (หลัก) — โลโก้ `logo_mochimayhem.png` (แนวนอน โปร่งใส)

### เทมเพลตส่ง AI image (ก๊อปได้เลย)
```
A cute logo for a mobile game titled "MOCHI MAYHEM". Chubby, glossy 3D-style
bubble letters made of pastel mochi/candy (soft pink #ffb3c8, mint #a8e6cf,
cream #fff3d6) with a thick clean dark-brown outline and soft shading. A tiny
adorable mochi character (round white/pink rice-cake body, rosy cheeks, big
sparkly eyes, a strawberry topping on top) peeking over the letters. Playful
confectionery fantasy style, subtle glow and sparkles. Fully transparent
background (PNG, no black, no border). Horizontal layout, high resolution,
crisp readable letters. No extra text besides "MOCHI MAYHEM".
```

## ชิ้นที่ 2 (เสริม, สำหรับ Play Store) — ไอคอนแอป `appicon_mochimayhem.png` (จตุรัส)
Play Store ต้องใช้ไอคอน **512×512 จตุรัส เต็มกรอบ (ไม่โปร่ง)** — เน้นตัวละครเด่น อ่านชัดในกรอบเล็ก
```
A square mobile game app icon (512x512) for "Mochi Mayhem". A single adorable
mochi character front and center: round white/pink rice-cake body, rosy cheeks,
big sparkly happy eyes, a glossy strawberry topping. Pastel candy-kingdom
background (soft pink-to-mint gradient with a few floating sprinkles). Playful
2.5D confectionery style, thick clean outline, soft shading, bright and
friendly. Fill the whole square frame (no transparency, no text). High
resolution, centered composition.
```

---

## หลังได้ภาพ (สำหรับ Claude)
1. เจ้าของอัป `assets/incoming/ui/logo_mochimayhem.png` (+ `appicon_mochimayhem.png` ถ้าทำ) แล้วบอก "วางโลโก้แล้ว"
2. **โลโก้เมนู:** ย่อ/เก็บ alpha → `assets/generated/logo_mochimayhem.png` → เพิ่มคีย์ `logo_game` ใน `ASSET_IMAGES` → โชว์กลางบนหน้าเมนู (`buildHub`) แทน/เหนือ title ข้อความ (fallback = ข้อความเดิมถ้าโหลดไม่ได้)
3. **ไอคอนแอป:** ย่อเป็น 512×512 → ใช้เป็น Play Store icon + `capacitor` resource (`android/app/src/main/res` ผ่าน `@capacitor/assets` ตอน build) + favicon
4. bump `GAME_VERSION` + CHANGELOG
