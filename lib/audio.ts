// Web Audio API Synthesizer & Soundwave Generator for Concert Previews

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentOscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentTrackName: string | null = null;
  private onStopCallback: (() => void) | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playConcertVibe(
    baseFreq: number = 330,
    bpm: number = 120,
    trackName: string,
    onStop?: () => void
  ) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentTrackName = trackName;
    this.onStopCallback = onStop || null;

    const ctx = this.ctx;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.8);
    masterGain.connect(ctx.destination);
    this.gainNode = masterGain;

    // Filter for warm analog stage synth feel
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(1800, ctx.currentTime + 3.0);
    filter.connect(masterGain);

    // Create chords (Root, Minor/Major Third, Fifth, Octave)
    const chordMultipliers = [1, 1.25, 1.5, 2];
    this.currentOscillators = [];

    chordMultipliers.forEach((mult, index) => {
      const osc = ctx.createOscillator();
      osc.type = index % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * mult, ctx.currentTime);

      // Add gentle stereo/frequency vibrato
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime((bpm / 60) * (index + 1) * 0.5, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(4.0, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      osc.connect(filter);
      osc.start();
      this.currentOscillators.push(osc, lfo);
    });

    // Auto fade-out after 15 seconds
    setTimeout(() => {
      if (this.isPlaying && this.currentTrackName === trackName) {
        this.stop();
      }
    }, 15000);
  }

  public stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.currentTrackName = null;

    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      } catch {
        // audio node might already be disconnected
      }
    }

    setTimeout(() => {
      this.currentOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.currentOscillators = [];
      if (this.onStopCallback) {
        this.onStopCallback();
        this.onStopCallback = null;
      }
    }, 350);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): string | null {
    return this.currentTrackName;
  }
}

export const soundEngine = new SoundEngine();
