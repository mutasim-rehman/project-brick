import * as THREE from 'three';

/** Architectural linework drawn in construction order, without mesh diagonals. */
export function createCinematicScene(host, { paused = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.4 : 1.8));
  renderer.setClearColor(0x123e70);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x123e70, 25, 55);
  const camera = new THREE.OrthographicCamera(-9, 9, 6, -6, .1, 100);
  const root = new THREE.Group();
  scene.add(root);
  const geometries = [], materials = [], phases = [];
  const floor = -2.6, height = 1.65;
  const xs = [-3.8, -1.9, 0, 1.9, 3.8], zs = [-2.4, 0, 2.4];
  const line = (buffer, a, b) => buffer.push(...a, ...b);
  const rectangle = (buffer, x1, z1, x2, z2, y) => {
    const p = [[x1,y,z1],[x2,y,z1],[x2,y,z2],[x1,y,z2]];
    p.forEach((a,i)=>line(buffer,a,p[(i+1)%4]));
  };
  const box = (buffer, x, y, z, w, h, d) => {
    rectangle(buffer,x-w/2,z-d/2,x+w/2,z+d/2,y-h/2);
    rectangle(buffer,x-w/2,z-d/2,x+w/2,z+d/2,y+h/2);
    for (const dx of [-w/2,w/2]) for (const dz of [-d/2,d/2]) line(buffer,[x+dx,y-h/2,z+dz],[x+dx,y+h/2,z+dz]);
  };
  const phase = (buffer, start, end, opacity = .8, color = 0xc5ecff) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(buffer,3));
    geometry.setDrawRange(0,0);
    const material = new THREE.LineBasicMaterial({ color, transparent:true, opacity, depthWrite:false });
    root.add(new THREE.LineSegments(geometry, material));
    geometries.push(geometry); materials.push(material);
    phases.push({ geometry, material, opacity, start, end, count:buffer.length/3 });
  };
  // Double wall lines, rooms, door arcs and stair core form the initial floor plan.
  const plan = [];
  rectangle(plan,-3.8,-2.4,3.8,2.4,floor);
  rectangle(plan,-3.65,-2.25,3.65,2.25,floor);
  for (const x of [-1.9,0,1.9]) {
    line(plan,[x,floor,-2.25],[x,floor,-.4]);
    line(plan,[x+.08,floor,-2.25],[x+.08,floor,-.4]);
  }
  line(plan,[-3.65,floor,-.4],[3.65,floor,-.4]);
  line(plan,[-3.65,floor,-.32],[3.65,floor,-.32]);
  rectangle(plan,-3.5,.3,-1.8,2.1,floor);
  rectangle(plan,-1.5,.3,.6,2.1,floor);
  rectangle(plan,1,.3,3.4,2.1,floor);
  for (let i=0;i<10;i++) line(plan,[-1.45+i*.2,floor,.4],[-1.45+i*.2,floor,1.95]);
  for (const x of [-2.8,-.9,1,2.8]) {
    line(plan,[x,floor,-.4],[x,floor,-1.05]);
    for (let i=0;i<12;i++) {
      const a=i/12*Math.PI/2,b=(i+1)/12*Math.PI/2;
      line(plan,[x+.65*Math.cos(a),floor,-.4-.65*Math.sin(a)],[x+.65*Math.cos(b),floor,-.4-.65*Math.sin(b)]);
    }
  }
  phase(plan,0,.18,.65);
  const foundations=[];
  for (const x of xs) for (const z of zs) box(foundations,x,floor-.13,z,.48,.26,.48);
  phase(foundations,.12,.25,.9);
  // Columns, perimeter lintels, joists and slabs rise floor by floor.
  for (let storey=0;storey<3;storey++) {
    const y=floor+storey*height, frame=[];
    for (const x of xs) for (const z of zs) box(frame,x,y+height/2,z,.12,height,.12);
    for (const z of zs) box(frame,0,y+height,z,7.85,.12,.12);
    for (const x of xs) box(frame,x,y+height,0,.12,.12,4.95);
    phase(frame,.22+storey*.13,.38+storey*.13,.92,0xe1f5ff);
    const slab=[];
    box(slab,0,y+height+.04,0,8.05,.12,5.1);
    phase(slab,.32+storey*.13,.44+storey*.13,.6);
  }
  const facade=[];
  for (let storey=0;storey<3;storey++) {
    const y=floor+storey*height+.37;
    for (const z of [-2.42,2.42]) for (let bay=0;bay<4;bay++) {
      const x=-3.8+bay*1.9+.35,w=1.2,h=1.03;
      const p=[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]];
      p.forEach((a,i)=>line(facade,a,p[(i+1)%4]));
      line(facade,[x+w/2,y,z],[x+w/2,y+h,z]);
      line(facade,[x,y+.13,z],[x+w,y+.13,z]);
    }
    for (const x of [-3.82,3.82]) for (const z of [-1.95,.45]) {
      const p=[[x,y,z],[x,y,z+1.5],[x,y+1.03,z+1.5],[x,y+1.03,z]];
      p.forEach((a,i)=>line(facade,a,p[(i+1)%4]));
      line(facade,[x,y,z+.75],[x,y+1.03,z+.75]);
    }
  }
  phase(facade,.6,.88,.7);
  const roof=[];
  box(roof,0,floor+height*3+.28,0,8.3,.24,5.35);
  box(roof,0,floor+height*3+.47,0,8.1,.14,5.15);
  for (let i=0;i<3;i++) box(roof,-2.8,floor-.22+i*.07,2.7-i*.15,1.6,.07,.9-i*.2);
  box(roof,-2.8,floor+1.38,2.85,1.8,.1,1.1);
  phase(roof,.82,1,.95,0xe1f5ff);
  const guides=[];
  for (const x of xs) line(guides,[x,floor-.3,-4.1],[x,floor-.3,4]);
  for (const z of zs) line(guides,[-5.2,floor-.3,z],[5.2,floor-.3,z]);
  phase(guides,0,.05,.16,0x8ed1f2);
  const dimensions=[];
  line(dimensions,[-3.8,floor-.15,3.5],[3.8,floor-.15,3.5]);
  for(const x of xs) {
    line(dimensions,[x,floor-.15,3.2],[x,floor-.15,3.8]);
    line(dimensions,[x-.1,floor-.15,3.4],[x+.1,floor-.15,3.6]);
  }
  line(dimensions,[-4.8,floor,-2.4],[-4.8,floor,2.4]);
  for(const z of [-2.4,2.4]) line(dimensions,[-5.05,floor,z],[-4.55,floor,z]);
  phase(dimensions,.02,.2,.45);
  // The final shell writes depth, so windows and edges on the far side are hidden.
  // Construction linework fades out instead of showing through the finished facade.
  const exterior=new THREE.Group();root.add(exterior);
  const exteriorMaterials=[];
  const shell=(x,y,z,w,h,d,color=0x194b7c)=>{
    const geometry=new THREE.BoxGeometry(w,h,d);
    const material=new THREE.MeshBasicMaterial({color,transparent:true,opacity:0,depthWrite:true,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
    const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);exterior.add(mesh);
    const edges=new THREE.EdgesGeometry(geometry);
    const ink=new THREE.LineBasicMaterial({color:0xe1f5ff,transparent:true,opacity:0});
    const outline=new THREE.LineSegments(edges,ink);outline.position.copy(mesh.position);exterior.add(outline);
    geometries.push(geometry,edges);materials.push(material,ink);
    exteriorMaterials.push({material,max:1},{material:ink,max:.9});
  };
  shell(0,floor+height*1.5,0,7.7,height*3,4.9);
  shell(0,floor+height*3+.17,0,8.12,.18,5.16);
  shell(0,floor+height*3+.32,0,7.94,.12,4.98);
  shell(0,floor-.08,0,8.08,.16,5.24);
  for(let i=0;i<3;i++)shell(-2.8,floor-.22+i*.07,2.7-i*.15,1.6,.07,.9-i*.2);
  shell(-2.8,floor+1.38,2.85,1.8,.1,1.1);
  const exteriorDetails=[];
  for(let storey=0;storey<3;storey++){
    const y=floor+storey*height+.32;
    for(const z of [-2.46,2.46])for(let bay=0;bay<4;bay++){
      const x=-3.8+bay*1.9+.35,w=1.2,h=1.04;
      const p=[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]];
      p.forEach((a,i)=>line(exteriorDetails,a,p[(i+1)%4]));
      line(exteriorDetails,[x+w/2,y,z],[x+w/2,y+h,z]);
      line(exteriorDetails,[x,y+.13,z],[x+w,y+.13,z]);
    }
    for(const x of [-3.86,3.86])for(const z of [-1.95,.45]){
      const p=[[x,y,z],[x,y,z+1.5],[x,y+1.04,z+1.5],[x,y+1.04,z]];
      p.forEach((a,i)=>line(exteriorDetails,a,p[(i+1)%4]));
      line(exteriorDetails,[x,y,z+.75],[x,y+1.04,z+.75]);
    }
    const belt=floor+(storey+1)*height-.06;
    rectangle(exteriorDetails,-3.86,-2.46,3.86,2.46,belt);
    // Vertical facade pilasters stay on the skin, separate from the internal frame.
    for(const z of [-2.46,2.46])for(const x of xs){
      line(exteriorDetails,[x,floor,z],[x,floor+height*3,z]);
    }
  }
  // Finished site: stepped roof, terrace, garage and landscaped street frontage.
  const roofLevel=floor+height*3+.4;
  shell(-1.6,roofLevel+.48,-.5,2.5,.96,2.35);
  shell(-1.6,roofLevel+1.01,-.5,2.7,.12,2.55);
  shell(1.8,roofLevel+.1,.65,2.8,.16,2.7,0x245980);
  // Rooftop planters and a pergola break up the broad roof plane.
  for(const z of [-1.65,1.9])shell(1.8,roofLevel+.22,z,2.6,.36,.45,0x285f7e);
  for(const x of [.45,3.1])for(const z of [-.6,1.85])shell(x,roofLevel+.58,z,.07,1.05,.07);
  for(let i=0;i<7;i++)shell(.45+i*.44,roofLevel+1.12,.62,.08,.08,2.65);
  // Side garage, with a visible sectional door and a driveway to the street.
  shell(5.1,floor+.82,.3,2.5,1.64,3.8,0x20527f);
  shell(5.1,floor+1.71,.3,2.7,.14,4);
  shell(5.1,floor+.77,2.22,2.02,1.42,.04,0x123e70);
  shell(0,floor-.27,1.65,14.5,.12,10.4,0x123e70);
  shell(0,floor-.18,6,14.5,.05,1.5,0x102f56);
  shell(0,floor-.12,5,14.5,.08,.48,0x28577f);
  shell(5.1,floor-.15,3.62,2.4,.05,2.6,0x20517a);
  // Garden beds, entrance path and a low boundary wall.
  shell(-3.2,floor-.1,3.95,4.5,.12,1.25,0x245c76);
  shell(.9,floor-.1,3.95,2.9,.12,1.25,0x245c76);
  shell(-.55,floor-.09,3.95,.9,.1,1.7,0x2b6087);
  shell(-5.6,floor+.12,2.35,.13,.52,4.7);
  const siteDetails=[];
  const circle=(buffer,x,y,z,r,plane='ground')=>{
    for(let i=0;i<28;i++){
      const a=i/28*Math.PI*2,b=(i+1)/28*Math.PI*2;
      const point=t=>plane==='ground'?[x+Math.cos(t)*r,y,z+Math.sin(t)*r]:plane==='front'?[x+Math.cos(t)*r,y+Math.sin(t)*r,z]:[x,y+Math.cos(t)*r,z+Math.sin(t)*r];
      line(buffer,point(a),point(b));
    }
  };
  const tree=(x,z,r=.55)=>{
    const y=floor+1.1;
    line(siteDetails,[x,floor,z],[x,y+.3,z]);
    circle(siteDetails,x,y,z,r);circle(siteDetails,x,y,z,r,'front');circle(siteDetails,x,y,z,r,'side');
    circle(siteDetails,x,y+.2,z,r*.8);circle(siteDetails,x,y-.2,z,r*.8);
    for(const angle of [0,2.1,4.2])line(siteDetails,[x,y-.3,z],[x+Math.cos(angle)*r*.7,y+.15,z+Math.sin(angle)*r*.7]);
    circle(siteDetails,x,floor-.03,z,r*.7);
  };
  tree(-4.6,3.9,.65);tree(2,3.95,.55);tree(-5,0,.6);
  for(const x of [-3.7,-3,-2.3,.1,.8]){
    circle(siteDetails,x,floor+.15,4,.23,'front');
    circle(siteDetails,x,floor+.15,4,.23);
  }
  // Garage slats, door frame and recessed roof access.
  for(let i=0;i<8;i++)line(siteDetails,[4.1,floor+.16+i*.17,2.25],[6.1,floor+.16+i*.17,2.25]);
  line(siteDetails,[5.85,floor+.75,2.26],[6,floor+.75,2.26]);
  box(siteDetails,-1.6,roofLevel+.4,.69,.65,.8,.02);
  // Solar array: panel grid and support edges, kept behind the roof terrace.
  for(let i=0;i<3;i++){
    const x=.4+i*.85;
    box(siteDetails,x,roofLevel+.12,-1,.73,.12,.85);
    for(let j=1;j<4;j++)line(siteDetails,[x-.36+j*.18,roofLevel+.185,-1.42],[x-.36+j*.18,roofLevel+.185,-.58]);
    line(siteDetails,[x-.36,roofLevel+.185,-1],[x+.36,roofLevel+.185,-1]);
  }
  // Roof perimeter rail and terrace furniture.
  rectangle(siteDetails,-3.7,-2.2,3.7,2.2,roofLevel+.45);
  for(const x of [-3.7,-1.85,0,1.85,3.7])for(const z of [-2.2,2.2])line(siteDetails,[x,roofLevel,z],[x,roofLevel+.45,z]);
  circle(siteDetails,1.8,roofLevel+.35,.8,.4);
  line(siteDetails,[1.8,roofLevel,.8],[1.8,roofLevel+.35,.8]);
  for(const x of [1.1,2.5])box(siteDetails,x,roofLevel+.18,.8,.32,.35,.38);
  // Front balconies, railings and a more deliberate entrance door.
  for(const y of [floor+height,floor+height*2]){
    box(siteDetails,.95,y+.04,2.8,1.55,.1,.7);
    line(siteDetails,[.18,y+.6,3.15],[1.72,y+.6,3.15]);
    for(let i=0;i<7;i++)line(siteDetails,[.18+i*.255,y+.1,3.15],[.18+i*.255,y+.6,3.15]);
  }
  box(siteDetails,-2.8,floor+.63,2.47,.95,1.26,.02);
  line(siteDetails,[-2.8,floor,2.49],[-2.8,floor+1.26,2.49]);
  // Pavement joints, road markings, crossing and driveway apron.
  for(let x=-6.7;x<7;x+=1.25)line(siteDetails,[x,floor-.07,4.77],[x,floor-.07,5.24]);
  for(let x=-6.6;x<7;x+=1.6)line(siteDetails,[x,floor-.145,6],[x+.75,floor-.145,6]);
  for(let i=0;i<5;i++)rectangle(siteDetails,-.85,5.35+i*.25,.25,5.48+i*.25,floor-.14);
  // A parked vehicle gives the garage and road a clear scale.
  shell(5.1,floor+.15,3.95,.85,.35,1.55,0x123e70);
  shell(5.1,floor+.42,3.9,.69,.25,.8,0x20527f);
  for(const x of [4.65,5.55])for(const z of [3.43,4.45])circle(siteDetails,x,floor+.08,z,.16,'side');
  const siteGeometry=new THREE.BufferGeometry();
  siteGeometry.setAttribute('position',new THREE.Float32BufferAttribute(siteDetails,3));
  const siteInk=new THREE.LineBasicMaterial({color:0xc5ecff,transparent:true,opacity:0,depthWrite:false});
  exterior.add(new THREE.LineSegments(siteGeometry,siteInk));
  geometries.push(siteGeometry);materials.push(siteInk);exteriorMaterials.push({material:siteInk,max:.8});
  const facadeGeometry=new THREE.BufferGeometry();
  facadeGeometry.setAttribute('position',new THREE.Float32BufferAttribute(exteriorDetails,3));
  const facadeInk=new THREE.LineBasicMaterial({color:0xc5ecff,transparent:true,opacity:0,depthWrite:false});
  exterior.add(new THREE.LineSegments(facadeGeometry,facadeInk));
  geometries.push(facadeGeometry);materials.push(facadeInk);exteriorMaterials.push({material:facadeInk,max:.85});
  const grid=new THREE.GridHelper(60,120,0x3971a0,0x285983);
  grid.position.y=floor-.35; scene.add(grid);
  grid.material.transparent=true; grid.material.opacity=.3; grid.material.depthWrite=false;
  const journey=document.querySelector('.cinema-journey');
  const copy=document.querySelector('.cinema-scene-copy');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,disposed=false,visible=true;
  const pointer=new THREE.Vector2(), pointerTarget=new THREE.Vector2();
  const onPointer=event=>{
    if(paused||reduced.matches||event.pointerType!=='mouse')return;
    const rect=host.getBoundingClientRect();
    pointerTarget.set((event.clientX-rect.left)/rect.width-.5,(event.clientY-rect.top)/rect.height-.5);
  };
  const onLeave=()=>pointerTarget.set(0,0);
  host.addEventListener('pointermove',onPointer);host.addEventListener('pointerleave',onLeave);
  const resize=()=>{
    const w=host.clientWidth,h=host.clientHeight,aspect=w/h;
    const view=aspect<1 ? 13.8 : 9.6;
    camera.left=-view*aspect/2;camera.right=view*aspect/2;camera.top=view/2;camera.bottom=-view/2;
    camera.updateProjectionMatrix();renderer.setSize(w,h);
  };
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const ease=t=>t*t*(3-2*t);
  function render(){
    if(disposed)return;
    frame=requestAnimationFrame(render);
    if(!visible||document.hidden)return;
    const rect=journey.getBoundingClientRect();
    const scroll=Math.max(0,Math.min(1,-rect.top/Math.max(1,journey.offsetHeight-innerHeight)));
    // A starter plan is visible on arrival; every subsequent stage follows scroll.
    const progress=reduced.matches?1:.12+scroll*.88;
    const tilt=ease(Math.min(1,progress/.55));
    if(!paused)pointer.lerp(pointerTarget,.035);
    camera.position.set(10*tilt+pointer.x*.6,19-9*tilt,1+13*tilt);
    camera.lookAt(0,-.6,0);
    const narrow=host.clientWidth<700;
    root.position.x=narrow?0:-2.7*ease(progress);
    root.position.y=narrow?.65:-.6;
    root.rotation.y=-.12+pointer.x*.045;
    const contextReveal=ease(Math.max(0,Math.min(1,(progress-.78)/.2)));
    root.scale.setScalar(narrow?.58-.15*contextReveal:.76-.18*contextReveal);
    const completion=ease(Math.max(0,Math.min(1,(progress-.82)/.16)));
    phases.forEach(({geometry,material,opacity,start,end,count})=>{
      const amount=Math.max(0,Math.min(1,(progress-start)/(end-start)));
      geometry.setDrawRange(0,Math.floor(count*amount/2)*2);
      material.opacity=opacity*(1-completion);
    });
    exterior.visible=completion>0;
    exteriorMaterials.forEach(({material,max})=>{
      material.opacity=completion*max;
      // At completion, draw solid surfaces before the transparent drafting lines.
      // Otherwise a broad annotation buffer can sort behind a nearby road or door.
      if(max===1&&material.transparent!==(completion<1)){
        material.transparent=completion<1;material.needsUpdate=true;
      }
    });
    host.dataset.buildProgress=progress.toFixed(4);
    host.dataset.exterior=completion===1?'complete':'building';
    renderer.render(scene,camera);
    const reveal=ease(Math.max(0,Math.min(1,(progress-.65)/.3)));
    copy.style.opacity=String(reveal);
    copy.style.transform=`translateY(${(1-reveal)*20}px)`;
    const state=document.querySelector('[data-cinema-state]');
    const label=progress>.92?'ONE CONNECTED PICTURE':progress>.6?'03 / FACADE & DETAIL':progress>.22?'02 / RAISING THE STRUCTURE':'01 / DRAWING THE PLAN';
    if(state.textContent!==label)state.textContent=label;
    const phaseLabel=document.querySelector('[data-blueprint-phase]');
    if(phaseLabel)phaseLabel.textContent=progress>.92?'COMPLETE / CONNECTED':`${String(Math.min(99,Math.floor(progress*100))).padStart(2,'0')} / IN DEVELOPMENT`;
  }
  resize();renderer.render(scene,camera);host.replaceChildren(renderer.domElement);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});observer.observe(host);
  frame=requestAnimationFrame(render);
  return {
    setPaused(value){paused=value;},
    dispose(){
      disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();observer.disconnect();
      host.removeEventListener('pointermove',onPointer);host.removeEventListener('pointerleave',onLeave);
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
      grid.geometry.dispose();grid.material.dispose();renderer.dispose();
    },
  };
}
