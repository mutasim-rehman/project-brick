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
    this.overlayContainer = document.createElement('div');
    this.overlayContainer.className = 'hotspots-overlay';
    this.container.appendChild(this.overlayContainer);

    this.hotspots.forEach((hs) => {
      const pin = document.createElement('button');
      pin.className = 'hotspot-pin';
      pin.setAttribute('data-id', hs.id);
      pin.setAttribute('aria-label', hs.name);

      pin.innerHTML = `
        <div class="pin-ring"></div>
        <div class="pin-core">+</div>
        <div class="pin-label">${hs.name}</div>
      `;

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.playClick(680, 0.05);
        this.setActivePin(hs.id);
        if (this.onSelectHotspot) {
          this.onSelectHotspot(hs);
        }
      });

      this.overlayContainer.appendChild(pin);
      this.elements.push({
        data: hs,
        dom: pin,
        worldPos: new THREE.Vector3(...hs.pos)
      });
    });
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
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.elements.forEach(({ data, dom, worldPos }) => {
      // Check if this hotspot is unlocked in the current construction stage
      if (currentProgress < data.phaseMin) {
        dom.style.display = 'none';
        return;
      }

      this.tempVec.copy(worldPos);
      this.tempVec.project(this.camera);

      // Check if behind camera
      if (this.tempVec.z > 1.0) {
        dom.style.display = 'none';
        return;
      }

      // Convert normalized device coords to screen coords
      const x = (this.tempVec.x * 0.5 + 0.5) * width;
      const y = (-(this.tempVec.y * 0.5) + 0.5) * height;

      // Check if off screen bounds
      if (x < -20 || x > width + 20 || y < -20 || y > height + 20) {
        dom.style.display = 'none';
        return;
      }

      dom.style.display = 'flex';
      dom.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    });
  }
}
