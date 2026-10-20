import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/** One procedural scene: scattered components resolve into the frame of a site. */
export function createCinematicScene(host, { paused = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.3 : 1.7));
  renderer.setClearColor(0x10243d);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
  camera.position.set(0, 2.5, 16);
  camera.lookAt(0, 0, 0);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xe2edff, 0x10243d, 2));
  const key = new THREE.DirectionalLight(0xffffff, 4);
  key.position.set(4, 8, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xd7ec87, 2.5);
  rim.position.set(-6, 3, -3); scene.add(rim);
  const materials = [
    new THREE.MeshStandardMaterial({ color: 0xc6d65c, metalness: .38, roughness: .23 }),
    new THREE.MeshStandardMaterial({ color: 0xeee6da, metalness: .25, roughness: .25 }),
    new THREE.MeshStandardMaterial({ color: 0x385d85, metalness: .65, roughness: .2 }),
  ];
  const root = new THREE.Group(); scene.add(root);
  const cube = new RoundedBoxGeometry(1, 1, 1, 3, .09);
  const pieces = [];
  const targets = [];
  // Frame columns, floor beams, roof beams and panel infill.
  for (const x of [-2.5, 0, 2.5]) for (const z of [-1.6, 1.6]) targets.push({ p:[x,0,z], s:[.28,4.2,.28], m:1 });
  for (const y of [-2,0,2]) for (const z of [-1.6,1.6]) targets.push({p:[0,y,z],s:[5.35,.22,.28],m:0});
  for (const y of [-2,2]) for (const x of [-2.5,0,2.5]) targets.push({p:[x,y,0],s:[.24,.24,3.4],m:2});
  for (const x of [-1.25,1.25]) targets.push({p:[x,-1,-1.6],s:[2.2,1.7,.13],m:2});
  targets.push({p:[1.25,1,-1.6],s:[2.2,1.7,.13],m:0});
  targets.forEach((target,i) => {
    const mesh = new THREE.Mesh(cube, materials[target.m]);
    mesh.scale.fromArray(target.s); root.add(mesh);
    const a = i * 2.39996;
    const r = 2.1 + (i % 4) * .65;
    pieces.push({ mesh, target: new THREE.Vector3(...target.p), start: new THREE.Vector3(Math.cos(a)*r, Math.sin(a)*r*.77, Math.sin(i*3.7)*2.5), rotation: new THREE.Euler(i*.61,i*.39,i*.87), phase:i*.7 });
  });
  const base = new THREE.Mesh(new RoundedBoxGeometry(6.5,.16,4.6,3,.07), new THREE.MeshStandardMaterial({color:0x223b58, metalness:.4,roughness:.4}));
  base.position.y=-2.25; root.add(base);
  const grid = new THREE.GridHelper(28,28,0x486482,0x233d5a);
  grid.position.y=-3.6; scene.add(grid);
  const journey = document.querySelector('.cinema-journey');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 700px)');
  let frame = 0, disposed = false, visible = true, elapsed = 0, last = 0;
  const pointer = new THREE.Vector2();
  const pointerTarget = new THREE.Vector2();
  const onPointer = event => {
    if (paused || reduced.matches || event.pointerType !== 'mouse') return;
    const rect = host.getBoundingClientRect();
    pointerTarget.set((event.clientX-rect.left)/rect.width-.5,(event.clientY-rect.top)/rect.height-.5);
  };
  const onLeave = () => pointerTarget.set(0,0);
  host.addEventListener('pointermove', onPointer); host.addEventListener('pointerleave',onLeave);
  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix();
    camera.position.z = w/h < 1 ? 22 : 16;
  };
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
  const ease = t => t*t*(3-2*t);
  function render(time) {
    if (disposed) return;
    frame = requestAnimationFrame(render);
    if (!visible || document.hidden) { last = time; return; }
    if (!paused && !reduced.matches) elapsed += Math.min((time-last)/1000,.05);
    last=time;
    const rect = journey.getBoundingClientRect();
    const raw = Math.max(0, Math.min(1,-rect.top / Math.max(1,journey.offsetHeight-innerHeight)));
    const progress = reduced.matches ? 1 : ease(raw);
    pointer.lerp(pointerTarget,.045);
    root.rotation.set(.12 + pointer.y*.12, -.43 + pointer.x*.2 + (1-progress)*elapsed*.045, -.05*(1-progress));
    root.position.x = narrow.matches ? 0 : -progress*1.65;
    const scale = narrow.matches ? .68 : 1-progress*.12;
    root.scale.setScalar(scale);
    pieces.forEach(({mesh,target,start,rotation,phase}) => {
      mesh.position.lerpVectors(start,target,progress);
      mesh.position.y += Math.sin(elapsed*.55+phase)*.15*(1-progress);
      mesh.rotation.set((rotation.x + elapsed*.08)*(1-progress),(rotation.y+elapsed*.09)*(1-progress),rotation.z*(1-progress));
    });
    base.scale.setScalar(.7+.3*progress); base.position.y=-3+progress*.75;
    renderer.render(scene,camera);
    const state = document.querySelector('[data-cinema-state]');
    const label = progress>.75 ? 'ONE CONNECTED PICTURE' : progress>.25 ? 'CONNECTING THE DAY' : 'SCATTERED SIGNALS';
    if (state.textContent!==label) state.textContent=label;
  }
  // Only replace the CSS illustration after the renderer has successfully initialized.
  resize(); renderer.render(scene,camera); host.replaceChildren(renderer.domElement);
  const observer = new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}); observer.observe(host);
  frame=requestAnimationFrame(render);
  return {
    setPaused(value) { paused=value; },
    dispose() {
      disposed=true; cancelAnimationFrame(frame); resizeObserver.disconnect(); observer.disconnect();
      host.removeEventListener('pointermove',onPointer); host.removeEventListener('pointerleave',onLeave);
      cube.dispose(); base.geometry.dispose(); base.material.dispose();
      grid.geometry.dispose(); grid.material.dispose(); materials.forEach(m=>m.dispose());
      environment.dispose(); renderer.dispose();
    },
  };
}
