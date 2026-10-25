# SIDE B: One Perfect Afternoon (1969)

> **A 2D Top-Down 1969 Retro Pixel-Art Neighborhood Adventure**  
> Built with Phaser 3, JavaScript (ES Modules), and Vite.

---

## 📻 The Premise

It is an unforgettable Saturday afternoon in **October 1969**. The autumn sun is casting golden rays across the suburban lawns of Oakwood, and you have one dream: buying the newly released album **Led Zeppelin II** from Mr. Vinyl's neighborhood record shop before it closes at 6:00 PM.

The album costs **$25.00**. You currently have **$4.00** in your pocket.

Your mom has handed you your afternoon chore list:
1. **Take out the trash** by the garage (+ $2.00)
2. **Trim the garden hedges** (+ $3.00 to $6.00 based on timing skill)
3. **Deliver Mrs. Miller's parcel** (+ $7.00)

Along the way, the neighborhood is alive with friends, neighbors, distractions, and favors:
- **Help June with the Radio Quiz** (+ $2.00): Hang out in Oakwood Park and groove to the 4:00 PM broadcast.
- **Find Buddy the Lost Dog** (+ $3.00): Rescue Neighbor Bob's golden hound who wandered into the park flowers.
- **Timmy's Math Bet** (+ $2.00): Help kid Timmy solve a quick arithmetic riddle.
- **Return the Missing Newspaper** (+ $2.00): Spot the dropped Gazette on the sidewalk and return it.

Once you have saved $25, head to **Mr. Vinyl's Record Shop**, buy **Led Zeppelin II**, and return to your bedroom to drop the needle as evening falls.

---

## 📺 Widescreen Play Area Design

- **~78% Desktop Width Play Area**: The game canvas fills the vast majority of the browser screen vertically and horizontally with zero wasted margins.
- **Expansive 64 × 48 Multi-Block Map (1024 × 768 px)**: Smooth camera tracking reveals multiple streets, Oakwood Park with a swimming duck pond and wooden dock, driveways, garages with parked 1969 muscle cars, and Mr. Vinyl's record store.
- **Internal Resolution**: Crisp 512 × 288 (16:9) rendering with integer pixel-art scaling and nearest-neighbor interpolation.

---

## 🕹️ Controls

| Key | Action |
|---|---|
| **WASD** or **Arrow Keys** | Walk through the neighborhood (tile-by-tile grid movement) |
| **E** | Talk to NPCs / Inspect objects / Interact |
| **SPACE** | Confirm dialogue / Cut hedges / Rhythm tap |
| **1, 2, 3** | Dialogue decisions & Quiz answers |
| **F** (or **ESC**) | Close dialogue / Step outside record shop |

---

## 💰 Economy Breakdown

| Activity | Reward | Total Cash |
|---|---|---|
| Starting Pocket Money | — | **$4.00** |
| Take out the trash | +$2.00 | **$6.00** |
| Trim garden hedges (Timing Minigame) | +$3.00 – $6.00 | **$9.00 – $12.00** |
| Deliver Mrs. Miller's parcel | +$7.00 | **$16.00 – $19.00** |
| Help June with the radio quiz | +$2.00 | **$18.00 – $21.00** |
| Find Buddy (lost dog) | +$3.00 | **$21.00 – $24.00** |
| Timmy's math bet | +$2.00 | **$23.00 – $26.00** |
| Return the missing newspaper | +$2.00 | **$25.00 – $28.00** |
| **Buy Led Zeppelin II** | **-$25.00** | **Goal Achieved!** |

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run Vite dev server
npm run dev

# 3. Open in browser at:
# http://localhost:5173/
```

Or open `standalone.html` in your browser for instant play with zero setup required.

---

*“Some afternoons stay with you forever.”*
