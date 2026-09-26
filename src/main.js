import './site/site.css';
import './site/scrollIntro.css';
import { initScrollIntro } from './site/scrollIntro.js';
import { createIcons, Anchor, ArrowUpRight, ArrowRight, ArrowLeft, ArrowDown, Check, ChevronRight, Users, ClipboardList, ShieldCheck, Wrench, Truck, ChartNoAxesCombined, BriefcaseBusiness, ReceiptText, HardHat, UserCheck, Hammer, Contact, Info, Link, Download, ScanLine, Radio, FileCheck, FileClock, Eye, Clock, Paperclip, CalendarCheck, CalendarPlus, Menu, X, MessageCircle, Send, Settings2 } from 'lucide';
import { homePage, bindHome, platformPage, bindPlatform, rolesPage, bindRoles, aboutPage, legalPage, notFound, signInPage } from './site/pages.js';
import { pricingPage, bindPricing } from './site/pricing.js';
import { contactPage, bindContact } from './site/contact.js';
import { policies, modules } from './site/content.js';
import { icon, escapeHtml, readStorage, writeStorage, preferencesAllowed, remember, apiBase, api } from './site/utils.js';

const icons = { Anchor, ArrowUpRight, ArrowRight, ArrowLeft, ArrowDown, Check, ChevronRight, Users, ClipboardList, ShieldCheck, Wrench, Truck, ChartNoAxesCombined, BriefcaseBusiness, ReceiptText, HardHat, UserCheck, Hammer, Contact, Info, Link, Download, ScanLine, Radio, FileCheck, FileClock, Eye, Clock, Paperclip, CalendarCheck, CalendarPlus, Menu, X, MessageCircle, Send, Settings2 };
const refreshIcons = () => createIcons({ icons, attrs: { 'stroke-width': 1.6 } });
const path = location.pathname.replace(/\/$/, '') || '/';
const appUrl = /^https:\/\//.test(import.meta.env.VITE_APP_URL || '') ? import.meta.env.VITE_APP_URL : '';
const nav = [['/platform','Platform'],['/how-it-works','How it works'],['/pricing','Pricing'],['/about','About'],['/contact','Contact']];
const pageTitles = { '/': 'Construction Operations & Asset Intelligence', '/platform':'Platform & Features', '/how-it-works':'How It Works', '/pricing':'Configure Your Pricing', '/contact':'Contact & Booking', '/about':'About & Trust', '/legal':'Legal & Policies', '/sign-in':'Workspace Access' };
const policy = path.startsWith('/legal/') ? policies.find(p => p.slug === path.split('/')[2]) : null;
document.title = `${policy?.title || pageTitles[path] || 'Page Not Found'} | Site Killick`;
document.querySelector('meta[name="description"]').content = policy?.summary || `${pageTitles[path] || 'Site Killick'}. Connect your people, site records, tools and fleet. Leave the site at the site.`;
const pages = { '/':homePage, '/platform':platformPage, '/how-it-works':rolesPage, '/pricing':pricingPage, '/contact':contactPage, '/about':aboutPage, '/legal':() => legalPage(), '/sign-in':() => signInPage(appUrl) };
const page = pages[path] ? pages[path]() : path.startsWith('/legal/') ? legalPage(path.split('/')[2]) : notFound();
document.querySelector('#app').innerHTML = `<header class="site-header"><a class="brand" href="/" aria-label="Site Killick home"><span class="brand-symbol">${icon('anchor')}</span><span>SITE KILLICK<small>AN ANCHOR FOR YOUR OPERATION</small></span></a><nav class="desktop-nav" aria-label="Main navigation">${nav.map(([url,label]) => `<a href="${url}" ${path===url ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav><div class="header-actions"><a class="sign-in" href="/sign-in">Sign in ${icon('arrow-up-right')}</a><a class="button primary header-demo" href="/contact">Book a demo ${icon('arrow-up-right')}</a><button class="icon-button menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open navigation" title="Open navigation">${icon('menu')}</button></div><nav id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation" hidden>${nav.map(([url,label]) => `<a href="${url}" ${path===url ? 'aria-current="page"' : ''}>${label}</a>`).join('')}<a href="/sign-in">Sign in</a></nav></header><main id="main" tabindex="-1">${page}</main><footer class="site-footer"><div class="wrap footer-top"><div><a class="brand" href="/"><span class="brand-symbol">${icon('anchor')}</span><span>SITE KILLICK</span></a><p>Construction operations.<br>A little more life after work.</p></div><div><h2>Explore</h2>${nav.map(([url,label]) => `<a href="${url}">${label}</a>`).join('')}</div><div><h2>Trust & policies</h2>${policies.slice(0,4).map(p=>`<a href="/legal/${p.slug}">${p.slug==='terms'?'Terms of use':p.title}</a>`).join('')}</div><div><h2>Here to help</h2>${policies.slice(4).map(p=>`<a href="/legal/${p.slug}">${p.slug==='security'?'Security & disclosure':p.slug==='hardware'?'Hardware & warranty':'Accessibility'}</a>`).join('')}<button class="footer-link" data-cookie-settings>Cookie preferences</button></div></div><div class="wrap footer-bottom"><span>&copy; ${new Date().getFullYear()} Site Killick</span><span>Rooted in Atlantic Canada.</span><a href="/legal">All policies ${icon('arrow-up-right')}</a></div></footer><div id="support-root"></div><div id="consent-root"></div><dialog id="cookie-dialog" aria-labelledby="cookie-title"><div class="dialog-heading"><h2 id="cookie-title">Your privacy preferences</h2><button class="icon-button" id="close-cookies" aria-label="Close preferences" title="Close">${icon('x')}</button></div><p>Choose what this browser remembers. No advertising or analytics trackers are loaded.</p><label class="option-row"><span>Essential consent record</span><input type="checkbox" checked disabled aria-label="Essential storage always enabled"></label><label class="option-row"><span>Pricing & motion preferences</span><input id="optional-preferences" type="checkbox" role="switch"></label><button id="save-preferences" class="button primary">Save preferences ${icon('check')}</button><p id="cookie-status" role="status"></p></dialog>`;
refreshIcons();

const menu = document.querySelector('#menu-toggle');
menu.onclick = () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded',String(expanded)); menu.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  document.querySelector('#mobile-nav').hidden = !expanded;
};
document.addEventListener('keydown', event => { if (event.key==='Escape') { document.querySelector('#mobile-nav').hidden=true; menu.setAttribute('aria-expanded','false'); } });
if (path==='/platform') bindPlatform(refreshIcons);
if (path==='/how-it-works') bindRoles(refreshIcons);
if (path==='/pricing') bindPricing();
if (path==='/contact') bindContact(refreshIcons);

if (path === '/') {
  bindHome();
  initScrollIntro();
}

function setConsent(enabled) {
  const saved = writeStorage('sk-consent',{preferences:enabled, updatedAt:new Date().toISOString()});
  if (!enabled) { try { localStorage.removeItem('sk-pricing'); localStorage.removeItem('sk-motion'); } catch { /* Storage may be disabled. */ } }
  document.querySelector('#consent-root').innerHTML='';
  return saved;
}
if (!readStorage('sk-consent',null)) {
  document.querySelector('#consent-root').innerHTML=`<aside class="consent-banner" aria-label="Privacy choices"><div><strong>A little control over what stays.</strong><p>Optional storage remembers pricing and motion preferences. No analytics or advertising trackers.</p></div><div class="actions"><button class="button" id="essential-only">Essential only</button><button class="button primary" id="allow-preferences">Allow preferences</button><button class="icon-button" data-cookie-settings aria-label="Customize cookie preferences" title="Customize preferences">${icon('settings-2')}</button></div></aside>`;
  document.querySelector('#essential-only').onclick=()=>setConsent(false);
  document.querySelector('#allow-preferences').onclick=()=>setConsent(true);
}
const cookieDialog = document.querySelector('#cookie-dialog');
document.querySelectorAll('[data-cookie-settings]').forEach(button=>{button.onclick=()=>{document.querySelector('#optional-preferences').checked=preferencesAllowed();cookieDialog.showModal();};});
document.querySelector('#close-cookies').onclick=()=>cookieDialog.close();
document.querySelector('#save-preferences').onclick=()=>{ const saved=setConsent(document.querySelector('#optional-preferences').checked); if (saved) cookieDialog.close(); else document.querySelector('#cookie-status').textContent='Browser storage is unavailable. Your choice applies for this visit only.'; };

document.querySelector('#support-root').innerHTML=`<button id="support-toggle" class="support-toggle" aria-expanded="false" aria-controls="support-panel" title="Ask Site Killick">${icon('message-circle')}<span>Ask Killick</span></button><section id="support-panel" class="support-panel" aria-label="Site Killick support" hidden><div class="support-heading"><div><strong>Site Killick support</strong><small>${apiBase ? 'Automated AI assistant' : 'Automated product guide'}</small></div><button id="support-close" class="icon-button" aria-label="Close support" title="Close support">${icon('x')}</button></div><div id="support-messages" role="log" aria-live="polite"><p class="assistant-message">${apiBase ? 'I can help with approved product information.' : 'I can point you to information in the project specification. Live AI support is not connected.'} What would you like to explore?</p></div><div class="support-topics"><button data-question="How does pricing work?">Pricing</button><button data-question="How are tools tracked?">Tool tracking</button><button data-question="I need a human">Talk to a person</button></div><form id="support-form"><label class="sr-only" for="support-input">Your question</label><input id="support-input" placeholder="Ask about Site Killick..." maxlength="500" required><button class="icon-button" aria-label="Send question" title="Send question">${icon('send')}</button></form></section>`;
const supportPanel=document.querySelector('#support-panel'), supportToggle=document.querySelector('#support-toggle');
const setSupport = open => { supportPanel.hidden=!open; supportToggle.setAttribute('aria-expanded',String(open)); if (open) document.querySelector('#support-input').focus(); else supportToggle.focus(); };
supportToggle.onclick=()=>setSupport(supportPanel.hidden);
document.querySelector('#support-close').onclick=()=>setSupport(false);
supportPanel.addEventListener('keydown',e=>{if(e.key==='Escape')setSupport(false);});
let answering=false;
async function answer(question) {
  if (answering || !question.trim()) return;
  answering=true;
  const log=document.querySelector('#support-messages');
  log.insertAdjacentHTML('beforeend',`<p class="user-message">${escapeHtml(question)}</p>`);
  let response, link;
  try {
    if (apiBase) {
      const result=await api('assistant/chat',{method:'POST',body:JSON.stringify({message:question})});
      response=typeof result.answer==='string' ? result.answer : 'No answer was returned. Please use the contact page.';
    } else {
      const q=question.toLowerCase();
      const m=modules.find(m=>[m.id, ...m.title.toLowerCase().split(/\W+/).filter(w=>w.length>3)].some(word=>q.includes(word)));
      if (/price|pricing|cost|discount|hold|currency/.test(q)) { response='The calculator uses illustrative regional tables for CAD, USD, GBP, EUR, AUD and NZD. Prices and 14-day holds require commercial approval.'; link=['/pricing','Open pricing']; }
      else if (/human|person|demo|book|contact/.test(q)) { response='Prepare a demo request on the contact page. Live scheduling is not connected, so a draft does not reserve an appointment.'; link=['/contact','Talk with the team']; }
      else if (/security|privacy|soc|legal/.test(q)) { response='The policy library explains the proposed security and privacy approach. Legal policies are drafts; no SOC 2 certification is claimed.'; link=['/legal','Read the policies']; }
      else if(m) { response=m.capability+' Feature availability must be confirmed during a demo.'; link=[`/platform?module=${m.id}`,m.title]; }
      else { response='I do not have approved information to answer that. You can explore the platform or prepare a question for the team.'; link=['/contact','Ask the team']; }
    }
  } catch(error) { response=error.message; link=['/contact','Contact the team']; }
  log.insertAdjacentHTML('beforeend',`<p class="assistant-message">${escapeHtml(response)}${link ? `<a href="${link[0]}">${escapeHtml(link[1])}</a>` : ''}</p>`);
  log.scrollTop=log.scrollHeight; answering=false;
}
document.querySelector('#support-form').onsubmit=e=>{e.preventDefault();const input=document.querySelector('#support-input'); if(!answering){answer(input.value);input.value='';}};
document.querySelectorAll('[data-question]').forEach(button=>{button.onclick=()=>answer(button.dataset.question);});
refreshIcons();
