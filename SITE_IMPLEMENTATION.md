# Site Killick website

## Run

- Install dependencies with `npm install`.
- Start development with `npm run dev` (Vite defaults to `http://localhost:5173`).
- Run `npm run build` to create the production bundle and prerendered pages in `dist`.
- Use `npm run preview` to serve the production build.
- `npm test` runs focused pricing and configuration checks. `npm run test:browser` is an optional Playwright browser check; Playwright and a supported browser must be installed separately.

## Pages and product preview

Routes include the homepage, Platform, How It Works, Pricing, Contact, About, a legal index, individual policy pages, workspace access when an application URL is configured, and a not-found view. The build writes directly accessible HTML for known routes. Static hosting should serve directory `index.html` files and use `404.html` for unknown paths.

The homepage leads with “The Owner Who Can Never Leave.” The story visual shows a compact Three.js construction model in place of the previous owner illustration. The architectural sequence completes in 12 seconds and is framed at reduced scale. Native scrolling advances the story copy; visitors can skip the story or pause the construction animation, and reduced-motion preferences show a still completed model. This architectural illustration is not a live jobsite or customer project. Final custom 3D owner-story production remains a separate deliverable. The page continues into the existing interactive workflow previews, which are visibly marked as sample data and proposed workflows.

Platform and role pages explain six connected operational areas and provide interactive workflow examples. Each workflow is visibly marked as sample data and a proposed workflow. It does not connect to an account or store operational records. The Pricing page lists the planned configurator inputs but does not show estimates until approved regional price lists and price-hold terms are available. No sample prices or discounts are presented.

Legal and policy content is draft material for review. The site makes no claim of a completed accessibility audit, security certification, insurance coverage or binding warranty.

## Enquiry and workspace settings

The contact route offers a form only when an enquiry destination is configured. Without one, it explains that enquiries are not yet open and links to the workflow preview and pricing information. There is no appointment booking, waitlist submission or email delivery in the unconfigured preview.

Copy `.env.example` to `.env` to configure public values:

- `VITE_CONTACT_EMAIL` enables an email draft. The visitor reviews and sends the message in their email application; the website does not send it.
- `VITE_API_BASE` is the origin or path prefix of an API implementing `POST /api/v1/inquiries/submit`. A successful JSON response must include `inquiryRef`. The server must validate and safely handle submissions and calculate any approved commercial quote.
- `VITE_APP_URL` is an HTTPS URL for a separately hosted workspace. It enables a sign-in link; authentication and the workspace are not implemented by this marketing site.

The build reads these values when it prerenders pages so the static Contact and workspace-access markup matches the client configuration. `VITE_` values are public and must never contain secrets. No analytics or advertising trackers are included.

The current owner story advances with ordinary scrolling. The reduced-scale Three.js construction illustration runs its sequence in 12 seconds, can be paused, and has a reduced-motion still state. Visitors can skip the story.
