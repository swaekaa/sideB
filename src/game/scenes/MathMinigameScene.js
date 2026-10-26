/**
 * MathMinigameScene.js
 * Timmy's 5-Question 1969 Math Challenge for SIDE B (512x288 Viewport)
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';

export class MathMinigameScene extends Phaser.Scene {
  constructor() {
    super('MathMinigameScene');

    // 5 Thematic 1969 & Elementary Math Questions
    this.questions = [
      {
        prompt: '"What is 7 x 3?"',
        options: [
          { label: '1)  18', isCorrect: false },
          { label: '2)  21', isCorrect: true },
          { label: '3)  24', isCorrect: false }
        ]
      },
      {
        prompt: '"An LP costs $25 and you have $4. How much more do you need?"',
        options: [
          { label: '1)  $21', isCorrect: true },
          { label: '2)  $19', isCorrect: false },
          { label: '3)  $23', isCorrect: false }
        ]
      },
      {
        prompt: '"What is 144 ÷ 12?"',
        options: [
          { label: '1)  14', isCorrect: false },
          { label: '2)  16', isCorrect: false },
          { label: '3)  12', isCorrect: true }
        ]
      },
      {
        prompt: '"A 45 RPM vinyl spins 45 times a min. How many in 2 mins?"',
        options: [
          { label: '1)  80', isCorrect: false },
          { label: '2)  90', isCorrect: true },
          { label: '3)  100', isCorrect: false }
        ]
      },
      {
        prompt: '"What is 8 x 6 - 8?"',
        options: [
          { label: '1)  40', isCorrect: true },
          { label: '2)  36', isCorrect: false },
          { label: '3)  48', isCorrect: false }
        ]
      }
    ];
  }

  create() {
    this.cameras.main.setBackgroundColor('#1c2419');

    const cx = this.cameras.main.width / 2;
    const cy = this.cameras.main.height / 2;
    const cardW = 340;
    const cardH = 190;

    this.currentIndex = 0;
    this.score = 0;
    this.isAnswering = false;

    // Card shadow & background (Parchment & Forest theme)
    this.add.rectangle(cx + 4, cy + 4, cardW, cardH, 0x111610, 0.75);
    const card = this.add.rectangle(cx, cy, cardW, cardH, 0xf6f1de);
    card.setStrokeStyle(3, 0x273824);

    // Title bar
    this.add.rectangle(cx, cy - 75, cardW - 8, 22, 0x273824);
    this.titleText = this.add.text(cx, cy - 75, "TIMMY'S 5-QUESTION MATH BET (1969)", {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#f6f1de',
      fontStyle: 'bold',
      resolution: 3
    }).setOrigin(0.5);

    // Progress pill / Score
    this.progressText = this.add.text(cx, cy - 54, 'QUESTION 1 OF 5  •  SCORE: 0', {
      fontFamily: 'monospace',
      fontSize: '8.5px',
      color: '#6d4c41',
      fontStyle: 'bold',
      resolution: 3
    }).setOrigin(0.5);

    // Question Prompt
    this.questionText = this.add.text(cx, cy - 30, '', {
      fontFamily: 'monospace',
      fontSize: '10.5px',
      color: '#1a2618',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 300, useAdvancedWrap: true },
      resolution: 3
    }).setOrigin(0.5);

    // Option Buttons
    this.buttons = [];
    for (let i = 0; i < 3; i++) {
      const oy = cy + 2 + i * 26;
      const btnBg = this.add.rectangle(cx, oy, 250, 21, 0xe8dfc5);
      btnBg.setStrokeStyle(1.5, 0x2b3d2a);
      btnBg.setInteractive({ useHandCursor: true });

      const btnText = this.add.text(cx - 105, oy, '', {
        fontFamily: 'monospace',
        fontSize: '9.5px',
        color: '#1c2619',
        fontStyle: 'bold',
        resolution: 3
      }).setOrigin(0, 0.5);

      btnBg.on('pointerover', () => {
        if (this.isAnswering) btnBg.setFillStyle(0xdfd3b0);
      });
      btnBg.on('pointerout', () => {
        if (this.isAnswering) btnBg.setFillStyle(0xe8dfc5);
      });
      btnBg.on('pointerdown', () => {
        if (this.isAnswering) this.handleAnswer(i);
      });

      this.buttons.push({ bg: btnBg, text: btnText });
    }

    // Feedback & Instruction Text
    this.feedbackText = this.add.text(cx, cy + 76, 'Press 1, 2, or 3 on your keyboard or click', {
      fontFamily: 'monospace',
      fontSize: '8.5px',
      color: '#465c41',
      resolution: 3
    }).setOrigin(0.5);

    // Keyboard controls
    this.input.keyboard.on('keydown-ONE', () => this.handleAnswer(0));
    this.input.keyboard.on('keydown-TWO', () => this.handleAnswer(1));
    this.input.keyboard.on('keydown-THREE', () => this.handleAnswer(2));
    this.input.keyboard.on('keydown-NUMPAD_ONE', () => this.handleAnswer(0));
    this.input.keyboard.on('keydown-NUMPAD_TWO', () => this.handleAnswer(1));
    this.input.keyboard.on('keydown-NUMPAD_THREE', () => this.handleAnswer(2));

    // Load first question
    this.loadQuestion();
  }

  loadQuestion() {
    const q = this.questions[this.currentIndex];
    this.currentQuestion = q;
    this.isAnswering = true;

    this.progressText.setText(`QUESTION ${this.currentIndex + 1} OF ${this.questions.length}  •  SCORE: ${this.score}`);
    this.progressText.setColor('#6d4c41');
    this.questionText.setText(q.prompt);
    this.feedbackText.setText('Press 1, 2, or 3 on your keyboard or click');
    this.feedbackText.setColor('#465c41');

    this.buttons.forEach((btn, idx) => {
      btn.bg.setVisible(true);
      btn.text.setVisible(true);
      btn.bg.setFillStyle(0xe8dfc5);
      btn.bg.setStrokeStyle(1.5, 0x2b3d2a);
      btn.text.setText(q.options[idx].label);
      btn.text.setColor('#1c2619');
    });
  }

  handleAnswer(optIndex) {
    if (!this.isAnswering) return;
    this.isAnswering = false;

    const q = this.currentQuestion;
    const chosen = q.options[optIndex];
    const chosenBtn = this.buttons[optIndex];

    if (chosen.isCorrect) {
      this.score++;
      audioManager.playSuccess();
      chosenBtn.bg.setFillStyle(0xc8e6c9);
      chosenBtn.bg.setStrokeStyle(2, 0x2e7d32);
      chosenBtn.text.setColor('#1b5e20');

      this.progressText.setText(`QUESTION ${this.currentIndex + 1} OF ${this.questions.length}  •  SCORE: ${this.score}`);
      this.feedbackText.setText('★ CORRECT! (+1 Point) ★');
      this.feedbackText.setColor('#236e29');
    } else {
      audioManager.playError();
      chosenBtn.bg.setFillStyle(0xffcdd2);
      chosenBtn.bg.setStrokeStyle(2, 0xc62828);
      chosenBtn.text.setColor('#b71c1c');

      // Highlight the correct option
      const correctIdx = q.options.findIndex(o => o.isCorrect);
      if (correctIdx >= 0) {
        this.buttons[correctIdx].bg.setFillStyle(0xe8f5e9);
        this.buttons[correctIdx].bg.setStrokeStyle(2, 0x388e3c);
      }

      this.feedbackText.setText(`INCORRECT! Right answer was: ${q.options[correctIdx].label.replace(/^\d\)\s*/, '')}`);
      this.feedbackText.setColor('#a83626');
    }

    const delay = chosen.isCorrect ? 850 : 1200;
    this.time.delayedCall(delay, () => {
      this.currentIndex++;
      if (this.currentIndex < this.questions.length) {
        this.loadQuestion();
      } else {
        this.showResults();
      }
    });
  }

  showResults() {
    this.isAnswering = false;

    // Hide question UI elements cleanly to avoid any overlapping
    this.progressText.setVisible(false);
    this.questionText.setVisible(false);
    this.feedbackText.setVisible(false);
    this.buttons.forEach(btn => {
      btn.bg.setVisible(false);
      btn.text.setVisible(false);
    });

    const cx = this.cameras.main.width / 2;
    const cy = this.cameras.main.height / 2;
    const passed = this.score >= 3;
    const perfect = this.score === 5;

    // 1. Result Status Badge (Pill)
    const outcomeBg = this.add.rectangle(cx, cy - 48, 250, 20, passed ? 0x275a28 : 0x8b2020);
    outcomeBg.setStrokeStyle(1.5, passed ? 0x183b1a : 0x5a1212);

    const outcomeTextStr = perfect
      ? '★ PERFECT SCORE: 5 / 5! ★'
      : passed
      ? `★ YOU WON THE BET: ${this.score} / 5! ★`
      : `CHALLENGE FAILED: ${this.score} / 5`;

    this.add.text(cx, cy - 48, outcomeTextStr, {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#f6f1de',
      fontStyle: 'bold',
      resolution: 3
    }).setOrigin(0.5);

    // 2. Timmy's Dialogue Box
    this.add.rectangle(cx, cy - 8, 290, 44, 0xebe3cb).setStrokeStyle(1.5, 0x3d4f3b);

    let quote = '';
    if (perfect) {
      quote = 'Timmy: "Holy smokes, you got all 5 right!\nMy brother won\'t believe this! Here\'s the $2.00!"';
    } else if (passed) {
      quote = 'Timmy: "Awesome job! We passed the challenge!\nHere is your $2.00 as promised!"';
    } else {
      quote = 'Timmy: "Aw shucks, we needed at least 3 right!\nLet\'s study up and try again in a bit!"';
    }

    this.add.text(cx, cy - 8, quote, {
      fontFamily: 'monospace',
      fontSize: '9.5px',
      color: '#1c2619',
      fontStyle: 'bold',
      align: 'center',
      lineSpacing: 4,
      resolution: 3
    }).setOrigin(0.5);

    // 3. Reward / Outcome Badge
    if (passed) {
      audioManager.playSuccess();
      audioManager.playCoin();
      gameState.addCash(2);
      gameState.setQuest('mathDone', true);
      gameState.advanceTime(5);

      const rewardBg = this.add.rectangle(cx, cy + 28, 260, 18, 0xd8ebd3);
      rewardBg.setStrokeStyle(1, 0x2e7d32);

      this.add.text(cx, cy + 28, '★ REWARD EARNED: +$2.00 CASH! ★', {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#1b5e20',
        fontStyle: 'bold',
        resolution: 3
      }).setOrigin(0.5);
    } else {
      gameState.advanceTime(5);

      const rewardBg = this.add.rectangle(cx, cy + 28, 260, 18, 0xffebee);
      rewardBg.setStrokeStyle(1, 0xc62828);

      this.add.text(cx, cy + 28, 'NEED 3 / 5 TO WIN • TALK TO TIMMY TO RETRY', {
        fontFamily: 'monospace',
        fontSize: '8.5px',
        color: '#b71c1c',
        fontStyle: 'bold',
        resolution: 3
      }).setOrigin(0.5);
    }

    // 4. Continue Button (Interactive & Keyboard Hookup)
    const btn = this.add.rectangle(cx, cy + 58, 210, 22, 0x273824);
    btn.setStrokeStyle(1.5, 0x1b2819);
    btn.setInteractive({ useHandCursor: true });

    const btnText = this.add.text(cx, cy + 58, 'CONTINUE  [SPACE / CLICK]', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#f6f1de',
      fontStyle: 'bold',
      resolution: 3
    }).setOrigin(0.5);

    btn.on('pointerover', () => {
      btn.setFillStyle(0x3a5436);
      btnText.setColor('#ffffff');
    });
    btn.on('pointerout', () => {
      btn.setFillStyle(0x273824);
      btnText.setColor('#f6f1de');
    });

    let closed = false;
    const finish = () => {
      if (closed) return;
      closed = true;
      this.scene.stop('MathMinigameScene');
      this.scene.resume('NeighborhoodScene');
    };

    btn.on('pointerdown', finish);

    this.input.keyboard.once('keydown-SPACE', finish);
    this.input.keyboard.once('keydown-ENTER', finish);
    this.input.keyboard.once('keydown-E', finish);
    this.input.keyboard.once('keydown-ESC', finish);

    // Auto-advance fallback after 6 seconds if player doesn't press anything
    this.time.delayedCall(6000, finish);
  }
}
