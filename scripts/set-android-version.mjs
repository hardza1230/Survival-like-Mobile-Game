// ตั้ง versionCode/versionName ของแอป Android จาก GAME_VERSION ใน game.js
// เหตุผล: android/ ถูกสร้างใหม่ทุกครั้งที่ build → ค่า default ของ Capacitor คือ versionCode 1 เสมอ
// ซึ่ง Play Store จะปฏิเสธการอัปโหลดครั้งที่ 2 (versionCode ต้องเพิ่มขึ้นทุกครั้ง)
// สูตร: MAJOR*10000 + MINOR*100 + PATCH  เช่น 4.62.0 → 46200 (MINOR/PATCH ต้อง < 100)
import fs from 'node:fs';

const src = fs.readFileSync('game.js', 'utf8');
const m = src.match(/const GAME_VERSION = '(\d+)\.(\d+)\.(\d+)'/);
if (!m) throw new Error('GAME_VERSION not found in game.js');
const [, maj, min, pat] = m.map(Number);
if (min > 99 || pat > 99) throw new Error(`GAME_VERSION ${maj}.${min}.${pat}: minor/patch must be < 100 for versionCode`);
const versionCode = maj * 10000 + min * 100 + pat;
const versionName = `${maj}.${min}.${pat}`;

const p = 'android/app/build.gradle';
let g = fs.readFileSync(p, 'utf8');
if (!/versionCode\s+\d+/.test(g) || !/versionName\s+"[^"]*"/.test(g)) throw new Error('versionCode/versionName not found in ' + p);
g = g.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`).replace(/versionName\s+"[^"]*"/, `versionName "${versionName}"`);
fs.writeFileSync(p, g);
console.log(`android version set: versionCode ${versionCode}, versionName ${versionName}`);
