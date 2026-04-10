import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Badge, categoryColor, categoryLabel } from '@/components/ui/Badge';
import { mockArticles } from '@/data/mockArticles';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = mockArticles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-4xl">📄</p>
        <p className="text-gray-500 text-sm">Статья не найдена</p>
        <button onClick={() => navigate('/articles')} className="text-red-600 text-sm font-medium">
          Вернуться
        </button>
      </div>
    );
  }

  // Simple markdown-like renderer
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let key = 0;

    lines.forEach(line => {
      if (line.startsWith('# ')) {
        elements.push(<h1 key={key++} className="text-xl font-bold text-gray-900 mt-4 mb-2">{line.slice(2)}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={key++} className="text-base font-bold text-gray-900 mt-5 mb-2">{line.slice(3)}</h2>);
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(<p key={key++} className="font-semibold text-gray-800 mt-3 mb-1">{line.slice(2, -2)}</p>);
      } else if (line.startsWith('- ')) {
        elements.push(
          <div key={key++} className="flex gap-2 items-start ml-2 mb-1">
            <span className="text-red-500 mt-1 flex-shrink-0">•</span>
            <p className="text-sm text-gray-700 leading-relaxed">{line.slice(2)}</p>
          </div>
        );
      } else if (line.match(/^\d+\. /)) {
        const match = line.match(/^(\d+)\. (.+)/);
        if (match) {
          elements.push(
            <div key={key++} className="flex gap-2 items-start ml-2 mb-1">
              <span className="text-red-600 font-bold text-sm flex-shrink-0 w-5">{match[1]}.</span>
              <p className="text-sm text-gray-700 leading-relaxed">{match[2]}</p>
            </div>
          );
        }
      } else if (line.trim() === '') {
        elements.push(<div key={key++} className="h-1" />);
      } else if (line.startsWith('|')) {
        // skip table lines (simplified)
      } else {
        // Process inline bold
        const parts = line.split(/(\*\*[^*]+\*\*)/);
        const rendered = parts.map((part, i) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={i}>{part.slice(2, -2)}</strong>
            : part
        );
        elements.push(
          <p key={key++} className="text-sm text-gray-700 leading-relaxed mb-1">{rendered}</p>
        );
      }
    });

    return elements;
  };

  return (
    <div>
      <Header title="" showBack />

      <div className="px-4 py-4 pb-8">
        <Badge color={categoryColor(article.category)}>
          {categoryLabel(article.category)}
        </Badge>

        <h1 className="text-xl font-bold text-gray-900 mt-3 leading-tight">{article.title}</h1>

        <div className="flex items-center gap-4 mt-2 mb-5">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} />
            <span>{article.readTime} мин чтения</span>
          </div>
          <span className="text-xs text-gray-400">{article.createdAt}</span>
        </div>

        <div className="prose prose-sm max-w-none">
          {renderContent(article.content)}
        </div>
      </div>
    </div>
  );
}
