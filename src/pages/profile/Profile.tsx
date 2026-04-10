import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Star, Bell, Moon, ChevronRight, Edit3 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useBabyStore } from '@/store/useBabyStore';

function getBabyAge(birthdate?: string): string {
  if (!birthdate) return 'Не указан';
  const birth = new Date(birthdate);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
  if (months < 1) return 'Менее месяца';
  if (months < 12) return `${months} ${months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}${rem > 0 ? ` ${rem} мес.` : ''}`;
}

function initials(name: string): string {
  return name.split(' ').map(n => n[0] ?? '').join('').toUpperCase().slice(0, 2);
}

const PREMIUM_FEATURES = [
  '✓ Неограниченный мониторинг',
  '✓ ИИ-консультации без лимита',
  '✓ Все курсы со скидкой 20%',
  '✓ Приоритетная юридическая помощь',
  '✓ Экспорт данных мониторинга',
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const { enrolledCourses } = useBabyStore();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const [notif, setNotif] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpgrade = () => {
    setShowPremiumModal(false);
    updateUser({ plan: 'premium' });
    setShowUpgradeSuccess(true);
    setTimeout(() => setShowUpgradeSuccess(false), 3000);
  };

  return (
    <div>
      <Header title="Профиль" />

      <div className="px-4 py-5 space-y-4 pb-10">
        {/* Avatar + User info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {initials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-gray-900 truncate">{user.name}</h2>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-gray-500">📍 {user.city}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  user.plan === 'premium' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.plan === 'premium' ? '⭐ PREMIUM' : 'FREE'}
                </span>
              </div>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Edit3 size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Baby profile */}
        {(user.babyName || user.babyBirthdate) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">👶 Малыш</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Имя</span>
                <span className="text-sm font-medium text-gray-900">{user.babyName ?? 'Не указано'}</span>
              </div>
              {user.babyBirthdate && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Дата рождения</span>
                    <span className="text-sm font-medium text-gray-900">{user.babyBirthdate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Возраст</span>
                    <span className="text-sm font-medium text-gray-900">{getBabyAge(user.babyBirthdate)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Курсов', value: enrolledCourses.length },
            { label: 'Дней', value: '30' },
            { label: 'Тревог', value: '3' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <p className="text-xl font-bold text-red-600">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Premium card */}
        {user.plan === 'free' && (
          <div className="bg-red-600 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Star size={18} className="text-yellow-300" />
              <p className="font-bold text-sm">Перейти на Premium</p>
            </div>
            <p className="text-xs text-red-200 mb-3 leading-relaxed">
              Получите доступ ко всем функциям Lullabea
            </p>
            <div className="space-y-1 mb-4">
              {PREMIUM_FEATURES.slice(0, 3).map((f, i) => (
                <p key={i} className="text-xs text-red-100">{f}</p>
              ))}
            </div>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowPremiumModal(true)}
              className="bg-white text-red-600 hover:bg-red-50"
            >
              1 490 ₸ / месяц
            </Button>
          </div>
        )}

        {showUpgradeSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
            <p className="text-green-700 font-medium text-sm">🎉 Premium активирован!</p>
          </div>
        )}

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-700 px-4 pt-4 pb-2">Настройки</h3>

          <div className="divide-y divide-gray-50">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Push-уведомления</span>
              </div>
              <button
                onClick={() => setNotif(v => !v)}
                className={`relative w-10 h-5.5 rounded-full transition-colors ${notif ? 'bg-red-600' : 'bg-gray-300'}`}
                style={{ height: 22 }}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notif ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Moon size={16} className="text-gray-500" />
                <div>
                  <span className="text-sm text-gray-700">Тёмная тема</span>
                  <span className="text-xs text-gray-400 block">Скоро</span>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(v => !v)}
                className={`relative w-10 rounded-full transition-colors opacity-50 ${darkMode ? 'bg-red-600' : 'bg-gray-300'}`}
                style={{ height: 22 }}
                disabled
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <button
              onClick={() => navigate('/articles')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-700">Сохранённые статьи</span>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          fullWidth
          size="lg"
          onClick={handleLogout}
          className="border border-gray-200 text-gray-600"
        >
          <LogOut size={16} />
          Выйти из аккаунта
        </Button>

        <p className="text-center text-xs text-gray-400">Lullabea v0.1.0 · © 2025</p>
      </div>

      {/* Premium modal */}
      <Modal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} title="Premium подписка">
        <div className="p-5">
          <div className="text-center mb-5">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star size={32} className="text-red-600" />
            </div>
            <p className="text-2xl font-black text-gray-900">1 490 ₸<span className="text-sm font-normal text-gray-500">/месяц</span></p>
          </div>

          <div className="space-y-2 mb-5">
            {PREMIUM_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                <span className="text-sm text-gray-700">{f}</span>
              </div>
            ))}
          </div>

          <Button fullWidth size="lg" onClick={handleUpgrade}>
            Активировать Premium
          </Button>
          <p className="text-xs text-gray-400 text-center mt-2">Демо-активация, без реальной оплаты</p>
        </div>
      </Modal>
    </div>
  );
}
