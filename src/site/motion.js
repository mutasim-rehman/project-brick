const revealSelectors = [
  '.story-hero-copy > *',
  '.story-hero > .eyebrow',
  '.story-hero > h1',
  '.story-hero > p',
  '.story-hero > .actions',
  '.page-intro > *',
  '.bp-heading > *',
  '.bp-map-column',
  '.bp-story-link',
  '.story-hero-visual',
  '.story-stage-head',
  '.story-stage-body',
  '.story-summary .story-signals > article',
  '.platform-explorer-head',
  '.module-detail',
  '.device-card',
  '.journey-line > *',
  '.about-origin-copy',
  '.about-origin-art',
  '.about-principle',
  '.about-trust',
  '.pricing-status',
  '.pricing-factor',
  '.contact-context',
  '.contact-panel',
  '.legal-content > *',
  '.policy-list > a',
  '.closing-inner',
];

export function bindReveals() {
  bindReadingProgress();
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const nodes = [...new Set(revealSelectors.flatMap(selector => [...document.querySelectorAll(selector)]))];
  if (!nodes.length) return;

  const siblingCounts = new Map();
  nodes.forEach(node => {
    const parent = node.parentElement;
    const index = siblingCounts.get(parent) || 0;
    siblingCounts.set(parent, index + 1);
    node.classList.add('motion-reveal');
    node.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 70}ms`);
  });

  document.documentElement.classList.add('has-scroll-reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -16px 0px' });

  nodes.forEach(node => observer.observe(node));
  window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
}

function bindReadingProgress() {
  let frame = 0;
  const update = () => {
    frame = 0;
    const range = document.documentElement.scrollHeight - window.innerHeight;
    const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    document.documentElement.style.setProperty('--reading-progress', String(progress));
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
  const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(queue) : null;
  resize?.observe(document.body);
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  update();
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    resize?.disconnect();
    window.removeEventListener('scroll', queue);
    window.removeEventListener('resize', queue);
  }, { once: true });
}
