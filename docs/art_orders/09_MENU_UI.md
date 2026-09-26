# 09 — อาร์ตเมนู: ปุ่ม · การ์ดด่าน · พื้นหลังแต่ละหน้า

ตอนนี้เมนูส่วนใหญ่ = พื้นสีเรียบ + อีโมจิ · ชุดนี้ทำให้ทุกหน้าในเกมมีภาพจริง
แบ่งเป็น 4 batch ย่อย (ส่งทีละ batch ได้) · สไตล์ตาม `00_STYLE_GUIDE.md` แต่เป็น **ภาพประกอบ UI สวยงามแบบการ์ดเกมมือถือ** (ไม่ต้องมุม top-down)

---
## 9A · การ์ดเลือกด่าน · batch `menu_stage_cards` → `assets/incoming/menu_stage_cards/`
ใช้บนปุ่มเลือกด่าน (หน้า "Choose stage") — ตอนนี้ครอปจากภาพพื้นด่าน ซึ่งจะกลายเป็นลายพื้นซ้ำหลังทำ batch floors จึงต้องมีภาพปกเฉพาะ
- **768×432 (16:9) · ทึบ · WEBP/PNG** · ภาพทิวทัศน์ของด่าน + (ถ้าเหมาะ) เงาบอสด่านนั้นไกล ๆ · จุดสนใจอยู่ **กลาง-ขวา** (ซ้ายจะมีชื่อด่านทับ)
- ไม่มีตัวหนังสือ · ขอบซ้ายและล่างมืดลงเล็กน้อยให้ตัวอักษรขาวอ่านง่าย

| key | ด่าน | ภาพ |
|---|---|---|
| stage_card_s01 | C1-1 Sour Ant Nest | รังมดเปรี้ยวใต้ครัว อุโมงค์ขนมปัง |
| stage_card_s02 | C1-2 Rotting Drain | ท่อระบายน้ำเน่าในครัว น้ำเขียว |
| stage_card_s03 | C1-3 Chili Engine | ห้องเครื่องพริกเพลิง เปลวไฟส้ม |
| stage_card_s04 | C1-4 Frost Prison | คุกน้ำตาลเย็นเยือก คริสตัลฟ้า |
| stage_card_s05 | C1-5 Crown Oven | เตาอบมงกุฎแห่งความหิว ม่วง-ทอง |
| stage_card_s06 | C2-1 Fermented Canopy | ป่าหมักใต้ร่มไม้ แสงเรืองมิ้นต์ |
| stage_card_s07 | C2-2 Mycelium Marsh | บึงเส้นใยเห็ด หมอกม่วง |
| stage_card_s08 | C2-3 Nectar Hive | รังผึ้งน้ำหวานยักษ์ ทองอำพัน |
| stage_card_s09 | C2-4 Four-Season Conservatory | เรือนกระจกแบ่ง 4 ฤดูในภาพเดียว |
| stage_card_s10 | C2-5 Root Throne | บัลลังก์รากยักษ์ แสงม่วง |
| stage_card_s11 | C3-1 Ashen Seedfields | ทุ่งไหม้ขี้เถ้า ท้องฟ้าส้มหม่น |
| stage_card_s12 | C3-2 Hollow Orchard | สวนผลไม้กลวง ต้นไม้บิดเบี้ยว |
| stage_card_s13 | C3-3 Glass Greenhouse Ruins | ซากเรือนกระจกแก้ว แสงสะท้อนรุ้ง |
| stage_card_s14 | C3-4 The Seed Vault | ประตูห้องนิรภัยเมล็ดทองมหึมา |
| stage_card_s15 | C3-5 Throne of the First Seed | เมล็ดทองลอยเหนือบัลลังก์ราก |

### การ์ดเลือก Chapter (หน้า "Choose Chapter") — batch เดียวกัน
- **768×432 · ทึบ**
| key | สถานะ | ภาพ |
|---|---|---|
| chapter1_cover | ✅ มีแล้ว (ไม่ต้องทำ) | – |
| chapter2_cover | ✅ มีแล้ว | – |
| chapter3_cover | ⬜ ทำใหม่ | Throne of the First Seed ภาพรวมบท: ทุ่งขี้เถ้า → บัลลังก์เมล็ดทองไกล ๆ |
| chapter_endgame_cover | ⬜ ทำใหม่ | Midnight Kitchen ครัวยามเที่ยงคืน ม่วงเข้ม+ทอง แผนที่สูตร (Recipe Maps) ลอย |

---
## 9B · พื้นหลังแต่ละหน้าเมนู · batch `menu_screens` → `assets/incoming/menu_screens/`
- **768×1366 (แนวตั้ง 9:16) · ทึบ · WEBP/PNG** · เกมวางม่านมืด 54% ทับ + UI ทับด้านบน → **ภาพต้องมีรายละเอียดขอบ ๆ ส่วนกลางโล่ง/เรียบ** ไม่มีตัวหนังสือ
- ขอบบน ~120px จะมีหัวข้อ + ปุ่ม Back ทับ

| key | หน้าในเกม | ภาพ |
|---|---|---|
| screen_stage | Choose stage | แผนที่โลก Mochitopia ม้วนกระดาษบนโต๊ะไม้ |
| screen_chapter | Choose Chapter | หนังสือนิทานเปิดเล่มใหญ่ |
| screen_difficulty | Choose Difficulty | ประตู 3 บาน (ชมพู/ส้ม/แดงเพลิง) |
| screen_heroes | Fighters (เลือกตัวละคร) | ลานประลองมีแท่นยืน 1 แท่นกลาง แสงสปอตไลต์ |
| screen_talents | Character Talents | ห้องฝึกซ้อม ดัมเบลโมจิ หุ่นฝึก |
| screen_stats | Character Stats | ห้องทดลองขนม กระดานไวท์บอร์ดกราฟ |
| screen_equipment | Equipment | ห้องแต่งตัว ตู้เสื้อผ้า/ชั้นวางอาวุธขนม |
| screen_bazaar | Mochi Bazaar | ตลาดนัดกลางคืน แผงลอยโคมไฟ ผ้าใบลาย |
| screen_inbox | Reward Inbox | ห้องเก็บพัสดุ กล่องของขวัญกองสูง |
| screen_weave_perks | Flavor Passives (Rank Perks) | ห้องชั้นในวิหาร กระจกสีรูปต้นไม้พรสวรรค์ |
| screen_codex | Skill Codex | ห้องสมุดสูตรลับ ชั้นหนังสือ |
| screen_bestiary | Bestiary | ห้องจัดแสดงสัตว์ขนม ขวดโหลเรียงราย |
| screen_daily | Daily Missions | กระดานประกาศงานประจำวันในตลาด |
| screen_achievements | Achievements | ห้องถ้วยรางวัล |
| screen_endgame | Beyond Hunger (Endgame) | ครัวเที่ยงคืน ม่วงดำ ดวงจันทร์ |
| screen_bossrush | Boss Rush | สนามโคลอสเซียมขนม ธงบอส |
| screen_recipes | Recipe Maps | โต๊ะแผนที่สูตรลับ เข็มทิศ ม้วนกระดาษ |
| screen_atlas | Recipe Atlas | แผนที่โลกใหญ่บนผนัง หมุดทอง |
| screen_zonemods | Zone Modifiers | หม้อยาปรุงคำสาป ควันม่วง |
| screen_settings | Settings | ห้องเครื่องจักรขนม เฟืองลูกกวาด |
| screen_news | Updates | กระดานข่าว/หนังสือพิมพ์โมจิ |
| screen_group_gear | หน้า Gear & Power | ห้องคลังของ/คลังแสงขนม |
| screen_group_activity | หน้า Activities | ลานเทศกาลโคมไฟ |
| screen_group_codex | หน้า Codex | หอสมุดโบราณ |
| screen_group_more | หน้า More | ห้องพักอบอุ่น เตาผิง |

(หน้า Affix Forge / Weave Temple / Recipe Kitchen / Temple Depths มีภาพแล้ว หรืออยู่ใน batch `dig`)

---
## 9C · ปุ่มหลักหน้า Hub · batch `menu_buttons` → `assets/incoming/menu_buttons/`
หน้าแรกมี 6 ปุ่มใหญ่ (ตอนนี้ = สีเรียบ + อีโมจิในวงกลม) → เปลี่ยนวงกลมอีโมจิเป็น **ภาพประกอบ**
- **256×256 · PNG โปร่งใส** · วัตถุเดี่ยวเด่น เต็ม ~85% เฟรม · ขอบเข้มหนาให้อ่านได้ที่ 48px · ไม่มีตัวหนังสือ

| key | ปุ่ม | ภาพ |
|---|---|---|
| hub_btn_play | ▶ Play | โมโม่ถือธงวิ่งออกผจญภัย / ประตูเปิดแสงสาด |
| hub_btn_heroes | 🍓 Heroes | ตัวละคร 3 ตัวยืนเรียงกัน (Momo กลาง) |
| hub_btn_gear | 🎒 Gear & Power | กระเป๋าเป้โมจิมีดาบขนมปักออกมา |
| hub_btn_activity | 🎉 Activities | ถ้วยรางวัล + พลุ |
| hub_btn_codex | 📖 Codex | หนังสือเวทเปิดมีแสง |
| hub_btn_more | ⚙ More | เฟืองลูกกวาด |

## 9D · ไทล์ในหน้ากลุ่ม · batch เดียวกัน `menu_buttons`
ไทล์ในหน้า Gear & Power / Activities / Codex / More (ตอนนี้อีโมจิ) · **256×256 · PNG โปร่งใส** สเปกเดียวกับ 9C

| key | เมนู | ภาพ |
|---|---|---|
| tile_stats | Stats | กระดานกราฟ + แว่นขยาย |
| tile_talents | Talents | ดาวทองในวงแหวน |
| tile_upgrade | Weave & Rank (วิหาร) | วิหารขนมเล็กมีด้ายทอพันยอด |
| tile_gear | Equipment | ดาบ + โล่ขนม |
| tile_craft | Affix Forge (คราฟต์) | ทั่งตีเหล็กมีขวดยาเรือง |
| tile_bazaar | Bazaar (ร้านค้า) | แผงลอยหลังคาผ้าลาย |
| tile_gearInbox | Reward Inbox | กล่องพัสดุผูกโบว์ |
| tile_daily | Daily Missions | ปฏิทินมีดาว |
| tile_achievements | Achievements | ถ้วยทอง |
| tile_endgame | Endgame | พระจันทร์เสี้ยว + ส้อม |
| tile_bossrush | Boss Rush | มงกุฎ + ดาบไขว้ |
| tile_recipes | Recipe Maps | ม้วนแผนที่สูตร |
| tile_skills | Skill Codex | หนังสือสกิล |
| tile_bestiary | Bestiary | ขวดโหลมีมอนตัวจิ๋ว |
| tile_settings | Settings | เฟือง |
| tile___tutorial | How to Play | หมวกครู/ป้ายคำใบ้ |
| tile_dig | Temple Depths (ปุ่มในวิหาร) | พลั่ว + หลุม |
| tile_kitchen | Recipe Kitchen (ปุ่มในวิหาร) | หม้อ + ทัพพี |
| tile_perks | Rank Perks (ปุ่มในวิหาร) | เหรียญยศ |

---
## ฝั่งโค้ด (เมื่อได้ไฟล์) — ต้องเพิ่ม hook ทั้งหมดใน batch นี้
- **9A:** `uiStageCard` ใช้ `stage_card_sNN` ก่อน `bgN` · `buildChapterSelect` เพิ่ม `chapter3_cover` / `chapter_endgame_cover`
- **9B:** ส่ง artKey `screen_<name>` เข้า `_screenBg(title, artKey)` ของแต่ละหน้า (`buildHubGroup` ใช้ `screen_group_<gLoadout→gear|gActivity→activity|gCodex→codex|gMore→more>`)
- **9C:** `buildHub` วาด `hub_btn_*` แทนอีโมจิในวงกลม (ผ่าน `uiPillBtn` หรือวาดทับ)
- **9D:** `_buildHubTiles`/แถวใน `buildHubGroup` ใช้ `tile_<target>` แทนอีโมจิถ้ามี
