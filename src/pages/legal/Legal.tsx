import React, { useState } from 'react';
import { ExternalLink, Phone, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { LegalQuestion } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const MOCK_QUESTIONS: LegalQuestion[] = [
  {
    id: 'q1',
    question: 'Могут ли меня уволить пока я в декрете?',
    answer: 'Нет. По Трудовому кодексу РК, работодатель не вправе расторгнуть трудовой договор с женщиной в период беременности, отпуска по беременности и родам, а также в период отпуска по уходу за ребёнком до 3 лет. Исключение — ликвидация организации.',
    status: 'answered',
    createdAt: '2024-12-20',
  },
  {
    id: 'q2',
    question: 'Как рассчитывается пособие по беременности и родам?',
    answer: 'Пособие рассчитывается как 100% среднемесячного заработка за 12 месяцев, предшествующих выходу в декрет. Если стаж менее 12 месяцев, используется фактический период. Максимальный размер ограничен 40 МРП в месяц.',
    status: 'answered',
    createdAt: '2024-12-22',
  },
];

const FAQ = [
  {
    q: 'Что такое АСП и кто может её получить?',
    a: 'АСП (адресная социальная помощь) — государственная помощь малообеспеченным семьям. Право на АСП имеют семьи, среднедушевой доход которых ниже черты бедности. Оформляется через EGOV.KZ или ЦОН.',
  },
  {
    q: 'Сохраняется ли медицинская страховка в декрете?',
    a: 'Да. Государство оплачивает взносы ОСМС за вас в период отпуска по уходу за ребёнком. Вы сохраняете полный доступ к медицинским услугам.',
  },
  {
    q: 'Можно ли работать неполный день в декрете?',
    a: 'Да. Вы можете выйти на неполный рабочий день, сохранив пособие по уходу за ребёнком. Главное — договориться с работодателем письменно и уведомить ГЦВП.',
  },
  {
    q: 'Обязан ли работодатель давать место для кормления?',
    a: 'Да. По ТК РК работодатель обязан предоставить кормящим матерям дополнительные перерывы на кормление не реже чем через каждые 3 часа, не менее 30 минут.',
  },
  {
    q: 'Что делать если работодатель нарушает права?',
    a: 'Обратитесь в Государственную инспекцию труда вашего региона. Также можно подать жалобу онлайн через портал EGOV.KZ или позвонить на горячую линию Минтруда: 1412.',
  },
];

export default function Legal() {
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useLocalStorage<LegalQuestion[]>('legal-questions', MOCK_QUESTIONS);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSend = () => {
    if (!question.trim()) return;
    const newQ: LegalQuestion = {
      id: Date.now().toString(),
      question: question.trim(),
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setQuestions([newQ, ...questions]);
    setQuestion('');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div>
      <Header title="Юридическая помощь" />

      <div className="px-4 py-5 space-y-6 pb-8">
        {/* Ask form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Задать вопрос юристу</h3>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Опишите вашу ситуацию или задайте вопрос..."
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {sent && <p className="text-xs text-green-600 mt-1">✓ Вопрос отправлен! Ответ придёт в ближайшее время.</p>}
          <Button fullWidth size="md" onClick={handleSend} className="mt-3" disabled={!question.trim()}>
            <Send size={14} />
            Отправить
          </Button>
        </div>

        {/* My questions */}
        {questions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Мои вопросы</h3>
            <div className="space-y-3">
              {questions.map(q => (
                <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-gray-900 leading-snug">{q.question}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      q.status === 'answered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {q.status === 'answered' ? 'Отвечено' : 'Ожидает'}
                    </span>
                  </div>
                  {q.answer && (
                    <div className="bg-gray-50 rounded-xl p-3 mt-2">
                      <p className="text-xs text-gray-400 mb-1 font-medium">Ответ юриста:</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{q.answer}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{q.createdAt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Useful links */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Полезные ресурсы</h3>
          <div className="space-y-2">
            {[
              { icon: '🌐', label: 'EGOV.KZ — пособия', url: 'https://egov.kz', color: 'bg-blue-50 border-blue-100' },
              { icon: '📜', label: 'Права матери в РК — ТК', url: 'https://adilet.zan.kz', color: 'bg-purple-50 border-purple-100' },
            ].map(link => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${link.color} hover:opacity-80 transition-opacity`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-sm font-medium text-gray-800 flex-1">{link.label}</span>
                <ExternalLink size={14} className="text-gray-400" />
              </a>
            ))}

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-red-50 border-red-100">
              <Phone size={18} className="text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Горячая линия</p>
                <p className="text-xs text-gray-500">Психологическая помощь 24/7</p>
              </div>
              <span className="text-base font-bold text-red-600">150</span>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Частые вопросы</h3>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                >
                  <span className="flex-1 text-sm font-medium text-gray-800 leading-snug">{item.q}</span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
