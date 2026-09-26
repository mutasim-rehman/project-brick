# Site Killick website

## Run

- `npm install`
- `npm run dev -- --host 127.0.0.1`
- `npm run build` generates the production assets and individual pre-rendered HTML pages in `dist`.
- `npm run preview` serves the production build.
- `npm test` checks pricing, configuration validation, snapshots, timezone/DST conversion and calendar exports.
- `npm run test:browser` runs the Playwright integration suite. Install Playwright separately or expose it through `NODE_PATH`. Chrome is used by default; set `BROWSER_CHANNEL` to use another installed Playwright channel.

## Pages

The site includes the homepage, Platform, How It Works, Pricing, Contact, About, a legal index, seven individual policy pages and a workspace-access page. Unknown URLs show a not-found view. Static hosting should resolve directory URLs to their `index.html` and use `404.html` for unknown paths.

The existing Three.js construction assets are retained and loaded only on the homepage. A pinned opening sequence runs through all six construction stages as the visitor scrolls, finishing before the remaining homepage enters view. Scrolling backward reverses the construction. Skip Story goes directly to the remaining homepage; reduced motion and WebGL failure collapse the long sequence to a static hero. The scene pauses outside the viewport. The remaining homepage includes the owner-dependency narrative, three interactive handover chapters, four operating pillars, evidence-oriented content and conversion links. It does not yet implement the bespoke owner-at-home character animation described in the specification.

Platform includes all six module groups with the six-part feature schema. How It Works includes all nine roles, seven onboarding steps per role, daily comparisons and expandable text guides. Approved character artwork and tutorial video/caption assets have not been supplied; there are no fabricated videos or pilot statistics.

## Commercial preview

The six pricing tables and the 15% annual incentive are explicitly illustrative, not approved commercial rates. They are independently defined, not converted with foreign exchange rates. The calculator separates recurring charges, annual billing, hardware and onboarding; exports a draft snapshot; and passes the selected configuration to Contact. Shared links contain configuration only, never contact information.

Without an API connection, Contact prepares a downloadable request and a **tentative, unconfirmed** calendar reminder. No appointment is booked, email sent, CRM inquiry stored or price hold activated. Sample slots are labelled as preferences, not live availability. Contact details are kept in memory, not local storage.

The support widget uses deterministic answers grounded in the local specification until a live assistant endpoint is configured. Legal pages are explicitly marked drafts. No security certification, verified compliance, insurance coverage or binding warranty is claimed.

## API integration

Copy the variable names from `.env.example` into your environment. `VITE_API_BASE` is the public API gateway origin or prefix; `VITE_APP_URL` is the HTTPS workspace sign-in URL. Neither is a secret. Never place backend credentials in a `VITE_` variable.

The optional client adapter expects:

- `GET /api/v1/scheduling/availability?territory=...&timezone=...` returns `{ slots: [{ id, startUTC }] }` with future ISO UTC timestamps.
- `POST /api/v1/inquiries/submit` accepts qualification data, configuration, illustrative totals and intent; returns `{ inquiryRef }`. The server must validate all input, recalculate approved prices, persist immutable snapshots, enforce consent and rate limits, and apply approved hold terms. Client totals are not authoritative.
- `POST /api/v1/scheduling/book` accepts `{ inquiryRef, slotId, timezone }`; returns `{ confirmed: true, startUTC }` only after atomic reservation. The server handles calendar routing, double-booking protection and confirmation emails.
- Both writes include stable `Idempotency-Key` headers for retries during the current request. The backend must enforce idempotency.
- `POST /api/v1/assistant/chat` accepts `{ message }`; returns `{ answer }`. This adapter expects JSON, not a streaming response. Grounding, legal/pricing guardrails, authentication where needed and abuse protection belong on the server.

The approved pricing/content endpoints, streaming assistant, CRM, calendar infrastructure and transactional email services remain production integrations, not implemented backend services. Connecting an API does not turn the sample rate tables into approved pricing.

## Consent and accessibility

Only the consent decision is stored by default. Optional consent enables local pricing and reduced-motion preferences. Withdrawing it removes those keys. The site loads no analytics or advertising trackers. Google Fonts is an external font dependency.

All interactions include labels and focus states. The site supports reduced motion, a skip link, keyboard-accessible module/role selectors and modal cookie preferences. The implementation is not a claim of a completed WCAG audit.

## Verification

Browser checks cover all routes, desktop/mobile overflow, a nonblank animated WebGL canvas, module/role switching, pricing math, shared-link reload, qualification validation, configuration handoff, timezone conversion, calendar download and support responses. Screenshots are generated in the ignored `artifacts` directory. Production readiness still requires approved content, real integrations, performance and accessibility audits.
