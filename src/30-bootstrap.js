
// Phaser 3 None GameConfig.resolution สำหรับ canvas หลัก: สร้าง backing store เป็น physical pixels เอง
const DEVICE_DPR = window.devicePixelRatio||1;
const LOW_MEMORY_DEVICE = Number(navigator.deviceMemory||8)<=4||_lowMemFlag;   // v7.4 + โหมดหน่วยความจำต่ำหลังกราฟิกดับ
// v5.50: คุณภาพกราฟิก (0 Auto · 1 Low · 2 High) — ความละเอียด render มีผลตอนเปิดเกมใหม่
const QUALITY_SETTING=(()=>{try{const d=JSON.parse(localStorage.getItem('mochi_save')||'{}');if(!d||!d.settingsAuto74)return 0;const q=d.settings&&d.settings.quality;return q===0||q===1||q===2?q:0;}catch(e){return 0;}})();
const RENDER_BASE_DPR = Math.max(1, Math.min(DEVICE_DPR, _lowMemFlag?1.5:9, QUALITY_SETTING===1?1.25:QUALITY_SETTING===2?(LOW_MEMORY_DEVICE?2.25:3):1.5));   // v7.8.92 Auto = 1.5 (เดิม 2 · GPU ทำงานลด ~44%)
// v7.0 เล่นบนคอม (ไม่มีจอสัมผัส): บีบเป็นจอแนวตั้งแบบมือถือ 9:16 ตรงกลางจอ แทนการยืดเต็มจอกว้าง
const DESKTOP_FIT=(()=>{ try{ return !window.Capacitor?.isNativePlatform?.()&&!('ontouchstart' in window)&&!(navigator.maxTouchPoints>0); }catch(e){ return false; } })();
/* v8.2.1: Google's store crawler opens the web build at 1024×10000 → WebGL framebuffer 'Incomplete Attachment' crash. Cap the backing canvas at 4096 px a side (real phones/tablets are far below this) */
const MAX_CANVAS_PX=4096;
function capView(v){ const k=RENDER_BASE_DPR; if(v.h*k>MAX_CANVAS_PX)v.h=Math.floor(MAX_CANVAS_PX/k); if(v.w*k>MAX_CANVAS_PX)v.w=Math.floor(MAX_CANVAS_PX/k); return v; }
function viewSize(){
  const width=Math.max(1,window.innerWidth),height=Math.max(2,window.innerHeight);
  // Wide windows always host a portrait game, including touch and native viewports.
  const fit=width>=height||(DESKTOP_FIT&&width>height*.62);
  const view=capView({w:fit?Math.max(1,Math.round(height*9/16)):width,h:height,fit});
  view.w=Math.min(view.w,view.h-1);
  return view;
}
/* v8.1.164 เจ้าของ (Honor Pad 9): UI เล็กไปบนแท็บเล็ต → ขยาย layout ทั้งเกมตามด้านสั้นของจอ (มือถือ ≤430 = ×1 · 600 = ×1.22 · 800 = ×1.45 สูงสุด) · canvas/GPU เท่าเดิม แค่พิกัด layout เล็กลงแล้วกล้อง zoom ขึ้น · โลกในเกมขนาดเท่าเดิม */
function uiScaleFor(w,h,fit){ if(fit||DESKTOP_FIT)return 1; const s=Math.min(w,h); return Math.max(1,Math.min(1.45,Math.pow(s/430,.6))); }
function applyCanvasFit(){
  const view=viewSize(),root=document.documentElement;
  root.classList.toggle('portrait-fit',view.fit);
  return view;
}
const _vs0=applyCanvasFit();
const UI_SCALE=uiScaleFor(_vs0.w,_vs0.h,_vs0.fit);
const RENDER_DPR=RENDER_BASE_DPR*UI_SCALE;   // layout px → backing px (รวมตัวขยาย UI)
const RENDER_W = Math.max(1,Math.round(_vs0.w*RENDER_BASE_DPR));
const RENDER_H = Math.max(1,Math.round(_vs0.h*RENDER_BASE_DPR));
// Phaser Text มี CanvasTexture แยกและค่าเริ่มต้น resolution 1 จึงต้องเพิ่มตาม DPR เช่นกัน
const _textFactory=Phaser.GameObjects.GameObjectFactory.prototype.text;
Phaser.GameObjects.GameObjectFactory.prototype.text=function(x,y,value,style){
  return _textFactory.call(this,x,y,value,style).setResolution(RENDER_DPR);
};
// v8.0.1 เจ้าของ: แท็บล่างต้องอยู่ทุกหน้า → builder ระดับหน้าทุกตัวผ่าน navWrapBuild (เรียกซ้อนใน buildMenuScreen = ทำงานตามเดิม)
const NAV_WRAP=['buildAchievements','buildBazaar','buildBestiary','buildChapterSelect','buildCraftBench','buildMerge','buildDaily','buildDig','buildGear','buildGearInbox','buildHub','buildHubGroup','buildKitchen','buildNews','buildPlayStats','buildRankPerks','buildSettings','buildSkillArchive','buildStageSelect','buildTradeIn','buildUpgrade','buildChars','buildTalents','buildStats','buildLobby','buildWardrobe','buildPatrol','buildRanking','buildGm','buildHeroes','buildStoryBook'];   // v8.1.71 หน้าใหม่ (Wardrobe/Patrol/Ranks/GM) ลืมใส่ → กดปุ่มในหน้าแล้วแท็บล่างหาย
for(const n of NAV_WRAP){ const f=Game.prototype[n]; if(typeof f==='function')Game.prototype[n]=function(...a){ return this.navWrapBuild(f,a); }; }
window.__g = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#3a3355',
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.NO_CENTER,
    width: RENDER_W,
    height: RENDER_H,
  },
  physics: { default:'arcade', arcade:{ gravity:{y:0}, debug:false } },
  render: { antialias:true, antialiasGL:true, roundPixels:false, powerPreference:'high-performance' },
  loader: { timeout: 120000 },   // v6.49.6: ไฟล์ที่ค้าง (เน็ตหลุด) error แทนค้างตลอด → loader ยิง 'complete' ได้
  scene: [Boot, Opening, Game],
});
// v6.91 กราฟิก (WebGL) ดับเพราะหน่วยความจำเต็ม → จอขาวแต่เสียงยังเล่น: เซฟแล้วรีโหลดเอง
(function(){ const hook=()=>{ const cv=window.__g&&window.__g.canvas; if(!cv){setTimeout(hook,500);return;}
  cv.addEventListener('webglcontextlost',e=>{ try{e.preventDefault();}catch(_){} try{Save.save();}catch(_){} try{localStorage.setItem('mochi_ctx_lost',String(Date.now())); localStorage.setItem('mochi_lowmem','1'); localStorage.setItem('mochi_lowmem_note','1');}catch(_){}
    try{ const d=document.createElement('div'); d.style.cssText='position:fixed;inset:0;z-index:99999;background:#1b1424;color:#ffe08a;display:flex;align-items:center;justify-content:center;font:bold 16px sans-serif;text-align:center;padding:24px'; d.textContent='Graphics memory ran out — reloading in low-memory mode…'; document.body.appendChild(d); }catch(_){}
    setTimeout(()=>location.reload(),1200); },false); };
  hook(); })();
// ปรับขนาดตอนหมุนจอ/เปลี่ยนขนาด — debounce กันค่าเพี้ยนช่วงหมุน + อ่านค่าจริงหลังหมุนเสร็จ
let _rzT=null;
function _applyResize(){ const g=window.__g; if(!g||!g.scale)return;
  const v=applyCanvasFit(), w=v.w, h=v.h;
  g.scale.resize(Math.round(w*RENDER_BASE_DPR),Math.round(h*RENDER_BASE_DPR)); g.scale.refresh(); }
function _scheduleResize(){ clearTimeout(_rzT); _rzT=setTimeout(_applyResize,160); _applyResize(); }
window.addEventListener('resize', _scheduleResize);
window.addEventListener('orientationchange', ()=>{ setTimeout(_applyResize,60); setTimeout(_applyResize,300); setTimeout(_applyResize,600); });
if(window.visualViewport)window.visualViewport.addEventListener('resize',_scheduleResize);
// v7.9.47 ปุ่มย้อนกลับของมือถือ: APK (Capacitor App plugin) ใช้ backButton · เบราว์เซอร์ใช้ history.pushState + popstate
(function(){ const scn=()=>{ try{ return window.__g&&window.__g.scene.getScene('Game'); }catch(e){ return null; } };
  const exitApp=()=>{ try{ const A=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.App; if(A&&A.exitApp){A.exitApp();return true;} }catch(e){} return false; };
  try{ const A=window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform()&&window.Capacitor.Plugins&&window.Capacitor.Plugins.App;
    if(A&&A.addListener){ A.addListener('backButton',()=>{ const s=scn(); let r=true; try{ r=s?s.handleBackKey():true; }catch(e){} if(r==='exit')exitApp(); }); return; } }catch(e){}
  try{ if(!window.history||!history.pushState)return; history.pushState({mm:1},'');
    window.addEventListener('popstate',()=>{ const s=scn(); let r=true; try{ r=s?s.handleBackKey():true; }catch(e){} if(r==='exit'){ if(!exitApp())history.back(); return; } history.pushState({mm:1},''); }); }catch(e){}
})();
