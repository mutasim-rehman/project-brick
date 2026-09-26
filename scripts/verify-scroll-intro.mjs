import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
await mkdir('artifacts',{recursive:true});
try {
  for (const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
    const page=await browser.newPage({viewport});
    const errors=[];page.on('pageerror',error=>{errors.push(error.stack);console.log(error.stack);});
    await page.goto('http://127.0.0.1:5173/');
    await page.locator('#essential-only').click();
    await page.waitForFunction(()=>window.__world?.renderer.domElement.width>0);
    // Keep the software-rendered browser check responsive at the completed scene.
    await page.evaluate(()=>{
      const w=window.__world;
      w.renderer.setPixelRatio(.5);
      w.composer.setPixelRatio(.5);
      w.renderer.shadowMap.enabled=false;
      if(w.gtaoPass)w.gtaoPass.enabled=false;
      w.bloomPass.enabled=false;
    });
    console.log(`${name}: scene loaded`);
    assert.equal(await page.evaluate(()=>window.__world.timeline.targetProgress),0);
    const travel=await page.evaluate(()=>document.querySelector('.scroll-intro').offsetHeight-document.querySelector('.hero').offsetHeight);
    for (const p of [0,.22,.45,.66,.82,1]) {
      await page.evaluate(y=>window.scrollTo(0,y),travel*.92*p);
      await page.waitForFunction(p=>Math.abs(window.__world.timeline.targetProgress-p)<.002,p);
      const position=await page.evaluate(()=>({hero:document.querySelector('.hero').getBoundingClientRect().top,header:document.querySelector('.site-header').offsetHeight,rest:document.querySelector('.proof-strip').getBoundingClientRect().top,viewport:innerHeight}));
      assert.equal(position.hero,position.header,'Scene must remain pinned');
      assert(position.rest>=position.viewport-1,'Homepage appeared before the animation finished');
      console.log(`${name}: stage ${p}`);
    }
    assert.equal(await page.evaluate(()=>window.__world.timeline.currentProgress),1);
    await page.screenshot({path:`artifacts/scroll-complete-${name}.png`});
    const colors=await page.evaluate(()=>{const w=window.__world;w.composer.render();const c=document.createElement('canvas');c.width=50;c.height=50;const ctx=c.getContext('2d');ctx.drawImage(w.renderer.domElement,0,0,50,50);const pixels=ctx.getImageData(0,0,50,50).data;return new Set(Array.from({length:2500},(_,i)=>`${pixels[i*4]},${pixels[i*4+1]},${pixels[i*4+2]}`)).size;});
    assert(colors>30,'Blank scene');
    await page.evaluate(y=>window.scrollTo(0,y),travel+250);
    await page.waitForFunction(()=>document.querySelector('.proof-strip').getBoundingClientRect().top<innerHeight);
    await page.screenshot({path:`artifacts/scroll-handoff-${name}.png`});
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.waitForFunction(()=>window.__world.timeline.targetProgress===0);
    await page.locator('#skip-story').click();
    assert.equal(await page.evaluate(()=>window.__world.timeline.targetProgress),1);
    assert(await page.locator('.proof-strip').evaluate(e=>e.getBoundingClientRect().top<innerHeight));
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.locator('#reduced-motion').check();
    assert(await page.locator('.scroll-intro').evaluate(e=>e.offsetHeight===e.querySelector('.hero').offsetHeight));
    const time=await page.evaluate(()=>window.__world.timeline.time);
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(()=>window.__world.timeline.time),time);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
    assert.deepEqual(errors,[]);
    console.log(`PASS ${name}: all six stages, pinning, completion before handoff, reverse scroll, skip, reduced motion, canvas pixels.`);
    await page.close();
  }
} finally {await browser.close();}
