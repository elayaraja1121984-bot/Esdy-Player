/**
 * Web Audio Engine with Skeuomorphic Vintage Mechanical FX,
 * Real Parametric Graphic EQ, Heavy Sub-Bass Processor, Stereo Panning,
 * and Real-Time Analyser for VU Meters.
 */

import { SoundFXState } from '../types';

export const EQ_FREQUENCIES = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private bassNode: BiquadFilterNode | null = null;
  private subBassNode: BiquadFilterNode | null = null;
  private trebleNode: BiquadFilterNode | null = null;
  private eqNodes: BiquadFilterNode[] = [];
  private pannerNode: StereoPannerNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private hissGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isSynthesizingFallback = false;
  private fallbackOscillators: OscillatorNode[] = [];
  private fallbackInterval: number | null = null;
  private hissSource: AudioBufferSourceNode | null = null;
  private onTimeUpdateCallback: ((curr: number, dur: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;
  private synthTime = 0;
  private synthTimer: number | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Create Audio Element
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
      this.audioElement.preload = 'auto';

      this.audioElement.ontimeupdate = () => {
        if (this.audioElement && this.onTimeUpdateCallback) {
          const curr = this.audioElement.currentTime || 0;
          const dur = this.audioElement.duration || 263;
          this.onTimeUpdateCallback(curr, dur);
        }
      };

      this.audioElement.onended = () => {
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
      };

      // Create Nodes
      this.sourceNode = this.ctx.createMediaElementSource(this.audioElement);

      // Bass LowShelf (100Hz)
      this.bassNode = this.ctx.createBiquadFilter();
      this.bassNode.type = 'lowshelf';
      this.bassNode.frequency.value = 100;
      this.bassNode.gain.value = 0;

      // Sub-Bass Peaking (50Hz, Q=1.8) for +3dB / heavy bass
      this.subBassNode = this.ctx.createBiquadFilter();
      this.subBassNode.type = 'peaking';
      this.subBassNode.frequency.value = 50;
      this.subBassNode.Q.value = 1.8;
      this.subBassNode.gain.value = 0;

      // Treble HighShelf (4000Hz)
      this.trebleNode = this.ctx.createBiquadFilter();
      this.trebleNode.type = 'highshelf';
      this.trebleNode.frequency.value = 4000;
      this.trebleNode.gain.value = 0;

      // 10-Band Graphic EQ Peaking nodes
      this.eqNodes = EQ_FREQUENCIES.map(freq => {
        const node = this.ctx!.createBiquadFilter();
        node.type = 'peaking';
        node.frequency.value = freq;
        node.Q.value = 1.4;
        node.gain.value = 0;
        return node;
      });

      // Stereo Panner
      if (this.ctx.createStereoPanner) {
        this.pannerNode = this.ctx.createStereoPanner();
      }

      // Analyser for VU meters
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 128;
      this.analyserNode.smoothingTimeConstant = 0.75;

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.85;

      // Connect Chain:
      // Source -> Bass -> SubBass -> Treble -> EQ[0..9] -> Panner -> Analyser -> MasterGain -> Destination
      let lastNode: AudioNode = this.sourceNode;
      lastNode.connect(this.bassNode);
      lastNode = this.bassNode;

      lastNode.connect(this.subBassNode);
      lastNode = this.subBassNode;

      lastNode.connect(this.trebleNode);
      lastNode = this.trebleNode;

      for (const eqNode of this.eqNodes) {
        lastNode.connect(eqNode);
        lastNode = eqNode;
      }

      if (this.pannerNode) {
        lastNode.connect(this.pannerNode);
        lastNode = this.pannerNode;
      }

      lastNode.connect(this.analyserNode);
      this.analyserNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // Create tape hiss loop generator
      this.setupTapeHiss();
    } catch (e) {
      console.warn('Web Audio initialization error:', e);
    }
  }

  public setOnTimeUpdate(cb: (curr: number, dur: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public setOnEnded(cb: () => void) {
    this.onEndedCallback = cb;
  }

  private setupTapeHiss() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.05; // soft pinkish noise
      }

      this.hissGain = this.ctx.createGain();
      this.hissGain.gain.value = 0; // muted by default

      // Filter hiss to sound like 80s tape magnetic noise
      const hissFilter = this.ctx.createBiquadFilter();
      hissFilter.type = 'bandpass';
      hissFilter.frequency.value = 3500;
      hissFilter.Q.value = 0.8;

      const createHissSource = () => {
        this.hissSource = this.ctx!.createBufferSource();
        this.hissSource.buffer = buffer;
        this.hissSource.loop = true;
        this.hissSource.connect(hissFilter);
        hissFilter.connect(this.hissGain!);
        this.hissGain!.connect(this.masterGain!);
        this.hissSource.start(0);
      };

      createHissSource();
    } catch {
      // Ignored
    }
  }

  public async resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public loadTrack(url: string) {
    this.init();
    if (!this.audioElement) return;

    this.stopFallbackSynth();
    this.audioElement.src = url;
    this.audioElement.load();
  }

  public async play() {
    this.init();
    await this.resumeContext();
    this.playMechanicalSound('play');

    if (this.audioElement && this.audioElement.src) {
      try {
        await this.audioElement.play();
      } catch {
        // Fallback to rich synthesized retro chord audio stream if external stream blocked
        this.startFallbackSynth();
      }
    } else {
      this.startFallbackSynth();
    }
  }

  public pause() {
    this.playMechanicalSound('click');
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopFallbackSynth();
  }

  public stop() {
    this.playMechanicalSound('stop');
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.stopFallbackSynth();
  }

  public seek(seconds: number) {
    if (this.audioElement && Number.isFinite(seconds)) {
      this.audioElement.currentTime = Math.max(0, seconds);
    }
    if (this.isSynthesizingFallback) {
      this.synthTime = seconds;
    }
  }

  public getCurrentTime(): number {
    return this.audioElement ? this.audioElement.currentTime || 0 : 0;
  }

  public getDuration(): number {
    return this.audioElement && this.audioElement.duration ? this.audioElement.duration : 0;
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol / 100)), this.ctx.currentTime, 0.05);
    }
  }

  public setBass(bassLevel: number, subBass: boolean) {
    if (!this.ctx) return;
    if (this.bassNode) {
      const gain = bassLevel * 2.2;
      this.bassNode.gain.setTargetAtTime(gain, this.ctx.currentTime, 0.05);
    }
    if (this.subBassNode) {
      const subGain = subBass ? 6.5 : (bassLevel > 0 ? 3.0 : 0);
      this.subBassNode.gain.setTargetAtTime(subGain, this.ctx.currentTime, 0.05);
    }
  }

  public setTreble(trebleLevel: number) {
    if (this.trebleNode && this.ctx) {
      this.trebleNode.gain.setTargetAtTime(trebleLevel * 1.5, this.ctx.currentTime, 0.05);
    }
  }

  public setBalance(balance: number) {
    if (this.pannerNode && this.ctx) {
      const panValue = Math.max(-1, Math.min(1, balance / 10));
      this.pannerNode.pan.setTargetAtTime(panValue, this.ctx.currentTime, 0.05);
    }
  }

  public setStereoSurround(enabled: boolean) {
    // Widens the stereo field
    if (this.pannerNode && this.ctx) {
      this.pannerNode.pan.setTargetAtTime(enabled ? 0.2 : 0, this.ctx.currentTime, 0.05);
    }
  }

  public setTapeHiss(enabled: boolean, volume: number) {
    if (this.hissGain && this.ctx) {
      const target = enabled ? (volume / 100) * 0.06 : 0;
      this.hissGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
    }
  }

  public setDolbyNR(enabled: boolean) {
    // Dolby NR cuts tape hiss high frequencies smoothly
    if (this.trebleNode && this.ctx && enabled) {
      this.trebleNode.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.05);
    }
  }

  public setEqualizer(bands: number[]) {
    if (this.eqNodes && this.ctx && this.eqNodes.length === bands.length) {
      bands.forEach((gain, idx) => {
        this.eqNodes[idx].gain.setTargetAtTime(gain, this.ctx!.currentTime, 0.05);
      });
    }
  }

  public applySoundFX(state: SoundFXState) {
    this.setVolume(state.volume);
    this.setBass(state.bassBoostEnabled ? state.bassBoostLevel : 0, state.subBass3dB);
    this.setTreble(state.trebleLevel);
    this.setBalance(state.balance);
    this.setEqualizer(state.eqBands);
    this.setTapeHiss(state.tapeHissNoise, state.tapeHissVolume);
    this.setDolbyNR(state.dolbyNR);
    this.setStereoSurround(state.surround3D);
  }

  /**
   * Get audio level meters (Left and Right RMS and Frequency amplitudes)
   */
  public getMeterLevels(): { left: number; right: number; peak: boolean; freqs: Uint8Array } {
    const freqs = new Uint8Array(16);
    if (!this.analyserNode) {
      return { left: 0, right: 0, peak: false, freqs };
    }

    const timeData = new Uint8Array(this.analyserNode.fftSize);
    this.analyserNode.getByteTimeDomainData(timeData);
    this.analyserNode.getByteFrequencyData(freqs);

    // Calculate RMS from waveform
    let sum = 0;
    for (let i = 0; i < timeData.length; i++) {
      const val = (timeData[i] - 128) / 128;
      sum += val * val;
    }
    const rms = Math.sqrt(sum / timeData.length);
    const scaledRMS = Math.min(1, rms * 3.2);

    // Differentiate left & right slightly based on balance or low vs high frequencies
    const leftLevel = Math.min(1, scaledRMS * (0.9 + Math.random() * 0.2));
    const rightLevel = Math.min(1, scaledRMS * (0.85 + Math.random() * 0.25));
    const peak = scaledRMS > 0.82;

    return {
      left: leftLevel,
      right: rightLevel,
      peak,
      freqs
    };
  }

  /**
   * Mechanical sound effects for vintage cassette buttons
   */
  public playMechanicalSound(type: 'click' | 'play' | 'stop' | 'eject' | 'rewind') {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'play') {
        // Heavy mechanical chunky clunk
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'stop') {
        // High click followed by motor decelerate
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.07);
      } else {
        // Standard tactile switch click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Audio context might be restricted
    }
  }

  /**
   * Synthesized retro melodic progression fallback
   */
  private startFallbackSynth() {
    if (this.isSynthesizingFallback || !this.ctx) return;
    this.isSynthesizingFallback = true;
    this.synthTime = 0;

    const chords = [
      [220, 277.18, 329.63, 440], // A Major
      [185, 220, 277.18, 370],   // F# Minor
      [196, 246.94, 293.66, 392], // G Major
      [164.81, 207.65, 246.94, 329.63] // E Major
    ];

    let chordIdx = 0;
    const playChord = () => {
      if (!this.ctx || !this.isSynthesizingFallback) return;
      const notes = chords[chordIdx % chords.length];
      chordIdx++;

      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = idx === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq * (idx === 0 ? 0.5 : 1), now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

        osc.connect(gain);
        if (this.bassNode) {
          gain.connect(this.bassNode);
        } else {
          gain.connect(this.ctx!.destination);
        }

        osc.start(now);
        osc.stop(now + 3.0);
        this.fallbackOscillators.push(osc);
      });
    };

    playChord();
    this.fallbackInterval = window.setInterval(playChord, 3000);

    // Update synth timer progress
    this.synthTimer = window.setInterval(() => {
      this.synthTime += 0.5;
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.synthTime, 263);
      }
      if (this.synthTime >= 263 && this.onEndedCallback) {
        this.onEndedCallback();
      }
    }, 500);
  }

  private stopFallbackSynth() {
    this.isSynthesizingFallback = false;
    if (this.fallbackInterval !== null) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
    if (this.synthTimer !== null) {
      clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
    this.fallbackOscillators.forEach(osc => {
      try { osc.stop(); } catch { /* Ignore */ }
    });
    this.fallbackOscillators = [];
  }

  public getAudioElement(): HTMLAudioElement | null {
    return this.audioElement;
  }
}

export const audioEngine = new RetroAudioEngine();
