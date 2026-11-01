const assert=require('assert'),fs=require('fs'),crypto=require('crypto'),path=require('path');const root=path.join(__dirname,'..');const src=fs.readFileSync(root+'/game.js','utf8');
const m=JSON.parse(fs.readFileSync(root+'/assets/incoming/power57/MANIFEST.json','utf8'));const b=fs.readFileSync(root+'/assets/incoming/power57/'+m.file);
assert.equal(b.length,m.bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),m.sha256,'order 57 source hash');
const wb=fs.readFileSync(root+'/assets/art/mobile_ui_789/gear_power57_icons.webp');assert.equal(wb.slice(0,4).toString(),'RIFF');assert.equal(wb.slice(8,12).toString(),'WEBP');
const pw=src.match(/const PW57=\[([^\]]+)\]/);assert(pw,'PW57');const keys=pw[1].split(',').map(s=>s.trim().replace(/'/g,''));
assert.deepEqual(keys,m.icons.map(i=>i.key),'PW57 order = MANIFEST cell order');
assert(/power57_icons:\{url:'assets\/art\/mobile_ui_789\/gear_power57_icons\.webp',frame:192\}/.test(src),'literal sheet url');
assert(!/bootKeep[^\n]*power57/.test(src),'not boot');
assert(/if\(this\.W<=this\.H&&this\.buildWeavePW\?\.\(\)\)return;/.test(src),'portrait Weave uses Power theme');
const i=src.indexOf('\n  buildWeavePW(){'),j=src.indexOf('\n  // v8.0.22 buildSpecialCores',i),wv=src.slice(i,j);
for(const k of ['Save.buyTal(k)','_tutorialWeaveCoach','_weaveTour','_stage1Coach','drawSpotlight','Save.promote()','Save.promoteThreadCost()',"'weave_'+to","screen_gear_power_789","pwCard(","pwSection(","pwIcon("])assert(wv.includes(k),'Weave keeps '+k);
assert(/pwIcon\(key,x,y,size\)\{ const i=PW57\.indexOf\(key\); if\(i<0\)return null; if\(!this\.textures\.exists\('power57_icons'\)\)\{ this\.loadPower57\?\.\(\); return null; \}/.test(src),'missing art → fallback + lazy load');
{const gi=src.indexOf('\n  buildGear(){'),ge=src.indexOf('\n  ',gi+12),gs=src.slice(gi,src.indexOf('\n  gearEquipBest(',gi));for(const k of ["_screenBg('Equipment','screen_gear_power_789')","pwIcon?.('slot_'+slot","pwIcon?.('equip_best'","pwIcon?.('salvage'","qz.tag='gear_best'","0x423039","0xf4d9a1"])assert(gs.includes(k),'Equipment keeps/has '+k);}
{const crypto2=require('crypto');for(const a of JSON.parse(fs.readFileSync(root+'/assets/incoming/power58/MANIFEST.json','utf8'))){const b2=fs.readFileSync(root+'/assets/incoming/power58/'+a.file);assert.equal(crypto2.createHash('sha256').update(b2).digest('hex'),a.sha256,a.key);assert(fs.existsSync(root+'/assets/art/mobile_ui_789/'+a.key+'.webp'),a.key+' packed');assert(src.includes(a.key+":'assets/art/mobile_ui_789/"+a.key+".webp'"),a.key+' literal');}
const m9=JSON.parse(fs.readFileSync(root+'/assets/incoming/menu59/MANIFEST.json','utf8')),l9=src.match(/const MENU59=\[([^\]]+)\]/)[1].split(',').map(x=>x.trim().replace(/'/g,''));assert.deepEqual(l9,m9.icons.map(i=>i.key),'MENU59 order');
assert(/menu59_icons:\{url:'assets\/art\/mobile_ui_789\/menu59_icons\.webp',frame:192\}/.test(src));for(const k of ["pwArt?.('pw_empty_bag'","pwArt?.('pw_empty_forge'","pwArt?.('pw_empty_merge'","pwArt?.('pw_hero_weave'","M59_ROW[target]&&this.m59Img","M59_EMOJI[iconRef]?this.m59Img","tab_login"])assert(src.includes(k),'hook '+k);}
console.log('Power family: order 57 atlas hash/WebP/cell order, lazy loader + fallback, Weave Power-theme page keeps buy/tutorial/rank-up/routes; Equipment Power palette + slot/bag-action icons; orders 58/59 hashes, literals, cell order and hooks passed');
