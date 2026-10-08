import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.location = new URL('https://example.com/hardware');
const { hardwarePage } = await import('../src/site/hardware.js');
const { platformPage, rolesPage, homePage, aboutPage } = await import('../src/site/pages.js');
const { pricingPage } = await import('../src/site/pricing.js');
const { contactPage } = await import('../src/site/contact.js');

test('hardware page is a four-device scroll story with a chapter rail', () => {
  const html = hardwarePage();
  for (const id of ['hardware-overview', 'nfc-badge', 'guard-tag', 'tool-tag', 'vehicle-gateway', 'operating-picture']) {
    assert(html.includes(`id="${id}"`), id);
  }
  assert(html.includes('class="chapter-rail"'));
  assert(html.includes('Sample record'));
  assert(html.includes('href="/legal/hardware"'));
  assert(!html.includes('$'));
});

test('home, platform, roles, pricing, about and contact use the hardware story layout', () => {
  const home = homePage();
  const platform = platformPage();
  const roles = rolesPage();
  const pricing = pricingPage();
  const about = aboutPage();
  const contact = contactPage();
  for (const html of [home, platform, roles, pricing, about, contact]) {
    assert(html.includes('class="story-hero'));
    assert(html.includes('class="chapter-rail"'));
    assert(html.includes('class="story-summary"'));
  }
  assert(home.includes('id="construction-model"'));
  assert(platform.includes('id="module-people"'));
  assert(platform.includes('id="module-intelligence"'));
  assert(roles.includes('id="role-business-owner"'));
  assert(roles.includes('id="role-fleet-manager"'));
  assert(pricing.includes('id="pricing-hardware"'));
  assert(pricing.includes('href="/hardware"'));
  assert(!pricing.includes('$'));
  assert(about.includes('id="about-name"'));
  assert(contact.includes('id="contact-form"') || contact.includes('Enquiries are not open'));
});
