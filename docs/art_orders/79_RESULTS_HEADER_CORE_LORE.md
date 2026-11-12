# 79 — หัวหน้าจบด่าน (ชุดอาร์ต) + ภาพเรื่อง Flavor Cores · ใบสั่งงานอาร์ต

สถานะ: 🟡 รออาร์ต · เขียน 12 พ.ย. 2026 (v8.1.104) · **AI ฝั่งอาร์ตทำแค่ไฟล์ภาพแล้วส่งที่โฟลเดอร์ส่งมอบ — ไม่ต้องแก้โค้ด ไม่ต้องปล่อยเวอร์ชัน** (เจ้าของ 12 พ.ย.: Claude ฝั่งโค้ดเป็นคนผูกเอง)
ส่งไฟล์ที่ `assets/incoming/results79/` พร้อม `MANIFEST.json`, `PROMPTS.json`, `QA_REPORT.json`
สไตล์ตาม `00_STYLE_GUIDE.md` · เข้าชุดกับ `sc44_frame` (ใบ 44) · PNG32 alpha จริง · **ห้ามมีตัวหนังสือ/ตัวเลข**

## ระบบในเกม (อ้างอิง)
- **หน้าจบด่าน:** เจ้าของบอกว่าส่วนบน "เหมือนยังทำไม่เสร็จ" → v8.1.100 วาดด้วยโค้ดชั่วคราว (`summaryHeaderDeco`): แผงหัวขอบทอง · เหรียญวงกลมหลังฮีโร่ · แสงหมุน · ช่องดาว 3 ดวง → ต้องการภาพจริงแทนกราฟิกโค้ด
- **Flavor Cores (v8.1.103):** Ruby เล่าตอนทัวร์หลังบทสอนว่า แก่น 3 เส้นคือเส้นใยที่คุณยายถักไว้ใน **เมล็ดหัวใจ (Heart Seed)**: Life Core (ชมพูแดง · ยึดร่างคน) · Flavor Spark (ทองส้ม · รสที่ชิงคืน) · Oath Shell (ฟ้า · คำสัญญาปกป้อง) · ป้อน Sugar แล้วเมล็ดยึดร่างคนแน่นขึ้น (ดู `docs/STORY_CANON.md` §2) → ต้องการภาพประกอบให้ผู้เล่นเห็นว่าแก่นอยู่ตรงไหนในเรื่อง

## ไฟล์ที่ต้องการ
| ไฟล์ | ขนาด | บนจอ | ภาพ |
|---|---|---|---|
| `sc79_header_plate.png` | 512×192 · **9-slice** [48,40,48,40] | กว้าง 300–880 · สูง 110–160 | แผงหัวหน้าจบด่าน: กรอบทองแกะลายใบไม้/ริบบิ้นขนม มุมโค้ง พื้นกลางม่วงเข้มกำมะหยี่เรียบ (ตัวหนังสืออยู่ตรงนั้น) · ขอบบน/ล่าง/ข้างยืดได้ |
| `sc79_medallion.png` | 256×256 | ~110–132px | กรอบเหรียญกลมทอง หนา ประดับใบไม้ 2 ใบ + ดาวเล็กด้านบน · **กลางวงโปร่งใส** (ฮีโร่ซ้อนอยู่ใต้กรอบ) รัศมีรูใน ~44% ของภาพ |
| `sc79_medallion_back.png` | 256×256 | ~110–132px | พื้นหลังในเหรียญ: วงกลมไล่สีม่วงชมพูนุ่ม + ลายเกล็ดน้ำตาลจาง ๆ (อยู่ใต้ฮีโร่) |
| `sc79_rays.png` | 384×384 · **พื้นดำ #000** | ~200px · หมุนช้า | รังสีแสงอุ่น 12 แฉกนุ่ม ๆ จากกลาง (โค้ดแปลงความสว่างเป็นความโปร่ง) |
| `sc79_star_socket.png` | 2 เฟรม × 128×128 (2×1) | ~36px | ช่องดาว: 0 = ว่าง (หลุมม่วงขอบเงิน) · 1 = ได้แล้ว (หลุมอุ่นขอบทอง แสงรอบนิด ๆ) · **ไม่ต้องวาดดาว** (โค้ดวาง ★ ทับ) |
| `core79_heart_seed.png` | 768×512 | กว้าง ~300–420px | **ภาพเรื่อง Flavor Cores:** เมล็ดหัวใจ (เมล็ดสตรอว์เบอร์รีทองเรืองรูปหัวใจ) ลอยกลางภาพ มีเส้นใยแสง 3 เส้นถักพันรอบ: ชมพูแดง (Life Core) · ทองส้ม (Flavor Spark) · ฟ้า (Oath Shell) · เกล็ด Sugar ลอยเข้าหาเส้นใย · ฉากหลังครัวคุณยายมืดนุ่ม โคมอุ่น · น่ารัก อบอุ่น ไม่มีตัวละคร ไม่มีตัวหนังสือ · ขอบภาพจางเป็นโปร่ง (vignette alpha) |

**รวม 6 ไฟล์**

## ข้อห้าม
- ห้ามตัวหนังสือ/ตัวเลข · ห้ามแสงขาวจ้าเต็มภาพ
- 9-slice: มุมทั้ง 4 ต้องอยู่ในขอบที่ระบุพอดี ยืดกลางแล้วไม่เพี้ยน
- เหรียญ: รูกลางต้องโปร่งใสจริง (alpha 0) และอยู่กึ่งกลางพอดี
- สีเส้นใย 3 เส้นต้องตรงกับสีแก่นในเกม: Life `#ff5f7a` · Flavor `#f0a54a` · Oath `#6ec6ff`

## ผูกเข้าเกม (Claude ฝั่งโค้ดทำ · AI ฝั่งอาร์ตข้ามหัวข้อนี้ได้)
อ่าน `.claude/skills/wire-art/SKILL.md` และ `.claude/skills/release/SKILL.md` ก่อน
1. **ตรวจ:** MANIFEST 6 แถว · bytes/sha256 · ขนาด/กริด · alpha รูเหรียญ (สคริปต์เท่านั้น)
2. **pack:** `scripts/pack-results79.py` (ก๊อป `scripts/pack-missions71-74.py`) → `assets/art/results79/<key>.webp` · `sc79_rays` แปลงพื้นดำเป็น alpha
3. **ลงทะเบียน:** `ASSET_IMAGES` (URL literal) ทั้ง 6 คีย์ · `TEMPLE_UI`: `"sc79_header_plate":[512,192,1,[48,40,48,40]]`, `"sc79_star_socket":[128,128,2,null]`
4. **โหลด (lazy ห้ามบูต):** `sc79_*` = stage-lazy คู่กับ `sc44_frame` ใน `stageArtKeys` (บรรทัดที่มี `'sc44_background','sc44_frame'`) · `core79_heart_seed` = menu-lazy โหลดตอนเริ่มทัวร์หลังบทสอน (`openTutorialWeave`) · รัน `node tests/gpu-memory-budget.test.cjs` ต้องผ่าน
5. **hook** (ไม่มีภาพ = กราฟิกโค้ดเดิมทำงานเหมือนเดิม ห้ามลบ fallback):
   - `summaryHeaderDeco(box,H,hx,hy,size,animate)`: ถ้า `this.tuHas('sc79_header_plate')` → ใช้ `this.tuPanel('sc79_header_plate',0,H.x,H.y,H.w,H.h)` แทนแผง graphics · ถ้ามี `sc79_rays` → image ADD blend ขนาด size×1.6 หมุนแทน graphics rays · ถ้ามี `sc79_medallion_back` → วางใต้ฮีโร่ขนาด size แทนวงกลม graphics · ถ้ามี `sc79_medallion` → วาง **ทับ** ฮีโร่ (เพิ่มหลังภาพฮีโร่ใน `showStageSummary`) ขนาด size×1.12
   - แถวดาวใน `showStageSummary` (บรรทัดที่มี `so.fillCircle?.(x-12,S.y+22,17)`): ถ้ามี `sc79_star_socket` → `this.tuImg('sc79_star_socket',got?1:0,x-12-18,S.y+22-18,36,36)` แทนวงกลม graphics
   - Flavor Cores: `rubyGuide(lines,done,opt)` เพิ่ม `opt.art` (คีย์ภาพ) → ถ้า texture มี วางภาพเหนือกล่องข้อความ กว้าง `min(W-32,420)` คงสัดส่วน · ใน `applyGearTut` ส่ง `{target:'gLoadout',art:'core79_heart_seed'}`
   - ห้ามเปลี่ยนตำแหน่ง/ขนาด layout หน้าจบด่าน (`stageSummaryLayout`) และข้อความ
6. **เทส:** `tests/results79-art.test.cjs`: sha ต้นฉบับ · WebP มีจริง · คีย์ลงทะเบียน · lazy ไม่บูต · hook มีและยังมี fallback · เพิ่ม `summaryHeaderDeco` ในรายการ extract ของ `tests/stage-summary-layout.test.cjs` ถ้าแก้ signature · เพิ่มเข้า `npm run check`
7. **ปล่อย:** ตาม skill release · อัปเดต README "🟢 ผูกแล้ว vX · รอ QA มือถือ"

## ส่งมอบ
MANIFEST ต่อไฟล์: `key`, `file`, `bytes`, `sha256`, `width`, `height`, `frameWidth`, `frameHeight`, `frameCount`, `columns`, `background` (`transparent`/`black`), `nineSlice` (header_plate)
