import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Vitals, VitalsPoint, Alert } from '@/types';
import { mockAlerts } from '@/data/mockAlerts';

interface BabyState {
  vitals: Vitals;
  vitalsHistory: VitalsPoint[];
  alerts: Alert[];
  isConnected: boolean;
  showDangerModal: boolean;
  dangerVitals: Vitals | null;
  enrolledCourses: string[];

  setVitals: (vitals: Vitals) => void;
  addVitalsPoint: (point: VitalsPoint) => void;
  toggleConnection: () => void;
  addAlert: (alert: Alert) => void;
  setShowDangerModal: (show: boolean) => void;
  enrollCourse: (courseId: string) => void;
  isCourseEnrolled: (courseId: string) => boolean;
}

const defaultVitals: Vitals = {
  heartRate: 138,
  temperature: 36.8,
  oxygen: 98,
  movement: 'calm',
  timestamp: Date.now(),
};

export const useBabyStore = create<BabyState>()(
  persist(
    (set, get) => ({
      vitals: defaultVitals,
      vitalsHistory: [],
      alerts: mockAlerts.slice(0, 5),
      isConnected: true,
      showDangerModal: false,
      dangerVitals: null,
      enrolledCourses: [],

      setVitals: (vitals) => {
        const isDanger =
          vitals.heartRate < 100 || vitals.heartRate > 180 ||
          vitals.temperature < 36.0 || vitals.temperature > 38.0 ||
          vitals.oxygen < 92;

        set({ vitals });

        if (isDanger) {
          set({ showDangerModal: true, dangerVitals: vitals });
          const alertType: Alert['type'] =
            vitals.heartRate < 100 || vitals.heartRate > 180 ? 'heartRate' :
            vitals.oxygen < 92 ? 'oxygen' : 'temperature';

          const messages: Record<Alert['type'], string> = {
            heartRate: `Пульс: ${vitals.heartRate} уд/мин`,
            temperature: `Температура: ${vitals.temperature}°C`,
            oxygen: `Кислород: ${vitals.oxygen}%`,
          };

          const newAlert: Alert = {
            id: Date.now().toString(),
            type: alertType,
            value: alertType === 'heartRate' ? vitals.heartRate : alertType === 'temperature' ? vitals.temperature : vitals.oxygen,
            message: messages[alertType],
            timestamp: new Date().toISOString(),
            resolved: false,
          };
          get().addAlert(newAlert);
        }
      },

      addVitalsPoint: (point) => {
        set(state => ({
          vitalsHistory: [...state.vitalsHistory.slice(-59), point],
        }));
      },

      toggleConnection: () => set(state => ({ isConnected: !state.isConnected })),

      addAlert: (alert) => {
        set(state => ({
          alerts: [alert, ...state.alerts.slice(0, 9)],
        }));
      },

      setShowDangerModal: (show) => {
        set({ showDangerModal: show });
        if (!show) {
          set(state => ({
            alerts: state.alerts.map((a, i) => i === 0 ? { ...a, resolved: true } : a),
          }));
        }
      },

      enrollCourse: (courseId) => {
        set(state => ({
          enrolledCourses: state.enrolledCourses.includes(courseId)
            ? state.enrolledCourses
            : [...state.enrolledCourses, courseId],
        }));
      },

      isCourseEnrolled: (courseId) => get().enrolledCourses.includes(courseId),
    }),
    { name: 'baby-storage', partialize: (s) => ({ enrolledCourses: s.enrolledCourses, isConnected: s.isConnected }) }
  )
);
