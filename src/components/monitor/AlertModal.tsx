import React from 'react';
import { AlertTriangle, Bell } from 'lucide-react';
import { Vitals } from '@/types';
import { Button } from '@/components/ui/Button';

interface AlertModalProps {
  vitals: Vitals;
  onClose: () => void;
}

export function AlertModal({ vitals, onClose }: AlertModalProps) {
  const issues: string[] = [];
  if (vitals.heartRate < 100 || vitals.heartRate > 180)
    issues.push(`Пульс: ${vitals.heartRate} уд/мин (норма 100–180)`);
  if (vitals.temperature < 36.0 || vitals.temperature > 38.0)
    issues.push(`Температура: ${vitals.temperature}°C (норма 36.0–38.0)`);
  if (vitals.oxygen < 92)
    issues.push(`Кислород: ${vitals.oxygen}% (норма ≥92%)`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-600/90 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[380px] mx-4 bg-white rounded-3xl p-6 shadow-2xl text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
            <AlertTriangle size={40} className="text-red-600" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">⚠️ Тревога!</h2>
        <p className="text-sm text-gray-500 mb-4">Обнаружены отклонения в показателях малыша</p>

        <div className="bg-red-50 rounded-2xl p-4 mb-6 space-y-2 text-left">
          {issues.map((issue, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 animate-pulse" />
              <span className="text-sm font-medium text-red-700">{issue}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mb-5">
          Немедленно проверьте состояние ребёнка. При необходимости позвоните 103.
        </p>

        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={onClose}
            className="gap-2"
          >
            <Bell size={18} />
            Разбудить ребёнка
          </Button>
          <button
            onClick={onClose}
            className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
          >
            Показатели нормализовались
          </button>
        </div>
      </div>
    </div>
  );
}
