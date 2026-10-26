/**
 * NeighborhoodScene.js
 * SIDE B — Living 1969 Neighborhood (Overhaul Edition)
 * Animated NPCs, time-of-day tinting, water shimmer, ambient life.
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';
import { DialogueBox } from '../ui/DialogueBox.js';

export class NeighborhoodScene extends Phaser.Scene {
  constructor() {
    super('NeighborhoodScene');
  }

  create() {
    this.mapW = 64;
    this.mapH = 48;
    this.tileSize = 16;
    this.worldPixelW = this.mapW * this.tileSize; // 1024 px
    this.worldPixelH = this.mapH * this.tileSize; // 768 px

    this.physics.world.setBounds(0, 0, this.worldPixelW, this.worldPixelH);
    this.cameras.main.setBounds(0, 0, this.worldPixelW, this.worldPixelH);

    // Collision Matrix: true = solid/obstacle
    this.collisionGrid = Array(this.mapH).fill(null).map(() => Array(this.mapW).fill(false));

    // Ground Surface Matrix: 'grass' | 'concrete' | 'road' | 'stone' | 'wood'
    this.groundTypeGrid = Array(this.mapH).fill(null).map(() => Array(this.mapW).fill('grass'));

    this.waterTiles = [];
    this.buildWorldMap();
    this.createStaticProps();
    this.createNPCs();
    this.createPlayer();
    this.setupCamera();
    this.setupFloatingLabels();
    this.setupHUD();
    this.setupTimeOverlay();

    // In-Game Dialogue Box
    this.dialogueBox = new DialogueBox(this);

    this.stepCount = 0;
    this.isMoving = false;
    this.playerFacing = 'down';

    // Companion Dog (Buddy) following state
    this.dogTileX = 10;
    this.dogTileY = 15;
    this.playerTileHistory = [];

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      interact: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    };

    // On-screen Audio button hookup
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.onclick = () => {
        audioManager.init();
        const isMuted = audioManager.toggleMute();
        const label = document.getElementById('audio-label');
        if (label) label.textContent = isMuted ? 'SOUND: OFF' : 'SOUND: ON';
      };
    }

    // HUD toggle button
    const toggleBtn = document.getElementById('toggle-hud-btn');
    const hudCards = document.getElementById('hud-cards-container');
    if (toggleBtn && hudCards) {
      toggleBtn.onclick = () => {
        const collapsed = hudCards.classList.toggle('collapsed');
        toggleBtn.textContent = collapsed ? 'HUD [SHOW ▼]' : 'HUD [HIDE ▲]';
      };
    }

    // Mom's opening dialogue
    if (!gameState.state.quests.introGiven) {
      gameState.setQuest('introGiven', true);
      this.time.delayedCall(400, () => {
        this.dialogueBox.show(
          'Mom',
          'portrait_mom',
          [
            'Good afternoon, honey! It\'s a beautiful Saturday in 1969.',
            'I know you\'ve been saving up every penny for that new Led Zeppelin II album at Mr. Vinyl\'s record shop.',
            'If you want to earn enough before the shop closes at 6:00, finish these chores first:',
            '1. Take out the trash by the garage\n2. Trim the overgrown garden hedges\n3. Deliver Mrs. Miller\'s parcel down the street',
            'Take your time exploring, but don\'t be late for dinner!'
          ]
        );
      });
    }

    // Start ambient NPC wandering
    this.setupNPCAmbience();

    // Start water shimmer
    this.setupWaterAnimation();

    // Start subtle 1969 nostalgic background music
    audioManager.init();
    audioManager.playMusic('ambient');

    this.events.on('resume', () => {
      this.refreshWorldState();
      audioManager.resumeAmbientBGM();
    });
  }

  // --- Multi-Block 1969 Neighborhood Map Construction ---

  buildWorldMap() {
    // 1. Fill ground with grass & flower variations
    for (let y = 0; y < this.mapH; y++) {
      for (let x = 0; x < this.mapW; x++) {
        const rand = (x * 7 + y * 13) % 23;
        let key = 'tile_grass';
        if (rand === 0) key = 'tile_grass_flowers';
        else if (rand < 3) key = 'tile_grass_dark';
        this.add.image(x * 16 + 8, y * 16 + 8, key);
      }
    }

    // 2. Roads & Sidewalks System

    // Main East-West Street (Oakwood Blvd): y = 20–24
    for (let x = 0; x < this.mapW; x++) {
      this.add.image(x * 16 + 8, 20 * 16 + 8, 'tile_sidewalk');
      this.add.image(x * 16 + 8, 21 * 16 + 8, 'tile_road');
      this.add.image(x * 16 + 8, 22 * 16 + 8, (x % 2 === 0) ? 'tile_road_line_h' : 'tile_road');
      this.add.image(x * 16 + 8, 23 * 16 + 8, 'tile_road');
      this.add.image(x * 16 + 8, 24 * 16 + 8, 'tile_sidewalk');

      this.groundTypeGrid[20][x] = 'concrete';
      this.groundTypeGrid[21][x] = 'road';
      this.groundTypeGrid[22][x] = 'road';
      this.groundTypeGrid[23][x] = 'road';
      this.groundTypeGrid[24][x] = 'concrete';
    }

    // North East-West Street: y = 1-3
    for (let x = 32; x < this.mapW; x++) {
      this.add.image(x * 16 + 8, 1 * 16 + 8, 'tile_sidewalk');
      this.add.image(x * 16 + 8, 2 * 16 + 8, 'tile_road');
      this.add.image(x * 16 + 8, 3 * 16 + 8, 'tile_road');

      this.groundTypeGrid[1][x] = 'concrete';
      this.groundTypeGrid[2][x] = 'road';
      this.groundTypeGrid[3][x] = 'road';
    }

    // Main North-South Cross Avenue: x = 27-31
    for (let y = 0; y < this.mapH; y++) {
      this.add.image(27 * 16 + 8, y * 16 + 8, 'tile_sidewalk');
      this.add.image(28 * 16 + 8, y * 16 + 8, 'tile_road');
      this.add.image(29 * 16 + 8, y * 16 + 8, (y % 2 === 0) ? 'tile_road_line_v' : 'tile_road');
      this.add.image(30 * 16 + 8, y * 16 + 8, 'tile_road');
      this.add.image(31 * 16 + 8, y * 16 + 8, 'tile_sidewalk');

      this.groundTypeGrid[y][27] = 'concrete';
      this.groundTypeGrid[y][28] = 'road';
      this.groundTypeGrid[y][29] = 'road';
      this.groundTypeGrid[y][30] = 'road';
      this.groundTypeGrid[y][31] = 'concrete';
    }

    // Crosswalks at main intersection
    for (let cx = 28; cx <= 30; cx++) {
      this.add.image(cx * 16 + 8, 20 * 16 + 8, 'tile_crosswalk');
      this.add.image(cx * 16 + 8, 24 * 16 + 8, 'tile_crosswalk');
      this.groundTypeGrid[20][cx] = 'concrete';
      this.groundTypeGrid[24][cx] = 'concrete';
    }
    for (let cy = 21; cy <= 23; cy++) {
      this.add.image(27 * 16 + 8, cy * 16 + 8, 'tile_crosswalk');
      this.add.image(31 * 16 + 8, cy * 16 + 8, 'tile_crosswalk');
      this.groundTypeGrid[cy][27] = 'concrete';
      this.groundTypeGrid[cy][31] = 'concrete';
    }

    // Concrete Driveways
    for (let dy = 30; dy <= 35; dy++) {
      this.add.image(6 * 16 + 8, dy * 16 + 8, 'tile_driveway');
      this.add.image(7 * 16 + 8, dy * 16 + 8, 'tile_driveway');
      this.groundTypeGrid[dy][6] = 'concrete';
      this.groundTypeGrid[dy][7] = 'concrete';
    }
    for (let dy = 30; dy <= 35; dy++) {
      this.add.image(39 * 16 + 8, dy * 16 + 8, 'tile_driveway');
      this.add.image(40 * 16 + 8, dy * 16 + 8, 'tile_driveway');
      this.groundTypeGrid[dy][39] = 'concrete';
      this.groundTypeGrid[dy][40] = 'concrete';
    }

    // 3. Oakwood Park Pond — animated water tiles (Northwest Block)
    for (let py = 5; py <= 15; py++) {
      for (let px = 6; px <= 22; px++) {
        if ((px === 6 && (py <= 6 || py >= 14)) || (px === 22 && (py <= 6 || py >= 14))) continue;
        if ((px === 7 && (py === 5 || py === 15)) || (px === 21 && (py === 5 || py === 15))) continue;

        const wImg = this.add.image(px * 16 + 8, py * 16 + 8, 'tile_water');
        this.waterTiles.push(wImg);
        this.collisionGrid[py][px] = true;
      }
    }

    // Swimming Ducks on Pond
    this.duckSprites = [];
    const duck1 = this.add.image(10 * 16 + 8, 8 * 16 + 8, 'prop_duck');
    const duck2 = this.add.image(16 * 16 + 8, 11 * 16 + 8, 'prop_duck');
    this.duckSprites.push(duck1, duck2);

    // Animate ducks slowly bobbing
    [duck1, duck2].forEach((duck, i) => {
      this.tweens.add({
        targets: duck,
        y: duck.y + 3,
        duration: 1800 + i * 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });

    // Wooden Pier / Dock on Pond (x: 18, y: 12..14)
    this.add.image(18 * 16 + 8, 13 * 16, 'prop_dock');
    this.collisionGrid[13][18] = false;
    this.collisionGrid[14][18] = false;
    this.groundTypeGrid[13][18] = 'wood';
    this.groundTypeGrid[14][18] = 'wood';

    // 4. Buildings & Houses

    // House 1: Player's House (x = 5..14, y = 26..29)
    this.buildHouse(5, 26, 10, 4, 'tile_roof_red', 'tile_wall_wood', 11, 29);
    // Garage attached to Player's House (x: 6..7, y: 28..29)
    this.add.image(7 * 16, 29 * 16, 'prop_garage');

    // House 2: Mrs. Miller's House (x = 18..24, y = 26..29)
    this.buildHouse(18, 26, 7, 4, 'tile_roof_brown', 'tile_wall_wood', 20, 29);

    // House 3: Neighbor Bob's House (x = 34..43, y = 26..29)
    this.buildHouse(34, 26, 10, 4, 'tile_roof_blue', 'tile_wall_wood', 36, 29);
    this.add.image(40 * 16, 29 * 16, 'prop_garage');

    // House 4: North Suburban House (x = 6..14, y = 1..4)
    this.buildHouse(6, 1, 9, 4, 'tile_roof_red', 'tile_wall_wood', 10, 4);
    this.add.image(7 * 16, 4 * 16, 'prop_garage');

    // House 5: Another house on far right (x = 48..56, y = 26..30)
    this.buildHouse(48, 26, 8, 4, 'tile_roof_brown', 'tile_wall_wood', 50, 29);

    // Building 5: The Record Shop (x = 34..44, y = 5..9)
    this.buildRecordShop(34, 5, 11, 5, 39, 9);

    // 5. Footpaths Connecting All Houses to Main Roads
    const addPath = (x, y, key = 'tile_sidewalk') => {
      if (x >= 0 && x < this.mapW && y >= 0 && y < this.mapH) {
        this.add.image(x * 16 + 8, y * 16 + 8, key);
        this.collisionGrid[y][x] = false;
        this.groundTypeGrid[y][x] = (key === 'tile_footpath') ? 'stone' : 'concrete';
      }
    };

    // A. House 1 (Player's House): Door at (11, 29)
    // Front walk down from door through front yard and gate
    for (let y = 29; y <= 34; y++) addPath(11, y, 'tile_sidewalk');
    addPath(10, 29, 'tile_sidewalk');

    // West walkway connecting Player's house/driveway to Oakwood Blvd
    for (let x = 4; x <= 11; x++) addPath(x, 34, 'tile_sidewalk');
    for (let y = 24; y <= 34; y++) addPath(4, y, 'tile_sidewalk');

    // Side walkway between Player's House and Mrs. Miller's House to Oakwood Blvd
    for (let y = 24; y <= 34; y++) addPath(16, y, 'tile_sidewalk');

    // B. House 2 (Mrs. Miller's House): Door at (20, 29)
    // Front walk down from door to southern residential sidewalk
    for (let y = 29; y <= 34; y++) addPath(20, y, 'tile_sidewalk');

    // Southern Residential Sidewalk (West of Cross Avenue)
    // Seamlessly connects House 1, House 2, driveways, and side walkways to Main Cross Avenue
    for (let x = 4; x <= 27; x++) addPath(x, 34, 'tile_sidewalk');

    // C. House 3 (Neighbor Bob's House): Door at (36, 29)
    // Front walk down from door to southern residential sidewalk
    for (let y = 29; y <= 34; y++) addPath(36, y, 'tile_sidewalk');

    // Side walkway between Cross Avenue and Bob's House to Oakwood Blvd
    for (let y = 24; y <= 34; y++) addPath(33, y, 'tile_sidewalk');

    // Side walkway between Bob's House and House 5 to Oakwood Blvd
    for (let y = 24; y <= 34; y++) addPath(45, y, 'tile_sidewalk');

    // D. House 5 (East Suburban House): Door at (50, 29)
    // Front walk down from door to southern residential sidewalk
    for (let y = 29; y <= 34; y++) addPath(50, y, 'tile_sidewalk');

    // Side walkway east of House 5 to Oakwood Blvd
    for (let y = 24; y <= 34; y++) addPath(57, y, 'tile_sidewalk');

    // Southern Residential Sidewalk (East of Cross Avenue)
    // Seamlessly connects Cross Avenue, Bob's house, Bob's driveway, House 5, and side walkways
    for (let x = 31; x <= 57; x++) addPath(x, 34, 'tile_sidewalk');

    // E. House 4 (North Suburban House): Door at (10, 4)
    // Front walk from door down past front lawn
    for (let y = 4; y <= 6; y++) addPath(10, y, 'tile_sidewalk');
    addPath(7, 5, 'tile_sidewalk');
    addPath(8, 5, 'tile_sidewalk');
    addPath(9, 5, 'tile_sidewalk');

    // North Park Promenade connecting House 4 to Main Cross Avenue
    for (let x = 10; x <= 27; x++) addPath(x, 5, 'tile_footpath');

    // Lakeside Promenade (East side of pond) connecting House 4 area to Oakwood Blvd
    for (let y = 5; y <= 20; y++) addPath(24, y, 'tile_footpath');

    // West Park Path connecting House 4 area to Oakwood Blvd
    for (let y = 5; y <= 20; y++) addPath(4, y, 'tile_footpath');
    for (let x = 4; x <= 10; x++) addPath(x, 6, 'tile_footpath');

    // Dock connector path
    for (let x = 18; x <= 24; x++) addPath(x, 13, 'tile_footpath');

    // F. Building 5 (The Record Shop): Door at (39, 9)
    // Wide front plaza walkway heading South directly to Oakwood Blvd
    for (let y = 9; y <= 20; y++) {
      addPath(38, y, 'tile_sidewalk');
      addPath(39, y, 'tile_sidewalk');
    }

    // Plaza walkway heading West to Main Cross Avenue
    for (let x = 31; x <= 39; x++) addPath(x, 11, 'tile_sidewalk');

    // Walkway heading North to North Street
    for (let y = 3; y <= 11; y++) addPath(45, y, 'tile_sidewalk');
    for (let x = 39; x <= 45; x++) addPath(x, 11, 'tile_sidewalk');

    // 6. Surrounding Picket Fences & Trees
    for (let x = 0; x < this.mapW; x++) {
      this.collisionGrid[0][x] = true;
      this.collisionGrid[this.mapH - 1][x] = true;
      this.add.image(x * 16 + 8, 8, 'tile_fence');
      this.add.image(x * 16 + 8, (this.mapH - 1) * 16 + 8, 'tile_fence');
    }
    for (let y = 0; y < this.mapH; y++) {
      this.collisionGrid[y][0] = true;
      this.collisionGrid[y][this.mapW - 1] = true;
      this.add.image(8, y * 16 + 8, 'tile_fence');
      this.add.image((this.mapW - 1) * 16 + 8, y * 16 + 8, 'tile_fence');
    }

    // Front yard picket fences
    for (let fx = 8; fx <= 15; fx++) {
      if (fx !== 11) {
        this.add.image(fx * 16 + 8, 33 * 16 + 8, 'tile_fence');
        this.collisionGrid[33][fx] = true;
      }
    }
    for (let fx = 17; fx <= 24; fx++) {
      if (fx !== 20) {
        this.add.image(fx * 16 + 8, 33 * 16 + 8, 'tile_fence');
        this.collisionGrid[33][fx] = true;
      }
    }
    for (let fx = 33; fx <= 43; fx++) {
      if (fx !== 33 && fx !== 36 && fx !== 39 && fx !== 40) {
        this.add.image(fx * 16 + 8, 33 * 16 + 8, 'tile_fence');
        this.collisionGrid[33][fx] = true;
      }
    }
    for (let fx = 48; fx <= 56; fx++) {
      if (fx !== 50) {
        this.add.image(fx * 16 + 8, 33 * 16 + 8, 'tile_fence');
        this.collisionGrid[33][fx] = true;
      }
    }

    // Neighborhood Trees
    const treeCoords = [
      [2, 3], [16, 2], [24, 3], [25, 8], [2, 12], [25, 14],
      [2, 26], [14, 38], [17, 36], [2, 36], [15, 38],
      [32, 2], [46, 3], [52, 6], [58, 10], [54, 14],
      [32, 38], [46, 38], [52, 30], [33, 38], [44, 38], [55, 38],
      [25, 30], [25, 36], [5, 40], [60, 26], [60, 34]
    ];

    treeCoords.forEach(([tx, ty]) => {
      this.add.image(tx * 16 + 16, ty * 16 + 16, 'tree_large');
      this.collisionGrid[ty][tx] = true;
      if (ty + 1 < this.mapH) this.collisionGrid[ty + 1][tx] = true;
      if (tx + 1 < this.mapW) this.collisionGrid[ty][tx + 1] = true;
      if (ty + 1 < this.mapH && tx + 1 < this.mapW) this.collisionGrid[ty + 1][tx + 1] = true;
    });

    // Flower beds near houses
    const flowerCoords = [
      [5, 27], [5, 28], [14, 27], [14, 28],
      [17, 27], [17, 28], [18, 27],
      [34, 27], [44, 27], [44, 28]
    ];
    flowerCoords.forEach(([fx, fy]) => {
      this.add.image(fx * 16 + 8, fy * 16 + 8, 'tile_flower_bed');
    });
  }

  buildHouse(startX, startY, width, height, roofKey, wallKey, doorX, doorY) {
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) {
        this.collisionGrid[y][x] = true;
        if (y < startY + 2) {
          this.add.image(x * 16 + 8, y * 16 + 8, roofKey);
        } else if (x === doorX && y === doorY) {
          this.add.image(x * 16 + 8, y * 16 + 8, 'tile_door');
        } else if ((x === startX + 1 || x === startX + width - 2) && y === startY + 2) {
          this.add.image(x * 16 + 8, y * 16 + 8, 'tile_window');
        } else if ((x === startX + 3 || x === startX + width - 4) && y === startY + 2) {
          this.add.image(x * 16 + 8, y * 16 + 8, 'tile_window');
        } else {
          this.add.image(x * 16 + 8, y * 16 + 8, wallKey);
        }
      }
    }
  }

  buildRecordShop(startX, startY, width, height, doorX, doorY) {
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) {
        this.collisionGrid[y][x] = true;
        if (y < startY + 2) {
          this.add.image(x * 16 + 8, y * 16 + 8, 'tile_roof_brown');
        } else if (x === doorX && y === doorY) {
          this.add.image(x * 16 + 8, y * 16 + 8, 'tile_door');
        } else if ((x === startX + 1 || x === startX + width - 2 || x === startX + 4) && y === startY + 2) {
          this.add.image(x * 16 + 8, y * 16 + 8, 'tile_window_shop');
        } else {
          this.add.image(x * 16 + 8, y * 16 + 8, 'tile_wall_brick');
        }
      }
    }
    // Striped Awning & RECORDS banner (positioned gracefully over shop front)
    const facade = this.add.image((startX + 5) * 16 + 8, (startY + 2) * 16 - 2, 'prop_shop_facade');
    facade.setDepth(3);

    // Single, crystal-clear shop front signage (resolution 4)
    this.add.text((startX + 5) * 16 + 8, (startY + 2) * 16 - 11, "MR. VINYL'S RECORDS", {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#ffe57f',
      fontStyle: 'bold',
      resolution: 4
    }).setOrigin(0.5).setDepth(4);

    this.add.text((startX + 5) * 16 + 8, (startY + 2) * 16 + 14, "• LPs • 45s • TAPES • HI-FI •", {
      fontFamily: 'monospace',
      fontSize: '5px',
      color: '#ffffff',
      fontStyle: 'bold',
      resolution: 4
    }).setOrigin(0.5).setDepth(4);
  }

  // --- Static Props & Interactive Entities ---

  createStaticProps() {
    // 1. Oakwood Park Wooden Sign (x: 14, y: 16) — Crisp rustic lake signboard
    const parkSign = this.add.image(14 * 16 + 8, 16 * 16 + 6, 'prop_park_sign');
    parkSign.setDisplaySize(48, 27);
    parkSign.setDepth(3);
    this.collisionGrid[16][14] = true;

    // Single, razor-sharp readable text overlay on park signboard (resolution 4)
    this.add.text(14 * 16 + 8, 16 * 16 + 1, 'OAKWOOD PARK', {
      fontFamily: 'monospace',
      fontSize: '6px',
      color: '#261408',
      fontStyle: 'bold',
      resolution: 4
    }).setOrigin(0.5).setDepth(4);

    this.add.text(14 * 16 + 8, 16 * 16 + 7, 'LAKE & NATURE WALK', {
      fontFamily: 'monospace',
      fontSize: '4.5px',
      color: '#1b4d18',
      fontStyle: 'bold',
      resolution: 4
    }).setOrigin(0.5).setDepth(4);

    // 2. Trash Can outside Player's Garage (x: 3, y: 30) — on west side of garage
    this.trashSprite = this.add.image(3 * 16 + 8, 30 * 16 + 8, 'prop_trash_full');
    this.collisionGrid[30][3] = true;

    // 3. Garden Hedge in Front Yard (x: 14-15, y: 31) — along east property boundary
    this.hedgeSprite = this.add.image(14 * 16 + 8, 31 * 16 + 8, 'prop_hedge_overgrown');
    this.collisionGrid[31][14] = true;

    // Extra hedge row for visual richness
    this.add.image(15 * 16 + 8, 31 * 16 + 8, 'prop_hedge_overgrown');
    this.collisionGrid[31][15] = true;

    // 4. Mrs. Miller's Parcel on Front Porch (x: 8, y: 30) — under front window
    this.parcelSprite = this.add.image(8 * 16 + 8, 30 * 16 + 8, 'prop_parcel');

    // 5. Mailboxes
    this.add.image(12 * 16 + 8, 33 * 16 + 8, 'prop_mailbox');
    this.add.image(19 * 16 + 8, 33 * 16 + 8, 'prop_mailbox');
    this.add.image(35 * 16 + 8, 33 * 16 + 8, 'prop_mailbox');
    this.add.image(51 * 16 + 8, 33 * 16 + 8, 'prop_mailbox');
    this.collisionGrid[33][12] = true;
    this.collisionGrid[33][19] = true;
    this.collisionGrid[33][35] = true;
    this.collisionGrid[33][51] = true;

    // 6. Park Benches
    this.add.image(11 * 16 + 8, 4 * 16 + 8, 'prop_bench');
    this.add.image(21 * 16 + 8, 15 * 16 + 8, 'prop_bench');
    this.collisionGrid[4][11] = true;
    this.collisionGrid[15][21] = true;

    // 7. June's 1969 Transistor Radio in Park (x: 16, y: 15)
    this.radioSprite = this.add.image(16 * 16 + 8, 15 * 16 + 8, 'prop_radio');
    this.collisionGrid[15][16] = true;

    // Animated musical note
    const rNote = this.add.text(16 * 16 + 8, 15 * 16 - 2, '♪', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#e69a37'
    });
    this.tweens.add({
      targets: rNote,
      y: 15 * 16 - 18,
      alpha: 0,
      duration: 1400,
      repeat: -1
    });

    // 8. Vintage Bicycle leaning against fence (x: 16, y: 33)
    this.add.image(16 * 16 + 8, 33 * 16 + 8, 'prop_bicycle');

    // 9. Streetlights (Vintage 1969 iron poles)
    const lightCoords = [
      [13, 19], [26, 19], [32, 19], [45, 19], [13, 25], [26, 25]
    ];
    lightCoords.forEach(([lx, ly]) => {
      this.add.image(lx * 16 + 8, ly * 16 + 8, 'prop_streetlight');
      this.collisionGrid[ly][lx] = true;
    });

    // 10. Clothesline in Backyard (x: 43, y: 27)
    this.add.image(43 * 16 + 8, 27 * 16 + 8, 'prop_clothesline');
    this.collisionGrid[27][43] = true;

    // 11. Basketball Hoop on Player's Garage (x: 7, y: 27)
    this.add.image(7 * 16, 27 * 16 + 8, 'prop_hoop');

    // 12. Lost Newspaper on Sidewalk (x: 23, y: 20)
    this.newspaperSprite = this.add.image(23 * 16 + 8, 20 * 16 + 8, 'prop_newspaper');

    // 13. Parked 1969 American Cars
    this.add.image(7 * 16 + 8, 32 * 16 + 8, 'car_muscle_red');
    this.collisionGrid[32][6] = true;
    this.collisionGrid[32][7] = true;

    this.add.image(18 * 16 + 8, 22 * 16 + 8, 'car_sedan_teal');
    this.collisionGrid[22][17] = true;
    this.collisionGrid[22][18] = true;

    this.add.image(35 * 16 + 8, 22 * 16 + 8, 'car_cruiser_yellow');
    this.collisionGrid[22][34] = true;
    this.collisionGrid[22][35] = true;

    this.add.image(40 * 16 + 8, 32 * 16 + 8, 'car_wagon_wood');
    this.collisionGrid[32][39] = true;
    this.collisionGrid[32][40] = true;

    // Extra car on north road
    this.add.image(47 * 16 + 8, 2 * 16 + 8, 'car_sedan_teal');
    this.collisionGrid[2][47] = true;
    this.collisionGrid[2][48] = true;

    // 14. Playground equipment in park (x: 4-5, y: 6-8)
    this.add.image(4 * 16 + 8, 7 * 16 + 8, 'prop_swing_set');
    this.collisionGrid[7][4] = true;
    this.collisionGrid[7][5] = true;

    // 15. Picnic table in park (x: 20, y: 10)
    this.add.image(20 * 16 + 8, 10 * 16 + 8, 'prop_picnic_table');
    this.collisionGrid[10][20] = true;

    // 16. Flower pots on Miller's porch
    this.add.image(17 * 16 + 8, 30 * 16 + 8, 'prop_flower_pot');
    this.add.image(25 * 16 + 8, 30 * 16 + 8, 'prop_flower_pot');

    // 17. Lemonade stand in park (x: 12, y: 18) — Upgraded pixel-art stand
    this.lemonadeSprite = this.add.image(12 * 16 + 8, 18 * 16 + 6, 'prop_lemonade_stand');
    this.lemonadeSprite.setDisplaySize(44, 33);
    this.lemonadeSprite.setDepth(3);
    this.collisionGrid[18][12] = true;

    // Single, razor-sharp readable 50¢ sign on lemonade stand (resolution 4)
    this.add.text(12 * 16 + 8, 18 * 16 + 10, 'LEMONADE 50¢', {
      fontFamily: 'monospace',
      fontSize: '5px',
      color: '#b71c1c',
      fontStyle: 'bold',
      resolution: 4
    }).setOrigin(0.5).setDepth(4);

    // 18. Push mower left by garage (x: 3, y: 32)
    this.add.image(3 * 16 + 8, 32 * 16 + 8, 'prop_mower');
  }

  // --- NPCs Setup ---

  createNPCs() {
    this.npcs = [];

    // 1. Mom standing in sunny front lawn (x: 8, y: 32)
    this.momSprite = this.add.image(8 * 16 + 8, 32 * 16 + 8, 'npc_mom');
    this.momSprite.setDisplaySize(16, 24);
    this.collisionGrid[32][8] = true;
    this.npcs.push({
      id: 'mom', name: 'Mom', portrait: 'portrait_mom',
      x: 8, y: 32, sprite: this.momSprite,
      interact: () => this.talkToMom()
    });

    // 2. Mrs. Miller standing in her flower yard (x: 21, y: 32)
    this.millerSprite = this.add.image(21 * 16 + 8, 32 * 16 + 8, 'npc_mrs_miller');
    this.millerSprite.setDisplaySize(16, 24);
    this.collisionGrid[32][21] = true;
    this.npcs.push({
      id: 'miller', name: 'Mrs. Miller', portrait: 'portrait_miller',
      x: 21, y: 32, sprite: this.millerSprite,
      interact: () => this.talkToMrsMiller()
    });

    // 3. June hanging out in the park (x: 19, y: 15)
    this.juneSprite = this.add.image(19 * 16 + 8, 15 * 16 + 8, 'npc_june');
    this.juneSprite.setDisplaySize(16, 24);
    this.collisionGrid[15][19] = true;
    this.npcs.push({
      id: 'june', name: 'June', portrait: 'portrait_june',
      x: 19, y: 15, sprite: this.juneSprite,
      interact: () => this.talkToJune()
    });

    // 4. Mr. Vinyl outside his shop (x: 42, y: 10)
    this.mrVinylSprite = this.add.image(42 * 16 + 8, 10 * 16 + 8, 'npc_mr_vinyl');
    this.mrVinylSprite.setDisplaySize(16, 24);
    this.collisionGrid[10][42] = true;
    this.npcs.push({
      id: 'vinyl', name: 'Mr. Vinyl', portrait: 'portrait_vinyl',
      x: 42, y: 10, sprite: this.mrVinylSprite,
      interact: () => this.enterRecordShop()
    });

    // 5. Timmy (Math Kid) on sidewalk (x: 26, y: 20)
    this.timmySprite = this.add.image(26 * 16 + 8, 20 * 16 + 8, 'npc_timmy');
    this.timmySprite.setDisplaySize(16, 24);
    this.collisionGrid[20][26] = true;
    this.npcs.push({
      id: 'timmy', name: 'Timmy', portrait: 'portrait_timmy',
      x: 26, y: 20, sprite: this.timmySprite,
      interact: () => this.talkToTimmy()
    });

    // 6. Neighbor Bob in his driveway (x: 37, y: 32)
    this.bobSprite = this.add.image(37 * 16 + 8, 32 * 16 + 8, 'npc_neighbor_bob');
    this.bobSprite.setDisplaySize(16, 24);
    this.collisionGrid[32][37] = true;
    this.npcs.push({
      id: 'bob', name: 'Neighbor Bob', portrait: 'portrait_bob',
      x: 37, y: 32, sprite: this.bobSprite,
      interact: () => this.talkToBob()
    });

    // 7. Buddy the Dog in park flowers (x: 10, y: 15)
    this.dogTileX = gameState.state.quests.dogRescued ? 36 : 10;
    this.dogTileY = gameState.state.quests.dogRescued ? 32 : 15;
    this.dogSprite = this.add.image(this.dogTileX * 16 + 8, this.dogTileY * 16 + 8, 'npc_dog_buddy');
    this.dogSprite.setDisplaySize(16, 16);
    this.dogSprite.setDepth(2);
    this.npcs.push({
      id: 'buddy', name: 'Buddy', portrait: 'portrait_dog',
      x: this.dogTileX, y: this.dogTileY, sprite: this.dogSprite,
      interact: () => this.interactDog()
    });

    // 8. Kid on bicycle wandering (x: 22, y: 17) — ambient only
    this.kidSprite = this.add.image(22 * 16 + 8, 17 * 16 + 8, 'npc_timmy');
    this.kidSprite.setDisplaySize(14, 20);
    this.kidSprite.setAlpha(0.9);
  }

  setupNPCAmbience() {
    // Idle bob for all NPCs
    [this.momSprite, this.millerSprite, this.juneSprite, this.mrVinylSprite,
     this.timmySprite, this.bobSprite].forEach((sprite, i) => {
      this.tweens.add({
        targets: sprite,
        y: sprite.y - 2,
        duration: 900 + i * 180,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });

    // Mrs. Miller — slow wander in her yard
    this.millerWander = { timer: 0, dir: 1 };


    // Ambient wandering kid on bicycle
    this.tweens.add({
      targets: this.kidSprite,
      x: this.kidSprite.x + 80,
      duration: 4000,
      ease: 'Linear',
      yoyo: true,
      repeat: -1
    });
  }

  setupWaterAnimation() {
    // Shimmer water tiles at random intervals
    this.time.addEvent({
      delay: 220,
      callback: () => {
        if (this.waterTiles.length === 0) return;
        const idx = Phaser.Math.Between(0, this.waterTiles.length - 1);
        const t = this.waterTiles[idx];
        this.tweens.add({
          targets: t,
          alpha: Phaser.Math.FloatBetween(0.6, 1.0),
          duration: 300,
          yoyo: true
        });
      },
      repeat: -1
    });
  }

  // --- Player Setup & Camera ---

  createPlayer() {
    this.playerTileX = 11;
    this.playerTileY = 30;

    this.player = this.add.sprite(
      this.playerTileX * 16 + 8,
      this.playerTileY * 16 + 8,
      'player_down_0'
    );
    this.player.setDisplaySize(16, 24);
    this.player.setDepth(10);
  }

  setupCamera() {
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(2);
  }

  setupFloatingLabels() {
    this.floatingLabels = {};

    const createLabel = (id, x, y, tileX, tileY, text, isFollow = false) => {
      const container = this.add.container(x, y);
      container.setDepth(25);
      container.setAlpha(0); // Subtle: starts hidden, gently fades in on proximity

      const textObj = this.add.text(0, 0, text, {
        fontFamily: 'monospace',
        fontSize: '5px',
        color: '#f0ead6',
        fontStyle: 'bold',
        resolution: 3
      }).setOrigin(0.5);

      const w = Math.max(textObj.width + 5, 14);
      const h = 8;

      const bg = this.add.rectangle(0, 0, w, h, 0x101a12, 0.65);
      bg.setStrokeStyle(0.5, 0xe6c86a, 0.45);

      container.add([bg, textObj]);

      let tween = null;
      if (!isFollow) {
        tween = this.tweens.add({
          targets: container,
          y: y - 2,
          duration: 1400 + Phaser.Math.Between(0, 400),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }

      this.floatingLabels[id] = {
        id,
        container,
        textObj,
        bg,
        tileX,
        tileY,
        baseY: y,
        baseText: text,
        tween,
        isFollow,
        forceHidden: false
      };

      return this.floatingLabels[id];
    };

    // 1. Interactive Objects (subtle 5px title-case labels)
    createLabel('trash', 3 * 16 + 8, 30 * 16 - 2, 3, 30, gameState.state.quests.trash ? '✓ Trash' : 'Trash');
    createLabel('hedges', 14.5 * 16 + 8, 31 * 16 - 3, 14.5, 31, gameState.state.quests.hedge ? '✓ Hedges' : 'Hedges');
    createLabel('parcel', 8 * 16 + 8, 30 * 16 - 2, 8, 30, 'Parcel');
    if (gameState.state.quests.parcelCollected) {
      this.floatingLabels['parcel'].forceHidden = true;
    }

    createLabel('dog', 10 * 16 + 8, 15 * 16 - 4, 10, 15, gameState.state.quests.dogRescued ? '✓ Buddy' : 'Buddy', true);
    createLabel('newspaper', 23 * 16 + 8, 20 * 16 - 2, 23, 20, 'Newspaper');
    if (gameState.state.quests.newspaperFound) {
      this.floatingLabels['newspaper'].forceHidden = true;
    }

    createLabel('lemonade', 12 * 16 + 8, 18 * 16 - 4, 12, 18, 'Lemonade');
    createLabel('radio', 16 * 16 + 8, 15 * 16 - 3, 16, 15, gameState.state.quests.juneDone ? '✓ Radio' : 'Radio');
    createLabel('record_shop', 39 * 16 + 8, 9 * 16 - 4, 39, 9, 'Record Shop');
    createLabel('home', 11 * 16 + 8, 29 * 16 - 3, 11, 29, gameState.state.quests.albumBought ? '★ Bedroom' : 'Home');

    // 2. NPCs (subtle 5px title-case labels)
    createLabel('mom', 8 * 16 + 8, 32 * 16 - 8, 8, 32, 'Mom');
    createLabel('miller', 21 * 16 + 8, 32 * 16 - 8, 21, 32, 'Mrs. Miller');
    createLabel('june', 19 * 16 + 8, 15 * 16 - 8, 19, 15, 'June');
    createLabel('vinyl', 42 * 16 + 8, 10 * 16 - 8, 42, 10, 'Mr. Vinyl');
    createLabel('timmy', 26 * 16 + 8, 20 * 16 - 8, 26, 20, 'Timmy');
    createLabel('bob', 37 * 16 + 8, 32 * 16 - 8, 37, 32, 'Neighbor Bob');

    this.updateFloatingLabelsState();
  }

  updateFloatingLabelsState() {
    if (!this.floatingLabels) return;

    if (this.floatingLabels['trash']) {
      const done = gameState.state.quests.trash;
      this.setLabelText('trash', done ? '✓ Trash' : 'Trash', done ? '#85e085' : '#f0ead6');
    }

    if (this.floatingLabels['hedges']) {
      const done = gameState.state.quests.hedge;
      this.setLabelText('hedges', done ? '✓ Hedges' : 'Hedges', done ? '#85e085' : '#f0ead6');
    }

    if (this.floatingLabels['parcel']) {
      this.floatingLabels['parcel'].forceHidden = gameState.state.quests.parcelCollected;
    }

    if (this.floatingLabels['newspaper']) {
      this.floatingLabels['newspaper'].forceHidden = gameState.state.quests.newspaperFound;
    }

    if (this.floatingLabels['dog']) {
      if (gameState.state.quests.dogRescued) {
        this.setLabelText('dog', '✓ Buddy', '#85e085');
      } else if (gameState.state.dogFollowing) {
        this.setLabelText('dog', 'Buddy 🐾', '#f7cf39');
      } else {
        this.setLabelText('dog', 'Buddy', '#f0ead6');
      }
    }

    if (this.floatingLabels['radio']) {
      const done = gameState.state.quests.juneDone;
      this.setLabelText('radio', done ? '✓ Radio' : 'Radio', done ? '#85e085' : '#f0ead6');
    }

    if (this.floatingLabels['home']) {
      if (gameState.state.quests.albumBought) {
        this.setLabelText('home', '★ Bedroom', '#f7cf39');
      } else {
        this.setLabelText('home', 'Home', '#f0ead6');
      }
    }
  }

  setLabelText(id, text, colorHex = '#f0ead6') {
    const item = this.floatingLabels[id];
    if (!item) return;
    item.textObj.setText(text);
    item.textObj.setColor(colorHex);
    item.bg.setSize(Math.max(item.textObj.width + 5, 14), 8);
  }

  highlightActiveLabel(activeId) {
    if (!this.floatingLabels) return;
    for (const [id, item] of Object.entries(this.floatingLabels)) {
      if (id === activeId) {
        item.bg.setStrokeStyle(1, 0xffe680, 0.9);
        item.container.setScale(1.05);
      } else {
        item.bg.setStrokeStyle(0.5, 0xe6c86a, 0.45);
        item.container.setScale(1.0);
      }
    }
  }

  updateFloatingLabels(delta) {
    if (!this.floatingLabels) return;
    const inDialogue = this.dialogueBox && this.dialogueBox.isOpen;

    for (const [id, item] of Object.entries(this.floatingLabels)) {
      if (item.forceHidden || inDialogue) {
        item.container.setAlpha(0);
        continue;
      }

      let tx = item.tileX;
      let ty = item.tileY;
      if (item.id === 'dog') {
        tx = this.dogSprite.x / 16;
        ty = this.dogSprite.y / 16;
      }

      const dist = Phaser.Math.Distance.Between(this.playerTileX, this.playerTileY, tx, ty);
      let targetAlpha = 0;
      if (dist <= 2.2) {
        targetAlpha = 0.9;
      } else if (dist <= 3.2) {
        targetAlpha = (3.2 - dist) * 0.9;
      }

      item.container.alpha = Phaser.Math.Linear(item.container.alpha, targetAlpha, 0.2);
      if (item.container.alpha < 0.02) item.container.alpha = 0;
    }
  }

  setupHUD() {
    // Reveal DOM HUD for gameplay (Time, Cash, Quests, Restart Controls)
    const leftHud = document.getElementById('top-left-hud');
    const toggleBar = document.querySelector('.hud-toggle-bar');
    const sidePanel = document.getElementById('floating-side-panel');
    const restartBtn = document.getElementById('restart-game-btn');
    const toggleHudBtn = document.getElementById('toggle-hud-btn');
    if (leftHud) leftHud.style.display = 'flex';
    if (toggleBar) toggleBar.style.display = 'flex';
    if (sidePanel) sidePanel.style.display = 'flex';
    if (restartBtn) restartBtn.style.display = '';
    if (toggleHudBtn) toggleHudBtn.style.display = '';

    // Context Interaction Prompt Banner
    this.promptContainer = this.add.container(0, -40);
    this.promptContainer.setScrollFactor(0);
    this.promptContainer.setDepth(900);
    this.promptContainer.setVisible(false);

    this.promptBg = this.add.rectangle(0, 0, 180, 22, 0x1f2b1d, 0.9);
    this.promptBg.setStrokeStyle(1.5, 0xe6c86a);

    this.promptText = this.add.text(0, 0, 'E — INTERACT', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#f6f1de',
      fontStyle: 'bold',
      resolution: 3
    }).setOrigin(0.5);

    this.promptContainer.add([this.promptBg, this.promptText]);
    this.dialogueCooldownUntil = 0;
  }

  setupTimeOverlay() {
    // A full-screen tint rect that changes with time of day
    this.timeOverlay = this.add.rectangle(
      this.worldPixelW / 2,
      this.worldPixelH / 2,
      this.worldPixelW,
      this.worldPixelH,
      0x000000,
      0
    );
    this.timeOverlay.setDepth(50);
    this.timeOverlay.setScrollFactor(1);
    this.updateTimeOverlay();
  }

  updateTimeOverlay() {
    const mins = gameState.state.timeMinutes;
    const hour = Math.floor(mins / 60);
    // 15:00 = 3pm bright, 17:30 = golden hour, 18:00+ = dusk
    let alpha = 0;
    let color = 0x000000;
    if (hour >= 17) {
      // Golden hour / dusk
      const t = Math.min((mins - 17 * 60) / 60, 1);
      alpha = t * 0.22;
      color = 0xd4721a;
    } else if (hour < 15) {
      alpha = 0.05;
      color = 0x1a3a5c;
    }
    this.timeOverlay.setFillStyle(color, alpha);
  }

  onDialogueClosed() {
    this.dialogueCooldownUntil = Date.now() + 450;
  }

  // --- Main Update Loop ---

  update(time, delta) {
    if (this.dialogueBox && this.dialogueBox.isOpen) {
      this.promptContainer.setVisible(false);
      this.highlightActiveLabel(null);
      this.updateFloatingLabels(delta);
      return;
    }

    this.checkContextualPrompts();
    this.handlePlayerInput();
    this.updateDogFollow();
    this.updateFloatingLabels(delta);

    // Keep prompt centered on screen
    if (this.cameras.main) {
      const cam = this.cameras.main;
      this.promptContainer.setPosition(
        cam.scrollX + cam.width / 2,
        cam.scrollY + cam.height - 48
      );
    }
  }

  // --- Grid-based Movement ---

  handlePlayerInput() {
    if (this.isMoving) return;
    const introEl = document.getElementById('intro-story-overlay');
    if (introEl && introEl.style.display !== 'none' && !introEl.classList.contains('fade-out')) return;
    if (this.dialogueBox && this.dialogueBox.isOpen) return;

    let dx = 0;
    let dy = 0;
    let dir = null;

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      dx = -1; dir = 'left';
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      dx = 1; dir = 'right';
    } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
      dy = -1; dir = 'up';
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      dy = 1; dir = 'down';
    }

    if (dir) {
      audioManager.init();
      if (!audioManager.currentMusicType) {
        audioManager.playMusic('ambient');
      }
      this.playerFacing = dir;
      const targetX = this.playerTileX + dx;
      const targetY = this.playerTileY + dy;

      this.player.setTexture(`player_${dir}_0`);

      if (this.isTileWalkable(targetX, targetY)) {
        this.startTileMove(targetX, targetY, dir);
      } else if (targetX === 11 && targetY === 29 && dir === 'up') {
        // Player walks directly into home door
        this.interactHomeDoor();
      }
    }
  }

  isTileWalkable(tx, ty) {
    if (tx < 1 || tx >= this.mapW - 1 || ty < 1 || ty >= this.mapH - 1) {
      return false;
    }
    if (this.collisionGrid[ty] && this.collisionGrid[ty][tx]) {
      return false;
    }
    return true;
  }

  startTileMove(targetX, targetY, dir) {
    this.isMoving = true;
    const ground = (this.groundTypeGrid[targetY] && this.groundTypeGrid[targetY][targetX]) || 'grass';
    audioManager.playStep(ground);

    // Breadcrumb trail for companion dog following
    this.playerTileHistory.push({ x: this.playerTileX, y: this.playerTileY, dir: dir });
    if (this.playerTileHistory.length > 25) {
      this.playerTileHistory.shift();
    }

    if (gameState.isDogFollowing()) {
      const followStep = this.playerTileHistory[this.playerTileHistory.length - 1];
      if (followStep) {
        this.moveDogToTile(followStep.x, followStep.y, dir);
      }
    }

    this.stepCount++;
    if (this.stepCount % 35 === 0) {
      gameState.advanceTime(1);
      this.updateTimeOverlay();
    }

    const stepFrame = (this.stepCount % 2 === 0) ? 1 : 2;
    this.player.setTexture(`player_${dir}_${stepFrame}`);

    this.tweens.add({
      targets: this.player,
      x: targetX * 16 + 8,
      y: targetY * 16 + 8,
      duration: 155,
      ease: 'Linear',
      onComplete: () => {
        this.playerTileX = targetX;
        this.playerTileY = targetY;
        this.player.setTexture(`player_${dir}_0`);
        this.isMoving = false;
      }
    });
  }

  // --- Contextual Interactions ---

  checkContextualPrompts() {
    const introEl = document.getElementById('intro-story-overlay');
    if (introEl && introEl.style.display !== 'none' && !introEl.classList.contains('fade-out')) {
      if (this.promptContainer) this.promptContainer.setVisible(false);
      return;
    }

    let targetX = this.playerTileX;
    let targetY = this.playerTileY;

    if (this.playerFacing === 'up') targetY--;
    else if (this.playerFacing === 'down') targetY++;
    else if (this.playerFacing === 'left') targetX--;
    else if (this.playerFacing === 'right') targetX++;

    let activePrompt = null;
    let actionFn = null;
    let activeId = null;

    if (targetX === 8 && targetY === 32) {
      activePrompt = 'E — TALK TO MOM';
      actionFn = () => this.talkToMom();
      activeId = 'mom';
    } else if (targetX === 3 && targetY === 30) {
      activePrompt = gameState.state.quests.trash ? 'E — INSPECT TRASH CAN' : 'E — TAKE OUT TRASH';
      actionFn = () => this.interactTrash();
      activeId = 'trash';
    } else if ((targetX === 14 || targetX === 15) && targetY === 31) {
      activePrompt = gameState.state.quests.hedge ? 'E — INSPECT HEDGE' : 'E — TRIM THE HEDGES';
      actionFn = () => this.interactHedge();
      activeId = 'hedges';
    } else if (targetX === 8 && targetY === 30 && !gameState.state.quests.parcelCollected) {
      activePrompt = 'E — PICK UP PARCEL';
      actionFn = () => this.interactParcel();
      activeId = 'parcel';
    } else if ((targetX === 20 || targetX === 21) && targetY === 32) {
      activePrompt = 'E — TALK TO MRS. MILLER';
      actionFn = () => this.talkToMrsMiller();
      activeId = 'miller';
    } else if (targetX === 39 && (targetY === 10 || targetY === 9)) {
      activePrompt = 'E — ENTER RECORD SHOP';
      actionFn = () => this.enterRecordShop();
      activeId = 'record_shop';
    } else if (targetX === 42 && targetY === 10) {
      activePrompt = 'E — TALK TO MR. VINYL';
      actionFn = () => this.enterRecordShop();
      activeId = 'vinyl';
    } else if (targetX === 19 && targetY === 15) {
      activePrompt = 'E — TALK TO JUNE';
      actionFn = () => this.talkToJune();
      activeId = 'june';
    } else if (targetX === 16 && targetY === 15) {
      activePrompt = 'E — LISTEN TO RADIO';
      actionFn = () => this.interactRadio();
      activeId = 'radio';
    } else if (targetX === 26 && targetY === 20) {
      activePrompt = 'E — TALK TO TIMMY';
      actionFn = () => this.talkToTimmy();
      activeId = 'timmy';
    } else if ((targetX === 36 || targetX === 37) && (targetY === 32 || targetY === 31 || targetY === 33)) {
      activePrompt = 'E — TALK TO NEIGHBOR BOB';
      actionFn = () => this.talkToBob();
      activeId = 'bob';
    } else if (Math.abs(this.playerTileX - this.dogTileX) <= 1 && Math.abs(this.playerTileY - this.dogTileY) <= 1 && !gameState.state.quests.dogRescued) {
      activePrompt = gameState.isDogFollowing() ? 'E — PET BUDDY [FOLLOWING]' : 'E — CALL BUDDY';
      actionFn = () => this.interactDog();
      activeId = 'dog';
    } else if (targetX === 23 && targetY === 20 && !gameState.state.quests.newspaperFound) {
      activePrompt = 'E — PICK UP NEWSPAPER';
      actionFn = () => this.interactNewspaper();
      activeId = 'newspaper';
    } else if (targetX === 12 && targetY === 18) {
      activePrompt = 'E — BUY LEMONADE ($0.50)';
      actionFn = () => this.buyLemonade();
      activeId = 'lemonade';
    } else if ((targetX === 11 && targetY === 29) || (this.playerTileX === 11 && (this.playerTileY === 30 || this.playerTileY === 29))) {
      activePrompt = gameState.state.quests.albumBought ? 'E / SPACE — ENTER BEDROOM (LISTEN TO ALBUM)' : 'E / SPACE — ENTER BEDROOM';
      actionFn = () => this.interactHomeDoor();
      activeId = 'home';
    }

    this.highlightActiveLabel(activeId);

    if (activePrompt) {
      this.promptText.setText(activePrompt);
      this.promptBg.setSize(activePrompt.length * 7.5 + 28, 22);
      this.promptContainer.setVisible(true);

      if (Phaser.Input.Keyboard.JustDown(this.wasd.interact) || Phaser.Input.Keyboard.JustDown(this.wasd.space)) {
        if (Date.now() > this.dialogueCooldownUntil) {
          actionFn();
        }
      }
    } else {
      this.promptContainer.setVisible(false);
    }
  }

  // --- Quest & Story Handlers ---

  talkToMom() {
    const choresDone = gameState.getCompletedChoreCount();
    const albumBought = gameState.state.quests.albumBought;

    if (albumBought) {
      this.dialogueBox.show('Mom', 'portrait_mom', [
        'Oh! You actually got Led Zeppelin II! Look at that airship cover!',
        'Hurry inside to your bedroom and put it on your turntable before dinner!'
      ]);
    } else if (choresDone === 3) {
      this.dialogueBox.show('Mom', 'portrait_mom', [
        'All three chores done and the yard looks fantastic!',
        'You should have plenty of cash in your pocket now. Run over to Mr. Vinyl\'s shop before he closes!'
      ]);
    } else {
      const remaining = [];
      if (!gameState.state.quests.trash) remaining.push('• Take out the trash by the garage');
      if (!gameState.state.quests.hedge) remaining.push('• Trim the unruly garden hedges');
      if (!gameState.state.quests.parcelDelivered) remaining.push('• Deliver Mrs. Miller\'s parcel');

      this.dialogueBox.show('Mom', 'portrait_mom', [
        'Here\'s what\'s left on your afternoon list:',
        remaining.join('\n'),
        'Keep at it! You\'ll have that Zeppelin record in no time.'
      ]);
    }
  }

  interactTrash() {
    if (gameState.state.quests.trash) {
      this.dialogueBox.show('You', null, ['The trash can is emptied with a clean liner. Mom will be pleased!']);
      return;
    }

    audioManager.playSuccess();
    audioManager.playCoin();
    gameState.addCash(2);
    gameState.setQuest('trash', true);
    gameState.advanceTime(5);
    this.trashSprite.setTexture('prop_trash_empty');
    this.updateFloatingLabelsState();

    this.dialogueBox.show('You', null, [
      '★ Chore Complete: Emptied the heavy metal trash can! ★',
      'Mom left $2.00 on the kitchen counter for completing this chore. (+ $2.00)'
    ]);
  }

  interactHedge() {
    if (gameState.state.quests.hedge) {
      this.dialogueBox.show('You', null, ['The garden hedges are neatly trimmed and smell like fresh pine and leaves.']);
      return;
    }

    this.scene.pause('NeighborhoodScene');
    this.scene.launch('HedgeMinigameScene');
  }

  interactParcel() {
    if (gameState.state.quests.parcelCollected) return;

    audioManager.playSuccess();
    gameState.setQuest('parcelCollected', true);
    gameState.addItem('Mrs. Miller\'s Parcel');
    this.parcelSprite.setVisible(false);
    this.updateFloatingLabelsState();

    this.dialogueBox.show('You', null, [
      '★ Picked up Mrs. Miller\'s Parcel! ★',
      'It is wrapped in brown butcher paper and tied with twine. Deliver it to her house down the street.'
    ]);
  }

  talkToMrsMiller() {
    const hasParcel = gameState.hasItem('Mrs. Miller\'s Parcel');
    const delivered = gameState.state.quests.parcelDelivered;

    if (delivered) {
      this.dialogueBox.show('Mrs. Miller', 'portrait_miller', [
        'My garden seed catalog arrived just in time. Thank you again for being such a wonderful neighbor, dear!'
      ]);
    } else if (hasParcel) {
      audioManager.playSuccess();
      audioManager.playCoin();
      gameState.removeItem('Mrs. Miller\'s Parcel');
      gameState.setQuest('parcelDelivered', true);
      gameState.addCash(7);
      gameState.advanceTime(10);

      this.dialogueBox.show('Mrs. Miller', 'portrait_miller', [
        'Oh! That\'s my parcel!! You\'re an absolute lifesaver.',
        'Here, take this $7.00. And thank you so much, dear!'
      ]);
    } else {
      this.dialogueBox.show('Mrs. Miller', 'portrait_miller', [
        'Hello there! Your mother mentioned you might have a delivery for me from the postman?',
        'Check your front porch, dear. It should be waiting right there.'
      ]);
    }
  }

  enterRecordShop() {
    this.scene.pause('NeighborhoodScene');
    this.scene.launch('RecordShopScene');
  }

  talkToJune() {
    if (gameState.state.quests.juneDone) {
      this.dialogueBox.show('June', 'portrait_june', [
        'I\'m still heading to the 4:00 PM station!',
        'Go grab Led Zeppelin II before Mr. Vinyl packs up for the evening!'
      ]);
      return;
    }

    this.dialogueBox.show('June', 'portrait_june', [
      'I found a radio station that actually plays the good stuff after four. Everyone else listens to the same five songs.',
      'Come sit for a minute and jam with me!'
    ], () => {
      this.scene.pause('NeighborhoodScene');
      this.scene.launch('JuneMinigameScene');
    });
  }

  talkToTimmy() {
    if (gameState.state.quests.mathDone) {
      this.dialogueBox.show('Timmy', 'portrait_timmy', [
        'Thanks for helping me win that math bet with my brother! Now I can buy two cherry sodas!'
      ]);
      return;
    }

    this.dialogueBox.show('Timmy', 'portrait_timmy', [
      'Hey! My older brother bet me $2 that I couldn\'t solve 5 math questions!',
      'Help me answer all 5 questions and the two bucks is yours!'
    ], () => {
      this.scene.pause('NeighborhoodScene');
      this.scene.launch('MathMinigameScene');
    });
  }

  moveDogToTile(targetX, targetY, playerDir) {
    if (this.dogTileX === targetX && this.dogTileY === targetY) return;

    if (targetX < this.dogTileX) {
      this.dogSprite.setFlipX(true);
    } else if (targetX > this.dogTileX) {
      this.dogSprite.setFlipX(false);
    }

    this.dogTileX = targetX;
    this.dogTileY = targetY;

    this.tweens.add({
      targets: this.dogSprite,
      x: targetX * 16 + 8,
      y: targetY * 16 + 8,
      duration: 155,
      ease: 'Linear',
      onUpdate: () => {
        if (this.floatingLabels && this.floatingLabels['dog']) {
          this.floatingLabels['dog'].container.setPosition(this.dogSprite.x, this.dogSprite.y - 12);
        }
      }
    });

    // Subtle happy walking trot bounce
    this.tweens.add({
      targets: this.dogSprite,
      scaleY: 0.88,
      duration: 75,
      yoyo: true,
      ease: 'Quad.easeInOut'
    });
  }

  interactRadio() {
    audioManager.playRadioJingle();
    if (!audioManager.currentMusicType) {
      audioManager.playMusic('ambient');
    }

    if (!gameState.state.quests.juneDone) {
      this.dialogueBox.show('Transistor Radio', 'portrait_june', [
        '📻 WGLD 98.7 FM — Playing late-afternoon psychedelic rock & soul!',
        'June smiles from her picnic blanket: "Pretty sweet grooves, right? Talk to me if you want to jam along!"'
      ]);
    } else {
      this.dialogueBox.show('Transistor Radio', 'portrait_june', [
        '📻 WGLD 98.7 FM — The DJ announces: "Stay tuned for the 5 o\'clock album countdown!"',
        'Warm static crackles from the speaker as the music drifts through the park trees.'
      ]);
    }
  }

  talkToBob() {
    if (gameState.state.quests.dogRescued) {
      this.dialogueBox.show('Neighbor Bob', 'portrait_bob', [
        'Buddy has had enough adventures for one afternoon. Thanks again, kid!'
      ]);
    } else if (gameState.isDogFollowing()) {
      audioManager.playTalk('dog');
      audioManager.playSuccess();
      audioManager.playCoin();

      gameState.setQuest('dogRescued', true);
      gameState.setQuest('dogFollowing', false);
      gameState.addCash(3);
      gameState.advanceTime(10);

      // Move Buddy into Bob's driveway right beside Bob
      this.dogTileX = 36;
      this.dogTileY = 32;
      this.dogSprite.setFlipX(false);
      this.tweens.add({
        targets: this.dogSprite,
        x: 36 * 16 + 8,
        y: 32 * 16 + 8,
        duration: 300,
        ease: 'Back.easeOut',
        onComplete: () => {
          this.tweens.add({
            targets: this.dogSprite,
            y: this.dogSprite.y - 4,
            duration: 250,
            yoyo: true,
            repeat: 3
          });
        }
      });

      if (this.floatingLabels && this.floatingLabels['dog']) {
        this.floatingLabels['dog'].container.setPosition(36 * 16 + 8, 32 * 16 - 12);
      }
      this.updateFloatingLabelsState();

      this.dialogueBox.show('Neighbor Bob', 'portrait_bob', [
        'Buddy! You brought my dog back safe and sound!',
        'You\'re a good kid. Here\'s $3.00 for helping out an old neighbor!'
      ]);
    } else {
      this.dialogueBox.show('Neighbor Bob', 'portrait_bob', [
        'Have you seen my hound dog Buddy? He caught scent of a squirrel and dashed off into the park flowers!',
        'If you see him near the pond, call him over and bring him home, would you?'
      ]);
    }
  }

  interactDog() {
    if (gameState.state.quests.dogRescued) {
      audioManager.playTalk('dog');
      this.dialogueBox.show('Buddy', 'portrait_dog', ['*Woof!* Buddy contentedly wags his tail beside Neighbor Bob.']);
      return;
    }

    if (gameState.isDogFollowing()) {
      audioManager.playTalk('dog');
      this.dialogueBox.show('Buddy', 'portrait_dog', [
        '*Pant pant!* Buddy trots happily right behind you!',
        'Lead him back to Neighbor Bob\'s driveway on the east side of town.'
      ]);
      return;
    }

    audioManager.playTalk('dog');
    gameState.setQuest('dogFound', true);
    gameState.setQuest('dogFollowing', true);

    this.dogSprite.setFlipX(this.playerTileX < this.dogTileX);
    this.playerTileHistory = [
      { x: this.dogTileX, y: this.dogTileY, dir: 'up' },
      { x: this.playerTileX, y: this.playerTileY, dir: this.playerFacing }
    ];

    this.updateFloatingLabelsState();

    this.dialogueBox.show('Buddy', 'portrait_dog', [
      '*Woof! Woof!*',
      'Buddy trusts you now. Let\'s get him home to Neighbor Bob!'
    ]);
  }

  updateDogFollow() {
    if (this.floatingLabels && this.floatingLabels['dog']) {
      this.floatingLabels['dog'].container.setPosition(this.dogSprite.x, this.dogSprite.y - 12);
    }
  }

  interactNewspaper() {
    audioManager.playSuccess();
    audioManager.playCoin();
    gameState.setQuest('newspaperFound', true);
    gameState.setQuest('newspaperReturned', true);
    gameState.addCash(2);
    this.newspaperSprite.setVisible(false);
    this.updateFloatingLabelsState();

    this.dialogueBox.show('You', null, [
      '★ Found the missing Saturday Gazette on the sidewalk! ★',
      'Returned it to the neighbor\'s porch. They left a $2.00 finder\'s reward! (+ $2.00)'
    ]);
  }

  buyLemonade() {
    if (gameState.state.cash < 1) {
      this.dialogueBox.show('You', null, [
        'A hand-painted sign reads: "Lemonade 50¢"',
        'You don\'t have enough change right now. Come back later!'
      ]);
      return;
    }

    if (gameState.state.quests.lemonadeBought) {
      this.dialogueBox.show('You', null, [
        'You already bought a lemonade today — still feeling refreshed!'
      ]);
      return;
    }

    audioManager.playCoin();
    gameState.deductCash(1);
    gameState.setQuest('lemonadeBought', true);

    this.dialogueBox.show('You', null, [
      '★ You bought a cold lemonade for 50¢! ★',
      'The ice cold lemonade hits the spot on this warm 1969 Saturday. Refreshing!'
    ]);
  }

  interactHomeDoor() {
    if (this.promptContainer) this.promptContainer.setVisible(false);
    audioManager.stopMusic();
    this.scene.stop('NeighborhoodScene');
    this.scene.start('EndingScene');
  }

  refreshWorldState() {
    if (gameState.state.quests.hedge) {
      this.hedgeSprite.setTexture('prop_hedge_trimmed');
    }
    if (gameState.state.quests.trash) {
      this.trashSprite.setTexture('prop_trash_empty');
    }
    if (gameState.state.quests.parcelCollected) {
      this.parcelSprite.setVisible(false);
    }
    if (gameState.state.quests.newspaperFound) {
      this.newspaperSprite.setVisible(false);
    }
    this.updateFloatingLabelsState();
    this.updateTimeOverlay();
  }
}
