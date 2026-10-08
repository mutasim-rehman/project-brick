import { modules, roles, policies } from './content.js';
import { icon, escapeHtml } from './utils.js';
import { cta } from './shared.js';
import { examples } from './demo.js';
import { storyPage, storyHero, downLink, textLink, lightLink } from './story.js';

export { cta } from './shared.js';

const card = () => `<svg viewBox="0 0 320 220" aria-hidden="true"><rect x="36" y="24" width="248" height="172" rx="20" fill="#102a47"/><rect x="58" y="48" width="84" height="10" rx="2" fill="var(--lime)"/><rect x="58" y="76" width="160" height="8" rx="2" fill="#f6f3ea"/><rect x="58" y="98" width="124" height="8" rx="2" fill="#9aa58f"/><rect x="58" y="132" width="36" height="28" rx="4" fill="var(--lime)"/></svg>`;

const homeLogo = new URL('../../SiteKillick_Final_Master_4096px.png', import.meta.url).href;
const homeVisual = `<img class="home-logo-art" src="${homeLogo}" alt="Site Killick logo showing a construction worker secured to an anchor above the company name." />`;

const ownerScene = () => `<div class="owner-scene" aria-label="Construction animation for the owner story"><div class="scene-room-label"><span class="status-dot"></span><span id="scene-moment">THE OWNER WHO CAN NEVER LEAVE</span></div><div id="construction-model" role="img" aria-label="Three-dimensional construction sequence showing a building assembled from foundations to handover"><div class="scene-loading" id="construction-loading">${icon('building-2')}<span>Preparing model</span></div><div class="scene-fallback" id="construction-fallback" hidden>${icon('building-2')}<span>Construction preview</span></div></div><div class="scene-caption" id="scene-caption">Every unanswered question finds its way home.</div><div class="scene-sequence" aria-hidden="true"><span class="active"></span><span></span><span></span></div></div><div class="scene-controls"><button id="motion-toggle" class="scene-control" aria-pressed="false" aria-label="Pause construction animation">${icon('pause')}<span>Pause animation</span></button></div>`;

const killick = `<svg viewBox="0 0 500 380" fill="none" aria-hidden="true"><path d="M65 294H436M91 314H408" stroke="#b8bbae"/><path d="m136 262 220-114 15 22-218 115Z" fill="#967856"/><path d="m132 164 224 110 16-28-223-111Z" fill="#ba956b"/><path d="m166 235 20-91 110-12 51 100-90 48Z" fill="#828b80"/><path d="m166 235 91 45 90-48-77 14Z" fill="#626f64"/><path d="m186 144 84 102 26-114Z" fill="#a1a79a"/><path d="m219 280 9-205 19-8 6 213Z" fill="#927049"/><path d="m253 280-6-213 12 12 14 197Z" fill="#b38f63"/><path d="M245 82c-34-38-45-60-22-68 25-9 40 30 23 68Z" stroke="#d6c4a2" stroke-width="8"/><path d="m211 198 73-7m-73 16 73-7m-73 16 73-7" stroke="#d6c4a2" stroke-width="7"/></svg>`;

export function homePage() {
  return storyPage({
    hero: {
      id: 'home-overview',
      rail: 'Start',
      kicker: 'A construction owner’s day',
      titleHtml: 'The site follows you <em>home.</em>',
      copy: 'Your company should not depend on one person carrying every unanswered question.',
      actions: `${downLink('#home-workday', 'See how it works')}${textLink('/platform', 'Explore the platform')}`,
      note: 'The Owner Who Can Never Leave. Records on this page are examples.',
      visual: homeVisual,
    },
    chapters: [
      {
        id: 'home-workday',
        rail: 'Workday',
        kicker: '01 / The workday follows',
        title: 'The site follows you home.',
        copy: 'A missing clock-out. A tool with no clear handoff. A vehicle moving after hours. Each question lands with the same person: you.',
        figure: ownerScene(),
        caption: 'Construction sequence · illustration',
        beats: [
          { label: 'Clock-out', caption: 'A missing clock-out finds its way home.', rows: [['Question', 'Missing clock-out'], ['Where it lands', 'The owner'], ['Record', 'Not in one place']] },
          { label: 'Tool', caption: 'A tool with no clear handoff becomes your problem.', rows: [['Question', 'Who has the tool'], ['Trail', 'Messages and memory'], ['Record', 'No last custodian']] },
          { label: 'Vehicle', caption: 'Movement after hours still reaches you.', rows: [['Question', 'Where the vehicle went'], ['When', 'After the shift'], ['Record', 'Scattered updates']] },
          { label: 'Owner', caption: 'Every unanswered question finds the same person.', rows: [['Person', 'The owner'], ['Load', 'The whole day'], ['Need', 'A place for each issue']] },
        ],
      },
      {
        id: 'home-dinner',
        rail: 'Dinner',
        kicker: '02 / Dinner, interrupted',
        title: 'You meant to be off the clock.',
        copy: 'The calls keep coming, and the details are scattered across messages and paper invoices.',
        figure: card(),
        caption: 'Proposed workflow · example',
        beats: [
          { label: 'Calls', caption: 'The shift is over. The calls are not.', rows: [['Moment', 'After hours'], ['Channel', 'Phone calls'], ['Owner', 'Still the contact']] },
          { label: 'Messages', caption: 'The detail is split across threads.', rows: [['Source', 'Messages'], ['Gap', 'No shared record'], ['Result', 'The day gets rebuilt']] },
          { label: 'Invoices', caption: 'Paper still holds part of the day.', rows: [['Source', 'Paper invoices'], ['Need', 'A record with the work'], ['Status', 'Waiting on you']] },
          { label: 'One person', caption: 'It is hard to leave the site when you are holding it together.', rows: [['Dependency', 'One person'], ['Cost', 'The evening'], ['Next', 'Give each issue a place']] },
        ],
      },
      {
        id: 'home-handoff',
        rail: 'Handoff',
        kicker: '03 / The handoff',
        title: 'Give each issue a place to go.',
        copy: 'Site Killick connects a record to the person responsible. Your team can follow up with the context, while you keep the decisions that truly need you.',
        figure: card(),
        caption: 'Proposed workflow · example',
        beats: [
          { label: 'Record', caption: 'Site information is recorded with the work.', rows: [['Record', 'Attendance, work, safety or assets'], ['Status', 'Captured'], ['Example', 'Sample record']] },
          { label: 'Route', caption: 'The issue reaches the responsible role.', rows: [['To', 'Assigned role'], ['With', 'The record'], ['Owner', 'No longer the switchboard']] },
          { label: 'Review', caption: 'A person reviews the record before it moves on.', rows: [['Review', 'Human review'], ['Context', 'Kept with the issue'], ['Status', 'Ready for a decision']] },
          { label: 'Approve', caption: 'Human approval remains part of the workflow.', rows: [['Decision', 'Approve, correct or escalate'], ['Authority', 'A person'], ['Result', 'The day can close']] },
        ],
      },
    ],
    summary: {
      id: 'home-picture',
      rail: 'Picture',
      kicker: 'One site',
      title: 'Site records. Connected to the right people.',
      note: 'A proposed workflow. Human supervisors retain approval.',
      cards: [
        { title: 'People and work', copy: 'Attendance and the day, with a person responsible.' },
        { title: 'Safety and records', copy: 'Evidence that stays with the follow-up.' },
        { title: 'Tools and assets', copy: 'A handoff with a last custodian.' },
        { title: 'Vehicles and equipment', copy: 'Movement and service on the equipment record.' },
      ],
      actions: `${lightLink('/platform', 'Explore the platform')}${textLink('/hardware', 'See the hardware')}`,
    },
  });
}

export function bindHome(refreshIcons) {
  const motion = document.querySelector('#motion-toggle');
  const modelHost = document.querySelector('#construction-model');
  if (!motion || !modelHost) return;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = media.matches;
  let constructionModel;
  const syncMotion = () => {
    motion.setAttribute('aria-pressed', String(paused));
    motion.setAttribute('aria-label', paused ? 'Play construction animation' : 'Pause construction animation');
    motion.innerHTML = `${icon(paused ? 'play' : 'pause')}<span>${paused ? 'Play animation' : 'Pause animation'}</span>`;
    refreshIcons();
    constructionModel?.setPaused(paused);
  };
  motion.onclick = () => { paused = !paused; syncMotion(); };
  media.addEventListener('change', event => { paused = event.matches; syncMotion(); });
  syncMotion();
  import('../scene/SiteModel.js').then(({ SiteModel }) => {
    constructionModel = new SiteModel(modelHost, { paused, scrollDriven: false, duration: 12, zoom: .78 });
    document.querySelector('#construction-loading')?.remove();
    syncMotion();
  }).catch(error => {
    console.warn('Construction preview unavailable:', error);
    document.querySelector('#construction-loading')?.remove();
    const fallback = document.querySelector('#construction-fallback');
    if (fallback) fallback.hidden = false;
    refreshIcons();
    motion.hidden = true;
  });
}

const platformLabels = { people: 'People', work: 'Work', safety: 'Safety', tools: 'Tools', fleet: 'Fleet', intelligence: 'Office' };

export function platformPage() {
  return storyPage({
    hero: {
      id: 'platform-overview',
      rail: 'Start',
      kicker: 'The platform / six connected workflows',
      titleHtml: 'The whole day. <em>In the same picture.</em>',
      copy: 'Move through people, work, safety, tools, fleet and the office. Each record shown is an example.',
      actions: `${downLink('#module-people', 'Start with people')}${textLink('/hardware', 'See the hardware')}`,
      note: 'Interactive examples are proposed workflows, not a live workspace.',
    },
    chapters: modules.map(module => {
      const example = examples[module.id];
      return {
        id: `module-${module.id}`,
        rail: platformLabels[module.id],
        kicker: example.label,
        title: example.title,
        copy: module.capability,
        figure: card(),
        caption: 'Proposed workflow · example',
        beats: [
          { label: 'Problem', caption: module.problem, rows: [['Area', example.label], ['Gap', module.problem], ['Roles', module.roles]] },
          { label: 'Record', caption: example.detail, rows: [['Record', example.heading], ['Person', example.name], ['Context', example.role]] },
          { label: 'Review', caption: 'A person reviews the sample before anything moves on.', rows: [['Action', example.action], ['Status', example.badge], ['Approval', 'Human review']] },
          { label: 'Result', caption: module.decision, rows: [['Output', module.output], ['Decision', module.decision], ['Source', 'Example record']] },
        ],
      };
    }),
    summary: {
      id: 'platform-picture',
      rail: 'Picture',
      kicker: 'Six workflows',
      title: 'One operating picture for the whole day.',
      note: 'Availability and compatibility are agreed as part of a pilot.',
      cards: modules.map(module => ({ title: examples[module.id].label, copy: module.short })),
      actions: `${lightLink('/how-it-works', 'How it works')}${textLink('/contact', 'Book a demo')}`,
    },
  });
}

export function bindPlatform() {
  const id = new URLSearchParams(location.search).get('module');
  if (id) document.getElementById(`module-${id}`)?.scrollIntoView({ behavior: 'instant', block: 'start' });
}

const roleLabels = { 'Business Owner': 'Owner', 'Project Manager': 'Manager', 'Safety Administrator': 'Safety', 'Payroll Administrator': 'Payroll', Foreman: 'Foreman', Supervisor: 'Supervisor', 'Lead Hand': 'Lead', 'Worker / Labourer': 'Worker', 'Fleet Manager': 'Fleet' };
const roleTitles = {
  'Business Owner': 'The day should not follow you home.',
  'Project Manager': 'Progress stays with the work.',
  'Safety Administrator': 'Evidence stays with the response.',
  'Payroll Administrator': 'Hours arrive ready for review.',
  Foreman: 'The field stays a few taps away.',
  Supervisor: 'Follow-up has a name on it.',
  'Lead Hand': 'The handoff stays with the tool.',
  'Worker / Labourer': 'Clock in. See the shift. Keep the record.',
  'Fleet Manager': 'The fleet stays on one record.',
};
const roleSlug = name => `role-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

export function rolesPage() {
  return storyPage({
    hero: {
      id: 'roles-overview',
      rail: 'Start',
      kicker: 'How it works / role-based learning',
      titleHtml: 'Workflows for <em>each role.</em>',
      copy: 'Scroll a role to see the record it works from. Onboarding steps, training videos, captions and transcripts require approved content.',
      actions: downLink('#role-business-owner', 'Start with the owner'),
      note: 'Each example is a proposed workflow.',
    },
    chapters: roles.map(role => {
      const example = examples[role.module];
      return {
        id: roleSlug(role.name),
        rail: roleLabels[role.name],
        kicker: `For the ${role.name}`,
        title: roleTitles[role.name],
        copy: role.need,
        figure: card(),
        caption: `${example.label} · example`,
        beats: [
          { label: 'Need', caption: role.need, rows: [['Role', role.name], ['Looks for', example.label], ['Status', 'Proposed workflow']] },
          { label: 'Record', caption: example.detail, rows: [['Record', example.heading], ['Person', example.name], ['Context', example.role]] },
          { label: 'Review', caption: 'A person keeps the decision.', rows: [['Action', example.action], ['Approval', 'Human review'], ['Training', 'Pending approved content']] },
        ],
      };
    }),
    summary: {
      id: 'roles-picture',
      rail: 'Picture',
      kicker: 'Nine roles',
      title: 'The same record. A different responsible person.',
      note: 'Role-specific training material requires approved content.',
      cards: [
        { title: 'Office', copy: 'Owner, project manager, safety and payroll.' },
        { title: 'Field', copy: 'Foreman, supervisor, lead hand and worker.' },
        { title: 'Fleet', copy: 'Vehicles, equipment and maintenance.' },
        { title: 'Approval', copy: 'A person still makes the decision.' },
      ],
      actions: `${lightLink('/platform', 'See the workflows')}${textLink('/contact', 'Book a demo')}`,
    },
  });
}

export function bindRoles() {
  const name = new URLSearchParams(location.search).get('role');
  const role = roles.find(item => item.name === name);
  if (role) document.getElementById(roleSlug(role.name))?.scrollIntoView({ behavior: 'instant', block: 'start' });
}

export function aboutPage() {
  return storyPage({
    hero: {
      id: 'about-overview',
      rail: 'Start',
      kicker: 'About and trust / Atlantic Canadian roots',
      titleHtml: 'Site Killick. <em>An anchor for the day.</em>',
      copy: 'Site Killick’s mission is to restore balance to construction founders by reducing owner dependency, operational friction and uncertainty.',
      actions: downLink('#about-name', 'The name'),
      note: 'Security, insurance and warranty language require approved content.',
    },
    chapters: [
      {
        id: 'about-name',
        rail: 'Name',
        kicker: 'The name',
        title: 'A traditional Atlantic Canadian anchor.',
        copy: 'A killick is a stone-and-timber anchor associated with Atlantic Canada. Site Killick is a construction operations and asset intelligence platform.',
        figure: killick,
        caption: 'The killick · stone and timber',
        beats: [
          { label: 'Stone', caption: 'A killick holds with stone and timber.', rows: [['Name', 'Killick'], ['Origin', 'Atlantic Canada'], ['Form', 'Stone and timber']] },
          { label: 'Anchor', caption: 'The name is an anchor, not a claim about a finished product.', rows: [['Meaning', 'Something that holds'], ['Place', 'Atlantic Canada'], ['Use', 'The company name']] },
          { label: 'Platform', caption: 'The product is construction operations and asset intelligence.', rows: [['Product', 'Site Killick'], ['Work', 'Operations and assets'], ['Promise', 'Described in the workflows']] },
        ],
      },
      {
        id: 'about-approval',
        rail: 'Approval',
        kicker: 'Responsible AI',
        title: 'Human approval stays in the workflow.',
        copy: 'AI generates recommendations and draft reports. Human supervisors retain final approval authority.',
        figure: card(),
        caption: 'Proposed workflow · example',
        beats: [
          { label: 'Draft', caption: 'A draft can be prepared from site records.', rows: [['Output', 'Draft summary'], ['Source', 'Site activity'], ['Status', 'Not a decision']] },
          { label: 'Recommend', caption: 'A recommendation stays attached to its source.', rows: [['Output', 'Recommendation'], ['Context', 'Supporting record'], ['Limit', 'Not an approval']] },
          { label: 'Decide', caption: 'A supervisor keeps final approval.', rows: [['Authority', 'Human supervisor'], ['Choice', 'Approve, correct or escalate'], ['Record', 'The decision stays with the source']] },
        ],
      },
    ],
    summary: {
      id: 'about-trust',
      rail: 'Trust',
      kicker: 'Trust information',
      title: 'Security, privacy and insurance.',
      note: 'Security and privacy information, insurance details, warranty terms and legal policies require approved content.',
      cards: [
        { title: 'Policies', copy: 'Topics are listed for review. Final text is pending.', href: '/legal' },
        { title: 'Hardware terms', copy: 'Warranty language is not published yet.', href: '/legal/hardware' },
        { title: 'Security contact', copy: 'A contact path for vulnerability reports.', href: '/legal/security' },
        { title: 'Privacy', copy: 'Privacy information requires approval.', href: '/legal/privacy' },
      ],
      actions: lightLink('/legal', 'View policy topics'),
    },
  });
}

const policyLabels = { terms: 'Terms', privacy: 'Privacy', cookies: 'Cookies', 'acceptable-use': 'Use', accessibility: 'Access', subscription: 'Plan', hardware: 'Warranty', service: 'Service', 'data-processing': 'Data', ai: 'AI', security: 'Contact' };

export function legalPage(slug) {
  const policy = policies.find(item => item.slug === slug);
  if (slug && !policy) return notFound();
  const nav = `<nav class="policy-nav" aria-label="Policy topics"><a href="/legal" ${!slug ? 'aria-current="page"' : ''}>All topics</a>${policies.map(item => `<a href="/legal/${item.slug}" ${item.slug === slug ? 'aria-current="page"' : ''}>${escapeHtml(policyLabels[item.slug] || item.title)}</a>`).join('')}</nav>`;
  if (!policy) {
    return `<section class="wrap page-intro"><p class="eyebrow">Trust / policy topics</p><h1>Policy topics are awaiting approval.</h1><p>Final policy text requires legal review before publication. These links show the topics being prepared, not current policy terms.</p></section><section class="wrap legal-layout">${nav}<div class="legal-content"><div class="notice">${icon('info')}<span>Nothing on this page is a final policy, warranty or insurance statement.</span></div><div class="policy-list">${policies.map(item => `<a href="/legal/${item.slug}"><div><h2>${escapeHtml(item.title)}</h2><p>Content is pending legal review and approval.</p></div>${icon('arrow-right')}</a>`).join('')}</div></div></section>`;
  }
  return `<section class="wrap page-intro"><p class="eyebrow">Trust / policy topic</p><h1>${escapeHtml(policy.title)}</h1><p>Final policy text requires legal review and approval before publication.</p></section><section class="wrap legal-layout">${nav}<article class="legal-content"><div class="notice">${icon('info')}<span>This is a placeholder for review. It is not a final policy, warranty or insurance statement.</span></div><h2>Approved wording is not available yet.</h2><p>${escapeHtml(policy.title)} is listed here so visitors can see which information is being prepared. The final content will appear after review.</p><p><a class="text-link" href="/legal">Browse all policy topics ${icon('arrow-left')}</a></p></article></section>`;
}

export function signInPage(url) {
  return url
    ? storyHero({ kicker: 'Workspace access', title: 'Continue to Site Killick.', copy: 'Open the Site Killick application workspace.', actions: `<a class="button primary" href="${escapeHtml(url)}">Sign in ${icon('arrow-right')}</a>` })
    : notFound();
}

export function notFound() {
  return storyHero({
    kicker: '404 / A little off site',
    titleHtml: 'Let’s get you <em>back on track.</em>',
    copy: 'This page could not be found.',
    actions: `<a class="button primary" href="/">Back to the site ${icon('arrow-right')}</a>`,
  });
}
