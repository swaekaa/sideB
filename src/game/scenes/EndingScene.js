/**
 * EndingScene.js
 * SIDE B: One Perfect Afternoon (1969)
 * Full Level Design Overhaul: An authentic, explorable 1969 teenager's bedroom.
 * Architecturally coherent, 3 distinct visual zones, full movement, collisions, depth sorting & rich interactions.
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';
import { DialogueBox } from '../ui/DialogueBox.js';

export class EndingScene extends Phaser.Scene {
  constructor() {
    super('EndingScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#0a080e');

    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // Room boundaries
    this.roomMinX = 76;
    this.roomMaxX = 564;
    this.wallBaseY = 108;
    this.floorBottomY = 336;

    // In-game dialogue box
    this.dialogueBox = new DialogueBox(this);

    // Build the room components
    this.buildArchitecture();
    this.buildZoneA_Sleeping();
    this.buildZoneB_Study();
    this.buildZoneC_Music();
    this.buildFarRightFurniture();
    this.buildLightingAndAtmosphere();

    // Create explorable player
    this.createPlayer();
    this.setupControls();
    this.setupHUDPrompt();
    this.setupMusic();

    // Setup movie credits overlay hookups
    this.setupEndingOverlay();

    // If player just purchased the album and entered, show brief initial welcome dialogue
    if (gameState.state.quests.albumBought && !this.initialWelcomeShown) {
      this.initialWelcomeShown = true;
      this.time.delayedCall(500, () => {
        this.dialogueBox.show('You', 'portrait_player', [
          'You made it back to your bedroom before sundown with Led Zeppelin II!',
          'Your Garrard 301 turntable is spinning "Whole Lotta Love". Explore your room, relax, or check out the turntable.'
        ]);
      });
    }
  }

  // ==========================================
  // 1. ARCHITECTURE & ENCLOSURE
  // ==========================================

  buildArchitecture() {
    const rx1 = this.roomMinX;
    const rx2 = this.roomMaxX;
    const rw = rx2 - rx1;
    const wy = this.wallBaseY;
    const cx = (rx1 + rx2) / 2;

    // Outer shadow framing (cutaway room depth)
    this.add.rectangle(320, 180, 640, 360, 0x07060a);
    this.add.rectangle(cx + 4, 184, rw + 20, 336, 0x000000, 0.7);

    // --- Back Wall (Warm Wood Planking / Shiplap) ---
    this.add.rectangle(cx, wy / 2, rw + 16, wy, 0x483526);
    // Vertical wood plank seams
    for (let x = rx1; x <= rx2; x += 14) {
      const tone = (Math.floor(x / 14) % 2 === 0) ? 0x3d2c1e : 0x543e2c;
      this.add.rectangle(x + 7, wy / 2, 13, wy, tone);
      this.add.rectangle(x, wy / 2, 1, wy, 0x24180e, 0.7);
      // Subtle nail dots along plank headers
      this.add.rectangle(x + 7, 26, 1.5, 1.5, 0x181008);
      this.add.rectangle(x + 7, wy - 8, 1.5, 1.5, 0x181008);
    }

    // Top Crown Molding
    this.add.rectangle(cx, 10, rw + 16, 12, 0x22140a);
    this.add.rectangle(cx, 16, rw + 16, 2, 0x3a2212);

    // Left Wall Edge (Perspective depth)
    this.add.rectangle(rx1 - 4, 180, 8, 336, 0x22140a);
    this.add.rectangle(rx1, 180, 2, 336, 0x140c06);

    // Right Wall Edge
    this.add.rectangle(rx2 + 4, 180, 8, 336, 0x22140a);
    this.add.rectangle(rx2, 180, 2, 336, 0x140c06);

    // Wall Baseboard Trim along floor seam
    this.add.rectangle(cx, wy - 3, rw + 16, 6, 0x28180c);
    this.add.rectangle(cx, wy, rw + 16, 2, 0x140c06);

    // --- Detailed Hardwood Floor ---
    const floorH = this.floorBottomY - wy;
    this.add.rectangle(cx, wy + floorH / 2, rw, floorH, 0x763e20);

    // Individual horizontal floor planks with tonal variation
    const plankTones = [0x6c361a, 0x7e4424, 0x723c1e, 0x864826, 0x6e381c, 0x7a4022];
    let toneIdx = 0;
    for (let y = wy + 4; y < this.floorBottomY; y += 9) {
      const pColor = plankTones[toneIdx % plankTones.length];
      toneIdx++;
      this.add.rectangle(cx, y + 4, rw, 8, pColor);
      this.add.rectangle(cx, y + 8, rw, 1, 0x482010, 0.65); // Plank groove seam

      // Staggered vertical plank joints
      const xOffset = ((Math.floor(y / 9) % 3) * 65);
      for (let jx = rx1 + xOffset; jx < rx2; jx += 120) {
        this.add.rectangle(jx, y + 4, 1, 8, 0x36160a, 0.55);
        this.add.rectangle(jx - 3, y + 2, 1, 1, 0x1e0c06); // Nail
        this.add.rectangle(jx + 3, y + 6, 1, 1, 0x1e0c06); // Nail
      }
    }

    // --- Bottom Wall with Doorway ---
    this.add.rectangle(cx, this.floorBottomY + 7, rw + 16, 14, 0x22140a);
    this.add.rectangle(cx, this.floorBottomY, rw + 16, 2, 0x362010);

    // Doorway at bottom center (x: 300 to 340)
    const doorX = 320;
    const doorY = this.floorBottomY;
    // Cutout opening in bottom wall
    this.add.rectangle(doorX, doorY + 6, 48, 16, 0x16101c);
    // Outer wooden porch planks visible through door
    this.add.rectangle(doorX, doorY + 8, 44, 12, 0x4a2a16);
    this.add.rectangle(doorX, doorY + 4, 46, 2, 0x8a542a); // Door threshold
    // Door frame posts
    this.add.rectangle(doorX - 23, doorY + 4, 3, 14, 0x58341c);
    this.add.rectangle(doorX + 23, doorY + 4, 3, 14, 0x58341c);

    // Natural Coir Welcome Mat inside doorway
    this.add.rectangle(doorX, doorY - 10, 48, 18, 0x8a6234).setDepth(2);
    this.add.rectangle(doorX, doorY - 10, 44, 14, 0x6e4c24).setDepth(2);
    // Mat fiber texture
    for (let mx = doorX - 18; mx <= doorX + 18; mx += 6) {
      this.add.rectangle(mx, doorY - 10, 1, 12, 0xa47844, 0.6).setDepth(2);
    }

    // --- Sunset Window on Back Wall ---
    const winX = 155;
    const winY = 60;
    const winW = 76;
    const winH = 54;
    // Outer wood frame
    this.add.rectangle(winX, winY, winW + 8, winH + 8, 0x2a1a0e);
    // Sunset gradient sky
    this.add.rectangle(winX, winY - 16, winW, 14, 0x1a1226); // deep twilight
    this.add.rectangle(winX, winY - 4, winW, 12, 0x561e2e);  // crimson
    this.add.rectangle(winX, winY + 6, winW, 10, 0xba521e);  // burnt orange
    this.add.rectangle(winX, winY + 16, winW, 12, 0xf09a2c); // golden horizon

    // Silhouetted pine trees
    const treeTris = [
      [-24, 14, 8, 16], [-12, 16, 10, 20], [4, 12, 8, 14], [18, 15, 9, 18], [28, 17, 7, 14]
    ];
    treeTris.forEach(([tx, ty, tw, th]) => {
      this.add.triangle(winX + tx, winY + ty, -tw/2, th/2, tw/2, th/2, 0, -th/2, 0x181014);
    });

    // 4 Window Panes (Cross Mullions)
    this.add.rectangle(winX, winY, winW, 2, 0x2a1a0e);
    this.add.rectangle(winX, winY, 2, winH, 0x2a1a0e);
    // Window Sill
    this.add.rectangle(winX, winY + winH / 2 + 3, winW + 12, 5, 0x3a2414);

    // Tartan / Plaid Curtains
    this.add.rectangle(winX - winW / 2 + 5, winY, 12, winH + 4, 0x264834);
    this.add.rectangle(winX + winW / 2 - 5, winY, 12, winH + 4, 0x264834);
    // Red tie-backs
    this.add.rectangle(winX - winW / 2 + 5, winY + 6, 12, 2.5, 0xa63228);
    this.add.rectangle(winX + winW / 2 - 5, winY + 6, 12, 2.5, 0xa63228);

    // Warm diagonal window light spill on floor
    this.add.polygon(
      winX - 10, wy + 40,
      [[-25, -35], [45, -35], [75, 55], [-45, 55]],
      0xf09028, 0.08
    );
  }

  // ==========================================
  // 2. ZONE A: SLEEPING AREA (Left Side)
  // ==========================================

  buildZoneA_Sleeping() {
    const bedX = 125;
    const bedY = 175;

    // Patterned Oriental Rug beside / under bed
    const rugX = 180;
    const rugY = 248;
    this.add.rectangle(rugX, rugY, 120, 68, 0x8e2c22).setDepth(2);
    this.add.rectangle(rugX, rugY, 110, 58, 0x243a4e).setDepth(2);
    this.add.rectangle(rugX, rugY, 96, 46, 0x9e3224).setDepth(2);
    // Diamond center medallions
    for (let rx = rugX - 30; rx <= rugX + 30; rx += 20) {
      this.add.rectangle(rx, rugY, 10, 10, 0xd4a032).setDepth(2);
      this.add.rectangle(rx, rugY, 4, 4, 0x8e2c22).setDepth(2);
    }
    // Fringes on top and bottom ends
    for (let fx = rugX - 56; fx <= rugX + 56; fx += 5) {
      this.add.rectangle(fx, rugY - 35, 1.5, 3, 0xe8dcbe).setDepth(2);
      this.add.rectangle(fx, rugY + 35, 1.5, 3, 0xe8dcbe).setDepth(2);
    }

    // Drop shadow beneath bed frame
    this.add.rectangle(bedX + 4, bedY + 32, 86, 75, 0x140a04, 0.45).setDepth(3);

    // --- Bed Frame & Headboard ---
    // Ornate Walnut Headboard
    this.add.rectangle(bedX, 124, 84, 30, 0x3d2412).setDepth(4);
    this.add.rectangle(bedX, 114, 88, 5, 0x543218).setDepth(4);
    // Headboard post finials
    this.add.rectangle(bedX - 41, 110, 6, 38, 0x4a2a14).setDepth(4);
    this.add.rectangle(bedX + 41, 110, 6, 38, 0x4a2a14).setDepth(4);
    this.add.circle(bedX - 41, 93, 4, 0x5a341a).setDepth(4);
    this.add.circle(bedX + 41, 93, 4, 0x5a341a).setDepth(4);

    // Mattress & Bed Base
    this.add.rectangle(bedX, bedY + 8, 76, 76, 0x22323e).setDepth(4);

    // Green Tartan / Plaid Duvet
    this.add.rectangle(bedX, bedY + 18, 76, 60, 0x234a35).setDepth(5);
    // Plaid grid stripes
    for (let px = bedX - 34; px <= bedX + 34; px += 11) {
      this.add.rectangle(px, bedY + 18, 2, 60, 0x3a6e4d, 0.7).setDepth(5);
      this.add.rectangle(px + 4, bedY + 18, 1, 60, 0xd4a030, 0.5).setDepth(5);
    }
    for (let py = bedY - 8; py <= bedY + 44; py += 10) {
      this.add.rectangle(bedX, py, 76, 2, 0x3a6e4d, 0.7).setDepth(5);
      this.add.rectangle(bedX, py + 3, 76, 1, 0xd4a030, 0.5).setDepth(5);
    }

    // Turned-down white bed sheet border
    this.add.rectangle(bedX, bedY - 14, 74, 8, 0xf2ede0).setDepth(5);
    this.add.rectangle(bedX, bedY - 10, 74, 2, 0xded6c4).setDepth(5);

    // Thick White Pillow
    this.add.rectangle(bedX, 138, 54, 16, 0xf6f1e6).setDepth(5);
    this.add.rectangle(bedX, 142, 52, 2, 0xded6c4, 0.6).setDepth(5);

    // Footboard
    this.add.rectangle(bedX, 218, 84, 14, 0x442614).setDepth(220);
    this.add.rectangle(bedX, 213, 86, 3, 0x58341a).setDepth(220);
    this.add.rectangle(bedX - 41, 216, 6, 22, 0x4a2a14).setDepth(220);
    this.add.rectangle(bedX + 41, 216, 6, 22, 0x4a2a14).setDepth(220);

    // --- Bedside Nightstand ---
    const standX = 188;
    const standY = 148;
    this.add.rectangle(standX + 2, standY + 6, 34, 40, 0x140a04, 0.4).setDepth(3);
    this.add.rectangle(standX, standY, 32, 36, 0x4a2c16).setDepth(148);
    this.add.rectangle(standX, standY - 17, 34, 4, 0x623c20).setDepth(148);
    // Drawers with brass knobs
    this.add.rectangle(standX, standY - 6, 26, 9, 0x3a200e).setDepth(149);
    this.add.circle(standX, standY - 6, 1.5, 0xd4a030).setDepth(150);
    this.add.rectangle(standX, standY + 7, 26, 9, 0x3a200e).setDepth(149);
    this.add.circle(standX, standY + 7, 1.5, 0xd4a030).setDepth(150);

    // Bedside Brass Lamp with Warm Light Cone
    this.add.rectangle(standX - 5, standY - 22, 5, 8, 0x342012).setDepth(151);
    this.add.polygon(standX - 5, standY - 30, [[-9, 7], [9, 7], [6, -6], [-6, -6]], 0xf4cb42).setDepth(151);
    // Warm circular radiant lamp pool
    const lampGlow = this.add.circle(standX - 5, standY - 26, 38, 0xffe890, 0.16).setDepth(152);
    this.tweens.add({ targets: lampGlow, alpha: 0.11, duration: 2200, yoyo: true, repeat: -1 });

    // Retro Twin-Bell Alarm Clock
    this.add.circle(standX + 8, standY - 22, 4, 0xd8c840).setDepth(151);
    this.add.circle(standX + 8, standY - 22, 3, 0xffffff).setDepth(151);
    this.add.circle(standX + 6, standY - 26, 1.5, 0xd8c840).setDepth(151);
    this.add.circle(standX + 10, standY - 26, 1.5, 0xd8c840).setDepth(151);

    // Small Potted Plant
    this.add.polygon(standX + 8, standY - 14, [[-3, 3], [3, 3], [2, -2], [-2, -2]], 0xba5230).setDepth(151);
    this.add.circle(standX + 8, standY - 18, 3.5, 0x3a7848).setDepth(151);

    // Floor Props: Blue sneakers & open book
    this.add.rectangle(182, 214, 8, 4, 0x224870).setDepth(214);
    this.add.rectangle(192, 215, 8, 4, 0x224870).setDepth(214);
    this.add.rectangle(214, 268, 11, 7, 0xf0ead6).setDepth(268);
    this.add.rectangle(214, 268, 1, 7, 0x9e3224).setDepth(268); // Book spine

    // Acoustic Guitar #1 leaning against left wall
    const g1X = 82;
    const g1Y = 268;
    this.add.ellipse(g1X, g1Y + 4, 14, 18, 0xd49a42).setDepth(270); // Lower bout
    this.add.ellipse(g1X, g1Y - 6, 10, 12, 0xd49a42).setDepth(270); // Upper bout
    this.add.circle(g1X, g1Y, 3, 0x201408).setDepth(271);          // Soundhole
    this.add.rectangle(g1X, g1Y - 18, 3, 16, 0x4a2a14).setDepth(270); // Neck
    this.add.rectangle(g1X, g1Y - 26, 4, 7, 0x361c0c).setDepth(270);  // Headstock
  }

  // ==========================================
  // 3. ZONE B: STUDY & PERSONAL SPACE (Center-Left)
  // ==========================================

  buildZoneB_Study() {
    const deskX = 278;
    const deskY = 146;

    // Study Desk Shadow
    this.add.rectangle(deskX + 3, deskY + 6, 92, 48, 0x140a04, 0.45).setDepth(3);

    // Solid Oak Desk
    this.add.rectangle(deskX, deskY, 88, 46, 0x4c2e16).setDepth(146);
    this.add.rectangle(deskX, deskY - 22, 92, 6, 0x664022).setDepth(146);

    // Right-side 3 Drawers with brass handles
    const drwX = deskX + 26;
    for (let d = 0; d < 3; d++) {
      const dy = deskY - 11 + d * 13;
      this.add.rectangle(drwX, dy, 26, 10, 0x3a200e).setDepth(147);
      this.add.circle(drwX, dy, 1.5, 0xd4a030).setDepth(148);
    }
    // Center pencil drawer
    this.add.rectangle(deskX - 16, deskY - 15, 42, 6, 0x3a200e).setDepth(147);
    this.add.circle(deskX - 16, deskY - 15, 1.2, 0xd4a030).setDepth(148);

    // Desk Props:
    // 1. Gooseneck Desk Lamp
    this.add.rectangle(deskX - 32, deskY - 26, 6, 12, 0x242426).setDepth(149);
    this.add.polygon(deskX - 28, deskY - 34, [[-8, 6], [8, 6], [5, -5], [-5, -5]], 0x24684a).setDepth(149);
    const deskGlow = this.add.circle(deskX - 26, deskY - 24, 30, 0xffe688, 0.15).setDepth(150);
    this.tweens.add({ targets: deskGlow, alpha: 0.1, duration: 1900, yoyo: true, repeat: -1 });

    // 2. Open Lined Notebook & Pencil
    this.add.rectangle(deskX - 6, deskY - 26, 18, 12, 0xf4eedc).setDepth(149);
    this.add.rectangle(deskX - 6, deskY - 26, 1, 12, 0x364860).setDepth(149);
    this.add.rectangle(deskX + 6, deskY - 24, 10, 1.5, 0xcaa030).setDepth(150); // Pencil

    // 3. Stack of Hardcover School Textbooks
    this.add.rectangle(deskX + 22, deskY - 26, 16, 5, 0x8a2c20).setDepth(149);
    this.add.rectangle(deskX + 22, deskY - 30, 14, 4, 0x244c70).setDepth(149);

    // 4. Pencil Cup Holder
    this.add.rectangle(deskX + 34, deskY - 27, 6, 8, 0x8a7258).setDepth(149);
    this.add.rectangle(deskX + 33, deskY - 33, 1, 6, 0xd43020).setDepth(150);
    this.add.rectangle(deskX + 35, deskY - 34, 1, 7, 0xcaa030).setDepth(150);

    // 5. Transistor Radio on Desk Shelf
    this.add.rectangle(deskX - 6, deskY - 40, 22, 12, 0x223038).setDepth(148);
    this.add.circle(deskX - 11, deskY - 40, 3.5, 0xcccccc).setDepth(149); // Speaker
    this.add.rectangle(deskX + 1, deskY - 40, 6, 4, 0xd4a030).setDepth(149);  // Tuner dial

    // Study Chair neatly positioned at desk
    const chairX = 258;
    const chairY = 180;
    this.add.rectangle(chairX, chairY, 18, 18, 0x58341a).setDepth(180);
    this.add.rectangle(chairX, chairY - 10, 18, 4, 0x442612).setDepth(180); // Chair back
    for (let c = -6; c <= 6; c += 4) {
      this.add.rectangle(chairX + c, chairY - 5, 1.5, 8, 0x3a200e).setDepth(180);
    }

    // Wastepaper Basket beside desk
    const trashX = 332;
    const trashY = 175;
    this.add.polygon(trashX, trashY, [[-7, 8], [7, 8], [6, -8], [-6, -8]], 0x766654).setDepth(175);
    // Crumpled paper balls
    this.add.circle(trashX - 2, trashY - 8, 3, 0xf0f0f0).setDepth(176);
    this.add.circle(trashX + 2, trashY - 6, 2.5, 0xf4f4f4).setDepth(176);
    this.add.circle(trashX + 8, trashY + 4, 2.5, 0xe8e8e8).setDepth(176);

    // Wall Posters above Desk
    // Poster 1: "MUSIC LIVES HERE" (Peace Sign)
    const p1X = 260;
    const p1Y = 64;
    this.add.rectangle(p1X, p1Y, 34, 44, 0x182434);
    this.add.text(p1X, p1Y - 14, 'MUSIC', {
      fontFamily: 'monospace', fontSize: '6px', color: '#ffea75', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.text(p1X, p1Y - 7, 'LIVES HERE', {
      fontFamily: 'monospace', fontSize: '4.5px', color: '#ffffff'
    }).setOrigin(0.5);
    // Peace symbol
    this.add.circle(p1X, p1Y + 7, 7, 0x000000, 0).setStrokeStyle(1.5, 0xffea75);
    this.add.rectangle(p1X, p1Y + 7, 1.5, 14, 0xffea75);
    this.add.line(0, 0, p1X, p1Y + 7, p1X - 5, p1Y + 12, 0xffea75).setLineWidth(1.5);
    this.add.line(0, 0, p1X, p1Y + 7, p1X + 5, p1Y + 12, 0xffea75).setLineWidth(1.5);
    // Masking tape on 4 corners
    [[-17, -22], [17, -22], [-17, 22], [17, 22]].forEach(([tx, ty]) => {
      this.add.rectangle(p1X + tx, p1Y + ty, 5, 2.5, 0xf0e6cb, 0.85).setAngle(45);
    });

    // Poster 2: 1969 Concert Bill
    const p2X = 300;
    const p2Y = 68;
    this.add.rectangle(p2X, p2Y, 26, 36, 0xd45028);
    this.add.rectangle(p2X, p2Y - 11, 22, 6, 0x224858);
    this.add.text(p2X, p2Y - 11, 'FILLMORE', {
      fontFamily: 'monospace', fontSize: '4px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.rectangle(p2X, p2Y + 4, 18, 14, 0x201812, 0.7);
    this.add.text(p2X, p2Y + 4, 'OCT 69', {
      fontFamily: 'monospace', fontSize: '4px', color: '#ffea75'
    }).setOrigin(0.5);
    [[-13, -18], [13, -18]].forEach(([tx, ty]) => {
      this.add.rectangle(p2X + tx, p2Y + ty, 4, 2, 0xf0e6cb, 0.85).setAngle(-35);
    });
  }

  // ==========================================
  // 4. ZONE C: MUSIC CORNER (Center-Right)
  // ==========================================

  buildZoneC_Music() {
    const shelfX = 375;
    const shelfY = 125;

    // Bookshelf #1 with cascading plant
    this.add.rectangle(shelfX, shelfY, 36, 54, 0x3e2412).setDepth(125);
    this.add.rectangle(shelfX, shelfY - 26, 40, 4, 0x543218).setDepth(125);
    // Books on shelves
    const bColors = [0x9e3224, 0x245478, 0xd4a028, 0x2e6e3c, 0x7a3070];
    for (let s = 0; s < 2; s++) {
      const sy = shelfY - 12 + s * 18;
      for (let b = 0; b < 4; b++) {
        this.add.rectangle(shelfX - 12 + b * 8, sy, 6, 12, bColors[(b + s) % bColors.length]).setDepth(126);
      }
    }
    // Terracotta plant on top with vines
    this.add.polygon(shelfX, shelfY - 32, [[-4, 4], [4, 4], [3, -3], [-3, -3]], 0xba5230).setDepth(127);
    this.add.circle(shelfX, shelfY - 36, 6, 0x367c44).setDepth(127);
    this.add.rectangle(shelfX - 4, shelfY - 26, 2, 8, 0x367c44).setDepth(127); // Vine hanging

    // --- Music Corner Woven Rug ---
    const rugX = 440;
    const rugY = 230;
    this.add.rectangle(rugX, rugY, 118, 64, 0x264834).setDepth(2);
    this.add.rectangle(rugX, rugY, 108, 54, 0x946e28).setDepth(2);
    this.add.rectangle(rugX, rugY, 96, 44, 0x264834).setDepth(2);
    for (let rx = rugX - 32; rx <= rugX + 32; rx += 16) {
      this.add.rectangle(rx, rugY, 8, 8, 0xd4b040).setDepth(2);
      this.add.rectangle(rx, rugY, 4, 4, 0x8a2c20).setDepth(2);
    }
    for (let fx = rugX - 54; fx <= rugX + 54; fx += 5) {
      this.add.rectangle(fx, rugY - 33, 1.5, 3, 0xe8dcbe).setDepth(2);
      this.add.rectangle(fx, rugY + 33, 1.5, 3, 0xe8dcbe).setDepth(2);
    }

    // --- Long Hallway / Door Runner Rug ---
    this.add.rectangle(320, 295, 110, 36, 0x8c2c22).setDepth(2);
    this.add.rectangle(320, 295, 102, 28, 0x244234).setDepth(2);
    for (let rx = 320 - 36; rx <= 320 + 36; rx += 18) {
      this.add.rectangle(rx, 295, 6, 6, 0xd8b042).setDepth(2);
    }

    // --- Turntable Console (Teak Hi-Fi Credenza) ---
    const ttX = 445;
    const ttY = 155;
    // Shadow
    this.add.rectangle(ttX + 3, ttY + 6, 98, 56, 0x140a04, 0.45).setDepth(3);

    // Teak Cabinet Body
    this.add.rectangle(ttX, ttY, 94, 52, 0x482c16).setDepth(155);
    this.add.rectangle(ttX, ttY - 26, 98, 5, 0x623c1e).setDepth(155);
    this.add.text(ttX, ttY - 33, 'GARRARD MODEL 301', {
      fontFamily: 'monospace', fontSize: '5.5px', color: '#e6cf8b', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(156);

    // Lower LP Storage Compartments (packed with records)
    this.add.rectangle(ttX, ttY + 11, 86, 24, 0x22140a).setDepth(156);
    const lpSpines = [
      0xd44030, 0x245888, 0xd8a828, 0x2e7844, 0x8a3078,
      0x406888, 0x307850, 0xb84430, 0x783060, 0xd09820,
      0x244868, 0x882820, 0x386840, 0xcaa030, 0x244868
    ];
    for (let i = 0; i < lpSpines.length; i++) {
      this.add.rectangle(ttX - 38 + i * 5.4, ttY + 11, 3.5, 20, lpSpines[i]).setDepth(157);
    }

    // Turntable Platter Deck on Top
    this.add.rectangle(ttX - 10, ttY - 12, 44, 22, 0x242426).setDepth(157);
    this.add.circle(ttX + 16, ttY - 14, 1.8, 0xff2222).setDepth(158); // Red LED indicator

    // Spinning Vinyl Record Platter
    this.vinylPlatter = this.add.circle(ttX - 12, ttY - 12, 13, 0x111111).setDepth(158);
    this.vinylPlatter.setStrokeStyle(1, 0x333333);
    [10, 7].forEach(r => {
      this.add.circle(ttX - 12, ttY - 12, r, 0x000000, 0).setStrokeStyle(0.5, 0x282828).setDepth(158);
    });
    // Atlantic Records Center Label (Plum & Red)
    this.vinylLabel = this.add.circle(ttX - 12, ttY - 12, 4.5, 0xc43424).setDepth(159);
    this.add.circle(ttX - 12, ttY - 12, 1.2, 0xffffff).setDepth(159);

    // Tonearm
    this.add.line(0, 0, ttX + 6, ttY - 2, ttX - 6, ttY - 14, 0xcccccc).setLineWidth(2).setDepth(160);
    this.add.circle(ttX + 6, ttY - 2, 2.5, 0x888888).setDepth(160);

    // Vinyl Rotation Animation (runs when listening)
    this.vinylTween = this.tweens.add({
      targets: [this.vinylPlatter, this.vinylLabel],
      angle: 360,
      duration: 1800,
      repeat: -1,
      ease: 'Linear'
    });

    // --- Flanking Stereo Speaker Cabinets ---
    // Left Speaker
    const spkLX = ttX - 38;
    this.add.rectangle(spkLX, ttY - 12, 16, 22, 0x382010).setDepth(157);
    this.add.rectangle(spkLX, ttY - 12, 13, 19, 0xb8aa8e).setDepth(158); // Cloth grille
    this.add.circle(spkLX, ttY - 15, 3, 0x222222).setDepth(159); // Tweeter
    this.add.circle(spkLX, ttY - 8, 4.5, 0x1a1a1a).setDepth(159); // Woofer

    // Right Speaker
    const spkRX = ttX + 38;
    this.add.rectangle(spkRX, ttY - 12, 16, 22, 0x382010).setDepth(157);
    this.add.rectangle(spkRX, ttY - 12, 13, 19, 0xb8aa8e).setDepth(158);
    this.add.circle(spkRX, ttY - 15, 3, 0x222222).setDepth(159);
    this.add.circle(spkRX, ttY - 8, 4.5, 0x1a1a1a).setDepth(159);

    // Side Vinyl Crate with LP Resting
    this.add.rectangle(398, 214, 24, 18, 0x6e4c28).setDepth(214);
    this.add.rectangle(398, 214, 20, 14, 0x3a2410).setDepth(214);
    // Vinyl sleeve in crate
    this.add.rectangle(398, 212, 18, 14, 0x284870).setDepth(215);

    // --- The Prize: Led Zeppelin II Sleeve on Display Stand ---
    const albumX = 485;
    const albumY = 208;
    this.add.rectangle(albumX, albumY + 12, 28, 4, 0x362010).setDepth(208); // Stand easel
    if (this.textures.exists('album_led_zeppelin_ii')) {
      const sleeve = this.add.image(albumX, albumY, 'album_led_zeppelin_ii');
      sleeve.setDisplaySize(38, 38).setDepth(209);
      sleeve.setAngle(-5);
    }

    // --- Wall Posters above Music Corner ---
    // 1. Central Big LED ZEPPELIN II Poster
    const lzX = 445;
    const lzY = 62;
    this.add.rectangle(lzX, lzY, 44, 54, 0x221a1e);
    // Sunset gradient banner
    this.add.rectangle(lzX, lzY - 14, 38, 12, 0x8a3020);
    this.add.text(lzX, lzY - 14, 'LED ZEPPELIN II', {
      fontFamily: 'monospace', fontSize: '4.5px', color: '#ffea75', fontStyle: 'bold'
    }).setOrigin(0.5);
    // Zeppelin Airship silhouette
    const zep = this.add.ellipse(lzX, lzY + 2, 26, 8, 0xd0c4b0);
    zep.setAngle(-10);
    // Crowd silhouette
    this.add.rectangle(lzX, lzY + 18, 38, 8, 0x110c0e);
    [[-21, -26], [21, -26], [-21, 26], [21, 26]].forEach(([tx, ty]) => {
      this.add.rectangle(lzX + tx, lzY + ty, 5, 2.5, 0xf0e6cb, 0.85).setAngle(45);
    });

    // 2. Jimi Hendrix Poster (Left of Zeppelin)
    const jhX = 405;
    const jhY = 68;
    this.add.rectangle(jhX, jhY, 28, 38, 0x5a1a42);
    this.add.circle(jhX - 2, jhY - 4, 6, 0xff70a0);
    this.add.line(0, 0, jhX - 6, jhY + 8, jhX + 8, jhY - 4, 0xffea75).setLineWidth(2);
    this.add.text(jhX, jhY + 12, 'HENDRIX', {
      fontFamily: 'monospace', fontSize: '4px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
    [[-13, -18], [13, -18]].forEach(([tx, ty]) => {
      this.add.rectangle(jhX + tx, jhY + ty, 4, 2, 0xf0e6cb, 0.85).setAngle(-35);
    });

    // 3. Psychedelic Sunburst Mandala Poster (Right of Zeppelin)
    const sbX = 485;
    const sbY = 68;
    this.add.rectangle(sbX, sbY, 28, 38, 0xd47020);
    this.add.circle(sbX, sbY, 9, 0xf4cb42);
    this.add.circle(sbX, sbY, 5, 0xba3220);
    this.add.circle(sbX, sbY, 2, 0xffffff);
    [[-13, -18], [13, -18]].forEach(([tx, ty]) => {
      this.add.rectangle(sbX + tx, sbY + ty, 4, 2, 0xf0e6cb, 0.85).setAngle(35);
    });

    // --- Listening Armchair ---
    const armX = 475;
    const armY = 235;
    // Drop shadow
    this.add.rectangle(armX + 2, armY + 6, 46, 48, 0x140a04, 0.4).setDepth(3);
    // Burgundy cushioned armchair
    this.add.rectangle(armX, armY, 42, 44, 0x7c2226).setDepth(235);
    this.add.rectangle(armX, armY - 14, 42, 14, 0x962c32).setDepth(235); // Tufted backrest
    this.add.rectangle(armX - 18, armY + 2, 7, 34, 0x661c20).setDepth(236); // Left armrest
    this.add.rectangle(armX + 18, armY + 2, 7, 34, 0x661c20).setDepth(236); // Right armrest
    // Throw Pillow with floral motif
    this.add.rectangle(armX + 4, armY - 2, 14, 14, 0xd8b040).setDepth(237);
    this.add.circle(armX + 4, armY - 2, 3, 0x7c2226).setDepth(237);
  }

  // ==========================================
  // 5. FAR RIGHT FURNITURE & WARDROBE
  // ==========================================

  buildFarRightFurniture() {
    // --- Tall Bookshelf #2 (Right Wall) ---
    const shelf2X = 538;
    const shelf2Y = 145;
    this.add.rectangle(shelf2X, shelf2Y, 36, 70, 0x3e2412).setDepth(145);
    this.add.rectangle(shelf2X, shelf2Y - 34, 40, 5, 0x543218).setDepth(145);
    // 3 shelves of books & LPs
    const cols = [0x284870, 0x8a2820, 0xd4a028, 0x286840, 0x683070, 0xc85020];
    for (let s = 0; s < 3; s++) {
      const sy = shelf2Y - 18 + s * 20;
      this.add.rectangle(shelf2X, sy + 7, 32, 2, 0x4a2a14).setDepth(146);
      for (let b = 0; b < 5; b++) {
        this.add.rectangle(shelf2X - 12 + b * 6.5, sy, 5, 14, cols[(b + s * 2) % cols.length]).setDepth(146);
      }
    }
    // Fern on top
    this.add.polygon(shelf2X, shelf2Y - 40, [[-4, 4], [4, 4], [3, -3], [-3, -3]], 0xba5230).setDepth(147);
    this.add.circle(shelf2X, shelf2Y - 44, 7, 0x2e6e3c).setDepth(147);

    // Acoustic Guitar #2 leaning against bookshelf #2
    const g2X = 552;
    const g2Y = 195;
    this.add.ellipse(g2X, g2Y + 4, 12, 16, 0xc88c38).setDepth(195);
    this.add.ellipse(g2X, g2Y - 5, 9, 10, 0xc88c38).setDepth(195);
    this.add.circle(g2X, g2Y, 2.5, 0x201408).setDepth(196);
    this.add.rectangle(g2X, g2Y - 15, 2.5, 14, 0x4a2a14).setDepth(195);

    // --- Tall Wooden Wardrobe (Far Right) ---
    const wardX = 536;
    const wardY = 265;
    this.add.rectangle(wardX + 2, wardY + 6, 44, 68, 0x140a04, 0.45).setDepth(3);
    this.add.rectangle(wardX, wardY, 42, 64, 0x4a2c14).setDepth(265);
    this.add.rectangle(wardX, wardY - 32, 46, 5, 0x623a1a).setDepth(265);
    // Double Doors
    this.add.rectangle(wardX - 10, wardY + 1, 18, 56, 0x3e2410).setDepth(266);
    this.add.rectangle(wardX + 10, wardY + 1, 18, 56, 0x3e2410).setDepth(266);
    // Brass Keyholes & Pulls
    this.add.circle(wardX - 3, wardY + 2, 1.5, 0xd4a030).setDepth(267);
    this.add.circle(wardX + 3, wardY + 2, 1.5, 0xd4a030).setDepth(267);

    // Denim Jacket hanging from hook on wardrobe side
    this.add.circle(wardX - 22, wardY - 14, 1.5, 0xd4a030).setDepth(268); // Hook
    this.add.polygon(wardX - 22, wardY - 4, [[-6, 12], [6, 12], [4, -6], [-4, -6]], 0x34567e).setDepth(268);
    this.add.rectangle(wardX - 22, wardY - 4, 1.5, 10, 0x223854).setDepth(269); // Seam
    this.add.circle(wardX - 22, wardY - 2, 1, 0xd4a030).setDepth(270); // Brass button

    // Large Terracotta Potted Fern on Floor
    this.add.polygon(505, 308, [[-6, 6], [6, 6], [4, -6], [-4, -6]], 0xba5230).setDepth(308);
    this.add.circle(505, 298, 9, 0x2c6838).setDepth(309);
    this.add.circle(502, 296, 6, 0x3d824c).setDepth(310);
    this.add.circle(508, 297, 6, 0x265a30).setDepth(310);
  }

  // ==========================================
  // 6. LIGHTING, ATMOSPHERE & FLOATING NOTES
  // ==========================================

  buildLightingAndAtmosphere() {
    // Subtle evening room tone
    this.add.rectangle(320, 180, 640, 360, 0x0c0814, 0.12).setDepth(400);

    // Floating Musical Notes from Turntable
    const noteChars = ['♪', '♫', '♩', '♬', '♪', '♫'];
    const noteColors = ['#f4cb42', '#f06080', '#40d0e8', '#c048f0', '#f48838', '#64e064'];
    noteChars.forEach((char, i) => {
      const note = this.add.text(445 + Phaser.Math.Between(-8, 8), 142, char, {
        fontFamily: 'monospace', fontSize: '13px', color: noteColors[i], fontStyle: 'bold'
      }).setDepth(450).setAlpha(0);

      this.time.delayedCall(i * 600, () => {
        this.tweens.add({
          targets: note,
          x: { from: note.x, to: note.x + Phaser.Math.Between(-30, 30) },
          y: { from: 142, to: 75 - i * 8 },
          alpha: { from: 0.9, to: 0 },
          duration: 2500,
          repeat: -1,
          repeatDelay: 250 + i * 150
        });
      });
    });

    // Define Level Collision Obstacles (precise base footprints)
    this.obstacles = [
      { id: 'bed', minX: 80, maxX: 168, minY: 130, maxY: 232 },
      { id: 'nightstand', minX: 172, maxX: 204, minY: 130, maxY: 164 },
      { id: 'desk', minX: 234, maxX: 324, minY: 130, maxY: 172 },
      { id: 'wastebasket', minX: 324, maxX: 342, minY: 160, maxY: 184 },
      { id: 'shelf1', minX: 356, maxX: 394, minY: 130, maxY: 160 },
      { id: 'turntable', minX: 394, maxX: 496, minY: 130, maxY: 174 },
      { id: 'armchair', minX: 454, maxX: 496, minY: 216, maxY: 254 },
      { id: 'shelf2', minX: 516, maxX: 560, minY: 130, maxY: 178 },
      { id: 'wardrobe', minX: 512, maxX: 560, minY: 236, maxY: 298 },
      { id: 'guitar1', minX: 74, maxX: 94, minY: 256, maxY: 284 }
    ];

    // Define Level Interactable Zones
    this.interactables = [
      {
        id: 'bed',
        x: 125, y: 195, radius: 45,
        prompt: 'E — REST ON BED',
        action: () => this.interactBed()
      },
      {
        id: 'desk',
        x: 278, y: 170, radius: 40,
        prompt: 'E — INSPECT STUDY DESK',
        action: () => this.interactDesk()
      },
      {
        id: 'turntable',
        x: 445, y: 175, radius: 44,
        prompt: gameState.state.quests.albumBought ? 'E — LISTEN TO LED ZEPPELIN II' : 'E — INSPECT GARRARD TURNTABLE',
        action: () => this.interactTurntable()
      },
      {
        id: 'records',
        x: 398, y: 215, radius: 36,
        prompt: 'E — BROWSE VINYL COLLECTION',
        action: () => this.interactRecordCollection()
      },
      {
        id: 'armchair',
        x: 475, y: 235, radius: 36,
        prompt: 'E — SIT IN LISTENING ARMCHAIR',
        action: () => this.interactArmchair()
      },
      {
        id: 'guitar_left',
        x: 82, y: 265, radius: 32,
        prompt: 'E — STRUM ACOUSTIC GUITAR',
        action: () => this.interactGuitar('left')
      },
      {
        id: 'guitar_right',
        x: 550, y: 195, radius: 32,
        prompt: 'E — STRUM ACOUSTIC GUITAR',
        action: () => this.interactGuitar('right')
      },
      {
        id: 'radio',
        x: 275, y: 135, radius: 30,
        prompt: 'E — TUNE BEDROOM RADIO',
        action: () => this.interactRadio()
      },
      {
        id: 'window',
        x: 155, y: 130, radius: 36,
        prompt: 'E — LOOK OUT WINDOW',
        action: () => this.interactWindow()
      },
      {
        id: 'wardrobe',
        x: 535, y: 270, radius: 38,
        prompt: 'E — INSPECT WARDROBE',
        action: () => this.interactWardrobe()
      },
      {
        id: 'door',
        x: 320, y: 320, radius: 36,
        prompt: 'E / S — EXIT TO NEIGHBORHOOD',
        action: () => this.exitToNeighborhood()
      }
    ];
  }

  // ==========================================
  // 7. EXPLORABLE PLAYER & CONTROLS
  // ==========================================

  createPlayer() {
    this.playerFacing = 'up';
    this.stepFrame = 0;
    this.stepCounter = 0;

    // Spawns just inside the doorway facing into the room
    this.player = this.add.sprite(320, 275, 'player_up_0');
    this.player.setDisplaySize(16, 24);
    this.player.setDepth(275);
  }

  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      interact: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    };
  }

  setupHUDPrompt() {
    this.promptContainer = this.add.container(320, 335);
    this.promptContainer.setDepth(999);
    this.promptContainer.setVisible(false);

    this.promptBg = this.add.rectangle(0, 0, 180, 20, 0x1f2b1d, 0.9);
    this.promptBg.setStrokeStyle(1.5, 0xe6c86a);

    this.promptText = this.add.text(0, 0, 'E — INTERACT', {
      fontFamily: 'monospace',
      fontSize: '9.5px',
      color: '#f6f1de',
      fontStyle: 'bold',
      resolution: 3
    }).setOrigin(0.5);

    this.promptContainer.add([this.promptBg, this.promptText]);
  }

  setupMusic() {
    if (gameState.state.quests.albumBought) {
      audioManager.playMusic('ending');
    } else {
      audioManager.resumeAmbientBGM();
    }
  }

  onDialogueClosed() {
    this.dialogueCooldownUntil = Date.now() + 500;
  }

  // --- Main Update Loop ---

  update(time, delta) {
    const overlay = document.getElementById('ending-credits-overlay');
    if (overlay && (overlay.classList.contains('active') || overlay.style.display === 'flex')) {
      if (this.promptContainer) this.promptContainer.setVisible(false);
      return;
    }

    this.handlePlayerInput(delta);
    this.checkInteractions();
  }

  handlePlayerInput(delta) {
    const overlay = document.getElementById('ending-credits-overlay');
    if (overlay && (overlay.classList.contains('active') || overlay.style.display === 'flex')) {
      if (this.promptContainer) this.promptContainer.setVisible(false);
      return;
    }

    if (this.dialogueBox && this.dialogueBox.isOpen) {
      this.promptContainer.setVisible(false);
      return;
    }

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
      this.playerFacing = dir;
      const speed = 105 * (delta / 1000);
      const newX = this.player.x + dx * speed;
      const newY = this.player.y + dy * speed;

      if (this.canMoveTo(newX, newY)) {
        this.player.x = newX;
        this.player.y = newY;

        this.stepCounter += speed;
        if (this.stepCounter >= 16) {
          this.stepCounter = 0;
          this.stepFrame = (this.stepFrame % 2) + 1;
          audioManager.playStep('wood');
        }
        this.player.setTexture(`player_${dir}_${this.stepFrame}`);
      } else if (this.canMoveTo(newX, this.player.y)) {
        this.player.x = newX;
        this.player.setTexture(`player_${dir}_1`);
      } else if (this.canMoveTo(this.player.x, newY)) {
        this.player.y = newY;
        this.player.setTexture(`player_${dir}_1`);
      }

      // Check if walking through doorway threshold to leave room
      if (this.player.y >= 330 && this.player.x >= 300 && this.player.x <= 340) {
        this.exitToNeighborhood();
        return;
      }
    } else {
      this.player.setTexture(`player_${this.playerFacing}_0`);
    }

    // Dynamic depth sorting: player depth equals Y coordinate
    this.player.setDepth(this.player.y);
  }

  canMoveTo(px, py) {
    const footX = px;
    const footY = py + 7;
    const hw = 5;
    const hh = 3;

    // Doorway exit exception
    if (footX >= 302 && footX <= 338 && footY >= 328 && footY <= 344) {
      return true;
    }

    // Outer room perimeter walls
    if (footX - hw < 92 || footX + hw > 548 || footY - hh < 134 || footY + hh > 328) {
      return false;
    }

    // Furniture collision obstacles
    for (const obs of this.obstacles) {
      if (
        footX + hw > obs.minX &&
        footX - hw < obs.maxX &&
        footY + hh > obs.minY &&
        footY - hh < obs.maxY
      ) {
        return false;
      }
    }

    return true;
  }

  checkInteractions() {
    const overlay = document.getElementById('ending-credits-overlay');
    if (overlay && (overlay.classList.contains('active') || overlay.style.display === 'flex')) {
      if (this.promptContainer) this.promptContainer.setVisible(false);
      return;
    }

    if (this.dialogueCooldownUntil && Date.now() < this.dialogueCooldownUntil) {
      if (this.promptContainer) this.promptContainer.setVisible(false);
      return;
    }

    if (this.dialogueBox && this.dialogueBox.isOpen) {
      if (this.promptContainer) this.promptContainer.setVisible(false);
      return;
    }

    let closest = null;
    let minDist = Infinity;

    for (const item of this.interactables) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
      if (dist <= item.radius && dist < minDist) {
        minDist = dist;
        closest = item;
      }
    }

    if (closest) {
      let pText = closest.prompt;
      if (closest.id === 'turntable') {
        pText = gameState.state.quests.albumBought ? 'E — LISTEN TO LED ZEPPELIN II' : 'E — INSPECT GARRARD TURNTABLE';
      }
      this.promptText.setText(pText);
      this.promptBg.setSize(pText.length * 7.5 + 24, 20);
      this.promptContainer.setVisible(true);

      if (Phaser.Input.Keyboard.JustDown(this.wasd.interact) || Phaser.Input.Keyboard.JustDown(this.wasd.space)) {
        closest.action();
      }
    } else {
      this.promptContainer.setVisible(false);
    }
  }

  // ==========================================
  // 8. MEANINGFUL ROOM INTERACTIONS
  // ==========================================

  interactBed() {
    this.dialogueBox.show('You', 'portrait_player', [
      'Your cozy bed with the green plaid wool quilt.',
      'After running all across town this afternoon doing chores, helping neighbors, and finding Buddy, falling asleep tonight is going to feel incredible.'
    ]);
  }

  interactDesk() {
    this.dialogueBox.show('You', 'portrait_player', [
      'Your study desk. A handwritten checklist is taped above your open notebook:',
      '• Take out trash by garage\n• Trim overgrown garden hedges\n• Deliver Mrs. Miller\'s parcel\n• GET LED ZEPPELIN II FROM MR. VINYL!',
      'A transistor radio and textbooks sit neatly beside your pencils.'
    ]);
  }

  interactRecordCollection() {
    if (gameState.state.quests.albumBought) {
      this.dialogueBox.show('You', 'portrait_player', [
        'Your vinyl collection: Beatles, Hendrix, The Who, Cream...',
        'And sitting right in front in mint condition: LED ZEPPELIN II! You worked all afternoon to earn every single dollar for this masterpiece.'
      ]);
    } else {
      const cash = gameState.state.cash;
      const needed = Math.max(0, 25 - cash);
      this.dialogueBox.show('You', 'portrait_player', [
        'Your vinyl collection: Abbey Road, Electric Ladyland, Tommy.',
        `The prime front slot in your record crate is reserved for Led Zeppelin II! You have $${cash}. You need $${needed} more to buy it from Mr. Vinyl before 6:00 PM.`
      ]);
    }
  }

  interactTurntable() {
    if (gameState.state.quests.albumBought) {
      this.dialogueBox.show('Turntable', null, [
        '★ GARRARD MODEL 301 HI-FI TURNTABLE ★',
        'The needle drops into the groove. Jimmy Page\'s heavy opening riff for "Whole Lotta Love" roars through the stereo speakers!'
      ], () => {
        this.showMovieCredits();
      });
    } else {
      this.dialogueBox.show('Turntable', null, [
        'Your Garrard Model 301 turntable is connected to dual stereo speakers. It\'s polished and waiting.',
        'Head over to Mr. Vinyl\'s shop in town to buy Led Zeppelin II, then drop the needle right here!'
      ]);
    }
  }

  interactArmchair() {
    this.dialogueBox.show('You', 'portrait_player', [
      'Your favorite listening armchair. The deep crimson cushions and throw pillow make it the best seat in the house for spinning records.'
    ]);
  }

  interactGuitar(side) {
    audioManager.playSuccess();
    this.dialogueBox.show('You', 'portrait_player', [
      '*Strummm...*',
      'You pick a warm acoustic chord. You\'ve been practicing the acoustic intro to "Babe I\'m Gonna Leave You" all week.'
    ]);
  }

  interactRadio() {
    audioManager.playRadioJingle();
    this.dialogueBox.show('Transistor Radio', null, [
      '📻 Tuning 98.7 WGLD FM...',
      'The DJ announces: "Here\'s another classic cut from the new rock releases this October 1969!"'
    ]);
  }

  interactWindow() {
    this.dialogueBox.show('You', 'portrait_player', [
      'You look out through the plaid curtains. The late-afternoon sun is setting over the suburban rooftops and tall pine trees.',
      'One perfect Saturday afternoon in 1969.'
    ]);
  }

  interactWardrobe() {
    this.dialogueBox.show('You', 'portrait_player', [
      'Your wooden wardrobe. Your favorite blue denim jacket hangs on the brass peg on the side, ready for cool autumn evenings.'
    ]);
  }

  exitToNeighborhood() {
    audioManager.resumeAmbientBGM();
    this.scene.stop('EndingScene');
    this.scene.start('NeighborhoodScene');
  }

  // ==========================================
  // 9. MOVIE CREDITS OVERLAY INTEGRATION
  // ==========================================

  showMovieCredits() {
    this.dialogueCooldownUntil = Date.now() + 1000;
    if (this.dialogueBox && this.dialogueBox.isOpen) {
      this.dialogueBox.close();
    }
    const diagOverlay = document.getElementById('dialogue-overlay');
    if (diagOverlay) {
      diagOverlay.classList.remove('visible');
    }
    if (this.promptContainer) {
      this.promptContainer.setVisible(false);
    }
    const overlay = document.getElementById('ending-credits-overlay');
    if (overlay) {
      overlay.scrollTop = 0;
      overlay.style.display = 'flex';
      overlay.classList.add('active');
      overlay.style.opacity = '1';
    }
  }

  setupEndingOverlay() {
    const overlay = document.getElementById('ending-credits-overlay');
    if (!overlay) return;

    const btnListen = document.getElementById('end-btn-listen');
    const btnExplore = document.getElementById('end-btn-explore');
    const btnRestart = document.getElementById('end-btn-restart');
    const btnShowCredits = document.getElementById('end-show-credits-btn');

    // [ KEEP LISTENING ]: Fades out overlay so player can freely explore their bedroom!
    if (btnListen) {
      btnListen.onclick = () => {
        this.dialogueCooldownUntil = Date.now() + 600;
        overlay.classList.remove('active');
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.style.display = 'none';
          if (btnShowCredits) btnShowCredits.style.display = 'block';
        }, 350);
      };
    }

    // [ SHOW CREDITS ]: Restores movie credits overlay
    if (btnShowCredits) {
      btnShowCredits.onclick = () => {
        btnShowCredits.style.display = 'none';
        this.showMovieCredits();
      };
    }

    // [ EXPLORE TOWN ]: Exits back to neighborhood
    if (btnExplore) {
      btnExplore.onclick = () => {
        overlay.style.display = 'none';
        overlay.classList.remove('active');
        if (btnShowCredits) btnShowCredits.style.display = 'none';
        this.exitToNeighborhood();
      };
    }

    // [ PLAY AGAIN ]: Resets state and restarts fresh game
    if (btnRestart) {
      btnRestart.onclick = () => {
        overlay.style.display = 'none';
        overlay.classList.remove('active');
        if (btnShowCredits) btnShowCredits.style.display = 'none';
        audioManager.stopMusic();
        gameState.reset();
        this.scene.stop('EndingScene');
        this.scene.start('NeighborhoodScene');
      };
    }

    // Press F or ESC to close credits and keep listening
    window.addEventListener('keydown', (e) => {
      if (overlay && (overlay.classList.contains('active') || overlay.style.display === 'flex')) {
        if (e.key === 'f' || e.key === 'F' || e.key === 'Escape') {
          e.preventDefault();
          if (btnListen) btnListen.click();
        }
      }
    });
  }
}
