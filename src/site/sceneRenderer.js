import * as THREE from 'three';

// Some drivers reject multisampling or a requested power profile. Retry with
// default context settings before falling back to the illustration.
export function createSceneRenderer(host, label) {
  let lastError;
  for (const options of [
    { alpha: true, antialias: true },
    { alpha: true, antialias: false },
  ]) {
    try {
      const renderer = new THREE.WebGLRenderer(options);
      host.dataset.renderStatus = 'initialized';
      return renderer;
    } catch (error) { lastError = error; }
  }
  host.dataset.renderStatus = 'unavailable';
  console.error(`[Site Killick] ${label}: 3D initialization failed; displaying illustration.`, lastError);
  return null;
}
