import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
  if(intro&&!isUtility){
    intro.classList.add('editorial-intro');
    intro.insertAdjacentHTML('afterbegin','<svg class="editorial-flow" viewBox="0 0 1400 700" fill="none" aria-hidden="true" focusable="false"><path d="M1530 40 C1150 -130 970 110 1080 290 C1240 540 860 730 640 570"/></svg>');
  }
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
    masks.forEach((heading,index)=>{
      const visible=heading.getBoundingClientRect().top<innerHeight*.92;
      gsap.fromTo(heading.querySelectorAll('.editorial-word'),{yPercent:110,x:index%2?18:-18},{yPercent:0,x:0,duration:.85,stagger:.035,ease:'power3.out',clearProps:'transform',...(visible?{}:{scrollTrigger:{trigger:heading,start:'top 92%',once:true}})});
    });
    document.querySelectorAll('.editorial-flow').forEach(svg=>{
      const path=svg.querySelector('path'),length=path.getTotalLength();
      gsap.fromTo(path,{strokeDasharray:length,strokeDashoffset:length*.8},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:svg.parentElement,start:'top bottom',end:'bottom top',scrub:.7}});
      gsap.fromTo(svg,{y:-25},{y:45,ease:'none',scrollTrigger:{trigger:svg.parentElement,start:'top bottom',end:'bottom top',scrub:.8}});
    });
    document.querySelectorAll('.page-intro>p,.about-origin-copy>p,.pricing-factor,.about-principle,.contact-context,.contact-panel,.journey-role-panel').forEach(node=>{
      // Heading masks already handle their text; don't transform an ancestor too.
      gsap.fromTo(node,{opacity:.35,y:16},{opacity:1,y:0,duration:.7,ease:'power2.out',clearProps:'transform,opacity',scrollTrigger:{trigger:node,start:'top 95%',once:true}});
    });
  });
  window.addEventListener('pagehide',()=>media.revert(),{once:true});
}
