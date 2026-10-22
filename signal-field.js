// Original Canvas2D signal field: a lightweight adaptation of the interactive
// particle/scroll vocabulary in Vengeance UI and Sibol House. No WebGL dependency.
export function mountSignalField(stage) {
  const canvas=stage.querySelector('canvas'),ctx=canvas.getContext('2d');
  if(!ctx)return()=>{};
  const root=document.documentElement,pref=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  const controller=new AbortController(),signal=controller.signal;
  let width=0,height=0,frame=0,last=0,time=0,visible=true,disposed=false,mode=0,pulse=0;
  let pointer={x:-1000,y:-1000},yaw=0,pitch=0;
  const colors=[[94,234,212],[167,156,255],[124,184,255]];
  const captions=['AWS applications and serverless workflows.','Authentication, access control and security labs.','Hands-on connectivity and network fundamentals.'];
  const nodes=[];
  for(let band=1;band<10;band++)for(let i=0;i<18;i++){
    const phi=band/10*Math.PI,theta=i/18*Math.PI*2;
    nodes.push({x:Math.sin(phi)*Math.cos(theta),y:Math.cos(phi),z:Math.sin(phi)*Math.sin(theta),band,i});
  }
  const moving=()=>!pref.matches&&!root.classList.contains('motion-paused');
  function schedule(){if(!frame&&visible&&!document.hidden&&!disposed)frame=requestAnimationFrame(draw);}
  function draw(now){
    frame=0;if(disposed||!visible||document.hidden)return;
    const dt=last?Math.min((now-last)/1000,.05):0;last=now;
    if(moving()){time+=dt;pulse=Math.max(0,pulse-dt*.55);}
    const turn=moving()?time*.12+Number(stage.dataset.scroll||0)*.7:0;
    const targetYaw=moving()&&fine.matches?Math.max(-.2,Math.min(.2,(pointer.x/width-.5)*.35)):0;
    const targetPitch=moving()&&fine.matches?Math.max(-.12,Math.min(.12,(pointer.y/height-.5)*.2)):0;
    yaw+=(targetYaw-yaw)*.08;pitch+=(targetPitch-pitch)*.08;
    const radius=Math.min(width,height)*.31,cx=width/2,cy=height*.47;
    const [r,g,b]=colors[mode],color=(a)=>`rgba(${r},${g},${b},${a})`;
    ctx.clearRect(0,0,width,height);
    const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,radius*1.65);
    glow.addColorStop(0,color(.12));glow.addColorStop(.55,color(.035));glow.addColorStop(1,color(0));
    ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    ctx.strokeStyle=color(.12);ctx.lineWidth=1;
    for(const factor of [1.15,1.35]){ctx.beginPath();ctx.ellipse(cx,cy,radius*factor,radius*factor,0,0,Math.PI*2);ctx.stroke();}
    const points=nodes.map(n=>{
      const a=turn+yaw,x=n.x*Math.cos(a)+n.z*Math.sin(a),z=n.z*Math.cos(a)-n.x*Math.sin(a);
      const y=n.y*Math.cos(pitch)-z*Math.sin(pitch),depth=z*Math.cos(pitch)+n.y*Math.sin(pitch);
      const scale=3.8/(3.8-depth);
      let px=cx+x*radius*scale,py=cy+y*radius*scale;
      if(moving()&&fine.matches){const dx=px-pointer.x,dy=py-pointer.y,d=Math.hypot(dx,dy);if(d<90&&d>0){px+=dx/d*(90-d)*.13;py+=dy/d*(90-d)*.13;}}
      return {x:px,y:py,z:depth,alpha:.17+(depth+1)*.3};
    });
    points.forEach((p,index)=>{
      for(const next of [nodes[index].i===17?index-17:index+1,index+18]){
        if(!points[next])continue;
        const q=points[next];ctx.strokeStyle=color(Math.min(p.alpha,q.alpha)*.32);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
        if(moving()&&(index+mode*5)%19===0){const t=(time*.22+index*.13)%1;ctx.fillStyle=color(.9);ctx.beginPath();ctx.arc(p.x+(q.x-p.x)*t,p.y+(q.y-p.y)*t,2,0,Math.PI*2);ctx.fill();}
      }
    });
    [...points].sort((a,b)=>a.z-b.z).forEach(p=>{ctx.fillStyle=color(p.alpha);ctx.beginPath();ctx.arc(p.x,p.y,p.z>.5?2.2:1.3,0,Math.PI*2);ctx.fill();});
    // A quiet center gives the field a visual anchor.
    ctx.fillStyle='#0c1c29';ctx.strokeStyle=color(.65);ctx.beginPath();ctx.arc(cx,cy,30,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.font='500 16px "Segoe UI",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#e1f3f0';ctx.fillText('FA',cx,cy);
    if(pulse>0&&moving()){ctx.strokeStyle=color(pulse*.6);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,radius*(1-pulse)*2.3,0,Math.PI*2);ctx.stroke();}
    stage.dataset.rendered='true';
    if(moving())schedule();
  }
  function resize(){const box=canvas.getBoundingClientRect();width=box.width;height=box.height;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);schedule();}
  canvas.addEventListener('pointermove',e=>{const box=canvas.getBoundingClientRect();pointer={x:e.clientX-box.left,y:e.clientY-box.top};},{passive:true,signal});
  canvas.addEventListener('pointerleave',()=>{pointer={x:width/2,y:height/2};},{signal});
  canvas.addEventListener('pointerdown',()=>{if(moving()){pulse=1;schedule();}},{passive:true,signal});
  for(const button of stage.querySelectorAll('[data-focus-mode]'))button.addEventListener('click',()=>{
    mode=Number(button.dataset.focusMode);stage.style.setProperty('--signal-accent',`rgb(${colors[mode].join(',')})`);
    for(const b of stage.querySelectorAll('[data-focus-mode]'))b.setAttribute('aria-pressed',String(b===button));
    stage.querySelector('.signal-caption').textContent=captions[mode];pulse=moving()?1:0;schedule();
  },{signal});
  function sync(){cancelAnimationFrame(frame);frame=0;last=0;stage.dataset.motion=moving()?'running':'paused';schedule();}
  const mutation=new MutationObserver(sync);mutation.observe(root,{attributes:true,attributeFilter:['class']});
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;stage.dataset.visible=String(visible);if(!visible){cancelAnimationFrame(frame);frame=0;last=0;}else schedule();});intersection.observe(stage);
  const observer=new ResizeObserver(resize);observer.observe(canvas);
  pref.addEventListener('change',sync,{signal});document.addEventListener('visibilitychange',sync,{signal});
  stage.addEventListener('signal-scroll',()=>{if(!moving())schedule();},{signal});
  resize();sync();
  return()=>{disposed=true;cancelAnimationFrame(frame);controller.abort();observer.disconnect();intersection.disconnect();mutation.disconnect();};
}
