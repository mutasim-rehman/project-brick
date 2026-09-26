import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true, args: ['--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width:1440, height:1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const root = process.env.SITE_URL || 'http://127.0.0.1:5173';
await mkdir('artifacts', { recursive:true });
try {
  await page.goto(root);
  await page.locator('#essential-only').click();
  await page.waitForFunction(() => window.__world?.renderer.domElement.width > 0);
  await page.waitForTimeout(1500);
  const canvasCheck = await page.evaluate(() => {
    const w = window.__world;
    w.composer.render();
    const canvas = document.createElement('canvas'); canvas.width=80;canvas.height=50;
    const ctx=canvas.getContext('2d');ctx.drawImage(w.renderer.domElement,0,0,80,50);
    const pixels=ctx.getImageData(0,0,80,50).data;
    const colors=new Set(); for(let i=0;i<pixels.length;i+=4)colors.add(`${pixels[i]},${pixels[i+1]},${pixels[i+2]}`);
    return { colors:colors.size, meshes:w.scene.children.length, time:w.timeline.time };
  });
  assert(canvasCheck.colors>30,`Canvas blank: ${JSON.stringify(canvasCheck)}`);
  await page.screenshot({ path:'artifacts/home-desktop.png', fullPage:true });
  const firstTime=canvasCheck.time;
  await page.waitForTimeout(250);
  assert(await page.evaluate(()=>window.__world.timeline.time)>firstTime,'Scene does not animate');
  await page.locator('#story-next').click();
  await page.getByText('Clear responsibility. A record behind every action.').waitFor();
  await page.locator('#reduced-motion').check();
  assert(await page.evaluate(()=>window.__world.reducedMotion));
  const routes=['/platform','/how-it-works','/pricing','/contact','/about','/legal','/legal/terms','/legal/privacy','/legal/cookies','/legal/acceptable-use','/legal/accessibility','/legal/hardware','/legal/security','/sign-in','/not-found'];
  for (const route of routes) {
    await page.goto(root+route);
    await page.locator('h1').waitFor();
    assert(await page.locator('h1').innerText(),`No heading on ${route}`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${route}`);
  }
  await page.goto(root+'/platform');
  for(const button of await page.locator('[data-module]').all()) { await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true'); }
  await page.goto(root+'/how-it-works');
  for(const button of await page.locator('[data-role]').all()) { await button.click();assert.equal(await page.locator('.onboarding li').count(),7); }
  await page.goto(root+'/pricing');
  await page.locator('[name=currency]').selectOption('USD');
  await page.locator('[name=employees]').fill('50');
  await page.locator('[name=annual][value=true]').check();
  await page.locator('[name=hardware-0]').fill('10');
  assert((await page.locator('#estimate-output').innerText()).includes('$320.45'));
  assert((await page.locator('#estimate-output').innerText()).includes('$390.00'));
  const savedUrl=page.url(); await page.reload();
  assert.equal(await page.locator('[name=employees]').inputValue(),'50');
  assert.equal(await page.locator('[name=currency]').inputValue(),'USD');
  await page.screenshot({path:'artifacts/pricing-desktop.png',fullPage:true});
  await page.locator('#price-demo').click();
  assert.equal(await page.locator('[name=employees]').inputValue(),'50');
  await page.locator('[name=name]').fill('Test Person');await page.locator('[name=email]').fill('test@example.com');await page.locator('[name=company]').fill('Test Construction');
  await page.locator('[name=territory]').selectOption('Canada');await page.locator('[name=sector]').selectOption('Civil & infrastructure');await page.locator('[name=consent]').check();
  await page.locator('#contact-form button[type=submit]').click();
  await page.locator('[data-slot="0"]').click();
  const before=await page.locator('#selected-time').innerText();
  await page.locator('#timezone').selectOption('Pacific/Auckland');
  assert.notEqual(await page.locator('#selected-time').innerText(),before);
  await page.locator('#submit-booking').click();
  assert((await page.locator('#booking-result').innerText()).includes('not been sent'));
  const downloadEvent=page.waitForEvent('download');await page.locator('#download-calendar').click();assert.equal((await downloadEvent).suggestedFilename(),'site-killick-meeting.ics');
  await page.locator('#support-toggle').click();await page.locator('[data-question="How does pricing work?"]').click();
  assert((await page.locator('#support-messages').innerText()).includes('illustrative regional tables'));
  await page.locator('#support-close').click();
  await page.setViewportSize({width:390,height:844});
  for(const route of ['/', '/platform','/how-it-works','/pricing','/contact','/about','/legal/privacy']) {
    await page.goto(root+route);
    await page.locator('h1').waitFor();
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Mobile overflow at ${route}`);
    if(route==='/') {
      await page.waitForFunction(()=>window.__world?.renderer.domElement.width>0);await page.waitForTimeout(800);
      const count=await page.evaluate(()=>{const w=window.__world;w.composer.render();const c=document.createElement('canvas');c.width=40;c.height=40;const ctx=c.getContext('2d');ctx.drawImage(w.renderer.domElement,0,0,40,40);const data=ctx.getImageData(0,0,40,40).data;return new Set(Array.from({length:1600},(_,i)=>`${data[i*4]},${data[i*4+1]},${data[i*4+2]}`)).size;});
      assert(count>30,'Mobile canvas is blank');
      await page.locator('#reduced-motion').check();
      const time=await page.evaluate(()=>window.__world.timeline.time);await page.waitForTimeout(200);
      assert.equal(await page.evaluate(()=>window.__world.timeline.time),time,'Reduced motion scene still animates');
    }
    await page.screenshot({path:`artifacts/${route==='/'?'home':route.split('/').pop()}-mobile.png`,fullPage:true});
  }
  await page.locator('#menu-toggle').click();assert(await page.locator('#mobile-nav').isVisible());
  await page.locator('#mobile-nav a[href="/platform"]').click();
  assert.equal(new URL(page.url()).pathname,'/platform');
  await page.setViewportSize({width:320,height:740});
  for(const route of ['/pricing','/contact','/legal/terms']) {await page.goto(root+route);await page.locator('h1').waitFor();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`320px overflow at ${route}`);}
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({status:'PASS',routes:routes.length+1,canvas:canvasCheck,checks:['navigation','6 modules','9 roles','pricing math','resumable configuration','contact validation and handoff','time-zone conversion','calendar export','support guide','desktop/mobile overflow'],savedUrl},null,2));
} finally { await browser.close(); }
