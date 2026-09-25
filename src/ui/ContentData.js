// Construction Project Milestones, Technical Specs & Hotspots Data

export const COMPANY_INFO = {
  name: "BRICK & AXIS",
  shortName: "BRICK",
  badge: "Engineering & Infrastructure",
  tagline: "Industrial Architecture & Construction",
  phone: "+1 (800) 458-2940",
  location: "Metro Industrial Corridor, Sector 7",
};

export const PHASES = [
  {
    id: 1,
    range: [0.0, 0.18],
    phaseNumber: "01",
    label: "Site Prep & Excavation",
    title: "Ground Zero: Precision Excavation & Soil Engineering",
    description: "Deep subterranean trenching, geo-surveying, seismic bedrock anchor drilling, and installation of moisture barrier retaining shoring. Heavy earthmovers prep the 12,000 m² site.",
    specs: [
      { label: "Earthwork Volume", val: "42,500 m³" },
      { label: "Depth Reached", val: "-8.4 meters" },
      { label: "Piling Anchors", val: "148 Deep Borings" },
      { label: "Safety Status", val: "100% Zero-Incident" }
    ],
    badgeColor: "#ff4d4f",
    ctaText: "Inspect Subterranean Core",
    subInfo: "Phase 1 / 6 • Substructure Works"
  },
  {
    id: 2,
    range: [0.18, 0.38],
    phaseNumber: "02",
    label: "Foundation & Concrete Core",
    title: "Monolithic Foundation & Shear Wall Elevation",
    description: "Continuous pour of C45/55 high-strength self-compacting concrete raft foundation slab. Central elevator core and stair towers rise with hydraulic slip-form casting.",
    specs: [
      { label: "Concrete Grade", val: "C45/55 Silica-Fume" },
      { label: "Raft Slab Thickness", val: "1,800 mm" },
      { label: "Core Shear Walls", val: "Reinforced 400mm" },
      { label: "Load Capacity", val: "680 kN/m²" }
    ],
    badgeColor: "#ff7a45",
    ctaText: "View Concrete Cure Data",
    subInfo: "Phase 2 / 6 • Foundation Engineering"
  },
  {
    id: 3,
    range: [0.38, 0.58],
    phaseNumber: "03",
    label: "Steel Superstructure & Crane",
    title: "Erection of High-Strength Structural Steelwork",
    description: "Our heavy Liebherr luffing tower crane erects heavy grade S355JR structural columns, floor deck I-girders, and high-span open-web roof trusses with seismic moment connections.",
    specs: [
      { label: "Tower Crane Reach", val: "65m Radius / 18t" },
      { label: "Steel Fabricated", val: "2,840 Metric Tons" },
      { label: "Connection Type", val: "Grade 10.9 HSFG Bolts" },
      { label: "Clear Span", val: "36.0 Meters Free" }
    ],
    badgeColor: "#fa8c16",
    ctaText: "Inspect Steel Lattice",
    subInfo: "Phase 3 / 6 • Structural Superstructure"
  },
  {
    id: 4,
    range: [0.58, 0.76],
    phaseNumber: "04",
    label: "High-Bay Logistics & Systems",
    title: "Automated Industrial Interior & Urban Loading Bay",
    description: "Installation of multi-tier high-bay pallet racking, automated roller conveyor systems, heavy electric forklifts, and city-facing truck loading docks.",
    specs: [
      { label: "Storage Capacity", val: "4,200 High-Bay Pallets" },
      { label: "Conveyor Rate", val: "1,800 units / hr" },
      { label: "Loading Docks", val: "4 Smart Truck Bays" },
      { label: "Fire Suppression", val: "ESFR High-Density Grid" }
    ],
    badgeColor: "#ff4d4f",
    ctaText: "Explore Interior Systems",
    subInfo: "Phase 4 / 6 • Industrial Automation"
  },
  {
    id: 5,
    range: [0.76, 0.90],
    phaseNumber: "05",
    label: "Architectural Envelope & Glazing",
    title: "Energy-Efficient Curtain Wall & Solar Arrays",
    description: "Installation of unitized triple-glazed argon-filled Low-E glass facade panels with acoustic thermal breaks. High-efficiency rooftop bifacial photovoltaic arrays lock into position.",
    specs: [
      { label: "Thermal U-Value", val: "0.78 W/(m²K)" },
      { label: "Rooftop Solar Array", val: "240 kWp Peak" },
      { label: "Light Transmittance", val: "68% VLT Natural" },
      { label: "Acoustic Attenuation", val: "46 dB Sound Barrier" }
    ],
    badgeColor: "#13c2c2",
    ctaText: "View Facade Engineering",
    subInfo: "Phase 5 / 6 • Building Envelope"
  },
  {
    id: 6,
    range: [0.90, 1.0],
    phaseNumber: "06",
    label: "Commissioned Smart Campus",
    title: "Handover: Operational Sustainable Headquarters",
    description: "Full architectural commissioning complete: furnished offices, landscaped plazas with indigenous flora, fleet charging docks, and an active urban street frontage.",
    specs: [
      { label: "Total Built Area", val: "24,500 m²" },
      { label: "Certification", val: "LEED Platinum / Net-Zero" },
      { label: "Fleet Capacity", val: "18 Fast-Charge Docks" },
      { label: "Operational Status", val: "Commissioned & Active" }
    ],
    badgeColor: "#00b894",
    ctaText: "Request Turnkey Proposal",
    subInfo: "Phase 6 / 6 • Final Delivery"
  }
];

export const HOTSPOTS = [
  {
    id: "tower-crane",
    name: "Heavy Luffing Tower Crane",
    pos: [14, 22, -4],
    phaseMin: 0.28,
    category: "Machinery & Rigging",
    description: "65m radius high-capacity modular crane with micro-inching placement telemetry for heavy steel and glass hoisting.",
    specs: "Max Lift: 18,000 kg • Slewing Speed: 0.9 rpm"
  },
  {
    id: "steel-frame",
    name: "Moment-Resisting Steel Frame",
    pos: [2, 12, 2],
    phaseMin: 0.38,
    category: "Structural Engineering",
    description: "High-ductility wide-flange I-beams with welded seismic moment connections and vibration-damping cross braces.",
    specs: "Grade S355JR • Thermal Galvanized"
  },
  {
    id: "high-bay-racks",
    name: "High-Bay Pallet Racking",
    pos: [-8, 6, 2],
    phaseMin: 0.52,
    category: "Logistics Interior",
    description: "Heavy-duty 4-tier industrial racking with integrated dynamic roller conveyors and laser-guided AGV channels.",
    specs: "4,200 Pallet Positions • 1.2t / shelf"
  },
  {
    id: "curtain-wall",
    name: "Triple-Glazed Curtain Facade",
    pos: [12, 8, 8],
    phaseMin: 0.72,
    category: "Building Envelope",
    description: "Unitized architectural curtain wall with solar-control Low-E coatings and thermal expansion gaskets.",
    specs: "U-Value 0.78 • 46dB acoustic isolation"
  },
  {
    id: "solar-array",
    name: "Bifacial Solar Photovoltaic Roof",
    pos: [10, 16.5, 6],
    phaseMin: 0.78,
    category: "Renewable Energy",
    description: "High-efficiency bifacial monocrystalline solar array providing over 40% of the building's operational energy.",
    specs: "240 kWp capacity • Micro-inverter network"
  }
];

export const NAV_LINKS = [
  { label: "Expertise", href: "#" },
  { label: "Construction Phases", href: "#" },
  { label: "Machinery Fleet", href: "#" },
  { label: "Engineering Specs", href: "#" },
  { label: "Sustainability", href: "#" }
];
