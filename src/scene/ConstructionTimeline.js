import * as THREE from 'three';
import { sound } from '../audio/SoundEffects.js';
import { PIT, DIG_STRIPS } from './BuildingComponents.js';

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (min, max, val) => {
  const x = clamp((val - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
};
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeInOutSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
const win = (t, start, duration) => clamp((t - start) / duration, 0, 1);
const damp = (current, target, lambda, dt) => lerp(current, target, 1 - Math.exp(-lambda * dt));
const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const dampAngle = (current, target, lambda, dt) => current + wrapAngle(target - current) * (1 - Math.exp(-lambda * dt));

// Construction schedule (scroll progress 0..1), aligned with the phase ranges in ContentData
const SCHEDULE = {
  digStart: 0.0, digStagger: 0.012, digDuration: 0.055,
  rebar: [0.12, 0.07],
  pour: [0.17, 0.08],
  pileCaps: [0.245, 0.02],
  core: [0.22, 0.15],
  craneArrive: [0.2, 0.03],
  steelStart: 0.37, steelFloorStep: 0.044,
  walls: [0.585, 0.6],
  facadeStart: 0.745, facadeFloorStep: 0.021,
  lightsStart: 0.885,
  handover: [0.9, 0.07],
  craneRemoved: 0.95
};

const STOREY = 4.2;
const RAFT_TOP = 0.9;
const CORE_TOP = RAFT_TOP + 5 * STOREY + 0.25;

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();

export class ConstructionTimeline {
  constructor(elements, fx) {
    this.elements = elements;
    this.fx = fx;

    this.currentProgress = 0;
    this.targetProgress = 0;
    this.lastPhaseIndex = -1;
    this.lastT = 0;
    this.time = 0;
    this.manualCutawayOverride = null;
    this.weldTimer = 0;
    this.sparkBudget = 0;

    this.cacheInitialTransforms();
    this.buildCameraPath();

    this.crane = {
      angle: 0.3,
      radius: 14,
      hookY: 20,
      loaded: false,
      swayX: 0, swayXv: 0,
      swayZ: 0, swayZv: 0,
      prevRadius: 14, prevRadiusV: 0,
      prevAngle: 0.3, prevAngleV: 0,
      cycle: 0
    };

    this.excavatorState = { dumpedCycle: -1 };

    this.update(0, true);
  }

  cacheInitialTransforms() {
    const el = this.elements;
    [...el.steelColumns, ...el.steelBeams, ...el.floorSlabs, ...el.facadePanels, ...el.solarPanels, ...el.hvacUnits]
      .forEach((obj) => {
        obj.userData.basePos = obj.position.clone();
        obj.userData.baseRot = obj.rotation.clone();
      });

    el.warehouseTrusses.forEach((truss) => { truss.userData.basePos = truss.position.clone(); });
    el.warehouseBoxes.forEach((box) => { box.userData.basePos = box.position.clone(); });
    el.parapets.forEach((p) => { p.userData.basePos = p.position.clone(); });
    el.trucks.forEach((truck) => { truck.userData.targetPos = truck.position.clone(); });
    el.trees.forEach((tree, i) => { tree.userData.phase = i * 1.7; });
    if (el.warehouseRoof) el.warehouseRoof.userData.basePos = el.warehouseRoof.position.clone();
    if (el.earthmover) el.earthmover.userData.basePos = el.earthmover.position.clone();
    if (el.excavator) el.excavator.root.userData.basePos = el.excavator.root.position.clone();
    el.fencing.forEach((f) => { f.userData.basePos = f.position.clone(); });

    // Row-major steel order so each storey is erected column-first, then beams, then deck
    el.steelColumns.forEach((col) => {
      const floor = col.userData.floor;
      col.userData.order = el.steelColumns.filter((c) => c.userData.floor === floor).indexOf(col);
    });
    el.steelBeams.forEach((beam) => {
      const floor = beam.userData.floor;
      beam.userData.order = el.steelBeams.filter((b) => b.userData.floor === floor).indexOf(beam);
    });

    const pourMat = el.foundation.material;
    pourMat.userData.dryColor = pourMat.color.clone();
    pourMat.userData.wetColor = new THREE.Color(0x8d969f);
  }

  // Scroll-driven camera path: Catmull-Rom splines through cinematic stops, easing into each stop
  buildCameraPath() {
    this.cameraStops = [
      { progress: 0.0, pos: [51, 13.5, 34], target: [21.5, 0.25, 1.5] },
      { progress: 0.13, pos: [45, 19, 38], target: [15, -0.25, 2] },
      { progress: 0.27, pos: [40, 27, 46], target: [11, 6, 1] },
      { progress: 0.46, pos: [59, 43, 57], target: [15, 17, -2] },
      { progress: 0.66, pos: [-10, 33, 44], target: [-17, 4, -1] },
      { progress: 0.83, pos: [42, 25, 50], target: [10, 11, 4] },
      { progress: 1.0, pos: [60, 31, 62], target: [2, 8, 2] }
    ];
    const toV = (a) => new THREE.Vector3(...a);
    this.posCurve = new THREE.CatmullRomCurve3(this.cameraStops.map((s) => toV(s.pos)), false, 'centripetal');
    this.targetCurve = new THREE.CatmullRomCurve3(this.cameraStops.map((s) => toV(s.target)), false, 'centripetal');
  }

  getCameraPose(t, outPos, outTarget) {
    const stops = this.cameraStops;
    let i = 0;
    while (i < stops.length - 2 && t > stops[i + 1].progress) i++;
    const a = stops[i];
    const b = stops[i + 1];
    const local = clamp((t - a.progress) / (b.progress - a.progress), 0, 1);
    const eased = lerp(local, smoothstep(0, 1, local), 0.65);
    const u = (i + eased) / (stops.length - 1);
    this.posCurve.getPoint(u, outPos);
    this.targetCurve.getPoint(u, outTarget);
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
    const dt = Math.min(deltaTime || 0.016, 0.1);
    this.time += dt;

    // Frame-rate independent critically damped approach to the scroll position
    const diff = this.targetProgress - this.currentProgress;
    if (Math.abs(diff) > 0.00005) {
      this.currentProgress = damp(this.currentProgress, this.targetProgress, 5.5, dt);
    } else {
      this.currentProgress = this.targetProgress;
    }

    this.update(this.currentProgress, false, dt);
  }

  update(progress, force = false, dt = 0.016) {
    const t = clamp(progress, 0, 1);
    const forward = t > this.lastT + 1e-6;
    this.sparkBudget = force ? 0 : 3;

    const phaseIdx = Math.min(5, Math.floor(t * 6));
    if (phaseIdx !== this.lastPhaseIndex) {
      if (this.lastPhaseIndex !== -1 && !force) sound.playSnap();
      this.lastPhaseIndex = phaseIdx;
    }

    this.updateExcavation(t, dt, force);
    this.updateFoundation(t, dt, force);
    this.updateCore(t);
    const steelTop = this.updateSteel(t, dt, forward);
    this.updateCraneStructure(t, steelTop);
    this.updateCraneOperation(t, dt, force);
    this.updateWarehouse(t, dt, forward);
    this.updateEnvelope(t);
    this.updateHandover(t, dt);

    this.lastT = t;
  }

  // ---------------------------------------------------------------------------
  // Stage 01: bulk excavation, strip by strip, with a working excavator and haul truck
  // ---------------------------------------------------------------------------
  updateExcavation(t, dt, force) {
    const el = this.elements;
    let dugTotal = 0;
    el.digStrips.forEach((strip, i) => {
      const start = SCHEDULE.digStart + i * SCHEDULE.digStagger;
      const depth = easeInOutSine(win(t, start, SCHEDULE.digDuration));
      dugTotal += depth;
      strip.position.y = (strip.userData.baseY || 0) - depth * (PIT.depth + 0.8);
      strip.visible = depth < 0.999;

      if (!force && depth > 0.02 && depth < 0.98 && Math.random() < dt * 5) {
        _v.set(strip.position.x + (Math.random() - 0.5) * 3, -PIT.depth * depth + 0.2, PIT.z0 + Math.random() * (PIT.z1 - PIT.z0));
        this.fx.emitDust(_v, 2, { size: 1.2, alpha: 0.3, lift: 0.6 });
      }
    });
    dugTotal /= DIG_STRIPS;

    const haulAway = 1 - easeInOutCubic(win(t, 0.9, 0.05));
    el.soilMounds.forEach((mound, i) => {
      const s = (0.3 + 0.7 * clamp(dugTotal * (i === 0 ? 1.1 : 0.9), 0, 1)) * haulAway;
      mound.visible = s > 0.01;
      mound.scale.set(s, s, s);
    });
    if (el.shoringPiles) el.shoringPiles.visible = t < 0.9;

    const ex = el.excavator;
    if (!ex) return;
    const base = ex.root.userData.basePos;
    const dt6 = this.time;

    if (t < 0.165) {
      ex.root.position.copy(base);
      ex.root.rotation.y = Math.PI;

      const cycleLen = 7.0;
      const cycleIdx = Math.floor(dt6 / cycleLen);
      const c = (dt6 % cycleLen) / cycleLen;
      // Extend → drag the bucket through the cut → curl → lift → slew to the truck bed → dump → return
      const DUMP_YAW = -1.94;
      let yaw, boom, stick, bucket;
      if (c < 0.34) {
        const p = easeInOutSine(c / 0.34);
        yaw = lerp(-0.06, 0.04, p);
        boom = lerp(-0.45, -0.55, p) - Math.sin(p * Math.PI) * 0.05;
        stick = lerp(0.5, -0.4, p);
        bucket = lerp(-0.4, 0.9, easeInOutCubic(p));
      } else if (c < 0.5) {
        const p = easeInOutSine((c - 0.34) / 0.16);
        yaw = lerp(0.04, -0.2, p);
        boom = lerp(-0.55, 0.1, p);
        stick = lerp(-0.4, 0.2, p);
        bucket = 0.9;
      } else if (c < 0.74) {
        const p = easeInOutCubic((c - 0.5) / 0.24);
        yaw = lerp(-0.2, DUMP_YAW, p);
        boom = 0.1;
        stick = 0.2;
        bucket = 0.9 - smoothstep(0.72, 1.0, p) * 1.5;
      } else {
        const p = easeInOutCubic((c - 0.74) / 0.26);
        yaw = lerp(DUMP_YAW, -0.06, p);
        boom = lerp(0.1, -0.45, p);
        stick = lerp(0.2, 0.5, p);
        bucket = lerp(-0.6, -0.4, p);
      }
      ex.house.rotation.y = yaw;
      ex.boomPivot.rotation.z = boom;
      ex.stickPivot.rotation.z = stick;
      ex.bucketPivot.rotation.z = bucket;

      if (ex.bucketLoad) {
        const collecting = smoothstep(0.2, 0.31, c);
        const dumping = 1 - smoothstep(0.64, 0.72, c);
        const fill = Math.min(collecting, dumping);
        ex.bucketLoad.visible = fill > 0.03;
        ex.bucketLoad.scale.set(0.7 + fill * 0.3, Math.max(0.08, fill), 0.7 + fill * 0.3);
      }
      ex.setTrackTravel?.(0);

      if (!force) {
        ex.bucketPivot.getWorldPosition(_v);
        if (c > 0.66 && c < 0.8) {
          _v.y -= 0.6;
          this.fx.emitDust(_v, 3, { color: 0xb89c7a, spread: 1.2, size: 1.3, lift: -0.4, alpha: 0.5, life: 2.2 });
          if (this.excavatorState.dumpedCycle !== cycleIdx) {
            this.excavatorState.dumpedCycle = cycleIdx;
            this.excavatorState.loads = ((this.excavatorState.loads || 0) + 1) % 5;
          }
        } else if (c > 0.12 && c < 0.3 && Math.random() < 0.5) {
          this.fx.emitDust(_v, 1, { color: 0xa88e70, spread: 0.8, size: 1.0, alpha: 0.35 });
        }
      }
    } else {
      // Dig complete: fold the arm into travel position and track out to the staging bay
      const p = easeInOutCubic(win(t, 0.165, 0.055));
      ex.root.position.set(lerp(base.x, 46, p), 0, lerp(base.z, 7, p));
      ex.root.rotation.y = lerp(Math.PI, Math.PI * 1.5, p);
      ex.house.rotation.y = 0;
      ex.boomPivot.rotation.z = -0.32;
      ex.stickPivot.rotation.z = 0.65;
      ex.bucketPivot.rotation.z = -0.35;
      if (ex.bucketLoad) ex.bucketLoad.visible = false;
      ex.setTrackTravel?.(p * 14.6);
      if (!force && p > 0 && p < 1 && Math.random() < dt * 20) {
        this.fx.emitDust(_v.set(ex.root.position.x, 0.3, ex.root.position.z), 2, { size: 1.4, alpha: 0.35 });
      }
    }

    ex.updateMechanics?.();

    // Haul truck is loaded pass by pass, then drives off up the haul road
    const truck = el.earthmover;
    if (truck) {
      const leave = easeInOutCubic(win(t, 0.15, 0.07));
      const tb = truck.userData.basePos;
      truck.position.set(tb.x, tb.y, tb.z - leave * 70);
      truck.visible = leave < 1;
      const load = truck.userData.load;
      if (load) {
        const fill = t < 0.15 ? 0.25 + ((this.excavatorState.loads || 0) / 4) * 0.75 : 1;
        load.scale.y = fill;
        load.position.y = load.userData.baseY ?? 0;
      }
      truck.userData.wheels?.forEach((wheel) => {
        wheel.userData.spinGroup.rotation.z = -leave * 70 / (wheel.userData.radius || 0.72);
      });
      if (!force && leave > 0.02 && leave < 0.98 && Math.random() < dt * 25) {
        this.fx.emitDust(_v.set(truck.position.x, 0.4, truck.position.z + 4), 3, { size: 2, alpha: 0.4, spread: 2 });
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Stage 02: rebar cage, rising raft pour, pile caps
  // ---------------------------------------------------------------------------
  updateFoundation(t, dt, force) {
    const el = this.elements;
    const rebar = el.rebar;
    if (rebar) {
      const p = easeOutCubic(win(t, ...SCHEDULE.rebar));
      rebar.count = Math.floor(rebar.userData.total * p);
      rebar.visible = rebar.count > 0 && t < 0.3;
    }

    const slab = el.foundation;
    if (slab) {
      const pour = easeInOutSine(win(t, ...SCHEDULE.pour));
      slab.visible = pour > 0.002;
      slab.scale.y = Math.max(0.002, pour);

      const wet = 1 - smoothstep(0.23, 0.32, t);
      const mat = slab.material;
      mat.color.copy(mat.userData.dryColor).lerp(mat.userData.wetColor, wet * 0.8);
      mat.roughness = lerp(0.94, 0.62, wet);
      mat.metalness = 0;

      if (!force && pour > 0.01 && pour < 0.99 && Math.random() < dt * 14) {
        const y = -PIT.depth + slab.userData.fullHeight * pour + 0.1;
        _v.set(lerp(PIT.x0 + 1, PIT.x1 - 1, Math.random()), y, lerp(PIT.z0 + 1, PIT.z1 - 1, Math.random()));
        this.fx.emitDust(_v, 2, { color: 0xd6dade, size: 1.1, alpha: 0.3, lift: 0.5 });
      }
    }

    el.pileCaps.forEach((pad, i) => {
      const p = easeOutCubic(win(t, SCHEDULE.pileCaps[0] + i * 0.002, SCHEDULE.pileCaps[1]));
      pad.visible = p > 0.01;
      pad.scale.y = Math.max(0.01, p);
    });
  }

  // Slip-formed shear core climbing continuously with its formwork deck
  updateCore(t) {
    const el = this.elements;
    const p = win(t, ...SCHEDULE.core);
    const top = p > 0 ? RAFT_TOP + p * (CORE_TOP - RAFT_TOP) : RAFT_TOP - 0.1;
    this.coreTop = top;
    if (el.coreClip) el.coreClip.constant = top;
    el.coreTiers.forEach((tier, i) => {
      tier.visible = top > RAFT_TOP + i * STOREY + 0.01;
    });
    if (el.coreFormwork) {
      el.coreFormwork.visible = p > 0 && p < 1;
      el.coreFormwork.position.y = top + 0.15;
    }
  }

  // ---------------------------------------------------------------------------
  // Stage 03: structural steel erected storey by storey
  // ---------------------------------------------------------------------------
  updateSteel(t, dt, forward) {
    const el = this.elements;
    let steelTop = 0;

    const pieceMotion = (obj, start, duration, drop) => {
      const p = win(t, start, duration);
      obj.visible = p > 0;
      if (!obj.visible) {
        obj.userData.seated = false;
        return p;
      }
      const e = easeOutCubic(p);
      const base = obj.userData.basePos;
      const settle = (1 - e) * Math.sin(p * Math.PI * 3);
      obj.position.set(base.x, base.y + (1 - e) * drop, base.z);
      obj.rotation.y = obj.userData.baseRot.y + settle * 0.18;
      obj.rotation.z = obj.userData.baseRot.z + settle * 0.04;

      if (p >= 1 && !obj.userData.seated) {
        obj.userData.seated = true;
        if (forward && this.sparkBudget > 0) {
          this.sparkBudget--;
          this.fx.emitSparks(obj.userData.joint, 14);
        }
      } else if (p < 1) {
        obj.userData.seated = false;
      }
      return p;
    };

    el.steelColumns.forEach((col) => {
      const fStart = SCHEDULE.steelStart + col.userData.floor * SCHEDULE.steelFloorStep;
      const p = pieceMotion(col, fStart + (col.userData.order / 15) * 0.014, 0.009, 3.5);
      if (p > 0) steelTop = Math.max(steelTop, col.userData.basePos.y + STOREY / 2);
    });

    el.steelBeams.forEach((beam) => {
      const fStart = SCHEDULE.steelStart + beam.userData.floor * SCHEDULE.steelFloorStep;
      pieceMotion(beam, fStart + 0.013 + (beam.userData.order / 24) * 0.017, 0.009, 2.8);
    });

    el.floorSlabs.forEach((slab, floor) => {
      const fStart = SCHEDULE.steelStart + floor * SCHEDULE.steelFloorStep;
      const p = easeInOutSine(win(t, fStart + 0.03, 0.013));
      slab.visible = p > 0.002;
      const width = 24.5;
      slab.scale.x = Math.max(0.002, p);
      slab.position.x = slab.userData.basePos.x - width / 2 + (width * p) / 2;
    });

    // Ongoing field welding on already-erected connections of the active storey
    const inErection = t > SCHEDULE.steelStart && t < SCHEDULE.walls[0] + 0.01;
    if (inErection) {
      this.weldTimer -= dt;
      if (this.weldTimer <= 0) {
        this.weldTimer = 0.22 + Math.random() * 0.5;
        const seated = el.steelBeams.filter((b) => b.userData.seated);
        if (seated.length) {
          const pick = seated[seated.length - 1 - Math.floor(Math.random() * Math.min(20, seated.length))];
          this.fx.emitSparks(pick.userData.joint, 22);
        }
      }
    }

    el.parapets.forEach((p) => {
      const e = easeOutCubic(win(t, 0.595, 0.015));
      p.visible = e > 0;
      p.position.y = p.userData.basePos.y - (1 - e) * 1.0;
    });

    return steelTop;
  }

  // Top-climbing tower crane: mast grows with the building, head rides on the climbing frame
  updateCraneStructure(t, steelTop) {
    const crane = this.elements.crane;
    if (!crane) return;
    const arrive = easeOutCubic(win(t, ...SCHEDULE.craneArrive));
    crane.root.visible = arrive > 0 && t < SCHEDULE.craneRemoved;
    if (!crane.root.visible) {
      this.craneReady = false;
      return;
    }

    const buildTop = Math.max(this.coreTop || 0, steelTop);
    const minMast = 12;
    const climb = clamp(buildTop - RAFT_TOP + 9, minMast, crane.mastHeight);
    const mastH = arrive < 1 ? minMast * arrive : climb;

    const rootY = crane.root.position.y;
    crane.mastClip.constant = rootY + 1.6 + mastH;
    crane.collarGroup.position.y = 1.6 + Math.max(0, mastH - 9);

    const headIn = easeOutCubic(win(t, SCHEDULE.craneArrive[0] + SCHEDULE.craneArrive[1] * 0.8, 0.012));
    crane.slewingHead.visible = headIn > 0;
    crane.slewingHead.position.y = 1.6 + mastH + (1 - headIn) * 6;
    this.craneReady = headIn >= 1;
    this.craneTrolleyY = rootY + crane.slewingHead.position.y + 0.6;
  }

  // Where the crane is currently setting loads, following the active trade on site
  getCraneWorkFront(t, cycle, out) {
    if (t < SCHEDULE.steelStart) {
      return out.set(7 + (cycle % 2 ? 2.5 : -2.5), (this.coreTop || 2) + 0.4, 0);
    }
    if (t < 0.6) {
      const floor = clamp(Math.floor((t - SCHEDULE.steelStart) / SCHEDULE.steelFloorStep), 0, 4);
      const spots = [[4, -4], [16, 8], [20, -2], [12, 12], [2, 8], [18, 12]];
      const [x, z] = spots[cycle % spots.length];
      return out.set(x, RAFT_TOP + (floor + 1) * STOREY + 0.4, z);
    }
    if (t < 0.76) {
      const z = [-10, -5, 0, 5, 10][cycle % 5];
      return out.set(-5, 10.6, z);
    }
    const roofY = RAFT_TOP + 5 * STOREY + 0.5;
    const spots = [[19, 5], [19, 10], [8, -2], [14, 3]];
    const [x, z] = spots[cycle % spots.length];
    return out.set(x, roofY, z);
  }

  updateCraneOperation(t, dt, force) {
    const crane = this.elements.crane;
    if (!crane || !crane.root.visible) return;
    const s = this.crane;
    const base = _v2.set(crane.root.position.x, 0, crane.root.position.z);

    const pick = { x: 27, y: 1.7, z: -16.2 };
    const CYCLE = 17;
    const cycle = Math.floor(this.time / CYCLE);
    const c = (this.time % CYCLE) / CYCLE;
    const work = this.getCraneWorkFront(t, cycle, _v);
    const travelY = (this.craneTrolleyY || 30) - 5;
    const parked = t > 0.9 || !this.craneReady;

    const aim = (x, z) => ({
      angle: Math.atan2(-(x - base.x), -(z - base.z)),
      radius: clamp(Math.hypot(x - base.x, z - base.z), 4, crane.jibLength - 1.5)
    });
    const at = aim(pick.x, pick.z);
    const aw = aim(work.x, work.z);

    let angle, radius, hookY, loaded;
    if (parked) {
      angle = 0.35; radius = 9; hookY = travelY + 2; loaded = false;
    } else if (c < 0.1) {
      ({ angle, radius } = at); hookY = pick.y + 2.5; loaded = c > 0.07;
    } else if (c < 0.22) {
      ({ angle, radius } = at); hookY = travelY; loaded = true;
    } else if (c < 0.45) {
      ({ angle, radius } = aw); hookY = Math.max(travelY, work.y + 6); loaded = true;
    } else if (c < 0.66) {
      ({ angle, radius } = aw); hookY = work.y + 2.5; loaded = c < 0.62;
    } else if (c < 0.74) {
      ({ angle, radius } = aw); hookY = travelY; loaded = false;
    } else {
      ({ angle, radius } = at); hookY = travelY; loaded = false;
    }

    if (force) {
      s.angle = angle; s.radius = radius; s.hookY = hookY;
    } else {
      s.angle = dampAngle(s.angle, angle, 0.9, dt);
      s.radius = damp(s.radius, radius, 1.1, dt);
      s.hookY = damp(s.hookY, hookY, 1.0, dt);
    }
    s.loaded = loaded && t < 0.9;

    // Pendulum sway of the hook excited by trolley and slew accelerations
    const safeDt = Math.max(dt, 1e-3);
    const radialV = (s.radius - s.prevRadius) / safeDt;
    const angV = wrapAngle(s.angle - s.prevAngle) / safeDt;
    const radialA = (radialV - s.prevRadiusV) / safeDt;
    const tangentA = ((angV - s.prevAngleV) / safeDt) * s.radius;
    s.prevRadius = s.radius; s.prevRadiusV = radialV;
    s.prevAngle = s.angle; s.prevAngleV = angV;
    if (!force) {
      const drop = Math.max(2, (this.craneTrolleyY || 30) - s.hookY);
      const omega = Math.sqrt(9.8 / drop);
      const step = (x, v, a) => {
        const acc = -omega * omega * x - 2 * 0.12 * omega * v - clamp(a, -30, 30) * 0.02;
        v += acc * safeDt;
        return [x + v * safeDt, v];
      };
      [s.swayX, s.swayXv] = step(s.swayX, s.swayXv, -radialA);
      [s.swayZ, s.swayZv] = step(s.swayZ, s.swayZv, tangentA);
      s.swayX = clamp(s.swayX, -0.25, 0.25);
      s.swayZ = clamp(s.swayZ, -0.25, 0.25);
    }

    crane.slewingHead.rotation.y = s.angle;
    crane.trolleyGroup.position.z = -s.radius;
    crane.hoistRig.rotation.x = s.swayX;
    crane.hoistRig.rotation.z = s.swayZ;

    const drop = clamp((this.craneTrolleyY || 30) - s.hookY, 1.5, 40);
    crane.blockGroup.position.y = -drop;
    crane.cables.forEach((cable) => { cable.scale.y = Math.max(0.1, drop - 0.45); });
    crane.suspendedBeam.visible = s.loaded;
    crane.suspendedBeam.rotation.y = Math.PI / 2 + Math.sin(this.time * 0.35) * 0.35;

    if (crane.beacon) {
      const blink = (this.time % 1.2) < 0.18 ? 1 : 0;
      crane.beacon.material.emissiveIntensity = 0.4 + blink * 9;
    }
  }

  // ---------------------------------------------------------------------------
  // Stage 04: tilt-up warehouse, trusses, racking and live logistics
  // ---------------------------------------------------------------------------
  updateWarehouse(t, dt, forward) {
    const el = this.elements;
    const time = this.time;

    if (el.warehouseFloor) {
      const p = easeInOutCubic(win(t, 0.565, 0.04));
      el.warehouseFloor.visible = p > 0.002;
      el.warehouseFloor.scale.y = Math.max(0.002, p);
      el.warehouseFloor.position.y = 0.3 * p;
    }
    el.finishedGround.forEach((surface, index) => {
      const p = easeOutCubic(win(t, 0.61 + index * 0.008, 0.035));
      surface.visible = p > 0.002;
      surface.scale.set(index === 0 ? Math.max(0.002, p) : 1, Math.max(0.002, p), 1);
    });

    el.warehouseWalls.forEach((pivot, i) => {
      const p = easeInOutCubic(win(t, SCHEDULE.walls[i] ?? 0.6, 0.035));
      const { axis, flat } = pivot.userData.tilt;
      pivot.visible = t > 0.56;
      pivot.rotation[axis] = flat * (1 - p);
      if (p >= 1 && !pivot.userData.seated) {
        pivot.userData.seated = true;
        if (forward) {
          pivot.children[0].getWorldPosition(_v);
          _v.y = 0.4;
          this.fx.emitDust(_v, 30, { color: 0xd9dde2, spread: 14, size: 2.2, alpha: 0.35, lift: 0.4 });
        }
      } else if (p < 1) {
        pivot.userData.seated = false;
      }
    });

    el.warehouseTrusses.forEach((truss, idx) => {
      const p = easeOutCubic(win(t, 0.62 + idx * 0.008, 0.014));
      truss.visible = p > 0;
      truss.position.y = truss.userData.basePos.y - (1 - p) * 8;
    });

    el.warehouseRacks.forEach((rack, idx) => {
      const p = easeInOutCubic(win(t, 0.635 + idx * 0.01, 0.016));
      rack.visible = p > 0;
      rack.rotation.z = (1 - p) * -Math.PI / 2;
    });

    el.warehouseBoxes.forEach((box, idx) => {
      const p = easeOutCubic(win(t, 0.668 + (idx % 15) * 0.0035, 0.012));
      box.visible = p > 0;
      box.position.x = box.userData.basePos.x + (1 - p) * 2.6;
    });

    const logisticsLive = t > 0.66;
    el.conveyors.forEach((c) => { c.visible = logisticsLive; });
    el.conveyorParcels.forEach((parcel, i) => {
      parcel.position.x = -11 + ((time * 1.4 + i * 3.5) % 22);
    });

    const fl = el.forklift;
    if (fl) {
      fl.visible = t > 0.67;
      const z = Math.sin(time * 0.32) * 5.2;
      const heading = Math.cos(time * 0.32) >= 0 ? -Math.PI / 2 : Math.PI / 2;
      fl.position.set(0, 0.6, z);
      fl.rotation.y = dampAngle(fl.rotation.y, heading, 2.5, dt);
    }

    el.cityVehicles?.forEach((vehicle, index) => {
      const travel = ((time * (2.2 + index * 0.35) * vehicle.userData.direction + 120) % 240) - 120;
      vehicle.position[vehicle.userData.axis] = vehicle.userData.base + travel;
      vehicle.children.forEach((part) => {
        if (part.userData?.spinGroup) part.userData.spinGroup.rotation.z = travel / 0.38;
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Stage 05: curtain wall, roof enclosure, rooftop plant and PV
  // ---------------------------------------------------------------------------
  updateEnvelope(t) {
    const el = this.elements;

    el.officeFurniture?.forEach((group) => {
      group.visible = t > 0.8 + group.userData.floor * 0.012;
    });

    el.facadePanels.forEach((panel) => {
      const { floor, slot, normal, basePos, baseRot } = panel.userData;
      const start = SCHEDULE.facadeStart + floor * SCHEDULE.facadeFloorStep + slot * 0.012;
      const p = win(t, start, 0.012);
      panel.visible = p > 0;
      if (!panel.visible) return;
      const e = easeOutCubic(p);
      const out = (1 - e) * 2.4;
      panel.position.set(basePos.x + normal.x * out, basePos.y + (1 - e) * 1.2, basePos.z + normal.z * out);
      panel.rotation.y = baseRot.y + (1 - e) * Math.sin(p * Math.PI * 2) * 0.2;
    });

    const [canopy, entranceGlass] = el.entrance;
    if (entranceGlass) entranceGlass.visible = t > 0.84;
    if (canopy) {
      const p = easeOutCubic(win(t, 0.855, 0.02));
      canopy.visible = p > 0;
      canopy.scale.z = Math.max(0.01, p);
      canopy.position.z = canopy.userData.targetZ - (1 - p) * 2.25;
    }

    const roof = el.warehouseRoof;
    if (roof) {
      if (this.manualCutawayOverride !== null) {
        roof.visible = this.manualCutawayOverride;
        roof.position.y = roof.userData.basePos.y;
      } else {
        const p = easeOutCubic(win(t, 0.77, 0.06));
        roof.visible = p > 0;
        roof.position.y = roof.userData.basePos.y + (1 - p) * 4;
      }
    }

    el.solarPanels.forEach((sp, idx) => {
      const p = easeOutCubic(win(t, 0.8 + (idx % 8) * 0.009, 0.02));
      sp.visible = p > 0;
      sp.position.y = sp.userData.basePos.y + (1 - p) * 2.5;
      const panel = sp.children[1];
      if (panel) panel.rotation.x = -Math.PI / 8 * p;
    });

    el.hvacUnits.forEach((hvac, i) => {
      const p = easeOutCubic(win(t, 0.815 + i * 0.02, 0.022));
      hvac.visible = p > 0;
      hvac.position.y = hvac.userData.basePos.y + (1 - p) * 6;
    });
  }

  // ---------------------------------------------------------------------------
  // Stage 06: commissioning, landscaping and live operations
  // ---------------------------------------------------------------------------
  updateHandover(t, dt) {
    const el = this.elements;
    const time = this.time;

    el.officeInteriorLights.forEach((light) => {
      const on = SCHEDULE.lightsStart + light.userData.floor * 0.012;
      if (t < on) {
        light.visible = false;
      } else if (t < on + 0.006) {
        light.visible = Math.sin(time * 47 + light.userData.floor * 3.1) > -0.2;
      } else {
        light.visible = true;
      }
    });

    const finish = easeInOutSine(win(t, ...SCHEDULE.handover));
    if (el.siteDirt) {
      el.siteDirt.material.opacity = 1 - finish;
      el.siteDirt.visible = finish < 0.999;
    }
    if (el.trackMarks) {
      el.trackMarks.material.opacity = 0.72 * (1 - finish);
      el.trackMarks.visible = finish < 0.999;
    }

    el.fencing.forEach((f) => {
      const p = easeInOutCubic(win(t, 0.9, 0.035));
      f.visible = p < 1;
      f.position.y = f.userData.basePos.y - p * 1.8;
    });

    if (el.laydownSteel) el.laydownSteel.visible = t < 0.9;

    el.trucks.forEach((truck, idx) => {
      const p = easeInOutCubic(win(t, 0.82 + idx * 0.05, 0.14));
      truck.visible = p > 0.001;
      if (!truck.visible) return;
      const target = truck.userData.targetPos;
      let rollDistance;
      if (idx < 2) {
        const zOffset = (1 - p) * 30;
        truck.position.set(target.x, target.y, target.z + zOffset);
        rollDistance = zOffset;
      } else {
        const xOffset = (1 - p) * 60;
        truck.position.set(target.x - xOffset, target.y, target.z);
        rollDistance = -truck.position.x;
      }
      truck.userData.wheels?.forEach((w) => {
        if (w.userData.spinGroup) w.userData.spinGroup.rotation.z = rollDistance / 0.52;
      });
    });

    el.trees.forEach((tree) => {
      const ph = tree.userData.phase;
      tree.rotation.z = Math.sin(time * 0.9 + ph) * 0.015;
      tree.rotation.x = Math.cos(time * 0.7 + ph) * 0.012;
    });
  }

  // Point of interest for ambient particles and camera micro-motion
  getFocus(out) {
    return this.targetCurve.getPoint(clamp(this.currentProgress, 0, 1), out);
  }
}
