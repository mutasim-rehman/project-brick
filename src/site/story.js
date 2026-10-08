import { icon, escapeHtml } from './utils.js';
import { cta } from './shared.js';
import { chapterRail } from './chapters.js';

const text = value => escapeHtml(value ?? '');

const beatPanel = (id, beat, index) => `<div class="story-panel${index === 0 ? ' is-active' : ''}" id="${id}-panel-${index}" role="tabpanel" aria-labelledby="${id}-beat-${index}" data-beat-panel="${index}" data-caption="${text(beat.caption)}"${index === 0 ? '' : ' hidden'}><p class="story-kicker">Sample record</p><h3>${text(beat.label)}</h3>${beat.html || `<dl>${beat.rows.map(([term, value]) => `<div><dt>${text(term)}</dt><dd>${text(value)}</dd></div>`).join('')}</dl>`}</div>`;

function storyChapter(chapter) {
  const head = `<div class="story-stage-head"><div><p class="eyebrow">${text(chapter.kicker)}</p><h2>${text(chapter.title)}</h2></div><p>${text(chapter.copy)}</p></div>`;
  if (chapter.static) {
    return `<section class="story-chapter is-static" id="${chapter.id}" data-chapter-section><div class="story-stage">${head}<div class="story-stage-body">${chapter.body}</div></div></section>`;
  }
  const beats = chapter.beats;
  return `<section class="story-chapter" id="${chapter.id}" data-chapter-section data-story-chapter data-beats="${beats.length}"><div class="story-stage">${head}<div class="story-stage-body"><figure class="story-object">${chapter.figure || ''}<figcaption>${text(chapter.caption || 'Example')}</figcaption></figure><div class="story-record">${beats.map((beat, index) => beatPanel(chapter.id, beat, index)).join('')}</div></div><div class="story-steps" role="tablist" aria-label="${text(chapter.kicker)} records" style="grid-template-columns:repeat(${beats.length},1fr)">${beats.map((beat, index) => `<button type="button" id="${chapter.id}-beat-${index}" role="tab" aria-controls="${chapter.id}-panel-${index}" aria-selected="${index === 0}" tabindex="${index === 0 ? '0' : '-1'}" data-beat="${index}"><span>0${index + 1}</span>${text(beat.label)}</button>`).join('')}</div><p class="story-caption" data-story-caption>${text(beats[0].caption)}</p></div></section>`;
}

export function storyPage({ hero, chapters = [], summary, rail }) {
  const items = rail || [
    { id: hero.id, label: hero.rail || 'Start' },
    ...chapters.map(chapter => ({ id: chapter.id, label: chapter.rail, href: chapter.href, current: chapter.current })),
    summary ? { id: summary.id, label: summary.rail || 'Close' } : null,
  ].filter(Boolean);
  const summaryHtml = summary ? `<section class="story-summary" id="${summary.id}" data-chapter-section><div class="wrap"><p class="eyebrow">${text(summary.kicker)}</p><h2>${text(summary.title)}</h2><div class="story-signals">${summary.cards.map((card, index) => `<article class="${index % 2 ? 'is-lime' : ''}">${card.href ? `<a href="${card.href}">` : ''}<span>0${index + 1}</span><h3>${text(card.title)}</h3><p>${text(card.copy)}</p>${card.href ? '</a>' : ''}</article>`).join('')}</div>${summary.note ? `<p class="story-summary-note">${text(summary.note)}</p>` : ''}<div class="actions">${summary.actions || ''}</div></div></section>` : '';
  const heroCopy = `<div class="story-hero-copy"><p class="eyebrow">${text(hero.kicker)}</p><h1>${hero.titleHtml || text(hero.title)}</h1><p>${text(hero.copy)}</p><div class="actions">${hero.actions || ''}</div>${hero.note ? `<p class="story-note">${text(hero.note)}</p>` : ''}</div>`;
  const heroVisual = hero.visual ? `<figure class="story-hero-visual${hero.id === 'home-overview' ? ' home-logo-visual' : ''}">${hero.visual}</figure>` : '';
  return `${chapterRail(items)}<article class="story-page"><section class="story-hero wrap${hero.visual ? ' has-visual' : ''}" id="${hero.id}" data-chapter-section>${hero.visual ? heroCopy + heroVisual : heroCopy}</section>${chapters.map(storyChapter).join('')}${summaryHtml}</article>${cta()}`;
}

export function storyHero({ kicker, title, titleHtml, copy, actions, note }) {
  return `<article class="story-page"><section class="story-hero wrap"><p class="eyebrow">${text(kicker)}</p><h1>${titleHtml || text(title)}</h1><p>${text(copy)}</p><div class="actions">${actions || ''}</div>${note ? `<p class="story-note">${text(note)}</p>` : ''}</section></article>${cta()}`;
}

const prefersStill = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canScrub = () => window.matchMedia('(min-width: 901px)').matches && !prefersStill();

function setBeat(chapter, index) {
  const panels = [...chapter.querySelectorAll('[data-beat-panel]')];
  const tabs = [...chapter.querySelectorAll('[data-beat]')];
  const caption = chapter.querySelector('[data-story-caption]');
  panels.forEach((panel, panelIndex) => {
    const on = panelIndex === index;
    panel.classList.toggle('is-active', on);
    panel.hidden = !on;
  });
  tabs.forEach((tab, tabIndex) => {
    const on = tabIndex === index;
    tab.setAttribute('aria-selected', String(on));
    tab.tabIndex = on ? 0 : -1;
    tab.classList.toggle('is-complete', tabIndex < index);
  });
  if (caption && panels[index]) caption.textContent = panels[index].dataset.caption;
  chapter.classList.add('is-live');
}

export function bindStory() {
  const chapters = [...document.querySelectorAll('[data-story-chapter]')];
  if (!chapters.length) return;
  let frame = 0;
  let lockUntil = 0;
  const scrollToBeat = (chapter, index) => {
    const count = chapter.querySelectorAll('[data-beat]').length;
    const top = chapter.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(0, chapter.offsetHeight - window.innerHeight);
    window.scrollTo({ top: top + range * ((index + 0.45) / count), behavior: 'instant' });
  };
  chapters.forEach(chapter => {
    const tabs = [...chapter.querySelectorAll('[data-beat]')];
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const index = Number(tab.dataset.beat);
        setBeat(chapter, index);
        if (!canScrub()) return;
        lockUntil = performance.now() + 120;
        scrollToBeat(chapter, index);
      });
      tab.addEventListener('keydown', event => {
        const current = tabs.indexOf(tab);
        const next = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? current + 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? current - 1 : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
        if (next < 0 || next >= tabs.length || (next === current && event.key !== 'Home' && event.key !== 'End')) return;
        event.preventDefault();
        tabs[next].click();
        tabs[next].focus();
      });
    });
    setBeat(chapter, 0);
  });
  const update = () => {
    frame = 0;
    if (!canScrub() || performance.now() < lockUntil) return;
    chapters.forEach(chapter => {
      const top = chapter.getBoundingClientRect().top + window.scrollY;
      const range = Math.max(1, chapter.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, (window.scrollY - top) / range));
      const count = chapter.querySelectorAll('[data-beat]').length;
      const index = Math.min(count - 1, Math.floor(progress * count * 0.999));
      const selected = chapter.querySelector('[aria-selected="true"]');
      if (selected?.dataset.beat !== String(index)) setBeat(chapter, index);
    });
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', queue);
    window.removeEventListener('resize', queue);
  }, { once: true });
}

export const signalActions = (primary, secondary) => `${primary}${secondary || ''}`;
export const downLink = (href, label) => `<a class="button primary" href="${href}">${label} ${icon('arrow-down')}</a>`;
export const textLink = (href, label) => `<a class="text-link" href="${href}">${label} ${icon('arrow-right')}</a>`;
export const lightLink = (href, label) => `<a class="button light" href="${href}">${label} ${icon('arrow-right')}</a>`;
