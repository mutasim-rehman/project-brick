import test from 'node:test';
import assert from 'node:assert/strict';
globalThis.location = new URL('https://example.com/');
const { normalizeConfig, calculate, priceLists, snapshot } = await import('../src/site/pricing.js');
const { formatSlot, sampleSlots, calendarFile } = await import('../src/site/contact.js');
const { modules, roles, policies } = await import('../src/site/content.js');

test('each regional table calculates recurring, annual and one-time costs separately',()=>{
  for(const [currency,list] of Object.entries(priceLists)){
    const result=calculate({currency,employees:50,modules:['People','Safety'],hardware:[10,2,1,3],annual:true});
    const monthly=list.base+50*list.seat+2*list.module;
    assert.equal(result.recurring,Math.round(monthly*.85*100)/100);
    assert.equal(result.billed,Math.round(result.recurring*1200)/100);
    assert.equal(result.oneTime,10*list.hardware[0]+2*list.hardware[1]+list.hardware[2]+3*list.hardware[3]+list.setup);
  }
});
test('shared configurations cannot introduce unknown modules, currencies or unbounded quantities',()=>{
  const config=normalizeConfig({currency:'__proto__',employees:Infinity,modules:['People','People','unknown'],hardware:[-1,'bad',1e8,2.8]});
  assert.equal(config.currency,'CAD');assert.equal(config.employees,5);
  assert.deepEqual(config.modules,['People']);assert.deepEqual(config.hardware,[0,0,10000,3]);
  assert.deepEqual(normalizeConfig(null),normalizeConfig({}));
});
test('snapshots explicitly remain drafts with an independent configuration and 14-day requested expiry',()=>{
  const value=snapshot();assert.equal(value.status,'draft-not-submitted');
  assert.equal(Date.parse(value.requestedHoldUntil)-Date.parse(value.timestampUTC),14*86400000);
  assert(value.inquiryRef.startsWith('PREVIEW-'));
});
test('UTC slots convert across DST without changing their instant',()=>{
  assert.match(formatSlot('2026-03-08T06:30:00Z','America/New_York'),/1:30/);
  assert.match(formatSlot('2026-03-08T07:30:00Z','America/New_York'),/3:30/);
  assert.match(formatSlot('2026-11-01T05:30:00Z','America/New_York'),/1:30/);
  assert.match(formatSlot('2026-11-01T06:30:00Z','America/New_York'),/1:30/);
});
test('sample appointments are future weekdays; unconfirmed calendars remain tentative',()=>{
  const now=new Date('2026-09-25T23:50:00Z');
  const slots=sampleSlots(now);assert.equal(slots.length,12);
  assert(slots.every(s=>Date.parse(s.startUTC)>now.getTime()&&![0,6].includes(new Date(s.startUTC).getUTCDay())));
  const ics=calendarFile(slots[0].startUTC,'test');
  assert.match(ics,/STATUS:TENTATIVE/);assert.match(ics,/DTSTART:20260928T140000Z/);assert.match(ics,/DTEND:20260928T143000Z/);
  assert(!ics.includes('STATUS:CONFIRMED'));
});
test('specification includes all modules, roles, onboarding steps and policy routes',()=>{
  assert.equal(modules.length,6);assert.equal(roles.length,9);assert.equal(policies.length,7);
  assert(roles.every(r=>r.steps.length===7&&r.daily.length===3));
  assert(modules.every(m=>['problem','capability','inputs','output','decision','roles'].every(key=>m[key])));
});
