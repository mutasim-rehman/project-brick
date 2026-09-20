import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BuildingComponents } from './BuildingComponents.js';
import { ConstructionTimeline } from './ConstructionTimeline.js';
import { HotspotsManager } from './HotspotsManager.js';

export class ConstructionWorld {
  constructor(canvasContainer, onSelectHotspot) {
    this.container = canvasContainer;
    this.onSelectHotspot = onSelectHotspot;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.builder = null;
    this.timeline = null;
    this.hotspots = null;

    this.isBlueprintMode = false;
    this.lightingMode = 'day'; // 'day', 'sunset', 'night'
    this.isFreeOrbit = false;

    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf4f6f9);
    this.scene.fog = new THREE.FogExp2(0xf4f6f9, 0.008);

    // 2. Camera (Telephoto perspective with high-precision logarithmic depth buffer)
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.8, 350);
    this.camera.position.set(34, 26, 38);

    // 3. Renderer with Logarithmic Depth Buffer to eliminate Z-fighting
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      logarithmicDepthBuffer: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't go below ground
    this.controls.minDistance = 15;
    this.controls.maxDistance = 140;
    this.controls.target.set(12, 1, 4);
    this.controls.enabled = false; // Disabled by default for smooth scroll navigation
    this.controls.userData = { isFreeOrbit: false };

    // 5. Lighting Setup
    this.setupLighting();

    // 6. Build 3D Models
    this.builder = new BuildingComponents();
    this.elements = this.builder.buildAll(this.scene);

    // 7. Construction Timeline Manager
    this.timeline = new ConstructionTimeline(this.elements, this.camera, this.controls);

    // 8. Hotspots Manager
    this.hotspots = new HotspotsManager(this.camera, this.container, this.onSelectHotspot);

    // 9. Resize Listener
    window.addEventListener('resize', this.onResize.bind(this));

    // 10. Start Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    this.lightsGroup = new THREE.Group();
    this.lightsGroup.name = 'LightingGroup';

    // Hemisphere Light (Sky ambient + warm ground bounce)
    this.hemiLight = new THREE.HemisphereLight(0xe8f0fb, 0xe0d8ce, 0.85);
    this.hemiLight.position.set(0, 50, 0);
    this.lightsGroup.add(this.hemiLight);

    // Directional Sun Light with crisp architectural soft shadows
    this.sunLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    this.sunLight.position.set(55, 65, 45);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 180;
    this.sunLight.shadow.bias = -0.0003;

    const d = 45;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;

    this.lightsGroup.add(this.sunLight);

    // Soft fill light from opposite quadrant
    this.fillLight = new THREE.DirectionalLight(0xdbe6f5, 0.45);
    this.fillLight.position.set(-40, 30, -35);
    this.lightsGroup.add(this.fillLight);

    this.scene.add(this.lightsGroup);
  }

  setLightingPreset(mode) {
    this.lightingMode = mode;
    if (mode === 'sunset') {
      this.scene.background.setHex(0xfcefe3);
      this.scene.fog.color.setHex(0xfcefe3);
      this.sunLight.color.setHex(0xffaa5e);
      this.sunLight.intensity = 2.2;
      this.hemiLight.color.setHex(0xffc599);
      this.hemiLight.groundColor.setHex(0x734827);
    } else if (mode === 'night') {
      this.scene.background.setHex(0x0e131d);
      this.scene.fog.color.setHex(0x0e131d);
      this.sunLight.color.setHex(0x3a6073);
      this.sunLight.intensity = 0.5;
      this.hemiLight.color.setHex(0x1a2a3a);
      this.hemiLight.groundColor.setHex(0x080c14);
    } else {
      // Day default
      this.scene.background.setHex(0xf4f6f9);
      this.scene.fog.color.setHex(0xf4f6f9);
      this.sunLight.color.setHex(0xfff5ea);
      this.sunLight.intensity = 1.8;
      this.hemiLight.color.setHex(0xe8f0fb);
      this.hemiLight.groundColor.setHex(0xe0d8ce);
    }
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
      if (obj.isMesh && obj.material && obj !== this.elements.ground) {
        if (this.isBlueprintMode) {
          if (!obj.userData.originalMat) {
            obj.userData.originalMat = obj.material;
          }
          obj.material = blueprintMat;
        } else if (obj.userData.originalMat) {
          obj.material = obj.userData.originalMat;
        }
      }
    });

    if (this.isBlueprintMode) {
      this.scene.background.setHex(0x060f1e);
      this.scene.fog.color.setHex(0x060f1e);
    } else {
      this.setLightingPreset(this.lightingMode);
    }

    return this.isBlueprintMode;
  }

  setFreeOrbit(enable) {
    this.isFreeOrbit = enable;
    this.controls.enabled = enable;
    this.controls.userData.isFreeOrbit = enable;
    if (!enable) {
      // Snap back to scroll-driven camera
      this.timeline.interpolateCamera(this.timeline.currentProgress);
    }
    return this.isFreeOrbit;
  }

  toggleWarehouseRoof() {
    if (this.timeline) {
      return this.timeline.toggleWarehouseRoof();
    }
    return false;
  }

  onResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    if (this.controls && this.controls.enabled) {
      this.controls.update();
    }

    if (this.timeline) {
      this.timeline.updateFrame(delta);
    }

    if (this.hotspots) {
      this.hotspots.update(this.timeline.currentProgress);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
