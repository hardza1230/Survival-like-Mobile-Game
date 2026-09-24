# 🍡 Mochi Mayhem

เกมแนว **survival-like** บนมือถือ (เว็บ) สร้างด้วย Phaser 3 — เหล่าผู้พิทักษ์ที่ถือกำเนิดจาก **Mochi Core** ปลุกร่าง **Awakened Fighter** เพื่อต่อสู้กับโลกที่กำลังสูญเสียรสชาติ

> **Mochi Mayhem: FLAVORBOUND** ใช้แนวคิด “หนึ่งชีวิต สองร่าง”: Core Form เป็นโมจิเด้งดึ๋ง และ Awakened Form เป็นนักสู้แบบคน ทั้งสองคือคนเดียวกัน

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

> หมายเหตุ: APK จาก workflow ปกติยังเป็น **debug APK** สำหรับทดสอบ ส่วน workflow
> **Release Signed AAB** พร้อมแล้ว แต่ต้องตั้ง keystore และ GitHub Secrets ตาม `docs/RELEASE_SIGNING.md` ก่อนใช้งานครั้งแรก

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

## สถานะ: v4.47.0 — Production Raster Pickups & Training Ground

- Chapter 1 และ Chapter 2 เล่นได้ครบ 10 ด่าน ตั้งแต่ Pantry Raid ถึง **C2-5 Root Throne**
- C2-5 มี objective ทำลาย Crown Roots, arena event, ศัตรู 7 บทบาท, Ancient Root Knight และ The True Rootmother 4 เฟส พร้อม epilogue
- Chapter 2 ใช้ภาพศัตรู/บอสแบบโปร่งใสที่แยก silhouette และ pose ชัดบนมือถือ พร้อม validation ตรวจโครงสร้าง PNG จริงก่อน build
- ตัวละคร 6 คนมีอาวุธประจำตัว, Character Mastery, gear/crafting, Daily, Achievement, Bestiary, Ascension และ Midnight Kitchen Endless
- หน้า Affix Forge ใช้ flow 3 ขั้น Gear → Affix → Roll พร้อมเอฟเฟกต์รูเล็ตชะลอก่อนเปิดผลจริง และม็อด 15 แบบที่แยก Offense/Defense/Utility ชัดเจน
- Pickup 8 ชิ้นและพื้น Training Ground ใช้ PNG raster จริงแทน SVG พร้อมตัวตรวจขนาด/alpha/ไฟล์เสียก่อน build
- ระบบบอสป้องกันการข้าม phase ด้วย burst damage และคงความเป็นอมตะระหว่าง transition
- การตรวจอัตโนมัติใช้ `npm run check`; balance, touch controls, FPS และ visual readability ต้องยืนยันบนมือถือจริง

## ถัดไป (roadmap)
- เล่น Chapter 2 แบบ full run บนมือถือจริงและจูน Normal/Hard/Hell
- ตรวจ C2-5 ตาม `docs/C2_5_QA.md` รวมถึง FPS, touch controls และ safe routes ของทุกท่าบอส
- ตั้ง release keystore, สร้าง Signed AAB และเตรียม screenshot/Feature Graphic สำหรับ Play Store
