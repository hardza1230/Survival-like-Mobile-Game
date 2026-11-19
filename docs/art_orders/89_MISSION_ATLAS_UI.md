# 89 — Mission Atlas (หน้าอัปเกรดภารกิจ) · ใบสั่งงานอาร์ต

สถานะ: ✅ ผูกแล้ว v8.2.31 · รอ QA มือถือ
ส่งไฟล์ที่ `assets/incoming/atlas89/` พร้อม `MANIFEST.json`, `PROMPTS.json`, `QA_REPORT.json`
สไตล์ตาม `00_STYLE_GUIDE.md` · PNG32 alpha จริง · **ห้ามมีตัวหนังสือในภาพ**

## ระบบในเกม (อ้างอิง)
Recipe Book → Missions → ปุ่ม **🗺️ Atlas** (เปิดหลังจบ Chapter 2)
- หน้ารายการ: 23 ภารกิจ หน้าละ 8 แถว (แถวสูง ~48px กว้าง ~340px) · ซ้ายเป็นภาพการ์ดภารกิจ (ใบ 86) · ขวาเป็นไอคอนขั้นที่เลือกแล้ว 3 ช่อง (~20px)
- หน้าต้นไม้: 3 ขั้น × 2 ทาง = กล่องโหนด 6 กล่อง (กว้าง ~165px สูง ~80px) · หัวบอก ⭐ ว่าง / ใช้ / เพดาน · ปุ่ม Focus ⭐ และ Reset
- แต้ม ⭐ Atlas ได้จากทำภารกิจ · ลอยขึ้นเหนือหัวว่า "⭐ +1 Atlas"

## ไฟล์ที่ต้องการ

### A. ไอคอนโหนด 6 แบบ · `ma89_nodes.png` · 6 เฟรม × 128×128 (6×1) · โปร่งใส · กลางเฟรม · แสดงจริง ~28–40px
เรียง: 1 ⏳ Steady Hands (นาฬิกาทรายลูกกวาด สีฟ้า) · 2 💠 Deep Pockets (กระเป๋าผ้าล้นอัญมณีฟ้า) · 3 🔥 Hard Mode (เปลวไฟแดงส้มรอบดาบเล็ก) · 4 🎁 Gear Hunt (กล่องของขวัญแตกออกมีแสง) · 5 🎰 Jackpot (ตู้กาชาปองเล็กมีดาวทองพุ่ง) · 6 👑 Champion (มงกุฎทองกับดาว)
ขั้น 1 โทนฟ้า · ขั้น 2 โทนส้มแดง · ขั้น 3 โทนทอง

### B. กล่องโหนด · `ma89_node_frame.png` · 3 เฟรม × 240×120 (3×1) · โปร่งใส · 9-slice [24,24,24,24]
เฟรม 1 ปกติ (ม่วงเข้ม ขอบม่วงอ่อน) · เฟรม 2 เลือกแล้ว (ขอบทองเรือง) · เฟรม 3 ล็อก (เทาจาง มีกุญแจเล็กที่มุมขวาบน — วาดเป็นภาพ ไม่ใช่ตัวอักษร) · แสดงจริง ~165×80

### C. ตราหัวหน้า · `ma89_emblem.png` · 256×256 · โปร่งใส · แสดงจริง ~56px
แผนที่ม้วนกระดาษขนมเปิดครึ่ง มีเส้นทางจุดไข่ปลาเชื่อมดาว 3 ดวง + เข็มทิศลูกอมเล็ก

### D. ดาว Atlas · `ma89_star.png` · 2 เฟรม × 64×64 (2×1) · โปร่งใส · แสดงจริง ~18–24px
เฟรม 1 ดาวทองเต็ม (แต้ม) · เฟรม 2 ดาวขอบทองกลวง (Focus ที่ยังว่าง)

### E. ป้าย NEW / ปุ่ม Atlas · `ma89_button.png` · 240×64 · โปร่งใส · 9-slice [32,16,32,16] · แสดงจริง ~118×28
ปุ่มมุมมนสีม่วงคราม มีช่องไอคอนวงกลมด้านซ้าย (ว่าง — โค้ดวางตรา C ตัวเล็กเอง)

**รวม 5 ไฟล์ (13 เฟรม)**

## ข้อห้าม
- ห้ามตัวหนังสือ/ตัวเลข · กล่อง B ต้องยืดได้ (ห้ามลวดลายตรงกลางที่ยืดแล้วเพี้ยน)
- ไอคอน A ต้องอ่านออกที่ 28px

## โน้ตฝั่งโค้ด
- แพ็ก WebP q80 (≤2× ขนาดจอ) → `assets/art/atlas89/` · menu-lazy (`LAZY_MENU_ART_RE` + โหลดตอนเปิดหน้า Atlas แบบ `loadChestArt`)
- `buildMissionAtlas`: ไอคอนโหนด = `MA_TREE[k][c]` → เฟรม `k*2+c` · กล่องโหนดแทน `fillRoundedRect` · ตรา C ข้างหัว · ดาว D แทน ⭐ ในหัวหน้า · ปุ่ม E แทน `uiPillBtn` ของ Atlas · ไม่มีภาพ = ของเดิม
- งบ: รวม < 200 KB WebP

## ส่งมอบ
- Date: 2026-11-19. Delivered all 5 files (5 UI atlases / 13 frames) to `assets/incoming/atlas89/`. Missing: none.
- Included `MANIFEST.json`, exact `PROMPTS.json`, and compact per-file `QA_REPORT.json`. All files passed mechanical QA and independent readback.
- Source branch: `asset-delivery/orders88-90-a18`. Source assets only; no game.js, runtime, tests or release changes. Code-side wiring and owner phone review pending.
- Corrected the printed total from17 to13 frames: the exact table has6 nodes +3 panel states +1 emblem +2 stars +1 button. All five requested files retain the specified grids and sizes.
