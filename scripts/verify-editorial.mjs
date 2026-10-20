import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { policies } from '../src/site/content.js';
const { chromium }=createRequire(import.meta.url)('playwright');
const root=process.env.SITE_URL||'http://127.0.0.1:5174';
const output='artifacts/editorial-theme';await mkdir(output,{recursive:true});
const routes=['/platform','/hardware','/how-it-works','/pricing','/about','/contact','/legal',...policies.map(p=>`/legal/${p.slug}`),'/sign-in','/not-found'];
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}), errors=[], flowShapes=new Set();
  page.on('pageerror',e=>errors.push(e.message));
  for(const route of routes){
    await page.goto(root+route,{waitUntil:'domcontentloaded'});
    await page.locator('h1').waitFor();
    assert.equal(await page.locator('h1').count(),1,route);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Desktop overflow: ${route}`);
    assert(await page.locator('body').evaluate(node=>node.classList.contains('editorial-site')));
    if(routes.indexOf(route)<6){
      flowShapes.add(await page.locator('.editorial-flow').evaluate(svg=>[...svg.querySelectorAll('path')].map(p=>p.getAttribute('d')).join('|')));
      await page.waitForFunction(()=>[...document.querySelectorAll('h1 .editorial-word')].every(node=>getComputedStyle(node).transform==='none'));
      await page.waitForTimeout(400);
      await page.screenshot({path:`${output}/${route.slice(1)}-desktop.png`});
    }
  }
  assert.equal(flowShapes.size,6,'Each marketing page needs a distinct flow silhouette');
  await page.goto(root+'/platform');
  for(const button of await page.locator('[data-module]').all()){
    await button.click();
    assert.equal(await button.getAttribute('aria-selected'),'true');
    await page.locator('[data-demo-action]').click();
    assert.equal(await page.locator('[data-demo-result]').isVisible(),true);
    await page.locator('[data-demo-reset]').click();
    assert.equal(await page.locator('[data-demo-result]').isVisible(),false);
  }
  await page.goto(root+'/how-it-works');
  for(const button of await page.locator('[data-workflow-stage]').all()){
    await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true');
  }
  await page.goto(root+'/hardware');
  for(const button of await page.locator('[data-hardware-index]').all()){
    await button.click();
    await page.waitForTimeout(1100);
    assert.equal(await button.getAttribute('aria-pressed'),'true');
  }
  await page.locator('[data-hardware-index="0"]').click();await page.waitForTimeout(1200);
  await page.screenshot({path:`${output}/hardware-stage.png`});
  await page.goto(root+'/pricing');
  await page.locator('.pricing-factor details summary').first().click();
  assert(await page.locator('.pricing-factor details').first().getAttribute('open')!==null);
  for(const route of routes){
    await page.setViewportSize({width:390,height:844});
    await page.goto(root+route,{waitUntil:'domcontentloaded'});
    await page.locator('h1').waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Phone overflow: ${route}`);
    if(routes.indexOf(route)<6){await page.waitForTimeout(1300);await page.screenshot({path:`${output}/${route.slice(1)}-mobile.png`});}
  }
  await page.getByRole('button',{name:'Open navigation'}).click();
  assert(await page.locator('#mobile-nav').isVisible());await page.keyboard.press('Escape');
  assert.equal(await page.locator('#mobile-nav').isVisible(),false);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(root+'/platform');
  assert.equal(await page.locator('h1 .editorial-word').first().evaluate(node=>getComputedStyle(node).transform),'none');
  assert.equal(await page.locator('.editorial-flow path').first().evaluate(node=>getComputedStyle(node).strokeDasharray),'none');
  assert.deepEqual(errors,[]);
  console.log(`PASS: ${routes.length} routes at desktop and phone widths; six platform workflows, four workflow stages, four devices, accordion, navigation, reduced motion; no page errors.`);
}finally{await browser.close();}
