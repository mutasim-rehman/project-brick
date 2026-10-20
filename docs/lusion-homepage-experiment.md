# Homepage motion experiment

Branch: `codex/lusion-homepage-motion`. Based on `main`; intentionally unmerged.

## Preview

Run `npm run dev` and open the URL printed by Vite. The experiment is the `/` route. Other routes retain their existing implementations.

## Direction

Inspired by the pacing and coordinated scenes on lusion.co, with original construction imagery and Site Killick's navy, warm paper and citron palette:

- A blue drafting surface draws a floor plan, footings, three storeys, facade windows and roof details in fine architectural linework. The orthographic camera moves from an overhead plan to an angled building view. The build runs automatically on arrival; scrolling can advance it. Mouse movement gently changes the view.
- A second scroll sequence brings scattered attendance, tool and work records into alignment, then reveals the responsible people.
- Editorial headings reveal as they enter the viewport; the existing interactive site plan remains available below the story.
- The scene loads separately from the page. A CSS blueprint illustration remains available if graphics initialization fails.
- Pause controls stop the automatic drafting sequence and pointer motion. Reduced motion starts with the complete structure, removes long pinned sequences and displays records immediately. Mobile displays the record sequence as readable stacked cards.

## Validation

`npm run build` includes matching prerendered homepage content.

`npm run test:cinematic` requires Playwright and Chrome, like the existing browser check. Set `SITE_URL` if Vite uses another port. It checks WebGL initialization, one main heading, the assembled scene, pause state, record handoff, site-plan zone selection, mobile navigation, overflow at 390/768/1440px, and reduced motion. Screenshots are written to the ignored `artifacts/lusion-motion/` directory.

The existing `npm test` suite has eight failing assertions involving older layout contracts and removed pricing/contact exports. Those test files and their imported implementation files are unchanged from `main`; the two construction tests pass. The existing `test:browser` also targets obsolete construction-stage selectors, so use the focused check for this branch's homepage.

This is a local visual experiment, with no deployment or merge. Performance on physical low-end mobile devices remains to be evaluated before production adoption.
