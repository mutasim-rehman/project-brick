import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BuildingComponents } from './BuildingComponents.js';
import { ConstructionTimeline } from './ConstructionTimeline.js';
import { HotspotsManager } from './HotspotsManager.js';
import { SiteFX } from './SiteFX.js';
import { createSkyDome, applySkyPreset, bakeEnvironment } from './SiteEnvironment.js';

// Filmic finishing: lens vignette + fine animated grain, applied after tone mapping
const FilmFinishShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uVignette: { value: 0.18 },
    uGrain: { value: 0.012 }
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uVignette;
    uniform float uGrain;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec4 col = texture2D(tDiffuse, vUv);
      vec2 d = vUv - 0.5;
      float vig = smoothstep(0.85, 0.2, length(d * vec2(1.1, 1.0)));
      col.rgb *= mix(1.0 - uVignette, 1.0, vig);
      col.rgb += (hash(vUv * 1024.0 + fract(uTime) * 91.7) - 0.5) * uGrain;
      gl_FragColor = col;
    }
  `
};

const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export class ConstructionWorld {
  constructor(canvasContainer, onSelectHotspot) {
    this.container = canvasContainer;
    this.onSelectHotspot = onSelectHotspot;

    this.isBlueprintMode = false;
    this.lightingMode = 'day';
    this.isFreeOrbit = false;
    this.reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    this.isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;

    // Intro fly-in: 0 = aerial approach, 1 = handed over to the scroll-driven camera
    this.intro = { progress: 1 };
    this.renderScene = true;
    this.pointer = new THREE.Vector2();
    this.pointerSmooth = new THREE.Vector2();

    this.timer = new THREE.Timer();
    this.timer.connect(document);

    this._pose = { pos: new THREE.Vector3(), target: new THREE.Vector3() };
    this._tmp = new THREE.Vector3();
    this._right = new THREE.Vector3();
    this._up = new THREE.Vector3();
    this._focus = new THREE.Vector3();

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(38, width / height, 1, 420);
    this.camera.position.set(50, 14, 33);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isCoarsePointer ? 1.5 : 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 0.9;
    this.renderer.localClippingEnabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.04;
    this.controls.minDistance = 15;
    this.controls.maxDistance = 140;
    this.controls.target.set(19, -1, 3);
    this.controls.enabled = false;
    this.controls.userData = { isFreeOrbit: false };

    this.setupLighting();
    this.setupAtmosphere();

    this.builder = new BuildingComponents({ detail: this.isCoarsePointer ? 'low' : 'high' });
    this.elements = this.builder.buildAll(this.scene);

    this.fx = new SiteFX(this.scene);
    this.fx.setViewportHeight(height * this.renderer.getPixelRatio(), this.camera.fov);
    if (this.reducedMotion) this.fx.enabled = false;

    this.timeline = new ConstructionTimeline(this.elements, this.fx);
    this.hotspots = new HotspotsManager(this.camera, this.container, this.onSelectHotspot);

    this.setupPostProcessing(width, height);
    this.setLightingPreset('day');

    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('pointermove', (e) => {
      this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    }, { passive: true });

    this.animate = this.animate.bind(this);
    this.renderer.setAnimationLoop(this.animate);
  }

  setupLighting() {
    this.lightsGroup = new THREE.Group();
    this.lightsGroup.name = 'LightingGroup';

    this.hemiLight = new THREE.HemisphereLight(0xbfe8f2, 0xa9b8b4, 0.35);
    this.lightsGroup.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff0da, 3.1);
    this.sunLight.position.set(55, 62, 38);
    this.sunLight.castShadow = true;
    const maxTex = this.renderer.capabilities.maxTextureSize;
    const shadowRes = maxTex >= 8192 && !this.isCoarsePointer ? 4096 : 2048;
    this.sunLight.shadow.mapSize.set(shadowRes, shadowRes);
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 200;
    this.sunLight.shadow.bias = -0.00025;
    this.sunLight.shadow.normalBias = 0.03;
    this.sunLight.shadow.radius = 3;
    const d = 52;
    Object.assign(this.sunLight.shadow.camera, { left: -d, right: d, top: d, bottom: -d });
    this.sunLight.target.position.set(0, 0, 0);
    this.lightsGroup.add(this.sunLight, this.sunLight.target);

    this.fillLight = new THREE.DirectionalLight(0x9fdff0, 0.25);
    this.fillLight.position.set(-40, 30, -35);
    this.lightsGroup.add(this.fillLight);

    this.rimLight = new THREE.DirectionalLight(0xcfeaff, 0.35);
    this.rimLight.position.set(0, 45, -50);
    this.lightsGroup.add(this.rimLight);

    this.scene.add(this.lightsGroup);
  }

  setupAtmosphere() {
    this.sky = createSkyDome(this.sunLight.position);
    this.scene.add(this.sky);
    this.scene.fog = new THREE.FogExp2(0xdff1f4, 0.00245);
    this.scene.background = null;
  }

  setupPostProcessing(width, height) {
    const pr = this.renderer.getPixelRatio();
    const rt = new THREE.WebGLRenderTarget(width * pr, height * pr, { type: THREE.HalfFloatType, samples: 4 });
    this.composer = new EffectComposer(this.renderer, rt);
    this.composer.setPixelRatio(pr);
    this.composer.setSize(width, height);

    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.gtaoPass = null;
    if (!this.isCoarsePointer) {
      this.gtaoPass = new GTAOPass(
        this.scene,
        this.camera,
        Math.round(width * 0.6),
        Math.round(height * 0.6),
        undefined,
        { radius: 1.1, distanceExponent: 1.35, thickness: 1.4, distanceFallOff: 1, scale: 0.85, samples: 6 },
        { lumaPhi: 8, depthPhi: 2, normalPhi: 3, radius: 3, radiusExponent: 1, rings: 2, samples: 6 }
      );
      this.gtaoPass.blendIntensity = 0.38;
      this.composer.addPass(this.gtaoPass);
    }
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(width / 2, height / 2), 0.1, 0.42, 1.85);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());
    this.finishPass = new ShaderPass(FilmFinishShader);
    this.composer.addPass(this.finishPass);
  }

  rebakeEnvironment() {
    this.envTarget = bakeEnvironment(this.renderer, this.sky, this.envTarget);
    this.scene.environment = this.envTarget.texture;
  }

  setLightingPreset(mode) {
    this.lightingMode = mode;
    const preset = applySkyPreset(this.sky, this.isBlueprintMode ? 'blueprint' : mode);
    this.scene.fog.color.setHex(preset.horizon);

    if (mode === 'sunset') {
      this.sunLight.color.setHex(0xffaa5e);
      this.sunLight.intensity = 2.4;
      this.hemiLight.color.setHex(0xffc599);
      this.hemiLight.groundColor.setHex(0x734827);
      this.fillLight.color.setHex(0xffaa5e);
      this.scene.environmentIntensity = 0.8;
      this.bloomPass.strength = 0.2;
    } else if (mode === 'night') {
      this.sunLight.color.setHex(0x38bdf8);
      this.sunLight.intensity = 0.45;
      this.hemiLight.color.setHex(0x0e3646);
      this.hemiLight.groundColor.setHex(0x05131a);
      this.fillLight.color.setHex(0x00f2fe);
      this.scene.environmentIntensity = 0.35;
      this.bloomPass.strength = 0.34;
    } else {
      this.sunLight.color.setHex(0xfff0da);
      this.sunLight.intensity = 2.75;
      this.hemiLight.color.setHex(0xbfe8f2);
      this.hemiLight.groundColor.setHex(0xa9b8b4);
      this.fillLight.color.setHex(0x9fdff0);
      this.fillLight.intensity = 0.25;
      this.scene.environmentIntensity = 0.62;
      this.bloomPass.strength = 0.08;
    }
    this.rebakeEnvironment();
  }

  toggleBlueprintMode() {
    this.isBlueprintMode = !this.isBlueprintMode;

    const blueprintMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });

    this.scene.traverse((obj) => {
      if (obj.isMesh && obj.material && obj !== this.elements.ground && obj !== this.sky) {
        if (this.isBlueprintMode) {
          if (!obj.userData.originalMat) obj.userData.originalMat = obj.material;
          obj.material = blueprintMat;
        } else if (obj.userData.originalMat) {
          obj.material = obj.userData.originalMat;
        }
      }
    });

    this.setLightingPreset(this.lightingMode);
    return this.isBlueprintMode;
  }

  setFreeOrbit(enable) {
    this.isFreeOrbit = enable;
    this.controls.enabled = enable;
    this.controls.userData.isFreeOrbit = enable;
    return this.isFreeOrbit;
  }

  toggleWarehouseRoof() {
    return this.timeline ? this.timeline.toggleWarehouseRoof() : false;
  }

  onResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
    this.gtaoPass?.setSize(Math.round(width * 0.6), Math.round(height * 0.6));
    this.fx.setViewportHeight(height * this.renderer.getPixelRatio(), this.camera.fov);
  }

  // Scroll pose, blended with the intro fly-in, plus subtle handheld drift and pointer parallax
  updateGuidedCamera(time, dt) {
    const { pos, target } = this._pose;
    this.timeline.getCameraPose(this.timeline.currentProgress, pos, target);

    const intro = easeInOutCubic(Math.min(1, Math.max(0, this.intro.progress)));
    if (intro < 1) {
      const p0 = this._tmp.set(-40, 110, 130);
      const p1x = 105, p1y = 64, p1z = 92;
      const u = 1 - intro;
      const a = u * u, b = 2 * u * intro, c = intro * intro;
      pos.set(
        a * p0.x + b * p1x + c * pos.x,
        a * p0.y + b * p1y + c * pos.y,
        a * p0.z + b * p1z + c * pos.z
      );
      target.lerpVectors(this._focus.set(6, 0, 0), target, intro);
    }
    const fov = 30 + 8 * intro;
    if (Math.abs(this.camera.fov - fov) > 1e-3) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }

    // A vertical viewport has far less horizontal field of view. Pull the guided
    // camera back so machinery remains visible beside the mobile narrative copy.
    if (this.camera.aspect < 1) {
      const framingScale = 1 + (1 - this.camera.aspect) * 0.75;
      if (this.timeline.currentProgress < 0.2) target.x += 3;
      pos.sub(target).multiplyScalar(framingScale).add(target);
    }

    if (!this.reducedMotion) {
      this.pointerSmooth.lerp(this.pointer, 1 - Math.exp(-dt * 2.5));
      this._right.setFromMatrixColumn(this.camera.matrixWorld, 0);
      this._up.setFromMatrixColumn(this.camera.matrixWorld, 1);
      const drift = 0.35;
      pos.addScaledVector(this._right, this.pointerSmooth.x * 1.6 + Math.sin(time * 0.31) * drift + Math.sin(time * 0.83) * drift * 0.3);
      pos.addScaledVector(this._up, this.pointerSmooth.y * 0.9 + Math.sin(time * 0.47) * drift * 0.6);
      target.y += Math.sin(time * 0.29) * 0.08;
    }

    this.camera.position.copy(pos);
    this.camera.lookAt(target);
    this.controls.target.copy(target);
  }

  animate() {
    // Explicit scroll redraws can run ahead of a queued RAF timestamp.
    this.timer.update();
    const dt = Math.max(0, Math.min(this.timer.getDelta(), 0.1));
    const time = this.timer.getElapsed();

    this.timeline.updateFrame(dt);

    if (this.isFreeOrbit) {
      this.controls.update();
    } else {
      this.updateGuidedCamera(time, dt);
    }

    this.sky.position.copy(this.camera.position);
    this.fx.update(dt, this.timeline.getFocus(this._focus));
    this.hotspots.update(this.timeline.currentProgress);

    this.finishPass.uniforms.uTime.value = time;
    if (this.renderScene) this.composer.render(dt);
  }
}
