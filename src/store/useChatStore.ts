import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  apiKey: string;

  setOpen: (open: boolean) => void;
  setApiKey: (key: string) => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const SYSTEM_PROMPT = `Ты — ИИ-ассистент Lullabea для мам в Казахстане. Помогаешь с вопросами о уходе за новорождённым, послеродовой депрессии, правах матерей и здоровье детей. Всегда рекомендуй обратиться к врачу при серьёзных симптомах. Отвечай на языке пользователя (русский, казахский или английский). Будь тёплой и поддерживающей. Отвечай кратко и по делу, используй нумерованные списки и заголовки для удобства.`;

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      isOpen: false,
      apiKey: '',

      setOpen: (open) => set({ isOpen: open }),
      setApiKey: (key) => set({ apiKey: key }),
      clearMessages: () => set({ messages: [] }),

      sendMessage: async (content: string) => {
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content,
          timestamp: Date.now(),
        };

        set(state => ({ messages: [...state.messages, userMsg], isLoading: true }));

        const { apiKey, messages } = get();

        if (!apiKey) {
          const errMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Пожалуйста, введите ваш API-ключ Anthropic чтобы использовать ИИ-ассистента.',
            timestamp: Date.now(),
          };
          set(state => ({ messages: [...state.messages, errMsg], isLoading: false }));
          return;
        }

        try {
          const allMessages = [...messages, userMsg];
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 1024,
              system: SYSTEM_PROMPT,
              messages: allMessages.map(m => ({ role: m.role, content: m.content })),
            }),
          });

          if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error((err as { error?: { message?: string } })?.error?.message ?? `HTTP ${response.status}`);
          }

          const data = await response.json() as { content: Array<{ text: string }> };
          const text = data.content?.[0]?.text ?? 'Нет ответа.';

          const assistantMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: text,
            timestamp: Date.now(),
          };
          set(state => ({ messages: [...state.messages, assistantMsg], isLoading: false }));
        } catch (err) {
          const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Ошибка: ${err instanceof Error ? err.message : 'Не удалось подключиться к ИИ'}. Проверьте API-ключ.`,
            timestamp: Date.now(),
          };
          set(state => ({ messages: [...state.messages, errorMsg], isLoading: false }));
        }
      },
    }),
    { name: 'chat-storage', partialize: (s) => ({ apiKey: s.apiKey, messages: s.messages }) }
  )
);
