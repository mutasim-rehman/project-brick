import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = process.env.SITE_URL || 'http://127.0.0.1:5173';
const output = 'artifacts/lusion-motion';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(root);
  await page.locator('.cinema-canvas canvas').waitFor();
  await page.waitForTimeout(1000);
  const initialProgress=await page.locator('.cinema-canvas').getAttribute('data-build-progress');
  await page.waitForTimeout(1000);
  assert.equal(await page.locator('.cinema-canvas').getAttribute('data-build-progress'),initialProgress,'Build must stay still without scroll');
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.screenshot({ path: `${output}/desktop.png` });
  await page.locator('.cinema-pause').click();
  assert.equal(await page.locator('.cinema-pause').getAttribute('aria-pressed'), 'true');
  await page.evaluate(() => {
    const journey = document.querySelector('.cinema-journey');
    scrollTo(0, journey.offsetTop + journey.offsetHeight - innerHeight);
  });
  await page.waitForTimeout(1500);
  assert.equal(await page.locator('[data-cinema-state]').innerText(), 'ONE CONNECTED PICTURE');
  assert.equal(await page.locator('.cinema-canvas').getAttribute('data-exterior'),'complete');
  await page.screenshot({ path: `${output}/assembled.png` });
  await page.evaluate(()=>scrollTo(0,0));
  await page.waitForTimeout(1000);
  assert.equal(await page.locator('.cinema-canvas').getAttribute('data-build-progress'),initialProgress,'Scrolling back must reverse the build');
  await page.locator('.cinema-statement').evaluate(node=>scrollTo(0,node.offsetTop-160));
  await page.waitForTimeout(1500);
  await page.screenshot({path:`${output}/editorial.png`});
  const ribbonBefore=await page.locator('.cinema-flow-blue path').evaluate(node=>getComputedStyle(node).strokeDashoffset);
  await page.locator('.cinema-statement').evaluate(node=>scrollTo(0,node.offsetTop+200));
  await page.waitForTimeout(1000);
  assert.notEqual(await page.locator('.cinema-flow-blue path').evaluate(node=>getComputedStyle(node).strokeDashoffset),ribbonBefore,'Ribbon drawing must follow scroll');
  await page.locator('.cinema-record-journey').evaluate(node => scrollTo(0, node.offsetTop + node.offsetHeight - innerHeight));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${output}/handoff.png` });
  assert.equal(await page.locator('.cinema-record-result').evaluate(node => Number(getComputedStyle(node).opacity)), 1);
  await page.locator('[data-site-zone="stores"]').click();
  assert.equal(await page.locator('[data-site-zone="stores"]').getAttribute('aria-pressed'), 'true');
  assert.match(await page.locator('#bp-record').innerText(), /Every handoff has a trail/);
  await page.locator('.cinema-plan-intro').evaluate(node=>scrollTo(0,node.offsetTop-100));
  await page.waitForTimeout(1500);
  await page.screenshot({path:`${output}/editorial-cyan.png`});
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(root);
    await page.locator('.cinema-canvas canvas').waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow at ${width}px`);
    await page.screenshot({ path: `${output}/mobile-${width}.png`, fullPage: true });
    if (width === 390) {
      await page.screenshot({ path: `${output}/mobile-hero.png` });
      await page.locator('.cinema-journey').evaluate(node=>scrollTo(0,node.offsetTop+node.offsetHeight-innerHeight));
      await page.waitForTimeout(1000);
      await page.screenshot({path:`${output}/mobile-finished.png`});
      for (const [selector, name] of [['.cinema-statement', 'mobile-story'], ['.cinema-record-stage', 'mobile-records'], ['.blueprint-surface', 'mobile-plan']]) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.waitForTimeout(1200);
        await page.screenshot({ path: `${output}/${name}.png` });
      }
    }
  }
  await page.getByRole('button', { name: 'Open navigation' }).click();
  assert.equal(await page.locator('#mobile-nav').isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#mobile-nav').isVisible(), false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.locator('.cinema-canvas canvas').waitFor();
  assert.equal(await page.locator('.cinema-pause').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('.cinema-stage').evaluate(node => getComputedStyle(node).position), 'relative');
  assert.equal(await page.locator('[data-cinema-state]').innerText(), 'ONE CONNECTED PICTURE');
  assert.equal(await page.locator('.cinema-flow-blue path').evaluate(node=>getComputedStyle(node).strokeDasharray),'none');
  assert.equal(await page.locator('#cinema-title .cinema-title-line').first().evaluate(node=>getComputedStyle(node).transform),'none');
  assert.deepEqual(errors, []);
  console.log('PASS: WebGL, assembly, record handoff, site zones, 390/768/1440px layouts, navigation and reduced motion.');
} finally { await browser.close(); }
