import { scrollToPosition } from './scrollNavigation.js';
import { gsap } from 'gsap';

export function bindHardwareScroll() {
  const wrapper = document.querySelector('.hardware-scroll');
  if (!wrapper) return;
  const cards = [...wrapper.querySelectorAll('.device-card')];
  const buttons = [...wrapper.querySelectorAll('[data-hardware-index]')];
  const media = matchMedia('(min-width: 1050px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
  let active = -1;
  let frame = 0;
  let sequence;
  const setBeat = (card, index) => {
    card.querySelectorAll('.hardware-beat-card').forEach((beat,i) => {
      const changed = i === index && !beat.classList.contains('is-current-beat');
      beat.classList.toggle('is-current-beat', i === index);
      beat.classList.toggle('is-complete-beat', i < index);
      if (changed) card.dispatchEvent(new CustomEvent('device-step', { detail: index }));
      if (changed && media.matches) gsap.fromTo(beat, { x: 12 }, { x: 0, duration: .5, ease: 'power3.out', overwrite: true });
    });
  };
  const activate = index => {
    if (index === active) return;
    sequence?.progress(1).kill();
    const previous = active;
    active = index;
    cards.forEach((card,i) => {
      card.classList.toggle('is-active-device', i === index);
      card.inert = i !== index;
      card.setAttribute('aria-hidden', String(i !== index));
      card.dispatchEvent(new Event('device-visibility'));
      buttons[i].setAttribute('aria-pressed', String(i === index));
    });
    const card = cards[index];
    sequence = gsap.timeline();
    sequence.fromTo(card.querySelector('.device-art'), { opacity: 0, scale: .98, y: previous > index ? -12 : 12 }, { opacity: 1, scale: 1, y: 0, duration: .5, ease: 'power3.out', clearProps: 'opacity,transform' }, 0)
      .fromTo(card.querySelectorAll('.device-copy > *, .device-record-column > *'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .4, stagger: .025, ease: 'power3.out', clearProps: 'opacity,transform' }, .04);
  };
  const update = () => {
    frame = 0;
    if (!media.matches) {
      cards.forEach(card => {
        const beats = [...card.querySelectorAll('.hardware-beat-card')];
        const reached = beats.filter(beat=>beat.getBoundingClientRect().top < innerHeight * .7).length;
        setBeat(card, Math.max(0, reached - 1));
      });
      return;
    }
    const rect = wrapper.getBoundingClientRect();
    const range = wrapper.offsetHeight - wrapper.querySelector('.hardware-stage').offsetHeight;
    const progress = Math.max(0, Math.min(1, (100 - rect.top) / range));
    wrapper.style.setProperty('--hardware-progress', String(progress));
    activate(Math.min(cards.length - 1, Math.floor(progress * cards.length)));
    const local = Math.min(.999, progress * cards.length - active);
    setBeat(cards[active], Math.min(3, Math.floor(local * 4)));
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
  const configure = () => {
    sequence?.kill();
    wrapper.classList.toggle('has-hardware-scroll', media.matches);
    active = -1;
    cards.forEach(card => {
      card.inert = false;
      card.removeAttribute('aria-hidden');
      gsap.set([card.querySelector('.device-art'), ...card.querySelectorAll('.device-copy > *, .device-record-column > *')], { clearProps: 'opacity,transform,filter' });
      card.dispatchEvent(new Event('device-visibility'));
    });
    update();
  };
  buttons.forEach((button,i) => button.addEventListener('click', () => {
    if (media.matches) {
      const top = wrapper.getBoundingClientRect().top + scrollY - 100;
      const range = wrapper.offsetHeight - wrapper.querySelector('.hardware-stage').offsetHeight;
      scrollToPosition(top + range * (i / cards.length + .035));
    } else cards[i].scrollIntoView({ block: 'start', behavior: 'instant' });
  }));
  media.addEventListener('change', configure);
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  configure();
  window.addEventListener('pagehide', () => { sequence?.kill(); cancelAnimationFrame(frame); media.removeEventListener('change', configure); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); }, { once: true });
}


