const fs=require('fs'),assert=require('assert/strict'),vm=require('vm'),src=fs.readFileSync('game.js','utf8');
const ctx={};vm.createContext(ctx);vm.runInContext(src.slice(src.indexOf('const MENU_GROUPS=['),src.indexOf('// v6.45:')),ctx);
const re=s=>vm.runInContext('menuGroupRe('+JSON.stringify(s)+')',ctx),base='assets/art/mobile_ui_789/';
for(const screen of['char','chars','talents']){assert(re(screen).test(base+'stat_frame_attack.webp'));assert(re(screen).test(base+'stat_icon_speed.webp'));assert(!re(screen).test(base+'gear_background.webp'),'Heroes does not decode Gear artwork');}
assert(re('gLoadout').test(base+'gear_background.webp'));assert(re('gLoadout').test(base+'gear_card_craft.webp'));assert(!re('gLoadout').test(base+'stat_icon_attack.webp'));
const manifest=JSON.parse(fs.readFileSync(base+'MANIFEST.json','utf8'));assert.equal(manifest.length,21);let bytes=0;
for(const row of manifest){const p=base+row.file,b=fs.readFileSync(p);bytes+=b.length;assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');assert(src.includes("'"+p+"'"),'runtime asset mapping '+p);if(row.file.startsWith('stat_'))assert.equal(row.alpha_extrema[0],0,'transparent stats edges');assert(row.width<=768&&row.height<=1660,'bounded source resolution');}
assert(bytes<900000,'bounded compressed production kit');console.log('Mobile UI art: 21 mapped WebP assets, transparent Stats edges, bounded resolutions/bytes and isolated page loader groups passed');
