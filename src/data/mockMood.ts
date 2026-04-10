import { MoodEntry } from '@/types';

function generateMoodHistory(): MoodEntry[] {
  const entries: MoodEntry[] = [];
  const today = new Date();
  const scores = [
    6, 5, 7, 4, 3, 6, 7, 8, 6, 5,
    4, 5, 6, 7, 8, 7, 6, 5, 6, 7,
    6, 8, 7, 6, 5, 7, 8, 7, 6, 7,
  ];
  const notes = [
    'Плохо спала, малышка капризничала',
    undefined,
    'Хороший день, прогулялась с подругой',
    'Очень устала',
    'Тревожно было весь день',
    undefined,
    'Первая улыбка малышки!',
    'Отличный день',
    undefined,
    'Немного болела голова',
    'Муж помогал ночью — выспалась',
  ];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    entries.push({
      date: dateStr,
      score: scores[29 - i] || 6,
      note: notes[(29 - i) % notes.length],
    });
  }
  return entries;
}

export const mockMoodHistory: MoodEntry[] = generateMoodHistory();
