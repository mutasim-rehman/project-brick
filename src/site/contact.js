import { icon, api, apiBase } from './utils.js';
import { contactEmail } from './shared.js';
import { intro } from './shared.js';

const topics = `<ul class="check-list"><li>${icon('check')}Company and operating territory</li><li>${icon('check')}Employees, sites, tools and fleet</li><li>${icon('check')}Current process and priority pain point</li><li>${icon('check')}Target pilot timeline</li></ul><p class="small">Final qualification questions and scoring criteria require approval.</p>`;

export function contactPage() {
  const connected = Boolean(apiBase || contactEmail);
  const form = connected
    ? `<form id="contact-form" class="contact-form"><div class="form-grid"><label>Your name<input name="name" required maxlength="100" autocomplete="name"></label><label>Work email<input name="email" type="email" required maxlength="254" autocomplete="email"></label></div><label class="full-label">Company<input name="company" required maxlength="160" autocomplete="organization"></label><label class="full-label">Primary operational pain point<textarea name="message" rows="4" maxlength="2000" placeholder="Payroll discrepancies, tool loss, safety compliance or owner overload"></textarea></label><p class="form-privacy">${apiBase ? 'Your details will be sent to the configured enquiry service.' : 'This opens an email draft for you to review and send.'} Read the <a href="/legal/privacy">privacy information</a>.</p><div class="actions"><button class="button primary" type="submit">${apiBase ? 'Send enquiry' : 'Open email enquiry'} ${icon('arrow-up-right')}</button></div><p id="contact-status" role="status"></p></form>`
    : `<div class="contact-pending"><p class="eyebrow">Prelaunch preview</p><h2>Enquiries are not open here yet.</h2><p>This preview has no live qualification form or booking calendar. Review the proposed product workflows while Site Killick prepares the enquiry and scheduling systems.</p><div class="actions"><a class="button primary" href="/platform">Review product workflows ${icon('arrow-right')}</a><a class="text-link" href="/pricing">Pricing information ${icon('arrow-right')}</a></div></div>`;
  return `${intro('Contact / operational priorities', 'Start with the problem you want to solve.', 'Share the operating context that would make a conversation useful. This page does not book an appointment or create a quote.')}
    <section class="wrap contact-page"><div class="contact-layout-new"><aside class="contact-context"><p class="eyebrow">Useful context</p><h2>What should we understand?</h2><p>A little background helps frame a useful discussion around the operation.</p>${topics}</aside><section class="contact-panel" aria-labelledby="contact-panel-title">${connected ? `<p class="eyebrow">Enquiry</p><h2 id="contact-panel-title">Tell us where the work gets stuck.</h2><p>Your information is used to respond to this enquiry. Read the <a href="/legal/privacy">privacy information</a>.</p>${form}` : form}</section></div></section>`;
}

export function bindContact(){
 const form=document.querySelector('#contact-form');if(!form)return;
 let busy=false,key=crypto.randomUUID();
 form.onsubmit=async e=>{e.preventDefault();if(busy||!form.reportValidity())return;const qualification=Object.fromEntries(new FormData(form));const payload={qualification,intent:'pilot',timestampUTC:new Date().toISOString()};
  const status=document.querySelector('#contact-status');
  if(!apiBase){const body=`Hello Site Killick,\n\nI'd like to discuss my operational priorities.\n\nName: ${qualification.name}\nCompany: ${qualification.company}\nReply email: ${qualification.email}\n\nPrimary operational pain point: ${qualification.message||'To discuss'}\n`;
   location.href=`mailto:${contactEmail}?subject=${encodeURIComponent('Site Killick enquiry')}&body=${encodeURIComponent(body)}`;status.textContent='Email draft requested. Review and send it from your email app; this website has not sent an enquiry.';return;}
  busy=true;const submit=form.querySelector('[type=submit]');submit.disabled=true;status.textContent='Sending your enquiry…';
  try{const result=await api('inquiries/submit',{method:'POST',headers:{'Idempotency-Key':key},body:JSON.stringify(payload)});if(!result.inquiryRef)throw new Error('The service did not confirm receipt. Please retry.');status.textContent=`Your enquiry was received. Reference: ${result.inquiryRef}. No appointment has been booked.`;form.reset();key=crypto.randomUUID();}catch(error){status.textContent=error.message;}finally{busy=false;submit.disabled=false;}
 };
}
