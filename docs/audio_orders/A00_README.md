# ใบสั่งเสียง (Audio Orders) — ชุด A · 25 ต.ค. 2026

เกมเวอร์ชัน v8.0.33 · ใบเดิมในโฟลเดอร์นี้ (FULL_EVENT_SFX_133, CAMPAIGN_MUSIC_45, UNIQUE_SFX_STAGE31, BUILD_PATH, WISP) ส่งและผูกแล้ว — ชุด A คือ **ของที่ยังเงียบหรือยังยืมเสียงอื่นอยู่** หลังฟีเจอร์ v7.9–v8.0

| ใบ | เรื่อง | จำนวน | ความสำคัญ |
|---|---|---|---|
| `A01_MENU_PROGRESS_SFX.md` | หน้าเมนูใหม่: Merge, Forge Points, Login, Daily, Awards, Bestiary/Recipe Book, Depths, Rank Rewards, Power, ดาวด่าน, เปิดกล่องท้ายด่าน, ปลดฟีเจอร์ | 32 | 🟠 สูง |
| `A02_BATTLE_EVENT_SFX.md` | กลไกสนามบอส, Counter เตะคืน, ฆ่าบอสสโลว์, ภารกิจคลื่น, พิษ/เลือดออก, Ruby ในด่าน, ปุ่มเร่งเวลา | 30 | 🟠 สูง |
| `A03_YUZU_SFX.md` | Citrus Companions: Yuzling / Pomelo / Lime / Blood Orange, ฟื้น/สกิล/Unique · ElevenLabs | 20 | 🟢 กลาง |
| `A04_STORY_MUSIC_STINGERS.md` | เพลงหน้าแรก, เพลงฉากเรื่อง 4 อารมณ์, เพลงร้าน/Lobby, เสียงคำการ์ตูน, ชื่อด่าน, ชนะ/แพ้ | 20 | 🟢 กลาง |
| `A05_CHARACTER_VOICES.md` | เสียงพึมพำ (ไม่มีคำ) ของ Ruby, ฮีโร่ 5 ตัวใน Lobby, บอสตอนพูด | 31 | 🟡 ต่ำ–กลาง |
| `A07_VOICE_ACTING.md` | เสียงพากย์ตัวละครแบบ PoE: ออกแบบเสียง, ฉากเรื่อง, Ruby, บอส 2 เสียง, ฮีโร่ต่อสู้, ปลดล็อก/Lobby | ~317 | ✅ ผูกเสียงตั้งต้นแล้ว · เจ้าของฟังแล้วโอเค · เพิ่มจุดเล่น v8.1.39 |
| `A08_UNIQUE_VOICE_LINES.md` | เสียงตอนใช้ Unique ราย Build (3 ประโยค/Build) + Sesame เพิ่ม + เสียงคู่หู Yuzu ตอนท่าประสาน | 53 (+9 ออดิชัน) | ✅ เสียงครบ 53 ผูกเข้าเกมแล้ว · เจ้าของฟังแล้วโอเค |
| `A09_RUBY_STAGE_VOICE.md` | Ruby เสียงเตือนภารกิจ 14 + ปฏิกิริยาในด่าน 14 | 28 | 🟢 ผูกแล้ว v8.1.43 · รอฟังบนมือถือ |
| `A10_SESAME_SPELLS.md` | Sesame เสียงร่ายเวท 10 + เรียกชื่อเวท 10 | 20 | ➡️ รวมเข้า A11 |
| `A11_NEW_SCREENS_SFX.md` | **ใบรวม**: Sesame เวท 20 (จาก A10) + ฉากเงียบ SFX 26 + เสียงพากย์ที่หาย 6 (Ruby สอน/จบภารกิจ, Sesame เข้าทีม) | 52 | 🟡 รอส่ง (บท vo_sesame_unlock รออนุมัติ) |
| `A06_NEW_FEATURES_SFX.md` | ฟีเจอร์ใหม่ v8.0.85–90: Forge สุ่ม mod (ดี/เสีย/Lv/ลบ), Merge Mythic/Ancient/Divine, Relic Synergy, สถานะติดตัว 9, Yuzu วิวัฒนาการ+Unique, Taro Sentry, Login วัน 30, Depths · ElevenLabs | 28 | 🟢 ผูกแล้ว v8.0.91 |

## กติการ่วม (ทุกใบ)
- ทำด้วย **AI สร้างเสียง (เช่น ElevenLabs SFX/Music แบบ instrumental)** หรือ **สคริปต์สร้างเสียงด้วยโค้ด** (`scripts/gen_*_sfx.py`, jsfxr) — เลือกตามความเหมาะสมของแต่ละเสียง · **ห้ามเลียนแบบเพลง/ศิลปิน/เกมที่มีอยู่จริง** · ห้ามเสียงพูดเป็นคำ (ยกเว้นระบุ)
- สไตล์รวม: **น่ารัก ขนมหวาน แฟนตาซีพรีเมียม** · เสียงหัวคมชัดทันที (dry transient) · ปลายเสียงนุ่ม ไม่แหลมบาดหู · ฟังบนลำโพงมือถือได้ (ไม่พึ่งเบสลึกอย่างเดียว)
- **SFX:** MP3 44.1 kHz **mono** 128–160 kbps · peak ≤ −1 dBTP · ตัดเงียบหัว < 5 ms · ความยาวตามตาราง (ของที่เล่นถี่ต้องสั้นจริง)
- **เพลง:** MP3 44.1 kHz stereo 192 kbps · ประมาณ −18 LUFS · loop ต้องต่อรอยเนียน (crossfade ประมาณ 1 ห้องเพลง) · ระบุ BPM
- ส่งที่ `assets/incoming/audio_<ชุด>/` ตามที่แต่ละใบระบุ พร้อม `MANIFEST.json` (ต่อไฟล์: `key`, `file`, `bytes`, `sha256`, `durationMs`, `loop`, `peakDbtp`, `lufs` ถ้าเป็นเพลง, `bpm` ถ้าเป็นเพลง), `PROMPTS.json` (prompt/พารามิเตอร์จริง), `QA_REPORT.json` (decode ได้, ไม่เงียบ, peak, ความยาว)
- ฝั่งโค้ดผูกด้วย `ASSET_AUDIO` (path แบบ literal เท่านั้น — build-www คัดลอกเฉพาะ path ที่เขียนตรง ๆ) + `Sfx` เดิม (mute, สไลเดอร์ SFX/เพลง, จำกัดเสียงซ้อน) · ห้ามสร้าง AudioContext/HTML Audio ใหม่ · ไฟล์ไหนยังไม่มา = เสียงเดิมเล่นต่อ
- เจ้าของฟังบนมือถือเองตอนสุดท้าย — การตรวจเทคนิคไม่ได้รับรองว่าเพราะ

## Delivery v8.0.39

139 original ElevenLabs SFX delivered: A01 39 / A02 32 / A03 20 / A04 non-music15 / A05 33. Actual expanded row counts override the approximate totals above. All direct ElevenLabs Sound Effects, mechanical postprocessing only. Six A04 music tracks pending Music Generation access. Source and final manifests in each incoming kit; phone listening remains owner review.

## Delivery A06

28 new-feature SFX delivered from84 direct ElevenLabs donors in assets/incoming/audio_new_features/. All table rows covered; the printed29 count was corrected to28. Source-only: runtime integration and owner phone listening pending. See MANIFEST/PROMPTS/QA_REPORT/AUDITION in that directory.

## A04 / A07 partial update — 2026-11-06

A04 six music masters generated and technically checked; source only, game integration and musical review remain. A07 12 provisional voices saved and 144 existing game lines generated; source only, remaining dialogue, listening and runtime integration remain. See each order for exact scope.

## A07 update — 2026-11-07

Owner authorized the 114 new draft lines; those, remaining authored story captions, boss memories and alternative fight lines were generated. 350 dialogue masters are delivered as sources; three icon-bearing tips, listening review and runtime integration remain.

## A04 / A07 integration — 2026-11-07

A04 music and A07 current voice catalogue were wired into existing game flows. Cocoa was recast as a woman, Sesame as a soft mysterious woman, and boss casting was corrected where the written story explicitly states gender. See VOICE_CAST_AUDIT and A07 for scope and human-listening caveats.
