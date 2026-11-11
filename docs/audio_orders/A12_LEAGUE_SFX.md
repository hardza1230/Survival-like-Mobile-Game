# A12 — เสียงภารกิจ League / Trial / Forge / Memory Book / Patrol · ใบสั่งเสียง + ผูกเอง

สถานะ: 🟡 รอเสียง · เขียน 11 พ.ย. 2026 · **AI ฝั่งเสียงทำเสียงและผูกเข้าเกมเองในใบนี้** (ทำตามหัวข้อ "ผูกเข้าเกม")
เครื่องมือ: **ElevenLabs Sound Effects** (เจ้าของสั่ง: ห้ามใช้เสียงสร้างด้วยโค้ด/Runway แทน) · ไม่มีเสียงพูดในใบนี้

## สิ่งที่ตรวจพบ (11 พ.ย.)
- ภารกิจใหม่ v8.1.81–v8.1.92 (Frozen Pantry, Breach, Creeping Roots, Herald, Grandma's Pot, Golem, Siege, Domain, Sugar Crown Trial) **ไม่มีเสียงของตัวเอง** — ใช้เสียงกลางซ้ำ ๆ (`bossWarn`, `quest_focus`) หรือเงียบ
- Forge สกุลแถว/ย้าย mod, Codex ใน Memory Book และหน้า Mochi Patrol ก็ยังเงียบ

## รูปแบบไฟล์
MP3 mono 44.1 kHz 128 kbps · peak ≤ −1 dBTP · ตัดเงียบต้นไฟล์ ≤ 40 ms · ความยาวตามตาราง · เสียงน่ารักแนวขนมหวาน (ไม่สยอง ไม่ดังแสบหู) · เข้าชุดกับเสียงเดิมใน `assets/audio/sfx/`

## รายการเสียง (36)
### ส่วน A — Breach / Domain (8)
| key | ความยาว | เสียง |
|---|---|---|
| `lg_breach_open` | 1.2s | ผ้าฉีกเป็นวงกว้าง + ลมดูดลึก ๆ + ประกายใส |
| `lg_breach_collapse` | 1.4s | เสียงดูดกลับเข้ากลาง ฮู่ววว แล้วปิด "ป็อป" |
| `lg_splinter_pick` | 0.3s | คริสตัลเล็กกริ๊ง ใส สั้น (เล่นถี่ได้ ต้องไม่น่ารำคาญ) |
| `lg_breach_chest` | 0.8s | มือแยกออก + ของขนมกระเด็น + กริ๊งทอง |
| `lg_hunger_stone` | 1.2s | เศษคริสตัลหมุนรวมกันแล้ว "ตึ้ง" ทุ้มกังวาน |
| `lg_hand_lord` | 1.0s | มือยักษ์โผล่: เสียงนิ้วขยับกรอบแกรบ + คำรามต่ำ |
| `lg_domain_open` | 1.6s | ถ้ำสั่น รอยแยกเปิดทั้งห้อง + โดรนต่ำลึกลับ |
| `lg_breachlord` | 1.8s | บอสโผล่: คำรามก้อง + มือหลายข้างกระพือ (น่าเกรงขามแต่ไม่สยอง) |

### ส่วน B — ภารกิจ League อื่น (15)
| key | ความยาว | เสียง |
|---|---|---|
| `lg_jar_open` | 0.8s | ฝาโหลแก้วเปิด + ไอเย็นพุ่ง ฟู่ |
| `lg_statue_wake` | 0.7s | น้ำแข็งแตก + โมจิเด้ง "บึ๋ง" |
| `lg_statue_refreeze` | 0.8s | น้ำแข็งเกาะกลับ กริ๊ก ๆ แล้วหายวับ |
| `lg_herald_horn` | 1.0s | แตรทองเป่าสั้น เพี้ยนนิด ๆ น่ารัก |
| `lg_gates_shut` | 0.9s | ประตูมิติหลายบานปิดพร้อมกัน วูบ-ปัง |
| `lg_ingredient_pick` | 0.3s | เก็บผลไม้ "ป๊อก" ใส (เล่นถี่ได้) |
| `lg_pot_deposit` | 0.5s | ของตกลงหม้อซุป "จ๋อม" + ฟองปุด |
| `lg_dish_served` | 1.2s | ฝาหม้อเปิด ไอหอม + ระฆังเล็ก "ติ๊ง" ฉลอง |
| `lg_golem_part` | 0.4s | ชิ้นขนมแข็ง ๆ ตกถูกเก็บ "ป๊อก" ทุ้ม |
| `lg_golem_bake` | 1.4s | เตาไฟลุกพรึ่บ + ประตูเตาเปิด + โกเลมยืนขึ้น "ตึง" |
| `lg_golem_slam` | 0.7s | ทุบพื้นหนัก ๆ แบบขนมปังอัด ตุ้บ (มีเบส) |
| `lg_golem_crumble` | 1.0s | โกเลมพังเป็นกองขนม ร่วงกรุบกรับ |
| `lg_root_cut` | 0.5s | ฟันรากสด "ฉึบ" + ใบไม้ร่วง |
| `lg_siege_gate` | 0.6s | ประตูปล่อยฝูง ฟู่บ (เล่นทุก 2.4s ต้องเบา) |
| `lg_siege_break` | 1.4s | ป้อมแตก คลื่นทอง + เสียงเชียร์ "เย้" แผ่ว ๆ |

### ส่วน C — Sugar Crown Trial (5)
| key | ความยาว | เสียง |
|---|---|---|
| `tr_curse_pick` | 0.9s | วงคำสาปจุด: เสียงกระซิบเวท + ระฆังต่ำ |
| `tr_round_won` | 0.9s | จบรอบ: คอร์ดทองขึ้นสั้น |
| `tr_take` | 0.8s | รับของ: กล่องของขวัญเปิด + เสียงสบายใจ |
| `tr_risk` | 0.8s | เสี่ยงต่อ: ดาบชักออก "ชริ้ง" + กลองตึง |
| `tr_fail` | 1.0s | แพ้กลางทาง: มงกุฎหล่น "กริ๊ง" + ลมหายใจเศร้าสั้น |

### ส่วน D — เมนู / Patrol (8)
| key | ความยาว | เสียง |
|---|---|---|
| `ui_forge_row_up` | 0.6s | ตีบวกแถวสูง (แยม/น้ำผึ้ง/น้ำตาลดาว): ค้อนเล็กกระทบ + กริ๊งหวาน |
| `ui_forge_ink_move` | 0.9s | หมึกไหล + ปากกาขีด "ซวบ" + ติ๊ง |
| `ui_codex_up` | 0.8s | สมุดพลิกหน้า + แสงทองกังวาน |
| `ui_memory_gain` | 0.5s | ความทรงจำลอยเข้า: ประกายนุ่ม (เล่นตอนได้ 💭 ในหน้าจบด่าน) |
| `ui_domain_button` | 0.6s | กดใช้ Hunger Stone: หินคริสตัลกระทบ + เสียงต่ำลึกลับ |
| `pt_pop` | 0.3s | มอนโมจิแตกในหน้า Patrol: ป๊อปเบา ๆ นุ่ม (เล่นทุก 1.5s ต้องไม่รำคาญ) |
| `pt_loot` | 0.3s | ของเด้งขึ้น ติ๊ง เบา |
| `pt_ambient_loop` | 20s · **loop ไร้รอยต่อ** | กลางคืนสงบ: จิ้งหรีด ลมเบา โคมไฟ เสียงเบามาก (เปิดค้างได้นาน) |

**รวม 36 ไฟล์**

## ส่งมอบ
`assets/incoming/audio_a12/` + `MANIFEST.json` (key, file, bytes, sha256, duration_ms, kind `sfx`, loop) + `PROMPTS.json` + `QA_REPORT.json` (peak, ความยาว, เงียบต้นไฟล์)

## ผูกเข้าเกม (AI ฝั่งเสียงทำเอง)
อ่าน `docs/audio_orders/A11_NEW_SCREENS_SFX.md` (โน้ตส่วน B = วิธีผูกเสียง SFX ที่ใช้อยู่) และ `.claude/skills/release/SKILL.md` ก่อน
1. **ตรวจ:** MANIFEST 36 แถว · bytes/sha256 · MP3 อ่านได้ · ความยาว ±20% ตามตาราง (สคริปต์)
2. **ติดตั้ง:** คัดลอกไป `assets/audio/sfx/a12/<key>.mp3` · ลง `ASSET_AUDIO` เป็น `sfx_<key>:'assets/audio/sfx/a12/<key>.mp3'` (URL string ตรง ๆ) · โหลดแบบเดียวกับไฟล์ `sfx/a11/` (ค้นคำ `sfx/a11/` ในตัวโหลดแล้วทำตาม) · ห้ามโหลดตอนบูต
3. **เรียกเสียง:** ในด่านใช้ `Sfx.orderCue?.('<key>',vol,gap)` (ไม่มีไฟล์ = เงียบ/เสียงเดิม ไม่ error) · เมนูใช้ `Sfx.menuCue?.('<key>',vol)` · เสียงที่เล่นถี่ (`lg_splinter_pick`, `lg_ingredient_pick`, `lg_siege_gate`, `pt_pop`, `pt_loot`) ใส่ gap ≥ 0.12 และ vol ≤ 0.3 · เสียงเดิมที่จุดนั้น (`bossWarn`, `quest_focus` ฯลฯ) ให้ **แทนที่** เมื่อมีไฟล์ใหม่ ไม่ซ้อน
   | key | จุดเรียก (game.js) |
   |---|---|
   | lg_breach_open / lg_breach_collapse | `hmOpen` / `hmTick` ตอน `S.phase='close'` |
   | lg_splinter_pick / lg_breach_chest / lg_hunger_stone | `hmTick` เก็บ shard / `hmChest` / `hmSplinters` เมื่อ `made>0` |
   | lg_hand_lord / lg_domain_open / lg_breachlord | `hmTick` สร้าง `_hmLord` / `hdSetup` / `hdLord` |
   | lg_jar_open / lg_statue_wake / lg_statue_refreeze | `fpOpen` / `fpWake` / `fpVanish` |
   | lg_herald_horn / lg_gates_shut | `hhTick` ตอนประตูปล่อยฝูง (gap 2s) / `hhDown` |
   | lg_ingredient_pick / lg_pot_deposit / lg_dish_served | `gpTick` เก็บ / `gpTick` ใส่หม้อ (`put>0`) / `gpServe` |
   | lg_golem_part / lg_golem_bake / lg_golem_slam / lg_golem_crumble | `ggTick` เก็บชิ้น / `ggBake` / `ggTick` tick('arms') / `ggDown` |
   | lg_root_cut | `crTick` ตอน `L.open=false` |
   | lg_siege_gate / lg_siege_break | `hsTick` ตอนปล่อยระลอก / `hsBurst` |
   | tr_curse_pick / tr_round_won / tr_take / tr_risk / tr_fail | `ultStartFight` / `ultRoundWon` / `ultFinish` (take) / เลือกเสี่ยง (`ultTick`) / `ultFinish` (fail) |
   | ui_forge_row_up | `forgeUpgrade` เมื่อ `line>0` (แถว 1 ใช้เสียงเดิม) |
   | ui_forge_ink_move / ui_codex_up / ui_domain_button | `forgeMove` สำเร็จ / `codexUpgrade` สำเร็จ / ปุ่ม 🪨 Domain ในแผง Delve |
   | ui_memory_gain | หน้าสรุปด่านตอนแสดง 💭 ที่ได้ (ถ้าไม่มีจุดแสดง ให้เล่นใน `Save.addKill` เมื่อ `mem>0` ผ่าน `Sfx.menuCue` แบบ gap 2s) |
   | pt_pop / pt_loot / pt_ambient_loop | `patrolPop` / ตอนสร้าง `pt_loot` ใน `buildPatrol` / เปิดเมื่อเข้าหน้า Patrol ปิดเมื่อออก (ใช้ระบบ loop แบบ `Sfx.eventLoop…` ที่มีอยู่) |
4. **เทส:** `tests/audio-a12.test.cjs` (ก๊อปแบบเทส A11 ใน `tests/`): sha ต้นฉบับ · ไฟล์ติดตั้งครบ · คีย์ใน `ASSET_AUDIO` · ทุก key ถูกเรียกในฟังก์ชันตามตาราง · เพิ่มเข้า `npm run check`
5. **ปล่อย:** ตาม skill release · อัปเดตสถานะบรรทัดบนสุดของใบนี้เป็น "🟢 ผูกแล้ว vX · รอเจ้าของฟังตรวจ"
