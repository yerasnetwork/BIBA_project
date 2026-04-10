import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Bell, TrendingUp, LogOut, Plus, Edit2, Trash2, Star } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { mockUsers } from '@/data/mockUsers';
import { mockArticles } from '@/data/mockArticles';

const STATS = [
  { icon: Users, label: 'Пользователей', value: '1 247', color: 'bg-blue-100 text-blue-600' },
  { icon: Star, label: 'Подписок', value: '89', color: 'bg-red-100 text-red-600' },
  { icon: Bell, label: 'Алертов сегодня', value: '3', color: 'bg-amber-100 text-amber-600' },
  { icon: TrendingUp, label: 'Новых за неделю', value: '34', color: 'bg-green-100 text-green-600' },
];

type Tab = 'stats' | 'users' | 'articles';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [tab, setTab] = useState<Tab>('stats');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'stats', label: 'Статистика' },
    { key: 'users', label: 'Пользователи' },
    { key: 'articles', label: 'Статьи' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="sticky top-0 z-30 bg-red-600 text-white">
        <div className="flex items-center h-14 px-4 gap-3">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-xs font-bold">A</div>
          <h1 className="flex-1 text-sm font-semibold">Lullabea Admin</h1>
          <button onClick={handleLogout} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <LogOut size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-red-500">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 text-xs py-2.5 font-medium transition-colors ${
                tab === t.key ? 'text-white border-b-2 border-white' : 'text-red-300 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 py-5">
        {/* Stats tab */}
        {tab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {STATS.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-2xl font-black text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Mock chart */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Регистрации за 7 дней</h3>
              <div className="flex items-end gap-1.5 h-20">
                {[4, 7, 5, 9, 6, 8, 11].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-red-600 rounded-t-lg"
                      style={{ height: `${(v / 12) * 100}%` }}
                    />
                    <span className="text-[9px] text-gray-400">
                      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Пользователи ({mockUsers.length})</p>
            </div>
            {mockUsers.map(user => (
              <div key={user.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-700 flex-shrink-0">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  <p className="text-xs text-gray-400">{user.city} · {user.createdAt}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  user.plan === 'premium' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.plan === 'premium' ? 'PREMIUM' : 'FREE'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Articles tab */}
        {tab === 'articles' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Статьи ({mockArticles.length})</p>
              <button className="flex items-center gap-1.5 text-xs text-red-600 font-medium bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                <Plus size={13} /> Добавить
              </button>
            </div>
            {mockArticles.map(article => (
              <div key={article.id} className="bg-white rounded-xl border border-gray-100 p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-snug truncate">{article.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{article.category} · {article.readTime} мин · {article.createdAt}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <Edit2 size={13} className="text-gray-500" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={13} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
