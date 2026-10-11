import { animateWorkflow } from './experiences.js';

import { modules, roles } from './content.js';
import { icon, escapeHtml as e } from './utils.js';
import { examples, productDemo, bindDemos } from './demo.js';
import { intro } from './shared.js';
const safe = e;

function modulePanel(module) {
  return '<section class="module-detail" aria-live="polite"><div class="workspace-heading"><div><p class="eyebrow">EXAMPLE SITE / OPERATIONS</p><h3>'+safe(module.title)+'</h3></div><span class="workspace-avatar">SK</span></div><div class="module-sample">'+productDemo(module.id)+'</div><div class="module-detail-copy"><p class="eyebrow">CONNECTED WORKFLOW</p><h3>'+safe(module.short)+'</h3><p>'+safe(module.capability)+'</p><div class="workspace-context"><div><span>INPUT</span><p>'+safe(module.inputs)+'</p></div><div><span>DECISION</span><p>'+safe(module.decision)+'</p></div></div><div class="module-features">'+module.features.map(feature=>'<span>'+safe(feature)+'</span>').join('')+'</div></div></section>';
}

export function platformPage() {
  const selected = modules[0];
  return `${intro('Platform / feature groups', 'One connected construction operating system.', 'Explore the operating problems, records, outputs and decisions across the Site Killick platform. Feature availability and evidence await approved launch content.')}
    <section class="wrap platform-explorer" aria-labelledby="platform-explorer-title"><div class="platform-explorer-head"><h2 id="platform-explorer-title">Start with one part of the operation.</h2><p>Each example shows the input, record and follow-up together. Sample data only; this is not a live workspace.</p></div><div class="platform-browser" id="platform-preview"><div class="browser-chrome"><span class="browser-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="browser-address">Site Killick / interactive product preview</span><span class="browser-preview-label">SAMPLE WORKSPACE</span></div><div class="browser-workspace"><aside class="workspace-sidebar"><div class="workspace-brand">SK<span>+</span><strong>Site Killick</strong></div><p class="workspace-nav-label">YOUR OPERATION</p><div class="module-picker" aria-orientation="vertical" role="tablist" aria-label="Choose a workflow">${modules.map((module, index) => `<button type="button" role="tab" id="tab-${module.id}" aria-controls="module-detail" tabindex="${index === 0 ? 0 : -1}" data-module="${module.id}" aria-selected="${index === 0}" aria-pressed="${index === 0}">${icon(module.icon)}<span>${safe(module.title.replace(' & ', ' + '))}</span></button>`).join('')}</div><div class="workspace-sidebar-note">One site.<br>Every record connected.</div></aside><div id="module-detail" role="tabpanel" aria-labelledby="tab-${selected.id}" tabindex="0">${modulePanel(selected)}</div></div><div class="browser-footnote"><span class="status-dot"></span> Interactive sample · proposed workflows, subject to availability</div></div></section>
    <section class="wrap utility-next"><div><h2>See how a record moves through the day.</h2><p>Follow one example from the first signal to a human decision.</p></div><a class="button light" href="/how-it-works">How it works ${icon('arrow-right')}</a></section>`;
}

export function bindPlatform(refreshIcons = () => {}) {
  const host = document.querySelector('#module-detail');
  const picker = document.querySelector('.module-picker');
  if (!host || !picker) return;
  const buttons = [...picker.querySelectorAll('[data-module]')];
  const choose = id => {
    const module = modules.find(item => item.id === id) || modules[0];
    const previousHeight = host.getBoundingClientRect().height;
    buttons.forEach(button => {
      const selected = button.dataset.module === module.id;
      button.setAttribute('aria-pressed', String(selected));
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    host.setAttribute('aria-labelledby', 'tab-'+module.id);
    host.innerHTML = modulePanel(module);
    moveIndicator();
    animateWorkflow(host, previousHeight);
    refreshIcons();
    bindDemos(host);
  };
  const indicator = document.createElement('span');
  indicator.className = 'module-selection';
  indicator.setAttribute('aria-hidden', 'true');
  picker.prepend(indicator);
  function moveIndicator() {
    const active = buttons.find(button => button.getAttribute('aria-pressed') === 'true');
    indicator.style.width = active.offsetWidth+'px';
    indicator.style.height = active.offsetHeight+'px';
    indicator.style.transform = 'translate('+active.offsetLeft+'px, '+active.offsetTop+'px)';
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => choose(button.dataset.module));
    button.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;
      choose(buttons[next].dataset.module);
      buttons[next].focus();
      buttons[next].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    });
  });
  const resize = new ResizeObserver(moveIndicator);
  resize.observe(picker);
  window.addEventListener('pagehide', () => resize.disconnect(), { once: true });
  moveIndicator();
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
  return `<section class="wrap about-editorial"><div class="about-origin"><div class="about-origin-copy"><p class="eyebrow">About and Trust / Atlantic Canadian brand origin</p><h1>Construction operations and asset intelligence.</h1><p>Site Killick is a construction operations and asset intelligence platform. Its mission is to restore balance to construction founders by reducing owner dependency, operational friction and uncertainty.</p><p>A killick is a traditional Atlantic Canadian stone-and-timber anchor. Site Killick takes its name from this Atlantic Canadian brand origin.</p><div class="actions"><a class="button primary" href="/platform">Explore the platform ${icon('arrow-right')}</a><a class="text-link" href="/legal">Trust and policies ${icon('arrow-right')}</a></div></div><figure class="intro-art about-origin-art">${anchorArt}<figcaption>A killick · stone and timber</figcaption></figure></div><div class="about-principles"><article class="about-principle"><span>Operating principle</span><h3>Evidence before claims.</h3><p>Approved product evidence and customer stories will be included when available.</p></article><article class="about-principle"><span>Responsible AI</span><h3>Human approval.</h3><p>AI may prepare recommendations and draft reports. Human supervisors retain final approval authority.</p></article><article class="about-principle"><span>Security and privacy</span><h3>Information for review.</h3><p>Security, privacy and insurance information is pending approved content. Qualified customers may request insurance evidence through an approved process.</p></article></div><aside class="about-trust"><p><strong>Trust information.</strong> Approved pilot or customer stories, company and contact details, insurance information and security details will be provided when approved.</p><div class="actions"><a class="text-link" href="/legal">Policy topics ${icon('arrow-right')}</a></div></aside></section>`;
}
