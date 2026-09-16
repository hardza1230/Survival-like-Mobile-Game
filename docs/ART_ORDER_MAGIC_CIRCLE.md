# 🔮 ใบสั่งงานอาร์ต — วงเวทกระจก (Magic Circle) ตัวใหม่

> **ทำไมต้องทำ:** ตอนนี้เกมยืม `vfx_hit_ring.png` (วงกระแทก) มาใช้เป็น "วงเวท" หลายที่
> (เขตยึดครอง capture zone, สนามกระจกงาดำ, telegraph) → พอย่อเป็นวงรีวางพื้น (มุมมอง 2.5D)
> อาร์ตเดิมที่ไม่สมมาตรเลย **ดูเบี้ยว/บิด** · ใบสั่งงานนี้ขอวงเวทที่ออกแบบมาให้ **สมมาตรเป๊ะ + ย่อแบนแล้วยังสวย**
>
> **สถานะ:** ✅ เสร็จแล้ว (v2.59.0) — ได้อาร์ต 1254×1254 โปร่งสมมาตร → ย่อ 512×512 เก็บ alpha → `assets/generated/vfx_magic_circle.png` · เสียบใน Oath Ward งาดำ, เขตยึดครอง (capture), สนามกระจก (castMirrorGlaze)

---

## 1. คอนเซปต์
วงเวทธีม **"กระจกคำสัตย์ / โมจิเวทมนตร์"** — วงกลมเวทมนตร์น่ารักแบบขนม
- โทน: เส้นเรืองแสงบาง ๆ + ประกายคริสตัล/กระจก · ลายเรขาคณิตหมุนได้ (rune ring)
- อารมณ์: สะอาด อ่านง่าย ไม่รก (เกมมือถือ ฉากวุ่นอยู่แล้ว)

## 2. สเปกเทคนิค (สำคัญที่สุด — เกมนำไป tint + ย่อ)
- **ชื่อไฟล์:** `vfx_magic_circle.png`
- **พื้น:** **โปร่งใสสนิท (transparent RGBA)** — ห้ามพื้นดำ/สี/ขอบสี่เหลี่ยม
- **ขนาด:** **512 × 512 px จตุรัสเป๊ะ** (จะได้ย่อเป็นวงรีวางพื้นได้ไม่บิด)
- **⭐ สมมาตรแบบเรเดียล (radial symmetry) เป๊ะ:** วงต้องเป็น **วงกลมสมบูรณ์ กึ่งกลางภาพพอดี** — หมุนภาพกี่องศาก็ต้องเหมือนเดิม (เกมจะหมุนวงนี้ตลอดเวลา + ย่อสูงให้แบน ~0.86 ถ้าไม่สมมาตรจะเห็นเบี้ยวทันที)
- **⭐ สีเป็น "ขาว/เทาอ่อนเกือบขาว" เป็นหลัก (near-white / grayscale)** — เพราะเกมจะ **ย้อมสี (tint)** เองตามสถานการณ์ (ฟ้า/ม่วง/เขียว) · ถ้าใส่สีจัดมาในภาพ ตินต์แล้วจะเพี้ยน · ให้ใช้ **ความสว่าง (luminance) เป็นตัวกำหนดความเข้ม** เท่านั้น
- **เส้นบาง คม เรืองแสงนุ่ม** · เว้นกลางวงให้โปร่ง (ผู้เล่นยืนตรงกลางได้ เห็นตัวละคร)
- **ไม่มีตัวหนังสือจริง/ภาษาที่อ่านออก** (ใช้ rune ประดิษฐ์/สัญลักษณ์ได้)
- **ส่ง PNG ไฟล์เดียว**

## 3. องค์ประกอบที่อยากได้ (ไล่จากนอกเข้าใน)
1. **วงขอบนอก** — วงกลมเส้นคู่บาง เรืองแสง (radius ~ขอบภาพ เว้น margin ~6%)
2. **แถบ rune หมุน** — วงในถัดมามีสัญลักษณ์/ขีดเล็ก ๆ เรียงรอบวงเท่า ๆ กัน (เช่น 12 หรือ 16 จุด สมมาตร)
3. **ลายเรขาคณิต** — สามเหลี่ยม/หกเหลี่ยม/ดาว ซ้อนกลางแบบสมมาตร (mirror/กระจก = เหลี่ยมคริสตัล)
4. **กลางวงโปร่ง** — มีแค่ประกายจาง ๆ ไม่ทึบ (ให้ตัวละครยืนทับแล้วยังเห็น)

## 4. กฎเหล็ก 3 ข้อ (ย้ำ ChatGPT/AI image)
1. **พื้นโปร่งใสสนิท + จตุรัส 512×512 + วงกลมสมมาตรเรเดียลกึ่งกลางเป๊ะ**
2. **โทนขาว/เทาอ่อนเกือบขาว (near-white grayscale) เท่านั้น** — ให้เกมย้อมสีเอง ห้ามใส่สีจัด
3. **บันทึกเป็น PNG-24 (RGBA) มาตรฐาน** เปิดดูได้ปกติ

---

## 5. เทมเพลตข้อความส่ง AI image (ก๊อปวางได้เลย)

```
A clean, radially-symmetric magic circle for a cute candy-themed mobile game.
Perfectly circular, centered in the frame, mirror/crystal magic theme.

Style: thin glowing lines, soft neon glow, delicate geometric rune ring,
layered symmetric geometry (hexagon/triangle/star) in the middle,
elegant and readable — NOT busy or cluttered.

STRICT REQUIREMENTS:
- Fully transparent background (no black, no color fill, no square border)
- Square image 512x512 px, the circle exactly centered and perfectly round
- Perfect radial symmetry (it will be rotated and vertically squashed in-game,
  so any asymmetry will look warped)
- NEAR-WHITE / light grayscale ONLY — brightness defines intensity.
  Do NOT bake in strong colors; the game tints it at runtime.
- Thin crisp glowing strokes, open/empty center (a character stands in the middle)
- No real readable text (invented rune glyphs are fine)

Output a single transparent PNG, tell me the exact size.
```

---

## 6. ขั้นตอนหลังได้ภาพ (สำหรับ AI/Claude)
1. เจ้าของอัปโหลดลง **`assets/incoming/`** แล้วบอก "วางวงเวทใหม่แล้ว"
2. Claude ตรวจไฟล์ + ทำ alpha ให้สะอาด → เซฟเป็น `assets/generated/vfx_magic_circle.png`
3. เพิ่มคีย์ `vfx_magic_circle` ใน `ASSET_IMAGES`
4. เปลี่ยนที่ที่ใช้ "วงเวท" (capture zone `_captureRing` บรรทัด ~3546, สนามกระจก `castMirrorGlaze`) จาก `vfx_ring` → `vfx_magic_circle`
   · **คงการย่อวงรี** (setDisplaySize r*2 × r*1.72) ไว้เพื่อมุมมองพื้น — แต่พออาร์ตสมมาตรจะไม่เบี้ยวแล้ว
5. เทส → commit
