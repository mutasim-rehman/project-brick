import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

// Each public URL receives crawlable HTML as well as the interactive client app.
globalThis.location = new URL('http://localhost/');
const { homePage, platformPage, rolesPage, aboutPage, legalPage, signInPage, notFound } = await import('../src/site/pages.js');
const { pricingPage } = await import('../src/site/pricing.js');
const { contactPage } = await import('../src/site/contact.js');
const { policies } = await import('../src/site/content.js');
const { escapeHtml } = await import('../src/site/utils.js');
const shell = await readFile('dist/index.html','utf8');
const routes = [
  ['/', 'Construction Operations & Asset Intelligence',homePage],
  ['/platform','Platform & Features',platformPage],
  ['/how-it-works','How It Works',rolesPage],
  ['/pricing','Configure Your Pricing',pricingPage],
  ['/contact','Contact & Booking',contactPage],
  ['/about','About & Trust',aboutPage],
  ['/legal','Legal & Policies',()=>legalPage()],
  ...policies.map(p=>[`/legal/${p.slug}`,p.title,()=>legalPage(p.slug)]),
  ['/sign-in','Workspace Access',()=>signInPage('')],
];
for (const [path,title,render] of routes) {
  globalThis.location=new URL(path,'http://localhost');
  const file=`dist${path==='/'?'':path}/index.html`;
  await mkdir(dirname(file),{recursive:true});
  const markup=`<main id="main">${render()}</main>`;
  const html=shell.replace(/<title>.*?<\/title>/,`<title>${escapeHtml(title)} | Site Killick</title>`).replace('<div id="app"></div>',`<div id="app">${markup}</div>`);
  await writeFile(file,html);
}
await writeFile('dist/404.html',shell.replace('<div id="app"></div>',`<div id="app"><main id="main">${notFound()}</main></div>`));
console.log(`Generated ${routes.length} directly accessible, pre-rendered pages and 404.html.`);
