import React, { useRef, useEffect, useState } from 'react';
import { X, Send, Key, Trash2 } from 'lucide-react';
import { useChatStore } from '@/store/useChatStore';
import { ChatBubble, TypingIndicator } from './ChatBubble';

const SUGGESTED = [
  'Как понять что ребёнок плохо спит?',
  'Признаки депрессии после родов',
  'Какие пособия я могу получить?',
];

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const { messages, isLoading, apiKey, setApiKey, sendMessage, clearMessages } = useChatStore();
  const [input, setInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [showKeyForm, setShowKeyForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    await sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveKey = () => {
    if (keyInput.trim()) {
      setApiKey(keyInput.trim());
      setShowKeyForm(false);
      setKeyInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-[430px] bg-white rounded-t-3xl shadow-2xl animate-slide-up flex flex-col" style={{ height: '82vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">L</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Lullabea AI</p>
              <p className="text-xs text-green-500">Онлайн</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowKeyForm(v => !v)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="API ключ"
            >
              <Key size={16} className={apiKey ? 'text-green-500' : 'text-gray-400'} />
            </button>
            <button onClick={clearMessages} className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Очистить">
              <Trash2 size={16} className="text-gray-400" />
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* API Key Form */}
        {showKeyForm && (
          <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex-shrink-0">
            <p className="text-xs text-amber-700 mb-2 font-medium">Введите Anthropic API-ключ (начинается с sk-):</p>
            <div className="flex gap-2">
              <input
                type="password"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder="sk-ant-..."
                className="flex-1 text-xs border border-amber-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <button
                onClick={handleSaveKey}
                className="text-xs bg-amber-600 text-white px-3 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Сохранить
              </button>
            </div>
            {!apiKey && <p className="text-xs text-amber-600 mt-1">Без ключа ИИ не будет отвечать</p>}
            {apiKey && <p className="text-xs text-green-600 mt-1">✓ Ключ сохранён</p>}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤱</span>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">Привет! Я ваш ИИ-помощник</p>
              <p className="text-xs text-gray-500 mb-5">Спросите меня о здоровье малыша, своём самочувствии или правах мамы</p>
              <div className="space-y-2">
                {SUGGESTED.map(q => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    className="w-full text-left text-xs bg-red-50 text-red-700 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-colors border border-red-100"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-end gap-2 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-100 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Написать сообщение..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-900 resize-none focus:outline-none py-1.5 max-h-24 placeholder-gray-400"
              style={{ lineHeight: '1.4' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 transition-colors active:scale-90 mb-0.5"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
