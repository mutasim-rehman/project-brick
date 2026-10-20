# Homepage motion experiment

Branch: `codex/lusion-homepage-motion`. Based on `main`; intentionally unmerged.

## Preview

Run `npm run dev` and open the URL printed by Vite. The experiment is the `/` route. Other routes retain their existing implementations.

## Direction

Inspired by the pacing and coordinated scenes on lusion.co, with original construction imagery and a restrained pale-neutral, charcoal and blue palette:

- A blue drafting surface draws a floor plan, footings, three storeys, facade windows and roof details in fine architectural linework. The orthographic camera moves from an overhead plan to an angled building view. The build follows scroll position in both directions, with no automatic playback. At completion, internal linework fades away and a depth-occluding exterior shell reveals only the visible outside edges and windows. Mouse movement gently changes the view.
- A second scroll sequence brings scattered attendance, tool and work records into alignment, then reveals the responsible people.
- The completed building includes a roof access pavilion, pergola, terrace furniture, solar array, planters, balconies, side garage, driveway, parked vehicle, garden trees and shrubs, entrance path, pavement and marked road. The final scroll phase pulls back to frame the whole site.
- Editorial headings reveal as they enter the viewport; the existing interactive site plan remains available below the story.
- The editorial sections use a pale neutral canvas, near-black regular-weight headings, white/charcoal record cards and blue/cyan accents. Decorative curved SVG strokes draw and drift with scroll in the quieter statement sections. Masked heading lines enter from alternating directions, with staggered timing; reduced motion keeps them static and fully readable.
- The scene loads separately from the page. A CSS blueprint illustration remains available if graphics initialization fails.
- Pause controls stop pointer motion; the building continues to follow intentional scrolling. Reduced motion starts with the finished exterior, removes long pinned sequences and displays records immediately. Mobile displays the record sequence as readable stacked cards.

## Validation

`npm run build` includes matching prerendered homepage content.

`npm run test:cinematic` requires Playwright and Chrome, like the existing browser check. Set `SITE_URL` if Vite uses another port. It checks WebGL initialization, one main heading, the assembled scene, pause state, record handoff, site-plan zone selection, mobile navigation, overflow at 390/768/1440px, and reduced motion. Screenshots are written to the ignored `artifacts/lusion-motion/` directory.

The existing `npm test` suite has eight failing assertions involving older layout contracts and removed pricing/contact exports. Those test files and their imported implementation files are unchanged from `main`; the two construction tests pass. The existing `test:browser` also targets obsolete construction-stage selectors, so use the focused check for this branch's homepage.

This is a local visual experiment, with no deployment or merge. Performance on physical low-end mobile devices remains to be evaluated before production adoption.

## Shared theme across pages

The other routes use `editorialTheme.css` and `editorialTheme.js`: shared neutral palette, regular-weight typography, consistent header/footer/buttons, and masked word entrances on editorial headings. Marketing introductions include a scroll-driven cyan stroke. Legal/access pages remain quieter. Existing product tabs, review/reset controls, workflow stages, hardware scrolling, contact behavior and policy content retain their original controllers. Hardware and workflow renderers use neutral lighting and cool accent colors.

`npm run test:editorial` checks all 20 non-home routes at 1440px and 390px, the six product workflows and review/reset controls, four workflow stages, four hardware selectors, pricing accordion, mobile menu, and reduced motion. Visual captures are saved to `artifacts/editorial-theme/` (ignored by Git).
