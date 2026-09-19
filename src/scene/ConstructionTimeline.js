import * as THREE from 'three';
import { sound } from '../audio/SoundEffects.js';

// Smooth interpolation and clamp helpers
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const smoothstep = (min, max, val) => {
  const x = clamp((val - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
};
const easeOutBack = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export class ConstructionTimeline {
  constructor(elements, camera, controls) {
    this.elements = elements;
    this.camera = camera;
    this.controls = controls;

    this.currentProgress = 0;
    this.targetProgress = 0;
    this.lastPhaseIndex = -1;

    // Cache initial transforms
    this.cacheInitialTransforms();

    // Camera viewpoints for each key milestone
    this.cameraNodes = [
      // Phase 1: Site Prep & Excavation (close-up on pit and earthwork)
      {
        progress: 0.0,
        pos: new THREE.Vector3(34, 26, 38),
        target: new THREE.Vector3(12, 1, 4)
      },
      // Phase 2: Foundation & Concrete Core
      {
        progress: 0.25,
        pos: new THREE.Vector3(40, 32, 44),
        target: new THREE.Vector3(10, 6, 2)
      },
      // Phase 3: Steel Superstructure & Tower Crane in action
      {
        progress: 0.48,
        pos: new THREE.Vector3(46, 40, 48),
        target: new THREE.Vector3(12, 12, 0)
      },
      // Phase 4: High-Bay Warehouse Interior & Rail Gantry (screenshots 1 & 2)
      {
        progress: 0.68,
        pos: new THREE.Vector3(-4, 34, 46),
        target: new THREE.Vector3(-10, 6, -2)
      },
      // Phase 5: Architectural Envelope & Facade (screenshot 5)
      {
        progress: 0.84,
        pos: new THREE.Vector3(38, 32, 44),
        target: new THREE.Vector3(8, 12, 2)
      },
      // Phase 6: Completed Campus (grand architectural overview)
      {
        progress: 1.0,
        pos: new THREE.Vector3(48, 38, 52),
        target: new THREE.Vector3(2, 8, 2)
      }
    ];

    // Initialize all components to stage 0
    this.update(0, true);
  }

  cacheInitialTransforms() {
    // Cache target positions of columns, beams, racks, panels etc.
    this.elements.steelColumns.forEach((col) => {
      col.userData.targetY = col.position.y;
    });

    this.elements.steelBeams.forEach((beam) => {
      beam.userData.targetY = beam.position.y;
    });

    this.elements.floorSlabs.forEach((slab) => {
      slab.userData.targetY = slab.position.y;
    });

    this.elements.warehouseRacks.forEach((rack) => {
      rack.userData.targetY = rack.position.y;
    });

    this.elements.warehouseBoxes.forEach((box) => {
      box.userData.targetY = box.position.y;
      box.userData.targetScale = box.scale.clone();
    });

    this.elements.facadePanels.forEach((panel) => {
      panel.userData.targetY = panel.position.y;
    });

    this.elements.solarPanels.forEach((sp) => {
      sp.userData.targetY = sp.position.y;
    });

    this.elements.trucks.forEach((truck) => {
      truck.userData.targetPos = truck.position.clone();
    });
  }

  setProgress(p, instant = false) {
    this.targetProgress = clamp(p, 0, 1);
    if (instant) {
      this.currentProgress = this.targetProgress;
      this.update(this.currentProgress, true);
    }
  }

  updateFrame(deltaTime) {
    // Smooth lerp progress
    const diff = this.targetProgress - this.currentProgress;
    if (Math.abs(diff) > 0.0002) {
      this.currentProgress += diff * 0.12;
      this.update(this.currentProgress, false);
    }

    // Gentle ambient particle floating
    if (this.elements.particles) {
      const positions = this.elements.particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.015;
        if (positions[i] < 0) positions[i] = 30;
      }
      this.elements.particles.geometry.attributes.position.needsUpdate = true;
    }
  }

  update(progress, force = false) {
    const t = clamp(progress, 0, 1);

    // Detect phase transitions for sound
    const phaseIdx = Math.min(5, Math.floor(t * 6));
    if (phaseIdx !== this.lastPhaseIndex) {
      if (this.lastPhaseIndex !== -1 && !force) {
        sound.playSnap();
      }
      this.lastPhaseIndex = phaseIdx;
    }

    // 1. Excavation Pit (0.0 to 0.25)
    if (this.elements.excavation) {
      // Pit stays, but excavator works during stage 1
      if (this.elements.excavator) {
        const exWork = smoothstep(0.0, 0.22, t);
        this.elements.excavator.visible = t < 0.35;
        if (this.elements.excavator.visible) {
          // Animate digging motion
          this.elements.excavator.rotation.y = (Math.PI / 4) + Math.sin(t * 40) * 0.25;
        }
      }
    }

    // 2. Foundation & Concrete Core (0.12 to 0.42)
    if (this.elements.foundation) {
      const fProg = smoothstep(0.10, 0.24, t);
      this.elements.foundation.visible = fProg > 0.01;
      this.elements.foundation.scale.set(1, Math.max(0.01, fProg), 1);
      this.elements.foundation.position.y = 0.45 * fProg;
    }

    if (this.elements.core) {
      const coreProg = smoothstep(0.18, 0.38, t);
      this.elements.core.visible = coreProg > 0.01;
      this.elements.core.scale.set(1, Math.max(0.01, coreProg), 1);
      this.elements.core.position.y = (coreProg - 1) * 12;
    }

    // 3. Tower Crane (0.28 to 0.90)
    if (this.elements.crane) {
      const craneProg = smoothstep(0.24, 0.36, t);
      this.elements.crane.root.visible = craneProg > 0.01 && t < 0.95;
      this.elements.crane.root.scale.set(1, Math.max(0.01, craneProg), 1);

      if (this.elements.crane.root.visible) {
        // Rotate crane slewing jib realistically based on progress
        const jibAngle = -Math.PI / 4 + Math.sin(t * 18) * 0.8 + t * 2.5;
        this.elements.crane.slewingHead.rotation.y = jibAngle;

        // Slide trolley back and forth along the boom
        const trolleyZ = -8 - Math.sin(t * 22) * 10;
        this.elements.crane.trolleyGroup.position.z = trolleyZ;

        // Animate suspended beam
        if (this.elements.crane.suspendedBeam) {
          this.elements.crane.suspendedBeam.visible = t < 0.65;
          this.elements.crane.suspendedBeam.rotation.y = jibAngle + Math.sin(t * 30) * 0.15;
        }
      }
    }

    // 4. Steel Superstructure (0.34 to 0.62)
    // Columns drop down from sky
    const colProg = smoothstep(0.32, 0.48, t);
    this.elements.steelColumns.forEach((col, idx) => {
      const delay = (idx / this.elements.steelColumns.length) * 0.25;
      const itemProg = smoothstep(0.32 + delay, 0.48 + delay, t);
      col.visible = itemProg > 0.01;
      if (col.visible) {
        const fallOffset = (1 - itemProg) * 20;
        col.position.y = col.userData.targetY + fallOffset;
        col.scale.set(1, Math.min(1, itemProg * 1.1), 1);
      }
    });

    // Horizontal Steel Beams snap in
    this.elements.steelBeams.forEach((beam, idx) => {
      const delay = (idx / this.elements.steelBeams.length) * 0.2;
      const itemProg = smoothstep(0.40 + delay, 0.58 + delay, t);
      beam.visible = itemProg > 0.01;
      if (beam.visible) {
        const fallOffset = (1 - itemProg) * 14;
        beam.position.y = beam.userData.targetY + fallOffset;
        beam.scale.set(itemProg, itemProg, itemProg);
      }
    });

    // Precast floor slabs appear
    this.elements.floorSlabs.forEach((slab, idx) => {
      const slabProg = smoothstep(0.44 + idx * 0.03, 0.52 + idx * 0.03, t);
      slab.visible = slabProg > 0.01;
      if (slab.visible) {
        slab.scale.set(slabProg, 1, slabProg);
      }
    });

    // 5. Warehouse Complex & Logistics Bay (0.52 to 0.74)
    // Walls & Trusses
    this.elements.warehouseWalls.forEach((wall, idx) => {
      const wProg = smoothstep(0.50 + idx * 0.03, 0.60 + idx * 0.03, t);
      wall.visible = wProg > 0.01;
      if (wall.visible) {
        wall.scale.set(1, Math.max(0.01, wProg), 1);
      }
    });

    this.elements.warehouseTrusses.forEach((truss, idx) => {
      const trProg = smoothstep(0.54 + idx * 0.02, 0.64 + idx * 0.02, t);
      truss.visible = trProg > 0.01;
    });

    // High-Bay Pallet Racks & Boxes (Directly matching screenshot 1 & 2!)
    this.elements.warehouseRacks.forEach((rack, idx) => {
      const rProg = smoothstep(0.56 + idx * 0.03, 0.68 + idx * 0.03, t);
      rack.visible = rProg > 0.01;
      if (rack.visible) {
        rack.scale.set(1, Math.max(0.01, rProg), 1);
      }
    });

    this.elements.warehouseBoxes.forEach((box, idx) => {
      const bProg = smoothstep(0.60 + (idx % 15) * 0.01, 0.72 + (idx % 15) * 0.01, t);
      box.visible = bProg > 0.01;
      if (box.visible) {
        box.scale.copy(box.userData.targetScale).multiplyScalar(bProg);
      }
    });

    // Conveyors & Forklift
    this.elements.conveyors.forEach((c) => {
      const cProg = smoothstep(0.58, 0.70, t);
      c.visible = cProg > 0.01;
    });

    if (this.elements.forklift) {
      const flProg = smoothstep(0.60, 0.74, t);
      this.elements.forklift.visible = flProg > 0.01;
      if (this.elements.forklift.visible) {
        // Forklift rolls slightly back and forth
        this.elements.forklift.position.x = 6 + Math.sin(t * 25) * 1.8;
      }
    }

    // Rail Gantry & Trains (matching screenshot 3)
    if (this.elements.railGantry) {
      const gProg = smoothstep(0.48, 0.66, t);
      this.elements.railGantry.visible = gProg > 0.01;
      if (this.elements.railGantry.visible) {
        // Gantry crane moves along the rail line
        this.elements.railGantry.position.x = -14 + Math.sin(t * 12) * 12;
      }
    }

    this.elements.trains.forEach((train) => {
      const trProg = smoothstep(0.50, 0.70, t);
      train.visible = trProg > 0.01;
      if (train.visible) {
        train.position.x = -10 + (t - 0.5) * 20;
      }
    });

    // 6. Architectural Glass Curtain Wall & Enclosure (0.72 to 0.88)
    this.elements.facadePanels.forEach((panel, idx) => {
      const pDelay = (idx / this.elements.facadePanels.length) * 0.14;
      const pProg = smoothstep(0.72 + pDelay, 0.84 + pDelay, t);
      panel.visible = pProg > 0.01;
      if (panel.visible) {
        const slideY = (1 - pProg) * 6;
        panel.position.y = panel.userData.targetY + slideY;
        panel.scale.set(pProg, pProg, 1);
      }
    });

    // Solar panels & HVAC
    this.elements.solarPanels.forEach((sp, idx) => {
      const sProg = smoothstep(0.78 + (idx % 8) * 0.015, 0.88 + (idx % 8) * 0.015, t);
      sp.visible = sProg > 0.01;
      if (sp.visible) {
        sp.scale.set(sProg, sProg, sProg);
      }
    });

    this.elements.hvacUnits.forEach((hvac) => {
      const hProg = smoothstep(0.80, 0.90, t);
      hvac.visible = hProg > 0.01;
    });

    // 7. Completed Campus Handover & Lighting (0.88 to 1.0)
    // Turn on interior warm lights through the glass
    const lightsOn = t >= 0.89;
    this.elements.officeInteriorLights.forEach((light) => {
      light.visible = lightsOn;
    });

    // Delivery trucks arriving
    this.elements.trucks.forEach((truck, idx) => {
      const truckProg = smoothstep(0.82 + idx * 0.04, 0.96 + idx * 0.04, t);
      truck.visible = truckProg > 0.01;
      if (truck.visible) {
        const offset = (1 - truckProg) * 35;
        truck.position.x = truck.userData.targetPos.x - offset;
      }
    });

    // Camera choreography if not in free orbit mode
    if (this.controls && !this.controls.userData.isFreeOrbit) {
      this.interpolateCamera(t);
    }
  }

  interpolateCamera(t) {
    if (!this.camera || !this.controls) return;

    // Find bounding nodes
    let nodeA = this.cameraNodes[0];
    let nodeB = this.cameraNodes[this.cameraNodes.length - 1];

    for (let i = 0; i < this.cameraNodes.length - 1; i++) {
      if (t >= this.cameraNodes[i].progress && t <= this.cameraNodes[i + 1].progress) {
        nodeA = this.cameraNodes[i];
        nodeB = this.cameraNodes[i + 1];
        break;
      }
    }

    const range = nodeB.progress - nodeA.progress || 1;
    const localT = smoothstep(nodeA.progress, nodeB.progress, t);

    // Interpolate camera position
    this.camera.position.lerpVectors(nodeA.pos, nodeB.pos, localT);

    // Interpolate controls target
    const currentTarget = new THREE.Vector3().lerpVectors(nodeA.target, nodeB.target, localT);
    this.controls.target.copy(currentTarget);
    this.controls.update();
  }
}
