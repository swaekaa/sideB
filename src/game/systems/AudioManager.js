/**
 * AudioManager.js
 * Pure Web Audio API Synthesizer for SIDE B
 * Zero external audio files required. Completely offline & authentic 70s retro sound.
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.musicTimer = null;
    this.currentMusicType = null;
    this.crackleNode = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMusic();
    } else if (this.currentMusicType) {
      this.playMusic(this.currentMusicType);
    }
    return this.isMuted;
  }

  // --- Sound Effects ---

  playStep() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch (e) {}
  }

  playTalk(speaker = 'player') {
    if (this.isMuted || !this.ctx) return;
    try {
      let freq = 420;
      let wave = 'square';
      if (speaker === 'mom') { freq = 620; wave = 'sine'; }
      else if (speaker === 'miller') { freq = 540; wave = 'triangle'; }
      else if (speaker === 'vinyl') { freq = 210; wave = 'sawtooth'; }
      else if (speaker === 'june') { freq = 580; wave = 'sine'; }
      else if (speaker === 'timmy') { freq = 740; wave = 'square'; }
      else if (speaker === 'dog') { freq = 320; wave = 'sawtooth'; }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq + (Math.random() * 40 - 20), this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }

  playCoin() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, t); // B5
      osc.frequency.setValueAtTime(1318.51, t + 0.08); // E6
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    } catch (e) {}
  }

  playSnip() {
    if (this.isMuted || !this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.07;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2400;
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (e) {}
  }

  playSuccess() {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const t = this.ctx.currentTime;
      notes.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t + idx * 0.08);
        gain.gain.setValueAtTime(0.1, t + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.24);
      });
    } catch (e) {}
  }

  playError() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.setValueAtTime(110, t + 0.1);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    } catch (e) {}
  }

  playNeedleDrop() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // Low thump
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);

      // Vinyl hiss / crackle burst
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() > 0.985 ? (Math.random() * 2 - 1) * 0.6 : 0) + (Math.random() * 0.03 - 0.015);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gainN = this.ctx.createGain();
      gainN.gain.setValueAtTime(0.12, t);
      gainN.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      noise.connect(gainN);
      gainN.connect(this.ctx.destination);
      noise.start(t);
    } catch (e) {}
  }

  // --- Music Synthesizer ---

  playMusic(type = 'radio') {
    this.currentMusicType = type;
    if (this.isMuted || !this.ctx) return;
    this.stopMusic();

    if (type === 'radio') {
      this.startRadioLoop();
    } else if (type === 'ending') {
      this.playNeedleDrop();
      setTimeout(() => {
        if (!this.isMuted) this.startEndingLoop();
      }, 500);
    }
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  startRadioLoop() {
    // 70s funky minor groove: A - C - D - E - G
    const bassline = [110, 110, 130.81, 146.83, 164.81, 146.83, 130.81, 98];
    const chords = [
      [220, 261.63, 329.63], // Am
      [220, 261.63, 329.63],
      [174.61, 220, 261.63], // F
      [196, 246.94, 293.66]  // G
    ];
    let step = 0;

    const playStepBeat = () => {
      if (this.isMuted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        // Bass
        const bassFreq = bassline[step % bassline.length];
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassFreq, t);
        bassGain.gain.setValueAtTime(0.05, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(t);
        bassOsc.stop(t + 0.23);

        // Chords every 2 steps
        if (step % 2 === 0) {
          const chordIndex = Math.floor((step % 8) / 2);
          const chord = chords[chordIndex];
          chord.forEach(f => {
            const chOsc = this.ctx.createOscillator();
            const chGain = this.ctx.createGain();
            chOsc.type = 'triangle';
            chOsc.frequency.setValueAtTime(f, t);
            chGain.gain.setValueAtTime(0.03, t);
            chGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
            chOsc.connect(chGain);
            chGain.connect(this.ctx.destination);
            chOsc.start(t);
            chOsc.stop(t + 0.46);
          });
        }
        step++;
      } catch (e) {}
    };

    playStepBeat();
    this.musicTimer = setInterval(playStepBeat, 260);
  }

  startEndingLoop() {
    // Nostalgic warm 70s progression: D - F#m - Bm - G - A - D
    const progression = [
      { chord: [293.66, 369.99, 440], bass: 73.42 }, // D
      { chord: [277.18, 369.99, 440], bass: 92.50 }, // F#m
      { chord: [246.94, 293.66, 369.99], bass: 61.74 }, // Bm
      { chord: [196.00, 246.94, 293.66], bass: 49.00 }, // G
      { chord: [220.00, 277.18, 329.63], bass: 55.00 }, // A
      { chord: [293.66, 369.99, 440], bass: 73.42 }  // D
    ];
    let progIndex = 0;

    const playChordBar = () => {
      if (this.isMuted || !this.ctx) return;
      try {
        const item = progression[progIndex % progression.length];
        const t = this.ctx.currentTime;

        // Warm electric piano pad
        item.chord.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.05);
          gain.gain.setValueAtTime(0.07, t + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.005, t + 1.8);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.05);
          osc.stop(t + 1.85);
        });

        // Warm sub-bass
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(item.bass * 2, t);
        bGain.gain.setValueAtTime(0.08, t);
        bGain.gain.exponentialRampToValueAtTime(0.005, t + 1.6);
        bOsc.connect(bGain);
        bGain.connect(this.ctx.destination);
        bOsc.start(t);
        bOsc.stop(t + 1.65);

        progIndex++;
      } catch (e) {}
    };

    playChordBar();
    this.musicTimer = setInterval(playChordBar, 1900);
  }
}

export const audioManager = new AudioManager();
