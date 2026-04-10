import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { mockForumPosts } from '@/data/mockForum';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ForumPost } from '@/types';

const CATEGORIES = [
  { value: 'question', label: 'Вопрос' },
  { value: 'experience', label: 'Опыт' },
  { value: 'support', label: 'Поддержка' },
] as const;

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [posts, setPosts] = useLocalStorage<ForumPost[]>('forum-posts', mockForumPosts);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'question' | 'experience' | 'support'>('question');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Заполните заголовок и текст поста');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 400));

    const newPost: ForumPost = {
      id: Date.now().toString(),
      authorId: user?.id ?? 'guest',
      authorName: user?.name ?? 'Аноним',
      authorCity: user?.city ?? 'Казахстан',
      category,
      title: title.trim(),
      content: content.trim(),
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
    navigate('/forum');
  };

  return (
    <div>
      <Header title="Новый пост" showBack />

      <div className="px-4 py-5 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Заголовок *</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Краткое описание вашего поста"
            maxLength={100}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Категория *</label>
          <div className="relative">
            <select
              value={category}
              onChange={e => setCategory(e.target.value as typeof category)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white pr-10"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Текст поста *</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Расскажите подробнее..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          />
        </div>

        <Button fullWidth size="lg" onClick={handleSubmit} loading={loading}>
          Опубликовать
        </Button>
      </div>
    </div>
  );
}
