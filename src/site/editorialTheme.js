import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Each route has its own silhouette, draw direction and camera-like drift.
const flowDesigns={
  '/platform':{name:'connections',color:'#36d1df',x:[-20,25],y:[-10,25],rotation:[-3,3],paths:[
    'M1480 55 C1040 -90 1000 170 1130 265 C1320 410 1060 555 845 470',
    'M1440 145 C1140 20 1080 190 1190 285 C1390 470 1090 640 900 565']},
  '/hardware':{name:'signal-rings',color:'#8278ef',x:[15,-25],y:[0,30],rotation:[0,-7],paths:[
    'M1370 70 A170 170 0 1 0 1370 410',
    'M1405 10 A230 230 0 1 0 1405 470',
    'M1440 -50 A290 290 0 1 0 1440 530']},
  '/how-it-works':{name:'handoff-route',color:'#36d1df',x:[-15,20],y:[-25,25],rotation:[0,0],paths:[
    'M1460 70 H1150 Q1080 70 1080 140 V230 Q1080 300 1150 300 H1250 Q1320 300 1320 370 V440 Q1320 510 1250 510 H955']},
  '/pricing':{name:'rising-arcs',color:'#8278ef',x:[20,-15],y:[25,-35],rotation:[3,-3],paths:[
    'M1010 540 C1030 400 1110 405 1160 305 S1290 170 1460 195',
    'M1100 580 C1120 440 1200 445 1250 345 S1380 210 1550 235',
    'M920 500 C940 360 1020 365 1070 265 S1200 130 1370 155']},
  '/about':{name:'anchor-orbit',color:'#36d1df',x:[-15,15],y:[-15,20],rotation:[-12,8],paths:[
    'M1320 75 C1020 -35 850 170 1000 390 C1150 610 1460 510 1390 270 C1340 100 1110 170 1080 350']},
  '/contact':{name:'meeting-lines',color:'#8278ef',x:[15,-20],y:[-10,25],rotation:[0,0],paths:[
    'M1480 60 C1130 10 1070 220 1195 320',
    'M1470 590 C1150 650 1030 435 1195 320']},
};

/** Shared page motion. Dynamic product/workflow labels remain under their own controllers. */
export function bindEditorialTheme(){
  const headingSelector='.page-intro h1,.story-hero h1,.about-origin h1,.platform-explorer-head h2,.device-catalog-head h2,.utility-intro>h2,.contact-context h2,.contact-panel h2,.journey-role-panel h3,.about-principle h3,.closing h2';
  const headings=[...document.querySelectorAll(headingSelector)];
  const masks=[];
  headings.forEach(heading=>{
    if(heading.querySelector('a,button'))return;
    const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    heading.setAttribute('aria-label',heading.textContent.trim());
    heading.classList.add('editorial-heading');
    nodes.forEach(node=>{
      const fragment=document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(word=>{
        if(!word.trim()){fragment.append(document.createTextNode(word));return;}
        const mask=document.createElement('span');mask.className='editorial-word-mask';mask.setAttribute('aria-hidden','true');
        const inner=document.createElement('span');inner.className='editorial-word';inner.textContent=word;
        mask.append(inner);fragment.append(mask);
      });node.replaceWith(fragment);
    });
    masks.push(heading);
  });
  // Keep policy and access pages quiet; their priority is reading and navigation.
  const isUtility=location.pathname.startsWith('/legal')||location.pathname==='/sign-in'||!document.querySelector('.page-intro,.about-origin');
  const intro=document.querySelector('.page-intro,.about-origin');
  const design=flowDesigns[location.pathname.replace(/\/$/,'')];
  if(intro&&!isUtility&&design){
    intro.classList.add('editorial-intro');
    intro.insertAdjacentHTML('afterbegin',`<svg class="editorial-flow editorial-flow-${design.name}" style="--flow-color:${design.color}" viewBox="0 0 1400 700" fill="none" aria-hidden="true" focusable="false">${design.paths.map(d=>`<path d="${d}"/>`).join('')}</svg>`);
  }
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
    masks.forEach((heading,index)=>{
      const visible=heading.getBoundingClientRect().top<innerHeight*.92;
      gsap.fromTo(heading.querySelectorAll('.editorial-word'),{yPercent:110,x:index%2?18:-18},{yPercent:0,x:0,duration:.85,stagger:.035,ease:'power3.out',clearProps:'transform',...(visible?{}:{scrollTrigger:{trigger:heading,start:'top 92%',once:true}})});
    });
    document.querySelectorAll('.editorial-flow').forEach(svg=>{
      const draw=gsap.timeline({scrollTrigger:{trigger:svg.parentElement,start:'top bottom',end:'bottom top',scrub:.7}});
      svg.querySelectorAll('path').forEach((path,index)=>{
        const length=path.getTotalLength();
        // Alternating traces travel toward each other on connections and contact.
        const reverse=index%2&&(design.name==='connections'||design.name==='meeting-lines');
        draw.fromTo(path,{strokeDasharray:length,strokeDashoffset:length*(reverse?-.9:.9)},{strokeDashoffset:0,ease:'none',duration:1},index*.14);
      });
      gsap.fromTo(svg,{x:design.x[0],y:design.y[0],rotation:design.rotation[0]},{x:design.x[1],y:design.y[1],rotation:design.rotation[1],ease:'none',scrollTrigger:{trigger:svg.parentElement,start:'top bottom',end:'bottom top',scrub:.8}});
    });
    document.querySelectorAll('.page-intro>p,.about-origin-copy>p,.pricing-factor,.about-principle,.contact-context,.contact-panel,.journey-role-panel').forEach(node=>{
      // Heading masks already handle their text; don't transform an ancestor too.
      gsap.fromTo(node,{opacity:.35,y:16},{opacity:1,y:0,duration:.7,ease:'power2.out',clearProps:'transform,opacity',scrollTrigger:{trigger:node,start:'top 95%',once:true}});
    });
  });
  window.addEventListener('pagehide',()=>media.revert(),{once:true});
}
