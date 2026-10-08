import { storyPage, downLink, textLink, lightLink } from './story.js';

const card = `<svg viewBox="0 0 320 220" aria-hidden="true"><rect x="36" y="24" width="248" height="172" rx="20" fill="#24382c"/><rect x="58" y="48" width="84" height="10" rx="2" fill="#d2e15a"/><rect x="58" y="76" width="160" height="8" rx="2" fill="#f6f3ea"/><rect x="58" y="98" width="124" height="8" rx="2" fill="#9aa58f"/></svg>`;

export function pricingPage() {
  return storyPage({
    hero: {
      id: 'pricing-overview',
      rail: 'Start',
      kicker: 'Pricing',
      titleHtml: 'Pricing details <em>await approval.</em>',
      copy: 'Approved regional price lists and price-hold terms are not available yet. Contact Site Killick to discuss pricing.',
      actions: `${downLink('#pricing-configuration', 'See the configuration')}${textLink('/hardware', 'Explore the hardware')}`,
      note: 'This page does not show a price.',
    },
    chapters: [
      {
        id: 'pricing-configuration',
        rail: 'Setup',
        kicker: '01 / Pricing configuration',
        title: 'The shape of a quote, without a number.',
        copy: 'When approved, pricing will support CAD, USD, GBP, EUR, AUD and NZD, monthly and annual billing, employee count, product modules, hardware, and separate recurring and one-time costs.',
        figure: card,
        caption: 'Configuration · no prices shown',
        beats: [
          { label: 'Currency', caption: 'Regional price lists are not approved yet.', rows: [['Currencies', 'CAD, USD, GBP, EUR, AUD, NZD'], ['Billing', 'Monthly and annual'], ['Status', 'Awaiting approval']] },
          { label: 'People', caption: 'Employee count is an input, not a published rate.', rows: [['Input', 'Employee count'], ['Shown here', 'No rate'], ['Next', 'Discuss with Site Killick']] },
          { label: 'Modules', caption: 'People, Safety, Tools, Fleet and Intelligence can be part of a configuration.', rows: [['Modules', 'Five areas'], ['Estimate', 'Not calculated here'], ['Stage', 'Separate from a price hold']] },
          { label: 'Stages', caption: 'An estimate, a submitted request and an approved price hold stay separate.', rows: [['Estimate', 'Not shown'], ['Request', 'Not submitted here'], ['Price hold', 'Not created here']] },
        ],
      },
      {
        id: 'pricing-hardware',
        rail: 'Hardware',
        kicker: '02 / Hardware',
        title: 'Four devices, quoted separately.',
        copy: 'Hardware is not included in a subscription estimate until approved regional prices exist.',
        figure: card,
        caption: 'Hardware · no prices shown',
        beats: [
          { label: 'Badge', caption: 'An NFC site badge is quoted with approved hardware prices.', rows: [['Device', 'NFC site badge'], ['Price', 'Not published'], ['Page', 'See the hardware story']] },
          { label: 'Guard', caption: 'A guard tag is quoted separately from the subscription.', rows: [['Device', 'Guard tag'], ['Price', 'Not published'], ['Use', 'Protected assets']] },
          { label: 'Tool', caption: 'A tool tag is quoted separately from the subscription.', rows: [['Device', 'Tool tag'], ['Price', 'Not published'], ['Use', 'Custody and handoff']] },
          { label: 'Gateway', caption: 'A vehicle gateway is quoted separately from the subscription.', rows: [['Device', 'Vehicle gateway'], ['Price', 'Not published'], ['Use', 'Journey and service review']] },
        ],
      },
      {
        id: 'pricing-next',
        rail: 'Next',
        kicker: '03 / Next step',
        title: 'Discuss pricing with Site Killick.',
        copy: 'Share your company, territory and the hardware you want to include. Approved prices are confirmed before a quote.',
        figure: card,
        caption: 'Enquiry · no quote',
        beats: [
          { label: 'Company', caption: 'Start with the company and where it operates.', rows: [['Topic', 'Company'], ['Topic', 'Operating territory'], ['Quote', 'Not created on this page']] },
          { label: 'Work', caption: 'The workflows you need come before a number.', rows: [['Topics', 'People, safety, tools, fleet'], ['Detail', 'Discussed with Site Killick'], ['Price', 'Not shown']] },
          { label: 'Hardware', caption: 'Devices are named before they are priced.', rows: [['Devices', 'Badge, guard, tool, gateway'], ['Prices', 'Pending approval'], ['Link', 'Hardware page']] },
          { label: 'Quote', caption: 'A quote waits on approved prices.', rows: [['Hold', 'Not offered here'], ['Estimate', 'Not calculated'], ['Next', 'Contact Site Killick']] },
        ],
      },
    ],
    summary: {
      id: 'pricing-close',
      rail: 'Close',
      kicker: 'No price on this page',
      title: 'Approved prices come before a quote.',
      note: 'Configuration estimates, submitted requests and approved price holds are separate stages.',
      cards: [
        { title: 'Configuration', copy: 'Currency, people, modules and hardware.' },
        { title: 'Hardware', copy: 'Four devices, quoted apart from the subscription.' },
        { title: 'Approval', copy: 'Regional lists are not published yet.' },
        { title: 'Contact', copy: 'Talk through the quote when you are ready.' },
      ],
      actions: lightLink('/contact', 'Contact Site Killick') + textLink('/hardware', 'Explore the hardware'),
    },
  });
}
