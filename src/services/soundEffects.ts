// Web Audio API Synthesizer for Arcade & Futuristic Claw Machine SFX

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted() {
    return this.isMuted;
  }

  // Button click feedback sound
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Arcade start / coin insert chime
  public playCoin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'square';

    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    osc2.frequency.setValueAtTime(1234.71, now);
    osc2.frequency.setValueAtTime(1567.98, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  private lastWhirrTime: number = 0;

  // Soft satisfying arcade joystick move sound
  public playMoveWhirr() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Throttle execution (max once per 110ms) to prevent audio node stacking static
    if (now - this.lastWhirrTime < 0.11) return;
    this.lastWhirrTime = now;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Soft pleasant sine wave pitch glide (retro arcade soft blip)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(460, now + 0.06);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Magnet claw grab pulse zapping sound
  public playGrabPulse() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Zap sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.45);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // Capsule Catch Victory Fanfare!
  public playVictoryFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0, now + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.25);
    });
  }

  // Zero-g float hum
  public playZeroGHum() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.15);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Post Malone, Swae Lee - Sunflower (8-Bit Retro Synth & HTML5 Audio MP3 Support)
  private bgmInterval: number | null = null;
  private isBgmPlayingState: boolean = false;
  private bgmAudio: HTMLAudioElement | null = null;

  public isBgmPlaying(): boolean {
    return this.isBgmPlayingState;
  }

  public startBgm(audioUrl: string = '/sunflower.mp3') {
    if (this.isBgmPlayingState) return;
    this.isBgmPlayingState = true;

    // Try HTML5 Audio MP3 playback first if file exists
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio(audioUrl);
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.45;
    }

    const playPromise = this.bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Playing actual MP3 song successfully!
        })
        .catch(() => {
          // If MP3 file is not found or autoplay blocked, fallback to synthesized 8-Bit Sunflower Melody loop!
          this.startSunflowerSynthLoop();
        });
    } else {
      this.startSunflowerSynthLoop();
    }
  }

  private startSunflowerSynthLoop() {
    this.initContext();
    if (!this.ctx) return;

    let step = 0;

    // Iconic Post Malone, Swae Lee - Sunflower Melody Notes (Key of D Major, ~90 BPM)
    // "Needless to say, I keep in check... You're a Sunflower..."
    const sunflowerMelody = [
      { note: 293.66, duration: 0.28 }, // D4
      { note: 369.99, duration: 0.28 }, // F#4
      { note: 440.00, duration: 0.28 }, // A4
      { note: 493.88, duration: 0.28 }, // B4
      { note: 440.00, duration: 0.28 }, // A4
      { note: 369.99, duration: 0.28 }, // F#4
      { note: 329.63, duration: 0.28 }, // E4
      { note: 293.66, duration: 0.28 }, // D4
      { note: 246.94, duration: 0.28 }, // B3
      { note: 293.66, duration: 0.28 }, // D4
      { note: 369.99, duration: 0.28 }, // F#4
      { note: 440.00, duration: 0.28 }, // A4
      { note: 587.33, duration: 0.28 }, // D5
      { note: 493.88, duration: 0.28 }, // B4
      { note: 440.00, duration: 0.28 }, // A4
      { note: 369.99, duration: 0.28 }, // F#4
      { note: 329.63, duration: 0.28 }, // E4
      { note: 293.66, duration: 0.28 }, // D4
      { note: 329.63, duration: 0.28 }, // E4
      { note: 369.99, duration: 0.28 }  // F#4
    ];

    const playStep = () => {
      if (!this.isBgmPlayingState || this.isMuted || !this.ctx) return;

      const currentNote = sunflowerMelody[step % sunflowerMelody.length];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle'; // Warm retro 8-bit vibe tone
      osc.frequency.setValueAtTime(currentNote.note, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);

      step++;
    };

    playStep();
    this.bgmInterval = window.setInterval(playStep, 310);
  }

  public stopBgm() {
    this.isBgmPlayingState = false;
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public toggleBgm(audioUrl: string = '/sunflower.mp3'): boolean {
    if (this.isBgmPlayingState) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm(audioUrl);
      return true;
    }
  }
}

export const soundFx = new SoundSynthesizer();
