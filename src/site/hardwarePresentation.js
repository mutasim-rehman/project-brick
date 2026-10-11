import { intro } from './shared.js';
import { icon, escapeHtml as e } from './utils.js';
import { deviceScene } from './hardwareMotion.js';
import { connectionDiagram } from './experiences.js';

export function hardwarePresentation(devices) {
  return `${intro('Hardware / field devices', 'The signal starts here.', 'Four devices. A shared record. Explore how each piece connects the field to your team.')}
  <section class="device-catalog wrap"><div class="device-catalog-head"><h2>Built around the work.</h2><p>Explore illustrative devices and proposed workflows. Compatibility and availability are confirmed during a pilot.</p></div>
  <div class="hardware-scroll"><div class="hardware-stage">
  <nav class="hardware-device-nav" aria-label="Explore hardware">${devices.map((device,i)=>`<button type="button" data-hardware-index="${i}" aria-pressed="${i===0}"><span>0${i+1}</span>${e(device.rail)}</button>`).join('')}</nav>
  <div class="device-grid">${devices.map((device,i)=>`<article class="device-card" id="${device.id}" data-device-index="${i}"><div class="device-copy"><p class="eyebrow">${e(device.kicker)}</p><h3>${e(device.title)}</h3><p>${e(device.copy)}</p><span class="hardware-scroll-hint">SCROLL TO EXPLORE ↓</span></div>${deviceScene(device)}<div class="device-record-column"><p class="eyebrow">FROM SIGNAL TO ACTION</p><div class="hardware-beat-cards" aria-label="Example workflow">${device.beats.map((beat,n)=>`<article class="hardware-beat-card ${n===0 ? 'is-current-beat' : ''}" data-beat-index="${n}"><span class="beat-number">0${n+1}</span><div><p class="beat-label">${e(beat.label)}</p><h4>${e(beat.caption)}</h4><p class="beat-detail">${e(beat.rows[beat.rows.length-1][0])} · ${e(beat.rows[beat.rows.length-1][1])}</p></div></article>`).join('')}</div></div></article>`).join('')}</div>
  <div class="hardware-position" aria-hidden="true"><span class="hardware-position-fill"></span></div></div></div>
  <p class="device-disclaimer">Illustrations are examples. Review <a href="/legal/hardware">hardware terms and warranty information</a> for current approved details.</p></section>
  ${connectionDiagram()}`;
}
