# A19 — Temple Expedition: เสียงแตะตี · ไททัน · บอสจับเวลา · ผู้ช่วย · เพลงประจำหน้า · Ruby · ใบสั่งเสียง

สถานะ: 🟡 รอเสียง · เขียน 19 พ.ย. 2026 · โค้ดพร้อม v8.2.32–33 (ตอนนี้ใช้เสียงขุด/เสียงเดิม)
ส่งที่ `assets/incoming/audio_a19/` พร้อม `MANIFEST.json` (key, file, text (เฉพาะเสียงพูด), bytes, sha256, duration_ms, loop_start_ms/loop_end_ms (เพลง)), `PROMPTS.json`, `QA_REPORT.json`
เครื่องมือ: **ElevenLabs** · SFX = Sound Effects · เพลง = ElevenLabs Music · เสียงพูดใช้ **เสียง Ruby เดิมของ A07** (voice ID ใน `assets/incoming/audio_voice_acting/VOICES.json` key `ruby`) · ห้ามเสียงสร้างด้วยโค้ด/Runway · กติการ่วมดู `A00_README.md`

## ระบบในเกม (อ้างอิง)
หน้า **⚔️ Temple Expedition** (Weave → Expedition): แตะจอ = ฮีโร่ตีไททันกลางจอ (แตะรัวได้หลายครั้งต่อวินาที) · ฆ่าครบ 10 ตัว = ด่านถัดไป · ทุก 5 ด่าน = บอสจับเวลา 30 วิ · ผู้ช่วยตีเอง · ปิดแอปแล้วกลับมาได้ Crumbs

## A. SFX (MP3 44.1 kHz · ยาวตามตาราง · ไม่มีเสียงพูด/ดนตรี · โลกขนมหวานน่ารัก · **แตะบ่อยมาก → เบา นุ่ม ไม่บาดหู**)
| key | เสียง | ยาว | ใช้ตอน |
|---|---|---|---|
| `sfx_ex_tap_1` | ตบขนมนุ่ม ๆ "ปุ" สั้นมาก | 0.12 วิ | แตะตี (สุ่ม 1 ใน 3) |
| `sfx_ex_tap_2` | แบบเดียวกัน ระดับเสียงต่างเล็กน้อย | 0.12 วิ | แตะตี |
| `sfx_ex_tap_3` | แบบเดียวกัน อีกโทน | 0.12 วิ | แตะตี |
| `sfx_ex_crit` | ตีแรง "ป้าง!" + ประกายแก้วสั้น | 0.35 วิ | แตะคริ |
| `sfx_ex_foe_pop` | ไททันแตกเป็นขนม (ฟู่ + เศษน้ำตาลกระจาย) | 0.6 วิ | ฆ่ามอนธรรมดา |
| `sfx_ex_crumbs` | เศษคุกกี้ร่วงกรุ๊งกริ๊งเบา ๆ | 0.4 วิ | ได้ Crumbs |
| `sfx_ex_stage_up` | โน้ตขึ้น 3 ตัวใส ๆ | 0.7 วิ | ผ่านด่าน |
| `sfx_ex_boss_appear` | กลองต่ำ 2 ครั้ง + เสียงคำรามการ์ตูน | 1.4 วิ | บอสโผล่ |
| `sfx_ex_boss_tick` | นาฬิกาติ๊กตึงเครียด (เล่นซ้ำทุกวินาที ช่วง 5 วิสุดท้าย) | 0.25 วิ | บอสใกล้หมดเวลา |
| `sfx_ex_boss_down` | บอสแตกใหญ่ + แฟนแฟร์สั้น | 1.6 วิ | ล้มบอส |
| `sfx_ex_boss_fail` | นาฬิกาทรายคว่ำ + เสียงถอนใจนุ่ม ๆ (ไม่ดุ) | 1.0 วิ | บอสหมดเวลา |
| `sfx_ex_hire` | กระดิ่งรับสมัคร + เสียงโมจิกระโดด "ป๊อง" | 0.7 วิ | จ้าง/อัปผู้ช่วย |
| `sfx_ex_milestone` | ประกายขึ้นสูง + ฉาบเล็ก | 1.0 วิ | ผู้ช่วยถึง Lv 25/50/… (×2) |
| `sfx_ex_upgrade` | ป๊อปสั้นสดใส | 0.3 วิ | อัปพลังแตะ |
| `sfx_ex_daily_chest` | กล่องเปิด + เหรียญพรู | 1.3 วิ | กล่องรายวัน |
| `sfx_ex_supply` | กระเป๋าเป้รูดซิป + ติ๊ง | 0.6 วิ | เก็บ Supply |
| `sfx_ex_welcome_back` | เสียงต้อนรับกลับ ระฆังเบา + เหรียญ | 1.2 วิ | กลับมาแล้วได้ของออฟไลน์ |

## B. เพลง (loop · MP3 stereo 44.1 kHz ≥ 192 kbps · −18 LUFS · loop เนียน ไม่มีเงียบท้าย)
| key | ยาว | BPM | อารมณ์ | ใช้ตอน |
|---|---|---|---|---|
| `bgm_ex_expedition` | 60 วิ | ~112 | ผจญภัยในวิหารขนม สนุกเบา ๆ ฟังซ้ำนานไม่เบื่อ (เพลง idle) มาริมบา + เครื่องสาย + กลองเบา | หน้า Expedition ปกติ |
| `bgm_ex_boss` | 32 วิ | ~140 | ตื่นเต้นเร่งรีบ (มีนาฬิกาเป็นจังหวะ) แต่ยังน่ารัก | ช่วงบอส 30 วิ |

## C. เสียงพากย์ Ruby (MP3 mono 44.1 kHz 128 kbps · peak ≤ −1 dBTP · ตัดเงียบต้น ≤ 60 ms · บทตรงทุกตัวอักษร)
| key | บท | ยาว | อารมณ์ | ใช้ตอน |
|---|---|---|---|---|
| `vo_ruby_react_exboss` | A boss! Tap as fast as you can! | ≤ 1.8 วิ | ตื่นเต้น เร่ง | บอสโผล่ |
| `vo_ruby_react_exfail` | So close! Let’s get a bit stronger first. | ≤ 2.4 วิ | ปลอบใจ | บอสหมดเวลา |
| `vo_ruby_react_exwelcome` | Welcome back! Our helpers kept fighting! | ≤ 2.4 วิ | ดีใจ | กลับมาได้ของออฟไลน์ |
| `vo_ruby_tip_expedition` | Tap to fight! Hire helpers — they keep going even when you’re away. | ≤ 4.2 วิ | อธิบายใจดี | เปิด Expedition ครั้งแรก |

**รวม 23 ไฟล์ (SFX 17 · เพลง 2 · เสียงพูด 4)**

## ข้อห้าม
- เสียงแตะ 3 ตัวต้องสั้นและเบา (เล่นได้ 10 ครั้ง/วิ ไม่ล้า) · ห้ามแหลม · ห้ามเสียงพูดใน SFX/เพลง
- ห้ามเปลี่ยนคำในบท · ใช้ `’` ตามบท · ห้ามเลียนเพลงหรือเสียงจากเกมที่มีอยู่จริง

## โน้ตฝั่งโค้ด
- แพ็ก: SFX 96k → `assets/audio/sfx/a19/` · เพลง 80k → `assets/audio/bgm/expedition_a19/` · เสียงพูด 56k mono → `assets/audio/acting/`
- `expHit` tap → `sfx_ex_tap_1..3` (สุ่ม · throttle 70 ms) · crit → `sfx_ex_crit` · `expKill` → `foe_pop` + `crumbs` · ผ่านด่าน → `stage_up` · `expFoeNew` boss → `boss_appear` + `bgm_ex_boss` + Ruby `exboss` · `expTick` t≤5 → `boss_tick` ทุกวินาที · boss kill → `boss_down` · `expBossFail` → `boss_fail` + Ruby `exfail` · `expBuy` help → `hire` (ถึง ×2 → `milestone`) · tap → `upgrade` · supply → `supply` · `expDaily` → `daily_chest` · `expOffline` มีของ → `welcome_back` + Ruby `exwelcome`
- เพลง: `menuMusic('dig')` → `bgm_ex_expedition` · ไม่มีไฟล์ = เสียงเดิม (fallback)
- งบขนาด: ~1.5 MB

## ส่งมอบ
- (ฝั่งเสียงกรอก)
