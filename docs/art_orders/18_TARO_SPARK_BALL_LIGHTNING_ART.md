# 18 — Taro Spark + Ball Lightning · ใบสั่งงานอาร์ต

สถานะ: ร่าง 15 ต.ค. 2026 อิง runtime v7.8.24 · อ่าน `00_STYLE_GUIDE.md` และ `17_TARO_SENTRY_ART.md` (ชุดสีเดียวกัน) ก่อน
ส่งไฟล์ที่ `assets/incoming/taro_spark_ball/` ตามชื่อในตาราง · PNG32 · ฝั่งโค้ดแพ็กเป็น WebP และผูกเอง

ใบนี้แทน `vfx_taro_ball_lightning` เดิม (A5 ในใบ 17) ที่เป็นวงแหวนใหญ่ เพราะกลไกเปลี่ยนเป็นแบบ Path of Exile Ball Lightning แล้ว

---

## 1. กลไกที่อาร์ตต้องรองรับ (runtime ปัจจุบัน)

### Spark (สาย `smite` = Spark Build)
- ยิงออกรอบตัว Taro กระจายเท่า ๆ กัน 360° ครั้งละ 3–10 ลูก
- ความเร็ว 380–560 px/วิ ส่ายไปมาเล็กน้อย **เด้งขอบจอ** และเด้งกำแพง/ของแข็ง อยู่ 3.5–5 วิ
- ทะลุศัตรูได้ 2–5 ตัว
- **แตกตัว:** ทุก 0.42 วิ ลูกแตกเป็น 2 ลูก สูงสุด 2 รุ่น (1 → 2 → 4) แต่ละรุ่นเล็กลง (scale 1.25 / 0.9 / 0.65)
- บนจอพร้อมกันได้ถึง 36 ลูก → ภาพต้องเบา อ่านง่าย ไม่บังศัตรู

### Ball Lightning (สาย `tempest` = Sentry Build และ Unique Storm Beacon)
- ลูกบอลเล็กลอยช้า (110 px/วิ) ตรงไปทางศัตรู อยู่ได้ถึง 6 วิ
- **ทุก 0.15 วิ ช็อตศัตรูทุกตัวที่อยู่ในรัศมี 85–120px** (สูงสุด 6 ตัว) วาดเส้นสายฟ้าสั้น ๆ จากลูกไปหาศัตรูสูงสุด 2 เส้นต่อรอบ
- ลูกจาก Beacon = สีทอง รัศมีช็อต 95px
- บนจอพร้อมกันได้ถึง 16 ลูก

---

## 2. ทิศทางอาร์ต

- **ชุดสีเดียวกับใบ 17:** ม่วงพลัม `#4a2d6b` (เส้นขอบ) · ลาเวนเดอร์ `#c6a2ed` · ฟ้าซีด `#a9e8ee` / `#c6e9ff` · ขาวแกน `#f4edff` · Beacon = ทอง `#ffda89`
- **Spark** = ประกายแหลมเล็กมีหางสั้น พุ่งเร็ว อ่านทิศได้ (หัวสว่าง หางจาง) ต่างจาก Arc ที่เป็นเส้นยาว
- **Ball Lightning** = **ลูกกลมเล็กสว่าง** (ไม่ใช่วงแหวน) ขนาดบนจอราว 34–40px · มีสายฟ้าเส้นเล็ก ๆ แลบออกรอบลูก · ความรู้สึก "พลังงานอัดแน่น พร้อมช็อต"
- วงรัศมีช็อตไม่ต้องวาดทึบ ทำแค่ "หมอกไฟฟ้าจาง ๆ" แยกไฟล์ (B3) ให้โค้ดย่อขยายตามรัศมีจริง
- ทุกชิ้นต้องอ่านออกบนพื้นด่านสีอ่อน (พาสเทล) และพื้นมืด

---

## 3. รายการไฟล์

VFX ทั้งหมด **พื้นดำสนิท #000** (โค้ดแปลง alpha จากความสว่าง เล่นแบบ NORMAL blend) · เฟรมเรียงซ้าย→ขวา บน→ล่าง ไม่มีเส้นคั่น · วัตถุอยู่กลางเฟรมทุกเฟรม เว้นขอบ 8% · ไม่มีตัวหนังสือ

### A — Spark

| # | key / ไฟล์ | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด |
|---|---|---|---|---|---|
| A1 | `vfx_taro_spark.png` | 4×1 = 4 · loop | 128 | 20–40px (ตาม scale) | ประกายหัวแหลมหันขวา: แกนขาว-ฟ้าสว่าง ขอบม่วง หางสายฟ้าซิกแซกสั้น 2–3 หยัก (ยาวราว 60% ของเฟรม) · หางเปลี่ยนรูปทุกเฟรม ตัวหัวอยู่ที่ 70% ทางขวาของเฟรม |
| A2 | `vfx_taro_spark_split.png` | 4×1 = 4 · ครั้งเดียว | 128 | ~48px | ตอนแตกตัว: ประกายแวบขาว แล้วแยกเป็น 2 แฉกออกซ้าย-ขวา (รูป Y) · สั้นมาก ~0.15 วิ |
| A3 | `vfx_taro_spark_bounce.png` | 4×1 = 4 · ครั้งเดียว | 128 | ~40px | ตอนเด้งขอบจอ/กำแพง: ประกายกระเด็นครึ่งวงกลม (ด้านเดียว) ฟ้า-ม่วง · โค้ดหมุนตามผนัง |
| A4 | `vfx_taro_spark_hit.png` | 4×1 = 4 · ครั้งเดียว | 128 | ~44px บนศัตรู | ตอนทะลุศัตรู: ประกายแตกเป็นเส้นเล็ก 4–5 เส้นพุ่งไปข้างหน้า (ทิศทางเดียวกับลูก หันขวา) |
| A5 | `vfx_taro_spark_burst.png` | 3×2 = 6 · ครั้งเดียว | 256 | ~120px รอบ Taro | ตอนยิงออกรอบตัว: วงแสงม่วง-ฟ้าเล็ก ๆ แผ่ออก มีขีดสั้น 8 ทิศ (เข็มทิศ) |

### B — Ball Lightning

| # | key / ไฟล์ | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด |
|---|---|---|---|---|---|
| B1 | `vfx_taro_ball_core.png` | 3×2 = 6 · loop | 128 | 34–40px | **ลูกบอลสายฟ้า**: ทรงกลมสว่างแกนขาว รอบนอกฟ้า-ม่วง มีสายฟ้าเส้นเล็ก 3–5 เส้นแลบออกนอกลูกเล็กน้อย (ไม่เกิน 30% ของเฟรม) เปลี่ยนตำแหน่งทุกเฟรม · ลูกเต็มราว 55% ของเฟรม |
| B2 | `vfx_taro_ball_core_gold.png` | 3×2 = 6 · loop | 128 | 38–44px | แบบเดียวกับ B1 แต่โทนทอง-ม่วง สำหรับลูกจาก Storm Beacon (มีวงแหวนทองเล็กหมุนรอบ 1 วง) |
| B3 | `vfx_taro_ball_field.png` | 2×2 = 4 · loop | 256 | 170–240px (= รัศมีช็อต) | หมอกไฟฟ้าจาง ๆ เป็นวงกลม: ขอบเป็นประกายเล็กกระจาย กลางแทบโปร่ง (ความสว่าง ≤ 25%) · บอกระยะช็อตแบบไม่บังศัตรู · ขอบวงอยู่ที่ 90% ของเฟรม |
| B4 | `vfx_taro_ball_zap.png` | 1×4 = 4 · loop | 256 (กว้าง) × 48 (สูง) | ยืดตามระยะ 30–120px | สายฟ้าเส้นสั้นจากลูกไปหาศัตรู (แนวนอน ซ้าย→ขวา) แกนขาว ขอบฟ้า-ม่วง ปลายขวามีจุดกระแทกเล็ก · ยืดแนวนอนได้ไม่แตก |
| B5 | `vfx_taro_ball_zap_hit.png` | 4×1 = 4 · ครั้งเดียว | 64 | ~28px บนศัตรู | จุดช็อตเล็กที่ตัวศัตรู: ดาวแฉกฟ้าขาวแวบ |
| B6 | `vfx_taro_ball_fade.png` | 3×2 = 6 · ครั้งเดียว | 128 | ~60px | ลูกบอลหมดอายุ: แกนหดเล็ก สายฟ้ากระจายออกเป็นเศษประกาย แล้วจางหาย (ไม่ใช่ระเบิดใหญ่ — ระเบิดใหญ่ใช้ `vfx_taro_orb_burst` เดิมของการ์ด Overload) |

### C — ไอคอนการ์ด Spark (alpha จริง, 256×256, โชว์ 44–64px)

ตอนนี้การ์ด Spark ยืมไอคอนทั่วไป (`ic_taro_rate` ใช้ซ้ำหลายใบ)

| # | key | การ์ด | ภาพ |
|---|---|---|---|
| C1 | `ic_taro_live_current` | Live Current (+อายุ) | ประกายวนรอบนาฬิกาทรายคริสตัล |
| C2 | `ic_taro_fast_sparks` | Fast Sparks (+ความเร็ว) | ประกาย 3 ลูกพุ่งมีเส้นความเร็ว |
| C3 | `ic_taro_split_spark` | Split Spark (ลูกแตกแรงขึ้น) | ประกายแตกรูป Y เป็นสองแฉกสว่าง |
| C4 | `ic_taro_piercing_current` | Piercing Current (+ทะลุ) | ประกายพุ่งทะลุโมจิศัตรู 2 ตัวเรียงกัน |
| C5 | `ic_path_smite_spark` | ไอคอนสาย Spark Build | ประกายแตกกระจายรอบเข็มทิศม่วง |

---

## 4. Prompt

หัวร่วม (ต่อท้ายทุกชิ้น):
> cute pastel confectionery fantasy game VFX for Mochi Mayhem mobile game, Taro the purple taro mochi storm-compass hero, pale cyan and white lightning with lavender violet edges, strong readable silhouette at small size, centered, no text, no watermark, no UI frame

| ชิ้น | prompt เฉพาะ |
|---|---|
| A1 | VFX sprite sheet 4 frames in one row loop, small sharp electric spark flying to the right, bright white-cyan arrowhead core near the right side, short zigzag lightning tail with 2 to 3 kinks fading to violet on the left, tail shape changes every frame, on solid pure black background |
| A2 | VFX sprite sheet 4 frames in one row, a small spark flashes white then splits into two forks in a Y shape spreading up-right and down-right, cyan and violet, very quick, on solid pure black background |
| A3 | VFX sprite sheet 4 frames in one row, tiny electric ricochet splash, half-circle fan of cyan sparks bouncing off a flat surface on the left edge, violet glow, on solid pure black background |
| A4 | VFX sprite sheet 4 frames in one row, small pierce burst, 4 to 5 thin cyan-white sparks shooting forward to the right from a point, violet glow, on solid pure black background |
| A5 | VFX sprite sheet 6 frames 3x2, small burst ring around a center, lavender and cyan light expanding outward with 8 short compass ticks, fading, on solid pure black background |
| B1 | VFX sprite sheet 6 frames 3x2 loop, compact glowing ball lightning orb filling about 55 percent of each frame, white hot core, cyan and violet outer glow, 3 to 5 tiny lightning tendrils crackling just outside the sphere, tendrils move every frame, sphere stays the same size and position, on solid pure black background |
| B2 | same as B1 but golden and violet color scheme with one thin golden ring orbiting the orb, on solid pure black background |
| B3 | VFX sprite sheet 4 frames 2x2 loop, very faint circular electric field seen from above, scattered tiny sparks along a circle at 90 percent of the frame, nearly empty translucent center, subtle cyan and violet, on solid pure black background |
| B4 | VFX sprite sheet 4 frames stacked vertically, each frame 256x48, short crackling lightning bolt from the left edge to the right edge, white core with cyan and violet glow, small impact spark at the right end, seamless left end, on solid pure black background |
| B5 | VFX sprite sheet 4 frames in one row, tiny four-point electric star flash, cyan and white, on solid pure black background |
| B6 | VFX sprite sheet 6 frames 3x2, small ball lightning orb fading out, core shrinks, tendrils scatter into tiny sparks and vanish, on solid pure black background |
| C1–C5 | single game card icon, isolated object, transparent alpha background, glossy candy style, (ใส่คำบรรยายจากตาราง C เป็นภาษาอังกฤษ) |

---

## 5. ฝั่งโค้ดจะผูกยังไง (โน้ตสำหรับ AI ที่ทำต่อ)

- แพ็กด้วยสคริปต์แบบ `scripts/pack-taro-sentry-art.py` (VFX ดำ → luminance alpha, ไอคอนย่อ 128) ไป `assets/art/taro_spark_ball/` · key `bpx_taro_*` (Taro-only lazy)
- Spark: `taroProjectileVisual` kind spark/sparkChild ใช้ A1 sprite สเกลตาม `TARO_SPARK_SCALE[gen]`, หมุนตาม angle · แตกตัว (tick fission) เล่น A2 · เด้ง (`taroBounceView` / `taroProjectileStep` reflect) เล่น A3 · `taroProjectileHit` spark เล่น A4 (คุมด้วย `taroVisualBudget`) · `castTaroSpark` เล่น A5
- Ball Lightning: `taroProjectileVisual` kind sentry/beacon ใช้ B1/B2 (~38px) + B3 ย่อขยาย `radius×2/0.9` · `taroOrbZap` วาด B4 ยืดจากลูกถึงศัตรู (สูงสุด 2 เส้น/รอบ) + B5 · หมดอายุปกติเล่น B6 (Overload ยังใช้ `bpx_taro_orb_burst`)
- เพดาน: Spark 36 ลูก, Ball 16 ลูก, เส้นช็อต 2 เส้น/ลูก/0.15 วิ → ต้องเช็ค FPS บนมือถือหลังผูก
- อาร์ตเก่า `vfx_taro_ball_lightning` (วงแหวนใหญ่) เลิกใช้ในเกมตั้งแต่ v7.8.24 เก็บไฟล์ไว้

---

# ส่วนเพิ่ม (15 ต.ค. 2026 · runtime v7.8.25) — Rift Needle, Plasma Field, Overcharge Detonation, Shock

> สถานะชุด A/B/C ด้านบน: ✅ ส่งครบ 16 ไฟล์และผูกในเกมแล้ว v7.8.25 (`assets/art/taro_spark_ball/`, ไอคอน `assets/art/build_paths/taro_*.webp`, สคริปต์ `scripts/pack-taro-spark-ball-art.py`)
> ส่งไฟล์ส่วนเพิ่มที่ `assets/incoming/taro_unique_needle/` · กฎเทคนิคเหมือนด้านบน (VFX พื้นดำ #000, เฟรมเรียงซ้าย→ขวา บน→ล่าง, ไม่มีตัวหนังสือ)

## กลไกที่อาร์ตต้องรองรับ

- **Rift Needle (การตีปกติก่อนเลือก Build):** หนามคริสตัลม่วงพุ่งตรงเร็วมาก (950 px/วิ) ไปหาศัตรูใกล้สุด 1–3 ตัว **ทะลุทุกตัวในแนว** · ตอนนี้ยืมภาพหอกน้ำแข็งของ Mint ย้อมม่วง
- **Plasma Field (Unique ก่อนเลือก Build · แบบ Razor ใน Dota 2):** วงพลาสมารอบตัว Taro ขยายออกจนรัศมี 280–370px ใน 0.9 วิ แล้วหดกลับเข้าตัว 0.9 วิ · ตามตัว Taro ตลอด · ศัตรูที่วงผ่านโดนตอนออกครั้งหนึ่งและตอนกลับอีกครั้ง ยิ่งไกลยิ่งแรง · ตอนนี้วาดด้วยโค้ด
- **Overcharge Detonation (Unique สาย Sentry):** ป้อมทุกตัวยิง Ball Lightning 6 ลูกเป็นวงพร้อมกัน แล้วระเบิดตัวเองรัศมี 150px · จากนั้นป้อมใหม่ 2 ตัวโผล่ข้าง Taro และยิงเร็วขึ้น 4 วิ · ตอนนี้ใช้ `vfx_taro_orb_burst` และออร่า overcharge เดิม
- **Shock (สาย Sentry):** ศัตรูที่โดน Ball Lightning ติด stack 1–5 (อยู่ 3 วิ) แต่ละชั้นรับดาเมจจาก Sentry +5% · ตอนนี้ยังไม่มีภาพบอก

> **15 ต.ค. 2026 (v7.8.27) ยกเลิก D1–D3 และ H3:** การตีก่อนเลือก Build เปลี่ยนจากเข็มเป็น Static Arc แล้ว ไม่ต้องทำภาพเข็ม ให้ทำชุด I (Arc) ท้ายใบแทน · Plasma Field ใช้กับสาย Arc ด้วย (H1 ใช้ปุ่ม Unique ทั้งก่อนเลือก Build และสาย Arc)

## D — Rift Needle (ยกเลิก)

| # | key / ไฟล์ | ชนิด | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด |
|---|---|---|---|---|---|---|
| D1 | `vfx_taro_needle.png` | VFX ดำ | 4×1 = 4 · loop | 256 (กว้าง) × 64 (สูง) | ยาว ~70px | หนามคริสตัลม่วงยาวแหลม หันขวา ปลายแหลมขาวสว่าง ตัวหนามลาเวนเดอร์มีเหลี่ยมผลึก หางเป็นประกายฟ้าสั้น · ความรู้สึกเหมือนหอกน้ำแข็ง/หนามพุ่ง ไม่ใช่สายฟ้า |
| D2 | `vfx_taro_needle_muzzle.png` | VFX ดำ | 4×1 = 4 · ครั้งเดียว | 128 | ~56px ข้างตัว Taro | แฟลชตอนปล่อยหนาม: วงคริสตัลแตกเล็ก ๆ ชี้ไปข้างหน้า (หันขวา) |
| D3 | `vfx_taro_needle_hit.png` | VFX ดำ | 4×1 = 4 · ครั้งเดียว | 128 | ~44px บนศัตรู | หนามทะลุ: เศษคริสตัลม่วงกระจายไปข้างหน้า 4–6 ชิ้น + ประกายฟ้า (หันขวา) |

## E — Plasma Field

| # | key / ไฟล์ | ชนิด | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด |
|---|---|---|---|---|---|---|
| E1 | `vfx_taro_plasma_ring.png` | VFX ดำ | 2×2 = 4 · loop | 512 | 48–740px (โค้ดย่อขยายตามรัศมีวง) | **วงแหวนพลาสมา** มองจากบนลงล่าง: ขอบวงหนาราว 6% ของเฟรม อยู่ที่ 92% ของเฟรม · แกนขาว-ฟ้าสว่าง ขอบม่วง มีสายฟ้าเล็กวิ่งตามวงและแลบเข้า-ออกเล็กน้อย · **กลางวงโปร่งทั้งหมด** · ห้ามเป็นวงรี (โค้ดวาดเป็นวงกลม) |
| E2 | `vfx_taro_plasma_cast.png` | VFX ดำ | 3×2 = 6 · ครั้งเดียว | 256 | ~160px รอบ Taro | ตอนกด: พลาสมาก่อตัวรอบตัว Taro เป็นลูกแสงฟ้า แล้วระเบิดออกเป็นวงเล็ก (ต่อกับ E1) |
| E3 | `vfx_taro_plasma_hit.png` | VFX ดำ | 4×1 = 4 · ครั้งเดียว | 128 | ~48px บนศัตรู | ศัตรูโดนวงพลาสมา: ประกายพลาสมาฟ้า-ขาวกระเซ็นเป็นวงเล็ก |

## F — Overcharge Detonation

| # | key / ไฟล์ | ชนิด | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด |
|---|---|---|---|---|---|---|
| F1 | `vfx_taro_sentry_overload.png` | VFX ดำ | 4×2 = 8 · ครั้งเดียว | 256 | ~180px บนป้อม | ป้อมโอเวอร์โหลด: แสงอัดเข้าคริสตัลป้อม (0–2) สายฟ้าแลบรอบป้อม (3–4) ระเบิดเป็นวงสายฟ้าม่วงทอง (5–7) |
| F2 | `vfx_taro_sentry_detonate.png` | VFX ดำ | 3×2 = 6 · ครั้งเดียว | 256 | ~320px (= รัศมี 150) | คลื่นระเบิดแผ่บนพื้น: วงสายฟ้าฟ้า-ม่วงขยาย มีเศษคริสตัลกระเด็น · ขอบวงที่ 90% ของเฟรม |

## G — Shock marker

| # | key / ไฟล์ | ชนิด | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด |
|---|---|---|---|---|---|---|
| G1 | `vfx_taro_shock_marker.png` | VFX ดำ | 5×1 = 5 · ไม่เล่น (เลือกเฟรมตามจำนวน stack) | 64 | ~26px เหนือหัวศัตรู | สัญลักษณ์สายฟ้าเล็ก เฟรม 0 = 1 ขีด ... เฟรม 4 = 5 ขีดเรียงเป็นพัด สว่างขึ้นตามจำนวน · อ่านออกที่ 26px |
| G2 | `vfx_taro_shock_aura.png` | VFX ดำ | 4×1 = 4 · loop | 128 | ~60px รอบศัตรูที่ 5 stack | ประกายไฟฟ้าวิ่งรอบตัวศัตรูแบบเบา ๆ (บอกว่าเต็ม stack) |

## H — ไอคอนปุ่ม Unique (alpha จริง, 256×256, โชว์ ~52px บนปุ่มกลม)

| # | key | ใช้กับ | ภาพ |
|---|---|---|---|
| H1 | `ic_taro_plasma_field` | ปุ่ม Unique ก่อนเลือก Build | วงแหวนพลาสมาฟ้าล้อมเข็มทิศม่วงตรงกลาง |
| H2 | `ic_taro_overcharge` | ปุ่ม Unique สาย Sentry | ป้อมคริสตัลระเบิดสายฟ้าออก 6 ทิศ |
| H3 | `ic_taro_rift_needle` | ไอคอนการตีปกติก่อนเลือก Build / Codex | หนามคริสตัลม่วงพุ่งเฉียงขึ้นขวา 3 เล่ม |

## Prompt ส่วนเพิ่ม (ใช้หัวร่วมเดิมด้านบน)

| ชิ้น | prompt เฉพาะ |
|---|---|
| D1 | VFX sprite sheet 4 frames stacked in one row, each frame 256x64, a long sharp violet crystal spike flying to the right, bright white tip, faceted lavender crystal body, short cyan sparkle tail on the left, like an ice lance but purple crystal, on solid pure black background |
| D2 | VFX sprite sheet 4 frames in one row, small forward-facing crystal muzzle flash, tiny violet crystal shards bursting to the right, on solid pure black background |
| D3 | VFX sprite sheet 4 frames in one row, crystal spike impact, 4 to 6 violet crystal shards and cyan sparks scattering forward to the right, on solid pure black background |
| E1 | VFX sprite sheet 4 frames 2x2 loop, perfect circle plasma ring seen from directly above, ring at 92 percent of the frame, thick bright white-cyan core line with violet edges, small lightning crackles running along and slightly in and out of the ring, completely empty transparent center, on solid pure black background |
| E2 | VFX sprite sheet 6 frames 3x2, cyan plasma gathers into a glowing sphere at the center then bursts outward into a small plasma ring, violet edges, on solid pure black background |
| E3 | VFX sprite sheet 4 frames in one row, small cyan-white plasma splash ring with sparks, on solid pure black background |
| F1 | VFX sprite sheet 8 frames 4x2, magical lightning turret overload: light sucks into a crystal, lightning crackles around it, then it bursts into a violet and gold lightning explosion, on solid pure black background |
| F2 | VFX sprite sheet 6 frames 3x2, flat electric shockwave ring expanding on the ground seen from above, cyan and violet lightning edge at 90 percent of the frame, scattered crystal shards, on solid pure black background |
| G1 | VFX sprite sheet 5 frames in one row, each 64x64, tiny lightning symbol counter: frame 1 one small bolt, up to frame 5 five small bolts arranged in a fan, getting brighter, violet and cyan, on solid pure black background |
| G2 | VFX sprite sheet 4 frames in one row loop, faint electric sparks circling around an empty center, cyan and violet, on solid pure black background |
| H1–H3 | single game UI icon, isolated object, transparent alpha background, glossy candy style, (ใส่คำบรรยายจากตาราง H เป็นภาษาอังกฤษ) |

## ฝั่งโค้ดจะผูกยังไง

- D: `taroFireNeedle` ใช้ D1 เป็น texture กระสุน (`faceVel`) แทน `proj_frostlance` · D2 ตอนยิง · D3 ใน hit ของกระสุน `taroNeedle`
- E: `taroTickPlasma` ใช้ E1 `setDisplaySize(r×2/0.92)` แทนวงที่วาดด้วยโค้ด · E2 ตอน `castTaroPlasma` · E3 ตอนโดน (คุมด้วย `taroVisualBudget`)
- F: `castTaroOvercharge` เล่น F1 บนป้อมแต่ละตัว + F2 แทน `vfx_taro_orb_burst`
- G: `taroShockAdd` แสดง G1 เฟรมตามจำนวน stack เหนือศัตรู (เพดาน 40 ตัวเหมือนเครื่องหมาย Tremor) · G2 ที่ 5 stack
- H: `syncUniqueIcon` เลือกไอคอนตาม Build (`ic_taro_plasma_field` ก่อนเลือก, `ic_taro_overcharge` สาย Sentry, `ic_taro_storm_beacon` สาย Arc/Spark)


---

# ส่วนเพิ่ม 2 (v7.8.27) — Static Arc + Overload Loop

ส่งที่ `assets/incoming/taro_unique_needle/` เหมือนส่วนเพิ่ม 1 · VFX พื้นดำ #000

กลไก: การตีก่อนเลือก Build = **Static Arc** สายฟ้าจาก Taro กระโดดผ่านศัตรู 3 ตัว (สาย Arc = สูงสุด 3 สาย 10 ตัว) · **Overload Loop:** กระโดดครั้งไหนไม่มีเป้าใหม่ สายฟ้าเด้งกลับตีเป้าสุดท้ายซ้ำ (แรง 60%) → บอสตัวเดียวโดนรัว · ตอนนี้ใช้เส้นสายฟ้าที่วาดด้วยโค้ด

| # | key / ไฟล์ | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด |
|---|---|---|---|---|---|
| I1 | `vfx_taro_arc_bolt.png` | 1×4 = 4 · loop | 512 (กว้าง) × 64 (สูง) | ยืด 40–360px | สายฟ้า Arc หลักระหว่าง 2 จุด (ซ้าย→ขวา) แกนขาว ขอบลาเวนเดอร์ ซิกแซกชัด 4–6 หยัก · ปลายซ้าย-ขวาต่อเนื่อง ยืดได้ไม่แตก · ต่างจาก Tesla (ฟ้าเส้นยาวเรียบ) ด้วยโทนม่วงและหยักใหญ่ |
| I2 | `vfx_taro_arc_hit.png` | 4×1 = 4 · ครั้งเดียว | 128 | ~46px บนศัตรู | จุดที่ Arc กระโดดโดน: ดาวสายฟ้าม่วง-ขาวแวบ มีวงเล็กขยาย |
| I3 | `vfx_taro_arc_loop.png` | 1×4 = 4 · loop | 512 × 96 | ยืด Taro→บอส | **Overload Loop:** สายฟ้าหนากว่า I1 สองเท่า แกนขาวจ้าขอบทอง-ม่วง ใช้ตอนเด้งกลับตีเป้าเดิมซ้ำ ให้รู้ว่ากำลังรวมพลัง |
| I4 | `vfx_taro_arc_overload_hit.png` | 3×2 = 6 · ครั้งเดียว | 256 | ~110px บนบอส | จุดโดนตอน Loop: ประกายระเบิดทองม่วงใหญ่กว่า I2 มีเศษสายฟ้ากระจาย |
| I5 | `ic_taro_arc_overload.png` | ไอคอน alpha 256 | — | 44–64px | ไอคอนการ์ด Overload: สายฟ้าวนเป็นวงลูกศรวนกลับเข้าหาเป้า |

Prompt (ต่อหัวร่วมเดิม):

| ชิ้น | prompt เฉพาะ |
|---|---|
| I1 | VFX sprite sheet 4 frames stacked vertically, each frame 512x64, jagged violet lightning arc from the left edge to the right edge with 4 to 6 sharp zigzags, white core, lavender glow, seamless ends, shape changes every frame, on solid pure black background |
| I2 | VFX sprite sheet 4 frames in one row, small violet-white lightning star flash with a tiny expanding ring, on solid pure black background |
| I3 | VFX sprite sheet 4 frames stacked vertically, each frame 512x96, thick overloaded lightning beam from left edge to right edge, blinding white core, gold and violet edges, crackling, seamless ends, on solid pure black background |
| I4 | VFX sprite sheet 6 frames 3x2, big gold and violet lightning impact burst with scattered electric shards, on solid pure black background |
| I5 | single game card icon, a violet lightning bolt curling into a looping arrow back toward a target, isolated object, transparent alpha background, glossy candy style |

ฝั่งโค้ด: `chainBolt` / `castTaroChainBasic` / `castTaroNeedle` (Static Arc) ใช้ I1 ยืดระหว่างจุด + I2 ที่ศัตรู · ส่วน Overload Loop (บล็อก `ov` ใน `castTaroChainBasic`, ลูปท้าย `castTaroNeedle`, `taroPlasmaArc`) ใช้ I3 + I4 · I5 ไปที่ `p_arc_overload`
