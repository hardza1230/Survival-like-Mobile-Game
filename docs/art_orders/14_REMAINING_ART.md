# 🎨 ใบสั่งงานอาร์ตที่เหลือทั้งหมด (อัปเดต v6.55.99 · 8 ต.ค. 2026)

อ่าน `00_STYLE_GUIDE.md` และกติกาประหยัดโควต้าใน `NEXT_BATCH_REQUEST.md` §0 ก่อนเริ่ม
(1 ครั้งที่สร้างภาพ = 1 แผ่นรวม · กริดเท่ากัน · วัตถุไม่ล้นช่อง · พื้นโปร่งใสหรือเขียว `#00FF00` · ไม่มีตัวหนังสือ/เส้นกริด)

ใบสั่ง 01–13 ส่งครบและใส่เข้าเกมแล้ว ไฟล์นี้รวมเฉพาะ**สิ่งที่ยังขาดอยู่จริงในเกมตอนนี้**

## สรุป

| ลำดับ | งาน | จำนวนภาพที่ต้องสร้าง | ความสำคัญ |
|---|---|---|---|
| A | ชีตอนิเมชันมอนสเตอร์ Chapter 2 | ✅ ครบ 7A/7B/8/9 v6.55.99 | 🔴 |
| B | Elite / ตัวพิเศษ / Mini Jelly รวม Crown Sapling | ✅ ครบ 5 ชีต v6.55.95 | 🟠 |
| C | อาร์ตอุปกรณ์ชุด Chef | ✅ ครบ 2 ชิ้น v6.55.96 | 🟠 |
| D | ไอคอนการ์ด Unique ของสาย Build | ✅ 15 ไอคอน + ช่องสำรอง v6.55.97 | 🟡 |
| E | VFX ของ Unique ใหม่ (Berry Blast / Glacier Bloom / Frost Lance) | ✅ ครบ 5 เอฟเฟกต์ v6.55.98 | 🟡 |

ทุกเฟรมและทุกช่องต้องเป็นตัวละครหรือวัตถุตัวเดิม ห้ามออกแบบใหม่ ฝั่งโค้ดจะใช้ hitbox และขนาดเดิมของมันต่อ

---

## A. ชีตอนิเมชันมอนสเตอร์ Chapter 2 ✅ ส่งครบ v6.55.99

**อัปเดต v6.55.99:** A1–A5 ส่งครบและผูกเข้าเกมแล้ว รวม Batch 7A/7B/8/9 ส่วน B–E ก็ส่งครบแล้ว เหลือการตรวจภาพ/FPS และเกมเพลย์บนมือถือจริงโดยเจ้าของ

ตอนนี้ C2-4 ถึง C2-5 ใช้ **atlas ภาพนิ่ง** คือ 1 ช่องต่อ 1 สายพันธุ์ ยังไม่มีท่าเดิน, ท่าโจมตี, ท่าเจ็บ หรือท่าตาย ส่วน C2-1 ถึง C2-3 ใช้ชีตอนิเมชันแล้ว

Chapter 1 และ Chapter 3 ทำครบแล้ว ให้ใช้ชุดตัวอย่างเหล่านี้เป็นแบบ:
- `assets/incoming/ch1_ice_animations/`
- `assets/incoming/monster_batch6/`

ในแต่ละโฟลเดอร์มี MANIFEST, prompt และ preview ให้ดู

### สเปกต่อ 1 สายพันธุ์ (เหมือน Chapter 1)
- แผ่น **4 คอลัมน์ × 4 แถว = 16 ช่อง** ช่องละ **256×256** พื้นโปร่งใส
- เรียงเฟรมตามนี้:

| ช่อง | ท่า |
|---|---|
| 0–5 | เดิน 6 เฟรม (ตัวบินให้ขยับปีกหรือลำตัวแทนขา) |
| 6–7 | ยืนนิ่ง (idle) 2 เฟรม |
| 8–11 | โจมตี: ง้าง → ปล่อย → ค้าง → คืนท่า |
| 12–13 | โดนตี (hurt) 2 เฟรม |
| 14–15 | ตาย 2 เฟรม |

- ตัวต้องขนาดเท่ากันทุกเฟรม และเท้าอยู่บนเส้นพื้นเดียวกัน
- เอฟเฟกต์ห้ามล้นออกนอกช่อง
- หันหน้าไปทางขวา ถ้าหันซ้ายให้เขียนบอกใน MANIFEST
- ต้นแบบหน้าตา: ใช้ภาพจากช่อง atlas เดิมเป็นแบบ ดูตารางในแต่ละด่านด้านล่าง

### A1 · Batch 7A — C2-1 Fermented Canopy ✅ v6.55.92 (`assets/ch2_enemy_atlas.png`)
ส่งที่ `assets/incoming/ch2_s1_animations/`

| key | ชื่อ | บทบาท | จุดเด่นของท่าโจมตี |
|---|---|---|---|
| `c21_sprout` | Ferment Sprout | basic | กระโดดชน |
| `c21_vine_hunter` | Vine Hunter | fast / dasher | ย่อตัวแล้วพุ่ง |
| `c21_spore_lantern` | Spore Lantern | shooter | โคมเรืองแสงก่อนยิงสปอร์ |
| `c21_fruit_pod` | Rotten Fruit Pod | bomber | บวมพองก่อนแตก |
| `c21_root_beetle` | Root-Back Beetle | tank | กระแทกพื้น |
| `c21_thorn_oracle` | Thorn Oracle | siege | ยกไม้เท้าหนาม |

### A2 · Batch 7B — C2-2 Mycelium Marsh ✅ v6.55.93 (`assets/ch2_mycelium_enemy_atlas.png`)
ส่งที่ `assets/incoming/ch2_s2_animations/`

| key | ชื่อ | บทบาท | จุดเด่นของท่าโจมตี |
|---|---|---|---|
| `c22_drifter` | Mycelium Drifter | basic | ลอยตัว |
| `c22_hopper` | Cap Hopper | fast / dasher | กระโดดหมวกเห็ด |
| `c22_sniper` | Puffcap Sniper | shooter | พองหมวกแล้วพ่นสปอร์ |
| `c22_mold_sac` | Mold Sac | bomber | ถุงราขยายตัวแล้วแตก |
| `c22_bulwark` | Mycelium Bulwark | tank | ยกโล่รากใยเห็ด |
| `c22_oracle` | Threadweaver Oracle | siege / shooter | ทอใยเรืองแสง |
| `c22_sporeling` | **Sporeling** | ตัวเล็กที่แตกออกจากตัวอื่น | ตัวเล็กมาก ท่าวิ่งงุ่มง่าม |

### A3 · commit 8 ✅ delivered v6.55.94 — C2-3 Nectar Hive (`assets/ch2_nectar_enemy_atlas.png`)
ส่งที่ `assets/incoming/ch2_s3_animations/` · ตัวบินทั้งหมดให้กระพือปีก

| key | ชื่อ | บทบาท | จุดเด่นของท่าโจมตี |
|---|---|---|---|
| `c23_drone` | Nectar Drone | basic | พุ่งต่อย |
| `c23_dartwing` | Dartwing | fast / dasher | ชี้เหล็กในแล้วพุ่ง |
| `c23_pollen_sniper` | Pollen Sniper | shooter | ยิงละอองเกสร |
| `c23_honey_bomb` | Honey Bomb | bomber | น้ำผึ้งเดือดก่อนระเบิด |
| `c23_wax_guard` | Wax Shieldbearer | tank | ยกโล่ขี้ผึ้ง |
| `c23_choir_moth` | Choir Moth | siege / shooter | กางปีกร้องเพลง |
| `c23_grub` | **Tiny Grub** | ตัวเล็กที่ถูกเรียกออกมา | คลานดุ๊กดิ๊ก |

### A4 · commit 9 ✅ delivered v6.55.99 — C2-4 Four-Season Conservatory (`assets/ch2_seasons_enemy_atlas.png`)
ส่งที่ `assets/incoming/ch2_s4_animations/`

| key | ชื่อ | บทบาท | จุดเด่นของท่าโจมตี |
|---|---|---|---|
| `c24_budling` | Spring Budling | basic | ตูมดอกเด้ง |
| `c24_sunscarab` | Summer Sunscarab | fast | กางปีกแมลงสีทอง |
| `c24_leafblade` | Autumn Leafblade | dasher | ฟันด้วยใบไม้ |
| `c24_frostbell` | Winter Frostbell | shooter | ระฆังน้ำแข็งสั่น |
| `c24_stormfruit` | Stormcloud Fruit | bomber | ผลไม้มีประกายไฟฟ้า |
| `c24_equinox` | Equinox Gardener | tank (และ **Elite**) | ฟาดกรรไกรตัดกิ่ง |
| `c24_season_wisp` | Seasonal Wisp | siege / shooter | วิญญาณเปลี่ยนสี 4 ฤดู |

### A5 · commit 9 ✅ delivered v6.55.99 — C2-5 Root Throne (`assets/ch2_root_enemy_atlas.png`)
ส่งที่ `assets/incoming/ch2_s5_animations/`

| key | ชื่อ | บทบาท | จุดเด่นของท่าโจมตี |
|---|---|---|---|
| `c25_rootling` | Crown Rootling | basic | เดินรากเตี้ย |
| `c25_thorn_charger` | Thorn Charger | fast | ก้มหัวหนามแล้วชาร์จ |
| `c25_bramble_assassin` | Bramble Assassin | dasher | ท่าเงาฟัน |
| `c25_sap_oracle` | Sap Oracle | shooter | ยิงยางไม้ |
| `c25_seed_bomb` | Memory Seed Bomb | bomber | เมล็ดเรืองแสงแตก |
| `c25_bark_guard` | Bark Bulwark | tank | โล่เปลือกไม้ |
| `c25_root_choir` | Root Choir Leech | siege / shooter | ปากรากร้อง |

> ประหยัดโควต้า: ทำ 1 สายพันธุ์ต่อ 1 ครั้งที่สร้างภาพ (แผ่น 4×4) ถ้าช่องไหนเสีย ให้ทำใหม่แค่ช่องนั้นเป็นไฟล์ `<key>_f<ช่อง>.png`

---

## B. Elite / ตัวที่ถูกเรียก / Mini Jelly ✅ ส่งแล้ว v6.55.95
ส่งที่ `assets/incoming/elite_summons/` ใช้สเปก 4×4 แบบเดียวกับ A

| key | ตัว | ใช้ที่ไหน | หมายเหตุ |
|---|---|---|---|
| `c21_crown_sapling` | Crown Sapling | Elite ของ C2-1 | ใช้ต้นแบบ atlas C2-1 ช่อง 6; เป็นคนละตัวกับ Root-Back Beetle |
| `mini_jelly` | Mini Jelly (ลูกเจลลี่ 3 ตัวที่ Jelly Warden แบ่งตัวออกมา) | Delve ชั้น 10/30/50… | หน้าตาเป็นเวอร์ชันจิ๋วของ `boss_delve10` (Jelly Warden) สีเดียวกัน |
| `c3_elite` | Elite ทั่วไปของ Chapter 3 (ตอนนี้ใช้ตัว tank ขยาย) | ด่าน C3-1…C3-5 | ตัวใหญ่ หุ้มเกราะเมล็ดพันธุ์สีเทาเถ้าทอง มีมงกุฎเล็ก |
| `feast_target` | เป้า 🍖 Feast ใน Delve (ตอนนี้ใช้ Elite ย้อมส้ม) | Delve ทุกชั้น | โมจิอ้วนถือจานอาหาร ท่าวิ่งหนี ไม่มีท่าโจมตี (ช่อง 8–11 = ท่าวิ่งหนีเร็ว) |
| `mimic_chest` | Mimic กล่องสมบัติ (ตอนนี้เอา Elite มาแต่งเป็นกล่อง) | กล่องมินิบอส 12% | กล่องสมบัติมีฟัน ท่าเดินกระโดด ท่าโจมตีอ้าปากงับ |

---

## C. อาร์ตอุปกรณ์ชุด Chef ✅ ส่งแล้ว v6.55.96
ทั้ง 2 ชิ้นมีภาพ PNG โปร่งใสและผูกเข้าเกมแล้ว ผ่านระบบอุปกรณ์เดิม ราคาและค่าสเตตัสคงเดิม

- ทำ 1 แผ่นรวม **2 คอลัมน์ × 1 แถว** ช่องละ 256×256 พื้นโปร่งใส
- สไตล์ให้ตรงกับไอคอนในโฟลเดอร์ `assets/gear/amulets/` และ `assets/gear/rings/`

| ช่อง | key | ชิ้น | หน้าตา |
|---|---|---|---|
| (0,0) | `gear_am_chef` | Head Chef Medal (สร้อย, epic) | เหรียญทองรูปหมวกเชฟ ห้อยริบบิ้นแดงขาว |
| (0,1) | `gear_ri_chef` | Golden Spoon Ring (แหวน, epic) | แหวนทองที่หัวแหวนเป็นช้อนจิ๋ว ประดับอัญมณีชมพู |

ไฟล์ที่ได้ ฝั่งโค้ดจะวางไว้ที่ `assets/gear/amulets/am_chef.png` และ `assets/gear/rings/ri_chef.png`

---

## D. ไอคอนการ์ด Unique ของสาย Build ✅ ส่งแล้ว v6.55.97
ครบ 15 ไอคอนเฉพาะการ์ดและ 1 ช่องสำรองโปร่งใส ผูกเข้าการ์ดเดิมแล้ว เอฟเฟกต์และค่าการ์ดคงเดิม

- ทำ 1 แผ่นรวม **4 คอลัมน์ × 4 แถว** ช่องละ 256×256
- สไตล์ให้เหมือนไอคอนใน `assets/art/build_paths/`

| ช่อง | key | การ์ด | ไอเดียภาพ |
|---|---|---|---|
| (0,0) | `ic_card_s_heavy` | Heavy Round (Sniper) | เมล็ดสตรอว์เบอร์รีหัวกระสุนใหญ่หนัก |
| (0,1) | `ic_card_s_quick` | Quick Scope | กล้องเล็ง + นาฬิกาจับเวลา |
| (0,2) | `ic_card_s_bore` | Wide Bore | ลำแสงกว้างมีลมหมุน |
| (0,3) | `ic_card_s_split` | Split Shot | ลำแสงแตกเป็นสามทาง |
| (1,0) | `ic_card_b_wide` | Wide Blast (Shotgun) | กรวยเม็ดสีชมพูกว้าง |
| (1,1) | `ic_card_b_recoil` | Recoil Hop | กระต่ายกระโดดถอยหลัง มีควันปืน |
| (1,2) | `ic_card_b_double` | Double Tap | ลูกซองสองกระบอกคู่ |
| (1,3) | `ic_card_buckshot` | Buckshot | กำเมล็ดลูกปราย |
| (2,0) | `ic_card_m_grow` | Wider Bloom (Mint Freeze) | วงน้ำแข็งดอกไม้ขยาย |
| (2,1) | `ic_card_m_hold` | Long Winter | นาฬิกาทรายน้ำแข็ง |
| (2,2) | `ic_card_m_shard` | Shard Spray | ผลึกน้ำแข็งแตกกระจาย |
| (2,3) | `ic_card_l_far` | Long Lance (Mint Piercer) | หอกน้ำแข็งยาว + ลูกศรระยะ |
| (3,0) | `ic_card_l_twin` | Twin Lance | หอกน้ำแข็งไขว้คู่ |
| (3,1) | `ic_card_l_burst` | Lance Burst | ปลายหอกระเบิดเป็นดาวน้ำแข็ง |
| (3,2) | `ic_card_pointblank` | Point Blank | ปากกระบอกจ่อ มีประกายไฟ |
| (3,3) | (ว่าง / สำรอง) | — | — |

---

## E. VFX ของ Unique ใหม่ ✅ ส่งแล้ว v6.55.98
ครบ 4 ชีต × 8 เฟรม และทางน้ำแข็ง 1 ภาพ ผูกเข้าเกมแล้ว กลไกต่อสู้คงเดิม

- ส่งที่ `assets/incoming/vfx_path_uniques/`
- เฟรมเรียงซ้าย→ขวา 8 เฟรมต่อแถว พื้นโปร่งใส ใช้ blend แบบ NORMAL (ดูกติกา VFX ใน CLAUDE.md: alpha ตามความสว่าง ไม่ใช้พื้นดำ)

| แถว | key | ใช้กับ | เฟรม | ขนาดเฟรม |
|---|---|---|---|---|
| 0 | `vfx_berry_blast` | Berry Blast — กรวยเม็ดสีชมพู/ทองระเบิดออกจากปากกระบอก | 8 | 384×256 (กรวยชี้ไปทางขวา จุดกำเนิดอยู่ขอบซ้ายกลาง) |
| 1 | `vfx_shotgun_muzzle` | แสงปากกระบอกตอนยิงธรรมดาของสาย Shotgun | 8 | 192×128 (ชี้ไปทางขวา) |
| 2 | `vfx_glacier_bloom` | Glacier Bloom — ดอกน้ำแข็งบานเป็นวง (มองจากด้านบน) | 8 | 384×384 |
| 3 | `vfx_glacier_shatter` | น้ำแข็งแตกตอนมอนที่ถูกแช่หลุด | 8 | 192×192 |
| 4 | `vfx_frost_lance_trail` | ทางน้ำแข็งที่ Frost Lance ทิ้งไว้ (แถบยาวต่อกันได้แนวนอน) | 1 (ภาพนิ่ง) | 512×96 |

---

## ส่งงาน
1. วางไฟล์ตามโฟลเดอร์ `assets/incoming/<batch>/` ที่ระบุไว้ในแต่ละหัวข้อ
2. ใส่ `MANIFEST.md` ในแต่ละโฟลเดอร์ บอกว่าช่องไหนเป็น key อะไร และตัวไหนหันซ้าย
3. อัปเดตสถานะในตาราง `README.md` เป็น ✅ ส่งแล้ว

จากนั้นฝั่งโค้ดจะจัดการต่อเอง: ตัดภาพ → แปลงเป็น webp → ย้ายไป `assets/art/` → ผูกเข้าเกม → ทดสอบ


Batch 8 complete: seven creatures/112 poses. Remaining ordinary creatures: 14 in batches 9–10. Seven Nectar Hive creatures including Tiny Grub receive 16 authored poses each. Flying species flap wings; Dartwing has windup/dash, both Pollen Sniper and Choir Moth have preparation/firing, Honey Bomb has a once-per-life low-HP warning. Runtime assets: assets/art/ch2_nectar. Original/raw/packed sources, exact prompts, packing and review: assets/incoming/ch2_s3_animations. Original HP/damage/speed/EXP, circles, wax guard aura and 0.74 guard multiplier, flower targeting, Choir Moth three-shot fan, caps and Story P1–P5 remain. Atlas cell 7 flower fallback, generic Elite and boss/miniboss art remain. Tiny Grub has an existing atlas/type mapping but no current spawn caller or special stat branch; its existing basic stats/1 EXP remain, without adding summons. Owner mobile visual/FPS review pending. Next: batch 9, Four-Season Conservatory and Root Throne.


Elite/special art batch B is implemented: Crown Sapling, Mini Jelly, Chapter 3 Elite, Feast Target and Mimic Chest each have 16 authored poses. Packed RGBA PNG/raw/exact prompts/packing/contact/animated review: assets/incoming/elite_summons; runtime lossless alpha WebP: assets/art/elite_summons. Crown Sapling uses C2-1 atlas cell 6 identity; Chapter 3 Elite uses the ash/gold crowned seed knight design from the brief. Feast carries a food plate and uses flee clips, without an attack clip. Mimic is a toothy living chest. Existing world sprite boxes/circle radii/centers are preserved when 62px generic Elite and 48px chest art become 256px frames. Mini Jelly keeps .36 scale and [70,58,70] circle. HP/damage/speed/EXP, Elite gates, Warden half-HP three-child split, Feast timers/Hunger share and Mimic chance/tier/reward remain. Animated Feast pool reuse cancels its escape fade and clears fleeing state; missing sheets retain original art. Boss/miniboss pose/death controllers remain separate. Owner mobile visual/FPS review pending. Ordinary season/root art (batch 9), Chef gear and card/Unique VFX art remain.


## Chef delivery — v6.55.96

Head Chef Medal and Golden Spoon Ring now use painted 256px RGBA icons through the existing gear image loader and shared equipment/crafting/Bazaar/reward views. Runtime: assets/gear/amulets/am_chef.png and assets/gear/rings/ri_chef.png. Combined sheet, original generation, exact prompt and packing metadata: assets/incoming/chef_gear. Prices, enhancement effects, stats and Royal Chef set bonuses are unchanged. Owner mobile visual review pending. Remaining art: batch 9 (14 ordinary season/root creatures), Unique build card icons and Unique VFX.


## Build card delivery — v6.55.97

Fifteen Build upgrade cards now have distinct painted icons: four Sniper, five Shotgun, three Glacier Bloom and three Crystal Impaler cards. The 4x4 source sheet keeps the final cell reserved/transparent. Runtime lossless alpha WebP: assets/art/build_cards; original/normalized sheet, 256px RGBA PNGs, exact prompt, packing and preview: assets/incoming/build_cards. Only upgrade iconKey mappings change; build-selection art, effects, ranks, prices, draft weighting and P1–P5 balance remain. Owner mobile visual review pending. Remaining art: batch 9 (14 ordinary season/root creatures) and Unique VFX.


## Build VFX delivery — v6.55.98

Five painted Build effects are integrated: Berry Blast, Shotgun muzzle flash, Glacier Bloom, Glacier Shatter (eight authored frames each), and static Frost Lance ground trail. Runtime alpha WebP: assets/vfx; raw/packed PNGs, exact prompt, frame metadata and review: assets/incoming/vfx_path_uniques. Effects use NORMAL blend, central tracked cleanup and original missing-art fallbacks. Existing three-per-200ms shatter visual budget remains; trail expiry removes art and transition cleanup removes both art and trail damage state. Damage/range/charge timing, freeze duration, three-second trail/0.4s damage ticks, twin dash and card effects remain. Owner phone visual/FPS review pending. Remaining art: batch 9, 14 ordinary season/root creatures.


## Batch 9 delivery — v6.55.99

Batch 9 is implemented: seven Four-Season Conservatory and seven Root Throne species each have 16 authored movement/idle/action/hurt/death poses (224 total). Runtime lossless-alpha WebP: assets/art/ch2_seasons and assets/art/ch2_root. Raw/packed PNGs, exact prompts, manifest, packing and animated review: assets/incoming/ch2_s4_animations and assets/incoming/ch2_s5_animations. Equinox Colossus Elite shares the existing golem identity while retaining .42 scale and [48,80,80] circle. Four shooters have preparation/fire clips, both dashers have windup/dash and both bombers warn once per life. Existing stats, colliders, aura values (.76 Seasons/.78 Root), five/six-shot siege volleys, objective nodes, boss/miniboss controllers and P1–P5 balance remain. Root identity references use atlas cells 0/1/6/2/3/4/5 in named species order; the old generic fallback retains its original type/frame mapping. Batch 9 regression fixtures capture original combat at v6.55.98. All scoped art orders A–E are delivered; owner mobile visual/FPS and gameplay review remain pending.
