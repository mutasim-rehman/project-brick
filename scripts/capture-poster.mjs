import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch({ channel:'chrome',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await page.goto(process.env.SITE_URL || 'http://127.0.0.1:5173');
  await page.waitForFunction(()=>window.__world?.renderer.domElement.width>0);
  const data=await page.evaluate(()=>{window.__world.composer.render();return window.__world.renderer.domElement.toDataURL('image/webp',.85);});
  await writeFile('public/site-poster.webp',Buffer.from(data.split(',')[1],'base64'));
  console.log('Captured construction scene fallback: public/site-poster.webp');
} finally { await browser.close(); }
