/**
 * NeighborhoodScene.js
 * The Primary Overworld for SIDE B: One Perfect Afternoon
 * 44 x 34 Tile Map, 16px Grid Movement, NPC Dialogues, Chores, Quests & Favors
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';
import { DialogueBox } from '../ui/DialogueBox.js';

export class NeighborhoodScene extends Phaser.Scene {
  constructor() {
    super('NeighborhoodScene');
  }

  create() {
    this.mapW = 44;
    this.mapH = 34;
    this.tileSize = 16;
    this.worldPixelW = this.mapW * this.tileSize; // 704
    this.worldPixelH = this.mapH * this.tileSize; // 544

    this.physics.world.setBounds(0, 0, this.worldPixelW, this.worldPixelH);
    this.cameras.main.setBounds(0, 0, this.worldPixelW, this.worldPixelH);

    // Collision Matrix: true = solid/obstacle, false = walkable
    this.collisionGrid = Array(this.mapH).fill(null).map(() => Array(this.mapW).fill(false));

    this.buildWorldMap();
    this.createStaticProps();
    this.createNPCs();
    this.createPlayer();
    this.setupCamera();
    this.setupHUD();

    // Dialogue Box
    this.dialogueBox = new DialogueBox(this);

    // Step counter for clock advancement
    this.stepCount = 0;

    // Movement state
    this.isMoving = false;
    this.playerFacing = 'down';

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

    // On-screen Audio button listener
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.onclick = () => {
        audioManager.init();
        const isMuted = audioManager.toggleMute();
        const label = document.getElementById('audio-label');
        if (label) label.textContent = isMuted ? 'SOUND: OFF' : 'SOUND: ON';
      };
    }

    // First time introduction dialogue from Mom
    if (!gameState.state.quests.introGiven) {
      gameState.setQuest('introGiven', true);
      this.time.delayedCall(400, () => {
        this.dialogueBox.show(
          'Mom',
          'portrait_mom',
          [
            'Good afternoon, honey! It\'s such a gorgeous Saturday out.',
            'I know you\'ve been saving up for that record at the shop, but I need you to finish a few chores first.',
            '1. Take out the trash\n2. Trim the garden hedges\n3. Deliver Mrs. Miller\'s parcel down the street',
            'Do those and you\'ll have plenty of pocket money. Have fun, but be back before dinner!'
          ]
        );
      });
    }

    // Refresh world props when returning from minigames
    this.events.on('resume', () => {
      this.refreshWorldState();
    });
  }

  // --- Map Tile Construction ---

  buildWorldMap() {
    // 1. Fill ground with grass
    for (let y = 0; y < this.mapH; y++) {
      for (let x = 0; x < this.mapW; x++) {
        const isFlower = (x * 7 + y * 13) % 17 === 0;
        const key = isFlower ? 'tile_grass_flowers' : 'tile_grass';
        this.add.image(x * 16 + 8, y * 16 + 8, key);
      }
    }

    // 2. Roads & Sidewalks Network
    // Main Horizontal Avenue: y = 13, 14, 15
    for (let x = 0; x < this.mapW; x++) {
      // North sidewalk
      this.add.image(x * 16 + 8, 12 * 16 + 8, 'tile_sidewalk');
      // Asphalt
      this.add.image(x * 16 + 8, 13 * 16 + 8, 'tile_road');
      this.add.image(x * 16 + 8, 14 * 16 + 8, (x % 2 === 0) ? 'tile_road_line_h' : 'tile_road');
      this.add.image(x * 16 + 8, 15 * 16 + 8, 'tile_road');
      // South sidewalk
      this.add.image(x * 16 + 8, 16 * 16 + 8, 'tile_sidewalk');
    }

    // Main Vertical Cross Street: x = 20, 21, 22
    for (let y = 0; y < this.mapH; y++) {
      // West sidewalk
      this.add.image(19 * 16 + 8, y * 16 + 8, 'tile_sidewalk');
      // Asphalt
      this.add.image(20 * 16 + 8, y * 16 + 8, 'tile_road');
      this.add.image(21 * 16 + 8, y * 16 + 8, (y % 2 === 0) ? 'tile_road_line_v' : 'tile_road');
      this.add.image(22 * 16 + 8, y * 16 + 8, 'tile_road');
      // East sidewalk
      this.add.image(23 * 16 + 8, y * 16 + 8, 'tile_sidewalk');
    }

    // Sidewalks connecting to house entrances
    // Player's house path (x = 7, y = 20..24)
    for (let y = 21; y <= 25; y++) {
      this.add.image(7 * 16 + 8, y * 16 + 8, 'tile_sidewalk');
    }
    // Mrs. Miller's house path (x = 28, y = 21..25)
    for (let y = 21; y <= 25; y++) {
      this.add.image(28 * 16 + 8, y * 16 + 8, 'tile_sidewalk');
    }
    // Record Shop entrance path (x = 31, y = 10..12)
    for (let y = 10; y <= 12; y++) {
      this.add.image(31 * 16 + 8, y * 16 + 8, 'tile_sidewalk');
    }

    // 3. Park Pond (Top Left: x = 4..13, y = 4..9)
    for (let py = 4; py <= 9; py++) {
      for (let px = 4; px <= 13; px++) {
        // Natural curved shape
        if ((px === 4 && (py === 4 || py === 9)) || (px === 13 && (py === 4 || py === 9))) continue;
        this.add.image(px * 16 + 8, py * 16 + 8, 'tile_water');
        this.collisionGrid[py][px] = true; // water is solid
      }
    }

    // 4. Buildings Architecture
    // Building 1: Player's House (x = 4..10, y = 17..20)
    this.buildHouse(4, 17, 7, 4, 'tile_roof_red', 'tile_wall_wood', 7, 20);

    // Building 2: Mrs. Miller's House (x = 25..31, y = 17..20)
    this.buildHouse(25, 17, 7, 4, 'tile_roof_brown', 'tile_wall_wood', 28, 20);

    // Building 3: Neighbor Bob's House (x = 35..41, y = 17..20)
    this.buildHouse(35, 17, 7, 4, 'tile_roof_red', 'tile_wall_wood', 38, 20);

    // Building 4: The Record Shop (x = 27..35, y = 4..8)
    this.buildRecordShop(27, 4, 9, 5, 31, 8);

    // 5. Surrounding Picket Fences & Trees
    // Map Boundaries collision
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

    // Front yard picket fences for Player House
    for (let fx = 4; fx <= 10; fx++) {
      if (fx !== 7) { // opening for front path
        this.add.image(fx * 16 + 8, 23 * 16 + 8, 'tile_fence');
        this.collisionGrid[23][fx] = true;
      }
    }

    // Front yard fences for Mrs. Miller House
    for (let fx = 25; fx <= 31; fx++) {
      if (fx !== 28) {
        this.add.image(fx * 16 + 8, 23 * 16 + 8, 'tile_fence');
        this.collisionGrid[23][fx] = true;
      }
    }

    // Neighborhood Trees
    const treeCoords = [
      [2, 3], [15, 3], [16, 7], [3, 10], [15, 11], // Park trees
      [2, 17], [12, 17], [13, 23], [2, 25], [12, 28], // Player street trees
      [23, 3], [37, 3], [42, 6], [38, 11], // North-east trees
      [24, 25], [33, 25], [42, 25], [18, 30], [28, 31] // South trees
    ];

    treeCoords.forEach(([tx, ty]) => {
      this.add.image(tx * 16 + 16, ty * 16 + 16, 'tree_large');
      this.collisionGrid[ty][tx] = true;
      this.collisionGrid[ty + 1][tx] = true;
      this.collisionGrid[ty][tx + 1] = true;
      this.collisionGrid[ty + 1][tx + 1] = true;
    });
  }

  buildHouse(startX, startY, width, height, roofKey, wallKey, doorX, doorY) {
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) {
        this.collisionGrid[y][x] = true; // House is solid
        if (y < startY + 2) {
          this.add.image(x * 16 + 8, y * 16 + 8, roofKey);
        } else if (x === doorX && y === doorY) {
          this.add.image(x * 16 + 8, y * 16 + 8, 'tile_door');
        } else if ((x === startX + 1 || x === startX + width - 2) && y === startY + 2) {
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
        } else {
          this.add.image(x * 16 + 8, y * 16 + 8, 'tile_wall_wood');
        }
      }
    }
    // "RECORDS" Banner sign above door
    this.add.image((startX + 4) * 16 + 8, (startY + 2) * 16, 'prop_shop_sign');
    // Display showcase window beside entrance
    this.add.image((startX + 2) * 16 + 8, (startY + 3) * 16 + 8, 'prop_shop_window');
  }

  // --- Static Props & Interactive Entities ---

  createStaticProps() {
    // 1. Trash Can outside Player's House (x: 3, y: 21)
    this.trashSprite = this.add.image(3 * 16 + 8, 21 * 16 + 8, 'prop_trash_full');
    this.collisionGrid[21][3] = true;

    // 2. Garden Hedge to Trim in Mom's garden (x: 9, y: 22)
    this.hedgeSprite = this.add.image(9 * 16 + 8, 22 * 16 + 8, 'prop_hedge_overgrown');
    this.collisionGrid[22][9] = true;

    // 3. Mrs. Miller's Parcel on Player's front porch (x: 6, y: 20)
    this.parcelSprite = this.add.image(6 * 16 + 8, 20 * 16 + 8, 'prop_parcel');

    // 4. Mailboxes
    this.add.image(8 * 16 + 8, 23 * 16 + 8, 'prop_mailbox'); // Player's mailbox
    this.add.image(27 * 16 + 8, 23 * 16 + 8, 'prop_mailbox'); // Mrs. Miller's mailbox
    this.collisionGrid[23][8] = true;
    this.collisionGrid[23][27] = true;

    // 5. Park Benches
    this.bench1 = this.add.image(9 * 16 + 8, 3 * 16 + 8, 'prop_bench');
    this.bench2 = this.add.image(14 * 16 + 8, 8 * 16 + 8, 'prop_bench');
    this.collisionGrid[3][9] = true;
    this.collisionGrid[8][14] = true;

    // Shiny coin glint under Park Bench 1 (x: 9, y: 4)
    this.coinGlint = this.add.circle(9 * 16 + 8, 4 * 16 + 2, 3, 0xf7e148);
    this.tweens.add({
      targets: this.coinGlint,
      alpha: 0.3,
      scale: 0.7,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // 6. June's Radio by the Park (x: 6, y: 11)
    this.radioSprite = this.add.image(6 * 16 + 8, 11 * 16 + 8, 'prop_radio');
    this.collisionGrid[11][6] = true;

    // Musical note particles emitting from radio
    const radioNote = this.add.text(6 * 16 + 8, 11 * 16 - 2, '♪', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#e69a37'
    });
    this.tweens.add({
      targets: radioNote,
      y: 11 * 16 - 16,
      alpha: 0,
      duration: 1200,
      repeat: -1
    });

    // 7. Parked 1970s Vintage Cars
    // Blue sedan on road (x: 21, y: 18)
    this.add.image(21 * 16 + 16, 18 * 16 + 8, 'car_blue');
    this.collisionGrid[18][21] = true;
    this.collisionGrid[18][22] = true;

    // Orange wagon in Bob's driveway (x: 34, y: 22)
    this.add.image(34 * 16 + 16, 22 * 16 + 8, 'car_orange');
    this.collisionGrid[22][34] = true;
    this.collisionGrid[22][35] = true;
  }

  // --- NPCs Setup ---

  createNPCs() {
    this.npcs = [];

    // 1. Mom standing outside front garden (x: 7, y: 22)
    this.momSprite = this.add.image(7 * 16 + 8, 22 * 16 + 8, 'npc_mom');
    this.momSprite.setDisplaySize(16, 24);
    this.collisionGrid[22][7] = true;
    this.npcs.push({
      id: 'mom',
      name: 'Mom',
      portrait: 'portrait_mom',
      x: 7,
      y: 22,
      sprite: this.momSprite,
      interact: () => this.talkToMom()
    });

    // 2. Mrs. Miller standing in her front yard (x: 28, y: 22)
    this.millerSprite = this.add.image(28 * 16 + 8, 22 * 16 + 8, 'npc_mrs_miller');
    this.millerSprite.setDisplaySize(16, 24);
    this.collisionGrid[22][28] = true;
    this.npcs.push({
      id: 'miller',
      name: 'Mrs. Miller',
      portrait: 'portrait_miller',
      x: 28,
      y: 22,
      sprite: this.millerSprite,
      interact: () => this.talkToMrsMiller()
    });

    // 3. June hanging out in the park by the radio (x: 7, y: 11)
    this.juneSprite = this.add.image(7 * 16 + 8, 11 * 16 + 8, 'npc_june');
    this.juneSprite.setDisplaySize(16, 24);
    this.collisionGrid[11][7] = true;
    this.npcs.push({
      id: 'june',
      name: 'June',
      portrait: 'portrait_june',
      x: 7,
      y: 11,
      sprite: this.juneSprite,
      interact: () => this.talkToJune()
    });

    // 4. Timmy (Math Kid) standing on sidewalk (x: 20, y: 11)
    this.timmySprite = this.add.image(20 * 16 + 8, 11 * 16 + 8, 'npc_timmy');
    this.timmySprite.setDisplaySize(16, 24);
    this.collisionGrid[11][20] = true;
    this.npcs.push({
      id: 'timmy',
      name: 'Timmy',
      portrait: 'portrait_timmy',
      x: 20,
      y: 11,
      sprite: this.timmySprite,
      interact: () => this.talkToTimmy()
    });

    // 5. Neighbor Bob in his yard (x: 36, y: 22)
    this.bobSprite = this.add.image(36 * 16 + 8, 22 * 16 + 8, 'npc_neighbor_bob');
    this.bobSprite.setDisplaySize(16, 24);
    this.collisionGrid[22][36] = true;
    this.npcs.push({
      id: 'bob',
      name: 'Neighbor Bob',
      portrait: 'portrait_bob',
      x: 36,
      y: 22,
      sprite: this.bobSprite,
      interact: () => this.talkToBob()
    });

    // 6. Barnaby the Dog sniffing in the park (x: 12, y: 11)
    this.dogSprite = this.add.image(12 * 16 + 8, 11 * 16 + 8, 'npc_dog_barnaby');
    this.dogSprite.setDisplaySize(16, 16);
    this.npcs.push({
      id: 'dog',
      name: 'Barnaby',
      portrait: 'portrait_dog',
      x: 12,
      y: 11,
      sprite: this.dogSprite,
      interact: () => this.interactDog()
    });
  }

  // --- Player Setup & Camera ---

  createPlayer() {
    this.playerTileX = 5;
    this.playerTileY = 22;

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
    this.cameras.main.setZoom(1);
  }

  setupHUD() {
    // Context Interaction Prompt Banner
    this.promptContainer = this.add.container(384 / 2, 202);
    this.promptContainer.setScrollFactor(0);
    this.promptContainer.setDepth(900);
    this.promptContainer.setVisible(false);

    this.promptBg = this.add.rectangle(0, 0, 160, 20, 0x1f2b1d, 0.85);
    this.promptBg.setStrokeStyle(1, 0xf6f1de);

    this.promptText = this.add.text(0, 0, 'E - INTERACT', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#f6f1de',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.promptContainer.add([this.promptBg, this.promptText]);
  }

  // --- Main Update Loop ---

  update(time, delta) {
    // If dialogue is active, player cannot move
    if (this.dialogueBox && this.dialogueBox.isOpen) {
      this.promptContainer.setVisible(false);
      return;
    }

    this.checkContextualPrompts();
    this.handlePlayerInput();
    this.updateDogFollow();
  }

  // --- Grid-based Movement ---

  handlePlayerInput() {
    if (this.isMoving) return;

    let dx = 0;
    let dy = 0;
    let dir = null;

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      dx = -1;
      dir = 'left';
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      dx = 1;
      dir = 'right';
    } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
      dy = -1;
      dir = 'up';
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      dy = 1;
      dir = 'down';
    }

    if (dir) {
      audioManager.init(); // lazy audio unlock
      this.playerFacing = dir;
      const targetX = this.playerTileX + dx;
      const targetY = this.playerTileY + dy;

      // Update facing frame
      this.player.setTexture(`player_${dir}_0`);

      // Check walkability & collisions
      if (this.isTileWalkable(targetX, targetY)) {
        this.startTileMove(targetX, targetY, dir);
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
    audioManager.playStep();

    // Advance in-game time slightly
    this.stepCount++;
    if (this.stepCount % 40 === 0) {
      gameState.advanceTime(1);
    }

    // Walking animation alternating frames
    const stepFrame = (this.stepCount % 2 === 0) ? 1 : 2;
    this.player.setTexture(`player_${dir}_${stepFrame}`);

    this.tweens.add({
      targets: this.player,
      x: targetX * 16 + 8,
      y: targetY * 16 + 8,
      duration: 175,
      ease: 'Linear',
      onComplete: () => {
        this.playerTileX = targetX;
        this.playerTileY = targetY;
        this.player.setTexture(`player_${dir}_0`);
        this.isMoving = false;
      }
    });
  }

  // --- Contextual Interaction Detection ---

  checkContextualPrompts() {
    let targetX = this.playerTileX;
    let targetY = this.playerTileY;

    if (this.playerFacing === 'up') targetY--;
    else if (this.playerFacing === 'down') targetY++;
    else if (this.playerFacing === 'left') targetX--;
    else if (this.playerFacing === 'right') targetX++;

    let activePrompt = null;
    let actionFn = null;

    // 1. Mom
    if (targetX === 7 && targetY === 22) {
      activePrompt = 'E — TALK TO MOM';
      actionFn = () => this.talkToMom();
    }
    // 2. Trash Can
    else if (targetX === 3 && targetY === 21) {
      activePrompt = gameState.state.quests.trash ? 'E — INSPECT TRASH CAN' : 'E — TAKE OUT TRASH';
      actionFn = () => this.interactTrash();
    }
    // 3. Garden Hedge
    else if (targetX === 9 && targetY === 22) {
      activePrompt = gameState.state.quests.hedge ? 'E — INSPECT HEDGE' : 'E — TRIM GARDEN HEDGE';
      actionFn = () => this.interactHedge();
    }
    // 4. Mrs. Miller's Parcel on Porch
    else if (targetX === 6 && targetY === 20 && !gameState.state.quests.parcelCollected) {
      activePrompt = 'E — PICK UP PARCEL';
      actionFn = () => this.interactParcel();
    }
    // 5. Mrs. Miller
    else if (targetX === 28 && targetY === 22) {
      activePrompt = 'E — TALK TO MRS. MILLER';
      actionFn = () => this.talkToMrsMiller();
    }
    // 6. Record Shop Entrance
    else if (targetX === 31 && targetY === 8) {
      activePrompt = 'E — ENTER RECORD SHOP';
      actionFn = () => this.enterRecordShop();
    }
    // 7. June
    else if (targetX === 7 && targetY === 11) {
      activePrompt = 'E — TALK TO JUNE';
      actionFn = () => this.talkToJune();
    }
    // 8. Timmy (Math Bet)
    else if (targetX === 20 && targetY === 11) {
      activePrompt = 'E — TALK TO TIMMY';
      actionFn = () => this.talkToTimmy();
    }
    // 9. Neighbor Bob
    else if (targetX === 36 && targetY === 22) {
      activePrompt = 'E — TALK TO NEIGHBOR BOB';
      actionFn = () => this.talkToBob();
    }
    // 10. Dog Barnaby
    else if (Math.abs(this.playerTileX - 12) <= 1 && Math.abs(this.playerTileY - 11) <= 1 && !gameState.state.dogFollowing && !gameState.state.quests.dogRescued) {
      activePrompt = 'E — PET BARNABY';
      actionFn = () => this.interactDog();
    }
    // 11. Shiny Coin under Park Bench (x: 9, y: 3 or 4)
    else if (targetX === 9 && (targetY === 3 || targetY === 4) && !gameState.state.quests.benchCoinFound) {
      activePrompt = 'E — PICK UP SHINY COIN';
      actionFn = () => this.interactCoin();
    }
    // 12. Player's Front Door (x: 7, y: 20)
    else if (targetX === 7 && targetY === 20) {
      activePrompt = gameState.state.quests.albumBought ? 'E — ENTER BEDROOM (FINALE)' : 'E — HOME DOOR';
      actionFn = () => this.interactHomeDoor();
    }

    if (activePrompt) {
      this.promptText.setText(activePrompt);
      this.promptBg.setSize(activePrompt.length * 7 + 20, 20);
      this.promptContainer.setVisible(true);

      if (Phaser.Input.Keyboard.JustDown(this.wasd.interact) || Phaser.Input.Keyboard.JustDown(this.wasd.space)) {
        actionFn();
      }
    } else {
      this.promptContainer.setVisible(false);
    }
  }

  // --- Interactive Quest Handlers ---

  talkToMom() {
    const choresDone = gameState.getCompletedChoreCount();
    const albumBought = gameState.state.quests.albumBought;

    if (albumBought) {
      this.dialogueBox.show(
        'Mom',
        'portrait_mom',
        [
          'Oh! You actually bought Midnight Radio! Look at that gorgeous album sleeve!',
          'Go on into your room and put it on your turntable! You earned it, sweetie.'
        ]
      );
    } else if (choresDone === 3) {
      this.dialogueBox.show(
        'Mom',
        'portrait_mom',
        [
          'All three chores done and the yard looks fantastic!',
          'You should have plenty of cash in your pocket now. Run over to the record shop before Mr. Vinyl closes!'
        ]
      );
    } else {
      const remaining = [];
      if (!gameState.state.quests.trash) remaining.push('• Take out the trash by the side yard');
      if (!gameState.state.quests.hedge) remaining.push('• Trim the unruly garden hedge');
      if (!gameState.state.quests.parcelDelivered) remaining.push('• Deliver Mrs. Miller\'s parcel');

      this.dialogueBox.show(
        'Mom',
        'portrait_mom',
        [
          'Here\'s what\'s left on your list today, honey:',
          remaining.join('\n'),
          'Keep at it! You\'ll have that record in no time.'
        ]
      );
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

    this.dialogueBox.show(
      'You',
      null,
      [
        '★ Chore Complete: Took out the heavy trash bag! ★',
        'Mom left $2 in the pocket-money jar for this chore. (+ $2.00)'
      ]
    );
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

    this.dialogueBox.show(
      'You',
      null,
      [
        '★ Picked up Mrs. Miller\'s Parcel! ★',
        'It is wrapped in brown butcher paper and tied with twine. Deliver it to her house down the street.'
      ]
    );
  }

  talkToMrsMiller() {
    const hasParcel = gameState.hasItem('Mrs. Miller\'s Parcel');
    const delivered = gameState.state.quests.parcelDelivered;

    if (delivered) {
      this.dialogueBox.show(
        'Mrs. Miller',
        'portrait_miller',
        [
          'My garden seed catalog arrived just in time. Thank you again for being such a wonderful neighbor, dear!'
        ]
      );
    } else if (hasParcel) {
      audioManager.playSuccess();
      audioManager.playCoin();
      gameState.removeItem('Mrs. Miller\'s Parcel');
      gameState.setQuest('parcelDelivered', true);
      gameState.addCash(7);
      gameState.advanceTime(10);

      this.dialogueBox.show(
        'Mrs. Miller',
        'portrait_miller',
        [
          'Oh! That\'s my parcel!! You\'re an absolute lifesaver.',
          'Here, take this $7.00. And thank you so much, dear!'
        ]
      );
    } else {
      this.dialogueBox.show(
        'Mrs. Miller',
        'portrait_miller',
        [
          'Hello there! Your mother mentioned you might have a delivery for me from the postman?',
          'Check your front porch, dear. It should be waiting right there.'
        ]
      );
    }
  }

  enterRecordShop() {
    this.scene.pause('NeighborhoodScene');
    this.scene.launch('RecordShopScene');
  }

  talkToJune() {
    if (gameState.state.quests.juneDone) {
      this.dialogueBox.show(
        'June',
        'portrait_june',
        [
          'I\'m still grooving to the 4:00 PM station! Go grab Midnight Radio before Mr. Vinyl packs up for the evening!'
        ]
      );
      return;
    }

    this.dialogueBox.show(
      'June',
      'portrait_june',
      [
        'I found a radio station that actually plays the good stuff after four. Everyone else listens to the same five songs.',
        'Come sit for a minute and jam with me!'
      ],
      () => {
        this.scene.pause('NeighborhoodScene');
        this.scene.launch('JuneMinigameScene');
      }
    );
  }

  talkToTimmy() {
    if (gameState.state.quests.mathDone) {
      this.dialogueBox.show(
        'Timmy',
        'portrait_timmy',
        ['Thanks for helping me win that math bet with my brother! Now I can buy two cherry sodas!']
      );
      return;
    }

    this.dialogueBox.show(
      'Timmy',
      'portrait_timmy',
      [
        'Hey! My older brother bet me $2 that I couldn\'t solve his math riddle!',
        'Help me solve it and the two bucks is yours!'
      ],
      () => {
        this.scene.pause('NeighborhoodScene');
        this.scene.launch('MathMinigameScene');
      }
    );
  }

  talkToBob() {
    if (gameState.state.quests.dogRescued) {
      this.dialogueBox.show(
        'Neighbor Bob',
        'portrait_bob',
        ['Barnaby has had enough adventures for one afternoon. Thanks again, kid!']
      );
    } else if (gameState.state.dogFollowing) {
      audioManager.playSuccess();
      audioManager.playCoin();
      gameState.setQuest('dogRescued', true);
      gameState.setQuest('dogFollowing', false);
      gameState.addCash(4);
      gameState.advanceTime(10);

      this.dogSprite.setX(35 * 16 + 8);
      this.dogSprite.setY(23 * 16 + 8);

      this.dialogueBox.show(
        'Neighbor Bob',
        'portrait_bob',
        [
          'Barnaby! You brought my dog back safe and sound!',
          'You\'re a good kid. Here\'s $4 for helping out an old neighbor!'
        ]
      );
    } else {
      this.dialogueBox.show(
        'Neighbor Bob',
        'portrait_bob',
        [
          'Have you seen my hound dog Barnaby? He caught scent of a squirrel and dashed off into the park near the pond!',
          'If you see him, call him over and bring him home, would you?'
        ]
      );
    }
  }

  interactDog() {
    if (gameState.state.quests.dogRescued) {
      audioManager.playTalk('dog');
      this.dialogueBox.show('Barnaby', 'portrait_dog', ['*Woof!* Barnaby wags his tail contentedly.']);
      return;
    }

    audioManager.playTalk('dog');
    gameState.setQuest('dogFollowing', true);

    this.dialogueBox.show(
      'Barnaby',
      'portrait_dog',
      [
        '*Woof! Woof!*',
        'Barnaby happily licks your hand and decides to follow you! Lead him back to Neighbor Bob\'s yard.'
      ]
    );
  }

  updateDogFollow() {
    if (gameState.state.dogFollowing && !gameState.state.quests.dogRescued) {
      const targetX = this.player.x - 14;
      const targetY = this.player.y;
      this.dogSprite.x = Phaser.Math.Linear(this.dogSprite.x, targetX, 0.08);
      this.dogSprite.y = Phaser.Math.Linear(this.dogSprite.y, targetY, 0.08);
    }
  }

  interactCoin() {
    audioManager.playCoin();
    gameState.addCash(1);
    gameState.setQuest('benchCoinFound', true);
    this.coinGlint.setVisible(false);

    this.dialogueBox.show('You', null, ['Found a shiny $1.00 coin glinting under the park bench! (+$1.00)']);
  }

  interactHomeDoor() {
    if (gameState.state.quests.albumBought) {
      // Transition to Ending Scene!
      this.scene.stop('NeighborhoodScene');
      this.scene.start('EndingScene');
    } else {
      this.dialogueBox.show(
        'You',
        null,
        ['You shouldn\'t head inside yet—you still want to earn enough money and buy Midnight Radio from the record shop!']
      );
    }
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
  }
}
