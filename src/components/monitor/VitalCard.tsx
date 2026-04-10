import React from 'react';

type Status = 'normal' | 'watch' | 'danger';

interface VitalCardProps {
  icon: string;
  label: string;
  value: string | number;
  unit: string;
  status: Status;
  subLabel?: string;
}

const statusConfig: Record<Status, { bg: string; border: string; dot: string; text: string; animation: string }> = {
  normal: {
    bg: 'bg-white',
    border: 'border-gray-100',
    dot: 'bg-green-500',
    text: 'text-green-600',
    animation: 'animate-breathe',
  },
  watch: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    text: 'text-amber-600',
    animation: '',
  },
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    dot: 'bg-red-600 animate-pulse',
    text: 'text-red-600',
    animation: 'animate-flash-danger',
  },
};

const statusLabel: Record<Status, string> = {
  normal: 'Норма',
  watch: 'Внимание',
  danger: 'Опасно',
};

export function VitalCard({ icon, label, value, unit, status, subLabel }: VitalCardProps) {
  const cfg = statusConfig[status];

  return (
    <div className={`rounded-2xl border p-4 flex flex-col gap-2 ${cfg.bg} ${cfg.border} ${cfg.animation}`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className={`flex items-center gap-1 text-xs font-medium ${cfg.text}`}>
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          {statusLabel[status]}
        </span>
      </div>

      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
        {subLabel && <p className="text-xs text-gray-400 mt-0.5">{subLabel}</p>}
      </div>
    </div>
  );
}
