const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const s=fs.readFileSync('game.js','utf8'),block=(a,b)=>s.slice(s.indexOf(a),s.indexOf(b));
function method(name){const at=s.indexOf('  '+name+'('),tail=s.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&next);return s.slice(at,at+1+next.index);}
const ctx={};vm.createContext(ctx);vm.runInContext(block('const BASIC_PATHS={','// 🍯 Flavor Infusion')+block('const TALENT_ICON_FRAMES =','// EXP ที่ต้องใช้'),ctx);
const a=vm.runInContext('({SES_RUNE_PT,PATH_TALENTS,talentBranch,sesTalentPaths,sesRuneTalentMul,talSpent})',ctx);
// v8.1.42 owner: Sesame has one Runes tree (Power / Motion / Binding branches + one capstone)
assert.deepEqual([...a.sesTalentPaths('sesame').map(p=>p.id)],['sesRune']);assert.notEqual(a.sesTalentPaths('momo').length,1);
const nodes=a.talentBranch(a.SES_RUNE_PT);assert.equal(nodes.length,10);assert(nodes.every(n=>n.id.startsWith('pt_sesRune_')&&!n.soon));
const pt={};for(const n of nodes){const r=n.max;if(n.apply&&!n.cap)n.apply(pt,r);}
assert.equal(+a.sesRuneTalentMul(pt._pt,'ppm','dmg').toFixed(2),1.45);   // root 3×5% + Heavy Runes 3×5% per Power rune ×2
assert.equal(+a.sesRuneTalentMul({},'ppp','dmg').toFixed(2),1);
assert(a.sesRuneTalentMul(pt._pt,'mmm','cd')>=.45&&a.sesRuneTalentMul(pt._pt,'mmm','cd')<1,'cooldown floor 45%');
assert.equal(+a.sesRuneTalentMul({srTri:1},'pmb','dmg').toFixed(2),1.4);assert.equal(+a.sesRuneTalentMul({srTri:1},'pmb','cd').toFixed(2),.8);
// one-time full refund of every Sesame talent point
const cp=vm.runInContext('({'+method('cp')+'\n})',ctx);const data={talV2:1,charProg:{sesame:{lvl:9,tp:2,tal:{pt_prism_root:3,s_core:2}},momo:{lvl:5,tp:1,tal:{x:2}}}};
const save={data,save(){},cp:cp.cp};save.cp('sesame');assert.equal(data.charProg.sesame.tp,2+6+3);assert.equal(Object.keys(data.charProg.sesame.tal).length,0);assert.equal(data.charProg.momo.tp,1);assert.equal(data.talRefundNote,1);
data.charProg.sesame.tal={pt_sesRune_root:1};save.cp('sesame');assert.equal(data.charProg.sesame.tal.pt_sesRune_root,1,'refund runs once');
console.log('Sesame Runes talents: one tree, 10 nodes, damage/cooldown math with floor, capstones and one-time full refund passed');
