import { VitalsPoint } from '@/types';

function generateVitalsHistory(): VitalsPoint[] {
  const points: VitalsPoint[] = [];
  const now = Date.now();
  for (let i = 59; i >= 0; i--) {
    const ts = new Date(now - i * 1000);
    const h = ts.getHours().toString().padStart(2, '0');
    const m = ts.getMinutes().toString().padStart(2, '0');
    const s = ts.getSeconds().toString().padStart(2, '0');
    const base = 138;
    const noise = Math.floor(Math.random() * 20) - 10;
    points.push({
      time: `${h}:${m}:${s}`,
      heartRate: base + noise,
    });
  }
  return points;
}

export const mockVitalsHistory: VitalsPoint[] = generateVitalsHistory();
