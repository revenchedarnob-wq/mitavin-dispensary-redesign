/**
 * Mitavin Zero-File Web Audio Micro-Haptics Engine
 * Procedural synthesis with 0KB asset payload, zero network latency,
 * and automatic user preference & mute state synchronization.
 */

let audioCtx: AudioContext | null = null;
let soundMutedState: boolean | null = null;

/**
 * Lazy singleton AudioContext initialization with browser unlock
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return null;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {
        // Handled silently if user has not interacted yet
      });
    }

    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Check if sound is muted via local storage or programmatic toggle
 */
export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return true;

  if (soundMutedState === null) {
    const stored = localStorage.getItem("mitavin_sound_muted");
    soundMutedState = stored ? stored === "true" : false;
  }

  return soundMutedState;
}

/**
 * Update sound mute preference globally
 */
export function setSoundMuted(muted: boolean): void {
  soundMutedState = muted;
  if (typeof window !== "undefined") {
    localStorage.setItem("mitavin_sound_muted", String(muted));
  }
}

/**
 * Toggle sound mute state
 */
export function toggleSound(): boolean {
  const next = !isSoundMuted();
  setSoundMuted(next);
  return next;
}

/**
 * Mechanical Switch Click: 8ms rapid drop from 1200Hz to 80Hz
 * Ideal for buttons, toggles, and compact interactive triggers.
 */
export function playHapticClick(vol = 0.08): void {
  if (isSoundMuted()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.008);

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.008);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.008);
  } catch {
    // Graceful degradation when audio context is blocked
  }
}

/**
 * Satisfying Bubble Pop: 18ms upward pitch sweep from 320Hz to 880Hz
 * Specifically calibrated for Add-to-Cart and quantity increments.
 */
export function playHapticPop(vol = 0.12): void {
  if (isSoundMuted()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.018);

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.018);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.018);
  } catch {
    // Fail silently without interrupting UI state
  }
}

/**
 * Resonant Glass Tap: 25ms high-pitch pure tone at 2400Hz
 * Designed for slide-over drawer opens, quick-view activations, and tabs.
 */
export function playHapticGlass(vol = 0.06): void {
  if (isSoundMuted()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(2400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.025);
  } catch {
    // Fail silently
  }
}

/**
 * Soft Major-Chord Chime: Dual frequency harmonic chime (E6: ~1318.5Hz, G#6: ~1661.2Hz)
 * Synthesized over 450ms with parabolic decay for checkout success.
 */
export function playHapticSuccess(vol = 0.15): void {
  if (isSoundMuted()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [1318.51, 1661.22]; // E6 + G#6 harmonic interval
    const duration = 0.45;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.04);

      const startTime = ctx.currentTime + index * 0.04;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol * 0.8, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch {
    // Fail silently
  }
}

/**
 * Aerodynamic Swoosh: 50ms filtered sweep for modal transitions and view morphs.
 */
export function playHapticSwoosh(vol = 0.07): void {
  if (isSoundMuted()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(vol * 0.5, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Fail silently
  }
}
