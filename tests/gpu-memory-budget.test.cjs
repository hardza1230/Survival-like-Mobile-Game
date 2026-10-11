// v7.4 GPU memory plan: ภาพที่ถอดรหัสตอนบูต (core) ต้องอยู่ในงบ · ภาพหน้าเมนูย่อย/ฮีโร่ตัวอื่น/endgame เป็น lazy
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(root,'game.js'),'utf8');
const block=(start,end)=>{ const a=src.indexOf(start); assert(a>=0,start); const b=src.indexOf(end,a); assert(b>a,end); return src.slice(a,b+end.length); };
const ctx={navigator:{},localStorage:{getItem:()=>null},console,location:{search:'',href:'http://x/'},document:{},Phaser:{}};ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(block('const STAGE_DECOR={','\n};')+'\n'+src.slice(src.indexOf('const ASSET_IMAGES ='),src.indexOf('class Boot extends'))+';this.R={ASSET_IMAGES,ASSET_SHEETS,ASSET_FX,artClass,lazyArt,artHero,bootKeep,TEX_BUDGET_MB};',ctx);
const R=ctx.R;
// ขนาดภาพจาก header (PNG/JPEG/WebP) → ไบต์ RGBA ที่ GPU ใช้
function dims(file){ const b=fs.readFileSync(file);
  if(b[0]===0x89&&b.toString('ascii',1,4)==='PNG')return [b.readUInt32BE(16),b.readUInt32BE(20)];
  if(b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP'){ const t=b.toString('ascii',12,16);
    if(t==='VP8X')return [1+b.readUIntLE(24,3),1+b.readUIntLE(27,3)];
    if(t==='VP8L'){ const v=b.readUInt32LE(21); return [(v&0x3fff)+1,((v>>14)&0x3fff)+1]; }
    if(t==='VP8 ')return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff]; }
  if(b[0]===0xff&&b[1]===0xd8){ let i=2; while(i<b.length){ if(b[i]!==0xff){i++;continue;} const m=b[i+1],len=b.readUInt16BE(i+2); if(m>=0xc0&&m<=0xcf&&m!==0xc4&&m!==0xc8&&m!==0xcc)return [b.readUInt16BE(i+7),b.readUInt16BE(i+5)]; i+=2+len; } }
  return null; }
const all=[]; for(const [t,tab] of [['I',R.ASSET_IMAGES],['S',R.ASSET_SHEETS],['F',R.ASSET_FX]])for(const k in tab){ const u=typeof tab[k]==='string'?tab[k]:tab[k].url,f=path.join(root,u); if(!fs.existsSync(f))continue; const d=dims(f); assert(d,'unreadable image header '+u); all.push({k,u,mb:d[0]*d[1]*4/1e6}); }
const heroes=['momo','mint','cocoa','taro','sesame','yuzu'];
const sum=pred=>all.filter(pred).reduce((s,a)=>s+a.mb,0);
const total=sum(()=>true);
const boot=h=>sum(a=>!R.lazyArt(a.k,a.u,h));
const BOOT_CAP=300;
for(const h of heroes){ const mb=boot(h); assert(mb<=BOOT_CAP,'boot decode for '+h+' = '+mb.toFixed(0)+'MB > '+BOOT_CAP+'MB'); }
// ภาพหนักของหน้าเมนูย่อยต้องไม่ถอดรหัสตอนบูต
for(const k of ['menu_hub_v3']) assert.equal(R.artClass(k),null,'hub art stays core');
for(const a of all){ if(R.bootKeep(a.k))continue; if(/^screen_/.test(a.k)||/assets\/(?:art\/temple|character_cards|incoming)\//.test(a.u)) assert(R.artClass(a.k,a.u),a.k+' should be lazy'); }
assert.equal(R.artHero('bpx_cocoa_crack'),'cocoa'); assert.equal(R.artHero('minion_yuzling'),'yuzu'); assert.equal(R.artClass('char_mint'),null,'base hero sheet stays core for roster');
assert(R.lazyArt('char_mint_run',R.ASSET_SHEETS.char_mint_run.url,'momo')&&!R.lazyArt('char_mint_run',R.ASSET_SHEETS.char_mint_run.url,'mint'));
assert([250,400].includes(R.TEX_BUDGET_MB));
// โค้ดผูกครบ: preloadAll ดาวน์โหลดอย่างเดียว · เข้าด่านคืนภาพเมนู · เมนูคุมงบ · โหมดหน่วยความจำต่ำหลังกราฟิกดับ
assert(/lz\(k,ASSET_IMAGES\[k\]\)\)\{ if\(!only\)dl\(/.test(src),'preloadAll downloads lazy art without decoding');
assert(src.includes('this.menu.removeAll(true); this.texFreeForRun();'),'startRun frees menu art');
assert(src.includes('this.texTouch(this.texInUse()); this.texBudget();'),'menu enforces texture budget');
assert(src.includes("localStorage.setItem('mochi_lowmem','1')"),'context loss turns on low-memory mode');
assert(/DEFAULT_SETTINGS=\{[^}]*quality:0/.test(src),'Performance defaults to Auto');
console.log('GPU memory budget: all '+total.toFixed(0)+'MB · boot '+heroes.map(h=>h+' '+boot(h).toFixed(0)).join(' / ')+'MB (cap '+BOOT_CAP+') · lazy classes, run free, budget and low-memory hooks passed');
