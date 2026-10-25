/**
 * EndingScene.js
 * The Grand Finale for SIDE B: One Perfect Afternoon
 * Listening to Midnight Radio in your bedroom as twilight falls.
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';

export class EndingScene extends Phaser.Scene {
  constructor() {
    super('EndingScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#17151e');

    const cx = 384 / 2;
    const cy = 216 / 2;

    // --- Bedroom Environment ---

    // Bedroom Wall (Cozy warm 70s mustard/olive paper)
    const wall = this.add.rectangle(cx, 75, 384, 150, 0x5a5743);
    // Carpet Floor (Rusty orange shag carpet)
    const carpet = this.add.rectangle(cx, 185, 384, 70, 0xa65038);

    // Bed on the left
    this.add.rectangle(60, 140, 90, 48, 0x3d4d59); // mattress
    this.add.rectangle(60, 148, 90, 32, 0x486952); // plaid quilt
    this.add.rectangle(30, 126, 26, 16, 0xf0edd6); // pillow
    this.add.rectangle(15, 120, 6, 68, 0x473220); // wooden headboard

    // Evening Window over bed
    const winX = 130;
    const winY = 60;
    this.add.rectangle(winX, winY, 68, 54, 0x3b2a1e); // frame
    // Twilight sky gradient in window
    const sky = this.add.rectangle(winX, winY, 62, 48, 0x3d2047);
    // Golden sunset horizon & stars
    this.add.rectangle(winX, winY + 16, 62, 16, 0xba533e);
    this.add.rectangle(winX, winY + 22, 62, 6, 0xdf8d48);
    // Tiny stars
    this.add.circle(winX - 18, winY - 12, 1, 0xffffff);
    this.add.circle(winX + 12, winY - 16, 1, 0xffffff);
    this.add.circle(winX + 22, winY - 4, 1, 0xffffff);
    // Window panes
    this.add.rectangle(winX, winY, 62, 2, 0x3b2a1e);
    this.add.rectangle(winX, winY, 2, 48, 0x3b2a1e);

    // Nightstand with warm glowing lamp
    const standX = 225;
    const standY = 145;
    this.add.rectangle(standX, standY, 34, 42, 0x6e4324);
    // Lamp
    this.add.rectangle(standX, standY - 26, 6, 12, 0x3b2a1e);
    this.add.polygon(standX, standY - 38, [[-12, 10], [12, 10], [8, -6], [-8, -6]], 0xf2d97e);
    // Warm lamp light glow
    const lampGlow = this.add.circle(standX, standY - 30, 48, 0xffebb0, 0.15);

    // Turntable / Record Player
    const ttX = 285;
    const ttY = 148;
    this.add.rectangle(ttX, ttY, 52, 34, 0x422a1a); // wood casing
    this.add.rectangle(ttX, ttY - 4, 46, 26, 0x222222); // deck

    // Spinning Vinyl Record
    this.vinylDisk = this.add.circle(ttX - 6, ttY - 4, 11, 0x111111);
    this.vinylDisk.setStrokeStyle(1, 0x444444);
    this.vinylLabel = this.add.circle(ttX - 6, ttY - 4, 4, 0xd44733);
    // Tonearm
    this.add.line(0, 0, ttX + 14, ttY + 4, ttX - 4, ttY - 4, 0xdddddd).setLineWidth(2);

    // The Album Sleeve Displayed proudly
    const albumThumb = this.add.image(352, 138, 'album_midnight_radio');
    albumThumb.setDisplaySize(38, 38);
    this.add.rectangle(352, 158, 42, 4, 0x3b2619); // stand

    // Player sitting cross-legged on carpet
    this.playerFigure = this.add.image(210, 158, 'player_down_0');
    this.playerFigure.setDisplaySize(20, 30);

    // Floating musical notes
    this.notes = [];
    const noteChars = ['♪', '♫', '♩', '♬'];
    for (let i = 0; i < 6; i++) {
      const note = this.add.text(ttX - 6, ttY - 14, noteChars[i % noteChars.length], {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#f0c74a',
        fontStyle: 'bold'
      });
      note.setAlpha(0);
      this.notes.push(note);
    }

    // Play nostalgic ending music with vinyl crackle
    audioManager.playMusic('ending');

    // Animate spinning vinyl
    this.tweens.add({
      targets: [this.vinylDisk, this.vinylLabel],
      angle: 360,
      duration: 1800,
      repeat: -1
    });

    // Animate floating musical notes
    this.notes.forEach((note, idx) => {
      this.time.delayedCall(idx * 700, () => {
        this.tweens.add({
          targets: note,
          x: { from: ttX - 6, to: ttX - 25 - (idx * 6) },
          y: { from: ttY - 14, to: ttY - 60 - (idx * 4) },
          alpha: { from: 1, to: 0 },
          duration: 2600,
          repeat: -1,
          repeatDelay: 400
        });
      });
    });

    // --- End Card Overlay ---
    this.time.delayedCall(1200, () => this.showEndCard(cx, cy));
  }

  showEndCard(cx, cy) {
    const cardW = 340;
    const cardH = 92;
    const cardY = 56;

    // Card shadow
    this.add.rectangle(cx + 3, cardY + 3, cardW, cardH, 0x0a0c0a, 0.7);
    // Warm card
    const card = this.add.rectangle(cx, cardY, cardW, cardH, 0xf6eedb);
    card.setStrokeStyle(3, 0x273824);

    this.add.text(cx, cardY - 30, '“Some afternoons stay with you forever.”', {
      fontFamily: 'monospace',
      fontSize: '9.5px',
      color: '#4f3a2b',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    this.add.text(cx, cardY - 12, 'SIDE B', {
      fontFamily: 'monospace',
      fontSize: '15px',
      color: '#a63a2a',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, cardY + 4, '★ YOU GOT YOUR DREAM ALBUM: MIDNIGHT RADIO ★', {
      fontFamily: 'monospace',
      fontSize: '8.5px',
      color: '#24592a',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, cardY + 20, '1977 • Neighborhood Adventure Complete', {
      fontFamily: 'monospace',
      fontSize: '7.5px',
      color: '#6e5e49'
    }).setOrigin(0.5);

    // Action buttons at bottom of screen
    const btnY = 202;

    const createBtn = (x, text, onClick) => {
      const btn = this.add.text(x, btnY, text, {
        fontFamily: 'monospace',
        fontSize: '7.5px',
        color: '#ffffff',
        backgroundColor: '#283c27',
        padding: { x: 6, y: 3 }
      }).setOrigin(0.5);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => btn.setBackgroundColor('#3d593b'));
      btn.on('pointerout', () => btn.setBackgroundColor('#283c27'));
      btn.on('pointerdown', onClick);
      return btn;
    };

    createBtn(cx - 100, '[ KEEP LISTENING ]', () => {
      // close end card, let music play
      card.setVisible(false);
    });

    createBtn(cx, '[ EXPLORE TOWN ]', () => {
      audioManager.stopMusic();
      this.scene.stop('EndingScene');
      this.scene.start('NeighborhoodScene');
    });

    createBtn(cx + 105, '[ PLAY AGAIN ]', () => {
      audioManager.stopMusic();
      gameState.reset();
      this.scene.stop('EndingScene');
      this.scene.start('NeighborhoodScene');
    });
  }
}
