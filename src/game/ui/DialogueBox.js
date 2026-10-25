/**
 * DialogueBox.js
 * Ultra-Crisp Floating Dialogue Interface for SIDE B (1969)
 * High-definition typography, ESC to quit, automatic completion, zero blur.
 */

import { audioManager } from '../systems/AudioManager.js';
import { AssetGenerator } from '../systems/AssetGenerator.js';

export class DialogueBox {
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;
    this.pages = [];
    this.currentPageIndex = 0;
    this.currentSpeaker = '';
    this.currentPortrait = '';
    this.choices = null;
    this.onComplete = null;
    this.onChoice = null;
    this.typewriterTimer = null;
    this.fullText = '';
    this.displayedText = '';
    this.isTyping = false;
    this.justOpened = false;

    this.initDOM();
    this.setupInputs();
  }

  initDOM() {
    this.el = document.getElementById('dialogue-overlay');
    this.portraitFrameEl = this.el ? this.el.querySelector('.dialogue-portrait-frame') : null;
    this.speakerEl = document.getElementById('diag-speaker');
    this.textEl = document.getElementById('diag-text');
    this.portraitEl = document.getElementById('diag-portrait');
    this.promptEl = document.getElementById('diag-prompt');
    this.choicesEl = document.getElementById('diag-choices');
  }

  setupInputs() {
    // Window-level keyboard listeners for dialogue
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      if (e.key === 'Escape' || e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        this.close();
        return;
      }

      if (e.key === ' ' || e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        e.preventDefault();
        this.handleAdvance();
        return;
      }

      if (this.choices && this.choices.length > 0) {
        if (e.key === '1') this.selectChoice(1);
        if (e.key === '2') this.selectChoice(2);
        if (e.key === '3') this.selectChoice(3);
      }
    });

    if (this.el) {
      this.el.addEventListener('click', (e) => {
        if (!this.isOpen || this.justOpened) return;
        if (this.choices && this.choices.length > 0) return;
        this.handleAdvance();
      });
    }
  }

  show(speakerName, portraitKey, pages, onComplete = null, choices = null, onChoice = null) {
    this.isOpen = true;
    this.currentSpeaker = speakerName;
    this.currentPortrait = portraitKey;
    this.pages = Array.isArray(pages) ? pages : [pages];
    this.currentPageIndex = 0;
    this.onComplete = onComplete;
    this.choices = choices;
    this.onChoice = onChoice;
    this.justOpened = true;

    if (this.speakerEl) this.speakerEl.textContent = speakerName;

    // Update Portrait
    const key = portraitKey || (speakerName === 'You' ? 'portrait_player' : null);
    if (this.portraitEl) {
      if (key && !this.scene.textures.exists(key)) {
        try {
          const gen = new AssetGenerator(this.scene);
          gen.createPortraits();
        } catch (e) {
          console.warn('Could not generate portrait on the fly:', e);
        }
      }

      if (key && this.scene.textures.exists(key)) {
        const texture = this.scene.textures.get(key);
        const sourceCanvas = texture.getSourceImage();
        this.portraitEl.width = 48;
        this.portraitEl.height = 48;
        const pctx = this.portraitEl.getContext('2d');
        pctx.imageSmoothingEnabled = false;
        pctx.clearRect(0, 0, 48, 48);
        pctx.drawImage(sourceCanvas, 0, 0, 48, 48);
        this.portraitEl.style.display = 'block';
        if (this.portraitFrameEl) this.portraitFrameEl.style.display = 'flex';
      } else {
        this.portraitEl.style.display = 'none';
        if (this.portraitFrameEl) this.portraitFrameEl.style.display = 'none';
      }
    }

    if (this.choicesEl) {
      this.choicesEl.style.display = 'none';
      this.choicesEl.innerHTML = '';
    }

    if (this.el) this.el.classList.add('visible');

    this.displayCurrentPage();

    setTimeout(() => {
      this.justOpened = false;
    }, 250);
  }

  displayCurrentPage() {
    if (this.currentPageIndex >= this.pages.length) {
      if (this.choices && this.choices.length > 0) {
        this.displayChoices();
      } else {
        this.close();
      }
      return;
    }

    this.fullText = this.pages[this.currentPageIndex];
    this.displayedText = '';
    this.isTyping = true;
    if (this.textEl) this.textEl.textContent = '';

    if (this.promptEl) {
      if (this.currentPageIndex === this.pages.length - 1 && this.choices) {
        this.promptEl.textContent = 'Press 1, 2, or 3  [F to Cancel]';
      } else {
        this.promptEl.textContent = '[SPACE / E to Continue ▼]  [F to Exit]';
      }
    }

    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
    }

    let charIdx = 0;
    const speakerId = this.currentSpeaker.toLowerCase();
    this.typewriterTimer = setInterval(() => {
      if (charIdx < this.fullText.length) {
        this.displayedText += this.fullText[charIdx];
        if (this.textEl) this.textEl.textContent = this.displayedText;
        if (charIdx % 3 === 0 && this.fullText[charIdx] !== ' ') {
          audioManager.playTalk(speakerId);
        }
        charIdx++;
      } else {
        this.finishTyping();
      }
    }, 18);
  }

  finishTyping() {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
    this.displayedText = this.fullText;
    if (this.textEl) this.textEl.textContent = this.fullText;
    this.isTyping = false;

    if (this.currentPageIndex === this.pages.length - 1 && this.choices) {
      this.displayChoices();
    }
  }

  displayChoices() {
    if (!this.choicesEl) return;
    this.choicesEl.innerHTML = '';
    this.choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.type = 'button';
      btn.textContent = `[${idx + 1}]  ${choice}`;
      const choiceIdx = idx + 1;
      btn.onclick = () => this.selectChoice(choiceIdx);
      this.choicesEl.appendChild(btn);
    });
    this.choicesEl.style.display = 'flex';
  }

  selectChoice(index) {
    if (!this.isOpen || !this.choices) return;
    if (index >= 1 && index <= this.choices.length) {
      audioManager.playTalk('player');
      const callback = this.onChoice;
      this.close();
      if (callback) {
        callback(index);
      }
    }
  }

  handleAdvance() {
    if (!this.isOpen || this.justOpened) return;

    if (this.isTyping) {
      this.finishTyping();
      return;
    }

    if (this.choices && this.currentPageIndex >= this.pages.length - 1) {
      return;
    }

    this.currentPageIndex++;
    if (this.currentPageIndex < this.pages.length) {
      this.displayCurrentPage();
    } else {
      this.close();
    }
  }

  close() {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
    this.isOpen = false;
    if (this.el) this.el.classList.remove('visible');

    // Trigger completion callback
    const cb = this.onComplete;
    this.onComplete = null;
    this.choices = null;
    this.onChoice = null;

    if (cb) {
      cb();
    }

    // Inform scene of cooldown so pressing SPACE never loops
    if (this.scene && this.scene.onDialogueClosed) {
      this.scene.onDialogueClosed();
    }
  }
}
