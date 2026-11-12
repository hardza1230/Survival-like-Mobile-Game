# งานอาร์ต/เสียงที่ค้าง · สำหรับ AI ฝั่งอาร์ต/เสียง (อัปเดต 12 พ.ย. 2026 · เกม v8.1.104)

ทุกใบ **AI ฝั่งอาร์ต/เสียงทำเองและผูกเข้าเกมเอง** ตามหัวข้อ "ผูกเข้าเกม" ในใบนั้น · ก่อนเริ่มอ่าน `CLAUDE.md`, `.claude/skills/wire-art/SKILL.md`, `.claude/skills/release/SKILL.md`
ตรวจไฟล์ด้วยสคริปต์ (MANIFEST/sha/ขนาด/กริด) ไม่ต้องเปิดดูทีละไฟล์ · ห้ามแก้ดาเมจ/เวลา/รางวัล · โหลดแบบ lazy เท่านั้น · ไม่มีภาพ/เสียง = fallback เดิมต้องยังทำงาน

## ลำดับที่แนะนำ
| # | ใบ | งาน | จำนวน | เครื่องมือ | สถานะ |
|---|---|---|---|---|---|
| 1 | `docs/audio_orders/A13_RUBY_LORE_MISSION_VOICE.md` | **Ruby พากย์** เรื่อง Flavor Cores 3 + อธิบายภารกิจประจำด่าน/League 14 + เตือนสั้น 14 | 31 | ElevenLabs TTS (เสียง Ruby เดิม) | 🟡 ใหม่ |
| 2 | `docs/audio_orders/A12_LEAGUE_SFX.md` | SFX ภารกิจ League / Trial / Forge / Memory Book / Patrol | 36 | ElevenLabs Sound Effects | 🟡 ค้างตั้งแต่ 11 พ.ย. |
| 3 | `docs/art_orders/79_RESULTS_HEADER_CORE_LORE.md` | หัวหน้าจบด่าน (แผง/เหรียญ/พื้นเหรียญ/แสง/ช่องดาว) + ภาพเมล็ดหัวใจกับ Flavor Cores | 6 | ImageGen | 🟡 ใหม่ |
| 4 | `docs/art_orders/69_HERO_SKINS.md` | สกิน Festival: **Mint แก้ 4 ชีต** (gale f6 · impaler_release f4 · run f4/8/9/11+ ล้นขอบ → วาดตัวเล็กลง) แล้วตัวฮีโร่ที่เหลือจาก candidates → ตัวจริง · ตรวจด้วย `scripts/qa-skin69.py <hero> --fix` ก่อนส่ง (กฎใน `docs/SESSION_HANDOFF.md`) | 61 | ImageGen | 🟠 ผูกแล้ว 7/68 · ทดลอง 5 ฮีโร่ |
| — | `docs/audio_orders/A04_STORY_MUSIC_STINGERS.md` | เพลงเรื่อง/Lobby | 6 | ElevenLabs Music | ⛔ รอสิทธิ์ Music Generation (ข้ามไปก่อน) |

## หมายเหตุสำคัญ
- **A13:** ข้อความใน MANIFEST ต้องตรงตัวอักษรกับบท (โค้ดหาเสียงจากข้อความ) · ผูกเสร็จให้ลบชุด `A13_PENDING` ใน `tests/ruby-a09-voice.test.cjs`
- **A12:** ทำครั้งละหมวด ปล่อยทีละเวอร์ชันได้ · ห้ามเสียงสร้างด้วยโค้ด/Runway (เจ้าของสั่ง)
- **79:** ภาพเรื่อง `core79_heart_seed` ต้องตรงกับ `docs/STORY_CANON.md` §2 (Flavor Cores) · สีเส้นใย Life `#ff5f7a` · Flavor `#f0a54a` · Oath `#6ec6ff`
- **69:** เจ้าของ 10 พ.ย.: ปีก/ฮาโล/วง เลิกขายแยก → สกินเต็มตัว · ขายแยกเหลือ pet/trail/dash/pop
- ทุกใบเสร็จ: อัปเดตสถานะในใบ + `docs/art_orders/README.md` / `docs/audio_orders/A00_README.md` + แถวในไฟล์นี้ · ปล่อยเวอร์ชันตาม skill release (fetch branch deploy ก่อนเสมอ เพราะอีก AI ก็ push)
