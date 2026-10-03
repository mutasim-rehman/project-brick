# Site Killick website

## Run

- Install dependencies with `npm install`.
- Start development with `npm run dev` (Vite defaults to `http://localhost:5173`).
- Run `npm run build` to create the production bundle and prerendered pages in `dist`.
- Use `npm run preview` to serve the production build.
- `npm test` runs focused pricing and configuration checks. `npm run test:browser` is an optional Playwright browser check; Playwright and a supported browser must be installed separately.

## Pages and product preview

Routes include the homepage, Platform, How It Works, Pricing, Contact, About, a legal index, individual policy pages, workspace access and a not-found view. The build writes directly accessible HTML for known routes. Static hosting should serve directory `index.html` files and use `404.html` for unknown paths.

The homepage uses a custom Three.js construction sequence built for this redesign. It forms a full-width pinned canvas, with homepage sections passing over the open left side of the same background (the model remains above the content on phones), and native scrolling smoothly advances or reverses construction: a working excavator cuts the pit, reinforcement and foundations follow, then the crane mast and floor-by-floor structure rise; each elevated slab starts only after the columns below reach full height. The lift core and scaffold follow the same story-by-story schedule. Fifteen paired glazing cassettes ride upright on a delivery rack and are set in a shorter run of crane lifts before the roof and solar array are completed. Individual parts extend from fixed ends or pour edges rather than appearing as finished floors. Scaffolding clears after enclosure, the excavator drives off after earthworks, and the crane mast comes down from the top at handover. The three stage controls scroll to Groundwork, Structure and Handover; motion can be paused and reduced-motion preferences show the completed model. The scene is an architectural illustration, not a live jobsite, customer project or engineering model. The camera gradually reframes the rising structure; studio reflections give glass and metal more depth. The hoist cable stays attached to its carriage and hook when scrubbing in either direction, and unloaded vehicles park within the site. It caps rendering at 30 frames per second and is loaded only on the homepage. If WebGL is unavailable, the surrounding page content remains usable.

Platform and role pages explain six connected operational areas and provide interactive workflow examples. Each workflow is visibly marked as sample data and a proposed workflow. It does not connect to an account or store operational records. Pricing is an editable regional planning example, not an approved quote. Its values are not currency conversions; estimates exclude taxes and shipping. Preferences and saved budget choices remain local to the browser when the visitor enables optional storage.

Legal and policy content is draft material for review. The site makes no claim of a completed accessibility audit, security certification, insurance coverage or binding warranty.

## Enquiry and workspace settings

The contact route offers a form only when an enquiry destination is configured. Without one, it explains that enquiries are not yet open and offers links to the workflow preview and budget planner. There is no appointment booking, waitlist submission or email delivery in the unconfigured preview.

Copy `.env.example` to `.env` to configure public values:

- `VITE_CONTACT_EMAIL` enables an email draft. The visitor reviews and sends the message in their email application; the website does not send it.
- `VITE_API_BASE` is the origin or path prefix of an API implementing `POST /api/v1/inquiries/submit`. A successful JSON response must include `inquiryRef`. The server must validate and safely handle submissions and calculate any approved commercial quote.
- `VITE_APP_URL` is an HTTPS URL for a separately hosted workspace. It enables a sign-in link; authentication and the workspace are not implemented by this marketing site.

The build reads these values when it prerenders pages so the static Contact and workspace-access markup matches the client configuration. `VITE_` values are public and must never contain secrets. No analytics or advertising trackers are included.

Construction pacing uses measured sticky chapters with extra scroll distance for the structural and enclosure phases. Progress is limited to the 36-second construction rate even after a large scroll jump, and the finished model has an additional hold before the footer. Reduced-motion mode removes the extended chapter holds.
