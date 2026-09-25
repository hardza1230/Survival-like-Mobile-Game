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

## Phase R — Endgame: Mochi Recipe Maps (แบบ PoE maps ในรูป survival) ← ทำก่อน
แนวคิด: Recipe = ไอเทมแผนที่ (ธีม 1 ใน 15 ด่าน + Tier 1-16 + mods) · รัน = เติม **Hunger Meter** ด้วยการฆ่า (เป้าเฉลี่ย ~2 นาที · เคลียร์เร็ว = จบเร็ว ไม่มีรอ timer) + event กลางรัน → บอสธีมนั้น → ดรอป Recipe ถัดไป/ของ endgame/เศษกุญแจ
ค่าเริ่มต้นที่สมมติไว้ (เปลี่ยนได้): รันเฉลี่ย ~2 นาที (เจ้าของยืนยัน) · Tier 1 ฟรีไม่จำกัด · **ตาย = Recipe หาย** · เปิดครบ 15 ธีม
- ✅ **R1** (v4.75) Data model + save: `Save.data.recipes[]` {uid,theme,tier,mods,rarity} + หน้า 📜 Recipe (Activities) แสดงคลัง + ปุ่มรับ T1 ฟรี
- ✅ **R2** (v4.76) Recipe run mode: Hunger Meter เต็มจากการฆ่า (elite/rare ให้แต้มเยอะ, spawn ไหลแรงให้ build แรงเคลียร์ไว) → บอสโผล่ทันที · Speed bonus: จบเร็วกว่า par ได้รางวัลเพิ่ม + บันทึกเวลาดีที่สุดต่อธีม · mods/tier คูณเข้า `diffMul()` · ตาย = Recipe หาย
- ✅ **R3** (v4.77) Boss drops + loop: ดรอป Recipe tier เท่า/สูงกว่า, เศษกุญแจ Pinnacle, ของ endgame iLv ตาม tier (กฎเหล็ก: tier สูง รางวัลดีกว่า)
- ⬜ **R4** Craft Recipe ด้วย currency เดิม (transmute/alt/regal/chaos/exalt/scour) + mod ที่เปลี่ยนกลไก (มอนเร็ว, ระเบิดตอนตาย, ห้ามฮีล ฯลฯ)
- ⬜ **R5** Event กลางรัน: ห้องสมบัติ / ศาลบัฟ / พ่อค้า / Rare elite
- ⬜ **R6** Atlas board 15 ธีม: บันทึกเคลียร์ต่อ tier + ได้ Atlas point
- ⬜ **R7** Atlas passive tree (เพิ่มดรอป, event บ่อยขึ้น, mod พิเศษ ฯลฯ)
- ⬜ **R8** Unique ที่เปลี่ยน build + ดรอปเจาะจงจากบอสแต่ละธีม
- ⬜ **R9** ย้าย Rift → Recipe (เซฟเก่า riftKeys แปลงเป็นเศษกุญแจ) · Pinnacle ใช้เศษกุญแจ · Boss Rush คงไว้
- ⬜ **R10** Balance pass tier 1–16 + validator contract

## Phase B — Endgame เสริม (หลัง Phase R)
- ⬜ **B1** Pinnacle: ท่าโจมตีเฉพาะ + 3 เฟส (แยกจาก First Planter)
- ⬜ **B3** สถิติ/Achievement endgame
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
