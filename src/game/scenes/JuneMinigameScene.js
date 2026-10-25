/**
 * JuneMinigameScene.js
 * June's 1969 Beat Timing & Radio Groove for SIDE B (512x288 Viewport)
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';

export class JuneMinigameScene extends Phaser.Scene {
  constructor() {
    super('JuneMinigameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1c2419');

    const cx = this.cameras.main.width / 2;
    const cy = this.cameras.main.height / 2;
    const cardW = 340;
    const cardH = 180;

    // Card background
    this.add.rectangle(cx + 4, cy + 4, cardW, cardH, 0x111610, 0.75);
    const card = this.add.rectangle(cx, cy, cardW, cardH, 0xf6f1de);
    card.setStrokeStyle(3, 0x273824);

    // Title bar
    this.add.rectangle(cx, cy - 70, cardW - 8, 24, 0x273824);
    this.add.text(cx, cy - 70, "JUNE'S 1969 RADIO GROOVE", {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#f6f1de',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.instruction = this.add.text(cx, cy - 44, 'Tap SPACE when the sound wave contracts to the center VINYL!', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#2b3f27',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Center Vinyl Target
    this.vinylTarget = this.add.circle(cx, cy + 6, 22, 0x222222);
    this.vinylTarget.setStrokeStyle(3, 0xd98638);
    this.vinylLabel = this.add.circle(cx, cy + 6, 8, 0xc74a38);

    // Contracting rhythm wave circle
    this.waveRadius = 80;
    this.waveCircle = this.add.circle(cx, cy + 6, this.waveRadius);
    this.waveCircle.setStrokeStyle(2.5, 0x488b99);

    this.beatsLeft = 3;
    this.successfulHits = 0;
    this.statusText = this.add.text(cx, cy + 46, 'Beats remaining: 3  |  In groove: 0', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#a64232',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.feedbackText = this.add.text(cx, cy + 70, '[ Press SPACE or Click to catch the beat ]', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#465c41'
    }).setOrigin(0.5);

    this.waveSpeed = 60;
    this.isActive = true;

    audioManager.playMusic('radio');

    this.input.keyboard.on('keydown-SPACE', () => this.tryCatchBeat());
    this.input.on('pointerdown', () => this.tryCatchBeat());
  }

  update(time, delta) {
    if (!this.isActive) return;

    const dt = delta / 1000;
    this.waveRadius -= this.waveSpeed * dt;

    if (this.waveRadius <= 6) {
      this.waveRadius = 80;
      this.handleMiss();
    }

    this.waveCircle.setRadius(this.waveRadius);
  }

  tryCatchBeat() {
    if (!this.isActive) return;

    const inGroove = this.waveRadius >= 14 && this.waveRadius <= 32;

    if (inGroove) {
      audioManager.playTalk('june');
      this.successfulHits++;
      this.statusText.setText(`★ GROOVY HIT! ★ (${this.successfulHits}/3)`);
      this.statusText.setColor('#26772c');
    } else {
      audioManager.playError();
      this.statusText.setText('Off beat! Keep listening!');
      this.statusText.setColor('#ba3f2e');
    }

    this.waveRadius = 80;
    this.beatsLeft--;

    if (this.beatsLeft <= 0) {
      this.finishActivity();
    }
  }

  handleMiss() {
    this.beatsLeft--;
    this.statusText.setText(`Missed beat! Beats remaining: ${this.beatsLeft}`);
    this.statusText.setColor('#ba3f2e');
    if (this.beatsLeft <= 0) {
      this.finishActivity();
    }
  }

  finishActivity() {
    this.isActive = false;
    audioManager.stopMusic();

    let reward = 2;
    let comment = 'June: "You\'ve got great rhythm! Here\'s $2.00 for your record fund!"';
    if (this.successfulHits >= 2) {
      reward = 2;
      comment = 'June: "Groovy! Mr. Vinyl has Led Zeppelin II waiting behind the counter!"';
    }

    audioManager.playSuccess();
    audioManager.playCoin();
    gameState.addCash(reward);
    gameState.setQuest('juneDone', true);
    gameState.advanceTime(10);

    this.statusText.setText(comment);
    this.statusText.setColor('#216327');
    this.feedbackText.setText(`Earned: +$${reward}.00! Tip: "Check Mr. Vinyl's shop before 6:00!"`);

    this.time.delayedCall(2000, () => {
      this.scene.stop('JuneMinigameScene');
      this.scene.resume('NeighborhoodScene');
    });
  }
}
