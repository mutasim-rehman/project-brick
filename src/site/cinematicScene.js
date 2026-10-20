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
    phases.push({ geometry, start, end, count:buffer.length/3 });
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
  const grid=new THREE.GridHelper(60,120,0x3971a0,0x285983);
  grid.position.y=floor-.35; scene.add(grid);
  grid.material.transparent=true; grid.material.opacity=.3; grid.material.depthWrite=false;
  const journey=document.querySelector('.cinema-journey');
  const copy=document.querySelector('.cinema-scene-copy');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,disposed=false,visible=true,elapsed=0,last=0;
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
  function render(time){
    if(disposed)return;
    frame=requestAnimationFrame(render);
    if(!visible||document.hidden){last=time;return;}
    if(!paused&&!reduced.matches)elapsed+=Math.min((time-last)/1000,.05);
    last=time;
    const rect=journey.getBoundingClientRect();
    const scroll=Math.max(0,Math.min(1,-rect.top/Math.max(1,journey.offsetHeight-innerHeight)));
    // The landing screen draws itself even before the first scroll.
    const progress=reduced.matches?1:Math.max(scroll,Math.min(1,elapsed/12));
    const tilt=ease(Math.min(1,progress/.55));
    if(!paused)pointer.lerp(pointerTarget,.035);
    camera.position.set(10*tilt+pointer.x*.6,19-9*tilt,1+13*tilt);
    camera.lookAt(0,-.6,0);
    const narrow=host.clientWidth<700;
    root.position.x=narrow?0:-2.1*ease(progress);
    root.position.y=narrow?.65:-.6;
    root.rotation.y=-.12+pointer.x*.045;
    root.scale.setScalar(narrow?.58:.76);
    phases.forEach(({geometry,start,end,count})=>{
      const amount=Math.max(0,Math.min(1,(progress-start)/(end-start)));
      geometry.setDrawRange(0,Math.floor(count*amount/2)*2);
    });
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
