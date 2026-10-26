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
    this.mp3Audio = null;
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
      if (this.mp3Audio) {
        try { this.mp3Audio.pause(); } catch (e) {}
      }
      if (this.musicTimer) {
        clearInterval(this.musicTimer);
        this.musicTimer = null;
      }
    } else {
      if (this.mp3Audio && (this.currentMusicType === 'ending' || this.currentMusicType === 'zeppelin')) {
        this.mp3Audio.play().catch(() => {});
      } else if (this.currentMusicType) {
        this.playMusic(this.currentMusicType);
      }
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

  playTypewriter() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 + Math.random() * 600, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.02);
      gain.gain.setValueAtTime(0.045, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.022);
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

  playVinylCrackle(vol = 0.04) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() > 0.99 ? (Math.random() * 2 - 1) * 0.45 : 0) + (Math.random() * 0.018 - 0.009);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.34);
      noise.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);
    } catch (e) {}
  }

  stopSynthesizer() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  // --- Music Synthesizer ---

  playMusic(type = 'ambient') {
    this.currentMusicType = type;
    if (this.isMuted) return;
    this.init();
    this.stopMusic();

    if (type === 'title') {
      this.startTitleTheme();
    } else if (type === 'ambient' || type === 'blues' || type === 'bgm') {
      this.startAmbientNostalgiaLoop();
    } else if (type === 'radio') {
      this.startRadioLoop();
    } else if (type === 'ending' || type === 'zeppelin') {
      this.playNeedleDrop();
      if (this.needleTimeout) clearTimeout(this.needleTimeout);
      this.needleTimeout = setTimeout(() => {
        if (!this.isMuted && (this.currentMusicType === 'ending' || this.currentMusicType === 'zeppelin')) {
          this.playWholeLottaLoveAudio();
        }
      }, 520);
    }
  }

  resumeAmbientBGM() {
    if (this.currentMusicType !== 'ending' && this.currentMusicType !== 'zeppelin') {
      this.playMusic('ambient');
    }
  }

  stopMusic() {
    if (this.needleTimeout) {
      clearTimeout(this.needleTimeout);
      this.needleTimeout = null;
    }
    this.stopSynthesizer();
    if (this.mp3Audio) {
      try {
        this.mp3Audio.pause();
        this.mp3Audio.currentTime = 0;
      } catch (e) {}
      this.mp3Audio = null;
    }
  }

  playWholeLottaLoveAudio() {
    // 1. Immediately shut down any ongoing synthesized loops (ambient, synth riff, radio, etc.)
    this.stopSynthesizer();
    this.currentMusicType = 'ending';
    if (this.isMuted) return;

    // If an MP3 audio instance is already playing Whole Lotta Love, ensure synth is stopped and return
    if (this.mp3Audio && !this.mp3Audio.paused) {
      this.stopSynthesizer();
      return;
    }

    // Stop any stale MP3 before creating a new one
    if (this.mp3Audio) {
      try {
        this.mp3Audio.pause();
        this.mp3Audio.currentTime = 0;
      } catch (e) {}
      this.mp3Audio = null;
    }

    // Exact URL served by Vite from src/public
    const songUrl = encodeURI('/Led_Zeppelin_-_Whole_Lotta_Love_Official_Music_Video_(mp3.pm).mp3');

    try {
      const audio = new Audio();
      audio.src = songUrl;
      audio.volume = 0.70;
      audio.loop = true;
      let started = false;

      const triggerPlay = () => {
        if (started) return;
        if (this.currentMusicType !== 'ending' && this.currentMusicType !== 'zeppelin') return;
        if (this.isMuted) return;

        started = true;
        // Absolutely stop any synthesizer or background loop!
        this.stopSynthesizer();

        audio.play().then(() => {
          this.mp3Audio = audio;
          // Re-assert that no synthesizer or background loop is active
          this.stopSynthesizer();
        }).catch((err) => {
          console.warn('MP3 play permission or load failed:', err);
          // Only fall back to synthesizer if HTML5 Audio completely fails to play
          if (!this.mp3Audio && (this.currentMusicType === 'ending' || this.currentMusicType === 'zeppelin')) {
            this.startWholeLottaLoveLoop();
          }
        });
      };

      audio.oncanplay = triggerPlay;
      audio.onloadeddata = triggerPlay;

      audio.onerror = (e) => {
        console.warn('MP3 file error, using synth fallback:', e);
        if (!started && !this.mp3Audio && (this.currentMusicType === 'ending' || this.currentMusicType === 'zeppelin')) {
          this.startWholeLottaLoveLoop();
        }
      };

      audio.load();
    } catch (e) {
      console.warn('Audio construction error:', e);
      this.startWholeLottaLoveLoop();
    }
  }

  playRadioJingle() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // Retro transistor radio chime
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.08);
        gain.gain.setValueAtTime(0.045, t + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.08);
        osc.stop(t + i * 0.08 + 0.18);
      });
    } catch (e) {}
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

  // --- Continuous 1969 Ambient Background Music ---
  // Nostalgic warm 70s electric piano progression: D - F#m - Bm - G - A - D
  startAmbientNostalgiaLoop() {
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
          gain.gain.setValueAtTime(0.065, t + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.004, t + 1.8);
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
        bGain.gain.setValueAtTime(0.075, t);
        bGain.gain.exponentialRampToValueAtTime(0.004, t + 1.6);
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

  // --- Vintage Cinematic Hollywood Title Theme (1969) ---
  // Warm, slow cinematic progression with delicate vinyl needle warmth: Dmaj7 - Gmaj7 - Bm7 - A7sus4
  startTitleTheme() {
    const progression = [
      { chord: [293.66, 369.99, 440.00, 554.37], bass: 73.42 }, // Dmaj7
      { chord: [196.00, 246.94, 293.66, 369.99], bass: 49.00 }, // Gmaj7
      { chord: [246.94, 293.66, 369.99, 440.00], bass: 61.74 }, // Bm7
      { chord: [220.00, 277.18, 329.63, 440.00], bass: 55.00 }, // A7sus4
      { chord: [293.66, 369.99, 440.00, 587.33], bass: 73.42 }  // D(add9)
    ];
    let progIndex = 0;

    const playBar = () => {
      if (this.isMuted || !this.ctx) return;
      try {
        const item = progression[progIndex % progression.length];
        const t = this.ctx.currentTime;

        // Cinematic mellow Rhodes / acoustic chime
        item.chord.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);

          // Gentle bell-like transient and lush decay
          gain.gain.setValueAtTime(0.045, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.002, t + 2.3);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.08);
          osc.stop(t + 2.35);
        });

        // Deep warm cinematic cellos / bass
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(item.bass, t);
        bGain.gain.setValueAtTime(0.065, t);
        bGain.gain.exponentialRampToValueAtTime(0.003, t + 2.2);
        bOsc.connect(bGain);
        bGain.connect(this.ctx.destination);
        bOsc.start(t);
        bOsc.stop(t + 2.25);

        // Subtle vintage vinyl surface crackle
        this.playVinylCrackle(0.03);

        progIndex++;
      } catch (e) {}
    };

    playBar();
    this.musicTimer = setInterval(playBar, 2500);
  }

  // --- Led Zeppelin: "Whole Lotta Love" (Led Zeppelin II, 1969) Synthesizer ---

  getDistortionCurve(amount = 22) {
    if (this.distortionCurve) return this.distortionCurve;
    const n_samples = 2048;
    const curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
    }
    this.distortionCurve = curve;
    return curve;
  }

  playDistortedRiffChord(notes, time, dur = 0.3, vol = 0.075, isMuted = false) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = time || this.ctx.currentTime;
      notes.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const oscSub = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const shaper = this.ctx.createWaveShaper();

        osc.type = 'sawtooth';
        oscSub.type = 'square';
        osc.frequency.setValueAtTime(freq, t);
        oscSub.frequency.setValueAtTime(freq * 1.003, t);

        shaper.curve = this.getDistortionCurve(25);
        shaper.oversample = '2x';

        filter.type = 'lowpass';
        if (isMuted) {
          filter.frequency.setValueAtTime(700, t);
          filter.Q.value = 1.2;
        } else {
          filter.frequency.setValueAtTime(2200, t);
          filter.frequency.exponentialRampToValueAtTime(1400, t + dur);
          filter.Q.value = 2.4;
        }

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(vol, t + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        osc.connect(shaper);
        oscSub.connect(shaper);
        shaper.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        oscSub.start(t);
        osc.stop(t + dur + 0.02);
        oscSub.stop(t + dur + 0.02);
      });
    } catch (e) {}
  }

  playRockBass(freq, time, dur = 0.35, vol = 0.08) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = time || this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      sub.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      sub.frequency.setValueAtTime(freq / 2, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.002, t + dur);

      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      sub.start(t);
      osc.stop(t + dur + 0.02);
      sub.stop(t + dur + 0.02);
    } catch (e) {}
  }

  playBonhamKick(time) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = time || this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.12);

      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    } catch (e) {}
  }

  playBonhamSnare(time) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = time || this.ctx.currentTime;
      // Body
      const osc = this.ctx.createOscillator();
      const gainO = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(185, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.06);
      gainO.gain.setValueAtTime(0.10, t);
      gainO.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      osc.connect(gainO);
      gainO.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);

      // Noise snap & wire rattle
      const bSize = Math.floor(this.ctx.sampleRate * 0.18);
      const buf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bSize; i++) d[i] = Math.random() * 2 - 1;
      const n = this.ctx.createBufferSource();
      n.buffer = buf;
      const f = this.ctx.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.value = 1600;
      const gN = this.ctx.createGain();
      gN.gain.setValueAtTime(0.09, t);
      gN.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      n.connect(f);
      f.connect(gN);
      gN.connect(this.ctx.destination);
      n.start(t);
    } catch (e) {}
  }

  playBonhamHiHat(time, isOpen = false) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = time || this.ctx.currentTime;
      const dur = isOpen ? 0.22 : 0.045;
      const bSize = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bSize; i++) d[i] = Math.random() * 2 - 1;
      const n = this.ctx.createBufferSource();
      n.buffer = buf;
      const f = this.ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 8500;
      f.Q.value = 4;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(isOpen ? 0.05 : 0.035, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      n.connect(f);
      f.connect(g);
      g.connect(this.ctx.destination);
      n.start(t);
    } catch (e) {}
  }

  playJimmyPageLead(freq, time, dur = 0.35, vol = 0.075, bend = 0) {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = time || this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const shaper = this.ctx.createWaveShaper();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc2.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc2.frequency.setValueAtTime(freq * 1.002, t);

      if (bend !== 0) {
        const targetFreq = freq * Math.pow(2, bend / 12);
        osc.frequency.exponentialRampToValueAtTime(targetFreq, t + 0.16);
        osc2.frequency.exponentialRampToValueAtTime(targetFreq * 1.002, t + 0.16);
      }

      shaper.curve = this.getDistortionCurve(30);
      shaper.oversample = '2x';

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, t);
      filter.frequency.exponentialRampToValueAtTime(1500, t + dur);
      filter.Q.value = 3;

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.002, t + dur);

      osc.connect(shaper);
      osc2.connect(shaper);
      shaper.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc2.start(t);
      osc.stop(t + dur + 0.02);
      osc2.stop(t + dur + 0.02);
    } catch (e) {}
  }

  startWholeLottaLoveLoop() {
    // Led Zeppelin — "Whole Lotta Love" (1969, Led Zeppelin II)
    // 88 BPM heavy rock groove in E
    const beatSec = 0.6818;
    const sixSec = beatSec / 4; // 0.1705s (16th note)
    const loopBeats = 8;        // 2 bars
    let currentBeat = 0;
    let nextBeatTime = this.ctx.currentTime + 0.05;

    const E_POWER = [164.81, 246.94, 329.63]; // E3, B3, E4
    const D_POWER = [146.83, 220.00];         // D3, A3
    const E_CHUG  = [82.41, 164.81];          // E2, E3

    const scheduleBar = (beatInLoop, time) => {
      if (this.isMuted || !this.ctx) return;

      // === MEASURE 1 (beats 0..3) ===
      if (beatInLoop === 0) {
        // Massive E Power Chord + Bass + Kick + Open Hat
        this.playDistortedRiffChord(E_POWER, time, 0.34, 0.08, false);
        this.playRockBass(82.41, time, 0.45, 0.085);
        this.playBonhamKick(time);
        this.playBonhamHiHat(time, true);

        // 16th note chugs on E
        this.playBonhamHiHat(time + sixSec, false);
        this.playDistortedRiffChord(E_CHUG, time + sixSec * 2, 0.08, 0.045, true);
        this.playBonhamHiHat(time + sixSec * 2, false);
        this.playDistortedRiffChord(E_CHUG, time + sixSec * 3, 0.08, 0.045, true);
        this.playBonhamHiHat(time + sixSec * 3, false);
      } else if (beatInLoop === 1) {
        // Snare crack on beat 2 + chugs
        this.playBonhamSnare(time);
        this.playDistortedRiffChord(E_CHUG, time, 0.08, 0.045, true);
        this.playBonhamHiHat(time + sixSec, false);
        this.playDistortedRiffChord(E_CHUG, time + sixSec, 0.08, 0.045, true);
        this.playDistortedRiffChord(E_CHUG, time + sixSec * 2, 0.08, 0.045, true);
        this.playBonhamHiHat(time + sixSec * 2, false);
        this.playDistortedRiffChord(E_CHUG, time + sixSec * 3, 0.08, 0.045, true);
        this.playBonhamHiHat(time + sixSec * 3, false);
      } else if (beatInLoop === 2) {
        // Kick on beat 3 + The Legendary D-D Pickup!
        this.playBonhamKick(time);
        this.playDistortedRiffChord(E_CHUG, time, 0.08, 0.045, true);
        this.playBonhamHiHat(time + sixSec, false);

        // Pickup Hit 1 (D)
        this.playDistortedRiffChord(D_POWER, time + sixSec * 2, 0.12, 0.075, false);
        this.playRockBass(73.42, time + sixSec * 2, 0.15, 0.08);
        this.playBonhamHiHat(time + sixSec * 2, false);

        // Pickup Hit 2 (D)
        this.playDistortedRiffChord(D_POWER, time + sixSec * 3, 0.12, 0.075, false);
        this.playRockBass(73.42, time + sixSec * 3, 0.15, 0.08);
      } else if (beatInLoop === 3) {
        // Snare on beat 4, driving into measure 2!
        this.playBonhamSnare(time);
        this.playBonhamHiHat(time + sixSec, false);
        this.playBonhamHiHat(time + sixSec * 2, false);
        this.playBonhamHiHat(time + sixSec * 3, false);
      }

      // === MEASURE 2 (beats 4..7) ===
      else if (beatInLoop === 4) {
        // Downbeat E power chord + Kick + Open Hat
        this.playDistortedRiffChord(E_POWER, time, 0.34, 0.08, false);
        this.playRockBass(82.41, time, 0.45, 0.085);
        this.playBonhamKick(time);
        this.playBonhamHiHat(time, true);

        this.playBonhamHiHat(time + sixSec, false);
        this.playDistortedRiffChord(E_CHUG, time + sixSec * 2, 0.08, 0.045, true);
        this.playDistortedRiffChord(E_CHUG, time + sixSec * 3, 0.08, 0.045, true);
      } else if (beatInLoop === 5) {
        // Snare on beat 2 + Jimmy Page blues lick begins!
        this.playBonhamSnare(time);
        // G4 with expressive blues bend towards G#4
        this.playJimmyPageLead(392.00, time + sixSec, 0.32, 0.075, 0.6);
        this.playBonhamHiHat(time + sixSec * 2, false);
      } else if (beatInLoop === 6) {
        // Kick on beat 3 + Lead lick resolves to E4 + D-D Pickup!
        this.playBonhamKick(time);
        this.playJimmyPageLead(329.63, time, 0.28, 0.075, 0);

        // Pickup Hit 1 (D)
        this.playDistortedRiffChord(D_POWER, time + sixSec * 2, 0.12, 0.075, false);
        this.playRockBass(73.42, time + sixSec * 2, 0.15, 0.08);

        // Pickup Hit 2 (D)
        this.playDistortedRiffChord(D_POWER, time + sixSec * 3, 0.12, 0.075, false);
        this.playRockBass(73.42, time + sixSec * 3, 0.15, 0.08);
      } else if (beatInLoop === 7) {
        // Snare on beat 4, looping back to the massive E chord!
        this.playBonhamSnare(time);
        this.playBonhamHiHat(time + sixSec, false);
        this.playBonhamHiHat(time + sixSec * 2, false);
        this.playBonhamHiHat(time + sixSec * 3, false);
      }
    };

    const runner = () => {
      if (this.isMuted || !this.ctx) return;
      const lookahead = 0.25;
      while (nextBeatTime < this.ctx.currentTime + lookahead) {
        scheduleBar(currentBeat, nextBeatTime);
        nextBeatTime += beatSec;
        currentBeat = (currentBeat + 1) % loopBeats;
      }
    };

    runner();
    this.musicTimer = setInterval(runner, 100);
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
