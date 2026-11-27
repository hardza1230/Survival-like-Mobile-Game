// v8.3.21 Wardrobe art (commit 58416b67): 24 motion sheets, 8 painted wing icons, accessory icon atlas
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const s=fs.readFileSync('game.js','utf8'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const mot=JSON.parse(fs.readFileSync('assets/incoming/wardrobe_motion/MANIFEST.json','utf8')),wing=JSON.parse(fs.readFileSync('assets/incoming/wardrobe_wings/MANIFEST.json','utf8')),acc=JSON.parse(fs.readFileSync('assets/incoming/wardrobe_accessories/MANIFEST.json','utf8'));
const W=Array.isArray(wing)?wing:wing.assets;
assert.equal(mot.length,24);assert.equal(W.length,8);
for(const r of mot){assert.equal(sha(r.file),r.sha256,r.key);assert(s.includes("  "+r.key+":{url:'"+r.file+"',fw:"+r.frameWidth+",fh:"+r.frameHeight+",frames:8"),r.key+' registered');}
for(const r of W){assert.equal(sha(r.file),r.sha256,r.key);assert(s.includes("  "+r.key+":'"+r.file+"',"),r.key+' registered');}
assert.equal(sha(acc.file),acc.sha256);assert(s.includes("cos_accessories_paint:{url:'assets/art/cosmetics/cos_accessories_paint.webp',fw:144,fh:144,frames:16"));
const lazy=eval(s.match(/const LAZY_MENU_ART_RE=(\/[^\n]*?\/);/)[1]);for(const f of ['assets/art/wardrobe_motion/x.webp','assets/art/wardrobe_wings/x.webp'])assert(lazy.test(f),'lazy (never boot): '+f);
const ord=JSON.parse('['+s.match(/const COS_ACC_ICONS=\[([^\]]*)\]/)[1].replace(/'/g,'"')+']');assert.deepEqual(ord,acc.frames,'icon cell order matches the atlas');
// cosPick: motion > old > null · cosIcon: painted wing / atlas cell / old icon
const m=n=>{const a=s.indexOf('  '+n+'(');return s.slice(a,s.indexOf('\n',a));};
const ctx={ASSET_FX:{cos_wing_cream_motion:{fh:288,ox:.5,oy:.597},cos_wing_cream:{fh:128}},COS_ACC_ICONS:ord};vm.createContext(ctx);
vm.runInContext('class G{'+m('cosArtKey')+'\n'+m('cosPick')+'\n'+m('cosIcon')+'}globalThis.G=G;',ctx);
const g=new ctx.G(),c={id:'wing_cream',slot:'wings',icon:['cos_icons',0]},t=new Set();g.realTex=k=>t.has(k);
assert.equal(g.cosArtKey(c),'cos_wing_cream_motion');assert.equal(g.cosPick(c),null);t.add('cos_wing_cream');assert.equal(g.cosPick(c).k,'cos_wing_cream');t.add('cos_wing_cream_motion');assert(g.cosPick(c).motion);
assert.deepEqual([...g.cosIcon(c)],['cos_icons',0]);t.add('cos_wing_cream_paint');assert.equal(g.cosIcon(c)[0],'cos_wing_cream_paint');
const d={id:'dash_cream',slot:'dash',icon:['cos_icons2',8]};assert.deepEqual([...g.cosIcon(d)],['cos_icons2',8]);t.add('cos_accessories_paint');assert.deepEqual([...g.cosIcon(d)],['cos_accessories_paint',9]);
g._cosTried=new Set(['cos_wing_cream_motion']);assert.equal(g.cosArtKey(c),'cos_wing_cream','failed motion load falls back to the old sheet');
assert(fs.readFileSync('scripts/build-www.mjs','utf8').includes("join(www, 'missions-review.html')"),'mission summary page on GitHub Pages, kept out of the app');
const shop=s.slice(s.indexOf('const COSMETICS=['),s.indexOf('];',s.indexOf('const COSMETICS=[')));
for(const [id,price] of [['wing_honeycomb',450],['wing_matcha',450],['wing_midnight',450],['trail_mint',150],['dash_caramel',250],['pop_berry',300],['pet_fox',300]]){assert(new RegExp("id:'"+id+"'[^}]*price:"+price+"[^}]*emoji:").test(shop),id+' in the shop at '+price);assert(mot.some(r=>r.key==='cos_'+id+'_motion'),id+' has motion art');}
console.log('Wardrobe motion 8.3.21: 24 sheets + 8 wing icons + atlas, lazy, motion→old→code fallback, summary page passed');
