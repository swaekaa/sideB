/**
 * JuneMinigameScene.js
 * June's 1970s Beat Timing & Music Hangout for SIDE B
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';

export class JuneMinigameScene extends Phaser.Scene {
  constructor() {
    super('JuneMinigameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1c2419');

    const cx = 384 / 2;
    const cy = 216 / 2;
    const cardW = 300;
    const cardH = 165;

    // Card background
    this.add.rectangle(cx + 3, cy + 3, cardW, cardH, 0x111610, 0.7);
    const card = this.add.rectangle(cx, cy, cardW, cardH, 0xf6f1de);
    card.setStrokeStyle(3, 0x273824);

    // Title bar
    this.add.rectangle(cx, cy - 64, cardW - 8, 22, 0x273824);
    this.add.text(cx, cy - 64, "JUNE'S RADIO GROOVE BEAT", {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#f6f1de',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.instruction = this.add.text(cx, cy - 42, 'Tap SPACE when the sound wave hits the center VINYL!', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#2b3f27',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Vinyl Target in Center
    this.vinylTarget = this.add.circle(cx, cy + 5, 20, 0x222222);
    this.vinylTarget.setStrokeStyle(3, 0xd98638);
    this.vinylLabel = this.add.circle(cx, cy + 5, 7, 0xc74a38);

    // Pulsing rhythm wave circle
    this.waveRadius = 75;
    this.waveCircle = this.add.circle(cx, cy + 5, this.waveRadius);
    this.waveCircle.setStrokeStyle(2, 0x488b99);

    // Progress counter
    this.beatsLeft = 3;
    this.successfulHits = 0;
    this.statusText = this.add.text(cx, cy + 42, 'Beats left: 3  |  In groove: 0', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#a64232',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.feedbackText = this.add.text(cx, cy + 62, '[ Press SPACE or Click to catch the beat ]', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#465c41'
    }).setOrigin(0.5);

    this.waveSpeed = 55; // contraction speed
    this.isActive = true;

    // Start playing background radio groove
    audioManager.playMusic('radio');

    this.input.keyboard.on('keydown-SPACE', () => this.tryCatchBeat());
    this.input.on('pointerdown', () => this.tryCatchBeat());
  }

  update(time, delta) {
    if (!this.isActive) return;

    const dt = delta / 1000;
    this.waveRadius -= this.waveSpeed * dt;

    if (this.waveRadius <= 5) {
      // missed beat, restart wave
      this.waveRadius = 75;
      this.handleMiss();
    }

    this.waveCircle.setRadius(this.waveRadius);
  }

  tryCatchBeat() {
    if (!this.isActive) return;

    // Sweet spot: radius close to target (target is 20, good range: 14 to 28)
    const inGroove = this.waveRadius >= 13 && this.waveRadius <= 28;

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

    this.waveRadius = 75;
    this.beatsLeft--;

    if (this.beatsLeft <= 0) {
      this.finishActivity();
    }
  }

  handleMiss() {
    this.beatsLeft--;
    this.statusText.setText(`Missed beat! Beats left: ${this.beatsLeft}`);
    this.statusText.setColor('#ba3f2e');
    if (this.beatsLeft <= 0) {
      this.finishActivity();
    }
  }

  finishActivity() {
    this.isActive = false;
    audioManager.stopMusic();

    let reward = 3;
    let comment = 'June: "You\'ve got great rhythm! Take this $3 for your record fund!"';
    if (this.successfulHits < 2) {
      reward = 2;
      comment = 'June: "Not bad for an afternoon jam! Here\'s $2 to help you out!"';
    }

    audioManager.playSuccess();
    audioManager.playCoin();
    gameState.addCash(reward);
    gameState.setQuest('juneDone', true);
    gameState.advanceTime(10);

    this.statusText.setText(comment);
    this.statusText.setColor('#216327');
    this.feedbackText.setText(`Earned: +$${reward}! Tip: "Mr. Vinyl holds Midnight Radio behind the counter!"`);

    this.time.delayedCall(2000, () => {
      this.scene.stop('JuneMinigameScene');
      this.scene.resume('NeighborhoodScene');
    });
  }
}
