/**
 * GameState.js
 * Centralized, reactive state management for SIDE B
 */

class GameState {
  constructor() {
    this.initialState = {
      cash: 4,
      timeMinutes: 15 * 60 + 15, // 3:15 PM
      quests: {
        trash: false,
        hedge: false,
        hedgeScore: 0,
        parcelCollected: false,
        parcelDelivered: false,
        mathDone: false,
        juneDone: false,
        dogFound: false,
        dogRescued: false,
        benchCoinFound: false,
        albumBought: false,
        returnedHome: false
      },
      inventory: [],
      dogFollowing: false,
      playerPos: { x: 5, y: 22 }
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
    return `Sat ${displayHours}:${displayMins} ${ampm}`;
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
      localStorage.setItem('side_b_save', JSON.stringify(this.state));
    } catch (e) {}
  }

  load() {
    try {
      const data = localStorage.getItem('side_b_save');
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

    if (timeEl) timeEl.textContent = this.getFormattedTime();
    if (cashEl) cashEl.textContent = `$${this.state.cash}`;
    if (questCountEl) questCountEl.textContent = `${this.getCompletedChoreCount()}/3`;

    // Quest checkboxes & classes
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
    updateItem('q-optional-math', this.state.quests.mathDone);
    updateItem('q-optional-june', this.state.quests.juneDone);
    updateItem('q-optional-dog', this.state.quests.dogRescued);

    // Album tag update
    const albumTag = document.getElementById('album-status-tag');
    if (albumTag) {
      if (this.state.quests.albumBought) {
        albumTag.textContent = 'PURCHASED &bull; IN BAG';
        albumTag.style.background = '#d9eed3';
        albumTag.style.borderColor = '#47814b';
        albumTag.style.color = '#1f5323';
      } else if (this.state.cash >= 25) {
        albumTag.textContent = 'CAN AFFORD &bull; GO TO SHOP!';
        albumTag.style.background = '#fff1cb';
        albumTag.style.borderColor = '#c59223';
        albumTag.style.color = '#7c5308';
      } else {
        albumTag.textContent = `Cost: $25 &bull; Need $${25 - this.state.cash} more`;
        albumTag.style.background = '#eee5cb';
        albumTag.style.borderColor = '#7c6f50';
        albumTag.style.color = '#2b3a29';
      }
    }
  }
}

export const gameState = new GameState();
