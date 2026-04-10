import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { DEMO_ACCOUNTS } from '@/data/mockUsers';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Заполните все поля'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 500));
    const result = login(email, password);
    if (result.isAdmin) {
      navigate('/admin');
    } else {
      navigate('/home');
    }
    setLoading(false);
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top illustration */}
      <div className="bg-red-600 pt-14 pb-10 px-6 rounded-b-[40px]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-3xl">🤱</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Lullabea</h1>
          <p className="text-red-200 text-sm mt-1">Добро пожаловать!</p>
        </div>
      </div>

      <div className="flex-1 px-6 pt-8 pb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Войти в аккаунт</h2>
        <p className="text-sm text-gray-500 mb-6">Введите email и пароль</p>

        {/* Demo accounts */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-2 font-medium">Быстрый вход (демо):</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                onClick={() => fillDemo(acc)}
                className="text-left px-3 py-2.5 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
              >
                <p className="text-xs font-semibold text-red-700">{acc.label}</p>
                <p className="text-[10px] text-red-400 mt-0.5">{acc.email}</p>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <Button
          fullWidth
          size="lg"
          onClick={handleLogin}
          loading={loading}
          className="mt-6"
        >
          Войти
        </Button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-red-600 font-medium hover:underline">
            Зарегистрироваться
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-2">
          Подсказка: любой email/пароль работает для входа
        </p>
      </div>
    </div>
  );
}
