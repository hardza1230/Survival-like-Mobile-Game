// v8.2.63 owner: Phantom Rush too strong and too frequent → spends all Dash charges (+1 leap each, needs ≥1) · free shadow Dashes don't refund · refunds capped at 40% of the cooldown.
const fs=require('fs'),vm=require('vm'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const i=src.indexOf('\n  phRefund(');const j=src.indexOf('\n  uqOnKill(',i);const ctx={Math};vm.createContext(ctx);vm.runInContext('class K{'+src.slice(i,j)+'};this.K=K;',ctx);
const s=new ctx.K();s.basicAttack={path:'dashboxer'};s.uniqueCd=20;s._phCap=8;s._phRef=0;for(let k=0;k<20;k++)s.phRefund(1.75);assert.strictEqual(s.uniqueCd,12,'refunds stop at 40%');
s.basicAttack={path:'titan'};s.uniqueCd=10;s.phRefund(3);assert.strictEqual(s.uniqueCd,7,'other paths uncapped');
for(const h of["this._dashFree=temp;","&&!this._dashFree)this.phRefund(","this._phSpent=this._dpCh; this._dpCh=0;","const dn=Math.min(5,this._phSpent||0)","this._phCap=this.uniqueCooldown(this.uniqueInfo())*.4;","'Need a Dash'","if(this.uqMut()==='phantom_refund'&&T<(this._uqWinT||0))this.phRefund(.5);"])assert(src.includes(h),h);
console.log('Phantom Rush 8.2.63: spends Dash charges, free Dashes no refund, 40% refund cap passed');
