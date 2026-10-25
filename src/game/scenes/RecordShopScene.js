/**
 * RecordShopScene.js
 * Mr. Vinyl's Record Shop Interior & Led Zeppelin II Purchase (1969 Edition)
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

    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const cx = w / 2;
    const cy = h / 2;

    // Brick & Wood Wall
    this.add.rectangle(cx, h * 0.35, w, h * 0.7, 0x824734);
    // Dark Wood Floor
    this.add.rectangle(cx, h * 0.85, w, h * 0.3, 0x3d281a);

    // Shelves of Vinyl Records on back wall
    for (let row = 0; row < 2; row++) {
      const sy = 40 + row * 46;
      this.add.rectangle(cx - 90, sy + 22, 220, 7, 0x4d311d);
      for (let i = 0; i < 12; i++) {
        const col = (i % 3 === 0) ? 0xd6533c : (i % 3 === 1) ? 0x487994 : 0xdeb84b;
        this.add.rectangle(cx - 185 + i * 17, sy + 10, 14, 18, col);
      }
    }

    // Vintage Neon "RECORDS" Sign on Wall
    const signBg = this.add.rectangle(cx - 90, 20, 110, 20, 0x1f3624);
    signBg.setStrokeStyle(2, 0xd4a037);
    this.add.text(cx - 90, 20, 'RECORDS • 1969', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#f3c74c',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Turntable on shelf
    this.add.circle(cx + 12, 110, 12, 0x222222);
    this.add.circle(cx + 12, 110, 5, 0xc74a38);

    // Featured Showcase: Led Zeppelin II Display Case
    const showcaseX = cx + 155;
    const showcaseY = 90;
    this.add.rectangle(showcaseX + 3, showcaseY + 3, 110, 136, 0x111612, 0.6);
    const caseBg = this.add.rectangle(showcaseX, showcaseY, 110, 136, 0xf6eedb);
    caseBg.setStrokeStyle(2.5, 0x273824);

    this.add.text(showcaseX, showcaseY - 54, 'FEATURED LP', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#9c3629',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Album cover image (Led Zeppelin II)
    const albumImg = this.add.image(showcaseX, showcaseY - 12, 'album_led_zeppelin_ii');
    albumImg.setDisplaySize(68, 68);

    this.add.text(showcaseX, showcaseY + 30, 'LED ZEPPELIN II', {
      fontFamily: 'monospace',
      fontSize: '8.5px',
      color: '#1a2618',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.priceBadge = this.add.rectangle(showcaseX, showcaseY + 48, 54, 16, 0x315436);
    this.priceText = this.add.text(showcaseX, showcaseY + 48, '$25.00', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Mr. Vinyl's Wooden Store Counter
    const counterY = 186;
    this.add.rectangle(cx - 40, counterY + 12, 290, 48, 0x5e3a20);
    this.add.rectangle(cx - 40, counterY - 11, 296, 7, 0x8a552e);

    // Mr. Vinyl behind the counter
    const clerk = this.add.image(cx - 40, counterY - 30, 'npc_mr_vinyl');
    clerk.setDisplaySize(32, 48);

    // Dialogue Box
    this.dialogueBox = new DialogueBox(this);

    // Top status indicator in shop
    this.cashDisplay = this.add.text(16, 12, `YOUR SAVINGS: $${gameState.state.cash}`, {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#f6eedb',
      backgroundColor: '#233822',
      padding: { x: 8, y: 5 }
    });

    // Exit Button
    const exitBtn = this.add.text(16, 256, '[ ESC / E - STEP OUTSIDE ]', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#f6eedb',
      backgroundColor: '#7d382d',
      padding: { x: 8, y: 5 }
    });
    exitBtn.setInteractive({ useHandCursor: true });
    exitBtn.on('pointerdown', () => this.exitShop());

    this.input.keyboard.on('keydown-ESC', () => this.exitShop());

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
          'Hey kid! You already got Led Zeppelin II safe in your bag!',
          'Head on home to your bedroom before dinnertime and drop that needle!'
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
          'Well look at that! You scraped together twenty-five dollars on a Saturday afternoon in 1969!',
          'Led Zeppelin II is right here in mint condition. Ready to make it yours?'
        ],
        null,
        ['Buy Led Zeppelin II for $25!', 'Maybe later'],
        (choice) => {
          if (choice === 1) {
            this.buyAlbum();
          } else {
            this.dialogueBox.show(
              'Mr. Vinyl',
              'portrait_vinyl',
              ['No rush kid. It\'s waiting right here for you.'],
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
          'Led Zeppelin II. Twenty-five dollars. Pure rock and roll gold, kid.',
          `You've got $${cash} right now. You need $${needed} more to buy it.`,
          'Check around town! Your mom has chores, Mrs. Miller needs help, and June is jamming at the park.'
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
      gameState.addItem('Led Zeppelin II LP');
      gameState.advanceTime(10);

      this.cashDisplay.setText(`YOUR SAVINGS: $${gameState.state.cash}`);
      this.priceBadge.setFillStyle(0x752e25);
      this.priceText.setText('SOLD!');

      this.dialogueBox.show(
        'Mr. Vinyl',
        'portrait_vinyl',
        [
          '★ CONGRATULATIONS! Led Zeppelin II is all yours! ★',
          'Slip it into the sleeve carefully. Now head home to your room and drop the needle on Whole Lotta Love!'
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
