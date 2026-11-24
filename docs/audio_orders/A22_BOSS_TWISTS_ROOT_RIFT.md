# A22 — ลูกเล่นบอส · Lure the Crown Root · Seed Rift เหตุการณ์สุ่ม · Perfect Dodge · ใบสั่งเสียง

สถานะ: 🟡 รอเสียง · เขียน 24 พ.ย. 2026 · **บท Ruby รอเจ้าของอนุมัติ** · โค้ดพร้อมแล้ว (v8.2.81 / v8.2.83) ตอนนี้ใช้เสียงเดิมที่ใช้ร่วมกับที่อื่น
ส่งที่ `assets/incoming/audio_a22/` พร้อม `MANIFEST.json` (key, file, text (เฉพาะเสียงพูด), bytes, sha256, duration_ms, kind), `PROMPTS.json`, `QA_REPORT.json`
เครื่องมือ: **ElevenLabs** · SFX = Sound Effects · เสียงพูดใช้ **เสียง Ruby เดิมของ A07** (voice ID ใน `assets/incoming/audio_voice_acting/VOICES.json` key `ruby`) · ห้ามเสียงสร้างด้วยโค้ด/Runway

## ระบบในเกม (อ้างอิง)
- **ลูกเล่นบอส (v8.2.83):** บอส Ch2–3 เลือด 60% และ 30% → ลูกเล่น 15 วิ · ตอนนี้ทุกแบบใช้เสียง `a18_boss_mission` เดียวกัน · จบแล้วขึ้น "Survived!" + Sugar
- **Lure the Crown Root (v8.2.81):** รากมุดดิน → รอยแตกเตือน → รากพุ่ง · ชนหินสมอ = หินแตก · หลบทันช่วงท้าย = Perfect Dodge (เวลาหยุดวูบ) · จบ = หัวรากติดพื้น 8 วิ ให้รุมตี
- **Seed Rift เหตุการณ์สุ่ม (v8.2.83):** รอยแยกเปิดเองกลางเวฟ 20 วิ แล้วปิดเอง · ตอนนี้ใช้เสียง `wave_start`

## A. ลูกเล่นบอส (SFX · MP3 44.1 kHz · ≤ 1.6 วิ · ต้องตัดผ่านเพลงบอสได้)
| key | เสียง | ยาว |
|---|---|---|
| `sfx_a22_twist_roots` | รากใหญ่ทะลุพื้นดังครืน + เสียงไม้ลั่น | 1.2 วิ |
| `sfx_a22_twist_seeds` | เมล็ดหลายเม็ดหล่นใส่พื้น "ป๊อก ๆ ๆ" + ลมหวีดสั้น | 1.0 วิ |
| `sfx_a22_twist_fruit` | กิ่งไม้สั่น + ผลไม้หล่นมาพร้อมเสียงหวีดต่ำ | 1.2 วิ |
| `sfx_a22_twist_dark` | ไฟดับ "ฟึ่บ" + โดรนต่ำน่าขนลุก (ไม่มีเสียงกรีด) | 1.6 วิ |
| `sfx_a22_twist_shadows` | กระจกร้าวแล้วแตก + เสียงสะท้อนก้อง | 1.4 วิ |
| `sfx_a22_twist_survive` | สติงเกอร์สั้นสดใส "รอดแล้ว!" (กระดิ่ง + พิณขึ้น 2 โน้ต) | 0.9 วิ |
| `sfx_a22_seed_pop` | เมล็ดแตกใต้เท้า กรุบ + ประกายเล็ก | 0.3 วิ |
| `sfx_a22_seed_hatch` | เมล็ดฟัก ฟู่ + ป๊อปทุ้ม | 0.5 วิ |
| `sfx_a22_fruit_splat` | ผลไม้ฉ่ำแตกกระจาย "แปะ!" | 0.4 วิ |

## B. Lure the Crown Root (SFX · ≤ 1.2 วิ)
| key | เสียง | ยาว |
|---|---|---|
| `sfx_a22_root_burrow` | ดินครืดคราดใต้พื้น (loop ได้ ต่อหัวท้ายเนียน) | 1.5 วิ loop |
| `sfx_a22_root_warn` | พื้นร้าว ครืก ๆ ถี่ขึ้น (จังหวะเตือน) | 0.8 วิ |
| `sfx_a22_root_strike` | รากพุ่งทะลุดิน ตูม! + ไม้หัก | 0.7 วิ |
| `sfx_a22_anchor_break` | หินแตกโครม + ประกายทอง | 0.8 วิ |
| `sfx_a22_perfect_dodge` | เวลาหยุดวูบ "วู้ม" + กริ่งใสขึ้นสูง | 0.6 วิ |
| `sfx_a22_root_combo` | หลายเสียงป๊อปไล่กันเร็ว ๆ (ฆ่าหลายตัว) | 0.6 วิ |
| `sfx_a22_head_burst` | หัวรากระเบิด ครืนใหญ่ + เศษไม้ + ประกายทอง | 1.2 วิ |

## C. Seed Rift เหตุการณ์ (SFX)
| key | เสียง | ยาว |
|---|---|---|
| `sfx_a22_rift_warn` | พื้นสั่นเบา ๆ + เสียงเมล็ดสั่นกุกกัก (เตือนก่อนเปิด) | 1.5 วิ |
| `sfx_a22_rift_open` | รอยแยกฉีกเปิด + ลมดูด วืด | 1.2 วิ |
| `sfx_a22_rift_feed` | ตัวขนเมล็ดตกลงรอยแยก + เรอทุ้ม (รอยแยกโตขึ้น) | 0.6 วิ |
| `sfx_a22_rift_close` | รอยแยกปิด "ฟุบ" + ประกายลดลง | 1.0 วิ |

## D. Ruby (MP3 mono 44.1 kHz 128 kbps · peak ≤ −1 dBTP · ตัดเงียบต้น ≤ 60 ms · **บทตรงทุกตัวอักษร** · ≤ 2.4 วิ)
เล่นตอนลูกเล่นบอสเริ่ม (ไม่ทุกครั้ง · โค้ดคุมความถี่) และตอนเหตุการณ์ Seed Rift · โทน: เพื่อนตัวเล็กที่เตือนด้วยความห่วง ไม่ตกใจเกินไป
| key | บท | อารมณ์ |
|---|---|---|
| `vo_ruby_twist_roots` | Roots! Watch where they pop out! | ระวัง |
| `vo_ruby_twist_seeds` | Step on the seeds before they hatch! | เร่ง |
| `vo_ruby_twist_fruit` | Fruit’s falling — keep moving! | ขำ ๆ ตื่นเต้น |
| `vo_ruby_twist_dark` | It’s getting dark… they’re getting angry! | กลัวนิด ๆ |
| `vo_ruby_twist_shadows` | Shadows of the boss? Don’t let them surround you! | จริงจัง |
| `vo_ruby_rift_event` | A Seed Rift! Catch the carriers for Sugar! | ตื่นเต้น |
| `vo_ruby_perfect` | Perfect dodge! | ดีใจ ภูมิใจ (≤ 1 วิ) |
| `vo_ruby_crown_stuck` | It’s stuck! Hit it now! | เร่ง ดีใจ |

**รวม 28 ไฟล์ (SFX 20 · เสียงพูด 8)** · ตัด `head_hit` ออก — ใช้ `sfx_a21_hit_plant_*` ที่ส่งมาแล้ว (A21 combat) แทน · งบขนาดหลังแพ็ก ~0.9 MB

## ข้อห้าม
- ห้ามเปลี่ยนคำในบท · ใช้ `’` / `—` / `…` ตามบท · ห้ามเสียง Ruby แบบใหม่ (ต้องใช้ voice ID เดิม)
- SFX ต้องจบเองตามเวลา ไม่มีหาง reverb ยาวทับเพลงบอส · ห้ามเสียงกรีดร้องหรือเสียงน่ากลัวเกินโลกขนม
- บท Ruby ต้องไม่ขัด `docs/STORY_CANON.md`

## โน้ตฝั่งโค้ด
- แพ็ก: SFX 96k → `assets/audio/sfx/a22/` · เสียงพูด 56k mono → `assets/audio/acting/` + เพิ่มใน `A07_CATALOG` (role `ruby`) · ใช้ `scripts/pack-audio-a20.py` เป็นต้นแบบ
- **A:**
  - `bossTwistStart(kind)`: แทน `a18_boss_mission` ด้วย `a22_twist_<kind>` · Ruby `vo_ruby_twist_<kind>` เล่นครั้งแรกของแต่ละแบบต่อรัน
  - `bossTwistEnd(true)` → `a22_twist_survive`
  - เมล็ดแตก/ฟัก ผลไม้แตก → seed_pop / seed_hatch / fruit_splat
- **B:**
  - `crownRootTickHead` ตอน burrow → loop `root_burrow` (หยุดตอน warn) · warn → `root_warn` · `crownRootStrike` → `root_strike`
  - ชนหิน → `anchor_break` · Perfect → `perfect_dodge` + `vo_ruby_perfect` (ครั้งแรกต่อด่าน) · combo → `root_combo`
  - `crownRootFinale` → `vo_ruby_crown_stuck` · โดนตี → `Sfx.a21('hit_plant')` (มีแล้วจาก A21 combat) · ระเบิด → `head_burst`
- **C:** `seedRiftEventStart` → rift_warn (ตอนเพิ่มช่วงเตือนตามใบอาร์ต 94) → rift_open + `vo_ruby_rift_event` · feed → rift_feed · `seedRiftEventEnd(true)` → rift_close
- ใช้ `this.a12?.(key)` / `Sfx.orderCue` (ไม่มีไฟล์ = ใช้เสียงเดิม) · โหลด SFX ตอนเข้าด่าน Ch2+ (คู่กับ `ensureStageAudio`) · ปิด Ruby ในตั้งค่า (`noRuby`) = ไม่พูด

## ส่งมอบ
- วันที่: —
- สถานะ: 🟡 รอเสียง
