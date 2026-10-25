/**
 * EndingScene.js
 * The Grand Finale for SIDE B: One Perfect Afternoon (1969 Edition)
 * Listening to Led Zeppelin II in your bedroom as twilight falls.
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';

export class EndingScene extends Phaser.Scene {
  constructor() {
    super('EndingScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#17151e');

    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const cx = w / 2;
    const cy = h / 2;

    // Bedroom Wall
    this.add.rectangle(cx, h * 0.35, w, h * 0.7, 0x5a5743);
    // Carpet Floor
    this.add.rectangle(cx, h * 0.85, w, h * 0.3, 0xa65038);

    // Bed on the left
    this.add.rectangle(90, 190, 120, 60, 0x3d4d59); // mattress
    this.add.rectangle(90, 200, 120, 42, 0x486952); // quilt
    this.add.rectangle(50, 172, 34, 20, 0xf0edd6); // pillow
    this.add.rectangle(30, 164, 8, 86, 0x473220); // wooden headboard

    // Evening Window over bed
    const winX = 180;
    const winY = 85;
    this.add.rectangle(winX, winY, 88, 70, 0x3b2a1e); // frame
    this.add.rectangle(winX, winY, 80, 62, 0x3d2047); // twilight sky
    this.add.rectangle(winX, winY + 20, 80, 22, 0xba533e); // sunset glow
    this.add.rectangle(winX, winY + 27, 80, 8, 0xdf8d48);
    // Tiny stars
    this.add.circle(winX - 24, winY - 16, 1.5, 0xffffff);
    this.add.circle(winX + 16, winY - 20, 1.5, 0xffffff);
    this.add.circle(winX + 30, winY - 6, 1.5, 0xffffff);
    // Window panes
    this.add.rectangle(winX, winY, 80, 2, 0x3b2a1e);
    this.add.rectangle(winX, winY, 2, 62, 0x3b2a1e);

    // Nightstand with warm glowing lamp
    const standX = 300;
    const standY = 195;
    this.add.rectangle(standX, standY, 44, 54, 0x6e4324);
    this.add.rectangle(standX, standY - 34, 8, 16, 0x3b2a1e);
    this.add.polygon(standX, standY - 50, [[-16, 14], [16, 14], [10, -8], [-10, -8]], 0xf2d97e);
    this.add.circle(standX, standY - 40, 64, 0xffebb0, 0.15); // lamp light

    // Turntable / Record Player
    const ttX = 380;
    const ttY = 198;
    this.add.rectangle(ttX, ttY, 68, 44, 0x422a1a);
    this.add.rectangle(ttX, ttY - 5, 60, 34, 0x222222);

    // Spinning Vinyl Record
    this.vinylDisk = this.add.circle(ttX - 8, ttY - 5, 14, 0x111111);
    this.vinylDisk.setStrokeStyle(1.5, 0x444444);
    this.vinylLabel = this.add.circle(ttX - 8, ttY - 5, 5, 0xc74a38);
    this.add.line(0, 0, ttX + 18, ttY + 5, ttX - 5, ttY - 5, 0xdddddd).setLineWidth(2.5);

    // The Album Sleeve (Led Zeppelin II) Displayed proudly
    const albumThumb = this.add.image(460, 186, 'album_led_zeppelin_ii');
    albumThumb.setDisplaySize(50, 50);
    this.add.rectangle(460, 212, 54, 5, 0x3b2619);

    // Player sitting cross-legged on carpet
    this.playerFigure = this.add.image(280, 212, 'player_down_0');
    this.playerFigure.setDisplaySize(24, 36);

    // Floating musical notes
    this.notes = [];
    const noteChars = ['♪', '♫', '♩', '♬'];
    for (let i = 0; i < 7; i++) {
      const note = this.add.text(ttX - 8, ttY - 18, noteChars[i % noteChars.length], {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#f0c74a',
        fontStyle: 'bold'
      });
      note.setAlpha(0);
      this.notes.push(note);
    }

    audioManager.playMusic('ending');

    // Spin vinyl
    this.tweens.add({
      targets: [this.vinylDisk, this.vinylLabel],
      angle: 360,
      duration: 1800,
      repeat: -1
    });

    // Floating notes tween
    this.notes.forEach((note, idx) => {
      this.time.delayedCall(idx * 650, () => {
        this.tweens.add({
          targets: note,
          x: { from: ttX - 8, to: ttX - 35 - (idx * 8) },
          y: { from: ttY - 18, to: ttY - 80 - (idx * 5) },
          alpha: { from: 1, to: 0 },
          duration: 2600,
          repeat: -1,
          repeatDelay: 400
        });
      });
    });

    this.time.delayedCall(1200, () => this.showEndCard(cx, cy));
  }

  showEndCard(cx, cy) {
    const cardW = 440;
    const cardH = 105;
    const cardY = 72;

    this.add.rectangle(cx + 3, cardY + 3, cardW, cardH, 0x0a0c0a, 0.75);
    const card = this.add.rectangle(cx, cardY, cardW, cardH, 0xf6eedb);
    card.setStrokeStyle(3, 0x273824);

    this.add.text(cx, cardY - 34, '“Some afternoons stay with you forever.”', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#4f3a2b',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    this.add.text(cx, cardY - 14, 'SIDE B', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#a63a2a',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, cardY + 6, '★ YOU GOT YOUR DREAM ALBUM: LED ZEPPELIN II (1969) ★', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#24592a',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, cardY + 24, 'October 1969 • Neighborhood Adventure Complete', {
      fontFamily: 'monospace',
      fontSize: '8.5px',
      color: '#6e5e49'
    }).setOrigin(0.5);

    const btnY = 270;
    const createBtn = (x, text, onClick) => {
      const btn = this.add.text(x, btnY, text, {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#ffffff',
        backgroundColor: '#283c27',
        padding: { x: 8, y: 4 }
      }).setOrigin(0.5);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => btn.setBackgroundColor('#3d593b'));
      btn.on('pointerout', () => btn.setBackgroundColor('#283c27'));
      btn.on('pointerdown', onClick);
      return btn;
    };

    createBtn(cx - 130, '[ KEEP LISTENING ]', () => {
      card.setVisible(false);
    });

    createBtn(cx, '[ EXPLORE TOWN ]', () => {
      audioManager.stopMusic();
      this.scene.stop('EndingScene');
      this.scene.start('NeighborhoodScene');
    });

    createBtn(cx + 130, '[ PLAY AGAIN ]', () => {
      audioManager.stopMusic();
      gameState.reset();
      this.scene.stop('EndingScene');
      this.scene.start('NeighborhoodScene');
    });
  }
}
