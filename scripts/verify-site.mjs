import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true, args: ['--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const root = process.env.SITE_URL || 'http://127.0.0.1:5173';
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const routes = ['/', '/platform', '/how-it-works', '/pricing', '/contact', '/about', '/legal', '/legal/privacy', '/legal/security', '/legal/hardware', '/sign-in', '/not-found'];
  for (const route of routes) {
    await page.goto(`${root}${route}`);
    await page.locator('h1').waitFor();
    assert(await page.locator('h1').innerText(), `No heading on ${route}`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow on ${route}`);
  }
  await page.goto(root);
  await page.locator('[data-stage="0"]').click();
  assert.equal(await page.locator('#stage-eyebrow').innerText(), '01 / GROUNDWORK');
  await page.locator('[data-stage="2"]').click();
  await page.waitForFunction(() => document.querySelector('#stage-eyebrow').textContent === '03 / HANDOVER', null, { timeout: 45000 });
  assert.equal(await page.locator('#stage-eyebrow').innerText(), '03 / HANDOVER');
  assert(await page.locator('.construction-stage').evaluate(el => Math.abs(el.getBoundingClientRect().top - document.querySelector('.site-header').getBoundingClientRect().bottom) < 2), 'Scene should stay pinned at handover');
  await page.goto(`${root}/platform`);
  for (const button of await page.locator('[data-module]').all()) {
    await button.click();
    assert.equal(await button.getAttribute('aria-pressed'), 'true');
    await page.locator('[data-demo-action]').click();
    assert(await page.locator('[data-demo-result]').isVisible());
  }
  await page.goto(`${root}/pricing`);
  await page.locator('[name=currency]').selectOption('USD');
  await page.locator('[name=employees]').fill('50');
  await page.locator('[name=annual][value=true]').check();
  assert((await page.locator('#estimate-output').innerText()).includes('$320.45'));
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(`${root}${route}`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Mobile overflow on ${route}`);
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: 'PASS', routes: routes.length, stages: 3, modules: 6, viewport: 'desktop and 390px mobile' }, null, 2));
} finally {
  await browser.close();
}
