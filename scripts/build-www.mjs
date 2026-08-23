// ประกอบโฟลเดอร์ www/ ที่ Capacitor ใช้ (webDir) จากไฟล์เกมที่ root
// คัดลอก index.html + game.js + phaser.min.js เข้า www/ (ไม่ commit www/ — สร้างตอน build)
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www');
mkdirSync(www, { recursive: true });

const files = ['index.html', 'game.js', 'phaser.min.js'];
for (const f of files) {
  const src = join(root, f);
  if (!existsSync(src)) { console.error('missing:', f); process.exit(1); }
  copyFileSync(src, join(www, f));
  console.log('copied', f);
}
console.log('www/ ready');
