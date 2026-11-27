// v8.3.17 owner: stage loading screen background VFX (CSS only) — rays behind the portal, stage-tinted fog, rising motes
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const h=fs.readFileSync('index.html','utf8'),g=fs.readFileSync('game.js','utf8');
assert(/<div id="load-fog"><i><\/i><i><\/i><i><\/i><\/div><div id="load-rays"><\/div><div id="load-motes"><\/div><div id="load-portal">/.test(h),'fog, rays and motes sit behind the portal');
assert(/#game-loader\.stage-cover #load-rays,#game-loader\.stage-cover #load-fog,#game-loader\.stage-cover #load-motes\{display:block;\}/.test(h),'VFX only on the stage cover');
assert(/prefers-reduced-motion:reduce\)\{#load-rays/.test(h),'reduced motion stops the VFX');
assert(g.includes(",st?.tint); }"),'stage tint is passed to the loader');
const fx=h.match(/_stageFx:function\(root,tint\)\{[^\n]*?\}catch\(e\)\{\}\}/)[0];
const kids=[],props={},doc={getElementById:()=>({childNodes:kids,appendChild:b=>kids.push(b)}),createElement:()=>({style:{}})};
const L=vm.runInNewContext('({'+fx+'})',{document:doc,Math});L._stageFx({style:{setProperty:(k,v)=>{props[k]=v;}}},0x8fc7ff);
assert.equal(props['--fog'],'rgba(143,199,255,.34)');assert.equal(kids.length,22,'22 motes');
L._stageFx({style:{setProperty:()=>{}}},0xff0000);assert.equal(kids.length,22,'motes made once');
console.log('Loader VFX 8.3.17: rays, stage fog, motes passed');
