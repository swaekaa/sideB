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

  playStep(ground = 'grass') {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;

      if (ground === 'concrete') {
        // Crisp, firm snap on hard sidewalk / concrete
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, t);
        osc.frequency.exponentialRampToValueAtTime(110, t + 0.035);
        gain.gain.setValueAtTime(0.055, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.038);

        // Click transient
        const bSize = Math.floor(this.ctx.sampleRate * 0.02);
        const buf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bSize; i++) d[i] = Math.random() * 2 - 1;
        const n = this.ctx.createBufferSource();
        n.buffer = buf;
        const f = this.ctx.createBiquadFilter();
        f.type = 'bandpass';
        f.frequency.value = 2400;
        f.Q.value = 3;
        const ng = this.ctx.createGain();
        ng.gain.setValueAtTime(0.04, t);
        ng.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
        n.connect(f);
        f.connect(ng);
        ng.connect(this.ctx.destination);
        n.start(t);

      } else if (ground === 'road') {
        // Deep solid thud on asphalt
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(130, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.045);
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.048);

        // Asphalt grit
        const bSize = Math.floor(this.ctx.sampleRate * 0.03);
        const buf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bSize; i++) d[i] = Math.random() * 2 - 1;
        const n = this.ctx.createBufferSource();
        n.buffer = buf;
        const f = this.ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = 1100;
        const ng = this.ctx.createGain();
        ng.gain.setValueAtTime(0.03, t);
        ng.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        n.connect(f);
        f.connect(ng);
        ng.connect(this.ctx.destination);
        n.start(t);

      } else if (ground === 'stone') {
        // Clinking firm stone strike on garden pavers
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(360, t);
        osc.frequency.exponentialRampToValueAtTime(170, t + 0.035);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.038);

      } else if (ground === 'wood') {
        // Hollow, resonant wooden clop/clack on wooden dock/pier
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.06);
        gain.gain.setValueAtTime(0.075, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

        const resFilter = this.ctx.createBiquadFilter();
        resFilter.type = 'bandpass';
        resFilter.frequency.value = 520;
        resFilter.Q.value = 4;

        osc.connect(resFilter);
        resFilter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.065);

      } else {
        // 'grass' — Soft, organic rustle/crush in lawn
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(75, t);
        osc.frequency.exponentialRampToValueAtTime(32, t + 0.04);
        gain.gain.setValueAtTime(0.035, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.042);

        // Soft grass rustle noise
        const bSize = Math.floor(this.ctx.sampleRate * 0.04);
        const buf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bSize; i++) d[i] = Math.random() * 2 - 1;
        const n = this.ctx.createBufferSource();
        n.buffer = buf;
        const f = this.ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = 750;
        const ng = this.ctx.createGain();
        ng.gain.setValueAtTime(0.025, t);
        ng.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        n.connect(f);
        f.connect(ng);
        ng.connect(this.ctx.destination);
        n.start(t);
      }
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

  playMusic(type = 'blues') {
    this.currentMusicType = type;
    if (this.isMuted || !this.ctx) return;
    this.stopMusic();

    if (type === 'blues') {
      this.startBluesGuitarLoop();
    } else if (type === 'radio') {
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

  // --- 1969 Subtle Blues Guitar Synthesizer ---

  startBluesGuitarLoop() {
    // 12-bar Delta / Chicago Blues in E (Laid-back 74 BPM swing groove)
    const beatSec = 0.81;
    let currentBeat = 0;
    let nextBeatTime = this.ctx.currentTime + 0.05;

    // Frequencies (Hz) for E blues
    const E2 = 82.41, G2 = 98.00, A2 = 110.00, B2 = 123.47;
    const E3 = 164.81, G3 = 196.00, Gs3 = 207.65, A3 = 220.00, Bb3 = 233.08, B3 = 246.94;
    const C4 = 261.63, Cs4 = 277.18, D4 = 293.66, Ds4 = 311.13, E4 = 329.63, Fs4 = 369.99, G4 = 392.00;

    // 12-bar lick definition: [relativeBeatOffset, freq, duration, volume, bendSemitones]
    const barLicks = {
      0: [[0.5, E3, 0.4, 0.035, 0], [1.5, G3, 0.4, 0.04, 0.6], [2.2, Gs3, 0.5, 0.04, 0], [3.0, B3, 0.6, 0.042, 0]],
      1: [[0.5, D4, 0.4, 0.04, 0], [1.5, E4, 0.8, 0.045, 0], [3.2, B3, 0.5, 0.035, 0]],
      2: [[0.5, D4, 0.4, 0.04, 0], [1.5, B3, 0.4, 0.038, 0], [2.3, G3, 0.5, 0.04, 0.8], [3.2, E3, 0.7, 0.045, 0]],
      3: [[1.5, G2, 0.4, 0.035, 0], [2.3, A2, 0.4, 0.038, 0], [3.0, Bb3, 0.4, 0.04, 0], [3.5, B3, 0.6, 0.045, 0]],
      4: [[0.5, A3, 0.5, 0.04, 0], [1.5, C4, 0.4, 0.038, 0.5], [2.5, E4, 0.7, 0.045, 0]],
      5: [[0.5, G4, 0.5, 0.045, 0.7], [1.5, E4, 0.6, 0.042, 0], [2.5, D4, 0.4, 0.038, 0], [3.2, A3, 0.6, 0.04, 0]],
      6: [[0.5, E3, 0.4, 0.035, 0], [1.5, Gs3, 0.5, 0.04, 0], [2.5, B3, 0.7, 0.045, 0]],
      7: [[0.5, E4, 0.8, 0.045, 0], [2.0, D4, 0.5, 0.04, 0], [3.0, B3, 0.6, 0.038, 0]],
      8: [[0.5, B3, 0.5, 0.045, 0], [1.5, Ds4, 0.5, 0.042, 0], [2.5, Fs4, 0.7, 0.045, 0]],
      9: [[0.5, A3, 0.5, 0.04, 0], [1.5, G3, 0.5, 0.038, 0.6], [2.5, E3, 0.8, 0.045, 0]],
      10: [[0.0, D4, 0.45, 0.04, 0], [1.0, Cs4, 0.45, 0.04, 0], [2.0, C4, 0.45, 0.04, 0], [3.0, B3, 0.6, 0.045, 0]],
      11: [[0.5, E3, 0.6, 0.038, 0], [1.5, Gs3, 0.6, 0.038, 0], [2.5, B2, 0.8, 0.045, 0], [3.2, B3, 0.8, 0.045, 0]]
    };

    const scheduleBeat = (beatIndex, time) => {
      if (this.isMuted || !this.ctx) return;
      const bar = Math.floor(beatIndex / 4);
      const beatInBar = beatIndex % 4;

      // 1. Walking Acoustic Bass Notes
      if (beatInBar === 0 || beatInBar === 2) {
        let bassNote = E2;
        if (bar === 4 || bar === 5 || bar === 9) bassNote = A2;
        else if (bar === 8 || bar === 11) bassNote = B2;
        else if (beatInBar === 2) bassNote = (bar === 8) ? 92.50 /* F#2 */ : (bar === 4 || bar === 5) ? E2 : B2;

        this.playBassPluck(bassNote, time, 0.75, 0.032);
      }

      // 2. Subtle Acoustic Body Tap / Brush Snare on beats 2 & 4
      if (beatInBar === 1 || beatInBar === 3) {
        this.playBrushTap(time, 0.012);
      }

      // 3. Lead Guitar Licks
      if (beatInBar === 0 && barLicks[bar]) {
        barLicks[bar].forEach(([offset, freq, dur, vol, bend]) => {
          this.playGuitarPluck(freq, time + offset * beatSec, dur, vol, bend);
        });
      }
    };

    const runner = () => {
      if (this.isMuted || !this.ctx) return;
      const lookahead = 0.25;
      while (nextBeatTime < this.ctx.currentTime + lookahead) {
        scheduleBeat(currentBeat, nextBeatTime);
        nextBeatTime += beatSec;
        currentBeat = (currentBeat + 1) % 48;
      }
    };

    runner();
    this.musicTimer = setInterval(runner, 120);
  }

  playGuitarPluck(freq, time, duration = 1.2, volume = 0.04, bend = 0) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = time || this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      subOsc.type = 'sawtooth';

      osc.frequency.setValueAtTime(freq, t);
      subOsc.frequency.setValueAtTime(freq, t);

      if (bend !== 0) {
        const targetFreq = freq * Math.pow(2, bend / 12);
        osc.frequency.exponentialRampToValueAtTime(targetFreq, t + 0.14);
        subOsc.frequency.exponentialRampToValueAtTime(targetFreq, t + 0.14);
      }

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(freq * 5.5, 2400), t);
      filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.6, 220), t + 0.35);
      filter.Q.value = 1.6;

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(volume, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(volume * 0.45, t + 0.22);
      gain.gain.exponentialRampToValueAtTime(0.0005, t + duration);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      subOsc.start(t);
      osc.stop(t + duration + 0.05);
      subOsc.stop(t + duration + 0.05);
    } catch (e) {}
  }

  playBassPluck(freq, time, duration = 0.8, volume = 0.035) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = time || this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, t);
      filter.frequency.exponentialRampToValueAtTime(110, t + 0.25);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(volume, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + duration + 0.05);
    } catch (e) {}
  }

  playBrushTap(time, volume = 0.015) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = time || this.ctx.currentTime;
      const bSize = Math.floor(this.ctx.sampleRate * 0.03);
      const buf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bSize; i++) d[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, t);
      filter.Q.value = 2;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, t);
      gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.03);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(t);
    } catch (e) {}
  }
}

export const audioManager = new AudioManager();
