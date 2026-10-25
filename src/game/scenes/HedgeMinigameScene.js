/**
 * HedgeMinigameScene.js
 * Skill-based hedge trimming timing minigame for SIDE B
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';

export class HedgeMinigameScene extends Phaser.Scene {
  constructor() {
    super('HedgeMinigameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1c2419');

    // UI Frame (Centered in 384 x 216)
    const cardW = 300;
    const cardH = 160;
    const cx = 384 / 2;
    const cy = 216 / 2;

    // Outer shadow & card
    this.add.rectangle(cx + 3, cy + 3, cardW, cardH, 0x111610, 0.7);
    const card = this.add.rectangle(cx, cy, cardW, cardH, 0xf6f1de);
    card.setStrokeStyle(3, 0x273824);

    // Title bar
    this.add.rectangle(cx, cy - 62, cardW - 8, 22, 0x273824);
    this.add.text(cx, cy - 62, 'CHORE: TRIM THE GARDEN HEDGES', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#f6f1de',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Subtitle instruction
    this.instructionText = this.add.text(cx, cy - 38, 'Press SPACE when the marker is in the GREEN zone!', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#2f422b',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Attempt counter & score
    this.attemptsLeft = 3;
    this.successfulHits = 0;
    this.attemptText = this.add.text(cx, cy - 22, 'Cuts remaining: 3 / 3  |  Good snips: 0', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#a64232',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Timing Gauge Bar Container
    const barW = 220;
    const barH = 24;
    const barX = cx;
    const barY = cy + 10;

    // Bar background (Dark red/coral for miss zone)
    this.add.rectangle(barX, barY, barW, barH, 0xc25642);
    // Green target sweet spot (60px wide, offset to center-right)
    const targetW = 55;
    const targetX = barX + 25; // center-right
    this.targetZone = this.add.rectangle(targetX, barY, targetW, barH, 0x489640);
    // Bar frame border
    const barBorder = this.add.rectangle(barX, barY, barW, barH);
    barBorder.setStrokeStyle(2, 0x1a2618);

    // Sweet spot bounds
    this.greenMin = targetX - targetW / 2;
    this.greenMax = targetX + targetW / 2;
    this.barLeft = barX - barW / 2;
    this.barRight = barX + barW / 2;

    // Moving Needle / Marker
    this.marker = this.add.rectangle(this.barLeft, barY, 4, barH + 6, 0xffffff);
    this.marker.setStrokeStyle(1, 0x000000);

    this.markerPos = this.barLeft;
    this.markerSpeed = 220; // pixels per second
    this.markerDir = 1;
    this.isActive = true;

    // Result notification label
    this.resultLabel = this.add.text(cx, cy + 40, '', {
      fontFamily: 'monospace',
      fontSize: '11px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Action button / Prompt
    this.actionPrompt = this.add.text(cx, cy + 62, '[ Press SPACE or Click to SNIP ]', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#344730'
    }).setOrigin(0.5);

    // Input handlers
    this.input.keyboard.on('keydown-SPACE', () => this.trySnip());
    this.input.on('pointerdown', () => this.trySnip());
  }

  update(time, delta) {
    if (!this.isActive) return;

    // Oscillate marker
    const dt = delta / 1000;
    this.markerPos += this.markerSpeed * this.markerDir * dt;

    if (this.markerPos >= this.barRight) {
      this.markerPos = this.barRight;
      this.markerDir = -1;
    } else if (this.markerPos <= this.barLeft) {
      this.markerPos = this.barLeft;
      this.markerDir = 1;
    }

    this.marker.setX(this.markerPos);
  }

  trySnip() {
    if (!this.isActive) return;

    audioManager.playSnip();

    const isHit = this.markerPos >= this.greenMin && this.markerPos <= this.greenMax;

    if (isHit) {
      this.successfulHits++;
      this.resultLabel.setText('★ PERFECT CUT! ★');
      this.resultLabel.setColor('#297a2f');
    } else {
      this.resultLabel.setText('MISS! Keep trying!');
      this.resultLabel.setColor('#b53d2d');
    }

    this.attemptsLeft--;
    this.attemptText.setText(`Cuts remaining: ${this.attemptsLeft} / 3  |  Good snips: ${this.successfulHits}`);

    if (this.attemptsLeft <= 0) {
      this.finishMinigame();
    }
  }

  finishMinigame() {
    this.isActive = false;

    let reward = 3;
    let verdict = 'GOOD JOB!';
    if (this.successfulHits === 3) {
      reward = 6;
      verdict = 'PERFECT! TOP QUALITY HEDGE TRIM!';
    } else if (this.successfulHits === 2) {
      reward = 5;
      verdict = 'GREAT JOB! VERY TIDY HEDGE!';
    }

    audioManager.playSuccess();
    gameState.addCash(reward);
    gameState.setQuest('hedge', true);
    gameState.setQuest('hedgeScore', this.successfulHits);
    gameState.advanceTime(15);

    this.attemptText.setText(verdict);
    this.resultLabel.setText(`Earned: +$${reward}!`);
    this.resultLabel.setColor('#216327');
    this.actionPrompt.setText('Returning to neighborhood in a moment...');

    this.time.delayedCall(1600, () => {
      this.scene.stop('HedgeMinigameScene');
      this.scene.resume('NeighborhoodScene');
    });
  }
}
