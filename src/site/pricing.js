import { icon, escapeHtml } from './utils.js';
import { intro } from './shared.js';

const factors = [
  ['01 / COMPANY SIZE', 'People and sites', 'Employee count and the number of operating locations affect the shape of a configuration.'],
  ['02 / WORKFLOWS', 'Modules in scope', 'People, work, safety, tools, fleet and office workflows can be discussed for a pilot.'],
  ['03 / DEVICES', 'Hardware needs', 'Badges, tags and gateways are discussed separately from software subscription terms.'],
];

export function pricingPage() {
  return `${intro('Pricing / prelaunch', 'Pricing is not published yet.', 'Regional price lists and commercial terms are still awaiting approval. We will publish a price when it is ready to use.')}
    <section class="wrap utility-intro" aria-labelledby="pricing-factors-title"><aside class="pricing-status">${icon('info')}<div><strong>No price or quote is available on this page.</strong><p>Currency, billing terms, discounts and hardware rates are not confirmed. Nothing here submits a request or creates a price hold.</p></div></aside><h2 id="pricing-factors-title">What a future quote will need to account for.</h2><div class="pricing-factors">${factors.map(([eyebrow,title,copy]) => `<article class="pricing-factor"><span>${escapeHtml(eyebrow)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(copy)}</p></article>`).join('')}</div><div class="utility-next"><div><h2>Explore the product preview.</h2><p>See the proposed workflows while approved pricing is being prepared.</p></div><a class="button light" href="/platform">Explore workflows ${icon('arrow-right')}</a></div></section>`;
}
