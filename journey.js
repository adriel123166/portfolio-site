// Native equivalents of Sibol ScrollWords / GrowthLine / Magnetic and Vengeance's
// gooey heading reveal. No global smooth-scroll engine; anchors remain native.
const hero=document.querySelector('.hero-journey');
const stage=document.querySelector('.portrait-stage');
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const root=document.documentElement;
const enabled=()=>!preference.matches&&!root.classList.contains('motion-paused');
let frame=0,disposeScene;
let chapterIndex=-1;
const headings=[...document.querySelectorAll('.gooey-heading')];
const headingObserver=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('heading-revealed');headingObserver.unobserve(e.target);}},{threshold:.15});
headings.forEach(h=>headingObserver.observe(h));
const statement=document.querySelector('.about-statement');
const words=[...statement.querySelectorAll('span')];
function update(){
 frame=0;
 const max=root.scrollHeight-innerHeight;
 root.style.setProperty('--journey-progress',String(max>0?scrollY/max:0));
 const box=hero.getBoundingClientRect(),distance=box.height-innerHeight;
 const progress=distance>0?Math.max(0,Math.min(1,-box.top/distance)):0;
 hero.style.setProperty('--hero-scroll',String(enabled()?progress:0));
 stage.dataset.scroll=String(enabled()?progress:0);stage.dispatchEvent(new Event('portrait-scroll'));
 const chapter=document.querySelector('.hero-chapter');
 const index=Math.min(2,Math.floor(progress*3));
 const labels=['Cloud applications','Authentication security','Connected systems'];
 if(index!==chapterIndex){chapter.innerHTML=`<strong>0${index+1}</strong> / ${labels[index]}`;chapterIndex=index;}
 if(enabled()){
  const r=statement.getBoundingClientRect();
  const p=Math.max(0,Math.min(1,(innerHeight*.86-r.top)/(r.height+innerHeight*.22)));
  words.forEach((w,i)=>w.style.opacity=String(.4+.6*Math.max(0,Math.min(1,p*words.length-i))));
 }else words.forEach(w=>w.style.opacity='1');
}
function schedule(){if(!frame)frame=requestAnimationFrame(update);}
window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
preference.addEventListener('change',schedule);
const motionObserver=new MutationObserver(schedule);motionObserver.observe(root,{attributes:true,attributeFilter:['class']});
for(const cta of document.querySelectorAll('.magnetic-cta')){
 cta.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||!enabled())return;const b=cta.getBoundingClientRect();cta.style.transform=`translate(${(e.clientX-b.left-b.width/2)*.07}px,${(e.clientY-b.top-b.height/2)*.09}px)`;},{passive:true});
 cta.addEventListener('pointerleave',()=>cta.style.transform='');cta.addEventListener('blur',()=>cta.style.transform='');
}
// Only request the renderer when the portrait approaches the viewport.
const loader=new IntersectionObserver(async entries=>{
 if(!entries.some(e=>e.isIntersecting))return;loader.disconnect();
 try{const {mountPortrait}=await import('./portrait-scene.js');disposeScene=await mountPortrait(stage);}
 catch{stage.querySelector('.portrait-status').textContent='Portrait preview · 3D could not load';}
},{rootMargin:'200px'});loader.observe(stage);
// Keep heading content visible when navigating directly with keyboard or anchors.
document.addEventListener('focusin',e=>e.target.closest('section')?.querySelectorAll('.gooey-heading').forEach(h=>h.classList.add('heading-revealed')));
window.addEventListener('pagehide',e=>{if(e.persisted)return;disposeScene?.();loader.disconnect();headingObserver.disconnect();motionObserver.disconnect();cancelAnimationFrame(frame);},{once:true});
update();
