# งานอาร์ต/เสียงที่ค้าง · สำหรับ AI ฝั่งอาร์ต/เสียง (อัปเดต 13 พ.ย. 2026 · ตรวจบนเกม v8.1.136)

**กติกาใหม่ (เจ้าของ 12 พ.ย.): AI ฝั่งอาร์ต/เสียงทำแค่ไฟล์ แล้วส่งที่โฟลเดอร์ส่งมอบของแต่ละใบ — ไม่ต้องแก้โค้ด ไม่ต้องเขียนเทส ไม่ต้องปล่อยเวอร์ชัน · Claude ฝั่งโค้ดเป็นคนผูกเข้าเกม**
หัวข้อ "ผูกเข้าเกม" ในแต่ละใบเป็นโน้ตของฝั่งโค้ด ข้ามได้ · ส่งงานพร้อม `MANIFEST.json` (ฟิลด์ตามใบ) + `PROMPTS.json` + `QA_REPORT.json` ตรวจไฟล์ด้วยสคริปต์ (ขนาด/กริด/พื้นหลัง/ความยาว/peak) ไม่ต้องเปิดดูทีละไฟล์
เมื่อส่งเสร็จ: แก้แถว "ส่งมอบ" ในใบนั้น (วันที่ · จำนวนไฟล์ · ไฟล์ที่ขาด) + สถานะในตารางด้านล่างเป็น "📦 ส่งแล้ว รอผูก" · commit เฉพาะ `assets/incoming/<batch>/` และเอกสาร แล้ว push สาขาของตัวเอง (ไม่ต้อง push สาขา deploy)

## ลำดับที่แนะนำ
| # | ใบ | งาน | จำนวน | เครื่องมือ | ส่งที่ | สถานะ |
|---|---|---|---|---|---|---|
| 1 | `docs/audio_orders/A13_RUBY_LORE_MISSION_VOICE.md` | **Ruby พากย์** เรื่อง Flavor Cores 3 + อธิบายภารกิจ 14 + เตือนสั้น 14 · ข้อความต้องตรงตัวอักษรกับบท | 31 | ElevenLabs TTS (เสียง Ruby เดิมของ A07) | `assets/incoming/audio_ruby_a13/` | 🟢 ผูกแล้ว v8.1.108 · รอเจ้าของตรวจบนมือถือ |
| 2 | `docs/audio_orders/A12_LEAGUE_SFX.md` | SFX ภารกิจ League / Trial / Forge / Memory Book / Patrol (แถวหม้อคุณยายแก้ใหม่แล้ว: `lg_pot_ritual`, `lg_pot_flavor`) | 36 | ElevenLabs Sound Effects | ตามใบ | 🟢 ผูกแล้ว v8.1.108 · รอเจ้าของตรวจบนมือถือ |
| 3 | `docs/art_orders/79_RESULTS_HEADER_CORE_LORE.md` | หัวหน้าจบด่าน (แผง/เหรียญ/พื้นเหรียญ/แสง/ช่องดาว) + ภาพเมล็ดหัวใจกับ Flavor Cores | 6 | ImageGen | `assets/incoming/results79/` | 🟢 ผูกแล้ว v8.1.108 · รอเจ้าของตรวจบนมือถือ |
| 4 | `docs/art_orders/69_HERO_SKINS.md` | สกิน Festival: **Mint แก้ 4 ชีต** (gale f6 · impaler_release f4 · run f4/8/9/11+ ล้นขอบ → วาดตัวเล็กลง) แล้วตัวฮีโร่ที่เหลือจาก candidates → ตัวจริง · ตรวจด้วย `scripts/qa-skin69.py <hero>` ก่อนส่ง | 61 | ImageGen | `assets/incoming/skins69/` | 🟢 ผูกแล้ว v8.1.108 · รอเจ้าของตรวจบนมือถือ |
| 5 | `docs/art_orders/80_SPECIAL_PICKS.md` | **หน้าเลือกพิเศษ** ห้องสมบัติ Relic · ทั่ง Evolution · สมุดสูตร Mutation · การ์ดภาพวาด Build Path 15+1 | 21 | ImageGen | `assets/incoming/special_picks80/` | 🟡 รออาร์ต |
| — | `docs/audio_orders/A04_STORY_MUSIC_STINGERS.md` | เพลงเรื่อง/Lobby | 6 | ElevenLabs Music | `assets/incoming/audio_story_music/` | 🟢 ส่งและผูกครบ · เจ้าของฟังแล้วโอเค 8 พ.ย. 2026 |

## หมายเหตุ
- ห้ามเสียงสร้างด้วยโค้ด/Runway (เจ้าของสั่ง) · ห้ามตัวหนังสือในภาพ
- **79:** ภาพ `core79_heart_seed` ต้องตรงกับ `docs/STORY_CANON.md` §2 (Flavor Cores) · สีเส้นใย Life `#ff5f7a` · Flavor `#f0a54a` · Oath `#6ec6ff`
- **69:** เจ้าของ 10 พ.ย.: ปีก/ฮาโล/วง เลิกขายแยก → สกินเต็มตัว · ขายแยกเหลือ pet/trail/dash/pop
- ใบ 72 `gp_ingredients` / `gp_recipe_card` ไม่ใช้แล้ว (Grandma's Pot เปลี่ยนเป็นแบบ Ritual v8.1.106) — ไม่ต้องทำเพิ่ม
