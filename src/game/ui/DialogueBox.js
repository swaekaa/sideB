/**
 * DialogueBox.js
 * Retro 1970s Printed Dialogue Interface for SIDE B
 */

import { audioManager } from '../systems/AudioManager.js';

export class DialogueBox {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
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

    this.create();
  }

  create() {
    // Coordinate layout inside 384 x 216 viewport
    // Box dimensions: 352 wide, 68 high, positioned at bottom (x: 16, y: 136)
    const x = 16;
    const y = 138;
    const width = 352;
    const height = 66;

    this.container = this.scene.add.container(x, y);
    this.container.setScrollFactor(0);
    this.container.setDepth(1000);
    this.container.setVisible(false);

    // Box Background Shadow
    const shadow = this.scene.add.rectangle(3, 3, width, height, 0x182417, 0.7);
    shadow.setOrigin(0, 0);

    // Box Background (Warm Parchment)
    const bg = this.scene.add.rectangle(0, 0, width, height, 0xf6f1de);
    bg.setOrigin(0, 0);
    bg.setStrokeStyle(2, 0x243322);

    // Inner subtle border
    const innerBorder = this.scene.add.rectangle(2, 2, width - 4, height - 4);
    innerBorder.setOrigin(0, 0);
    innerBorder.setStrokeStyle(1, 0xded2b0);

    // Portrait Frame (34x34)
    this.portraitBg = this.scene.add.rectangle(6, 6, 36, 54, 0xebd9b7);
    this.portraitBg.setOrigin(0, 0);
    this.portraitBg.setStrokeStyle(1, 0x243322);

    // Portrait Sprite
    this.portraitSprite = this.scene.add.image(24, 33, 'portrait_mom');
    this.portraitSprite.setDisplaySize(32, 32);

    // Speaker Name Tag Box
    this.speakerBg = this.scene.add.rectangle(48, 6, 120, 16, 0x2b3d2a);
    this.speakerBg.setOrigin(0, 0);

    this.speakerText = this.scene.add.text(52, 8, 'Mom', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#f6f1de',
      fontStyle: 'bold'
    });

    // Dialogue Body Text
    this.bodyText = this.scene.add.text(48, 26, '', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#1a2318',
      wordWrap: { width: 290, useAdvancedWrap: true },
      lineSpacing: 3
    });

    // Prompt Indicator (Arrow / instruction)
    this.indicator = this.scene.add.text(width - 44, height - 12, '[SPACE ▼]', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#a64232',
      fontStyle: 'bold'
    });

    // Choice container
    this.choiceTexts = [];
    for (let i = 0; i < 3; i++) {
      const cText = this.scene.add.text(48, 28 + i * 12, '', {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#263b25',
        fontStyle: 'bold'
      });
      cText.setVisible(false);
      cText.setInteractive({ useHandCursor: true });
      const choiceIdx = i + 1;
      cText.on('pointerdown', () => {
        if (this.isOpen && this.choices) {
          this.selectChoice(choiceIdx);
        }
      });
      this.choiceTexts.push(cText);
    }

    this.container.add([
      shadow, bg, innerBorder,
      this.portraitBg, this.portraitSprite,
      this.speakerBg, this.speakerText,
      this.bodyText, this.indicator,
      ...this.choiceTexts
    ]);

    // Blinking cursor tween
    this.scene.tweens.add({
      targets: this.indicator,
      alpha: 0.2,
      duration: 400,
      yoyo: true,
      repeat: -1
    });

    // Keyboard controls
    this.setupInputs();
  }

  setupInputs() {
    this.scene.input.keyboard.on('keydown-SPACE', (e) => this.handleAdvance(e));
    this.scene.input.keyboard.on('keydown-E', (e) => this.handleAdvance(e));
    this.scene.input.keyboard.on('keydown-ONE', () => this.selectChoice(1));
    this.scene.input.keyboard.on('keydown-TWO', () => this.selectChoice(2));
    this.scene.input.keyboard.on('keydown-THREE', () => this.selectChoice(3));
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

    // Reset choices display
    this.choiceTexts.forEach(ct => ct.setVisible(false));
    this.bodyText.setVisible(true);

    // Setup visual components
    this.speakerText.setText(speakerName);
    this.speakerBg.setSize(Math.max(60, speakerName.length * 8 + 12), 16);

    if (portraitKey && this.scene.textures.exists(portraitKey)) {
      this.portraitSprite.setTexture(portraitKey);
      this.portraitBg.setVisible(true);
      this.portraitSprite.setVisible(true);
      this.bodyText.setX(48);
      this.bodyText.style.wordWrapWidth = 290;
    } else {
      this.portraitBg.setVisible(false);
      this.portraitSprite.setVisible(false);
      this.bodyText.setX(14);
      this.bodyText.style.wordWrapWidth = 324;
    }

    this.container.setVisible(true);
    this.displayCurrentPage();

    // Prevent immediate advance on same frame
    setTimeout(() => {
      this.justOpened = false;
    }, 200);
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
    this.bodyText.setText('');
    this.choiceTexts.forEach(c => c.setVisible(false));
    this.bodyText.setVisible(true);

    if (this.currentPageIndex === this.pages.length - 1 && this.choices) {
      this.indicator.setText('[CHOICE]');
    } else {
      this.indicator.setText('[SPACE ▼]');
    }

    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
    }

    let charIdx = 0;
    const speakerId = this.currentSpeaker.toLowerCase();
    this.typewriterTimer = setInterval(() => {
      if (charIdx < this.fullText.length) {
        this.displayedText += this.fullText[charIdx];
        this.bodyText.setText(this.displayedText);
        if (charIdx % 3 === 0 && this.fullText[charIdx] !== ' ') {
          audioManager.playTalk(speakerId);
        }
        charIdx++;
      } else {
        this.finishTyping();
      }
    }, 22);
  }

  finishTyping() {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
    this.displayedText = this.fullText;
    this.bodyText.setText(this.fullText);
    this.isTyping = false;

    if (this.currentPageIndex === this.pages.length - 1 && this.choices) {
      this.displayChoices();
    }
  }

  displayChoices() {
    this.bodyText.setVisible(false);
    this.choices.forEach((choice, idx) => {
      if (idx < this.choiceTexts.length) {
        this.choiceTexts[idx].setText(`[${idx + 1}] ${choice}`);
        this.choiceTexts[idx].setVisible(true);
      }
    });
    this.indicator.setText('Press 1, 2, or 3');
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

  handleAdvance(e) {
    if (!this.isOpen || this.justOpened) return;

    if (this.isTyping) {
      // Instant reveal
      this.finishTyping();
      return;
    }

    if (this.choices && this.currentPageIndex >= this.pages.length - 1) {
      // Choice is active, require number key or click
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
    this.container.setVisible(false);
    const cb = this.onComplete;
    this.onComplete = null;
    this.choices = null;
    this.onChoice = null;

    if (cb) {
      cb();
    }
  }
}
