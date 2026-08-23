# 🍡 Mochi Mayhem

เกมแนว **survival-like** บนมือถือ (เว็บ) สร้างด้วย Phaser 3 — โมจิจอมตะกละที่ต้องเอาชีวิตรอดจากฝูงศัตรู

## เล่นยังไง
- **ซ้ายของจอ:** ลากนิ้ว = เดิน (จอยสติ๊กลอย)
- **ขวาของจอ:** แตะ = สลิง/แดช (ทิ้งรอยเหนียวดักศัตรู + อมตะชั่วขณะ)
- อาวุธยิงเอง · เก็บลูกกวาดเพื่อเลเวลอัพ · เลือกอัปเกรด
- **Toast Meter:** ยิ่งสู้ยิ่งร้อน คุมให้อยู่ "จุดทอง" (แรงพุ่ง) อย่าปล่อยให้ "ไหม้" (เสีย HP)

## รันในเครื่อง
เปิด `index.html` ด้วยเว็บเซิร์ฟเวอร์ (เพราะโหลดไฟล์ js):
```
npx serve .      # หรือ  python3 -m http.server
```
แล้วเปิดเบราว์เซอร์ที่ URL ที่ขึ้นมา

## โครงสร้าง
- `index.html` — หน้าเกม (โหลด phaser + game.js)
- `game.js` — โค้ดเกมทั้งหมด (Boot สร้างกราฟิกจากรูปทรง, Game คือฉากเล่น)
- `phaser.min.js` — เอนจิน Phaser 3.80.1 (vendored)

## 📦 Build เป็นแอป Android (APK) — บนคลาวด์ ไม่ต้องมี PC
โปรเจกต์ห่อด้วย **Capacitor** และ build อัตโนมัติด้วย **GitHub Actions** (ไม่ต้องลง Android SDK เอง)

**วิธีได้ไฟล์ APK:**
1. ไปหน้า repo บน GitHub → แท็บ **Actions** → workflow **"Build Android APK"**
2. กด **Run workflow** (หรือมันรันเองทุกครั้งที่ push โค้ดเกม)
3. รอ ~3–5 นาที จนขึ้นเครื่องหมายถูกเขียว → เข้าไปในรันนั้น เลื่อนลงล่างสุด **Artifacts** → โหลด `mochi-mayhem-debug-apk`
4. แตกไฟล์ zip จะได้ `mochi-mayhem-debug.apk` → เปิดในมือถือเพื่อติดตั้ง (ต้องอนุญาต "ติดตั้งจากแหล่งที่ไม่รู้จัก")

**อยากได้ลิงก์โหลดง่าย ๆ (Release):** push tag ที่ขึ้นต้นด้วย `v` เช่น `v1.0.0`
→ workflow จะสร้าง **Release** พร้อมไฟล์ APK ให้โหลดตรง ๆ บนมือถือ

> หมายเหตุ: นี่คือ **debug APK** (สำหรับทดสอบ/ติดตั้งเอง). ตอนขึ้น Play Store จริงต้องทำ
> **signed release AAB** (เพิ่ม keystore + `assembleRelease`/`bundleRelease`) — ทำเป็นสเต็ปถัดไป

## 🔄 อัปเดตเกมโดยไม่ต้องลง APK ใหม่ (Live update ผ่าน GitHub Pages)
APK ถูกตั้งให้เป็น **"ตัวหุ้ม" ที่โหลดตัวเกมจาก GitHub Pages** ทุกครั้งที่เปิดแอป
(`capacitor.config.json` → `server.url`) ⇒ **แก้ `game.js` แล้ว push = แอปอัปเดตเองตอนเปิดครั้งถัดไป ไม่ต้องติดตั้งใหม่**

**ตั้งครั้งเดียว (ทำครั้งแรกครั้งเดียว):**
1. GitHub → repo → **Settings → Pages** → หัวข้อ *Build and deployment* → **Source: GitHub Actions**
2. รอ workflow **"Deploy Web (GitHub Pages)"** รันจนเขียว → เว็บเกมจะอยู่ที่
   `https://hardza1230.github.io/Survival-like-Mobile-Game/`
3. build APK (workflow "Build Android APK") **หลังจาก** ตั้ง Pages แล้ว → ติดตั้ง APK ตัวนี้ลงมือถือ **ครั้งเดียว**

**ต่อจากนั้นเวลาจะอัปเดตเกม:** แค่แก้โค้ด + push → Pages redeploy อัตโนมัติ → เปิดแอปใหม่ก็เห็นเวอร์ชันล่าสุด

> ⚠️ ข้อแลกเปลี่ยน: โหมดนี้แอปต้อง **ต่อเน็ต** ตอนเปิด (โหลดจาก Pages). ถ้าต้องการเล่นออฟไลน์ได้ + ยังอัปเดตเองได้
> ค่อยเปลี่ยนไปใช้ OTA แบบ bundle (เช่น Capgo) ตอนเตรียมขึ้นสโตร์จริง — เอา `server.url` ออกแล้วฝัง www ในแอปแทน

### ไฟล์ที่เกี่ยวกับ build
- `package.json` — dependency Capacitor
- `capacitor.config.json` — appId `com.mochimayhem.game`, ชื่อ **Mochi Mayhem**, webDir `www`
- `scripts/build-www.mjs` — ประกอบ `www/` (index.html + game.js + phaser) ตอน build
- `.github/workflows/android.yml` — ขั้นตอน build APK บน GitHub
- โฟลเดอร์ `android/` และ `www/` **สร้างตอน build** (ไม่ commit)

## สถานะ: Prototype (Phase 1)
ระบบที่มีแล้ว: จอยสติ๊ก, สลิง+รอยเหนียว, ศัตรู 3 ชนิด (pooled), เก็บของ/เลเวลอัพ,
เคลือบ 3 ชนิด (Sprinkle/Sugar Ring/Chili), passive, Toast Meter, จอเมนู/เลเวลอัพ/ตาย

## ถัดไป (roadmap)
- กราฟิก AI แทนรูปทรง (โมจิ/ศัตรู/ฉาก)
- ระบบ Fusion (ผสมเคลือบ 2 ชนิด)
- อาร์คีไทป์บิลด์ + บอส
- Meta-progression (Souls/ร้านอัปเกรด)
- แปลงเป็นแอปด้วย Capacitor + AdMob → ขึ้น Play Store
