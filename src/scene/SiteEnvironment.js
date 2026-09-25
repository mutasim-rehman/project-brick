import * as THREE from 'three';

// Deterministic PRNG so procedural textures are identical across reloads
const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Tileable multi-octave value noise in [0, 1]
function valueNoiseField(size, octaves, rand) {
  const field = new Float32Array(size * size);
  let amp = 1;
  let total = 0;
  for (let o = 0; o < octaves; o++) {
    const cells = 4 << o;
    const grid = new Float32Array(cells * cells).map(() => rand());
    const step = size / cells;
    for (let y = 0; y < size; y++) {
      const gy = y / step;
      const y0 = Math.floor(gy) % cells;
      const y1 = (y0 + 1) % cells;
      let fy = gy - Math.floor(gy);
      fy = fy * fy * (3 - 2 * fy);
      for (let x = 0; x < size; x++) {
        const gx = x / step;
        const x0 = Math.floor(gx) % cells;
        const x1 = (x0 + 1) % cells;
        let fx = gx - Math.floor(gx);
        fx = fx * fx * (3 - 2 * fx);
        const a = grid[y0 * cells + x0];
        const b = grid[y0 * cells + x1];
        const c = grid[y1 * cells + x0];
        const d = grid[y1 * cells + x1];
        field[y * size + x] += amp * (a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy);
      }
    }
    total += amp;
    amp *= 0.5;
  }
  for (let i = 0; i < field.length; i++) field[i] /= total;
  return field;
}

function canvasTexture(size, paint, repeat) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  paint(img.data);
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Near-white grain map meant to modulate a material's base color
export function createNoiseTexture(size = 256, contrast = 0.1, repeat = 1, seed = 7) {
  const rand = mulberry32(seed);
  const field = valueNoiseField(size, 5, rand);
  return canvasTexture(size, (data) => {
    for (let i = 0; i < size * size; i++) {
      const speck = rand() < 0.015 ? rand() * 0.5 : 0;
      const v = 255 * (1 - contrast * (field[i] + speck));
      data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = v;
      data[i * 4 + 3] = 255;
    }
  }, repeat);
}

// Compacted, tyre-worn construction earth with gravel speckle
export function createSiteDirtTexture(size = 512) {
  const rand = mulberry32(42);
  const broad = valueNoiseField(size, 4, rand);
  const fine = valueNoiseField(size, 6, rand);
  const base = new THREE.Color(0xd2c1a3);
  const dark = new THREE.Color(0xb39c7c);
  const c = new THREE.Color();
  return canvasTexture(size, (data) => {
    for (let i = 0; i < size * size; i++) {
      const n = broad[i] * 0.45 + fine[i] * 0.55;
      c.copy(base).lerp(dark, THREE.MathUtils.smoothstep(n, 0.3, 0.75));
      const pebble = rand() < 0.02 ? 0.82 + rand() * 0.3 : 1;
      data[i * 4] = Math.min(255, c.r * 255 * pebble);
      data[i * 4 + 1] = Math.min(255, c.g * 255 * pebble);
      data[i * 4 + 2] = Math.min(255, c.b * 255 * pebble);
      data[i * 4 + 3] = 255;
    }
  }, 1 / 14);
}

const skyVertex = /* glsl */`
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const skyFragment = /* glsl */`
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uGround;
  uniform vec3 uSunColor;
  uniform vec3 uSunDir;
  varying vec3 vDir;
  void main() {
    vec3 dir = normalize(vDir);
    float h = dir.y;
    vec3 col = mix(uHorizon, uZenith, pow(smoothstep(0.0, 1.0, h), 0.55));
    col = mix(col, uGround, smoothstep(0.0, -0.25, h));
    float sd = max(dot(dir, normalize(uSunDir)), 0.0);
    col += uSunColor * (pow(sd, 900.0) * 18.0 + pow(sd, 24.0) * 0.35 + pow(sd, 4.0) * 0.08);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const SKY_PRESETS = {
  day: { zenith: 0x6fb6d8, horizon: 0xdff1f4, ground: 0xcfe3e8, sun: 0xfff1d6 },
  sunset: { zenith: 0x5d6fa3, horizon: 0xffd2a8, ground: 0xe8c4a8, sun: 0xffa45c },
  night: { zenith: 0x040b16, horizon: 0x0f2233, ground: 0x07121c, sun: 0x3a6fa0 },
  blueprint: { zenith: 0x060f1e, horizon: 0x0b1a30, ground: 0x060f1e, sun: 0x000000 }
};

// Gradient sky dome with sun disc/halo; follows the camera so it never clips
export function createSkyDome(sunDir) {
  const material = new THREE.ShaderMaterial({
    vertexShader: skyVertex,
    fragmentShader: skyFragment,
    uniforms: {
      uZenith: { value: new THREE.Color() },
      uHorizon: { value: new THREE.Color() },
      uGround: { value: new THREE.Color() },
      uSunColor: { value: new THREE.Color() },
      uSunDir: { value: sunDir.clone().normalize() }
    },
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    fog: false
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 48, 24), material);
  sky.renderOrder = -1000;
  sky.frustumCulled = false;
  sky.name = 'SkyDome';
  applySkyPreset(sky, 'day');
  return sky;
}

export function applySkyPreset(sky, name) {
  const p = SKY_PRESETS[name] || SKY_PRESETS.day;
  const u = sky.material.uniforms;
  u.uZenith.value.setHex(p.zenith);
  u.uHorizon.value.setHex(p.horizon);
  u.uGround.value.setHex(p.ground);
  u.uSunColor.value.setHex(p.sun);
  return p;
}

// Prefiltered reflection map baked from the sky so glass, steel and paint pick up real sky reflections
export function bakeEnvironment(renderer, sky, previous) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const envSky = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), sky.material);
  envScene.add(envSky);
  const target = pmrem.fromScene(envScene, 0.02);
  envSky.geometry.dispose();
  pmrem.dispose();
  if (previous) previous.dispose();
  return target;
}
