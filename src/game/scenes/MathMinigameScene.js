/**
 * MathMinigameScene.js
 * Timmy's Quick Math Challenge for SIDE B (512x288 Viewport)
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';

export class MathMinigameScene extends Phaser.Scene {
  constructor() {
    super('MathMinigameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1c2419');

    const cx = this.cameras.main.width / 2;
    const cy = this.cameras.main.height / 2;
    const cardW = 320;
    const cardH = 175;

    // Card shadow & background
    this.add.rectangle(cx + 4, cy + 4, cardW, cardH, 0x111610, 0.75);
    const card = this.add.rectangle(cx, cy, cardW, cardH, 0xf6f1de);
    card.setStrokeStyle(3, 0x273824);

    // Title bar
    this.add.rectangle(cx, cy - 68, cardW - 8, 24, 0x273824);
    this.add.text(cx, cy - 68, "TIMMY'S MATH BET (1969)", {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#f6f1de',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Question
    this.add.text(cx, cy - 40, '"What is 7 x 3?"', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#1a2618',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.options = [
      { num: 1, label: '1)  18', isCorrect: false },
      { num: 2, label: '2)  21', isCorrect: true },
      { num: 3, label: '3)  24', isCorrect: false }
    ];

    this.buttons = [];
    this.answered = false;

    this.options.forEach((opt, idx) => {
      const oy = cy - 8 + idx * 26;
      const btnBg = this.add.rectangle(cx, oy, 230, 22, 0xe8dfc5);
      btnBg.setStrokeStyle(1.5, 0x2b3d2a);
      btnBg.setInteractive({ useHandCursor: true });

      const btnText = this.add.text(cx - 95, oy - 6, opt.label, {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#1c2619',
        fontStyle: 'bold'
      });

      btnBg.on('pointerover', () => {
        if (!this.answered) btnBg.setFillStyle(0xdfd3b0);
      });
      btnBg.on('pointerout', () => {
        if (!this.answered) btnBg.setFillStyle(0xe8dfc5);
      });
      btnBg.on('pointerdown', () => this.handleAnswer(opt));

      this.buttons.push({ bg: btnBg, text: btnText, opt: opt });
    });

    this.feedbackText = this.add.text(cx, cy + 68, 'Press 1, 2, or 3 on your keyboard', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#465c41'
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-ONE', () => this.handleAnswer(this.options[0]));
    this.input.keyboard.on('keydown-TWO', () => this.handleAnswer(this.options[1]));
    this.input.keyboard.on('keydown-THREE', () => this.handleAnswer(this.options[2]));
  }

  handleAnswer(opt) {
    if (this.answered) return;
    this.answered = true;

    if (opt.isCorrect) {
      audioManager.playSuccess();
      audioManager.playCoin();
      gameState.addCash(2);
      gameState.setQuest('mathDone', true);
      gameState.advanceTime(5);

      this.feedbackText.setText('CORRECT! Timmy: "Awesome, here\'s your $2.00!"');
      this.feedbackText.setColor('#236e29');
    } else {
      audioManager.playError();
      gameState.advanceTime(5);
      this.feedbackText.setText('Timmy: "Aw shucks, 7 x 3 is 21! Good try though!"');
      this.feedbackText.setColor('#a83626');
    }

    this.time.delayedCall(1700, () => {
      this.scene.stop('MathMinigameScene');
      this.scene.resume('NeighborhoodScene');
    });
  }
}
