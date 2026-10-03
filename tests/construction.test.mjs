import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { SiteModel, advanceConstructionProgress } from '../src/scene/SiteModel.js';

test('a fast scroll cannot compress the construction timeline, at either frame rate', () => {
  for (const fps of [30, 60]) {
    let progress = 0;
    for (let frame = 0; frame < fps * 10; frame++) {
      progress = advanceConstructionProgress(progress, 1, 1 / fps);
    }
    assert(Math.abs(progress - 10 / 36) < 1e-8);
    const reverse = advanceConstructionProgress(progress, 0, 1 / fps);
    assert(progress - reverse <= 1 / (fps * 36) + 1e-8);
    assert(advanceConstructionProgress(.57999, .58, 1 / fps) <= .58);
  }
});

test('the hoist remains attached to its trolley and hook when scrubbing forward and backward', () => {
  const model = Object.create(SiteModel.prototype);
  const material = new THREE.MeshStandardMaterial();
  Object.assign(model, {
    root: new THREE.Group(), camera: new THREE.PerspectiveCamera(), target: new THREE.Vector3(),
    geometries: new Map(), materials: new Proxy({}, { get: () => material }),
    motionParts: [], panelFlights: [], scaffoldParts: [], animationContext: null,
  });
  for (const name of ['foundation', 'structure', 'finished', 'equipment']) {
    model[name] = new THREE.Group();
    model.root.add(model[name]);
  }
  model.buildGround(); model.buildBuilding(); model.buildCrane(); model.buildEquipment();
  for (const progress of [.1, .505, .72, .92, 1, .57, .2, .81]) {
    model.applyConstruction(progress);
    model.root.updateMatrixWorld(true);
    const cableTop = model.hoistCable.localToWorld(new THREE.Vector3(0, -3.2, 0));
    const cableBottom = model.hoistCable.localToWorld(new THREE.Vector3(0, 3.2, 0));
    assert(cableTop.distanceTo(model.hook.getWorldPosition(new THREE.Vector3())) < 1e-6, `Detached trolley at ${progress}`);
    assert(cableBottom.distanceTo(model.hookHardware.getWorldPosition(new THREE.Vector3())) < 1e-6, `Detached hook at ${progress}`);
    assert(model.excavatorGroup.position.x >= -9, 'Excavator must stay on the site pad');
  }
  model.geometries.forEach(geometry => geometry.dispose());
  material.dispose();
});
