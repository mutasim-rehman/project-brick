import * as THREE from 'three';

const vertexShader = /* glsl */`
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  uniform float uScale;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
    vAlpha = aAlpha;
    vColor = aColor;
  }
`;

const fragmentShader = /* glsl */`
  uniform float uHardness;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float falloff = 1.0 - smoothstep(uHardness, 1.0, d);
    if (falloff <= 0.001 || vAlpha <= 0.001) discard;
    gl_FragColor = vec4(vColor, vAlpha * falloff);
  }
`;

// Fixed-size pool of CPU-simulated particles rendered as soft GPU points
class ParticlePool {
  constructor(max, { blending = THREE.NormalBlending, hardness = 0.0 } = {}) {
    this.max = max;
    this.cursor = 0;
    this.pos = new Float32Array(max * 3);
    this.vel = new Float32Array(max * 3);
    this.col = new Float32Array(max * 3);
    this.size = new Float32Array(max);
    this.alpha = new Float32Array(max);
    this.life = new Float32Array(max);
    this.maxLife = new Float32Array(max).fill(1);
    this.startSize = new Float32Array(max);
    this.endSize = new Float32Array(max);
    this.startAlpha = new Float32Array(max);
    this.gravity = new Float32Array(max);
    this.drag = new Float32Array(max);

    const geo = new THREE.BufferGeometry();
    this.posAttr = new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage);
    this.colAttr = new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage);
    this.sizeAttr = new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage);
    this.alphaAttr = new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', this.posAttr);
    geo.setAttribute('aColor', this.colAttr);
    geo.setAttribute('aSize', this.sizeAttr);
    geo.setAttribute('aAlpha', this.alphaAttr);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uScale: { value: 400 },
        uHardness: { value: hardness }
      },
      transparent: true,
      depthWrite: false,
      blending
    });
    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
  }

  spawn(x, y, z, vx, vy, vz, o) {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.max;
    const i3 = i * 3;
    this.pos[i3] = x; this.pos[i3 + 1] = y; this.pos[i3 + 2] = z;
    this.vel[i3] = vx; this.vel[i3 + 1] = vy; this.vel[i3 + 2] = vz;
    this.col[i3] = o.color.r; this.col[i3 + 1] = o.color.g; this.col[i3 + 2] = o.color.b;
    this.life[i] = o.life;
    this.maxLife[i] = o.life;
    this.startSize[i] = o.size;
    this.endSize[i] = o.endSize;
    this.startAlpha[i] = o.alpha;
    this.gravity[i] = o.gravity;
    this.drag[i] = o.drag;
  }

  update(dt, wind) {
    for (let i = 0; i < this.max; i++) {
      if (this.life[i] <= 0) {
        this.alpha[i] = 0;
        continue;
      }
      this.life[i] -= dt;
      const i3 = i * 3;
      const k = Math.exp(-this.drag[i] * dt);
      this.vel[i3] = this.vel[i3] * k + wind.x * dt;
      this.vel[i3 + 1] = this.vel[i3 + 1] * k - this.gravity[i] * dt;
      this.vel[i3 + 2] = this.vel[i3 + 2] * k + wind.z * dt;
      this.pos[i3] += this.vel[i3] * dt;
      this.pos[i3 + 1] += this.vel[i3 + 1] * dt;
      this.pos[i3 + 2] += this.vel[i3 + 2] * dt;
      if (this.pos[i3 + 1] < 0.05 && this.gravity[i] > 0) {
        this.pos[i3 + 1] = 0.05;
        this.vel[i3 + 1] *= -0.3;
        this.vel[i3] *= 0.5;
        this.vel[i3 + 2] *= 0.5;
      }
      const age = 1 - Math.max(this.life[i], 0) / this.maxLife[i];
      this.size[i] = this.startSize[i] + (this.endSize[i] - this.startSize[i]) * age;
      const fadeIn = Math.min(1, age * 8);
      this.alpha[i] = this.startAlpha[i] * fadeIn * (1 - age) * (1 - age);
    }
    this.posAttr.needsUpdate = true;
    this.colAttr.needsUpdate = true;
    this.sizeAttr.needsUpdate = true;
    this.alphaAttr.needsUpdate = true;
  }
}

const tmpColor = new THREE.Color();

// Site atmosphere: excavation/pour dust, welding sparks with arc flash, and sunlit dust motes
export class SiteFX {
  constructor(scene) {
    this.group = new THREE.Group();
    this.group.name = 'SiteFX';

    this.dust = new ParticlePool(900, { hardness: 0.0 });
    this.sparks = new ParticlePool(700, { blending: THREE.AdditiveBlending, hardness: 0.35 });
    this.motes = new ParticlePool(220, { hardness: 0.2 });
    this.group.add(this.dust.points, this.sparks.points, this.motes.points);

    this.arcLight = new THREE.PointLight(0x9fd8ff, 0, 14, 2);
    this.arcLight.castShadow = false;
    this.group.add(this.arcLight);
    this.arcTime = 0;

    this.wind = new THREE.Vector3(0.35, 0, 0.15);
    this.moteTimer = 0;
    this.moteCenter = new THREE.Vector3(12, 6, 2);
    this.enabled = true;

    scene.add(this.group);
  }

  // Converts world-space particle sizes to pixels for the current projection
  setViewportHeight(px, fovDeg = 38) {
    const scale = px / (2 * Math.tan(THREE.MathUtils.degToRad(fovDeg) / 2));
    [this.dust, this.sparks, this.motes].forEach((p) => { p.material.uniforms.uScale.value = scale; });
  }

  // Billowing earth/cement dust
  emitDust(pos, count = 6, { color = 0xc9b394, spread = 0.8, size = 1.6, lift = 0.8, life = 2.6, alpha = 0.45 } = {}) {
    if (!this.enabled) return;
    tmpColor.setHex(color);
    for (let i = 0; i < count; i++) {
      this.dust.spawn(
        pos.x + (Math.random() - 0.5) * spread,
        pos.y + Math.random() * spread * 0.4,
        pos.z + (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * 1.4,
        lift * (0.4 + Math.random()),
        (Math.random() - 0.5) * 1.4,
        {
          color: tmpColor,
          life: life * (0.6 + Math.random() * 0.6),
          size: size * (0.5 + Math.random() * 0.5),
          endSize: size * (2.2 + Math.random()),
          alpha: alpha * (0.6 + Math.random() * 0.4),
          gravity: -0.05,
          drag: 1.4
        }
      );
    }
  }

  // Ballistic weld/grind sparks with a short blue-white arc flash
  emitSparks(pos, count = 26) {
    if (!this.enabled) return;
    for (let i = 0; i < count; i++) {
      const heat = Math.random();
      tmpColor.setRGB(6 + heat * 4, 2.6 + heat * 2.4, 0.6 + heat * 0.8);
      const a = Math.random() * Math.PI * 2;
      const s = 2 + Math.random() * 5;
      this.sparks.spawn(
        pos.x, pos.y, pos.z,
        Math.cos(a) * s * 0.6,
        1 + Math.random() * 4,
        Math.sin(a) * s * 0.6,
        {
          color: tmpColor,
          life: 0.5 + Math.random() * 0.9,
          size: 0.16 + Math.random() * 0.12,
          endSize: 0.05,
          alpha: 1,
          gravity: 9.8,
          drag: 0.6
        }
      );
    }
    this.arcLight.position.copy(pos);
    this.arcLight.position.y += 0.4;
    this.arcTime = 0.18;
  }

  update(dt, focus) {
    if (focus) this.moteCenter.lerp(focus, 1 - Math.exp(-dt * 0.8));

    this.moteTimer -= dt;
    if (this.enabled && this.moteTimer <= 0) {
      this.moteTimer = 0.06;
      tmpColor.setRGB(1.0, 0.97, 0.9);
      this.motes.spawn(
        this.moteCenter.x + (Math.random() - 0.5) * 60,
        Math.random() * 22,
        this.moteCenter.z + (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.3) * 0.2,
        (Math.random() - 0.5) * 0.3,
        { color: tmpColor, life: 9 + Math.random() * 6, size: 0.12, endSize: 0.1, alpha: 0.5, gravity: 0, drag: 0.2 }
      );
    }

    if (this.arcTime > 0) {
      this.arcTime -= dt;
      this.arcLight.intensity = Math.max(0, this.arcTime / 0.18) * (40 + Math.random() * 50);
    } else {
      this.arcLight.intensity = 0;
    }

    this.dust.update(dt, this.wind);
    this.sparks.update(dt, this.wind);
    this.motes.update(dt, this.wind);
  }
}
