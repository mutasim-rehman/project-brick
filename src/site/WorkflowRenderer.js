import { createSceneRenderer } from './sceneRenderer.js';
import * as THREE from 'three';

function shape(w,h,d,r=.09) {
  r=Math.min(r,w*.45,h*.45);
  const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
  const bevel=Math.min(.012,w/8,h/8,d/3);
  const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSegments:4,bevelSize:bevel,bevelThickness:bevel,steps:1,curveSegments:12});g.translate(0,0,-d/2);return g;
}
export function mountWorkflowModel(host) {
  const holder=host.querySelector('.workflow-model'),pause=host.querySelector('.workflow-motion-toggle');
  const renderer=createSceneRenderer(host,'Workflow');if(!renderer){pause.hidden=true;return;}
  // Supersample even on standard-density displays to keep fine edges crisp.
  renderer.setPixelRatio(Math.min(Math.max(devicePixelRatio,2),3));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
  const scene=new THREE.Scene(),group=new THREE.Group();scene.add(group);
  const navy=new THREE.MeshStandardMaterial({color:0x183544,metalness:.4,roughness:.3}),metal=new THREE.MeshStandardMaterial({color:0x8b9e95,metalness:.75,roughness:.25}),paper=new THREE.MeshStandardMaterial({color:0xedf1df,roughness:.5}),rubber=new THREE.MeshStandardMaterial({color:0x152d37,roughness:.75}),lime=new THREE.MeshStandardMaterial({color:0xbdd781,emissive:0xbdd781,emissiveIntensity:.2,roughness:.4});
  const box=(parent,w,h,d,material,x=0,y=0,z=0)=>{const m=new THREE.Mesh(shape(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
  const disk=(parent,r,d,material,x,y,z)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d,64),material);m.rotation.x=Math.PI/2;m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;};
  const record=new THREE.Group();group.add(record);record.rotation.z=.025;
  box(record,1.77,2.12,.17,metal);box(record,1.72,2.08,.13,navy,0,0,.06);box(record,1.55,1.9,.035,paper,0,0,.145);
  const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1920;const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
  const display=new THREE.Mesh(new THREE.PlaneGeometry(1.49,1.84),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));display.position.z=.18;record.add(display);
  const dot=disk(record,.017,.012,lime,0,.995,.14);
  const device=new THREE.Group();group.add(device);box(device,.65,1.05,.18,metal);box(device,.62,1.02,.17,navy,0,0,.035);box(device,.48,.74,.02,rubber,0,0,.14);
  for(let i=0;i<3;i++){const arc=new THREE.Mesh(new THREE.TorusGeometry(.065+i*.045,.007,8,45,1.65),lime);arc.rotation.z=-.8;arc.position.set(0,.025,.17);device.add(arc);}box(device,.28,.016,.007,metal,0,.35,.17);
  const badge=new THREE.Group();group.add(badge);disk(badge,.38,.1,metal,0,0,0);disk(badge,.35,.11,paper,0,0,.05);
  const head=new THREE.Mesh(new THREE.TorusGeometry(.076,.011,8,48),navy);head.position.set(0,.085,.12);badge.add(head);
  const shoulders=new THREE.Mesh(new THREE.TorusGeometry(.16,.013,8,50,Math.PI),navy);shoulders.position.set(0,-.15,.12);badge.add(shoulders);
  const seal=new THREE.Group();group.add(seal);disk(seal,.22,.055,lime,0,0,0);const check=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.09,0,.035),new THREE.Vector3(-.025,-.065,.035),new THREE.Vector3(.105,.085,.035)]);seal.add(new THREE.Line(check,new THREE.LineBasicMaterial({color:0x486239})));
  const ticket=new THREE.Group();group.add(ticket);box(ticket,.33,.19,.015,paper);box(ticket,.19,.013,.005,lime,0,.015,.025);
  // An identity card physically taps the reader; context stays on the record.
  const tapCard=new THREE.Group();group.add(tapCard);box(tapCard,.53,.75,.025,paper);box(tapCard,.43,.14,.01,navy,0,.23,.025);disk(tapCard,.075,.01,lime,0,.04,.025);box(tapCard,.31,.015,.006,metal,0,-.15,.025);box(tapCard,.22,.015,.006,metal,0,-.21,.025);
  const contextCards=['PERSON','SITE','EVENT'].map((label,i)=>{
    const card=new THREE.Group();record.add(card);box(card,1.34,.29,.045,paper);
    const face=document.createElement('canvas');face.width=640;face.height=140;const c=face.getContext('2d');c.fillStyle='#e7edda';c.fillRect(0,0,640,140);c.fillStyle='#789252';c.beginPath();c.arc(47,70,15,0,Math.PI*2);c.fill();c.fillStyle='#344f3f';c.font='bold 39px sans-serif';c.fillText(label,85,84);c.strokeStyle='#8da663';c.lineWidth=5;c.beginPath();c.moveTo(555,69);c.lineTo(571,85);c.lineTo(597,52);c.stroke();
    const map=new THREE.CanvasTexture(face);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=renderer.capabilities.getMaxAnisotropy();const front=new THREE.Mesh(new THREE.PlaneGeometry(1.3,.285),new THREE.MeshBasicMaterial({map,toneMapped:false}));front.position.z=.038;card.add(front);return card;
  });
  // Visible handoff path and a record copy that travels all the way to its owner.
  const routeCurve=new THREE.CubicBezierCurve3(new THREE.Vector3(.68,.24,.56),new THREE.Vector3(1.6,.43,.76),new THREE.Vector3(1.68,-.73,.94),new THREE.Vector3(1.16,-.8,.87));
  const route=new THREE.Mesh(new THREE.TubeGeometry(routeCurve,80,.007,8,false),new THREE.MeshBasicMaterial({color:0x8ca263,transparent:true,opacity:.38}));group.add(route);
  const inbox=new THREE.Group();group.add(inbox);box(inbox,.7,.055,.3,metal,1.16,-1.015,.76);box(inbox,.66,.024,.26,navy,1.16,-.977,.76);
  box(ticket,.26,.013,.005,metal,0,-.035,.026);
  const reviewFocus=new THREE.Mesh(new THREE.TorusGeometry(.45,.009,8,64),new THREE.MeshBasicMaterial({color:0x97b16a}));group.add(reviewFocus);
  const waves=Array.from({length:3},()=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(.22,.004,6,64),new THREE.MeshBasicMaterial({color:0x96b45a,transparent:true,opacity:0,depthWrite:false}));group.add(ring);return ring;});
  scene.add(new THREE.HemisphereLight(0xffffed,0x475767,2.1));const key=new THREE.DirectionalLight(0xfff9e7,4);key.position.set(-3,6,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.normalBias=.008;key.shadow.radius=2;Object.assign(key.shadow.camera,{left:-3,right:3,top:3,bottom:-3,near:.5,far:15});key.shadow.camera.updateProjectionMatrix();scene.add(key);const fill=new THREE.DirectionalLight(0xc8e0df,1.4);fill.position.set(4,1,3);scene.add(fill);const rim=new THREE.DirectionalLight(0xe2f6b5,2.2);rim.position.set(3,3,-3);scene.add(rim);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(9,9),new THREE.ShadowMaterial({opacity:.12}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.16;floor.receiveShadow=true;scene.add(floor);
  const camera=new THREE.PerspectiveCamera(34,1,.1,30);camera.position.set(1.35,.9,4.7);camera.lookAt(0,-.17,0);
  holder.append(renderer.domElement);holder.classList.add('is-rendered');renderer.domElement.setAttribute('aria-hidden','true');
  let stage=Number(host.dataset.stage||0),blend=0,time=0,stageTime=0,last=0,frame=0,visible=false,drawn='';const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  function drawRecord(rows,step) {
    const signature=`${stage}/${rows}/${step}`;if(signature===drawn)return;drawn=signature;
    const c=canvas.getContext('2d');c.setTransform(2,0,0,2,0,0);c.fillStyle='#f0f3e6';c.fillRect(0,0,768,960);c.fillStyle='#193745';c.fillRect(0,0,768,134);c.fillStyle='#c9dd9e';c.font='36px monospace';c.fillText('SITE KILLICK',47,80);c.fillStyle='#63775b';c.font='25px monospace';c.fillText('EXAMPLE / FIELD RECORD',47,193);
    c.fillStyle='#243f3a';c.font='bold 58px sans-serif';c.fillText(['Capture','Linked context','Follow-up','Evidence review'][stage],47,267);c.fillStyle='#5b7054';c.font='31px sans-serif';c.fillText(['NFC clock-in','One connected record','Assigned to supervisor','A person makes the decision'][stage],47,308);
    const labels=['Person','Site','Event'],values=['Sample worker','Example site','Clock-in'];
    if(stage===0){
      c.strokeStyle=step?'#9dbb62':'#d6dfc7';c.lineWidth=7;c.beginPath();c.arc(384,515,100,0,Math.PI*2);c.stroke();c.fillStyle='#b5cf80';c.beginPath();c.arc(384,515,20,0,Math.PI*2);c.fill();c.textAlign='center';c.fillStyle='#476444';c.font='bold 40px sans-serif';c.fillText(step?'Signal received':'Ready for a tap',384,697);c.textAlign='left';
    } else if(stage===1){
      c.strokeStyle='#d4dfc6';c.lineWidth=2;for(let i=0;i<3;i++)c.strokeRect(39,377+i*153,690,130);
    } else {
      for(let i=0;i<rows;i++){const y=377+i*118;c.fillStyle=i===2?'#dce8c4':'#e7eddc';c.fillRect(39,y,690,93);c.fillStyle='#8b9b7f';c.font='28px sans-serif';c.fillText(labels[i],60,y+37);c.fillStyle='#3e5940';c.font='bold 36px sans-serif';c.fillText(values[i],60,y+72);}
    }
    c.fillStyle='#a8bd86';c.fillRect(47,810,674,2);c.fillStyle='#617e49';c.font='bold 31px sans-serif';c.fillText([step?'Event captured':'Waiting for signal','Context attached',step?'Delivered to reviewer':'Sending record',step?'Reviewed · example':'Awaiting review'][stage],47,862);texture.needsUpdate=true;
  }
  const render=stamp=>{frame=0;const delta=last?Math.min((stamp-last)/1000,.05):.016;last=stamp;const paused=pause.getAttribute('aria-pressed')==='true';if(!paused&&!reduce.matches){time+=delta;stageTime+=delta;}blend+=(stage-blend)*(reduce.matches?1:.07);
    const still=paused||reduce.matches,cycle=still?3.1:Math.min(stageTime, 4.8);
    const ease=p=>{p=THREE.MathUtils.clamp(p,0,1);return p*p*(3-2*p);};
    group.rotation.y=-.17+Math.sin(time*.35)*.025;group.rotation.x=.025;record.position.y=Math.sin(time*.55)*.008;record.rotation.y=Math.sin(blend*Math.PI/3)*-.045;
    device.position.set(-1.13,-.54,.42);device.rotation.set(.02,.12,-.09);device.scale.setScalar(stage===0?1.13:.82);
    badge.visible=stage>1;badge.position.set(1.15,-.44,.44);badge.rotation.y=-.14;badge.scale.setScalar(stage>1?1.2:1);
    // Maintain a real air gap: the reader face is at roughly z=.65.
    tapCard.visible=stage===0;const tap=still?0:ease(cycle/.9)-ease((cycle-2)/.8);tapCard.position.set(-1.5+tap*.22,.32-tap*.49,1.14-tap*.18);tapCard.rotation.set(.02,-.06,-.12+tap*.1);
    contextCards.forEach((card,i)=>{card.visible=stage===1;const dock=still?1:ease((cycle-i*.4)/.85);card.position.set((i%2?1:-1)*(1-dock)*.68,.03-i*.3+(1-dock)*.23,.27+(1-dock)*.3);card.rotation.y=(1-dock)*(i%2?-.3:.3);card.scale.setScalar(.85+dock*.15);});
    route.visible=stage===2;inbox.visible=stage===2;ticket.visible=stage===2;const transfer=still?1:ease((cycle-.3)/2.1);ticket.position.copy(routeCurve.getPoint(transfer));ticket.scale.setScalar(1.45);ticket.rotation.set(0,0,-.04+Math.sin(transfer*Math.PI)*.1);
    reviewFocus.visible=stage===2;reviewFocus.position.copy(badge.position);reviewFocus.position.z+=.18;reviewFocus.scale.setScalar(1.03+(still?0:Math.sin(time*2)*.035));
    const decided=still||cycle>1.5;seal.visible=stage===3&&decided;seal.position.set(.56,-.55,.49+(still?0:(1-ease((cycle-1.5)/.45))*.35));seal.scale.setScalar(1.35);seal.rotation.z=-.08;
    waves.forEach((wave,i)=>{const p=THREE.MathUtils.clamp((cycle-.7-i*.18)/1.25,0,1);wave.visible=stage===0&&cycle>.65&&cycle<2.5&&p>0&&p<1&&!still;wave.position.set(-1.13+p*.55,-.42+p*.27,.64);wave.scale.setScalar(.45+p*1.6);wave.material.opacity=(1-p)*.38;});
    lime.emissiveIntensity=stage===0?.25+Math.sin(time*1.7)**2*.25:.15;dot.scale.setScalar(stage===1?1.2:1);drawRecord(3,stage===0?(still||cycle>.9):stage===2?(still||cycle>2.4):decided);
    if(stageTime>=4.8&&!still){pause.textContent='Replay motion';pause.setAttribute('aria-pressed','true');}
    renderer.render(scene,camera);if(visible&&!paused&&!reduce.matches&&stageTime<4.8)frame=requestAnimationFrame(render);
  };
  const sync=()=>{cancelAnimationFrame(frame);frame=0;last=0;if(visible)frame=requestAnimationFrame(render);};
  host.addEventListener('workflow-stage',event=>{stage=event.detail;stageTime=0;drawn='';pause.setAttribute('aria-pressed','false');pause.textContent='Pause motion';sync();});host.addEventListener('workflow-motion',()=>{if(stageTime>=4.8&&pause.getAttribute('aria-pressed')==='false'){stageTime=0;drawn='';}sync();});reduce.addEventListener('change',sync);
  const resize=new ResizeObserver(()=>{const r=holder.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.fov=camera.aspect<1.15?38:34;camera.updateProjectionMatrix();sync();});resize.observe(holder);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.1});observer.observe(holder);
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);holder.classList.remove('is-rendered');renderer.domElement.remove();pause.hidden=true;});
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();reduce.removeEventListener('change',sync);scene.traverse(object=>{object.geometry?.dispose();object.material?.map?.dispose();object.material?.dispose();});renderer.dispose();},{once:true});
}







