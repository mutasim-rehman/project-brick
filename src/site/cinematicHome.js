import { blueprintHero, bindBlueprint } from './blueprint.js';
import { icon } from './utils.js';

const arrow = icon('arrow-up-right');
export function cinematicHome() {
  return `<article class="cinema">
    <section class="cinema-opening" aria-labelledby="cinema-title">
      <div class="cinema-heading"><p class="cinema-index">SITE KILLICK / CONNECTED CONSTRUCTION</p><h1 id="cinema-title">A whole site.<br><span>A lighter mind.</span></h1><div class="cinema-heading-aside"><p>People, work and equipment.<br>One connected picture.</p><a href="/platform">Explore the platform ${arrow}</a></div></div>
      <div class="cinema-journey" id="cinema-journey"><div class="cinema-stage"><div class="cinema-canvas" aria-hidden="true"><div class="cinema-fallback"><span></span><span></span><span></span><span></span><span></span><span></span></div></div><div class="cinema-stage-top"><span><i></i> FROM BLUEPRINT TO BUILDING</span><button class="cinema-pause" aria-pressed="false">Pause motion ${icon('pause')}</button></div><div class="cinema-scene-copy"><span class="cinema-scene-number">01 — 02</span><h2>Bring it<br>all together.</h2><p>Every record. The right person.<br>A clearer way to close the day.</p></div><div class="cinema-stage-bottom"><span data-cinema-state>01 / DRAWING THE PLAN</span><a href="#cinema-story">SCROLL TO BUILD ${icon('arrow-down')}</a><span>SITE KILLICK / DESIGN STUDY</span></div><div class="cinema-drafting-labels" aria-hidden="true"><span class="cinema-draft-north">N ↑</span><span class="cinema-draft-dimension">7 600 / BUILDING ENVELOPE</span><span class="cinema-draft-sheet">SK—001<br>DESIGN DEVELOPMENT<br><b data-blueprint-phase>00 / IN DEVELOPMENT</b></span></div></div></div>
    </section>
    <section class="cinema-statement" id="cinema-story"><p class="cinema-index">01 / THE OWNER WHO CAN NEVER LEAVE</p><h2 data-cinema-reveal>The shift ends.<br><span>The questions don’t.</span></h2><div class="cinema-statement-bottom"><span class="cinema-cross">+</span><p>A missing clock-out. A tool with no clear handoff. An invoice waiting on the kitchen table. When every detail lives in a different place, every question finds its way to you.</p></div></section>
    <section class="cinema-record-journey" aria-labelledby="cinema-record-title"><div class="cinema-record-stage"><div class="cinema-record-heading"><p class="cinema-index">02 / FROM INTERRUPTION TO HANDOFF</p><h2 id="cinema-record-title">Give the day<br><span>a place to land.</span></h2><p>Capture the record. Connect the person.<br>Keep the decision human.</p></div><div class="cinema-records"><div class="cinema-record-line"></div>${[['radio','ATTENDANCE','Who’s still on site?','Missing clock-out','Supervisor'],['wrench','TOOL HANDOFF','Who has the tool?','Last custodian','Stores manager'],['receipt-text','WORK RECORD','Check this tomorrow.','Invoice awaiting review','Project manager']].map(([symbol,label,title,detail,owner],i)=>`<div class="cinema-record cinema-record-${i}"><div class="cinema-record-top">${icon(symbol)}<span>${label}</span><i></i></div><h3>${title}</h3><p>${detail}</p><div class="cinema-record-owner">${icon('user-check')}<span><small>ROUTED FOR HUMAN REVIEW</small>${owner}</span>${icon('arrow-right')}</div></div>`).join('')}<div class="cinema-record-result">${icon('check')} Context attached. Person responsible.</div></div><div class="cinema-record-foot"><span>EXAMPLE RECORDS / PROPOSED WORKFLOW</span><a href="/platform">See how the platform connects ${arrow}</a></div></div></section>
    <section class="cinema-plan-intro"><p class="cinema-index">03 / EXPLORE THE CONNECTED SITE</p><h2 data-cinema-reveal>Less chasing.<br>More understanding.</h2><p>Select a zone in the site plan to see where a record goes next.</p></section>
    ${blueprintHero().replace('<h1>', '<h2>').replace('</h1>', '</h2>').replace('href="#home-workday"', 'href="/platform"')}
    <section class="cinema-close"><p class="cinema-index">THE SITE CAN HAVE YOUR DAY. KEEP YOUR EVENING.</p><h2 data-cinema-reveal>Leave the site<br><span>at the site.</span></h2><a href="/platform">Explore Site Killick <span>${arrow}</span></a><p>Product preview. Current, pilot and planned availability is subject to confirmation.</p></section>
  </article>`;
}

export async function bindCinematicHome() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);
  bindBlueprint();
  // The plan's original story link now leads into the product rather than the old chapter.
  const planLink = document.querySelector('.bp-story-link');
  planLink.href = '/platform';
  const media = gsap.matchMedia();
  let scene;
  const pause = document.querySelector('.cinema-pause');
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const syncPause = () => {
    pause.setAttribute('aria-pressed', String(paused));
    pause.innerHTML = `${paused ? 'Play' : 'Pause'} motion ${icon(paused ? 'play' : 'pause')}`;
    // SVG icons inserted after the shared icon pass are refreshed by the caller below.
    window.dispatchEvent(new Event('cinema-icons'));
    scene?.setPaused(paused);
  };
  pause.addEventListener('click', () => { paused = !paused; syncPause(); });
  syncPause();
  import('./cinematicScene.js').then(({ createCinematicScene }) => {
    scene = createCinematicScene(document.querySelector('.cinema-canvas'), { paused });
  }).catch(error => {
    console.warn('Using still construction illustration:', error.message);
    pause.hidden = true;
  });
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.cinema-heading h1, .cinema-heading-aside', { y: 45, opacity: 0, duration: 1.15, stagger: .13, ease: 'power3.out', clearProps: 'all' });
    document.querySelectorAll('[data-cinema-reveal]').forEach(node => gsap.from(node, { y: 65, opacity: .15, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: node, start: 'top 90%', once: true } }));
  });
  media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.cinema-record-journey', start: 'top top', end: 'bottom bottom', scrub: .65 } });
    tl.fromTo('.cinema-record-0', { x: -200, y: 70, rotation: -24 }, { x: 0, y: 0, rotation: 0, duration: 1 }, 0)
      .fromTo('.cinema-record-1', { y: -80, rotation: 12 }, { y: 0, rotation: 0, duration: 1 }, .1)
      .fromTo('.cinema-record-2', { x: 200, y: 50, rotation: 25 }, { x: 0, y: 0, rotation: 0, duration: 1 }, .2)
      .from('.cinema-record-line', { scaleX: 0, duration: .6 }, .8)
      .fromTo('.cinema-record-owner', { opacity: 0, y: 15 }, { opacity: 1, y: 0, stagger: .15, duration: .5 }, .85)
      .fromTo('.cinema-record-result', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .5 }, 1.3);
  });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const onReduce = () => { paused = reduce.matches; syncPause(); };
  reduce.addEventListener('change', onReduce);
  window.addEventListener('pagehide', () => { scene?.dispose(); media.revert(); reduce.removeEventListener('change', onReduce); }, { once: true });
}
