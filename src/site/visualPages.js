import { icon, escapeHtml } from './utils.js';
import { gsap } from 'gsap';

const states=[['Field event','NFC clock-in','Captured at the site','scan-line'],['Connected record','Attendance','Person + site + event','file-check'],['Assigned follow-up','Supervisor review','Context reaches the right role','user-check'],['Human decision','Review the evidence','Approve, correct or escalate','check-check']];
const illustration=()=>`<svg class="workflow-art" viewBox="0 0 460 270" fill="none" aria-hidden="true"><ellipse cx="237" cy="242" rx="166" ry="15" fill="#102a4710"/><g class="workflow-paper"><path d="M135 43L333 30 345 229 147 242Z" fill="#b7c7aa"/><rect x="124" y="24" width="207" height="210" rx="12" fill="#f9faef" stroke="#dce4ce"/><path d="M124 36a12 12 0 0 1 12-12h183a12 12 0 0 1 12 12v29H124Z" fill="#1b3b49"/><circle cx="146" cy="45" r="4" fill="#c5db92"/><path d="M159 45h74" stroke="#9bb3b7" stroke-width="3"/><rect x="145" y="85" width="92" height="6" rx="3" fill="#9ab18b"/><rect x="145" y="102" width="131" height="4" rx="2" fill="#d0dbc3"/><rect x="145" y="130" width="165" height="31" rx="5" fill="#e7eeda"/><circle cx="159" cy="146" r="5" fill="#b4cc82"/><path d="M173 146h69M145 180h165M145 204h112" stroke="#c7d4bc" stroke-width="3"/><path class="workflow-complete" d="M258 194l9 9 18-22" stroke="#79973b" stroke-width="4" stroke-linecap="round"/></g><g class="workflow-device"><rect x="54" y="131" width="74" height="101" rx="12" fill="#819894"/><rect x="48" y="127" width="74" height="101" rx="12" fill="#163543"/><path d="M70 169c8-9 22-9 30 0M76 178c5-5 13-5 18 0" stroke="#c5db92" stroke-width="3" stroke-linecap="round"/><circle cx="85" cy="188" r="3" fill="#c5db92"/><path d="M67 147h36" stroke="#597984" stroke-width="4"/></g><g class="workflow-person"><circle cx="351" cy="182" r="36" fill="#f3f6e7" stroke="#cedcb7"/><circle cx="351" cy="174" r="9" stroke="#65815b" stroke-width="2"/><path d="M335 201v-4c0-17 32-17 32 0v4" stroke="#65815b" stroke-width="2"/><circle cx="376" cy="207" r="13" fill="#c3d88f"/><path d="M370 207l4 4 7-8" stroke="#567039" stroke-width="2"/></g><path class="workflow-transfer" d="M100 130Q100 112 124 112M331 150Q350 150 351 146" stroke="#8da851" stroke-width="2" stroke-dasharray="4 5"/></svg>`;

export function workflowVisual(steps) {
  return `<div class="workflow-theatre"><div class="workflow-choices" role="group" aria-label="Workflow stages"><p class="eyebrow">AN EXAMPLE WORKING DAY</p>${steps.map(([number,title,copy],i)=>`<button type="button" data-workflow-stage="${i}" aria-pressed="${i===0}"><span>${number}</span><div><strong>${escapeHtml(title)}</strong><small>${escapeHtml(copy)}</small></div>${icon(states[i][3])}</button>`).join('')}</div><div class="workflow-visual"><div class="workflow-visual-top"><span>ILLUSTRATIVE WORKFLOW</span><span data-workflow-label>Field event</span></div>${illustration()}<div class="workflow-caption" aria-live="polite"><span class="eyebrow" data-workflow-type>Field event</span><h3 data-workflow-title>NFC clock-in</h3><p data-workflow-detail>Captured at the site</p></div><div class="workflow-progress" aria-hidden="true"><i class="is-active"></i><i></i><i></i><i></i></div></div></div>`;
}

export function bindVisualPages() {
  const host=document.querySelector('.workflow-theatre');if(!host)return;
  const buttons=[...host.querySelectorAll('[data-workflow-stage]')];
  buttons.forEach((button,index)=>button.addEventListener('click',()=>{
    buttons.forEach((item,i)=>item.setAttribute('aria-pressed',String(i===index)));
    const [label,title,detail]=states[index];host.querySelector('[data-workflow-label]').textContent=label;host.querySelector('[data-workflow-type]').textContent=label;host.querySelector('[data-workflow-title]').textContent=title;host.querySelector('[data-workflow-detail]').textContent=detail;
    host.querySelectorAll('.workflow-progress i').forEach((item,i)=>item.classList.toggle('is-active',i<=index));
    host.dataset.stage=index;
    host.dispatchEvent(new CustomEvent('workflow-stage',{detail:index}));
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches)gsap.fromTo(host.querySelectorAll('.workflow-caption > *'),{opacity:0,y:8},{opacity:1,y:0,duration:.4,stagger:.05,overwrite:true});
  }));
  const visual=host.querySelector('.workflow-visual');
  const art=host.querySelector('.workflow-art');
  const holder=document.createElement('div');holder.className='workflow-model';holder.setAttribute('aria-hidden','true');art.before(holder);holder.append(art);
  const pause=document.createElement('button');pause.type='button';pause.className='workflow-motion-toggle';pause.textContent='Pause motion';pause.setAttribute('aria-pressed','false');visual.append(pause);
  pause.addEventListener('click',()=>{const paused=pause.getAttribute('aria-pressed')!=='true';pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Play motion':'Pause motion';host.dispatchEvent(new Event('workflow-motion'));});
  import('./WorkflowRenderer.js').then(({mountWorkflowModel})=>mountWorkflowModel(host)).catch(error=>{pause.hidden=true;console.error('[Site Killick] Workflow renderer failed to load or initialize.',error);});
}

