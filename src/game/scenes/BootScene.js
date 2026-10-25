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
    this.cameras.main.setBackgroundColor('#1c261b');

    const cx = 512 / 2;
    const cy = 288 / 2;

    this.add.rectangle(cx, cy, 300, 100, 0xf6f1de).setStrokeStyle(2.5, 0x273824);
    this.add.text(cx, cy - 22, 'SIDE B', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#b24534',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, cy + 3, 'ONE PERFECT AFTERNOON • 1969', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#273824',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, cy + 24, 'GENERATING 1969 NEIGHBORHOOD...', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#6e5e49'
    }).setOrigin(0.5);

    const generator = new AssetGenerator(this);
    generator.generateAll();

    gameState.load();
    gameState.notify();

    this.time.delayedCall(400, () => {
      this.scene.start('NeighborhoodScene');
    });
  }
}
