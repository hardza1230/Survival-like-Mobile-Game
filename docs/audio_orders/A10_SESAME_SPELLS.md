# A10 — Sesame เสียงเวท 10 แบบ + เสียงเรียกชื่อเวท · ใบสั่งเสียง

สถานะ: ➡️ รวมเข้า **A11** แล้ว (9 พ.ย. 2026) · บทอนุมัติแล้ว · สั่งผ่าน A11 · ต่อจาก A07/A08 และ `sesame_invoker811_audio` / `sesame_orb815/816`
เครื่องมือ: **ElevenLabs** — หมวด 1 ใช้ **Sound Effects** (ต้นฉบับ) · หมวด 2 ใช้ **เสียง Sesame ที่บันทึกไว้แล้ว** (voice ID ชุดแก้ใน `assets/incoming/audio_voice_fix/`) · ห้ามสร้างเสียงใหม่ ห้ามเสียงสร้างด้วยโค้ด/Runway

## ทำไมต้องสั่ง
ตอนนี้ 10 เวทของ Sesame ใช้เสียงร่าย (`ses811_cast`) และเสียงกระทบ (`ses811_impact`) เดียวกันทั้งหมด → ผู้เล่นแยกเวทด้วยหูไม่ได้ · เสียงพูดตอนใช้ Unique มีแค่ประโยครวม 4 ประโยค (`vo_sesame_unique_1..4`)

## รูปแบบไฟล์
- MP3 mono 44.1 kHz 128 kbps · peak ≤ −1 dBTP · ตัดเงียบต้นไฟล์ ≤ 40 ms
- หมวด 1: **≤ 1.2 วิ** · ดังพอแต่ไม่กลบเสียงต่อสู้ · ห้ามเสียงร้อง/คำพูด
- หมวด 2: **≤ 1.1 วิ** · เสียงเบา ลึกลับ (นิสัย Sesame) · ข้อความใน MANIFEST ตรงตัวอักษร ใช้ `’`

## หมวด 1 — เสียงร่ายเวทราย Recipe (10 ไฟล์ · SFX)
| key | เวท | เสียง |
|---|---|---|
| `ses_cast_ppp` | Solar Cataclysm | ไฟคำราม + เสียงหวีดอุกกาบาตลงหนัก |
| `ses_cast_mmm` | Tempest Chakram | จักรลมหมุนตัด ซวบ ๆ 3 ครั้ง |
| `ses_cast_bbb` | Tidal Armor | คลื่นน้ำม้วนเป็นเกราะ ใสกังวาน |
| `ses_cast_ppm` | Sunlance | หอกแสงพุ่งเร็ว เสียงแหลมสั้น + ปัง |
| `ses_cast_ppb` | Magma Garden | ลาวาเดือดปุด ๆ แตกจากพื้น |
| `ses_cast_pmm` | Prismatic Armament | คริสตัลกระทบกันใส + พลังเพิ่ม (power-up) |
| `ses_cast_mmb` | Cyclone Confluence | พายุหมุนดูด ฮู่ววว เข้าหาศูนย์กลาง |
| `ses_cast_pbb` | Crystal Fault | คริสตัลแตกร้าวต่อเนื่อง 5 จังหวะสั้น |
| `ses_cast_mbb` | Mistwalk Aegis | หมอกพัด + โล่เวทเปิด นุ่มเบา |
| `ses_cast_pmb` | Prismatic Blast | วงระเบิดสามโทน บูม-กระเพื่อม |

## หมวด 2 — Sesame เรียกชื่อเวท (10 ไฟล์ · เสียงพูด)
key `vo_sesame_spell_<code>` · เล่นแทนประโยครวมตอนร่าย (โค้ดยังสลับกับ `vo_sesame_unique_*` ไม่ให้ซ้ำติดกัน)
| key | บท |
|---|---|
| `vo_sesame_spell_ppp` | Fall, little suns. |
| `vo_sesame_spell_mmm` | Spin, winds. |
| `vo_sesame_spell_bbb` | Tide, hold me. |
| `vo_sesame_spell_ppm` | Sunlance. |
| `vo_sesame_spell_ppb` | Bloom, magma. |
| `vo_sesame_spell_pmm` | Shine brighter. |
| `vo_sesame_spell_mmb` | Gather in. |
| `vo_sesame_spell_pbb` | Crack open. |
| `vo_sesame_spell_mbb` | Into the mist. |
| `vo_sesame_spell_pmb` | All three… now. |

## สรุป
| หมวด | ไฟล์ |
|---|---|
| 1 เสียงร่ายเวท | 10 |
| 2 เรียกชื่อเวท | 10 |
| **รวม** | **20** |

## ส่งมอบ
`assets/incoming/audio_sesame_a10/` + `MANIFEST.json` (key, file, bytes, sha256, duration_ms, kind sfx/voice, voice_id, text) + `PROMPTS.json` + `QA_REPORT.json`

## โน้ตสำหรับ AI ที่ผูกเสียง
- หมวด 1: `assets/audio/sfx/sesame_a10/` · ลง `ASSET_AUDIO` · เล่นใน cast ของแต่ละเวทแทน `ses811_cast` (ถ้าโหลดไม่ได้ใช้เดิม) · `ses811_impact` เดิมยังใช้กับการกระทบ
- หมวด 2: `assets/audio/acting/` + แถวใน `A07_CATALOG` (role `sesame`) · `VoiceActing.unique()` ของ Sesame: เลือก `vo_sesame_spell_<code>` ของเวทที่ร่าย 60% / ประโยครวม 40% · อัปเดตจำนวนใน `tests/voice-acting-integration.test.cjs`
- Sesame ร่ายบ่อย: เสียงพูดเว้นอย่างน้อย 2.5 วิ (SFX เล่นทุกครั้ง)
