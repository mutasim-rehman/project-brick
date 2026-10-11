import { computerNetwork, bindComputerNetwork } from './computerNetwork.js';
import { gsap } from 'gsap';

const panelAnimations = new WeakMap();
export function animateWorkflow(host, previousHeight) {
  panelAnimations.get(host)?.kill();
  gsap.set(host, { clearProps: 'height,overflow' });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const height = host.getBoundingClientRect().height;
  const sequence = gsap.timeline({ onComplete: () => gsap.set(host, { clearProps: 'height,overflow' }) });
  sequence.fromTo(host, { height: previousHeight, overflow: 'hidden' }, { height, duration: .6, ease: 'power3.inOut' }, 0)
    .fromTo(host.querySelectorAll('.module-detail-copy > .eyebrow, .module-detail-copy > h3, .module-detail-copy > p'), { y: 18, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: .65, stagger: .07, ease: 'power3.out' }, .08)
    .fromTo(host.querySelectorAll('.module-proof > div, .module-features > span'), { opacity: 0, y: 9 }, { opacity: 1, y: 0, duration: .45, stagger: .035, ease: 'power2.out' }, .2)
    .fromTo(host.querySelector('.module-sample'), { clipPath: 'inset(0 0 100% 0)', opacity: .6 }, { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: .85, ease: 'power3.inOut' }, .05);
  panelAnimations.set(host, sequence);
}

export function connectionDiagram() { return computerNetwork(); }

export function bindExperiences() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduce.matches && document.querySelector('.draft-heading-word')) {
    gsap.fromTo(document.querySelectorAll('.draft-heading-word'), { clipPath: 'inset(0 100% 0 0)', filter: 'blur(5px)' }, { clipPath: 'inset(0 0% 0 0)', filter: 'blur(0px)', duration: 1.25, stagger: .16, ease: 'power3.inOut', clearProps: 'clipPath,filter' });
  }
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
