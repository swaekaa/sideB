/**
 * TitleScene.js
 * SIDE B: One Perfect Afternoon (1969)
 * Vintage Hollywood Cinematic Title Screen (1940s–1960s Aesthetic)
 * Ornate gold-and-burgundy dimensional lettering, atmospheric suburban golden-hour backdrop,
 * animated 35mm film grain, projector flicker, and elegant transitions.
 */

import { audioManager } from '../systems/AudioManager.js';
import { touchControls } from '../systems/TouchControls.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.isTransitioning = false;
  }

  create() {
    this.isTransitioning = false;
    touchControls.setVisible(false);
    this.cameras.main.setBackgroundColor('#0a080c');
    this.cameras.main.fadeIn(800, 0, 0, 0);

    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const cx = w / 2;
    const cy = h / 2;

    // 1. Build atmospheric 1969 suburban golden hour background
    this.buildAtmosphericBackground(w, h, cx, cy);

    // 2. Build vintage film grain, projector flicker & vignette overlay
    this.buildFilmEffects(w, h);

    // 3. Build ornate Hollywood title-card typography
    this.buildTitleTypography(cx, cy);

    // 4. Build "CLICK TO ENTER" prompt
    this.buildEnterPrompt(cx, h - 38);

    // 5. Setup user gesture & controls (Mouse Click, ENTER, SPACE)
    this.setupInputControls();
  }

  // ==========================================
  // 1. ATMOSPHERIC 1969 SUBURBAN SUNSET BACKDROP
  // ==========================================

  buildAtmosphericBackground(w, h, cx, cy) {
    const bgContainer = this.add.container(0, 0);

    // Deep twilight to sunset gradient sky bands
    const skyBands = [
      { y: 0,   height: 55, color: 0x160c1c }, // deep velvet night sky
      { y: 55,  height: 45, color: 0x2e1022 }, // twilight plum
      { y: 100, height: 45, color: 0x5a1824 }, // rich crimson wine
      { y: 145, height: 40, color: 0x8a301a }, // burnt rust amber
      { y: 185, height: 35, color: 0xbe561a }, // fiery autumn sunset
      { y: 220, height: 30, color: 0xe88a24 }  // golden horizon glow
    ];
    skyBands.forEach(band => {
      bgContainer.add(this.add.rectangle(cx, band.y + band.height / 2, w, band.height, band.color));
    });

    // Golden sun horizon bloom (low on the left)
    const sunX = 140;
    const sunY = 228;
    const sunBloom = this.add.circle(sunX, sunY, 70, 0xffb844, 0.22);
    const sunCore = this.add.circle(sunX, sunY, 32, 0xffe27a, 0.45);
    bgContainer.add([sunBloom, sunCore]);

    // Distant suburban skyline silhouette (undulating hills, rooftops, chimneys)
    const horizonGfx = this.add.graphics();
    horizonGfx.fillStyle(0x180b14, 0.85);

    // Distant tree mounds & rooftops
    horizonGfx.beginPath();
    horizonGfx.moveTo(0, 240);
    horizonGfx.lineTo(40, 235);
    horizonGfx.lineTo(75, 238);
    // House 1 roof
    horizonGfx.lineTo(100, 232);
    horizonGfx.lineTo(115, 222);
    horizonGfx.lineTo(130, 232);
    // Chimney
    horizonGfx.lineTo(133, 220);
    horizonGfx.lineTo(138, 220);
    horizonGfx.lineTo(138, 232);
    horizonGfx.lineTo(170, 234);
    // Tree clumps
    horizonGfx.lineTo(210, 228);
    horizonGfx.lineTo(250, 236);
    // Distant record shop roof & antenna
    horizonGfx.lineTo(290, 230);
    horizonGfx.lineTo(330, 230);
    horizonGfx.lineTo(360, 236);
    // House 2 roof
    horizonGfx.lineTo(410, 232);
    horizonGfx.lineTo(435, 218);
    horizonGfx.lineTo(460, 232);
    horizonGfx.lineTo(500, 236);
    horizonGfx.lineTo(550, 230);
    horizonGfx.lineTo(600, 234);
    horizonGfx.lineTo(w, 238);
    horizonGfx.lineTo(w, 250);
    horizonGfx.lineTo(0, 250);
    horizonGfx.closePath();
    horizonGfx.fillPath();
    bgContainer.add(horizonGfx);

    // Vintage TV Antennas on distant roofs
    const antennaGfx = this.add.graphics();
    antennaGfx.lineStyle(1, 0x1a0a12, 0.8);
    // Antenna 1
    antennaGfx.lineBetween(115, 222, 115, 206);
    antennaGfx.lineBetween(109, 210, 121, 210);
    antennaGfx.lineBetween(111, 214, 119, 214);
    // Antenna 2
    antennaGfx.lineBetween(435, 218, 435, 202);
    antennaGfx.lineBetween(429, 206, 441, 206);
    antennaGfx.lineBetween(431, 210, 439, 210);
    // Telephone Pole & lines
    antennaGfx.lineStyle(1.5, 0x14070e, 0.9);
    antennaGfx.lineBetween(510, 250, 510, 182); // tall pole
    antennaGfx.lineBetween(498, 188, 522, 188); // top crossbar
    antennaGfx.lineBetween(502, 194, 518, 194); // second crossbar
    // Sagging power lines across sunset
    antennaGfx.lineStyle(0.8, 0x1e0a14, 0.45);
    antennaGfx.lineBetween(0, 204, 510, 188);
    antennaGfx.lineBetween(510, 188, w, 200);
    bgContainer.add(antennaGfx);

    // Street, Curbs, Sidewalk & Asphalt Foreground
    const streetGfx = this.add.graphics();
    // Far sidewalk strip
    streetGfx.fillStyle(0x2d1816, 1);
    streetGfx.fillRect(0, 245, w, 12);
    // Concrete curb highlight
    streetGfx.fillStyle(0x42241e, 1);
    streetGfx.fillRect(0, 256, w, 2);
    // Dark asphalt roadway (warm sunset sheen)
    streetGfx.fillStyle(0x140a12, 1);
    streetGfx.fillRect(0, 258, w, h - 258);
    // Warm specular road reflection in center
    streetGfx.fillStyle(0x38181a, 0.4);
    streetGfx.fillRect(cx - 160, 258, 320, 18);
    bgContainer.add(streetGfx);

    // 1960s Parked Sedan Silhouette (curbside on left)
    const carGfx = this.add.graphics();
    carGfx.fillStyle(0x0e060c, 0.95);
    // Car body (long 1968 American cruiser)
    const carX = 54;
    const carY = 244;
    carGfx.fillRect(carX, carY + 8, 72, 12); // main body
    carGfx.fillRect(carX + 16, carY + 2, 40, 8); // cabin
    carGfx.fillCircle(carX + 16, carY + 20, 5); // front wheel
    carGfx.fillCircle(carX + 58, carY + 20, 5); // rear wheel
    // Chrome bumper gleam
    carGfx.fillStyle(0xd69a34, 0.7);
    carGfx.fillRect(carX - 1, carY + 14, 2, 4);
    carGfx.fillRect(carX + 71, carY + 14, 2, 3);
    bgContainer.add(carGfx);

    // Vintage Streetlamp (right side of street)
    const lampGfx = this.add.graphics();
    const lampX = w - 75;
    const lampY = 210;
    lampGfx.lineStyle(2, 0x0c060a, 1);
    lampGfx.lineBetween(lampX, 258, lampX, lampY);
    lampGfx.lineBetween(lampX, lampY, lampX - 10, lampY - 8);
    // Amber light cone
    const lampLight = this.add.circle(lampX - 10, lampY - 8, 28, 0xffc444, 0.18);
    const lampBulb = this.add.circle(lampX - 10, lampY - 8, 3, 0xfff0aa, 0.9);
    bgContainer.add([lampGfx, lampLight, lampBulb]);

    // Silhouetted Autumn Oak & Maple Trees (Framing Left & Right)
    this.buildFramingTreeSilhouettes(bgContainer, w, h);
  }

  buildFramingTreeSilhouettes(bgContainer, w, h) {
    const treeGfx = this.add.graphics();
    treeGfx.fillStyle(0x0a0508, 0.96);

    // Left mature oak trunk & overarching branches
    treeGfx.fillRect(-15, 60, 38, h - 60);
    // Foliage masses framing top-left
    const leftCanopy = [
      [-20, 30, 75], [35, 20, 65], [90, 25, 55], [140, 38, 45],
      [25, 60, 60], [80, 70, 50], [130, 85, 38], [-10, 110, 55], [45, 120, 48]
    ];
    leftCanopy.forEach(([tx, ty, tr]) => treeGfx.fillCircle(tx, ty, tr));

    // Right mature maple trunk & branches
    treeGfx.fillRect(w - 22, 80, 35, h - 80);
    const rightCanopy = [
      [w + 20, 25, 70], [w - 35, 18, 62], [w - 90, 28, 52], [w - 140, 42, 42],
      [w - 30, 65, 58], [w - 85, 75, 48], [w + 10, 115, 52], [w - 45, 125, 45]
    ];
    rightCanopy.forEach(([tx, ty, tr]) => treeGfx.fillCircle(tx, ty, tr));

    bgContainer.add(treeGfx);

    // Subtle drifting autumn leaves (crimson & gold embers)
    for (let i = 0; i < 9; i++) {
      const lx = Phaser.Math.Between(30, w - 30);
      const ly = Phaser.Math.Between(40, 260);
      const color = (i % 2 === 0) ? 0xcc581e : 0xe2a830;
      const leaf = this.add.rectangle(lx, ly, 3, 2, color, 0.65);
      leaf.setRotation(Phaser.Math.FloatBetween(0, Math.PI));
      this.tweens.add({
        targets: leaf,
        y: ly + 40,
        x: lx + Phaser.Math.Between(-15, 15),
        rotation: leaf.rotation + 2,
        duration: 3500 + Phaser.Math.Between(0, 2000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      bgContainer.add(leaf);
    }
  }

  // ==========================================
  // 2. 35MM FILM GRAIN, VIGNETTE & FLICKER
  // ==========================================

  buildFilmEffects(w, h) {
    const cx = w / 2;
    const cy = h / 2;

    // Cinematic Vignette: darkens borders dramatically so gold title pops
    const vignetteGfx = this.add.graphics();
    // Multi-ring gradient simulation for smooth vignette
    const rings = 12;
    for (let i = 0; i < rings; i++) {
      const alpha = Math.pow((i + 1) / rings, 2.2) * 0.78;
      const insetX = (rings - i) * 14;
      const insetY = (rings - i) * 9;
      vignetteGfx.lineStyle(16, 0x070408, alpha);
      vignetteGfx.strokeRect(insetX, insetY, w - insetX * 2, h - insetY * 2);
    }
    // Deep solid outer frame borders
    vignetteGfx.fillStyle(0x060307, 0.92);
    vignetteGfx.fillRect(0, 0, w, 12);
    vignetteGfx.fillRect(0, h - 12, w, 12);
    vignetteGfx.fillRect(0, 0, 16, h);
    vignetteGfx.fillRect(w - 16, 0, 16, h);

    // Ambient 35mm Projector Luminance Flicker overlay
    this.projectorFlicker = this.add.rectangle(cx, cy, w, h, 0xffebc8, 0.02);
    this.projectorFlicker.setDepth(10);

    // Procedural 35mm Film Grain Noise Texture
    this.createFilmGrainTexture();
    this.grainSprite = this.add.tileSprite(cx, cy, w, h, 'film_grain_tex');
    this.grainSprite.setAlpha(0.08);
    this.grainSprite.setDepth(11);
    this.grainSprite.setBlendMode(Phaser.BlendModes.ADD);

    // Drifting delicate vertical film scratch
    this.filmScratch = this.add.rectangle(180, cy, 1, h, 0xffffff, 0.05);
    this.filmScratch.setDepth(12);

    // Timer for scratch jitter and projector flicker
    this.time.addEvent({
      delay: 70,
      loop: true,
      callback: () => {
        // Shift grain tile coordinates randomly
        if (this.grainSprite) {
          this.grainSprite.tilePositionX = Phaser.Math.Between(0, 128);
          this.grainSprite.tilePositionY = Phaser.Math.Between(0, 128);
        }
        // Subtle projector flicker
        if (this.projectorFlicker) {
          this.projectorFlicker.setAlpha(Phaser.Math.FloatBetween(0.012, 0.038));
        }
        // Random film scratch jump
        if (this.filmScratch && Math.random() < 0.28) {
          this.filmScratch.x = Phaser.Math.Between(80, w - 80);
          this.filmScratch.setAlpha(Phaser.Math.FloatBetween(0.03, 0.12));
        } else if (this.filmScratch) {
          this.filmScratch.setAlpha(0);
        }
      }
    });
  }

  createFilmGrainTexture() {
    if (this.textures.exists('film_grain_tex')) return;
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(size, size);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const val = Math.random() * 255;
      imgData.data[i] = val;
      imgData.data[i + 1] = val;
      imgData.data[i + 2] = val;
      imgData.data[i + 3] = Math.random() < 0.5 ? 180 : 0;
    }
    ctx.putImageData(imgData, 0, 0);
    this.textures.addCanvas('film_grain_tex', canvas);
  }

  // ==========================================
  // 3. ORNATE HOLLYWOOD TITLE TYPOGRAPHY
  // ==========================================

  buildTitleTypography(cx, cy) {
    this.titleContainer = this.add.container(cx, cy - 14);
    this.titleContainer.setDepth(20);

    // Subtle dark under-glow to ensure 100% legibility on any monitor
    const backingScrim = this.add.ellipse(0, 0, 420, 160, 0x080306, 0.65);
    this.titleContainer.add(backingScrim);

    // Flanking Ornate Filigree Rules & Diamond Stars
    const ruleY = -28;
    const leftRule = this.add.rectangle(-140, ruleY, 70, 1.8, 0xd4a034, 0.85);
    const rightRule = this.add.rectangle(140, ruleY, 70, 1.8, 0xd4a034, 0.85);
    const leftDiamond = this.add.text(-96, ruleY, '◆', {
      fontFamily: 'serif',
      fontSize: '8px',
      color: '#f0ca60'
    }).setOrigin(0.5);
    const rightDiamond = this.add.text(96, ruleY, '◆', {
      fontFamily: 'serif',
      fontSize: '8px',
      color: '#f0ca60'
    }).setOrigin(0.5);
    this.titleContainer.add([leftRule, rightRule, leftDiamond, rightDiamond]);

    // MAIN TITLE: "SIDE B"
    // Authentic dimensional Hollywood typography using multi-stop layered drop shadows:
    // Deep Wine (0, 7) -> Dark Burgundy (0, 4) -> Rust Outline (0, 2) -> Gold Face -> Top Cream Highlight
    const titleText = 'SIDE B';
    const fontPrimary = "'Cinzel', 'Playfair Display', Georgia, serif";

    // Layer 1: Deep Wine Base Shadow (0, 6)
    const shadowBase = this.add.text(0, ruleY + 36 + 6, titleText, {
      fontFamily: fontPrimary,
      fontSize: '52px',
      fontStyle: 'bold',
      color: '#1a0408',
      resolution: 3
    }).setOrigin(0.5);

    // Layer 2: Deep Crimson/Burgundy Shadow (0, 4)
    const shadowMid = this.add.text(0, ruleY + 36 + 4, titleText, {
      fontFamily: fontPrimary,
      fontSize: '52px',
      fontStyle: 'bold',
      color: '#4e0f18',
      resolution: 3
    }).setOrigin(0.5);

    // Layer 3: Warm Rust-Brown Dimensional Bevel (0, 2)
    const shadowBevel = this.add.text(0, ruleY + 36 + 2, titleText, {
      fontFamily: fontPrimary,
      fontSize: '52px',
      fontStyle: 'bold',
      color: '#7d1e18',
      stroke: '#3a080e',
      strokeThickness: 3,
      resolution: 3
    }).setOrigin(0.5);

    // Layer 4: Antique Gold Main Body
    const mainTitle = this.add.text(0, ruleY + 36, titleText, {
      fontFamily: fontPrimary,
      fontSize: '52px',
      fontStyle: 'bold',
      color: '#f4ce62',
      stroke: '#946618',
      strokeThickness: 2,
      resolution: 3
    }).setOrigin(0.5);

    // Layer 5: Pale Cream Embossed Crest Highlight (0, -1)
    const topHighlight = this.add.text(0, ruleY + 36 - 1, titleText, {
      fontFamily: fontPrimary,
      fontSize: '52px',
      fontStyle: 'bold',
      color: '#fff8e4',
      stroke: '#fff0be',
      strokeThickness: 0.5,
      resolution: 3
    }).setOrigin(0.5);
    topHighlight.setAlpha(0.65);

    this.titleContainer.add([shadowBase, shadowMid, shadowBevel, mainTitle, topHighlight]);

    // Decorative center gold separator ribbon
    const midRule = this.add.rectangle(0, ruleY + 68, 180, 1.5, 0xd4a034, 0.7);
    const midStar = this.add.text(0, ruleY + 68, '★', {
      fontFamily: 'serif',
      fontSize: '10px',
      color: '#f6d87a'
    }).setOrigin(0.5);
    this.titleContainer.add([midRule, midStar]);

    // SUBTITLE: "ONE PERFECT AFTERNOON"
    const subTitle = this.add.text(0, ruleY + 84, 'ONE PERFECT AFTERNOON', {
      fontFamily: fontPrimary,
      fontSize: '13.5px',
      fontStyle: 'bold',
      letterSpacing: 4,
      color: '#f6dfad',
      stroke: '#2a0a10',
      strokeThickness: 2.5,
      resolution: 3
    }).setOrigin(0.5);
    this.titleContainer.add(subTitle);

    // PERIOD LABEL: "1969 · A NEIGHBORHOOD STORY"
    const periodLabel = this.add.text(0, ruleY + 104, '★  1969 · A NEIGHBORHOOD STORY  ★', {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: '9.5px',
      fontStyle: 'bold',
      letterSpacing: 2,
      color: '#d6c8aa',
      stroke: '#18060a',
      strokeThickness: 2,
      resolution: 3
    }).setOrigin(0.5);
    this.titleContainer.add(periodLabel);
  }

  // ==========================================
  // 4. "CLICK TO ENTER" ANIMATED PROMPT
  // ==========================================

  buildEnterPrompt(cx, y) {
    this.promptContainer = this.add.container(cx, y);
    this.promptContainer.setDepth(20);

    // Subtle dark pill backing for high readability
    const pill = this.add.rectangle(0, 0, 175, 22, 0x0c060a, 0.75);
    pill.setStrokeStyle(1, 0x6e5024, 0.7);

    // Little spinning mini vinyl record icon
    const vinylIcon = this.add.circle(-65, 0, 6, 0x161214);
    vinylIcon.setStrokeStyle(1, 0xd4a034, 0.85);
    const vinylGroove = this.add.circle(-65, 0, 2.5, 0xaa3224);
    const vinylHole = this.add.circle(-65, 0, 1, 0xffffff);

    // Spin animation for vinyl
    this.tweens.add({
      targets: [vinylIcon, vinylGroove, vinylHole],
      rotation: Math.PI * 2,
      duration: 2200,
      repeat: -1
    });

    const promptText = this.add.text(6, 0, 'CLICK TO ENTER', {
      fontFamily: "'Cinzel', 'Courier Prime', monospace",
      fontSize: '10.5px',
      fontStyle: 'bold',
      letterSpacing: 2,
      color: '#fff4d0',
      resolution: 3
    }).setOrigin(0.5);

    const rightStar = this.add.text(68, 0, '◆', {
      fontFamily: 'serif',
      fontSize: '8px',
      color: '#f0ca60'
    }).setOrigin(0.5);

    this.promptContainer.add([pill, vinylIcon, vinylGroove, vinylHole, promptText, rightStar]);

    // Gentle breathing pulse animation
    this.tweens.add({
      targets: this.promptContainer,
      alpha: { from: 0.45, to: 1.0 },
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  // ==========================================
  // 5. INPUT CONTROLS & SEAMLESS AUDIO GESTURE
  // ==========================================

  setupInputControls() {
    // Fullscreen interactive click zone
    const hitZone = this.add.zone(0, 0, this.cameras.main.width, this.cameras.main.height);
    hitZone.setOrigin(0, 0);
    hitZone.setInteractive({ useHandCursor: true });
    hitZone.on('pointerdown', () => this.handleEnter());

    // Keyboard controls: ENTER & SPACE
    this.input.keyboard.on('keydown-SPACE', () => this.handleEnter());
    this.input.keyboard.on('keydown-ENTER', () => this.handleEnter());
    this.input.keyboard.on('keydown-E', () => this.handleEnter());

    // Fullscreen shortcut (F)
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

  handleEnter() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // 1. Legally unlock browser audio context on user gesture
    audioManager.init();
    audioManager.playMusic('title');

    // 2. Smooth Hollywood fade & dissolve into Narrator Introduction
    this.tweens.add({
      targets: [this.titleContainer, this.promptContainer],
      alpha: 0,
      y: '-=12',
      duration: 480,
      ease: 'Cubic.easeIn'
    });

    this.time.delayedCall(500, () => {
      this.cameras.main.fadeOut(400, 10, 8, 12);
      this.time.delayedCall(420, () => {
        this.scene.stop('TitleScene');
        this.scene.start('NarrationScene');
      });
    });
  }
}
