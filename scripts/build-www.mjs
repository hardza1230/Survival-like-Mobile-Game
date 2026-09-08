// ประกอบโฟลเดอร์ www/ ที่ Capacitor ใช้ (webDir) จากไฟล์เกมที่ root
// คัดลอก index.html + game.js + phaser.min.js เข้า www/ (ไม่ commit www/ — สร้างตอน build)
import { mkdirSync, copyFileSync, existsSync, readFileSync, writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { inflateSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www');
mkdirSync(www, { recursive: true });

const ver = Date.now();

// phaser: คัดลอกตรง ๆ
copyFileSync(join(root, 'phaser.min.js'), join(www, 'phaser.min.js'));
console.log('copied phaser.min.js');

// game.js: ฝังเลข build ลง ASSET_VER → รูปใน assets/ ถูก cache-bust ด้วย (แก้รูปแล้วโหลดใหม่เสมอ)
let gjs = readFileSync(join(root, 'game.js'), 'utf8');
gjs = gjs.replace(/ASSET_VER\s*=\s*''/, "ASSET_VER='" + ver + "'");
writeFileSync(join(www, 'game.js'), gjs);
console.log('game.js built with ASSET_VER=' + ver);

// version.json: ดึง GAME_VERSION + CHANGELOG จาก game.js (แหล่งเดียว กันข้อมูลไม่ตรงกับหน้า download)
try {
  const verM = gjs.match(/GAME_VERSION\s*=\s*'([^']+)'/);
  const clM  = gjs.match(/const\s+CHANGELOG\s*=\s*(\[[\s\S]*?\]);/);
  const version = verM ? verM[1] : '0.0.0';
  const changelog = clM ? (new Function('return ' + clM[1]))() : [];
  writeFileSync(join(www, 'version.json'), JSON.stringify({ version, changelog }, null, 1));
  console.log('version.json built: v' + version + ' (' + changelog.length + ' entries)');
} catch (e) { console.warn('version.json skipped:', e.message); }

// download.html: หน้าแลนดิ้งดาวน์โหลด (โหลด version.json ไปแสดง)
if (existsSync(join(root, 'download.html'))) {
  copyFileSync(join(root, 'download.html'), join(www, 'download.html'));
  console.log('copied download.html');
}

// PWA/installed web app: เปิดแบบ fullscreen และล็อก portrait ตาม manifest
if (existsSync(join(root, 'manifest.webmanifest'))) {
  copyFileSync(join(root, 'manifest.webmanifest'), join(www, 'manifest.webmanifest'));
  console.log('copied manifest.webmanifest');
}

// คัดลอกเฉพาะ runtime assets ที่ game.js อ้างจริง ไม่ขน raw/source/ไฟล์ซ้ำทั้ง 86MB เข้า APK และ Pages
const builtAssets = join(www, 'assets');
if (existsSync(builtAssets)) rmSync(builtAssets, { recursive:true, force:true });
const assetRefs = [...gjs.matchAll(/["'](assets\/[A-Za-z0-9_./ -]+)["']/g)].map(m=>m[1]);
const uniqueAssets = [...new Set(assetRefs)].sort();

// กัน regression แบบ e_ant_scout เดิม: แถบดำทึบยาวติดมากับ PNG แม้เกมยังไม่ได้โจมตี
function assertNoOpaqueBlackBar(rel) {
  if (!/assets\/generated\/e_ant_[^/]+\.png$/.test(rel)) return;
  const png=readFileSync(join(root,rel));let pos=8,w=0,h=0,depth=0,type=0;const chunks=[];
  while(pos<png.length){const len=png.readUInt32BE(pos),tag=png.toString('ascii',pos+4,pos+8),data=png.subarray(pos+8,pos+8+len);pos+=12+len;
    if(tag==='IHDR'){w=data.readUInt32BE(0);h=data.readUInt32BE(4);depth=data[8];type=data[9];}
    else if(tag==='IDAT')chunks.push(data);else if(tag==='IEND')break;}
  if(depth!==8||type!==6)return; // ตัวตรวจนี้ตั้งใจสำหรับ RGBA 8-bit; format อื่นยังให้ build ทำงานตามปกติ
  const raw=inflateSync(Buffer.concat(chunks)),stride=w*4,prev=Buffer.alloc(stride),row=Buffer.alloc(stride);let off=0,maxRun=0;
  const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
  for(let y=0;y<h;y++){const filter=raw[off++];for(let x=0;x<stride;x++){const v=raw[off++],a=x>=4?row[x-4]:0,b=prev[x],c=x>=4?prev[x-4]:0;
      row[x]=(v+(filter===1?a:filter===2?b:filter===3?Math.floor((a+b)/2):filter===4?paeth(a,b,c):0))&255;}
    let run=0;for(let x=0;x<w;x++){const i=x*4,black=row[i]<12&&row[i+1]<12&&row[i+2]<12&&row[i+3]>240;run=black?run+1:0;maxRun=Math.max(maxRun,run);}row.copy(prev);}
  if(maxRun>=Math.max(28,Math.floor(w*0.35)))throw new Error('Opaque black bar detected in '+rel+' (run '+maxRun+'px)');
}
uniqueAssets.forEach(assertNoOpaqueBlackBar);
console.log('validated ant sprite alpha: no opaque black bars');
let copiedBytes = 0;
for (const rel of uniqueAssets) {
  const src = join(root, rel), dst = join(www, rel);
  if (!existsSync(src)) throw new Error('Missing runtime asset: ' + rel);
  mkdirSync(dirname(dst), { recursive:true });
  copyFileSync(src, dst);
  copiedBytes += statSync(src).size;
}
console.log('copied ' + uniqueAssets.length + ' runtime assets (' + (copiedBytes/1024/1024).toFixed(1) + ' MB)');

// index.html: ใส่ ?v=<build time> ให้ game.js เพื่อ bust cache (แก้แล้วโหลดใหม่เสมอ)
let html = readFileSync(join(root, 'index.html'), 'utf8');
html = html.replace(/game\.js(\?v=\d+)?/g, 'game.js?v=' + ver);
writeFileSync(join(www, 'index.html'), html);
console.log('index.html built with cache-bust v=' + ver);
console.log('www/ ready');
