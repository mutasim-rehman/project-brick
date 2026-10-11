let controller;
export function setScrollController(value) { controller = value; }
export function scrollToPosition(top, options = {}) {
  if (controller) controller.scrollTo(top, { duration: .65, ...options });
  else window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}
