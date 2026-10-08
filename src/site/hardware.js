import { intro } from './shared.js';
import { icon, escapeHtml } from './utils.js';

const nfc = `<svg viewBox="0 0 320 260" aria-hidden="true">
  <rect x="54" y="28" width="148" height="196" rx="22" fill="#102a47"/>
  <rect x="70" y="46" width="116" height="28" rx="6" fill="#284561"/>
  <circle cx="128" cy="128" r="34" fill="none" stroke="#d2e15a" stroke-width="8"/>
  <path d="M116 128c4-10 12-16 24-14" fill="none" stroke="#f6f3ea" stroke-width="4" stroke-linecap="round"/>
  <path d="M112 112c10-16 28-22 46-12M108 100c16-22 46-28 70-12" fill="none" stroke="#d2e15a" stroke-width="4" stroke-linecap="round"/>
  <rect x="176" y="118" width="92" height="112" rx="14" fill="#f7f4ea" stroke="#102a47" stroke-width="4"/>
  <rect x="190" y="134" width="64" height="8" rx="2" fill="#102a47"/>
  <rect x="190" y="152" width="46" height="6" rx="2" fill="#9aa58f"/>
  <rect x="190" y="168" width="54" height="6" rx="2" fill="#c5d0b8"/>
  <circle cx="222" cy="204" r="10" fill="#d2e15a"/>
</svg>`;

const guard = `<svg viewBox="0 0 320 260" aria-hidden="true">
  <rect x="78" y="58" width="164" height="144" rx="28" fill="#102a47"/>
  <rect x="62" y="86" width="28" height="36" rx="8" fill="#284561"/>
  <rect x="230" y="86" width="28" height="36" rx="8" fill="#284561"/>
  <rect x="62" y="138" width="28" height="36" rx="8" fill="#284561"/>
  <rect x="230" y="138" width="28" height="36" rx="8" fill="#284561"/>
  <circle cx="108" cy="88" r="6" fill="#d2e15a"/>
  <circle cx="212" cy="88" r="6" fill="#d2e15a"/>
  <circle cx="108" cy="172" r="6" fill="#d2e15a"/>
  <circle cx="212" cy="172" r="6" fill="#d2e15a"/>
  <path d="M146 118h28M160 104v28" stroke="#d2e15a" stroke-width="6" stroke-linecap="square"/>
  <rect x="124" y="154" width="72" height="8" rx="2" fill="#f6f3ea"/>
</svg>`;

const tool = `<svg viewBox="0 0 320 260" aria-hidden="true">
  <rect x="96" y="70" width="128" height="120" rx="24" fill="#102a47"/>
  <circle cx="124" cy="98" r="6" fill="#d2e15a"/>
  <circle cx="196" cy="98" r="6" fill="#d2e15a"/>
  <circle cx="124" cy="162" r="6" fill="#d2e15a"/>
  <circle cx="196" cy="162" r="6" fill="#d2e15a"/>
  <path d="M148 124c6-8 18-8 24 0" fill="none" stroke="#f6f3ea" stroke-width="4" stroke-linecap="round"/>
  <path d="M140 112c10-14 30-14 40 0" fill="none" stroke="#d2e15a" stroke-width="4" stroke-linecap="round"/>
  <rect x="132" y="146" width="56" height="7" rx="2" fill="#f6f3ea"/>
</svg>`;

const gateway = `<svg viewBox="0 0 320 260" aria-hidden="true">
  <rect x="118" y="46" width="14" height="22" rx="2" fill="#c6a15a"/>
  <rect x="140" y="46" width="14" height="22" rx="2" fill="#c6a15a"/>
  <rect x="162" y="46" width="14" height="22" rx="2" fill="#c6a15a"/>
  <rect x="184" y="46" width="14" height="22" rx="2" fill="#c6a15a"/>
  <rect x="78" y="68" width="164" height="128" rx="16" fill="#102a47"/>
  <rect x="98" y="90" width="86" height="8" rx="2" fill="#f6f3ea"/>
  <rect x="98" y="110" width="64" height="6" rx="2" fill="#9aa58f"/>
  <rect x="98" y="148" width="28" height="18" rx="4" fill="#d2e15a"/>
</svg>`;

const devices = [
  {
    id: 'nfc-badge',
    rail: 'NFC',
    kicker: '01 / NFC SITE BADGE',
    title: 'One tap. Attendance, payroll and safety.',
    copy: 'A battery-free NFC point records who is on site. The same tap can support hours and a headcount.',
    figure: nfc,
    steps: ['Tap', 'Attendance', 'Payroll', 'Headcount'],
    beats: [
      { label: 'Tap', caption: 'Know the right worker made the tap.', rows: [['Worker', 'Sample employee'], ['Site', 'Example site'], ['Event', 'NFC tap']] },
      { label: 'Attendance', caption: 'Turn the tap into an attendance record.', rows: [['Record', 'Clock-in'], ['Source', 'NFC site badge'], ['Status', 'Ready for review']] },
      { label: 'Payroll', caption: 'Surface the exception before hours are approved.', rows: [['Issue', 'Missing clock-out'], ['Context', 'Supervisor review'], ['Approval', 'Still with a person']] },
      { label: 'Headcount', caption: 'Use the same presence when safety needs a count.', rows: [['Check', 'Who is accounted for'], ['Source', 'Attendance record'], ['Follow-up', 'Assigned role']] },
    ],
  },
  {
    id: 'guard-tag',
    rail: 'Guard',
    kicker: '02 / GUARD TAG',
    title: 'Protect it quietly. Recover it with a record.',
    copy: 'A guard tag stays with a protected asset. When something needs attention, the last known place stays with the follow-up.',
    figure: guard,
    steps: ['Assign', 'Detect', 'Locate', 'Recover'],
    beats: [
      { label: 'Assign', caption: 'The asset and the tag share one record.', rows: [['Asset', 'Sample equipment'], ['Tag', 'Guard tag'], ['Status', 'Assigned']] },
      { label: 'Detect', caption: 'An exception is recorded when the asset needs attention.', rows: [['Event', 'Needs review'], ['Asset', 'Sample equipment'], ['Status', 'Open']] },
      { label: 'Locate', caption: 'Add a place and a time to the record.', rows: [['Place', 'Last known area'], ['Time', 'Example event'], ['Source', 'Guard tag']] },
      { label: 'Recover', caption: 'Close the loop with a person, not a search.', rows: [['Follow-up', 'Assigned role'], ['Record', 'Recovery in progress'], ['Approval', 'Human review']] },
    ],
  },
  {
    id: 'tool-tag',
    rail: 'Tools',
    kicker: '03 / TOOL TAG',
    title: 'Thousands of tools. One inventory picture.',
    copy: 'A BLE and NFC tool tag keeps identity, custody and the latest handoff with the tool.',
    figure: tool,
    steps: ['Identify', 'Assign', 'Handoff', 'Find'],
    beats: [
      { label: 'Identify', caption: 'The tool keeps an identity when the battery does not.', rows: [['Tool', 'Sample tool'], ['Tag', 'BLE / NFC'], ['Record', 'Asset identity']] },
      { label: 'Assign', caption: 'Start with the right custodian.', rows: [['Custodian', 'Sample worker'], ['Tool', 'Sample tool'], ['Status', 'Assigned']] },
      { label: 'Handoff', caption: 'Keep the trail with the tool.', rows: [['From', 'Previous custodian'], ['To', 'Next custodian'], ['Event', 'Handoff recorded']] },
      { label: 'Find', caption: 'Search from the last recorded place.', rows: [['Last seen', 'Example area'], ['Custodian', 'Last handoff'], ['Next', 'Recovery follow-up']] },
    ],
  },
  {
    id: 'vehicle-gateway',
    rail: 'Gateway',
    kicker: '04 / VEHICLE GATEWAY',
    title: 'The vehicle becomes a moving site gateway.',
    copy: 'A vehicle gateway connects location and compatible operating data to the equipment record.',
    figure: gateway,
    steps: ['Connect', 'Travel', 'Arrive', 'Service'],
    beats: [
      { label: 'Connect', caption: 'The vehicle and the gateway share a record.', rows: [['Vehicle', 'Sample vehicle'], ['Gateway', 'Vehicle gateway'], ['Status', 'Connected']] },
      { label: 'Travel', caption: 'Follow the reported journey.', rows: [['Update', 'Location recorded'], ['Vehicle', 'Sample vehicle'], ['Source', 'Gateway']] },
      { label: 'Arrive', caption: 'Reconcile the vehicle at the site.', rows: [['Event', 'Site arrival'], ['Site', 'Example site'], ['Record', 'Added to the day']] },
      { label: 'Service', caption: 'Bring operating hours into the service review.', rows: [['Data', 'Engine hours'], ['Source', 'Compatible gateway'], ['Next', 'Maintenance review']] },
    ],
  },
];

export function hardwarePage() {
  return `${intro('Hardware / field devices', 'Four devices. Four kinds of site signal.', 'See what each device is for, and the kind of record it can contribute. Compatibility and availability are confirmed as part of a pilot.')}
    <section class="wrap device-catalog"><div class="device-catalog-head"><h2>Choose a device to understand its job.</h2><p>These illustrations and records describe proposed workflows, not confirmed specifications or a live deployment.</p></div><div class="device-grid">${devices.map(device => `<article class="device-card" id="${device.id}"><div class="device-art">${device.figure}</div><div class="device-copy"><p class="eyebrow">${escapeHtml(device.kicker)}</p><h3>${escapeHtml(device.title)}</h3><p>${escapeHtml(device.copy)}</p><div class="device-steps" aria-label="Example workflow">${device.steps.map(step => `<span>${escapeHtml(step)}</span>`).join('')}</div></div></article>`).join('')}</div><p class="device-disclaimer">Illustrations are examples. Review <a href="/legal/hardware">hardware terms and warranty information</a> for current approved details.</p></section>
    <section class="wrap utility-next"><div><h2>See how device signals connect to work.</h2><p>Explore the people, work, safety, tools and fleet records they can support.</p></div><a class="button light" href="/platform">Explore the platform ${icon('arrow-right')}</a></section>`;
}
