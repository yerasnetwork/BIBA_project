import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Heart, MessageCircle, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Badge, categoryColor, categoryLabel } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { mockForumPosts } from '@/data/mockForum';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ForumPost } from '@/types';

type FilterCat = 'all' | 'question' | 'experience' | 'support';

const CATS: { key: FilterCat; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'question', label: 'Вопрос' },
  { key: 'experience', label: 'Опыт' },
  { key: 'support', label: 'Поддержка' },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (d > 0) return `${d} дн. назад`;
  if (h > 0) return `${h} ч. назад`;
  return `${m} мин. назад`;
}

export default function Forum() {
  const navigate = useNavigate();
  const [cat, setCat] = useState<FilterCat>('all');
  const [posts, setPosts] = useLocalStorage<ForumPost[]>('forum-posts', mockForumPosts);
  const [likedPosts, setLikedPosts] = useLocalStorage<string[]>('liked-posts', []);
  const [loading] = useState(false);

  const filtered = cat === 'all' ? posts : posts.filter(p => p.category === cat);

  const toggleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    const isLiked = likedPosts.includes(postId);
    setLikedPosts(isLiked ? likedPosts.filter(id => id !== postId) : [...likedPosts, postId]);
    setPosts(posts.map(p =>
      p.id === postId ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } : p
    ));
  };

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      <Header title="Сообщество" />

      <div className="px-4 py-4 space-y-4">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATS.map(c => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                cat === c.key ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-sm text-gray-500">Постов нет</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(post => (
              <div
                key={post.id}
                onClick={() => navigate(`/forum/${post.id}`)}
                className="bg-white rounded-2xl border border-gray-100 p-4 cursor-pointer active:scale-[0.99] transition-transform hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-red-700">
                    {initials(post.authorName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700">{post.authorName}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400">{post.authorCity}</span>
                    </div>
                    <Badge color={categoryColor(post.category)}>{categoryLabel(post.category)}</Badge>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(post.createdAt)}</span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mt-3 leading-snug">{post.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.content}</p>

                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={e => toggleLike(e, post.id)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart
                      size={14}
                      className={likedPosts.includes(post.id) ? 'fill-red-500 text-red-500' : ''}
                    />
                    {post.likes}
                  </button>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <MessageCircle size={14} />
                    {post.comments.length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/forum/create')}
        className="fixed bottom-20 right-4 z-40 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 active:scale-95 transition-all flex items-center gap-2 px-4 py-3"
      >
        <Plus size={18} />
        <span className="text-sm font-medium">Написать пост</span>
      </button>
    </div>
  );
}
