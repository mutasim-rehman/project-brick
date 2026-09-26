import { escapeHtml, icon, remember, readStorage, preferencesAllowed, download } from './utils.js';

// Explicit regional sample tables, never live exchange-rate conversions.
export const priceLists = {
  CAD: { base: 99, seat: 6, module: 29, hardware: [24, 8, 39, 199], setup: 250 },
  USD: { base: 79, seat: 5, module: 24, hardware: [19, 6, 29, 149], setup: 200 },
  GBP: { base: 65, seat: 4, module: 19, hardware: [16, 5, 25, 129], setup: 175 },
  EUR: { base: 75, seat: 5, module: 22, hardware: [18, 6, 28, 145], setup: 190 },
  AUD: { base: 119, seat: 8, module: 35, hardware: [29, 10, 45, 239], setup: 300 },
  NZD: { base: 129, seat: 9, module: 39, hardware: [32, 11, 49, 259], setup: 325 },
};
export const moduleNames = ['People', 'Safety', 'Tools', 'Fleet', 'Intelligence'];
export const hardwareNames = ['BLE Tool Tags', 'NFC Site Badges', 'Guard Tags', 'Vehicle Gateways'];
const integer = (n, min, max) => Number.isFinite(Number(n)) ? Math.min(max, Math.max(min, Math.round(Number(n)))) : min;
export function normalizeConfig(value = {}) {
  if (!value || typeof value !== 'object') value = {};
  return { currency: Object.hasOwn(priceLists, value.currency) ? value.currency : 'CAD', annual: value.annual === true,
    employees: integer(value.employees ?? 25, 5, 1000),
    modules: Array.isArray(value.modules) ? [...new Set(value.modules.filter(x => moduleNames.includes(x)))] : ['People', 'Safety'],
    hardware: hardwareNames.map((_, i) => integer(value.hardware?.[i] ?? 0, 0, 10000)) };
}
export function calculate(value) {
  const config = normalizeConfig(value), list = priceLists[config.currency];
  const base = list.base + config.employees * list.seat;
  const modules = config.modules.length * list.module;
  const discount = config.annual ? Math.round((base + modules) * .15 * 100) / 100 : 0;
  const recurring = Math.round((base + modules - discount) * 100) / 100;
  const hardware = config.hardware.reduce((sum, count, i) => sum + count * list.hardware[i], 0);
  return { base, modules, discount, recurring, hardware, setup: list.setup, oneTime: hardware + list.setup, billed: config.annual ? Math.round(recurring * 1200) / 100 : recurring };
}
export function initialConfig() {
  const shared = new URLSearchParams(location.search).get('config');
  if (shared) { try { return normalizeConfig(JSON.parse(shared)); } catch { /* Ignore malformed shared links. */ } }
  return normalizeConfig(preferencesAllowed() ? readStorage('sk-pricing', {}) : {});
}
export let config = initialConfig();
export const configQuery = () => `config=${encodeURIComponent(JSON.stringify(config))}`;
export function snapshot() {
  const now = new Date();
  return { inquiryRef: `PREVIEW-${crypto.randomUUID()}`, timestampUTC: now.toISOString(), priceListVersion: 'illustrative-2026.1', status: 'draft-not-submitted', configuration: structuredClone(config), totals: calculate(config), requestedHoldUntil: new Date(now.getTime() + 14 * 86400000).toISOString() };
}
export function pricingPage() {
  config = initialConfig();
  return `<section class="page-intro wrap"><p class="eyebrow">PRICING / BUILT AROUND YOUR OPERATION</p><h1>Your sites. Your setup.</h1><p>Start with your team. Add the capabilities and hardware your operation needs.</p></section>
  <section class="wrap pricing-layout"><form id="pricing-form" class="configurator"><div class="notice">${icon('info')}<span><strong>Illustrative pricing.</strong> Regional prices and the 15% annual incentive are samples awaiting commercial approval. Taxes and shipping are excluded.</span></div>
  <div class="form-section"><div class="section-label"><span>01</span><h2>Your team</h2></div><div class="form-grid"><label>Currency<select name="currency">${Object.keys(priceLists).map(c => `<option ${config.currency === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label><fieldset class="billing"><legend>Billing cycle</legend><div class="segmented"><label><input type="radio" name="annual" value="false" ${!config.annual ? 'checked' : ''}>Monthly</label><label><input type="radio" name="annual" value="true" ${config.annual ? 'checked' : ''}>Annual <small>-15%</small></label></div></fieldset></div>
  <label class="employee-label">Field employees<input name="employees" type="number" min="5" max="1000" value="${config.employees}" required></label><input aria-label="Field employee slider" id="employee-range" type="range" min="5" max="1000" value="${config.employees}"><div class="range-labels"><span>5 employees</span><span>1,000 employees</span></div><p class="small">Larger team? <a href="/contact">Talk with us about your rollout.</a></p></div>
  <div class="form-section"><div class="section-label"><span>02</span><h2>Your modules</h2></div><p class="small">Core workspace and work communication are included in the base.</p>${moduleNames.map((m, i) => `<label class="option-row"><span>${icon(['users', 'shield-check', 'wrench', 'truck', 'chart-no-axes-combined'][i])}${m}</span><span><small data-module-cost></small><input type="checkbox" name="module" value="${m}" ${config.modules.includes(m) ? 'checked' : ''} role="switch"></span></label>`).join('')}</div>
  <div class="form-section"><div class="section-label"><span>03</span><h2>Your hardware</h2></div>${hardwareNames.map((h, i) => `<label class="option-row"><span>${h}<small data-hardware-cost="${i}"></small></span><input class="quantity" type="number" name="hardware-${i}" min="0" max="10000" value="${config.hardware[i]}" required aria-label="${h} quantity"></label>`).join('')}</div></form>
  <aside class="estimate"><p class="eyebrow">YOUR CONFIGURATION</p><h2>One clear breakdown.</h2><div id="estimate-output" aria-live="polite" aria-atomic="true"></div><a class="button primary" id="price-request" href="/contact?intent=price-hold">Request a 14-day price hold ${icon('arrow-up-right')}</a><a class="button" id="price-demo" href="/contact">Book a demo with this setup ${icon('arrow-right')}</a><button class="text-button" id="save-link">${icon('link')} Save resumable link</button><button class="text-button" id="download-price">${icon('download')} Download estimate</button><p class="small">A hold only begins after the team confirms an approved quote. This estimate is not a binding offer.</p><p id="price-status" role="status"></p><label id="share-link-wrap" hidden>Resumable link<input id="share-link" readonly></label></aside></section>
  <section class="wrap band"><p class="eyebrow">GOOD TO KNOW</p><h2>Room to ask the right questions.</h2>${[['Can I start with one site?', 'Use a pilot to agree on hardware compatibility, responsibilities and the records you want to evaluate before extending the rollout.'], ['What does the setup cost cover?', 'This calculator includes an illustrative onboarding allowance. Installation, travel, training and scope need to be confirmed in your quote.'], ['Can I change my configuration?', 'Yes. Save a resumable link to return to the same configuration. A confirmed commercial quote may have its own amendment terms.']].map(([q,a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</section>`;
}
export function bindPricing() {
  const form = document.querySelector('#pricing-form');
  const refresh = () => {
    const money = value => new Intl.NumberFormat('en', { style: 'currency', currency: config.currency }).format(value);
    const t = calculate(config), list = priceLists[config.currency];
    document.querySelector('#estimate-output').innerHTML = `<div class="price-total">${money(t.recurring)}<span>${config.currency} / month</span></div><p class="small">${config.annual ? `${money(t.billed)} billed annually` : 'Billed monthly'} &middot; illustrative estimate</p><dl class="breakdown"><div><dt>Workspace + ${config.employees} employees</dt><dd>${money(t.base)}</dd></div><div><dt>${config.modules.length} selected modules</dt><dd>${money(t.modules)}</dd></div><div><dt>Annual incentive</dt><dd>-${money(t.discount)}</dd></div><div class="rule"><dt>Hardware (one-time)</dt><dd>${money(t.hardware)}</dd></div><div><dt>Onboarding (one-time)</dt><dd>${money(t.setup)}</dd></div><div class="rule"><dt>One-time total</dt><dd>${money(t.oneTime)}</dd></div></dl>`;
    document.querySelectorAll('[data-module-cost]').forEach(el => { el.textContent = `${money(list.module)} / mo`; });
    document.querySelectorAll('[data-hardware-cost]').forEach(el => { el.textContent = `${money(list.hardware[el.dataset.hardwareCost])} each`; });
    document.querySelector('#price-request').href = `/contact?intent=price-hold&${configQuery()}`;
    document.querySelector('#price-demo').href = `/contact?${configQuery()}`;
  };
  form.addEventListener('input', event => {
    if (event.target.id === 'employee-range') form.elements.employees.value = event.target.value;
    if (!form.checkValidity()) return;
    const data = new FormData(form);
    config = normalizeConfig({ currency: data.get('currency'), annual: data.get('annual') === 'true', employees: data.get('employees'), modules: data.getAll('module'), hardware: hardwareNames.map((_,i) => data.get(`hardware-${i}`)) });
    document.querySelector('#employee-range').value = config.employees;
    remember('sk-pricing', config);
    history.replaceState({}, '', `/pricing?${configQuery()}`);
    refresh();
  });
  document.querySelector('#save-link').onclick = async () => {
    const url = `${location.origin}/pricing?${configQuery()}`;
    document.querySelector('#share-link-wrap').hidden = false;
    document.querySelector('#share-link').value = url;
    try { await navigator.clipboard.writeText(url); document.querySelector('#price-status').textContent = 'Configuration link copied.'; }
    catch { document.querySelector('#share-link').select(); document.querySelector('#price-status').textContent = 'Your resumable link is ready below.'; }
  };
  document.querySelector('#download-price').onclick = () => { download('site-killick-estimate.json', JSON.stringify(snapshot(), null, 2)); document.querySelector('#price-status').textContent = 'Illustrative estimate downloaded. No request has been submitted.'; };
  refresh();
}
