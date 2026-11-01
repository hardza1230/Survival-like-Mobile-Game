# 59 — Menu icons (หน้าที่ยังใช้อีโมจิ) · ใบสั่งงานอาร์ต

สถานะ: 🟡 รออาร์ต · เขียน 1 พ.ย. 2026
ส่งไฟล์ที่ `assets/incoming/menu59/` พร้อม `MANIFEST.json` (เหมือนใบ 57: key, file, bytes, sha256, cell, cols, rows, icons[index,key]), `PROMPTS.json`, `QA_REPORT.json`, พรีวิว 40/96px บน `#261e30`
สไตล์เหมือนใบ 56/57 (ภาพอ้างอิง `ref/57_power_page_ref.webp`, `ref/57_power56_icon_style_ref.webp`) · PNG32 พื้นโปร่งใส · ไม่มีตัวหนังสือ/ตัวเลข/กรอบ · อ่านออกที่ 28–40px

## ไฟล์: 1 atlas `menu59_icons.png` — 6 คอลัมน์ × 4 แถว เซลล์ 384×384 (2304×1536)

| เซลล์ | key | ใช้ที่ | ภาพ |
|---|---|---|---|
| 0 | `tab_login` | Rewards แท็บ Login | ปฏิทินผ้ามีโบว์ ช่องวันวงทอง |
| 1 | `tab_daily` | Rewards แท็บ Daily | กระดาษภารกิจม้วนมีเครื่องหมายถูก |
| 2 | `tab_awards` | Rewards แท็บ Awards | ถ้วยรางวัลทองลายลูกกวาด |
| 3 | `row_rewards` | Activities แถว Rewards / ปุ่ม Lobby | กล่องของขวัญเปิดฝามีประกาย |
| 4 | `row_kitchen` | Activities แถว Kitchen | หม้อซุปน่ารักมีไอหอม |
| 5 | `row_recipe_maps` | Activities แถว Recipe Maps | แผนที่ม้วนมีหมุดดาว |
| 6 | `tab_chests` | Bazaar แท็บ Chests | หีบไม้ทองเล็ก |
| 7 | `tab_shop` | Bazaar แท็บ Shop | กันสาดร้านขนมลายทาง |
| 8 | `tab_trade` | Bazaar แท็บ Trade | มือสองข้างแลกลูกกวาดกับไอเท็ม |
| 9 | `tab_heroes` | Heroes แท็บ Heroes | หน้าโมจิยิ้ม 3 ตัวซ้อนกัน |
| 10 | `tab_talents` | Heroes แท็บ Talents | ต้นไม้เล็กมีใบเป็นดาว |
| 11 | `tab_stats` | Heroes แท็บ Stats | กระดานสถิติแท่งกราฟลูกกวาด |
| 12 | `set_sound` | Settings เสียงเอฟเฟกต์ | ลำโพงรูปเปลือกหอยมีโน้ต |
| 13 | `set_music` | Settings เพลง | โน้ตดนตรีคู่ทำจากช็อกโกแลต |
| 14 | `set_voice` | Settings เสียงตัวละคร | ฟองคำพูดรูปโมจิ |
| 15 | `set_shake` | Settings จอสั่น | โทรศัพท์มีเส้นสั่นนุ่ม ๆ |
| 16 | `set_flash` | Settings แฟลช | ดาวกระพริบสีครีม |
| 17 | `set_vfx` | Settings เอฟเฟกต์ | ประกายสามดวง |
| 18 | `set_cloud` | Settings Cloud Save | ก้อนเมฆครีมมีลูกศรขึ้น |
| 19 | `set_tutorial` | More → How to Play | หมวกจบการศึกษาลายสตรอว์เบอร์รี |
| 20 | `mail` | Mail / Inbox | ซองจดหมายปิดผนึกด้วยหัวใจ |
| 21 | `news` | News | หนังสือพิมพ์ม้วนมีดาว |
| 22 | `codex_recipe` | Codex Recipe Book | หนังสือสูตรปกหนังมีช้อนคั่น |
| 23 | `codex_bestiary` | Codex Bestiary | สมุดภาพสัตว์ประหลาดมีรอยเท้า |

## ห้าม
ตัวหนังสือ · กรอบ · พื้นทึบ · สไตล์ต่างจากใบ 56/57

## โน้ตสำหรับฝั่งโค้ด
แพ็ก `scripts/pack-menu-59.py` (copy `pack-power-57.py`) → `assets/art/mobile_ui_789/menu59_icons.webp` 1152×768 · ASSET_SHEETS.menu59_icons frame 192 · ตัวช่วยแบบ `pwIcon` (atlas+ลำดับ MENU59) โหลดตอนเปิดหน้า · ใช้แทนอีโมจิใน rewardsTabs, HUB_GROUPS rows (gActivity/gMore/gCodex), Bazaar tabs, Heroes tabs, Settings rows, Lobby ปุ่ม Rewards/Mail/News/Codex · ไม่มีอาร์ต = อีโมจิเดิม
