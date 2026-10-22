// Native equivalents of Sibol ScrollWords / GrowthLine / Magnetic and Vengeance's
// gooey heading reveal. No global smooth-scroll engine; anchors remain native.
const hero=document.querySelector('.hero-journey');
import { mountSignalField } from './signal-field.js';
const stage=document.querySelector('.signal-stage');
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const root=document.documentElement;
const enabled=()=>!preference.matches&&!root.classList.contains('motion-paused');
let frame=0;
const disposeScene=mountSignalField(stage);
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
 const progress=Math.max(0,Math.min(1,-box.top/Math.max(innerHeight,box.height)));
 hero.style.setProperty('--hero-scroll',String(enabled()?progress:0));
 stage.dataset.scroll=String(enabled()?progress:0);stage.dispatchEvent(new Event('signal-scroll'));
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
// Local project spotlight follows fine-pointer movement without moving content.
for(const card of document.querySelectorAll('.project-feature')){
 card.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||!enabled())return;const box=card.getBoundingClientRect();card.style.setProperty('--card-x',`${e.clientX-box.left}px`);card.style.setProperty('--card-y',`${e.clientY-box.top}px`);},{passive:true});
}
// Keep heading content visible when navigating directly with keyboard or anchors.
document.addEventListener('focusin',e=>e.target.closest('section')?.querySelectorAll('.gooey-heading').forEach(h=>h.classList.add('heading-revealed')));
window.addEventListener('pagehide',e=>{if(e.persisted)return;disposeScene?.();headingObserver.disconnect();motionObserver.disconnect();cancelAnimationFrame(frame);},{once:true});
update();
