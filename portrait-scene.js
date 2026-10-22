// Lightweight native adaptation of the Vengeance UI model-viewer interaction.
// Reference: https://www.vengenceui.com/components/model-viewer
// Three.js is vendored locally under its MIT license; no external model service.
import * as T from './vendor/three/three.module.js';
import { GLTFLoader } from './vendor/three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from './vendor/three/addons/environments/RoomEnvironment.js';

export async function mountPortrait(stage) {
  const viewer=stage.querySelector('.portrait-viewer'),canvas=stage.querySelector('canvas');
  const status=stage.querySelector('.portrait-status'),controls=stage.querySelector('.portrait-controls');
  const pref=matchMedia('(prefers-reduced-motion: reduce)');
  let renderer;
  try { renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'}); }
  catch { status.textContent='Portrait preview · 3D is unavailable in this browser';return()=>{}; }
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(32,1,.1,40);
  camera.position.set(0,2.65,9.5);camera.lookAt(0,2.23,0);
  let gltf;
  try { gltf=await new GLTFLoader().loadAsync('assets/avatar/felix-meshy-sunglasses.glb',event=>{if(event.total)status.textContent=`Loading portrait · ${Math.round(event.loaded/event.total*100)}%`;}); }
  catch(error){renderer.dispose();status.textContent='Portrait preview · 3D model could not load';return()=>{};}
  const avatar=new T.Group(),model=gltf.scene;avatar.add(model);scene.add(avatar);
  const bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
  const scale=4.35/size.y;model.scale.multiplyScalar(scale);model.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);
  model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;for(const m of Array.isArray(o.material)?o.material:[o.material]){m.envMapIntensity=m.name==='Opaque dark sunglass lenses'?.06:.65;m.side=m.name==='Opaque dark sunglass lenses'?T.DoubleSide:T.FrontSide;}}});
  const room=new RoomEnvironment(),pmrem=new T.PMREMGenerator(renderer),environment=pmrem.fromScene(room,.04);
  scene.environment=environment.texture;room.dispose();pmrem.dispose();
  stage.modelInfo={bounds:size.toArray(),scale,center:center.toArray()};
  const world=new T.Group();scene.add(world);
  const hemi=new T.HemisphereLight(0xd9eeff,0x303547,1.1);scene.add(hemi);
  const key=new T.DirectionalLight(0xffeee0,2.4);key.position.set(-3,6,5);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=6;key.shadow.camera.bottom=-2;key.shadow.bias=-.0005;key.shadow.normalBias=.02;scene.add(key);
  const rim=new T.DirectionalLight(0x87d3ce,1.1);rim.position.set(3,4,-3);scene.add(rim);
  const blue=new T.DirectionalLight(0x9fb7ed,.5);blue.position.set(-4,2,-2);scene.add(blue);
  const plinth=new T.Mesh(new T.CylinderGeometry(1.16,1.22,.12,80),new T.MeshStandardMaterial({color:0x122a38,metalness:.25,roughness:.65}));plinth.position.y=-.035;plinth.receiveShadow=true;world.add(plinth);
  const ring=new T.Mesh(new T.TorusGeometry(1.2,.012,8,96),new T.MeshBasicMaterial({color:0x5eead4}));ring.rotation.x=Math.PI/2;ring.position.y=.035;world.add(ring);
  const shadow=new T.Mesh(new T.CircleGeometry(2,64),new T.ShadowMaterial({opacity:.25}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.028;shadow.receiveShadow=true;world.add(shadow);
  let angle=-.16,target=-.16,tilt=0,targetTilt=0,zoom=1,frame=0,visible=true,disposed=false,drag=null,auto=false,lastTime=0;
  const controller=new AbortController(),signal=controller.signal;
  function motionEnabled(){return !pref.matches&&!document.documentElement.classList.contains('motion-paused');}
  function updateStatus(){viewer.dataset.angle=String(Math.round(angle*180/Math.PI));}
  function render(time=0){
    frame=0;if(disposed||!visible||document.hidden)return;
    const delta=lastTime?Math.min((time-lastTime)/1000,.05):0;lastTime=time;
    if(auto&&motionEnabled())target+=delta*.24;
    const ease=motionEnabled()?1-Math.exp(-12*Math.max(delta,1/60)):1;
    angle+=(target-angle)*ease;tilt+=(targetTilt-tilt)*ease;
    const scroll=Number(stage.dataset.scroll||0);
    avatar.rotation.y=angle+(motionEnabled()?scroll*.38:0);avatar.rotation.x=tilt;
    avatar.position.y=motionEnabled()?Math.sin(scroll*Math.PI)*.045:0;
    ring.material.color.set(motionEnabled()&&scroll>.45?0x91a5ff:0x5eead4);
    camera.zoom=zoom;camera.updateProjectionMatrix();renderer.render(scene,camera);updateStatus();
    if((auto&&motionEnabled())||Math.abs(target-angle)>.001||Math.abs(targetTilt-tilt)>.001)invalidate();
  }
  function invalidate(){if(!frame&&!disposed&&visible&&!document.hidden)frame=requestAnimationFrame(render);}
  function resize(){const {width,height}=viewer.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();invalidate();}
  function reset(){target=-.16;targetTilt=0;zoom=1;invalidate();}
  function rotate(step){target+=step;invalidate();}
  // Horizontal touch drags rotate; vertical gestures remain native page scrolling.
  viewer.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,angle:target,tilt:targetTilt,locked:false};viewer.setPointerCapture(e.pointerId);},{signal});
  viewer.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(e.pointerType==='touch'&&!drag.locked){if(Math.abs(dy)>Math.abs(dx)+6){drag=null;return;}if(Math.abs(dx)>8)drag.locked=true;else return;}
    target=drag.angle+dx*.009;
    if(e.pointerType!=='touch')targetTilt=T.MathUtils.clamp(drag.tilt+dy*.003,-.16,.16);
    viewer.classList.add('is-dragging');invalidate();
  },{signal});
  function endDrag(){drag=null;viewer.classList.remove('is-dragging');}
  viewer.addEventListener('pointerup',endDrag,{signal});viewer.addEventListener('pointercancel',endDrag,{signal});viewer.addEventListener('lostpointercapture',endDrag,{signal});
  viewer.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft')rotate(-Math.PI/12);
    else if(e.key==='ArrowRight')rotate(Math.PI/12);
    else if(e.key==='Home')reset();
    else if(e.key==='+'||e.key==='='){zoom=Math.min(1.18,zoom+.06);invalidate();}
    else if(e.key==='-'){zoom=Math.max(.84,zoom-.06);invalidate();}
    else return;e.preventDefault();
  },{signal});
  for(const button of controls.querySelectorAll('button'))button.addEventListener('click',()=>{
    const action=button.dataset.action;
    if(action==='left')rotate(-Math.PI/8);if(action==='right')rotate(Math.PI/8);if(action==='reset')reset();
    if(action==='auto'){auto=!auto;button.setAttribute('aria-pressed',String(auto));button.textContent=auto?'Stop rotation':'Auto rotate';invalidate();}
  },{signal});
  function syncMotion(){if(!motionEnabled()){auto=false;const b=controls.querySelector('[data-action="auto"]');b.setAttribute('aria-pressed','false');b.textContent='Auto rotate';}invalidate();}
  pref.addEventListener('change',syncMotion,{signal});
  const mutation=new MutationObserver(syncMotion);mutation.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(viewer);
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;stage.dataset.sceneVisible=String(visible);if(!visible){cancelAnimationFrame(frame);frame=0;lastTime=0;}else invalidate();},{threshold:0});intersection.observe(stage);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;lastTime=0;}else invalidate();},{signal});
  stage.addEventListener('portrait-scroll',invalidate,{signal});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);frame=0;stage.classList.remove('scene-loaded');controls.hidden=true;viewer.tabIndex=-1;status.textContent='Portrait preview · 3D context interrupted';},{signal});
  canvas.addEventListener('webglcontextrestored',()=>{stage.classList.add('scene-loaded');controls.hidden=false;viewer.tabIndex=0;status.textContent='Drag or use ← → to rotate';resize();},{signal});
  resize();renderer.render(scene,camera);stage.classList.add('scene-loaded');controls.hidden=false;viewer.tabIndex=0;status.textContent='Drag or use ← → to rotate';
  // Used to create the matching static fallback, never as a runtime network request.
  stage.capturePortrait=(options={})=>{
    const captureCamera=options.closeup?camera.clone():camera;
    if(options.closeup){captureCamera.position.set(.15,4.05,2.3);captureCamera.lookAt(.15,4.05,0);captureCamera.updateProjectionMatrix();}
    renderer.render(scene,captureCamera);const result=canvas.toDataURL('image/png');renderer.render(scene,camera);return result;
  };
  return function dispose(){disposed=true;cancelAnimationFrame(frame);controller.abort();intersection.disconnect();resizeObserver.disconnect();mutation.disconnect();const textures=new Set();scene.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const value of Object.values(m))if(value?.isTexture)textures.add(value);m.dispose();}});for(const texture of textures){texture.source?.data?.close?.();texture.dispose();}environment.dispose();renderer.dispose();delete stage.capturePortrait;};
}
