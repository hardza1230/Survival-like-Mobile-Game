# 78 — VFX ภารกิจ League / Trial / Forge / Memory Book · ใบสั่งงานอาร์ต + ผูกเอง

สถานะ: 🟡 รออาร์ต · เขียน 11 พ.ย. 2026 · **AI ฝั่งอาร์ตทำภาพและผูกเข้าเกมเองในใบนี้** (ทำตามหัวข้อ "ผูกเข้าเกม")
ส่งไฟล์ที่ `assets/incoming/vfx78/` พร้อม `MANIFEST.json`, `PROMPTS.json`, `QA_REPORT.json`
สไตล์ตาม `00_STYLE_GUIDE.md` · **ทุกไฟล์พื้นดำสนิท #000** (โค้ดแปลงความสว่างเป็นความโปร่ง) · เล่นครั้งเดียว (ยกเว้นที่ระบุ loop) · **ห้ามมีตัวหนังสือ**

## ระบบในเกม (อ้างอิง)
- ภารกิจ League (ใบ 72–74) ตอนนี้ใช้เอฟเฟกต์กลางของโค้ด: วงแหวนขยาย (`vfxHitRing`) + จอแฟลช (`screenFlash`) ซ้ำกันทุกภารกิจ → ช่วงสำคัญ (เปิดรอยแยก ได้ของ อบโกเลม ฯลฯ) ไม่มีเอกลักษณ์
- เอฟเฟกต์ต้องสั้น (0.4–0.8 วิ) อ่านออกกลางสนามที่มอนเยอะ · สีตามธีมแต่ละภารกิจ
- เฟรมเรียงซ้าย→ขวา 1 แถว · ขนาดเฟรมตามตาราง · บนจอ = ขนาดที่โค้ดแสดง

## ไฟล์ที่ต้องการ
| ไฟล์ | เฟรม × ขนาด | บนจอ | ภาพ |
|---|---|---|---|
| `vfx78_breach_open` | 8 × 512×512 | ~420px | รอยแยกม่วงฉีกออกเป็นวงจากจุดกลาง มือเงาเล็ก ๆ ผุดตามขอบ ประกายชมพู |
| `vfx78_splinter_pick` | 6 × 128×128 | ~60px | เศษคริสตัลม่วงแตกเป็นประกาย 4–5 จุดพุ่งเข้ากลาง |
| `vfx78_breach_chest` | 8 × 256×256 | ~160px | มือประสานแยกออก แสงทอง-ม่วงพุ่งขึ้น ขนมกระเด็น |
| `vfx78_stone_fuse` | 8 × 256×256 | ~150px | เศษคริสตัลหลายชิ้นหมุนเข้าหากันรวมเป็นก้อนหิน แสงวาบ |
| `vfx78_statue_paint` | 6 × 192×192 · **loop** | ~100px | ละอองสีชมพูหมุนวนรอบรูปปั้น (เล่นระหว่างเติมสี) |
| `vfx78_gates_shut` | 8 × 256×256 | ~160px | ประตูมิติม่วงหมุนหดเข้ากลางแล้วปิดเป็นจุดแสง |
| `vfx78_dish_served` | 8 × 384×384 | ~220px | ไอน้ำหอมพวยพุ่ง + ประกายทอง + หัวใจเล็ก ๆ ลอยจากหม้อ |
| `vfx78_golem_bake` | 8 × 384×384 | ~240px | ไฟเตาพลุ่งออกเป็นลูกไฟอุ่น ควันขนมม้วน แล้วเปิดเป็นแสง |
| `vfx78_root_cut` | 6 × 256×256 | ~140px | รอยฟันโค้งสีขาว + ใบไม้/เศษรากม่วงกระเด็น |
| `vfx78_siege_break` | 8 × 512×512 | ~460px | วงทองระเบิดออกเป็นคลื่น ธงลูกอมปลิว ประกายทองโปรย |
| `vfx78_trial_curse` | 8 × 384×384 | ~200px | สัญลักษณ์วงคำสาปชมพู-ม่วงหมุนแล้วซึมลงพื้น |
| `vfx78_trial_take` | 6 × 256×256 | ~160px | ประกายเขียวมิ้นต์ + กล่องของขวัญเล็ก ๆ เด้งออก |
| `vfx78_trial_risk` | 6 × 256×256 | ~160px | เปลวไฟแดงทับทิม-ทองพุ่งขึ้นเป็นรูปดาบไขว้จาง ๆ |
| `vfx78_ink_move` | 8 × 256×256 | ~140px | หมึกฟ้าเรืองหมุนเป็นเกลียวแล้วพุ่งออกเป็นเส้น (หน้า Forge) |
| `vfx78_codex_up` | 8 × 256×256 | ~140px | สมุดเปิดพลิกหน้า แสงทองพุ่งขึ้นจากหน้ากระดาษ (หน้า Bestiary) |

**รวม 15 ไฟล์**

## ข้อห้าม
- พื้นดำสนิท #000 ทั้งไฟล์ · ไม่มีขอบ/กรอบ · เฟรมสุดท้ายเกือบดำ (จางหาย)
- ห้ามตัวหนังสือ/ตัวเลข · ห้ามแสงขาวจ้าเต็มเฟรม (แสบตาบนมือถือ)
- ห้ามแดงสด/ม่วงเรืองจัดเป็นสีหลักของเอฟเฟกต์บนพื้น (ซ้ำกระสุนศัตรู) ยกเว้น `vfx78_trial_risk`

## ผูกเข้าเกม (AI ฝั่งอาร์ตทำเอง)
อ่าน `.claude/skills/wire-art/SKILL.md` และ `release/SKILL.md` ก่อน
1. **ตรวจ:** MANIFEST 15 แถว · bytes/sha256 · ขนาด/กริด · พื้นดำ (สคริปต์เท่านั้น)
2. **pack:** `scripts/pack-vfx78.py` (ก๊อป `scripts/pack-missions71-74.py` ที่แปลงพื้นดำเป็น alpha แล้ว) → `assets/art/vfx78/<key>.webp` · เฟรม 512 ย่อ ½ · 384 ย่อ ⅔ · ที่เหลือคงเดิม
3. **ลงทะเบียน:** `ASSET_FX` `{url:'assets/art/vfx78/<key>.webp',fw,fh,frames,rate:16,anchor:'center'}` (`vfx78_statue_paint` เพิ่ม `loop:true`, rate 10)
4. **โหลด:** เอฟเฟกต์ในด่าน = stage-lazy: เพิ่ม `vfx78` ใน regex `artClass` บรรทัด `/^(?:fp|hm|hh|gp|gg|hs|ult|msn71)_|^cr_root_/` และใน `missionArtKeys(idx)` ใส่คู่กับ prefix ของภารกิจนั้น (breach_open/splinter_pick/breach_chest/stone_fuse กับ `hm_` · statue_paint กับ `fp_` · gates_shut กับ `hh_` · dish_served กับ `gp_` · golem_bake กับ `gg_` · root_cut กับ `cr_root_` · siege_break กับ `hs_` · trial_* กับ `ult_`) · `vfx78_ink_move`, `vfx78_codex_up` = เมนู → ย้ายไป `assets/art/menu74/` แล้วลงใน `ASSET_SHEETS` (`frame:` เท่าขนาดเฟรม) แทน ASSET_FX · `node tests/gpu-memory-budget.test.cjs` ต้องผ่าน
5. **hook** (helper เดิม `this.artFx?.(key,x,y,px)` = เล่นครั้งเดียว · ไม่มีภาพ = ไม่ทำอะไร เอฟเฟกต์เดิมยังเล่นอยู่ ห้ามลบของเดิม):
   | คีย์ | ที่เรียก (game.js) |
   |---|---|
   | breach_open | `hmOpen` ข้าง `this.vfxHitRing?.(S.x,S.y,0xb36bff,true)` · และ `hdSetup` |
   | splinter_pick | `hmTick` ตอน `sh.got=true` (เก็บ Splinter) ที่ตำแหน่งผู้เล่น |
   | breach_chest | `hmChest` |
   | stone_fuse | `hmSplinters` เมื่อ `made>0` (ที่ผู้เล่น) |
   | statue_paint | `fpTick` ระหว่าง `near&&q.fill<1`: สร้างครั้งเดียวต่อรูปปั้น (`q.paintFx`) วางที่รูปปั้น ลบเมื่อสีเต็มหรือภารกิจจบ (สร้างด้วย `this.artSpr('vfx78_statue_paint',q.x,q.y,100)` ซึ่งเล่นวนและถูกลบพร้อม `sigClear`) |
   | gates_shut | `hhDown` ทุกประตู (ข้าง `this.vfxHitRing?.(G.x,G.y,0xd9a6ff,true)`) |
   | dish_served | `gpServe` |
   | golem_bake | `ggBake` |
   | root_cut | `crTick` ตอน `L.open=false` (ข้าง `vfxHitRing` ที่ปลายราก) |
   | siege_break | `hsBurst` |
   | trial_curse | `ultStartFight` (ตอนเลือกคำสาป) ที่แท่น |
   | trial_take / trial_risk | ตอนเลือกแผ่น 🎁 / ⚔️ (ดู `ultTick` ช่วงตัดสินใจ) ที่ตำแหน่งแผ่น |
   | ink_move | `forgeMove` สำเร็จ → กลางจอ (เมนู: `this.menuArtFx?.('vfx78_ink_move',this.W/2,this.H*.45,140)` ถ้ามี helper นี้ ไม่งั้นสร้าง sprite ในเมนูเอง) |
   | codex_up | `codexUpgrade` สำเร็จ → กลางจอ (แบบเดียวกับ ink_move) |
6. **เทส:** `tests/vfx78-art.test.cjs`: sha ต้นฉบับ · WebP มีจริง · คีย์ลงทะเบียน · class stage/menu ไม่ใช่ boot · hook ทุกคีย์อยู่ในฟังก์ชันตามตาราง · เพิ่มเข้า `npm run check`
7. **ปล่อย:** ตาม skill release · อัปเดต README ใบนี้ "🟢 ผูกแล้ว vX · รอ QA มือถือ"

## ส่งมอบ
(ฝั่งอาร์ตกรอก: วันที่ · ไฟล์ที่ส่ง · ไฟล์ที่ขาด · เวอร์ชันที่ผูก)
MANIFEST ต่อไฟล์: `key`, `file`, `bytes`, `sha256`, `width`, `height`, `frameWidth`, `frameHeight`, `frameCount`, `columns`, `loop`, `anchor` (`center`), `background` (`black`)
