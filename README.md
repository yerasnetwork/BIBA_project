# Lullabea — Мамам Казахстана

Платформа материнского здоровья для мам в Казахстане. Мобильное приложение в браузере.

## Быстрый старт

```bash
npm install
npm run dev
```

Открыть в браузере: http://localhost:5173

## Демо-аккаунты

| Аккаунт | Email | Пароль |
|---------|-------|--------|
| Гаухар (Астана) | gaukhar@example.com | demo123 |
| Асем (Шымкент) | asem@example.com | demo123 |
| Admin | admin@lullabea.kz | admin |

> Любой email/пароль также работает для входа.

## Функции

- **Baby Monitor** — отслеживание пульса, температуры, кислорода в реальном времени (каждые 3 секунды)
- **Mood Tracker** — дневник настроения с графиком за 14 дней
- **Articles** — 8 статей на русском о здоровье, психологии, юридических и финансовых вопросах
- **Community Forum** — посты, лайки, комментарии
- **Courses** — 6 курсов с демо-оплатой
- **Legal Help** — FAQ, вопросы юристу, полезные ссылки
- **AI Chat** — ИИ-ассистент на Claude (требует Anthropic API key)
- **Admin Panel** — /admin (только для admin@lullabea.kz)

## AI Chat

Для использования ИИ-ассистента:
1. Нажмите красную кнопку чата в правом нижнем углу
2. Нажмите иконку ключа и введите ваш Anthropic API key (sk-ant-...)
3. Ключ сохраняется в localStorage браузера

## Стек

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Zustand (state management)
- Recharts (графики)
- Lucide React (иконки)
- Anthropic API (claude-sonnet-4-20250514)
