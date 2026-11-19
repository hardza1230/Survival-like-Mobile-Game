# 91 — Temple Expedition: ฮีโร่มุมหลัง · ไททันหน้าตรง · ฉากลึก · ใบสั่งงานอาร์ต

สถานะ: ✅ ผูกแล้ว v8.2.33 · รอ QA มือถือ
ส่งไฟล์ที่ `assets/incoming/expedition91/` พร้อม `MANIFEST.json`, `PROMPTS.json`, `QA_REPORT.json`
สไตล์ตาม `00_STYLE_GUIDE.md` · PNG32 alpha จริง · **ห้ามมีตัวหนังสือในภาพ**

## ระบบในเกม (อ้างอิง)
หน้า **⚔️ Temple Expedition** (แทน Temple Depths/Dig + Mochi Patrol): แตะจอ = ฮีโร่ตีไททันที่ยืนกลางจอ · ผู้ช่วยตีเอง · ทุก 5 ด่าน = บอสจับเวลา
**มุมกล้องต่างจากอาร์ตทั้งเกม (มุมเฉียงจากบน):** ที่นี่เป็น **มุมมองข้ามไหล่** — ฮีโร่อยู่ล่างกลางจอ **หันหลังให้ผู้เล่น** หันหน้าเข้าหาไททัน · ไททันยืนกลางจอ **หันหน้าตรงมาหาเรา** · ฉากเป็นทางเดินลึกเข้าไปข้างหน้า
พื้นที่ฉากบนจอ ~370×380px (กว้างเต็มจอ) · ไททันสูง ~170px (บอส ~235px) · ฮีโร่สูง ~130px

## ไฟล์ที่ต้องการ

### A. ฮีโร่มุมหลัง (6) · `ex91_back_<hero>.png` · 4 เฟรม × 256×256 (4×1) · โปร่งใส · anchor เท้า (เส้นพื้นที่ y=240)
hero = momo, mint, cocoa, taro, yuzu, sesame · ต้องตรงกับตัวละครเดิม (ดู `docs/CHARACTER_BIBLE.md`) แต่มองจากด้านหลังเฉียงเล็กน้อย
เฟรม 1 ยืนพร้อม · เฟรม 2 ง้าง · เฟรม 3 ตี/ยิงไปข้างหน้า (อาวุธประจำตัวชี้เข้าหาจอด้านใน) · เฟรม 4 ตามหลังตี · **เฟรม 1 กับ 4 ซิลูเอตต้องใกล้กันมาก** (วนกลับท่ายืนเนียน)

### B. ไททันหน้าตรง (12) · `ex91_titans.png` · 12 เฟรม × 384×384 (4 คอลัมน์ × 3 แถว) · โปร่งใส · anchor เท้า
แถว = Chapter (1 ครัว · 2 สวน · 3 เรือนกระจก) · คอลัมน์ = 4 แบบมอนใหญ่ของ Chapter นั้น (โมจิขนมตัวโต น่ารักแต่ดุ หันหน้าตรง ตัวเต็ม) · ใช้ท่ายืนเดียว (โค้ดทำสะดุ้ง/หายใจเอง)

### C. บอสหน้าตรง (3) · `ex91_bosses.png` · 3 เฟรม × 512×512 (3×1) · โปร่งใส · anchor เท้า
1 บอสครัว (หม้อ/กระทะยักษ์มีหน้า) · 2 บอสสวน (ต้นไม้แม่มีราก) · 3 บอสเรือนกระจก (ผู้พิทักษ์แก้ว) · ใหญ่ ดูน่าเกรงขามกว่าแถว B

### D. ฉากหลังมุมลึก (3) · `ex91_bg_c1.png` `ex91_bg_c2.png` `ex91_bg_c3.png` · 768×800 · ทึบ (ไม่ต้องโปร่ง)
ทางเดินในวิหารขนมทอดลึกเข้าไปข้างหน้า จุดหายลับตรงกลางสูง ~40% · พื้นที่กลางจอว่างให้ไททันยืน · โทนตาม Chapter (ครัวอบอุ่น · สวนเขียวม่วง · เรือนกระจกฟ้าใส)

### E. เอฟเฟกต์แตะ · `ex91_hit.png` · 6 เฟรม × 192×192 (6×1) · ครั้งเดียว · **พื้นดำ #000** · แสดงจริง ~120px
แสงปะทะรูปดาวขนม + เศษน้ำตาลกระจาย (โค้ดย้อมสีตามฮีโร่ → วาดสีขาวนวล/เหลืองอ่อน)

### F. ไอคอนแผงล่าง · `ex91_icons.png` · 6 เฟรม × 96×96 (6×1) · โปร่งใส · แสดงจริง ~22px
1 Crumbs (เศษคุกกี้ 3 ชิ้น) · 2 แตะ (มือโมจิชี้) · 3 ผู้ช่วย (โมจิ 2 ตัวกอดคอ) · 4 Supplies (กระเป๋าเป้) · 5 กล่องรายวัน · 6 นาฬิกาบอส

**รวม 13 ไฟล์ (6+1+1+3+1+1)**

## ข้อห้าม
- ห้ามตัวหนังสือ · ฮีโร่ต้อง on-model (สี/ทรง/อาวุธเดิม) · ห้ามลอกหน้าตาจากเกมอื่น
- ไททัน/บอสหน้าตรงต้องอ่านออกที่ 170px · ห้ามสว่าง/อิ่มสีกว่าฮีโร่

## โน้ตฝั่งโค้ด
- แพ็ก WebP (≤2× จอ: ฮีโร่ 256 → 192 · ไททัน 384 → 320 · บอส 512 → 448 · bg 768×800 คงไว้) → `assets/art/expedition91/` · menu-lazy เมื่อเปิดหน้า `dig` (เพิ่มใน `menuGroupRe`)
- `buildExpedition`: D แทน `patrolScene` · `expFoeDraw`: B/C แทน `pt_foes` ขยาย · A แทน `char_<hero>` (เฟรม 2–4 ตอน `expHit` tap) · E ตอนแตะ · F ในแถบ/แถว · ไม่มีภาพ = ของเดิม
- งบ: ~1.5 MB WebP · decoded ≲ 20 MiB (โหลดเฉพาะ Chapter ที่อยู่)

## ส่งมอบ
- Date: 2026-11-19. All13 requested PNG32 files delivered to `assets/incoming/expedition91/` (54 total frames). Missing: none.
- A: `ex91_back_momo.png`, `ex91_back_mint.png`, `ex91_back_cocoa.png`, `ex91_back_taro.png`, `ex91_back_yuzu.png`, `ex91_back_sesame.png` —6 rear-facing hero attack cycles,4x256px each, feet at y240. Existing character bible and six current lobby sprite references were read/viewed before generation.
- B: `ex91_titans.png` —12 full-body front-facing titans,4x3 grid384px, kitchen/garden/glasshouse rows.
- C: `ex91_bosses.png` —3 full-body front-facing bosses,3x1 grid512px: giant cooking pot, mother tree, glass guardian.
- D: `ex91_bg_c1.png`, `ex91_bg_c2.png`, `ex91_bg_c3.png` —3 opaque768x800 deep encounter scenes with clear central floor.
- E: `ex91_hit.png` —6x192px one-shot impact on pure#000, warm ivory for code-side hero tinting.
- F: `ex91_icons.png` —6x96px icons in the exact table order.
- Included `MANIFEST.json`, actual `PROMPTS.json`, and compact per-file `QA_REPORT.json`. Exact dimensions/grids, real alpha or opaque/#000 backgrounds, all54 nonempty frames, safe margins, ground lines, hashes and bytes independently verified. Hero frame1/4 silhouette IoU: 95.0%–97.4%, height ratios within5%.
- ImageGen source art only. Source branch: `asset-delivery/expedition91`. No game.js, runtime, tests or release changes. Owner phone review and code-side packing/wiring pending.
