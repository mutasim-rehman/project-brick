# SITE KILLICK — Complete Website Project Specification & Architecture Blueprint

**Document Version:** 1.0  
**Date:** September 2026  
**Document Type:** Technical & Product Specification for Development  
**Audience:** Frontend Engineers, 3D/Animation Artists, SaaS Backend Engineers, UI/UX Designers, QA, and Product Management  

---

## Table of Contents
1. [Executive Summary & Core Principles](#1-executive-summary--core-principles)
2. [Target Audiences & User Journeys](#2-target-audiences--user-journeys)
3. [Sitemap & Page Content Specifications](#3-sitemap--page-content-specifications)
   - 3.1 Homepage (3D Pain Story & Platform Bridge)
   - 3.2 Platform & Features (6 Operating Modules)
   - 3.3 How It Works (9 Role-Based Learning Hubs)
   - 3.4 Pricing & Dynamic Configurator
   - 3.5 Contact, Qualification & Native Scheduling
   - 3.6 About & Trust
   - 3.7 Legal & Policy Hub
4. [3D Animation Direction & 5 Pain Story Prototypes](#4-3d-animation-direction--5-pain-story-prototypes)
5. [Interactive Systems & Functional Modules](#5-interactive-systems--functional-modules)
   - 5.1 Dynamic Multi-Currency Pricing Engine & 14-Day Price Hold
   - 5.2 Native Timezone-Aware Scheduling Engine
   - 5.3 Grounded Persistent AI Support Assistant (Chatbot)
6. [SaaS Super Admin & API Integration Contracts](#6-saas-super-admin--api-integration-contracts)
7. [Recommended Tech Stack & Architecture](#7-recommended-tech-stack--architecture)
8. [Quality, Compliance, Performance & SEO Standards](#8-quality-compliance-performance--seo-standards)
9. [Development Roadmap & Implementation Timeline (Cursor-Accelerated)](#9-development-roadmap--implementation-timeline-cursor-accelerated)
10. [Open Inputs & Pre-Launch Acceptance Checklist](#10-open-inputs--pre-launch-acceptance-checklist)

---

## 1. Executive Summary & Core Principles

### 1.1 Brand Positioning
* **Brand Name:** **Site Killick** *(Origin: Atlantic Canadian traditional stone-and-timber anchor).*
* **Category:** Construction Operations and Asset Intelligence Platform.
* **Core Value Proposition:** Removing **owner dependency**, operational friction, and chronic uncertainty. Site Killick acts as a calm, automated operational layer that organizes site records, tracks assets, pre-calculates payroll, and routes issues directly to responsible roles, leaving only critical owner-level decisions to the business owner.
* **Key Messaging:** *"Leave the site at the site"* & *"Your business should not follow you to bed."*

### 1.2 Core Experience Principles
1. **Credibility before Spectacle:** 3D motion and animations must directly explain real operational problems and product workflows. Decorative, game-like, or agency-fluff motion is strictly excluded.
2. **Pain before Features:** The homepage hooks the visitor through the emotional and operational burden on the owner before presenting feature lists.
3. **Evidence before Claims:** Use specific workflows, visible records, hardware proof, and verified pilot results. Never invent performance statistics.
4. **Control without Interruption:** Highlight what is automatically handled vs. what genuinely requires human attention.
5. **Transparent Commercial Information:** Dynamic, versioned, multi-currency pricing calculation with immutable inquiry snapshot storage.
6. **Global by Design:** Multi-currency, IANA time zones, UTC timestamp preservation, and multi-locale readiness built into the core architecture.

---

## 2. Target Audiences & User Journeys

| Target Audience | Core Need from Website | Primary Navigation Target |
| :--- | :--- | :--- |
| **Construction Owner / Founder** | Evaluate if company can run without constant personal intervention and 24/7 calls. | Homepage & Pricing |
| **Project Manager** | Assess progress tracking, site logs, trade coordination, and automated daily reporting. | Platform & How It Works |
| **Safety Administrator** | Evaluate toolbox talks, emergency headcount, certification verification, and incident records. | Platform & Role Guides |
| **Payroll & Office Staff** | Understand NFC/GPS verified hours, overtime rules, and exception-only review workflows. | Platform & Role Guides |
| **Foreman / Supervisor / Lead Hand** | Understand low-friction daily field tasks with minimal screen taps. | How It Works |
| **Worker / Labourer** | Simple clock-in, shift communication, assigned equipment, and accurate hour logs. | How It Works |
| **Fleet / Equipment Manager** | Real-time vehicle telematics, tool tracking (BLE/NFC), geofences, and maintenance logs. | Platform |
| **Procurement / Buyer** | Multi-currency pricing transparency, insurance terms, SLA, and security audits. | Pricing & About / Trust |

---

## 3. Sitemap & Page Content Specifications

```
Site Killick Public Architecture
├── Global Header
│   ├── Navigation: Platform | How It Works | Pricing | About | Contact
│   └── Actions: [Sign In (App Link)] | [Book a Demo (CTA)]
├── 1. Homepage (3D Pain Story + Platform Overview)
├── 2. Platform & Features (6 In-depth Module Hubs)
├── 3. How It Works (9 Role Workflows + Video Library)
├── 4. Pricing (Multi-Currency Configurator & Price Hold)
├── 5. Contact & Booking (Qualification Questionnaire + Native Calendar)
├── 6. About & Trust (Company Story, Security, AI Ethics, Insurance)
├── 7. Legal Policies (Terms, Privacy, Cookies, Acceptable Use, WCAG, Hardware)
└── Global Persistent Support Assistant (Grounded AI Chatbot)
```

---

### 3.1 Homepage
* **Purpose:** Establish operational empathy, demonstrate the transformation from chaos to calm, introduce the 4 core pillars, and guide visitors to demo booking or pricing.
* **Content Flow:**
  1. **Hero Section (3D Pain Story):** Cinematic 3D animation portraying owner operational burden, featuring *Skip Story* and *Reduced Motion* controls.
  2. **Problem Statement Bridge:** Concise, impactful explanation of owner dependency and the bottleneck effect in growing construction businesses.
  3. **Site Killick Response:** Interactive before-and-after visual showing chaos routed into structured automated workflows.
  4. **4 Platform Pillars:**
     - *People & Work:* Workforce verification, NFC attendance, task assignments.
     - *Safety & Records:* Incident evidence, automated headcount, compliance records.
     - *Tools & Assets:* BLE/NFC Tool Tags, proximity radar, chain of custody.
     - *Vehicles & Equipment:* CAN/J1939 telematics, after-hours geofencing, maintenance logs.
  5. **Credibility & Pilot Results:** Real pilot case studies, hardware integrations, enterprise security certifications.
  6. **Dual Conversion CTAs:** Primary: "See How It Works" / Secondary: "Configure Your Pricing" or "Book a Demo".

---

### 3.2 Platform & Features Page
Organized into **6 Core Product Groups**. Each feature follows a strict 6-part schema:  
`[Operating Problem] → [Site Killick Capability] → [Required Inputs] → [Visible Output] → [Facilitated Decision] → [User Roles]`.

1. **People & Workforce:**
   - NFC & biometric site clock-in; automated travel time tracking; skill and license expiration alerts; digital employee profiles.
2. **Work & Communication:**
   - Real-time jobsite task feeds; photo progress verification; delivery logging; site broadcast announcements with mandatory read receipts.
3. **Safety & Compliance:**
   - Digital toolbox talks with signature logs; QR emergency evacuation headcount; OSHA/OH&S compliant incident reporting workflows.
4. **Tools & Assets:**
   - BLE & NFC Tool Tags; Bluetooth beacon signal tracking; asset custody handoffs; audible proximity buzzer for lost equipment; missing tool incident logs.
5. **Vehicles & Heavy Equipment:**
   - Live GPS tracking; J1939/CAN-bus engine hour monitoring; after-hours geofence breach alerts; fuel consumption and maintenance scheduling.
6. **Intelligence & Administration:**
   - Automated end-of-day summary reports; payroll exception generator (surfacing only disputed hours); intelligent document text extraction.

---

### 3.3 How It Works Page
Features **9 Interactive Role-Based Learning Hubs**:
* **Roles:** 1. Business Owner, 2. Project Manager, 3. Safety Administrator, 4. Payroll Administrator, 5. Foreman, 6. Supervisor, 7. Lead Hand, 8. Worker/Labourer, 9. Fleet Manager.
* **Each Role Tab Includes:**
  - Role-specific character illustration (restrained 3D entrance animation).
  - 7-step onboarding sequence.
  - Daily routine comparison (Traditional vs. Site Killick workflow).
  - Dedicated video tutorial library (with chapters, playback speed controls, and interactive text transcripts).

---

### 3.4 Pricing Page
* **Purpose:** Provide complete commercial transparency and capture qualified leads through saved configurations and 14-day price holds.
* **Interactive Elements:**
  - **Currency Switcher:** Approved lists for CAD, USD, GBP, EUR, AUD, NZD.
  - **Billing Cycle:** Monthly vs. Annual toggle (showing annual incentive discount).
  - **Employee Tier Slider:** Interactive slider with direct numeric input (e.g., 5 to 500+ workers).
  - **Module Add-ons:** Toggle switches for People, Safety, Tools, Fleet, and Intelligence modules.
  - **Hardware Calculator:** Unit selectors for BLE Tool Tags, NFC Site Badges, Guard Tags, and Vehicle Gateways.
  - **Live Breakdown Card:** Real-time calculation separating recurring SaaS subscription from one-time hardware and onboarding setup costs.
  - **CTA Actions:** *Request This Price (14-Day Hold)*, *Save Resumable Link*, or *Book a Demo with this Configuration*.

---

### 3.5 Contact, Qualification & Booking Page
* **Two-Step Dynamic Engagement:**
  1. **Qualification Form:**
     - Company Name, Website, Operating Territory, Industry Sub-sector.
     - Fleet Size, Tool Count, and Total Field Employees.
     - Primary Operational Pain Point (Payroll discrepancies, Tool loss, Safety compliance, Owner overload).
     - Target Pilot Timeline.
  2. **Native Scheduling Calendar:**
     - Automatic visitor IANA timezone detection with manual selector.
     - Real-time routing to matching regional sales engineers.
     - Prevents double-booking and dispatches automated `.ics` calendar files and email confirmations.

---

### 3.6 About & Trust Page
* **Brand Story:** Atlantic Canadian roots, nautical origin of the killick anchor, and the mission to restore balance to construction founders.
* **Security & Infrastructure:** Encryption in transit and at rest, SOC2 compliance roadmaps, data sovereignty.
* **Responsible AI & Human-in-the-Loop:** Explicit commitment that AI generates recommendations and draft reports, but human supervisors retain final approval authority.
* **Insurance & Warranty:** Underwriter verification pathways, equipment warranty terms, and hardware replacement policies.

---

### 3.7 Legal & Policy Hub
Dedicated, search-indexed pages:
* Terms of Use & Subscription Agreement
* Privacy Policy (GDPR / CCPA / PIPEDA compliant)
* Cookie Policy & Consent Preferences
* Acceptable Use Policy
* Accessibility Statement (WCAG 2.2 AA target)
* Hardware Warranty & Replacement Policy
* Vulnerability Disclosure & Security Contact

---

## 4. 3D Animation Direction & 5 Pain Story Prototypes

The homepage hero utilizes cinematic 3D character animation. Visual guidelines specify warm, natural lighting for personal life scenes shifting to cool, cluttered, high-contrast tones when work interruptions occur.

### 5 Story Prototypes (20–30s Animatics):
1. **The Owner Who Can Never Leave** *(Primary Homepage Concept)*
   - *Narrative:* The jobsite follows the owner into his pickup truck and home dinner table—subcontractors, missing tools, and paper invoices clutter his family life. Site Killick redistributes each item to responsible roles, restoring calm to his home.
   - *Closing Tagline:* *"Leave the site at the site."*
2. **The 2:13 AM Thought Spiral**
   - *Narrative:* The owner awakens in the middle of the night worrying about unsecured excavators, expired operator licenses, and missing gear. His bedroom visually morphs into a noisy site until a calm dashboard confirms all assets are secured.
   - *Closing Tagline:* *"Your business should not follow you to bed."*
3. **The Sunday Payroll Ritual**
   - *Narrative:* A quick "20-minute Sunday payroll check" spirals into hours of deciphering crumpled paper timesheets and text messages. Site Killick prepares pre-verified hours and surfaces only discrepancies.
   - *Closing Tagline:* *"Review what is wrong instead of rebuilding what is right."*
4. **The Human Operating System**
   - *Narrative:* Every worker, vehicle, and approval converges solely on the owner as a critical bottleneck. Site Killick reconnects operations across supervisors and team leads.
   - *Closing Tagline:* *"Your company needs a system that can operate without your constant attention."*
5. **The Good Day That Still Feels Bad**
   - *Narrative:* Nothing went wrong on site, but the owner spends his evening compulsively calling superintendents due to lack of real-time visibility.
   - *Closing Tagline:* *"You do not need more notifications. You need fewer reasons to check."*

---

## 5. Interactive Systems & Functional Modules

### 5.1 Pricing Engine & Immutable Snapshot System
* **Currency Isolation:** Each supported currency utilizes explicit regional base tables (no volatile live forex conversions).
* **14-Day Price Hold Pipeline:**
  - Upon submitting a configuration, the backend generates an immutable JSON snapshot:
    ```json
    {
      "inquiryRef": "SK-2026-8941",
      "timestampUTC": "2026-09-26T15:00:00Z",
      "currency": "USD",
      "priceListVersion": "2026.3",
      "employeeCount": 45,
      "modules": ["people", "safety", "tools", "fleet"],
      "hardware": { "toolTags": 100, "gateways": 8 },
      "recurringSubtotal": 1450.00,
      "oneTimeSubtotal": 2200.00,
      "expiresAt": "2026-10-10T15:00:00Z"
    }
    ```

### 5.2 Native Timezone-Aware Scheduling Engine
* Direct calendar booking without third-party iframe embeds.
* Reads regional sales representative availability via API.
* Converts time slots dynamically to visitor's detected timezone using IANA naming conventions (`America/Toronto`, `Europe/London`, etc.).
* Passes active pricing snapshot metadata into the created calendar appointment.

### 5.3 Grounded Persistent AI Support Assistant (Chatbot)
* **UI Specs:** Subtle floating badge in bottom-right corner; closed by default; zero audio autoplay.
* **Safety & Guardrails:**
  - Identifies itself as an automated AI system.
  - Queries an approved vector knowledge base of product specs, pricing documentation, and help articles.
  - Strictly forbidden from inventing custom discounts, guessing unreleased features, or making binding legal promises.
  - Seamlessly offers human escalation and demo scheduling handoffs.

---

## 6. SaaS Super Admin & API Integration Contracts

The website connects to the Site Killick Super Admin backend via secure REST/GraphQL endpoints:

```
┌────────────────────────────────────────────────────────┐
│             PUBLIC WEBSITE FRONTEND                    │
│  - Interactive Pages & 3D WebGL Views                  │
│  - Dynamic Pricing & Resumable Saved State             │
│  - Qualification Form & Native Booking UI              │
│  - Persistent AI Support Chat Widget                   │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / JSON / Webhooks
                           ▼
┌────────────────────────────────────────────────────────┐
│             SUPER ADMIN / SAAS BACKEND                 │
│  ├── Content API (Features, Roles, Video Transcripts)  │
│  ├── Pricing Matrices (Currencies, Tiers, Discounts)   │
│  ├── Inquiries CRM (New → Qualified → Price Hold → Won)│
│  ├── Scheduling Engine (Staff Routing, TZ Rosters)     │
│  └── Audit & Compliance Logging                        │
└────────────────────────────────────────────────────────┘
```

### Key API Endpoints Required:
* `GET /api/v1/content/features` — Fetches active product groups, feature descriptions, and launch statuses.
* `GET /api/v1/content/roles` — Fetches role-based onboarding steps, videos, and transcripts.
* `POST /api/v1/pricing/calculate` — Server-side calculation verification.
* `POST /api/v1/inquiries/submit` — Captures qualified lead with immutable configuration snapshot.
* `GET /api/v1/scheduling/availability` — Fetches available slots filtered by region, language, and service.
* `POST /api/v1/scheduling/book` — Confirms appointment, locks slot, and issues `.ics` calendar triggers.
* `POST /api/v1/assistant/chat` — Secure streaming proxy to LLM knowledge base.

---

## 7. Recommended Tech Stack & Architecture

| Architectural Layer | Recommended Technology | Purpose & Scope Justification |
| :--- | :--- | :--- |
| **Web Framework** | **Next.js (App Router) / Vite + React** | Server-Side Rendering (SSR) for SEO, instant sub-page navigation, and code-splitting. |
| **Language** | **TypeScript 5.x** | End-to-end type safety across pricing models, qualification schemas, and API contracts. |
| **Styling & UI System** | **Tailwind CSS + Radix UI / shadcn/ui** | Rapid accessible component styling, guaranteed WCAG 2.2 AA keyboard/focus compliance. |
| **State Management** | **Zustand + React Hook Form + Zod** | Handles pricing calculator reactive state, multi-step form validation, and JSON snapshotting. |
| **3D Rendering Engine** | **Three.js / WebGL** | Renders 3D character scenes, hardware asset models, and site environment transformations. |
| **Animation Controller** | **GSAP (GreenSock) + ScrollTrigger** | Smooth timeline sequencing, camera coordinate tweening, and `prefers-reduced-motion` fallbacks. |
| **Asset Formats** | **glTF / Draco / WebP / AVIF** | High compression for 3D meshes and images to ensure zero LCP blocking. |
| **Backend / API Bridge** | **Node.js Edge / Serverless Functions** | Secure API gateway, server-side math validation, rate limiting, and webhook dispatching. |
| **Scheduling Engine** | **Custom IANA Timezone Engine** | Native appointment handling, territory matching, and `.ics` generation without external iframes. |
| **AI Assistant (Chatbot)** | **Vercel AI SDK + OpenAI / Claude API** | Streaming conversational interface grounded in approved documentation with human handoff. |
| **Transactional Email** | **Resend / SendGrid** | Instant delivery of 14-day price hold reference codes and calendar invitations. |
| **Hosting & Edge CDN** | **Vercel / Cloudflare Edge** | Global edge caching, sub-100ms TTFB, automatic SSL, and DDoS mitigation. |
| **Analytics & Privacy** | **PostHog / Plausible Analytics** | Cookie-less/consent-gated event tracking for story milestone completions and configurator drop-offs. |

---

## 8. Quality, Compliance, Performance & SEO Standards

### 8.1 Accessibility (WCAG 2.2 AA)
* Complete keyboard navigability with visible focus rings across all interactive calculators and calendar selectors.
* Text color contrast ratio $\ge 4.5:1$ for normal text and $\ge 3:1$ for large headings.
* Video player mandatory closed captions (`.vtt`) and expandable full-text transcripts.
* Skip Animation button and full compliance with `prefers-reduced-motion`.
* Full responsiveness up to 200% browser zoom without layout breakage.

### 8.2 Core Web Vitals Performance Budgets
* **Largest Contentful Paint (LCP):** $\le 2.5\text{s}$ (75th percentile on mobile).
* **Interaction to Next Paint (INP):** $\le 200\text{ms}$.
* **Cumulative Layout Shift (CLS):** $\le 0.1$.
* **3D Loading Strategy:** Pre-loads high-res poster image first; 3D canvas hydrates in the background without blocking page interaction.

### 8.3 Security & Privacy
* Zero hardcoded API keys in client bundles.
* Form spam protection via server-side validation and rate limiting.
* Strict consent banners before attaching tracking cookies or personal data.
* Role-based access control (RBAC) across all Super Admin endpoints.

---

## 9. Development Roadmap & Implementation Timeline (Cursor-Accelerated)

Utilizing Cursor's AI-assisted workflows (generating typed schemas, Three.js shaders, Tailwind components, and API routes), the development timeline is structured across **two realistic tracks**:

```
                       CURSOR-ACCELERATED TIMELINE
┌────────────────────────────────────────────────────────────────────────┐
│ TRACK A: Interactive Frontend MVP (10–15 Working Days)                │
│  [Days 1-2: Setup/Design] → [Days 3-5: 3D Hero] → [Days 6-7: Pages]   │
│  → [Days 8-10: Pricing Engine] → [Days 11-12: Calendar] → [Polish]     │
├────────────────────────────────────────────────────────────────────────┤
│ TRACK B: Full Production & Live Backend (25–35 Working Days)          │
│  Includes custom 3D character modeling, Live Super Admin DB sync,      │
│  Email delivery, Security audit & WCAG 2.2 AA certification.           │
└────────────────────────────────────────────────────────────────────────┘
```

### Track A: Interactive Frontend MVP (10–15 Working Days)
* **Days 1–2:** Project scaffolding (Next.js/Vite + Tailwind + Radix), responsive header/footer, typography tokens, and sitemap routing.
* **Days 3–5:** Three.js / WebGL canvas implementation, GSAP story timeline, camera controls, Skip Story toggle, and responsive mobile adaptations.
* **Days 6–7:** Platform feature matrix (6 groups) and How It Works role-based navigation tabs with video modal player.
* **Days 8–10:** Reactive multi-currency pricing calculator, seat tier slider, hardware counter, and 14-day price hold snapshot generator.
* **Days 11–12:** Qualification form with Zod validation, IANA timezone calendar engine, and appointment slot booking.
* **Days 13–14:** Grounded AI support chatbot widget (streaming UI), About/Trust page, and Legal policy pages.
* **Days 15:** Mobile optimization, Lighthouse/Core Web Vitals tuning, and browser cross-testing.

---

## 10. Open Inputs & Pre-Launch Acceptance Checklist

### 10.1 Inputs Required from Product & Commercial Teams:
- [ ] Final launch status of all platform features (*Current, Pilot, Planned*).
- [ ] Approved regional pricing matrices (CAD, USD, GBP, EUR, AUD, NZD) and hardware unit prices.
- [ ] Official 14-day price hold legal terms and conditions.
- [ ] Qualification questions and scoring criteria.
- [ ] Sales engineering roster with timezones, languages, and regional coverage.
- [ ] High-resolution brand assets, logo vectors, and production UI screenshots.
- [ ] Approved video scripts, caption files, and legal policy drafts.

### 10.2 Final Pre-Launch Checklist:
- [ ] **Homepage:** 3D story is intuitive, skippable, and functional under reduced-motion mode.
- [ ] **Pricing:** Calculation matches backend verification across all 6 currencies.
- [ ] **Inquiries:** Submissions successfully record immutable snapshots in the Super Admin CRM pipeline.
- [ ] **Scheduling:** Timezone conversion tested across daylight-saving transitions.
- [ ] **AI Assistant:** Tested against jailbreak attempts and confirmed to stay strictly within approved knowledge base.
- [ ] **Compliance:** WCAG 2.2 AA accessibility audit completed with zero launch-blocking errors.
- [ ] **Performance:** Mobile Core Web Vitals score passes all thresholds (LCP $\le 2.5\text{s}$, CLS $\le 0.1$).

---
*End of Specification Document.*
