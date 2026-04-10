import { useRef, useCallback } from 'react';

export function useAlarmSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scheduleBeep = (ctx: AudioContext, startTime: number, duration: number, freq = 880) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.55, startTime + 0.01);
    gain.gain.setValueAtTime(0.55, startTime + duration - 0.02);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const scheduleCycle = (ctx: AudioContext, base: number) => {
    // Three urgent beeps: beep-beep-beep … pause … repeat
    scheduleBeep(ctx, base + 0.00, 0.14);
    scheduleBeep(ctx, base + 0.20, 0.14);
    scheduleBeep(ctx, base + 0.40, 0.14, 1046); // slightly higher 3rd tone
  };

  const start = useCallback(() => {
    if (ctxRef.current) return;
    // Safari / older browser fallback
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;

    scheduleCycle(ctx, ctx.currentTime);

    intervalRef.current = setInterval(() => {
      const c = ctxRef.current;
      if (c) scheduleCycle(c, c.currentTime);
    }, 900);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
  }, []);

  return { start, stop };
}
