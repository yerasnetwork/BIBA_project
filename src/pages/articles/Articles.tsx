import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Badge, categoryColor, categoryLabel } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { mockArticles } from '@/data/mockArticles';

type Category = 'all' | 'health' | 'psychology' | 'legal' | 'finance';

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'all', label: 'Всё' },
  { key: 'health', label: 'Здоровье' },
  { key: 'psychology', label: 'Психология' },
  { key: 'legal', label: 'Юридическое' },
  { key: 'finance', label: 'Финансы' },
];

export default function Articles() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');
  const [loading] = useState(false);

  const filtered = mockArticles.filter(a => {
    const matchesCat = category === 'all' || a.category === category;
    const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.preview.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <Header title="Статьи" />

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск статей..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                category === cat.key
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm text-gray-500">Статьи не найдены</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(article => (
              <div
                key={article.id}
                onClick={() => navigate(`/articles/${article.id}`)}
                className="bg-white rounded-2xl border border-gray-100 p-4 cursor-pointer active:scale-[0.99] transition-transform hover:shadow-sm"
              >
                <Badge color={categoryColor(article.category)}>
                  {categoryLabel(article.category)}
                </Badge>
                <h3 className="text-sm font-semibold text-gray-900 mt-2 leading-snug">{article.title}</h3>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{article.preview}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-400">{article.readTime} мин чтения</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
