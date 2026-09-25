# BRICK & AXIS — 3D Interactive Construction Engineering Platform

Interactive 3D construction engineering experience demonstrating the full building lifecycle from subterranean excavation to a commissioned architectural headquarters campus.

Built with **Three.js**, **GSAP**, **Canvas Confetti**, and **Vite**.

---

## Overview

BRICK & AXIS is a procedural, scroll-driven 3D architectural visualization web application. As the user scrolls through the page (or scrubs via the milestone timeline), the 3D construction site dynamically evolves across six distinct phases:

1. **Stage 01: Groundwork & Deep Excavation** (0% - 18%)
   - Subterranean earthworks, deep trenching, retaining shoring, active excavator, dump truck, and perimeter safety barriers.
2. **Stage 02: Raft Foundation & Shear Core** (18% - 38%)
   - Monolithic concrete foundation slab pour, reinforced elevator shear core walls, and slip-form tower casting.
3. **Stage 03: Structural Steel & Tower Crane** (38% - 58%)
   - Heavy Liebherr luffing tower crane erection, structural I-beam columns, girders, and open-web roof trusses.
4. **Stage 04: Industrial Warehouse & Logistics Racks** (58% - 76%)
   - Multi-tier high-bay pallet racking, roller conveyors, intermodal railway tracks, and freight rail gantry crane.
5. **Stage 05: Triple-Glazed Facade & Solar Roof** (76% - 90%)
   - Low-E curtain wall glass panels, architectural louvers, and rooftop bifacial photovoltaic solar arrays.
6. **Stage 06: Commissioned Headquarters Campus** (90% - 100%)
   - Full architectural commissioning, interior warm lighting, landscaped plaza, trees, and active intermodal operations with celebratory handover.

---

## Features

- **Procedural 3D Scene**: Custom geometry generation using Three.js with realistic materials, shadows, and environment lighting.
- **Scroll-Driven Timeline**: Smooth bidirectional animation interpolated through GSAP and custom easing curves synchronized with scroll depth.
- **Interactive Milestone Scrubber**: Bottom HUD bar allows one-click fast-forward navigation between any construction phase.
- **Synthesized Sound Effects**: Web Audio API sound generator for UI clicks, milestones, and phase completion fanfares.
- **Responsive Architecture**: Fluid layout scaling across desktop and mobile screen viewports.

---

## Technology Stack

| Layer | Technology |
| --- | --- |
| **Runtime & Bundler** | [Vite 8](https://vite.dev/) |
| **Language** | JavaScript (ES Modules) |
| **3D Graphics Engine** | [Three.js](https://threejs.org/) (r186) |
| **Animation / Interpolation** | [GSAP](https://gsap.com/) |
| **Audio** | Web Audio API (Synthesized SFX) |
| **Styling** | Modern CSS3 (CSS Variables, Flexbox, Grid) |
| **Particle Effects** | Canvas Confetti |

---

## Project Structure

```
project-brick/
├── .cursor/
│   └── environment.json       # Cloud Agent environment configuration
├── public/
│   ├── favicon.svg             # Brand favicon
│   └── icons.svg               # SVG sprite definitions
├── src/
│   ├── assets/                 # Static graphical assets
│   ├── audio/
│   │   └── SoundEffects.js     # Procedural Web Audio API sound synthesis
│   ├── scene/
│   │   ├── BuildingComponents.js   # 3D building geometry builders & materials
│   │   ├── ConstructionTimeline.js # Scroll interpolation & stage animation state
│   │   ├── ConstructionWorld.js    # Three.js renderer, camera, lighting & loop
│   │   └── HotspotsManager.js      # Interactive 3D point-of-interest markers
│   ├── ui/
│   │   ├── ContentData.js      # Technical engineering specs & phase metadata
│   │   └── UIManager.js        # Timeline scrubber, HUD, modals & user events
│   ├── main.js                 # Application bootstrap & lifecycle orchestrator
│   └── style.css               # Design system & responsive layout styles
├── index.html                  # HTML entry point with 3D canvas viewport
├── package.json                # Project dependencies and npm scripts
└── package-lock.json           # Locked dependency tree
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later (v22 recommended)
- **npm**: v9.0.0 or later

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/mutasim-rehman/project-brick.git
cd project-brick
npm ci
```

### Development Server

Start the local development server:

```bash
npm run dev
```

The application will be accessible at:
```
http://localhost:5173/
```

To expose the development server to your local network:
```bash
npm run dev -- --host
```

### Production Build

Create an optimized production bundle:

```bash
npm run build
```

The output will be placed in the `dist/` directory.

### Preview Production Build

Preview the production bundle locally:

```bash
npm run preview
```

---

## Cloud Agent Environment

This repository includes a configured Cloud Agent environment definition in `.cursor/environment.json`:
- **Install command**: `npm ci`
- **Persistent terminal**: `npm run dev -- --host` (running on port `5173`)
