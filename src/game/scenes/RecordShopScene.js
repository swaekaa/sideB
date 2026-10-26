/**
 * RecordShopScene.js
 * Mr. Vinyl's Record Shop — Rich 1969 Interior & Led Zeppelin II Purchase
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';
import { DialogueBox } from '../ui/DialogueBox.js';
import { touchControls } from '../systems/TouchControls.js';

export class RecordShopScene extends Phaser.Scene {
  constructor() {
    super('RecordShopScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a1016');

    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const cx = w / 2;

    // Keep action buttons (E / SPACE) active on mobile so player can talk & advance dialogue cleanly
    touchControls.setMode('actionsOnly');

    // === BACK WALL (Red Brick) ===
    const floorY = Math.round(h * 0.72);
    for (let bx = 0; bx < w; bx += 16) {
      for (let by = 0; by < floorY; by += 16) {
        this.add.image(bx + 8, by + 8, 'tile_wall_brick').setDisplaySize(16, 16);
      }
    }

    // === DARK WOOD FLOOR ===
    this.add.rectangle(cx, (floorY + h) / 2, w, h - floorY, 0x28180c);
    // Floor planks
    for (let fx = 0; fx < w; fx += 14) {
      this.add.rectangle(fx, (floorY + h) / 2, 1, h - floorY, 0x382010, 0.7);
    }
    // Floor shadow
    this.add.rectangle(cx, floorY + 3, w, 6, 0x0a0604, 0.65);

    // === NEON MARQUEE SIGN (Centered at cx, 44 — Clear of HTML Header!) ===
    const signW = 280;
    const signH = 26;
    const signY = 44;
    // Sign shadow & backing
    this.add.rectangle(cx + 2, signY + 2, signW, signH, 0x000000, 0.6);
    const signBg = this.add.rectangle(cx, signY, signW, signH, 0x0c2416);
    signBg.setStrokeStyle(2, 0xd4a030);
    this.add.rectangle(cx, signY, signW - 4, signH - 4, 0x000000, 0).setStrokeStyle(1, 0xfad040);

    this.add.text(cx, signY - 4, "★  MR. VINYL'S HI-FI RECORDS  ★", {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#ffea75',
      fontStyle: 'bold',
      resolution: 4
    }).setOrigin(0.5);

    this.add.text(cx, signY + 7, "• VINYL LPs • 45s • TURNTABLES • HI-FI STEREO •", {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#ffffff',
      fontStyle: 'bold',
      resolution: 4
    }).setOrigin(0.5);

    // === VINYL SHELVES (Lowered so they have breathing room) ===
    const drawShelf = (sx, sy, recordCount) => {
      // Shelf board
      this.add.rectangle(sx, sy + 25, recordCount * 12 + 6, 5, 0x4a2e14);
      this.add.rectangle(sx, sy + 23, recordCount * 12 + 6, 2, 0x6a4422);
      // Records
      const colors = [
        0xd4523c, 0x4878a0, 0xd4b040, 0x3a7848, 0xc84878,
        0x7040b0, 0x384870, 0xd06030, 0x286848, 0xa83428,
        0x5070c0, 0xc8a820, 0x8040a0, 0x30606a
      ];
      for (let i = 0; i < recordCount; i++) {
        const rx = sx - (recordCount * 12) / 2 + i * 12 + 6;
        const col = colors[i % colors.length];
        this.add.rectangle(rx, sy + 10, 9, 22, col);
        this.add.rectangle(rx - 3, sy + 10, 2, 22, 0xffffff, 0.18);
        this.add.rectangle(rx, sy + 2, 7, 4, 0xfff8e8);
      }
    };

    // Upper and lower shelves
    drawShelf(cx - 75, 72, 8);
    drawShelf(cx + 45, 72, 7);
    drawShelf(cx - 75, 114, 8);
    drawShelf(cx + 45, 114, 7);

    // === ICONIC 1969 MUSIC POSTERS WITH REAL ARTWORK ===
    // Left Wall
    this.add.image(52, 95, 'poster_beatles');
    this.add.image(52, 180, 'poster_hendrix');

    // Back Wall (Above booth & between shelves)
    this.add.image(cx - 150, 92, 'poster_woodstock');
    this.add.image(cx + 10, 88, 'poster_doors');
    this.add.image(cx + 66, 88, 'gold_record_award');

    // Right Wall
    this.add.image(w - 52, 95, 'poster_stones');
    this.add.image(w - 52, 180, 'poster_zeppelin_tour');

    // === TURNTABLE LISTENING BOOTH ===
    const ttX = cx - 110;
    const ttY = 192;
    // Wooden console body
    this.add.rectangle(ttX, ttY, 82, 54, 0x3e2412);
    this.add.rectangle(ttX, ttY - 4, 72, 40, 0x161616);
    this.add.rectangle(ttX, ttY + 16, 72, 10, 0x2a160c);
    // Stereo VU Meters
    this.add.rectangle(ttX - 16, ttY + 16, 12, 6, 0x0e2e18);
    this.add.rectangle(ttX + 16, ttY + 16, 12, 6, 0x0e2e18);
    this.add.text(ttX - 16, ttY + 16, 'VU', { fontFamily: 'monospace', fontSize: '4px', color: '#4caf50', resolution: 3 }).setOrigin(0.5);
    this.add.text(ttX + 16, ttY + 16, 'VU', { fontFamily: 'monospace', fontSize: '4px', color: '#4caf50', resolution: 3 }).setOrigin(0.5);

    // Booth Plaque (High contrast, crystal-clear readable)
    const plaque = this.add.rectangle(ttX, ttY - 34, 88, 20, 0x101a14);
    plaque.setStrokeStyle(1.5, 0xd4a030);
    this.add.text(ttX, ttY - 38, '★ HI-FI LISTENING BOOTH ★', {
      fontFamily: 'monospace', fontSize: '7px', color: '#f8d24a',
      fontStyle: 'bold', align: 'center', resolution: 4
    }).setOrigin(0.5);
    this.add.text(ttX, ttY - 29, 'TRY BEFORE YOU BUY • STEREO', {
      fontFamily: 'monospace', fontSize: '6px', color: '#ffffff',
      fontStyle: 'bold', align: 'center', resolution: 4
    }).setOrigin(0.5);

    // Spinning Vinyl Platter
    this.spinDisk = this.add.circle(ttX - 6, ttY - 4, 16, 0x111111);
    this.spinDisk.setStrokeStyle(1.5, 0x666666);
    this.spinLabel = this.add.circle(ttX - 6, ttY - 4, 5, 0xc74a38);
    this.add.line(0, 0, ttX + 18, ttY + 8, ttX + 4, ttY - 6, 0xd8d8d8).setLineWidth(2);
    // Over-ear headphones hanging on console
    this.add.circle(ttX + 26, ttY - 8, 4, 0x222);
    this.add.circle(ttX + 26, ttY + 2, 4, 0x222);
    this.add.line(0, 0, ttX + 26, ttY - 8, ttX + 26, ttY + 2, 0xbbb).setLineWidth(2);

    // Spin animation
    this.tweens.add({
      targets: [this.spinDisk, this.spinLabel],
      angle: 360,
      duration: 2200,
      repeat: -1
    });

    // Musical notes floating up
    const noteColors = ['#f0c040', '#e040fb', '#00e5ff'];
    [0, 1, 2].forEach((i) => {
      const note = this.add.text(ttX + Phaser.Math.Between(-15, 15), ttY - 20,
        ['♪', '♫', '♩'][i], {
          fontFamily: 'monospace', fontSize: '12px',
          color: noteColors[i], fontStyle: 'bold'
        });
      this.tweens.add({
        targets: note,
        x: note.x + Phaser.Math.Between(-20, 20),
        y: note.y - 42,
        alpha: 0,
        duration: 1800 + i * 400,
        repeat: -1,
        repeatDelay: 200 * i
      });
    });

    // === FEATURED SHOWCASE: Led Zeppelin II ===
    const showcaseX = cx + 160;
    const showcaseY = 126;

    // Shadow
    this.add.rectangle(showcaseX + 4, showcaseY + 4, 120, 156, 0x000000, 0.5);
    // Case background (Velvet luxury frame)
    const caseBg = this.add.rectangle(showcaseX, showcaseY, 120, 156, 0xf6efe2);
    caseBg.setStrokeStyle(2, 0x1e3020);

    // "FEATURED" banner
    const featureBg = this.add.rectangle(showcaseX, showcaseY - 64, 114, 16, 0x8a2c1e);
    featureBg.setStrokeStyle(1, 0xfad040);
    this.add.text(showcaseX, showcaseY - 64, '★  FEATURED LP OF THE WEEK  ★', {
      fontFamily: 'monospace', fontSize: '7px', color: '#fff9c4', fontStyle: 'bold', resolution: 3
    }).setOrigin(0.5);

    // Album image
    const albumImg = this.add.image(showcaseX, showcaseY - 16, 'album_led_zeppelin_ii');
    albumImg.setDisplaySize(82, 82);

    this.tweens.add({
      targets: caseBg,
      fillColor: 0xfffaed,
      duration: 1200,
      yoyo: true,
      repeat: -1
    });

    this.add.text(showcaseX, showcaseY + 38, 'LED ZEPPELIN II', {
      fontFamily: 'monospace', fontSize: '9.5px', color: '#1a2618', fontStyle: 'bold', resolution: 3
    }).setOrigin(0.5);

    this.add.text(showcaseX, showcaseY + 50, '"Whole Lotta Love" • 1969', {
      fontFamily: 'monospace', fontSize: '7px', color: '#6d4c41', fontStyle: 'italic', resolution: 3
    }).setOrigin(0.5);

    this.priceBadge = this.add.rectangle(showcaseX, showcaseY + 65, 72, 18, 0x1b5e20);
    this.priceBadge.setStrokeStyle(1.5, 0x66bb6a);
    this.priceText = this.add.text(showcaseX, showcaseY + 65, '$25.00', {
      fontFamily: 'monospace', fontSize: '10px', color: '#b9f6ca', fontStyle: 'bold', resolution: 3
    }).setOrigin(0.5);

    // === COUNTER ===
    const counterY = Math.round(h * 0.72) - 24;
    // Counter front & sides
    this.add.rectangle(cx - 35, counterY + 18, 290, 52, 0x4e2d14);
    this.add.rectangle(cx - 35, counterY - 10, 294, 8, 0x6d4020);
    // Counter top surface
    this.add.rectangle(cx - 35, counterY - 14, 294, 6, 0x8a542a);

    // Vinyl Record Crates (Crate digging!)
    this.add.image(cx + 65, counterY - 16, 'vinyl_crate');
    this.add.image(cx - 155, counterY + 42, 'vinyl_crate');

    // Brass Cash Register
    this.add.rectangle(cx - 25, counterY - 18, 28, 14, 0x223626);
    this.add.rectangle(cx - 25, counterY - 26, 20, 6, 0x2e4a34);
    this.add.text(cx - 25, counterY - 26, '$$$', {
      fontFamily: 'monospace', fontSize: '6px', color: '#c8e840', resolution: 3
    }).setOrigin(0.5);

    // Mr. Vinyl behind the counter
    const clerk = this.add.image(cx - 75, counterY - 36, 'npc_mr_vinyl');
    clerk.setDisplaySize(36, 54);
    this.tweens.add({
      targets: clerk, y: clerk.y - 2, duration: 1200,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    // === DIALOGUE & HUD ===
    this.dialogueBox = new DialogueBox(this);

    // Clean cash badge on counter
    this.cashDisplay = this.add.text(cx - 25, counterY - 38, `YOUR CASH: $${gameState.state.cash}`, {
      fontFamily: 'monospace', fontSize: '8px', color: '#e8f8d0',
      backgroundColor: '#1b381e', padding: { x: 5, y: 3 }, resolution: 3
    }).setOrigin(0.5);

    // Exit Button
    const exitBtn = this.add.text(16, h - 26, '[ F / E — STEP OUTSIDE ]', {
      fontFamily: 'monospace', fontSize: '9px', color: '#f5ecd6',
      backgroundColor: '#7f2316', padding: { x: 8, y: 5 }, resolution: 3
    });
    exitBtn.setInteractive({ useHandCursor: true });
    exitBtn.on('pointerdown', () => this.exitShop());
    exitBtn.on('pointerover', () => exitBtn.setBackgroundColor('#9c2c1c'));
    exitBtn.on('pointerout', () => exitBtn.setBackgroundColor('#7f2316'));

    // Buy button (high contrast gold, pulsing scale)
    if (!gameState.state.quests.albumBought) {
      this.buyBtn = this.add.text(showcaseX, showcaseY + 94, '▶ PRESS E TO BUY ($25) ◀', {
        fontFamily: 'monospace', fontSize: '8.5px', color: '#101808',
        fontStyle: 'bold',
        backgroundColor: '#f5c542', padding: { x: 8, y: 5 }, resolution: 4
      }).setOrigin(0.5);
      this.buyBtn.setInteractive({ useHandCursor: true });
      this.buyBtn.on('pointerdown', () => this.talkToMrVinyl());
      this.tweens.add({
        targets: this.buyBtn,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 750,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    this.input.keyboard.on('keydown-F', () => this.exitShop());
    this.input.keyboard.on('keydown-ESC', () => this.exitShop());
    this.input.keyboard.on('keydown-E', () => {
      if (!this.dialogueBox.isOpen) this.talkToMrVinyl();
    });

    this.time.delayedCall(350, () => this.talkToMrVinyl());
  }

  onDialogueClosed() {
    this.dialogueCooldownUntil = Date.now() + 450;
  }

  talkToMrVinyl() {
    if (this.dialogueCooldownUntil && Date.now() < this.dialogueCooldownUntil) return;
    const cash = gameState.state.cash;
    const bought = gameState.state.quests.albumBought;

    if (bought) {
      this.dialogueBox.show('Mr. Vinyl', 'portrait_vinyl', [
        'Hey kid! You already got Led Zeppelin II safe in your bag!',
        'Head on home to your bedroom before dinnertime and drop that needle!'
      ], () => {});
      return;
    }

    if (cash >= 25) {
      this.dialogueBox.show('Mr. Vinyl', 'portrait_vinyl', [
        'Well look at that! You scraped together twenty-five dollars on a Saturday afternoon in 1969!',
        'Led Zeppelin II is right here in mint condition. Ready to make it yours?'
      ],
        null,
        ['Buy Led Zeppelin II for $25!', 'Maybe later'],
        (choice) => {
          if (choice === 1) {
            this.buyAlbum();
          } else {
            this.dialogueBox.show('Mr. Vinyl', 'portrait_vinyl', [
              'No rush kid. It\'s waiting right here for you.'
            ], () => {});
          }
        }
      );
    } else {
      const needed = 25 - cash;
      this.dialogueBox.show('Mr. Vinyl', 'portrait_vinyl', [
        'Led Zeppelin II. Twenty-five dollars. Pure rock and roll gold, kid.',
        `You've got $${cash} right now. You need $${needed} more to buy it.`,
        'Check around town! Your mom has chores, Mrs. Miller needs help, and June is jamming in the park.'
      ], () => {});
    }
  }

  buyAlbum() {
    if (gameState.deductCash(25)) {
      audioManager.playCoin();
      audioManager.playSuccess();
      gameState.setQuest('albumBought', true);
      gameState.addItem('Led Zeppelin II LP');
      gameState.advanceTime(10);

      this.cashDisplay.setText(`YOUR CASH: $${gameState.state.cash}`);
      this.priceBadge.setFillStyle(0x6c2018);
      this.priceText.setText('SOLD!');
      if (this.buyBtn) this.buyBtn.setVisible(false);

      this.dialogueBox.show('Mr. Vinyl', 'portrait_vinyl', [
        '★ CONGRATULATIONS! Led Zeppelin II is all yours! ★',
        'Slip it into the sleeve carefully. Now head home to your room and drop the needle on Whole Lotta Love!'
      ], () => {});
    }
  }

  exitShop() {
    if (this.dialogueBox && this.dialogueBox.isOpen) {
      this.dialogueBox.close();
      return;
    }
    touchControls.setMode('all');
    this.scene.stop('RecordShopScene');
    this.scene.resume('NeighborhoodScene');
  }
}
