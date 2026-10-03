# Site Killick

Site Killick is a construction operations product preview for coordinating people, safety, equipment, fleet and owner reporting. Its homepage uses one full-width Three.js canvas with story sections scrolling over the shared background, with scroll-driven progress through excavation and reinforcement, foundations, floor-by-floor structure, crane-lifted glazing cassettes, roof and solar installation, scaffold removal and equipment clearance. Stage controls scroll between Groundwork, Structure and Handover. On phones, the model remains above the content with the same continuous background. The scene illustrates the product story; it does not represent a real customer project or measured results.

## Run locally

```sh
npm install
npm run dev
```

Vite serves the site at `http://localhost:5173`. `npm run build` creates the production bundle and directly accessible prerendered pages in `dist`; `npm run preview` serves that build. `npm test` runs the focused pricing and configuration checks.

See [SITE_IMPLEMENTATION.md](SITE_IMPLEMENTATION.md) for the routes, preview data, environment settings and integration boundaries.

## Optional public configuration

Copy `.env.example` to `.env` and set only the public values needed by your deployment. `VITE_CONTACT_EMAIL` enables an email draft for the visitor to review and send. `VITE_API_BASE` connects the enquiry form to an API that implements `POST /api/v1/inquiries/submit`. `VITE_APP_URL` adds a link to a separately hosted workspace. Never put credentials or private keys in a `VITE_` variable.

Construction pacing uses measured sticky chapters with extra scroll distance for the structural and enclosure phases. Progress is limited to the 36-second construction rate even after a large scroll jump, and the finished model has an additional hold before the footer. Reduced-motion mode removes the extended chapter holds.
