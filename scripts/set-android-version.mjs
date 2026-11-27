// ตั้ง versionCode/versionName ของแอป Android จาก GAME_VERSION ใน game.js
// เหตุผล: android/ ถูกสร้างใหม่ทุกครั้งที่ build → ค่า default ของ Capacitor คือ versionCode 1 เสมอ
// ซึ่ง Play Store จะปฏิเสธการอัปโหลดครั้งที่ 2 (versionCode ต้องเพิ่มขึ้นทุกครั้ง)
// สูตร (v7.8.103): MAJOR*1000000 + MINOR*1000 + PATCH  เช่น 7.8.103 → 7008103 (MINOR/PATCH ต้อง < 1000)
// เดิม MAJOR*10000+MINOR*100+PATCH พังเมื่อ PATCH ถึง 100 (7.8.99 = 70899) · สูตรใหม่ยังมากกว่าเลขเก่าทุกตัว Play Store จึงรับอัปเดตต่อได้
import fs from 'node:fs';

const src = fs.readFileSync('game.js', 'utf8');
const m = src.match(/const GAME_VERSION = '(\d+)\.(\d+)\.(\d+)'/);
if (!m) throw new Error('GAME_VERSION not found in game.js');
const [, maj, min, pat] = m.map(Number);
if (min > 999 || pat > 999) throw new Error(`GAME_VERSION ${maj}.${min}.${pat}: minor/patch must be < 1000 for versionCode`);
const versionCode = maj * 1000000 + min * 1000 + pat;
const versionName = `${maj}.${min}.${pat}`;

const p = 'android/app/build.gradle';
let g = fs.readFileSync(p, 'utf8');
if (!/versionCode\s+\d+/.test(g) || !/versionName\s+"[^"]*"/.test(g)) throw new Error('versionCode/versionName not found in ' + p);
g = g.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`).replace(/versionName\s+"[^"]*"/, `versionName "${versionName}"`);
// v8.3.18 เจ้าของ: ติดตั้ง APK ทับไม่ได้ ("แพ็กเกจขัดแย้ง") — CI เดิมได้ debug key ใหม่ทุกครั้ง (cache หาไฟล์ไม่เจอ)
// → เซ็นด้วย key ทดสอบตัวเดียวถาวรใน repo (android-signing/ci-debug.keystore · ไม่ใช่ key ของ Play Store)
if (fs.existsSync('android-signing/ci-debug.keystore') && !g.includes('ci-debug.keystore')) {
  g = g.replace(/android\s*\{/, `android {
    signingConfigs {
        debug {
            storeFile file("\${rootDir}/../android-signing/ci-debug.keystore")
            storePassword "android"
            keyAlias "androiddebugkey"
            keyPassword "android"
        }
    }`);
  if (!g.includes('ci-debug.keystore')) throw new Error('could not add the fixed debug signing config to ' + p);
}
fs.writeFileSync(p, g);
console.log(`android version set: versionCode ${versionCode}, versionName ${versionName}`);
