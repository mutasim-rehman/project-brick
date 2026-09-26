export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
export const apiBase = (import.meta.env?.VITE_API_BASE || '').replace(/\/$/, '');
export async function api(path, options = {}) {
  if (!apiBase) throw new Error('Live service is not connected. Your information has not been sent.');
  const response = await fetch(`${apiBase}/api/v1/${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('The service could not complete this request. Please try again.');
  return response.json();
}
export function download(name, content, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = Object.assign(document.createElement('a'), { href: url, download: name });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
export function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
export const preferencesAllowed = () => readStorage('sk-consent', {}).preferences === true;
export function remember(key, value) { if (preferencesAllowed()) writeStorage(key, value); }
