import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, MapPin, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';

const CITIES = ['Астана', 'Алматы', 'Шымкент', 'Другой'];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [form, setForm] = useState({ name: '', city: 'Астана', email: '', password: '', babyName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Заполните все обязательные поля');
      return;
    }
    if (form.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    register({
      name: form.name,
      email: form.email,
      city: form.city,
      password: form.password,
      babyName: form.babyName || undefined,
    });
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-red-600 pt-12 pb-8 px-6 rounded-b-[40px]">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-3">
            <span className="text-2xl">🤱</span>
          </div>
          <h1 className="text-xl font-bold text-white">Создать аккаунт</h1>
          <p className="text-red-200 text-sm mt-1">Присоединяйтесь к Lullabea</p>
        </div>
      </div>

      <div className="flex-1 px-6 pt-7 pb-10">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Имя *</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Ваше имя"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Город *</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={form.city}
                onChange={e => set('city', e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
              >
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Мин. 6 символов"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Имя малыша <span className="text-gray-400 font-normal">(необязательно)</span></label>
            <input
              value={form.babyName}
              onChange={e => set('babyName', e.target.value)}
              placeholder="Например: Айсана"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <Button fullWidth size="lg" onClick={handleRegister} loading={loading} className="mt-6">
          Зарегистрироваться
        </Button>

        <p className="text-center text-sm text-gray-500 mt-5">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-red-600 font-medium hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  );
}
