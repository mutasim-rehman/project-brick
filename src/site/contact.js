import { icon, escapeHtml as esc, api, apiBase, download } from './utils.js';
import { normalizeConfig, calculate } from './pricing.js';

export function formatSlot(utc, zone) {
  return new Intl.DateTimeFormat('en', { timeZone: zone, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date(utc));
}
export function sampleSlots(now = new Date()) {
  const slots = [];
  for (let day = 1; slots.length < 12; day++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + day, 14));
    if ([0,6].includes(d.getUTCDay())) continue;
    for (const hour of [14,16,18]) { d.setUTCHours(hour); slots.push({ id: d.toISOString(), startUTC: d.toISOString() }); }
  }
  return slots;
}
export function calendarFile(utc, reference, confirmed = false) {
  const date = d => new Date(d).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const safeRef = String(reference).replace(/[^a-zA-Z0-9-]/g, '');
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Site Killick//Meeting Request//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${safeRef}@site-killick.local`,`DTSTAMP:${date(new Date())}`,`DTSTART:${date(utc)}`,`DTEND:${date(new Date(utc).getTime()+30*60000)}`,`SUMMARY:Site Killick demo${confirmed ? '' : ' - unconfirmed preference'}`,`STATUS:${confirmed ? 'CONFIRMED' : 'TENTATIVE'}`,`DESCRIPTION:${confirmed ? 'Confirmed appointment' : 'Personal reminder only. This time has not been reserved with Site Killick.'}`,'END:VEVENT','END:VCALENDAR',''].join('\r\n');
}
export function contactPage() {
  const query = new URLSearchParams(location.search), hold = query.get('intent') === 'price-hold';
  const field = (label,name,type='text',extra='') => `<label>${label}<input name="${name}" type="${type}" ${extra}></label>`;
  return `<section class="page-intro wrap"><p class="eyebrow">LET'S TALK / START WITH YOUR SITE</p><h1>${hold ? 'Make the setup<br>your own.' : 'A conversation.<br>Grounded in your work.'}</h1><p>${hold ? 'Share your configuration and request an approved quote with a 14-day price hold.' : 'Tell us what slows the day down. We will focus the conversation on the workflows that matter to your team.'}</p></section><section class="wrap contact-layout"><aside class="contact-aside"><p class="eyebrow">YOUR SITE KILLICK WALKTHROUGH</p><h2>Real questions.<br>A practical next step.</h2><ul class="check-list"><li>${icon('check')}Discuss your operational bottlenecks</li><li>${icon('check')}Explore the relevant role workflows</li><li>${icon('check')}Review your hardware requirements</li><li>${icon('check')}Agree on a pilot scope</li></ul><div class="contact-meta">${icon('clock')}30-minute introductory conversation</div><p class="small">${apiBase ? 'Choose an available time after sharing your details.' : 'Booking is not live yet. You can prepare and download a request; nothing is sent or reserved.'}</p><a class="text-button" href="/legal/privacy">Your information & privacy ${icon('arrow-up-right')}</a></aside><div class="contact-main"><div class="step-indicator"><span id="step-one" class="active">01 &nbsp; Your operation</span><span id="step-two">02 &nbsp; Your preferred time</span></div><form id="contact-form"><div class="form-grid">${field('Your name *','name','text','required maxlength="100" autocomplete="name"')}${field('Work email *','email','email','required maxlength="254" autocomplete="email"')}${field('Company name *','company','text','required maxlength="160" autocomplete="organization"')}${field('Company website','website','url','placeholder="https://" maxlength="300"')}<label>Operating territory *<select name="territory" required><option value="">Select territory</option>${['Canada','United States','United Kingdom','Europe','Australia','New Zealand','Other'].map(x=>`<option>${x}</option>`).join('')}</select></label><label>Industry sub-sector *<select name="sector" required><option value="">Select sector</option>${['General contracting','Civil & infrastructure','Commercial construction','Residential construction','Specialty trades','Other'].map(x=>`<option>${x}</option>`).join('')}</select></label>${field('Field employees *','employees','number','required min="1" max="100000" value="25"')}${field('Fleet size','fleet','number','min="0" max="100000" value="0"')}${field('Tool count','tools','number','min="0" max="1000000" value="0"')}<label>Pilot timeline *<select name="timeline" required><option>Within 30 days</option><option>1-3 months</option><option>3-6 months</option><option>Exploring options</option></select></label><label>Primary pain point *<select name="pain" required>${['Owner overload','Payroll discrepancies','Tool loss','Safety compliance','Fleet visibility','Other'].map(x=>`<option>${x}</option>`).join('')}</select></label>${field('Conversation topic','topic','text',`maxlength="160" value="${esc(query.get('topic') || (hold ? '14-day price hold' : 'Product walkthrough'))}"`)}</div><label class="full-label">What would a better day look like?<textarea name="message" rows="4" maxlength="2000" placeholder="A little context about your sites and the work you want to improve."></textarea></label><label class="checkbox-label"><input name="consent" type="checkbox" required><span>I have read the <a href="/legal/privacy" target="_blank" rel="noopener">privacy draft</a> and agree to include these details in my request.</span></label><div id="attached-config"></div><button class="button primary" type="submit">Continue to preferred time ${icon('arrow-right')}</button></form><section id="scheduling" hidden><button id="back-to-details" class="text-button">${icon('arrow-left')}Back to your details</button><h2>Choose a preferred time.</h2><p class="small" id="availability-note"></p><label>Time zone<select id="timezone"></select></label><div id="time-slots" class="time-slots" role="group" aria-label="Meeting times"></div><p id="selected-time" aria-live="polite">Select a time to continue.</p><button id="submit-booking" class="button primary" disabled>${apiBase ? 'Submit request' : 'Prepare request'} ${icon('arrow-right')}</button><p id="booking-status" role="status"></p></section><section id="booking-result" hidden aria-live="polite"></section></div></section>`;
}
export function bindContact(refreshIcons) {
  const form = document.querySelector('#contact-form'), scheduling = document.querySelector('#scheduling');
  let details, selected, slots = [], pricing = null, busy = false;
  try { const raw = new URLSearchParams(location.search).get('config'); if (raw) pricing = normalizeConfig(JSON.parse(raw)); } catch { /* Invalid shared configurations do not block contact. */ }
  if (pricing) {
    form.elements.employees.value = pricing.employees;
    document.querySelector('#attached-config').innerHTML = `<div class="notice">${icon('paperclip')}<span>Configuration attached: ${pricing.employees} employees, ${esc(pricing.currency)}, ${pricing.modules.length} modules. Illustrative prices are subject to approval.</span></div>`;
  }
  const timezone = document.querySelector('#timezone');
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const zones = [...new Set([detected,'UTC', ...(Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : ['America/Toronto','America/Vancouver','America/New_York','Europe/London','Europe/Paris','Asia/Karachi','Australia/Sydney','Pacific/Auckland'])])];
  timezone.innerHTML = zones.map(z => `<option value="${esc(z)}">${esc(z.replaceAll('_',' '))}</option>`).join('');
  const renderSlots = () => {
    document.querySelector('#time-slots').innerHTML = slots.map((slot,i) => `<button class="slot" data-slot="${i}" aria-pressed="${selected?.id===slot.id}">${esc(formatSlot(slot.startUTC,timezone.value))}</button>`).join('');
    document.querySelectorAll('[data-slot]').forEach(button => { button.onclick = () => { selected = slots[Number(button.dataset.slot)]; renderSlots(); }; });
    document.querySelector('#selected-time').textContent = selected ? `${apiBase ? 'Selected' : 'Unconfirmed preference'}: ${formatSlot(selected.startUTC,timezone.value)}` : 'Select a time to continue.';
    document.querySelector('#submit-booking').disabled = !selected;
  };
  timezone.onchange = renderSlots;
  form.onsubmit = async event => {
    event.preventDefault();
    if (!form.reportValidity() || busy) return;
    details = Object.fromEntries(new FormData(form));
    form.hidden = true; scheduling.hidden = false;
    document.querySelector('#step-one').classList.remove('active'); document.querySelector('#step-two').classList.add('active');
    document.querySelector('#availability-note').textContent = apiBase ? 'Loading current availability...' : 'Sample times only. Choose a preference for your draft request; these are not live available appointments.';
    try {
      if (apiBase) {
        const data = await api(`scheduling/availability?territory=${encodeURIComponent(details.territory)}&timezone=${encodeURIComponent(timezone.value)}`);
        slots = Array.isArray(data.slots) ? data.slots.filter(s => typeof s.id === 'string' && Number.isFinite(Date.parse(s.startUTC)) && Date.parse(s.startUTC) > Date.now()) : [];
        document.querySelector('#availability-note').textContent = slots.length ? 'Times are shown in your selected time zone. Availability is rechecked on submission.' : 'No available appointments. Try again later.';
      } else slots = sampleSlots();
      selected = slots.find(s => s.id===selected?.id) || null;
      renderSlots();
    } catch (error) { slots = []; selected = null; renderSlots(); document.querySelector('#availability-note').textContent = error.message; }
    scheduling.querySelector('h2').setAttribute('tabindex','-1'); scheduling.querySelector('h2').focus();
  };
  document.querySelector('#back-to-details').onclick = () => {
    scheduling.hidden = true; form.hidden = false;
    document.querySelector('#step-one').classList.add('active'); document.querySelector('#step-two').classList.remove('active');
    form.elements.name.focus();
  };
  let requestKey = crypto.randomUUID(), previousRequest = '';
  document.querySelector('#submit-booking').onclick = async () => {
    if (!selected || busy) return;
    busy = true;
    const button = document.querySelector('#submit-booking'); button.disabled = true;
    document.querySelector('#back-to-details').disabled = true;
    const fingerprint = JSON.stringify({details, slotId:selected.id, timezone:timezone.value, pricing});
    if (previousRequest && previousRequest !== fingerprint) requestKey = crypto.randomUUID();
    previousRequest = fingerprint;
    const payload = { inquiryRef: `DRAFT-${requestKey}`, timestampUTC: new Date().toISOString(), qualification: details, timezone: timezone.value, slotId: selected.id, startUTC: selected.startUTC, configuration: pricing, illustrativeTotals: pricing ? calculate(pricing) : null, intent: new URLSearchParams(location.search).get('intent') || 'demo', status: 'draft-not-submitted' };
    try {
      let confirmed = false;
      if (apiBase) {
        const inquiry = await api('inquiries/submit', { method:'POST', headers: {'Idempotency-Key':requestKey}, body:JSON.stringify(payload) });
        if (!inquiry.inquiryRef) throw new Error('The inquiry response was incomplete. Please retry using this same request.');
        const booking = await api('scheduling/book', { method:'POST', headers: {'Idempotency-Key':`${requestKey}-booking`}, body:JSON.stringify({ inquiryRef:inquiry.inquiryRef, slotId:payload.slotId, timezone:payload.timezone }) });
        if (!booking.confirmed || !booking.startUTC || !Number.isFinite(Date.parse(booking.startUTC))) throw new Error('Your inquiry was received, but the appointment is not confirmed. Please choose another time or retry.');
        payload.inquiryRef = inquiry.inquiryRef; payload.startUTC = booking.startUTC; payload.status = 'confirmed'; confirmed = true;
      }
      scheduling.hidden = true;
      const result = document.querySelector('#booking-result'); result.hidden = false;
      result.innerHTML = `<span class="large-icon">${icon(confirmed ? 'calendar-check' : 'file-check')}</span><h2>${confirmed ? 'Your appointment is confirmed.' : 'Your request is ready.'}</h2><p>${confirmed ? 'Your meeting time has been reserved.' : 'This is a draft. It has not been sent, and the preferred time is not reserved.'}</p><div class="confirmation-details"><strong>${esc(details.company)}</strong><p>${esc(formatSlot(payload.startUTC,timezone.value))}</p><p>${esc(details.email)}</p><p class="small">Reference: ${esc(payload.inquiryRef)}</p></div><div class="actions"><button class="button primary" id="download-request">${icon('download')}Download request</button><button class="button" id="download-calendar">${icon('calendar-plus')}${confirmed ? 'Add to calendar' : 'Save tentative reminder'}</button></div><a class="text-button" href="/contact">Start another request ${icon('arrow-right')}</a>`;
      document.querySelector('#download-request').onclick = () => download('site-killick-request.json',JSON.stringify(payload,null,2));
      document.querySelector('#download-calendar').onclick = () => download('site-killick-meeting.ics', calendarFile(payload.startUTC,requestKey,confirmed),'text/calendar');
      refreshIcons(); result.querySelector('h2').setAttribute('tabindex','-1'); result.querySelector('h2').focus();
    } catch(error) { document.querySelector('#booking-status').textContent = error.message; }
    finally { busy = false; button.disabled = false; document.querySelector('#back-to-details').disabled = false; }
  };
}
