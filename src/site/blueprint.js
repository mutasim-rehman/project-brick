import { icon } from './utils.js';

const logo = new URL('../../SiteKillick_Final_Master_4096px.png', import.meta.url).href;
const zones = [
  { id: 'office', name: 'Site office', position: 'office', title: 'The context stays with the work.', copy: 'A shared record gives the office a place to review the day, without rebuilding it from calls and messages.', metric: 'Review', label: 'Office workflow', rows: [['Record', 'Daily site report'], ['Owner', 'Project manager'], ['Next step', 'Review site updates']] },
  { id: 'equipment', name: 'Plant & equipment', position: 'equipment', title: 'Know what needs attention.', copy: 'Keep the equipment record, reported issues and service follow-up together so the next action has an owner.', metric: 'Service', label: 'Equipment workflow', rows: [['Record', 'Equipment issue'], ['Owner', 'Fleet manager'], ['Next step', 'Review service request']] },
  { id: 'crew', name: 'Crew check-in', position: 'crew', title: 'A shift starts with a record.', copy: 'An NFC badge connects a site check-in to the attendance record. A supervisor reviews exceptions before approval.', metric: 'Check-in', label: 'People workflow', rows: [['Signal', 'NFC site badge'], ['Record', 'Crew attendance'], ['Next step', 'Supervisor review']] },
  { id: 'work', name: 'Foundation works', position: 'work', title: 'Progress with a person responsible.', copy: 'Keep the day’s work and the supporting site records in context, ready for the person responsible to review.', metric: 'Progress', label: 'Work workflow', rows: [['Record', 'Daily work update'], ['Owner', 'Site supervisor'], ['Next step', 'Review recorded work']] },
  { id: 'stores', name: 'Tool storage', position: 'stores', title: 'Every handoff has a trail.', copy: 'Link a tagged tool to its last recorded custodian, so the next handoff starts with a clear record.', metric: 'Handoff', label: 'Assets workflow', rows: [['Signal', 'Tool tag'], ['Record', 'Last custodian'], ['Next step', 'Confirm tool handoff']] },
];

export const blueprintBrand = () => `<a class="brand blueprint-brand" href="/" aria-label="Site Killick home"><span class="blueprint-brand-mark"><img src="${logo}" width="64" height="64" alt="" /></span><span>Site Killick</span></a>`;

const ribs = (x, y, width, height, step = 9) => Array.from({ length: Math.floor(width / step) }, (_, i) => `<path d="M${x + i * step} ${y}v${height}"/>`).join('');
const container = (x, y, width, height) => `<g><rect x="${x}" y="${y}" width="${width}" height="${height}"/><rect x="${x + 5}" y="${y + 5}" width="${width - 10}" height="${height - 10}"/>${ribs(x + 11, y + 7, width - 20, height - 14)}<path d="M${x - 4} ${y - 8}h${width + 8}m-${width + 4} -4v8m${width} -8v8"/></g>`;
const tree = (x, y, size = 14) => `<g transform="translate(${x} ${y}) scale(${size / 14})" stroke-width=".75"><path d="M0-14q6-5 9 2 8-2 7 6 7 4 1 10 2 7-6 8-3 7-10 2-7 3-10-4-8 0-6-8-5-5 1-10 0-8 8-7Z"/><path d="M0-10q6-3 8 4 7 3 2 9 0 7-7 6-6 5-10-2-5-1-3-7-3-6 5-7Z" opacity=".55"/><path d="M0 0 7-6M0 0-7-4M0 0 3 8M-3 7 0 0 0-9"/><circle r="2"/></g>`;
const vehicle = (x, y, rotate = 0) => `<g transform="translate(${x} ${y}) rotate(${rotate})"><rect x="-17" y="-33" width="34" height="66" rx="5"/><path d="M-13-13h26v26h-26Zm0-13h26v9h-26Zm0 43h26v9h-26ZM-21-21v12m42-12v12m-42 29v12m42-12v12"/><path d="M-10-11v22m20-22v22M-12-23h24m-24 44h24M-16-7h-7m39 0h7M-10-31v3m20-3v3" stroke-width=".6"/><path d="M-16 13v12m32-12v12" stroke-width="2.4"/><circle cy="2" r="3" stroke-width=".6"/></g>`;
const person = (x, y) => `<g transform="translate(${x} ${y})"><circle cy="-7" r="4"/><path d="M-6 9V0q6-6 12 0v9m-9-8v14m6-14v14"/></g>`;

const pallet = (x, y, angle = 0) => `<g transform="translate(${x} ${y}) rotate(${angle})"><rect width="28" height="23"/><path d="M3 3h22v17H3Zm6 0v17m10-17v17M0 8h28M0 15h28"/></g>`;
const footing = (x, y) => `<g transform="translate(${x} ${y})"><rect width="21" height="21" fill="url(#bp-hatch)"/><rect x="6" y="6" width="9" height="9"/><path d="M-4 10.5h29M10.5-4v29" stroke-dasharray="2 2"/></g>`;

function draftingDetail() {
  return `<g class="bp-drafting-detail" stroke="currentColor" stroke-width=".65" opacity=".7">
    <g aria-label="Boundary fencing">${Array.from({length: 36}, (_, i) => `<path d="M${107+i*24} 44v15"/><circle cx="${107+i*24}" cy="49" r="1.8"/>`).join('')}${Array.from({length: 11}, (_, i) => `<path d="M37 ${122+i*20}h14M1039 ${122+i*20}h14"/>`).join('')}</g>
    <path d="M65 121 108 70H307V193H64M646 70H966L1021 124V340L972 386H826" stroke-dasharray="12 3 2 3"/>
    <path d="M69 226H310v-29h317v143h178" stroke-dasharray="5 3"/><path d="M76 230H315v-29h307v144h183" opacity=".4"/>
    <g>${[136,183,230].map(x=>`<path d="M${x} 139v13m-8-13v13M${x-14} 151h28v8h-28Z"/><path d="M${x} 159v19m0-19a19 19 0 0 1 19 19"/>`).join('')}</g>
    <path d="M106 187h191v10H106Zm12 3h165M107 80v-5h190v5M112 135h181"/>
    <path d="M681 137h165v9H681Zm201 0h109v9H882Z"/>
    ${pallet(211,247)}${pallet(246,247)}${pallet(211,278)}${pallet(246,278)}${pallet(210,311)}${pallet(246,312)}
    ${Array.from({length: 6}, (_,i)=>`<circle cx="${102+i*14}" cy="219" r="5"/><circle cx="${102+i*14}" cy="219" r="2.5"/>`).join('')}
    <path d="M96 210h84v18H96ZM104 361h84m-84 5h84M299 266h13v28h-13Z"/>
    ${[604,614,624].map(x=>`<path d="M${x} 357v27m-3-27h6m-6 27h6"/>`).join('')}
    <path d="M304 299h93v80h-93ZM312 306v65h25v-65m8 0v65h25v-65m8 0v65h12M698 337h60v52h-60Z" stroke-dasharray="3 3"/>
    <g transform="translate(465 118) rotate(-22)"><rect x="-41" y="-22" width="83" height="12" rx="4"/><rect x="-41" y="13" width="83" height="12" rx="4"/>${Array.from({length:15},(_,i)=>`<path d="M${-36+i*5}-21v10m0 25v10"/>`).join('')}<circle r="17"/><circle r="11"/><path d="M-14-20h22v23h-22Zm-5 8h-14v21h14M-10-18v17m7-17v17m7-17v17M24-12 72-23l25 37M68-27l5 8m23 28-6 5m12 7 13-7m-13 12 13-7"/></g>
    <g transform="translate(572 94)"><rect width="33" height="60"/><path d="M4 5h25v18H4Zm0 25h25v23H4Zm0 7h25m-25 8h25M0 10h-4v12h4m33-12h4v12h-4M0 40h-4v12h4m33-12h4v12h-4"/></g>
    <path d="M409 83a64 64 0 0 1 110-9" stroke-dasharray="2 4"/><path d="M516 69l3 5-6 1"/>
    ${[685,765,845,925].map(x=>[202,282].map(y=>footing(x,y)).join('')).join('')}
    <path d="M675 224h296m-296 6h296m-296 42h296m-296 6h296M741 191v118m6-118v118M821 191v118m6-118v118M901 191v118m6-118v118" opacity=".55"/>
    <path d="M651 159H994M651 155v9m343-9v9M651 153v17M994 153v17M1014 178V321m-5-143h10m-10 143h10M678 344h147m-147-4v8m147-8v8"/>
    <path d="M847 336h130v50H847ZM854 342h115v40H854Z" stroke-dasharray="3 3"/>
    ${[867,887,907,927,947].map(x=>`<path d="M${x} 353v21m-4-21h8m-8 21h8"/><circle cx="${x}" cy="363" r="3"/>`).join('')}
    <g transform="translate(592 253)"><rect x="-8" y="-17" width="16" height="34" rx="2"/><path d="M-4-12h8v10h-8Zm0 19h8M11-7q9 7 0 14m5-20q15 13 0 26"/><circle cy="4" r="2"/></g>
    <path d="M395 215h177M395 306h177" stroke-dasharray="2 5"/>
    <path d="M436 364v38m0-38a38 38 0 0 1 38 38M611 364v38m0-38a38 38 0 0 0-38 38"/>
    ${[443,462,584,603].map(x=>`<circle cx="${x}" cy="418" r="2"/>`).join('')}
    ${Array.from({length:4},(_,i)=>`<path d="M${82+i*7} 372q25-19 54-8t43 5q23 3 39-7" opacity="${.2+i*.12}"/>`).join('')}
    <g stroke-dasharray="3 3" opacity=".45"><path d="M87 200H997M637 66V383M82 335H989"/></g>
  </g><g class="bp-drafting-notes" fill="currentColor" stroke="none" font-family="monospace" font-size="7" letter-spacing=".6" opacity=".75"><text x="117" y="207">MATERIALS / LAYDOWN</text><text x="702" y="152">DELIVERY &amp; UNLOADING</text><text x="758" y="154">←</text><text x="852" y="157">FOUNDATION FOOTPRINT</text><text x="370" y="70">PLANT TURNING AREA</text><text x="79" y="35">BOUNDARY / TEMPORARY FENCING</text><text x="590" y="283" transform="rotate(90 590 283)">NFC</text><text x="318" y="390">PARKING</text><text x="689" y="339">A</text><text x="951" y="339">A</text></g>`;
}

function sitePlan() {
  return `<svg class="blueprint-plan" viewBox="0 0 1100 450" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><pattern id="bp-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="currentColor" stroke-opacity=".10"/></pattern><pattern id="bp-major" width="100" height="100" patternUnits="userSpaceOnUse"><rect width="100" height="100" fill="url(#bp-grid)"/><path d="M100 0H0V100" fill="none" stroke="currentColor" stroke-opacity=".16"/></pattern><pattern id="bp-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v6" stroke="currentColor" stroke-opacity=".28"/></pattern></defs>
    <rect width="1100" height="450" fill="url(#bp-major)"/>
    <g class="bp-plan-regions"><rect class="bp-plan-region bp-plan-region--office" x="94" y="74" width="221" height="114"/><rect class="bp-plan-region bp-plan-region--equipment" x="323" y="75" width="300" height="107"/><rect class="bp-plan-region bp-plan-region--crew" x="335" y="203" width="282" height="118"/><rect class="bp-plan-region bp-plan-region--work" x="656" y="173" width="334" height="154"/><rect class="bp-plan-region bp-plan-region--stores" x="847" y="336" width="129" height="50"/></g>
    <g class="blueprint-drawing" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round">
      <path d="M42 113 95 49H975L1048 117V334L981 405H654L612 363H434L391 405H107L42 347Z" stroke-width="3"/><path d="M51 116 100 59H970L1038 121V331L977 395H659L617 353H429L386 395H111L52 342Z" stroke-dasharray="3 5"/>
      <path d="M37 28H1054M28 40V412M1070 40V412M37 428H1054" opacity=".5"/>
      ${Array.from({ length: 14 }, (_, i) => `<path d="M${70 + i * 72} 22v12M${70 + i * 72} 422v12"/>`).join('')}
      ${container(107, 82, 190, 57)}${container(97, 239, 98, 119)}${container(685, 78, 155, 57)}${container(884, 86, 104, 49)}
      <path d="M83 151h239v34H83ZM205 239h80v118h-80Z" fill="url(#bp-hatch)"/>
      <path d="M323 75v107h300V75M332 86h54v44h-54Zm5 5h44m-22 0v34M576 91h31v67h-31Z"/>
      <g transform="translate(465 118) rotate(-22)"><rect x="-38" y="-17" width="77" height="34" rx="5"/><path d="M-33-12h66m-66 24h66"/><rect x="-18" y="-25" width="32" height="38"/><path d="M-10-19h17v20h-17Zm26 1 55-12 30 41-9 7-29-34-45 15Z"/><path d="m92 18 9 16 18-10-9-17Z"/></g>
      <path d="M662 179H984V321H662Z" stroke-width="2"/><path d="M674 191H972V309H674Z"/><path d="M662 212h322m-322 77h322M716 179v142m80-142v142m80-142v142m72-142v142"/>
      ${[674,754,834,914].map(x=>`<path d="M${x} 198h17v17h-17ZM${x} 286h17v17h-17Z" fill="url(#bp-hatch)"/>`).join('')}
      <path d="M653 169h339m-339 163h339M645 179v142M1001 179v142" stroke-dasharray="4 5"/>
      <g class="bp-crew-drawing">${person(416, 254)}${person(465, 243)}${person(512, 267)}${person(551, 240)}${person(455, 290)}</g>
      <path d="M335 203h282v118H335Z" stroke-dasharray="5 7"/><path d="M351 216h18m-18 0v18m247-18h-18m18 0v18M351 307h18m-18 0v-18m247 18h-18m18 0v-18"/>
      ${vehicle(331, 337)}${vehicle(372, 337)}${vehicle(728, 363, 90)}
      ${container(856, 347, 107, 34)}
      ${draftingDetail()}
      <path d="M476 405v-27m-7 8 7-8 7 8m69 19v-27m-7 8 7-8 7 8M437 410h37m81 0h40"/>
      ${[[77,211],[70,327],[111,383],[236,381],[591,77],[634,96],[636,138],[1006,158],[1016,203],[1010,300],[985,362],[817,381]].map(([x,y])=>tree(x,y)).join('')}
      <g transform="translate(1053 55)"><circle r="17"/><path d="M0-25v50m-25-25h50M0-13l-5 13h10Z"/></g>
    </g>
    <g fill="currentColor" font-family="monospace" font-size="9" letter-spacing="2" opacity=".65">${'ABCDEFGHIJKLMN'.split('').map((l,i)=>`<text x="${67+i*72}" y="16">${l}</text>`).join('')}<text x="1049" y="24">N</text><text x="40" y="447">SITE KILLICK / PROPOSED SITE PLAN</text><text x="463" y="443">SITE ACCESS ↑</text><text x="906" y="443">NOT TO SCALE</text></g>
  </svg>`;
}

const record = zone => `<span class="bp-record-label">${zone.label}</span><strong class="bp-record-metric">${zone.metric}</strong><h2>${zone.title}</h2><p>${zone.copy}</p><dl>${zone.rows.map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl><a href="/platform">Explore the platform ${icon('arrow-up-right')}</a>`;

export function blueprintHero() {
  return `<section class="blueprint-surface" id="home-overview" data-chapter-section><div class="blueprint-hero">
    <div class="bp-heading"><h1>A place for everything.<br>A pulse on everyone.</h1><p>Construction operations. <br>People, work and assets. <br>Connected by a record.</p></div>
    <div class="bp-layout"><div class="bp-map-column"><div class="bp-map-heading"><span><i></i> One site. A connected picture.</span><span>Select a zone to explore ${icon('arrow-down')}</span></div><div class="bp-map" data-active-zone="crew">${sitePlan()}<div class="bp-zone-controls" role="group" aria-label="Explore site workflows">${zones.map(zone=>`<button type="button" class="bp-zone bp-zone--${zone.position}" data-site-zone="${zone.id}" aria-pressed="${zone.id==='crew'}" aria-controls="bp-record">${zone.name}<span>${zone.id==='crew'?'Selected':'Explore'} ${icon('arrow-up-right')}</span></button>`).join('')}</div></div><div class="bp-map-footer"><span>Illustrative site · example workflows</span></div></div>
    <aside class="bp-record" id="bp-record" aria-live="polite" aria-atomic="true">${record(zones[2])}</aside></div>
    <a class="bp-story-link" href="#home-workday"><span>The field and the office.<br>Finally on the same page.</span><span class="bp-story-arrow" aria-hidden="true">${icon('arrow-right')}</span><span class="bp-story-caption">See the owner’s story<br><small>Leave the site at the site.</small></span></a>
  </div></section>`;
}

export function bindBlueprint() {
  const controls = [...document.querySelectorAll('[data-site-zone]')];
  const panel = document.querySelector('#bp-record');
  if (!panel) return;
  bindRollover();
  controls.forEach(button => button.addEventListener('click', () => {
    const zone = zones.find(item => item.id === button.dataset.siteZone);
    if (!zone || button.getAttribute('aria-pressed') === 'true') return;
    document.querySelector('.bp-map').dataset.activeZone = zone.id;
    controls.forEach(control => {
      const selected = control === button;
      control.setAttribute('aria-pressed', String(selected));
      control.querySelector('span').firstChild.textContent = selected ? 'Selected ' : 'Explore ';
    });
    panel.innerHTML = record(zone).replaceAll(icon('arrow-up-right'), '<span aria-hidden="true">↗</span>');
  }));
}

function bindRollover() {
  const surface = document.querySelector('.blueprint-surface');
  const cover = document.querySelector('#home-workday');
  const header = document.querySelector('.site-header');
  if (!surface || !cover || !header) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let headerHeight = header.offsetHeight;
  const updateCoverage = () => {
    frame = 0;
    // Occluded controls must not receive keyboard focus underneath the story.
    surface.inert = !still.matches && cover.getBoundingClientRect().top <= headerHeight;
  };
  const scheduleCoverage = () => {
    if (!frame) frame = requestAnimationFrame(updateCoverage);
  };
  const measure = () => {
    headerHeight = header.offsetHeight;
    // A tall hero scrolls through fully before its lower edge is pinned.
    const pinTop = Math.min(headerHeight, window.innerHeight - surface.offsetHeight);
    surface.style.setProperty('--bp-pin-top', `${pinTop}px`);
    surface.classList.toggle('has-rollover', !still.matches);
    scheduleCoverage();
  };
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
  observer?.observe(surface);
  observer?.observe(header);
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('scroll', scheduleCoverage, { passive: true });
  still.addEventListener('change', measure);
  measure();
  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    observer?.disconnect();
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', measure);
    window.removeEventListener('scroll', scheduleCoverage);
    still.removeEventListener('change', measure);
  }, { once: true });
}
