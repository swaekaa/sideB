/**
 * NarrationScene.js
 * SIDE B: One Perfect Afternoon (1969)
 * Cinematic Narrator Introduction with Paced Passages, Typewriter Reveal & Audio Integration
 */

import { audioManager } from '../systems/AudioManager.js';
import { touchControls } from '../systems/TouchControls.js';

export class NarrationScene extends Phaser.Scene {
  constructor() {
    super('NarrationScene');

    // The 3 curated passages of the authentic 1969 opening story
    this.passages = [
      {
        page: 1,
        title: 'AUTUMN IN OAKWOOD',
        text: 'October, 1969.\n\nThe summer is over, the evenings are getting colder, and the neighborhood is beginning to settle into its autumn routine.'
      },
      {
        page: 2,
        title: 'THE RECORD SHOP',
        text: "But you've got other things on your mind.\n\nSomewhere in town, behind a dusty shop window, sits the record you've been dreaming about.\n\nLed Zeppelin II."
      },
      {
        page: 3,
        title: 'SAVINGS & CHORES',
        text: "Twenty-five dollars? Fifty? Sixty?\n\nWhatever it costs, it's more money than you've got.\n\nAnd Mom has just remembered a few things she needs done around the house."
      }
    ];

    this.currentPassageIndex = 0;
    this.isTyping = false;
    this.typeTimer = null;
    this.isExiting = false;
  }

  create() {
    this.currentPassageIndex = 0;
    this.isTyping = false;
    this.isExiting = false;

    touchControls.setVisible(false);
    this.cameras.main.setBackgroundColor('#08060a');
    this.cameras.main.fadeIn(500, 0, 0, 0);

    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const cx = w / 2;
    const cy = h / 2;

    // 1. Build darkened atmospheric theatre backdrop with 35mm grain
    this.buildBackdrop(w, h, cx, cy);

    // 2. Build elegant vintage narrator card
    this.buildNarratorCard(cx, cy);

    // 3. Setup user input controls (Space, Enter, E, Esc, Pointer)
    this.setupControls();

    // 4. Start the first narration passage
    this.showPassage(0);
  }

  // ==========================================
  // 1. THEATRE BACKDROP & FILM GRAIN
  // ==========================================

  buildBackdrop(w, h, cx, cy) {
    // Darkened twilight scrim
    this.add.rectangle(cx, cy, w, h, 0x09060c);

    // Soft warm radial glow in center
    const glow = this.add.ellipse(cx, cy - 10, 480, 240, 0x3d1820, 0.28);

    // Multi-ring vignette
    const vignetteGfx = this.add.graphics();
    const rings = 8;
    for (let i = 0; i < rings; i++) {
      const alpha = Math.pow((i + 1) / rings, 2) * 0.72;
      const insetX = (rings - i) * 16;
      const insetY = (rings - i) * 10;
      vignetteGfx.lineStyle(18, 0x040205, alpha);
      vignetteGfx.strokeRect(insetX, insetY, w - insetX * 2, h - insetY * 2);
    }
    vignetteGfx.fillStyle(0x040205, 0.95);
    vignetteGfx.fillRect(0, 0, w, 10);
    vignetteGfx.fillRect(0, h - 10, w, 10);
    vignetteGfx.fillRect(0, 0, 12, h);
    vignetteGfx.fillRect(w - 12, 0, 12, h);

    // 35mm Film Grain Sprite
    if (this.textures.exists('film_grain_tex')) {
      this.grainSprite = this.add.tileSprite(cx, cy, w, h, 'film_grain_tex');
      this.grainSprite.setAlpha(0.06);
      this.grainSprite.setBlendMode(Phaser.BlendModes.ADD);

      this.time.addEvent({
        delay: 80,
        loop: true,
        callback: () => {
          if (this.grainSprite) {
            this.grainSprite.tilePositionX = Phaser.Math.Between(0, 128);
            this.grainSprite.tilePositionY = Phaser.Math.Between(0, 128);
          }
        }
      });
    }
  }

  // ==========================================
  // 2. ORNATE VINTAGE NARRATOR CARD
  // ==========================================

  buildNarratorCard(cx, cy) {
    const cardW = 440;
    const cardH = 210;

    this.cardContainer = this.add.container(cx, cy);

    // Outer card drop-shadow
    this.cardContainer.add(this.add.rectangle(4, 4, cardW, cardH, 0x000000, 0.75));

    // Card background (Dark vintage velvet parchment)
    const cardBg = this.add.rectangle(0, 0, cardW, cardH, 0x120e16, 0.92);
    cardBg.setStrokeStyle(1.8, 0x7a5b28);
    this.cardContainer.add(cardBg);

    // Inner filigree inset border
    const innerBorder = this.add.rectangle(0, 0, cardW - 14, cardH - 14, 0x000000, 0);
    innerBorder.setStrokeStyle(1, 0x423218, 0.8);
    this.cardContainer.add(innerBorder);

    // Corner brass bracket decorations
    [
      [-cardW / 2 + 10, -cardH / 2 + 10],
      [cardW / 2 - 10, -cardH / 2 + 10],
      [-cardW / 2 + 10, cardH / 2 - 10],
      [cardW / 2 - 10, cardH / 2 - 10]
    ].forEach(([bx, by]) => {
      this.cardContainer.add(this.add.rectangle(bx, by, 4, 4, 0xd4a034, 0.85));
    });

    // HEADER: "★   N A R R A T O R   ★"
    const headerY = -cardH / 2 + 22;
    const headerRuleLeft = this.add.rectangle(-110, headerY, 55, 1, 0x946d24, 0.6);
    const headerRuleRight = this.add.rectangle(110, headerY, 55, 1, 0x946d24, 0.6);
    const headerText = this.add.text(0, headerY, '★   N A R R A T O R   ★', {
      fontFamily: "'Cinzel', Georgia, serif",
      fontSize: '11px',
      fontStyle: 'bold',
      letterSpacing: 3,
      color: '#e5be58',
      resolution: 3
    }).setOrigin(0.5);
    this.cardContainer.add([headerRuleLeft, headerRuleRight, headerText]);

    // Dialogue Body Text Container (Centered between header and footer with ample breathing space)
    this.bodyText = this.add.text(0, -6, '', {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: '11.5px',
      color: '#f6f0df',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: cardW - 54, useAdvancedWrap: true },
      resolution: 3
    }).setOrigin(0.5);
    this.cardContainer.add(this.bodyText);

    // Footer divider line
    const footerY = cardH / 2 - 24;
    this.cardContainer.add(this.add.rectangle(0, footerY - 10, cardW - 30, 1, 0x423218, 0.5));

    // Bottom Advance Prompt
    this.promptText = this.add.text(0, footerY + 2, 'SPACE / CLICK TO ADVANCE  •  ESC TO SKIP', {
      fontFamily: "'Cinzel', 'Courier Prime', monospace",
      fontSize: '8.5px',
      fontStyle: 'bold',
      letterSpacing: 1.5,
      color: '#c2a868',
      resolution: 3
    }).setOrigin(0.5);
    this.cardContainer.add(this.promptText);

    // Gentle pulse for prompt
    this.tweens.add({
      targets: this.promptText,
      alpha: { from: 0.5, to: 1.0 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  // ==========================================
  // 3. PASSAGE REVEAL & TYPEWRITER ENGINE
  // ==========================================

  showPassage(index) {
    if (index >= this.passages.length) {
      this.finishNarrationAndEnterGame();
      return;
    }

    this.currentPassageIndex = index;
    const passage = this.passages[index];

    if (this.promptText) {
      this.promptText.setText('SPACE / CLICK TO FAST-FORWARD  •  ESC TO SKIP');
    }

    // Clear any previous timer
    if (this.typeTimer) {
      this.typeTimer.remove();
      this.typeTimer = null;
    }

    this.isTyping = true;
    this.bodyText.setText('');
    const fullText = passage.text;
    let charIdx = 0;

    this.typeTimer = this.time.addEvent({
      delay: 20,
      repeat: fullText.length - 1,
      callback: () => {
        if (!this.isTyping) return;
        charIdx++;
        const currentSlice = fullText.substring(0, charIdx);
        this.bodyText.setText(currentSlice + ' ▋');

        // Play gentle typewriter mechanical click every few characters
        if (charIdx % 3 === 0) {
          audioManager.playTypewriter();
        }

        if (charIdx >= fullText.length) {
          this.finishCurrentPassageTyping();
        }
      }
    });
  }

  finishCurrentPassageTyping() {
    if (this.typeTimer) {
      this.typeTimer.remove();
      this.typeTimer = null;
    }
    this.isTyping = false;

    const passage = this.passages[this.currentPassageIndex];
    if (passage) {
      this.bodyText.setText(passage.text);
    }

    if (this.promptText) {
      const isLast = this.currentPassageIndex === this.passages.length - 1;
      this.promptText.setText(isLast ? 'SPACE / CLICK TO ENTER NEIGHBORHOOD ▶' : 'SPACE / CLICK TO ADVANCE ▶  •  ESC TO SKIP');
    }
  }

  // ==========================================
  // 4. USER INPUT CONTROLS
  // ==========================================

  setupControls() {
    // Fullscreen click handler
    const hitZone = this.add.zone(0, 0, this.cameras.main.width, this.cameras.main.height);
    hitZone.setOrigin(0, 0);
    hitZone.setInteractive({ useHandCursor: true });
    hitZone.on('pointerdown', () => this.handleUserAdvance());

    // Keyboard controls
    this.input.keyboard.on('keydown-SPACE', () => this.handleUserAdvance());
    this.input.keyboard.on('keydown-ENTER', () => this.handleUserAdvance());
    this.input.keyboard.on('keydown-E', () => this.handleUserAdvance());

    // Instant Skip Controls (ESC)
    this.input.keyboard.on('keydown-ESC', () => this.finishNarrationAndEnterGame());

    // Fullscreen toggle (F)
    const toggleFS = () => {
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
    this.input.keyboard.on('keydown-F', toggleFS);
  }

  handleUserAdvance() {
    audioManager.unlock();
    if (this.isExiting) return;

    if (this.isTyping) {
      // 1. If currently typing, clicking or pressing space instantly reveals text
      this.finishCurrentPassageTyping();
    } else {
      // 2. If text is already revealed, clicking or pressing space advances to next passage
      const nextIndex = this.currentPassageIndex + 1;
      if (nextIndex < this.passages.length) {
        // Subtle card transition tween
        this.tweens.add({
          targets: this.bodyText,
          alpha: { from: 0.2, to: 1.0 },
          duration: 220,
          ease: 'Sine.easeOut'
        });
        this.showPassage(nextIndex);
      } else {
        this.finishNarrationAndEnterGame();
      }
    }
  }

  // ==========================================
  // 5. TRANSITION TO GAMEPLAY
  // ==========================================

  finishNarrationAndEnterGame() {
    if (this.isExiting) return;
    this.isExiting = true;

    if (this.typeTimer) {
      this.typeTimer.remove();
      this.typeTimer = null;
    }

    // Play coin/success cue and transition smoothly to neighborhood ambient BGM
    audioManager.unlock();
    audioManager.playCoin();

    // Smoothly dissolve card and camera
    this.tweens.add({
      targets: this.cardContainer,
      alpha: 0,
      y: '-=10',
      duration: 500,
      ease: 'Cubic.easeIn'
    });

    this.cameras.main.fadeOut(550, 0, 0, 0);

    this.time.delayedCall(580, () => {
      // Start neighborhood ambient music
      audioManager.playMusic('ambient');

      this.scene.stop('NarrationScene');
      this.scene.start('NeighborhoodScene');
    });
  }
}
