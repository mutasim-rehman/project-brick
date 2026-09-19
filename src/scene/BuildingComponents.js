import * as THREE from 'three';

// Procedural 3D model generator for the construction site, tower crane, warehouse, office tower, and infrastructure
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
      particles: null
    };
  }

  createMaterials() {
    return {
      ground: new THREE.MeshStandardMaterial({
        color: 0xf1f3f6,
        roughness: 0.95,
        metalness: 0.05,
      }),
      excavationSoil: new THREE.MeshStandardMaterial({
        color: 0xc4b7a6,
        roughness: 0.98,
        metalness: 0.0,
      }),
      concrete: new THREE.MeshStandardMaterial({
        color: 0xdde1e7,
        roughness: 0.85,
        metalness: 0.1,
      }),
      concreteCore: new THREE.MeshStandardMaterial({
        color: 0xe6e9ef,
        roughness: 0.8,
        metalness: 0.1,
      }),
      coreRedAccent: new THREE.MeshStandardMaterial({
        color: 0xff3322,
        roughness: 0.4,
        metalness: 0.2,
      }),
      craneRed: new THREE.MeshStandardMaterial({
        color: 0xff2e1f,
        roughness: 0.35,
        metalness: 0.4,
      }),
      craneYellow: new THREE.MeshStandardMaterial({
        color: 0xffb703,
        roughness: 0.4,
        metalness: 0.2,
      }),
      steelDark: new THREE.MeshStandardMaterial({
        color: 0x242831,
        roughness: 0.35,
        metalness: 0.8,
      }),
      steelSilver: new THREE.MeshStandardMaterial({
        color: 0x8a95a5,
        roughness: 0.4,
        metalness: 0.7,
      }),
      palletWood: new THREE.MeshStandardMaterial({
        color: 0xd7aa7a,
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
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.78,
      }),
      glassLit: new THREE.MeshStandardMaterial({
        color: 0xffe6a3,
        emissive: 0xffc048,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.1,
      }),
      mullionBlack: new THREE.MeshStandardMaterial({
        color: 0x181a1f,
        roughness: 0.5,
        metalness: 0.6,
      }),
      solarCell: new THREE.MeshStandardMaterial({
        color: 0x11214a,
        roughness: 0.15,
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
        color: 0x3d434d,
        roughness: 0.9,
      }),
      roadStripe: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.6,
      }),
      safetyOrange: new THREE.MeshStandardMaterial({
        color: 0xff6b35,
        roughness: 0.4,
      }),
      truckWhite: new THREE.MeshStandardMaterial({
        color: 0xf5f6fa,
        roughness: 0.3,
        metalness: 0.2,
      }),
      truckRed: new THREE.MeshStandardMaterial({
        color: 0xff2e1f,
        roughness: 0.3,
        metalness: 0.3,
      }),
      railTrack: new THREE.MeshStandardMaterial({
        color: 0x57606f,
        roughness: 0.5,
        metalness: 0.8,
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

    // Surrounding asphalt roads (matching screenshots layout)
    // Horizontal road across front
    const frontRoadGeo = new THREE.PlaneGeometry(160, 10);
    const frontRoad = new THREE.Mesh(frontRoadGeo, this.materials.asphalt);
    frontRoad.rotation.x = -Math.PI / 2;
    frontRoad.position.set(0, 0.02, 34);
    frontRoad.receiveShadow = true;
    terrainGroup.add(frontRoad);

    // Road dashed stripes
    for (let x = -70; x <= 70; x += 8) {
      const stripeGeo = new THREE.PlaneGeometry(4, 0.4);
      const stripe = new THREE.Mesh(stripeGeo, this.materials.roadStripe);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(x, 0.03, 34);
      terrainGroup.add(stripe);
    }

    // Side connecting road
    const sideRoadGeo = new THREE.PlaneGeometry(10, 80);
    const sideRoad = new THREE.Mesh(sideRoadGeo, this.materials.asphalt);
    sideRoad.rotation.x = -Math.PI / 2;
    sideRoad.position.set(38, 0.02, -5);
    sideRoad.receiveShadow = true;
    terrainGroup.add(sideRoad);

    // Logistics loading apron (concrete yard in front of warehouse)
    const apronGeo = new THREE.PlaneGeometry(44, 22);
    const apron = new THREE.Mesh(apronGeo, this.materials.concrete);
    apron.rotation.x = -Math.PI / 2;
    apron.position.set(-10, 0.02, 18);
    apron.receiveShadow = true;
    terrainGroup.add(apron);

    // Parking slot markings on apron
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

    // Excavation trench (recessed below 0)
    // The pit floor
    const pitFloorGeo = new THREE.BoxGeometry(32, 1.2, 28);
    const pitFloor = new THREE.Mesh(pitFloorGeo, this.materials.excavationSoil);
    pitFloor.position.set(12, -0.6, 2);
    pitFloor.receiveShadow = true;
    pitGroup.add(pitFloor);

    // Excavation retaining slope/walls
    const wallNorth = new THREE.Mesh(new THREE.BoxGeometry(32.8, 1.4, 0.8), this.materials.excavationSoil);
    wallNorth.position.set(12, -0.4, -12);
    pitGroup.add(wallNorth);

    const wallEast = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 28.8), this.materials.excavationSoil);
    wallEast.position.set(28, -0.4, 2);
    pitGroup.add(wallEast);

    // Site perimeter safety fences with orange and white posts
    const fenceGroup = new THREE.Group();
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
    const railGeo = new THREE.BoxGeometry(4, 0.08, 0.04);

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

    // Site office container / mobile trailers
    const officeBoxGeo = new THREE.BoxGeometry(6, 2.5, 2.6);
    const officeBox = new THREE.Mesh(officeBoxGeo, this.materials.truckWhite);
    officeBox.position.set(33, 1.25, 22);
    officeBox.castShadow = true;
    officeBox.receiveShadow = true;
    pitGroup.add(officeBox);

    // Office roof red trim
    const officeTrim = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.2, 2.8), this.materials.craneRed);
    officeTrim.position.set(33, 2.5, 22);
    pitGroup.add(officeTrim);

    // Second stacked container
    const officeBox2 = new THREE.Mesh(officeBoxGeo, this.materials.concrete);
    officeBox2.position.set(33, 3.85, 22);
    officeBox2.castShadow = true;
    pitGroup.add(officeBox2);

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

    // Footing foundation pile pads
    const padGeo = new THREE.BoxGeometry(2.4, 0.5, 2.4);
    for (let x = -10; x <= 10; x += 10) {
      for (let z = -8; z <= 8; z += 8) {
        const pad = new THREE.Mesh(padGeo, this.materials.concreteDark || this.materials.concrete);
        pad.position.set(12 + x, 0.95, 2 + z);
        pad.castShadow = true;
        fGroup.add(pad);
      }
    }

    // Reinforced concrete shear core (central elevator & service shaft)
    const coreGroup = new THREE.Group();
    coreGroup.name = 'ReinforcedCoreGroup';

    // Main concrete core block
    const coreGeo = new THREE.BoxGeometry(6.5, 24, 6.5);
    const coreMesh = new THREE.Mesh(coreGeo, this.materials.concreteCore);
    coreMesh.position.set(7, 12, 0);
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    coreGroup.add(coreMesh);

    // Red architectural vertical accent stripe on core (matching screenshot 5's striking red tower section!)
    const redAccentGeo = new THREE.BoxGeometry(6.6, 24, 2.4);
    const redAccent = new THREE.Mesh(redAccentGeo, this.materials.coreRedAccent);
    redAccent.position.set(7, 12, 2.1);
    redAccent.castShadow = true;
    coreGroup.add(redAccent);

    // Elevator doors / service openings on each floor level
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

  buildTowerCrane(root) {
    const craneGroup = new THREE.Group();
    craneGroup.name = 'TowerCrane';
    craneGroup.position.set(22, 0, -6);

    // Crane concrete base footing
    const craneBaseGeo = new THREE.BoxGeometry(4.2, 1.2, 4.2);
    const craneBase = new THREE.Mesh(craneBaseGeo, this.materials.concrete);
    craneBase.position.y = 0.6;
    craneBase.castShadow = true;
    craneGroup.add(craneBase);

    // Vertical Mast Tower (lattice steel tower)
    const mastHeight = 32;
    const mastGeo = new THREE.BoxGeometry(1.8, mastHeight, 1.8);
    const mast = new THREE.Mesh(mastGeo, this.materials.craneRed);
    mast.position.y = 0.6 + mastHeight / 2;
    mast.castShadow = true;
    craneGroup.add(mast);

    // Slewing / Rotating Top Assembly
    const slewingHead = new THREE.Group();
    slewingHead.position.y = 0.6 + mastHeight;

    // Operator Cabin
    const cabGeo = new THREE.BoxGeometry(1.6, 2.0, 2.2);
    const cab = new THREE.Mesh(cabGeo, this.materials.truckWhite);
    cab.position.set(1.4, 1.0, 0);
    cab.castShadow = true;
    slewingHead.add(cab);

    // Cabin glass window
    const cabGlass = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 1.6), this.materials.glassLit);
    cabGlass.position.set(2.21, 1.2, 0);
    slewingHead.add(cabGlass);

    // Crane Tower Top / Apex Mast
    const apexGeo = new THREE.ConeGeometry(1.2, 6, 4);
    const apex = new THREE.Mesh(apexGeo, this.materials.craneRed);
    apex.position.set(0, 3.0, 0);
    apex.rotation.y = Math.PI / 4;
    slewingHead.add(apex);

    // Counter-Jib (rear boom with heavy ballast weights)
    const counterJibGeo = new THREE.BoxGeometry(1.2, 1.2, 12);
    const counterJib = new THREE.Mesh(counterJibGeo, this.materials.craneRed);
    counterJib.position.set(0, 1.2, 6);
    counterJib.castShadow = true;
    slewingHead.add(counterJib);

    // Concrete counterweights
    const weightGeo = new THREE.BoxGeometry(2.4, 2.0, 3.2);
    const weight = new THREE.Mesh(weightGeo, this.materials.concrete);
    weight.position.set(0, 1.6, 10.5);
    weight.castShadow = true;
    slewingHead.add(weight);

    // Front Working Jib / Boom (long truss extending out)
    const boomLength = 34;
    const boomGeo = new THREE.BoxGeometry(1.2, 1.2, boomLength);
    const boom = new THREE.Mesh(boomGeo, this.materials.craneRed);
    boom.position.set(0, 1.2, -boomLength / 2);
    boom.castShadow = true;
    slewingHead.add(boom);

    // Trolley moving along the boom
    const trolleyGroup = new THREE.Group();
    const trolleyGeo = new THREE.BoxGeometry(1.4, 0.5, 1.6);
    const trolley = new THREE.Mesh(trolleyGeo, this.materials.craneYellow);
    trolley.castShadow = true;
    trolleyGroup.add(trolley);

    // Hoist cables descending from trolley
    const cableGeo = new THREE.CylinderGeometry(0.04, 0.04, 12, 6);
    const cable = new THREE.Mesh(cableGeo, this.materials.steelSilver);
    cable.position.y = -6;
    trolleyGroup.add(cable);

    // Hook block
    const hookGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const hook = new THREE.Mesh(hookGeo, this.materials.craneYellow);
    hook.position.y = -12;
    hook.castShadow = true;
    trolleyGroup.add(hook);

    // Suspended Steel I-Beam hanging from hook!
    const suspendedBeam = this.createIBeam(6, 0.6, 0.4);
    suspendedBeam.position.set(0, -12.6, 0);
    suspendedBeam.rotation.y = Math.PI / 4;
    suspendedBeam.castShadow = true;
    trolleyGroup.add(suspendedBeam);

    trolleyGroup.position.set(0, 0.6, -16);
    slewingHead.add(trolleyGroup);

    craneGroup.add(slewingHead);
    root.add(craneGroup);

    this.elements.crane = {
      root: craneGroup,
      slewingHead,
      trolleyGroup,
      suspendedBeam
    };
  }

  createIBeam(length, height = 0.5, flangeWidth = 0.4) {
    const beamGroup = new THREE.Group();
    const t = 0.06; // thickness

    // Top flange
    const top = new THREE.Mesh(new THREE.BoxGeometry(length, t, flangeWidth), this.materials.steelDark);
    top.position.y = height / 2;
    top.castShadow = true;
    beamGroup.add(top);

    // Bottom flange
    const bottom = new THREE.Mesh(new THREE.BoxGeometry(length, t, flangeWidth), this.materials.steelDark);
    bottom.position.y = -height / 2;
    bottom.castShadow = true;
    beamGroup.add(bottom);

    // Central Web
    const web = new THREE.Mesh(new THREE.BoxGeometry(length, height - 2 * t, t), this.materials.steelDark);
    web.position.y = 0;
    web.castShadow = true;
    beamGroup.add(web);

    return beamGroup;
  }

  buildSteelSuperstructure(root) {
    const structGroup = new THREE.Group();
    structGroup.name = 'SteelSuperstructure';

    // Multi-story office tower steel frame
    const colX = [0, 8, 16, 24];
    const colZ = [-8, 0, 8, 14];
    const floorHeights = [4.2, 8.4, 12.6, 16.8, 21.0];

    // Vertical Columns
    colX.forEach((x) => {
      colZ.forEach((z) => {
        // Skip some positions for elevator core
        if (x === 8 && z === 0) return;

        const colGeo = new THREE.BoxGeometry(0.45, 21.5, 0.45);
        const col = new THREE.Mesh(colGeo, this.materials.steelDark);
        col.position.set(x, 10.75 + 0.9, z);
        col.castShadow = true;
        structGroup.add(col);
        this.elements.steelColumns.push(col);
      });
    });

    // Horizontal Floor Beams and Concrete Decks for each story
    floorHeights.forEach((h, floorIdx) => {
      // Longitudinal beams
      colX.forEach((x) => {
        for (let i = 0; i < colZ.length - 1; i++) {
          const z1 = colZ[i];
          const z2 = colZ[i + 1];
          const beamLen = z2 - z1;
          const beam = this.createIBeam(beamLen, 0.4, 0.3);
          beam.rotation.y = Math.PI / 2;
          beam.position.set(x, h + 0.9, (z1 + z2) / 2);
          structGroup.add(beam);
          this.elements.steelBeams.push(beam);
        }
      });

      // Transverse beams
      colZ.forEach((z) => {
        for (let i = 0; i < colX.length - 1; i++) {
          const x1 = colX[i];
          const x2 = colX[i + 1];
          const beamLen = x2 - x1;
          const beam = this.createIBeam(beamLen, 0.4, 0.3);
          beam.position.set((x1 + x2) / 2, h + 0.9, z);
          structGroup.add(beam);
          this.elements.steelBeams.push(beam);
        }
      });

      // Precast Concrete Floor Plate Slabs
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

    // Warehouse Precast Rear and Side Walls (cutaway open front for full visibility like screenshot 1 & 2!)
    const rearWallGeo = new THREE.BoxGeometry(32, 10, 0.6);
    const rearWall = new THREE.Mesh(rearWallGeo, this.materials.concreteCore);
    rearWall.position.set(0, 5.3, -13);
    rearWall.castShadow = true;
    whGroup.add(rearWall);
    this.elements.warehouseWalls.push(rearWall);

    // Side Left Wall with Red Corporate Branding Stripe (matching Emons warehouse screenshot 1!)
    const sideWallGeo = new THREE.BoxGeometry(0.6, 10, 26);
    const sideWall = new THREE.Mesh(sideWallGeo, this.materials.concreteCore);
    sideWall.position.set(-16, 5.3, 0);
    sideWall.castShadow = true;
    whGroup.add(sideWall);
    this.elements.warehouseWalls.push(sideWall);

    const redStripe = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 26), this.materials.craneRed);
    redStripe.position.set(-16, 9.4, 0);
    whGroup.add(redStripe);
    this.elements.warehouseWalls.push(redStripe);

    // Industrial Open-Web Roof Trusses
    for (let z = -10; z <= 10; z += 5) {
      const trussGroup = new THREE.Group();
      const trussTop = new THREE.Mesh(new THREE.BoxGeometry(32, 0.25, 0.25), this.materials.steelDark);
      trussTop.position.set(0, 10.2, z);
      trussGroup.add(trussTop);

      const trussBottom = new THREE.Mesh(new THREE.BoxGeometry(32, 0.2, 0.2), this.materials.steelDark);
      trussBottom.position.set(0, 8.8, z);
      trussGroup.add(trussBottom);

      // Webbing diagonals
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

    // High-Bay Industrial Pallet Racking (Direct match to screenshot 1 & 2!)
    // 4 major racking aisles
    const rackAisleX = [-9, -3, 3, 9];
    const rackLevels = [1.8, 3.8, 5.8, 7.8];

    rackAisleX.forEach((rx) => {
      const rackGroup = new THREE.Group();
      rackGroup.position.set(rx, 0, 0);

      // Steel upright columns (galvanized/silver or safety orange)
      const uprightZ = [-9, -4.5, 0, 4.5, 9];
      uprightZ.forEach((uz) => {
        [-1.2, 1.2].forEach((ux) => {
          const upright = new THREE.Mesh(new THREE.BoxGeometry(0.15, 8.4, 0.15), this.materials.steelSilver);
          upright.position.set(ux, 4.8, uz);
          upright.castShadow = true;
          rackGroup.add(upright);
        });
      });

      // Horizontal orange crossbeams for each tier
      rackLevels.forEach((ly) => {
        [-1.2, 1.2].forEach((ux) => {
          const hBeam = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 18.2), this.materials.safetyOrange);
          hBeam.position.set(ux, ly + 0.6, 0);
          rackGroup.add(hBeam);
        });

        // Pallets and Cardboard Boxes stacked on each level!
        for (let bz = -8; bz <= 8; bz += 2.2) {
          // Wooden pallet
          const pallet = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.15, 1.6), this.materials.palletWood);
          pallet.position.set(0, ly + 0.7, bz);
          pallet.castShadow = true;
          rackGroup.add(pallet);

          // Cardboard cartons/packages (variety in sizes and positions)
          const boxHeight = 0.9 + (Math.sin(rx + bz + ly) * 0.3);
          const boxMat = (bz % 4 === 0) ? this.materials.cardboardDark : this.materials.cardboard;
          const box = new THREE.Mesh(new THREE.BoxGeometry(1.6, boxHeight, 1.3), boxMat);
          box.position.set(0, ly + 0.7 + boxHeight / 2, bz);
          box.castShadow = true;
          box.receiveShadow = true;
          rackGroup.add(box);
          this.elements.warehouseBoxes.push(box);
        }
      });

      whGroup.add(rackGroup);
      this.elements.warehouseRacks.push(rackGroup);
    });

    // Automated Roller Conveyor Lines (matching screenshot 1 & 2!)
    const conveyorGroup = new THREE.Group();
    conveyorGroup.position.set(0, 0.6, 8);

    const conveyorBed = new THREE.Mesh(new THREE.BoxGeometry(24, 0.35, 1.6), this.materials.steelDark);
    conveyorBed.position.set(0, 0.6, 0);
    conveyorBed.castShadow = true;
    conveyorGroup.add(conveyorBed);

    // Rollers along conveyor
    for (let cx = -11; cx <= 11; cx += 0.8) {
      const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8), this.materials.steelSilver);
      roller.rotation.x = Math.PI / 2;
      roller.position.set(cx, 0.85, 0);
      conveyorGroup.add(roller);
    }

    // Moving parcels on conveyor
    for (let cx = -9; cx <= 9; cx += 3.5) {
      const parcel = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.9), this.materials.cardboard);
      parcel.position.set(cx, 1.25, 0);
      parcel.castShadow = true;
      conveyorGroup.add(parcel);
    }
    whGroup.add(conveyorGroup);
    this.elements.conveyors.push(conveyorGroup);

    // Electric Forklift in Warehouse (matching screenshot 2!)
    const forkliftGroup = this.buildForklift();
    forkliftGroup.position.set(6, 0.6, 5);
    forkliftGroup.rotation.y = -Math.PI / 3;
    whGroup.add(forkliftGroup);
    this.elements.forklift = forkliftGroup;

    root.add(whGroup);
  }

  buildForklift() {
    const fl = new THREE.Group();
    fl.name = 'ElectricForklift';

    // Chassis body
    const bodyGeo = new THREE.BoxGeometry(1.8, 1.0, 1.2);
    const body = new THREE.Mesh(bodyGeo, this.materials.craneRed);
    body.position.set(0, 0.6, 0);
    body.castShadow = true;
    fl.add(body);

    // Counterweight rear
    const cwGeo = new THREE.BoxGeometry(0.6, 0.8, 1.15);
    const cw = new THREE.Mesh(cwGeo, this.materials.steelDark);
    cw.position.set(-0.8, 0.6, 0);
    fl.add(cw);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 12);
    const wheelMat = this.materials.steelDark;
    [[-0.6, -0.6], [-0.6, 0.6], [0.6, -0.6], [0.6, 0.6]].forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.3, wz);
      wheel.castShadow = true;
      fl.add(wheel);
    });

    // Roll cage canopy
    const cageGeo = new THREE.BoxGeometry(1.2, 1.5, 1.1);
    const cage = new THREE.Mesh(cageGeo, this.materials.steelDark);
    cage.position.set(-0.1, 1.6, 0);
    fl.add(cage);

    // Front mast & lifting forks
    const mast = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.4, 0.9), this.materials.steelSilver);
    mast.position.set(1.0, 1.2, 0);
    fl.add(mast);

    const forkGeo = new THREE.BoxGeometry(1.0, 0.06, 0.12);
    const fork1 = new THREE.Mesh(forkGeo, this.materials.steelDark);
    fork1.position.set(1.4, 0.15, -0.25);
    const fork2 = new THREE.Mesh(forkGeo, this.materials.steelDark);
    fork2.position.set(1.4, 0.15, 0.25);
    fl.add(fork1);
    fl.add(fork2);

    return fl;
  }

  buildOfficeTowerAndFacade(root) {
    const towerGroup = new THREE.Group();
    towerGroup.name = 'OfficeTowerEnvelope';

    // Facade panels grid on 4 faces of office tower (matching screenshot 5!)
    // Floor heights: 4.2m increments, 5 floors total
    const stories = 5;
    const storyHeight = 4.2;
    const baseElevation = 0.9;

    // South Facing Facade (Facing front viewer)
    for (let floor = 0; floor < stories; floor++) {
      const yPos = baseElevation + floor * storyHeight + storyHeight / 2;

      // Warm interior illumination plane behind glass
      const interiorLightPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(23.5, storyHeight - 0.4),
        this.materials.glassLit
      );
      interiorLightPlane.position.set(12, yPos, 13.8);
      interiorLightPlane.visible = false; // Turned on in Phase 6!
      towerGroup.add(interiorLightPlane);
      this.elements.officeInteriorLights.push(interiorLightPlane);

      // Glass Curtain Wall Panels
      for (let col = 0; col < 6; col++) {
        const xPos = 1.8 + col * 4.0;
        const panelGroup = new THREE.Group();
        panelGroup.position.set(xPos, yPos, 14.1);

        // Glass pane
        const glassGeo = new THREE.BoxGeometry(3.8, storyHeight - 0.2, 0.08);
        const glass = new THREE.Mesh(glassGeo, this.materials.glassFacade);
        glass.castShadow = true;
        panelGroup.add(glass);

        // Dark architectural mullions (window frames)
        const mullionH = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.1, 0.12), this.materials.mullionBlack);
        mullionH.position.y = 0;
        panelGroup.add(mullionH);

        const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.1, storyHeight, 0.12), this.materials.mullionBlack);
        mullionV.position.x = 0;
        panelGroup.add(mullionV);

        towerGroup.add(panelGroup);
        this.elements.facadePanels.push(panelGroup);
      }
    }

    // East Facing Facade (Side facing camera)
    for (let floor = 0; floor < stories; floor++) {
      const yPos = baseElevation + floor * storyHeight + storyHeight / 2;

      for (let col = 0; col < 5; col++) {
        const zPos = -6 + col * 4.4;
        const panelGroup = new THREE.Group();
        panelGroup.position.set(24.2, yPos, zPos);
        panelGroup.rotation.y = Math.PI / 2;

        const glassGeo = new THREE.BoxGeometry(4.2, storyHeight - 0.2, 0.08);
        const glass = new THREE.Mesh(glassGeo, this.materials.glassFacade);
        panelGroup.add(glass);

        const mullionH = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.1, 0.12), this.materials.mullionBlack);
        panelGroup.add(mullionH);

        towerGroup.add(panelGroup);
        this.elements.facadePanels.push(panelGroup);
      }
    }

    // Modern Main Entrance Canopy (Ground floor)
    const canopyGeo = new THREE.BoxGeometry(8, 0.35, 4.5);
    const canopy = new THREE.Mesh(canopyGeo, this.materials.coreRedAccent);
    canopy.position.set(12, 4.5, 16.2);
    canopy.castShadow = true;
    towerGroup.add(canopy);

    // Entrance Revolving Doors & Glass Portal
    const entranceGlass = new THREE.Mesh(new THREE.BoxGeometry(6, 3.8, 0.1), this.materials.glassLit);
    entranceGlass.position.set(12, 2.5, 14.2);
    towerGroup.add(entranceGlass);

    root.add(towerGroup);
  }

  buildRooftopAndSolar(root) {
    const roofGroup = new THREE.Group();
    roofGroup.name = 'RooftopFeatures';
    const roofY = 0.9 + 5 * 4.2; // 21.9m

    // Parapet roof border wall
    const parapetGeo = new THREE.BoxGeometry(24.6, 1.0, 0.4);
    const parapetS = new THREE.Mesh(parapetGeo, this.materials.concrete);
    parapetS.position.set(12, roofY + 0.5, 14.1);
    roofGroup.add(parapetS);

    const parapetE = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.0, 22.6), this.materials.concrete);
    parapetE.position.set(24.1, roofY + 0.5, 3);
    roofGroup.add(parapetE);

    // High-Efficiency Solar PV Panel Array (Tilted towards sunlight)
    // 3 rows of 6 solar modules
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        const solarGroup = new THREE.Group();
        solarGroup.position.set(4 + c * 3.6, roofY + 0.8, -4 + r * 5.0);

        // Mounting frame
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6), this.materials.steelSilver);
        leg.position.y = 0.3;
        solarGroup.add(leg);

        // Photovoltaic panel with sleek deep blue silicon material
        const panelGeo = new THREE.BoxGeometry(3.2, 0.08, 2.2);
        const panel = new THREE.Mesh(panelGeo, this.materials.solarCell);
        panel.rotation.x = -Math.PI / 8; // Tilted 22.5 degrees
        panel.position.y = 0.6;
        panel.castShadow = true;
        solarGroup.add(panel);

        roofGroup.add(solarGroup);
        this.elements.solarPanels.push(solarGroup);
      }
    }

    // Industrial HVAC Chillers & Air Handling Units
    for (let i = 0; i < 2; i++) {
      const hvacGroup = new THREE.Group();
      hvacGroup.position.set(19, roofY + 0.9, 5 + i * 5);

      const unitBox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 2.6), this.materials.steelSilver);
      unitBox.position.y = 0.9;
      unitBox.castShadow = true;
      hvacGroup.add(unitBox);

      // Fan grille circle
      const fanGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 16);
      const fan = new THREE.Mesh(fanGeo, this.materials.steelDark);
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

    // Ballast gravel strip for railway
    const ballastGeo = new THREE.PlaneGeometry(160, 14);
    const ballast = new THREE.Mesh(ballastGeo, this.materials.railGravel);
    ballast.rotation.x = -Math.PI / 2;
    ballast.position.y = 0.02;
    ballast.receiveShadow = true;
    railGroup.add(ballast);

    // Dual Railway Tracks (matching screenshot 3!)
    [-3, 3].forEach((trackZ) => {
      // Steel rail tracks
      [-0.8, 0.8].forEach((railOffset) => {
        const railGeo = new THREE.BoxGeometry(160, 0.15, 0.1);
        const rail = new THREE.Mesh(railGeo, this.materials.railTrack);
        rail.position.set(0, 0.2, trackZ + railOffset);
        railGroup.add(rail);
      });

      // Wooden / concrete rail ties
      for (let rx = -75; rx <= 75; rx += 1.8) {
        const tieGeo = new THREE.BoxGeometry(0.3, 0.1, 2.2);
        const tie = new THREE.Mesh(tieGeo, this.materials.steelDark);
        tie.position.set(rx, 0.08, trackZ);
        railGroup.add(tie);
      }
    });

    // Massive Red Portal Gantry Crane (Direct match to screenshot 3!)
    const gantryGroup = new THREE.Group();
    gantryGroup.position.set(-14, 0, 0);

    // Left A-Frame Leg
    const legL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 15, 2.0), this.materials.craneRed);
    legL.position.set(0, 7.5, -6.5);
    legL.castShadow = true;
    gantryGroup.add(legL);

    // Right A-Frame Leg
    const legR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 15, 2.0), this.materials.craneRed);
    legR.position.set(0, 7.5, 6.5);
    legR.castShadow = true;
    gantryGroup.add(legR);

    // Top Crossbeam spanning across the tracks
    const topGirder = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 17), this.materials.craneRed);
    topGirder.position.set(0, 15, 0);
    topGirder.castShadow = true;
    gantryGroup.add(topGirder);

    // Gantry hoist trolley and spreader bar
    const hoistTrolley = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.8, 3.2), this.materials.craneYellow);
    hoistTrolley.position.set(0, 13.5, 0);
    gantryGroup.add(hoistTrolley);

    const spreaderBar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 6.2), this.materials.steelDark);
    spreaderBar.position.set(0, 7.0, 0);
    spreaderBar.castShadow = true;
    gantryGroup.add(spreaderBar);

    railGroup.add(gantryGroup);
    this.elements.railGantry = gantryGroup;

    // Freight Train with Red Cargo Containers (matching screenshot 3!)
    const trainGroup = new THREE.Group();
    trainGroup.position.set(-10, 0, 3);

    // Red Locomotive
    const locoGeo = new THREE.BoxGeometry(14, 3.6, 2.8);
    const loco = new THREE.Mesh(locoGeo, this.materials.craneRed);
    loco.position.set(0, 2.2, 0);
    loco.castShadow = true;
    trainGroup.add(loco);

    // Flatbed wagons with shipping containers
    const containerColors = [this.materials.craneRed, this.materials.truckWhite, this.materials.craneRed];
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

    // Heavy Delivery Trucks in Red & White (matching screenshot 1, 3, 5!)
    const truckPositions = [
      { pos: [-16, 0, 24], rot: 0 },
      { pos: [-6, 0, 24], rot: 0 },
      { pos: [38, 0, 8], rot: Math.PI / 2 }
    ];

    truckPositions.forEach(({ pos, rot }) => {
      const truck = this.createDeliveryTruck();
      truck.position.set(...pos);
      truck.rotation.y = rot;
      fleetGroup.add(truck);
      this.elements.trucks.push(truck);
    });

    // Hydraulic Excavator (operating during Phase 1 Excavation)
    const excavator = this.createExcavator();
    excavator.position.set(16, 0, 6);
    excavator.rotation.y = Math.PI / 4;
    fleetGroup.add(excavator);
    this.elements.excavator = excavator;

    root.add(fleetGroup);
  }

  createDeliveryTruck() {
    const truck = new THREE.Group();

    // Cabin
    const cabGeo = new THREE.BoxGeometry(3.6, 3.2, 2.5);
    const cab = new THREE.Mesh(cabGeo, this.materials.truckRed);
    cab.position.set(5.2, 2.0, 0);
    cab.castShadow = true;
    truck.add(cab);

    // Windshield
    const windShield = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 2.2), this.materials.glassFacade);
    windShield.position.set(7.01, 2.6, 0);
    truck.add(windShield);

    // Long Cargo Trailer
    const trailerGeo = new THREE.BoxGeometry(11, 3.6, 2.6);
    const trailer = new THREE.Mesh(trailerGeo, this.materials.truckRed);
    trailer.position.set(-2.2, 2.4, 0);
    trailer.castShadow = true;
    truck.add(trailer);

    // Wheels (6 wheels)
    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 14);
    const wheelMat = this.materials.steelDark;
    [-6.5, -4.5, -2.5, 4.2, 6.2].forEach((wx) => {
      [-1.3, 1.3].forEach((wz) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(wx, 0.45, wz);
        wheel.castShadow = true;
        truck.add(wheel);
      });
    });

    return truck;
  }

  createExcavator() {
    const ex = new THREE.Group();

    // Track undercarriage
    const trackGeo = new THREE.BoxGeometry(4.2, 0.8, 2.8);
    const track = new THREE.Mesh(trackGeo, this.materials.steelDark);
    track.position.y = 0.4;
    track.castShadow = true;
    ex.add(track);

    // Revolving body
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.8, 2.4), this.materials.craneYellow);
    body.position.set(-0.2, 1.7, 0);
    body.castShadow = true;
    ex.add(body);

    // Boom arm
    const boomGeo = new THREE.BoxGeometry(5.0, 0.6, 0.5);
    const boom = new THREE.Mesh(boomGeo, this.materials.craneYellow);
    boom.rotation.z = Math.PI / 5;
    boom.position.set(2.4, 3.2, 0);
    boom.castShadow = true;
    ex.add(boom);

    // Stick and Digging Bucket
    const stick = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.5, 0.4), this.materials.craneYellow);
    stick.rotation.z = -Math.PI / 4;
    stick.position.set(5.2, 3.6, 0);
    ex.add(stick);

    const bucket = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 1.0), this.materials.steelDark);
    bucket.position.set(6.4, 1.8, 0);
    bucket.castShadow = true;
    ex.add(bucket);

    return ex;
  }

  buildLandscapingAndTrees(root) {
    const treesGroup = new THREE.Group();
    treesGroup.name = 'LandscapingTrees';

    // Stylized Low-Poly Geometric Trees (Exact match to screenshot 1, 2, 5!)
    // Dotting the perimeter and green belts with turquoise/cyan and emerald tones
    const treeCoordinates = [
      // Front green belt
      [-36, 38], [-28, 42], [-22, 37], [-15, 41], [-8, 38], [2, 42], [10, 39], [18, 43], [26, 39], [34, 42], [42, 37],
      // Left buffer zone
      [-42, 22], [-46, 12], [-44, 2], [-48, -10], [-43, -20], [-40, -32],
      // Right edge
      [46, 18], [50, 4], [48, -8], [45, -22],
      // Courtyard islands
      [36, 12], [32, -18], [28, -24], [-28, -14]
    ];

    treeCoordinates.forEach(([x, z], idx) => {
      const tree = new THREE.Group();
      const scale = 0.8 + (Math.sin(x * 12 + z) * 0.35);

      // Slender trunk
      const trunkGeo = new THREE.CylinderGeometry(0.18 * scale, 0.28 * scale, 3.0 * scale, 6);
      const trunk = new THREE.Mesh(trunkGeo, this.materials.treeTrunk);
      trunk.position.y = (1.5 * scale);
      trunk.castShadow = true;
      tree.add(trunk);

      // Faceted crown foliage (low-poly icosahedron / dodecahedron)
      const foliageMat = (idx % 2 === 0) ? this.materials.treeTeal : this.materials.treeCyan;
      const foliageGeo = new THREE.DodecahedronGeometry(1.8 * scale, 1);
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = (3.8 * scale);
      foliage.castShadow = true;
      tree.add(foliage);

      // Secondary layered crown top
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
    // Atmospheric motes & construction dust particles
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      // Warm glow / spark colors
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
