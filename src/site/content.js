export const modules = [
  { id: 'people', icon: 'users', title: 'People & Workforce', short: 'The right people. Ready for work.', problem: 'Hours, qualifications and site attendance live in separate places.', capability: 'Connect NFC attendance, employee profiles, travel records and qualification reminders.', inputs: 'Employee roster, site locations, attendance events and certification dates.', output: 'A site attendance register, verified hours and an upcoming-expiry queue.', decision: 'Resolve attendance exceptions and assign qualified people before the shift starts.', roles: 'Payroll administrators, supervisors and workers', features: ['NFC & biometric attendance', 'Travel time records', 'Skills & licence reminders', 'Digital employee profiles'] },
  { id: 'work', icon: 'clipboard-list', title: 'Work & Communication', short: 'A shared picture of the day.', problem: 'Progress disappears into message threads, calls and notebooks.', capability: 'Keep assignments, progress photos, deliveries and site announcements with the work.', inputs: 'Site tasks, dated photos, delivery details and announcement recipients.', output: 'A chronological jobsite feed with owners, evidence and read receipts.', decision: 'Unblock the next trade and follow up with the person responsible.', roles: 'Project managers, foremen and lead hands', features: ['Site task feeds', 'Photo progress evidence', 'Delivery logging', 'Broadcast read receipts'] },
  { id: 'safety', icon: 'shield-check', title: 'Safety & Compliance', short: 'A record behind every response.', problem: 'Safety evidence is difficult to retrieve when the site needs it most.', capability: 'Organize toolbox talks, emergency headcounts and incident evidence in one workflow.', inputs: 'Talk attendance, signatures, site rosters and incident reports.', output: 'Signed talk records, an evacuation register and a traceable incident file.', decision: 'Identify missing people, assign follow-up actions and review the evidence.', roles: 'Safety administrators, foremen and supervisors', features: ['Signed toolbox talks', 'QR emergency headcount', 'Incident evidence', 'Corrective action records'] },
  { id: 'tools', icon: 'wrench', title: 'Tools & Assets', short: 'Know where the handoff happened.', problem: 'A missing tool turns into a site-wide search with no clear owner.', capability: 'Connect BLE and NFC tags with custody handoffs and proximity-assisted searches.', inputs: 'Tagged assets, assigned custodians, handoff scans and beacon observations.', output: 'Last-seen records, custody history and missing-equipment reports.', decision: 'Find the last responsible handoff and coordinate recovery or replacement.', roles: 'Lead hands, workers and asset managers', features: ['BLE & NFC tool tags', 'Proximity search', 'Custody handoffs', 'Missing-tool incident logs'] },
  { id: 'fleet', icon: 'truck', title: 'Vehicles & Heavy Equipment', short: 'The whole fleet, accounted for.', problem: 'Engine hours, maintenance and after-hours movement are hard to reconcile.', capability: 'Bring GPS and compatible J1939/CAN telemetry into equipment operating records.', inputs: 'Compatible gateways, vehicle details, geofences and service intervals.', output: 'Location history, engine-hour records, maintenance queues and movement alerts.', decision: 'Schedule service and investigate movement outside approved operating windows.', roles: 'Fleet managers, project managers and owners', features: ['GPS location records', 'J1939 / CAN engine hours', 'After-hours geofences', 'Fuel & service schedules'] },
  { id: 'intelligence', icon: 'chart-no-axes-combined', title: 'Intelligence & Administration', short: 'Review the exception. Keep the context.', problem: 'Owners and office teams rebuild the day before they can make a decision.', capability: 'Prepare daily summaries, payroll exception queues and extracted document details for review.', inputs: 'Site activity, attendance rules, source documents and assigned approvers.', output: 'Draft summaries and an exception queue linked to supporting records.', decision: 'Approve, correct or escalate the items that need human judgment.', roles: 'Business owners, payroll administrators and project managers', features: ['Daily summary drafts', 'Payroll exception review', 'Document extraction', 'Human approval workflows'] },
];
export const roles = [
  { name: 'Business Owner', icon: 'briefcase-business', need: 'Evaluate whether the company can operate without constant personal intervention and 24/7 calls.', module: 'intelligence' },
  { name: 'Project Manager', icon: 'clipboard-list', need: 'Assess progress tracking, site logs, trade coordination and daily reporting.', module: 'work' },
  { name: 'Safety Administrator', icon: 'shield-check', need: 'Evaluate toolbox talks, emergency headcount, certification verification and incident records.', module: 'safety' },
  { name: 'Payroll Administrator', icon: 'receipt-text', need: 'Understand verified hours, overtime rules and exception review.', module: 'people' },
  { name: 'Foreman', icon: 'hard-hat', need: 'Understand daily field work with minimal screen taps.', module: 'work' },
  { name: 'Supervisor', icon: 'user-check', need: 'Understand daily field work with minimal screen taps.', module: 'work' },
  { name: 'Lead Hand', icon: 'hammer', need: 'Understand daily field work with minimal screen taps.', module: 'tools' },
  { name: 'Worker / Labourer', icon: 'contact', need: 'Understand clock-in, shift communication, assigned equipment and hour records.', module: 'people' },
  { name: 'Fleet Manager', icon: 'truck', need: 'Evaluate vehicles, equipment, maintenance and asset records.', module: 'fleet' },
];
export const policies = [
  { slug: 'terms', title: 'Terms of Use & Subscription Agreement' },
  { slug: 'privacy', title: 'Privacy Policy' },
  { slug: 'cookies', title: 'Cookie Policy & Consent Preferences' },
  { slug: 'acceptable-use', title: 'Acceptable Use Policy' },
  { slug: 'accessibility', title: 'Accessibility Statement' },
  { slug: 'subscription', title: 'Subscription Terms' },
  { slug: 'hardware', title: 'Hardware Terms & Warranty' },
  { slug: 'service', title: 'Service Commitments' },
  { slug: 'data-processing', title: 'Data Processing Terms' },
  { slug: 'ai', title: 'AI Disclosures' },
  { slug: 'security', title: 'Security Contact & Vulnerability Disclosure' },
];
