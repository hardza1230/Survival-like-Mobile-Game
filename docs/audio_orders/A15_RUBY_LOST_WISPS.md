# A15 — Ruby เสียงพากย์ภารกิจที่เปลี่ยนใหม่ (Hunger Crack · Clear the Fog · Lure the Crown Root · Seed Rift) · ใบสั่งเสียง

สถานะ: 🟢 ผูกแล้ว v8.2.12 · 8/8 · pack `scripts/pack-audio-a15.py` (56k mono เขียนทับ `assets/audio/acting/`) · `A07_CATALOG` ข้อความ/เวลาใหม่ · เทส ruby-a09-voice ตรวจครบทุกภารกิจอีกครั้ง
ส่งที่ `assets/incoming/audio_ruby_a15/` พร้อม `MANIFEST.json` (key, file, text, bytes, sha256, duration_ms)
เครื่องมือ: **ElevenLabs TTS** ใช้ **เสียง Ruby เดิมของ A07** (voice ID ใน `assets/incoming/audio_voice_acting/VOICES.json` key `ruby`) · ห้ามสร้างเสียงใหม่ · ห้ามใช้เสียงสร้างด้วยโค้ด

## ทำไมต้องสั่ง
ภารกิจ 4 อย่างเปลี่ยนวิธีเล่น ข้อความ Ruby จึงเปลี่ยนตาม · โค้ดเลือกเสียงจากข้อความ เสียงเก่าพูดเรื่อง "วง/ยืนในวง/ตัดราก" ที่ไม่มีแล้ว → ตอนนี้ 4 ภารกิจนี้ Ruby **เงียบ** (มีแต่ตัวหนังสือ) จนกว่าจะได้ไฟล์ใหม่
- v8.1.162 / v8.2.8 **Clear the Fog** (เดิม Clean Air / Lost Wisps): หยิบฟองอากาศดี แล้วไปปลดปล่อยเพื่อนในหมอกพิษ
- v8.2.7 **Hunger Crack** (เดิม Capture the Zone): แตะรอยแยก → วิ่งไปหลุมถัดไป · หลุมแตกมีมอนออกมา
- v8.2.8 **Lure the Crown Root** (เดิม Sever the Crown Roots): ล่อหัวรากที่มุดดินให้พุ่งชนหินสมอ
- v8.2.8 **Seal the Seed Rift**: รอยแยกดูดเรา · ไล่จับตัวขนเมล็ดสีเขียวก่อนมันป้อนรอยแยก

## รูปแบบไฟล์ (เหมือน A13)
MP3 mono 44.1 kHz 128 kbps (ฝั่งโค้ดแพ็กเป็น 56k ตอนผูก) · peak ≤ −1 dBTP · ตัดเงียบต้นไฟล์ ≤ 60 ms · ข้อความใน MANIFEST ต้อง **ตรงตัวอักษร** กับคอลัมน์ "บท" (บทในตารางตัด `[ ]` ออกแล้ว · ขีดยาว `—` ให้คงไว้)

| key | บท | ยาว | อารมณ์ |
|---|---|---|---|
| `vo_ruby_tip_cleanAir` | Grab the fresh air and free everyone in the poison fog! | ≤ 3.0 วิ | ตื่นเต้น เร่งนิด ๆ เหมือนกลั้นหายใจ |
| `vo_ruby_short_cleanAir` | Free them from the fog! | ≤ 1.5 วิ | สั้น กระฉับกระเฉง |
| `vo_ruby_tip_capture` | Touch the crack — it races to the next hole! | ≤ 2.8 วิ | ตื่นเต้น มีลุ้น (เว้นจังหวะตรง —) |
| `vo_ruby_short_capture` | Touch the crack, clear the holes! | ≤ 1.8 วิ | เร็ว ชัด |
| `vo_ruby_tip_breakRoots` | Lure the root into the anchor stones! | ≤ 2.4 วิ | เจ้าเล่ห์ ขี้เล่น เหมือนวางแผนแกล้ง |
| `vo_ruby_short_breakRoots` | Make the root hit the stones! | ≤ 1.7 วิ | สั้น ให้กำลังใจ |
| `vo_ruby_tip_seedRift` | Catch the seed carriers before they feed the rift! | ≤ 2.8 วิ | เร่งด่วน กังวลนิด ๆ |
| `vo_ruby_short_seedRift` | Catch the seed carriers! | ≤ 1.5 วิ | สั้น เร็ว |

**รวม 8 ไฟล์** · ใช้ key เดิม (เขียนทับ `assets/audio/acting/<key>.mp3` ตอนผูก)

## ข้อห้าม
- ห้ามเปลี่ยนคำในบท (โค้ดจับคู่ด้วยข้อความ) · ห้ามใส่เสียงประกอบ/ดนตรี · ห้ามเสียงหายใจยาวท้ายไฟล์

## โน้ตฝั่งโค้ด
- ผูก: อัปเดต `text` ใน `A07_CATALOG` 8 แถวนี้ให้ตรงบทใหม่ (ตอนนี้ `vo_ruby_tip_capture` ยังเป็น "Stand inside the ring!") · `duration` = `duration_ms` จาก MANIFEST
- เอาข้อยกเว้น `['cleanAir','capture','breakRoots','seedRift']` ใน `tests/ruby-a09-voice.test.cjs` ออก (2 จุด) ให้เทสตรวจครบทุกภารกิจอีกครั้ง
- ข้อความต้นทางอยู่ที่ `RUBY_TIPS` ใน game.js (`say` / `short`) — ถ้าเจ้าของแก้บทก่อนอัด ให้แก้ทั้งตารางนี้และ `RUBY_TIPS` พร้อมกัน

## ส่งมอบ
- 18 พ.ย. 2026 · ส่งครบ 8/8 ไฟล์ที่ `assets/incoming/audio_ruby_a15/` · ขาด 0 · 📦 ส่งแล้ว รอผูก
- ElevenLabs TTS · ใช้ Ruby voice ID เดิมจาก A07 · บทและขีดยาวตรงตารางทุกตัวอักษร
- ตรวจถอดรหัส MP3 mono 44.1 kHz 128 kbps, SHA-256/bytes, ความยาวรายบท, true peak และช่วงเงียบต้น/ท้ายจากไฟล์ส่งมอบ · peak สูงสุด −3.2 dBTP · ช่วงเงียบต้นไม่เกิน 12 ms
- การฟังเทียบกับเหตุการณ์จริงและการผูกเข้าเกมเป็นขั้นตอนถัดไป
