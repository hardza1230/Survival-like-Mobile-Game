# 07 — ไอคอนชิ้นส่วนสูตร Kitchen · batch `kitchen`

ระบบ Flavor Recipe (`docs/FLAVOR_RECIPE_DESIGN.md`): ผู้เล่นประกอบสูตร **WHEN ▸ DO ▸ TWIST** จากชิ้นส่วนที่ขุดได้ · ตอนนี้ใช้ภาพจริงครบทุกชิ้น
ฝั่งโค้ดโหลด `fr_<kind>_<id>` ในช่องสูตรและถุงชิ้นส่วนแล้ว (v6.0.9)

## สเปก
- **PNG 96×96 โปร่งใส** · ไอคอนเดี่ยวอ่านออกที่ ~28px
- แยกสีกรอบวงกลมบาง ๆ ตามหมวด (ให้ผู้เล่นจำได้): **WHEN = ฟ้า (#7fd3ff)** · **DO = ส้ม (#ffa45c)** · **TWIST = ม่วง (#c07bff)**
- ธีม: อุปกรณ์ครัว/วัตถุดิบ ผสมสัญลักษณ์ของเหตุการณ์

## WHEN (22) — key `fr_t_<id>`
dash · crit · kill10 · hurt · lowHp · unique · xp20 · timer5 · still · eliteKill · levelup · newWave · shield · heal · bossHit · multikill · surround · moving · fullHp · bossAppear · kill25 · timer10
(ตัวอย่างแนวคิด: dash = รองเท้าวิ่งมีเส้นความเร็ว · timer5 = นาฬิกาจับเวลาไข่ · lowHp = หัวใจแตกครึ่ง · surround = โมจิถูกล้อมด้วยจุด 8 จุด)

## DO (20) — key `fr_e_<id>`
shock · shots · heal · shield · freeze · rage · bolt · cdr · vacuum · burn · buddy · immune · meteor · orbit · haste · sour · cleanse · hole · recover · burst
(แนวคิด: meteor = ลูกกวาดตกเป็นดาวตก · hole = น้ำเชื่อมวนเป็นหลุม · buddy = โมจิเพื่อนตัวเล็ก)

## TWIST (13) — key `fr_m_<id>`
big · strong · repeat · faster · fire · ice · chain · gamble · focus · slow · sweet · sour · twin
(แนวคิด: slow = หม้อตุ๋นไฟอ่อน · twin = เชอร์รี่คู่ · gamble = ลูกเต๋าน้ำตาล)

ชื่อ/คำอธิบายเต็มแต่ละ id อยู่ใน `game.js` ตาราง `FR_TRIGGERS` / `FR_EFFECTS` / `FR_MODS`
