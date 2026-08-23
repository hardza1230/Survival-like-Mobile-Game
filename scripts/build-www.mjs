// ประกอบโฟลเดอร์ www/ ที่ Capacitor ใช้ (webDir) จากไฟล์เกมที่ root
// คัดลอก index.html + game.js + phaser.min.js เข้า www/ (ไม่ commit www/ — สร้างตอน build)
import { mkdirSync, copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www');
mkdirSync(www, { recursive: true });

// คัดลอกไฟล์เกม
for (const f of ['game.js', 'phaser.min.js']) {
  const src = join(root, f);
  if (!existsSync(src)) { console.error('missing:', f); process.exit(1); }
  copyFileSync(src, join(www, f));
  console.log('copied', f);
}

// index.html: ใส่ ?v=<build time> ให้ game.js เพื่อ bust cache (แก้แล้วโหลดใหม่เสมอ)
const ver = Date.now();
let html = readFileSync(join(root, 'index.html'), 'utf8');
html = html.replace(/game\.js(\?v=\d+)?/g, 'game.js?v=' + ver);
writeFileSync(join(www, 'index.html'), html);
console.log('index.html built with cache-bust v=' + ver);
console.log('www/ ready');
