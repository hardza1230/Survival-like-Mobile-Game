# 🐻🍫 ใบสั่งงานอาร์ต — VFX ที่ขาดของช็อกโกแลต (โกโก้ · Flicker Strike)

> โกโก้ใช้ Unique ใหม่ **Flicker Strike** (วาร์ปฟันรัว ๆ สายคอมโบประชิด ธีมหมี/ช็อกโกแลตม่วงอุ่น)
> ตอนนี้จังหวะ "ฟัน" ใช้แค่วงกระแทกสีม่วง + อนุภาคทั่วไป — **ยังขาด VFX รอยฟัน/กรงเล็บหมี** และ **สตรีคตอนวาร์ป**
> ทำ **2 ชิ้น** (ทำชิ้นแรกก่อนได้ ชิ้น 2 เสริม)

---

## ชิ้นที่ 1 (สำคัญสุด) — รอยฟันกรงเล็บหมี `fx_bearslash`
ใช้เด้งตอนวาร์ปเข้าฟันศัตรูแต่ละครั้ง (เล่นครั้งเดียวแล้วหาย)

### สเปกเทคนิค (VFX flipbook — ต้องเป๊ะตามระบบเกม)
- **ชื่อไฟล์:** `fx_bearslash.png`
- **พื้น:** **ดำสนิท (solid black background)** — ไม่ใช่โปร่งใส (เกมใช้ additive blend ลบพื้นดำออกเอง)
- **เลย์เอาต์:** สตริปแนวนอน **8 เฟรมเท่า ๆ กัน** (8 คอลัมน์ 1 แถว) เรียงเป็นอนิเมชันต่อเนื่อง
- **ขนาดเฟรม:** ~192×192 px ต่อเฟรม → รวม 1536×192 (เฟรมไม่ต้องจตุรัสเป๊ะก็ได้ แต่เท่ากันทุกเฟรม)
- **สี:** ม่วง–ชมพูอุ่น เรืองแสง (ธีมช็อกโกแลตเวทมนตร์) โทน `#b98bff / #9f6bff` + ไส้ขาวสว่าง
- **เนื้อหา:** รอย **กรงเล็บหมี 3 เส้นเฉือน (claw slash)** วาบขึ้นเร็ว → พุ่งกว้าง → จางหาย · มีประกาย/สะเก็ดพลังงานเล็กน้อย
- อนิเมชัน: เฟรม 1–2 เริ่มวาบ, 3–5 เต็มแรงกว้างสุด, 6–8 จางหาย

### เทมเพลตส่ง AI image (ก๊อปได้เลย)
```
An 8-frame horizontal sprite strip animation of a glowing BEAR CLAW SLASH impact effect
for a cute candy game. Three diagonal claw-slash streaks in warm purple-pink (#9f6bff /
#b98bff) with a bright white-hot core and a few sparkles. Frames read left to right:
the slash flashes in, expands wide and bright at peak, then fades out.

STRICT REQUIREMENTS:
- SOLID BLACK background (not transparent) — pure #000000, no other bg color
- 8 equal frames in a SINGLE horizontal row, each 192x192 px, total 1536x192
- Same framing/scale each frame, effect centered
- Glowing purple/pink energy, no text, no character
Output a single PNG with solid black background.
```

## ชิ้นที่ 2 (เสริม) — สตรีควาร์ป `fx_flickerblink`
เส้นแสงตวัดตอนตัวละครวาร์ปพุ่งจากจุดหนึ่งไปอีกจุด (ตอนนี้ใช้ afterimage ตัวละครม่วง — ถ้ามีสตรีคจะฟินขึ้น)

### สเปก
- **ชื่อไฟล์:** `fx_flickerblink.png` · พื้น**ดำสนิท** · สตริป 8 เฟรมเท่ากัน ~192×96 px/เฟรม (รวม 1536×96)
- เนื้อหา: ลำแสง/เส้นตวัดม่วง–ขาว พุ่งจากซ้าย→ขวา (anchor 'left') เหมือน after-streak ความเร็วสูง
```
An 8-frame horizontal sprite strip of a fast purple-white MOTION STREAK / blink dash
trail (like an afterimage speed line) flashing from left to right, on a SOLID BLACK
background. Warm purple #9f6bff glowing energy. 8 equal frames, each 192x96 px, total
1536x96, effect pointing right. No text. Output a PNG with solid black background.
```

---

## หลังได้ภาพ (สำหรับ Claude)
1. เจ้าของอัป `assets/incoming/vfx/fx_bearslash.png` (+ `fx_flickerblink.png`) แล้วบอก "วาง VFX โกโก้แล้ว"
2. ตัด/ตรวจ (ระบบ VFX flipbook: alpha ตามความสว่าง lum×1.35 + saturation gate, platform ย่อสูง ×3 → resize คืน) ลง `assets/generated/`
3. เพิ่มใน `ASSET_FX` = `{fx_bearslash:{url,fw:192,fh:192,frames:8,rate:26,anchor:'center'}}` (+ `fx_flickerblink` anchor:'left')
4. เสียบใน `castFlickerStrike`: จุดฟันแต่ละครั้งเรียก `spawnFxAnim('fx_bearslash',t.x,t.y,{scale, rotation:มุมฟัน, add:true})` แทน/เสริม `vfxHitRing` · `blinkTo` เรียก `spawnFxAnim('fx_flickerblink',...)` ตามแนววาร์ป
