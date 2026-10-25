/**
 * main.js
 * Application entry point for SIDE B: One Perfect Afternoon
 */

import Phaser from 'phaser';
import { gameConfig } from './game/config.js';
import { audioManager } from './game/systems/AudioManager.js';

window.addEventListener('DOMContentLoaded', () => {
  // Initialize Phaser 3 Game
  const game = new Phaser.Game(gameConfig);

  // Initialize audio context on first user click or key press
  const unlockAudio = () => {
    audioManager.init();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });

  // Hook up vinyl spinning animation in header when sound plays
  const vinylIcon = document.getElementById('header-vinyl');
  if (vinylIcon) {
    setInterval(() => {
      if (audioManager.currentMusicType && !audioManager.isMuted) {
        vinylIcon.classList.add('playing');
      } else {
        vinylIcon.classList.remove('playing');
      }
    }, 400);
  }
});
