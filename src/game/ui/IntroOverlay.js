/**
 * IntroOverlay.js
 * Narrator Dialogue with Typewriter Animation for SIDE B (1969)
 * Pure solid black background hides game world until player dives in.
 * Dialogue box format narrated by "NARRATOR" with clean monochrome typography.
 */

import { audioManager } from '../systems/AudioManager.js';
import { gameState } from '../systems/GameState.js';

export class IntroOverlay {
  constructor() {
    this.overlay = document.getElementById('intro-story-overlay');
    this.p1El = document.getElementById('intro-story-p1');
    this.p2El = document.getElementById('intro-story-p2');
    this.typingPrompt = document.getElementById('intro-typing-prompt');
    this.btnWrapper = document.getElementById('intro-btn-wrapper');
    this.diveBtn = document.getElementById('intro-dive-btn');

    this.typeTimer = null;
    this.isTyping = false;
    this.isDone = false;

    // The authentic story text requested by user
    this.rawP1 = "It is an unforgettable Saturday afternoon in October 1969. The autumn sun is casting golden rays across the suburban lawns of Oakwood, and you have one dream: buying the newly released album Led Zeppelin II from Mr. Vinyl's neighborhood record shop before it closes at 6:00 PM.";
    this.rawP2 = "The album costs $25.00. You currently have $4.00 in your pocket.";

    // Styled version displayed upon completion or instant skip (monochrome bold, NO COLORS)
    this.styledP1 = 'It is an unforgettable Saturday afternoon in October 1969. The autumn sun is casting golden rays across the suburban lawns of Oakwood, and you have one dream: buying the newly released album <strong>Led Zeppelin II</strong> from Mr. Vinyl\'s neighborhood record shop before it closes at <strong>6:00 PM</strong>.';
    this.styledP2 = 'The album costs <strong>$25.00</strong>. You currently have <strong>$4.00</strong> in your pocket.';

    if (this.overlay) {
      this.init();
    }
  }

  init() {
    // Lock player input during narrator prologue
    gameState.introActive = true;

    // Start typewriter animation immediately
    this.startTypewriter();

    // Clicking anywhere on the overlay advances / fast-forwards
    if (this.overlay) {
      this.overlay.addEventListener('click', () => {
        this.handleUserAdvance();
      });
    }

    // Direct click on the dive button
    if (this.diveBtn) {
      this.diveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.diveIn();
      });
    }

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (this.isDone) return;
      if (!this.overlay || this.overlay.style.display === 'none') return;

      if (e.key === ' ' || e.key === 'Enter' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        this.handleUserAdvance();
      } else if (e.key === 'f' || e.key === 'F' || e.key === 'Escape') {
        e.preventDefault();
        this.diveIn();
      }
    });
  }

  handleUserAdvance() {
    if (this.isDone) return;
    audioManager.init(); // Unlock browser audio on user gesture

    if (this.isTyping) {
      // Fast-forward dialogue: clicking/space instantly completes the typing animation
      this.finishTyping();
    } else {
      // Done reading, dive in
      this.diveIn();
    }
  }

  startTypewriter() {
    this.isTyping = true;
    if (this.p1El) this.p1El.innerHTML = '<span class="typewriter-cursor">▋</span>';
    if (this.p2El) this.p2El.innerHTML = '';
    if (this.typingPrompt) this.typingPrompt.style.display = 'block';
    if (this.btnWrapper) {
      this.btnWrapper.style.display = 'none';
      this.btnWrapper.style.opacity = '0';
      this.btnWrapper.style.pointerEvents = 'none';
    }

    let charIdx = 0;
    const text1 = this.rawP1;
    const text2 = this.rawP2;

    const typeP1 = () => {
      this.typeTimer = setInterval(() => {
        if (!this.isTyping) {
          clearInterval(this.typeTimer);
          return;
        }

        if (charIdx < text1.length) {
          const currentSub = text1.substring(0, charIdx + 1);
          if (this.p1El) {
            this.p1El.innerHTML = this.escapeHtml(currentSub) + '<span class="typewriter-cursor">▋</span>';
          }
          if (charIdx % 3 === 0) {
            audioManager.playTypewriter();
          }
          charIdx++;
        } else {
          clearInterval(this.typeTimer);
          if (this.p1El) this.p1El.innerHTML = this.escapeHtml(text1);

          // Brief natural breath before typing paragraph 2
          this.typeTimer = setTimeout(() => {
            if (!this.isTyping) return;
            let charIdx2 = 0;
            if (this.p2El) this.p2El.innerHTML = '<span class="typewriter-cursor">▋</span>';

            this.typeTimer = setInterval(() => {
              if (!this.isTyping) {
                clearInterval(this.typeTimer);
                return;
              }

              if (charIdx2 < text2.length) {
                const currentSub2 = text2.substring(0, charIdx2 + 1);
                if (this.p2El) {
                  this.p2El.innerHTML = this.escapeHtml(currentSub2) + '<span class="typewriter-cursor">▋</span>';
                }
                if (charIdx2 % 3 === 0) {
                  audioManager.playTypewriter();
                }
                charIdx2++;
              } else {
                clearInterval(this.typeTimer);
                this.finishTyping();
              }
            }, 18);
          }, 240);
        }
      }, 18);
    };

    setTimeout(() => {
      if (this.isTyping) typeP1();
    }, 180);
  }

  finishTyping() {
    if (this.typeTimer) {
      clearInterval(this.typeTimer);
      clearTimeout(this.typeTimer);
      this.typeTimer = null;
    }
    this.isTyping = false;

    // Apply clean monochrome bold text (strictly NO COLORS)
    if (this.p1El) this.p1El.innerHTML = this.styledP1;
    if (this.p2El) this.p2El.innerHTML = this.styledP2;

    if (this.typingPrompt) {
      this.typingPrompt.style.display = 'none';
    }

    if (this.btnWrapper) {
      this.btnWrapper.style.display = 'flex';
      setTimeout(() => {
        this.btnWrapper.style.opacity = '1';
        this.btnWrapper.style.pointerEvents = 'auto';
      }, 20);
    }
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  diveIn() {
    if (this.isDone) return;
    this.isDone = true;
    this.finishTyping();

    // Unlock and start ambient audio smoothly
    audioManager.init();
    audioManager.playCoin();
    setTimeout(() => {
      if (!audioManager.currentMusicType) {
        audioManager.playMusic('ambient');
      }
    }, 350);

    if (this.overlay) {
      this.overlay.classList.add('fade-out');
      setTimeout(() => {
        this.overlay.style.display = 'none';
        gameState.introActive = false;
      }, 600);
    } else {
      gameState.introActive = false;
    }
  }
}
