import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Activity, Users, BookOpen, User } from 'lucide-react';

const navItems = [
  { to: '/home', icon: Home, label: 'Главная' },
  { to: '/monitor', icon: Activity, label: 'Монитор' },
  { to: '/forum', icon: Users, label: 'Сообщество' },
  { to: '/courses', icon: BookOpen, label: 'Курсы' },
  { to: '/profile', icon: User, label: 'Профиль' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-2 pb-safe z-40 shadow-[0_-1px_0_0_#f3f4f6]">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all relative ${
                isActive ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
