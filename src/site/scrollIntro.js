import { preferencesAllowed, readStorage, remember } from './utils.js';

export function initScrollIntro() {
  const section = document.querySelector('.scroll-intro');
  const hero = section.querySelector('.hero');
  const copy = hero.querySelector('.hero-copy');
  const reduced = document.querySelector('#reduced-motion');
  const progressBar = document.querySelector('#construction-progress');
  const stageLabel = document.querySelector('#construction-stage');
  const stages = ['Excavation', 'Foundation', 'Superstructure', 'Logistics bay', 'Curtain facade', 'Completed campus'];
  const preference = preferencesAllowed() ? readStorage('sk-motion', null) : null;
  reduced.checked = preference ?? matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelector('.site-header').classList.add('home-header');
  let world, failed = false, visible = true, pending = false, lastProgress = -1;

  const update = (redraw = false) => {
    pending = false;
    const compact = reduced.checked || failed;
    const headerHeight = document.querySelector('.site-header').offsetHeight;
    const travel = section.offsetHeight - hero.offsetHeight;
    const offset = headerHeight - section.getBoundingClientRect().top;
    // Finish before unpinning, leaving a short view of the completed campus.
    const position = compact ? 1 : Math.max(0, Math.min(1, offset / Math.max(1, travel * .92)));
    const progress = position >= .999 ? 1 : position;
    const stage = Math.min(5, Math.floor(progress * 6));
    const opacity = compact ? 1 : Math.max(0, 1 - progress / .12);
    copy.style.opacity = opacity;
    copy.inert = opacity === 0;
    hero.style.setProperty('--copy-opacity', opacity);
    progressBar.value = progress;
    stageLabel.textContent = `${String(stage + 1).padStart(2, '0')} / 06  ${stages[stage]}`;
    document.querySelector('#construction-percent').textContent = `${Math.round(progress * 100)}%`;
    if (world && (progress !== lastProgress || redraw)) {
      world.timeline.setProgress(progress, compact || progress === 0 || progress === 1);
      if (reduced.checked || redraw || progress === 1) world.animate(performance.now());
    }
    lastProgress = progress;
  };
  const queueUpdate = () => {
    if (!pending) { pending = true; requestAnimationFrame(() => update()); }
  };
  const applyMotion = () => {
    section.classList.toggle('intro-compact', reduced.checked || failed);
    document.documentElement.classList.toggle('reduce-motion', reduced.checked);
    if (world) {
      world.reducedMotion = reduced.checked;
      world.fx.enabled = !reduced.checked;
      world.renderer.setAnimationLoop(visible && !reduced.checked && !failed ? world.animate : null);
    }
    update(true);
  };
  reduced.onchange = () => { remember('sk-motion', reduced.checked); applyMotion(); };
  document.querySelector('#skip-story').onclick = () => {
    const next = document.querySelector('.proof-strip');
    next.scrollIntoView({ behavior: 'instant' });
    next.setAttribute('tabindex', '-1');
    next.focus({ preventScroll: true });
    update(true);
  };
  window.addEventListener('scroll', queueUpdate, { passive: true });
  window.addEventListener('resize', () => update(true));
  window.addEventListener('pageshow', () => update(true));
  applyMotion();

  const fallback = () => {
    failed = true;
    document.querySelector('#site-scene').classList.add('scene-fallback');
    applyMotion();
  };
  import('../scene/ConstructionWorld.js').then(({ ConstructionWorld }) => {
    world = new ConstructionWorld(document.querySelector('#site-scene'), () => {});
    if (import.meta.env.DEV) window.__world = world;
    lastProgress = -1;
    applyMotion();
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      world.renderer.setAnimationLoop(visible && !reduced.checked && !failed ? world.animate : null);
    }).observe(hero);
    document.querySelector('#site-scene').addEventListener('webglcontextlost', fallback);
  }).catch(error => { console.warn('Construction scene unavailable:', error); fallback(); });
}
