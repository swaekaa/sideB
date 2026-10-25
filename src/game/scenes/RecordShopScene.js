/**
 * RecordShopScene.js
 * Mr. Vinyl's Record Shop — Rich 1969 Interior & Led Zeppelin II Purchase
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';
import { DialogueBox } from '../ui/DialogueBox.js';

export class RecordShopScene extends Phaser.Scene {
  constructor() {
    super('RecordShopScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1e1218');

    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const cx = w / 2;

    // === BACK WALL (Brick) ===
    for (let bx = 0; bx < w; bx += 16) {
      for (let by = 0; by < Math.round(h * 0.72); by += 16) {
        this.add.image(bx + 8, by + 8, 'tile_wall_brick').setDisplaySize(16, 16);
      }
    }

    // === DARK WOOD FLOOR ===
    const floorY = Math.round(h * 0.72);
    this.add.rectangle(cx, (floorY + h) / 2, w, h - floorY, 0x2e1c0e);
    // Floor planks
    for (let fx = 0; fx < w; fx += 12) {
      this.add.rectangle(fx, (floorY + h) / 2, 1, h - floorY, 0x3a2414, 0.6);
    }
    // Floor edge shadow
    this.add.rectangle(cx, floorY + 3, w, 6, 0x0a0806, 0.6);

    // === VINYL SHELVES (Back wall) ===
    const drawShelf = (sx, sy, recordCount) => {
      // Shelf board
      this.add.rectangle(sx, sy + 26, recordCount * 13 + 8, 6, 0x4a2e14);
      this.add.rectangle(sx, sy + 23, recordCount * 13 + 8, 3, 0x6a4422);
      // Records
      const colors = [
        0xd4523c, 0x4878a0, 0xd4b040, 0x3a7848, 0xc84878,
        0x7040b0, 0x384870, 0xd06030, 0x286848, 0xa83428,
        0x5070c0, 0xc8a820, 0x8040a0, 0x30606a
      ];
      for (let i = 0; i < recordCount; i++) {
        const rx = sx - (recordCount * 13) / 2 + i * 13 + 6;
        const col = colors[i % colors.length];
        // Spine
        this.add.rectangle(rx, sy + 10, 10, 22, col);
        // Lighter edge
        this.add.rectangle(rx - 4, sy + 10, 2, 22, 0xffffff, 0.15);
        // Top label
        this.add.rectangle(rx, sy + 2, 8, 4, 0xfff8e8);
      }
    };

    // Three rows of records
    drawShelf(cx - 80, 20, 10);
    drawShelf(cx + 80, 20, 10);
    drawShelf(cx - 60, 62, 9);
    drawShelf(cx + 90, 64, 8);

    // === NEON SIGN ===
    const signBg = this.add.rectangle(cx - 60, 12, 180, 18, 0x0e2218);
    signBg.setStrokeStyle(1.5, 0xd4a030);
    this.add.text(cx - 60, 12, '★  MR. VINYL\'S RECORDS  ★  EST. 1962', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#f0c242',
      fontStyle: 'bold',
      resolution: 2
    }).setOrigin(0.5);

    // === POSTERS on walls ===
    this.drawPoster(40, 100, 'THE BEATLES', '#102a18', '#f0e030');
    this.drawPoster(560, 95, 'ROLLING\nSTONES', '#1a0a2a', '#c840a0');
    this.drawPoster(w - 60, 155, 'WOODSTOCK\n1969', '#1a1a10', '#e8a020');

    // === TURNTABLE DEMO STATION ===
    const ttX = cx - 110;
    const ttY = 155;
    this.add.rectangle(ttX, ttY, 80, 54, 0x3a2210);
    this.add.rectangle(ttX, ttY - 5, 70, 40, 0x1a1a1a);
    this.add.text(ttX, ttY - 32, 'LISTEN BEFORE\nYOU BUY', {
      fontFamily: 'monospace', fontSize: '7px', color: '#c8b88a',
      fontStyle: 'bold', align: 'center'
    }).setOrigin(0.5);
    // Spinning platter
    this.spinDisk = this.add.circle(ttX - 5, ttY - 2, 16, 0x111111);
    this.spinDisk.setStrokeStyle(1.5, 0x555555);
    this.spinLabel = this.add.circle(ttX - 5, ttY - 2, 5, 0xc74a38);
    this.add.line(0, 0, ttX + 20, ttY + 10, ttX + 5, ttY - 5, 0xc8c8c8).setLineWidth(2);
    // Spin animation
    this.tweens.add({
      targets: [this.spinDisk, this.spinLabel],
      angle: 360,
      duration: 2200,
      repeat: -1
    });

    // Musical note animation
    const noteColors = ['#f0c040', '#c84080', '#40c0e0'];
    [0, 1, 2].forEach((i) => {
      const note = this.add.text(ttX + Phaser.Math.Between(-15, 15), ttY - 18,
        ['♪', '♫', '♩'][i], {
          fontFamily: 'monospace', fontSize: '12px',
          color: noteColors[i], fontStyle: 'bold'
        });
      this.tweens.add({
        targets: note,
        x: note.x + Phaser.Math.Between(-20, 20),
        y: note.y - 40,
        alpha: 0,
        duration: 1800 + i * 400,
        repeat: -1,
        repeatDelay: 200 * i
      });
    });

    // === FEATURED SHOWCASE: Led Zeppelin II ===
    const showcaseX = cx + 160;
    const showcaseY = 118;

    // Shadow
    this.add.rectangle(showcaseX + 4, showcaseY + 4, 116, 148, 0x000000, 0.5);
    // Case background
    const caseBg = this.add.rectangle(showcaseX, showcaseY, 116, 148, 0xf4ecda);
    caseBg.setStrokeStyle(2, 0x1e3020);

    // "FEATURED" banner
    const featureBg = this.add.rectangle(showcaseX, showcaseY - 60, 110, 14, 0x8a2c1e);
    featureBg.setStrokeStyle(1, 0xe8b030);
    this.add.text(showcaseX, showcaseY - 60, '★  FEATURED LP  ★', {
      fontFamily: 'monospace', fontSize: '8px', color: '#f8e8a0', fontStyle: 'bold'
    }).setOrigin(0.5);

    // Album image
    const albumImg = this.add.image(showcaseX, showcaseY - 14, 'album_led_zeppelin_ii');
    albumImg.setDisplaySize(80, 80);
    // Slight glow pulsing effect
    this.tweens.add({
      targets: caseBg,
      fillColor: 0xfff8e8,
      duration: 1200,
      yoyo: true,
      repeat: -1
    });

    this.add.text(showcaseX, showcaseY + 42, 'LED ZEPPELIN II', {
      fontFamily: 'monospace', fontSize: '9px', color: '#1a2618', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(showcaseX, showcaseY + 54, '"Whole Lotta Love"', {
      fontFamily: 'monospace', fontSize: '7px', color: '#5a4030', fontStyle: 'italic'
    }).setOrigin(0.5);

    this.priceBadge = this.add.rectangle(showcaseX, showcaseY + 68, 64, 18, 0x264834);
    this.priceBadge.setStrokeStyle(1, 0x60a840);
    this.priceText = this.add.text(showcaseX, showcaseY + 68, '$25.00', {
      fontFamily: 'monospace', fontSize: '10px', color: '#a0e870', fontStyle: 'bold'
    }).setOrigin(0.5);

    // === COUNTER ===
    const counterY = Math.round(h * 0.72) - 28;
    // Counter sides
    this.add.rectangle(cx - 40, counterY + 16, 280, 52, 0x5a3518);
    this.add.rectangle(cx - 40, counterY - 10, 284, 8, 0x7a4c28);
    // Counter top surface
    this.add.rectangle(cx - 40, counterY - 14, 284, 6, 0x8c5c32);
    // Counter items
    this.add.circle(cx + 30, counterY - 18, 6, 0x222222); // small record on counter
    this.add.circle(cx + 30, counterY - 18, 2, 0xc74a38);
    this.add.rectangle(cx - 30, counterY - 18, 28, 12, 0x1c2c20); // cash register
    this.add.rectangle(cx - 30, counterY - 24, 20, 4, 0x2a4030);
    this.add.text(cx - 30, counterY - 26, '$$$', {
      fontFamily: 'monospace', fontSize: '6px', color: '#c8e840'
    }).setOrigin(0.5);

    // Mr. Vinyl behind the counter
    const clerk = this.add.image(cx - 80, counterY - 36, 'npc_mr_vinyl');
    clerk.setDisplaySize(36, 54);
    // Idle bob
    this.tweens.add({
      targets: clerk, y: clerk.y - 2, duration: 1200,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    // === HUD ===
    this.dialogueBox = new DialogueBox(this);

    this.cashDisplay = this.add.text(12, 10, `YOUR CASH: $${gameState.state.cash}`, {
      fontFamily: 'monospace', fontSize: '11px', color: '#e8f8d0',
      backgroundColor: '#182c18', padding: { x: 8, y: 5 }, resolution: 2
    });

    const exitBtn = this.add.text(12, h - 28, '[ ESC / E — STEP OUTSIDE ]', {
      fontFamily: 'monospace', fontSize: '9px', color: '#f0e8d0',
      backgroundColor: '#6c2a1c', padding: { x: 8, y: 5 }, resolution: 2
    });
    exitBtn.setInteractive({ useHandCursor: true });
    exitBtn.on('pointerdown', () => this.exitShop());
    exitBtn.on('pointerover', () => exitBtn.setBackgroundColor('#8c3828'));
    exitBtn.on('pointerout', () => exitBtn.setBackgroundColor('#6c2a1c'));

    // Buy button (prominent!)
    if (!gameState.state.quests.albumBought) {
      this.buyBtn = this.add.text(showcaseX, showcaseY + 92, '[ PRESS E TO BUY ]', {
        fontFamily: 'monospace', fontSize: '9px', color: '#fff8d0',
        backgroundColor: '#264834', padding: { x: 8, y: 5 }, resolution: 2
      }).setOrigin(0.5);
      this.tweens.add({
        targets: this.buyBtn, alpha: 0.3, duration: 600,
        yoyo: true, repeat: -1
      });
    }

    this.input.keyboard.on('keydown-ESC', () => this.exitShop());
    this.input.keyboard.on('keydown-E', () => {
      if (!this.dialogueBox.isOpen) this.talkToMrVinyl();
    });

    this.time.delayedCall(350, () => this.talkToMrVinyl());
  }

  drawPoster(x, y, text, bg, fg) {
    const w = 52;
    const h = 64;
    this.add.rectangle(x, y, w, h, Phaser.Display.Color.HexStringToColor(bg).color);
    this.add.rectangle(x, y, w, h, 0xffffff, 0).setStrokeStyle(1.5, Phaser.Display.Color.HexStringToColor(fg).color);
    this.add.text(x, y - 4, text, {
      fontFamily: 'monospace', fontSize: '9px',
      color: '#' + fg.replace('#', ''),
      fontStyle: 'bold', align: 'center'
    }).setOrigin(0.5);
  }

  talkToMrVinyl() {
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
    this.scene.stop('RecordShopScene');
    this.scene.resume('NeighborhoodScene');
  }
}
