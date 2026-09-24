// ใช้เฉพาะตอน build release AAB (ขึ้น Play Store): ลบ server.url ออกจาก capacitor.config.json
// → แอปใช้ไฟล์เกมที่ฝังใน www/ แทนการโหลดจาก GitHub Pages ทุกครั้งที่เปิด (เล่นออฟไลน์ได้ · ไม่โดนมองว่าเป็นแอปหน้าเว็บ)
// APK ตัวเทส (android.yml) ไม่เรียกสคริปต์นี้ จึงยังอัปเดตเองผ่าน live update เหมือนเดิม
import fs from 'node:fs';

const p = 'capacitor.config.json';
const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
delete cfg.server;
fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n');
console.log('release build: removed server.url — game files are bundled in the app');
