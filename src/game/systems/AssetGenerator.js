/**
 * AssetGenerator.js
 * Programmatic Pixel-Art Generator for SIDE B (1969 Edition — Overhaul)
 * Richer tiles, animated-ready props, better characters, new objects.
 */

export class AssetGenerator {
  constructor(scene) {
    this.scene = scene;
  }

  generateAll() {
    this.createTiles();
    this.createProps();
    this.createVehicles();
    this.createPlayerSprites();
    this.createNPCSprites();
    this.createPortraits();
    this.createAlbumArt();
  }

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

  // --- Environmental Tiles (16x16) ---

  createTiles() {
    // 1. Lush Green Grass Base
    this.createCanvasTexture('tile_grass', 16, 16, (ctx) => {
      ctx.fillStyle = '#5f8038';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#4e6a2d';
      [[2,3],[8,7],[13,12],[5,14],[11,2],[1,9]].forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
      ctx.fillStyle = '#74993f';
      [[2,2],[8,6],[5,13],[11,1],[14,5],[3,10]].forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
      ctx.fillStyle = '#87b04a';
      [[4,5],[10,9],[7,13]].forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
    });

    // 2. Dark Grass variant
    this.createCanvasTexture('tile_grass_dark', 16, 16, (ctx) => {
      ctx.fillStyle = '#4d6e2c';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#3d5722';
      [[3,4],[9,8],[14,13],[6,1]].forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
      ctx.fillStyle = '#638535';
      [[1,2],[10,7],[4,12]].forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
    });

    // 3. Flower Grass
    this.createCanvasTexture('tile_grass_flowers', 16, 16, (ctx) => {
      ctx.fillStyle = '#5f8038';
      ctx.fillRect(0, 0, 16, 16);
      // White daisy
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(3, 7, 3, 3);
      ctx.fillStyle = '#f0c030';
      ctx.fillRect(4, 8, 1, 1);
      // Yellow wildflower
      ctx.fillStyle = '#f7d752';
      ctx.fillRect(11, 4, 3, 3);
      ctx.fillStyle = '#d47b28';
      ctx.fillRect(12, 5, 1, 1);
      // Pink flower
      ctx.fillStyle = '#e86f7b';
      ctx.fillRect(10, 11, 2, 2);
      ctx.fillStyle = '#f9a0ab';
      ctx.fillRect(10, 10, 1, 1);
      // Stem
      ctx.fillStyle = '#4e6a2d';
      ctx.fillRect(4, 10, 1, 2);
      ctx.fillRect(12, 7, 1, 2);
    });

    // 4. Flower bed (for house fronts)
    this.createCanvasTexture('tile_flower_bed', 16, 16, (ctx) => {
      ctx.fillStyle = '#3d2c1a';
      ctx.fillRect(0, 8, 16, 8);
      ctx.fillStyle = '#5f8038';
      ctx.fillRect(0, 0, 16, 8);
      // Flowers
      const colors = ['#e63d4f','#f7cf39','#9b59ef','#e66b20','#55c4e8'];
      [[2,6],[5,2],[8,5],[11,1],[14,4]].forEach(([x,y],i) => {
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(x, y, 3, 3);
        ctx.fillStyle = '#ffee99';
        ctx.fillRect(x+1, y+1, 1, 1);
        ctx.fillStyle = '#4e6a2d';
        ctx.fillRect(x+1, y+3, 1, 3);
      });
    });

    // 5. Sidewalk
    this.createCanvasTexture('tile_sidewalk', 16, 16, (ctx) => {
      ctx.fillStyle = '#ccc3a8';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#ddd6c0';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillStyle = '#b5ac94';
      ctx.fillRect(0, 15, 16, 1);
      ctx.fillRect(15, 0, 1, 16);
      // Subtle cracks
      ctx.fillStyle = '#c0b89a';
      ctx.fillRect(5, 4, 1, 4);
      ctx.fillRect(10, 10, 1, 3);
    });

    // 5b. Garden & Park Footpath (Flagstone Pavers)
    this.createCanvasTexture('tile_footpath', 16, 16, (ctx) => {
      ctx.fillStyle = '#5f8038';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#b8aa92';
      ctx.fillRect(1, 1, 6, 6);
      ctx.fillRect(8, 1, 7, 5);
      ctx.fillRect(1, 8, 7, 7);
      ctx.fillRect(9, 7, 6, 8);
      ctx.fillStyle = '#cfc2a9';
      ctx.fillRect(2, 2, 4, 4);
      ctx.fillRect(9, 2, 5, 3);
      ctx.fillRect(2, 9, 5, 5);
      ctx.fillRect(10, 8, 4, 6);
      ctx.fillStyle = '#786852';
      ctx.fillRect(0, 7, 16, 1);
      ctx.fillRect(7, 0, 1, 16);
    });

    // 6. Road Asphalt Base
    this.createCanvasTexture('tile_road', 16, 16, (ctx) => {
      ctx.fillStyle = '#464c52';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#3d4349';
      [[3,2],[9,8],[14,4],[2,12],[8,14]].forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
      ctx.fillStyle = '#525960';
      [[6,5],[12,11],[4,9],[10,2]].forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
    });

    // 7. Road with Yellow Dashed Center Line (Horizontal)
    this.createCanvasTexture('tile_road_line_h', 16, 16, (ctx) => {
      ctx.fillStyle = '#464c52';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#e3c445';
      ctx.fillRect(2, 7, 12, 2);
      ctx.fillStyle = '#b8a030';
      ctx.fillRect(2, 9, 12, 1);
    });

    // 8. Road with Yellow Dashed Center Line (Vertical)
    this.createCanvasTexture('tile_road_line_v', 16, 16, (ctx) => {
      ctx.fillStyle = '#464c52';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#e3c445';
      ctx.fillRect(7, 2, 2, 12);
      ctx.fillStyle = '#b8a030';
      ctx.fillRect(9, 2, 1, 12);
    });

    // 9. Crosswalk Tile
    this.createCanvasTexture('tile_crosswalk', 16, 16, (ctx) => {
      ctx.fillStyle = '#464c52';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#e2dcc8';
      ctx.fillRect(1, 1, 14, 4);
      ctx.fillRect(1, 7, 14, 3);
      ctx.fillRect(1, 12, 14, 4);
    });

    // 10. Driveway Concrete
    this.createCanvasTexture('tile_driveway', 16, 16, (ctx) => {
      ctx.fillStyle = '#beb5a0';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#b0a78e';
      ctx.fillRect(0, 15, 16, 1);
      ctx.fillRect(15, 0, 1, 16);
      ctx.fillStyle = '#d4cdb7';
      ctx.fillRect(2, 2, 6, 6);
      // expansion joint
      ctx.fillStyle = '#a09488';
      ctx.fillRect(0, 8, 16, 1);
    });

    // 11. Pond Teal Water
    this.createCanvasTexture('tile_water', 16, 16, (ctx) => {
      ctx.fillStyle = '#2e657a';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#3d7e96';
      ctx.fillRect(2, 3, 6, 2);
      ctx.fillRect(9, 10, 5, 2);
      ctx.fillStyle = '#6ab5c8';
      ctx.fillRect(3, 4, 3, 1);
      ctx.fillRect(10, 11, 3, 1);
      // water lily pad
      ctx.fillStyle = '#2a5228';
      ctx.fillRect(12, 3, 3, 3);
      ctx.fillStyle = '#c93d4a';
      ctx.fillRect(13, 3, 1, 1); // flower
    });

    // 12. House Red Tile Roof
    this.createCanvasTexture('tile_roof_red', 16, 16, (ctx) => {
      ctx.fillStyle = '#a33e2e';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#842e1f';
      ctx.fillRect(0, 5, 16, 1);
      ctx.fillRect(0, 11, 16, 1);
      ctx.fillRect(3, 0, 1, 5);
      ctx.fillRect(11, 0, 1, 5);
      ctx.fillRect(7, 6, 1, 5);
      ctx.fillRect(15, 6, 1, 5);
      ctx.fillStyle = '#bf5642';
      ctx.fillRect(0, 0, 16, 1);
      ctx.fillRect(0, 6, 16, 1);
      // shadow under shingles
      ctx.fillStyle = '#6e2416';
      ctx.fillRect(0, 4, 16, 1);
      ctx.fillRect(0, 10, 16, 1);
    });

    // 13. House Cedar Brown Shingle Roof
    this.createCanvasTexture('tile_roof_brown', 16, 16, (ctx) => {
      ctx.fillStyle = '#7a5136';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#5d3c22';
      ctx.fillRect(0, 4, 16, 1);
      ctx.fillRect(0, 9, 16, 1);
      ctx.fillRect(0, 14, 16, 1);
      ctx.fillRect(4, 0, 1, 4);
      ctx.fillRect(12, 0, 1, 4);
      ctx.fillRect(8, 5, 1, 4);
      ctx.fillStyle = '#9e7050';
      ctx.fillRect(0, 0, 16, 1);
      ctx.fillRect(0, 5, 16, 1);
    });

    // 14. House Slate Blue Shingle Roof
    this.createCanvasTexture('tile_roof_blue', 16, 16, (ctx) => {
      ctx.fillStyle = '#445e70';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#30444e';
      ctx.fillRect(0, 4, 16, 1);
      ctx.fillRect(0, 9, 16, 1);
      ctx.fillRect(0, 14, 16, 1);
      ctx.fillStyle = '#5e7a8c';
      ctx.fillRect(0, 0, 16, 1);
      ctx.fillRect(0, 5, 16, 1);
    });

    // 15. Wall Cream Wood
    this.createCanvasTexture('tile_wall_wood', 16, 16, (ctx) => {
      ctx.fillStyle = '#e0c898';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#c0a874';
      ctx.fillRect(0, 3, 16, 1);
      ctx.fillRect(0, 7, 16, 1);
      ctx.fillRect(0, 11, 16, 1);
      ctx.fillRect(0, 15, 16, 1);
      ctx.fillStyle = '#f0ddb0';
      ctx.fillRect(1, 0, 1, 16);
      ctx.fillRect(6, 0, 1, 3);
    });

    // 16. Wall Red Brick (Shop & Chimneys)
    this.createCanvasTexture('tile_wall_brick', 16, 16, (ctx) => {
      ctx.fillStyle = '#943325';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#d0c2ae'; // mortar
      ctx.fillRect(0, 7, 16, 1);
      ctx.fillRect(0, 15, 16, 1);
      ctx.fillRect(7, 0, 1, 7);
      ctx.fillRect(15, 8, 1, 7);
      ctx.fillRect(3, 8, 1, 7);
      ctx.fillStyle = '#7e2a1c';
      ctx.fillRect(0, 6, 16, 1);
      ctx.fillRect(0, 14, 16, 1);
    });

    // 17. Window (house)
    this.createCanvasTexture('tile_window', 16, 16, (ctx) => {
      ctx.fillStyle = '#e0c898';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#3c2a1c';
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillStyle = '#5688a0';
      ctx.fillRect(3, 3, 10, 10);
      // sunny reflection
      ctx.fillStyle = '#d4edff';
      ctx.fillRect(4, 4, 3, 3);
      // Curtains
      ctx.fillStyle = '#d4503e';
      ctx.fillRect(3, 3, 2, 10);
      ctx.fillRect(11, 3, 2, 10);
      // Pane dividers
      ctx.fillStyle = '#3c2a1c';
      ctx.fillRect(8, 3, 1, 10);
      ctx.fillRect(3, 7, 10, 1);
    });

    // 18. Shop Window (larger)
    this.createCanvasTexture('tile_window_shop', 16, 16, (ctx) => {
      ctx.fillStyle = '#943325';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#1b2d24';
      ctx.fillRect(2, 1, 12, 14);
      ctx.fillStyle = '#4d8295';
      ctx.fillRect(3, 2, 10, 12);
      ctx.fillStyle = '#c8e4ff';
      ctx.fillRect(3, 2, 4, 4);
      // sign in window
      ctx.fillStyle = '#f7de6a';
      ctx.fillRect(4, 8, 8, 4);
      ctx.fillStyle = '#1b2d24';
      ctx.fillRect(5, 9, 6, 2);
    });

    // 19. Front Door
    this.createCanvasTexture('tile_door', 16, 16, (ctx) => {
      ctx.fillStyle = '#e0c898';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#4e2e18';
      ctx.fillRect(2, 1, 12, 15);
      ctx.fillStyle = '#7a4226';
      ctx.fillRect(3, 2, 10, 14);
      // door panel details
      ctx.fillStyle = '#5c3118';
      ctx.fillRect(4, 3, 4, 5);
      ctx.fillRect(8, 3, 4, 5);
      ctx.fillRect(4, 9, 8, 5);
      // Brass knob
      ctx.fillStyle = '#f0be38';
      ctx.fillRect(10, 9, 2, 2);
      ctx.fillStyle = '#d4a028';
      ctx.fillRect(10, 10, 2, 1);
    });

    // 20. White Picket Fence
    this.createCanvasTexture('tile_fence', 16, 16, (ctx) => {
      ctx.fillStyle = '#5f8038'; // grass ground
      ctx.fillRect(0, 12, 16, 4);
      const pickets = [1, 5, 9, 13];
      pickets.forEach(px => {
        ctx.fillStyle = '#e8e2d0';
        ctx.fillRect(px, 2, 2, 12);
        // picket tip
        ctx.fillStyle = '#d6d0ba';
        ctx.fillRect(px + 1, 2, 1, 12);
      });
      // Rails
      ctx.fillStyle = '#d6d0ba';
      ctx.fillRect(0, 6, 16, 2);
      ctx.fillRect(0, 10, 16, 2);
    });

    // 21. Large Oak/Pine Tree (32x32 composite)
    this.createCanvasTexture('tree_large', 32, 32, (ctx) => {
      // Trunk
      ctx.fillStyle = '#573918';
      ctx.fillRect(13, 20, 6, 12);
      ctx.fillStyle = '#3d2810';
      ctx.fillRect(16, 20, 3, 12);
      // Root flare
      ctx.fillStyle = '#472e14';
      ctx.fillRect(11, 29, 10, 3);
      // Foliage layers (dark-to-light)
      ctx.fillStyle = '#1e4020';
      ctx.beginPath();
      ctx.arc(16, 14, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2a5e28';
      ctx.beginPath();
      ctx.arc(14, 12, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3d7a38';
      ctx.beginPath();
      ctx.arc(11, 9, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(20, 11, 6, 0, Math.PI * 2);
      ctx.fill();
      // Highlights
      ctx.fillStyle = '#5a9c52';
      ctx.fillRect(9, 5, 4, 4);
      ctx.fillRect(19, 7, 3, 3);
    });
  }

  // --- Props & Neighborhood Storytelling Objects ---

  createProps() {
    // 1. Garage Door (32x24 composite)
    this.createCanvasTexture('prop_garage', 32, 24, (ctx) => {
      ctx.fillStyle = '#3e3220';
      ctx.fillRect(0, 0, 32, 24);
      ctx.fillStyle = '#dbd5c5';
      ctx.fillRect(2, 2, 28, 22);
      ctx.fillStyle = '#b0a895';
      ctx.fillRect(2, 7, 28, 1);
      ctx.fillRect(2, 12, 28, 1);
      ctx.fillRect(2, 17, 28, 1);
      // Glass windows in top row
      ctx.fillStyle = '#8ab4c4';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(4 + i * 6, 3, 5, 3);
      }
      ctx.fillStyle = '#c4e0ea';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(4 + i * 6, 3, 2, 1);
      }
    });

    // 2. Oakwood Park Sign
    this.createCanvasTexture('prop_park_sign', 32, 16, (ctx) => {
      ctx.fillStyle = '#4c3018';
      ctx.fillRect(4, 9, 2, 7);
      ctx.fillRect(26, 9, 2, 7);
      ctx.fillStyle = '#d8c89e';
      ctx.fillRect(2, 1, 28, 9);
      ctx.strokeStyle = '#4c3018';
      ctx.lineWidth = 1;
      ctx.strokeRect(2, 1, 28, 9);
      ctx.fillStyle = '#2e1a0a';
      ctx.font = 'bold 5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('OAKWOOD', 16, 5);
      ctx.fillText('PARK', 16, 9);
    });

    // 3. Swimming White Duck in Pond
    this.createCanvasTexture('prop_duck', 16, 16, (ctx) => {
      // water ripple
      ctx.fillStyle = '#4d9aaa';
      ctx.fillRect(3, 12, 10, 2);
      // body
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, 9, 4, 0, Math.PI * 2);
      ctx.fill();
      // head
      ctx.beginPath();
      ctx.arc(11, 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e8922a';
      ctx.fillRect(13, 6, 2, 1);
      ctx.fillStyle = '#111111';
      ctx.fillRect(12, 5, 1, 1);
      // wing line
      ctx.fillStyle = '#ddd';
      ctx.fillRect(6, 9, 4, 1);
    });

    // 4. Wooden Pier / Dock on Pond
    this.createCanvasTexture('prop_dock', 16, 24, (ctx) => {
      ctx.fillStyle = '#7a5230';
      ctx.fillRect(2, 0, 12, 24);
      ctx.fillStyle = '#533618';
      ctx.fillRect(2, 4, 12, 1);
      ctx.fillRect(2, 9, 12, 1);
      ctx.fillRect(2, 14, 12, 1);
      ctx.fillRect(2, 19, 12, 1);
      ctx.fillStyle = '#38220e';
      ctx.fillRect(1, 0, 2, 24);
      ctx.fillRect(13, 0, 2, 24);
      // water at base
      ctx.fillStyle = '#2e657a';
      ctx.fillRect(0, 22, 16, 2);
    });

    // 5. Overgrown Hedge
    this.createCanvasTexture('prop_hedge_overgrown', 16, 16, (ctx) => {
      ctx.fillStyle = '#234a1f';
      ctx.fillRect(0, 3, 16, 13);
      ctx.fillStyle = '#336e2c';
      ctx.fillRect(1, 2, 14, 13);
      ctx.fillStyle = '#4e9245';
      [[2,1],[5,0],[9,1],[13,0],[3,5],[8,4],[12,6],[6,9],[10,11]].forEach(([x,y]) => ctx.fillRect(x, y, 2, 2));
      ctx.fillStyle = '#72c464';
      ctx.fillRect(4, 0, 1, 2);
      ctx.fillRect(12, 0, 2, 1);
      ctx.fillRect(9, 3, 1, 2);
    });

    // 6. Trimmed Hedge
    this.createCanvasTexture('prop_hedge_trimmed', 16, 16, (ctx) => {
      ctx.fillStyle = '#1e4018';
      ctx.fillRect(0, 4, 16, 12);
      ctx.fillStyle = '#2c5e24';
      ctx.fillRect(1, 3, 14, 11);
      ctx.fillStyle = '#3e7a34';
      ctx.fillRect(1, 3, 14, 4);
      ctx.fillStyle = '#52a045';
      ctx.fillRect(2, 3, 12, 1);
      ctx.fillRect(2, 4, 12, 1);
    });

    // 7. Full Trash Can
    this.createCanvasTexture('prop_trash_full', 16, 16, (ctx) => {
      ctx.fillStyle = '#485058';
      ctx.fillRect(3, 5, 10, 10);
      ctx.fillStyle = '#7e8c96';
      ctx.fillRect(4, 5, 8, 9);
      // garbage bag bulging out
      ctx.fillStyle = '#181c1e';
      ctx.fillRect(5, 2, 6, 4);
      ctx.fillStyle = '#2a2e32';
      ctx.fillRect(6, 1, 4, 2);
      // Lid ajar
      ctx.fillStyle = '#92a0ac';
      ctx.fillRect(2, 3, 12, 2);
      ctx.fillStyle = '#aabac4';
      ctx.fillRect(3, 3, 10, 1);
    });

    // 8. Empty Trash Can
    this.createCanvasTexture('prop_trash_empty', 16, 16, (ctx) => {
      ctx.fillStyle = '#485058';
      ctx.fillRect(3, 5, 10, 10);
      ctx.fillStyle = '#7e8c96';
      ctx.fillRect(4, 5, 8, 9);
      ctx.fillStyle = '#92a0ac';
      ctx.fillRect(2, 4, 12, 2);
      ctx.fillStyle = '#aabac4';
      ctx.fillRect(3, 4, 10, 1);
    });

    // 9. Mrs. Miller's Parcel
    this.createCanvasTexture('prop_parcel', 16, 16, (ctx) => {
      ctx.fillStyle = '#7a4e2a';
      ctx.fillRect(3, 5, 10, 8);
      ctx.fillStyle = '#a87850';
      ctx.fillRect(4, 6, 8, 6);
      // twine strings
      ctx.fillStyle = '#e8d8b0';
      ctx.fillRect(7, 5, 2, 8);
      ctx.fillRect(3, 8, 10, 2);
      // stamp
      ctx.fillStyle = '#b04038';
      ctx.fillRect(9, 6, 2, 2);
      ctx.fillStyle = '#e06050';
      ctx.fillRect(9, 6, 1, 1);
    });

    // 10. Vintage Mailbox
    this.createCanvasTexture('prop_mailbox', 16, 16, (ctx) => {
      ctx.fillStyle = '#503015';
      ctx.fillRect(7, 8, 2, 8);
      // Base plate
      ctx.fillStyle = '#3a2a10';
      ctx.fillRect(6, 14, 4, 2);
      // Metal mailbox body
      ctx.fillStyle = '#30383e';
      ctx.fillRect(4, 3, 8, 5);
      ctx.fillStyle = '#485560';
      ctx.fillRect(5, 4, 6, 2);
      // Rounded top
      ctx.fillStyle = '#30383e';
      ctx.fillRect(5, 2, 6, 2);
      ctx.fillRect(6, 1, 4, 2);
      // Red outgoing flag
      ctx.fillStyle = '#c22a1a';
      ctx.fillRect(11, 2, 2, 4);
      ctx.fillStyle = '#e84030';
      ctx.fillRect(11, 2, 2, 1);
    });

    // 11. Vintage Bicycle
    this.createCanvasTexture('prop_bicycle', 20, 16, (ctx) => {
      // Wheels (outline)
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(4, 11, 4, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(15, 11, 4, 0, Math.PI * 2); ctx.stroke();
      // Hub
      ctx.fillStyle = '#888';
      ctx.fillRect(3, 10, 2, 2);
      ctx.fillRect(14, 10, 2, 2);
      // Frame (cherry red)
      ctx.strokeStyle = '#c22a1a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(4, 11); ctx.lineTo(9, 7); ctx.lineTo(15, 11);
      ctx.moveTo(9, 7); ctx.lineTo(10, 11); ctx.lineTo(4, 11);
      ctx.stroke();
      // Handlebars & seat
      ctx.fillStyle = '#222';
      ctx.fillRect(7, 6, 3, 1);
      ctx.fillRect(13, 4, 4, 1);
      ctx.fillStyle = '#442';
      ctx.fillRect(8, 7, 2, 1);
    });

    // 12. Streetlight (Vintage 1960s Iron Pole & Lantern)
    this.createCanvasTexture('prop_streetlight', 16, 32, (ctx) => {
      ctx.fillStyle = '#22291e';
      ctx.fillRect(7, 10, 2, 22);
      ctx.fillRect(5, 30, 6, 2);
      // Ornate base
      ctx.fillRect(4, 30, 8, 2);
      // Curved arm
      ctx.fillRect(7, 4, 6, 2);
      ctx.fillRect(11, 6, 4, 2);
      // Lantern body
      ctx.fillStyle = '#1c211a';
      ctx.fillRect(11, 7, 4, 5);
      // Glowing glass
      ctx.fillStyle = '#fce490';
      ctx.fillRect(12, 8, 3, 3);
      ctx.fillStyle = '#fff5c0';
      ctx.fillRect(12, 8, 2, 1);
    });

    // 13. Park Bench
    this.createCanvasTexture('prop_bench', 24, 16, (ctx) => {
      // Seat slats
      ctx.fillStyle = '#7a3c1c';
      ctx.fillRect(2, 6, 20, 2);
      ctx.fillRect(2, 9, 20, 2);
      // Backrest
      ctx.fillRect(2, 3, 20, 2);
      // Legs
      ctx.fillStyle = '#242824';
      ctx.fillRect(4, 3, 2, 12);
      ctx.fillRect(18, 3, 2, 12);
      // Foot rest
      ctx.fillRect(3, 14, 18, 1);
    });

    // 14. 1969 Transistor Radio (June's Radio)
    this.createCanvasTexture('prop_radio', 16, 16, (ctx) => {
      ctx.fillStyle = '#222830';
      ctx.fillRect(2, 5, 12, 9);
      ctx.fillStyle = '#c08a2a'; // chrome/brass body
      ctx.fillRect(3, 6, 10, 7);
      // Speaker grille
      ctx.fillStyle = '#161c22';
      ctx.fillRect(4, 7, 4, 4);
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#334';
        ctx.fillRect(4, 8 + i, 4, 1);
      }
      // Tuner dial
      ctx.fillStyle = '#eedcaa';
      ctx.fillRect(9, 7, 3, 2);
      ctx.fillStyle = '#222';
      ctx.fillRect(10, 7, 1, 2);
      // Antenna
      ctx.fillStyle = '#888';
      ctx.fillRect(3, 2, 1, 4);
    });

    // 15. Records Store Front Awning & Banner
    this.createCanvasTexture('prop_shop_facade', 64, 32, (ctx) => {
      ctx.fillStyle = '#8c3020';
      ctx.fillRect(0, 0, 64, 12);
      // Sign
      ctx.fillStyle = '#142018';
      ctx.fillRect(4, 2, 56, 9);
      ctx.strokeStyle = '#e8b43a';
      ctx.lineWidth = 1;
      ctx.strokeRect(4, 2, 56, 9);
      ctx.fillStyle = '#f0c242';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('★ RECORDS ★', 32, 9);
      // Striped Awning (Red & Cream)
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = (i % 2 === 0) ? '#ac3020' : '#f0e8d0';
        ctx.fillRect(i * 8, 12, 8, 8);
      }
      // Awning fringe
      ctx.fillStyle = '#8c2018';
      ctx.fillRect(0, 19, 64, 1);
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(i * 8, 19, 4, 2);
      }
      // Window area
      ctx.fillStyle = '#1e2e22';
      ctx.fillRect(4, 22, 56, 10);
      ctx.fillStyle = '#d4c8a8';
      ctx.font = 'bold 4px monospace';
      ctx.fillText('CASSETTES · POSTERS · HI-FI', 32, 29);
    });

    // 16. Basketball Hoop on Garage
    this.createCanvasTexture('prop_hoop', 16, 20, (ctx) => {
      // Backboard
      ctx.fillStyle = '#e8e4d8';
      ctx.fillRect(3, 1, 10, 8);
      ctx.strokeStyle = '#c22a1a';
      ctx.lineWidth = 1;
      ctx.strokeRect(3, 1, 10, 8);
      // Square target
      ctx.strokeStyle = '#c22a1a';
      ctx.strokeRect(5, 3, 6, 4);
      // Rim (orange)
      ctx.fillStyle = '#e05c1a';
      ctx.fillRect(5, 9, 6, 2);
      // Net strings
      ctx.fillStyle = '#ddd';
      ctx.fillRect(6, 11, 1, 4);
      ctx.fillRect(9, 11, 1, 4);
      ctx.fillRect(5, 13, 6, 1);
    });

    // 17. Clothesline with Laundry
    this.createCanvasTexture('prop_clothesline', 32, 16, (ctx) => {
      // Posts
      ctx.fillStyle = '#4a3010';
      ctx.fillRect(1, 2, 2, 14);
      ctx.fillRect(29, 2, 2, 14);
      // Line
      ctx.strokeStyle = '#c8c4c0';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(2, 4); ctx.lineTo(30, 4); ctx.stroke();
      // Clothes hanging
      ctx.fillStyle = '#d64e3a'; ctx.fillRect(5, 4, 5, 7);  // red shirt
      ctx.fillStyle = '#c22a36'; ctx.fillRect(5, 4, 5, 1);
      ctx.fillStyle = '#3a5e8a'; ctx.fillRect(13, 4, 4, 9); // jeans
      ctx.fillStyle = '#2a4a6a'; ctx.fillRect(14, 7, 2, 2);
      ctx.fillStyle = '#eeeadc'; ctx.fillRect(20, 4, 7, 6); // white shirt
      ctx.fillStyle = '#e0dccc'; ctx.fillRect(20, 4, 7, 1);
      // Clothespins
      ctx.fillStyle = '#8a6a40';
      [5, 13, 20].forEach(x => {
        ctx.fillRect(x, 3, 2, 2);
        ctx.fillRect(x + 2, 3, 2, 2);
      });
    });

    // 18. Newspaper Roll
    this.createCanvasTexture('prop_newspaper', 16, 16, (ctx) => {
      ctx.fillStyle = '#ece8d4';
      ctx.fillRect(3, 7, 10, 4);
      // Text lines
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(5, 8, 6, 1);
      ctx.fillRect(5, 10, 4, 1);
      // Rubber band
      ctx.fillStyle = '#3060a0';
      ctx.fillRect(7, 6, 2, 6);
    });

    // 19. Swing Set in Park
    this.createCanvasTexture('prop_swing_set', 32, 24, (ctx) => {
      // Frame
      ctx.fillStyle = '#808888';
      ctx.fillRect(2, 2, 2, 20);  // left post
      ctx.fillRect(28, 2, 2, 20); // right post
      ctx.fillRect(2, 2, 28, 2);  // top bar
      // Angled supports
      ctx.fillStyle = '#707878';
      ctx.fillRect(1, 18, 4, 2);
      ctx.fillRect(27, 18, 4, 2);
      // Swing chains
      ctx.fillStyle = '#5a5a5a';
      ctx.fillRect(10, 2, 1, 12);
      ctx.fillRect(21, 2, 1, 12);
      // Swing seat
      ctx.fillStyle = '#5a3820';
      ctx.fillRect(8, 14, 6, 2);
      ctx.fillRect(19, 14, 6, 2);
    });

    // 20. Picnic Table in Park
    this.createCanvasTexture('prop_picnic_table', 24, 16, (ctx) => {
      // Table top slats
      ctx.fillStyle = '#7a5028';
      ctx.fillRect(2, 4, 20, 3);
      ctx.fillRect(2, 8, 20, 3);
      // Benches
      ctx.fillStyle = '#8a6030';
      ctx.fillRect(0, 10, 7, 2);
      ctx.fillRect(17, 10, 7, 2);
      // Legs
      ctx.fillStyle = '#3c2810';
      ctx.fillRect(4, 3, 2, 12);
      ctx.fillRect(18, 3, 2, 12);
      // Cross brace
      ctx.fillRect(2, 10, 20, 1);
    });

    // 21. Flower Pot (for porches)
    this.createCanvasTexture('prop_flower_pot', 8, 12, (ctx) => {
      // Pot
      ctx.fillStyle = '#a84828';
      ctx.fillRect(1, 6, 6, 6);
      ctx.fillStyle = '#c85a32';
      ctx.fillRect(1, 6, 6, 1);
      ctx.fillStyle = '#8a3818';
      ctx.fillRect(0, 9, 8, 1);
      // Soil
      ctx.fillStyle = '#3a2010';
      ctx.fillRect(2, 5, 4, 2);
      // Flower
      ctx.fillStyle = '#e04050';
      ctx.fillRect(3, 2, 2, 3);
      ctx.fillStyle = '#f88090';
      ctx.fillRect(3, 2, 1, 1);
      // Leaves
      ctx.fillStyle = '#306020';
      ctx.fillRect(2, 4, 1, 2);
      ctx.fillRect(5, 3, 1, 3);
    });

    // 22. Lemonade Stand
    this.createCanvasTexture('prop_lemonade_stand', 32, 24, (ctx) => {
      // Legs
      ctx.fillStyle = '#7a5028';
      ctx.fillRect(2, 14, 2, 10);
      ctx.fillRect(28, 14, 2, 10);
      // Awning
      ctx.fillStyle = '#f0d020';
      ctx.fillRect(0, 4, 32, 4);
      ctx.fillStyle = '#c8aa10';
      ctx.fillRect(0, 7, 32, 1);
      // Awning fringe
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = (i % 2 === 0) ? '#f0d020' : '#e0c010';
        ctx.fillRect(i * 4, 8, 4, 2);
      }
      // Counter top
      ctx.fillStyle = '#e8e0c0';
      ctx.fillRect(2, 12, 28, 4);
      // Pitcher
      ctx.fillStyle = '#f0e060';
      ctx.fillRect(12, 8, 8, 8);
      ctx.fillStyle = '#ffe860';
      ctx.fillRect(13, 9, 5, 4);
      // Sign
      ctx.fillStyle = '#c80020';
      ctx.font = 'bold 4px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('10¢', 16, 4);
    });

    // 23. Push Mower
    this.createCanvasTexture('prop_mower', 16, 12, (ctx) => {
      // Wheels
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(2, 7, 4, 4);
      ctx.fillRect(10, 7, 4, 4);
      ctx.fillStyle = '#666';
      ctx.fillRect(3, 8, 2, 2);
      ctx.fillRect(11, 8, 2, 2);
      // Body/deck
      ctx.fillStyle = '#486020';
      ctx.fillRect(2, 4, 12, 5);
      ctx.fillStyle = '#5c7c28';
      ctx.fillRect(3, 4, 10, 2);
      // Handle
      ctx.fillStyle = '#888';
      ctx.fillRect(4, 1, 1, 5);
      ctx.fillRect(11, 1, 1, 5);
      ctx.fillRect(4, 1, 8, 1);
    });
  }

  // --- 1969 American Vintage Cars ---

  createVehicles() {
    // 1. 1969 Cherry Red Muscle Car
    this.createCanvasTexture('car_muscle_red', 36, 18, (ctx) => {
      ctx.fillStyle = '#8a1e18';
      ctx.fillRect(2, 5, 32, 9);
      ctx.fillStyle = '#b82820';
      ctx.fillRect(8, 2, 18, 6);
      // Windshields
      ctx.fillStyle = '#3a4450';
      ctx.fillRect(10, 3, 5, 4);
      ctx.fillRect(19, 3, 6, 4);
      // Chrome trim
      ctx.fillStyle = '#d8e0e4';
      ctx.fillRect(0, 10, 2, 3);
      ctx.fillRect(34, 10, 2, 3);
      ctx.fillRect(2, 13, 32, 1);
      // Grill
      ctx.fillStyle = '#dce4e8';
      ctx.fillRect(0, 7, 4, 4);
      ctx.fillStyle = '#aabcc4';
      ctx.fillRect(1, 8, 2, 2);
      // Wheels (detailed)
      ctx.fillStyle = '#141414';
      ctx.fillRect(5, 12, 7, 5);
      ctx.fillRect(23, 12, 7, 5);
      ctx.fillStyle = '#555';
      ctx.fillRect(7, 13, 3, 3);
      ctx.fillRect(25, 13, 3, 3);
    });

    // 2. 1969 Turquoise Blue Family Sedan
    this.createCanvasTexture('car_sedan_teal', 36, 18, (ctx) => {
      ctx.fillStyle = '#225460';
      ctx.fillRect(2, 5, 32, 9);
      ctx.fillStyle = '#307080';
      ctx.fillRect(7, 2, 20, 6);
      ctx.fillStyle = '#88ccd6';
      ctx.fillRect(9, 3, 6, 4);
      ctx.fillRect(18, 3, 7, 4);
      ctx.fillStyle = '#c8d4e4';
      ctx.fillRect(9, 3, 2, 2);
      ctx.fillStyle = '#d8e4e8';
      ctx.fillRect(0, 10, 2, 3);
      ctx.fillRect(34, 10, 2, 3);
      ctx.fillRect(2, 13, 32, 1);
      ctx.fillStyle = '#141414';
      ctx.fillRect(5, 12, 7, 5);
      ctx.fillRect(23, 12, 7, 5);
      ctx.fillStyle = '#555';
      ctx.fillRect(7, 13, 3, 3);
      ctx.fillRect(25, 13, 3, 3);
    });

    // 3. 1969 Woodgrain Station Wagon
    this.createCanvasTexture('car_wagon_wood', 38, 18, (ctx) => {
      ctx.fillStyle = '#b08a50';
      ctx.fillRect(2, 5, 34, 9);
      ctx.fillStyle = '#6a3c1a';
      ctx.fillRect(8, 7, 21, 5);
      // Woodgrain lines
      ctx.fillStyle = '#7a4c2a';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(8, 8 + i * 1, 21, 1);
      }
      ctx.fillStyle = '#d2aa70';
      ctx.fillRect(7, 2, 23, 6);
      ctx.fillStyle = '#82bac8';
      ctx.fillRect(9, 3, 6, 4);
      ctx.fillRect(17, 3, 6, 4);
      ctx.fillRect(24, 3, 5, 4);
      ctx.fillStyle = '#141414';
      ctx.fillRect(5, 12, 7, 5);
      ctx.fillRect(25, 12, 7, 5);
    });

    // 4. 1969 Yellow Cruiser
    this.createCanvasTexture('car_cruiser_yellow', 36, 18, (ctx) => {
      ctx.fillStyle = '#a87c20';
      ctx.fillRect(2, 5, 32, 9);
      ctx.fillStyle = '#d4a028';
      ctx.fillRect(7, 2, 19, 6);
      ctx.fillStyle = '#3a424a';
      ctx.fillRect(9, 3, 6, 4);
      ctx.fillRect(18, 3, 6, 4);
      ctx.fillStyle = '#d8e0e4';
      ctx.fillRect(0, 10, 2, 3);
      ctx.fillRect(34, 10, 2, 3);
      ctx.fillRect(2, 13, 32, 1);
      ctx.fillStyle = '#141414';
      ctx.fillRect(5, 12, 7, 5);
      ctx.fillRect(23, 12, 7, 5);
      ctx.fillStyle = '#555';
      ctx.fillRect(7, 13, 3, 3);
      ctx.fillRect(25, 13, 3, 3);
    });
  }

  // --- Character Sprites (16x24) ---

  createPlayerSprites() {
    const drawPlayer = (ctx, stepFrame = 0, dir = 'down') => {
      ctx.clearRect(0, 0, 16, 24);

      if (dir === 'down') {
        // Hair
        ctx.fillStyle = '#4e2c14';
        ctx.fillRect(4, 2, 8, 6);
        ctx.fillRect(3, 4, 10, 4);
        // Sideburns (1969!)
        ctx.fillRect(3, 7, 1, 3);
        ctx.fillRect(12, 7, 1, 3);
        // Face
        ctx.fillStyle = '#e8c8a4';
        ctx.fillRect(5, 6, 6, 4);
        ctx.fillStyle = '#241608';
        ctx.fillRect(6, 7, 1, 1);
        ctx.fillRect(9, 7, 1, 1);
        // Smile
        ctx.fillStyle = '#c04040';
        ctx.fillRect(7, 9, 2, 1);
        // Mustard Yellow Shirt (1969)
        ctx.fillStyle = '#d09820';
        ctx.fillRect(4, 10, 8, 6);
        // Belt
        ctx.fillStyle = '#2c1a10';
        ctx.fillRect(4, 15, 8, 1);
        ctx.fillStyle = '#c0900a';
        ctx.fillRect(7, 15, 2, 1);
        // Denim bell-bottoms
        ctx.fillStyle = '#344e6c';
        if (stepFrame === 0) {
          ctx.fillRect(4, 16, 3, 5); ctx.fillRect(9, 16, 3, 5);
          ctx.fillStyle = '#3c3010'; ctx.fillRect(3, 21, 4, 3); ctx.fillRect(9, 21, 4, 3);
        } else if (stepFrame === 1) {
          ctx.fillRect(4, 16, 3, 4); ctx.fillRect(9, 15, 3, 6);
          ctx.fillStyle = '#3c3010'; ctx.fillRect(3, 20, 4, 3); ctx.fillRect(9, 21, 4, 3);
        } else {
          ctx.fillRect(4, 15, 3, 6); ctx.fillRect(9, 16, 3, 4);
          ctx.fillStyle = '#3c3010'; ctx.fillRect(3, 21, 4, 3); ctx.fillRect(9, 20, 4, 3);
        }
      } else if (dir === 'up') {
        ctx.fillStyle = '#4e2c14';
        ctx.fillRect(4, 2, 8, 7);
        ctx.fillRect(3, 4, 10, 5);
        ctx.fillRect(3, 7, 1, 3);
        ctx.fillRect(12, 7, 1, 3);
        ctx.fillStyle = '#d09820';
        ctx.fillRect(4, 10, 8, 6);
        ctx.fillStyle = '#2c1a10';
        ctx.fillRect(4, 15, 8, 1);
        ctx.fillStyle = '#344e6c';
        if (stepFrame === 0) {
          ctx.fillRect(4, 16, 3, 5); ctx.fillRect(9, 16, 3, 5);
          ctx.fillStyle = '#3c3010'; ctx.fillRect(4, 21, 3, 3); ctx.fillRect(9, 21, 3, 3);
        } else if (stepFrame === 1) {
          ctx.fillRect(4, 15, 3, 6); ctx.fillRect(9, 16, 3, 4);
          ctx.fillStyle = '#3c3010'; ctx.fillRect(4, 21, 3, 3); ctx.fillRect(9, 20, 3, 3);
        } else {
          ctx.fillRect(4, 16, 3, 4); ctx.fillRect(9, 15, 3, 6);
          ctx.fillStyle = '#3c3010'; ctx.fillRect(4, 20, 3, 3); ctx.fillRect(9, 21, 3, 3);
        }
      } else if (dir === 'left') {
        ctx.fillStyle = '#4e2c14';
        ctx.fillRect(4, 2, 8, 6);
        ctx.fillRect(3, 4, 5, 5);
        ctx.fillRect(3, 7, 1, 4);
        ctx.fillStyle = '#e8c8a4';
        ctx.fillRect(3, 6, 4, 4);
        ctx.fillStyle = '#241608';
        ctx.fillRect(4, 7, 1, 1);
        ctx.fillStyle = '#d09820';
        ctx.fillRect(4, 10, 7, 6);
        ctx.fillStyle = '#2c1a10';
        ctx.fillRect(4, 15, 7, 1);
        ctx.fillStyle = '#344e6c';
        if (stepFrame === 0) {
          ctx.fillRect(5, 16, 5, 5);
          ctx.fillStyle = '#3c3010'; ctx.fillRect(3, 21, 6, 3);
        } else {
          ctx.fillRect(4, 16, 3, 5); ctx.fillRect(8, 16, 3, 4);
          ctx.fillStyle = '#3c3010'; ctx.fillRect(3, 21, 4, 3); ctx.fillRect(8, 20, 4, 3);
        }
      } else if (dir === 'right') {
        ctx.fillStyle = '#4e2c14';
        ctx.fillRect(4, 2, 8, 6);
        ctx.fillRect(8, 4, 5, 5);
        ctx.fillRect(12, 7, 1, 4);
        ctx.fillStyle = '#e8c8a4';
        ctx.fillRect(9, 6, 4, 4);
        ctx.fillStyle = '#241608';
        ctx.fillRect(11, 7, 1, 1);
        ctx.fillStyle = '#d09820';
        ctx.fillRect(5, 10, 7, 6);
        ctx.fillStyle = '#2c1a10';
        ctx.fillRect(5, 15, 7, 1);
        ctx.fillStyle = '#344e6c';
        if (stepFrame === 0) {
          ctx.fillRect(6, 16, 5, 5);
          ctx.fillStyle = '#3c3010'; ctx.fillRect(7, 21, 6, 3);
        } else {
          ctx.fillRect(5, 16, 3, 4); ctx.fillRect(9, 16, 3, 5);
          ctx.fillStyle = '#3c3010'; ctx.fillRect(4, 20, 4, 3); ctx.fillRect(9, 21, 4, 3);
        }
      }
    };

    ['down', 'up', 'left', 'right'].forEach(dir => {
      [0, 1, 2].forEach(step => {
        this.createCanvasTexture(`player_${dir}_${step}`, 16, 24, (ctx) => {
          drawPlayer(ctx, step, dir);
        });
      });
    });
  }

  // --- NPCs ---

  createNPCSprites() {
    // 1. Mom: Floral apron, bouffant hair
    this.createCanvasTexture('npc_mom', 16, 24, (ctx) => {
      // Hair (bouffant)
      ctx.fillStyle = '#4e2c10';
      ctx.fillRect(3, 2, 10, 7);
      ctx.fillRect(2, 4, 12, 5);
      // Hair highlight
      ctx.fillStyle = '#704830';
      ctx.fillRect(5, 2, 4, 2);
      // Face
      ctx.fillStyle = '#e8c8a4';
      ctx.fillRect(5, 6, 6, 4);
      ctx.fillStyle = '#201008';
      ctx.fillRect(6, 7, 1, 1); ctx.fillRect(9, 7, 1, 1);
      ctx.fillStyle = '#c04040';
      ctx.fillRect(7, 9, 2, 1);
      // Dress (floral)
      ctx.fillStyle = '#c24a3c';
      ctx.fillRect(4, 10, 8, 11);
      // Apron
      ctx.fillStyle = '#ece8d4';
      ctx.fillRect(5, 11, 6, 9);
      // Apron pocket with flower
      ctx.fillStyle = '#dcd8c0';
      ctx.fillRect(6, 16, 4, 3);
      ctx.fillStyle = '#e04060';
      ctx.fillRect(7, 17, 2, 1);
      ctx.fillStyle = '#208030';
      ctx.fillRect(7, 18, 1, 1);
      // Shoes
      ctx.fillStyle = '#302010';
      ctx.fillRect(4, 21, 3, 3); ctx.fillRect(9, 21, 3, 3);
    });

    // 2. Mrs. Miller: Mint cardigan, spectacles, white hair
    this.createCanvasTexture('npc_mrs_miller', 16, 24, (ctx) => {
      ctx.fillStyle = '#b8bcc0';
      ctx.fillRect(6, 1, 4, 3);
      ctx.fillRect(4, 3, 8, 6);
      ctx.fillStyle = '#d4d8dc';
      ctx.fillRect(5, 2, 5, 3);
      ctx.fillStyle = '#e4c8b0';
      ctx.fillRect(5, 6, 6, 4);
      // Glasses
      ctx.fillStyle = '#6a5840';
      ctx.fillRect(5, 7, 3, 2); ctx.fillRect(8, 7, 3, 2);
      ctx.fillRect(8, 7, 1, 1);
      ctx.fillStyle = '#726048';
      ctx.fillRect(5, 7, 1, 1); ctx.fillRect(10, 7, 1, 1);
      // Cardigan
      ctx.fillStyle = '#60907a';
      ctx.fillRect(4, 10, 8, 6);
      ctx.fillStyle = '#508068';
      ctx.fillRect(7, 10, 2, 6);
      // Skirt
      ctx.fillStyle = '#3a5050';
      ctx.fillRect(4, 16, 8, 5);
      ctx.fillStyle = '#303c40';
      ctx.fillRect(5, 21, 2, 3); ctx.fillRect(9, 21, 2, 3);
    });

    // 3. June: Auburn hair, green retro top
    this.createCanvasTexture('npc_june', 16, 24, (ctx) => {
      ctx.fillStyle = '#8a3c18';
      ctx.fillRect(4, 2, 8, 7);
      ctx.fillRect(3, 4, 10, 8);
      ctx.fillStyle = '#b45030';
      ctx.fillRect(4, 2, 4, 4);
      ctx.fillStyle = '#e8b890';
      ctx.fillRect(5, 6, 6, 4);
      ctx.fillStyle = '#181410';
      ctx.fillRect(6, 7, 1, 1); ctx.fillRect(9, 7, 1, 1);
      ctx.fillStyle = '#c04048';
      ctx.fillRect(7, 9, 2, 1);
      // Earring
      ctx.fillStyle = '#e8c030';
      ctx.fillRect(4, 8, 1, 1);
      // Green top with pattern
      ctx.fillStyle = '#3a6e48';
      ctx.fillRect(4, 10, 8, 6);
      ctx.fillStyle = '#4a8858';
      ctx.fillRect(5, 11, 6, 2);
      // Bell-bottom jeans
      ctx.fillStyle = '#805820';
      ctx.fillRect(4, 16, 3, 5); ctx.fillRect(9, 16, 3, 5);
      ctx.fillStyle = '#5a3c10';
      ctx.fillRect(3, 21, 4, 3); ctx.fillRect(9, 21, 4, 3);
    });

    // 4. Mr. Vinyl: 1969 shopkeeper with beard and thick glasses
    this.createCanvasTexture('npc_mr_vinyl', 16, 24, (ctx) => {
      ctx.fillStyle = '#342014';
      ctx.fillRect(4, 2, 8, 5);
      ctx.fillStyle = '#dca070';
      ctx.fillRect(5, 5, 6, 5);
      // Thick glasses (horn-rimmed)
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(5, 6, 3, 2); ctx.fillRect(8, 6, 3, 2);
      ctx.fillStyle = '#6888a8';
      ctx.fillRect(5, 6, 2, 1); ctx.fillRect(8, 6, 2, 1);
      // Beard
      ctx.fillStyle = '#342014';
      ctx.fillRect(5, 8, 6, 3);
      ctx.fillStyle = '#5a3a28';
      ctx.fillRect(6, 8, 4, 2);
      // Denim shirt
      ctx.fillStyle = '#3c6082';
      ctx.fillRect(4, 11, 8, 6);
      ctx.fillStyle = '#507898';
      ctx.fillRect(5, 12, 2, 4);
      // Jeans
      ctx.fillStyle = '#505870';
      ctx.fillRect(5, 17, 6, 4);
      ctx.fillStyle = '#181810';
      ctx.fillRect(4, 21, 3, 3); ctx.fillRect(9, 21, 3, 3);
    });

    // 5. Timmy: Baseball cap, excited kid
    this.createCanvasTexture('npc_timmy', 16, 24, (ctx) => {
      // Cap
      ctx.fillStyle = '#2a5c2a';
      ctx.fillRect(4, 2, 8, 4);
      ctx.fillRect(3, 4, 4, 1);
      ctx.fillStyle = '#3a7c3a';
      ctx.fillRect(4, 2, 8, 2);
      ctx.fillStyle = '#e8b890';
      ctx.fillRect(5, 6, 6, 4);
      ctx.fillStyle = '#140c08';
      ctx.fillRect(6, 7, 1, 1); ctx.fillRect(9, 7, 1, 1);
      ctx.fillStyle = '#c04040';
      ctx.fillRect(7, 9, 2, 1);
      // Orange t-shirt (typical kid)
      ctx.fillStyle = '#cc5020';
      ctx.fillRect(4, 10, 8, 6);
      ctx.fillStyle = '#e86030';
      ctx.fillRect(5, 10, 6, 2);
      // Shorts
      ctx.fillStyle = '#305080';
      ctx.fillRect(5, 16, 6, 4);
      ctx.fillStyle = '#4a5020';
      ctx.fillRect(4, 20, 4, 4); ctx.fillRect(8, 20, 4, 4);
    });

    // 6. Neighbor Bob: Flannel shirt, mustache
    this.createCanvasTexture('npc_neighbor_bob', 16, 24, (ctx) => {
      ctx.fillStyle = '#5a3c22';
      ctx.fillRect(4, 2, 8, 4);
      ctx.fillStyle = '#d8a870';
      ctx.fillRect(5, 6, 6, 4);
      // Mustache
      ctx.fillStyle = '#7a5830';
      ctx.fillRect(5, 8, 6, 2);
      ctx.fillStyle = '#9a6c3c';
      ctx.fillRect(6, 8, 4, 1);
      ctx.fillStyle = '#181008';
      ctx.fillRect(6, 7, 1, 1); ctx.fillRect(9, 7, 1, 1);
      // Plaid/flannel shirt
      ctx.fillStyle = '#983020';
      ctx.fillRect(4, 10, 8, 6);
      ctx.fillStyle = '#c84030';
      ctx.fillRect(5, 10, 6, 1);
      ctx.fillStyle = '#2040a0';
      ctx.fillRect(5, 11, 1, 5);
      ctx.fillRect(10, 11, 1, 5);
      // Work pants
      ctx.fillStyle = '#305058';
      ctx.fillRect(5, 16, 6, 5);
      ctx.fillStyle = '#303030';
      ctx.fillRect(4, 21, 4, 3); ctx.fillRect(8, 21, 4, 3);
    });

    // 7. Dog Buddy (cute hound dog)
    this.createCanvasTexture('npc_dog_buddy', 16, 16, (ctx) => {
      // Body
      ctx.fillStyle = '#b88038';
      ctx.fillRect(3, 6, 10, 6);
      // Head
      ctx.fillRect(10, 3, 5, 5);
      ctx.fillStyle = '#7a5018';
      ctx.fillRect(10, 4, 2, 4); // ear
      ctx.fillStyle = '#d4a050';
      ctx.fillRect(13, 5, 3, 3); // muzzle
      ctx.fillStyle = '#0a0808';
      ctx.fillRect(15, 5, 1, 1); // eye
      ctx.fillStyle = '#1a1010';
      ctx.fillRect(14, 7, 2, 1); // nose
      // Red collar
      ctx.fillStyle = '#c02818';
      ctx.fillRect(10, 7, 2, 2);
      ctx.fillStyle = '#e8c020';
      ctx.fillRect(11, 8, 1, 1); // tag
      // Legs
      ctx.fillStyle = '#9c6824';
      ctx.fillRect(4, 12, 2, 4); ctx.fillRect(10, 12, 2, 4);
      // Tail (wagging up)
      ctx.fillStyle = '#b88038';
      ctx.fillRect(2, 4, 2, 4);
      ctx.fillRect(1, 3, 1, 3);
    });
  }

  // --- Dialogue Portraits (32x32) ---

  createPortraits() {
    const drawBorder = (ctx) => {
      ctx.strokeStyle = '#1e2e1a';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 30, 30);
      // Corner dots
      ctx.fillStyle = '#e8c83a';
      [[1,1],[29,1],[1,29],[29,29]].forEach(([x,y]) => ctx.fillRect(x, y, 2, 2));
    };

    // June Portrait
    this.createCanvasTexture('portrait_june', 32, 32, (ctx) => {
      ctx.fillStyle = '#e8f0d8';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#8a3c18';
      ctx.fillRect(7, 4, 18, 18);
      ctx.fillRect(5, 8, 22, 14);
      ctx.fillStyle = '#e8b890';
      ctx.fillRect(10, 10, 12, 11);
      ctx.fillStyle = '#181410';
      ctx.fillRect(12, 14, 2, 2); ctx.fillRect(18, 14, 2, 2);
      ctx.fillStyle = '#c04048';
      ctx.fillRect(14, 18, 4, 1);
      ctx.fillStyle = '#3a6e48';
      ctx.fillRect(6, 22, 20, 10);
      ctx.fillStyle = '#e8c030'; // earring visible
      ctx.fillRect(9, 15, 1, 2);
      drawBorder(ctx);
    });

    // Mom Portrait
    this.createCanvasTexture('portrait_mom', 32, 32, (ctx) => {
      ctx.fillStyle = '#f8f0e0';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#4e2c10';
      ctx.fillRect(6, 4, 20, 14);
      ctx.fillStyle = '#e8c8a4';
      ctx.fillRect(10, 10, 12, 12);
      ctx.fillStyle = '#201008';
      ctx.fillRect(12, 14, 2, 2); ctx.fillRect(18, 14, 2, 2);
      ctx.fillStyle = '#c04040';
      ctx.fillRect(14, 18, 4, 2);
      ctx.fillStyle = '#c24a3c';
      ctx.fillRect(6, 22, 20, 10);
      ctx.fillStyle = '#ece8d4'; // apron
      ctx.fillRect(11, 23, 10, 9);
      ctx.fillStyle = '#e04060';
      ctx.fillRect(14, 25, 4, 2); // apron flower
      drawBorder(ctx);
    });

    // Mrs. Miller Portrait
    this.createCanvasTexture('portrait_miller', 32, 32, (ctx) => {
      ctx.fillStyle = '#f0ece4';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#b8bcc0';
      ctx.fillRect(12, 2, 8, 5); ctx.fillRect(8, 6, 16, 12);
      ctx.fillStyle = '#e4c8b0';
      ctx.fillRect(10, 11, 12, 11);
      ctx.fillStyle = '#6a5840';
      ctx.fillRect(10, 13, 5, 4); ctx.fillRect(17, 13, 5, 4);
      ctx.fillStyle = '#60907a';
      ctx.fillRect(6, 22, 20, 10);
      ctx.fillStyle = '#201208';
      ctx.fillRect(12, 14, 2, 2); ctx.fillRect(18, 14, 2, 2);
      drawBorder(ctx);
    });

    // Mr. Vinyl Portrait
    this.createCanvasTexture('portrait_vinyl', 32, 32, (ctx) => {
      ctx.fillStyle = '#f0e8d8';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#342014';
      ctx.fillRect(8, 4, 16, 8);
      ctx.fillStyle = '#dca070';
      ctx.fillRect(10, 9, 12, 13);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(9, 11, 6, 5); ctx.fillRect(17, 11, 6, 5);
      ctx.fillStyle = '#342014';
      ctx.fillRect(9, 16, 14, 7);
      ctx.fillStyle = '#5a3a28';
      ctx.fillRect(11, 17, 10, 4);
      ctx.fillStyle = '#3c6082';
      ctx.fillRect(6, 23, 20, 9);
      drawBorder(ctx);
    });

    // Timmy Portrait
    this.createCanvasTexture('portrait_timmy', 32, 32, (ctx) => {
      ctx.fillStyle = '#e8f8e8';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#2a5c2a';
      ctx.fillRect(9, 4, 14, 7); ctx.fillRect(6, 9, 8, 2);
      ctx.fillStyle = '#e8b890';
      ctx.fillRect(10, 11, 12, 10);
      ctx.fillStyle = '#140c08';
      ctx.fillRect(12, 14, 2, 2); ctx.fillRect(18, 14, 2, 2);
      ctx.fillStyle = '#c04040';
      ctx.fillRect(14, 18, 4, 1);
      ctx.fillStyle = '#cc5020';
      ctx.fillRect(7, 22, 18, 10);
      drawBorder(ctx);
    });

    // Neighbor Bob Portrait
    this.createCanvasTexture('portrait_bob', 32, 32, (ctx) => {
      ctx.fillStyle = '#f0e8d8';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#5a3c22';
      ctx.fillRect(8, 4, 16, 6);
      ctx.fillStyle = '#d8a870';
      ctx.fillRect(10, 10, 12, 12);
      ctx.fillStyle = '#7a5830';
      ctx.fillRect(10, 16, 12, 4); // mustache
      ctx.fillStyle = '#181008';
      ctx.fillRect(12, 13, 2, 2); ctx.fillRect(18, 13, 2, 2);
      ctx.fillStyle = '#983020';
      ctx.fillRect(6, 22, 20, 10);
      drawBorder(ctx);
    });

    // Buddy Dog Portrait
    this.createCanvasTexture('portrait_dog', 32, 32, (ctx) => {
      ctx.fillStyle = '#f0eed4';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#b88038';
      ctx.fillRect(8, 8, 16, 14);
      ctx.fillStyle = '#7a5018';
      ctx.fillRect(6, 8, 4, 12); ctx.fillRect(22, 8, 4, 12); // floppy ears
      ctx.fillStyle = '#d4a050';
      ctx.fillRect(11, 15, 10, 8); // muzzle
      ctx.fillStyle = '#0a0808';
      ctx.fillRect(14, 16, 4, 3); // nose
      ctx.fillStyle = '#c02818'; // collar
      ctx.fillRect(10, 20, 12, 2);
      ctx.fillStyle = '#e8c020';
      ctx.fillRect(15, 20, 2, 2);
      drawBorder(ctx);
    });
  }

  // --- LED ZEPPELIN II (1969) Pixel-Art Record Sleeve ---

  createAlbumArt() {
    const drawLedZeppelin = (ctx, w, h) => {
      // 1969 Sunset gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#28161e');
      grad.addColorStop(0.25, '#542220');
      grad.addColorStop(0.5, '#9c3c22');
      grad.addColorStop(0.72, '#c86020');
      grad.addColorStop(1, '#f8b840');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Sun halo
      ctx.fillStyle = '#ffe898';
      ctx.beginPath();
      ctx.arc(w / 2, Math.round(h * 0.55), 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff8d0';
      ctx.beginPath();
      ctx.arc(w / 2, Math.round(h * 0.55), 10, 0, Math.PI * 2);
      ctx.fill();

      // Cloud wisps
      ctx.fillStyle = 'rgba(64, 24, 20, 0.50)';
      [[30, 40, 28, 10], [90, 42, 32, 12], [20, 56, 22, 8]].forEach(([x, y, rx, ry]) => {
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Zeppelin Airship
      const zx = w / 2 - 30;
      const zy = 38;
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(zx + 28, zy + 16, 30, 5, -0.05, 0, Math.PI * 2);
      ctx.fill();
      // Hull
      ctx.fillStyle = '#3a4245';
      ctx.beginPath();
      ctx.ellipse(zx + 28, zy + 9, 33, 11, -0.08, 0, Math.PI * 2);
      ctx.fill();
      // Highlight
      ctx.fillStyle = '#6c7a80';
      ctx.beginPath();
      ctx.ellipse(zx + 26, zy + 5, 26, 5, -0.08, 0, Math.PI * 2);
      ctx.fill();
      // Fins
      ctx.fillStyle = '#252c2e';
      ctx.fillRect(zx + 4, zy + 4, 5, 10);
      // Gondola
      ctx.fillRect(zx + 20, zy + 18, 14, 4);
      // Propellers
      ctx.fillStyle = '#1a1e20';
      ctx.fillRect(zx + 54, zy + 5, 4, 8);

      // Silhouetted Crowd at bottom
      ctx.fillStyle = '#100c0e';
      const figures = [
        [8, 100, 10, 30], [22, 94, 12, 36], [36, 102, 10, 28],
        [50, 90, 14, 40], [66, 96, 12, 34], [82, 92, 14, 38],
        [98, 98, 12, 32], [112, 104, 10, 26], [124, 100, 8, 30]
      ];
      figures.forEach(([fx, fy, fw, fh]) => {
        ctx.beginPath();
        ctx.arc(fx + fw / 2, fy, fw / 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(fx, fy + 4, fw, fh);
      });
      ctx.fillRect(0, h - 6, w, 6);

      // Typography
      ctx.fillStyle = '#f8f0e0';
      ctx.font = 'bold 10px "Courier Prime", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LED ZEPPELIN II', w / 2, 15);
      ctx.strokeStyle = '#0a0808';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    };

    // Phaser texture
    this.createCanvasTexture('album_led_zeppelin_ii', 130, 130, (ctx, w, h) => {
      drawLedZeppelin(ctx, w, h);
    });

    // Sidebar thumbnail canvas
    const sideCanvas = document.getElementById('album-preview-canvas');
    if (sideCanvas) {
      const sctx = sideCanvas.getContext('2d');
      drawLedZeppelin(sctx, 130, 130);
    }
  }
}
