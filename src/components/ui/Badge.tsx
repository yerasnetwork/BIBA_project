import React from 'react';

type BadgeColor = 'red' | 'green' | 'amber' | 'gray' | 'blue' | 'purple';

interface BadgeProps {
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}

const colors: Record<BadgeColor, string> = {
  red: 'bg-red-100 text-red-700',
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  gray: 'bg-gray-100 text-gray-600',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
};

export function Badge({ color = 'gray', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}

export function categoryColor(cat: string): BadgeColor {
  switch (cat) {
    case 'health': return 'green';
    case 'psychology': return 'purple';
    case 'legal': return 'blue';
    case 'finance': return 'amber';
    case 'question': return 'blue';
    case 'experience': return 'green';
    case 'support': return 'red';
    case 'basic': return 'gray';
    case 'advanced': return 'red';
    case 'live': return 'red';
    default: return 'gray';
  }
}

export function categoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    health: 'Здоровье',
    psychology: 'Психология',
    legal: 'Юридическое',
    finance: 'Финансы',
    question: 'Вопрос',
    experience: 'Опыт',
    support: 'Поддержка',
    basic: 'Базовый',
    advanced: 'Продвинутый',
    live: 'Лайв',
  };
  return labels[cat] ?? cat;
}
