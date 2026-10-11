import * as THREE from 'three';

const lime = 0xcde875;
const materials = {
  body: new THREE.MeshStandardMaterial({ color: 0x112a3a, roughness: .38, metalness: .35 }),
  edge: new THREE.MeshStandardMaterial({ color: 0x667b81, roughness: .24, metalness: .85 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x17232a, roughness: .85, metalness: .05 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x132b34, roughness: .12, metalness: .3, clearcoat: 1, clearcoatRoughness: .1 }),
  cream: new THREE.MeshStandardMaterial({ color: 0xe9efdd, roughness: .3, metalness: .15 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xcfad58, roughness: .26, metalness: .95 }),
};

function rounded(w,h,d,r=.09) {
  const shape = new THREE.Shape();
  shape.moveTo(-w/2+r,-h/2);
  shape.lineTo(w/2-r,-h/2); shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);
  shape.lineTo(w/2,h/2-r); shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);
  shape.lineTo(-w/2+r,h/2); shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);
  shape.lineTo(-w/2,-h/2+r); shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth:d, bevelEnabled:true, bevelSegments:4, steps:1, bevelSize:.015, bevelThickness:.015, curveSegments:12 });
  geometry.translate(0,0,-d/2);
  return geometry;
}
function box(group,w,h,d,material,x=0,y=0,z=0,r=.07) {
  const mesh = new THREE.Mesh(rounded(w,h,d,r),material);
  mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; group.add(mesh); return mesh;
}
function cylinder(group,radius,depth,material,x=0,y=0,z=0) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,depth,64),material);
  mesh.rotation.x=Math.PI/2; mesh.position.set(x,y,z); mesh.castShadow=true; group.add(mesh); return mesh;
}
function ring(group,radius,tube,material,x=0,y=0,z=0,arc=Math.PI*2) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius,tube,8,80,arc),material);
  mesh.position.set(x,y,z); group.add(mesh); return mesh;
}
function lightMaterial(color=lime) { return new THREE.MeshStandardMaterial({ color, emissive:color, emissiveIntensity:.6, roughness:.25 }); }
function screw(group,x,y,z) {
  cylinder(group,.035,.018,materials.edge,x,y,z);
  box(group,.041,.009,.008,materials.rubber,x,y,z+.013,.002);
}
function label(group,text,x,y,z,width=.8,height=.12,ink='#c7d4cc') {
  const canvas=document.createElement('canvas'); canvas.width=512;canvas.height=96;
  const context=canvas.getContext('2d'); context.fillStyle=ink; context.font='500 34px monospace';context.textAlign='center';context.textBaseline='middle';context.fillText(text,256,48);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));
  plane.position.set(x,y,z);group.add(plane);return plane;
}
function screen(group,x,y,z) {
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=512;
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(.54,1.04),new THREE.MeshBasicMaterial({map:texture}));mesh.position.set(x,y,z);group.add(mesh);
  let previous;
  return state=>{
    if(previous===state)return;previous=state;
    const c=canvas.getContext('2d');c.fillStyle='#102c38';c.fillRect(0,0,256,512);
    c.fillStyle='#8fa7a9';c.font='18px monospace';c.fillText('SITE KILLICK',25,52);
    c.fillStyle='#eaf0dc';c.font='bold 26px sans-serif';c.fillText('Attendance',25,115);
    c.strokeStyle=state?'#cde875':'#47656b';c.lineWidth=3;c.beginPath();c.arc(128,245,59,0,Math.PI*2);c.stroke();
    c.strokeStyle='#cde875';c.lineWidth=7;c.lineCap='round';c.beginPath();
    if(state){c.moveTo(98,245);c.lineTo(120,266);c.lineTo(158,222);}else{c.arc(128,245,24,-.8,.8);}
    c.stroke();c.fillStyle='#cde875';c.font='22px sans-serif';c.textAlign='center';c.fillText(state?'Tap captured':'Ready to tap',128,355);
    c.fillStyle='#829a96';c.font='15px monospace';c.fillText('EXAMPLE RECORD',128,420);c.textAlign='left';texture.needsUpdate=true;
  };
}
function model(id) {
  const group=new THREE.Group();
  const glow=lightMaterial();const amber=lightMaterial(0xeab064);
  let update=()=>{};
  if(id==='nfc-badge') {
    box(group,1.18,1.95,.19,materials.edge,0,0,0,.17);
    box(group,1.13,1.9,.22,materials.body,0,0,.055,.15);
    box(group,.94,1.56,.035,materials.glass,0,.05,.19,.1);
    box(group,.58,.025,.009,materials.edge,0,.67,.218,.005);
    label(group,'SITE KILLICK',0,.48,.245,.65,.1);
    const coil=ring(group,.29,.012,glow,0,.02,.245,Math.PI*1.65);coil.rotation.z=-.5;
    for(let i=0;i<3;i++) {const arc=ring(group,.065+i*.055,.008,glow,.025,.035,.235,1.7);arc.rotation.z=-.85;}
    label(group,'NFC / CONTACTLESS',0,-.6,.245,.72,.08,'#829a99');
    const led=cylinder(group,.025,.01,glow,.38,.72,.225);
    [-1,1].forEach(x=>[-1,1].forEach(y=>screw(group,x*.48,y*.83,.184)));
    const phone=new THREE.Group();group.add(phone);
    box(phone,.65,1.24,.09,materials.edge,0,0,0,.08);
    box(phone,.61,1.20,.06,materials.rubber,0,0,.05,.07);
    const draw=screen(phone,0,0,.108);draw(false);
    box(phone,.15,.026,.012,materials.rubber,0,.49,.12,.012);
    const waves=Array.from({length:3},()=>ring(group,.31,.006,new THREE.MeshBasicMaterial({color:lime,transparent:true,opacity:0,depthWrite:false}),0,.02,.26));
    update=t=>{
      const cycle=t%7;const near=cycle>1.2&&cycle<4.8;
      const approach=Math.min(1,Math.max(0,(cycle-.5)/1.1));const depart=Math.min(1,Math.max(0,(cycle-4.8)/1.2));
      const smooth=value=>value*value*(3-2*value);
      const blend=smooth(approach)*(1-smooth(depart));
      phone.position.set(1.17-.32*blend,-.4+.18*blend,.65-.18*blend);phone.rotation.set(.03,-.2+.2*blend,-.13+.1*blend);
      glow.emissiveIntensity=.35+(near?.55:0);led.scale.setScalar(near?1.15:1);draw(near);
      waves.forEach((wave,i)=>{const phase=((cycle-1.2+i*.35)%1.6+1.6)%1.6/1.6;wave.scale.setScalar(1+phase*1.6);wave.position.z=.26+phase*.18;wave.material.opacity=near?(1-phase)*.45:0;});
    };
  } else if(id==='guard-tag') {
    box(group,1.75,1.4,.30,materials.rubber,0,0,0,.22);
    box(group,1.51,1.18,.23,materials.edge,0,0,.12,.17);
    box(group,1.45,1.12,.10,materials.body,0,0,.25,.14);
    box(group,1.15,.80,.035,materials.glass,0,0,.32,.08);
    [-1,1].forEach(x=>[-1,1].forEach(y=>{box(group,.25,.37,.42,materials.rubber,x*.79,y*.4,.04,.07);screw(group,x*.61,y*.44,.31);}));
    for(let i=0;i<6;i++){box(group,.045,.16,.025,materials.edge,-.3+i*.12,-.58,.22,.004);}
    label(group,'GUARD / ASSET',0,-.23,.375,.78,.09);
    const shield=new THREE.Shape();shield.moveTo(-.17,.2);shield.lineTo(.17,.2);shield.lineTo(.15,-.05);shield.quadraticCurveTo(.08,-.17,0,-.23);shield.quadraticCurveTo(-.08,-.17,-.15,-.05);shield.closePath();
    const emblem=new THREE.Mesh(new THREE.ShapeGeometry(shield),glow);emblem.position.set(0,.1,.375);group.add(emblem);
    const beacon=cylinder(group,.026,.01,amber,.42,.3,.355);
    const halo=ring(group,.90,.008,new THREE.MeshBasicMaterial({color:lime,transparent:true,opacity:.25}),0,0,-.19);
    const scan=new THREE.Mesh(new THREE.PlaneGeometry(.93,.018),new THREE.MeshBasicMaterial({color:lime,transparent:true,opacity:.45,depthWrite:false}));scan.position.z=.38;group.add(scan);
    update=t=>{const cycle=t%6;beacon.material.emissiveIntensity=cycle<2?.3+Math.pow(Math.sin(t*5),6)*1.4:.1;glow.emissiveIntensity=.4+Math.pow(Math.sin(t*1.6),4)*.6;halo.scale.setScalar(1+(cycle/6)*.7);halo.material.opacity=.35*(1-cycle/6);scan.position.y=.31-(cycle%3)/3*.62;scan.material.opacity=cycle>2?.35:0;};
  } else if(id==='tool-tag') {
    cylinder(group,.78,.24,materials.rubber);
    cylinder(group,.70,.28,materials.edge,0,0,.035);
    cylinder(group,.65,.10,materials.body,0,0,.21);
    cylinder(group,.53,.015,materials.glass,0,0,.269);
    for(let i=0;i<40;i++){const a=i/40*Math.PI*2;const ridge=box(group,.035,.075,.20,materials.rubber,Math.cos(a)*.745,Math.sin(a)*.745,.045,.003);ridge.rotation.z=a-Math.PI/2;}
    const rim=ring(group,.57,.012,glow,0,0,.28);
    label(group,'SITE KILLICK',0,.16,.291,.72,.09);
    label(group,'TOOL / CUSTODY',0,-.23,.291,.72,.08,'#8da5a2');
    for(let i=0;i<3;i++){const arc=ring(group,.06+i*.04,.006,glow,0,-.01,.29,1.6);arc.rotation.z=-.8;}
    const nodes=[];for(let i=0;i<3;i++){const node=new THREE.Mesh(new THREE.SphereGeometry(.045,16,16),glow.clone());group.add(node);nodes.push(node);}
    const trail=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({length:96},(_,i)=>{const a=i/96*Math.PI*2;return new THREE.Vector3(Math.cos(a)*1.02,Math.sin(a)*.88,-.05);})),new THREE.LineBasicMaterial({color:lime,transparent:true,opacity:.3}));group.add(trail);
    const packet=new THREE.Mesh(new THREE.SphereGeometry(.024,12,12),lightMaterial());group.add(packet);
    update=t=>{rim.material.emissiveIntensity=.4+Math.pow(Math.sin(t),4)*.7;nodes.forEach((node,i)=>{const a=i*Math.PI*2/3;node.position.set(Math.cos(a)*1.02,Math.sin(a)*.88,-.05);node.material.emissiveIntensity=i===Math.floor(t%6/2)?1.5:.15;});const a=t*Math.PI/3;packet.position.set(Math.cos(a)*1.02,Math.sin(a)*.88,-.05);};
  } else {
    box(group,1.96,1.04,.40,materials.rubber,0,0,0,.13);
    box(group,1.82,.92,.14,materials.edge,0,0,.23,.09);
    box(group,1.70,.79,.085,materials.body,0,0,.32,.07);
    for(let i=0;i<13;i++){box(group,.035,.8,.045,materials.rubber,-.85+i*.14,0,-.21,.004);}
    for(let i=0;i<4;i++){box(group,.10,.25,.12,materials.gold,-.3+i*.2,.63,-.015,.008);box(group,.16,.10,.17,materials.rubber,-.3+i*.2,.48,0,.008);}
    [-1,1].forEach(x=>[-1,1].forEach(y=>screw(group,x*.76,y*.32,.38)));
    box(group,.89,.35,.025,materials.glass,-.18,.08,.385,.02);
    label(group,'GATEWAY',-.2,.13,.435,.64,.085);
    label(group,'SITE KILLICK',-.2,-.04,.435,.63,.06,'#8da5a2');
    const lights=[];for(let i=0;i<3;i++)lights.push(cylinder(group,.025,.012,glow.clone(),.52,.16-i*.14,.39));
    box(group,.64,.085,.015,materials.edge,-.18,-.23,.377,.012);
    for(let i=0;i<7;i++)box(group,.025,.05,.012,materials.rubber,-.42+i*.08,-.23,.39,.002);
    const signals=Array.from({length:3},(_,i)=>{const arc=ring(group,.42,.008,new THREE.MeshBasicMaterial({color:lime,transparent:true,opacity:.2,depthWrite:false}),0,.46,-.08,Math.PI);arc.rotation.z=0;return arc;});
    update=t=>{lights.forEach((led,i)=>{led.material.emissiveIntensity=.1+Math.pow(Math.max(0,Math.sin(t*3-i)),5)*1.5;});signals.forEach((arc,i)=>{const phase=(t*.45+i/3)%1;arc.scale.setScalar(.9+phase*1.5);arc.position.y=.48+phase*.18;arc.material.opacity=(1-phase)*.4;});};
  }
  return {group,update};
}

export function mountHardwareModels() {
  document.querySelectorAll('[data-scene]').forEach(host=>{
    const holder=host.querySelector('.device-object');
    let renderer;
    try { renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'}); } catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;renderer.outputColorSpace=THREE.SRGBColorSpace;
    const scene=new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xf9ffe8,0x354452,2.2));
    const key=new THREE.DirectionalLight(0xfff8df,4.5);key.position.set(-2,7,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=3;key.shadow.camera.bottom=-3;key.shadow.normalBias=.03;key.shadow.radius=4;scene.add(key);
    const rim=new THREE.DirectionalLight(0xe0f5a7,3);rim.position.set(4,2,-2);scene.add(rim);
    const fill=new THREE.DirectionalLight(0xb3d8e9,1.4);fill.position.set(-4,-1,3);scene.add(fill);
    const {group,update}=model(host.dataset.scene);scene.add(group);
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(8,8),new THREE.ShadowMaterial({opacity:.11}));ground.rotation.x=-Math.PI/2;ground.position.y=host.dataset.scene==='nfc-badge'?-1.06:host.dataset.scene==='guard-tag'?-.82:host.dataset.scene==='tool-tag'?-.84:-.69;ground.receiveShadow=true;scene.add(ground);
    const camera=new THREE.PerspectiveCamera(30,1,.1,30);camera.position.set(2,1.15,5.2);camera.lookAt(host.dataset.scene==='nfc-badge'?.3:0,0,0);
    holder.append(renderer.domElement);holder.classList.add('has-hardware-model');host.classList.add('model-ready');
    renderer.domElement.setAttribute('aria-hidden','true');
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');let visible=false,frame=0,time=0,last=0,assembled=0;
    const target={x:0,y:0},pointer={x:0,y:0};
    const render=timestamp=>{
      frame=0;const delta=last?Math.min((timestamp-last)/1000,.05):.016;last=timestamp;
      const paused=host.querySelector('.device-motion-toggle').getAttribute('aria-pressed')==='true';
      if(!paused&&!reduce.matches)time+=delta;
      assembled=Math.min(1,assembled+delta/1.2);const ease=1-Math.pow(1-assembled,3);
      group.scale.setScalar(reduce.matches?1:.88+.12*ease);
      pointer.x+=(target.x-pointer.x)*.055;pointer.y+=(target.y-pointer.y)*.055;
      const turn=host.dataset.scene==='nfc-badge'?.055:host.dataset.scene==='tool-tag'?.32:.22;
      group.rotation.y=reduce.matches?-.16:-.3+.12*ease+Math.sin(time*.5)*turn+pointer.x*.1;
      group.rotation.x=reduce.matches?.02:.035+Math.sin(time*.3)*.025+pointer.y*.04;
      group.position.y=reduce.matches?0:Math.sin(time*.7)*.025;
      update(reduce.matches?3:time);renderer.render(scene,camera);
      if(visible&&!host.closest('.device-card').inert&&!paused&&!reduce.matches)frame=requestAnimationFrame(render);
    };
    const sync=()=>{if(frame)cancelAnimationFrame(frame);frame=0;last=0;if(visible&&!host.closest('.device-card').inert)frame=requestAnimationFrame(render);};
    const resize=new ResizeObserver(()=>{const r=holder.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.fov=camera.aspect<1.1?34:30;camera.updateProjectionMatrix();sync();});resize.observe(holder);
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.1});observer.observe(host);
    host.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse')return;const r=host.getBoundingClientRect();target.x=(event.clientX-r.left)/r.width-.5;target.y=(event.clientY-r.top)/r.height-.5;});
    host.addEventListener('pointerleave',()=>{target.x=0;target.y=0;});
    host.closest('.device-card').addEventListener('device-visibility',sync);host.querySelector('.device-motion-toggle').addEventListener('click',sync);reduce.addEventListener('change',sync);
    renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();host.classList.remove('model-ready');holder.classList.remove('has-hardware-model');cancelAnimationFrame(frame);renderer.domElement.remove();});
    window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();reduce.removeEventListener('change',sync);scene.traverse(object=>{object.geometry?.dispose();const list=Array.isArray(object.material)?object.material:[object.material];list.filter(Boolean).forEach(material=>{material.map?.dispose();if(!Object.values(materials).includes(material))material.dispose();});});renderer.dispose();},{once:true});
  });
}
