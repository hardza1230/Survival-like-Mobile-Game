# Mochi Delve — Design Spec (replaces the 100-node Atlas)

> Status: implemented in v6.30.0. Differences from the plan: width is bounded to 25 columns (x −12…12); each 10-floor segment widens then narrows into the boss floor (diamond shape); compensation = 40 Sugar per old cleared map + chaos ×ceil(N/4); delve_bg_* art hook not wired yet (colored flavor cells are the placeholder).

## Context
เจ้าของต้องการให้ endgame เป็นแบบ Delve ของ PoE: Mochitopia เป็นจุดเริ่มต้นจุดเดียว เส้นทางลงลึกได้ไม่สิ้นสุด และเลือกทางเดินเองได้ ยิ่งลึกยิ่งยาก
แผนที่ต้องไม่ทื่อ จึงต้องมีครบ 5 อย่าง:
- ภูมิศาสตร์รส (biome)
- ตำแหน่ง node ไม่ตรงเป๊ะ
- โพรงข้างทาง
- landmark หายาก
- หมอก (fog)

ระบบที่เก็บไว้ใช้ต่อ: Pact, Build, Flavor influence, node reward, Recipe run (ตัวคูณจาก `riftMul`)

ระบบที่ถูกแทน (game.js ~4260–4345, 5906–6050):
- `atlasGraph` (radial seed 62300)
- `AMAP_REGIONS` / `AMAP_RINGS`
- Guardian / `atlasPinnacleOpen`
- `atlasLayout`

## การออกแบบหลัก
**พิกัด:** node อยู่บนกริด `(x, d)`
- `d` = ความลึก 1..∞
- `x` = คอลัมน์ไม่จำกัด ฝั่งลบคือซ้าย ฝั่งบวกคือขวา
- Mochitopia อยู่ที่ (0, 0)

**Chunk:** 1 chunk = ความลึก 10 ชั้น × ความกว้าง 16 คอลัมน์
- seed ต่อ chunk = `hash(DELVE_SEED, cx, cy)` ทำให้ผลเหมือนเดิมทุกครั้ง
- สร้างเฉพาะ chunk ที่อยู่ใกล้จุดที่ไปถึงแล้ว
- เก็บใน cache ของ runtime ไม่ลงเซฟ เซฟเก็บเฉพาะ id ที่เคลียร์แล้ว

**Node ต่อชั้น:**
- แต่ละคอลัมน์มีโอกาสเกิด node 55%
- ตำแหน่งวาด = กริด + jitter ±0.3 ช่อง
- ทั้งสองอย่างใช้ seed

**เส้นทาง:**
- แต่ละ node ต่อลงชั้นถัดไป 1–2 เส้น ไปยัง node ในคอลัมน์ ±1
- มีโอกาส 15% ที่จะต่อแนวนอนไปเพื่อนบ้าน
- ใช้ union-find ต่อ chunk เพื่อรับประกันว่าทุก node ต่อถึงชั้นบนได้
- ขอบ chunk ใช้ seed ร่วม ทำให้สองฝั่งต่อกันตรง

**Biome (แกน x):**
- รสถูกกำหนดด้วย 1D value-noise บนแกน x บวก drift เล็กน้อยตามความลึก ทำให้เขตรสโค้งได้
- 5 เขตจาก `AMAP_FLAVORS`: spicy, frosty, sweet, sour, fermented
- รสของเขตกำหนดสามอย่าง:
  - flavor ของ node (แทน `amapFlavorOf`)
  - น้ำหนักของ reward
  - ด่านต้นแบบที่ยืม roster ศัตรู (`eng`)
- reward bias ตามรส:
  - spicy → อาวุธ
  - frosty → เกราะ
  - sweet → Sugar
  - sour → วัสดุ
  - fermented → unique

**ความยาก:**
- `delveMul(d)`: hp ×1.08^d, dmg ×1.06^d, reward ×(1 + 0.05d) ไม่มีเพดาน (ยิ่งยากรางวัลยิ่งดี ตามกฎเหล็ก)
- ส่งเข้า `riftMul` แทน `riftTierMul`
- ค่า tier ภายในคิดจาก `min(16, 1 + floor(d/3))` เพื่อใช้กับ iLv และดรอปเดิม
- iLv คิดจาก `endgameDepth` + d

**ชนิด node:**
| ชนิด | โอกาส | ผล |
|---|---|---|
| ⚔️ normal | ~70% | ด่าน Recipe ปกติ |
| 💎 vault | 10% | อยู่ปลายโพรงตันเท่านั้น, Sugar/ของ ×2 |
| ⛩️ shrine | 6% | บัฟถาวรในรันถัดไป + แต้ม |
| 💀 elite | 8% | HP ×1.5, การันตีของรสนั้น |
| 🏰 Candy City | 1 จุดต่อ chunk (50%) | landmark, รางวัลชุดใหญ่ + กุญแจ Pinnacle |
| 👑 Boss floor | ทุก d % 10 == 0 | ชั้นนี้มี node เดียว เป็นคอขวดที่ทุกเส้นมารวม, บอสสุ่มจากด่านเดิม HP ×2 + ชื่อพิเศษ, ชนะได้ checkpoint |

- **โพรงตัน:** ทุก chunk มีกิ่งข้าง 2–3 กิ่ง ยาว 1–2 node ไม่ต่อลงชั้นต่อไป และปลายกิ่งเป็น vault หรือ shrine

**Fog และการเปิดทาง:**
- `open(id)` = node ที่เคลียร์แล้ว หรือมีเพื่อนบ้านที่เคลียร์แล้ว
- node ที่อยู่ภายใน 3 ก้าวแสดงไอคอนรางวัล
- node ที่ไกลกว่านั้นแสดงเป็นเงา ยกเว้น 🏰 และ 👑 ที่เห็นได้ไกลถึง 8 ชั้น เพื่อล่อให้วางเส้นทาง

**Flavor influence:** ใช้ `amapInfluence` เดิม แต่ adjacency มาจาก delve graph

**Pinnacle:** ปลดเมื่อชนะบอสชั้นที่ 30 ครั้งแรก รอบแรกเล่นฟรี จากนั้นใช้กุญแจจาก 🏰 แทน Guardian

## UI (`buildAtlasMap` เขียนใหม่ ใช้ pan/zoom เดิม)
- **โครงเดิมที่ใช้ต่อ:** `_amView` container, mask, `_amv`, `atlasPointerDown/Move/Up` และ `atlasTapAt`
- **ขอบเขตโลก:** โลกเลื่อนลงได้ไม่จำกัด วาดเฉพาะ node ที่อยู่ในกรอบมองเห็น +1 chunk
- **ต้องสร้างใหม่ทุกครั้งที่ pan:** container อาจโต จึงต้อง rebuild เมื่อ pan ข้าม chunk
- **พื้นหลัง:** แถบสีตามเขตรสในแนวตั้ง ใช้อาร์ต `delve_bg_<flavor>` ถ้ามี ถ้าไม่มีใช้สีแทน
- **เส้นเชื่อม:**
  - เส้นที่เดินไปแล้วเป็นสีทอง
  - เส้นที่เปิดอยู่เป็นสีขาว
  - เส้นที่อยู่ในหมอกเป็นเส้นประจาง
- **HUD:**
  - ด้านบน: "Depth N · Best N"
  - ปุ่มทางลัด: 🏠 กลับ Mochitopia, ⬇ ไปจุดลึกสุดที่เปิดอยู่, ➕/➖
- **การแตะ node:** แตะครั้งแรกเปิดกล่องข้อมูล (ชนิด, รส, ตัวคูณ, รางวัล) แตะซ้ำไปหน้า `recipeprep`

## เซฟและ migration
- **`Save.data.delve`** เก็บ:
  - `{ ver: 1, clears: { id: n }, best, checkpoint }`
  - id มีรูปแบบ `"x,d"`
- **Migration ครั้งเดียว (`atlasMapVer !== 3`):**
  - คิดชดเชยจาก node ที่เคลียร์ไว้ใน atlas เก่า: เคลียร์ไปแล้ว N node
  - ชดเชยเป็น Sugar 40×N และ currency
  - ให้ `best` เริ่มต้นที่ min(10, ⌊N/10⌋×… ) ไม่ข้ามบอส
  - แสดง toast แจ้งผู้เล่น
- **ค่าเดิมที่เก็บไว้:** `atlasPoints` เดิมใช้ใน `egBuildPoints` และ `ATLAS_NODES` passive → เปลี่ยนเป็น `delvePoints()` = จำนวนชั้นบอสที่ชนะ ×3 + จำนวน shrine
  - ไม่จำกัดเพดาน แต่ passive ยังมีเพดานต่อโหนดตามเดิม

## Commits (ทำทีละอัน และตรวจแต่ละอัน)
1. **v6.30 Delve generator + map screen**
   - `delveChunk / delveNode / delveAdj / delveOpen / delveFlavorAt` (noise)
   - วาดแผนที่ด้วย fog และ pan ได้ไม่จำกัด
   - การเลือก node ส่งต่อให้ `recipeprep` ใช้ `r.node` แบบใหม่
   - ระบบเดิมยังทำงานจนถึง commit 3
2. **v6.31 Depth scaling + node types**
   - `delveMul` ส่งเข้า `riftMul`
   - ใช้งาน vault / shrine / elite / City / Boss floor
   - checkpoint
   - ใน `finishRecipeBoss` บันทึก clears / best และแจกรางวัลตามชนิด
3. **v6.32 Migration + ลบ atlas เก่า + เอกสาร**
   - ลบ `atlasGraph` / `AMAP_REGIONS` / `AMAP_RINGS` / Guardian
   - เพิ่ม migration และ `delvePoints`
   - Pinnacle gate ใหม่
   - validator contract
   - CLAUDE.md
   - `docs/MOCHI_DELVE_DESIGN.md` (สเปกเต็ม รวมตาราง)
4. **ใบสั่งอาร์ต** `docs/art_orders/11_MOCHI_DELVE.md` (เอกสารล้วน ทำพร้อม commit 3 ได้) อ้างกฎจาก 00 style guide:
   - พื้นหลังเขตรส 5 ภาพ `delve_bg_{spicy,frosty,sweet,sour,fermented}.webp`
     - ขนาด 1024×1024 ปูต่อแนวตั้งได้ (seamless แนว Y)
     - โทนสีตรงรส ความคมต่ำ ไม่แย่งจุด node
   - ไอคอน node 7 ชิ้น `delve_node_{normal,vault,shrine,elite,city,boss,home}.png`
     - 256×256 RGBA ทรงกลม ขอบหนา อ่านออกที่ 40px
   - Mochitopia 512 RGBA สำหรับใช้เป็นจุดบนสุด
   - ม่านหมอก `delve_fog.png` 512 seamless alpha
   - เส้นทางแบบ texture `delve_path.png` 64×256 seamless แนวยาว (ทางเลือก ถ้าไม่มีให้วาดด้วยโค้ด)
   - ปกการ์ด Boss floor 5 ภาพ ตามรส (ทางเลือกระยะหลัง)
   - ที่วางไฟล์: `assets/incoming/delve/` ฝั่งโค้ดจะย้ายไปที่ `assets/art/delve/`
   - ใส่ prompt ตัวอย่าง, MANIFEST และ checklist ตรวจรับ
   - ทุก key มี placeholder ที่วาดด้วยโค้ดไว้ก่อน (เล่นได้ทันทีโดยไม่ต้องรออาร์ต)

## ความเสี่ยงและวิธีกัน
- **ประสิทธิภาพตอนวาด:** วาดเฉพาะ chunk ที่มองเห็น จำกัดไม่เกิน ~120 node ต่อเฟรม และ cache Graphics
- **ทางตันทั้ง chunk:** union-find บวกการบังคับให้มี node อย่างน้อย 2 จุดต่อชั้น และ validator เดิน BFS ถึงความลึก 200
- **บอสเลข d สูงจนเอาชนะไม่ได้:** ไม่มีเพดานตามที่เจ้าของต้องการ แต่ checkpoint ทำให้ไม่ต้องย้อนลงใหม่ ส่วนตัวเลขค่อยจูนจากการเล่นจริง
- **seed ไม่คงที่:** ใช้ `mulberry32` เดิมเท่านั้น และห้ามใช้ `Math.random` ใน generator

## Verification
- **`npm run check`:** validator เพิ่ม contract สำหรับ:
  - deterministic: สร้าง chunk ซ้ำ 2 ครั้งต้องได้ผลเท่ากัน
  - BFS ไปถึงความลึก 200 ได้
  - ชั้นบอสมี 1 node
  - `delveMul` เพิ่มขึ้นตาม d
- **Headless Playwright (`_t.cjs`):**
  - เปิด atlas แล้ว pan ลงไปถึงความลึก 50 ต้องไม่มี error
  - เคลียร์ node เพื่อเปิดเพื่อนบ้าน
  - เล่น recipe run ที่ d=10 ให้บอสขึ้น
  - ทดสอบ migration ด้วยเซฟ v2
- **Screenshot:** 390×844 ทั้งหน้า map และหน้า prep
- **มือถือจริง:** ความลื่นตอน pan/pinch และอ่านไอคอนออก
