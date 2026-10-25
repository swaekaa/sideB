/**
 * BootScene.js
 * Asset generation and game bootstrap for SIDE B (1969 Edition)
 */

import { AssetGenerator } from '../systems/AssetGenerator.js';
import { gameState } from '../systems/GameState.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#131a10');

    const cx = 640 / 2;
    const cy = 360 / 2;

    // Outer shadow
    this.add.rectangle(cx + 3, cy + 3, 340, 130, 0x000000, 0.6);
    // Card
    const card = this.add.rectangle(cx, cy, 340, 130, 0xf0e8d2);
    card.setStrokeStyle(3, 0x1e2e18);

    // Corner accents
    [[cx - 165, cy - 60], [cx + 165, cy - 60],
     [cx - 165, cy + 60], [cx + 165, cy + 60]].forEach(([x, y]) => {
      this.add.rectangle(x, y, 8, 8, 0xe8c030);
    });

    // Vinyl record icon
    const vinylX = cx - 120;
    this.add.circle(vinylX, cy - 10, 26, 0x181414);
    this.add.circle(vinylX, cy - 10, 20, 0x222020);
    this.add.circle(vinylX, cy - 10, 7, 0xc74a38);
    this.add.circle(vinylX, cy - 10, 2.5, 0xf0f0f0);
    // Grooves
    [24, 18, 13, 9].forEach(r => {
      this.add.circle(vinylX, cy - 10, r, 0x000000, 0).setStrokeStyle(0.5, 0x333333, 0.5);
    });

    // Spin the vinyl icon
    this.tweens.add({
      targets: this.add.group(),
      duration: 2000,
      repeat: -1
    });

    this.add.text(cx + 10, cy - 30, 'SIDE B', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#9a2c1c',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx + 10, cy - 5, 'ONE PERFECT AFTERNOON', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#1e2e1a',
      fontStyle: 'bold',
      letterSpacing: 3
    }).setOrigin(0.5);

    this.add.text(cx + 10, cy + 12, '★  SATURDAY, OCTOBER 1969  ★', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#8a7258'
    }).setOrigin(0.5);

    const loadingText = this.add.text(cx, cy + 42, '▶  LOADING NEIGHBORHOOD...', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#4a6038'
    }).setOrigin(0.5);

    // Blink loading text
    this.tweens.add({
      targets: loadingText,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    const generator = new AssetGenerator(this);
    generator.generateAll();

    // Don't load old save — always fresh start for clean experience
    gameState.notify();

    this.time.delayedCall(600, () => {
      this.scene.start('NeighborhoodScene');
    });
  }
}
