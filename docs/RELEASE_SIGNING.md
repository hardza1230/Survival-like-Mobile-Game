# สร้าง Signed AAB สำหรับ Play Store

ตรวจเอกสาร 18 ต.ค. 2026 เทียบกับ `.github/workflows/release-aab.yml` และ Android scripts ปัจจุบัน งานขึ้นสโตร์ยังพักไว้ตามแผนโปรเจกต์ การมี workflow ไม่ได้ยืนยันว่าตั้ง signing secrets หรือผ่าน release test แล้ว

## Build ที่มีอยู่

| Workflow | ผลลัพธ์ | แหล่งเกม |
|---|---|---|
| Build Android APK | `mochi-mayhem-debug.apk` สำหรับทดสอบ | โหลด GitHub Pages ตาม server.url |
| Release Signed AAB | `mochi-mayhem-release.aab` พร้อม signing เมื่อมี secrets ถูกต้อง | ลบ server.url แล้วฝังเกมในแอป |

Release workflow ใช้ **Node.js 22, JDK 21, Android SDK/build-tools 36** และ Capacitor 8 ตาม dependency ปัจจุบัน VersionName/VersionCode มาจาก **GAME_VERSION ใน game.js** ผ่าน scripts/set-android-version.mjs ไม่ได้ใช้ package.json version เป็นเวอร์ชันเกม

สูตร versionCode คือ major × 10000 + minor × 100 + patch; minor/patch ต้องต่ำกว่า 100 ตัวอย่าง 7.8.55 → 70855 เอกสารอย่างเดียวไม่ต้องเปลี่ยน GAME_VERSION

## 1. เตรียม signing key

ถ้ามี key ของแอปนี้อยู่แล้ว ให้ใช้ key เดิมและสำรองไว้ อย่าสร้างแทนโดยไม่ตรวจการตั้งค่าแอปที่เผยแพร่แล้ว เก็บ keystore และรหัสผ่านในที่ปลอดภัยนอก repository

ตัวอย่างสร้าง key สำหรับการตั้งครั้งแรก (keytool มากับ JDK; โปรแกรมจะถามรหัสผ่าน):

```sh
keytool -genkeypair -v \
  -keystore mochi-release.keystore \
  -alias mochi \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=Mochi Mayhem, OU=Game, O=Mochi, L=Bangkok, S=Bangkok, C=TH"
```

## 2. เตรียม GitHub Actions secrets

แปลง keystore เป็น base64 โดยไม่ commit ไฟล์:

```sh
base64 -w0 mochi-release.keystore > keystore.base64.txt
```

บน macOS: `base64 -i mochi-release.keystore -o keystore.base64.txt`

Repository → Settings → Secrets and variables → Actions:

| Secret | ค่า |
|---|---|
| KEYSTORE_BASE64 | เนื้อหา keystore.base64.txt |
| KEYSTORE_PASSWORD | รหัส keystore |
| KEY_ALIAS | alias ที่สร้าง เช่น mochi |
| KEY_PASSWORD | รหัสของ key ที่ใช้ signing |

ไฟล์ base64 มีความอ่อนไหวเทียบเท่า keystore ให้เก็บนอก Git เช่นเดียวกัน การตรวจเอกสารครั้งนี้ไม่ได้อ่านหรือตรวจค่า secrets

## 3. เรียก workflow

- ทดสอบแบบกดเอง: Actions → **Release Signed AAB** → Run workflow → เลือกสาขา `claude/vampire-survival-mobile-game-yo9e8w`
- เมื่อต้องการออก release จริง: tag `v*` จาก commit ที่ตรวจแล้ว (tag ควรตรงกับ GAME_VERSION และไม่ซ้ำ tag เดิม)
- ตรวจ steps จนครบและ workflow สำเร็จ แล้วดาวน์โหลด artifact/ไฟล์แนบ Release ของรันนั้น ไม่ใช้ debug APK แทน AAB

Workflow จะลบ live server เฉพาะใน runner, ประกอบ www, สร้าง Android platform/icons, ตั้ง portrait/fullscreen และเวอร์ชัน, inject signing, decode keystore และรัน bundleRelease

## 4. ก่อนนำไปเผยแพร่

- ยืนยัน signed AAB สร้างสำเร็จและ versionCode เพิ่มจากรุ่นที่เคยอัปจริง
- ทดสอบ bundle ผ่านช่องทางทดสอบของ Play Console รวมการเปิดเกมจากไฟล์ที่ฝังในแอปและ save lifecycle
- ตรวจสถานะ Cloud Save, account deletion, privacy/data safety และรายละเอียดสโตร์ตามบริการที่เปิดใช้งานจริง
- ทบทวน [STORE_LISTING.md](STORE_LISTING.md) และข้อกำหนดใน Play Console ณ วันที่ส่ง

Release AAB ไม่โหลดเกมจาก Pages; การแก้เว็บจะไม่อัปเดตเกมที่ฝังอยู่ใน AAB นั้น การทำ OTA bundle เป็นงานแยกที่ยังไม่ควรอ้างว่ามีแล้ว

## ไฟล์อ้างอิง

- `../.github/workflows/release-aab.yml`
- `../scripts/strip-live-server.mjs`
- `../scripts/set-android-version.mjs`
- `../scripts/inject-signing.mjs`
- [สถานะโปรเจกต์](PROJECT_SUMMARY_TH.md)

หาก key มีปัญหา ให้ตรวจประเภท app signing/upload key และทางกู้คืนที่ Play Console รองรับสำหรับแอปนั้นก่อนตัดสินใจสร้างแอปใหม่ ไม่สรุปว่าการทำ key หายทุกกรณีแก้ไขไม่ได้
