# งานอาร์ต/เสียงที่ค้าง · สำหรับ AI ฝั่งอาร์ต/เสียง (อัปเดต 18 พ.ย. 2026 · ตรวจบนเกม v8.1.136)

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
| 5 | `docs/art_orders/80_SPECIAL_PICKS.md` | **หน้าเลือกพิเศษ** ห้องสมบัติ Relic · ทั่ง Evolution · สมุดสูตร Mutation · การ์ดภาพวาด Build Path 15+1 | 21 | ImageGen | `assets/incoming/special_picks80/` | 🟢 ผูกแล้ว v8.1.137 · รอ QA มือถือ |
| 6 | `docs/art_orders/81_RELICS_SPECIAL_ICONS.md` | **ไอคอน Relic ที่ขาด 8 · Modifier 36 · Trade-off 5 · การ์ด Build Path Yuzu 3** (+ แก้การ์ด Cocoa 2 ไม่บังคับ) | 54 | ImageGen | `assets/incoming/relics81/` | ✅ ผูกแล้ว v8.1.151 (ไอคอน 49 · การ์ด Yuzu 3 ไม่ใช้ — เจ้าของ: ใบ 82 มีแล้ว) |
| 7 | `docs/art_orders/82_BUILD_PATH_UNIQUE_ART.md` | ภาพ Build Path เต็มการ์ดแนวนอน 1024×424 เน้น Unique · 6 ฮีโร่ × 3 | 18 | ImageGen | `assets/incoming/pathuq82/` | 🟢 ผูกแล้ว v8.1.146 (15/18 · งาดำไม่ใช้) |
| 8 | `docs/audio_orders/A14_CHEST_OPENING.md` | เสียงลุ้นเปิดกล่อง + ระเบิด 4 ระดับ + ประกาย/ไอเทมลง/ของซ้ำ | 8 | ElevenLabs Sound Effects | `assets/incoming/audio_chest_a14/` | 🟢 ผูกแล้ว v8.1.147 · รอเจ้าของฟังบนมือถือ |
| 9 | `docs/art_orders/83_HERO_HURT_VICTORY.md` | **ท่าโดนตี 4 + ท่าชนะ 5 ฮีโร่ + ชุดสกิน Festival** (เฟรม 256 · ตัวสูงเท่าชีตวิ่ง) | 18 | ImageGen | `assets/incoming/hero_poses83/` | 🟢 ผูกแล้ว v8.2.12 |
| 11 | `docs/art_orders/84_ART_FIXES.md` | **แก้ภาพที่มีปัญหา** ตัดขอบ · ตัวหด · เศษภาพ (ใช้ภาพเดิมเป็นต้นแบบ) | 27 | ImageGen (แก้ภาพเดิม) | `assets/incoming/art_fixes84/` | 🟢 ผูกแล้ว v8.2.13 |
| 10 | `docs/audio_orders/A15_RUBY_LOST_WISPS.md` | **Ruby พากย์** ภารกิจที่เปลี่ยนใหม่ 4 อย่าง (tip + short) | 8 | ElevenLabs TTS (เสียง Ruby เดิม) | `assets/incoming/audio_ruby_a15/` | 🟢 ผูกแล้ว v8.2.12 |
| 12 | `docs/art_orders/85_MISSION_PLACEHOLDERS.md` | Frozen Pantry / Mirror Path / Last Light / Trial / Siege / Herald mission art | 12 | ImageGen | `assets/incoming/mission85/` | 📦 ส่งแล้ว รอผูก · 12/12 |
| — | `docs/audio_orders/A04_STORY_MUSIC_STINGERS.md` | เพลงเรื่อง/Lobby | 6 | ElevenLabs Music | `assets/incoming/audio_story_music/` | 🟢 ส่งและผูกครบ · เจ้าของฟังแล้วโอเค 8 พ.ย. 2026 |

## หมายเหตุ
- ห้ามเสียงสร้างด้วยโค้ด/Runway (เจ้าของสั่ง) · ห้ามตัวหนังสือในภาพ
- **79:** ภาพ `core79_heart_seed` ต้องตรงกับ `docs/STORY_CANON.md` §2 (Flavor Cores) · สีเส้นใย Life `#ff5f7a` · Flavor `#f0a54a` · Oath `#6ec6ff`
- **69:** เจ้าของ 10 พ.ย.: ปีก/ฮาโล/วง เลิกขายแยก → สกินเต็มตัว · ขายแยกเหลือ pet/trail/dash/pop
- ใบ 72 `gp_ingredients` / `gp_recipe_card` ไม่ใช้แล้ว (Grandma's Pot เปลี่ยนเป็นแบบ Ritual v8.1.106) — ไม่ต้องทำเพิ่ม

**ใหม่ 14 พ.ย.:** ใบ 82 (ผูกแล้ว v8.1.146) · A14 เสียงเปิดกล่อง (ผูกแล้ว v8.1.147)

**ส่งมอบ 19 พ.ย.:** ใบ 86 / 87 และ A16 ส่ง source ครบใน `asset-delivery/missions86-87-a16`.

| ใบ | จำนวน | ส่งที่ | สถานะ |
|---|---|---|---|
| `docs/art_orders/86_MISSION_CARDS.md` | 1 atlas / 25 frames | `assets/incoming/mission_cards86/` | 📦 ส่งแล้ว รอผูก |
| `docs/art_orders/87_MISSION_MONSTERS_2.md` | 12 sheets | `assets/incoming/mission87/` | 📦 ส่งแล้ว รอผูก |
| `docs/audio_orders/A16_RUBY_MISSIONS_SFX.md` | 22 MP3 / 12 Ruby + 10 SFX | `assets/incoming/audio_a16/` | 📦 ส่งแล้ว รอผูก |
**ใหม่ 19 พ.ย. (รอทำ):** ใบ 86 `docs/art_orders/86_MISSION_CARDS.md` (หน้าการ์ดภารกิจ 25 เฟรม) · ใบ 87 `docs/art_orders/87_MISSION_MONSTERS_2.md` (มอน/ของภารกิจรอบ 2 · 12 ชีต) · A16 `docs/audio_orders/A16_RUBY_MISSIONS_SFX.md` (Ruby 12 บท + SFX 10) · A17 `docs/audio_orders/A17_MISSION_MUSIC.md` (เพลงภารกิจใหญ่ 8 + สติงเกอร์ 3)
