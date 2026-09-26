# 08 — บอส Endgame "PINNACLE · The Hunger Beneath" · batch `pinnacle`

ปัจจุบันใช้ `c3_boss5` ย้อมม่วง + ขยาย 1.25 · อยู่หลังจบเนื้อเรื่อง (Recipe Maps → Pinnacle ใช้ 3 🗝️)
เรื่อง: หลัง First Seed ถูกปลูกใหม่ รากที่เหลือใต้ Midnight Kitchen รวมเป็น **ความหิวดั้งเดิม** — ปากมหึมาใต้พื้นครัว มีช้อนส้อมเป็นเขี้ยว ตาหลายดวงเรืองม่วง-ทอง

## สเปก
- **Action sheet 4×2 = 8 เฟรม · 320×320/เฟรม · แผ่น 1280×640 · PNG โปร่งใส**
- เฟรม: `0 idle · 1 breath · 2 wind-up · 3 bite/slam · 4 summon · 5 hurt · 6 enrage · 7 defeat`
- key: `boss_pinnacle` · โทน #2a1040 / #6b2fa0 / ทอง #ffd166 · ต้องดู "ใหญ่และอันตรายที่สุดในเกม" แต่ยังน่ารักแบบขนม

## ฝั่งโค้ด
- `spawnFinalBoss` ถ้า `_pinnacleRun` และมี `boss_pinnacle` → ใช้ key นี้แทน c3_boss5 และเลิกย้อมม่วง · จูน scale/hitbox
