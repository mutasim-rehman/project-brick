import * as THREE from 'three';
import { HOTSPOTS } from '../ui/ContentData.js';
import { sound } from '../audio/SoundEffects.js';

export class HotspotsManager {
  constructor(camera, container, onSelectHotspot) {
    this.camera = camera;
    this.container = container;
    this.onSelectHotspot = onSelectHotspot;
    this.hotspots = HOTSPOTS;
    this.elements = [];
    this.tempVec = new THREE.Vector3();

    this.createDomElements();
  }

  createDomElements() {
    // Hotspots disabled per user request
  }

  setActivePin(id) {
    this.elements.forEach(({ dom, data }) => {
      if (data.id === id) {
        dom.classList.add('active');
      } else {
        dom.classList.remove('active');
      }
    });
  }

  update(currentProgress) {
    return;
  }
}
