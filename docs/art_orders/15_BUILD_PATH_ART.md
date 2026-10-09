# 15 — Build Path Art: Strawberry / Mint / Chocolate

ใบสั่งงานอาร์ตสำหรับ AI ตัวสร้างภาพ · อ่าน `00_STYLE_GUIDE.md` ก่อน (มุมมอง ¾ top-down, alpha จริง, ไม่มีตัวหนังสือ)
ส่งไฟล์ไว้ที่ `assets/incoming/build_path_art/<batch>/` ตามชื่อในตาราง · ฝั่งโค้ดจะแพ็กเป็น WebP และผูกเอง

## สรุปสิ่งที่มีแล้ว / ยังขาด

| ตัวละคร | สาย | มีแล้ว | ยังขาด (ใบนี้) |
|---|---|---|---|
| 🍓 Strawberry (momo) | Sniper | charge aura, wind-cut ribbon, charged projectile | ✅ ครบพอใช้ — ขอเพิ่ม muzzle/impact เล็ก (S1) |
| | Shotgun | Berry Blast, shotgun muzzle | ✅ ครบ — ขอ pellet impact (S2) |
| | Ricochet | ใช้เมล็ดปกติ | ❌ ไม่มีเอฟเฟกต์เด้ง/สายเชื่อม (S3) |
| 🌿 Mint | Glacier Bloom | bloom, shatter | ✅ ครบ |
| | Barrage | Mint Gale, ice shard | ⚠️ ขาด lance volley/hail (M1) |
| | Crystal Impaler | lance trail, lance shatter | ⚠️ ขาด charge glow + Impale stack + Rupture (M2) |
| 🍫 Chocolate (cocoa) | ทุกสาย | idle/run/attack sheet ร่วม 1 ชุด, punch impact | ❌ **ขาดเยอะมาก** — แต่ละสายต้องมีท่าเฉพาะ (C1–C3) |

ลำดับความสำคัญ: **C (Chocolate) ก่อน** → M → S

---

## กติกาเทคนิคเฉพาะใบนี้

| หัวข้อ | กฎ |
|---|---|
| Character sheet | เฟรม **256×256** (วาดใหญ่ เกมย่อเอง) · grid ระบุในแต่ละรายการ · ตัวละครยืนตำแหน่งเดียวกันทุกเฟรม · ground line เดียวกัน (ล่าง ~8%) · หันขวาทุกเฟรม (เกม flip เอง) |
| สัดส่วน | ต้องตรงกับ Chocolate ปัจจุบัน `assets/char_cocoa_attack_sheet.png` / `char_cocoa_run_sheet.png` (หัวโต ถุงมือหมีใหญ่ chibi) — ใช้เป็นภาพอ้างอิงทุกครั้ง |
| ท่าที่ลอยตัว (กระโดด) | วาดตัวลอยสูงขึ้นในเฟรม **แต่ไม่ต้องวาดเงา** — เกมวาดเงาบนพื้นเอง · เว้นที่ด้านบนเฟรมพอสำหรับจุดสูงสุด |
| VFX | **พื้นดำสนิท #000** (เอฟเฟกต์แสง/ไฟ) หรือ alpha จริง (เศษ/ฝุ่น/หิน) · ระบุในตาราง · เฟรมละ 256×256 เว้นขอบ 8% |
| จำนวนเฟรม | ตามตาราง · animation ต้องวนต่อเนื่องได้ถ้าเขียนว่า loop |
| ห้าม | ตัวหนังสือ, เส้นคั่นเฟรม, พื้นหมากรุก, เงาตัวละคร |

Prompt หัวท้ายร่วม:
> cute pastel confectionery fantasy game sprite sheet, chibi chocolate bear-glove brawler girl, mobile game, 3/4 top-down view, soft dark brown outline, glossy candy highlights, consistent character in every frame, same position and ground line, facing right, evenly spaced grid, no text, no watermark, transparent background

---

## C — Chocolate (cocoa) · ชุดใหญ่

ปัจจุบันทั้ง 3 สายใช้ท่าต่อยร่วมกันชุดเดียว → แต่ละสายต้องมี **ตัวตนในท่าทาง** ชัดเจน

### C1 · 🔥 Fire Fist (id `brawler`) — ยิงหมัดไฟระยะไกล

กลไก: ต่อยลมแล้ว "หมัดไฟ" พุ่งออกไปเป็นกระสุน · ทุกหมัดที่ 5 = ลูกไฟใหญ่ทะลุแล้วระเบิด · Unique = Rocket Gauntlet (ถุงมือไฟติดตามเป้า เกาะบอสแล้วระเบิดซ้ำ)

| key | ชนิด | grid / เฟรม | รายละเอียด |
|---|---|---|---|
| `cocoa_fire_jab_sheet` | ตัวละคร | 4×2 = 8 | สลับหมัดซ้าย-ขวายิงไปข้างหน้า แขนยืดสุด ถุงมือมีเปลวไฟ · เฟรม 0–3 หมัดขวา, 4–7 หมัดซ้าย · ไหล่หมุนตาม |
| `cocoa_fire_finisher_sheet` | ตัวละคร | 4×2 = 8 | หมัดที่ 5: ง้างถอยหลัง (0–2) ไฟลุกท่วมถุงมือ (3) ปล่อยหมัดหนักเต็มแรง ตัวเอนไปข้างหน้า (4–5) แรงสะท้อนถอย (6–7) |
| `cocoa_rocket_launch_sheet` | ตัวละคร | 4×2 = 8 | Unique: ยกแขนชี้ฟ้า ถุงมือหลุดออกเป็นจรวด (ตัวละครเหลือมือเปล่ามีประกายไฟ) แล้วถุงมือใหม่งอกกลับในเฟรมท้าย |
| `vfx_fire_fist_proj` | VFX ดำ | 4×1 = 4 loop | กระสุนหมัดไฟเล็ก (หมัดหมีเรืองส้ม + หางเปลวไฟ) หันขวา · loop |
| `vfx_fireball_big` | VFX ดำ | 4×1 = 4 loop | ลูกไฟหมัดที่ 5 ใหญ่กว่า 2 เท่า หางยาว แกนเหลืองขาว |
| `vfx_fireball_explode` | VFX ดำ | 4×2 = 8 | ระเบิดไฟรูปหัวหมีจาง ๆ ตรงกลาง วงไฟขยาย ควันช็อกโกแลต |
| `vfx_rocket_gauntlet` | VFX ดำ | 4×1 = 4 loop | ถุงมือหมีมีไอพ่นไฟด้านหลัง |
| `vfx_gauntlet_stick` | VFX ดำ | 4×2 = 8 | ถุงมือเกาะติดเป้า กระพริบแดง แล้วระเบิดเล็ก (ใช้ซ้ำ 3–4 ครั้ง) |
| `vfx_fire_pool` | VFX alpha | 4×1 = 4 loop | แอ่งไฟ/ลาวาช็อกโกแลตบนพื้น มุมมองแบน (Ember Trail, Napalm) |
| `vfx_fire_meteor` | VFX ดำ | 4×2 = 8 | อุกกาบาตไฟตกจากฟ้า (Evolution Inferno Overdrive) เฟรม 0–3 ตก, 4–7 กระแทก |

### C2 · 🗿 Titan (id `titan`) — **กระโดดทุบ (เจ้าของขอ)**

เจ้าของต้องการให้ Titan เป็นแนว **กระโดดโจมตี**: ทุก combo และ Colossus Fist คือการกระโดดขึ้นแล้วทุบลงพื้น
กลไกปัจจุบัน: กดค้างปุ่ม Unique = ชาร์จ Blood Rage 3 ระดับ (เดินได้ เสียเลือด) · ปล่อย = Colossus Fist (ระดับ 4 ถ้ามี Capstone Rage Four)

| key | ชนิด | grid / เฟรม | รายละเอียด |
|---|---|---|---|
| `cocoa_titan_leap_slam_sheet` | ตัวละคร | 4×3 = 12 | **ท่าหลัก combo**: ย่อตัว (0–1) → กระโดดขึ้นสองมือชูเหนือหัว (2–4) → จุดสูงสุดกำหมัดคู่ (5) → ดิ่งลง (6–7) → ทุบพื้นด้วยสองหมัด ตัวยุบ squash (8) → ฝุ่นเศษดิน ตัวเด้งกลับ (9–11) |
| `cocoa_titan_light_hop_sheet` | ตัวละคร | 4×2 = 8 | หมัด 1–4 ของ combo: กระโดดสั้นเตี้ยแล้วทุบหมัดเดียว (เร็วกว่า เบากว่า) |
| `cocoa_titan_charge_sheet` | ตัวละคร | 4×2 = 8 loop | **ชาร์จ Blood Rage** ระหว่างกดค้าง: ยืนกางขา กำหมัดแน่น ตัวสั่น ไอแดงลอยขึ้น ตาเรืองแดง · ต้องดูดีทั้งตอนยืนและตอนเดินช้า |
| `cocoa_titan_charge_walk_sheet` | ตัวละคร | 4×3 = 12 loop | เดินขณะชาร์จ: ก้าวหนักช้า หมัดกำ ไอแดงรอบตัว (ใช้แทน run เมื่อกดค้าง) |
| `cocoa_titan_colossus_sheet` | ตัวละคร | 4×4 = 16 | **Colossus Fist**: ปล่อยปุ่ม → กระโดดสูงมาก (0–4) ตัวเล็กลงเหมือนลอยขึ้นฟ้า → จุดสูงสุดถุงมือขยายใหญ่ (5–7) → ดิ่งพุ่งลง (8–10) → ทุบกระแทกพื้นแรงสุด (11) → ยืนขึ้นในหลุม (12–15) |
| `vfx_titan_landing_crack` | VFX alpha | 4×2 = 8 | พื้นแตกร้าวรูปดาวตอนทุบ + เศษหินช็อกโกแลตกระเด็น · มุมแบนพื้น |
| `vfx_titan_shockwave` | VFX ดำ | 4×2 = 8 | วงคลื่นกระแทกแผ่ออก สีส้ม-ทอง (ระดับปกติ) |
| `vfx_titan_rage_aura` | VFX ดำ | 4×2 = 8 loop | ออร่าไฟแดงรอบตัวระหว่างชาร์จ · ทำ **3 สี**: `_lv1` ส้ม, `_lv2` แดงส้ม, `_lv3` แดงเข้ม+ประกายทอง (3 ไฟล์) |
| `vfx_titan_crush_burst` | VFX ดำ | 4×3 = 12 | ระเบิดตอน Colossus Fist ระดับ 3: เสาแสงแดง-ทอง + หมัดหมียักษ์โปร่งแสงตกลงมา + วงกระแทกใหญ่ |
| `vfx_titan_lava_crater` | VFX alpha | 4×1 = 4 loop | หลุมลาวาช็อกโกแลตค้างบนพื้น (การ์ด Lava Crater) |

### C3 · 🐾 Dash Boxer (id `dashboxer`) — พุ่งทุบแบบ Xiao

กลไก: กด Dash = พุ่งร่อนไปหาเป้าแล้วทุบลงตอนถึง · Unique Phantom Rush = พุ่งอัตโนมัติ 3–4 ครั้งใส่เป้าแข็งสุด แล้ว Dash ฟรีชั่วคราว · Evolution ยิงหมัดเงาตามทุก Dash

| key | ชนิด | grid / เฟรม | รายละเอียด |
|---|---|---|---|
| `cocoa_dash_leap_sheet` | ตัวละคร | 4×2 = 8 | ย่อตัว (0) → พุ่งเฉียงขึ้นไปข้างหน้าตัวเอียง 45° หมัดนำ (1–4) → ดิ่งลง (5) → ทุบพื้น (6) → ลุก (7) |
| `cocoa_dash_jab_sheet` | ตัวละคร | 4×2 = 8 | combo ปกติ: แย็บไว ฟุตเวิร์กกระเด้ง (สไตล์นักมวย) เบากว่า Fire Fist ไม่มีไฟ ใช้สีม่วง |
| `cocoa_phantom_rush_sheet` | ตัวละคร | 4×2 = 8 | Unique: ตัวโปร่งแสงม่วง มีภาพติดตา 2 ชั้น พุ่งทุบต่อเนื่อง |
| `vfx_dash_afterimage` | VFX alpha | 1×1 | เงาตัวละครโปร่งม่วง (ใช้ทำ trail) |
| `vfx_dash_slam_ring` | VFX ดำ | 4×2 = 8 | วงฝุ่น+รอยแตกเล็กตอนลงพื้น สีม่วงอ่อน |
| `vfx_shadow_fist` | VFX ดำ | 4×1 = 4 loop | หมัดเงาม่วงพุ่งตามเป้า (Evolution) |
| `vfx_chain_leap_line` | VFX ดำ | 4×1 = 4 | เส้นพุ่งม่วงระหว่างเป้า (Mutation Chain Leap) |

### C4 · ใช้ร่วมทุกสาย

| key | ชนิด | grid / เฟรม | รายละเอียด |
|---|---|---|---|
| `cocoa_hurt_sheet` | ตัวละคร | 4×1 = 4 | โดนตี สะดุ้ง ถุงมือป้อง |
| `cocoa_victory_sheet` | ตัวละคร | 4×2 = 8 | ชูหมัดฉลอง (หน้าจบด่าน) |

---

## M — Mint · เติมช่องว่าง

Prompt ตัวละครใช้ `assets/char_mint_*` เป็นอ้างอิง (สาวหอกน้ำแข็ง ผมมิ้นต์)

| key | สาย | ชนิด | grid / เฟรม | รายละเอียด |
|---|---|---|---|---|
| `vfx_barrage_volley` | Barrage | VFX ดำ | 4×2 = 8 | หอกน้ำแข็ง 3 เล่มพุ่งพร้อมกันเป็นพัด + เกล็ดหิมะ |
| `vfx_hailstorm` | Barrage (Evo Hailstorm Arsenal) | VFX ดำ | 4×2 = 8 | หอกน้ำแข็งตกจากฟ้าเป็นฝน |
| `vfx_impaler_charge` | Crystal Impaler | VFX ดำ | 4×2 = 8 loop | แสงคริสตัลรวมตัวที่ปลายหอกระหว่างชาร์จ |
| `vfx_impale_stack` | Crystal Impaler | VFX alpha | 3 ไฟล์ 128×128 | คริสตัลเสียบบนตัวมอน 1/2/3 แท่ง (`_1` `_2` `_3`) |
| `vfx_crystal_rupture` | Crystal Impaler | VFX ดำ | 4×2 = 8 | คริสตัลระเบิดแตกออกจากตัวเป้า |
| `mint_lance_throw_charged_sheet` | Crystal Impaler | ตัวละคร | 4×2 = 8 | ง้างหอกนาน (0–3) แสงรวม แล้วขว้างแรง (4–7) |

## S — Strawberry · เติมช่องว่าง

| key | สาย | ชนิด | grid / เฟรม | รายละเอียด |
|---|---|---|---|---|
| `vfx_sniper_impact` | Sniper | VFX ดำ | 4×1 = 4 | กระแทกเมล็ดหัวใจหนัก ประกายชมพู |
| `vfx_pellet_hit` | Shotgun | VFX ดำ | 4×1 = 4 | กระแทกเม็ดเล็ก (ใช้บ่อย ต้องเล็กและเบา) |
| `vfx_ricochet_bounce` | Ricochet | VFX ดำ | 4×1 = 4 | ประกายหัวใจตอนเมล็ดเด้ง |
| `vfx_ricochet_link` | Ricochet | VFX ดำ | 4×1 = 4 loop | เส้นริบบิ้นชมพูเชื่อมระหว่างเป้าที่เด้ง |
| `vfx_heart_pinball_splash` | Ricochet (Evo) | VFX ดำ | 4×2 = 8 | ระเบิดหัวใจตอนเด้งครั้งสุดท้าย |

---

## รูปแบบส่งงาน

```
assets/incoming/build_path_art/
  cocoa_fire/   cocoa_titan/   cocoa_dash/   cocoa_shared/
  mint/         strawberry/
  MANIFEST.md   ← ระบุ key, ขนาดเฟรม, จำนวนเฟรม, ไฟล์ไหน loop, prompt ที่ใช้จริง
```

ส่งเป็น batch ได้: **Batch 1 = C2 Titan** (เจ้าของอยากเห็นก่อน) → Batch 2 = C1 Fire Fist → Batch 3 = C3 + C4 → Batch 4 = Mint → Batch 5 = Strawberry

## ตรวจก่อนส่ง
- เปิดไฟล์บนพื้นสีเข้มและสีสว่าง ต้องไม่มีขอบขาว/พื้นหมากรุก
- เล่นวนเฟรมแล้วตัวละครไม่กระตุกตำแหน่ง (ยกเว้นท่ากระโดดที่ตั้งใจลอย)
- ย่อเหลือ 64px ยังอ่านท่าออก
