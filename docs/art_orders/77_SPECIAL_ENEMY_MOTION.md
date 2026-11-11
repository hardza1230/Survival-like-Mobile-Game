# 77 — ท่าโจมตี + ท่าตายของศัตรูพิเศษ (League / Breach / Ch3) · ใบสั่งงานอาร์ต + ผูกเอง

สถานะ: 🟡 รออาร์ต · เขียน 11 พ.ย. 2026 · **AI ฝั่งอาร์ตทำภาพและผูกเข้าเกมเองในใบนี้** (ทำตามหัวข้อ "ผูกเข้าเกม")
ส่งไฟล์ที่ `assets/incoming/motion77/` พร้อม `MANIFEST.json`, `PROMPTS.json`, `QA_REPORT.json`
สไตล์ตาม `00_STYLE_GUIDE.md` · **ตัวละครต้องตรงกับภาพท่ายืนที่ส่งแล้ว** (ดูไฟล์อ้างอิงในตาราง) · PNG32 alpha จริง · **ห้ามมีตัวหนังสือ**

## ระบบในเกม (อ้างอิง)
- ศัตรูพิเศษ 6 ตัวตอนนี้มีแค่ท่ายืน/ลอยวน (ผูกแล้ว v8.1.93 เป็น "ภาพทับตัวมอน" ผ่าน `artFollow`) · เวลายิง/ทุบ/ตาย ภาพไม่เปลี่ยน ดูแข็ง
- ต้องการ: **ท่าโจมตี** (เล่นครั้งเดียวแล้วกลับท่ายืน) + **ท่าตาย** (เล่นครั้งเดียวตรงจุดที่ตาย)

## ไฟล์ที่ต้องการ (เฟรมขนาดเท่ากับท่ายืนของตัวนั้น)
| ไฟล์ | ขนาด | ภาพ (ตัวอ้างอิง) |
|---|---|---|
| `hh_herald_attack.png` | 6 เฟรม × 256×256 (6×1) ครั้งเดียว | Herald (อ้างอิง `assets/incoming/league72/hh_herald.png`) ยกแตรเป่า แก้มป่อง คลื่นเสียงม่วงออกจากปากแตร แล้วลดแตรลง |
| `hh_herald_death.png` | 8 เฟรม × 256×256 (8×1) ครั้งเดียว | แตรหลุดมือ ผ้าคลุมยุบ ตัวกลายเป็นผงม่วงปลิวหาย |
| `gg_golem_attack.png` | 6 เฟรม × 384×384 (6×1) ครั้งเดียว | Golem (`assets/incoming/league73/gg_golem.png`) ยกแขนเพรทเซลสองข้างทุบพื้น ฝุ่นน้ำตาลกระเด็น |
| `gg_golem_death.png` | 8 เฟรม × 384×384 (8×1) ครั้งเดียว | ชิ้นส่วนหลุดออกทีละชิ้น (หัวเค้ก แขน ขา) ล้มเป็นกองขนมน่ารัก |
| `hs_warlord_attack.png` | 6 เฟรม × 384×384 (6×1) ครั้งเดียว | Warlord (`assets/incoming/league73/hs_warlord.png`) เหวี่ยงส้อมยักษ์เป็นวงโค้งไปข้างหน้า |
| `hs_warlord_death.png` | 8 เฟรม × 384×384 (8×1) ครั้งเดียว | เกราะช้อนส้อมหลุดกระจาย มงกุฎขนมปังตก ตัวยุบเป็นโมจิจืดแบน |
| `hm_hand_lord_attack.png` | 6 เฟรม × 384×384 (6×1) ครั้งเดียว | Hand of the Hunger (`assets/incoming/league72/hm_hand_lord.png`) กำมือคว้าลงด้านหน้าแล้วแบกลับ |
| `hm_hand_lord_death.png` | 8 เฟรม × 384×384 (8×1) ครั้งเดียว | มือกำแน่น ตาในฝ่ามือปิด สลายเป็นเศษคริสตัลม่วง (Splinter) |
| `hm_breachlord_attack.png` | 6 เฟรม × 512×512 (6×1) ครั้งเดียว | Breachlord (`assets/incoming/league72/hm_breachlord.png`) มือรอบตัวกางออกพร้อมกัน แสงม่วงพุ่งเป็นวงรอบตัว |
| `hm_breachlord_death.png` | 8 เฟรม × 512×512 (8×1) ครั้งเดียว | มือทั้งหมดหดเข้าหาตาตรงกลาง มงกุฎแตก แล้วยุบหายเข้าไปในรอยแยกเล็ก ๆ |
| `msn71_stalker_captain_attack.png` | 6 เฟรม × 256×256 (6×1) ครั้งเดียว | Stalker Captain (`assets/incoming/missions71/msn71_stalker_captain.png`) พุ่งฟันด้วยกรงเล็บ ผ้าคลุมสะบัด |
| `msn71_stalker_captain_death.png` | 8 เฟรม × 256×256 (8×1) ครั้งเดียว | มงกุฎทองหลุด ผ้าคลุมร่วงลงพื้น ตัวจางหาย |

**รวม 12 ไฟล์**

## ข้อห้าม
- ตัวต้อง **ตรงกับภาพท่ายืนเดิม** (สี ทรง ชุด) · เฟรมแรกของท่าโจมตีและท่าตาย = ท่าเดียวกับเฟรมแรกของท่ายืน · ท่าโจมตีเฟรมสุดท้ายกลับมาใกล้ท่ายืน
- ศูนย์กลางตัว/เท้าอยู่ตำแหน่งเดียวกับท่ายืนทุกเฟรม (ไม่ลอยไปมา) · ห้ามเงา · ห้ามเลือด/น่ากลัว
- ท่าตายเฟรมสุดท้ายว่างหรือเกือบว่าง

## ผูกเข้าเกม (AI ฝั่งอาร์ตทำเอง)
อ่าน `.claude/skills/wire-art/SKILL.md` และ `release/SKILL.md` ก่อน
1. **ตรวจ:** MANIFEST 12 แถว · bytes/sha256 · ขนาด/กริด · เฟรมว่าง/ล้นขอบ (สคริปต์เท่านั้น)
2. **pack:** `scripts/pack-motion77.py` (ก๊อป `scripts/pack-missions71-74.py`) → `assets/art/motion77/<key>.webp` · **ย่อด้วยอัตราเดียวกับท่ายืนของตัวนั้น** (ดู `assets/art/missions71_74_index.json`: `hm_breachlord` ถูกย่อ ½ → ท่าใหม่ของมันต้องย่อ ½ ด้วย · ตัวอื่นไม่ย่อ) เพื่อให้เฟรมเท่ากับท่ายืนใน `ASSET_FX`
3. **ลงทะเบียน:** `ASSET_FX` ต่อคีย์ `{url:'assets/art/motion77/<key>.webp',fw:<เท่าท่ายืน>,fh:<เท่าท่ายืน>,frames:6|8,rate:12,anchor:'center'}` (ไม่มี loop)
4. **โหลด (stage-lazy):** `artClass` เดิมจับ prefix `hh_ gg_ hs_ hm_ msn71_` เป็น 'stage' อยู่แล้ว (ตรวจว่า `artClass('hh_herald_attack')==='stage'`) · `missionArtKeys(idx)` ใช้ prefix อยู่แล้ว ยกเว้น `msn71_stalker_captain` ที่ใส่ชื่อตรง ๆ → เพิ่ม `'msn71_stalker_captain_attack','msn71_stalker_captain_death'` ข้างกัน · รัน `node tests/gpu-memory-budget.test.cjs` ต้องผ่าน
5. **hook** (game.js · helper เดิม `artFollow` / `artFollowTick` / `artFx` อยู่ใต้คอมเมนต์ `v8.1.93 อาร์ตภารกิจ`):
   - ใน `artFollow(e,key,px)`: เก็บ `s._act=key+'_attack'` และ `s._die=key+'_death'` และ `s._px=px`
   - เพิ่มเมธอด `artFollowAct(e)`: ถ้า `e._artOv` มีและ texture `s._act` มี → สร้าง anim ครั้งแรก (`repeat:0`) แล้ว `s.play(s._act)` · `s.once('animationcomplete',()=>{ if(s.active)s.play(<คีย์ท่ายืน>) })` · กันเล่นซ้อนด้วย cooldown 1.2s
   - ใน `artFollowTick()`: (ก) ถ้าผู้เล่นอยู่ใกล้ < 180px และ cooldown หมด (2.5s) → `artFollowAct(e)` · (ข) ตอนศัตรูไม่ active แล้ว (ตาย/หายไป) ก่อน `s.destroy()` → `this.artFx?.(s._die,s.x,s.y,s._px)` ถ้า texture มี
   - เรียก `artFollowAct` เพิ่มตอนใช้สกิล: `hhTick` ตอนประตูปล่อยฝูง (`G.cd<=0`) → `S.herald` · `ggTick` ใน `tick('head'|'arms'|'tail',…)` → `S.golem` · `hdTick` ใน `tick('ring'|'slam'|'hands',…)` → `S.lord`
   - ไม่มีภาพ = พฤติกรรมเดิมทุกอย่าง · ห้ามเปลี่ยนดาเมจ/เวลา/ระยะ
6. **เทส:** `tests/motion77-art.test.cjs`: sha ต้นฉบับ · WebP มีจริง · คีย์ใน ASSET_FX ขนาดเฟรมเท่าท่ายืน · `artFollowAct` มีอยู่และเรียกใน hhTick/ggTick/hdTick · ท่าตายเล่นใน `artFollowTick` · เพิ่มเข้า `npm run check`
7. **ปล่อย:** ตาม skill release · อัปเดต README ใบนี้ "🟢 ผูกแล้ว vX · รอ QA มือถือ"

## ส่งมอบ
(ฝั่งอาร์ตกรอก: วันที่ · ไฟล์ที่ส่ง · ไฟล์ที่ขาด · เวอร์ชันที่ผูก)
MANIFEST ต่อไฟล์: `key`, `file`, `bytes`, `sha256`, `width`, `height`, `frameWidth`, `frameHeight`, `frameCount`, `columns`, `loop` (false), `anchor` (`center`), `background` (`transparent`)
