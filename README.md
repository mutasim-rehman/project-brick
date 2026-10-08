# Site Killick

Site Killick is a construction operations product preview for coordinating people, safety, equipment, fleet and owner reporting. Its homepage tells “The Owner Who Can Never Leave” story and places a compact Three.js construction model in the story visual, where the owner illustration was previously shown. The architectural sequence completes in 12 seconds at reduced scale. It is illustrative, not a live customer project or measured result. The animation supports pause and reduced motion, and the story can be skipped.

## Run locally

```sh
npm install
npm run dev
```

Vite serves the site at `http://localhost:5173`. `npm run build` creates the production bundle and directly accessible prerendered pages in `dist`; `npm run preview` serves that build. `npm test` runs the focused pricing and configuration checks.

See [SITE_IMPLEMENTATION.md](SITE_IMPLEMENTATION.md) for the routes, preview data, environment settings and integration boundaries.

## Optional public configuration

Copy `.env.example` to `.env` and set only the public values needed by your deployment. `VITE_CONTACT_EMAIL` enables an email draft for the visitor to review and send. `VITE_API_BASE` connects the enquiry form to an API that implements `POST /api/v1/inquiries/submit`. `VITE_APP_URL` adds a link to a separately hosted workspace. Never put credentials or private keys in a `VITE_` variable.

The owner story advances with ordinary scrolling and remains skippable. The construction model is an architectural illustration; it does not represent a customer site or replace final custom 3D owner-story production.
