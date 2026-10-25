# SIDE B: One Perfect Afternoon (1977)

> **A 2D Top-Down 1970s Pixel-Art Neighborhood Adventure**  
> Built with Phaser 3, JavaScript (ES Modules), and Vite.

---

## 📻 The Premise

It is Saturday, July 1977. The air is warm, cicadas are buzzing in the front yards, and you have one dream: buying your favorite vinyl album, **Midnight Radio**, from Mr. Vinyl's neighborhood record shop before it closes at 6:00 PM.

The album costs **$25.00**. You currently have **$4.00** in your pocket.

Your mom has handed you an afternoon chore list:
1. **Take out the trash** (+ $2.00)
2. **Trim the unruly garden hedges** (+ $3.00 to $6.00 based on timing skill)
3. **Deliver Mrs. Miller's parcel** (+ $7.00)

Along the way, the neighborhood is alive with friends, neighbors, distractions, and favors:
- **Timmy's Math Bet** (+ $2.00): Help friendly neighbor kid Timmy solve a math riddle.
- **June's Radio Groove** (+ $3.00): Hang out in the park with June and jam along to the 4:00 PM radio broadcast.
- **Neighbor Bob's Lost Dog** (+ $4.00): Rescue Barnaby the golden retriever who wandered into the park flowers.
- **Park Bench Coin** (+ $1.00): Spot a shiny dropped coin under the bench by the pond.

Once you have saved $25, visit **Mr. Vinyl's Record Shop**, buy **Midnight Radio**, and return to your bedroom to drop the needle as the golden twilight fades into evening.

---

## 🕹️ Controls

| Key | Action |
|---|---|
| **WASD** or **Arrow Keys** | Walk through the neighborhood (tile-by-tile grid movement) |
| **E** | Talk to NPCs / Inspect objects / Interact |
| **SPACE** | Confirm dialogue / Cut hedges / Rhythm tap |
| **1, 2, 3** | Dialogue decisions & Quiz answers |
| **ESC** | Close dialogue / Step outside record shop |

---

## 🎨 Aesthetic & Visual Direction

Inspired by classic late-1970s printed record store flyers, vintage handheld RPGs, and retro pixel-art life sims:
- **Logical Low Resolution**: Crisp internal 384 × 216 pixel rendering scaled with nearest-neighbor integer interpolation.
- **Color Palette**: Muted olive green (`#6b8c42`), deep pine green, sandstone beige (`#d9ceb2`), terracotta roof tiles (`#ad4735`), faded road asphalt, and warm 70s denim and mustard.
- **Detailed Pixel Art**: Original character sprites (Player, Mom, Mrs. Miller, June, Mr. Vinyl, Timmy, Neighbor Bob, Barnaby the dog), buildings, windows with curtains, white picket fences, animated water pond with lily pads, vintage station wagons, and the iconic *Midnight Radio* album sleeve.

---

## 🔊 Audio Engine (Web Audio API)

No external audio files required! 100% self-contained procedural synthesis:
- **Step Sounds**: Subtle analog footstep clicks.
- **Typewriter Dialogue Blips**: Distinct vocal pitches for each character.
- **Cash Chime**: Two-tone arcade reward bells.
- **Shears Snip**: High-passed noise burst with physical snap.
- **Needle Drop & Vinyl Crackle**: Authentic retro turntable crackle.
- **Music Loops**:
  - *Park Radio*: 1970s funky minor groove with bassline and chord progression.
  - *Ending Scene*: Warm, nostalgic chord progression (*D - F#m - Bm - G - A - D*) with soft synth piano pads.

---

## 🚀 How to Run Locally

### Option A: Standard Vite Development Server (Recommended)

1. Make sure **Node.js** (v18+) and **npm** are installed.
2. In this directory, install the project dependencies:
   ```bash
   npm install
   ```
3. Start the local Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

### Option B: Build for Production

```bash
npm run build
npm run preview
```

### Option C: Standalone Playable Edition (Zero Setup)

If you wish to play immediately without running Node/npm:
- Open `standalone.html` in any modern web browser or serve it with any lightweight static server:
  ```bash
  npx serve .
  # or
  python -m http.server 8000
  ```

---

## 📂 Project Architecture

```
sideB/
├── index.html                   # 1970s HUD layout, side panel, canvas mount
├── standalone.html              # Standalone single-file playable edition
├── package.json                 # Phaser 3 and Vite dependencies
├── vite.config.js               # Vite bundler configuration
├── .gitignore                   # Ignore node_modules, dist, logs
├── README.md                    # Complete game documentation
└── src/
    ├── main.js                  # Entry point, game instance, audio unlocker
    ├── style.css                # Retro printed paper styling, fonts, UI layout
    └── game/
        ├── config.js            # Phaser 3 display & physics configuration
        ├── scenes/
            ├── BootScene.js             # Asset generation & game boot
            ├── NeighborhoodScene.js     # 44x34 tile overworld, NPCs, movement
            ├── HedgeMinigameScene.js     # Timing meter hedge-cutting minigame
            ├── MathMinigameScene.js      # Timmy's arithmetic bet
            ├── JuneMinigameScene.js      # Rhythm beat wave hangout with June
            ├── RecordShopScene.js       # Store interior, Mr. Vinyl, album buy
            └── EndingScene.js           # Bedroom listening finale, record player
        ├── systems/
            ├── AssetGenerator.js        # Programmatic pixel-art generator
            ├── AudioManager.js          # Pure Web Audio synthesizer & tunes
            └── GameState.js             # Reactive wallet, inventory, quest flags
        └── ui/
            └── DialogueBox.js           # Typewriter dialogue with portraits
```

---

## 💰 Economy Breakdown

| Activity | Reward | Total Accumulation |
|---|---|---|
| Starting Pocket Money | — | **$4.00** |
| Take out the trash | +$2.00 | **$6.00** |
| Trim garden hedges (Timing Minigame) | +$3.00 to $6.00 | **$9.00 – $12.00** |
| Deliver Mrs. Miller's parcel | +$7.00 | **$16.00 – $19.00** |
| Timmy's math bet | +$2.00 | **$18.00 – $21.00** |
| June's radio hangout | +$3.00 | **$21.00 – $24.00** |
| Neighbor Bob's dog Barnaby | +$4.00 | **$25.00 – $28.00** |
| Shiny park bench coin | +$1.00 | **$26.00 – $29.00** |
| **Buy Midnight Radio** | **-$25.00** | **Goal Achieved!** |

---

*“Some afternoons stay with you forever.”*
