/**
 * RecordShopScene.js
 * Mr. Vinyl's Record Shop Interior & Midnight Radio Purchase for SIDE B
 */

import { gameState } from '../systems/GameState.js';
import { audioManager } from '../systems/AudioManager.js';
import { DialogueBox } from '../ui/DialogueBox.js';

export class RecordShopScene extends Phaser.Scene {
  constructor() {
    super('RecordShopScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#231a26');

    const cx = 384 / 2;
    const cy = 216 / 2;

    // Interior Shop Wall (Warm brick & wood paneling)
    const wall = this.add.rectangle(cx, 80, 384, 160, 0x824734);
    // Dark floor
    const floor = this.add.rectangle(cx, 185, 384, 70, 0x3d281a);

    // Shelves of Vinyl Records on back wall
    for (let row = 0; row < 2; row++) {
      const sy = 32 + row * 38;
      // Wooden shelf plank
      this.add.rectangle(cx - 70, sy + 18, 160, 6, 0x4d311d);
      // Record sleeves in shelf
      for (let i = 0; i < 9; i++) {
        const col = (i % 3 === 0) ? 0xd6533c : (i % 3 === 1) ? 0x487994 : 0xdeb84b;
        this.add.rectangle(cx - 138 + i * 17, sy + 8, 14, 16, col);
      }
    }

    // Vintage Neon "RECORDS" Sign on Wall
    const signBg = this.add.rectangle(cx - 70, 16, 90, 18, 0x1f3624);
    signBg.setStrokeStyle(2, 0xd4a037);
    this.add.text(cx - 70, 16, 'RECORDS', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#f3c74c',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Turntable on shelf
    this.add.circle(cx + 8, 90, 10, 0x222222);
    this.add.circle(cx + 8, 90, 4, 0xc74a38);

    // Featured Showcase: Midnight Radio Display Case
    const showcaseX = cx + 115;
    const showcaseY = 68;
    this.add.rectangle(showcaseX + 2, showcaseY + 2, 88, 108, 0x111612, 0.6);
    const caseBg = this.add.rectangle(showcaseX, showcaseY, 88, 108, 0xf6eedb);
    caseBg.setStrokeStyle(2, 0x273824);

    this.add.text(showcaseX, showcaseY - 44, 'FEATURED LP', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#9c3629',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Album cover image
    const albumImg = this.add.image(showcaseX, showcaseY - 8, 'album_midnight_radio');
    albumImg.setDisplaySize(54, 54);

    this.add.text(showcaseX, showcaseY + 26, 'MIDNIGHT RADIO', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#1a2618',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.priceBadge = this.add.rectangle(showcaseX, showcaseY + 41, 46, 14, 0x315436);
    this.priceText = this.add.text(showcaseX, showcaseY + 41, '$25.00', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Mr. Vinyl's Wooden Store Counter
    const counterY = 142;
    this.add.rectangle(cx - 30, counterY + 10, 230, 42, 0x5e3a20);
    this.add.rectangle(cx - 30, counterY - 9, 234, 6, 0x8a552e); // counter top

    // Mr. Vinyl behind the counter
    const clerk = this.add.image(cx - 30, counterY - 26, 'npc_mr_vinyl');
    clerk.setDisplaySize(32, 48);

    // Dialogue Box
    this.dialogueBox = new DialogueBox(this);

    // In-game HUD in shop: Cash display & Exit prompt
    this.cashDisplay = this.add.text(12, 10, `YOUR CASH: $${gameState.state.cash}`, {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#f6eedb',
      backgroundColor: '#233822',
      padding: { x: 6, y: 4 }
    });

    // Exit Button
    const exitBtn = this.add.text(12, 192, '[ ESC / E - STEP OUTSIDE ]', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#f6eedb',
      backgroundColor: '#7d382d',
      padding: { x: 6, y: 4 }
    });
    exitBtn.setInteractive({ useHandCursor: true });
    exitBtn.on('pointerdown', () => this.exitShop());

    this.input.keyboard.on('keydown-ESC', () => this.exitShop());

    // Trigger dialogue with Mr. Vinyl
    this.time.delayedCall(300, () => this.talkToMrVinyl());
  }

  talkToMrVinyl() {
    const cash = gameState.state.cash;
    const bought = gameState.state.quests.albumBought;

    if (bought) {
      this.dialogueBox.show(
        'Mr. Vinyl',
        'portrait_vinyl',
        [
          'Hey kid! You already got Midnight Radio safe in your bag!',
          'Head on home to your bedroom before dinnertime and spin that record on your turntable!'
        ],
        () => {}
      );
      return;
    }

    if (cash >= 25) {
      this.dialogueBox.show(
        'Mr. Vinyl',
        'portrait_vinyl',
        [
          'Well look at that! You scraped together twenty-five dollars on a Saturday afternoon!',
          'Midnight Radio is right here. Ready to make it yours?'
        ],
        null,
        ['Buy Midnight Radio for $25!', 'Maybe later'],
        (choice) => {
          if (choice === 1) {
            this.buyAlbum();
          } else {
            this.dialogueBox.show(
              'Mr. Vinyl',
              'portrait_vinyl',
              ['No rush kid. It\'s not going anywhere.'],
              () => {}
            );
          }
        }
      );
    } else {
      const needed = 25 - cash;
      this.dialogueBox.show(
        'Mr. Vinyl',
        'portrait_vinyl',
        [
          'Midnight Radio. Twenty-five dollars. Good taste, kid.',
          `You've got $${cash} right now. You need $${needed} more to buy it.`,
          'Check around the neighborhood! Your mom, Mrs. Miller, or friends at the park might have chores or favors.'
        ],
        () => {}
      );
    }
  }

  buyAlbum() {
    if (gameState.deductCash(25)) {
      audioManager.playCoin();
      audioManager.playSuccess();
      gameState.setQuest('albumBought', true);
      gameState.addItem('Midnight Radio LP');
      gameState.advanceTime(10);

      this.cashDisplay.setText(`YOUR CASH: $${gameState.state.cash}`);
      this.priceBadge.setFillStyle(0x752e25);
      this.priceText.setText('SOLD!');

      this.dialogueBox.show(
        'Mr. Vinyl',
        'portrait_vinyl',
        [
          '★ CONGRATULATIONS! Midnight Radio is yours! ★',
          'Slip it into the sleeve carefully. Now head home to your room and drop the needle!'
        ],
        () => {}
      );
    }
  }

  exitShop() {
    if (this.dialogueBox.isOpen) {
      this.dialogueBox.close();
      return;
    }
    this.scene.stop('RecordShopScene');
    this.scene.resume('NeighborhoodScene');
  }
}
