import { modules, roles } from './content.js';
import { icon, escapeHtml as e } from './utils.js';
import { examples, productDemo, bindDemos } from './demo.js';
import { intro } from './shared.js';
const safe = e;

function modulePanel(module) {
  const sample = examples[module.id];
  return `<section class="module-detail" aria-live="polite"><div class="module-detail-copy"><p class="eyebrow">${safe(sample.label)}</p><h3>${safe(module.short)}</h3><p>${safe(module.capability)}</p><dl class="module-proof"><div><dt>What it starts with</dt><dd>${safe(module.inputs)}</dd></div><div><dt>What it leaves behind</dt><dd>${safe(module.output)}</dd></div><div><dt>Who works with it</dt><dd>${safe(module.roles)}</dd></div><div><dt>Human decision</dt><dd>${safe(module.decision)}</dd></div></dl><div class="module-features">${module.features.map(feature => `<span>${safe(feature)}</span>`).join('')}</div></div><div class="module-sample">${productDemo(module.id)}</div></section>`;
}

export function platformPage() {
  const selected = modules[0];
  return `${intro('Platform / connected workflows', 'A clearer picture of the workday.', 'Explore the records Site Killick proposes to connect across people, work, safety, tools, fleet and the office.')}
    <section class="wrap platform-explorer" aria-labelledby="platform-explorer-title"><div class="platform-explorer-head"><h2 id="platform-explorer-title">Start with one part of the operation.</h2><p>Each example shows the input, record and follow-up together. Sample data only; this is not a live workspace.</p></div><div class="module-picker" role="group" aria-label="Choose a workflow">${modules.map((module, index) => `<button type="button" data-module="${module.id}" aria-pressed="${index === 0}">${icon(module.icon)}<span>${safe(module.title.replace(' & ', ' + '))}</span></button>`).join('')}</div><div id="module-detail">${modulePanel(selected)}</div></section>
    <section class="wrap utility-next"><div><h2>See how a record moves through the day.</h2><p>Follow one example from the first signal to a human decision.</p></div><a class="button light" href="/how-it-works">How it works ${icon('arrow-right')}</a></section>`;
}

export function bindPlatform() {
  const host = document.querySelector('#module-detail');
  const picker = document.querySelector('.module-picker');
  if (!host || !picker) return;
  const buttons = [...picker.querySelectorAll('[data-module]')];
  const choose = id => {
    const module = modules.find(item => item.id === id) || modules[0];
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.module === module.id)));
    host.innerHTML = modulePanel(module);
    bindDemos(host);
  };
  buttons.forEach(button => button.addEventListener('click', () => choose(button.dataset.module)));
  const requested = new URLSearchParams(location.search).get('module');
  if (requested && modules.some(module => module.id === requested)) choose(requested);
  else bindDemos(host);
}

const workSteps = [
  ['01', 'Capture the signal', 'A tap, assignment, photo, safety record or equipment update starts with a source.'],
  ['02', 'Keep the context', 'The event stays with the site, asset, person or work it belongs to.'],
  ['03', 'Route the follow-up', 'A named role receives the record and the next action.'],
  ['04', 'Review and decide', 'A supervisor reviews the evidence and approves, corrects or escalates.'],
];

export function rolesPage() {
  const roleLinks = roles.map(role => `<a href="/platform?module=${encodeURIComponent(role.module)}">${safe(role.name)} ${icon('arrow-up-right')}</a>`).join('');
  return `${intro('How it works / one record, clear ownership', 'From a site signal to a clear next step.', 'Site information should travel with the work. These four stages show the proposed handoff; a person stays responsible for the decision.')}
    <section class="wrap journey-page"><div class="journey-intro"><h2>One connected handoff.</h2><p>Records can begin in the field and reach the office with their source and follow-up attached.</p></div><div class="journey-line" aria-label="Four stages of a proposed workflow">${workSteps.map(([number, title, copy]) => `<article class="journey-step"><span>${number} / WORKFLOW</span><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div><section class="journey-role-panel"><div><p class="eyebrow">Different roles, shared context</p><h3>Start with the person doing the work.</h3><p>Choose a role to open a relevant example in the platform preview.</p></div><div class="role-chips">${roleLinks}</div></section></section>`;
}

const anchorArt = `<svg viewBox="0 0 500 380" fill="none" aria-hidden="true"><path d="M65 294H436M91 314H408" stroke="#b8bbae"/><path d="m136 262 220-114 15 22-218 115Z" fill="#967856"/><path d="m132 164 224 110 16-28-223-111Z" fill="#ba956b"/><path d="m166 235 20-91 110-12 51 100-90 48Z" fill="#828b80"/><path d="m166 235 91 45 90-48-77 14Z" fill="#626f64"/><path d="m186 144 84 102 26-114Z" fill="#a1a79a"/><path d="m219 280 9-205 19-8 6 213Z" fill="#927049"/><path d="m253 280-6-213 12 12 14 197Z" fill="#b38f63"/><path d="M245 82c-34-38-45-60-22-68 25-9 40 30 23 68Z" stroke="#d6c4a2" stroke-width="8"/><path d="m211 198 73-7m-73 16 73-7m-73 16 73-7" stroke="#d6c4a2" stroke-width="7"/></svg>`;

export function aboutPage() {
  return `<section class="wrap about-editorial"><div class="about-origin"><div class="about-origin-copy"><p class="eyebrow">About Site Killick / Atlantic Canada</p><h1>Built around a simple idea: the day should not follow you home.</h1><p>Site Killick is a construction operations and asset intelligence platform concept. It is designed to connect the records behind a working day so fewer unanswered questions depend on one person.</p><p>The name comes from the killick, a traditional stone-and-timber anchor associated with Atlantic Canada: a fitting image for a record that gives work a place to hold.</p><div class="actions"><a class="button primary" href="/platform">Explore the workflows ${icon('arrow-right')}</a><a class="text-link" href="/legal">Trust and policies ${icon('arrow-right')}</a></div></div><figure class="intro-art about-origin-art">${anchorArt}<figcaption>A killick · stone and timber</figcaption></figure></div><div class="about-principles"><article class="about-principle"><span>01 / FIELD FIRST</span><h3>Fit the workday.</h3><p>Keep attendance, work updates, safety and assets close to the people who create those records.</p></article><article class="about-principle"><span>02 / SHARED CONTEXT</span><h3>Make handoffs visible.</h3><p>Connect each issue to its source, its responsible role and the next follow-up.</p></article><article class="about-principle"><span>03 / HUMAN AUTHORITY</span><h3>Keep decisions with people.</h3><p>Recommendations and drafts can support a review. Supervisors retain approval authority.</p></article></div><aside class="about-trust"><p><strong>Product preview.</strong> The workflows shown here are examples. Availability, security details, insurance, warranties and commercial terms require confirmation.</p><div class="actions"><a class="text-link" href="/legal">Review policy topics ${icon('arrow-right')}</a><a class="text-link" href="/hardware">See the devices ${icon('arrow-right')}</a></div></aside></section>`;
}
