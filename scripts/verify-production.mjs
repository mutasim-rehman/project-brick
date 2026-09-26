import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const { chromium } = createRequire(import.meta.url)('playwright');
const root=process.env.SITE_URL || 'http://127.0.0.1:5174';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(root);await page.locator('#site-scene canvas').waitFor();
  await page.locator('#essential-only').click();
  await page.screenshot({path:'artifacts/production-home.png'});
  await page.goto(root+'/pricing/');await page.locator('.price-total').waitFor();
  assert((await page.locator('.price-total').innerText()).includes('307.00'));
  await page.screenshot({path:'artifacts/production-pricing.png',fullPage:true});
  const staticPage=await browser.newPage({javaScriptEnabled:false});
  await staticPage.goto(root+'/legal/privacy/');
  assert.match(await staticPage.locator('h1').innerText(),/Privacy Policy/);
  assert.match(await staticPage.locator('article').innerText(),/Information in this preview/);
  const fallback=await browser.newPage({viewport:{width:390,height:844}});
  await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:original.call(this,type,...args);};});
  await fallback.goto(root);await fallback.locator('.scene-fallback').waitFor();
  await fallback.locator('#essential-only').click();
  assert((await fallback.locator('#site-scene').evaluate(e=>getComputedStyle(e).backgroundImage)).includes('site-poster.webp'));
  const poster=await fallback.request.get(root+'/site-poster.webp');assert.equal(poster.status(),200);
  await fallback.screenshot({path:'artifacts/production-fallback-mobile.png'});
  assert.deepEqual(errors,[]);
  console.log('PASS: production homepage, pricing, direct policy URLs without JavaScript, and mobile WebGL fallback.');
} finally {await browser.close();}
