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
  return { inquiryRef: `PREVIEW-${crypto.randomUUID()}`, timestampUTC: now.toISOString(), priceListVersion: 'illustrative-2026.1', status: 'draft-not-submitted', configuration: structuredClone(config), totals: calculate(config) };
}

const moduleDescriptions = ['Attendance, employee records and qualification reminders.','Toolbox talks, incident records and corrective actions.','Tagged assets, custody history and handoffs.','Equipment records, service intervals and compatible telemetry.','Daily summaries and exception queues for human review.'];
const hardwareDescriptions = ['Identify tagged tools during a proximity search.','Record attendance with an NFC-compatible reader.','Identify equipment in a supported monitoring setup.','Connect compatible vehicle location and operating data.'];
export function pricingPage() {
 config=initialConfig();
 return `<section class="wrap page-intro"><p class="eyebrow">PRICING / PLAN YOUR INVESTMENT</p><h1>Start with what you need.<br><em>Know what adds up.</em></h1><p>Explore a sample budget for your team, workflows and hardware. A useful starting point for a pilot conversation.</p></section><div class="budget-mobile"><div><strong id="mobile-total"></strong><span>Sample monthly budget</span></div><a href="#budget-summary">See breakdown ↓</a></div><section class="wrap pricing-layout"><form id="pricing-form"><div class="notice">${icon('info')}<span><strong>Planning example, not a commercial quote.</strong> Rates and the annual discount are illustrative. An approved proposal will confirm availability, pricing and terms. Taxes and shipping are excluded.</span></div><div class="form-section"><div class="section-label"><span>01</span><h2>Your team</h2></div><div class="form-grid"><label>Currency<select name="currency">${Object.keys(priceLists).map(c=>`<option ${config.currency===c?'selected':''}>${c}</option>`).join('')}</select></label><fieldset><legend>Payment schedule</legend><div class="segmented"><label><input type="radio" name="annual" value="false" ${!config.annual?'checked':''}>Monthly</label><label><input type="radio" name="annual" value="true" ${config.annual?'checked':''}>Annual <small>−15%</small></label></div></fieldset></div><label class="employee-label">Field employees<input name="employees" type="number" min="5" max="1000" value="${config.employees}" required></label><div class="team-presets" role="group" aria-label="Team size shortcuts">${[10,25,50,100].map(n=>`<button type="button" data-team="${n}">${n} people</button>`).join('')}</div><p class="seat-explanation" id="seat-explanation"></p></div><div class="form-section"><div class="section-label"><span>02</span><h2>Your workflows</h2></div><p>Work communication is included in the workspace. People and Safety are selected as an example starting setup; every add-on is optional.</p>${moduleNames.map((m,i)=>`<label class="option-row">${icon(['users','shield-check','wrench','truck','chart-no-axes-combined'][i])}<span class="option-description"><strong>${m}</strong><small>${moduleDescriptions[i]}</small></span><span><small data-module-cost></small><input type="checkbox" name="module" value="${m}" ${config.modules.includes(m)?'checked':''} aria-label="Include ${m}"></span></label>`).join('')}</div><div class="form-section"><div class="section-label"><span>03</span><h2>Hardware, if you need it</h2></div><p class="hardware-note">Concept illustrations. Device models, reader requirements and site compatibility are confirmed before purchase.</p>${hardwareNames.map((h,i)=>`<label class="option-row"><span class="hardware-visual" aria-hidden="true">${icon(['radio','scan-line','shield-check','truck'][i])}</span><span class="option-description"><strong>${h}</strong><small>${hardwareDescriptions[i]}</small><small data-hardware-cost="${i}"></small></span><input class="quantity" type="number" name="hardware-${i}" min="0" max="10000" value="${config.hardware[i]}" required aria-label="${h} quantity"></label>`).join('')}</div></form><aside class="estimate" id="budget-summary"><p class="eyebrow">YOUR SAMPLE BUDGET</p><h2>Nothing hidden in the total.</h2><div id="estimate-output" aria-live="polite" aria-atomic="true"></div><a class="button primary" id="price-demo" href="/contact">Plan a pilot with this setup ${icon('arrow-up-right')}</a><button class="text-button" id="save-link">${icon('link')} Save this configuration</button><button class="text-button" id="download-price">${icon('download')} Download budget breakdown</button><p class="small">No payment is taken. No price hold or subscription is created.</p><p id="price-status" role="status"></p><label id="share-link-wrap" hidden>Configuration link<input id="share-link" readonly></label></aside></section><section class="wrap pricing-faq"><p class="eyebrow">BEFORE YOU COMMIT</p><h2>A few useful answers.</h2>${[
 ['Can we start with one site?','That is the intended approach. Choose a workflow, agree the people and devices involved, and evaluate the records before planning a wider rollout.'],
 ['What is included in the workspace?','This sample budget includes work communication plus a per-field-employee allowance. Additional workflow modules and devices are itemized separately. Final inclusions are defined in your proposal.'],
 ['What does onboarding cover?','The sample includes a one-time onboarding allowance. Training, installation, travel and data migration need an agreed scope; they are not promised by this calculator.'],
 ['Do we need to buy hardware?','Not every workflow requires new devices. NFC attendance needs a compatible reader, tagged-tool workflows need supported tags and scanning devices, and vehicle telemetry depends on the gateway and vehicle. Confirm the setup before ordering.'],
 ['What about cancellation, support and contract length?','Those terms are not finalized in this preview. Your approved proposal must state the commitment period, renewal and cancellation terms, support arrangements and any hardware warranty.'],
 ['Can I change the team size or modules?','You can change this planning example freely and save a link to it. Changes to a live agreement would follow the terms in your signed proposal.']
 ].map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</section>`;
}
export function bindPricing(){
 const form=document.querySelector('#pricing-form');
 const refresh=()=>{
  const money=v=>new Intl.NumberFormat('en',{style:'currency',currency:config.currency}).format(v),t=calculate(config),list=priceLists[config.currency];
  document.querySelector('#mobile-total').textContent=`${money(t.recurring)} / month`;
  document.querySelector('#seat-explanation').textContent=`${money(list.base)} workspace + ${money(list.seat)} per field employee / month. Up to 1,000 people in this example.`;
  document.querySelector('#estimate-output').innerHTML=`<div class="price-total">${money(t.recurring)}<span>${config.currency} / month · sample</span></div><p class="small">${config.annual?`${money(t.billed)} paid annually`:'Paid monthly'} before taxes</p><dl class="breakdown"><div><dt>Workspace</dt><dd>${money(list.base)}</dd></div><div><dt>${config.employees} employees × ${money(list.seat)}</dt><dd>${money(config.employees*list.seat)}</dd></div><div><dt>${config.modules.length} optional modules</dt><dd>${money(t.modules)}</dd></div>${t.discount?`<div><dt>Annual discount · sample</dt><dd>−${money(t.discount)}</dd></div>`:''}<div class="rule"><dt>Hardware · one-time</dt><dd>${money(t.hardware)}</dd></div><div><dt>Onboarding · one-time</dt><dd>${money(t.setup)}</dd></div></dl><div class="first-payment"><span>Estimated initial payment<br><small>${config.annual?'First year':'First month'} + one-time costs</small></span><strong>${money(t.billed+t.oneTime)}</strong></div>`;
  document.querySelectorAll('[data-module-cost]').forEach(el=>el.textContent=`${money(list.module)}/mo`);
  document.querySelectorAll('[data-hardware-cost]').forEach(el=>el.textContent=`${money(list.hardware[el.dataset.hardwareCost])} each · sample`);
  document.querySelector('#price-demo').href=`/contact?${configQuery()}`;
 };
 const update=()=>{if(!form.checkValidity())return;const d=new FormData(form);config=normalizeConfig({currency:d.get('currency'),annual:d.get('annual')==='true',employees:d.get('employees'),modules:d.getAll('module'),hardware:hardwareNames.map((_,i)=>d.get(`hardware-${i}`))});remember('sk-pricing',config);history.replaceState({},'',`/pricing?${configQuery()}`);refresh();};
 form.oninput=update;form.onsubmit=e=>e.preventDefault();
 document.querySelectorAll('[data-team]').forEach(b=>b.onclick=()=>{form.elements.employees.value=b.dataset.team;update();});
 document.querySelector('#save-link').onclick=async()=>{const url=`${location.origin}/pricing?${configQuery()}`;document.querySelector('#share-link-wrap').hidden=false;document.querySelector('#share-link').value=url;try{await navigator.clipboard.writeText(url);document.querySelector('#price-status').textContent='Configuration link copied.';}catch{document.querySelector('#share-link').select();document.querySelector('#price-status').textContent='Your configuration link is ready to copy.';}};
 document.querySelector('#download-price').onclick=()=>{const s=snapshot(),t=s.totals;const money=v=>new Intl.NumberFormat('en',{style:'currency',currency:config.currency}).format(v);download('site-killick-budget.txt',`SITE KILLICK — SAMPLE BUDGET\n${s.timestampUTC}\n\nPlanning example only. Not an approved quote.\n\nTeam: ${config.employees} people\nModules: ${config.modules.join(', ')||'Workspace only'}\nMonthly equivalent: ${money(t.recurring)}\nPayment schedule: ${config.annual?'Annual':'Monthly'}\nRecurring invoice: ${money(t.billed)}\nHardware: ${money(t.hardware)}\nOnboarding: ${money(t.setup)}\nInitial payment: ${money(t.billed+t.oneTime)}\n\nTaxes and shipping excluded.\n\nReturn to configuration:\n${location.origin}/pricing?${configQuery()}`,'text/plain');document.querySelector('#price-status').textContent='Sample budget downloaded. No enquiry has been submitted.';};refresh();
}
