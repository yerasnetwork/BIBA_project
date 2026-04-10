import React from 'react';
import { BellOff, Phone } from 'lucide-react';
import { Vitals } from '@/types';

interface ManualAlarmModalProps {
  vitals: Vitals;
  onStop: () => void;
}

type Status = 'danger' | 'watch' | 'normal';

interface VitalRow {
  icon: string;
  label: string;
  display: string;
  status: Status;
  note: string;
}

function hrStatus(v: number): Status {
  if (v < 100 || v > 180) return 'danger';
  if (v < 115 || v > 165) return 'watch';
  return 'normal';
}
function tempStatus(v: number): Status {
  if (v < 36.0 || v > 38.0) return 'danger';
  if (v > 37.5 || v < 36.2) return 'watch';
  return 'normal';
}
function o2Status(v: number): Status {
  if (v < 92) return 'danger';
  if (v < 95) return 'watch';
  return 'normal';
}

const statusLabel: Record<Status, string> = {
  danger: 'Критично',
  watch:  'Внимание',
  normal: 'Норма',
};

const statusColors: Record<Status, { badge: string; row: string }> = {
  danger: { badge: 'bg-red-100 text-red-700',    row: 'bg-red-50 border-red-200' },
  watch:  { badge: 'bg-amber-100 text-amber-700', row: 'bg-amber-50 border-amber-200' },
  normal: { badge: 'bg-green-100 text-green-700', row: 'bg-green-50 border-green-200' },
};

export function ManualAlarmModal({ vitals, onStop }: ManualAlarmModalProps) {
  const rows: VitalRow[] = [
    {
      icon: '❤️',
      label: 'Пульс',
      display: `${vitals.heartRate} уд/мин`,
      status: hrStatus(vitals.heartRate),
      note: 'Норма: 100–180 уд/мин',
    },
    {
      icon: '🌡️',
      label: 'Температура',
      display: `${vitals.temperature}°C`,
      status: tempStatus(vitals.temperature),
      note: 'Норма: 36.0–38.0°C',
    },
    {
      icon: '💧',
      label: 'Кислород',
      display: `${vitals.oxygen}%`,
      status: o2Status(vitals.oxygen),
      note: 'Норма: ≥92%',
    },
  ];

  const hasIssue = rows.some(r => r.status !== 'normal');

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl px-5 pt-6 pb-8 shadow-2xl">
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center animate-pulse flex-shrink-0">
            <span className="text-2xl">🔔</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Тревога активирована</h2>
            <p className="text-xs text-gray-500">
              {hasIssue
                ? 'Обнаружены отклонения — проверьте малыша'
                : 'Текущие показатели в норме'}
            </p>
          </div>
        </div>

        {/* Vitals rows */}
        <div className="space-y-2 mb-5">
          {rows.map(row => (
            <div
              key={row.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${statusColors[row.status].row}`}
            >
              <span className="text-xl">{row.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{row.label}</p>
                <p className="text-xs text-gray-500">{row.note}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{row.display}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[row.status].badge}`}>
                  {statusLabel[row.status]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency call */}
        <a
          href="tel:103"
          className="flex items-center justify-center gap-2 w-full py-3 mb-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-semibold text-sm hover:bg-red-100 transition-colors"
        >
          <Phone size={16} />
          Скорая помощь — 103
        </a>

        {/* Stop button */}
        <button
          onClick={onStop}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-700 active:scale-95 transition-all"
        >
          <BellOff size={18} />
          Остановить тревогу
        </button>
      </div>
    </div>
  );
}
