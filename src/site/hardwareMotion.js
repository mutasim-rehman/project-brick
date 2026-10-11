import { environments } from './hardwareEnvironments.js';
import { gsap } from 'gsap';

const captions = {
  'nfc-badge': ['CONTACTLESS INPUT', 'Tap captured', 'Record linked'],
  'guard-tag': ['ASSET AWARENESS', 'Signal detected', 'Location attached'],
  'tool-tag': ['TOOL IDENTITY', 'Tag identified', 'Custody linked'],
  'vehicle-gateway': ['CONNECTED EQUIPMENT', 'Gateway connected', 'Journey recorded'],
};

export function deviceScene(device) {
  const environment = environments[device.id];
  return `<div class="device-art" data-scene="${device.id}">
    <span class="device-drawing-label">${device.kicker} / FIELD STUDY</span>
    <div class="device-stage" aria-hidden="true">
      <svg class="device-field" viewBox="0 0 500 400" fill="none">
        <defs><radialGradient id="field-${device.id}"><stop stop-color="#cde778" stop-opacity=".2"/><stop offset="1" stop-color="#cde778" stop-opacity="0"/></radialGradient><filter id="signal-${device.id}" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter></defs>
        <ellipse cx="250" cy="230" rx="230" ry="165" fill="url(#field-${device.id})"/>
        ${environment.art}
        <path class="field-route-track" d="${environment.route}"/><path class="field-route-glow" d="${environment.route}" filter="url(#signal-${device.id})"/><path class="field-route" d="${environment.route}"/>
        <circle class="field-source" cx="${environment.start[0]}" cy="${environment.start[1]}" r="5"/><circle class="field-target" cx="${environment.end[0]}" cy="${environment.end[1]}" r="5"/>
        <circle class="field-packet-halo" r="12"/><circle class="field-packet" r="4"/>
        <g class="field-crosses"><path d="M55 145v12m-6-6h12M430 290v12m-6-6h12M370 75v12m-6-6h12"/></g>
      </svg>
      <div class="device-plinth"></div><div class="device-shadow"></div><div class="device-object">${device.figure}</div>
      <div class="device-callout callout-source"><i></i><span><small>${environment.source[0]}</small><strong>${environment.source[1]}</strong></span></div>
      <div class="device-callout callout-target"><i></i><span><small>${environment.target[0]}</small><strong>${environment.target[1]}</strong></span></div>
      <span class="device-coordinate">${environment.legend}<br><b>ILLUSTRATIVE SEQUENCE</b></span>
    </div>
    <div class="device-scene-footer"><span class="device-scene-status"><i></i><span>Example signal sequence</span></span><button type="button" class="device-motion-toggle" aria-pressed="false" aria-label="Pause ${device.rail} illustration">Pause motion</button></div>
  </div>`;
}

export function bindHardwareScenes() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-scene]').forEach(scene => {
    const q = selector => scene.querySelector(selector);
    const circles = scene.querySelectorAll('.field-rings circle');
    const [, capture, linked] = captions[scene.dataset.scene];
    const route = q('.field-route');
    const length = route.getTotalLength();
    const progress = { value: 0 };
    const status = q('.device-scene-status span');
    let visible = false;
    let paused = false;
    const context = gsap.context(() => {}, scene);
    let timeline;
    context.add(() => {
      if (circles.length) gsap.set(circles, { transformOrigin: '50% 50%', scale: .65, opacity: 0 });
      gsap.set(route, { strokeDasharray: length, strokeDashoffset: length });
      timeline = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.4 });
      timeline.timeScale(.85);
      const beacons=scene.querySelectorAll('.scene-beacon .beacon-ring');
      if(beacons.length) timeline.fromTo(beacons, { scale:.85,opacity:.25,transformOrigin:'center' }, {scale:1.2,opacity:.5,duration:1.8,stagger:.6,yoyo:true,repeat:1,ease:'sine.inOut'}, .2);
      timeline.fromTo(q('.field-route-glow'), {opacity:.03}, {opacity:.2,duration:1.8,yoyo:true,repeat:1}, .8);
      if (circles.length) timeline.fromTo(circles, { scale: .65, opacity: .25 }, { scale: 2.1, opacity: 0, duration: 2.6, stagger: .45, ease: 'power1.out' }, .15);
      if (q('.nfc-scan')) timeline.fromTo(q('.nfc-scan'), { y: 0, opacity: 0 }, { y: 150, opacity: .35, duration: 1.8, yoyo: true, repeat: 1, ease: 'power2.inOut' }, .3);
      if (q('.guard-sweep')) timeline.fromTo(q('.guard-sweep'), { rotation: 0, svgOrigin: '250 220' }, { rotation: 360, duration: 5.4, ease: 'none' }, 0)
        .fromTo(q('.guard-lock'), { opacity: .15, scale: 1.4, transformOrigin: 'center' }, { opacity: 1, scale: 1, duration: .8, repeat: 1, yoyo: true }, 2);
      if (q('.tool-node')) timeline.fromTo(scene.querySelectorAll('.tool-node'), { opacity: .25 }, { opacity: 1, duration: .5, stagger: .8, repeat: 1, yoyo: true }, .3);
      if (q('.road-dashes')) timeline.to(q('.road-dashes'), { strokeDashoffset: -90, duration: 5.4, ease: 'none' }, 0)
        .fromTo(q('.gateway-pin'), { y: -18, opacity: .25 }, { y: 0, opacity: 1, duration: .8, ease: 'back.out(2)' }, 2);
      const deviceSvg = q('.device-object > svg');
      const strokes = deviceSvg.querySelectorAll('path[stroke]');
      if (strokes.length) timeline.fromTo(strokes,
        { strokeDasharray: (_, path) => path.getTotalLength(), strokeDashoffset: (_, path) => path.getTotalLength() },
        { strokeDashoffset: 0, duration: 1.1, stagger: .18, ease: 'power2.out' }, .2);
      const lights = deviceSvg.querySelectorAll('circle[fill="var(--lime)"]');
      if (lights.length) timeline.fromTo(lights, { opacity: .25 }, { opacity: 1, duration: .4, stagger: .12, yoyo: true, repeat: 3 }, .4);
      if (scene.dataset.scene === 'nfc-badge') {
        const phoneStart = deviceSvg.querySelector('rect[x="176"]');
        const phone = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const parts = [];
        for (let part = phoneStart; part; part = part.nextElementSibling) parts.push(part);
        parts.forEach(part => phone.append(part));
        deviceSvg.append(phone);
        timeline.fromTo(phone, { x: 26, y: 12, rotation: 7, transformOrigin: 'center' }, { x: 0, y: 0, rotation: 0, duration: 1.3, ease: 'power3.inOut' }, .05)
          .to(phone, { x: 26, y: 12, rotation: 7, duration: 1.3, ease: 'power3.inOut' }, 3.9);
      }
      timeline.to(q('.device-object'), { y: -12, rotation: scene.dataset.scene === 'vehicle-gateway' ? -3 : 2, duration: 2.7, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0)
        .to(q('.device-shadow'), { scaleX: .82, opacity: .35, duration: 2.7, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0)
        .fromTo(route, { strokeDashoffset: length, opacity: .55 }, { strokeDashoffset: 0, duration: 1.9, ease: 'power2.inOut' }, .8)
        .fromTo(progress, { value: 0 }, { value: 1, duration: 1.9, ease: 'power2.inOut', onUpdate: () => {
          const point = route.getPointAtLength(progress.value * length);
          q('.field-packet').setAttribute('cx', point.x); q('.field-packet').setAttribute('cy', point.y);
          q('.field-packet-halo').setAttribute('cx', point.x); q('.field-packet-halo').setAttribute('cy', point.y);
        } }, .8)
        .fromTo(q('.field-packet'), { opacity: 0 }, { opacity: .65, duration: .2 }, .8)
        .fromTo(q('.field-packet-halo'), { opacity: 0 }, { opacity:.18,duration:.2 }, .8)
        .call(() => { status.textContent = capture; }, [], .8)
        .fromTo(q('.callout-source'), { opacity: .8 }, { opacity: 1, duration: .4 }, .8)
        .fromTo(q('.field-target'), { scale: 1, transformOrigin: 'center' }, { scale: 1.35, duration: .65, yoyo: true, repeat: 1 }, 2.6)
        .fromTo(q('.callout-target'), { opacity: .8 }, { opacity: 1, duration: .5 }, 2.6)
        .call(() => { status.textContent = linked; }, [], 2.7)
        .to(q('.field-packet'), { opacity: 0, duration: .3 }, 3)
        .to(q('.field-packet-halo'), { opacity:0,duration:.3 }, 3)
        .to(route, { opacity: .15, duration: 1 }, 3.8);
    });
    const sync = () => {
      if (reduce.matches) {
        timeline.pause(0);
        status.textContent = 'Example signal sequence';
      } else if (visible && !paused && !scene.closest('.device-card').inert) timeline.play();
      else timeline.pause();
    };
    const toggle = q('.device-motion-toggle');
    scene.closest('.device-card').addEventListener('device-visibility', sync);
    toggle.addEventListener('click', () => {
      paused = !paused;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'Play motion' : 'Pause motion';
      toggle.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} ${scene.dataset.scene.replaceAll('-', ' ')} illustration`);
      sync();
    });
    scene.closest('.device-card').addEventListener('device-step', () => {
      if (!reduce.matches && !paused) timeline.restart();
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .15 });
    observer.observe(scene);
    reduce.addEventListener('change', sync);
    sync();
    window.addEventListener('pagehide', () => { observer.disconnect(); context.revert(); reduce.removeEventListener('change', sync); }, { once: true });
  });
}

export function animateDeviceRecord(host) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.fromTo(host.querySelectorAll('.eyebrow, h4, dl > div'), { y: 14, opacity: 0, filter: 'blur(5px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: .65, stagger: .065, ease: 'power3.out', overwrite: true });
}
