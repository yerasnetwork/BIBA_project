import React from 'react';
import { Wifi, WifiOff, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useBabyStore } from '@/store/useBabyStore';
import { Header } from '@/components/layout/Header';
import { VitalCard } from '@/components/monitor/VitalCard';
import { VitalsChart } from '@/components/monitor/VitalsChart';
import { useVitalsSimulator } from '@/hooks/useVitalsSimulator';

type VStatus = 'normal' | 'watch' | 'danger';

function hrStatus(v: number): VStatus {
  if (v < 100 || v > 180) return 'danger';
  if (v < 115 || v > 165) return 'watch';
  return 'normal';
}
function tempStatus(v: number): VStatus {
  if (v < 36.0 || v > 38.0) return 'danger';
  if (v > 37.5 || v < 36.2) return 'watch';
  return 'normal';
}
function o2Status(v: number): VStatus {
  if (v < 92) return 'danger';
  if (v < 95) return 'watch';
  return 'normal';
}
function movLabel(m: string): string {
  return { active: 'Активно', calm: 'Спокойно', still: 'Без движений' }[m] ?? m;
}

function formatTs(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString('ru', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function Monitor() {
  useVitalsSimulator(true);
  const { user } = useAuthStore();
  const { vitals, vitalsHistory, alerts, isConnected, toggleConnection } = useBabyStore();
  const babyName = user?.babyName ?? 'Малыш';

  const alertTypeIcon: Record<string, string> = {
    heartRate: '❤️', temperature: '🌡️', oxygen: '💧',
  };

  return (
    <div>
      <Header title={`Монитор — ${babyName}`} />

      <div className="px-4 py-5 space-y-4">
        {/* Connection toggle */}
        <button
          onClick={toggleConnection}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
            isConnected
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-gray-50 border-gray-200 text-gray-500'
          }`}
        >
          {isConnected ? <Wifi size={18} /> : <WifiOff size={18} />}
          <span className="text-sm font-medium">
            {isConnected ? 'Браслет подключён' : 'Браслет не подключён'}
          </span>
          <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
            isConnected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
          }`}>
            {isConnected ? 'Онлайн' : 'Оффлайн'}
          </span>
        </button>

        {/* Vitals grid */}
        <div className="grid grid-cols-2 gap-3">
          <VitalCard
            icon="❤️"
            label="Пульс"
            value={vitals.heartRate}
            unit="уд/мин"
            status={hrStatus(vitals.heartRate)}
            subLabel="Норма: 100–180"
          />
          <VitalCard
            icon="🌡️"
            label="Температура"
            value={vitals.temperature}
            unit="°C"
            status={tempStatus(vitals.temperature)}
            subLabel="Норма: 36.0–38.0"
          />
          <VitalCard
            icon="💧"
            label="Кислород"
            value={vitals.oxygen}
            unit="%"
            status={o2Status(vitals.oxygen)}
            subLabel="Норма: ≥92%"
          />
          <VitalCard
            icon="🏃"
            label="Движение"
            value={movLabel(vitals.movement)}
            unit=""
            status="normal"
            subLabel={`Обновлено ${new Date(vitals.timestamp).toLocaleTimeString('ru')}`}
          />
        </div>

        {/* Chart */}
        <VitalsChart data={vitalsHistory} />

        {/* Alert history */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">История тревог</h3>
          {alerts.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-400">Тревог не было</div>
          ) : (
            <div className="space-y-2">
              {alerts.slice(0, 5).map(alert => (
                <div
                  key={alert.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                    alert.resolved ? 'bg-gray-50 border-gray-100' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <span className="text-xl">{alertTypeIcon[alert.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{alert.message}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={10} className="text-gray-400" />
                      <p className="text-xs text-gray-400">{formatTs(alert.timestamp)}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    alert.resolved ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-600'
                  }`}>
                    {alert.resolved ? 'Решено' : 'Активно'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
