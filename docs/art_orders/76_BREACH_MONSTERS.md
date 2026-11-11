# 76 — มอนรอยแยก Breach (แบบ PoE) · ใบสั่งงานอาร์ต + ผูกเอง

สถานะ: 🟢 ผูกแล้ว v8.1.96 · รอ QA มือถือ
ส่งไฟล์ที่ `assets/incoming/breach76/` พร้อม `MANIFEST.json`, `PROMPTS.json`, `QA_REPORT.json`
สไตล์ตาม `00_STYLE_GUIDE.md` · เข้าชุดกับ `hm_hand` / `hm_rim` / `hm_hand_lord` ของใบ 72 (ม่วงดำ-ชมพู มือ/รากของ The Hunger) · PNG32 alpha จริง · **ห้ามมีตัวหนังสือ**

## ระบบในเกม (อ้างอิง)
- **Hunger's Mouth** (ด่าน C1-2 + เล่นซ้ำ) และ **Hunger's Domain** (ห้องพิเศษ Delve เปิดด้วย Hunger Stone) = รอยแยกแบบ Breach ของ PoE: แตะมือ → วงขยาย → มอนรอยแยกหลั่งไหลเข้ามาทั่ววง → ฆ่าแล้วดรอป 🔮 Splinter
- ตอนนี้ "มอนรอยแยก" = มอนธรรมดาของด่านที่โค้ดย้อมม่วง (`e._breach=true`, tint 0xc59bff) · เจ้าของอยากให้เหมือน PoE เลย → ต้องมี **พวกมอนรอยแยกของตัวเอง** ที่ไม่ใช่มอนด่าน
- มอนตัวเล็ก-กลาง บนจอ 56–90px · มาเป็นฝูงครั้งละ 2–5 ตัว · พฤติกรรมเดิน/โจมตีมาจากโค้ดเดิม (ภาพเป็นแค่หน้าตา)
- Lore: ทั้งหมดคือ "ชิ้นส่วนความหิว" ที่หลุดมาจากโลกของ The Hunger — มือ ปาก ตา ราก — ไม่ใช่สัตว์ ไม่น่ากลัว เป็นมอนขนมแนวเดียวกับเกม

## ไฟล์ที่ต้องการ (4 สายพันธุ์ × เดิน + ตาย)
| ไฟล์ | ขนาด | ภาพ |
|---|---|---|
| `brm_mite_walk.png` | 6 เฟรม × 192×192 (6×1) loop | **Hunger Mite** ตัวเล็กเร็ว: ก้อนเยลลี่ม่วงมีปากฟันน้ำตาลกรวดใหญ่กว่าตัว ขาเล็ก 4 ขา วิ่งกระโดด · บนจอ ~56px |
| `brm_mite_death.png` | 6 เฟรม × 192×192 (6×1) ครั้งเดียว | แตกเป็นเยลลี่ม่วงกระเด็น แล้วจางเป็นประกาย |
| `brm_maw_walk.png` | 6 เฟรม × 192×192 (6×1) loop | **Gaping Maw** ตัวถึก: ปากยักษ์ลอยบนรากสั้น ๆ อ้า-หุบตอนเดิน ลิ้นชมพู · บนจอ ~90px |
| `brm_maw_death.png` | 6 เฟรม × 192×192 (6×1) ครั้งเดียว | ปากงับตัวเองแล้วยุบลงในรอยแยกเล็ก ๆ |
| `brm_claw_walk.png` | 6 เฟรม × 192×192 (6×1) loop | **Clawhand** มือม่วงคลานด้วยนิ้ว 5 นิ้วแบบแมงมุม ข้อมือมีปลอกทองแตก · บนจอ ~70px |
| `brm_claw_death.png` | 6 เฟรม × 192×192 (6×1) ครั้งเดียว | มือกำแน่นแล้วสลายเป็นผงม่วง |
| `brm_eye_walk.png` | 6 เฟรม × 192×192 (6×1) loop | **Watcher** ลูกตาเดียวน่ารักลอยตัว มีรากห้อยใต้ตัวเหมือนแมงกะพรุน กะพริบตา · บนจอ ~64px |
| `brm_eye_death.png` | 6 เฟรม × 192×192 (6×1) ครั้งเดียว | ตาหลับแล้วแตกเป็นฟองใส |

**รวม 8 ไฟล์**

## ข้อห้าม
- ห้ามตัวหนังสือ · ห้ามเลือด/น่ากลัว · ห้ามเงา (เกมวาดเงาเอง)
- เดิน (loop): **รูปทรงคงที่ทุกเฟรม** ขยับแค่ขา/ปาก/ตา (ห้าม "เดือด" แบบใบ 34) · หันเฉียงลงขวา (โค้ดกลับซ้าย-ขวาเอง) · เท้าแตะแนวเดียวกันทุกเฟรม (ตัวลอยให้ศูนย์กลางคงที่)
- ตาย: เฟรมแรกต้องเป็นท่าเดียวกับเฟรมแรกของท่าเดิน · เฟรมสุดท้ายว่างหรือเกือบว่าง
- ตัวต้องอ่านออกบนพื้นมืดม่วง (ขอบเรืองชมพูอ่อน) และต่างกันชัดทั้ง 4 แบบที่ขนาด 56–90px

## ผูกเข้าเกม (AI ฝั่งอาร์ตทำเอง)
อ่าน `.claude/skills/wire-art/SKILL.md` และ `release/SKILL.md` ก่อน
1. **ตรวจ:** MANIFEST 8 แถว · bytes/sha256 · ขนาด/กริด (ด้วยสคริปต์)
2. **pack:** `scripts/pack-breach76.py` (ก๊อป `scripts/pack-missions71-74.py`) → `assets/art/breach76/brm_*.webp` (192px เฟรม ย่อเหลือ 128px ได้)
3. **ลงทะเบียน:** `ASSET_FX` ต่อคีย์ `{url:'assets/art/breach76/<key>.webp',fw:128,fh:128,frames:6,rate:10,anchor:'center',loop:true}` (death: `rate:14` ไม่มี loop)
4. **โหลด (stage-lazy ห้ามบูต):**
   - `artClass` บรรทัด `/^(?:fp|hm|hh|gp|gg|hs|ult|msn71)_|^cr_root_/` → เพิ่ม `brm` เป็น `/^(?:fp|hm|hh|gp|gg|hs|ult|msn71|brm)_|^cr_root_/`
   - `missionArtKeys(idx)`: เพิ่ม `brm_` ทุกที่ที่มี `hm_` (ด่าน idx 1 และ Delve)
   - รัน `node tests/gpu-memory-budget.test.cjs` ต้องผ่าน
5. **hook** (ใช้ helper ที่มีแล้ว `artFollow(e,key,px)` = ภาพทับตัวมอน ซ่อนตัวเดิม ตามตำแหน่ง/ทิศ · `artFx(key,x,y,px)` = เอฟเฟกต์ครั้งเดียว):
   - `hmTick` ตรง `if(e){ e._breach=true; e.setTint?.(0xc59bff); e.tintColor=0xc59bff; }` และ `hdTick` ตรง `if(e){ e._breach=true; e.setTint?.(0xc59bff); }`: สุ่มสายพันธุ์ `const sp=['mite','maw','claw','eye'][Math.floor(Math.random()*4)]` → `if(this.artFollow?.(e,'brm_'+sp+'_walk',{mite:56,maw:90,claw:70,eye:64}[sp])){ e._brSp=sp; e.clearTint?.(); }` (ไม่มีภาพ = ย้อมม่วงเหมือนเดิม)
   - ห้ามใส่ภาพให้ตัวที่มี `_hmLord`/`_hdLord` (บอสมีภาพของตัวเองแล้ว)
   - ตาย: ใน `sigOnKill` บรรทัด `if(e&&e._breach){ e._breach=false; ...` เพิ่มก่อน `e._breach=false`: `if(e._brSp){ this.artFx?.('brm_'+e._brSp+'_death',e.x,e.y,{mite:56,maw:90,claw:70,eye:64}[e._brSp]); e._brSp=null; }`
   - ตอนวงยุบ (`hmTick` phase 'close' ที่ดูดมอนหาย) และ `hdLord` (ล้างมอนก่อนบอส): ล้าง `q._brSp=null` ด้วย (ไม่ต้องเล่นท่าตาย ใช้ poof เดิม)
   - ห้ามเปลี่ยนจำนวน/ความถี่การเกิด/HP/ดาเมจ
6. **เทส:** `tests/breach76-art.test.cjs`: sha ต้นฉบับ · WebP มีจริง · คีย์ใน ASSET_FX · `artClass('brm_mite_walk')==='stage'` · hook มี `'brm_'+sp+'_walk'` และ fallback tint 0xc59bff ยังอยู่ · เพิ่มเข้า `npm run check`
7. **ปล่อย:** ตาม skill release · อัปเดต README ใบนี้ "🟢 ผูกแล้ว vX · รอ QA มือถือ"

## ส่งมอบ
- วันที่ส่ง 12 พ.ย. 2026 · ผูกเข้าเกม v8.1.96
- ส่งครบ 8 ไฟล์ที่ `assets/incoming/breach76/` · ไฟล์ที่ขาด 0
- `brm_mite_walk.png`, `brm_mite_death.png`, `brm_maw_walk.png`, `brm_maw_death.png`, `brm_claw_walk.png`, `brm_claw_death.png`, `brm_eye_walk.png`, `brm_eye_death.png`

MANIFEST ต่อไฟล์: `key`, `file`, `bytes`, `sha256`, `width`, `height`, `frameWidth`, `frameHeight`, `frameCount`, `columns`, `loop`, `anchor` (`center`), `background` (`transparent`)
