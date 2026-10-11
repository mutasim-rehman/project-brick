import { computerNetwork, bindComputerNetwork } from './computerNetwork.js';
import { gsap } from 'gsap';

const panelAnimations = new WeakMap();
const activePanels = new Set();
const finishPanels = () => activePanels.forEach(host => panelAnimations.get(host)?.progress(1).kill());
export function animateWorkflow(host, previousHeight) {
  panelAnimations.get(host)?.progress(1).kill();
  gsap.set(host, { clearProps: 'height,overflow' });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const height = host.getBoundingClientRect().height;
  activePanels.add(host);
  const sequence = gsap.timeline({ onComplete: () => { gsap.set(host, { clearProps: 'height,overflow' }); activePanels.delete(host); } });
  sequence.fromTo(host, { height: previousHeight, overflow: 'hidden' }, { height, duration: .4, ease: 'power3.inOut' }, 0)
    .fromTo(host.querySelectorAll('.module-detail-copy > .eyebrow, .module-detail-copy > h3, .module-detail-copy > p'), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .4, stagger: .035, ease: 'power3.out', clearProps: 'opacity,transform' }, .04)
    .fromTo(host.querySelectorAll('.module-proof > div, .module-features > span'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .3, stagger: .02, ease: 'power2.out', clearProps: 'opacity,transform' }, .1)
    .fromTo(host.querySelector('.module-sample'), { y: 6, opacity: .35 }, { y: 0, opacity: 1, duration: .4, ease: 'power3.out', clearProps: 'opacity,transform' }, .04);
  panelAnimations.set(host, sequence);
}

export function connectionDiagram() { return computerNetwork(); }

export function bindExperiences() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finishReducedPanels = () => { if (reduce.matches) finishPanels(); };
  reduce.addEventListener('change', finishReducedPanels);
  window.addEventListener('pagehide', () => { finishPanels(); reduce.removeEventListener('change', finishReducedPanels); }, { once: true });
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    if (document.querySelector('.draft-heading-word')) gsap.fromTo(document.querySelectorAll('.draft-heading-word'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .6, stagger: .06, ease: 'power3.out', clearProps: 'clipPath' });
  });
  const resetTilt = () => { if (reduce.matches) document.querySelectorAll('.device-art').forEach(art => { art.style.setProperty('--tilt-x', '0deg'); art.style.setProperty('--tilt-y', '0deg'); }); };
  reduce.addEventListener('change', resetTilt);
  window.addEventListener('pagehide', () => { media.revert(); reduce.removeEventListener('change', resetTilt); }, { once: true });
  document.querySelectorAll('.signal-section').forEach(section => bindComputerNetwork(section, reduce));
  document.querySelectorAll('.device-art').forEach(art => {
    art.addEventListener('pointermove', event => {
      if (reduce.matches || event.pointerType !== 'mouse') return;
      const rect = art.getBoundingClientRect();
      art.style.setProperty('--tilt-x', `${(event.clientY - rect.top - rect.height / 2) / rect.height * -10}deg`);
      art.style.setProperty('--tilt-y', `${(event.clientX - rect.left - rect.width / 2) / rect.width * 12}deg`);
    });
    art.addEventListener('pointerleave', () => { art.style.setProperty('--tilt-x', '0deg'); art.style.setProperty('--tilt-y', '0deg'); });
  });
  document.addEventListener('pointermove', event => {
      const card = event.target.closest?.('.module-proof > div, .about-principle');
      if (!card || reduce.matches) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  });
  const journey = document.querySelector('.journey-line');
  if (journey) {
    let frame;
    const update = () => {
      frame = 0;
      const rect = journey.getBoundingClientRect();
      journey.style.setProperty('--journey-progress', `${Math.max(0, Math.min(1, (window.innerHeight * .7 - rect.top) / rect.height))}`);
      journey.querySelectorAll('.journey-step').forEach(step => step.classList.toggle('is-reached', step.getBoundingClientRect().top < window.innerHeight * .7));
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();
    window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); }, { once: true });
  }
}
