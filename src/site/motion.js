const revealSelectors = [
  '.story-hero-copy',
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
  if (!('IntersectionObserver' in window)) return;

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
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  nodes.forEach(node => observer.observe(node));
  window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
}
