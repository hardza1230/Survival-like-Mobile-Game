const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const src=fs.readFileSync('game.js','utf8');
function method(n){const a=src.indexOf('\n  '+n+'(');assert(a>0,n);let i=src.indexOf('{',a),d=0;for(;i<src.length;i++){if(src[i]==='{')d++;else if(src[i]==='}'&&--d===0)break;}return src.slice(a+3,i+1);}
let thr=0;const Save={data:{},save(){},addThreads(n){thr+=n;}};
const ctx={Save,HEROES_WIP:['sesame'],BASIC_PATHS:{momo:[{id:'sniper',name:'Sniper Build',emoji:'🎯',upgrades:[{id:'headshot',name:'Headshot'},{id:'deadeye',name:'Deadeye'}]}],sesame:[{id:'prism',upgrades:[{id:'x'}]}]},UNIQUE_MUTS:{sniper:[{id:'snipe_refund',name:'Hunter'}]}};
vm.createContext(ctx);const a=src.indexOf('const RECIPE_PATH_THREAD='),b=src.indexOf('function storyCleared(');vm.runInContext(src.slice(a,b)+';this.R={recipeCards,recipeSeen,RECIPE_PATH_THREAD};',ctx);
assert.equal(ctx.R.recipeCards('momo','sniper').length,3,'path cards + Unique Mutations');
const C=vm.runInContext('(class{'+method('recipeNote')+'})',ctx),s=new C();let banner=0;s.basicAttack={character:'momo',path:'sniper'};s.showBanner=()=>banner++;s.time={delayedCall:(ms,f)=>f()};
const pick=(kind,key)=>s.recipeNote({opt:{kind,key}});
pick('Basic Attack','headshot');pick('Basic Attack','headshot');pick('Basic Attack','deadeye');assert.equal(thr,0);
pick('⭐ Unique Mutation','snipe_refund');assert.equal(thr,ctx.R.RECIPE_PATH_THREAD,'full Build pays Thread once');assert.equal(banner,1);
pick('⭐ Unique Mutation','snipe_refund');assert.equal(thr,ctx.R.RECIPE_PATH_THREAD);
s.basicAttack={character:'sesame',path:'prism'};pick('Basic Attack','x');assert(!Save.data.recipeBook.sesame,'WIP hero ignored');
assert(src.includes("this.mxPick?.(c); this.recipeNote?.(c);"),'pick hook');
assert(src.includes("drawTab(tabX,'📖 Builds',tab==='builds'")&&src.includes("if(tab==='builds'){this.buildRecipeBook("),'Builds tab');
assert(method('buildRecipeBook').includes("seen?c.name:'???'"),'unseen = ???');
console.log('Recipe Book: path + Unique Mutation cards, picks recorded, full Build Thread once, WIP skipped, ??? for unseen passed');
