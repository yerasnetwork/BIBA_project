import { useEffect } from 'react';
import { useBabyStore } from '@/store/useBabyStore';
import { Vitals, VitalsPoint } from '@/types';

function randomBetween(min: number, max: number, decimals = 0): number {
  const val = Math.random() * (max - min) + min;
  return decimals > 0 ? parseFloat(val.toFixed(decimals)) : Math.round(val);
}

function generateVitals(prevVitals: Vitals, forceDanger = false): Vitals {
  let heartRate: number;
  if (forceDanger) {
    heartRate = Math.random() < 0.5
      ? randomBetween(85, 99)
      : randomBetween(181, 195);
  } else {
    const prev = prevVitals.heartRate;
    const delta = randomBetween(-5, 5);
    heartRate = Math.max(110, Math.min(170, prev + delta));
  }

  const temperature = forceDanger
    ? randomBetween(38.1, 38.8, 1)
    : randomBetween(365, 372, 1) / 10;

  const oxygen = forceDanger
    ? randomBetween(88, 91)
    : randomBetween(95, 100);

  const movements: Vitals['movement'][] = ['active', 'calm', 'still'];
  const movement = Math.random() < 0.8 ? prevVitals.movement : movements[Math.floor(Math.random() * 3)];

  return { heartRate, temperature, oxygen, movement, timestamp: Date.now() };
}

export function useVitalsSimulator(active = true) {
  const { setVitals, addVitalsPoint, isConnected, vitals } = useBabyStore();

  useEffect(() => {
    if (!active || !isConnected) return;

    const tick = (forceDanger = false) => {
      const newVitals = generateVitals(vitals, forceDanger);
      setVitals(newVitals);
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      addVitalsPoint({ time: timeStr, heartRate: newVitals.heartRate });
    };

    const normalInterval = setInterval(() => tick(false), 3000);
    const dangerInterval = setInterval(() => tick(true), 2 * 60 * 1000);

    return () => {
      clearInterval(normalInterval);
      clearInterval(dangerInterval);
    };
  }, [active, isConnected, vitals, setVitals, addVitalsPoint]);
}
