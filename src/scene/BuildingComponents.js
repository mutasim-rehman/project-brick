import * as THREE from 'three';

// Procedural 3D model generator with high-fidelity mechanical details for the excavator, tower crane, warehouse, trucks, and infrastructure
export class BuildingComponents {
  constructor() {
    this.materials = this.createMaterials();
    this.elements = {
      ground: null,
      excavation: null,
      foundation: null,
      core: null,
      crane: null,
      steelColumns: [],
      steelBeams: [],
      floorSlabs: [],
      warehouseWalls: [],
      warehouseTrusses: [],
      warehouseRacks: [],
      warehouseBoxes: [],
      conveyors: [],
      forklift: null,
      facadePanels: [],
      officeInteriorLights: [],
      solarPanels: [],
      hvacUnits: [],
      trees: [],
      trucks: [],
      railGantry: null,
      trains: [],
      fencing: [],
      excavator: null,
      particles: null
    };
  }

  createMaterials() {
    return {
      ground: new THREE.MeshStandardMaterial({
        color: 0xf3f5f8,
        roughness: 0.95,
        metalness: 0.05,
      }),
      excavationSoil: new THREE.MeshStandardMaterial({
        color: 0xb59b82,
        roughness: 0.98,
        metalness: 0.0,
      }),
      concrete: new THREE.MeshStandardMaterial({
        color: 0xdde2ea,
        roughness: 0.85,
        metalness: 0.1,
      }),
      concreteCore: new THREE.MeshStandardMaterial({
        color: 0xe8ecf3,
        roughness: 0.8,
        metalness: 0.1,
      }),
      coreRedAccent: new THREE.MeshStandardMaterial({
        color: 0xff3322,
        roughness: 0.35,
        metalness: 0.2,
      }),
      // Authentic Construction Machinery Yellow (matching Crane & Excavator images)
      craneYellow: new THREE.MeshStandardMaterial({
        color: 0xf59f00,
        roughness: 0.35,
        metalness: 0.25,
      }),
      craneYellowDark: new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.4,
        metalness: 0.25,
      }),
      craneGrey: new THREE.MeshStandardMaterial({
        color: 0x495057,
        roughness: 0.85,
        metalness: 0.2,
      }),
      // High-polish Chrome for Hydraulic Cylinder Rods
      chrome: new THREE.MeshStandardMaterial({
        color: 0xf8f9fa,
        roughness: 0.08,
        metalness: 0.98,
      }),
      // Heavy Steel for Tracks, Chassis, Buckets
      steelDark: new THREE.MeshStandardMaterial({
        color: 0x212529,
        roughness: 0.6,
        metalness: 0.75,
      }),
      steelSilver: new THREE.MeshStandardMaterial({
        color: 0xced4da,
        roughness: 0.35,
        metalness: 0.8,
      }),
      // Matte Rubber Tires
      rubberTire: new THREE.MeshStandardMaterial({
        color: 0x1a1d20,
        roughness: 0.95,
        metalness: 0.05,
      }),
      // Truck Blue (matching Image 2)
      truckBlue: new THREE.MeshStandardMaterial({
        color: 0x2e86de,
        roughness: 0.35,
        metalness: 0.2,
      }),
      // Truck Red (matching Emons style)
      truckRed: new THREE.MeshStandardMaterial({
        color: 0xff3322,
        roughness: 0.35,
        metalness: 0.25,
      }),
      truckWhite: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.25,
        metalness: 0.1,
      }),
      truckGrille: new THREE.MeshStandardMaterial({
        color: 0xecf0f1,
        roughness: 0.15,
        metalness: 0.9,
      }),
      amberMarker: new THREE.MeshStandardMaterial({
        color: 0xff9f43,
        emissive: 0xff9f43,
        emissiveIntensity: 1.4,
        roughness: 0.2,
      }),
      hoseBlack: new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.9,
        metalness: 0.1,
      }),
      palletWood: new THREE.MeshStandardMaterial({
        color: 0xd4a373,
        roughness: 0.9,
      }),
      cardboard: new THREE.MeshStandardMaterial({
        color: 0xd9a76a,
        roughness: 0.95,
      }),
      cardboardDark: new THREE.MeshStandardMaterial({
        color: 0xbe8b55,
        roughness: 0.95,
      }),
      glassFacade: new THREE.MeshStandardMaterial({
        color: 0x0f2238,
        roughness: 0.08,
        metalness: 0.92,
        transparent: true,
        opacity: 0.78,
      }),
      glassCab: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.1,
        metalness: 0.85,
        transparent: true,
        opacity: 0.65,
      }),
      glassLit: new THREE.MeshStandardMaterial({
        color: 0xffe6a3,
        emissive: 0xffc048,
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.1,
      }),
      mullionBlack: new THREE.MeshStandardMaterial({
        color: 0x181a1f,
        roughness: 0.5,
        metalness: 0.6,
      }),
      solarCell: new THREE.MeshStandardMaterial({
        color: 0x0d1f48,
        roughness: 0.12,
        metalness: 0.95,
      }),
      treeCyan: new THREE.MeshStandardMaterial({
        color: 0x05c46b,
        roughness: 0.8,
        flatShading: true,
      }),
      treeTeal: new THREE.MeshStandardMaterial({
        color: 0x00cec9,
        roughness: 0.85,
        flatShading: true,
      }),
      treeTrunk: new THREE.MeshStandardMaterial({
        color: 0x8395a7,
        roughness: 0.9,
      }),
      asphalt: new THREE.MeshStandardMaterial({
        color: 0x383e48,
        roughness: 0.9,
      }),
      roadStripe: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.6,
      }),
      safetyOrange: new THREE.MeshStandardMaterial({
        color: 0xff7733,
        roughness: 0.4,
      }),
      railTrack: new THREE.MeshStandardMaterial({
        color: 0x57606f,
        roughness: 0.45,
        metalness: 0.85,
      }),
      railGravel: new THREE.MeshStandardMaterial({
        color: 0xa4b0be,
        roughness: 0.95,
      })
    };
  }

  buildAll(scene) {
    const root = new THREE.Group();
    root.name = 'ConstructionSiteRoot';

    this.buildTerrainAndRoads(root);
    this.buildExcavationPit(root);
    this.buildFoundationAndCore(root);
    this.buildTowerCrane(root);
    this.buildSteelSuperstructure(root);
    this.buildWarehouseInteriorAndRacks(root);
    this.buildOfficeTowerAndFacade(root);
    this.buildRooftopAndSolar(root);
    this.buildRailAndGantryCrane(root);
    this.buildVehiclesAndMachinery(root);
    this.buildLandscapingAndTrees(root);
    this.buildSparksAndAtmosphere(root);

    scene.add(root);
    this.root = root;
    return this.elements;
  }

  buildTerrainAndRoads(root) {
    const terrainGroup = new THREE.Group();

    // Main base ground
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const ground = new THREE.Mesh(groundGeo, this.materials.ground);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    terrainGroup.add(ground);
    this.elements.ground = ground;

    // Surrounding asphalt roads
    const frontRoadGeo = new THREE.PlaneGeometry(160, 10);
    const frontRoad = new THREE.Mesh(frontRoadGeo, this.materials.asphalt);
    frontRoad.rotation.x = -Math.PI / 2;
    frontRoad.position.set(0, 0.02, 34);
    frontRoad.receiveShadow = true;
    terrainGroup.add(frontRoad);

    for (let x = -70; x <= 70; x += 8) {
      const stripeGeo = new THREE.PlaneGeometry(4, 0.4);
      const stripe = new THREE.Mesh(stripeGeo, this.materials.roadStripe);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(x, 0.03, 34);
      terrainGroup.add(stripe);
    }

    const sideRoadGeo = new THREE.PlaneGeometry(10, 80);
    const sideRoad = new THREE.Mesh(sideRoadGeo, this.materials.asphalt);
    sideRoad.rotation.x = -Math.PI / 2;
    sideRoad.position.set(38, 0.02, -5);
    sideRoad.receiveShadow = true;
    terrainGroup.add(sideRoad);

    // Logistics loading apron
    const apronGeo = new THREE.PlaneGeometry(44, 22);
    const apron = new THREE.Mesh(apronGeo, this.materials.concrete);
    apron.rotation.x = -Math.PI / 2;
    apron.position.set(-10, 0.02, 18);
    apron.receiveShadow = true;
    terrainGroup.add(apron);

    for (let i = 0; i < 4; i++) {
      const lineGeo = new THREE.PlaneGeometry(0.3, 10);
      const line = new THREE.Mesh(lineGeo, this.materials.roadStripe);
      line.rotation.x = -Math.PI / 2;
      line.position.set(-26 + i * 10, 0.03, 20);
      terrainGroup.add(line);
    }

    root.add(terrainGroup);
  }

  buildExcavationPit(root) {
    const pitGroup = new THREE.Group();
    pitGroup.name = 'ExcavationPitGroup';

    // Excavation trench
    const pitFloorGeo = new THREE.BoxGeometry(32, 1.2, 28);
    const pitFloor = new THREE.Mesh(pitFloorGeo, this.materials.excavationSoil);
    pitFloor.position.set(12, -0.6, 2);
    pitFloor.receiveShadow = true;
    pitGroup.add(pitFloor);

    // Trench sloped soil embankments
    const wallNorth = new THREE.Mesh(new THREE.BoxGeometry(32.8, 1.4, 0.8), this.materials.excavationSoil);
    wallNorth.position.set(12, -0.4, -12);
    pitGroup.add(wallNorth);

    const wallEast = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 28.8), this.materials.excavationSoil);
    wallEast.position.set(28, -0.4, 2);
    pitGroup.add(wallEast);

    // Perimeter safety fences with striped warning rails
    const fenceGroup = new THREE.Group();
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
    const fenceCoords = [
      [-5, -13], [0, -13], [5, -13], [10, -13], [15, -13], [20, -13], [25, -13], [29, -13],
      [29, -8], [29, -3], [29, 2], [29, 7], [29, 12], [29, 17],
      [-5, 17], [0, 17], [5, 17], [10, 17], [15, 17], [20, 17], [25, 17], [29, 17]
    ];

    fenceCoords.forEach(([x, z]) => {
      const post = new THREE.Mesh(postGeo, this.materials.safetyOrange);
      post.position.set(x, 0.6, z);
      post.castShadow = true;
      fenceGroup.add(post);
    });

    // Site office modular container
    const officeBoxGeo = new THREE.BoxGeometry(6, 2.5, 2.6);
    const officeBox = new THREE.Mesh(officeBoxGeo, this.materials.truckWhite);
    officeBox.position.set(33, 1.25, 22);
    officeBox.castShadow = true;
    pitGroup.add(officeBox);

    const officeTrim = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.2, 2.8), this.materials.coreRedAccent);
    officeTrim.position.set(33, 2.5, 22);
    pitGroup.add(officeTrim);

    const officeBox2 = new THREE.Mesh(officeBoxGeo, this.materials.concrete);
    officeBox2.position.set(33, 3.85, 22);
    officeBox2.castShadow = true;
    pitGroup.add(officeBox2);

    // Excavated soil stockpile mound (where excavator dumps earth)
    const soilMound = new THREE.Mesh(new THREE.ConeGeometry(4.2, 2.2, 14), this.materials.excavationSoil);
    soilMound.position.set(25, 1.1, -6);
    soilMound.castShadow = true;
    soilMound.receiveShadow = true;
    pitGroup.add(soilMound);

    const soilMoundSmall = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.4, 10), this.materials.excavationSoil);
    soilMoundSmall.position.set(22, 0.7, -9);
    soilMoundSmall.castShadow = true;
    soilMoundSmall.receiveShadow = true;
    pitGroup.add(soilMoundSmall);

    // Heavy 6x6 articulated earthmover dump truck parked at soil mound
    const earthmover = this.createEarthmoverDumpTruck();
    earthmover.position.set(27, 0, -8);
    earthmover.rotation.y = -Math.PI / 3.5;
    pitGroup.add(earthmover);

    pitGroup.add(fenceGroup);
    root.add(pitGroup);
    this.elements.excavation = pitGroup;
  }

  buildFoundationAndCore(root) {
    const fGroup = new THREE.Group();
    fGroup.name = 'FoundationAndCoreGroup';

    // Substructure Concrete Raft Foundation slab
    const slabGeo = new THREE.BoxGeometry(30, 0.9, 26);
    const slab = new THREE.Mesh(slabGeo, this.materials.concrete);
    slab.position.set(12, 0.45, 2);
    slab.castShadow = true;
    slab.receiveShadow = true;
    fGroup.add(slab);

    // Pile cap pads
    const padGeo = new THREE.BoxGeometry(2.4, 0.5, 2.4);
    for (let x = -10; x <= 10; x += 10) {
      for (let z = -8; z <= 8; z += 8) {
        const pad = new THREE.Mesh(padGeo, this.materials.concrete);
        pad.position.set(12 + x, 0.95, 2 + z);
        pad.castShadow = true;
        fGroup.add(pad);
      }
    }

    // Shear Core (stairwell & elevator shaft)
    const coreGroup = new THREE.Group();
    coreGroup.name = 'ReinforcedCoreGroup';

    const coreGeo = new THREE.BoxGeometry(6.5, 24, 6.5);
    const coreMesh = new THREE.Mesh(coreGeo, this.materials.concreteCore);
    coreMesh.position.set(7, 12, 0);
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    coreGroup.add(coreMesh);

    // Striking vertical red architectural core fin (matching screenshot 5)
    const redAccentGeo = new THREE.BoxGeometry(6.6, 24, 2.4);
    const redAccent = new THREE.Mesh(redAccentGeo, this.materials.coreRedAccent);
    redAccent.position.set(7, 12, 2.1);
    redAccent.castShadow = true;
    coreGroup.add(redAccent);

    // Elevator doors
    for (let floor = 0; floor < 5; floor++) {
      const doorGeo = new THREE.BoxGeometry(1.6, 2.4, 0.1);
      const door = new THREE.Mesh(doorGeo, this.materials.steelDark);
      door.position.set(7, 2 + floor * 4.2, 3.32);
      coreGroup.add(door);
    }

    fGroup.add(coreGroup);
    root.add(fGroup);

    this.elements.foundation = slab;
    this.elements.core = coreGroup;
  }

  // ==========================================================================
  // REALISTIC TOWER CRANE (Directly matching Image 1)
  // ==========================================================================
  buildTowerCrane(root) {
    const craneGroup = new THREE.Group();
    craneGroup.name = 'TowerCrane';
    craneGroup.position.set(22, 0, -6);

    // 1. Base Foundation & Yellow Perimeter Safety Railing
    const baseSlab = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.8, 5.2), this.materials.concrete);
    baseSlab.position.y = 0.4;
    baseSlab.castShadow = true;
    craneGroup.add(baseSlab);

    // Base yellow ballast weights
    const baseBallast = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.0, 4.2), this.materials.craneGrey);
    baseBallast.position.y = 1.1;
    baseBallast.castShadow = true;
    craneGroup.add(baseBallast);

    // Yellow safety railing around base (matching Image 1)
    const baseRailing = this.createPerimeterRailing(4.8, 4.8, 0.9, this.materials.craneYellow);
    baseRailing.position.y = 1.6;
    craneGroup.add(baseRailing);

    // 2. Telescopic Climbing Collar / Cage (lower section in Image 1)
    const collarHeight = 9.0;
    const collarGroup = new THREE.Group();
    collarGroup.position.y = 1.6;

    // Outer corner posts of climbing cage
    const collarCorners = [[-1.4, -1.4], [-1.4, 1.4], [1.4, -1.4], [1.4, 1.4]];
    collarCorners.forEach(([cx, cz]) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, collarHeight, 0.18), this.materials.craneYellow);
      post.position.set(cx, collarHeight / 2, cz);
      post.castShadow = true;
      collarGroup.add(post);
    });

    // Climbing collar X-braces
    for (let cy = 1.5; cy < collarHeight; cy += 3.0) {
      // Horizontal bands
      const bandH1 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 0.12), this.materials.craneYellow);
      bandH1.position.set(0, cy, 1.4);
      collarGroup.add(bandH1);
      const bandH2 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 0.12), this.materials.craneYellow);
      bandH2.position.set(0, cy, -1.4);
      collarGroup.add(bandH2);

      // Diagonal cross
      const diag1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 0.08), this.materials.craneYellow);
      diag1.rotation.z = Math.PI / 4;
      diag1.position.set(0, cy + 1.2, 1.4);
      collarGroup.add(diag1);
      const diag2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 0.08), this.materials.craneYellow);
      diag2.rotation.z = -Math.PI / 4;
      diag2.position.set(0, cy + 1.2, 1.4);
      collarGroup.add(diag2);
    }
    craneGroup.add(collarGroup);

    // 3. Main Modular Lattice Mast (Yellow X-Braced Tower)
    const mastHeight = 32;
    const mastGroup = new THREE.Group();
    mastGroup.position.y = 1.6;

    // 4 vertical corner chords
    const chordCorners = [[-0.9, -0.9], [-0.9, 0.9], [0.9, -0.9], [0.9, 0.9]];
    chordCorners.forEach(([cx, cz]) => {
      const chord = new THREE.Mesh(new THREE.BoxGeometry(0.14, mastHeight, 0.14), this.materials.craneYellow);
      chord.position.set(cx, mastHeight / 2, cz);
      chord.castShadow = true;
      mastGroup.add(chord);
    });

    // Mast X-braces every 2.4 meters along the tower
    for (let y = 0; y < mastHeight; y += 2.4) {
      // Front and Back X-braces
      [-0.9, 0.9].forEach((cz) => {
        const x1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.06, 0.06), this.materials.craneYellow);
        x1.rotation.z = Math.PI / 5;
        x1.position.set(0, y + 1.2, cz);
        mastGroup.add(x1);

        const x2 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.06, 0.06), this.materials.craneYellow);
        x2.rotation.z = -Math.PI / 5;
        x2.position.set(0, y + 1.2, cz);
        mastGroup.add(x2);
      });

      // Left and Right X-braces
      [-0.9, 0.9].forEach((cx) => {
        const z1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 2.5), this.materials.craneYellow);
        z1.rotation.x = Math.PI / 5;
        z1.position.set(cx, y + 1.2, 0);
        mastGroup.add(z1);

        const z2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 2.5), this.materials.craneYellow);
        z2.rotation.x = -Math.PI / 5;
        z2.position.set(cx, y + 1.2, 0);
        mastGroup.add(z2);
      });

      // Internal access ladder rung
      const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7), this.materials.steelSilver);
      rung.rotation.z = Math.PI / 2;
      rung.position.set(0, y + 0.6, 0);
      mastGroup.add(rung);
    }
    craneGroup.add(mastGroup);

    // 4. Slewing Ring & Turntable Deck
    const slewingHead = new THREE.Group();
    slewingHead.position.y = 1.6 + mastHeight;

    // Turntable bearing plate
    const bearingPlate = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.4, 16), this.materials.steelDark);
    bearingPlate.position.y = 0.2;
    bearingPlate.castShadow = true;
    slewingHead.add(bearingPlate);

    // Operator Platform Deck with Handrails
    const platform = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.15, 2.6), this.materials.craneYellow);
    platform.position.set(0.8, 0.45, 0);
    slewingHead.add(platform);

    const platformRailing = this.createPerimeterRailing(2.5, 2.5, 0.8, this.materials.craneYellow);
    platformRailing.position.set(0.8, 0.5, 0);
    slewingHead.add(platformRailing);

    // Operator Cabin (matching Image 1: white cab with angled windshield and dark glass)
    const cabGroup = new THREE.Group();
    cabGroup.position.set(1.4, 0.55, 0);

    const cabBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.8, 1.6), this.materials.truckWhite);
    cabBody.position.y = 0.9;
    cabBody.castShadow = true;
    cabGroup.add(cabBody);

    // Angled front panoramic windshield
    const cabGlass = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, 1.2), this.materials.glassCab);
    cabGlass.position.set(0.71, 1.1, 0);
    cabGroup.add(cabGlass);

    // Roof solar shield & beacon
    const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 1.7), this.materials.craneYellow);
    cabRoof.position.y = 1.84;
    cabGroup.add(cabRoof);

    const cabBeacon = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15), this.materials.amberMarker);
    cabBeacon.position.set(0, 1.95, 0);
    cabGroup.add(cabBeacon);

    slewingHead.add(cabGroup);

    // 5. Apex Tower Top / Cat-Head A-Frame (Image 1)
    const apexHeight = 6.5;
    const apexGroup = new THREE.Group();
    apexGroup.position.y = 0.4;

    // 4 A-frame legs converging to peak
    const apexLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, apexHeight, 0.12), this.materials.craneYellow);
    apexLeg1.position.set(0.4, apexHeight / 2, 0.4);
    apexLeg1.rotation.z = -0.15;
    apexLeg1.rotation.x = 0.15;
    apexGroup.add(apexLeg1);

    const apexLeg2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, apexHeight, 0.12), this.materials.craneYellow);
    apexLeg2.position.set(-0.4, apexHeight / 2, -0.4);
    apexLeg2.rotation.z = 0.15;
    apexLeg2.rotation.x = -0.15;
    apexGroup.add(apexLeg2);

    // Peak sheaves / pulleys
    const apexPulley = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12), this.materials.craneGrey);
    apexPulley.rotation.z = Math.PI / 2;
    apexPulley.position.set(0, apexHeight, 0);
    apexGroup.add(apexPulley);

    slewingHead.add(apexGroup);

    // 6. Counter-Jib (Rear Lattice Truss with Concrete Counterweights)
    const counterJibLen = 12.0;
    const counterJib = new THREE.Group();
    counterJib.position.set(0, 0.6, 0);

    // Chords
    const cBottomL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, counterJibLen), this.materials.craneYellow);
    cBottomL.position.set(-0.6, 0, counterJibLen / 2);
    counterJib.add(cBottomL);
    const cBottomR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, counterJibLen), this.materials.craneYellow);
    cBottomR.position.set(0.6, 0, counterJibLen / 2);
    counterJib.add(cBottomR);
    const cTop = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, counterJibLen), this.materials.craneYellow);
    cTop.position.set(0, 1.2, counterJibLen / 2);
    counterJib.add(cTop);

    // Counter-jib diagonal webbing
    for (let z = 1.5; z < counterJibLen; z += 2.0) {
      const diagL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.4, 0.06), this.materials.craneYellow);
      diagL.rotation.x = Math.PI / 4;
      diagL.position.set(-0.3, 0.6, z);
      counterJib.add(diagL);

      const diagR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.4, 0.06), this.materials.craneYellow);
      diagR.rotation.x = -Math.PI / 4;
      diagR.position.set(0.3, 0.6, z);
      counterJib.add(diagR);
    }

    // Heavy Stacked Concrete Counterweight Slabs (Direct match to Image 1!)
    const weightBlockGeo = new THREE.BoxGeometry(2.4, 2.2, 1.0);
    for (let w = 0; w < 3; w++) {
      const block = new THREE.Mesh(weightBlockGeo, this.materials.craneGrey);
      block.position.set(0, 0.6, counterJibLen - 1.8 + w * 1.05);
      block.castShadow = true;
      counterJib.add(block);
    }

    // Rear tie-rod stay from apex to counter-jib tip
    const rearTieRod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 13.5), this.materials.steelSilver);
    rearTieRod.position.set(0, 3.6, 6.0);
    rearTieRod.rotation.x = Math.PI / 6.5;
    counterJib.add(rearTieRod);

    slewingHead.add(counterJib);

    // 7. Main Working Jib (Triangular Lattice Truss extending forward)
    const jibLength = 34.0;
    const jibGroup = new THREE.Group();
    jibGroup.position.set(0, 0.6, 0);

    // Chords: 2 bottom trolley rails + 1 top ridge chord
    const jibChordBL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, jibLength), this.materials.craneYellow);
    jibChordBL.position.set(-0.7, 0, -jibLength / 2);
    jibChordBL.castShadow = true;
    jibGroup.add(jibChordBL);

    const jibChordBR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, jibLength), this.materials.craneYellow);
    jibChordBR.position.set(0.7, 0, -jibLength / 2);
    jibChordBR.castShadow = true;
    jibGroup.add(jibChordBR);

    const jibChordTop = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, jibLength), this.materials.craneYellow);
    jibChordTop.position.set(0, 1.3, -jibLength / 2);
    jibChordTop.castShadow = true;
    jibGroup.add(jibChordTop);

    // Triangular diagonal lattice webbing along jib
    for (let z = -2; z > -jibLength; z -= 2.0) {
      const webL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.5, 0.06), this.materials.craneYellow);
      webL.rotation.x = Math.PI / 4.2;
      webL.position.set(-0.35, 0.65, z);
      jibGroup.add(webL);

      const webR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.5, 0.06), this.materials.craneYellow);
      webR.rotation.x = -Math.PI / 4.2;
      webR.position.set(0.35, 0.65, z);
      jibGroup.add(webR);
    }

    // Front tie-rod stays from apex to jib mid-span and tip
    const frontTie1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 18), this.materials.steelSilver);
    frontTie1.position.set(0, 3.4, -9);
    frontTie1.rotation.x = -Math.PI / 7.2;
    jibGroup.add(frontTie1);

    // 8. Traveling Trolley Assembly & Rigging (Image 1)
    const trolleyGroup = new THREE.Group();

    // Trolley frame & track wheels
    const trolleyFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 1.8), this.materials.craneGrey);
    trolleyFrame.position.y = -0.15;
    trolleyFrame.castShadow = true;
    trolleyGroup.add(trolleyFrame);

    // 4 Trolley track wheels
    [[-0.7, -0.6], [-0.7, 0.6], [0.7, -0.6], [0.7, 0.6]].forEach(([wx, wz]) => {
      const tw = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 12), this.materials.steelSilver);
      tw.rotation.z = Math.PI / 2;
      tw.position.set(wx, 0.05, wz);
      trolleyGroup.add(tw);
    });

    // Twin Hoist Wire Ropes descending to Hook Block
    const cable1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 12), this.materials.steelSilver);
    cable1.position.set(-0.3, -6.0, 0);
    trolleyGroup.add(cable1);

    const cable2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 12), this.materials.steelSilver);
    cable2.position.set(0.3, -6.0, 0);
    trolleyGroup.add(cable2);

    // Traveling Pulley Block (Yellow, Image 1)
    const blockGroup = new THREE.Group();
    blockGroup.position.set(0, -12.0, 0);

    const pulleyBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.7), this.materials.craneYellow);
    pulleyBody.castShadow = true;
    blockGroup.add(pulleyBody);

    // Heavy Crane Swivel Hook
    const hookShank = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.4), this.materials.steelDark);
    hookShank.position.y = -0.55;
    blockGroup.add(hookShank);

    const hookTorus = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.1, 12, 24, Math.PI * 1.3), this.materials.steelDark);
    hookTorus.rotation.y = Math.PI / 2;
    hookTorus.position.set(0, -0.9, 0.1);
    hookTorus.castShadow = true;
    blockGroup.add(hookTorus);

    // Dual wire rope rigging slings carrying the steel beam (Image 1)
    const slingL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.6), this.materials.steelDark);
    slingL.position.set(0, -1.5, -0.9);
    slingL.rotation.x = Math.PI / 7;
    blockGroup.add(slingL);

    const slingR = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.6), this.materials.steelDark);
    slingR.position.set(0, -1.5, 0.9);
    slingR.rotation.x = -Math.PI / 7;
    blockGroup.add(slingR);

    // Suspended Steel I-Beam
    const suspendedBeam = this.createIBeam(6.5, 0.65, 0.45);
    suspendedBeam.rotation.y = Math.PI / 2;
    suspendedBeam.position.set(0, -2.2, 0);
    suspendedBeam.castShadow = true;
    blockGroup.add(suspendedBeam);

    trolleyGroup.add(blockGroup);
    trolleyGroup.position.set(0, 0, -16);
    jibGroup.add(trolleyGroup);

    slewingHead.add(jibGroup);
    craneGroup.add(slewingHead);
    root.add(craneGroup);

    this.elements.crane = {
      root: craneGroup,
      slewingHead,
      trolleyGroup,
      blockGroup,
      suspendedBeam
    };
  }

  createPerimeterRailing(width, length, height, material) {
    const railing = new THREE.Group();
    const t = 0.04;
    const postGeo = new THREE.CylinderGeometry(t, t, height, 8);

    // Posts at corners
    const corners = [
      [-width / 2, -length / 2], [width / 2, -length / 2],
      [-width / 2, length / 2], [width / 2, length / 2]
    ];
    corners.forEach(([x, z]) => {
      const post = new THREE.Mesh(postGeo, material);
      post.position.set(x, height / 2, z);
      railing.add(post);
    });

    // Top rails
    const topRailX = new THREE.Mesh(new THREE.BoxGeometry(width, t, t), material);
    topRailX.position.set(0, height, length / 2);
    railing.add(topRailX);

    const topRailX2 = new THREE.Mesh(new THREE.BoxGeometry(width, t, t), material);
    topRailX2.position.set(0, height, -length / 2);
    railing.add(topRailX2);

    const topRailZ = new THREE.Mesh(new THREE.BoxGeometry(t, t, length), material);
    topRailZ.position.set(width / 2, height, 0);
    railing.add(topRailZ);

    const topRailZ2 = new THREE.Mesh(new THREE.BoxGeometry(t, t, length), material);
    topRailZ2.position.set(-width / 2, height, 0);
    railing.add(topRailZ2);

    return railing;
  }

  // ==========================================================================
  // REALISTIC HYDRAULIC EXCAVATOR (Directly matching Image 3)
  // ==========================================================================
  createExcavator() {
    const exRoot = new THREE.Group();
    exRoot.name = 'HydraulicExcavator';

    // 1. Heavy Crawler Undercarriage & Dual Tracks (Image 3)
    const undercarriage = new THREE.Group();
    const trackWidth = 0.9;
    const trackLength = 5.2;
    const trackHeight = 1.1;
    const trackSpacing = 2.4;

    [-trackSpacing / 2, trackSpacing / 2].forEach((tz) => {
      const trackGroup = new THREE.Group();
      trackGroup.position.set(0, trackHeight / 2, tz);

      // Dark steel track frame with beveled ends
      const frameGeo = new THREE.BoxGeometry(trackLength - 0.8, trackHeight * 0.7, trackWidth * 0.9);
      const frame = new THREE.Mesh(frameGeo, this.materials.steelDark);
      trackGroup.add(frame);

      // Rear drive sprocket & front idler wheels
      const sprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, trackWidth * 0.92, 16), this.materials.steelDark);
      sprocket.rotation.x = Math.PI / 2;
      sprocket.position.set(-trackLength / 2 + 0.5, 0, 0);
      sprocket.castShadow = true;
      trackGroup.add(sprocket);

      const idler = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, trackWidth * 0.92, 16), this.materials.steelDark);
      idler.rotation.x = Math.PI / 2;
      idler.position.set(trackLength / 2 - 0.5, 0, 0);
      idler.castShadow = true;
      trackGroup.add(idler);

      // Bottom track rollers (5 rollers)
      for (let rx = -1.6; rx <= 1.6; rx += 0.8) {
        const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, trackWidth * 0.95, 12), this.materials.steelDark);
        roller.rotation.x = Math.PI / 2;
        roller.position.set(rx, -trackHeight / 2 + 0.2, 0);
        trackGroup.add(roller);
      }

      // Continuous rubber/steel caterpillar track belt with ribbed shoes
      const beltTop = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 0.08, trackWidth), this.materials.rubberTire);
      beltTop.position.set(0, trackHeight / 2, 0);
      beltTop.castShadow = true;
      trackGroup.add(beltTop);

      const beltBottom = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 0.08, trackWidth), this.materials.rubberTire);
      beltBottom.position.set(0, -trackHeight / 2, 0);
      trackGroup.add(beltBottom);

      // Track pads ribs
      for (let px = -trackLength / 2; px <= trackLength / 2; px += 0.35) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, trackWidth * 1.02), this.materials.steelDark);
        rib.position.set(px, trackHeight / 2 + 0.04, 0);
        trackGroup.add(rib);
      }

      undercarriage.add(trackGroup);
    });

    // Central carbody / cross-beam joining tracks
    const carbody = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, trackSpacing), this.materials.steelDark);
    carbody.position.y = trackHeight * 0.6;
    carbody.castShadow = true;
    undercarriage.add(carbody);

    // Slew ring turntable
    const slewRing = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.3, 20), this.materials.craneGrey);
    slewRing.position.y = trackHeight * 0.9;
    undercarriage.add(slewRing);

    exRoot.add(undercarriage);

    // 2. Revolving Superstructure Body (Yellow Engine House + Cab, Image 3)
    const house = new THREE.Group();
    house.position.y = trackHeight * 0.9 + 0.15;

    // Heavy rear counterweight
    const counterweightGeo = new THREE.BoxGeometry(1.4, 1.6, 2.6);
    const counterweight = new THREE.Mesh(counterweightGeo, this.materials.craneYellowDark);
    counterweight.position.set(-1.8, 0.8, 0);
    counterweight.castShadow = true;
    house.add(counterweight);

    // Engine hood & machinery compartment (right side)
    const engineHoodGeo = new THREE.BoxGeometry(2.4, 1.4, 1.5);
    const engineHood = new THREE.Mesh(engineHoodGeo, this.materials.craneYellow);
    engineHood.position.set(0.1, 0.7, -0.55);
    engineHood.castShadow = true;
    house.add(engineHood);

    // Radiator louvered vents
    for (let lx = -0.6; lx <= 0.8; lx += 0.25) {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.9, 0.08), this.materials.steelDark);
      louver.position.set(lx, 0.8, -1.31);
      house.add(louver);
    }

    // Exhaust muffler pipe with bent rain cap (Image 3)
    const exhaustMuffler = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.8), this.materials.steelDark);
    exhaustMuffler.position.set(-0.6, 1.8, -0.6);
    house.add(exhaustMuffler);

    const exhaustTip = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), this.materials.steelDark);
    exhaustTip.position.set(-0.6, 2.3, -0.6);
    exhaustTip.rotation.z = Math.PI / 4;
    house.add(exhaustTip);

    // Cylindrical air intake filter
    const airFilter = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.5), this.materials.steelDark);
    airFilter.position.set(-1.1, 1.6, -0.4);
    house.add(airFilter);

    // Thin steel safety railings along the engine deck (Image 3)
    const deckRailing = this.createPerimeterRailing(2.3, 1.4, 0.65, this.materials.steelDark);
    deckRailing.position.set(0.1, 1.4, -0.55);
    house.add(deckRailing);

    // 3. Operator Cabin (Left side, Image 3)
    const cabGroup = new THREE.Group();
    cabGroup.position.set(0.4, 0, 0.85);

    // Cab main shell
    const cabShell = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.0, 1.2), this.materials.craneYellow);
    cabShell.position.set(0, 1.0, 0);
    cabShell.castShadow = true;
    cabGroup.add(cabShell);

    // Angled front glass windshield
    const cabGlassFront = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 0.95), this.materials.glassCab);
    cabGlassFront.position.set(0.81, 1.1, 0);
    cabGroup.add(cabGlassFront);

    // Side door glass window
    const cabGlassSide = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 0.08), this.materials.glassCab);
    cabGlassSide.position.set(0.1, 1.2, 0.61);
    cabGroup.add(cabGlassSide);

    // Corrugated roof reinforcement ribs
    for (let rx = -0.5; rx <= 0.5; rx += 0.25) {
      const roofRib = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 1.15), this.materials.craneYellowDark);
      roofRib.position.set(rx, 2.02, 0);
      cabGroup.add(roofRib);
    }

    // Interior operator seat and dual joysticks
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 0.45), this.materials.steelDark);
    seat.position.set(-0.2, 0.6, 0);
    cabGroup.add(seat);

    const joystick1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3), this.materials.steelSilver);
    joystick1.position.set(0.2, 0.65, -0.2);
    cabGroup.add(joystick1);
    const joystick2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3), this.materials.steelSilver);
    joystick2.position.set(0.2, 0.65, 0.2);
    cabGroup.add(joystick2);

    house.add(cabGroup);

    // 4. Articulated Digging Arm & Kinematic Hydraulics (Image 3)
    // Boom foot pivot mount on front center
    const boomPivot = new THREE.Group();
    boomPivot.position.set(1.1, 0.8, 0);

    // Curved Main Boom
    const boomMesh = this.createCurvedBoom();
    boomMesh.castShadow = true;
    boomPivot.add(boomMesh);

    // Dual Boom Hydraulic Cylinders (pinned to house and extending to boom)
    const boomCylinders = [];
    [-0.35, 0.35].forEach((cyOffset) => {
      const cylGroup = new THREE.Group();
      cylGroup.position.set(0.6, 0.4, cyOffset);

      const cylBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.4, 12), this.materials.craneYellow);
      cylBarrel.position.y = 1.0;
      cylGroup.add(cylBarrel);

      const cylPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.2, 12), this.materials.chrome);
      cylPiston.position.y = 1.8;
      cylGroup.add(cylPiston);

      cylGroup.rotation.z = Math.PI / 4.8;
      boomPivot.add(cylGroup);
      boomCylinders.push({ group: cylGroup, barrel: cylBarrel, piston: cylPiston });
    });

    // Stick / Dipper Arm (hinged at boom tip: x: 4.6, y: 3.4)
    const stickPivot = new THREE.Group();
    stickPivot.position.set(4.6, 3.4, 0);

    const stickMesh = this.createStickArm();
    stickMesh.castShadow = true;
    stickPivot.add(stickMesh);

    // Stick hydraulic ram on top of boom
    const stickCylinder = new THREE.Group();
    const sBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 2.2, 12), this.materials.craneYellow);
    sBarrel.position.set(-1.2, 0.4, 0);
    sBarrel.rotation.z = -Math.PI / 4.5;
    stickCylinder.add(sBarrel);

    const sPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.0, 12), this.materials.chrome);
    sPiston.position.set(-0.2, 0.1, 0);
    sPiston.rotation.z = -Math.PI / 4.5;
    stickCylinder.add(sPiston);
    stickPivot.add(stickCylinder);

    // Bucket Assembly (hinged at stick tip: x: 3.2, y: -2.8)
    const bucketPivot = new THREE.Group();
    bucketPivot.position.set(3.2, -2.8, 0);

    // Heavy duty digging bucket with 5 distinct sharp teeth (Image 3)
    const bucketMesh = this.createDiggingBucket();
    bucketMesh.castShadow = true;
    bucketPivot.add(bucketMesh);

    // Bucket linkage dogbones
    const dogbone = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 0.4), this.materials.steelDark);
    dogbone.position.set(-0.2, 0.4, 0);
    bucketPivot.add(dogbone);

    stickPivot.add(bucketPivot);
    boomPivot.add(stickPivot);
    house.add(boomPivot);

    exRoot.add(house);

    // Cache kinematic references for dynamic excavation animation
    this.elements.excavator = {
      root: exRoot,
      house,
      boomPivot,
      stickPivot,
      bucketPivot,
      boomCylinders
    };

    return exRoot;
  }

  createEarthmoverDumpTruck() {
    const truck = new THREE.Group();
    truck.name = 'EarthmoverDumpTruck';

    // Heavy 6x6 chassis
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.6, 2.4), this.materials.steelDark);
    chassis.position.y = 1.0;
    chassis.castShadow = true;
    truck.add(chassis);

    // Front angled driver cab
    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.0, 2.2), this.materials.craneYellow);
    cab.position.set(2.8, 2.0, 0);
    cab.castShadow = true;
    truck.add(cab);

    // Windshield
    const ws = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.0, 1.8), this.materials.glassCab);
    ws.position.set(4.01, 2.2, 0);
    truck.add(ws);

    // Rock dump bed
    const bed = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.8, 2.6), this.materials.craneYellow);
    bed.position.set(-1.2, 2.2, 0);
    bed.castShadow = true;
    truck.add(bed);

    // Soil load inside dump bed
    const soil = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.6, 2.3), this.materials.excavationSoil);
    soil.position.set(-1.2, 2.8, 0);
    truck.add(soil);

    // 6 Big rugged earthmover wheels
    const wheelGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.55, 16);
    [[-3.2, -1.35], [-3.2, 1.35], [-1.2, -1.35], [-1.2, 1.35], [2.8, -1.35], [2.8, 1.35]].forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, this.materials.rubberTire);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.7, wz);
      wheel.castShadow = true;
      truck.add(wheel);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.58, 12), this.materials.craneYellow);
      hub.rotation.x = Math.PI / 2;
      hub.position.set(wx, 0.7, wz);
      truck.add(hub);
    });

    return truck;
  }

  createCurvedBoom() {
    const boom = new THREE.Group();

    // 2-segment welded curved box boom
    const lowerSegment = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.75, 0.65), this.materials.craneYellow);
    lowerSegment.position.set(1.6, 1.2, 0);
    lowerSegment.rotation.z = Math.PI / 4.2;
    boom.add(lowerSegment);

    const upperSegment = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.65, 0.55), this.materials.craneYellow);
    upperSegment.position.set(3.6, 2.6, 0);
    upperSegment.rotation.z = Math.PI / 8;
    boom.add(upperSegment);

    // Pivot boss reinforcing rings
    const bossGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.72, 16);
    const bossFoot = new THREE.Mesh(bossGeo, this.materials.craneYellowDark);
    bossFoot.rotation.x = Math.PI / 2;
    boom.add(bossFoot);

    const bossKnee = new THREE.Mesh(bossGeo, this.materials.craneYellowDark);
    bossKnee.rotation.x = Math.PI / 2;
    bossKnee.position.set(4.6, 3.4, 0);
    boom.add(bossKnee);

    // Flexible black hydraulic hose lines
    const hose1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.4), this.materials.hoseBlack);
    hose1.position.set(2.4, 2.2, 0.35);
    hose1.rotation.z = Math.PI / 4;
    boom.add(hose1);

    return boom;
  }

  createStickArm() {
    const stick = new THREE.Group();

    const stickBody = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.6, 0.48), this.materials.craneYellow);
    stickBody.position.set(1.6, -1.3, 0);
    stickBody.rotation.z = -Math.PI / 4.4;
    stick.add(stickBody);

    // Boss at bucket end
    const bossTip = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.54, 16), this.materials.craneYellowDark);
    bossTip.rotation.x = Math.PI / 2;
    bossTip.position.set(3.2, -2.8, 0);
    stick.add(bossTip);

    return stick;
  }

  createDiggingBucket() {
    const bucket = new THREE.Group();

    // Curved back plate and side cheeks (Image 3)
    const backPlate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 1.3), this.materials.steelDark);
    backPlate.position.set(0.4, -0.3, 0);
    bucket.add(backPlate);

    const sideL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 0.1), this.materials.steelDark);
    sideL.position.set(0.4, -0.3, 0.65);
    bucket.add(sideL);

    const sideR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 0.1), this.materials.steelDark);
    sideR.position.set(0.4, -0.3, -0.65);
    bucket.add(sideR);

    // 5 Distinct Sharp Digging Teeth / Shanks (Image 3)
    const toothGeo = new THREE.ConeGeometry(0.08, 0.45, 4);
    for (let i = 0; i < 5; i++) {
      const zPos = -0.48 + i * 0.24;
      const tooth = new THREE.Mesh(toothGeo, this.materials.steelSilver);
      tooth.rotation.z = -Math.PI / 2.2;
      tooth.position.set(1.4, -0.85, zPos);
      tooth.castShadow = true;
      bucket.add(tooth);
    }

    return bucket;
  }

  // ==========================================================================
  // REALISTIC DELIVERY TRUCK / SEMI-TRUCK (Directly matching Image 2)
  // ==========================================================================
  createDeliveryTruck(colorMat = this.materials.truckBlue) {
    const truck = new THREE.Group();

    // 1. Chassis Frame Rails (Blue / Dark)
    const chassisGeo = new THREE.BoxGeometry(14.0, 0.45, 2.0);
    const chassis = new THREE.Mesh(chassisGeo, colorMat);
    chassis.position.set(0, 1.0, 0);
    chassis.castShadow = true;
    truck.add(chassis);

    // 2. Conventional Cab with Contoured Hood (Image 2)
    const cabGroup = new THREE.Group();
    cabGroup.position.set(3.4, 1.2, 0);

    // Main Cab Cabin Body
    const cabCabin = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.8, 2.5), colorMat);
    cabCabin.position.set(0, 1.4, 0);
    cabCabin.castShadow = true;
    cabGroup.add(cabCabin);

    // Contoured Lower Front Hood extending forward (Image 2)
    const hoodGeo = new THREE.BoxGeometry(2.4, 1.6, 2.3);
    const hood = new THREE.Mesh(hoodGeo, colorMat);
    hood.position.set(2.6, 0.8, 0);
    hood.castShadow = true;
    cabGroup.add(hood);

    // Chrome Vertical Radiator Grille with Silver Surround (Direct match to Image 2!)
    const grilleSurround = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 1.6), this.materials.truckGrille);
    grilleSurround.position.set(3.82, 0.8, 0);
    grilleSurround.castShadow = true;
    cabGroup.add(grilleSurround);

    // Grille vertical slots
    for (let gz = -0.6; gz <= 0.6; gz += 0.15) {
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.1, 0.05), this.materials.steelDark);
      slot.position.set(3.83, 0.8, gz);
      cabGroup.add(slot);
    }

    // Heavy Front Bumper with Headlight clusters
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 2.6), this.materials.steelDark);
    bumper.position.set(3.7, 0.2, 0);
    bumper.castShadow = true;
    cabGroup.add(bumper);

    // Headlights
    [-0.9, 0.9].forEach((hz) => {
      const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.35), this.materials.truckWhite);
      headlight.position.set(3.91, 0.2, hz);
      cabGroup.add(headlight);
    });

    // Angled Windshield
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, 2.1), this.materials.glassCab);
    windshield.position.set(1.48, 2.0, 0);
    cabGroup.add(windshield);

    // Side Door Windows
    [-1.26, 1.26].forEach((wz) => {
      const sideWin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.85, 0.05), this.materials.glassCab);
      sideWin.position.set(0.3, 2.0, wz);
      cabGroup.add(sideWin);
    });

    // Aerodynamic Curved Roof Cap with Sun Visor (Image 2)
    const roofCap = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.6, 2.45), colorMat);
    roofCap.position.set(-0.1, 2.9, 0);
    roofCap.castShadow = true;
    cabGroup.add(roofCap);

    const sunVisor = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 2.3), colorMat);
    sunVisor.position.set(1.4, 2.65, 0);
    cabGroup.add(sunVisor);

    // Row of 5 Amber Clearance Lights on Roof Brow (Direct match to Image 2!)
    for (let i = 0; i < 5; i++) {
      const lz = -0.7 + i * 0.35;
      const marker = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.1), this.materials.amberMarker);
      marker.position.set(1.3, 2.85, lz);
      cabGroup.add(marker);
    }

    // Large Dual Side Mirrors on Thin Bracket Mounts (Image 2)
    [-1.5, 1.5].forEach((mz) => {
      const mirrorGroup = new THREE.Group();
      mirrorGroup.position.set(1.1, 1.9, mz);

      const mirrorBody = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.35), this.materials.truckWhite);
      mirrorBody.castShadow = true;
      mirrorGroup.add(mirrorBody);

      // Bracket arm
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.6, 0.3), this.materials.steelDark);
      bracket.position.set(-0.1, 0, 0);
      mirrorGroup.add(bracket);

      cabGroup.add(mirrorGroup);
    });

    // Side Cylindrical Fuel Tanks & Ribbed Steps (Image 2)
    [-1.35, 1.35].forEach((fz) => {
      const tankGroup = new THREE.Group();
      tankGroup.position.set(0.6, -0.4, fz);

      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.0, 16), this.materials.truckWhite);
      tank.rotation.z = Math.PI / 2;
      tank.castShadow = true;
      tankGroup.add(tank);

      // Ribbed step
      const step = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.3), this.materials.steelSilver);
      step.position.set(0, 0.38, 0);
      tankGroup.add(step);

      cabGroup.add(tankGroup);
    });

    truck.add(cabGroup);

    // 3. Crisp White Cargo Container Box with Border Trim (Image 2)
    const cargoGroup = new THREE.Group();
    cargoGroup.position.set(-2.6, 2.8, 0);

    const cargoBox = new THREE.Mesh(new THREE.BoxGeometry(8.2, 3.2, 2.6), this.materials.truckWhite);
    cargoBox.castShadow = true;
    cargoGroup.add(cargoBox);

    // Raised perimeter edge molding frames (Direct match to Image 2!)
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(8.3, 0.15, 2.7), this.materials.truckWhite);
    frameTop.position.set(0, 1.6, 0);
    cargoGroup.add(frameTop);

    const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(8.3, 0.15, 2.7), colorMat);
    frameBottom.position.set(0, -1.6, 0);
    cargoGroup.add(frameBottom);

    // Rear cargo door vertical locking rods
    [-0.4, 0.4].forEach((rz) => {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.8), this.materials.steelSilver);
      rod.position.set(-4.12, 0, rz);
      cargoGroup.add(rod);
    });

    truck.add(cargoGroup);

    // 4. Wheels: Dual-Axle Rear Suspension (8 wheels) + 2 Steering Front (10 wheels total! Image 2)
    // Front steering axle: x: 5.6
    // Rear dual tandem axles: x: -4.6 and x: -6.4 (dual wheels on each side!)
    const wheelY = 0.55;
    const wheelRadius = 0.52;
    const wheelWidth = 0.38;

    // Front wheels (Single per side)
    [-1.25, 1.25].forEach((wz) => {
      const wheel = this.createDetailedWheel(wheelRadius, wheelWidth);
      wheel.position.set(5.6, wheelY, wz);
      truck.add(wheel);
    });

    // Rear Tandem Dual Wheels (2 sets of dual tires per side = 8 rear wheels!)
    [-4.8, -6.4].forEach((axleX) => {
      // Left side dual tires
      [-1.38, -1.02].forEach((wz) => {
        const wheel = this.createDetailedWheel(wheelRadius, wheelWidth * 0.85);
        wheel.position.set(axleX, wheelY, wz);
        truck.add(wheel);
      });

      // Right side dual tires
      [1.02, 1.38].forEach((wz) => {
        const wheel = this.createDetailedWheel(wheelRadius, wheelWidth * 0.85);
        wheel.position.set(axleX, wheelY, wz);
        truck.add(wheel);
      });
    });

    return truck;
  }

  createDetailedWheel(radius, width) {
    const wheelGroup = new THREE.Group();

    // Black rubber tire with tread bevel
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 24), this.materials.rubberTire);
    tire.rotation.x = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Crisp white/silver hubcap rim (Direct match to Image 2!)
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.62, radius * 0.62, width * 1.02, 16), this.materials.truckWhite);
    rim.rotation.x = Math.PI / 2;
    wheelGroup.add(rim);

    // Center axle hub
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.22, radius * 0.22, width * 1.05, 12), this.materials.steelDark);
    hub.rotation.x = Math.PI / 2;
    wheelGroup.add(hub);

    return wheelGroup;
  }

  // ==========================================================================
  // REALISTIC LOGISTICS WAREHOUSE & HIGH-BAY RACKS (Emons style)
  // ==========================================================================
  buildWarehouseInteriorAndRacks(root) {
    const whGroup = new THREE.Group();
    whGroup.name = 'WarehouseComplex';
    whGroup.position.set(-18, 0, 0);

    // Warehouse concrete floor slab
    const floorGeo = new THREE.BoxGeometry(32, 0.6, 26);
    const floor = new THREE.Mesh(floorGeo, this.materials.concrete);
    floor.position.set(0, 0.3, 0);
    floor.receiveShadow = true;
    whGroup.add(floor);

    // Precast Walls with Red Corporate Branding Stripe (Emons style)
    const rearWallGeo = new THREE.BoxGeometry(32, 10, 0.6);
    const rearWall = new THREE.Mesh(rearWallGeo, this.materials.concreteCore);
    rearWall.position.set(0, 5.3, -13);
    rearWall.castShadow = true;
    whGroup.add(rearWall);
    this.elements.warehouseWalls.push(rearWall);

    const sideWallGeo = new THREE.BoxGeometry(0.6, 10, 26);
    const sideWall = new THREE.Mesh(sideWallGeo, this.materials.concreteCore);
    sideWall.position.set(-16, 5.3, 0);
    sideWall.castShadow = true;
    whGroup.add(sideWall);
    this.elements.warehouseWalls.push(sideWall);

    const redStripe = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 26), this.materials.coreRedAccent);
    redStripe.position.set(-16, 9.4, 0);
    whGroup.add(redStripe);
    this.elements.warehouseWalls.push(redStripe);

    // Open-Web Steel Roof Trusses with Gusset Plates
    for (let z = -10; z <= 10; z += 5) {
      const trussGroup = new THREE.Group();
      const trussTop = new THREE.Mesh(new THREE.BoxGeometry(32, 0.25, 0.25), this.materials.steelDark);
      trussTop.position.set(0, 10.2, z);
      trussGroup.add(trussTop);

      const trussBottom = new THREE.Mesh(new THREE.BoxGeometry(32, 0.2, 0.2), this.materials.steelDark);
      trussBottom.position.set(0, 8.8, z);
      trussGroup.add(trussBottom);

      for (let x = -14; x <= 14; x += 4) {
        const web1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.6, 0.12), this.materials.steelDark);
        web1.rotation.z = Math.PI / 4;
        web1.position.set(x + 1, 9.5, z);
        trussGroup.add(web1);

        const web2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.6, 0.12), this.materials.steelDark);
        web2.rotation.z = -Math.PI / 4;
        web2.position.set(x + 3, 9.5, z);
        trussGroup.add(web2);
      }
      whGroup.add(trussGroup);
      this.elements.warehouseTrusses.push(trussGroup);
    }

    // High-Bay Industrial Pallet Racking with Cross-Lacing (Direct match to screenshots 1 & 2!)
    const rackAisleX = [-9, -3, 3, 9];
    const rackLevels = [1.8, 3.8, 5.8, 7.8];

    rackAisleX.forEach((rx) => {
      const rackGroup = new THREE.Group();
      rackGroup.position.set(rx, 0, 0);

      // Galvanized steel upright columns with diagonal lacing
      const uprightZ = [-9, -4.5, 0, 4.5, 9];
      uprightZ.forEach((uz) => {
        [-1.2, 1.2].forEach((ux) => {
          const upright = new THREE.Mesh(new THREE.BoxGeometry(0.15, 8.4, 0.15), this.materials.steelSilver);
          upright.position.set(ux, 4.8, uz);
          upright.castShadow = true;
          rackGroup.add(upright);
        });

        // Cross-lacing between upright pairs
        for (let ly = 1.0; ly < 8.0; ly += 2.0) {
          const lace = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 0.06), this.materials.steelSilver);
          lace.position.set(0, ly, uz);
          rackGroup.add(lace);
        }
      });

      // Orange load beams and wooden Euro-pallets with stacked cartons
      rackLevels.forEach((ly) => {
        [-1.2, 1.2].forEach((ux) => {
          const hBeam = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 18.2), this.materials.safetyOrange);
          hBeam.position.set(ux, ly + 0.6, 0);
          rackGroup.add(hBeam);
        });

        for (let bz = -8; bz <= 8; bz += 2.2) {
          // Authentic Euro-Pallet with slats and stringer blocks
          const palletGroup = this.createEuroPallet();
          palletGroup.position.set(0, ly + 0.7, bz);
          rackGroup.add(palletGroup);

          // Cardboard cartons with strapping bands
          const boxHeight = 0.95 + (Math.sin(rx + bz + ly) * 0.3);
          const boxMat = (bz % 4 === 0) ? this.materials.cardboardDark : this.materials.cardboard;
          const box = new THREE.Mesh(new THREE.BoxGeometry(1.6, boxHeight, 1.3), boxMat);
          box.position.set(0, ly + 0.8 + boxHeight / 2, bz);
          box.castShadow = true;
          box.receiveShadow = true;
          rackGroup.add(box);
          this.elements.warehouseBoxes.push(box);
        }
      });

      whGroup.add(rackGroup);
      this.elements.warehouseRacks.push(rackGroup);
    });

    // Automated Roller Conveyor Lines (matching screenshot 1 & 2)
    const conveyorGroup = new THREE.Group();
    conveyorGroup.position.set(0, 0.6, 8);

    const conveyorBed = new THREE.Mesh(new THREE.BoxGeometry(24, 0.35, 1.6), this.materials.steelDark);
    conveyorBed.position.set(0, 0.6, 0);
    conveyorBed.castShadow = true;
    conveyorGroup.add(conveyorBed);

    for (let cx = -11; cx <= 11; cx += 0.8) {
      const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8), this.materials.steelSilver);
      roller.rotation.x = Math.PI / 2;
      roller.position.set(cx, 0.85, 0);
      conveyorGroup.add(roller);
    }

    for (let cx = -9; cx <= 9; cx += 3.5) {
      const parcel = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.9), this.materials.cardboard);
      parcel.position.set(cx, 1.25, 0);
      parcel.castShadow = true;
      conveyorGroup.add(parcel);
    }
    whGroup.add(conveyorGroup);
    this.elements.conveyors.push(conveyorGroup);

    // Electric Warehouse Forklift (matching screenshot 2)
    const forkliftGroup = this.buildForklift();
    forkliftGroup.position.set(6, 0.6, 5);
    forkliftGroup.rotation.y = -Math.PI / 3;
    whGroup.add(forkliftGroup);
    this.elements.forklift = forkliftGroup;

    root.add(whGroup);
  }

  createEuroPallet() {
    const pGroup = new THREE.Group();
    // 3 stringers
    [-0.55, 0, 0.55].forEach((px) => {
      const stringer = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 1.6), this.materials.palletWood);
      stringer.position.set(px, 0.05, 0);
      pGroup.add(stringer);
    });

    // Top deckboards
    for (let pz = -0.7; pz <= 0.7; pz += 0.35) {
      const board = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.22), this.materials.palletWood);
      board.position.set(0, 0.12, pz);
      board.castShadow = true;
      pGroup.add(board);
    }

    return pGroup;
  }

  buildForklift() {
    const fl = new THREE.Group();
    fl.name = 'ElectricForklift';

    // Chassis body in safety yellow/red
    const bodyGeo = new THREE.BoxGeometry(2.0, 1.1, 1.3);
    const body = new THREE.Mesh(bodyGeo, this.materials.craneYellow);
    body.position.set(0, 0.65, 0);
    body.castShadow = true;
    fl.add(body);

    // Counterweight rear
    const cw = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 1.25), this.materials.steelDark);
    cw.position.set(-0.9, 0.65, 0);
    fl.add(cw);

    // 4 Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.28, 14);
    [[-0.6, -0.65], [-0.6, 0.65], [0.6, -0.65], [0.6, 0.65]].forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, this.materials.rubberTire);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.32, wz);
      wheel.castShadow = true;
      fl.add(wheel);
    });

    // Overhead protective cage guard
    const cage = this.createPerimeterRailing(1.4, 1.2, 1.5, this.materials.steelDark);
    cage.position.set(-0.1, 1.1, 0);
    fl.add(cage);

    // Dual vertical mast I-beam uprights
    const mastL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 0.12), this.materials.steelSilver);
    mastL.position.set(1.1, 1.3, -0.4);
    fl.add(mastL);

    const mastR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 0.12), this.materials.steelSilver);
    mastR.position.set(1.1, 1.3, 0.4);
    fl.add(mastR);

    // Lifting forks
    const forkGeo = new THREE.BoxGeometry(1.2, 0.06, 0.14);
    const fork1 = new THREE.Mesh(forkGeo, this.materials.steelDark);
    fork1.position.set(1.6, 0.18, -0.28);
    const fork2 = new THREE.Mesh(forkGeo, this.materials.steelDark);
    fork2.position.set(1.6, 0.18, 0.28);
    fl.add(fork1);
    fl.add(fork2);

    return fl;
  }

  buildSteelSuperstructure(root) {
    const structGroup = new THREE.Group();
    structGroup.name = 'SteelSuperstructure';

    const colX = [0, 8, 16, 24];
    const colZ = [-8, 0, 8, 14];
    const floorHeights = [4.2, 8.4, 12.6, 16.8, 21.0];

    colX.forEach((x) => {
      colZ.forEach((z) => {
        if (x === 8 && z === 0) return;

        const colGeo = new THREE.BoxGeometry(0.45, 21.5, 0.45);
        const col = new THREE.Mesh(colGeo, this.materials.steelDark);
        col.position.set(x, 10.75 + 0.9, z);
        col.castShadow = true;
        structGroup.add(col);
        this.elements.steelColumns.push(col);
      });
    });

    floorHeights.forEach((h) => {
      colX.forEach((x) => {
        for (let i = 0; i < colZ.length - 1; i++) {
          const z1 = colZ[i];
          const z2 = colZ[i + 1];
          const beam = this.createIBeam(z2 - z1, 0.4, 0.3);
          beam.rotation.y = Math.PI / 2;
          beam.position.set(x, h + 0.9, (z1 + z2) / 2);
          structGroup.add(beam);
          this.elements.steelBeams.push(beam);
        }
      });

      colZ.forEach((z) => {
        for (let i = 0; i < colX.length - 1; i++) {
          const x1 = colX[i];
          const x2 = colX[i + 1];
          const beam = this.createIBeam(x2 - x1, 0.4, 0.3);
          beam.position.set((x1 + x2) / 2, h + 0.9, z);
          structGroup.add(beam);
          this.elements.steelBeams.push(beam);
        }
      });

      const slabGeo = new THREE.BoxGeometry(24.5, 0.35, 22.5);
      const slab = new THREE.Mesh(slabGeo, this.materials.concrete);
      slab.position.set(12, h + 0.9, 3);
      slab.castShadow = true;
      slab.receiveShadow = true;
      structGroup.add(slab);
      this.elements.floorSlabs.push(slab);
    });

    root.add(structGroup);
  }

  createIBeam(length, height = 0.5, flangeWidth = 0.4) {
    const beamGroup = new THREE.Group();
    const t = 0.06;

    const top = new THREE.Mesh(new THREE.BoxGeometry(length, t, flangeWidth), this.materials.steelDark);
    top.position.y = height / 2;
    top.castShadow = true;
    beamGroup.add(top);

    const bottom = new THREE.Mesh(new THREE.BoxGeometry(length, t, flangeWidth), this.materials.steelDark);
    bottom.position.y = -height / 2;
    bottom.castShadow = true;
    beamGroup.add(bottom);

    const web = new THREE.Mesh(new THREE.BoxGeometry(length, height - 2 * t, t), this.materials.steelDark);
    web.castShadow = true;
    beamGroup.add(web);

    return beamGroup;
  }

  buildOfficeTowerAndFacade(root) {
    const towerGroup = new THREE.Group();
    towerGroup.name = 'OfficeTowerEnvelope';

    const stories = 5;
    const storyHeight = 4.2;
    const baseElevation = 0.9;

    // South Facade
    for (let floor = 0; floor < stories; floor++) {
      const yPos = baseElevation + floor * storyHeight + storyHeight / 2;

      const interiorLightPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(23.5, storyHeight - 0.4),
        this.materials.glassLit
      );
      interiorLightPlane.position.set(12, yPos, 13.8);
      interiorLightPlane.visible = false;
      towerGroup.add(interiorLightPlane);
      this.elements.officeInteriorLights.push(interiorLightPlane);

      for (let col = 0; col < 6; col++) {
        const xPos = 1.8 + col * 4.0;
        const panelGroup = new THREE.Group();
        panelGroup.position.set(xPos, yPos, 14.1);

        const glass = new THREE.Mesh(new THREE.BoxGeometry(3.8, storyHeight - 0.2, 0.08), this.materials.glassFacade);
        glass.castShadow = true;
        panelGroup.add(glass);

        const mullionH = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.1, 0.12), this.materials.mullionBlack);
        panelGroup.add(mullionH);

        const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.1, storyHeight, 0.12), this.materials.mullionBlack);
        panelGroup.add(mullionV);

        towerGroup.add(panelGroup);
        this.elements.facadePanels.push(panelGroup);
      }
    }

    // East Facade
    for (let floor = 0; floor < stories; floor++) {
      const yPos = baseElevation + floor * storyHeight + storyHeight / 2;

      for (let col = 0; col < 5; col++) {
        const zPos = -6 + col * 4.4;
        const panelGroup = new THREE.Group();
        panelGroup.position.set(24.2, yPos, zPos);
        panelGroup.rotation.y = Math.PI / 2;

        const glass = new THREE.Mesh(new THREE.BoxGeometry(4.2, storyHeight - 0.2, 0.08), this.materials.glassFacade);
        panelGroup.add(glass);

        const mullionH = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.1, 0.12), this.materials.mullionBlack);
        panelGroup.add(mullionH);

        towerGroup.add(panelGroup);
        this.elements.facadePanels.push(panelGroup);
      }
    }

    // Modern Red Entrance Canopy (Ground floor)
    const canopyGeo = new THREE.BoxGeometry(8, 0.35, 4.5);
    const canopy = new THREE.Mesh(canopyGeo, this.materials.coreRedAccent);
    canopy.position.set(12, 4.5, 16.2);
    canopy.castShadow = true;
    towerGroup.add(canopy);

    const entranceGlass = new THREE.Mesh(new THREE.BoxGeometry(6, 3.8, 0.1), this.materials.glassLit);
    entranceGlass.position.set(12, 2.5, 14.2);
    towerGroup.add(entranceGlass);

    root.add(towerGroup);
  }

  buildRooftopAndSolar(root) {
    const roofGroup = new THREE.Group();
    roofGroup.name = 'RooftopFeatures';
    const roofY = 0.9 + 5 * 4.2;

    const parapetS = new THREE.Mesh(new THREE.BoxGeometry(24.6, 1.0, 0.4), this.materials.concrete);
    parapetS.position.set(12, roofY + 0.5, 14.1);
    roofGroup.add(parapetS);

    const parapetE = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.0, 22.6), this.materials.concrete);
    parapetE.position.set(24.1, roofY + 0.5, 3);
    roofGroup.add(parapetE);

    // Solar PV Panels
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        const solarGroup = new THREE.Group();
        solarGroup.position.set(4 + c * 3.6, roofY + 0.8, -4 + r * 5.0);

        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6), this.materials.steelSilver);
        leg.position.y = 0.3;
        solarGroup.add(leg);

        const panel = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 2.2), this.materials.solarCell);
        panel.rotation.x = -Math.PI / 8;
        panel.position.y = 0.6;
        panel.castShadow = true;
        solarGroup.add(panel);

        roofGroup.add(solarGroup);
        this.elements.solarPanels.push(solarGroup);
      }
    }

    // HVAC Chillers
    for (let i = 0; i < 2; i++) {
      const hvacGroup = new THREE.Group();
      hvacGroup.position.set(19, roofY + 0.9, 5 + i * 5);

      const unitBox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 2.6), this.materials.steelSilver);
      unitBox.position.y = 0.9;
      unitBox.castShadow = true;
      hvacGroup.add(unitBox);

      const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 16), this.materials.steelDark);
      fan.position.y = 1.85;
      hvacGroup.add(fan);

      roofGroup.add(hvacGroup);
      this.elements.hvacUnits.push(hvacGroup);
    }

    root.add(roofGroup);
  }

  buildRailAndGantryCrane(root) {
    const railGroup = new THREE.Group();
    railGroup.name = 'RailAndGantryIntermodal';
    railGroup.position.set(0, 0, -26);

    const ballast = new THREE.Mesh(new THREE.PlaneGeometry(160, 14), this.materials.railGravel);
    ballast.rotation.x = -Math.PI / 2;
    ballast.position.y = 0.02;
    ballast.receiveShadow = true;
    railGroup.add(ballast);

    // Dual Tracks
    [-3, 3].forEach((trackZ) => {
      [-0.8, 0.8].forEach((railOffset) => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(160, 0.15, 0.1), this.materials.railTrack);
        rail.position.set(0, 0.2, trackZ + railOffset);
        railGroup.add(rail);
      });

      for (let rx = -75; rx <= 75; rx += 1.8) {
        const tie = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 2.2), this.materials.steelDark);
        tie.position.set(rx, 0.08, trackZ);
        railGroup.add(tie);
      }
    });

    // Massive Red Portal Gantry Crane (matching screenshot 3)
    const gantryGroup = new THREE.Group();
    gantryGroup.position.set(-14, 0, 0);

    const legL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 15, 2.0), this.materials.coreRedAccent);
    legL.position.set(0, 7.5, -6.5);
    legL.castShadow = true;
    gantryGroup.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 15, 2.0), this.materials.coreRedAccent);
    legR.position.set(0, 7.5, 6.5);
    legR.castShadow = true;
    gantryGroup.add(legR);

    const topGirder = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 17), this.materials.coreRedAccent);
    topGirder.position.set(0, 15, 0);
    topGirder.castShadow = true;
    gantryGroup.add(topGirder);

    const hoistTrolley = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.8, 3.2), this.materials.craneYellow);
    hoistTrolley.position.set(0, 13.5, 0);
    gantryGroup.add(hoistTrolley);

    const spreaderBar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 6.2), this.materials.steelDark);
    spreaderBar.position.set(0, 7.0, 0);
    spreaderBar.castShadow = true;
    gantryGroup.add(spreaderBar);

    railGroup.add(gantryGroup);
    this.elements.railGantry = gantryGroup;

    // Freight Train
    const trainGroup = new THREE.Group();
    trainGroup.position.set(-10, 0, 3);

    const loco = new THREE.Mesh(new THREE.BoxGeometry(14, 3.6, 2.8), this.materials.coreRedAccent);
    loco.position.set(0, 2.2, 0);
    loco.castShadow = true;
    trainGroup.add(loco);

    const containerColors = [this.materials.coreRedAccent, this.materials.truckWhite, this.materials.truckBlue];
    for (let c = 1; c <= 3; c++) {
      const wagon = new THREE.Mesh(new THREE.BoxGeometry(16, 0.8, 2.6), this.materials.steelDark);
      wagon.position.set(c * 18, 0.8, 0);
      trainGroup.add(wagon);

      const cont = new THREE.Mesh(new THREE.BoxGeometry(14, 3.2, 2.5), containerColors[c - 1]);
      cont.position.set(c * 18, 2.8, 0);
      cont.castShadow = true;
      trainGroup.add(cont);
    }

    railGroup.add(trainGroup);
    this.elements.trains.push(trainGroup);

    root.add(railGroup);
  }

  buildVehiclesAndMachinery(root) {
    const fleetGroup = new THREE.Group();
    fleetGroup.name = 'VehicleFleet';

    // Detailed Trucks matching Image 2 & reference screenshots
    // Truck 1: Blue & White (matching Image 2)
    const truck1 = this.createDeliveryTruck(this.materials.truckBlue);
    truck1.position.set(-16, 0, 24);
    fleetGroup.add(truck1);
    this.elements.trucks.push(truck1);

    // Truck 2: Red & White (Emons style)
    const truck2 = this.createDeliveryTruck(this.materials.truckRed);
    truck2.position.set(-5, 0, 24);
    fleetGroup.add(truck2);
    this.elements.trucks.push(truck2);

    // Truck 3: Highway transit truck
    const truck3 = this.createDeliveryTruck(this.materials.truckBlue);
    truck3.position.set(38, 0, 8);
    truck3.rotation.y = Math.PI / 2;
    fleetGroup.add(truck3);
    this.elements.trucks.push(truck3);

    // Realistic Hydraulic Excavator (matching Image 3) positioned at pit edge aiming into trench
    const excavator = this.createExcavator();
    excavator.position.set(22, 0, 4);
    excavator.rotation.y = -Math.PI * 0.75;
    fleetGroup.add(excavator);
    // this.elements.excavator set inside createExcavator()

    root.add(fleetGroup);
  }

  buildLandscapingAndTrees(root) {
    const treesGroup = new THREE.Group();
    treesGroup.name = 'LandscapingTrees';

    const treeCoordinates = [
      [-36, 38], [-28, 42], [-22, 37], [-15, 41], [-8, 38], [2, 42], [10, 39], [18, 43], [26, 39], [34, 42], [42, 37],
      [-42, 22], [-46, 12], [-44, 2], [-48, -10], [-43, -20], [-40, -32],
      [46, 18], [50, 4], [48, -8], [45, -22],
      [36, 12], [32, -18], [28, -24], [-28, -14]
    ];

    treeCoordinates.forEach(([x, z], idx) => {
      const tree = new THREE.Group();
      const scale = 0.8 + (Math.sin(x * 12 + z) * 0.35);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18 * scale, 0.28 * scale, 3.0 * scale, 6),
        this.materials.treeTrunk
      );
      trunk.position.y = (1.5 * scale);
      trunk.castShadow = true;
      tree.add(trunk);

      const foliageMat = (idx % 2 === 0) ? this.materials.treeTeal : this.materials.treeCyan;
      const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8 * scale, 1), foliageMat);
      foliage.position.y = (3.8 * scale);
      foliage.castShadow = true;
      tree.add(foliage);

      const foliageTop = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2 * scale, 1), foliageMat);
      foliageTop.position.y = (4.9 * scale);
      foliageTop.castShadow = true;
      tree.add(foliageTop);

      tree.position.set(x, 0, z);
      treesGroup.add(tree);
      this.elements.trees.push(tree);
    });

    root.add(treesGroup);
  }

  buildSparksAndAtmosphere(root) {
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      colors[i * 3 + 2] = 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    root.add(particles);
    this.elements.particles = particles;
  }
}
