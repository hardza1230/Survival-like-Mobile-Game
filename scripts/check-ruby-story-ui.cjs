const fs=require('node:fs'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path'),{chromium}=require('playwright');
(async()=>{
 const server=http.createServer((q,r)=>{try{const file=path.join(process.cwd(),'www',new URL(q.url,'http://local').pathname);r.end(fs.readFileSync(file));}catch{r.statusCode=404;r.end();}});
 await new Promise(r=>server.listen(8096,'127.0.0.1',r));let browser;const failures=[];
 try{browser=await chromium.launch({channel:process.env.RUBY_STORY_BROWSER_CHANNEL||process.env.FORGE_BROWSER_CHANNEL||(process.platform==='win32'?'chrome':undefined),headless:true});
 for(const[w,h]of[[320,568],[360,640],[360,780],[390,844],[412,915],[844,390]]){
  const page=await browser.newPage({viewport:{width:w,height:h}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:8096/ruby-story-review.html?w=${w}&h=${h}`);await page.waitForFunction(()=>document.querySelector('#status').textContent==='Ready');
  const checks=await page.evaluate(()=>{
   const s=window.__rubyReviewScene,out=[],check=(ok,message,data)=>{if(!ok)out.push({message,data});},bounds=o=>{const b=o.getBounds();return{x:b.x,y:b.y,w:b.width,h:b.height,right:b.right,bottom:b.bottom};},overlap=(a,b)=>a.x<b.right-.5&&a.right>b.x+.5&&a.y<b.bottom-.5&&a.bottom>b.y+.5;
   const tap=(tag,ready=true)=>{if(ready)window.__reviewNow+=650;const z=s.tapZones.find(z=>z.tag===tag);check(!!z,'missing control',tag);z?.fn();return z;};
   const visibleBounds=o=>{const b=s.hubIconBox(o.texture.key),m=o.getWorldTransformMatrix(),x=(b.x-o.originX)*o.width,y=(b.y-o.originY)*o.height,a=m.transformPoint(x,y),z=m.transformPoint(x+b.w*o.width,y+b.h*o.height);return{x:a.x,y:a.y,w:z.x-a.x,h:z.y-a.y,right:z.x,bottom:z.y};};
   const inspect=label=>{
    const root=s._rubyTalk,l=root._rubyLayout,b={...l.body,right:l.body.x+l.body.w,bottom:l.body.y+l.body.h},t=bounds(l.text),p=l.portrait?visibleBounds(l.portrait):null;
    check(t.x>=b.x&&t.right<=b.right+.5&&t.y>=b.y&&t.bottom<=b.bottom+.5,'dialogue text outside box',{label,b,t});if(p)check(!overlap(t,p),'portrait overlaps text',{label,t,p});
    const page=root.list[1],texts=page.list.filter(o=>o.type==='Text');for(const x of texts){const bb=bounds(x);check(bb.x>=-.5&&bb.right<=s.W+.5&&bb.y>=-.5&&bb.bottom<=s.H+.5,'text outside canvas',{label,text:x.text,b:bb});}
    for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++)check(!overlap(bounds(texts[i]),bounds(texts[j])),'text overlaps text',{label,a:texts[i].text,b:texts[j].text});
    const im=page.list.find(o=>o.type==='Image'&&o.texture.key===l.art);if(im){const a=bounds(im);check(Math.abs(a.w/a.h-im.width/im.height)<.001,'illustration aspect changed',{label,a});check(!overlap(a,b),'illustration overlaps dialogue',{label,a,b});check(a.x>=-.5&&a.right<=s.W+.5&&a.y>=0&&a.bottom<=s.H+.5,'illustration outside canvas',{label,a});for(const txt of texts)check(!overlap(a,bounds(txt)),'illustration overlaps text',{label,text:txt.text,a});}
    for(const z of s.tapZones){check(z.w>=44&&z.h>=44,'tap target too small',{label,z:{tag:z.tag,w:z.w,h:z.h}});check(z.x>=0&&z.y>=0&&z.x+z.w<=s.W+.5&&z.y+z.h<=s.H+.5,'tap target outside canvas',{label,tag:z.tag});}
    const foundation=root.list[0];check(foundation.fillAlpha===1&&foundation.width===s.W&&foundation.height===s.H,'narration lacks opaque full canvas foundation',label);
   };
   for(const[kind,index]of[...Array.from({length:5},(_,i)=>['story',i]),['memory',0],['memory',1],['generic',0]]){
    const label=kind+index;s.reviewOpen(kind,index);inspect(label+' page0');tap('ruby_next',false);check(s._rubyTalk._rubyLayout.page===0,'next guard failed',label);tap('ruby_next');inspect(label+' page1');
    tap('ruby_previous',false);check(s._rubyTalk._rubyLayout.page===1,'back guard failed',label);tap('ruby_previous');check(s._rubyTalk._rubyLayout.page===0,'back routing failed',label);tap('ruby_skip',false);check(s.completed===0,'skip guard failed',label);tap('ruby_next');const stale=tap('ruby_next');check(s.completed===1&&!s._rubyTalk,'continue completion/cleanup failed',label);stale?.fn();check(s.completed===1,'completion called more than once',label);check(!s.tapZones.some(z=>z._rubyPage),'page zones survived close',label);
    s.reviewOpen(kind,index);const skip=tap('ruby_skip');skip?.fn();check(s.completed===1&&!s._rubyTalk,'skip once/cleanup failed',label);
   }
   const savedReal=s.realTex;s.realTex=function(k){return k==='ruby_story_paper'?false:savedReal.call(this,k);};s.reviewOpen('story',0);inspect('black fallback');check(!s._rubyTalk._rubyLayout.paper,'paper fallback not selected');tap('ruby_skip');
   s.realTex=function(k){return k==='ruby_story_pantry'?false:savedReal.call(this,k);};s.reviewOpen('story',0);inspect('missing illustration');check(s._rubyTalk.list[1].list.some(x=>x.type==='Text'&&x.text==='Opening the illustration…'),'missing illustration lacks graceful placeholder');tap('ruby_skip');s.realTex=savedReal;s.reviewOpen('story',0);return out;
  });
  failures.push(...checks.map(x=>({viewport:`${w}x${h}`,...x})));await page.waitForTimeout(80);
  const pixel=await page.evaluate(()=>Array.from(document.querySelector('canvas').getContext('2d').getImageData(1,1,1,1).data));assert.notDeepEqual(pixel.slice(0,3),[255,0,255],'underlying Lobby visible through narration');
  if(process.env.RUBY_STORY_SHOT_DIR){fs.mkdirSync(process.env.RUBY_STORY_SHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.RUBY_STORY_SHOT_DIR,`${w}x${h}.png`)});}
  failures.push(...errors.map(message=>({viewport:`${w}x${h}`,message})));console.log(`Ruby ${w}x${h}: ${checks.length} issues; stories, memories, generic, guards, navigation and fallbacks checked`);await page.close();
 }
 if(failures.length){console.error(JSON.stringify(failures,null,2));throw new Error(`${failures.length} Ruby UI assertions failed`);}
 console.log('Ruby narration: all six Canvas sizes, illustrations, text/touch bounds, opaque fallbacks and exactly-once completion passed');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
