import { scrollToPosition, setScrollController } from './scrollNavigation.js';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
let smooth;
export function bindSmoothScroll() {
  const media = matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');
  const tick = time => smooth?.raf(time * 1000);
  const configure = () => {
    smooth?.destroy(); smooth = undefined; setScrollController(null);
    gsap.ticker.remove(tick);
    if (!media.matches) return;
    smooth = new Lenis({ lerp: .14, syncTouch: false, anchors: false,
      prevent: node => node.closest?.('#module-detail, .mobile-nav, [data-lenis-prevent]') });
    setScrollController(smooth);
    smooth.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
  };
  const anchor = event => {
    const link = event.target.closest?.('a[href^="#"]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    history.pushState(null, '', link.hash);
    scrollToPosition(target.getBoundingClientRect().top + scrollY - 100);
    target.setAttribute('tabindex', target.getAttribute('tabindex') || '-1');
    target.focus({ preventScroll: true });
  };
  configure(); media.addEventListener('change', configure);
  document.addEventListener('click', anchor);
  window.addEventListener('pagehide', () => {
    smooth?.destroy(); smooth = undefined; setScrollController(null); gsap.ticker.remove(tick);
    media.removeEventListener('change', configure); document.removeEventListener('click', anchor);
  }, { once: true });
}

