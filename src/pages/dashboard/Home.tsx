import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Smile, BookOpen, Scale, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useBabyStore } from '@/store/useBabyStore';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockArticles } from '@/data/mockArticles';
import { mockMoodHistory } from '@/data/mockMood';
import { useVitalsSimulator } from '@/hooks/useVitalsSimulator';

const categoryLabels: Record<string, string> = {
  health: 'Здоровье', psychology: 'Психология', legal: 'Юридическое', finance: 'Финансы',
};
const categoryColors: Record<string, 'green' | 'purple' | 'blue' | 'amber'> = {
  health: 'green', psychology: 'purple', legal: 'blue', finance: 'amber',
};

function getVitalStatus(vitals: ReturnType<typeof useBabyStore>['vitals']) {
  if (
    vitals.heartRate < 100 || vitals.heartRate > 180 ||
    vitals.temperature < 36.0 || vitals.temperature > 38.0 ||
    vitals.oxygen < 92
  ) return 'danger';
  if (
    vitals.heartRate < 110 || vitals.heartRate > 170 ||
    vitals.temperature > 37.5 || vitals.oxygen < 95
  ) return 'watch';
  return 'normal';
}

export default function Home() {
  useVitalsSimulator(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { vitals, alerts } = useBabyStore();
  const firstName = user?.name?.split(' ')[0] ?? 'Мама';
  const babyName = user?.babyName ?? 'Малыш';
  const vitalStatus = getVitalStatus(vitals);
  const latestMood = mockMoodHistory[mockMoodHistory.length - 2];
  const activeAlerts = alerts.filter(a => !a.resolved).slice(0, 1);
  const latestArticle = mockArticles[0];

  const quickActions = [
    { icon: Activity, label: 'Монитор', to: '/monitor', color: 'bg-red-100 text-red-600' },
    { icon: Smile, label: 'Настроение', to: '/mood', color: 'bg-purple-100 text-purple-600' },
    { icon: BookOpen, label: 'Статьи', to: '/articles', color: 'bg-blue-100 text-blue-600' },
    { icon: Scale, label: 'Юр. помощь', to: '/legal', color: 'bg-amber-100 text-amber-600' },
  ];

  const moodEmoji = (s: number) => s >= 8 ? '😊' : s >= 6 ? '🙂' : s >= 4 ? '😐' : '😔';

  return (
    <div>
      <Header title="Lullabea" />

      <div className="px-4 py-5 space-y-4">
        {/* Greeting */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">Привет, {firstName}! 👋</h2>
          <p className="text-sm text-gray-500 mt-0.5">Как вы сегодня?</p>
        </div>

        {/* Active alert banner */}
        {activeAlerts.length > 0 && (
          <div
            className="bg-red-600 rounded-2xl p-4 flex items-center gap-3 cursor-pointer animate-pulse-red"
            onClick={() => navigate('/monitor')}
          >
            <AlertTriangle size={24} className="text-white flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Активная тревога!</p>
              <p className="text-red-200 text-xs mt-0.5">{activeAlerts[0].message}</p>
            </div>
            <ChevronRight size={18} className="text-red-200" />
          </div>
        )}

        {/* Baby vitals card */}
        <Card
          onClick={() => navigate('/monitor')}
          className={vitalStatus === 'danger' ? 'border-red-300 bg-red-50' : vitalStatus === 'watch' ? 'border-amber-200 bg-amber-50' : ''}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 font-medium">Малыш</p>
              <p className="text-sm font-bold text-gray-900">{babyName}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${
                vitalStatus === 'danger' ? 'bg-red-600 animate-pulse' :
                vitalStatus === 'watch' ? 'bg-amber-500' : 'bg-green-500'
              }`} />
              <span className="text-xs text-gray-600">
                {vitalStatus === 'danger' ? 'Тревога' : vitalStatus === 'watch' ? 'Внимание' : 'Норма'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '❤️', val: `${vitals.heartRate}`, unit: 'уд/мин', ok: vitals.heartRate >= 100 && vitals.heartRate <= 180 },
              { icon: '🌡️', val: `${vitals.temperature}`, unit: '°C', ok: vitals.temperature >= 36.0 && vitals.temperature <= 38.0 },
              { icon: '💧', val: `${vitals.oxygen}`, unit: '%', ok: vitals.oxygen >= 92 },
            ].map(item => (
              <div key={item.icon} className="text-center">
                <p className="text-lg">{item.icon}</p>
                <p className={`text-base font-bold ${item.ok ? 'text-gray-900' : 'text-red-600'}`}>{item.val}</p>
                <p className="text-[10px] text-gray-400">{item.unit}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Mood card */}
        {latestMood && (
          <Card onClick={() => navigate('/mood')} className="flex items-center gap-4">
            <div className="text-3xl">{moodEmoji(latestMood.score)}</div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Ваше настроение вчера</p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{ width: `${latestMood.score * 10}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900">{latestMood.score}/10</span>
              </div>
              {latestMood.note && <p className="text-xs text-gray-400 mt-0.5 truncate">{latestMood.note}</p>}
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </Card>
        )}

        {/* Quick actions */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Быстрый доступ</p>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map(({ icon: Icon, label, to, color }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={18} />
                </div>
                <span className="text-[10px] text-gray-600 font-medium text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Latest article */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">Последняя статья</p>
            <button onClick={() => navigate('/articles')} className="text-xs text-red-600 font-medium">Все статьи</button>
          </div>
          <Card onClick={() => navigate(`/articles/${latestArticle.id}`)}>
            <Badge color={categoryColors[latestArticle.category]}>
              {categoryLabels[latestArticle.category]}
            </Badge>
            <h3 className="text-sm font-semibold text-gray-900 mt-2 leading-snug">{latestArticle.title}</h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{latestArticle.preview}</p>
            <p className="text-xs text-gray-400 mt-2">⏱ {latestArticle.readTime} мин</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
