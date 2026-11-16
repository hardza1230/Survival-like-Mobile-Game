# A15 — Ruby เสียงพากย์ภารกิจ Lost Wisps (Clean Air แบบใหม่) · ใบสั่งเสียง

สถานะ: 🟡 รอเสียง · เขียน 16 พ.ย. 2026 · ส่งที่ `assets/incoming/audio_ruby_a15/` พร้อม `MANIFEST.json` (key, file, text, bytes, sha256, duration_ms)
เครื่องมือ: **ElevenLabs TTS** ใช้ **เสียง Ruby เดิมของ A07** (voice ID ใน `assets/incoming/audio_voice_acting/VOICES.json` key `ruby`) · ห้ามสร้างเสียงใหม่ · ห้ามใช้เสียงสร้างด้วยโค้ด

## ทำไมต้องสั่ง
- v8.1.162 ภารกิจ Clean Air เปลี่ยนเป็น **Lost Wisps** (ป่ามืด · หา Wisp ที่กระจายทั่วแมพ) · เสียงเดิม `vo_ruby_tip_cleanAir` / `vo_ruby_short_cleanAir` พูดเรื่อง "วง" ซึ่งไม่มีแล้ว → โค้ดหาเสียงจากข้อความ จึงไม่เล่นเสียงเดิม (เงียบ) จนกว่าจะได้ไฟล์ใหม่

## รูปแบบไฟล์ (เหมือน A13)
MP3 mono 44.1 kHz 128 kbps · peak ≤ −1 dBTP · ตัดเงียบต้นไฟล์ ≤ 60 ms · ข้อความใน MANIFEST ต้อง **ตรงตัวอักษร** กับคอลัมน์ "บท" (ตัด `[ ]` ออก)

| key | บท | ยาว | อารมณ์ |
|---|---|---|---|
| `vo_ruby_tip_cleanAir` | Find the lost Wisps in the dark! | ≤ 2.6 วิ | กระซิบตื่นเต้นนิด ๆ แล้วให้กำลังใจ |
| `vo_ruby_short_cleanAir` | Free the Wisps! | ≤ 1.4 วิ | สั้น กระฉับกระเฉง |

**รวม 2 ไฟล์** · ใช้ key เดิม (เขียนทับไฟล์ `assets/audio/acting/vo_ruby_tip_cleanAir.mp3`, `vo_ruby_short_cleanAir.mp3` ตอนผูก)

## โน้ตฝั่งโค้ด
- ผูก: อัปเดต `text` ใน `A07_CATALOG` สองแถวนี้ให้ตรงบทใหม่ · เอาข้อยกเว้น `cleanAir` ใน `tests/ruby-a09-voice.test.cjs` ออก
