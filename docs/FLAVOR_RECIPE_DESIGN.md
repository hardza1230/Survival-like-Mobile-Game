# 🍳 Flavor Recipes — ประกอบ Perk เอง (v5.35–v5.39)

ผู้เล่นสร้าง perk เองจากชิ้นส่วน 3 ชนิด: **WHEN (trigger) ▸ DO (effect) ▸ TWIST (modifier, ไม่บังคับ)**
ชิ้นส่วน 🧩 ขุดได้ใน ⛏️ Temple Depths · ประกอบที่ 🍳 Kitchen (ปุ่มในวิหาร Flavor Weave)

## กติกา
| หัวข้อ | ค่า |
|---|---|
| เพดานรสชาติ | 🍯 ≤ 10 ต่อสูตร (`FR_FLAVOR_CAP`) · trigger ที่เกิดถี่ = แพง |
| ช่องสูตร | เริ่ม 1 · ปลดช่อง 2..5 ด้วย 🏅 RP 2..5 (`frUnlockSlot`, นับใน rankPointsSpent) |
| ถอด/สลับชิ้นที่ใส่แล้ว | 🍬 20 (`FR_SWAP_SUGAR`) |
| รวมชิ้นซ้ำ | 3 ชิ้น → ★2 → ★3 (`FR_MERGE_N`, `FR_LV_MAX`) · effect +30% พลัง/★ · trigger เกิดถี่ขึ้น 15%/★ |
| Chain | effect ในสูตรไป trigger สูตรอื่นได้เฉพาะสูตรที่มี 🔗 Linked · ลึกสุด 2 ชั้น |
| Rate limit | รวมทุกสูตร ≤ 8 ครั้ง/วิ · ต่อสูตร icd ขั้นต่ำ 0.25 วิ |
| ของขวัญ | 5 ชิ้น (On Dash, Every 10 Kills, Shockwave, Heal, Bigger) |
| ขุดเจอ | ช่อง `part` น้ำหนัก 7+ชั้น×0.5 (แทนคัมภีร์ส่วนใหญ่) · trigger 40% / effect 40% / modifier 20% |

## ชิ้นส่วน (ดู `FR_TRIGGERS` / `FR_EFFECTS` / `FR_MODS` ใน game.js)
- **WHEN:** Dash · Crit · ทุก 10 kill · โดนตี · HP<30% · Unique · ทุก 20 EXP · ทุก 5 วิ · ยืนนิ่ง 1.5 วิ · ฆ่า Elite · เลเวลอัพ · เริ่มเวฟ · โล่แตก · ได้รับฮีล
- **DO:** Shockwave · ยิง 8 ทิศ · ฮีล 5% · โล่ · แช่รอบตัว · Rage +30% 4 วิ · ฟ้าผ่า ×3 · Unique cd −2 วิ · ดูด EXP · พื้นไฟ 3 วิ · Mochi Buddy 5 วิ · อมตะ 1 วิ
- **TWIST:** Bigger (+50% พื้นที่) · Stronger (+50% พลัง) · Echo (ซ้ำหลัง 0.5 วิ) · Quicker · Spicy (เผา) · Minty (แช่) · Linked (chain) · Gamble (50% ×2.5 หรือไม่มีอะไร)

## โค้ด
- Save: `frParts/frAddPart/frPlace/frRemove/frRecipes/frSlots/frUnlockSlot/frMerge/frLv` (field `fparts`, `fpLv`, `frRecipes`, `frSlots`, `frSlotRP`)
- Runtime: `frInit` (ใน resetRelics) · `fireRecipes(trigger)` · `frRun` · `frEffect` · `tickFR(dt)` (timer/still/lowHp/พื้นไฟ/buddy)
- UI: `buildKitchen` (menuScreen `kitchen`)

## อนิเมชัน / เสียง
| จังหวะ | ภาพ | เสียง |
|---|---|---|
| สูตรทำงาน | ป้าย `trigger▸effect` เด้งเหนือหัว แล้วลอยหาย (1 ป้าย/0.3 วิ/สูตร) | `sfx_recipe_fire` (pluck 3 โน้ต, throttle 140ms) |
| รวมชิ้น | ลำแสงทอง | `sfx_recipe_merge` (ระฆังไต่ 5 โน้ต) |

## ใบสั่งอาร์ต (ให้ AI อีกตัวทำ — ตอนนี้ใช้อีโมจิ)
| key | ขนาด | คำอธิบาย |
|---|---|---|
| kitchen_bg | 768×1366 ทึบ | ครัวลับในวิหาร เตาอิฐขนม ชั้นเครื่องปรุง แสงอุ่น กลางจอโล่ง |
| fr_t_<id> | 96×96 ×14 | ไอคอน trigger กรอบส้ม |
| fr_e_<id> | 96×96 ×12 | ไอคอน effect กรอบฟ้า |
| fr_m_<id> | 96×96 ×8 | ไอคอน modifier กรอบม่วง |
| dig_part | 96×96 | ชิ้นส่วนสูตรในหลุมขุด (การ์ดสูตรขาดครึ่ง) |
