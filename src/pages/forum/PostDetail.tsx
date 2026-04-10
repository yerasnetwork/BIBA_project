import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Badge, categoryColor, categoryLabel } from '@/components/ui/Badge';
import { mockForumPosts } from '@/data/mockForum';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ForumPost } from '@/types';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (d > 0) return `${d} дн. назад`;
  if (h > 0) return `${h} ч. назад`;
  return `${m} мин. назад`;
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useLocalStorage<ForumPost[]>('forum-posts', mockForumPosts);
  const [likedPosts, setLikedPosts] = useLocalStorage<string[]>('liked-posts', []);

  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-4xl">💬</p>
        <p className="text-gray-500 text-sm">Пост не найден</p>
        <button onClick={() => navigate('/forum')} className="text-red-600 text-sm font-medium">Вернуться</button>
      </div>
    );
  }

  const isLiked = likedPosts.includes(post.id);
  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const toggleLike = () => {
    setLikedPosts(isLiked ? likedPosts.filter(i => i !== post.id) : [...likedPosts, post.id]);
    setPosts(posts.map(p =>
      p.id === post.id ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } : p
    ));
  };

  return (
    <div>
      <Header title="Пост" showBack />

      <div className="px-4 py-4 pb-8 space-y-5">
        {/* Post */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-sm font-bold text-red-700">
              {initials(post.authorName)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{post.authorName}</p>
              <p className="text-xs text-gray-400">{post.authorCity} · {timeAgo(post.createdAt)}</p>
            </div>
          </div>

          <Badge color={categoryColor(post.category)}>{categoryLabel(post.category)}</Badge>
          <h2 className="text-base font-bold text-gray-900 mt-2 mb-2 leading-snug">{post.title}</h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

          <button onClick={toggleLike} className="flex items-center gap-2 mt-4 text-sm text-gray-500 hover:text-red-500 transition-colors">
            <Heart size={16} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
            {post.likes} лайков
          </button>
        </div>

        {/* Comments */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MessageCircle size={15} /> Комментарии ({post.comments.length})
          </h3>
          {post.comments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Пока нет комментариев</p>
          ) : (
            <div className="space-y-3">
              {post.comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-700">{comment.authorName}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={10} />
                      <span>{timeAgo(comment.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
