/**
 * AssetGenerator.js
 * Programmatic Pixel-Art Generator for SIDE B
 * Creates crisp, authentic 1970s pixel-art textures directly onto Phaser textures.
 */

export class AssetGenerator {
  constructor(scene) {
    this.scene = scene;
  }

  generateAll() {
    this.createTiles();
    this.createProps();
    this.createPlayerSprites();
    this.createNPCSprites();
    this.createPortraits();
    this.createAlbumArt();
  }

  // Helper to create a canvas texture in Phaser
  createCanvasTexture(key, width, height, drawFn) {
    if (this.scene.textures.exists(key)) {
      this.scene.textures.remove(key);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    drawFn(ctx, width, height);
    this.scene.textures.addCanvas(key, canvas);
    return canvas;
  }

  // Helper for drawing pixel rectangles
  drawPixel(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  // --- Environment & World Tiles (16x16) ---

  createTiles() {
    // 1. Grass Base
    this.createCanvasTexture('tile_grass', 16, 16, (ctx) => {
      ctx.fillStyle = '#6b8c42';
      ctx.fillRect(0, 0, 16, 16);
      // subtle blades & texture
      const darks = [[2,3],[3,3],[8,7],[9,7],[13,12],[14,12],[5,14],[11,2]];
      ctx.fillStyle = '#557732';
      darks.forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
      const lights = [[2,2],[8,6],[13,11],[5,13],[11,1],[1,9],[14,5]];
      ctx.fillStyle = '#7fa04e';
      lights.forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
    });

    // 2. Grass Flowers
    this.createCanvasTexture('tile_grass_flowers', 16, 16, (ctx) => {
      ctx.fillStyle = '#6b8c42';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#557732';
      [[1,4],[8,12],[12,4]].forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
      // White flower
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(3, 7, 3, 3);
      ctx.fillStyle = '#f0c030';
      ctx.fillRect(4, 8, 1, 1);
      // Yellow flower
      ctx.fillStyle = '#f7d752';
      ctx.fillRect(10, 3, 3, 3);
      ctx.fillStyle = '#d47b28';
      ctx.fillRect(11, 4, 1, 1);
      // Pink wildflower
      ctx.fillStyle = '#e86f7b';
      ctx.fillRect(11, 11, 2, 2);
    });

    // 3. Sidewalk
    this.createCanvasTexture('tile_sidewalk', 16, 16, (ctx) => {
      ctx.fillStyle = '#d9ceb2';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#eae2cb';
      ctx.fillRect(1, 1, 14, 14);
      // Expansion joints
      ctx.fillStyle = '#b3a78c';
      ctx.fillRect(0, 15, 16, 1);
      ctx.fillRect(15, 0, 1, 16);
      // subtle speckles
      ctx.fillStyle = '#c5b99c';
      ctx.fillRect(4, 4, 1, 1);
      ctx.fillRect(11, 9, 1, 1);
    });

    // 4. Road Asphalt
    this.createCanvasTexture('tile_road', 16, 16, (ctx) => {
      ctx.fillStyle = '#4c5257';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#43494e';
      [[3,2],[9,8],[14,4],[2,12],[8,14]].forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
      ctx.fillStyle = '#565c62';
      [[6,5],[12,11],[4,9],[10,2]].forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
    });

    // 5. Road with Horizontal Center Line
    this.createCanvasTexture('tile_road_line_h', 16, 16, (ctx) => {
      ctx.fillStyle = '#4c5257';
      ctx.fillRect(0, 0, 16, 16);
      // Yellow dashed line
      ctx.fillStyle = '#e6c84c';
      ctx.fillRect(2, 7, 12, 2);
      ctx.fillStyle = '#bfa336';
      ctx.fillRect(2, 9, 12, 1);
    });

    // 6. Road with Vertical Center Line
    this.createCanvasTexture('tile_road_line_v', 16, 16, (ctx) => {
      ctx.fillStyle = '#4c5257';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#e6c84c';
      ctx.fillRect(7, 2, 2, 12);
      ctx.fillStyle = '#bfa336';
      ctx.fillRect(9, 2, 1, 12);
    });

    // 7. Pond Water (Teal 70s style)
    this.createCanvasTexture('tile_water', 16, 16, (ctx) => {
      ctx.fillStyle = '#376e77';
      ctx.fillRect(0, 0, 16, 16);
      // Wave ripples
      ctx.fillStyle = '#498893';
      ctx.fillRect(2, 3, 6, 2);
      ctx.fillRect(9, 10, 5, 2);
      ctx.fillStyle = '#7bbbc6';
      ctx.fillRect(3, 4, 3, 1);
      ctx.fillRect(10, 11, 3, 1);
      // Lily pad
      ctx.fillStyle = '#2d5a32';
      ctx.fillRect(11, 4, 3, 3);
      ctx.fillStyle = '#487c4d';
      ctx.fillRect(11, 4, 2, 2);
    });

    // 8. House Wall (Cream Wood Siding)
    this.createCanvasTexture('tile_wall_wood', 16, 16, (ctx) => {
      ctx.fillStyle = '#e3ca9e';
      ctx.fillRect(0, 0, 16, 16);
      // Horizontal siding shadows
      ctx.fillStyle = '#c5a97a';
      ctx.fillRect(0, 3, 16, 1);
      ctx.fillRect(0, 7, 16, 1);
      ctx.fillRect(0, 11, 16, 1);
      ctx.fillRect(0, 15, 16, 1);
    });

    // 9. House Roof (Terracotta Tiles)
    this.createCanvasTexture('tile_roof_red', 16, 16, (ctx) => {
      ctx.fillStyle = '#ad4735';
      ctx.fillRect(0, 0, 16, 16);
      // Tile scallops
      ctx.fillStyle = '#8e3525';
      ctx.fillRect(0, 5, 16, 1);
      ctx.fillRect(0, 11, 16, 1);
      ctx.fillRect(3, 0, 1, 5);
      ctx.fillRect(11, 0, 1, 5);
      ctx.fillRect(7, 6, 1, 5);
      ctx.fillRect(15, 6, 1, 5);
      ctx.fillStyle = '#c85e4a';
      ctx.fillRect(0, 0, 16, 1);
      ctx.fillRect(0, 6, 16, 1);
    });

    // 10. House Roof (Brown Shingles)
    this.createCanvasTexture('tile_roof_brown', 16, 16, (ctx) => {
      ctx.fillStyle = '#82563a';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#633e26';
      ctx.fillRect(0, 4, 16, 1);
      ctx.fillRect(0, 9, 16, 1);
      ctx.fillRect(0, 14, 16, 1);
      ctx.fillRect(4, 0, 1, 4);
      ctx.fillRect(12, 0, 1, 4);
      ctx.fillRect(8, 5, 1, 4);
    });

    // 11. Window
    this.createCanvasTexture('tile_window', 16, 16, (ctx) => {
      ctx.fillStyle = '#e3ca9e';
      ctx.fillRect(0, 0, 16, 16);
      // Window frame
      ctx.fillStyle = '#483526';
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillStyle = '#f5eedb';
      ctx.fillRect(3, 3, 10, 10);
      // Curtains & Glass
      ctx.fillStyle = '#5c8f9b';
      ctx.fillRect(4, 4, 8, 8);
      ctx.fillStyle = '#e66b60'; // orange-red 70s curtains
      ctx.fillRect(4, 4, 2, 8);
      ctx.fillRect(10, 4, 2, 8);
      // Reflection
      ctx.fillStyle = '#89c1cb';
      ctx.fillRect(6, 4, 1, 8);
      ctx.fillRect(8, 7, 2, 2);
    });

    // 12. Front Door
    this.createCanvasTexture('tile_door', 16, 16, (ctx) => {
      ctx.fillStyle = '#e3ca9e';
      ctx.fillRect(0, 0, 16, 16);
      // Door frame
      ctx.fillStyle = '#523420';
      ctx.fillRect(2, 1, 12, 15);
      // Wooden panels
      ctx.fillStyle = '#824c29';
      ctx.fillRect(3, 2, 10, 14);
      ctx.fillStyle = '#6d3c1d';
      ctx.fillRect(4, 3, 4, 5);
      ctx.fillRect(4, 9, 4, 6);
      ctx.fillRect(9, 3, 3, 5);
      ctx.fillRect(9, 9, 3, 6);
      // Brass doorknob
      ctx.fillStyle = '#f1c242';
      ctx.fillRect(10, 8, 2, 2);
    });

    // 13. Picket Fence
    this.createCanvasTexture('tile_fence', 16, 16, (ctx) => {
      // transparent bg with grass base
      ctx.fillStyle = '#6b8c42';
      ctx.fillRect(0, 12, 16, 4);
      // White pickets
      const pickets = [1, 5, 9, 13];
      pickets.forEach(px => {
        ctx.fillStyle = '#eee8d5';
        ctx.fillRect(px, 4, 2, 10);
        ctx.fillRect(px, 3, 2, 1);
        ctx.fillStyle = '#ded3b6';
        ctx.fillRect(px + 1, 4, 1, 10);
      });
      // Rails
      ctx.fillStyle = '#ded3b6';
      ctx.fillRect(0, 6, 16, 2);
      ctx.fillRect(0, 11, 16, 2);
    });

    // 14. Tree (32x32 composite texture)
    this.createCanvasTexture('tree_large', 32, 32, (ctx) => {
      // Trunk
      ctx.fillStyle = '#5c3920';
      ctx.fillRect(13, 18, 6, 14);
      ctx.fillStyle = '#442814';
      ctx.fillRect(16, 18, 3, 14);
      // Lush green layered canopy
      // Base dark green
      ctx.fillStyle = '#214723';
      ctx.beginPath();
      ctx.arc(16, 13, 13, 0, Math.PI * 2);
      ctx.fill();
      // Mid forest green
      ctx.fillStyle = '#316330';
      ctx.beginPath();
      ctx.arc(14, 11, 11, 0, Math.PI * 2);
      ctx.fill();
      // Highlight clumps
      ctx.fillStyle = '#4d8745';
      ctx.beginPath();
      ctx.arc(11, 8, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(19, 10, 5, 0, Math.PI * 2);
      ctx.fill();
      // Leaf edge pixels
      ctx.fillStyle = '#6da863';
      [[10,5],[11,4],[18,7],[19,6],[14,14]].forEach(([x,y]) => ctx.fillRect(x,y,2,2));
    });
  }

  // --- Props & Minigame Objects ---

  createProps() {
    // 1. Overgrown Hedge
    this.createCanvasTexture('prop_hedge_overgrown', 16, 16, (ctx) => {
      ctx.fillStyle = '#285424';
      ctx.fillRect(0, 2, 16, 14);
      ctx.fillStyle = '#3a7534';
      ctx.fillRect(1, 1, 14, 13);
      ctx.fillStyle = '#549c49';
      // wild bushy texture
      [[2,1],[5,0],[9,1],[13,0],[3,5],[8,4],[12,6],[6,9],[10,11]].forEach(([x,y]) => ctx.fillRect(x, y, 2, 2));
      // Wild twig/leaf sticking out
      ctx.fillStyle = '#7bc76e';
      ctx.fillRect(4, 0, 1, 2);
      ctx.fillRect(12, 0, 2, 1);
    });

    // 2. Trimmed Hedge (Neat and squared)
    this.createCanvasTexture('prop_hedge_trimmed', 16, 16, (ctx) => {
      ctx.fillStyle = '#234a1f';
      ctx.fillRect(0, 3, 16, 13);
      ctx.fillStyle = '#336c2e';
      ctx.fillRect(1, 2, 14, 12);
      ctx.fillStyle = '#488f40';
      ctx.fillRect(1, 2, 14, 4);
      // Clean top line
      ctx.fillStyle = '#61b057';
      ctx.fillRect(2, 2, 12, 1);
    });

    // 3. Trash Can Full
    this.createCanvasTexture('prop_trash_full', 16, 16, (ctx) => {
      // Grass base
      ctx.fillStyle = '#6b8c42';
      ctx.fillRect(0, 13, 16, 3);
      // Silver corrugated can
      ctx.fillStyle = '#525a61';
      ctx.fillRect(3, 5, 10, 10);
      ctx.fillStyle = '#89959f';
      ctx.fillRect(4, 5, 8, 9);
      // Ribs
      ctx.fillStyle = '#41474d';
      ctx.fillRect(5, 6, 1, 8);
      ctx.fillRect(8, 6, 1, 8);
      ctx.fillRect(11, 6, 1, 8);
      // Trash bag bulging & tilted lid
      ctx.fillStyle = '#202224';
      ctx.fillRect(5, 3, 6, 3); // dark plastic bag
      ctx.fillStyle = '#9aaab6';
      ctx.fillRect(2, 2, 12, 2); // tilted lid
      ctx.fillStyle = '#687580';
      ctx.fillRect(6, 1, 4, 1); // handle
    });

    // 4. Trash Can Empty
    this.createCanvasTexture('prop_trash_empty', 16, 16, (ctx) => {
      ctx.fillStyle = '#6b8c42';
      ctx.fillRect(0, 13, 16, 3);
      ctx.fillStyle = '#525a61';
      ctx.fillRect(3, 5, 10, 10);
      ctx.fillStyle = '#89959f';
      ctx.fillRect(4, 5, 8, 9);
      ctx.fillStyle = '#41474d';
      ctx.fillRect(5, 6, 1, 8);
      ctx.fillRect(8, 6, 1, 8);
      ctx.fillRect(11, 6, 1, 8);
      // Clean, closed lid
      ctx.fillStyle = '#9aaab6';
      ctx.fillRect(2, 4, 12, 2);
      ctx.fillStyle = '#687580';
      ctx.fillRect(6, 3, 4, 1);
    });

    // 5. Parcel (Brown paper package with string)
    this.createCanvasTexture('prop_parcel', 16, 16, (ctx) => {
      ctx.fillStyle = '#855632';
      ctx.fillRect(3, 5, 10, 8);
      ctx.fillStyle = '#b88457';
      ctx.fillRect(4, 6, 8, 6);
      // Twine cross
      ctx.fillStyle = '#eee2c8';
      ctx.fillRect(7, 5, 2, 8);
      ctx.fillRect(3, 8, 10, 2);
      // Postage stamp
      ctx.fillStyle = '#c5493e';
      ctx.fillRect(9, 6, 2, 2);
    });

    // 6. Mailbox
    this.createCanvasTexture('prop_mailbox', 16, 16, (ctx) => {
      // Post
      ctx.fillStyle = '#63442a';
      ctx.fillRect(7, 7, 2, 9);
      // Box
      ctx.fillStyle = '#37414a';
      ctx.fillRect(4, 2, 8, 6);
      ctx.fillStyle = '#63707c';
      ctx.fillRect(5, 3, 6, 4);
      // Red Flag
      ctx.fillStyle = '#d33e33';
      ctx.fillRect(11, 1, 2, 4);
    });

    // 7. Park Bench
    this.createCanvasTexture('prop_bench', 24, 16, (ctx) => {
      // Wood slats
      ctx.fillStyle = '#8a4b27';
      ctx.fillRect(2, 4, 20, 2);
      ctx.fillRect(2, 7, 20, 2);
      ctx.fillRect(2, 10, 20, 3);
      // Iron legs
      ctx.fillStyle = '#262d29';
      ctx.fillRect(4, 4, 2, 12);
      ctx.fillRect(18, 4, 2, 12);
      ctx.fillRect(2, 15, 6, 1);
      ctx.fillRect(16, 15, 6, 1);
    });

    // 8. 70s Portable Radio (Boombox / Transistor)
    this.createCanvasTexture('prop_radio', 16, 16, (ctx) => {
      ctx.fillStyle = '#2e3338';
      ctx.fillRect(2, 5, 12, 9);
      ctx.fillStyle = '#9b8032'; // metallic gold face
      ctx.fillRect(3, 6, 10, 7);
      // Speaker grille
      ctx.fillStyle = '#1e2023';
      ctx.fillRect(4, 7, 4, 4);
      // Tuning dial
      ctx.fillStyle = '#eee0bc';
      ctx.fillRect(9, 7, 3, 2);
      ctx.fillStyle = '#c53d30';
      ctx.fillRect(10, 7, 1, 2); // red needle
      // Antenna
      ctx.fillStyle = '#8f9aa3';
      ctx.fillRect(3, 2, 1, 4);
      ctx.fillRect(2, 4, 4, 1); // handle
    });

    // 9. Record Shop Banner "RECORDS"
    this.createCanvasTexture('prop_shop_sign', 64, 16, (ctx) => {
      ctx.fillStyle = '#1e3826';
      ctx.fillRect(0, 0, 64, 16);
      ctx.strokeStyle = '#d9aa38';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 62, 14);
      ctx.fillStyle = '#f0c654';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('RECORDS', 32, 12);
    });

    // 10. Record Shop Showcase Window (Displays Midnight Radio LP)
    this.createCanvasTexture('prop_shop_window', 32, 24, (ctx) => {
      ctx.fillStyle = '#3a2318';
      ctx.fillRect(0, 0, 32, 24);
      ctx.fillStyle = '#7dbecb';
      ctx.fillRect(2, 2, 28, 20);
      // Spotlight glow
      ctx.fillStyle = '#a6e1ec';
      ctx.fillRect(4, 4, 24, 16);
      // Miniature LP sleeve in window
      ctx.fillStyle = '#1a1029';
      ctx.fillRect(10, 5, 12, 12);
      // Moon & Road on mini cover
      ctx.fillStyle = '#f5ce53';
      ctx.beginPath();
      ctx.arc(16, 9, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e84c3d';
      ctx.fillRect(15, 14, 2, 2); // car
      // Price tag badge
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(9, 18, 14, 4);
      ctx.fillStyle = '#b83b2e';
      ctx.font = 'bold 4px monospace';
      ctx.fillText('$25', 12, 21);
    });

    // 11. Cars (Parked in driveways/streets)
    this.createCanvasTexture('car_blue', 32, 18, (ctx) => {
      // 1970s sedan in teal
      ctx.fillStyle = '#2d5a62';
      ctx.fillRect(2, 4, 28, 10);
      ctx.fillStyle = '#3c7984';
      ctx.fillRect(6, 1, 18, 7);
      // Windows
      ctx.fillStyle = '#a8dce4';
      ctx.fillRect(8, 2, 6, 4);
      ctx.fillRect(16, 2, 7, 4);
      // Chrome bumpers
      ctx.fillStyle = '#dce6eb';
      ctx.fillRect(0, 10, 2, 3);
      ctx.fillRect(30, 10, 2, 3);
      // Tires
      ctx.fillStyle = '#1a1d1e';
      ctx.fillRect(5, 13, 5, 4);
      ctx.fillRect(21, 13, 5, 4);
      ctx.fillStyle = '#dce6eb';
      ctx.fillRect(7, 14, 2, 2);
      ctx.fillRect(23, 14, 2, 2);
    });

    this.createCanvasTexture('car_orange', 32, 18, (ctx) => {
      // Station wagon in burnt orange
      ctx.fillStyle = '#9b451e';
      ctx.fillRect(2, 4, 28, 10);
      ctx.fillStyle = '#c75e2e';
      ctx.fillRect(5, 1, 22, 7);
      // Woodgrain side panel
      ctx.fillStyle = '#693816';
      ctx.fillRect(6, 7, 19, 4);
      // Windows
      ctx.fillStyle = '#a8dce4';
      ctx.fillRect(7, 2, 6, 4);
      ctx.fillRect(14, 2, 6, 4);
      ctx.fillRect(21, 2, 5, 4);
      // Tires
      ctx.fillStyle = '#1a1d1e';
      ctx.fillRect(5, 13, 5, 4);
      ctx.fillRect(22, 13, 5, 4);
    });
  }

  // --- Character Sprites (16x24) ---

  createPlayerSprites() {
    // Colors:
    // Hair: #633e21 (feathered 70s teen hair)
    // Skin: #e8b688
    // Shirt: #d99f2a (mustard yellow)
    // Pants: #375373 (denim blue bell-bottoms)
    // Shoes: #4a2d18 (brown retro sneakers)

    const drawBasePlayer = (ctx, stepFrame = 0, dir = 'down') => {
      ctx.clearRect(0, 0, 16, 24);

      if (dir === 'down') {
        // Hair
        ctx.fillStyle = '#633e21';
        ctx.fillRect(4, 2, 8, 6);
        ctx.fillRect(3, 4, 10, 4);
        // Face
        ctx.fillStyle = '#e8b688';
        ctx.fillRect(5, 6, 6, 4);
        // Eyes
        ctx.fillStyle = '#261b12';
        ctx.fillRect(6, 7, 1, 1);
        ctx.fillRect(9, 7, 1, 1);
        // Shirt (Mustard Yellow)
        ctx.fillStyle = '#d99f2a';
        ctx.fillRect(4, 10, 8, 6);
        ctx.fillStyle = '#b88118';
        ctx.fillRect(7, 10, 2, 3); // collar
        // Denim Bell-Bottoms
        ctx.fillStyle = '#375373';
        if (stepFrame === 0) {
          ctx.fillRect(4, 16, 3, 5);
          ctx.fillRect(9, 16, 3, 5);
          // Shoes
          ctx.fillStyle = '#4a2d18';
          ctx.fillRect(3, 21, 4, 3);
          ctx.fillRect(9, 21, 4, 3);
        } else if (stepFrame === 1) {
          ctx.fillRect(4, 16, 3, 4);
          ctx.fillRect(9, 15, 3, 6);
          ctx.fillStyle = '#4a2d18';
          ctx.fillRect(3, 20, 4, 3);
          ctx.fillRect(9, 21, 4, 3);
        } else {
          ctx.fillRect(4, 15, 3, 6);
          ctx.fillRect(9, 16, 3, 4);
          ctx.fillStyle = '#4a2d18';
          ctx.fillRect(3, 21, 4, 3);
          ctx.fillRect(9, 20, 4, 3);
        }
      } else if (dir === 'up') {
        // Back of head
        ctx.fillStyle = '#633e21';
        ctx.fillRect(4, 2, 8, 7);
        ctx.fillRect(3, 4, 10, 5);
        // Shirt back
        ctx.fillStyle = '#d99f2a';
        ctx.fillRect(4, 10, 8, 6);
        // Pants
        ctx.fillStyle = '#375373';
        if (stepFrame === 0) {
          ctx.fillRect(4, 16, 3, 5);
          ctx.fillRect(9, 16, 3, 5);
          ctx.fillStyle = '#4a2d18';
          ctx.fillRect(4, 21, 3, 3);
          ctx.fillRect(9, 21, 3, 3);
        } else if (stepFrame === 1) {
          ctx.fillRect(4, 15, 3, 6);
          ctx.fillRect(9, 16, 3, 4);
          ctx.fillStyle = '#4a2d18';
          ctx.fillRect(4, 21, 3, 3);
          ctx.fillRect(9, 20, 3, 3);
        } else {
          ctx.fillRect(4, 16, 3, 4);
          ctx.fillRect(9, 15, 3, 6);
          ctx.fillStyle = '#4a2d18';
          ctx.fillRect(4, 20, 3, 3);
          ctx.fillRect(9, 21, 3, 3);
        }
      } else if (dir === 'left') {
        // Hair side profile
        ctx.fillStyle = '#633e21';
        ctx.fillRect(4, 2, 8, 6);
        ctx.fillRect(3, 4, 5, 5);
        // Face
        ctx.fillStyle = '#e8b688';
        ctx.fillRect(3, 6, 4, 4);
        ctx.fillStyle = '#261b12';
        ctx.fillRect(4, 7, 1, 1);
        // Shirt
        ctx.fillStyle = '#d99f2a';
        ctx.fillRect(4, 10, 7, 6);
        // Arm
        ctx.fillStyle = '#b88118';
        ctx.fillRect(6, 11, 3, 5);
        // Pants
        ctx.fillStyle = '#375373';
        if (stepFrame === 0) {
          ctx.fillRect(5, 16, 5, 5);
          ctx.fillStyle = '#4a2d18';
          ctx.fillRect(3, 21, 6, 3);
        } else if (stepFrame === 1) {
          ctx.fillRect(4, 16, 3, 5);
          ctx.fillRect(8, 16, 3, 4);
          ctx.fillStyle = '#4a2d18';
          ctx.fillRect(3, 21, 4, 3);
          ctx.fillRect(8, 20, 4, 3);
        } else {
          ctx.fillRect(4, 16, 3, 4);
          ctx.fillRect(7, 16, 4, 5);
          ctx.fillStyle = '#4a2d18';
          ctx.fillRect(3, 20, 4, 3);
          ctx.fillRect(7, 21, 5, 3);
        }
      } else if (dir === 'right') {
        // Mirrored right profile
        ctx.fillStyle = '#633e21';
        ctx.fillRect(4, 2, 8, 6);
        ctx.fillRect(8, 4, 5, 5);
        ctx.fillStyle = '#e8b688';
        ctx.fillRect(9, 6, 4, 4);
        ctx.fillStyle = '#261b12';
        ctx.fillRect(11, 7, 1, 1);
        ctx.fillStyle = '#d99f2a';
        ctx.fillRect(5, 10, 7, 6);
        ctx.fillStyle = '#b88118';
        ctx.fillRect(7, 11, 3, 5);
        ctx.fillStyle = '#375373';
        if (stepFrame === 0) {
          ctx.fillRect(6, 16, 5, 5);
          ctx.fillStyle = '#4a2d18';
          ctx.fillRect(7, 21, 6, 3);
        } else if (stepFrame === 1) {
          ctx.fillRect(5, 16, 3, 4);
          ctx.fillRect(9, 16, 3, 5);
          ctx.fillStyle = '#4a2d18';
          ctx.fillRect(4, 20, 4, 3);
          ctx.fillRect(9, 21, 4, 3);
        } else {
          ctx.fillRect(5, 16, 4, 5);
          ctx.fillRect(9, 16, 3, 4);
          ctx.fillStyle = '#4a2d18';
          ctx.fillRect(4, 21, 5, 3);
          ctx.fillRect(9, 20, 4, 3);
        }
      }
    };

    ['down', 'up', 'left', 'right'].forEach(dir => {
      [0, 1, 2].forEach(step => {
        this.createCanvasTexture(`player_${dir}_${step}`, 16, 24, (ctx) => {
          drawBasePlayer(ctx, step, dir);
        });
      });
    });
  }

  // --- NPCs (Mom, Mrs. Miller, June, Mr. Vinyl, Timmy, Neighbor Bob, Dog) ---

  createNPCSprites() {
    // 1. Mom: Floral house apron, brown bun/curls
    this.createCanvasTexture('npc_mom', 16, 24, (ctx) => {
      // Hair
      ctx.fillStyle = '#5a351a';
      ctx.fillRect(3, 2, 10, 7);
      ctx.fillRect(2, 4, 12, 4);
      // Face
      ctx.fillStyle = '#ebd1b5';
      ctx.fillRect(5, 6, 6, 4);
      ctx.fillStyle = '#2d1b0e';
      ctx.fillRect(6, 7, 1, 1);
      ctx.fillRect(9, 7, 1, 1);
      ctx.fillStyle = '#c75955';
      ctx.fillRect(7, 9, 2, 1); // smile
      // Dress
      ctx.fillStyle = '#c85e50';
      ctx.fillRect(4, 10, 8, 11);
      // Apron
      ctx.fillStyle = '#f3edd6';
      ctx.fillRect(5, 11, 6, 9);
      ctx.fillStyle = '#4d8a57'; // floral dot
      ctx.fillRect(6, 13, 1, 1);
      ctx.fillRect(8, 16, 1, 1);
      // Shoes
      ctx.fillStyle = '#3a2318';
      ctx.fillRect(4, 21, 3, 2);
      ctx.fillRect(9, 21, 3, 2);
    });

    // 2. Mrs. Miller: Grey hair bun, mint cardigan, glasses
    this.createCanvasTexture('npc_mrs_miller', 16, 24, (ctx) => {
      // White-grey bun
      ctx.fillStyle = '#c4c8cb';
      ctx.fillRect(6, 1, 4, 3);
      ctx.fillRect(4, 3, 8, 6);
      // Face
      ctx.fillStyle = '#edd3c1';
      ctx.fillRect(5, 6, 6, 4);
      // Glasses
      ctx.fillStyle = '#7a6a58';
      ctx.fillRect(5, 7, 2, 1);
      ctx.fillRect(8, 7, 2, 1);
      ctx.fillRect(7, 7, 1, 1);
      // Mint cardigan & skirt
      ctx.fillStyle = '#75a68f';
      ctx.fillRect(4, 10, 8, 6);
      ctx.fillStyle = '#f3e8d2';
      ctx.fillRect(7, 10, 2, 5); // blouse
      ctx.fillStyle = '#445b5c';
      ctx.fillRect(4, 16, 8, 5); // dark skirt
      // Shoes
      ctx.fillStyle = '#2d2d2d';
      ctx.fillRect(5, 21, 2, 2);
      ctx.fillRect(9, 21, 2, 2);
    });

    // 3. June: Auburn hair, green sweater, 70s flair
    this.createCanvasTexture('npc_june', 16, 24, (ctx) => {
      // Auburn hair
      ctx.fillStyle = '#9b4b24';
      ctx.fillRect(4, 2, 8, 7);
      ctx.fillRect(3, 4, 10, 8);
      // Headband
      ctx.fillStyle = '#d4aa33';
      ctx.fillRect(4, 3, 8, 1);
      // Face
      ctx.fillStyle = '#f0c7a8';
      ctx.fillRect(5, 6, 6, 4);
      ctx.fillStyle = '#1e1c19';
      ctx.fillRect(6, 7, 1, 1);
      ctx.fillRect(9, 7, 1, 1);
      // Striped green sweater
      ctx.fillStyle = '#4b7e53';
      ctx.fillRect(4, 10, 8, 6);
      ctx.fillStyle = '#e4e2a8';
      ctx.fillRect(4, 12, 8, 1);
      ctx.fillRect(4, 14, 8, 1);
      // Corduroy flared pants
      ctx.fillStyle = '#8f5c35';
      ctx.fillRect(4, 16, 3, 5);
      ctx.fillRect(9, 16, 3, 5);
      // Shoes
      ctx.fillStyle = '#3a2012';
      ctx.fillRect(3, 21, 4, 2);
      ctx.fillRect(9, 21, 4, 2);
    });

    // 4. Mr. Vinyl: 70s glasses, beard, blue collared shirt
    this.createCanvasTexture('npc_mr_vinyl', 16, 24, (ctx) => {
      // Dark brown hair
      ctx.fillStyle = '#3b2819';
      ctx.fillRect(4, 2, 8, 5);
      // Face
      ctx.fillStyle = '#e3b58c';
      ctx.fillRect(5, 5, 6, 5);
      // Thick horn-rimmed glasses
      ctx.fillStyle = '#111111';
      ctx.fillRect(5, 6, 3, 2);
      ctx.fillRect(9, 6, 3, 2);
      ctx.fillRect(8, 6, 1, 1);
      // 70s full beard
      ctx.fillStyle = '#3b2819';
      ctx.fillRect(5, 8, 6, 3);
      // Chambray blue collared shirt
      ctx.fillStyle = '#4c7391';
      ctx.fillRect(4, 11, 8, 6);
      ctx.fillStyle = '#ded5be';
      ctx.fillRect(7, 11, 2, 3);
      // Pocket with pen
      ctx.fillStyle = '#324e64';
      ctx.fillRect(5, 13, 2, 2);
      ctx.fillStyle = '#d4392b';
      ctx.fillRect(6, 12, 1, 1);
      // Brown slacks
      ctx.fillStyle = '#614b38';
      ctx.fillRect(5, 17, 6, 4);
      // Shoes
      ctx.fillStyle = '#221912';
      ctx.fillRect(4, 21, 3, 2);
      ctx.fillRect(9, 21, 3, 2);
    });

    // 5. Timmy (Math Kid): Green baseball cap, orange t-shirt
    this.createCanvasTexture('npc_timmy', 16, 24, (ctx) => {
      // Green cap with brim
      ctx.fillStyle = '#386938';
      ctx.fillRect(4, 2, 8, 4);
      ctx.fillRect(3, 4, 4, 1); // visor
      // Face
      ctx.fillStyle = '#f0c7a8';
      ctx.fillRect(5, 6, 6, 4);
      ctx.fillStyle = '#1c1b18';
      ctx.fillRect(6, 7, 1, 1);
      ctx.fillRect(9, 7, 1, 1);
      // Orange shirt
      ctx.fillStyle = '#e0632b';
      ctx.fillRect(4, 10, 8, 6);
      // Shorts
      ctx.fillStyle = '#3a597a';
      ctx.fillRect(5, 16, 6, 3);
      // Legs
      ctx.fillStyle = '#f0c7a8';
      ctx.fillRect(5, 19, 2, 2);
      ctx.fillRect(9, 19, 2, 2);
      // Sneakers
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(4, 21, 3, 2);
      ctx.fillRect(9, 21, 3, 2);
      ctx.fillStyle = '#c93424';
      ctx.fillRect(5, 21, 1, 1);
      ctx.fillRect(10, 21, 1, 1);
    });

    // 6. Neighbor Bob: Plaid shirt, brown cap
    this.createCanvasTexture('npc_neighbor_bob', 16, 24, (ctx) => {
      ctx.fillStyle = '#664c33';
      ctx.fillRect(4, 2, 8, 4);
      ctx.fillStyle = '#e5b689';
      ctx.fillRect(5, 6, 6, 4);
      ctx.fillStyle = '#211710';
      ctx.fillRect(6, 7, 1, 1);
      ctx.fillRect(9, 7, 1, 1);
      ctx.fillStyle = '#8f6e4a';
      ctx.fillRect(5, 8, 6, 2); // mustache
      // Red/Black Plaid flannel
      ctx.fillStyle = '#a8372b';
      ctx.fillRect(4, 10, 8, 6);
      ctx.fillStyle = '#2a1e1b';
      ctx.fillRect(6, 10, 1, 6);
      ctx.fillRect(4, 13, 8, 1);
      // Jeans
      ctx.fillStyle = '#3a4b59';
      ctx.fillRect(5, 16, 6, 5);
      // Work boots
      ctx.fillStyle = '#4d3017';
      ctx.fillRect(4, 21, 3, 2);
      ctx.fillRect(9, 21, 3, 2);
    });

    // 7. Dog Barnaby (16x16 cute pixel retriever)
    this.createCanvasTexture('npc_dog_barnaby', 16, 16, (ctx) => {
      // Golden body
      ctx.fillStyle = '#c79442';
      ctx.fillRect(3, 6, 10, 6);
      // Head
      ctx.fillRect(10, 3, 5, 5);
      // Floppy ear
      ctx.fillStyle = '#8f6224';
      ctx.fillRect(10, 4, 2, 4);
      // Snout
      ctx.fillStyle = '#ddaa54';
      ctx.fillRect(13, 5, 3, 3);
      ctx.fillStyle = '#1b140c';
      ctx.fillRect(15, 5, 1, 1); // nose
      ctx.fillRect(12, 4, 1, 1); // eye
      // Red collar
      ctx.fillStyle = '#c93322';
      ctx.fillRect(10, 7, 2, 2);
      // Legs
      ctx.fillStyle = '#a6772d';
      ctx.fillRect(4, 12, 2, 4);
      ctx.fillRect(10, 12, 2, 4);
      // Wagging tail
      ctx.fillStyle = '#c79442';
      ctx.fillRect(1, 4, 3, 3);
      ctx.fillRect(0, 3, 2, 2);
    });
  }

  // --- Dialogue Portraits (32x32) ---

  createPortraits() {
    // 1. Mom Portrait
    this.createCanvasTexture('portrait_mom', 32, 32, (ctx) => {
      ctx.fillStyle = '#f7f2df';
      ctx.fillRect(0, 0, 32, 32);
      // 70s hair
      ctx.fillStyle = '#5a351a';
      ctx.fillRect(6, 4, 20, 14);
      ctx.fillRect(4, 8, 24, 10);
      // Face
      ctx.fillStyle = '#ebd1b5';
      ctx.fillRect(10, 10, 12, 12);
      // Eyes & smile
      ctx.fillStyle = '#2d1b0e';
      ctx.fillRect(12, 14, 2, 2);
      ctx.fillRect(18, 14, 2, 2);
      ctx.fillStyle = '#c75955';
      ctx.fillRect(14, 18, 4, 2);
      // Apron & collar
      ctx.fillStyle = '#c85e50';
      ctx.fillRect(6, 22, 20, 10);
      ctx.fillStyle = '#f3edd6';
      ctx.fillRect(11, 23, 10, 9);
      // Border
      ctx.strokeStyle = '#2b3a29';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 30, 30);
    });

    // 2. Mrs. Miller Portrait
    this.createCanvasTexture('portrait_miller', 32, 32, (ctx) => {
      ctx.fillStyle = '#f7f2df';
      ctx.fillRect(0, 0, 32, 32);
      // Grey hair
      ctx.fillStyle = '#c4c8cb';
      ctx.fillRect(12, 2, 8, 5); // top bun
      ctx.fillRect(8, 6, 16, 12);
      // Face
      ctx.fillStyle = '#edd3c1';
      ctx.fillRect(10, 11, 12, 11);
      // Horn-rimmed glasses
      ctx.fillStyle = '#6e5645';
      ctx.fillRect(10, 13, 5, 4);
      ctx.fillRect(17, 13, 5, 4);
      ctx.fillRect(15, 14, 2, 1);
      ctx.fillStyle = '#89c6cf';
      ctx.fillRect(11, 14, 3, 2);
      ctx.fillRect(18, 14, 3, 2);
      // Mint sweater
      ctx.fillStyle = '#75a68f';
      ctx.fillRect(6, 22, 20, 10);
      // Border
      ctx.strokeStyle = '#2b3a29';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 30, 30);
    });

    // 3. June Portrait
    this.createCanvasTexture('portrait_june', 32, 32, (ctx) => {
      ctx.fillStyle = '#f7f2df';
      ctx.fillRect(0, 0, 32, 32);
      // Auburn hair
      ctx.fillStyle = '#9b4b24';
      ctx.fillRect(7, 4, 18, 18);
      ctx.fillRect(5, 8, 22, 14);
      // Headband
      ctx.fillStyle = '#d4aa33';
      ctx.fillRect(8, 6, 16, 2);
      // Face
      ctx.fillStyle = '#f0c7a8';
      ctx.fillRect(10, 10, 12, 11);
      // Eyes & smile
      ctx.fillStyle = '#1e1c19';
      ctx.fillRect(12, 14, 2, 2);
      ctx.fillRect(18, 14, 2, 2);
      // Freckles
      ctx.fillStyle = '#bf7a4e';
      ctx.fillRect(11, 17, 1, 1);
      ctx.fillRect(20, 17, 1, 1);
      ctx.fillStyle = '#c2584c';
      ctx.fillRect(14, 18, 4, 1);
      // Green sweater
      ctx.fillStyle = '#4b7e53';
      ctx.fillRect(6, 22, 20, 10);
      ctx.strokeStyle = '#2b3a29';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 30, 30);
    });

    // 4. Mr. Vinyl Portrait
    this.createCanvasTexture('portrait_vinyl', 32, 32, (ctx) => {
      ctx.fillStyle = '#f7f2df';
      ctx.fillRect(0, 0, 32, 32);
      // Hair
      ctx.fillStyle = '#3b2819';
      ctx.fillRect(8, 4, 16, 8);
      // Face
      ctx.fillStyle = '#e3b58c';
      ctx.fillRect(10, 9, 12, 13);
      // Big 70s glasses
      ctx.fillStyle = '#111111';
      ctx.fillRect(9, 11, 6, 5);
      ctx.fillRect(17, 11, 6, 5);
      ctx.fillRect(15, 12, 2, 2);
      // Eyes inside glass
      ctx.fillStyle = '#4f728c';
      ctx.fillRect(11, 13, 2, 2);
      ctx.fillRect(19, 13, 2, 2);
      // Full beard
      ctx.fillStyle = '#3b2819';
      ctx.fillRect(9, 16, 14, 7);
      // Blue denim shirt
      ctx.fillStyle = '#4c7391';
      ctx.fillRect(6, 23, 20, 9);
      ctx.strokeStyle = '#2b3a29';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 30, 30);
    });

    // 5. Timmy Portrait
    this.createCanvasTexture('portrait_timmy', 32, 32, (ctx) => {
      ctx.fillStyle = '#f7f2df';
      ctx.fillRect(0, 0, 32, 32);
      // Cap
      ctx.fillStyle = '#386938';
      ctx.fillRect(9, 4, 14, 7);
      ctx.fillRect(6, 9, 8, 2); // visor
      // Face
      ctx.fillStyle = '#f0c7a8';
      ctx.fillRect(10, 11, 12, 10);
      // Eyes
      ctx.fillStyle = '#1c1b18';
      ctx.fillRect(12, 14, 2, 2);
      ctx.fillRect(18, 14, 2, 2);
      ctx.fillStyle = '#ba462e';
      ctx.fillRect(14, 18, 4, 2); // grin
      // Orange shirt
      ctx.fillStyle = '#e0632b';
      ctx.fillRect(7, 22, 18, 10);
      ctx.strokeStyle = '#2b3a29';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 30, 30);
    });

    // 6. Neighbor Bob Portrait
    this.createCanvasTexture('portrait_bob', 32, 32, (ctx) => {
      ctx.fillStyle = '#f7f2df';
      ctx.fillRect(0, 0, 32, 32);
      // Cap
      ctx.fillStyle = '#664c33';
      ctx.fillRect(8, 4, 16, 6);
      ctx.fillRect(6, 8, 6, 2);
      // Face
      ctx.fillStyle = '#e5b689';
      ctx.fillRect(10, 10, 12, 12);
      ctx.fillStyle = '#211710';
      ctx.fillRect(12, 13, 2, 2);
      ctx.fillRect(18, 13, 2, 2);
      // Big mustache
      ctx.fillStyle = '#8f6e4a';
      ctx.fillRect(10, 16, 12, 4);
      // Red flannel
      ctx.fillStyle = '#a8372b';
      ctx.fillRect(6, 22, 20, 10);
      ctx.strokeStyle = '#2b3a29';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 30, 30);
    });

    // 7. Dog Portrait
    this.createCanvasTexture('portrait_dog', 32, 32, (ctx) => {
      ctx.fillStyle = '#f7f2df';
      ctx.fillRect(0, 0, 32, 32);
      // Golden head
      ctx.fillStyle = '#c79442';
      ctx.fillRect(8, 8, 16, 14);
      // Floppy ears
      ctx.fillStyle = '#8f6224';
      ctx.fillRect(6, 8, 4, 12);
      ctx.fillRect(22, 8, 4, 12);
      // Snout
      ctx.fillStyle = '#ddaa54';
      ctx.fillRect(11, 15, 10, 8);
      ctx.fillStyle = '#1b140c';
      ctx.fillRect(14, 16, 4, 3); // nose
      ctx.fillRect(11, 12, 2, 2); // eyes
      ctx.fillRect(19, 12, 2, 2);
      // Tongue
      ctx.fillStyle = '#e66579';
      ctx.fillRect(15, 22, 3, 3);
      ctx.strokeStyle = '#2b3a29';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 30, 30);
    });
  }

  // --- Album Art "Midnight Radio" (120x120) & Sidebar Canvas ---

  createAlbumArt() {
    const drawLP = (ctx, w, h) => {
      // Twilight dusk gradient: purple-blue to twilight orange
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#13122c');
      grad.addColorStop(0.5, '#2e1946');
      grad.addColorStop(0.75, '#6a2a4b');
      grad.addColorStop(1, '#a64a39');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Distant stars
      ctx.fillStyle = '#ffffff';
      [[15, 12], [35, 22], [85, 15], [105, 28], [55, 30], [20, 45]].forEach(([sx, sy]) => {
        ctx.fillRect(sx, sy, 1, 1);
      });

      // Giant warm golden full moon
      ctx.fillStyle = '#ffdf66';
      ctx.beginPath();
      ctx.arc(w / 2, 48, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe994';
      ctx.beginPath();
      ctx.arc(w / 2 - 4, 44, 18, 0, Math.PI * 2);
      ctx.fill();

      // Silhouetted mountain peaks & pine treeline
      ctx.fillStyle = '#1c0f21';
      ctx.beginPath();
      ctx.moveTo(0, 75);
      ctx.lineTo(25, 62);
      ctx.lineTo(50, 72);
      ctx.lineTo(80, 58);
      ctx.lineTo(105, 68);
      ctx.lineTo(w, 60);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Winding desert highway at night
      ctx.fillStyle = '#2d2d38';
      ctx.beginPath();
      ctx.moveTo(w / 2 - 4, 75);
      ctx.lineTo(w / 2 + 4, 75);
      ctx.lineTo(w - 15, h);
      ctx.lineTo(15, h);
      ctx.closePath();
      ctx.fill();

      // Center highway dashed line
      ctx.fillStyle = '#f0c638';
      ctx.beginPath();
      ctx.moveTo(w / 2, 77);
      ctx.lineTo(w / 2, 85);
      ctx.lineTo(w / 2, 95);
      ctx.lineTo(w / 2, h);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#f0c638';
      ctx.stroke();

      // Cherry-red 1970s muscle car rear view
      const cx = w / 2 - 14;
      const cy = 94;
      ctx.fillStyle = '#851d1a';
      ctx.fillRect(cx, cy, 28, 12);
      ctx.fillStyle = '#b82f28';
      ctx.fillRect(cx + 2, cy - 5, 24, 7);
      // Rear windshield
      ctx.fillStyle = '#372d42';
      ctx.fillRect(cx + 4, cy - 4, 20, 5);
      // Glowing red tail lights
      ctx.fillStyle = '#ff2b2b';
      ctx.fillRect(cx + 2, cy + 3, 6, 3);
      ctx.fillRect(cx + 20, cy + 3, 6, 3);
      ctx.fillStyle = '#ffe6e6';
      ctx.fillRect(cx + 3, cy + 4, 2, 1);
      ctx.fillRect(cx + 21, cy + 4, 2, 1);
      // License plate
      ctx.fillStyle = '#ffd13b';
      ctx.fillRect(cx + 11, cy + 6, 6, 3);

      // Vintage bold title typography
      ctx.fillStyle = '#d43b2c';
      ctx.font = 'bold 13px "Courier Prime", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MIDNIGHT', w / 2, 18);
      ctx.fillStyle = '#e69a37';
      ctx.fillText('RADIO', w / 2, 30);

      // Outer vinyl sleeve border & ring
      ctx.strokeStyle = '#1b1a1a';
      ctx.lineWidth = 3;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    };

    // Create in Phaser texture cache
    this.createCanvasTexture('album_midnight_radio', 120, 120, (ctx, w, h) => {
      drawLP(ctx, w, h);
    });

    // Also draw directly to the sidebar thumbnail canvas!
    const sideCanvas = document.getElementById('album-preview-canvas');
    if (sideCanvas) {
      const sctx = sideCanvas.getContext('2d');
      drawLP(sctx, 120, 120);
    }
  }
}
