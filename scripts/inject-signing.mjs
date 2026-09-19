// เพิ่ม release signingConfig เข้า android/app/build.gradle (ที่ Capacitor สร้างตอน build)
// อ่านค่าจาก environment (ตั้งใน GitHub Actions จาก secrets) → ใช้เซ็น AAB/APK รุ่น release
import fs from 'node:fs';

const p = 'android/app/build.gradle';
let g = fs.readFileSync(p, 'utf8');

if (!/signingConfigs\s*\{/.test(g)) {
  const block = `
    signingConfigs {
        release {
            storeFile file(System.getenv("KEYSTORE_PATH") ?: "release.keystore")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }`;
  // แทรกหลัง 'android {' บรรทัดแรก
  g = g.replace(/android\s*\{/, (m) => m + block);
}

// เสียบ signingConfig ให้ buildTypes.release (ถ้ายังไม่มี)
if (!/release\s*\{[\s\S]*?signingConfig\s+signingConfigs\.release/.test(g)) {
  g = g.replace(/(buildTypes\s*\{[\s\S]*?release\s*\{)/, `$1\n            signingConfig signingConfigs.release`);
}

fs.writeFileSync(p, g);
console.log('injected release signingConfig into', p);
