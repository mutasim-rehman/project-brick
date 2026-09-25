import * as THREE from 'three';

const _direction = new THREE.Vector3();
const _midpoint = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _matrix = new THREE.Matrix4();
const _quaternion = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _position = new THREE.Vector3();
const _axisZ = new THREE.Vector3(0, 0, 1);
const _ramStart = new THREE.Vector3();
const _ramEnd = new THREE.Vector3();
const _ramDirection = new THREE.Vector3();
const _barrelEnd = new THREE.Vector3();
const _rodStart = new THREE.Vector3();

const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

function createCanvasTexture(size, repeat, painter) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d');
  painter(context, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function createPaintWearTexture(size = 256, seed = 71) {
  const random = mulberry32(seed);
  return createCanvasTexture(size, 1.5, (ctx, s) => {
    ctx.fillStyle = '#f7f3e9';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < s * 0.75; i++) {
      const length = 2 + random() * 15;
      const shade = Math.floor(178 + random() * 58);
      ctx.strokeStyle = `rgba(${shade},${shade},${shade},${0.035 + random() * 0.13})`;
      ctx.lineWidth = 0.4 + random() * 1.4;
      ctx.beginPath();
      const x = random() * s;
      const y = random() * s;
      ctx.moveTo(x, y);
      ctx.lineTo(x + length, y + (random() - 0.5) * 4);
      ctx.stroke();
    }
    for (let i = 0; i < s * 0.15; i++) {
      const r = 0.4 + random() * 2.2;
      ctx.fillStyle = `rgba(76,58,43,${0.04 + random() * 0.12})`;
      ctx.beginPath();
      ctx.arc(random() * s, random() * s, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

export function createRubberTexture(size = 256) {
  return createCanvasTexture(size, 3, (ctx, s) => {
    ctx.fillStyle = '#d8d8d8';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = 'rgba(45,45,45,0.24)';
    ctx.lineWidth = Math.max(2, s / 48);
    for (let y = -s; y < s * 2; y += s / 8) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(s, y + s * 0.35);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s, y);
      ctx.lineTo(0, y + s * 0.35);
      ctx.stroke();
    }
  });
}

export function createWarningStripeTexture(size = 256) {
  return createCanvasTexture(size, 1, (ctx, s) => {
    ctx.fillStyle = '#f4a000';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#1e2328';
    const stripe = s / 5;
    for (let x = -s; x < s * 2; x += stripe * 2) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + stripe, 0);
      ctx.lineTo(x + stripe + s, s);
      ctx.lineTo(x + s, s);
      ctx.closePath();
      ctx.fill();
    }
  });
}

export function createTrackMarkTexture(size = 512) {
  const random = mulberry32(104);
  return createCanvasTexture(size, 1, (ctx, s) => {
    ctx.clearRect(0, 0, s, s);
    const band = s * 0.2;
    [s * 0.27, s * 0.73].forEach((center) => {
      ctx.fillStyle = 'rgba(66,49,34,0.13)';
      ctx.fillRect(center - band / 2, 0, band, s);
      for (let y = -20; y < s + 20; y += s / 20) {
        const jitter = (random() - 0.5) * 5;
        ctx.fillStyle = `rgba(47,36,27,${0.2 + random() * 0.12})`;
        ctx.save();
        ctx.translate(center + jitter, y);
        ctx.rotate((random() - 0.5) * 0.12);
        ctx.fillRect(-band * 0.43, -s / 80, band * 0.86, s / 40);
        ctx.restore();
      }
    });
  });
}

export function createProfileGeometry(points, depth, options = {}) {
  const shape = new THREE.Shape();
  points.forEach(([x, y], index) => {
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  const bevelSize = options.bevelSize ?? 0.04;
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    steps: 1,
    bevelEnabled: bevelSize > 0,
    bevelSegments: options.bevelSegments ?? 2,
    bevelSize,
    bevelThickness: options.bevelThickness ?? bevelSize,
    curveSegments: options.curveSegments ?? 8
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

export function createRoundedPanelGeometry(width, height, depth, radius = 0.12) {
  const r = Math.min(radius, width / 2, height / 2);
  const points = [
    [-width / 2 + r, -height / 2], [width / 2 - r, -height / 2],
    [width / 2, -height / 2 + r], [width / 2, height / 2 - r],
    [width / 2 - r, height / 2], [-width / 2 + r, height / 2],
    [-width / 2, height / 2 - r], [-width / 2, -height / 2 + r]
  ];
  return createProfileGeometry(points, depth, { bevelSize: Math.min(0.04, depth * 0.15) });
}

export function setCylinderBetween(object, start, end, radiusScale = 1) {
  _direction.subVectors(end, start);
  const length = Math.max(0.001, _direction.length());
  _midpoint.copy(start).addScaledVector(_direction, 0.5);
  _quaternion.setFromUnitVectors(_up, _direction.normalize());
  object.position.copy(_midpoint);
  object.quaternion.copy(_quaternion);
  object.scale.set(radiusScale, length, radiusScale);
  return length;
}

export function createHydraulicRig(materials, options = {}) {
  const rig = new THREE.Group();
  const segments = options.segments ?? 16;
  const barrelRadius = options.barrelRadius ?? 0.12;
  const rodRadius = options.rodRadius ?? barrelRadius * 0.58;
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(barrelRadius, barrelRadius, 1, segments),
    options.barrelMaterial ?? materials.craneYellowDark
  );
  const rod = new THREE.Mesh(
    new THREE.CylinderGeometry(rodRadius, rodRadius, 1, segments),
    options.rodMaterial ?? materials.chrome
  );
  const pinGeometry = new THREE.CylinderGeometry(barrelRadius * 1.35, barrelRadius * 1.35, barrelRadius * 0.9, segments);
  const pinA = new THREE.Mesh(pinGeometry, materials.steelDark);
  const pinB = new THREE.Mesh(pinGeometry, materials.steelDark);
  pinA.rotation.x = pinB.rotation.x = Math.PI / 2;
  [barrel, rod, pinA, pinB].forEach((part) => {
    part.castShadow = true;
    rig.add(part);
  });
  rig.userData.parts = { barrel, rod, pinA, pinB };
  return rig;
}

export function syncHydraulicRig(rig, startAnchor, endAnchor, localParent, barrelFraction = 0.58) {
  startAnchor.getWorldPosition(_ramStart);
  endAnchor.getWorldPosition(_ramEnd);
  localParent.worldToLocal(_ramStart);
  localParent.worldToLocal(_ramEnd);
  _ramDirection.subVectors(_ramEnd, _ramStart);
  const length = Math.max(0.01, _ramDirection.length());
  _ramDirection.normalize();
  const { barrel, rod, pinA, pinB } = rig.userData.parts;
  const barrelLength = Math.min(length * barrelFraction, length - 0.08);
  const rodLength = Math.max(0.08, length - barrelLength * 0.68);
  _barrelEnd.copy(_ramStart).addScaledVector(_ramDirection, barrelLength);
  _rodStart.copy(_ramEnd).addScaledVector(_ramDirection, -rodLength);
  setCylinderBetween(barrel, _ramStart, _barrelEnd);
  setCylinderBetween(rod, _rodStart, _ramEnd);
  pinA.position.copy(_ramStart);
  pinB.position.copy(_ramEnd);
  return length;
}

export function createSegmentChain(count, radius, material, radialSegments = 8) {
  const group = new THREE.Group();
  const segments = [];
  const geometry = new THREE.CylinderGeometry(radius, radius, 1, radialSegments);
  for (let i = 0; i < count; i++) {
    const segment = new THREE.Mesh(geometry, material);
    segment.castShadow = true;
    segments.push(segment);
    group.add(segment);
  }
  group.userData.segments = segments;
  return group;
}

export function syncSegmentChain(chain, points) {
  const segments = chain.userData.segments;
  for (let i = 0; i < segments.length; i++) {
    setCylinderBetween(segments[i], points[i], points[i + 1]);
  }
}

export function setInstancedTrackPose(mesh, index, u, length, height, z, padSize) {
  const perimeter = 2 * length + Math.PI * height;
  let distance = ((u % 1) + 1) % 1 * perimeter;
  const radius = height / 2;
  let x;
  let y;
  let angle;
  if (distance < length) {
    x = -length / 2 + distance;
    y = radius;
    angle = 0;
  } else if ((distance -= length) < Math.PI * radius) {
    const a = Math.PI / 2 - distance / radius;
    x = length / 2 + Math.cos(a) * radius;
    y = Math.sin(a) * radius;
    angle = a - Math.PI / 2;
  } else if ((distance -= Math.PI * radius) < length) {
    x = length / 2 - distance;
    y = -radius;
    angle = Math.PI;
  } else {
    distance -= length;
    const a = -Math.PI / 2 - distance / radius;
    x = -length / 2 + Math.cos(a) * radius;
    y = Math.sin(a) * radius;
    angle = a - Math.PI / 2;
  }
  _quaternion.setFromAxisAngle(_axisZ, angle);
  _scale.set(padSize, 1, 1);
  _position.set(x, y, z);
  _matrix.compose(_position, _quaternion, _scale);
  mesh.setMatrixAt(index, _matrix);
}
