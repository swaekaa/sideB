/**
 * HedgeMinigameScene.js
 * Skill-based hedge trimming timing minigame for SIDE B (512x288 Viewport)
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';

export class HedgeMinigameScene extends Phaser.Scene {
  constructor() {
    super('HedgeMinigameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1c2419');

    const cx = this.cameras.main.width / 2;
    const cy = this.cameras.main.height / 2;
    const cardW = 340;
    const cardH = 175;

    // Outer shadow & card
    this.add.rectangle(cx + 4, cy + 4, cardW, cardH, 0x111610, 0.75);
    const card = this.add.rectangle(cx, cy, cardW, cardH, 0xf6f1de);
    card.setStrokeStyle(3, 0x273824);

    // Title bar
    this.add.rectangle(cx, cy - 68, cardW - 8, 24, 0x273824);
    this.add.text(cx, cy - 68, 'CHORE: TRIM THE GARDEN HEDGES (1969)', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#f6f1de',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.instructionText = this.add.text(cx, cy - 42, 'Press SPACE when the marker is in the GREEN zone!', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#2f422b',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.attemptsLeft = 3;
    this.successfulHits = 0;
    this.attemptText = this.add.text(cx, cy - 24, 'Cuts remaining: 3 / 3  |  Good snips: 0', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#a64232',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Timing Gauge Bar Container
    const barW = 250;
    const barH = 26;
    const barX = cx;
    const barY = cy + 12;

    this.add.rectangle(barX, barY, barW, barH, 0xc25642);
    const targetW = 60;
    const targetX = barX + 30; // sweet spot offset
    this.targetZone = this.add.rectangle(targetX, barY, targetW, barH, 0x489640);
    const barBorder = this.add.rectangle(barX, barY, barW, barH);
    barBorder.setStrokeStyle(2.5, 0x1a2618);

    this.greenMin = targetX - targetW / 2;
    this.greenMax = targetX + targetW / 2;
    this.barLeft = barX - barW / 2;
    this.barRight = barX + barW / 2;

    this.marker = this.add.rectangle(this.barLeft, barY, 5, barH + 6, 0xffffff);
    this.marker.setStrokeStyle(1.5, 0x000000);

    this.markerPos = this.barLeft;
    this.markerSpeed = 240;
    this.markerDir = 1;
    this.isActive = true;

    this.resultLabel = this.add.text(cx, cy + 46, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.actionPrompt = this.add.text(cx, cy + 70, '[ Press SPACE or Click to SNIP ]', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#344730'
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-SPACE', () => this.trySnip());
    this.input.on('pointerdown', () => this.trySnip());
  }

  update(time, delta) {
    if (!this.isActive) return;

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
      verdict = 'GREAT JOB! VERY TIDY HEDGES!';
    }

    audioManager.playSuccess();
    gameState.addCash(reward);
    gameState.setQuest('hedge', true);
    gameState.setQuest('hedgeScore', this.successfulHits);
    gameState.advanceTime(15);

    this.attemptText.setText(verdict);
    this.resultLabel.setText(`Earned: +$${reward}.00!`);
    this.resultLabel.setColor('#216327');
    this.actionPrompt.setText('Returning to neighborhood...');

    this.time.delayedCall(1600, () => {
      this.scene.stop('HedgeMinigameScene');
      this.scene.resume('NeighborhoodScene');
    });
  }
}
