import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { VitalsPoint } from '@/types';

interface VitalsChartProps {
  data: VitalsPoint[];
}

export function VitalsChart({ data }: VitalsChartProps) {
  const display = data.length > 0 ? data.slice(-20) : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">❤️ Пульс — последние 60 сек</h3>
        <span className="text-xs text-gray-400">уд/мин</span>
      </div>

      {display.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-sm text-gray-400">
          Ожидание данных...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={display} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[80, 200]}
              tick={{ fontSize: 9, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              ticks={[80, 100, 130, 160, 180, 200]}
            />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              formatter={(v: number) => [`${v} уд/мин`, 'Пульс']}
              labelStyle={{ fontSize: 10, color: '#6b7280' }}
            />
            <ReferenceLine y={180} stroke="#f59e0b" strokeDasharray="4 2" strokeWidth={1} label={{ value: '180', position: 'right', fontSize: 8, fill: '#f59e0b' }} />
            <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="4 2" strokeWidth={1} label={{ value: '100', position: 'right', fontSize: 8, fill: '#f59e0b' }} />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#dc2626' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
