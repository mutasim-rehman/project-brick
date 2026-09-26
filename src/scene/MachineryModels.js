import * as THREE from 'three';
import {
  createHydraulicRig,
  createProfileGeometry,
  createRoundedPanelGeometry,
  createSegmentChain,
  setCylinderBetween,
  setInstancedTrackPose,
  syncHydraulicRig,
  syncSegmentChain
} from './ProceduralGeometry.js';

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _d = new THREE.Vector3();

function shadow(mesh, receive = false) {
  mesh.castShadow = true;
  mesh.receiveShadow = receive;
  return mesh;
}

function anchor(parent, position, name) {
  const point = new THREE.Object3D();
  point.name = name;
  point.position.fromArray(position);
  parent.add(point);
  return point;
}

function createTrackAssembly(materials, detail, z) {
  const group = new THREE.Group();
  group.position.set(0, 0.67, z);

  const frameProfile = [
    [-2.15, -0.34], [1.95, -0.34], [2.4, -0.05], [2.05, 0.38],
    [-1.9, 0.38], [-2.4, 0.04]
  ];
  const frame = shadow(new THREE.Mesh(
    createProfileGeometry(frameProfile, 0.62, { bevelSize: 0.07, bevelSegments: detail === 'high' ? 3 : 1 }),
    materials.trackFrame ?? materials.steelDark
  ));
  group.add(frame);

  const wheelMaterial = materials.trackWheel ?? materials.craneGrey;
  const wheelSpecs = [
    [-1.92, 0.02, 0.43], [1.92, 0.02, 0.43],
    [-1.2, -0.15, 0.24], [-0.6, -0.15, 0.24], [0, -0.15, 0.24], [0.6, -0.15, 0.24], [1.2, -0.15, 0.24]
  ];
  const wheels = [];
  wheelSpecs.forEach(([x, y, radius], index) => {
    const wheel = shadow(new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, 0.69, detail === 'high' ? 24 : 14),
      wheelMaterial
    ));
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(x, y, 0);
    group.add(wheel);
    wheels.push(wheel);
    if (index < 2) {
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.36, radius * 0.36, 0.72, 14),
        materials.steelSilver
      );
      hub.rotation.x = Math.PI / 2;
      hub.position.copy(wheel.position);
      group.add(hub);
    }
  });

  const padCount = detail === 'high' ? 42 : 28;
  const padGeometry = new THREE.BoxGeometry(1, 0.12, 0.82);
  const pads = new THREE.InstancedMesh(padGeometry, materials.trackShoe ?? materials.steelDark, padCount);
  pads.castShadow = true;
  pads.receiveShadow = true;
  const path = { length: 4.45, height: 0.88, z: 0, padSize: 0.36, count: padCount, phase: 0 };
  for (let i = 0; i < padCount; i++) {
    setInstancedTrackPose(pads, i, i / padCount, path.length, path.height, path.z, path.padSize);
  }
  pads.instanceMatrix.needsUpdate = true;
  group.add(pads);

  const guard = new THREE.Mesh(
    createRoundedPanelGeometry(3.4, 0.32, 0.68, 0.12),
    materials.craneYellowDark
  );
  guard.position.set(0, 0.17, 0);
  group.add(guard);

  return { group, pads, wheels, path };
}

function createCab(materials, detail) {
  const cab = new THREE.Group();
  const shellProfile = [
    [-0.88, 0], [0.72, 0], [0.9, 0.28], [0.62, 2.25],
    [0.34, 2.52], [-0.72, 2.45], [-0.92, 2.08]
  ];
  const shell = shadow(new THREE.Mesh(
    createProfileGeometry(shellProfile, 1.45, { bevelSize: 0.06, bevelSegments: detail === 'high' ? 3 : 1 }),
    materials.craneYellow
  ));
  cab.add(shell);

  const sideWindowProfile = [[-0.58, 1.08], [0.5, 1.08], [0.58, 2.15], [-0.48, 2.22], [-0.65, 1.92]];
  const sideWindow = new THREE.Mesh(
    createProfileGeometry(sideWindowProfile, 0.035, { bevelSize: 0.01, bevelSegments: 1 }),
    materials.glassCab
  );
  sideWindow.position.z = 0.746;
  cab.add(sideWindow);

  const sideFrame = new THREE.Mesh(new THREE.BoxGeometry(0.085, 1.22, 0.055), materials.cabFrame ?? materials.steelDark);
  sideFrame.position.set(-0.04, 1.65, 0.78);
  sideFrame.rotation.z = -0.03;
  cab.add(sideFrame);

  const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(0.055, 1.34, 1.2), materials.glassCab);
  frontGlass.position.set(0.76, 1.55, 0);
  frontGlass.rotation.z = -0.14;
  cab.add(frontGlass);

  const frontPillarGeometry = new THREE.BoxGeometry(0.075, 1.48, 0.075);
  [-0.64, 0.64].forEach((z) => {
    const pillar = new THREE.Mesh(frontPillarGeometry, materials.cabFrame ?? materials.steelDark);
    pillar.position.set(0.79, 1.57, z);
    pillar.rotation.z = -0.14;
    cab.add(pillar);
  });

  const doorSeam = new THREE.Mesh(new THREE.BoxGeometry(0.025, 2.0, 0.018), materials.steelDark);
  doorSeam.position.set(-0.62, 1.15, 0.77);
  cab.add(doorSeam);

  const seatBase = new THREE.Mesh(createRoundedPanelGeometry(0.52, 0.55, 0.5, 0.08), materials.seat ?? materials.steelDark);
  seatBase.position.set(-0.25, 0.62, 0.05);
  cab.add(seatBase);
  const seatBack = new THREE.Mesh(createRoundedPanelGeometry(0.48, 0.72, 0.18, 0.08), materials.seat ?? materials.steelDark);
  seatBack.position.set(-0.42, 1.05, 0.05);
  seatBack.rotation.z = -0.12;
  cab.add(seatBack);

  [-0.22, 0.22].forEach((z) => {
    const joystick = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.4, 8), materials.hoseBlack);
    joystick.position.set(0.15, 0.78, z);
    joystick.rotation.z = -0.3;
    cab.add(joystick);
  });

  const roof = shadow(new THREE.Mesh(createRoundedPanelGeometry(1.85, 0.13, 1.6, 0.08), materials.craneYellowDark));
  roof.rotation.z = 0.01;
  roof.position.set(-0.02, 2.52, 0);
  cab.add(roof);

  const mirrorStem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.55, 6), materials.steelDark);
  mirrorStem.position.set(0.84, 1.85, 0.94);
  mirrorStem.rotation.x = Math.PI / 2;
  cab.add(mirrorStem);
  const mirror = new THREE.Mesh(createRoundedPanelGeometry(0.28, 0.42, 0.06, 0.06), materials.mirror ?? materials.steelDark);
  mirror.position.set(0.84, 1.85, 1.2);
  mirror.rotation.y = Math.PI / 2;
  cab.add(mirror);

  return cab;
}

function createBoom(materials, detail) {
  const boom = new THREE.Group();
  const profile = [
    [-0.15, -0.24], [0.5, -0.1], [2.1, 1.2], [4.25, 2.85],
    [4.78, 3.12], [4.48, 3.53], [3.92, 3.35], [1.85, 1.92], [0.12, 0.48]
  ];
  const body = shadow(new THREE.Mesh(
    createProfileGeometry(profile, 0.64, { bevelSize: 0.055, bevelSegments: detail === 'high' ? 3 : 1 }),
    materials.craneYellow
  ));
  boom.add(body);

  const insetProfile = [[0.48, 0.22], [2.12, 1.48], [4.08, 3.02], [3.55, 2.74], [1.98, 1.62]];
  [-0.333, 0.333].forEach((z) => {
    const inset = new THREE.Mesh(createProfileGeometry(insetProfile, 0.025, { bevelSize: 0 }), materials.craneYellowDark);
    inset.position.z = z;
    boom.add(inset);
  });

  const bossGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.76, detail === 'high' ? 24 : 14);
  [[0, 0], [4.66, 3.3]].forEach(([x, y]) => {
    const boss = new THREE.Mesh(bossGeometry, materials.craneYellowDark);
    boss.rotation.x = Math.PI / 2;
    boss.position.set(x, y, 0);
    boom.add(boss);
  });
  return boom;
}

function createStick(materials, detail) {
  const stick = new THREE.Group();
  const profile = [
    [-0.22, 0.25], [0.35, 0.35], [3.28, -2.52], [3.35, -2.95],
    [2.95, -2.98], [1.15, -1.35], [-0.16, 0.02]
  ];
  const body = shadow(new THREE.Mesh(
    createProfileGeometry(profile, 0.52, { bevelSize: 0.045, bevelSegments: detail === 'high' ? 3 : 1 }),
    materials.craneYellow
  ));
  stick.add(body);

  const bossGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.64, detail === 'high' ? 22 : 12);
  [[0, 0], [3.2, -2.78]].forEach(([x, y]) => {
    const boss = new THREE.Mesh(bossGeometry, materials.craneYellowDark);
    boss.rotation.x = Math.PI / 2;
    boss.position.set(x, y, 0);
    stick.add(boss);
  });
  return stick;
}

function createBucket(materials, detail) {
  const bucket = new THREE.Group();
  const cheekProfile = [
    [-0.42, 0.32], [0.38, 0.42], [1.18, 0.02], [1.62, -0.55],
    [1.45, -1.08], [0.54, -1.2], [-0.22, -0.72]
  ];
  [-0.68, 0.68].forEach((z) => {
    const cheek = shadow(new THREE.Mesh(
      createProfileGeometry(cheekProfile, 0.09, { bevelSize: 0.025, bevelSegments: detail === 'high' ? 2 : 1 }),
      materials.bucketSteel ?? materials.steelDark
    ));
    cheek.position.z = z;
    bucket.add(cheek);
  });

  const shellPath = [[-0.18, 0.2], [0.4, 0.32], [1.05, -0.02], [1.42, -0.58], [1.3, -0.94]];
  for (let i = 0; i < shellPath.length - 1; i++) {
    const [x1, y1] = shellPath[i];
    const [x2, y2] = shellPath[i + 1];
    const length = Math.hypot(x2 - x1, y2 - y1);
    const panel = shadow(new THREE.Mesh(
      new THREE.BoxGeometry(length + 0.04, 0.11, 1.38),
      materials.bucketSteel ?? materials.steelDark
    ));
    panel.position.set((x1 + x2) / 2, (y1 + y2) / 2, 0);
    panel.rotation.z = Math.atan2(y2 - y1, x2 - x1);
    bucket.add(panel);
  }

  const cuttingEdge = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.17, 1.55), materials.wornSteel ?? materials.steelSilver));
  cuttingEdge.position.set(1.55, -1.0, 0);
  cuttingEdge.rotation.z = -0.28;
  bucket.add(cuttingEdge);

  const toothGeometry = createProfileGeometry(
    [[-0.12, -0.1], [0.28, -0.09], [0.7, 0], [0.22, 0.13], [-0.12, 0.1]],
    0.16,
    { bevelSize: 0.018, bevelSegments: 1 }
  );
  for (let i = 0; i < 5; i++) {
    const tooth = shadow(new THREE.Mesh(toothGeometry, materials.wornSteel ?? materials.steelSilver));
    tooth.position.set(1.66, -1.03, -0.48 + i * 0.24);
    tooth.rotation.z = -0.2;
    bucket.add(tooth);
  }

  const load = new THREE.Group();
  [[0.45, -0.35, -0.28, 0.52], [0.8, -0.48, 0.2, 0.48], [0.18, -0.42, 0.28, 0.38]].forEach(([x, y, z, scale], i) => {
    const clod = new THREE.Mesh(new THREE.DodecahedronGeometry(scale, detail === 'high' ? 1 : 0), materials.excavationSoil);
    clod.position.set(x, y, z);
    clod.scale.y = 0.72 + i * 0.08;
    clod.castShadow = true;
    load.add(clod);
  });
  load.visible = false;
  bucket.add(load);

  return { group: bucket, load };
}

function getAnchorLocal(anchorObject, parent, target) {
  anchorObject.getWorldPosition(target);
  return parent.worldToLocal(target);
}

export function updateExcavatorMechanics(rig) {
  rig.hydraulics.forEach(({ mechanism, start, end, fraction }) => {
    syncHydraulicRig(mechanism, start, end, rig.house, fraction);
  });

  const hoseStart = getAnchorLocal(rig.hoseAnchors[0], rig.house, _a);
  const hoseEnd = getAnchorLocal(rig.hoseAnchors[1], rig.house, _d);
  _b.lerpVectors(hoseStart, hoseEnd, 0.34);
  _b.y += 0.34;
  _b.z += 0.14;
  _c.lerpVectors(hoseStart, hoseEnd, 0.68);
  _c.y += 0.25;
  _c.z += 0.16;
  syncSegmentChain(rig.hose, [hoseStart, _b, _c, hoseEnd]);
}

export function setExcavatorTrackTravel(rig, distance) {
  rig.trackAssemblies.forEach((assembly, side) => {
    const path = assembly.path;
    path.phase = distance / (2 * path.length + Math.PI * path.height) * (side === 0 ? 1 : 0.985);
    for (let i = 0; i < path.count; i++) {
      setInstancedTrackPose(
        assembly.pads,
        i,
        i / path.count + path.phase,
        path.length,
        path.height,
        path.z,
        path.padSize
      );
    }
    assembly.pads.instanceMatrix.needsUpdate = true;
    assembly.wheels.forEach((wheel) => { wheel.rotation.y = -distance / 0.43; });
  });
}

export function buildExcavator(materials, detail = 'high') {
  const root = new THREE.Group();
  root.name = 'HydraulicExcavator';

  const undercarriage = new THREE.Group();
  const trackAssemblies = [-1.17, 1.17].map((z) => createTrackAssembly(materials, detail, z));
  trackAssemblies.forEach(({ group }) => undercarriage.add(group));
  const crossMember = shadow(new THREE.Mesh(createRoundedPanelGeometry(2.4, 0.55, 2.55, 0.13), materials.steelDark));
  crossMember.rotation.x = -Math.PI / 2;
  crossMember.position.y = 0.95;
  undercarriage.add(crossMember);
  const turntable = shadow(new THREE.Mesh(
    new THREE.CylinderGeometry(1.24, 1.34, 0.34, detail === 'high' ? 32 : 18),
    materials.craneGrey
  ));
  turntable.position.y = 1.27;
  undercarriage.add(turntable);
  root.add(undercarriage);

  const house = new THREE.Group();
  house.name = 'ExcavatorHouse';
  house.position.y = 1.42;

  const deck = shadow(new THREE.Mesh(createRoundedPanelGeometry(3.9, 0.18, 2.75, 0.14), materials.steelDark));
  deck.rotation.x = -Math.PI / 2;
  deck.position.set(-0.18, 0.05, 0);
  house.add(deck);

  const counterProfile = [[-2.1, 0.1], [-0.55, 0.02], [-0.2, 0.38], [-0.36, 1.52], [-0.78, 1.88], [-1.88, 1.72], [-2.25, 1.22]];
  const counterweight = shadow(new THREE.Mesh(
    createProfileGeometry(counterProfile, 2.48, { bevelSize: 0.15, bevelSegments: detail === 'high' ? 4 : 2 }),
    materials.craneYellowDark
  ));
  counterweight.position.z = -0.03;
  house.add(counterweight);

  const hoodProfile = [[-0.72, 0.12], [0.72, 0.12], [0.92, 0.46], [0.76, 1.4], [0.4, 1.58], [-0.7, 1.5]];
  const hood = shadow(new THREE.Mesh(
    createProfileGeometry(hoodProfile, 1.25, { bevelSize: 0.08, bevelSegments: detail === 'high' ? 3 : 1 }),
    materials.craneYellow
  ));
  hood.position.set(-0.02, 0, -0.7);
  house.add(hood);

  const vent = new THREE.InstancedMesh(new THREE.BoxGeometry(0.045, 0.58, 0.045), materials.steelDark, 7);
  const ventMatrix = new THREE.Matrix4();
  for (let i = 0; i < 7; i++) {
    ventMatrix.makeTranslation(-0.5 + i * 0.17, 0.82, -1.345);
    vent.setMatrixAt(i, ventMatrix);
  }
  vent.castShadow = true;
  house.add(vent);

  const cab = createCab(materials, detail);
  cab.position.set(0.08, 0.1, 0.72);
  house.add(cab);

  const exhaust = new THREE.Group();
  const muffler = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.72, 14), materials.steelDark));
  muffler.position.y = 0.36;
  exhaust.add(muffler);
  const pipe = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.66, 10), materials.steelDark));
  pipe.position.y = 1.02;
  exhaust.add(pipe);
  exhaust.position.set(-0.72, 1.35, -0.78);
  house.add(exhaust);

  const stepGeometry = new THREE.BoxGeometry(0.56, 0.07, 0.33);
  for (let i = 0; i < 3; i++) {
    const step = new THREE.Mesh(stepGeometry, materials.steelSilver);
    step.position.set(0.42 + i * 0.18, 0.12 + i * 0.18, 1.46);
    house.add(step);
  }

  const boomPivot = new THREE.Group();
  boomPivot.name = 'BoomPivot';
  boomPivot.position.set(0.92, 0.82, 0);
  boomPivot.add(createBoom(materials, detail));

  const stickPivot = new THREE.Group();
  stickPivot.name = 'StickPivot';
  stickPivot.position.set(4.66, 3.3, 0);
  stickPivot.add(createStick(materials, detail));

  const bucketPivot = new THREE.Group();
  bucketPivot.name = 'BucketPivot';
  bucketPivot.position.set(3.2, -2.78, 0);
  const bucket = createBucket(materials, detail);
  bucketPivot.add(bucket.group);

  stickPivot.add(bucketPivot);
  boomPivot.add(stickPivot);
  house.add(boomPivot);
  root.add(house);

  const boomStartL = anchor(house, [0.18, 0.52, -0.4], 'BoomCylinderStartL');
  const boomStartR = anchor(house, [0.18, 0.52, 0.4], 'BoomCylinderStartR');
  const boomEndL = anchor(boomPivot, [2.28, 1.72, -0.4], 'BoomCylinderEndL');
  const boomEndR = anchor(boomPivot, [2.28, 1.72, 0.4], 'BoomCylinderEndR');
  const stickStart = anchor(boomPivot, [2.45, 2.15, 0], 'StickCylinderStart');
  const stickEnd = anchor(stickPivot, [0.72, 0.28, 0], 'StickCylinderEnd');
  const bucketStart = anchor(stickPivot, [1.25, -0.55, 0], 'BucketCylinderStart');
  const bucketEnd = anchor(bucketPivot, [-0.2, 0.28, 0], 'BucketCylinderEnd');

  const hydraulicSpecs = [
    [boomStartL, boomEndL, 0.54, 0.11], [boomStartR, boomEndR, 0.54, 0.11],
    [stickStart, stickEnd, 0.57, 0.12], [bucketStart, bucketEnd, 0.55, 0.1]
  ];
  const hydraulics = hydraulicSpecs.map(([start, end, fraction, radius]) => {
    const mechanism = createHydraulicRig(materials, { barrelRadius: radius, segments: detail === 'high' ? 16 : 10 });
    house.add(mechanism);
    return { mechanism, start, end, fraction };
  });

  const hose = createSegmentChain(3, 0.035, materials.hoseBlack, detail === 'high' ? 10 : 6);
  house.add(hose);
  const hoseAnchors = [
    anchor(boomPivot, [0.2, 0.58, 0.42], 'HoseStart'),
    anchor(stickPivot, [1.25, -0.85, 0.34], 'HoseEnd')
  ];

  const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.16, 12), materials.amberMarker);
  beacon.position.set(-0.25, 2.72, 1.1);
  house.add(beacon);

  const rig = {
    root,
    house,
    boomPivot,
    stickPivot,
    bucketPivot,
    bucketLoad: bucket.load,
    hydraulics,
    hose,
    hoseAnchors,
    trackAssemblies,
    updateMechanics: null,
    setTrackTravel: null
  };
  rig.updateMechanics = () => updateExcavatorMechanics(rig);
  rig.setTrackTravel = (distance) => setExcavatorTrackTravel(rig, distance);
  rig.updateMechanics();
  return rig;
}

function createEarthmoverWheel(materials, detail) {
  const spin = new THREE.Group();
  const radius = 0.72;
  const width = 0.55;
  const tire = shadow(new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, width, detail === 'high' ? 28 : 16),
    materials.rubberTire
  ));
  tire.rotation.x = Math.PI / 2;
  spin.add(tire);
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, width * 1.03, 18), materials.craneYellowDark);
  rim.rotation.x = Math.PI / 2;
  spin.add(rim);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, width * 1.08, 12), materials.steelDark);
  hub.rotation.x = Math.PI / 2;
  spin.add(hub);

  const treadCount = detail === 'high' ? 18 : 12;
  const treads = new THREE.InstancedMesh(new THREE.BoxGeometry(0.24, 0.09, width * 1.06), materials.trackShoe ?? materials.steelDark, treadCount);
  const matrix = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  for (let i = 0; i < treadCount; i++) {
    const angle = i / treadCount * Math.PI * 2;
    q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
    matrix.compose(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0), q, new THREE.Vector3(1, 1, 1));
    treads.setMatrixAt(i, matrix);
  }
  spin.add(treads);
  spin.userData.spinGroup = spin;
  spin.userData.radius = radius;
  return spin;
}

export function buildEarthmoverDumpTruck(materials, detail = 'high') {
  const truck = new THREE.Group();
  truck.name = 'EarthmoverDumpTruck';

  const chassis = shadow(new THREE.Mesh(createRoundedPanelGeometry(8.4, 0.52, 2.2, 0.15), materials.steelDark));
  chassis.rotation.x = -Math.PI / 2;
  chassis.position.y = 1.05;
  truck.add(chassis);

  const cabProfile = [[1.65, 0], [4.05, 0], [4.2, 0.4], [3.65, 2.42], [2.15, 2.42], [1.72, 1.82]];
  const cab = shadow(new THREE.Mesh(
    createProfileGeometry(cabProfile, 2.2, { bevelSize: 0.1, bevelSegments: detail === 'high' ? 3 : 1 }),
    materials.craneYellow
  ));
  cab.position.y = 1.13;
  truck.add(cab);

  const windshieldProfile = [[3.58, 1.06], [4.08, 1.05], [3.68, 2.23], [3.14, 2.23]];
  [-1.115, 1.115].forEach((z) => {
    const sideWindow = new THREE.Mesh(createProfileGeometry(windshieldProfile, 0.035, { bevelSize: 0 }), materials.glassCab);
    sideWindow.position.set(0, 1.13, z);
    truck.add(sideWindow);
  });
  const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.18, 1.72), materials.glassCab);
  frontGlass.position.set(3.93, 2.78, 0);
  frontGlass.rotation.z = -0.27;
  truck.add(frontGlass);

  const bed = new THREE.Group();
  bed.name = 'ReinforcedDumpBed';
  bed.position.set(-1.25, 1.42, 0);
  const bedProfile = [[-2.45, 0], [2.55, 0], [2.2, 1.65], [-1.95, 1.95], [-2.55, 1.35]];
  [-1.34, 1.34].forEach((z) => {
    const side = shadow(new THREE.Mesh(
      createProfileGeometry(bedProfile, 0.1, { bevelSize: 0.035, bevelSegments: detail === 'high' ? 2 : 1 }),
      materials.craneYellowDark
    ));
    side.position.z = z;
    bed.add(side);
  });
  const floor = shadow(new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.18, 2.62), materials.craneYellowDark));
  floor.position.set(0.03, 0.08, 0);
  bed.add(floor);
  const frontWall = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.72, 2.62), materials.craneYellowDark));
  frontWall.position.set(2.42, 0.88, 0);
  frontWall.rotation.z = -0.2;
  bed.add(frontWall);
  for (let i = 0; i < 5; i++) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.45, 0.16), materials.wornSteel ?? materials.steelDark);
    rib.position.set(-1.85 + i * 0.95, 0.8, 1.4);
    rib.rotation.z = -0.08;
    bed.add(rib);
    const ribOpposite = rib.clone();
    ribOpposite.position.z = -1.4;
    bed.add(ribOpposite);
  }
  truck.add(bed);

  const load = new THREE.Group();
  for (let i = 0; i < 7; i++) {
    const clod = new THREE.Mesh(new THREE.DodecahedronGeometry(0.72 + (i % 3) * 0.12, detail === 'high' ? 1 : 0), materials.excavationSoil);
    clod.position.set(-2.85 + (i % 4) * 1.25, 2.75 + (i % 2) * 0.18, -0.62 + Math.floor(i / 4) * 1.15);
    clod.scale.y = 0.55;
    clod.castShadow = true;
    load.add(clod);
  }
  truck.add(load);
  load.userData.baseY = 0;
  truck.userData.load = load;

  const wheels = [];
  [-3.25, -1.25, 2.78].forEach((x) => {
    [-1.38, 1.38].forEach((z) => {
      const wheel = createEarthmoverWheel(materials, detail);
      wheel.position.set(x, 0.76, z);
      truck.add(wheel);
      wheels.push(wheel);
    });
  });
  truck.userData.wheels = wheels;

  const bumper = new THREE.Mesh(createRoundedPanelGeometry(0.38, 0.48, 2.38, 0.08), materials.steelSilver);
  bumper.rotation.y = Math.PI / 2;
  bumper.position.set(4.28, 1.42, 0);
  truck.add(bumper);

  [-0.7, 0.7].forEach((z) => {
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 14), materials.headlamp ?? materials.truckWhite);
    lamp.rotation.z = Math.PI / 2;
    lamp.position.set(4.32, 1.72, z);
    truck.add(lamp);
  });

  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 1.35, 12), materials.steelDark);
  exhaust.position.set(1.5, 3.05, -1.02);
  truck.add(exhaust);

  return truck;
}
