# Commit Roadmap (v4.74 →)

แผนแบ่งงานเป็น commit เล็ก ๆ ทีละก้อน · 1 commit = 1 เรื่อง, เล่นได้/ไม่พังหลังทุก commit
ทุก commit: bump `GAME_VERSION` + `CHANGELOG` + validator version → `npm run check` → headless test → อัปเดต CLAUDE.md §4 → push
สถานะ: ⬜ ยังไม่ทำ · 🔄 กำลังทำ · ✅ เสร็จ

## Phase A — Chapter 3 ให้สมบูรณ์ (ยกเว้นอาร์ต)
- ⬜ **A1** Story beats + wave cutscene บท 3 (`STAGE_STORY_BEATS[10..14]`) + story panel ก่อนบอสแต่ละด่าน
- ⬜ **A2** Epilogue ด่าน C3-1..C3-5 (`STAGE_EPILOGUE[10..14]`) + ฉากจบเกม (victory หลัง The First Planter)
- ⬜ **A3** Bestiary: เพิ่ม mini/boss C3 ทั้ง 10 ตัว + นับ kill ถูก
- ⬜ **A4** กลไกบอส C3-1/C3-2 (ท่าเฉพาะ 2–3 ท่า/ตัว + phase gate แบบ `b.hp<=b.maxhp*X`)
- ⬜ **A5** กลไกบอส C3-3/C3-4
- ⬜ **A6** The First Planter (C3-5) 4 เฟส + ฉากตาย
- ⬜ **A7** มินิบอส C3 ท่าเฉพาะ (5 ตัว)
- ⬜ **A8** Objective/กิมมิคเฉพาะบท 3 (1–2 แบบ) + wave profile ศัตรูตามด่าน
- ⬜ **A9** Balance pass บท 3 (recommendedPower, HP/DMG curve, validator ขยายเป็น 15 ด่าน)

## Phase B — Endgame ให้ลึกขึ้น
- ⬜ **B1** Pinnacle: ท่าโจมตีเฉพาะ + 3 เฟส (แยกจาก First Planter)
- ⬜ **B2** Rift: mod ที่เปลี่ยนกลไก (เช่น มอนเร็ว, ระเบิดตอนตาย, ห้ามฮีล) ไม่ใช่แค่ตัวคูณ
- ⬜ **B3** Rift leaderboard/สถิติ (tier สูงสุดต่อตัวละคร) + Achievement endgame
- ⬜ **B4** (เลือก) Mochi Pet หรือ Ascendancy สายอาชีพ — แตกเป็น commit ย่อยตอนเริ่ม

## Phase C — ต่ออาร์ตจริง (เมื่อ AI อีกตัวส่งภาพมา)
- ⬜ **C1** ศัตรู C3 `c3_e_*` + พื้น `bg11-15`
- ⬜ **C2** มินิ/บอส C3 + จูน scale/setCircle
- ⬜ **C3** Pinnacle art + validator asset contract บท 3

## Phase D — QA + Polish
- ⬜ **D1** แก้ตาม feedback เล่นจริงบนมือถือ (แตกย่อยตามเคสใน `docs/PLAYTEST_CASES.md`)
- ⬜ **D2** Performance pass (FPS ด่านมอนเยอะ/บอส C3)

## Phase E — Play Store (พักไว้จนเจ้าของสั่ง)
- ⬜ **E1** ปุ่มลบบัญชีในแอป · ⬜ **E2** Store listing + screenshots · ⬜ **E3** Keystore + signed AAB · ⬜ **E4** Closed test · ⬜ **E5** รายได้ (AdMob)
