# A16 — Ruby เสียงพากย์ภารกิจที่เปลี่ยน (v8.2.16–8.2.22) + เสียงประกอบใหม่ · ใบสั่งเสียง

สถานะ: 📦 ส่งแล้ว รอผูก · 19 พ.ย. 2026
ส่งที่ `assets/incoming/audio_a16/` พร้อม `MANIFEST.json` (key, file, text (เฉพาะเสียงพูด), bytes, sha256, duration_ms)
เครื่องมือ: **ElevenLabs** · เสียงพูดใช้ **เสียง Ruby เดิมของ A07** (voice ID ใน `assets/incoming/audio_voice_acting/VOICES.json` key `ruby`) · SFX ใช้ ElevenLabs Sound Effects · ห้ามใช้เสียงสร้างด้วยโค้ด/Runway

## ทำไมต้องสั่ง
- **Hunger Herald** เปลี่ยนใหม่ (v8.2.20): ตีไม่ได้ ยิงลำแสงบัฟมอน · บทเดิม "Hunt it down to shut them" **ผิดแล้ว**
- **Hunt** เปลี่ยน (v8.2.22): Elite เดินมาปาขวดพิษแล้วหนี · บทเดิม "its poison grows" ไม่ตรง
- **Frozen Pantry** มี Captain + ลังแช่แข็ง (v8.2.16) · ระบบเวฟจับเวลา (v8.2.20) · ภารกิจเสริม (v8.2.21) ยังไม่มีเสียงบอก

## A. เสียงพากย์ Ruby (MP3 mono 44.1 kHz 128 kbps · peak ≤ −1 dBTP · ตัดเงียบต้น ≤ 60 ms · บทต้องตรงทุกตัวอักษร)
| key | บท | ยาว | อารมณ์ |
|---|---|---|---|
| `vo_ruby_tip_hungerHerald` | The Herald can’t be hurt — beat the monsters it powers up! | ≤ 3.2 วิ | ตกใจแล้วตั้งสติ ให้คำแนะนำ |
| `vo_ruby_short_hungerHerald` | Beat the powered-up ones! | ≤ 1.6 วิ | สั้น เร่ง |
| `vo_ruby_tip_hunt` | Dodge its poison bottles and beat the marked Elite! | ≤ 3.0 วิ | ระวังตัว จริงจังนิด ๆ |
| `vo_ruby_short_hunt` | Dodge the bottles! | ≤ 1.3 วิ | สั้น ตะโกนเตือน |
| `vo_ruby_tip_frozenPantry` | Open the sugar jar, then walk through the frozen army and crates! | ≤ 3.6 วิ | ตื่นเต้น |
| `vo_ruby_short_frozenPantry` | Walk through the frozen army! | ≤ 1.7 วิ | สั้น |
| `vo_ruby_react_captain` | Their Captain is down — the squad is weaker now! | ≤ 2.6 วิ | ดีใจ เชียร์ |
| `vo_ruby_react_side` | A side mission! Let’s try to do both! | ≤ 2.2 วิ | ตื่นเต้น ท้าทาย |
| `vo_ruby_react_hurry` | Hurry, the wave is almost over! | ≤ 1.8 วิ | เร่ง กังวลนิด ๆ |
| `vo_ruby_react_half` | We got halfway — that still counts! | ≤ 2.0 วิ | ปลอบใจ อบอุ่น |
| `vo_ruby_react_early` | Done early! Let’s catch our breath. | ≤ 2.0 วิ | โล่งใจ ภูมิใจ |
| `vo_ruby_react_empowered` | Watch out, that one got stronger! | ≤ 1.8 วิ | เตือน |

## B. เสียงประกอบ SFX (MP3 44.1 kHz · ความยาวตามตาราง · ไม่มีเสียงพูด/ดนตรี · ให้เข้ากับโลกขนมหวานน่ารัก)
| key | เสียง | ยาว |
|---|---|---|
| `sfx_a16_bottle_throw` | ขวดแก้วเล็กลอยหมุนผ่านอากาศ (วู้ช + ของเหลวกระฉอก) | 0.5 วิ |
| `sfx_a16_bottle_shatter` | ขวดแก้วแตก + พิษฟู่ซ่าเหนียว ๆ | 0.6 วิ |
| `sfx_a16_herald_beam` | ลำแสงเวทมนตร์ชาร์จแล้วยิงเข้าหาเป้า (ฮัมสูงขึ้น → ป๊อง) | 0.8 วิ |
| `sfx_a16_empower` | พลังม่วงไหลเข้าตัวมอน (ฟึ่บ + เสียงทุ้มขึ้น) | 0.6 วิ |
| `sfx_a16_heal_pulse` | คลื่นฮีลนุ่ม ๆ แบบกระดิ่งแก้ว | 0.7 วิ |
| `sfx_a16_crate_shatter` | ลังไม้แช่น้ำแข็งแตก (น้ำแข็งร้าว + ไม้หัก + ของกระจาย) | 0.8 วิ |
| `sfx_a16_side_mission` | เสียงประกาศภารกิจเสริม: กระดิ่งสั้น 2 จังหวะ สดใส | 0.7 วิ |
| `sfx_a16_time_up` | หมดเวลาเวฟ: นาฬิกาทรายคว่ำ + ติ๊งเบา ๆ (ไม่ดุ) | 0.9 วิ |
| `sfx_a16_moth_steal` | ผีเสื้อกระพือปีก + แสงโดนดูด (ฟึ้บ) | 0.6 วิ |
| `sfx_a16_sapper_boom` | ระเบิดลูกอมเล็ก (ป๊อก + ฝุ่นน้ำตาล) | 0.7 วิ |

**รวม 22 ไฟล์ (เสียงพูด 12 · SFX 10)**

## ข้อห้าม
- ห้ามเปลี่ยนคำในบท (โค้ดจับคู่ด้วยข้อความใน `RUBY_TIPS` / `A07_CATALOG`) · ใช้ `’` ตามบท
- เสียงพูดห้ามมีเสียงประกอบ/ดนตรี · SFX ห้ามมีเสียงพูด · ห้ามดังแหลมเกิน (เล่นบนมือถือบ่อย)

## โน้ตฝั่งโค้ด
- แพ็ก: เสียงพูด 56k mono → `assets/audio/acting/<key>.mp3` (เขียนทับ key เดิม 6 ตัวแรก) · SFX 96k → `assets/audio/sfx/a16/` (skill wire-art §2b)
- เสียงพูด: แก้ `RUBY_TIPS.hungerHerald / hunt / frozenPantry` (`say`/`short`) และ `A07_CATALOG` ให้ตรงบทใหม่ · react ใหม่ 6 ตัว → เพิ่ม key ใน `rubyVoiceReact`: `captain` (fpOnKill ล้ม Captain), `side` (stackStart), `hurry` (เวฟจับเวลาเหลือ 10 วิ), `half` (expireWaveObjective ≥50%), `early` (completeWaveObjective `_wrap`), `empowered` (hhEmpower ครั้งแรกของภารกิจ)
- SFX: throw → `huntThrowAI` · shatter → `hitByFoe` `_huntCurse` · beam → `hhTick` ตอนเริ่มลำแสง · empower → `hhEmpower` · heal → ลูกน้อง heal · crate → `fpCrateOpen` · side → `stackStart` · time_up → `expireWaveObjective` · moth → `llExtrasTick` ตอนขโมยแสง · sapper → `hsExtrasTick` ตอนระเบิด · ไม่มีไฟล์ = เสียงเดิม (fallback)

## ส่งมอบ
- Date: 2026-11-19. Delivered 22 files (12 Ruby voice lines + 10 ElevenLabs SFX) to `assets/incoming/audio_a16/`.
- Included `MANIFEST.json`, `PROMPTS.json`, and compact per-file `QA_REPORT.json`.
- Mechanical QA passed for every file; missing files: none.
- Source branch: `asset-delivery/missions86-87-a16`. Source assets only; runtime integration and owner phone review pending.
- All speech uses the existing A07 Ruby voice ID. All 12 manifest scripts match the order exactly, including curly apostrophes and em dashes. All 22 MP3 files are mono 44.1 kHz / 128 kbps; decoded durations, true peaks, onset silence, hashes and byte counts verified.
