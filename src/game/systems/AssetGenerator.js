/**
 * AssetGenerator.js
 * Programmatic Pixel-Art Generator for SIDE B (1969 Edition)
 * Generates all period-accurate 1969 textures, vehicles, Led Zeppelin II album, and neighborhood details.
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
      ctx.fillStyle = '#6b8c42';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#577935';
      [[2,3],[3,3],[8,7],[9,7],[13,12],[14,12],[5,14],[11,2]].forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
      ctx.fillStyle = '#7ea14f';
      [[2,2],[8,6],[13,11],[5,13],[11,1],[1,9],[14,5]].forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
    });

    // 2. Flower Grass
    this.createCanvasTexture('tile_grass_flowers', 16, 16, (ctx) => {
      ctx.fillStyle = '#6b8c42';
      ctx.fillRect(0, 0, 16, 16);
      // daisies and wildflowers
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(3, 7, 3, 3);
      ctx.fillStyle = '#f0c030';
      ctx.fillRect(4, 8, 1, 1);
      ctx.fillStyle = '#f7d752';
      ctx.fillRect(11, 4, 3, 3);
      ctx.fillStyle = '#d47b28';
      ctx.fillRect(12, 5, 1, 1);
      ctx.fillStyle = '#e86f7b';
      ctx.fillRect(10, 11, 2, 2);
    });

    // 3. Sidewalk
    this.createCanvasTexture('tile_sidewalk', 16, 16, (ctx) => {
      ctx.fillStyle = '#d9ceb2';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#eae2cb';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillStyle = '#b3a78c';
      ctx.fillRect(0, 15, 16, 1);
      ctx.fillRect(15, 0, 1, 16);
    });

    // 4. Sidewalk Curb
    this.createCanvasTexture('tile_curb_h', 16, 16, (ctx) => {
      ctx.fillStyle = '#d9ceb2';
      ctx.fillRect(0, 0, 16, 12);
      ctx.fillStyle = '#8f846d';
      ctx.fillRect(0, 12, 16, 2);
      ctx.fillStyle = '#4a5054';
      ctx.fillRect(0, 14, 16, 2);
    });

    // 5. Road Asphalt Base
    this.createCanvasTexture('tile_road', 16, 16, (ctx) => {
      ctx.fillStyle = '#4c5257';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#43494e';
      [[3,2],[9,8],[14,4],[2,12],[8,14]].forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
      ctx.fillStyle = '#565c62';
      [[6,5],[12,11],[4,9],[10,2]].forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
    });

    // 6. Road with Yellow Dashed Center Line (Horizontal)
    this.createCanvasTexture('tile_road_line_h', 16, 16, (ctx) => {
      ctx.fillStyle = '#4c5257';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#e6c84c';
      ctx.fillRect(2, 7, 12, 2);
      ctx.fillStyle = '#bfa336';
      ctx.fillRect(2, 9, 12, 1);
    });

    // 7. Road with Yellow Dashed Center Line (Vertical)
    this.createCanvasTexture('tile_road_line_v', 16, 16, (ctx) => {
      ctx.fillStyle = '#4c5257';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#e6c84c';
      ctx.fillRect(7, 2, 2, 12);
      ctx.fillStyle = '#bfa336';
      ctx.fillRect(9, 2, 1, 12);
    });

    // 8. Crosswalk Tile
    this.createCanvasTexture('tile_crosswalk', 16, 16, (ctx) => {
      ctx.fillStyle = '#4c5257';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#e8e2d1';
      ctx.fillRect(1, 2, 14, 3);
      ctx.fillRect(1, 8, 14, 3);
      ctx.fillRect(1, 13, 14, 3);
    });

    // 9. Driveway Concrete
    this.createCanvasTexture('tile_driveway', 16, 16, (ctx) => {
      ctx.fillStyle = '#c7beaa';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#b3a992';
      ctx.fillRect(0, 15, 16, 1);
      ctx.fillRect(15, 0, 1, 16);
      ctx.fillStyle = '#dcd4c0';
      ctx.fillRect(2, 2, 6, 6);
    });

    // 10. Pond Teal Water
    this.createCanvasTexture('tile_water', 16, 16, (ctx) => {
      ctx.fillStyle = '#376e77';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#498893';
      ctx.fillRect(2, 3, 6, 2);
      ctx.fillRect(9, 10, 5, 2);
      ctx.fillStyle = '#7bbbc6';
      ctx.fillRect(3, 4, 3, 1);
      ctx.fillRect(10, 11, 3, 1);
      // water lily
      ctx.fillStyle = '#2d5a32';
      ctx.fillRect(12, 3, 3, 3);
    });

    // 11. Pond Edge Shoreline
    this.createCanvasTexture('tile_water_edge', 16, 16, (ctx) => {
      ctx.fillStyle = '#6b8c42';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#376e77';
      ctx.beginPath();
      ctx.arc(8, 16, 10, Math.PI, 0);
      ctx.fill();
    });

    // 12. House Red Tile Roof
    this.createCanvasTexture('tile_roof_red', 16, 16, (ctx) => {
      ctx.fillStyle = '#ad4735';
      ctx.fillRect(0, 0, 16, 16);
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

    // 13. House Cedar Brown Shingle Roof
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

    // 14. House Slate Blue Shingle Roof
    this.createCanvasTexture('tile_roof_blue', 16, 16, (ctx) => {
      ctx.fillStyle = '#4c6273';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#364754';
      ctx.fillRect(0, 4, 16, 1);
      ctx.fillRect(0, 9, 16, 1);
      ctx.fillRect(0, 14, 16, 1);
      ctx.fillStyle = '#657e91';
      ctx.fillRect(0, 0, 16, 1);
      ctx.fillRect(0, 5, 16, 1);
    });

    // 15. Wall Cream Wood
    this.createCanvasTexture('tile_wall_wood', 16, 16, (ctx) => {
      ctx.fillStyle = '#e3ca9e';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#c5a97a';
      ctx.fillRect(0, 3, 16, 1);
      ctx.fillRect(0, 7, 16, 1);
      ctx.fillRect(0, 11, 16, 1);
      ctx.fillRect(0, 15, 16, 1);
    });

    // 16. Wall Red Brick (Shop & Chimneys)
    this.createCanvasTexture('tile_wall_brick', 16, 16, (ctx) => {
      ctx.fillStyle = '#9b4333';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#d4c7b4'; // mortar
      ctx.fillRect(0, 7, 16, 1);
      ctx.fillRect(0, 15, 16, 1);
      ctx.fillRect(7, 0, 1, 7);
      ctx.fillRect(15, 8, 1, 7);
      ctx.fillRect(7, 8, 1, 7);
    });

    // 17. Window
    this.createCanvasTexture('tile_window', 16, 16, (ctx) => {
      ctx.fillStyle = '#e3ca9e';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#483526';
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillStyle = '#f5eedb';
      ctx.fillRect(3, 3, 10, 10);
      ctx.fillStyle = '#5c8f9b';
      ctx.fillRect(4, 4, 8, 8);
      ctx.fillStyle = '#e66b60'; // curtains
      ctx.fillRect(4, 4, 2, 8);
      ctx.fillRect(10, 4, 2, 8);
      ctx.fillStyle = '#89c1cb';
      ctx.fillRect(6, 4, 1, 8);
    });

    // 18. Front Door
    this.createCanvasTexture('tile_door', 16, 16, (ctx) => {
      ctx.fillStyle = '#e3ca9e';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#523420';
      ctx.fillRect(2, 1, 12, 15);
      ctx.fillStyle = '#824c29';
      ctx.fillRect(3, 2, 10, 14);
      ctx.fillStyle = '#f1c242'; // brass knob
      ctx.fillRect(10, 8, 2, 2);
    });

    // 19. White Picket Fence
    this.createCanvasTexture('tile_fence', 16, 16, (ctx) => {
      ctx.fillStyle = '#6b8c42';
      ctx.fillRect(0, 12, 16, 4);
      const pickets = [1, 5, 9, 13];
      pickets.forEach(px => {
        ctx.fillStyle = '#eee8d5';
        ctx.fillRect(px, 3, 2, 11);
        ctx.fillStyle = '#ded3b6';
        ctx.fillRect(px + 1, 3, 1, 11);
      });
      ctx.fillStyle = '#ded3b6';
      ctx.fillRect(0, 6, 16, 2);
      ctx.fillRect(0, 11, 16, 2);
    });

    // 20. Large Oak/Pine Tree (32x32 composite)
    this.createCanvasTexture('tree_large', 32, 32, (ctx) => {
      ctx.fillStyle = '#5c3920';
      ctx.fillRect(13, 18, 6, 14);
      ctx.fillStyle = '#442814';
      ctx.fillRect(16, 18, 3, 14);
      ctx.fillStyle = '#214723';
      ctx.beginPath();
      ctx.arc(16, 13, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#316330';
      ctx.beginPath();
      ctx.arc(14, 11, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4d8745';
      ctx.beginPath();
      ctx.arc(11, 8, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(19, 10, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // --- Props & Neighborhood Storytelling Objects ---

  createProps() {
    // 1. Garage Door (32x24 composite)
    this.createCanvasTexture('prop_garage', 32, 24, (ctx) => {
      ctx.fillStyle = '#48382c';
      ctx.fillRect(0, 0, 32, 24);
      ctx.fillStyle = '#ded8c8';
      ctx.fillRect(2, 2, 28, 22);
      // panel grooves
      ctx.fillStyle = '#b8b09d';
      ctx.fillRect(2, 7, 28, 1);
      ctx.fillRect(2, 12, 28, 1);
      ctx.fillRect(2, 17, 28, 1);
      // top windows
      ctx.fillStyle = '#557d87';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(4 + i * 6, 3, 5, 3);
      }
    });

    // 2. Oakwood Park Sign
    this.createCanvasTexture('prop_park_sign', 32, 16, (ctx) => {
      ctx.fillStyle = '#52341d';
      ctx.fillRect(4, 9, 2, 7);
      ctx.fillRect(26, 9, 2, 7);
      // Wood board
      ctx.fillStyle = '#dfcfab';
      ctx.fillRect(2, 1, 28, 9);
      ctx.strokeStyle = '#52341d';
      ctx.strokeRect(2, 1, 28, 9);
      ctx.fillStyle = '#3b2311';
      ctx.font = 'bold 5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('OAKWOOD', 16, 5);
      ctx.fillText('PARK', 16, 9);
    });

    // 3. Swimming White Duck in Pond
    this.createCanvasTexture('prop_duck', 16, 16, (ctx) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, 9, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(11, 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e6982e'; // beak
      ctx.fillRect(13, 6, 2, 1);
      ctx.fillStyle = '#111111'; // eye
      ctx.fillRect(11, 5, 1, 1);
    });

    // 4. Wooden Pier / Dock on Pond
    this.createCanvasTexture('prop_dock', 16, 24, (ctx) => {
      ctx.fillStyle = '#825838';
      ctx.fillRect(2, 0, 12, 24);
      ctx.fillStyle = '#5a381f';
      ctx.fillRect(2, 4, 12, 1);
      ctx.fillRect(2, 9, 12, 1);
      ctx.fillRect(2, 14, 12, 1);
      ctx.fillRect(2, 19, 12, 1);
      // Posts
      ctx.fillStyle = '#3d2514';
      ctx.fillRect(1, 0, 2, 24);
      ctx.fillRect(13, 0, 2, 24);
    });

    // 5. Overgrown Hedge
    this.createCanvasTexture('prop_hedge_overgrown', 16, 16, (ctx) => {
      ctx.fillStyle = '#285424';
      ctx.fillRect(0, 2, 16, 14);
      ctx.fillStyle = '#3a7534';
      ctx.fillRect(1, 1, 14, 13);
      ctx.fillStyle = '#549c49';
      [[2,1],[5,0],[9,1],[13,0],[3,5],[8,4],[12,6],[6,9],[10,11]].forEach(([x,y]) => ctx.fillRect(x, y, 2, 2));
      ctx.fillStyle = '#7bc76e';
      ctx.fillRect(4, 0, 1, 2);
      ctx.fillRect(12, 0, 2, 1);
    });

    // 6. Trimmed Hedge
    this.createCanvasTexture('prop_hedge_trimmed', 16, 16, (ctx) => {
      ctx.fillStyle = '#234a1f';
      ctx.fillRect(0, 3, 16, 13);
      ctx.fillStyle = '#336c2e';
      ctx.fillRect(1, 2, 14, 12);
      ctx.fillStyle = '#488f40';
      ctx.fillRect(1, 2, 14, 4);
      ctx.fillStyle = '#61b057';
      ctx.fillRect(2, 2, 12, 1);
    });

    // 7. Full Trash Can
    this.createCanvasTexture('prop_trash_full', 16, 16, (ctx) => {
      ctx.fillStyle = '#525a61';
      ctx.fillRect(3, 5, 10, 10);
      ctx.fillStyle = '#89959f';
      ctx.fillRect(4, 5, 8, 9);
      ctx.fillStyle = '#202224'; // bulging bag
      ctx.fillRect(5, 3, 6, 3);
      ctx.fillStyle = '#9aaab6'; // askew lid
      ctx.fillRect(2, 2, 12, 2);
    });

    // 8. Empty Trash Can
    this.createCanvasTexture('prop_trash_empty', 16, 16, (ctx) => {
      ctx.fillStyle = '#525a61';
      ctx.fillRect(3, 5, 10, 10);
      ctx.fillStyle = '#89959f';
      ctx.fillRect(4, 5, 8, 9);
      ctx.fillStyle = '#9aaab6';
      ctx.fillRect(2, 4, 12, 2);
    });

    // 9. Mrs. Miller's Parcel
    this.createCanvasTexture('prop_parcel', 16, 16, (ctx) => {
      ctx.fillStyle = '#855632';
      ctx.fillRect(3, 5, 10, 8);
      ctx.fillStyle = '#b88457';
      ctx.fillRect(4, 6, 8, 6);
      ctx.fillStyle = '#eee2c8';
      ctx.fillRect(7, 5, 2, 8);
      ctx.fillRect(3, 8, 10, 2);
      ctx.fillStyle = '#c5493e';
      ctx.fillRect(9, 6, 2, 2);
    });

    // 10. Vintage Mailbox (1969 country post with red flag)
    this.createCanvasTexture('prop_mailbox', 16, 16, (ctx) => {
      // Wooden post
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(7, 8, 2, 8);
      // Metal box body
      ctx.fillStyle = '#37414a';
      ctx.fillRect(4, 3, 8, 5);
      ctx.fillStyle = '#566470';
      ctx.fillRect(5, 3, 6, 3);
      // Red outgoing flag
      ctx.fillStyle = '#c93424';
      ctx.fillRect(11, 2, 2, 4);
    });

    // 10. Vintage Bicycle leaning against fence
    this.createCanvasTexture('prop_bicycle', 20, 16, (ctx) => {
      ctx.fillStyle = '#222222';
      // wheels
      ctx.beginPath(); ctx.arc(4, 11, 4, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(15, 11, 4, 0, Math.PI * 2); ctx.stroke();
      // frame (cherry red)
      ctx.strokeStyle = '#c53828';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(4, 11); ctx.lineTo(9, 7); ctx.lineTo(15, 11);
      ctx.moveTo(9, 7); ctx.lineTo(10, 11); ctx.lineTo(4, 11);
      ctx.stroke();
      // handlebars & seat
      ctx.fillStyle = '#222';
      ctx.fillRect(7, 6, 3, 1);
      ctx.fillRect(13, 4, 4, 1);
    });

    // 11. Streetlight (Vintage 1960s Iron Pole & Lantern)
    this.createCanvasTexture('prop_streetlight', 16, 32, (ctx) => {
      ctx.fillStyle = '#283129';
      ctx.fillRect(7, 10, 2, 22);
      ctx.fillRect(5, 30, 6, 2); // base
      // Curved arm & lamp
      ctx.fillRect(7, 4, 6, 2);
      ctx.fillRect(11, 6, 4, 2);
      ctx.fillStyle = '#fae482'; // glowing glass
      ctx.fillRect(12, 8, 3, 4);
    });

    // 12. Park Bench
    this.createCanvasTexture('prop_bench', 24, 16, (ctx) => {
      ctx.fillStyle = '#8a4b27';
      ctx.fillRect(2, 4, 20, 2);
      ctx.fillRect(2, 7, 20, 2);
      ctx.fillRect(2, 10, 20, 3);
      ctx.fillStyle = '#262d29';
      ctx.fillRect(4, 4, 2, 12);
      ctx.fillRect(18, 4, 2, 12);
    });

    // 13. 1969 Transistor Radio (June's Radio)
    this.createCanvasTexture('prop_radio', 16, 16, (ctx) => {
      ctx.fillStyle = '#2e3338';
      ctx.fillRect(2, 5, 12, 9);
      ctx.fillStyle = '#b59235';
      ctx.fillRect(3, 6, 10, 7);
      ctx.fillStyle = '#1e2023';
      ctx.fillRect(4, 7, 4, 4);
      ctx.fillStyle = '#eee0bc';
      ctx.fillRect(9, 7, 3, 2);
      ctx.fillStyle = '#8f9aa3';
      ctx.fillRect(3, 2, 1, 4);
    });

    // 14. Records Store Front Awning & Banner
    this.createCanvasTexture('prop_shop_facade', 64, 32, (ctx) => {
      // Brick top
      ctx.fillStyle = '#943828';
      ctx.fillRect(0, 0, 64, 12);
      // Main Sign "RECORDS"
      ctx.fillStyle = '#1b2d1f';
      ctx.fillRect(6, 2, 52, 9);
      ctx.strokeStyle = '#e6b943';
      ctx.strokeRect(6, 2, 52, 9);
      ctx.fillStyle = '#f5c84c';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('RECORDS', 32, 9);
      // Striped Awning (Red & Cream)
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = (i % 2 === 0) ? '#b83b2e' : '#f5edd8';
        ctx.fillRect(i * 8, 12, 8, 8);
      }
      ctx.fillStyle = '#9e2e22';
      ctx.fillRect(0, 19, 64, 1);
      // Window signs: CASSETTES • HI-FI
      ctx.fillStyle = '#223827';
      ctx.fillRect(4, 22, 56, 10);
      ctx.fillStyle = '#e3d6be';
      ctx.font = 'bold 4px monospace';
      ctx.fillText('CASSETTES • POSTERS • HI-FI', 32, 29);
    });

    // 15. Basketball Hoop on Garage
    this.createCanvasTexture('prop_hoop', 16, 20, (ctx) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(3, 2, 10, 8);
      ctx.strokeStyle = '#c53828';
      ctx.strokeRect(3, 2, 10, 8);
      ctx.fillStyle = '#e6652b'; // rim
      ctx.fillRect(5, 10, 6, 2);
      // net
      ctx.fillStyle = '#eee';
      ctx.fillRect(6, 12, 4, 4);
    });

    // 16. Clothesline with Laundry Hanging
    this.createCanvasTexture('prop_clothesline', 32, 16, (ctx) => {
      ctx.fillStyle = '#52341d';
      ctx.fillRect(1, 2, 2, 14);
      ctx.fillRect(29, 2, 2, 14);
      ctx.strokeStyle = '#dedede';
      ctx.beginPath(); ctx.moveTo(2, 4); ctx.lineTo(30, 4); ctx.stroke();
      // Clothes
      ctx.fillStyle = '#e86558'; ctx.fillRect(5, 5, 5, 6); // red shirt
      ctx.fillStyle = '#48729e'; ctx.fillRect(13, 5, 4, 8); // jeans
      ctx.fillStyle = '#f2f0e4'; ctx.fillRect(20, 5, 6, 5); // sheet
    });

    // 17. Newspaper Roll (For favor)
    this.createCanvasTexture('prop_newspaper', 16, 16, (ctx) => {
      ctx.fillStyle = '#f0edd8';
      ctx.fillRect(4, 7, 8, 4);
      ctx.fillStyle = '#222';
      ctx.fillRect(6, 7, 1, 4);
      ctx.fillRect(9, 7, 1, 4);
      // blue rubber band
      ctx.fillStyle = '#376bb0';
      ctx.fillRect(7, 6, 2, 6);
    });
  }

  // --- 1969 American Vintage Cars ---

  createVehicles() {
    // 1. 1969 Cherry Red Muscle Car (Mustang / Charger)
    this.createCanvasTexture('car_muscle_red', 36, 18, (ctx) => {
      ctx.fillStyle = '#8f201b';
      ctx.fillRect(2, 5, 32, 9);
      ctx.fillStyle = '#be2f28';
      ctx.fillRect(8, 2, 18, 6);
      ctx.fillStyle = '#3d4852'; // windshield
      ctx.fillRect(10, 3, 5, 4);
      ctx.fillRect(19, 3, 6, 4);
      // Chrome trim
      ctx.fillStyle = '#dce4e8';
      ctx.fillRect(0, 10, 2, 3);
      ctx.fillRect(34, 10, 2, 3);
      // Wheels
      ctx.fillStyle = '#1c1c1c';
      ctx.fillRect(6, 12, 6, 5);
      ctx.fillRect(24, 12, 6, 5);
    });

    // 2. 1969 Turquoise Blue Family Sedan
    this.createCanvasTexture('car_sedan_teal', 36, 18, (ctx) => {
      ctx.fillStyle = '#285863';
      ctx.fillRect(2, 5, 32, 9);
      ctx.fillStyle = '#3a7885';
      ctx.fillRect(7, 2, 20, 6);
      ctx.fillStyle = '#9bd0d9';
      ctx.fillRect(9, 3, 6, 4);
      ctx.fillRect(18, 3, 7, 4);
      ctx.fillStyle = '#dce4e8';
      ctx.fillRect(0, 10, 2, 3);
      ctx.fillRect(34, 10, 2, 3);
      ctx.fillStyle = '#1c1c1c';
      ctx.fillRect(6, 12, 6, 5);
      ctx.fillRect(24, 12, 6, 5);
    });

    // 3. 1969 Woodgrain Station Wagon (Cream / Burnt Orange)
    this.createCanvasTexture('car_wagon_wood', 38, 18, (ctx) => {
      ctx.fillStyle = '#b89458';
      ctx.fillRect(2, 5, 34, 9);
      ctx.fillStyle = '#6e3f1e'; // wood panel
      ctx.fillRect(8, 7, 21, 5);
      ctx.fillStyle = '#d6b376';
      ctx.fillRect(7, 2, 23, 6);
      ctx.fillStyle = '#8abdc7';
      ctx.fillRect(9, 3, 6, 4);
      ctx.fillRect(17, 3, 6, 4);
      ctx.fillRect(24, 3, 5, 4);
      ctx.fillStyle = '#1c1c1c';
      ctx.fillRect(6, 12, 6, 5);
      ctx.fillRect(26, 12, 6, 5);
    });

    // 4. 1969 Yellow Cruiser
    this.createCanvasTexture('car_cruiser_yellow', 36, 18, (ctx) => {
      ctx.fillStyle = '#b08a28';
      ctx.fillRect(2, 5, 32, 9);
      ctx.fillStyle = '#d9aa32';
      ctx.fillRect(7, 2, 19, 6);
      ctx.fillStyle = '#3a444d';
      ctx.fillRect(9, 3, 6, 4);
      ctx.fillRect(18, 3, 6, 4);
      ctx.fillStyle = '#dce4e8';
      ctx.fillRect(0, 10, 2, 3);
      ctx.fillRect(34, 10, 2, 3);
      ctx.fillStyle = '#1c1c1c';
      ctx.fillRect(6, 12, 6, 5);
      ctx.fillRect(24, 12, 6, 5);
    });
  }

  // --- Character Sprites (16x24) ---

  createPlayerSprites() {
    const drawPlayer = (ctx, stepFrame = 0, dir = 'down') => {
      ctx.clearRect(0, 0, 16, 24);

      if (dir === 'down') {
        // 1969 teen hair
        ctx.fillStyle = '#59341c';
        ctx.fillRect(4, 2, 8, 6);
        ctx.fillRect(3, 4, 10, 4);
        // Face
        ctx.fillStyle = '#ebd1b5';
        ctx.fillRect(5, 6, 6, 4);
        ctx.fillStyle = '#261b12';
        ctx.fillRect(6, 7, 1, 1);
        ctx.fillRect(9, 7, 1, 1);
        // Mustard Yellow Shirt (1969)
        ctx.fillStyle = '#d49a2a';
        ctx.fillRect(4, 10, 8, 6);
        // Denim bell-bottoms
        ctx.fillStyle = '#375373';
        if (stepFrame === 0) {
          ctx.fillRect(4, 16, 3, 5); ctx.fillRect(9, 16, 3, 5);
          ctx.fillStyle = '#4a2d18'; ctx.fillRect(3, 21, 4, 3); ctx.fillRect(9, 21, 4, 3);
        } else if (stepFrame === 1) {
          ctx.fillRect(4, 16, 3, 4); ctx.fillRect(9, 15, 3, 6);
          ctx.fillStyle = '#4a2d18'; ctx.fillRect(3, 20, 4, 3); ctx.fillRect(9, 21, 4, 3);
        } else {
          ctx.fillRect(4, 15, 3, 6); ctx.fillRect(9, 16, 3, 4);
          ctx.fillStyle = '#4a2d18'; ctx.fillRect(3, 21, 4, 3); ctx.fillRect(9, 20, 4, 3);
        }
      } else if (dir === 'up') {
        ctx.fillStyle = '#59341c';
        ctx.fillRect(4, 2, 8, 7);
        ctx.fillRect(3, 4, 10, 5);
        ctx.fillStyle = '#d49a2a';
        ctx.fillRect(4, 10, 8, 6);
        ctx.fillStyle = '#375373';
        if (stepFrame === 0) {
          ctx.fillRect(4, 16, 3, 5); ctx.fillRect(9, 16, 3, 5);
          ctx.fillStyle = '#4a2d18'; ctx.fillRect(4, 21, 3, 3); ctx.fillRect(9, 21, 3, 3);
        } else if (stepFrame === 1) {
          ctx.fillRect(4, 15, 3, 6); ctx.fillRect(9, 16, 3, 4);
          ctx.fillStyle = '#4a2d18'; ctx.fillRect(4, 21, 3, 3); ctx.fillRect(9, 20, 3, 3);
        } else {
          ctx.fillRect(4, 16, 3, 4); ctx.fillRect(9, 15, 3, 6);
          ctx.fillStyle = '#4a2d18'; ctx.fillRect(4, 20, 3, 3); ctx.fillRect(9, 21, 3, 3);
        }
      } else if (dir === 'left') {
        ctx.fillStyle = '#59341c';
        ctx.fillRect(4, 2, 8, 6);
        ctx.fillRect(3, 4, 5, 5);
        ctx.fillStyle = '#ebd1b5';
        ctx.fillRect(3, 6, 4, 4);
        ctx.fillStyle = '#261b12';
        ctx.fillRect(4, 7, 1, 1);
        ctx.fillStyle = '#d49a2a';
        ctx.fillRect(4, 10, 7, 6);
        ctx.fillStyle = '#375373';
        if (stepFrame === 0) {
          ctx.fillRect(5, 16, 5, 5);
          ctx.fillStyle = '#4a2d18'; ctx.fillRect(3, 21, 6, 3);
        } else {
          ctx.fillRect(4, 16, 3, 5); ctx.fillRect(8, 16, 3, 4);
          ctx.fillStyle = '#4a2d18'; ctx.fillRect(3, 21, 4, 3); ctx.fillRect(8, 20, 4, 3);
        }
      } else if (dir === 'right') {
        ctx.fillStyle = '#59341c';
        ctx.fillRect(4, 2, 8, 6);
        ctx.fillRect(8, 4, 5, 5);
        ctx.fillStyle = '#ebd1b5';
        ctx.fillRect(9, 6, 4, 4);
        ctx.fillStyle = '#261b12';
        ctx.fillRect(11, 7, 1, 1);
        ctx.fillStyle = '#d49a2a';
        ctx.fillRect(5, 10, 7, 6);
        ctx.fillStyle = '#375373';
        if (stepFrame === 0) {
          ctx.fillRect(6, 16, 5, 5);
          ctx.fillStyle = '#4a2d18'; ctx.fillRect(7, 21, 6, 3);
        } else {
          ctx.fillRect(5, 16, 3, 4); ctx.fillRect(9, 16, 3, 5);
          ctx.fillStyle = '#4a2d18'; ctx.fillRect(4, 20, 4, 3); ctx.fillRect(9, 21, 4, 3);
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
      ctx.fillStyle = '#5a351a';
      ctx.fillRect(3, 2, 10, 7);
      ctx.fillStyle = '#ebd1b5';
      ctx.fillRect(5, 6, 6, 4);
      ctx.fillStyle = '#2d1b0e';
      ctx.fillRect(6, 7, 1, 1); ctx.fillRect(9, 7, 1, 1);
      ctx.fillStyle = '#c85e50';
      ctx.fillRect(4, 10, 8, 11);
      ctx.fillStyle = '#f3edd6'; // apron
      ctx.fillRect(5, 11, 6, 9);
      ctx.fillStyle = '#3a2318';
      ctx.fillRect(4, 21, 3, 2); ctx.fillRect(9, 21, 3, 2);
    });

    // 2. Mrs. Miller: Mint cardigan, spectacles
    this.createCanvasTexture('npc_mrs_miller', 16, 24, (ctx) => {
      ctx.fillStyle = '#c4c8cb';
      ctx.fillRect(6, 1, 4, 3);
      ctx.fillRect(4, 3, 8, 6);
      ctx.fillStyle = '#edd3c1';
      ctx.fillRect(5, 6, 6, 4);
      ctx.fillStyle = '#7a6a58'; // glasses
      ctx.fillRect(5, 7, 2, 1); ctx.fillRect(8, 7, 2, 1);
      ctx.fillStyle = '#75a68f';
      ctx.fillRect(4, 10, 8, 6);
      ctx.fillStyle = '#445b5c';
      ctx.fillRect(4, 16, 8, 5);
      ctx.fillStyle = '#2d2d2d';
      ctx.fillRect(5, 21, 2, 2); ctx.fillRect(9, 21, 2, 2);
    });

    // 3. June: Auburn hair, green retro top (matching Image 1)
    this.createCanvasTexture('npc_june', 16, 24, (ctx) => {
      ctx.fillStyle = '#9b4b24';
      ctx.fillRect(4, 2, 8, 7);
      ctx.fillRect(3, 4, 10, 8);
      ctx.fillStyle = '#f0c7a8';
      ctx.fillRect(5, 6, 6, 4);
      ctx.fillStyle = '#1e1c19';
      ctx.fillRect(6, 7, 1, 1); ctx.fillRect(9, 7, 1, 1);
      ctx.fillStyle = '#4b7e53';
      ctx.fillRect(4, 10, 8, 6);
      ctx.fillStyle = '#8f5c35';
      ctx.fillRect(4, 16, 3, 5); ctx.fillRect(9, 16, 3, 5);
      ctx.fillStyle = '#3a2012';
      ctx.fillRect(3, 21, 4, 2); ctx.fillRect(9, 21, 4, 2);
    });

    // 4. Mr. Vinyl: 1969 shopkeeper with beard and glasses
    this.createCanvasTexture('npc_mr_vinyl', 16, 24, (ctx) => {
      ctx.fillStyle = '#3b2819';
      ctx.fillRect(4, 2, 8, 5);
      ctx.fillStyle = '#e3b58c';
      ctx.fillRect(5, 5, 6, 5);
      ctx.fillStyle = '#111111'; // thick glasses
      ctx.fillRect(5, 6, 3, 2); ctx.fillRect(9, 6, 3, 2);
      ctx.fillStyle = '#3b2819'; // beard
      ctx.fillRect(5, 8, 6, 3);
      ctx.fillStyle = '#4c7391'; // denim shirt
      ctx.fillRect(4, 11, 8, 6);
      ctx.fillStyle = '#614b38';
      ctx.fillRect(5, 17, 6, 4);
      ctx.fillStyle = '#221912';
      ctx.fillRect(4, 21, 3, 2); ctx.fillRect(9, 21, 3, 2);
    });

    // 5. Timmy: Green baseball cap
    this.createCanvasTexture('npc_timmy', 16, 24, (ctx) => {
      ctx.fillStyle = '#386938';
      ctx.fillRect(4, 2, 8, 4);
      ctx.fillRect(3, 4, 4, 1);
      ctx.fillStyle = '#f0c7a8';
      ctx.fillRect(5, 6, 6, 4);
      ctx.fillStyle = '#1c1b18';
      ctx.fillRect(6, 7, 1, 1); ctx.fillRect(9, 7, 1, 1);
      ctx.fillStyle = '#e0632b';
      ctx.fillRect(4, 10, 8, 6);
      ctx.fillStyle = '#3a597a';
      ctx.fillRect(5, 16, 6, 5);
    });

    // 6. Neighbor Bob: Flannel shirt
    this.createCanvasTexture('npc_neighbor_bob', 16, 24, (ctx) => {
      ctx.fillStyle = '#664c33';
      ctx.fillRect(4, 2, 8, 4);
      ctx.fillStyle = '#e5b689';
      ctx.fillRect(5, 6, 6, 4);
      ctx.fillStyle = '#8f6e4a'; // mustache
      ctx.fillRect(5, 8, 6, 2);
      ctx.fillStyle = '#a8372b'; // flannel
      ctx.fillRect(4, 10, 8, 6);
      ctx.fillStyle = '#3a4b59';
      ctx.fillRect(5, 16, 6, 5);
    });

    // 7. Dog Buddy (16x16 cute hound)
    this.createCanvasTexture('npc_dog_buddy', 16, 16, (ctx) => {
      ctx.fillStyle = '#c79442';
      ctx.fillRect(3, 6, 10, 6);
      ctx.fillRect(10, 3, 5, 5);
      ctx.fillStyle = '#8f6224'; // ear
      ctx.fillRect(10, 4, 2, 4);
      ctx.fillStyle = '#ddaa54';
      ctx.fillRect(13, 5, 3, 3);
      ctx.fillStyle = '#1b140c';
      ctx.fillRect(15, 5, 1, 1);
      ctx.fillStyle = '#c93322'; // red collar
      ctx.fillRect(10, 7, 2, 2);
      ctx.fillStyle = '#a6772d';
      ctx.fillRect(4, 12, 2, 4); ctx.fillRect(10, 12, 2, 4);
    });
  }

  // --- Dialogue Portraits (32x32) ---

  createPortraits() {
    const drawBorder = (ctx) => {
      ctx.strokeStyle = '#243322';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 30, 30);
    };

    // June Portrait (Matching Image 1 dialogue portrait exactly!)
    this.createCanvasTexture('portrait_june', 32, 32, (ctx) => {
      ctx.fillStyle = '#f6f1de';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#9b4b24'; // auburn hair
      ctx.fillRect(7, 4, 18, 18);
      ctx.fillRect(5, 8, 22, 14);
      ctx.fillStyle = '#f0c7a8'; // face
      ctx.fillRect(10, 10, 12, 11);
      ctx.fillStyle = '#1e1c19'; // eyes
      ctx.fillRect(12, 14, 2, 2); ctx.fillRect(18, 14, 2, 2);
      ctx.fillStyle = '#c2584c'; // smile
      ctx.fillRect(14, 18, 4, 1);
      ctx.fillStyle = '#4b7e53'; // green top
      ctx.fillRect(6, 22, 20, 10);
      drawBorder(ctx);
    });

    // Mom Portrait
    this.createCanvasTexture('portrait_mom', 32, 32, (ctx) => {
      ctx.fillStyle = '#f6f1de';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#5a351a';
      ctx.fillRect(6, 4, 20, 14);
      ctx.fillStyle = '#ebd1b5';
      ctx.fillRect(10, 10, 12, 12);
      ctx.fillStyle = '#2d1b0e';
      ctx.fillRect(12, 14, 2, 2); ctx.fillRect(18, 14, 2, 2);
      ctx.fillStyle = '#c75955';
      ctx.fillRect(14, 18, 4, 2);
      ctx.fillStyle = '#c85e50';
      ctx.fillRect(6, 22, 20, 10);
      ctx.fillStyle = '#f3edd6';
      ctx.fillRect(11, 23, 10, 9);
      drawBorder(ctx);
    });

    // Mrs. Miller Portrait
    this.createCanvasTexture('portrait_miller', 32, 32, (ctx) => {
      ctx.fillStyle = '#f6f1de';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#c4c8cb';
      ctx.fillRect(12, 2, 8, 5); ctx.fillRect(8, 6, 16, 12);
      ctx.fillStyle = '#edd3c1';
      ctx.fillRect(10, 11, 12, 11);
      ctx.fillStyle = '#6e5645'; // glasses
      ctx.fillRect(10, 13, 5, 4); ctx.fillRect(17, 13, 5, 4);
      ctx.fillStyle = '#75a68f';
      ctx.fillRect(6, 22, 20, 10);
      drawBorder(ctx);
    });

    // Mr. Vinyl Portrait
    this.createCanvasTexture('portrait_vinyl', 32, 32, (ctx) => {
      ctx.fillStyle = '#f6f1de';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#3b2819';
      ctx.fillRect(8, 4, 16, 8);
      ctx.fillStyle = '#e3b58c';
      ctx.fillRect(10, 9, 12, 13);
      ctx.fillStyle = '#111111'; // horn-rimmed glasses
      ctx.fillRect(9, 11, 6, 5); ctx.fillRect(17, 11, 6, 5);
      ctx.fillStyle = '#3b2819'; // beard
      ctx.fillRect(9, 16, 14, 7);
      ctx.fillStyle = '#4c7391';
      ctx.fillRect(6, 23, 20, 9);
      drawBorder(ctx);
    });

    // Timmy Portrait
    this.createCanvasTexture('portrait_timmy', 32, 32, (ctx) => {
      ctx.fillStyle = '#f6f1de';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#386938';
      ctx.fillRect(9, 4, 14, 7); ctx.fillRect(6, 9, 8, 2);
      ctx.fillStyle = '#f0c7a8';
      ctx.fillRect(10, 11, 12, 10);
      ctx.fillStyle = '#1c1b18';
      ctx.fillRect(12, 14, 2, 2); ctx.fillRect(18, 14, 2, 2);
      ctx.fillStyle = '#e0632b';
      ctx.fillRect(7, 22, 18, 10);
      drawBorder(ctx);
    });

    // Neighbor Bob Portrait
    this.createCanvasTexture('portrait_bob', 32, 32, (ctx) => {
      ctx.fillStyle = '#f6f1de';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#664c33';
      ctx.fillRect(8, 4, 16, 6);
      ctx.fillStyle = '#e5b689';
      ctx.fillRect(10, 10, 12, 12);
      ctx.fillStyle = '#8f6e4a'; // mustache
      ctx.fillRect(10, 16, 12, 4);
      ctx.fillStyle = '#a8372b';
      ctx.fillRect(6, 22, 20, 10);
      drawBorder(ctx);
    });

    // Buddy Dog Portrait
    this.createCanvasTexture('portrait_dog', 32, 32, (ctx) => {
      ctx.fillStyle = '#f6f1de';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#c79442';
      ctx.fillRect(8, 8, 16, 14);
      ctx.fillStyle = '#8f6224'; // ears
      ctx.fillRect(6, 8, 4, 12); ctx.fillRect(22, 8, 4, 12);
      ctx.fillStyle = '#ddaa54';
      ctx.fillRect(11, 15, 10, 8);
      ctx.fillStyle = '#1b140c';
      ctx.fillRect(14, 16, 4, 3);
      drawBorder(ctx);
    });
  }

  // --- LED ZEPPELIN II (1969) Pixel-Art Record Sleeve ---

  createAlbumArt() {
    const drawLedZeppelin = (ctx, w, h) => {
      // 1969 Sunset gradient: dark brown-slate top to burning amber/orange sunset
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#2e1d23');
      grad.addColorStop(0.3, '#5c2a26');
      grad.addColorStop(0.55, '#a6422b');
      grad.addColorStop(0.75, '#d96e2e');
      grad.addColorStop(1, '#ffc247');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Sun halo in center
      ctx.fillStyle = '#ffeaa1';
      ctx.beginPath();
      ctx.arc(w / 2, 70, 24, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric clouds
      ctx.fillStyle = 'rgba(74, 33, 31, 0.55)';
      ctx.beginPath();
      ctx.ellipse(35, 45, 28, 12, 0, 0, Math.PI * 2);
      ctx.ellipse(95, 48, 30, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // The Iconic Zeppelin Airship (Led Zeppelin 1969)
      const zx = w / 2 - 28;
      const zy = 44;
      ctx.fillStyle = '#424a4d';
      ctx.beginPath();
      ctx.ellipse(zx + 28, zy + 10, 32, 10, -0.08, 0, Math.PI * 2);
      ctx.fill();

      // Zeppelin metallic highlight & ribbing
      ctx.fillStyle = '#7a878c';
      ctx.beginPath();
      ctx.ellipse(zx + 28, zy + 8, 28, 6, -0.08, 0, Math.PI * 2);
      ctx.fill();

      // Zeppelin fin & gondola
      ctx.fillStyle = '#2b3133';
      ctx.fillRect(zx + 6, zy + 5, 5, 9);
      ctx.fillRect(zx + 24, zy + 18, 10, 3);

      // Silhouetted 1969 Crowd & Band Members at bottom (Matching Image 1)
      ctx.fillStyle = '#1c1517';
      // Crowd silhouettes
      const figures = [
        [10, 102, 10, 28], [24, 96, 12, 34], [40, 104, 11, 26],
        [55, 92, 14, 38], [72, 98, 12, 32], [88, 94, 14, 36],
        [105, 100, 12, 30], [118, 106, 10, 24]
      ];
      figures.forEach(([fx, fy, fw, fh]) => {
        // Head
        ctx.beginPath();
        ctx.arc(fx + fw / 2, fy, fw / 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Body
        ctx.fillRect(fx, fy + 4, fw, fh);
      });

      // Bottom border line
      ctx.fillRect(0, h - 8, w, 8);

      // Psychedelic 1969 Typography "LED ZEPPELIN II"
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px "Courier Prime", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LED ZEPPELIN II', w / 2, 18);

      // Gold outline on title
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    };

    // 1. Phaser texture
    this.createCanvasTexture('album_led_zeppelin_ii', 130, 130, (ctx, w, h) => {
      drawLedZeppelin(ctx, w, h);
    });

    // 2. Sidebar thumbnail canvas
    const sideCanvas = document.getElementById('album-preview-canvas');
    if (sideCanvas) {
      const sctx = sideCanvas.getContext('2d');
      drawLedZeppelin(sctx, 130, 130);
    }
  }
}
