# A18 — Ruby พากย์เหตุการณ์ใหม่ v8.2.27–30 + SFX (Reroll / เวฟทอง / Double Clear / ภารกิจบอส / Pact / Atlas) · ใบสั่งเสียง

สถานะ: 📦 ส่งแล้ว รอผูก · เขียน 19 พ.ย. 2026 · โค้ดพร้อม v8.2.27–30 (ตอนนี้ใช้เสียงเดิม/ไม่มีเสียง)
ส่งที่ `assets/incoming/audio_a18/` พร้อม `MANIFEST.json` (key, file, text (เฉพาะเสียงพูด), bytes, sha256, duration_ms), `PROMPTS.json`, `QA_REPORT.json`
เครื่องมือ: **ElevenLabs** · เสียงพูดใช้ **เสียง Ruby เดิมของ A07** (voice ID ใน `assets/incoming/audio_voice_acting/VOICES.json` key `ruby`) · SFX ใช้ ElevenLabs Sound Effects · ห้ามใช้เสียงสร้างด้วยโค้ด/Runway · กติการ่วมดู `A00_README.md`

## ทำไมต้องสั่ง
v8.2.27–30 เพิ่มเหตุการณ์ใหม่ที่ยังเงียบหรือใช้เสียงการ์ดเดิม: ปุ่ม Reroll · เวฟทอง · Double Clear · ภารกิจบอส · ภารกิจเจอครั้งแรก · Cursed Crown · Mission Atlas (แต้ม/เลือกโหนด/Jackpot)

## A. เสียงพากย์ Ruby (MP3 mono 44.1 kHz 128 kbps · peak ≤ −1 dBTP · ตัดเงียบต้น ≤ 60 ms · บทต้องตรงทุกตัวอักษร)
| key | บท | ยาว | อารมณ์ | ใช้ตอน |
|---|---|---|---|---|
| `vo_ruby_react_golden` | A golden wave! Everything’s worth double! | ≤ 2.2 วิ | ตื่นเต้นมาก | `goldWaveRoll` เริ่มเวฟทอง |
| `vo_ruby_react_double` | Double clear! Both missions in one wave! | ≤ 2.2 วิ | ภูมิใจ เชียร์ | `doubleClearMark` |
| `vo_ruby_react_bossmission` | The boss is calling the stage — finish that mission too! | ≤ 3.0 วิ | ตกใจแล้วฮึกเหิม | `bossMissionTick` เริ่มภารกิจบอส |
| `vo_ruby_react_newmission` | Something new! Let me show you how this works. | ≤ 2.6 วิ | อยากรู้ ใจดี | `missionIntroExtra` ภารกิจเจอครั้งแรก |
| `vo_ruby_react_reroll` | New cards, new luck! | ≤ 1.4 วิ | สนุก | ปุ่ม Reroll ตอนแจกการ์ด |
| `vo_ruby_react_curse` | A curse on this wave — but the rewards are bigger! | ≤ 2.6 วิ | ระวัง แต่ยิ้ม | `rpWaveCurse` (Cursed Crown) |
| `vo_ruby_react_jackpot` | Jackpot! Triple rewards! | ≤ 1.6 วิ | ตะโกนดีใจ | `maPay` Atlas Jackpot |
| `vo_ruby_tip_atlas` | Spend Atlas stars to upgrade the missions you love. You can’t have them all, so choose! | ≤ 4.6 วิ | อธิบายใจดี | เปิดหน้า Atlas ครั้งแรก |

## B. SFX (MP3 44.1 kHz · ความยาวตามตาราง · ไม่มีเสียงพูด/ดนตรี · เข้ากับโลกขนมหวานน่ารัก)
| key | เสียง | ยาว | ใช้ตอน |
|---|---|---|---|
| `sfx_a18_reroll` | สับไพ่เร็ว 2 จังหวะ + ปิ๊งใส | 0.8 วิ | ปุ่ม Reroll |
| `sfx_a18_golden_wave` | ระฆังทอง + เหรียญร่วงพรู | 1.4 วิ | เริ่มเวฟทอง |
| `sfx_a18_double_clear` | คอร์ดใส 2 ชั้นขึ้น (ทอง + ฟ้า) จบด้วยประกาย | 1.2 วิ | Double Clear |
| `sfx_a18_boss_mission` | แตรสั้นต่ำ + กลองรัว 1 ครั้ง | 1.0 วิ | ภารกิจบอสเริ่ม |
| `sfx_a18_mission_impact` | ตุ้บหนักนุ่ม + ปิ๊ง (จังหวะจอหยุด) | 0.5 วิ | `missionJuice` ภารกิจจบ |
| `sfx_a18_curse` | ควันม่วงฟึ่บ + ระฆังผิดคีย์เบา ๆ | 0.9 วิ | Cursed Crown สุ่มคำสาป |
| `sfx_a18_atlas_star` | ดาวเล็กติ๊ง (สั้นมาก ดังเบา) | 0.3 วิ | ได้แต้ม ⭐ Atlas |
| `sfx_a18_atlas_pick` | ตราประทับลงกระดาษ + ประกาย | 0.5 วิ | เลือกโหนด Atlas |
| `sfx_a18_atlas_remove` | กระดาษพับกลับ ฟึ้บ | 0.4 วิ | ถอดโหนด / Reset |
| `sfx_a18_jackpot` | ตู้กาชาปองหมุน + ระฆังทองรัว | 1.5 วิ | Atlas Jackpot |

**รวม 18 ไฟล์ (เสียงพูด 8 · SFX 10)**

## ข้อห้าม
- ห้ามเปลี่ยนคำในบท (โค้ดจับคู่ด้วยข้อความใน `A07_CATALOG`) · ใช้ `’` ตามบท
- เสียงพูดห้ามมีเสียงประกอบ/ดนตรี · SFX ห้ามมีเสียงพูด · ห้ามดังแหลมเกิน · `sfx_a18_atlas_star` ต้องเบามาก (เล่นบ่อย)

## โน้ตฝั่งโค้ด
- แพ็ก: เสียงพูด 56k mono → `assets/audio/acting/<key>.mp3` · SFX 96k → `assets/audio/sfx/a18/` (skill wire-art §2b)
- เสียงพูด: เพิ่มใน `A07_CATALOG` (`vo_ruby_react_<ev>_1`) แล้วเรียก `rubyVoiceReact('<ev>')` ที่จุดในตาราง · `vo_ruby_tip_atlas` เล่นครั้งแรกที่เปิด Atlas (`m.seen`)
- SFX: เรียกผ่าน `this.a12?.('a18_<name>',vol,cd)` (มี fallback เสียงเดิม) · ไม่มีไฟล์ = เสียงเดิม
- งบขนาด: ~0.5 MB รวม

## ส่งมอบ
- Date: 2026-11-19. Delivered all 18 files (8 Ruby voice lines + 10 SFX) to `assets/incoming/audio_a18/`. Missing: none.
- Included `MANIFEST.json`, exact `PROMPTS.json`, and compact per-file `QA_REPORT.json`. All files passed mechanical QA and independent readback.
- Source branch: `asset-delivery/orders88-90-a18`. Source assets only; no game.js, runtime, tests or release changes. Code-side wiring and owner phone review pending.
- ElevenLabs only: A07 saved Ruby voice for all8 exact scripts, Sound Effects for all10 SFX. MP3 mono44.1kHz128kbps, maximum spoken lengths and exact SFX lengths verified; peak<=-1dBTP, speech onset<=60ms and SFX onset<=5ms. Atlas star is deliberately quiet (-16.5dBTP). Golden voice uses existing take2 with286ms of internal silence removed before bounded tempo fitting; no words changed.
