/**
 * config.js
 * Phaser 3 configuration for SIDE B: One Perfect Afternoon (1969)
 */

import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { NeighborhoodScene } from './scenes/NeighborhoodScene.js';
import { HedgeMinigameScene } from './scenes/HedgeMinigameScene.js';
import { MathMinigameScene } from './scenes/MathMinigameScene.js';
import { JuneMinigameScene } from './scenes/JuneMinigameScene.js';
import { RecordShopScene } from './scenes/RecordShopScene.js';
import { EndingScene } from './scenes/EndingScene.js';

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 640,
  height: 360,
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  backgroundColor: '#1b2319',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [
    BootScene,
    NeighborhoodScene,
    HedgeMinigameScene,
    MathMinigameScene,
    JuneMinigameScene,
    RecordShopScene,
    EndingScene
  ]
};
