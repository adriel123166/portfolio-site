// Original Canvas2D signal field: a lightweight adaptation of the interactive
// particle/scroll vocabulary in Vengeance UI and Sibol House. No WebGL dependency.
export function mountSignalField(stage) {
  const canvas=stage.querySelector('canvas'),ctx=canvas.getContext('2d');
  if(!ctx)return()=>{};
  const root=document.documentElement,pref=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  const controller=new AbortController(),signal=controller.signal;
  let width=0,height=0,frame=0,last=0,time=0,visible=true,disposed=false,mode=0,pulse=0;
  let pointer={x:-1000,y:-1000},yaw=0,pitch=0,previousMode=0,blend=1;
  const colors=[[94,234,212],[167,156,255],[124,184,255]];
  const captions=['AWS applications and serverless workflows.','Authentication, access control and security labs.','Hands-on connectivity and network fundamentals.'];
  // Original extruded geometry inspired by the supplied cloud, shield and network icons.
  // All contours share a real XYZ projection; no bitmap icons or model downloads.
  function geometry(){return {nodes:[],edges:[],faces:[]};}
  function point(model,x,y,z){model.nodes.push({x,y,z});return model.nodes.length-1;}
  function line(model,coords,z=0,strong=true,closed=false){
    const ids=coords.map(([x,y])=>point(model,x,y,z));
    for(let i=1;i<ids.length;i++)model.edges.push({a:ids[i-1],b:ids[i],strong});
    if(closed)model.edges.push({a:ids.at(-1),b:ids[0],strong});return ids;
  }
  function circle(model,x,y,r,z=0){return line(model,Array.from({length:28},(_,i)=>[x+Math.cos(i/28*Math.PI*2)*r,y+Math.sin(i/28*Math.PI*2)*r]),z,true,true);}
  function extrude(model,coords,depth=.24,fill=true){
    const back=line(model,coords,-depth,false,true),front=line(model,coords,depth,true,true);
    for(let i=0;i<front.length;i+=Math.max(1,Math.floor(front.length/16)))model.edges.push({a:back[i],b:front[i],strong:false});
    if(fill)model.faces.push(front);
  }
  function curve(start,segments){
    const coords=[start];let p=start;
    for(const [a,b,end]of segments){for(let i=1;i<=12;i++){const t=i/12,s=1-t;coords.push([s*s*s*p[0]+3*s*s*t*a[0]+3*s*t*t*b[0]+t*t*t*end[0],s*s*s*p[1]+3*s*s*t*a[1]+3*s*t*t*b[1]+t*t*t*end[1]]);}p=end;}return coords;
  }
  const cloud=geometry();
  extrude(cloud,curve([-.7,.22],[
    [[-1.25,.22],[-1.29,-.48],[-.82,-.56]],
    [[-.73,-1.15],[.04,-1.25],[.39,-.75]],
    [[.96,-.99],[1.34,-.49],[1.09,-.08]],
    [[1.01,.15],[.83,.22],[.64,.22]],
    [[.2,.22],[-.3,.22],[-.7,.22]]
  ]));
  for(const coords of [[[-.68,.23],[-.68,.58],[-1.1,.58]], [[-.24,.23],[-.24,1.05],[-.9,1.05]], [[.24,.23],[.24,1.07]], [[.68,.23],[.68,.69],[1.11,.69]]]){
    line(cloud,coords,.15);const [x,y]=coords.at(-1);circle(cloud,x,y,.075,.15);
  }
  const shield=geometry();
  extrude(shield,curve([0,-1.02],[
    [[.24,-.77],[.56,-.74],[.81,-.77]],
    [[.86,.12],[.67,.6],[0,1.03]],
    [[-.67,.6],[-.86,.12],[-.81,-.77]],
    [[-.56,-.74],[-.24,-.77],[0,-1.02]]
  ]),.2);
  extrude(shield,curve([-.31,-.12],[
    [[-.34,-.22],[-.34,-.22],[-.25,-.23]],
    [[-.1,-.23],[.1,-.23],[.25,-.23]],
    [[.34,-.23],[.34,-.15],[.34,-.1]],
    [[.34,.04],[.34,.23],[.34,.34]],
    [[.34,.43],[.25,.43],[.2,.43]],
    [[.05,.43],[-.15,.43],[-.25,.43]],
    [[-.34,.43],[-.34,.36],[-.34,.3]],
    [[-.34,.16],[-.34,.02],[-.31,-.12]]
  ]),.32);
  line(shield,curve([-.22,-.23],[[[-.22,-.77],[.22,-.77],[.22,-.23]]]),.34);
  circle(shield,0,.055,.055,.36);line(shield,[[0,.11],[0,.23]],.36);
  for(const coords of [[[-.45,-.83],[-.45,-1.13],[-.87,-1.13],[-.87,-1.28]],[[.45,-.83],[.45,-1.15]], [[-.82,-.4],[-1.1,-.4],[-1.1,.07]], [[.82,-.4],[1.12,-.4],[1.12,-.81]], [[-.7,.42],[-1.1,.42],[-1.1,.7]], [[.7,.42],[1.1,.42],[1.1,.79]], [[0,1.03],[0,1.3]]]){
    line(shield,coords,0);const [x,y]=coords.at(-1);circle(shield,x,y,.065);
  }
  const network=geometry(),bands=9,columns=24;
  for(let band=1;band<=bands;band++)for(let i=0;i<columns;i++){
    const phi=band/(bands+1)*Math.PI,theta=i/columns*Math.PI*2;
    point(network,Math.sin(phi)*Math.cos(theta)*.86,Math.cos(phi)*.86,Math.sin(phi)*Math.sin(theta)*.86);
  }
  for(let i=0;i<network.nodes.length;i++){
    network.edges.push({a:i,b:i%columns===columns-1?i-columns+1:i+1,strong:false});
    if(i+columns<network.nodes.length)network.edges.push({a:i,b:i+columns,strong:false});
  }
  circle(network,0,0,1.02);
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,x=Math.cos(a),y=Math.sin(a);line(network,[[x*1.02,y*1.02],[x*1.27,y*1.27]]);circle(network,x*1.34,y*1.34,.075);}
  const models=[cloud,shield,network];
  stage.dataset.model='cloud';
  const moving=()=>!pref.matches&&!root.classList.contains('motion-paused');
  function schedule(){if(!frame&&visible&&!document.hidden&&!disposed)frame=requestAnimationFrame(draw);}
  function draw(now){
    frame=0;if(disposed||!visible||document.hidden)return;
    const dt=last?Math.min((now-last)/1000,.05):0;last=now;
    if(moving()){time+=dt;pulse=Math.max(0,pulse-dt*.55);blend=Math.min(1,blend+dt*2.5);}
    // Keep the icon silhouette legible while exposing its extrusion and spherical depth.
    const turn=.24+(moving()?Math.sin(time*.34)*.4+Number(stage.dataset.scroll||0)*.2:0);
    const targetYaw=moving()&&fine.matches?Math.max(-.2,Math.min(.2,(pointer.x/width-.5)*.35)):0;
    const targetPitch=moving()&&fine.matches?Math.max(-.12,Math.min(.12,(pointer.y/height-.5)*.2)):0;
    yaw+=(targetYaw-yaw)*.08;pitch+=(targetPitch-pitch)*.08;
    const radius=Math.min(width,height)*.275,cx=width/2,cy=height*.47;
    const [r,g,b]=colors[mode],color=(a)=>`rgba(${r},${g},${b},${a})`;
    ctx.clearRect(0,0,width,height);
    const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,radius*1.65);
    glow.addColorStop(0,color(.12));glow.addColorStop(.55,color(.035));glow.addColorStop(1,color(0));
    ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    ctx.strokeStyle=color(.12);ctx.lineWidth=1;
    for(const factor of [1.15,1.35]){ctx.beginPath();ctx.ellipse(cx,cy,radius*factor,radius*factor,0,0,Math.PI*2);ctx.stroke();}
    function renderModel(model,opacity,index){
    ctx.globalAlpha=opacity;
    const points=model.nodes.map(n=>{
      const a=turn+yaw,x=n.x*Math.cos(a)+n.z*Math.sin(a),z=n.z*Math.cos(a)-n.x*Math.sin(a);
      const y=n.y*Math.cos(pitch)-z*Math.sin(pitch),depth=z*Math.cos(pitch)+n.y*Math.sin(pitch);
      const scale=3.8/(3.8-depth);
      let px=cx+x*radius*scale,py=cy+y*radius*scale;
      if(moving()&&fine.matches){const dx=px-pointer.x,dy=py-pointer.y,d=Math.hypot(dx,dy);if(d<90&&d>0){px+=dx/d*(90-d)*.13;py+=dy/d*(90-d)*.13;}}
      return {x:px,y:py,z:depth,alpha:.3+(depth+1.4)*.2};
    });
    for(const face of model.faces){ctx.beginPath();face.forEach((id,i)=>{const p=points[id];if(i)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y);});ctx.closePath();ctx.fillStyle=color(.055);ctx.fill();}
    model.edges.forEach((edge,i)=>{
        const p=points[edge.a],q=points[edge.b];
        ctx.lineWidth=edge.strong?1.8:1;ctx.strokeStyle=color(Math.min(p.alpha,q.alpha)*(edge.strong?.95:.3));ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
        if(moving()&&i%13===0){const t=(time*.38+i*.13)%1;ctx.fillStyle=color(.95);ctx.beginPath();ctx.arc(p.x+(q.x-p.x)*t,p.y+(q.y-p.y)*t,edge.strong?2.2:1.6,0,Math.PI*2);ctx.fill();}
    });
    if(index===2){
      [...points.slice(0,bands*columns)].sort((a,b)=>a.z-b.z).forEach(p=>{ctx.fillStyle=color(p.alpha*.8);ctx.beginPath();ctx.arc(p.x,p.y,p.z>.5?1.8:1.1,0,Math.PI*2);ctx.fill();});
      }
    ctx.globalAlpha=1;
    }
    const eased=blend*blend*(3-2*blend);
    if(blend<1)renderModel(models[previousMode],1-eased,previousMode);
    renderModel(models[mode],eased,mode);
    if(pulse>0&&moving()){ctx.strokeStyle=color(pulse*.6);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,radius*(1-pulse)*2.3,0,Math.PI*2);ctx.stroke();}
    stage.dataset.rendered='true';
    if(moving())schedule();
  }
  function resize(){const box=canvas.getBoundingClientRect();width=box.width;height=box.height;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);schedule();}
  canvas.addEventListener('pointermove',e=>{const box=canvas.getBoundingClientRect();pointer={x:e.clientX-box.left,y:e.clientY-box.top};},{passive:true,signal});
  canvas.addEventListener('pointerleave',()=>{pointer={x:width/2,y:height/2};},{signal});
  canvas.addEventListener('pointerdown',()=>{if(moving()){pulse=1;schedule();}},{passive:true,signal});
  for(const button of stage.querySelectorAll('[data-focus-mode]'))button.addEventListener('click',()=>{
    const next=Number(button.dataset.focusMode);
    if(next!==mode){previousMode=mode;mode=next;blend=moving()?0:1;}
    stage.dataset.model=['cloud','security','networking'][mode];
    stage.style.setProperty('--signal-accent',`rgb(${colors[mode].join(',')})`);
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
