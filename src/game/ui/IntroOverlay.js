/**
 * IntroOverlay.js
 * Cinematic Story Prologue & Disclaimer for SIDE B (1969)
 * Fades in "Welcome to SIDE B", unfolds the high school & Led Zeppelin backstory,
 * and seamlessly dives the player into the neighborhood game.
 */

import { audioManager } from '../systems/AudioManager.js';
import { gameState } from '../systems/GameState.js';

export class IntroOverlay {
  constructor() {
    this.overlay = document.getElementById('intro-story-overlay');
    this.screenWelcome = document.getElementById('intro-screen-welcome');
    this.screenStory = document.getElementById('intro-screen-story');
    this.diveBtn = document.getElementById('intro-dive-btn');

    this.currentStep = 1; // 1 = welcome/disclaimer, 2 = school story, 3 = finished
    this.autoTimer = null;
    this.isDone = false;

    if (this.overlay) {
      this.init();
    }
  }

  init() {
    // Flag game state so player does not move while reading prologue
    gameState.introActive = true;

    // Auto-advance from Screen 1 ("WELCOME TO SIDE B") to Screen 2 after 2.8 seconds
    this.autoTimer = setTimeout(() => {
      this.goToStory();
    }, 2800);

    // Clicking anywhere on the overlay advances to the next step
    if (this.overlay) {
      this.overlay.addEventListener('click', () => {
        if (this.isDone) return;
        if (this.currentStep === 1) {
          this.goToStory();
        } else if (this.currentStep === 2) {
          this.diveIn();
        }
      });
    }

    // Direct click on the dive button
    if (this.diveBtn) {
      this.diveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.diveIn();
      });
    }

    // Keyboard controls: SPACE / ENTER advances, F / ESC skips immediately
    window.addEventListener('keydown', (e) => {
      if (this.isDone) return;
      if (!this.overlay || this.overlay.style.display === 'none') return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (this.currentStep === 1) {
          this.goToStory();
        } else if (this.currentStep === 2) {
          this.diveIn();
        }
      } else if (e.key === 'f' || e.key === 'F' || e.key === 'Escape') {
        e.preventDefault();
        this.diveIn();
      }
    });
  }

  goToStory() {
    if (this.currentStep !== 1 || this.isDone) return;
    this.currentStep = 2;
    if (this.autoTimer) clearTimeout(this.autoTimer);

    if (this.screenWelcome) {
      this.screenWelcome.style.transition = 'opacity 0.45s ease';
      this.screenWelcome.style.opacity = '0';
      
      setTimeout(() => {
        this.screenWelcome.style.display = 'none';
        if (this.screenStory) {
          this.screenStory.style.display = 'flex';
          this.screenStory.style.opacity = '0';
          this.screenStory.style.transition = 'opacity 0.55s ease';
          
          requestAnimationFrame(() => {
            this.screenStory.style.opacity = '1';
          });
        }
      }, 450);
    }
  }

  diveIn() {
    if (this.isDone) return;
    this.isDone = true;
    this.currentStep = 3;
    if (this.autoTimer) clearTimeout(this.autoTimer);

    // Unlock and start ambient audio
    audioManager.init();
    audioManager.playCoin();
    setTimeout(() => {
      if (!audioManager.currentMusicType) {
        audioManager.playMusic('ambient');
      }
    }, 400);

    if (this.overlay) {
      this.overlay.classList.add('fade-out');
      setTimeout(() => {
        this.overlay.style.display = 'none';
        gameState.introActive = false;
      }, 650);
    } else {
      gameState.introActive = false;
    }
  }
}
