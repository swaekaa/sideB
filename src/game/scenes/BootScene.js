/**
 * BootScene.js
 * Asset generation and game bootstrap for SIDE B
 */

import { AssetGenerator } from '../systems/AssetGenerator.js';
import { gameState } from '../systems/GameState.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1c261b');

    const cx = 384 / 2;
    const cy = 216 / 2;

    // Vintage loading card
    this.add.rectangle(cx, cy, 260, 90, 0xf6f1de).setStrokeStyle(2, 0x273824);
    this.add.text(cx, cy - 20, 'SIDE B', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#b24534',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, cy + 2, 'ONE PERFECT AFTERNOON • 1977', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#273824',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const loadingText = this.add.text(cx, cy + 22, 'GENERATING NEIGHBORHOOD...', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#6e5e49'
    }).setOrigin(0.5);

    // Generate all procedural pixel-art assets
    const generator = new AssetGenerator(this);
    generator.generateAll();

    // Check for saved state
    gameState.load();
    gameState.notify();

    // Switch to Neighborhood Scene
    this.time.delayedCall(450, () => {
      this.scene.start('NeighborhoodScene');
    });
  }
}
