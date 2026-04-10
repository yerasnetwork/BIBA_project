import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronLeft } from 'lucide-react';
import { useBabyStore } from '@/store/useBabyStore';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function Header({ title, showBack = false, rightElement }: HeaderProps) {
  const navigate = useNavigate();
  const { alerts } = useBabyStore();
  const unresolved = alerts.filter(a => !a.resolved).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="flex items-center h-14 px-4 gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={22} className="text-gray-700" />
          </button>
        )}

        <h1 className="flex-1 text-base font-semibold text-gray-900 truncate">{title}</h1>

        {rightElement}

        <button
          onClick={() => navigate('/monitor')}
          className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Bell size={20} className="text-gray-600" />
          {unresolved > 0 && (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-600 rounded-full animate-pulse-red" />
          )}
        </button>
      </div>
    </header>
  );
}
