---
name: ui-ux-pro-max
description: Define or review a product-level design system across multiple screens or platforms. Use when teams need consistent tokens, interaction patterns, accessibility priorities, or platform-aware UI rules; skip isolated visual tweaks.
---

# UI/UX Pro Max

Turn a product brief into a coherent, implementable UI system. Use evidence from the user's requirements and the existing project, then make design choices explicit enough to apply consistently across screens. This local skill contains workflow guidance only; it does not bundle the upstream project's searchable datasets, search program, or platform templates.

## Understand the product and platform

Extract the product type, audience, primary tasks, environment of use, visual direction, content constraints, and any accessibility requirements. Identify the implementation platform and stack from the repository before choosing platform-specific patterns. Do not assume a framework or native platform. If the stack is absent and would materially change the recommendation, ask a focused question.

Inspect existing design tokens and components. If a product-level system already exists, extend it. If the work belongs to an established product, preserve its functional model and recognizable conventions unless redesign is requested.

## Form a design system

For a new page or product, define a compact system before implementing details:

- **Structure:** navigation model, page hierarchy, and content pattern suited to the product.
- **Visual language:** a small set of style traits and an explanation of why they fit.
- **Tokens:** color roles, type scale, spacing rhythm, borders, and elevation.
- **Interaction:** control behavior, feedback, focus, loading, empty, error, and success states.
- **Responsive rules:** layout changes for the actual target widths and input modes.
- **Risks:** likely accessibility, legibility, density, or performance problems and how to check them.

Keep global decisions consistent. For multi-screen work, record durable product rules separately from screen-specific exceptions when that will prevent drift. Do not write design documents for a small isolated change unless they will be reused.

## Prioritize usability and access

Resolve accessibility and core task flow before decorative refinement. Check keyboard operation, visible focus, semantic labels, contrast, readable type, touch target spacing, zoom and text reflow, and reduced motion as applicable to the platform. Avoid hover-only information and color-only meaning. Forms need persistent labels and field-level guidance; errors should identify the affected input and a path to recovery. Interfaces should explain state changes with appropriate feedback.

Treat performance, navigation, animation, charts, and content density as product decisions. Reserve layout space for content that loads later, avoid unnecessary movement, make chart meanings available beyond color, and select motion that respects context and reduced-motion preferences.

## Apply and verify the system

Implement the useful interface using the detected stack and existing component conventions. Keep raw styling values centralized when the codebase supports tokens. Do not add libraries merely to match an aesthetic. Inspect representative screens at relevant viewport sizes and input modes. Fix issues in hierarchy, text wrapping, navigation, focus, feedback, contrast, and layout before reporting completion.

When the user requests a review rather than implementation, return findings ordered by user impact, tied to observable screens or states. Do not invent database-backed recommendations or imply that a catalog search was run.

## Upstream catalog

The upstream [UI UX Pro Max repository](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) contains a searchable design catalog and implementation resources under an MIT license. This workspace adaptation does not include those data or tools. If the user specifically requests catalog-backed results, use an installed upstream copy if one is available; otherwise state that the catalog is unavailable and give clearly labeled general guidance. Do not present general reasoning as a search result.

## Provenance

This workflow is informed by the public UI UX Pro Max skill's product-aware design-system generation, stack detection, focused domain searches, and usability checks. It is a concise adaptation, not a copy of the repository's data or implementation.

