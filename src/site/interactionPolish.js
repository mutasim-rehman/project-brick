import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function bindInteractionPolish() {
  const media = gsap.matchMedia();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  media.add('(prefers-reduced-motion: no-preference)', () => {
    document.querySelectorAll('.story-record').forEach(host => {
      const context = gsap.context(() => {}, host);
      let current = host.querySelector('.story-panel.is-active');
      const observer = new MutationObserver(() => {
        const panel = host.querySelector('.story-panel.is-active');
        if (!panel || panel === current) return;
        if (current) { gsap.killTweensOf(current.children); gsap.set(current.children, { clearProps: 'opacity,transform' }); }
        current = panel;
        context.add(() => gsap.fromTo(panel.children, { opacity: .3, y: 6 }, { opacity: 1, y: 0, stagger: .025, duration: .35, ease: 'power2.out', overwrite: true, clearProps: 'opacity,transform' }));
      });
      observer.observe(host, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
      host._polishObserver = observer;
      host._polishContext = context;
    });
    const cards = gsap.utils.toArray('.story-signals article, .about-principle');
    cards.forEach(card => gsap.from(card, { y: 16, opacity: 0, duration: .65, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 92%', once: true }, clearProps: 'transform,opacity' }));
    return () => document.querySelectorAll('.story-record').forEach(host => { host._polishObserver?.disconnect(); host._polishContext?.revert(); });
  });
  // A restrained pointer light, adapted to the existing cream/navy cards.
  const cards = [...document.querySelectorAll('.module-picker button, .story-signals article, .about-principle')];
  cards.forEach(card => {
    card.classList.add('polish-light');
    card.addEventListener('pointermove', event => {
      if (reduce.matches || event.pointerType !== 'mouse') return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--light-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--light-y', `${event.clientY - rect.top}px`);
    });
  });
  window.addEventListener('pagehide', () => media.revert(), { once: true });
}
