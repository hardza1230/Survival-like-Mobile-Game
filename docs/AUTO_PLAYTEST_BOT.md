# 🤖 บอทเทสเกมอัตโนมัติ (Auto-Playtest Bot)

บอทที่เปิดเกม **ตัวจริง** ในเบราว์เซอร์แบบไม่มีหน้าจอ (headless Chromium ผ่าน Playwright)
แล้วเล่นเองครบทุกด่าน เพื่อ **จับบั๊กเทคนิคให้เร็วและซ้ำได้** ก่อน push

> ไฟล์: `scripts/bot.mjs` · รันผ่าน `npm run bot`

## บอทนี้ทำอะไร
- เปิด `index.html` (โหลด `phaser.min.js` + `game.js`) ผ่าน static server ในตัว
- บังคับเข้าเล่นทีละด่าน (0–4) โดยเรียกฟังก์ชันภายในเกม (`startRun` → `startStage`)
- ขับตัวละครสู้เอง เก็บ EXP และ **เลือกการ์ดเลเวลอัพอัตโนมัติ**
- เร่งเวลา (`GSPEED`) + god-mode ให้เล่นถึง **บอสทุกด่าน** ใน ~90 วิ/ด่าน
- ดักจับ **runtime error / console.error** พร้อมบรรทัดที่พัง
- แคป **หน้าจอทุกด่าน** + เขียน `report.json`
- ออกด้วย exit code ≠ 0 ถ้าเจอ error (ใช้ต่อใน CI ได้)

## บอทนี้ **ไม่** ทำอะไร
- ตัดสินความสนุก / บาลานซ์ / ความยาก — เรื่องพวกนี้ยังต้องเล่นจริงเอง
- ยืนยันว่า "บอสตายได้จริง" (god-mode ไม่ฆ่าบอส) — ดูหัวข้อ TODO

## วิธีใช้

```bash
# ติดตั้ง Playwright ครั้งเดียว (เบราว์เซอร์อยู่ที่ PLAYWRIGHT_BROWSERS_PATH แล้ว ไม่โหลดใหม่)
npm install --no-save playwright

# รันครบ 5 ด่าน (ค่าเริ่มต้น)
npm run bot

# รันเฉพาะบางด่าน / ปรับเวลา / ปรับความเร็ว
STAGES=1,2 SECS=45 GSPEED=4 node scripts/bot.mjs
```

### ตัวแปรปรับได้ (env)
| ตัวแปร | ค่าเริ่มต้น | ความหมาย |
|--------|-----------|----------|
| `STAGES` | `0,1,2,3,4` | ด่านที่จะเทส (index เริ่มที่ 0) |
| `SECS` | `90` | วินาทีจริงที่ปล่อยบอทเล่นต่อด่าน |
| `GSPEED` | `4` | ตัวคูณเร่งเวลาในเกม |
| `GOD` | `1` | `1`=อึดจนถึงบอส · `0`=ตายตามจริง (เทสความยาก) |
| `OUT_DIR` | `scripts/bot-out` | ที่เก็บ screenshot + report.json |
| `PW_EXEC` | (auto) | path Chromium/headless_shell เอง ถ้า auto หาไม่เจอ |

## ผลลัพธ์
- `scripts/bot-out/stageN.png` — ภาพหน้าจอด่าน N (ดูว่าเรนเดอร์เพี้ยน/กล่องดำไหม)
- `scripts/bot-out/report.json` — สรุปผลรวม + รายการ error ทั้งหมด
- โฟลเดอร์ `bot-out/` อยู่ใน `.gitignore` (ไม่ commit)

## หมายเหตุเทคนิค
- ขับเกมผ่าน `window.__g` (Phaser.Game) → `scene.getScene('Game')` แล้วตั้ง
  `scene.joy={active:true,dx,dy}` เพื่อสั่งเดิน (เหมือนจอยสติ๊ก) และเรียกฟังก์ชันภายในตรง ๆ
- `startRun` เป็น async (มี `delayedCall` หลายชั้น) และ `openStartingSkillChoice`
  อาจ set state ทับ → บอทจึง **enter play แบบ retry** จนกว่า `elapsed>0`
- Playwright 1.48 launch chrome เต็มด้วยแฟลก `--headless=old` ที่ chrome ใหม่ตัดออกแล้ว
  จึงต้องชี้ไปที่ `chromium_headless_shell` (โค้ดหาให้อัตโนมัติจาก `PLAYWRIGHT_BROWSERS_PATH`)

## TODO / ต่อยอดได้
- เทสหลายตัวละคร (Momo/Mint/Cocoa/Taro/Sesame) วนในลูปเดียว
- โหมด "ฆ่าบอสจริง" (ปิด god-mode + ให้บอทแรงพอ) เพื่อเทส `onBossDown`/หน้าสรุป/ปลดล็อกด่าน
- เก็บ FPS / เวลาเฟรม เพื่อจับ performance drop
- รวมเป็น GitHub Action ให้รันทุก push
