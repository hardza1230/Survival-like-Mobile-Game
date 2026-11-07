# A09 — Ruby เสียงพากย์ในด่าน (เตือนสั้น + ปฏิกิริยา) · ใบสั่งเสียง

สถานะ: 📝 รอเจ้าของอนุมัติบท · เขียน 8 พ.ย. 2026 · ต่อจาก A07
เครื่องมือ: **ElevenLabs TTS** ใช้ **เสียง Ruby ที่บันทึกไว้แล้วของ A07** (voice ID ใน `assets/incoming/audio_voice_acting/VOICES.json` key `ruby`) · ห้ามสร้างเสียงใหม่ · ห้ามใช้เสียงสร้างด้วยโค้ด/Runway

## ทำไมต้องสั่ง
ตอนนี้ Ruby ในด่านมีเสียงแค่ประโยคอธิบายภารกิจแบบเต็ม (`RUBY_TIPS.say` 17 ประโยค) และเรื่องเล่าต้นด่าน (15) · แต่หลังเห็นภารกิจเดิม 3 ครั้ง เกมเปลี่ยนเป็น **ประโยคสั้น** (`RUBY_TIPS.short`) และกล่องเตือนภารกิจทุก 12 วิ ก็ใช้ประโยคสั้น → **ไม่มีเสียง** · และ Ruby ยังไม่พูดตอบเหตุการณ์ในด่าน (ล้มบอส, HP ต่ำ, ผ่านด่าน…)

## รูปแบบไฟล์ (เหมือน A07)
- MP3 mono 44.1 kHz 128 kbps · peak ≤ −1 dBTP · ตัดความเงียบต้นไฟล์ ≤ 60 ms
- **ยาว ≤ 2.2 วิ** (หมวด 1) · **≤ 2.0 วิ** (หมวด 2) — สั้น ชัด ไม่บังเสียงต่อสู้
- นิสัย Ruby: ภูตแยมผู้นำทาง ร่าเริง ห่วงใย กระตือรือร้น (ไม่ตะโกนแหลม)
- ข้อความใน MANIFEST ต้อง **ตรงตัวอักษร** กับคอลัมน์ "บท" (โค้ดใช้เทียบหาเสียง) · ใช้ `’` ไม่ใช่ `'`

## หมวด 1 — ประโยคเตือนภารกิจแบบสั้น (14 ไฟล์)
key `vo_ruby_short_<ภารกิจ>` · บท = ข้อความบนจอโดยตัด `[ ]` ออก (โค้ดตัดเลขความคืบหน้า " · 3/10" ก่อนเทียบเสียง)
| key | บท (พูด) | ข้อความบนจอเดิม |
|---|---|---|
| `vo_ruby_short_yuzuAim` | Walk toward an enemy to mark it! | Walk toward an enemy to [🎯] it |
| `vo_ruby_short_survive` | Hang on until the timer ends! | |
| `vo_ruby_short_fill` | Fill the meter! | |
| `vo_ruby_short_hunt` | Chase the marked Elite! | |
| `vo_ruby_short_huntClear` | Clear the crowd, then the marked Elite! | |
| `vo_ruby_short_purge` | Keep the Wisp safe from red raiders! | |
| `vo_ruby_short_capture` | Stay inside the ring! | |
| `vo_ruby_short_defendNectar` | Protect the flower! | |
| `vo_ruby_short_seasonCycle` | Gather petals for all four seasons! | Gather [petals] for all [4 seasons] |
| `vo_ruby_short_breakRoots` | Snap every root anchor! | |
| `vo_ruby_short_cleanAir` | Follow the clean-air ring! | |
| `vo_ruby_short_counter` | Dash into the glowing item! | |
| `vo_ruby_short_mini` | Beat the Miniboss! | |
| `vo_ruby_short_boss` | Defeat the Boss! | |
หมายเหตุ: `yuzuAim` และ `seasonCycle` บนจอมีไอคอน/ตัวเลข → **โค้ดต้องเปลี่ยนข้อความบนจอให้ตรงกับบทพูด** ("mark it", "four seasons") ตอนผูก

## หมวด 2 — ปฏิกิริยาในด่าน (14 ไฟล์ · ต้องเพิ่มโค้ดเรียก)
key `vo_ruby_react_<เหตุการณ์>_<1|2>` · โค้ดสุ่มสลับ 2 แบบ ไม่ซ้ำติดกัน
| เหตุการณ์ | เมื่อไหร่เล่น | บท 1 | บท 2 |
|---|---|---|---|
| `objdone` | ทำภารกิจด่านสำเร็จ | Objective done! Nice! | That’s it — perfect! |
| `bossdown` | ล้มบอส (ก่อนฉากหลังชนะ) | You did it! The flavor’s coming back! | Boss down! We’re winning! |
| `lowhp` | HP < 25% (ครั้งเดียว/ด่าน · เว้นจากเสียงฮีโร่ lowhp ≥ 4 วิ) | Careful! Grab a Heal Mochi! | You’re hurt — step back a bit! |
| `wave` | คลื่นมอนใหญ่เริ่ม | Here they come — a big wave! | Lots of monsters! Keep moving! |
| `timer` | ภารกิจ survive เหลือ 10 วิ | Almost there — ten more seconds! | Just a little longer! |
| `revive` | ฟื้นจาก Last Breath | Phew… you’re back! | Up you get! I believe in you! |
| `clear` | ผ่านด่าน (หน้าสรุป) | Stage clear! Great job! | We did it! On to the next one! |

## สรุป
| หมวด | ไฟล์ |
|---|---|
| 1 เตือนสั้น | 14 |
| 2 ปฏิกิริยา | 14 |
| **รวม** | **28** |

## ส่งมอบ
`assets/incoming/audio_ruby_a09/` + `MANIFEST.json` (key, file, bytes, sha256, duration_ms, speaker `ruby`, voice_id, text ตรงตัวอักษร) + `PROMPTS.json` + `QA_REPORT.json` (peak, onset, duration)

## โน้ตสำหรับ AI ที่ผูกเสียง
- ไฟล์ไปที่ `assets/audio/acting/` แล้วเพิ่มแถวใน `A07_CATALOG` (url literal, text, role `ruby`, duration) · อัปเดตจำนวนใน `tests/voice-acting-integration.test.cjs`
- หมวด 1: `rubySay` เล่นเสียงผ่าน lookup ด้วยข้อความอยู่แล้ว → ต้อง (ก) ตัดส่วน " · N/M" ออกก่อน lookup ใน `rubyTip` และกล่องเตือนทุก 12 วิ (`updateObjectiveArrow` แถว `tp.short`) (ข) แก้ข้อความบนจอของ `yuzuAim`/`seasonCycle` ให้ตรงบท · กล่องเตือนทุก 12 วิ ห้ามพูดทุกครั้ง: เว้นอย่างน้อย 30 วิต่อภารกิจ
- หมวด 2: เพิ่ม `rubyReact(event)` → หมุน 2 บท · ใช้ช่องเสียง VoiceActing เดียวกัน (ไม่ทับเสียงฮีโร่/บอส) · เคารพปิดเสียงพากย์และ `rubyOn()` · ห้ามพูดระหว่างฉาก cutscene/บทพูดบอส
- ห้ามพูดถี่: Ruby ปฏิกิริยาเว้นกันอย่างน้อย 8 วิ
