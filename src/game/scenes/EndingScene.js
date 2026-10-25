/**
 * EndingScene.js
 * The Grand Finale for SIDE B: One Perfect Afternoon (1969 Edition)
 * Richly detailed bedroom with spinning record, twilight mood, and cinematic end card.
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';

export class EndingScene extends Phaser.Scene {
  constructor() {
    super('EndingScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#0e0c14');

    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const cx = w / 2;

    // === BEDROOM WALLS (Wallpaper pattern) ===
    this.add.rectangle(cx, h * 0.38, w, h * 0.76, 0x4e4838);
    // Wallpaper stripes
    for (let wx = 0; wx < w; wx += 20) {
      this.add.rectangle(wx, h * 0.38, 2, h * 0.76, 0x3e3828, 0.6);
    }
    // Baseboard
    this.add.rectangle(cx, Math.round(h * 0.75), w, 6, 0x3a2c18);

    // === CARPET FLOOR ===
    const carpetY = Math.round(h * 0.76);
    this.add.rectangle(cx, (carpetY + h) / 2, w, h - carpetY, 0x8a3828);
    // Carpet pattern
    for (let cy = carpetY; cy < h; cy += 8) {
      this.add.rectangle(cx, cy, w, 1, 0x743020, 0.4);
    }

    // === EVENING WINDOW (left side) ===
    const winX = 100;
    const winY = 90;
    // Frame
    this.add.rectangle(winX, winY, 100, 80, 0x3a2810);
    // Twilight sky (gradient-ish using layered rects)
    this.add.rectangle(winX, winY - 20, 88, 28, 0x2a1a3c); // deep purple top
    this.add.rectangle(winX, winY - 2, 88, 16, 0x582838); // burgundy mid
    this.add.rectangle(winX, winY + 14, 88, 16, 0xa04028); // red horizon
    this.add.rectangle(winX, winY + 26, 88, 12, 0xd06830); // orange glow
    // Stars
    [[winX - 30, winY - 22], [winX + 10, winY - 26], [winX + 34, winY - 18],
     [winX - 14, winY - 28]].forEach(([sx, sy]) => {
      const star = this.add.circle(sx, sy, 1.5, 0xffffff);
      this.tweens.add({ targets: star, alpha: 0.3, duration: Phaser.Math.Between(800, 2000), yoyo: true, repeat: -1 });
    });
    // Window cross panes
    this.add.rectangle(winX, winY, 88, 2, 0x3a2810);
    this.add.rectangle(winX, winY, 2, 72, 0x3a2810);
    // Curtains
    this.add.rectangle(winX - 42, winY, 16, 74, 0x8a3a58);
    this.add.rectangle(winX + 42, winY, 16, 74, 0x8a3a58);
    // Curtain folds
    this.add.rectangle(winX - 46, winY, 4, 74, 0x6a2840, 0.7);
    this.add.rectangle(winX + 46, winY, 4, 74, 0x6a2840, 0.7);
    // Window glow on floor
    this.add.rectangle(winX, carpetY + 18, 70, 36, 0xd06830, 0.08);

    // === BED (left) ===
    const bedX = 84;
    const bedY = 192;
    this.add.rectangle(bedX, bedY + 15, 130, 10, 0x3a2818); // bed frame
    this.add.rectangle(bedX, bedY + 8, 130, 50, 0x3a4c58); // mattress
    this.add.rectangle(bedX, bedY + 12, 130, 42, 0x3a6040); // quilt
    // Quilt pattern
    for (let qy = 0; qy < 3; qy++) {
      for (let qx = 0; qx < 4; qx++) {
        const col = (qx + qy) % 2 === 0 ? 0x508858 : 0x3a6040;
        this.add.rectangle(bedX - 48 + qx * 30, bedY + 14 + qy * 12, 28, 10, col);
      }
    }
    this.add.rectangle(bedX - 44, bedY - 3, 38, 22, 0xf0ead8); // pillow
    this.add.rectangle(bedX - 10, bedY - 5, 36, 20, 0xe8dcc8); // second pillow
    this.add.rectangle(bedX - 60, bedY - 20, 8, 100, 0x4a3018); // headboard
    this.add.rectangle(bedX - 57, bedY - 18, 2, 96, 0x5a4020, 0.5);

    // === NIGHTSTAND ===
    const standX = 260;
    const standY = 200;
    this.add.rectangle(standX, standY + 5, 50, 55, 0x5e3c20);
    this.add.rectangle(standX, standY - 20, 50, 4, 0x7a4e28);
    // Drawer
    this.add.rectangle(standX, standY + 8, 42, 12, 0x4a2c14);
    this.add.circle(standX, standY + 8, 2, 0xc8a840);
    // Lamp
    this.add.rectangle(standX, standY - 30, 8, 14, 0x3a2810); // base
    this.add.polygon(standX, standY - 48, [[-18, 14], [18, 14], [12, -8], [-12, -8]], 0xe8c040);
    this.add.rectangle(standX, standY - 43, 28, 2, 0xc8a030);
    // Warm glow circle
    const glow = this.add.circle(standX, standY - 35, 55, 0xffe898, 0.12);
    this.tweens.add({ targets: glow, alpha: 0.06, duration: 1800, yoyo: true, repeat: -1 });

    // === BOOKSHELF on wall ===
    const shelfX = 350;
    this.add.rectangle(shelfX, 84, 110, 10, 0x4a2e14);
    this.add.rectangle(shelfX, 118, 110, 10, 0x4a2e14);
    const bookColors = [0xc43028, 0x284880, 0xd4a020, 0x248440, 0xa028a0, 0x1878a0];
    for (let b = 0; b < 8; b++) {
      this.add.rectangle(shelfX - 46 + b * 13, 101, 10, 22, bookColors[b % bookColors.length]);
      this.add.rectangle(shelfX - 46 + b * 13, 133, 10, 18, bookColors[(b + 3) % bookColors.length]);
    }

    // === RECORD PLAYER / TURNTABLE ===
    const ttX = 440;
    const ttY = 190;
    // Stand / table
    this.add.rectangle(ttX, ttY + 32, 90, 12, 0x4a2e14);
    this.add.rectangle(ttX, ttY + 38, 80, 30, 0x3a2208);
    // Body
    this.add.rectangle(ttX, ttY, 80, 50, 0x3c2818);
    this.add.rectangle(ttX, ttY + 2, 72, 42, 0x1a1a1a);
    this.add.rectangle(ttX, ttY - 24, 82, 6, 0x4a3018);
    this.add.text(ttX, ttY - 32, 'GARRARD MODEL 301', {
      fontFamily: 'monospace', fontSize: '6px', color: '#c8b878', fontStyle: 'bold'
    }).setOrigin(0.5);

    // Spinning vinyl platter
    this.vinylDisk = this.add.circle(ttX - 14, ttY + 4, 18, 0x111111);
    this.vinylDisk.setStrokeStyle(1.5, 0x333333);
    // Vinyl grooves
    [14, 10, 6].forEach(r => {
      this.add.circle(ttX - 14, ttY + 4, r, 0x000000, 0).setStrokeStyle(0.5, 0x222222, 0.5);
    });
    this.vinylLabel = this.add.circle(ttX - 14, ttY + 4, 6, 0xc74a38);
    this.add.circle(ttX - 14, ttY + 4, 1.5, 0xf0f0f0);
    // Tonearm
    this.add.line(0, 0, ttX + 18, ttY + 18, ttX - 6, ttY - 2, 0xcccccc).setLineWidth(2.5);
    this.add.circle(ttX + 18, ttY + 18, 3, 0x888888);

    // Record spin
    this.tweens.add({
      targets: [this.vinylDisk, this.vinylLabel],
      angle: 360,
      duration: 1600,
      repeat: -1,
      ease: 'Linear'
    });

    // === THE ALBUM SLEEVE (Led Zeppelin II) on the floor ===
    const albumX = ttX + 50;
    this.add.rectangle(albumX, ttY + 45, 60, 60, 0x181414, 0.4);
    const albumThumb = this.add.image(albumX, ttY + 40, 'album_led_zeppelin_ii');
    albumThumb.setDisplaySize(58, 58);
    albumThumb.setAngle(-8); // leaning against something
    this.add.rectangle(albumX, ttY + 70, 60, 4, 0x3a2818);

    // === PLAYER SITTING CROSS-LEGGED ===
    this.playerFigure = this.add.image(330, 220, 'player_down_0');
    this.playerFigure.setDisplaySize(30, 46);
    // Gentle breathing bob
    this.tweens.add({
      targets: this.playerFigure, y: this.playerFigure.y - 2,
      duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    // === FLOATING MUSICAL NOTES ===
    const noteChars = ['♪', '♫', '♩', '♬', '♪', '♫'];
    noteChars.forEach((char, i) => {
      const note = this.add.text(
        ttX - 14 + Phaser.Math.Between(-10, 10),
        ttY - 14,
        char, {
          fontFamily: 'monospace', fontSize: '14px',
          color: ['#f0c040', '#f04880', '#40c0e0', '#c040f0', '#f08030', '#60e060'][i],
          fontStyle: 'bold'
        }
      );
      note.setAlpha(0);
      this.time.delayedCall(i * 700, () => {
        this.tweens.add({
          targets: note,
          x: { from: note.x, to: note.x + Phaser.Math.Between(-40, 40) },
          y: { from: ttY - 14, to: ttY - 80 - i * 8 },
          alpha: { from: 0.9, to: 0 },
          duration: 2800,
          repeat: -1,
          repeatDelay: 300 + i * 150
        });
      });
    });

    // === AMBIENT ROOM SOUNDS ===
    audioManager.playMusic('ending');

    // === WARM ROOM TINT ===
    this.add.rectangle(cx, cy, w, h, 0xc06030, 0.07);
    const cy = h / 2;

    // Show end card after moment of peace
    this.time.delayedCall(1800, () => this.showEndCard(cx, cy));
  }

  showEndCard(cx, cy) {
    const cardW = 460;
    const cardH = 120;
    const cardY = 68;

    // Shadow
    this.add.rectangle(cx + 4, cardY + 4, cardW, cardH, 0x000000, 0.7);
    // Card
    const card = this.add.rectangle(cx, cardY, cardW, cardH, 0xf4ecd8);
    card.setStrokeStyle(3, 0x1e2e1a);

    // Corner decorations
    [[cx - cardW/2 + 6, cardY - cardH/2 + 6],
     [cx + cardW/2 - 6, cardY - cardH/2 + 6],
     [cx - cardW/2 + 6, cardY + cardH/2 - 6],
     [cx + cardW/2 - 6, cardY + cardH/2 - 6]].forEach(([x, y]) => {
      this.add.rectangle(x, y, 6, 6, 0xd4a030);
    });

    this.add.text(cx, cardY - 46, '"Some afternoons stay with you forever."', {
      fontFamily: 'monospace', fontSize: '11px', color: '#4a3428', fontStyle: 'italic'
    }).setOrigin(0.5);

    this.add.text(cx, cardY - 26, 'SIDE B', {
      fontFamily: 'monospace', fontSize: '22px', color: '#9c3020', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, cardY - 4, '★ YOU GOT YOUR DREAM ALBUM: LED ZEPPELIN II (1969) ★', {
      fontFamily: 'monospace', fontSize: '10px', color: '#205a28', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, cardY + 14, `Saturday, October 1969  •  Cash Earned: $${gameState.state.cashEarned || '21+'}`, {
      fontFamily: 'monospace', fontSize: '8.5px', color: '#6a5848'
    }).setOrigin(0.5);

    this.add.text(cx, cardY + 28, 'Neighborhood Adventure Complete', {
      fontFamily: 'monospace', fontSize: '8.5px', color: '#6a5848'
    }).setOrigin(0.5);

    // Buttons
    const btnY = h - 30;
    const createBtn = (x, text, color, hoverColor, onClick) => {
      const btn = this.add.text(x, btnY, text, {
        fontFamily: 'monospace', fontSize: '9px', color: '#fff8e8',
        backgroundColor: color, padding: { x: 10, y: 6 }
      }).setOrigin(0.5);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => btn.setBackgroundColor(hoverColor));
      btn.on('pointerout', () => btn.setBackgroundColor(color));
      btn.on('pointerdown', onClick);
      return btn;
    };

    createBtn(cx - 145, '[ KEEP LISTENING ]', '#22381e', '#304e2a', () => {
      card.setVisible(false);
    });

    createBtn(cx, '[ EXPLORE TOWN ]', '#223048', '#2e4060', () => {
      audioManager.stopMusic();
      this.scene.stop('EndingScene');
      this.scene.start('NeighborhoodScene');
    });

    createBtn(cx + 148, '[ PLAY AGAIN ]', '#5c1c14', '#7c2c20', () => {
      audioManager.stopMusic();
      gameState.reset();
      this.scene.stop('EndingScene');
      this.scene.start('NeighborhoodScene');
    });
  }
}
