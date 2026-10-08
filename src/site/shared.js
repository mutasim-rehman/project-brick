import { icon } from './utils.js';
const publicEnv = import.meta.env || globalThis.__SITE_BUILD_ENV__ || {};
export const appUrl = /^https:\/\//.test(publicEnv.VITE_APP_URL || '') ? publicEnv.VITE_APP_URL : '';
export const contactEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(publicEnv.VITE_CONTACT_EMAIL || '') ? publicEnv.VITE_CONTACT_EMAIL : '';
export const ctaLabel = 'Explore the preview';
export const mark = `<svg class="brand-mark" viewBox="0 0 40 44" fill="none" aria-hidden="true"><path d="M20 3v29M10 13h20M6 25l14 15 14-15M6 25v9m28-9v9" stroke="currentColor" stroke-width="3" stroke-linecap="square"/><path d="m13 6 7-4 7 4-7 4Z" fill="currentColor"/></svg>`;
export const brand = () => `<a class="brand" href="/" aria-label="Site Killick home">${mark}<span>site killick<span class="brand-period">.</span></span></a>`;
export const cta = () => `<section class="closing"><div class="wrap closing-inner"><div><p class="eyebrow">${ctaLabel.toUpperCase()}</p><h2>Leave the site<br>at the site.</h2><p>See the proposed workflows for people, work, safety, assets and fleet.</p></div><div class="closing-action"><a class="button light" href="/platform">${ctaLabel} ${icon('arrow-up-right')}</a><span>Current, pilot and planned feature availability is subject to confirmation.</span></div>${mark}</div></section>`;
export const intro = (label,title,copy) => `<section class="wrap page-intro"><p class="eyebrow">${label}</p><h1>${title}</h1><p>${copy}</p></section>`;
