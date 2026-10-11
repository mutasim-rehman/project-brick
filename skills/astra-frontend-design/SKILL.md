---
name: astra-frontend-design
description: Translate a product brief, screenshot, or existing interface into a responsive web implementation and visual QA. Use for reference matching, redesigns, and completion-focused UI work; skip backend-only changes.
metadata:
  short-description: Astra-style frontend design and visual QA
---

# Astra Frontend Design

Deliver a coherent frontend that fits the product and codebase, has a clear visual direction, works across relevant viewports, and has been inspected in a browser when implementation is requested. Treat this skill as decision guidance; the user's brief, established product behavior, and repository conventions take precedence.

## Choose the right path

- **New site or page:** establish a specific art direction and content hierarchy before styling.
- **Dashboard or product surface:** prioritize scanning, task flow, density, and predictable controls.
- **Redesign:** preserve working product behavior and useful conventions while improving the weakest visible areas.
- **Reference reconstruction:** infer reusable layout and visual rules from the supplied reference; do not chase isolated pixels at the expense of responsiveness.
- **Motion-heavy work:** use motion to show state or guide attention, and support reduced motion.
- **Review-only request:** critique or audit without implementing unless asked.

## Ground the design

Inspect the target route, nearby components, styles, assets, dependencies, and project conventions before changing the interface. Identify the audience, primary task, important content, functional states, brand constraints, accessibility needs, and responsive conditions.

Choose a concise visual premise that suits the subject. Make hierarchy, content order, and responsive behavior coherent before adding decorative detail. Reuse project tokens, primitives, and icon conventions unless the request calls for a new direction. Do not invent testimonials, customers, product capabilities, or precise claims. Mark sample data when needed.

Proceed with reasonable assumptions. Ask one focused question only if ambiguity would change the product, brand, or interaction model substantially.

## Implement the real experience

Build the requested page, tool, or app surface rather than wrapping it in an unrelated marketing shell. Make primary controls and flows work, with appropriate loading, empty, error, success, disabled, and overflow states. Use relevant project assets; introduce dependencies or create assets only when they materially help and fit the existing stack.

Keep semantic structure, keyboard access, visible focus, readable contrast, reduced-motion handling, text reflow, and small-screen behavior in the implementation. Avoid turning any aesthetic preference into a universal ban: repeated cards, gradients, pill controls, or familiar layouts are fine when they serve this product.

## Inspect the rendered result

For substantial implementation, run the smallest relevant build or behavior checks, launch the app when practical, and inspect the actual UI at representative desktop and narrow mobile widths. Check hierarchy, framing, content fit, alignment, contrast, focus and interaction feedback, broken assets, and console errors. Fix material visual or functional defects and repeat the affected inspection. Use existing browser tooling; do not add a large test stack just to capture screenshots.

In the handoff, briefly describe what is usable, the visual direction, and the verification performed. Do not claim a visual check that did not occur.

## Provenance

This is an original, concise synthesis informed by the workflow described in [Enixes/astra-frontend-design](https://github.com/Enixes/astra-frontend-design). No source files or wording from that repository are bundled here. Its published root did not expose a license file during preparation.

