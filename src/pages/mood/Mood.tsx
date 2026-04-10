import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mockMoodHistory } from '@/data/mockMood';
import { useChatStore } from '@/store/useChatStore';
import { MoodEntry } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const EMOJIS = ['😫', '😢', '😔', '😕', '😐', '🙂', '😊', '😄', '😁', '🥰'];

function moodEmoji(score: number) {
  return EMOJIS[Math.min(9, Math.max(0, score - 1))];
}

const TIPS: Record<string, string> = {
  low: 'Кажется, вам сейчас непросто. Помните — просить о помощи это нормально. Поговорите с кем-то близким или с нашим ИИ-ассистентом.',
  mid: 'Средний день. Постарайтесь сегодня сделать что-то маленькое для себя — прогулка, чашка чая, пять минут тишины.',
  high: 'Отлично! Так держать. Ваше хорошее настроение — залог счастья малыша.',
};

export default function Mood() {
  const [score, setScore] = useState(7);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useLocalStorage<MoodEntry[]>('mood-history', mockMoodHistory);
  const { setOpen } = useChatStore();

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = history.find(e => e.date === today);

  const handleSave = () => {
    const entry: MoodEntry = { date: today, score, note: note.trim() || undefined };
    const updated = history.filter(e => e.date !== today);
    setHistory([...updated, entry]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tip = score < 5 ? TIPS.low : score < 7 ? TIPS.mid : TIPS.high;
  const chartData = history.slice(-14).map(e => ({
    date: e.date.slice(5),
    score: e.score,
  }));

  return (
    <div>
      <Header title="Трекер настроения" />

      <div className="px-4 py-5 space-y-5">
        {/* Today's check-in */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            {todayEntry ? 'Вы уже отметили настроение сегодня' : 'Как вы себя чувствуете сегодня?'}
          </h3>

          <div className="text-center mb-4">
            <span className="text-5xl transition-all duration-200">{moodEmoji(score)}</span>
            <p className="text-2xl font-bold text-gray-900 mt-2">{score}<span className="text-sm text-gray-400 font-normal">/10</span></p>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            value={score}
            onChange={e => { setScore(+e.target.value); setSaved(false); }}
            className="w-full accent-red-600 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Очень плохо</span>
            <span>Отлично</span>
          </div>

          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Добавить заметку (необязательно)..."
            rows={2}
            className="w-full mt-4 px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />

          <Button
            fullWidth
            size="lg"
            onClick={handleSave}
            className="mt-4"
            variant={saved ? 'secondary' : 'primary'}
          >
            {saved ? '✓ Сохранено!' : 'Сохранить'}
          </Button>
        </Card>

        {/* Tip */}
        <Card className={`${score < 5 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
          <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
          {score < 5 && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setOpen(true)}
              className="mt-3"
            >
              💬 Поговорить с ИИ
            </Button>
          )}
        </Card>

        {/* Chart */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Настроение за 14 дней</h3>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <YAxis domain={[1, 10]} ticks={[1, 3, 5, 7, 10]} tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  formatter={(v: number) => [`${v}/10`, 'Настроение']}
                  labelStyle={{ fontSize: 10, color: '#6b7280' }}
                />
                <Line type="monotone" dataKey="score" stroke="#dc2626" strokeWidth={2} dot={{ r: 3, fill: '#dc2626' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History list */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">История</h3>
          <div className="space-y-2">
            {[...history].reverse().slice(0, 7).map(entry => (
              <div key={entry.date} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
                <span className="text-2xl">{moodEmoji(entry.score)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{entry.date}</span>
                    <span className="text-sm font-bold text-gray-900">{entry.score}/10</span>
                  </div>
                  {entry.note && <p className="text-xs text-gray-400 mt-0.5 truncate">{entry.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
