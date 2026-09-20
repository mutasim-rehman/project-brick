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
    this.excavatorTime = 0;
    this.manualCutawayOverride = null;

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

    if (this.elements.coreTiers) {
      this.elements.coreTiers.forEach((tier) => {
        tier.userData.targetY = tier.position.y;
      });
    }

    if (this.elements.warehouseRoof) {
      this.elements.warehouseRoof.userData.targetY = this.elements.warehouseRoof.position.y;
    }
  }

  toggleWarehouseRoof() {
    if (!this.elements.warehouseRoof) return false;
    if (this.manualCutawayOverride === null) {
      this.manualCutawayOverride = !this.elements.warehouseRoof.visible;
    } else {
      this.manualCutawayOverride = !this.manualCutawayOverride;
    }
    this.elements.warehouseRoof.visible = this.manualCutawayOverride;
    return this.elements.warehouseRoof.visible;
  }

  setProgress(p, instant = false) {
    this.targetProgress = clamp(p, 0, 1);
    if (instant) {
      this.currentProgress = this.targetProgress;
      this.update(this.currentProgress, true);
    }
  }

  updateFrame(deltaTime) {
    const dt = deltaTime || 0.016;
    this.excavatorTime += dt;

    // Smooth lerp progress
    const diff = this.targetProgress - this.currentProgress;
    if (Math.abs(diff) > 0.0002) {
      this.currentProgress += diff * 0.12;
    }

    // Always run update so active machinery (excavator, crane, particles) operate smoothly in real time
    this.update(this.currentProgress, false, dt);

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

  update(progress, force = false, dt = 0.016) {
    const t = clamp(progress, 0, 1);

    // Detect phase transitions for sound
    const phaseIdx = Math.min(5, Math.floor(t * 6));
    if (phaseIdx !== this.lastPhaseIndex) {
      if (this.lastPhaseIndex !== -1 && !force) {
        sound.playSnap();
      }
      this.lastPhaseIndex = phaseIdx;
    }

    // 1. Excavation Pit & Working Hydraulic Excavator (Realistic Construction Lifecycle)
    if (this.elements.excavator && this.elements.excavator.root) {
      const ex = this.elements.excavator;

      if (t < 0.22) {
        // Phase 1 (0.0 to 0.22): Active Digging at the pit edge
        ex.root.visible = true;
        ex.root.position.set(22, 0, 4);
        ex.root.rotation.y = -Math.PI * 0.75; // Points into the excavation pit

        // Smooth continuous 6.5s realistic digging cycle (dig -> scoop -> lift -> slew -> dump -> return)
        const cycle = (this.excavatorTime % 6.5) / 6.5;

        if (cycle < 0.35) {
          // Step A: Dig & scoop in the pit
          const p = cycle / 0.35;
          const digSin = Math.sin(p * Math.PI);
          ex.house.rotation.y = -0.15 + 0.1 * p;
          ex.boomPivot.rotation.z = -0.18 - digSin * 0.25;
          ex.stickPivot.rotation.z = 0.45 + p * 0.45;
          ex.bucketPivot.rotation.z = -0.25 + p * 0.90;
        } else if (cycle < 0.52) {
          // Step B: Lift arm with full bucket out of pit
          const p = (cycle - 0.35) / 0.17;
          ex.house.rotation.y = -0.05 + p * 0.35;
          ex.boomPivot.rotation.z = -0.43 + p * 0.35;
          ex.stickPivot.rotation.z = 0.90 - p * 0.20;
          ex.bucketPivot.rotation.z = 0.65;
        } else if (cycle < 0.76) {
          // Step C: Slew towards soil mound / dump truck & dump earth
          const p = (cycle - 0.52) / 0.24;
          ex.house.rotation.y = 0.30 + p * 0.52;
          ex.boomPivot.rotation.z = -0.08 - p * 0.05;
          ex.stickPivot.rotation.z = 0.70 + p * 0.10;
          ex.bucketPivot.rotation.z = 0.65 - p * 1.05; // Dump soil!
        } else {
          // Step D: Return slew back to pit
          const p = (cycle - 0.76) / 0.24;
          ex.house.rotation.y = 0.82 - p * 0.97;
          ex.boomPivot.rotation.z = -0.13 - p * 0.05;
          ex.stickPivot.rotation.z = 0.80 - p * 0.35;
          ex.bucketPivot.rotation.z = -0.40 + p * 0.15;
        }

        // Hydraulic cylinders realistic angle & telescoping
        if (ex.boomCylinders) {
          const boomAngle = ex.boomPivot.rotation.z;
          ex.boomCylinders.forEach((cyl) => {
            cyl.group.rotation.z = Math.PI / 4.8 + boomAngle * 0.68;
            cyl.piston.position.y = 1.6 + boomAngle * 0.85;
          });
        }
      } else if (t < 0.38) {
        // Phase 2 (0.22 to 0.38): Excavation done, smooth transit to safe perimeter equipment staging
        const pTransit = (t - 0.22) / 0.16;
        ex.root.visible = true;

        ex.root.position.x = 22 + pTransit * 13;
        ex.root.position.z = 4 + pTransit * 4;
        ex.root.rotation.y = -Math.PI * 0.75 + pTransit * (Math.PI * 0.25);

        // Fold boom into resting travel safety cradle
        ex.house.rotation.y = 0;
        ex.boomPivot.rotation.z = -0.32;
        ex.stickPivot.rotation.z = 0.65;
        ex.bucketPivot.rotation.z = -0.35;

        if (ex.boomCylinders) {
          ex.boomCylinders.forEach((cyl) => {
            cyl.group.rotation.z = Math.PI / 4.8 - 0.32 * 0.68;
            cyl.piston.position.y = 1.6 - 0.32 * 0.85;
          });
        }
      } else {
        // Phase 3-6: Cleanly parked at equipment staging bay (35, 0, 8), clear of site office container
        ex.root.visible = true;
        ex.root.position.set(35, 0, 8);
        ex.root.rotation.y = -Math.PI / 2;
        ex.house.rotation.y = 0;
        ex.boomPivot.rotation.z = -0.32;
        ex.stickPivot.rotation.z = 0.65;
        ex.bucketPivot.rotation.z = -0.35;

        if (ex.boomCylinders) {
          ex.boomCylinders.forEach((cyl) => {
            cyl.group.rotation.z = Math.PI / 4.8 - 0.32 * 0.68;
            cyl.piston.position.y = 1.6 - 0.32 * 0.85;
          });
        }
      }
    }

    // 2. Foundation & Modular Concrete Core (0.10 to 0.38)
    if (this.elements.foundation) {
      const fProg = smoothstep(0.10, 0.22, t);
      this.elements.foundation.visible = fProg > 0.01;
      if (this.elements.foundation.visible) {
        // Substructure concrete raft sets squarely onto bedrock
        const fallOffset = (1 - fProg) * 3.0;
        this.elements.foundation.position.y = 0.45 - fallOffset;
        this.elements.foundation.scale.set(1, 1, 1);
      }
    }

    // Modular Shear Core: 5 distinct vertical floor tiers assemble sequentially (no rubber stretching from ground!)
    if (this.elements.coreTiers && this.elements.coreTiers.length > 0) {
      const tierStarts = [0.16, 0.20, 0.24, 0.28, 0.32];
      const tierDuration = 0.05;

      this.elements.coreTiers.forEach((tier, idx) => {
        const start = tierStarts[idx] || (0.16 + idx * 0.04);
        const tierProg = smoothstep(start, start + tierDuration, t);
        tier.visible = tierProg > 0.01;
        if (tier.visible) {
          tier.scale.set(1, 1, 1);
          // Solid slipform tier sets firmly into place (2.0m vertical placement)
          const slideY = (1 - tierProg) * 2.0;
          tier.position.y = -slideY;
        }
      });
    } else if (this.elements.core) {
      const coreProg = smoothstep(0.18, 0.38, t);
      this.elements.core.visible = coreProg > 0.01;
      this.elements.core.scale.set(1, 1, 1);
    }

    // 3. Realistic Modular Tower Crane Erection & Operation (0.24 to 0.94 - NO 2D squashing!)
    if (this.elements.crane && this.elements.crane.root) {
      const crane = this.elements.crane;
      crane.root.scale.set(1, 1, 1); // NEVER squash into 2D!

      if (t < 0.24) {
        crane.root.visible = false;
      } else if (t < 0.28) {
        // Stage 1: Base concrete pad and climbing collar set in place at ground level
        crane.root.visible = true;
        if (crane.baseGroup) crane.baseGroup.visible = true;
        if (crane.collarGroup) {
          crane.collarGroup.visible = true;
          crane.collarGroup.position.y = 1.6;
        }
        if (crane.mastGroup) crane.mastGroup.visible = false;
        if (crane.slewingHead) crane.slewingHead.visible = false;
      } else if (t < 0.34) {
        // Stage 2: Modular lattice mast climbs vertically through the collar at full 3D volume
        crane.root.visible = true;
        if (crane.baseGroup) crane.baseGroup.visible = true;
        if (crane.collarGroup) {
          crane.collarGroup.visible = true;
          crane.collarGroup.position.y = 1.6 + 6.0;
        }
        if (crane.mastGroup) {
          crane.mastGroup.visible = true;
          const climbProg = smoothstep(0.28, 0.34, t);
          crane.mastGroup.position.y = 1.6 - (1 - climbProg) * 26;
        }
        if (crane.slewingHead) crane.slewingHead.visible = false;
      } else {
        // Stage 3 & 4: Mast fully erect, slewing head & jibs locked on top, active operation
        crane.root.visible = t < 0.96;
        if (crane.baseGroup) crane.baseGroup.visible = true;
        if (crane.collarGroup) {
          crane.collarGroup.visible = true;
          crane.collarGroup.position.y = 1.6 + 8.0;
        }
        if (crane.mastGroup) {
          crane.mastGroup.visible = true;
          crane.mastGroup.position.y = 1.6;
        }
        if (crane.slewingHead) {
          crane.slewingHead.visible = true;
          const headProg = smoothstep(0.34, 0.38, t);
          crane.slewingHead.position.y = (1.6 + 32) + (1 - headProg) * 4;
        }

        if (crane.root.visible && crane.slewingHead) {
          // Dynamic slewing rotation over front staging and superstructure (avoids clipping into core)
          const jibAngle = 0.30 + Math.sin(t * 12) * 0.55;
          crane.slewingHead.rotation.y = jibAngle;

          // Slide trolley along triangular lattice jib within structural frame boundaries
          if (crane.trolleyGroup) {
            const trolleyZ = -12 - Math.sin(t * 16) * 7.5;
            crane.trolleyGroup.position.z = trolleyZ;
          }

          // Hoist cable raising & lowering block
          if (crane.blockGroup) {
            crane.blockGroup.position.y = -9.5 + Math.sin(t * 20) * 2.8;
          }

          // Suspended steel beam with gentle pendulum swing
          if (crane.suspendedBeam) {
            crane.suspendedBeam.visible = t < 0.68;
            crane.suspendedBeam.rotation.y = Math.PI / 2 + Math.sin(t * 24) * 0.12;
          }
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

    // Warehouse Completed Roof & Loading Dock Portals Enclosure (Phase 5 & 6)
    if (this.elements.warehouseRoof) {
      if (this.manualCutawayOverride !== null) {
        this.elements.warehouseRoof.visible = this.manualCutawayOverride;
        this.elements.warehouseRoof.position.y = 0;
      } else {
        // Encloses cleanly at Phase 5 & 6 (t >= 0.76)
        const rProg = smoothstep(0.76, 0.86, t);
        this.elements.warehouseRoof.visible = rProg > 0.01;
        if (this.elements.warehouseRoof.visible) {
          const slideY = (1 - rProg) * 3.5;
          this.elements.warehouseRoof.position.y = slideY;
        }
      }
    }

    // 7. Completed Campus Handover & Delivery Fleet (0.82 to 1.0)
    // Turn on interior warm lights through the glass
    const lightsOn = t >= 0.89;
    this.elements.officeInteriorLights.forEach((light) => {
      light.visible = lightsOn;
    });

    // Delivery trucks arriving realistically along their travel direction
    this.elements.trucks.forEach((truck, idx) => {
      const truckProg = smoothstep(0.82 + idx * 0.05, 0.96 + idx * 0.05, t);
      truck.visible = truckProg > 0.01;
      if (truck.visible) {
        if (idx < 2) {
          // Dock Trucks (Blue & Red): Arrive along Z-axis from SOUTH road (+Z) backing into dock bay!
          // From z = 52 (front road/apron entry) to z = 22 (dock parking position)
          const zOffset = (1 - truckProg) * 30; // 30 units along Z
          truck.position.z = truck.userData.targetPos.z + zOffset;
          truck.position.x = truck.userData.targetPos.x;

          // Realistic wheel rolling as the truck backs into the bay
          if (truck.userData.wheels) {
            const rollAngle = ((1 - truckProg) * 30) / 0.52;
            truck.userData.wheels.forEach((w) => {
              if (w.userData && w.userData.spinGroup) {
                w.userData.spinGroup.rotation.z = rollAngle;
              }
            });
          }
        } else {
          // Highway Transit Truck (truck 3): Drives forward along FRONT ROAD (+X East)
          const xOffset = (1 - truckProg) * 60;
          truck.position.x = truck.userData.targetPos.x - xOffset;
          truck.position.z = truck.userData.targetPos.z;

          if (truck.userData.wheels) {
            const rollAngle = -truck.position.x / 0.52;
            truck.userData.wheels.forEach((w) => {
              if (w.userData && w.userData.spinGroup) {
                w.userData.spinGroup.rotation.z = rollAngle;
              }
            });
          }
        }
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
