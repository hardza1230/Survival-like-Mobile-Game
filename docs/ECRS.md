# ECRS — ลดเกมให้เหลือแก่น ก่อน Closed test (เจ้าของ 22 พ.ย. 2026)

**ลำดับ:** E (Eliminate ตัด) → S (Simplify ทำให้ง่าย) ก่อน Closed test 13 ธ.ค. · C (Combine รวม) และ R (Rearrange จัดลำดับ) หลัง test (งานใหญ่ ต้องย้ายเซฟ)
**ทำไมเริ่มที่ E:** ตัดแล้วงานหายทั้งก้อน ไม่ต้อง C/R/S ของนั้นอีก · ระบบน้อย = ผู้เล่นงงน้อย + บั๊กน้อย · **ซ่อนก่อนลบ** (กลับได้ เช่น `KITCHEN_ON`)
**เกณฑ์ (ผ่าน ≥ 2 ใน 4 = อยู่ต่อ):** ① ทำให้ลูปหลักสนุก (`GAME_PILLARS.md`) ② ผู้ทดสอบเจอใน 14 วัน ③ ภาระดูแลต่ำ ④ เป็นเอกลักษณ์ของเกม

## ทำแล้ว
| เวอร์ชัน | ตัว | อะไร |
|---|---|---|
| v8.2.52 | E | ซ่อน Kitchen (`KITCHEN_ON=false` · แถวใน Activities หาย) |
| v8.2.52 | E | เลิกโหลดภาพแท่น Overcharge ทุกด่าน (โค้ดลบไปแล้ว 8.2.36) |
| v8.2.52 | S | สกุล Forge 5 → 3: 🍓 Berry Jam + 🍯 Honey Drop → 🟢 Twist Cream (เพิ่ม/ลบ mod + อัปแถว 1–3) · ⭐ Star Sugar แถว 4–6 · 🖋️ Recipe Ink ย้าย mod · เซฟเก่า 1 → 2 (`_cur8252`) · คีย์เก่า alias (`CUR_ALIAS`) |

## ไม่ตัด (ตรวจแล้ว)
- **ภารกิจประจำด่าน 15 แบบ** = เอกลักษณ์ของแต่ละด่าน · Chapter 1 รอบแรกใช้แผนสอนตายตัว ไม่มีภารกิจสุ่มมากวน (`missionRoamBag`)
- Boss Rush ซ่อนอยู่แล้ว · การ์ดเลเวลอัป/Build Path · Gear + Forge · บอส · Expedition (กำลังปรับเป็น idle วางแผน)
- ~~Sesame~~ — เสร็จแล้ว (เจ้าของ 22 พ.ย. · v8.2.53 `HEROES_WIP=[]`)

## รอบ 2 (เจ้าของอนุมัติ 22 พ.ย. · v8.2.54) — วิเคราะห์จากโค้ด + ข้อมูลผู้เล่นจริง
**ข้อมูล:** Supabase `run_stats` เหตุการณ์ `screen` เฉพาะเครื่องแอปจริง (`native`) 13–22 พ.ย. ≈ 10 เครื่อง (รวมเจ้าของ) · ตัวอย่างน้อย = สัญญาณ ไม่ใช่ข้อสรุป
- ใช้มาก: hub 211 · ฮีโร่ 97 · Gear&Power 74 · Bazaar 51 · Weave&Rank 25 · Rewards 24 · Equipment 23 · News 19 · Daily 16 · Awards 11 · Wardrobe 10
- ใช้น้อย: Rank Rewards 6 · Talents 6 · Forge 5 · Codex 3 · Expedition 3 · Merge 2
- 0 ครั้ง: Reward Inbox · Kitchen · Delve · Atlas · Play Stats · Ranking · Trade-in

| # | ทำ | สวิตช์ / เซฟ |
|---|---|---|
| E1 | Reward Inbox เลิก · ของดีที่ล้นเข้ากระเป๋าตรง ๆ (เกินช่องได้) · ของธรรมดาแยกชิ้น · ของค้างเดิมย้ายเข้ากระเป๋า | `GEAR_INBOX_ON=false` · `_inbox8254` |
| E2 | Mochi Miners เลิก (อัปไม่ได้ตั้งแต่ Depths หาย · ซ้ำ Expedition) · จ่ายด้ายค้าง + เลเวลเดิม = คุกกี้ Expedition +10%/เลเวล ถาวร | `MINERS_ON=false` · `_miners8254` · `exp.mb` |
| E3 | Daily chest ของ Expedition เลิก (ของรายวัน 6 → 4 จุด · Daily Quest "Defeat 30 Expedition foes" ยังอยู่) | `EXP_DAILY_ON=false` |
| E4 | Play Stats / Combat Meter ในตั้งค่า → เห็นเฉพาะ GM | `DEV_STATS_ON=false` |
| E5 | แท็บ Ranking ใน Rewards ซ่อน (ยังไม่มีเซิร์ฟเวอร์ตรวจคะแนน) | `RANKING_ON=false` |
| S1 | กล่อง Gear Silver/Gold จ่ายด้วย 🍬 Sugar (ราคาตามระดับไอเทม: Silver ×1.4 · Gold ×4 ของ Sugar Chest) | `chestSugarCost` |
| S4 | Chapter 1 ไม่มี Run trait / วงล้อ Mimic (เริ่ม Ch2) | `CH1_CALM_UNTIL=5` |

**✅ เจอเพิ่ม → แก้แล้ว v8.2.59 (เจ้าของเลือก (ข) สกุลใหม่ 22 พ.ย.):** 🧶 Thread ซื้อพลังได้ (Enhance · Weave Rank · Ancient) จึงห้ามขาย → เงินจริงได้ **🍭 Lollipops** (`Save.lollipops` · IAP `lolli_*` · Mochi Pass) ใช้ได้แค่ของแต่งตัว (`Cos.pay`) · ของแต่งตัวจ่ายได้ทั้ง 🧶 และ 🍭 ราคาเท่ากัน · เทส `lollipops-8255` กันไม่ให้ใช้ 🍭 ที่อื่น

## E ที่ยังเหลือ (รอเลือก)
| # | ระบบ | ข้อเสนอ |
|---|---|---|
| — | Endgame (Recipe Maps / Delve / Pinnacle) | ไม่ตัด · หยุดพัฒนาเพิ่มจนหลัง test (0 ครั้ง) |
| — | Bestiary / Codex | รอรวมตอนทำ C (≤ 3 ครั้ง) |

## S ที่เหลือ
- ปุ่มใน Forge → หลัง test (Forge ถูกเปิดแค่ 5 ครั้ง · ดูก่อนว่าคนเข้าเพราะอะไร)
- ข้อความเมนูที่ยาวเกิน 1 บรรทัด → ตัดสั้น (การ์ดภารกิจ/แบนเนอร์ทำแล้ว 8.2.40 · 8.2.46)

## C / R (หลัง Closed test)
- C1: Rank Rewards (6) รวมเข้าหน้า Weave & Rank · Talent (6) ไปอยู่ในหน้าฮีโร่ (97)
- R1: เมนู 3 ชั้น (hub → กลุ่ม → หน้า) · ปุ่มล่างพาไปหน้าที่ใช้บ่อยตรง ๆ
- C: Codex + Bestiary + Memory Book + Mission Atlas → 📖 Collection · Login/Daily/Awards/Daily chest → กล่องรับของเดียว · Pact Relics + Relic vault → ระบบ Relic เดียว · Supplies → ขั้นเตรียมตัวก่อนเข้าด่าน
- R: เปิดระบบตามจังหวะ (15 นาทีแรก = เล่นด่าน → อัปฮีโร่ → อุปกรณ์) · เมนูเรียงตามความถี่ที่ใช้ · ภารกิจซับซ้อนไม่โผล่ใน Ch1
- **ตัวนับการเข้าแต่ละหน้ามีอยู่แล้ว** (`run_stats` mode `event` result `screen`) → หลัง Closed test ดึงข้อมูลแบบรอบ 2 อีกครั้ง
