const chapterLink = (chapter, index, current) => {
  const href = chapter.href || `#${chapter.id}`;
  const state = chapter.current ? ' aria-current="page"' : current ? ' aria-current="location"' : '';
  const data = chapter.href ? '' : ` data-chapter="${chapter.id}"`;
  return `<li><a href="${href}"${data}${state}><span class="chapter-index">${String(index + 1).padStart(2, '0')}</span> <span class="chapter-label">${chapter.label}</span></a></li>`;
};

export function chapterRail(chapters) {
  const items = chapters.map((chapter, index) => chapterLink(chapter, index, !chapters.some(item => item.current) && index === 0)).join('');
  return `<nav class="chapter-progress" aria-label="On this page"><ol>${items}</ol></nav><nav class="chapter-rail" aria-label="Page chapters"><ol>${items}</ol><div class="chapter-rail-line" aria-hidden="true"><span></span></div></nav>`;
}

function setCurrent(id) {
  document.querySelectorAll('[data-chapter]').forEach(el => {
    const on = el.dataset.chapter === id;
    if (el.tagName === 'A') {
      if (on) el.setAttribute('aria-current', 'location');
      else el.removeAttribute('aria-current');
    }
    if (el.tagName === 'BUTTON') el.setAttribute('aria-pressed', String(on));
  });
  const ids = [...document.querySelectorAll('.chapter-rail [data-chapter]')].map(el => el.dataset.chapter);
  const index = Math.max(0, ids.indexOf(id));
  const line = document.querySelector('.chapter-rail-line');
  if (line) line.style.setProperty('--rail', String(ids.length < 2 ? 1 : index / (ids.length - 1)));
  const active = document.querySelector(`.chapter-progress [data-chapter="${CSS.escape(id)}"]`);
  const list = active?.closest('.chapter-progress ol');
  if (list && active) {
    const edge = active.offsetLeft - (list.clientWidth - active.clientWidth) / 2;
    list.scrollTo({ left: Math.max(0, edge) });
  }
  document.dispatchEvent(new CustomEvent('chapterchange', { detail: { id } }));
}

export function bindChapterRail() {
  const rail = document.querySelector('.chapter-rail');
  if (!rail) return;
  const sections = [...rail.querySelectorAll('[data-chapter]')].map(link => document.getElementById(link.dataset.chapter)).filter(Boolean);
  if (!sections.length) return;
  let frame = 0;
  let currentId = '';
  const update = () => {
    frame = 0;
    const marker = Math.min(window.innerHeight * 0.38, 320);
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= marker) current = section;
    }
    if (current.id === currentId) return;
    currentId = current.id;
    setCurrent(current.id);
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
  document.querySelectorAll('.chapter-rail a, .chapter-progress a').forEach(link => {
    link.addEventListener('click', () => {
      if (!link.dataset.chapter) return;
      currentId = link.dataset.chapter;
      setCurrent(link.dataset.chapter);
    });
  });
  update();
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', queue);
    window.removeEventListener('resize', queue);
  }, { once: true });
}
