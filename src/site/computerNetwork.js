import { gsap } from 'gsap';
import { icon } from './utils.js';

const sources = [
  ['NFC badge','scan-line','Clock-in','Attendance'],
  ['Guard tag','shield-check','Asset alert','Equipment'],
  ['Tool tag','wrench','Tool handoff','Custody'],
  ['Vehicle gateway','truck','Site arrival','Fleet'],
];
const screen = (small=false) => `<div class="network-screen ${small?'is-small':''}" aria-hidden="true"><div class="network-screen-bar"><i></i><i></i><i></i><span>SITE KILLICK</span></div><div class="network-screen-app"><div class="network-sidebar"><b></b><i></i><i></i><i></i></div><div class="network-workspace"><div class="network-app-title"></div><div class="network-app-metrics"><i></i><i></i><i></i></div><div class="network-app-row"><i></i><b></b><span></span></div><div class="network-app-row"><i></i><b></b><span></span></div><div class="network-app-row"><i></i><b></b><span></span></div></div></div><span class="network-sync">${icon('check')}</span></div><div class="network-screen-stand" aria-hidden="true"></div>`;

export function computerNetwork() {
  return `<section class="wrap signal-section computer-network" aria-label="Shared computer network">
    <div class="signal-heading"><p class="eyebrow">ONE CONNECTED WORKSPACE</p><h2>From the site. Shared with the team.</h2></div>
    <div class="network-stage">
      <div class="network-devices" role="group" aria-label="Signal source">${sources.map(([name,symbol],i)=>`<button type="button" data-network-source="${i}" aria-label="${name}" aria-pressed="${i===0}"><span class="network-device-icon">${icon(symbol)}<i></i></span><span>${name}</span></button>`).join('')}</div>
      <div class="network-main"><div class="network-main-computer">${screen()}</div><span class="network-label">Shared workspace</span></div>
      <div class="network-team">${['Site team','Office','Owner'].map((name,i)=>`<div class="network-station" data-network-station="${i}"><div class="network-team-computer">${screen(true)}</div><span class="network-label">${name}</span></div>`).join('')}</div>
      <div class="network-caption"><span class="network-event">Clock-in</span>${icon('arrow-right')}<span class="network-record">Attendance</span><span class="network-caption-state">Shared with the team</span></div>
    </div>
    <div class="signal-footer"><p class="signal-note">Illustrative workflow · example screens</p><button type="button" class="signal-pause" aria-pressed="false">Pause network animation</button></div>
  </section>`;
}

export function bindComputerNetwork(section,reduce) {
  const stage=section.querySelector('.network-stage');
  const buttons=[...section.querySelectorAll('[data-network-source]')];
  const main=section.querySelector('.network-main-computer');
  const stations=[...section.querySelectorAll('.network-team-computer')];
  const wire=document.createElementNS('http://www.w3.org/2000/svg','svg');wire.classList.add('network-wires');wire.setAttribute('aria-hidden','true');stage.prepend(wire);
  let selected=0,visible=false,timeline;
  const pause=section.querySelector('.signal-pause');
  const sync=()=>{if(visible&&!document.hidden&&!reduce.matches&&!section.classList.contains('is-paused'))timeline?.play();else timeline?.pause();};
  const select=index=>{selected=index;buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===selected)));section.querySelector('.network-event').textContent=sources[index][2];section.querySelector('.network-record').textContent=sources[index][3];};
  const draw=()=>{
    timeline?.kill();
    const r=stage.getBoundingClientRect(),mobile=innerWidth<=700;
    wire.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);
    const point=(element,out)=>{const b=element.getBoundingClientRect();return mobile?[b.left-r.left+b.width/2,(out?b.bottom:b.top)-r.top]:[(out?b.right:b.left)-r.left,b.top-r.top+b.height/2];};
    const curve=(a,b)=>mobile?`M${a}C${a[0]},${(a[1]+b[1])/2} ${b[0]},${(a[1]+b[1])/2} ${b}`:`M${a}C${(a[0]+b[0])/2},${a[1]} ${(a[0]+b[0])/2},${b[1]} ${b}`;
    const deviceGroup=section.querySelector('.network-devices');
    const paths=buttons.map(button=>curve(point(mobile?deviceGroup:button.querySelector('.network-device-icon'),true),point(main,false))).concat(stations.map(station=>curve(point(main,true),point(station,false))));
    wire.innerHTML=paths.map((d,i)=>`<path class="network-track" d="${d}"/><path class="network-pulse" data-network-wire="${i}" d="${d}"/><circle class="network-packet" data-network-packet="${i}" r="2.5"/>`).join('');
    gsap.set(section.querySelectorAll('.network-sync'),{opacity:0,scale:.8});gsap.set(wire.querySelectorAll('.network-pulse,.network-packet'),{opacity:0});
    timeline=gsap.timeline({paused:true,repeat:-1,repeatDelay:1.8,onRepeat:()=>{select((selected+1)%buttons.length);draw();}});
    const travel=(index,at)=>{const path=wire.querySelector(`[data-network-wire="${index}"]`),packet=wire.querySelector(`[data-network-packet="${index}"]`),length=path.getTotalLength(),progress={value:0};gsap.set(path,{strokeDasharray:`22 ${length}`,strokeDashoffset:22});timeline.to([path,packet],{opacity:.85,duration:.2},at).to(path,{strokeDashoffset:-length,duration:1.3,ease:'sine.inOut'},at).to(progress,{value:1,duration:1.3,ease:'sine.inOut',onUpdate:()=>{const p=path.getPointAtLength(length*progress.value);packet.setAttribute('cx',p.x);packet.setAttribute('cy',p.y);}},at).to([path,packet],{opacity:0,duration:.2},at+1.2);};
    travel(selected,.1);
    timeline.fromTo(main.querySelector('.network-app-row'),{backgroundColor:'#d5e0ce'},{backgroundColor:'#bad385',duration:.45,yoyo:true,repeat:1},1.3).to(main.querySelector('.network-sync'),{opacity:1,scale:1,duration:.3},1.3);
    stations.forEach((station,i)=>{travel(4+i,1.7+i*.15);timeline.to(station.querySelector('.network-sync'),{opacity:1,scale:1,duration:.35},3+i*.15).fromTo(station.querySelector('.network-app-row'),{backgroundColor:'#d5e0ce'},{backgroundColor:'#bad385',duration:.5,yoyo:true,repeat:1},3+i*.15);});
    sync();
  };
  buttons.forEach((button,i)=>button.addEventListener('click',()=>{select(i);draw();}));
  pause.addEventListener('click',()=>{const paused=section.classList.toggle('is-paused');pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Play network animation':'Pause network animation';sync();});
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.15});observer.observe(stage);
  const resize=new ResizeObserver(draw);resize.observe(stage);reduce.addEventListener('change',sync);draw();
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pagehide',()=>{timeline?.kill();observer.disconnect();resize.disconnect();reduce.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);},{once:true});
}
