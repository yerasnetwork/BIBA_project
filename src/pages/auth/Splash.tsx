import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate(user?.email === 'admin@lullabea.kz' ? '/admin' : '/home');
      } else {
        navigate('/login');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, user]);

  return (
    <div className="fixed inset-0 bg-red-600 flex flex-col items-center justify-center animate-fade-in">
      {/* Logo */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
          <span className="text-5xl">🤱</span>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">Lullabea</h1>
          <p className="text-red-200 text-sm mt-1 font-medium">Мамам Казахстана</p>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-red-100 text-base text-center max-w-[260px] leading-relaxed">
        Забота о малыше и вашем здоровье в одном месте
      </p>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-2">
        {[0, 0.3, 0.6].map((delay, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-red-200 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}
