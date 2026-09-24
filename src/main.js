import './style.css';
import { ConstructionWorld } from './scene/ConstructionWorld.js';
import { UIManager } from './ui/UIManager.js';
import { IntroSequence } from './ui/IntroSequence.js';
import { sound } from './audio/SoundEffects.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvasContainer = document.getElementById('webgl-canvas-container');

  // Initialize UI Manager with hotspot callback
  let uiManager = null;
  const onSelectHotspot = (hotspot) => {
    if (uiManager) {
      uiManager.showHotspotDetails(hotspot);
    }
  };

  // Initialize 3D Construction World
  const world = new ConstructionWorld(canvasContainer, onSelectHotspot);

  // Initialize UI Manager
  uiManager = new UIManager(world);
  if (import.meta.env.DEV) window.__world = world;

  // Cinematic landing sequence; waits for shader compilation so the reveal never stutters
  const intro = new IntroSequence(world);
  const ready = world.renderer
    .compileAsync(world.scene, world.camera)
    .catch(() => {});
  intro.play(ready);

  // Smooth Scroll Controller
  let ticking = false;
  const updateScrollProgress = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.max(0, Math.min(1, scrollY / maxScroll)) : 0;

    // Push progress to 3D construction timeline
    world.timeline.setProgress(progress);

    // Update UI HUD & timeline progress bar
    uiManager.onScrollUpdate(progress);
    intro.onScroll(progress);

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  }, { passive: true });

  // Initial trigger
  updateScrollProgress();

  // Navigation link clicks smooth scroll
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      sound.playClick(600);
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  console.log('BRICK & AXIS 3D Interactive Construction Engine Active.');
});
