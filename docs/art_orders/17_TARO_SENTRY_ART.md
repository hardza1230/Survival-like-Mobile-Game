# 17 — Taro Sentry Build (id `tempest`) · วิเคราะห์ build + ใบสั่งงานอาร์ต

สถานะ: ร่าง 15 ต.ค. 2026 อิง runtime v7.8.18 · อ่าน `00_STYLE_GUIDE.md` ก่อน
ส่งไฟล์ที่ `assets/incoming/taro_sentry/` ตามชื่อในตาราง · ฝั่งโค้ดแพ็กเป็น WebP แล้วผูกเอง (ไม่ต้องย่อเอง)

> ชื่อภายในกับชื่อในเกมไม่ตรงกัน: path id `tempest` = **Sentry Build** · `smite` = Spark · `storm` = Arc (คงไว้เพื่อเซฟเก่า)

---

## 1. Build ตอนนี้ทำงานยังไง (อ่านจากโค้ดจริง)

| ส่วน | ค่าปัจจุบัน | ที่อยู่ในโค้ด |
|---|---|---|
| การตีปกติ | วาง Sentry ข้างตัว Taro (ห่าง 40px มุม ±0.7 rad สลับกัน) ทุก `deploy = max(0.55, unitC)` วิ | `castTaroSentry` |
| เพดาน | Sentry ปกติ 2 ตัว (ตัวเก่าสุดโดนแทน) + Beacon 1 ตัว · ลูกบอลรวมทั้งหมด 12 ลูก | `taroPlaceNode`, `taroSpawnProjectile` |
| อายุ Sentry | `min(8, 5 + arc×0.35)` วิ | `taroSwarmProfile` |
| ยิง | ทุก `pulse = max(0.35, unitC×0.62×0.9^RapidPulse)` วิ ยิง Ball Lightning 1 ลูกตรงไปหาศัตรูใกล้สุด | `tickTaroDeployables` |
| Ball Lightning | ความเร็ว 150 · รัศมีชน 60→95px (Wide Conductor/การ์ดเพิ่ม root) · ทะลุศัตรู โดนตัวเดิมซ้ำได้ทุก 0.30 วิ · ดาเมจ `unitD×0.22` ต่อครั้ง | `taroProjectileHit` |
| Unique Storm Beacon | Sentry พิเศษ 1 ตัว (ขอบทอง) cd 8.5 วิ · อยู่ 5/6/7/8 วิ ตาม Lv · ดาเมจ `(9+7n)×dm×(1+0.22(n−1))×0.35` | `castStormBeacon`, `taroBeaconProfile` |
| การ์ดเฉพาะสาย | Quick Reposition (Dash), Long-Range Current (+ดาเมจไกลกว่า 300px), Rapid Pulse | `BASIC_PATHS.taro` |
| การ์ดร่วม (แปลชื่อตามสาย) | Reserve Cell (+0.35 วิ อายุ), Wide Conductor (+8% รัศมีลูกบอล), Power, Rate (เร่งทั้งวาง+ยิง) | `TARO_PROGRESSION.tempest` |
| Talent | root/b1/capA = เร่งวาง+ยิง (capA Rapid Grid −25%) · b2 +8% ระยะ · a2/capB ดาเมจไกล · capC ลดดาเมจที่รับตอนเดิน | `PATH_TALENTS.tempest` + overlay |

ตัวอย่างตัวเลข (ไม่มีการ์ด): skill Lv1 → วางทุก 2.12 วิ, ยิงทุก 1.31 วิ/ตัว, ลูกละ ~4×dmgMul ต่อครั้ง · Lv6 → วางทุก 1.46 วิ, ยิงทุก 0.91 วิ/ตัว

### ปัญหาที่เจอ (ต้องแก้โค้ดก่อนหรือพร้อมอาร์ต)

1. **ความเร็ววางกินอายุ Sentry** — เพดาน 2 ตัว + วางใหม่ทุกรอบ ทำให้ Sentry อยู่จริงแค่ `2×deploy` วิ (Lv1 ≈ 4.2 วิ, Lv6 ≈ 2.9 วิ, อัปเร็วสุด 0.55 → 1.1 วิ) ไม่ใช่ 5–8 วิตามการ์ด
   - Reserve Cell, Chainlord, Evolution (ยืดอายุ) แทบไม่มีผล
   - Rate/Talent/Rapid Grid ยิ่งอัป Sentry ยิ่งกะพริบเกิด-หาย
2. **เพดานลูกบอล 12 ลูก** — ยิงถี่สุด (0.35 วิ × 3 ตัว) อยากได้ ~22 ลูก ส่วนเกินหายเงียบ การ์ดเร่งยิงรอบท้าย ๆ ไม่ได้อะไร
3. **ภาพลูกบอลเล็กกว่าระยะชนจริงมาก** — วาดวง r15 (กว้าง 30px) แต่ชนจริงรัศมี 60–95 (กว้าง 120–190px) ผู้เล่นมองไม่เห็นว่าลูกบอลกวาดพื้นที่แค่ไหน
4. **ไม่มีจังหวะภาพเลย** — Sentry โผล่/หายทันที ไม่มีท่าวาง ไม่มีแฟลชตอนยิง ไม่มีท่าหมดอายุ
5. **Unique = Sentry อีกตัวหน้าตาเดิม** — แค่ขอบทอง ไม่มีโมเมนต์ใหญ่ ดาเมจเบา (Lv1 ≈ 5.6×dm ต่อครั้ง)
6. **ทำลายกล่อง (crate) ไม่ได้** — ลูกบอลเช็คแค่ศัตรู ไม่เรียก `hitCratesInRadius` (สาย Arc เดิมเรียก) สาย Sentry ล้วนเปิดกล่องดรอปไม่ได้
7. **การ์ดเฉพาะสายมี 3 ใบ** (Spark มี 5) และ 1 ใบเป็น Dash ไม่เกี่ยวกับป้อม
8. ค่า `base:{dmg:0.65,cd:0.85}` ของสายไม่ถูกใช้ใน `taroSwarmProfile` (เป็นตัวเลขโชว์เฉย ๆ)

### ข้อเสนอแก้กลไก — ✅ เจ้าของอนุมัติทั้งหมด ทำแล้วใน v7.8.19

ข้อ 1–6 แก้แล้ว (เหลือข้อ 8 ตัวเลข base ที่ไม่ใช้ ไม่กระทบเกม) · การ์ด Dash ถูกแทนด้วย Overload + Tesla Link (สายนี้มีการ์ดเฉพาะ 4 ใบ) · อาร์ตชุด B ใช้ได้ทุกชิ้นแล้ว

- **แยกจังหวะวางกับยิง:** วางใหม่เฉพาะตอนมี Sentry ไม่ครบ 2 ตัว หรือ Taro เดินห่าง Sentry ตัวเก่าเกิน ~350px → Sentry อยู่ครบอายุ · การ์ด Rate ไปเร่ง pulse อย่างเดียว
- **ขยับเพดานลูกบอลเป็น 16** หรือเปลี่ยนเป็น "ลูกใหญ่ขึ้นแทนลูกเพิ่ม" เมื่อชนเพดาน
- **ลูกบอลโดนกล่องได้**
- **Beacon ตอนวาง = สายฟ้าฟาดลงพื้นหนึ่งครั้ง** (AoE ~200px) แล้วค่อยเป็นป้อม · ระหว่างที่ Beacon อยู่ Sentry ปกติยิงเร็วขึ้น (Overcharge) → Unique ของสายนี้มีตัวตน
- การ์ดใหม่ 1–2 ใบแทน Dash: เช่น *Overload* (ลูกบอลระเบิดตอนหมดอายุ), *Tesla Link* (Sentry 2 ตัวมีสายฟ้าเชื่อมกัน ดาเมจคนที่เดินผ่าน) — อาร์ตชุด B รองรับไว้แล้ว

---

## 2. ทิศทางอาร์ต

- **ตัวตน:** "เข็มทิศพายุ" ของ Taro (โมจิเผือกม่วง) — ป้อมคริสตัลม่วงลาเวนเดอร์ แกนเข็มทิศลอย สายฟ้าฟ้าซีด
- **สีหลัก:** ม่วงพลัม `#4a2d6b` (เส้นขอบ) · ลาเวนเดอร์ `#c6a2ed` · ไฟฟ้าฟ้าซีด `#c6e9ff` · ขาวแกน `#f4edff` · **Beacon = ทอง `#ffda89` + ม่วง**
- **แยกจากสายอื่นของ Taro:** Arc = เส้นสายฟ้ายาว · Spark = ประกายเล็กหางสั้น · **Sentry = ทรงกลมฟูนุ่มลอยช้า + ป้อมตั้งพื้น**
- อ้างอิงที่มีแล้ว: `assets/art/taro_swarm/sentry.webp` (ป้อม 128px, ใช้เป็นแบบรูปทรง/สี — งานใหม่ต้องเข้าชุดกับตัวนี้)
- ต้องอ่านออกที่ขนาดจริงบนจอ: ป้อม ~58px, Beacon ~80px, ลูกบอล 120–190px (โปร่งพอให้เห็นศัตรูข้างใน)
- ห้ามสว่าง/ทึบจนบังศัตรูและกระสุนศัตรู → ลูกบอลขอบชัด กลางโปร่ง (alpha กลาง ≤ 0.45)

---

## 3. รายการไฟล์

กฎร่วม: เฟรมจัตุรัส เรียงซ้าย→ขวา บน→ล่าง ไม่มีเส้นคั่น · วัตถุอยู่กลางเฟรมตำแหน่งเดิมทุกเฟรม เว้นขอบ 8% · ไม่มีตัวหนังสือ/เงาตัวละคร
"alpha" = พื้นโปร่งใสจริง · "ดำ" = พื้นดำสนิท #000 (เอฟเฟกต์แสง ฝั่งโค้ดแปลง alpha เอง)

### A — จำเป็น (ทำก่อน)

| # | key / ไฟล์ | ชนิด | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด |
|---|---|---|---|---|---|---|
| A1 | `taro_sentry_idle_sheet.png` | ป้อม alpha | 4×1 = 4 · loop | 256 | 58px | ป้อมแบบเดียวกับ `sentry.webp` · คริสตัลกลางลอยขึ้นลงเล็กน้อย + หมุนช้า · ประกายฟ้าวิ่งในง่าม 3 ง่ามสลับเฟรม · ฐานนิ่ง |
| A2 | `taro_sentry_deploy_sheet.png` | ป้อม alpha | 3×2 = 6 · ครั้งเดียว | 256 | 58px | วางป้อม: (0) วงรูนแบนบนพื้น (1–2) ฐานโมจิเด้งขึ้นจากพื้นแบบ squash (3) ง่ามคริสตัลกางออก (4) คริสตัลกลางลอยขึ้นสว่าง (5) = เฟรมแรกของ idle · รวม ~0.35 วิ |
| A3 | `taro_sentry_fire_sheet.png` | ป้อม alpha | 4×1 = 4 · ครั้งเดียว | 256 | 58px | ท่ายิง: คริสตัลกลางหดเก็บแสง (0) แฟลชขาว-ฟ้าที่ปลาย (1) ง่ามเด้งถอย (2) กลับปกติ (3) · ไม่ต้องหันทิศ (ลูกบอลออกจากกลาง) |
| A4 | `taro_sentry_expire_sheet.png` | ป้อม alpha | 3×2 = 6 · ครั้งเดียว | 256 | 58px | หมดอายุ: ประกายดับ (0–1) คริสตัลร่วงลงฐาน (2) ฐานยุบเป็นแป้งนุ่ม (3–4) เหลือควันม่วงจาง (5) |
| A5 | `vfx_taro_ball_lightning.png` | VFX ดำ | 3×2 = 6 · loop | 256 | 120–190px (โค้ดย่อขยายตามรัศมีชน) | ลูกบอลสายฟ้าฟู: **ขอบวงชัดกินพื้นที่ ~84% ของเฟรม** (ขอบ = ขอบระยะชนจริง) · แกนกลางเข็มทิศ/ดาวม่วงเล็ก · เส้นสายฟ้าฟ้าขดในวงเปลี่ยนรูปทุกเฟรม · กลางโปร่ง ห้ามทึบทั้งลูก |
| A6 | `vfx_taro_orb_zap.png` | VFX ดำ | 4×1 = 4 · ครั้งเดียว | 128 | ~48px บนศัตรู | ช็อตตอนลูกบอลโดนศัตรู: ประกายแตกกระจาย 4–6 แฉก ฟ้า-ขาว แกนม่วง · สั้น ~0.2 วิ |
| A7 | `vfx_taro_orb_launch.png` | VFX ดำ | 4×1 = 4 · ครั้งเดียว | 128 | ~64px ที่ปลายป้อม | แฟลชตอนปล่อยลูกบอล: วงแสงหดเข้าแล้วระเบิดออกเล็ก ๆ |

### B — Unique Storm Beacon + กลไกเสนอ (ทำหลังเจ้าของเลือกข้อเสนอแก้กลไก)

| # | key / ไฟล์ | ชนิด | grid · เฟรม | ขนาดเฟรม | บนจอ | รายละเอียด |
|---|---|---|---|---|---|---|
| B1 | `taro_beacon_idle_sheet.png` | ป้อม alpha | 4×1 = 4 · loop | 256 | ~80px | Beacon ทรงสูงกว่าป้อมปกติ: เสาคริสตัลม่วงสูง ยอดเป็น **เข็มทิศทองหมุน** มีวงแหวนทองลอยรอบ · ต้องแยกจากป้อมปกติได้ทันทีด้วยทรงสูง+สีทอง |
| B2 | `vfx_taro_beacon_strike.png` | VFX ดำ | 4×2 = 8 · ครั้งเดียว | 256 (กว้าง) × 512 (สูง) | สูง ~260px | ตอนกด Unique: สายฟ้าทอง-ม่วงฟาดจากบนลงจุดวาง (0–3) กระแทกพื้นเป็นวงช็อก (4–7) · anchor ล่างกลาง |
| B3 | `vfx_taro_beacon_ring.png` | VFX ดำ | 3×2 = 6 · ครั้งเดียว | 256 | ~400px | วงคลื่นไฟฟ้าแผ่บนพื้น (มุมมองแบน วงรี) ขอบทอง ลวดลายเข็มทิศ 8 ทิศ · ใช้คู่กับ B2 |
| B4 | `vfx_taro_overcharge_aura.png` | VFX ดำ | 4×1 = 4 · loop | 128 | ~70px บนป้อม | ออร่าทองครอบป้อมปกติตอนอยู่ใกล้ Beacon (ยิงเร็วขึ้น) |
| B5 | `vfx_taro_tesla_link.png` | VFX ดำ | 1×4 = 4 · loop | 512 (กว้าง) × 64 (สูง) | ยืดตามระยะ | สายฟ้าแนวนอนเชื่อมป้อม 2 ตัว (การ์ดเสนอ Tesla Link) · ปลายซ้าย-ขวาต่อเนื่อง ยืดแนวนอนได้ไม่แตก |
| B6 | `vfx_taro_orb_burst.png` | VFX ดำ | 3×2 = 6 · ครั้งเดียว | 256 | 120–190px | ลูกบอลระเบิดตอนหมดอายุ (การ์ดเสนอ Overload) · วงขยาย + เศษประกาย |

### C — ไอคอนการ์ด/สาย (alpha, 256×256, โชว์ 44–64px)

ตอนนี้สายนี้ยืมไอคอนสายอื่นทั้งหมด (`ic_taro_rate` ใช้ 5 ที่, Reserve Cell ใช้ไอคอน Arc)

| # | key | ใช้กับ | ภาพ |
|---|---|---|---|
| C1 | `ic_path_tempest_sentry` | ไอคอนสาย Sentry Build (แทน `fx_taro_sentry`) | ป้อมคริสตัลกับลูกบอลไฟฟ้าลอยข้าง ๆ |
| C2 | `ic_taro_reserve_cell` | Reserve Cell (+อายุ) | แบตคริสตัลม่วงมีขีดพลังงานเต็ม + นาฬิกาทราย |
| C3 | `ic_taro_wide_conductor` | Wide Conductor (+รัศมีลูกบอล) | ลูกบอลไฟฟ้าขยายมีลูกศรออก 4 ทิศ |
| C4 | `ic_taro_rapid_pulse` | Rapid Pulse | ป้อมยิงลูกบอล 3 ลูกเรียงติดกัน + เส้นความเร็ว |
| C5 | `ic_taro_long_current` | Long-Range Current | ลูกบอลวิ่งไกลมีเส้นเล็งปลายเป้า |
| C6 | `ic_taro_storm_beacon` | Unique Storm Beacon (ปุ่ม Unique/การ์ด Unique) | เสา Beacon ทองถูกสายฟ้าฟาด |

ไอคอน: พื้นหลังวงกลม/กรอบไม่ต้องใส่ (เกมวาดกรอบเอง) · วัตถุเดียว กลางภาพ silhouette ชัดที่ 44px

---

## 4. Prompt

หัวร่วม (ต่อท้ายทุกชิ้น):
> cute pastel confectionery fantasy game asset for Mochi Mayhem mobile game, Taro the purple taro mochi storm-compass hero, violet lavender crystal and pale cyan lightning, 3/4 top-down view, strong dark plum outline, glossy candy highlights, readable silhouette at small size, centered, no text, no watermark, no UI frame

| ชิ้น | prompt เฉพาะ |
|---|---|
| A1 | sprite sheet 4 frames in one row, same small squat magical lightning compass turret as reference: round plum mochi pedestal, three rounded lavender crystal prongs, floating violet compass crystal bobbing up and down and slowly turning, tiny pale cyan sparks running inside the prongs, identical position every frame, transparent alpha background, no ground shadow |
| A2 | sprite sheet 6 frames 3x2, the same lightning compass turret being deployed: flat glowing rune circle on ground, soft mochi base pops up with squash and stretch, crystal prongs unfold, center crystal rises and lights up, ends on the idle pose, transparent alpha background |
| A3 | sprite sheet 4 frames in one row, the same turret firing: center crystal gathers light, white-cyan flash at the tip, prongs recoil slightly, returns to rest, transparent alpha background |
| A4 | sprite sheet 6 frames 3x2, the same turret expiring: sparks fade out, crystal drops into the base, mochi base slumps soft, small violet smoke puff remains, transparent alpha background |
| A5 | VFX sprite sheet 6 frames 3x2 loop, fluffy ball lightning orb, clear bright circular rim filling 84 percent of each frame, translucent center, tiny violet compass star core, pale cyan curling lightning filaments inside changing every frame, on solid pure black background |
| A6 | VFX sprite sheet 4 frames in one row, small electric zap burst, 4 to 6 cyan-white spikes with violet core, quick fade, on solid pure black background |
| A7 | VFX sprite sheet 4 frames in one row, small muzzle flash, ring of light contracts then pops outward, cyan and violet, on solid pure black background |
| B1 | sprite sheet 4 frames in one row loop, tall storm beacon pylon, violet crystal column with a spinning golden compass on top and a floating golden ring, soft mochi base, matches the small turret style but taller and gold-accented, transparent alpha background |
| B2 | VFX sprite sheet 8 frames 4x2, tall frame 256x512, gold and violet lightning bolt striking down from the top to the bottom center, then a shock impact on the ground, on solid pure black background |
| B3 | VFX sprite sheet 6 frames 3x2, flat elliptical electric shockwave ring on the ground seen from 3/4 top-down, golden rim with 8-point compass pattern, expanding and fading, on solid pure black background |
| B4 | VFX sprite sheet 4 frames in one row loop, soft golden overcharge aura with small sparks around a small turret, translucent, on solid pure black background |
| B5 | VFX sprite sheet 4 frames stacked vertically, each frame 512x64, horizontal crackling lightning beam from left edge to right edge, cyan core violet glow, seamless ends, on solid pure black background |
| B6 | VFX sprite sheet 6 frames 3x2, ball lightning orb bursting outward, expanding ring and scattered sparks, cyan and violet, on solid pure black background |
| C1–C6 | single game card icon, isolated object, transparent alpha background, (ใส่คำบรรยายภาพจากตาราง C เป็นภาษาอังกฤษ) |

---

## 5. ฝั่งโค้ดจะผูกยังไง (โน้ตสำหรับ AI ที่ทำต่อ)

- ป้อม: `taroNodeVisual` เปลี่ยนจาก `image('fx_taro_sentry')` เป็น sprite เล่น deploy → idle loop · ยิง (`tickTaroDeployables` ตอน spawn orb) เล่น fire 1 รอบ · หมดอายุ (`taroRemoveNode` เพราะ `left<=0`) เล่น expire ก่อน destroy · ถูกแทนที่ก็เล่น expire เร็ว · ไม่มีไฟล์ = fallback ภาพเดิม
- ลูกบอล: `taroProjectileVisual` kind `sentry`/`beacon` ใช้ A5 `setDisplaySize(radius×2.38)` (ขอบ 84% = รัศมีชน) · beacon ย้อมทอง `0xffda89` หรือใช้เฟรมเดิม tint · blend NORMAL ตามกฎโปรเจกต์ (alpha จากความสว่าง)
- ช็อตโดนศัตรู: `taroProjectileHit` ฝั่ง non-spark เรียก A6 แทน/คู่กับ `taroLightningVisual` · อยู่ใต้เพดาน FX 20 ของ Taro
- Unique: `castStormBeacon` เล่น B2+B3 ก่อนวาง B1 (ถ้าเจ้าของเลือกข้อเสนอ "สายฟ้าฟาดตอนวาง")
- ไอคอน: `BASIC_PATHS.taro` tempest `iconKey` + `TARO_PROGRESSION`/descriptor ของ arc/surge/p_sentry_pulse/p_farstrike
- เสียง (สร้างด้วย jsfxr ตามกฎโปรเจกต์): deploy ตอนนี้ยืม `taro_smite` · beacon ยืม `taro_ready` → ขอเสียงใหม่ `taro_sentry_deploy`, `taro_sentry_fire` (เบา, ห้ามดังทุกลูกเกิน 4 ครั้ง/วิ), `taro_sentry_expire`, `taro_beacon_strike`
- ลงทะเบียน: ไฟล์จริงไป `assets/art/taro_sentry/` + MANIFEST.json/PROMPTS.json · ตรวจ alpha/ขนาด · `npm run check` + `npm run build:www`

## 6. ลำดับงานที่แนะนำ

1. ✅ เจ้าของเลือกข้อเสนอ · ✅ แก้กลไก (v7.8.19)
2. ผูก A1–A7 พร้อม fallback
3. B ตามที่เลือก + เสียง
4. C ไอคอน
5. เจ้าของเล่นบนมือถือ: อ่านป้อม/ลูกบอลออกไหม, FPS ตอนลูกบอลเต็ม 12–16 ลูก
