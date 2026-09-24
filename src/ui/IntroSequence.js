import gsap from 'gsap';

const STATUS_STEPS = [
  [0, 'Surveying site'],
  [28, 'Setting out structural grid'],
  [56, 'Mobilising plant & crane'],
  [84, 'Breaking ground'],
  [100, 'Site live']
];

// Landing choreography: blueprint preloader → curtain wipe → aerial drone fly-in → hero copy reveal
export class IntroSequence {
  constructor(world) {
    this.world = world;
    this.loader = document.getElementById('intro-loader');
    this.hero = document.getElementById('hero-overlay');
    this.counter = document.getElementById('loader-count');
    this.status = document.getElementById('loader-status');
    this.barFill = document.getElementById('loader-bar-fill');
    this.reducedMotion = world.reducedMotion;
    this.heroVisible = true;
  }

  async play(ready) {
    if (!this.loader) {
      this.world.intro.progress = 1;
      return;
    }

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.classList.add('is-intro');

    const heroParts = this.hero ? {
      kicker: this.hero.querySelector('.hero-kicker'),
      lines: this.hero.querySelectorAll('.hero-line > span'),
      sub: this.hero.querySelector('.hero-sub'),
      cue: this.hero.querySelector('.hero-scroll')
    } : null;

    if (this.reducedMotion) {
      await ready;
      this.world.intro.progress = 1;
      this.world.renderScene = true;
      gsap.to(this.loader, { autoAlpha: 0, duration: 0.4, onComplete: () => this.finish() });
      return;
    }

    // Intro choreography runs on wall-clock time so slow first frames can't stretch it out
    gsap.ticker.lagSmoothing(0);
    this.world.intro.progress = 0;
    this.world.renderScene = false;
    gsap.set('.app-header', { yPercent: -110 });
    gsap.set('.bottom-timeline', { yPercent: 110 });
    gsap.set('.scroll-container', { autoAlpha: 0 });
    if (heroParts) {
      gsap.set([heroParts.kicker, heroParts.sub, heroParts.cue], { autoAlpha: 0, y: 18 });
      gsap.set(heroParts.lines, { yPercent: 115, rotate: 2 });
    }

    const paths = this.loader.querySelectorAll('.bp-draw');
    paths.forEach((p) => {
      const len = p.getTotalLength ? p.getTotalLength() : 400;
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });

    const count = { v: 0 };
    const load = gsap.timeline();
    load
      .to(paths, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', stagger: 0.05 }, 0)
      .to(count, {
        v: 100,
        duration: 1.9,
        ease: 'power2.inOut',
        onUpdate: () => this.renderCount(count.v)
      }, 0);

    await Promise.all([load.then(), ready]);
    this.world.renderScene = true;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const reveal = gsap.timeline({ onComplete: () => this.finish() });
    reveal
      .to(this.loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.15, ease: 'power4.inOut' }, 0.1)
      .to(this.loader.querySelector('.loader-center'), { y: -60, autoAlpha: 0, duration: 0.7, ease: 'power3.in' }, 0)
      .to(this.world.intro, { progress: 1, duration: 4.6, ease: 'none' }, 0.25)
      .to('.app-header', { yPercent: 0, duration: 1.0, ease: 'power3.out' }, 1.6)
      .to('.bottom-timeline', { yPercent: 0, duration: 1.0, ease: 'power3.out' }, 1.75)
      .to('.scroll-container', { autoAlpha: 1, duration: 0.8 }, 2.4);

    if (heroParts) {
      reveal
        .to(heroParts.kicker, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.2)
        .to(heroParts.lines, { yPercent: 0, rotate: 0, duration: 1.2, ease: 'power4.out', stagger: 0.12 }, 1.3)
        .to(heroParts.sub, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 1.9)
        .to(heroParts.cue, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 2.3);
    }

    // Unlock scrolling once the curtain is up, even while the fly-in is still settling
    reveal.call(() => document.documentElement.classList.remove('is-intro'), null, 1.2);
  }

  renderCount(v) {
    const n = Math.round(v);
    if (this.counter) this.counter.textContent = String(n).padStart(3, '0');
    if (this.barFill) this.barFill.style.transform = `scaleX(${v / 100})`;
    if (this.status) {
      let label = STATUS_STEPS[0][1];
      STATUS_STEPS.forEach(([at, text]) => { if (n >= at) label = text; });
      if (this.status.textContent !== label) this.status.textContent = label;
    }
  }

  finish() {
    gsap.ticker.lagSmoothing(500, 33);
    document.documentElement.classList.remove('is-intro');
    if (this.loader) this.loader.remove();
    this.loader = null;
  }

  // Hero copy yields to the construction story as soon as the visitor starts scrolling
  onScroll(progress) {
    if (!this.hero) return;
    const fade = Math.min(1, Math.max(0, (progress - 0.004) / 0.03));
    this.hero.style.opacity = String(1 - fade);
    this.hero.style.transform = `translate3d(0, ${-fade * 40}px, 0)`;
    const visible = fade < 1;
    if (visible !== this.heroVisible) {
      this.heroVisible = visible;
      this.hero.style.visibility = visible ? '' : 'hidden';
    }
  }
}
