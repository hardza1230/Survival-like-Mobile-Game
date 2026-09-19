# 🔐 สร้าง Signed AAB สำหรับ Play Store

> ตอนนี้เกม build เป็น **debug APK** (ทดสอบ/ลงเครื่องเองได้ แต่อัปขึ้น Play Store ไม่ได้)
> Play Store บังคับใช้ **Android App Bundle (.aab) ที่เซ็นด้วย release keystore**
>
> ทำ **ครั้งเดียว** ตามขั้นตอนนี้ แล้วต่อไปแค่ push tag `v*` ก็ได้ .aab เซ็นแล้วอัตโนมัติ

---

## ⚠️ สำคัญที่สุด: เก็บ keystore ให้ดี
`keystore` = กุญแจเซ็นแอป **ถ้าหาย/ลืมรหัส = อัปเดตแอปบน Play Store ไม่ได้อีกเลยตลอดกาล** (ต้องสร้างแอปใหม่)
→ เก็บไฟล์ `.keystore` + รหัสผ่านไว้หลายที่ (Google Drive ส่วนตัว, password manager)

---

## ขั้นที่ 1 — สร้าง keystore (ทำในเครื่องที่มี Java / หรือให้ Claude สร้างให้ก็ได้)
รันคำสั่งนี้ (มี `keytool` มากับ Java JDK):
```bash
keytool -genkeypair -v \
  -keystore mochi-release.keystore \
  -alias mochi \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass "ตั้งรหัสผ่านที่นี่" \
  -keypass "ตั้งรหัสผ่านที่นี่" \
  -dname "CN=Mochi Mayhem, OU=Game, O=Mochi, L=Bangkok, S=Bangkok, C=TH"
```
จะได้ไฟล์ `mochi-release.keystore` → **เก็บให้ดี**

## ขั้นที่ 2 — แปลง keystore เป็น base64 (เพื่อใส่เป็น secret)
```bash
base64 -w0 mochi-release.keystore > keystore.base64.txt
```
(บน Mac ใช้ `base64 -i mochi-release.keystore -o keystore.base64.txt`)

## ขั้นที่ 3 — เพิ่ม GitHub Secrets
ไปที่: repo → **Settings → Secrets and variables → Actions → New repository secret**
เพิ่ม 4 อัน:
| ชื่อ secret | ค่า |
|-------------|-----|
| `KEYSTORE_BASE64` | เนื้อหาทั้งหมดในไฟล์ `keystore.base64.txt` |
| `KEYSTORE_PASSWORD` | รหัส storepass จากขั้นที่ 1 |
| `KEY_ALIAS` | `mochi` |
| `KEY_PASSWORD` | รหัส keypass จากขั้นที่ 1 |

## ขั้นที่ 4 — สั่ง build AAB
- **แบบกดเอง:** repo → Actions → "Release Signed AAB" → Run workflow
- **แบบ tag:** `git tag v3.0.0 && git push origin v3.0.0`

ได้ไฟล์ `mochi-mayhem-release.aab` ใน artifact (และแนบใน Release ถ้า push tag) → เอาไปอัปใน Play Console

---

## หมายเหตุ
- workflow: `.github/workflows/release-aab.yml`
- สคริปต์เสียบ signing: `scripts/inject-signing.mjs`
- ครั้งแรกที่รันควรเช็ก log ว่าผ่านครบ ถ้า gradle fail เรื่อง signing แจ้ง Claude มาปรับ
- **Play App Signing:** แนะนำเปิด (Play Console จัดการกุญแจ upload ให้) — ตอนสร้างแอปครั้งแรก Google จะถาม; ถ้าเปิด คุณอัป .aab ที่เซ็นด้วย upload key (อันนี้) แล้ว Google เซ็น distribution key ให้เอง = ปลอดภัยกว่าถ้า upload key หาย
