# 75 — เทมเพลตการ์ดเลเวลอัปแยกตามประเภท · ใบสั่งงานอาร์ต + ผูกเอง

สถานะ: 🟡 รออาร์ต · เขียน 11 พ.ย. 2026 · **AI ฝั่งอาร์ตทำภาพและผูกเข้าเกมเองในใบนี้** (ทำตามหัวข้อ "ผูกเข้าเกม" ด้านล่าง)
ส่งไฟล์ที่ `assets/incoming/levelup75/` พร้อม `MANIFEST.json`, `PROMPTS.json`, `QA_REPORT.json`
สไตล์ตาม `00_STYLE_GUIDE.md` · เข้าชุดกับการ์ดเดิมใบ 23 (`assets/art/levelup/lvl_card_base.webp`) · PNG32 alpha จริง · **ห้ามมีตัวหนังสือในภาพ**

## ระบบในเกม (อ้างอิง)
- ทุกครั้งที่เลเวลอัป ผู้เล่นเลือก 1 ใน 3 การ์ด · เจ้าของ (โน้ตใบ 5): "การ์ด Relic / Normal / Mutation ตอนนี้ต่างกันแค่สี ต้องทำให้ภาพต่างกันมากกว่านี้"
- ตอนนี้ทุกใบใช้กรอบเดียว `lvl_card_base` + ชั้นสี `lvl_card_accent` ที่โค้ดย้อมสี (9-slice 384×150 · ขอบ [32,28,32,28]) · บนจอการ์ดกว้าง ~300–360px สูง ~110–150px (แนวนอน) · โค้ดเขียนชื่อ/คำอธิบาย/ไอคอนทับเอง
- 4 ประเภทที่ต้องแยกให้ออกในพริบตา:
  - **Normal** — อัปเกรดสกิล/การโจมตีปกติ/Passive/ฟื้นเลือด (การ์ดส่วนใหญ่)
  - **Mutation** — เปลี่ยนรูปแบบการโจมตี (Basic Mutation · Evolution · Companion Evolution)
  - **Relic** — ของวิเศษพิเศษ (เลือกตอนได้ Relic)
  - **Unique** — ⭐ Unique Mutation / Awaken (หายากสุด)

## ไฟล์ที่ต้องการ
| ไฟล์ | ขนาด | ภาพ |
|---|---|---|
| `lvl_tpl_normal.png` | 384×150 · **9-slice** [32,28,32,28] | กรอบกระดาษครีมอุ่น ขอบน้ำตาลอ่อน มุมโค้งเรียบ ลายลูกไม้บาง ๆ — สงบ อ่านง่าย (เป็นค่าพื้นฐาน) · พื้นกลางเรียบเพื่อให้ตัวหนังสืออ่านง่าย · **วาดโทนกลาง-ขาว** (โค้ดยังย้อมสีขอบตามสกิลได้) |
| `lvl_tpl_mutation.png` | 384×150 · 9-slice [32,28,32,28] | กรอบอินทรีย์: เถาวัลย์/ของเหลวเยลลี่ม่วง-เขียวพันรอบขอบ มีรอยแตกเรืองที่มุม ดู "กำลังกลายร่าง" · พื้นกลางเข้มเรียบ |
| `lvl_tpl_relic.png` | 384×150 · 9-slice [32,28,32,28] | กรอบโลหะทองแกะสลักแบบโบราณ หมุดอัญมณีชมพูที่มุมทั้ง 4 ขอบหนาหรูกว่าแบบอื่นชัดเจน · พื้นกลางน้ำตาลเข้มกำมะหยี่ |
| `lvl_tpl_unique.png` | 384×150 · 9-slice [32,28,32,28] | กรอบฟ้า-ทองแบบดวงดาว ขอบเป็นแสงโฮโลแกรมไล่สี มีดาวเล็ก ๆ ประดับมุม หรูที่สุดในชุด · พื้นกลางน้ำเงินกลางคืนเรียบ |
| `lvl_tpl_crest.png` | 4 เฟรม × 96×96 (4×1) | ตราประจำประเภทวางมุมซ้ายบนการ์ด: 0 = Normal (ใบไม้กลม) · 1 = Mutation (เกลียว DNA เยลลี่) · 2 = Relic (ถ้วยทองมีอัญมณี) · 3 = Unique (ดาวมงกุฎ) · บนจอ ~30px |
| `lvl_tpl_fx_mutation.png` | 6 เฟรม × 384×150 (6×1) loop · **พื้นดำ #000** | ชีพจรเรืองม่วง-เขียววิ่งตามขอบกรอบ (เฉพาะขอบ ตรงกลางดำ) · ซ้อนบนการ์ด Mutation |
| `lvl_tpl_fx_relic.png` | 6 เฟรม × 384×150 (6×1) loop · พื้นดำ #000 | แสงทองวิ่งเฉียงผ่านกรอบ (glint sweep) + ประกายที่อัญมณีมุม |
| `lvl_tpl_fx_unique.png` | 6 เฟรม × 384×150 (6×1) loop · พื้นดำ #000 | ประกายดาวลอยรอบขอบ + แสงรุ้งไล่ตามขอบช้า ๆ |

**รวม 8 ไฟล์**

## ข้อห้าม
- ห้ามตัวหนังสือ/ตัวเลข · พื้นกลางการ์ดต้องเรียบ (ตัวหนังสือโค้ดอยู่ตรงนั้น)
- 9-slice: มุม 4 มุมต้องอยู่ในขอบที่ระบุพอดี (ยืดกลางแล้วไม่เพี้ยน) · ขอบบน/ล่าง/ซ้าย/ขวาต้องยืดได้ (ลายซ้ำได้)
- 4 แบบต้องต่างกันที่ **รูปทรงและวัสดุ** ไม่ใช่แค่สี (อ่านออกแม้ตาบอดสี)
- FX: ตรงกลางดำสนิท ห้ามมีแสงทับตัวหนังสือ

## ผูกเข้าเกม (AI ฝั่งอาร์ตทำเอง)
อ่าน skill `.claude/skills/wire-art/SKILL.md` และ `release/SKILL.md` ก่อน
1. **ตรวจ:** MANIFEST ครบ 8 แถว · bytes/sha256 ตรง · ขนาด/กริดตามตาราง (สคริปต์ ไม่ต้องเปิดดูทีละไฟล์)
2. **pack:** `scripts/pack-levelup75.py` (ก๊อป `scripts/pack-missions71-74.py`) → `assets/art/levelup/lvl_tpl_*.webp` (โฟลเดอร์เดียวกับการ์ดเดิม จะโหลดพร้อมชุดเลเวลอัปเดิม) · FX พื้นดำแปลง luminance alpha แบบเดียวกับสคริปต์นั้น
3. **ลงทะเบียน** (`game.js`):
   - `ASSET_IMAGES`: `lvl_tpl_normal/mutation/relic/unique:'assets/art/levelup/lvl_tpl_<x>.webp'` และ `lvl_tpl_crest`, `lvl_tpl_fx_*` (URL ต้องเป็น string ตรง ๆ)
   - `TEMPLE_UI` (`Object.assign(TEMPLE_UI,{...})` บรรทัดที่มี `"lvl_card_base":[384,150,1,[32,28,32,28]]`): เพิ่ม `"lvl_tpl_normal":[384,150,1,[32,28,32,28]]` ×4 แบบ, `"lvl_tpl_crest":[96,96,4,null]`, `"lvl_tpl_fx_mutation":[384,150,6,null]` ×3
   - `PLAY_UI_KEYS` (อาร์เรย์ที่มี `"lvl_card_base"`): เพิ่มคีย์ใหม่ทั้ง 8 → โหลดพร้อมหน้าเลเวลอัปเดิม (ไม่โหลดตอนบูต)
4. **hook** ใน `drawReadableChoiceCard(group,o,x,y,w,h,options)` ตรงบรรทัด `const art=this.tuHas('lvl_card_base');let panel;`:
   - หาประเภท: `const cat=(/relic/i.test(o.kind||'')||this._relicPick)?'relic':(o.uniqueCard||o.kind==='⭐ Unique Mutation'||type==='awk')?'unique':(o.mutation||o.evolution||o.companionForm||/Mutation|Evolution/.test(o.kind||''))?'mutation':'normal'`
   - ถ้า `this.tuHas('lvl_tpl_'+cat)` → `panel=this.tuPanel('lvl_tpl_'+cat,0,x,y,w,h)` (แบบ normal ยังซ้อน `lvl_card_accent` ย้อมสีเหมือนเดิม · แบบอื่นไม่ต้องย้อม) · ไม่มีภาพ = ใช้โค้ดเดิมทั้งหมด (fallback)
   - ตรา: ถ้า `this.tuHas('lvl_tpl_crest')` วาง `this.tuImg('lvl_tpl_crest',idx,x+18,y+18,30,30)` (idx normal 0 · mutation 1 · relic 2 · unique 3) แล้ว `group.add(...)`
   - FX (ไม่ใช่ normal): สร้าง sprite จาก `lvl_tpl_fx_<cat>` ขนาด w×h ตรงการ์ด เล่นวน 8fps (สร้าง anim ครั้งแรกด้วย `this.anims.create`) เพิ่มเข้า `group` · ต้องถูกทำลายพร้อม group (ไม่ต้องเก็บเพิ่ม)
   - ห้ามเปลี่ยนตำแหน่ง/ขนาด/ข้อความการ์ด ห้ามแตะ logic การเลือก
5. **เทส:** `tests/levelup75-art.test.cjs` (ก๊อปแบบ `tests/missions71-74-art.test.cjs`): sha ของต้นฉบับ · WebP มีจริง · คีย์อยู่ใน ASSET_IMAGES/TEMPLE_UI/PLAY_UI_KEYS · `drawReadableChoiceCard` มี `'lvl_tpl_'+cat` และยังมี fallback `lvl_card_base` · เพิ่มเข้า `npm run check` ใน package.json
6. **ปล่อย:** ตาม skill release (bump `GAME_VERSION`, CHANGELOG ภาษาอังกฤษ, บล็อก Latest delivery ใน CLAUDE.md, `npm run check`, build + ตรวจตาม `.github/workflows/pages.yml`, push branch deploy) · อัปเดตตาราง README ใบนี้เป็น "🟢 ผูกแล้ว vX · รอ QA มือถือ"

## ส่งมอบ
(ฝั่งอาร์ตกรอก: วันที่ · ไฟล์ที่ส่ง · ไฟล์ที่ขาด · เวอร์ชันที่ผูก)
MANIFEST ต่อไฟล์: `key`, `file`, `bytes`, `sha256`, `width`, `height`, `frameWidth`, `frameHeight`, `frameCount`, `columns`, `loop`, `anchor`, `background` (`transparent`/`black`), `nineSlice` (กรอบ 4 แบบ)
