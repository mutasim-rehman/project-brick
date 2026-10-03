import { icon, escapeHtml as esc, api, apiBase, download } from './utils.js';
import { normalizeConfig, calculate } from './pricing.js';
import { contactEmail } from './shared.js';

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

export function contactPage(){
 const connected=Boolean(apiBase||contactEmail);
 return `<section class="wrap page-intro"><p class="eyebrow">LET’S START WITH ONE SITE</p><h1>Less friction.<br><em>A practical first step.</em></h1><p>Choose one workflow worth improving. We’ll use your site, team and priorities to shape the pilot conversation.</p></section><section class="wrap contact-layout"><aside class="contact-aside"><p class="eyebrow">WHAT TO WORK THROUGH</p><h2>A focused pilot.<br>A clear scope.</h2><ul class="check-list"><li>${icon('check')}The workflow causing the most follow-up</li><li>${icon('check')}Your site, team and responsible roles</li><li>${icon('check')}Any devices and compatibility checks</li><li>${icon('check')}What your team needs to evaluate</li></ul><div class="contact-meta">${icon('users')}One site is a good place to start.</div><p class="small">No subscription or hardware purchase is created by an enquiry. Pilot availability and commercial terms are agreed separately.</p></aside><div>${connected?`<form id="contact-form" class="contact-form"><div id="attached-config"></div><div class="form-grid"><label>Your name<input name="name" required maxlength="100" autocomplete="name"></label><label>Work email<input name="email" type="email" required maxlength="254" autocomplete="email"></label></div><label class="full-label">Company<input name="company" required maxlength="160" autocomplete="organization"></label><label class="full-label">Which workflow would you like to improve?<textarea name="message" rows="4" maxlength="2000" placeholder="For example: tracking tool handoffs between our two sites."></textarea></label><p class="form-privacy">${apiBase?'Your details will be sent to the Site Killick enquiry service.':'This opens a draft in your email app. You review it and send it yourself.'} Read the <a href="/legal/privacy">privacy information</a>.</p><div class="actions"><button class="button primary" type="submit">${apiBase?'Send pilot enquiry':'Open email enquiry'} ${icon('arrow-up-right')}</button></div><p id="contact-status" role="status"></p></form>`:`<div class="contact-pending"><p class="eyebrow">PRELAUNCH PREVIEW</p><h2>Pilot enquiries open soon.</h2><p>Explore the sample workflows and build a budget while we prepare the enquiry channel. There is no waiting-list submission or appointment booking on this preview.</p><div id="attached-config"></div><div class="actions"><a class="button primary" href="/platform">Try a sample workflow ${icon('arrow-right')}</a><a class="text-link" href="/pricing">Plan your budget ${icon('arrow-right')}</a></div></div>`}</div></section>`;
}
export function bindContact(refreshIcons){
 let pricing=null;try{const raw=new URLSearchParams(location.search).get('config');if(raw)pricing=normalizeConfig(JSON.parse(raw));}catch{}
 if(pricing){document.querySelector('#attached-config').innerHTML=`<div class="notice">${icon('paperclip')}<span>Your sample configuration is attached: ${pricing.employees} people, ${pricing.modules.length} optional modules, ${esc(pricing.currency)}. <a href="/pricing?config=${encodeURIComponent(JSON.stringify(pricing))}">Edit configuration</a></span></div>`;refreshIcons?.();}
 const form=document.querySelector('#contact-form');if(!form)return;
 let busy=false,previous='',key=crypto.randomUUID();
 form.onsubmit=async e=>{e.preventDefault();if(busy||!form.reportValidity())return;const qualification=Object.fromEntries(new FormData(form));const payload={qualification,configuration:pricing,illustrativeTotals:pricing?calculate(pricing):null,intent:'pilot',timestampUTC:new Date().toISOString()};const fingerprint=JSON.stringify({qualification,pricing});if(previous&&previous!==fingerprint)key=crypto.randomUUID();previous=fingerprint;
 const status=document.querySelector('#contact-status');
 if(!apiBase){const body=`Hello Site Killick,\n\nI'd like to discuss a pilot.\n\nName: ${qualification.name}\nCompany: ${qualification.company}\nReply email: ${qualification.email}\n\nWorkflow: ${qualification.message||'To discuss'}${pricing?`\n\nSample configuration:\n${location.origin}/pricing?config=${encodeURIComponent(JSON.stringify(pricing))}`:''}\n\nThanks,\n${qualification.name}`;location.href=`mailto:${contactEmail}?subject=${encodeURIComponent('Site Killick pilot enquiry')}&body=${encodeURIComponent(body)}`;status.textContent='Email draft requested. Review and send it from your email app; this website has not sent an enquiry.';return;}
 busy=true;const submit=form.querySelector('[type=submit]');submit.disabled=true;status.textContent='Sending your enquiry…';
 try{const result=await api('inquiries/submit',{method:'POST',headers:{'Idempotency-Key':key},body:JSON.stringify(payload)});if(!result.inquiryRef)throw new Error('The service did not confirm receipt. Please retry.');status.textContent=`Your enquiry was received. Reference: ${result.inquiryRef}. No appointment has been booked.`;form.reset();key=crypto.randomUUID();previous='';}catch(error){status.textContent=error.message;}finally{busy=false;submit.disabled=false;}
 };
}
