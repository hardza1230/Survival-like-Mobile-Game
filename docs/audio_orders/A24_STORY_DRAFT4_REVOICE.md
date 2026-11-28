# A24 — Ruby เสียงพากย์ใหม่: เรื่องร่าง 4 "Seedbearers" · ใบสั่งเสียง

สถานะ: 🟡 รอสั่ง · ข้อความในเกมเปลี่ยนแล้วใน v8.3.40 (เสียงเดิมของบรรทัดเหล่านี้ **ไม่เล่น** เพราะโค้ดหาเสียงจากข้อความตรงตัว)
เครื่องมือ: **ElevenLabs TTS** ใช้ **เสียง Ruby เดิมของ A07** (voice ID ใน `assets/incoming/audio_voice_acting/VOICES.json` key `ruby`) · ห้ามสร้างเสียงใหม่ · ห้ามใช้เสียงสร้างด้วยโค้ด
เรื่อง: `docs/STORY_CANON.md` (ร่าง 4)

## รูปแบบไฟล์ (เหมือน A07/A13)
- MP3 mono 44.1 kHz 128 kbps · peak ≤ −1 dBTP · ตัดเงียบต้นไฟล์ ≤ 60 ms · ยาว ≤ 5.5 วิ
- นิสัย Ruby: ภูตแยมทับทิม ร่าเริง ห่วงใย เล่าเรื่องอบอุ่น
- ข้อความใน MANIFEST ต้อง **ตรงตัวอักษร** กับคอลัมน์ "บท" · ใช้ `’` ไม่ใช่ `'`
- ส่งที่ `assets/incoming/audio_story4/` + `MANIFEST.json` (`key`, `text`, `role:"ruby"`, `duration` ms) · ไฟล์ทับ key เดิม (ชื่อไฟล์เดียวกัน)

## รายการ (11 key)
| key | ที่เล่น | บท |
|---|---|---|
| `vo_ruby_story_01` | เริ่ม C1-2 ครั้งแรก | The Empress is beaten! Grandma’s recipes are down these pipes. |
| `vo_ruby_story_02` | เริ่ม C1-3 ครั้งแรก | So hot! This machine burns stolen flavor. Every spark is someone’s memory. |
| `vo_ruby_story_03` | เริ่ม C1-4 ครั้งแรก | The frozen mochi here were people once. Let’s bring their flavor home! |
| `vo_ruby_story_04` | เริ่ม C1-5 ครั้งแรก | A Crown root drinks this kitchen. Let’s cut it! |
| `vo_story_s01_11` | คอมิกเปิดเกม ช็อตสุดท้าย (ใหม่) | Then the Heart Seed splits into tiny sprouts of light. Each one flies off to find someone still brave. |
| `vo_story_s06_2` | คอมิกฮีโร่ Mint ช็อต 2 | A sprout of the Heart Seed drifts down to them. |
| `vo_story_s07_2` | คอมิกฮีโร่ Cocoa ช็อต 2 | A sprout of the Heart Seed drifts down to them. |
| `vo_story_s08_2` | คอมิกฮีโร่ Taro ช็อต 2 | A sprout of the Heart Seed drifts down to them. |
| `vo_story_s09_2` | คอมิกฮีโร่ Yuzu ช็อต 2 | A sprout of the Heart Seed drifts down to them. |
| `vo_story_s15_2` | คอมิก C3-3 กระจก | In one mirror, a family laughs in the royal kitchen. Everyone here was someone once. |
| `vo_story_s16_3` | คอมิกตอนจบ ช็อต 3 | Together, the Seedbearers plant the Heart Seed at the roots. |

> s06–s09 ใช้บทเดียวกัน อัดครั้งเดียวแล้วคัดลอกเป็น 4 key ได้ (รวมเป็น 11 key จาก 8 บทจริง)

## โน้ตสำหรับ AI ที่ผูกเสียง
- แทนไฟล์เดิมใน `assets/audio/acting/` แล้วแก้ `text`/`duration` ใน `A07_CATALOG` ให้ตรง · เพิ่ม `vo_story_s01_11`
- ลบ key ที่อัดแล้วออกจาก `REVOICE` ใน `tests/story-motion-art.test.cjs`
- แพ็กตามมาตรฐาน wire-art §2b (เสียงพูด 48k โมโน)
