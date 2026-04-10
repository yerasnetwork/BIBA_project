import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { mockUsers } from '@/data/mockUsers';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; isAdmin: boolean };
  register: (data: Partial<User> & { password: string }) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, _password: string) => {
        const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        const user: User = found ?? {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email,
          city: 'Астана',
          plan: 'free',
          createdAt: new Date().toISOString().split('T')[0],
        };
        set({ user, isAuthenticated: true });
        return { success: true, isAdmin: user.email === 'admin@lullabea.kz' };
      },

      register: (data) => {
        const user: User = {
          id: Date.now().toString(),
          name: data.name ?? 'Мама',
          email: data.email ?? '',
          city: data.city ?? 'Астана',
          plan: 'free',
          createdAt: new Date().toISOString().split('T')[0],
          babyName: data.babyName,
          babyBirthdate: data.babyBirthdate,
        };
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('baby-storage');
        localStorage.removeItem('chat-storage');
      },

      updateUser: (data) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...data } });
        }
      },
    }),
    { name: 'auth-storage' }
  )
);
