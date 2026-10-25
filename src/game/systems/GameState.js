/**
 * GameState.js
 * Centralized, reactive state management for SIDE B (1969)
 */

class GameState {
  constructor() {
    this.initialState = {
      cash: 4,
      cashEarned: 0,
      timeMinutes: 15 * 60 + 15, // 3:15 PM
      quests: {
        introGiven: false,
        trash: false,
        hedge: false,
        hedgeScore: 0,
        parcelCollected: false,
        parcelDelivered: false,
        juneDone: false,
        dogFound: false,
        dogRescued: false,
        dogFollowing: false,
        mathDone: false,
        newspaperFound: false,
        newspaperReturned: false,
        albumBought: false,
        lemonadeBought: false,
        returnedHome: false
      },
      inventory: [],
      dogFollowing: false,
      playerPos: { x: 7, y: 32 }
    };

    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.listeners = [];
  }

  reset() {
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.save();
    this.notify();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.state);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.updateDomHUD();
    this.listeners.forEach(cb => {
      try { cb(this.state); } catch (e) { console.error(e); }
    });
  }

  // --- Cash Operations ---

  addCash(amount) {
    this.state.cash += amount;
    if (amount > 0) this.state.cashEarned = (this.state.cashEarned || 0) + amount;
    this.save();
    this.notify();
  }

  canAfford(amount) {
    return this.state.cash >= amount;
  }

  deductCash(amount) {
    if (this.canAfford(amount)) {
      this.state.cash -= amount;
      this.save();
      this.notify();
      return true;
    }
    return false;
  }

  // --- Time Management ---

  advanceTime(minutes = 5) {
    this.state.timeMinutes += minutes;
    this.save();
    this.notify();
  }

  getFormattedTime() {
    const totalMinutes = this.state.timeMinutes;
    let hours = Math.floor(totalMinutes / 60) % 24;
    const mins = totalMinutes % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const displayMins = mins < 10 ? '0' + mins : mins;
    return `SAT ${displayHours}:${displayMins} ${ampm}`;
  }

  // --- Inventory & Quest Flags ---

  hasItem(itemName) {
    return this.state.inventory.includes(itemName);
  }

  addItem(itemName) {
    if (!this.hasItem(itemName)) {
      this.state.inventory.push(itemName);
      this.save();
      this.notify();
    }
  }

  removeItem(itemName) {
    this.state.inventory = this.state.inventory.filter(i => i !== itemName);
    this.save();
    this.notify();
  }

  setQuest(questName, value = true) {
    this.state.quests[questName] = value;
    this.save();
    this.notify();
  }

  getCompletedChoreCount() {
    let count = 0;
    if (this.state.quests.trash) count++;
    if (this.state.quests.hedge) count++;
    if (this.state.quests.parcelDelivered) count++;
    return count;
  }

  // --- Save / Load LocalStorage ---

  save() {
    try {
      localStorage.setItem('side_b_1969_save', JSON.stringify(this.state));
    } catch (e) {}
  }

  load() {
    try {
      const data = localStorage.getItem('side_b_1969_save');
      if (data) {
        const parsed = JSON.parse(data);
        this.state = Object.assign({}, this.initialState, parsed);
        this.notify();
        return true;
      }
    } catch (e) {}
    return false;
  }

  // --- Synchronize with HTML DOM elements ---

  updateDomHUD() {
    const timeEl = document.getElementById('hud-time');
    const cashEl = document.getElementById('hud-cash');
    const questCountEl = document.getElementById('quest-count');
    const savingsInfoEl = document.getElementById('album-savings-info');
    const albumTagEl = document.getElementById('album-status-tag');

    if (timeEl) timeEl.textContent = this.getFormattedTime();
    if (cashEl) cashEl.textContent = `$${this.state.cash}`;
    if (questCountEl) questCountEl.textContent = `${this.getCompletedChoreCount()}/3`;

    // Savings formula: CASH: $6 • ALBUM: $25 • NEED: $19 MORE
    if (savingsInfoEl) {
      if (this.state.quests.albumBought) {
        savingsInfoEl.textContent = 'ALBUM BOUGHT! IN BAG';
        savingsInfoEl.style.background = '#d8ebd3';
        savingsInfoEl.style.color = '#1b5e20';
      } else if (this.state.cash >= 25) {
        savingsInfoEl.textContent = `CASH: $${this.state.cash} • GO TO RECORD SHOP!`;
        savingsInfoEl.style.background = '#fff0c7';
        savingsInfoEl.style.color = '#7d5400';
      } else {
        const needed = 25 - this.state.cash;
        savingsInfoEl.textContent = `CASH: $${this.state.cash} • NEED: $${needed} MORE`;
        savingsInfoEl.style.background = '#efe7cf';
        savingsInfoEl.style.color = '#31422d';
      }
    }

    if (albumTagEl) {
      if (this.state.quests.albumBought) {
        albumTagEl.textContent = 'OWNED';
        albumTagEl.style.color = '#1e6826';
      } else {
        albumTagEl.textContent = '$25';
      }
    }

    // Quest checkboxes
    const updateItem = (id, isDone) => {
      const itemEl = document.getElementById(id);
      const checkEl = itemEl ? itemEl.querySelector('.quest-checkbox') : null;
      if (itemEl && checkEl) {
        if (isDone) {
          itemEl.classList.add('completed');
          checkEl.innerHTML = '&#10003;';
        } else {
          itemEl.classList.remove('completed');
          checkEl.innerHTML = '';
        }
      }
    };

    updateItem('q-trash', this.state.quests.trash);
    updateItem('q-hedge', this.state.quests.hedge);
    updateItem('q-parcel', this.state.quests.parcelDelivered);
    updateItem('q-optional-june', this.state.quests.juneDone);
    updateItem('q-optional-dog', this.state.quests.dogRescued);
    updateItem('q-optional-math', this.state.quests.mathDone);
    updateItem('q-optional-paper', this.state.quests.newspaperReturned);
  }
}

export const gameState = new GameState();
