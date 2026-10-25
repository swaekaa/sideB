/**
 * main.js
 * Application entry point for SIDE B: One Perfect Afternoon (1969)
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

  // Hook up vinyl spinning animation in header when music is playing
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

  // HUD Collapse / Expand Toggle
  const toggleBtn = document.getElementById('toggle-hud-btn');
  const hudCards = document.getElementById('hud-cards-container');
  if (toggleBtn && hudCards) {
    let isHidden = false;
    toggleBtn.addEventListener('click', () => {
      isHidden = !isHidden;
      if (isHidden) {
        hudCards.classList.add('collapsed');
        toggleBtn.textContent = 'HUD [SHOW ▼]';
      } else {
        hudCards.classList.remove('collapsed');
        toggleBtn.textContent = 'HUD [HIDE ▲]';
      }
    });
  }

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const fsBtn = document.getElementById('fullscreen-btn');
  const fsHeaderBtn = document.getElementById('fullscreen-header-btn');

  const updateFullscreenUI = () => {
    const isFs = !!document.fullscreenElement;
    const label = isFs ? '🗕 EXIT [F]' : '⛶ FULLSCREEN';
    if (fsBtn) fsBtn.textContent = label;
    if (fsHeaderBtn) fsHeaderBtn.textContent = label;
  };

  if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);
  if (fsHeaderBtn) fsHeaderBtn.addEventListener('click', toggleFullscreen);

  document.addEventListener('fullscreenchange', updateFullscreenUI);
  document.addEventListener('webkitfullscreenchange', updateFullscreenUI);

  // 'F' key shortcut for fullscreen toggle
  window.addEventListener('keydown', (e) => {
    if ((e.key === 'f' || e.key === 'F') && !e.repeat) {
      // Don't trigger if user is in an input or text area
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;
      toggleFullscreen();
    }
  });
});
