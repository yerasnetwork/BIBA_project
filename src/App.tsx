import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

import Splash from '@/pages/auth/Splash';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import { AppShell } from '@/components/layout/AppShell';
import Home from '@/pages/dashboard/Home';
import Monitor from '@/pages/monitor/Monitor';
import Mood from '@/pages/mood/Mood';
import Articles from '@/pages/articles/Articles';
import ArticleDetail from '@/pages/articles/ArticleDetail';
import Forum from '@/pages/forum/Forum';
import PostDetail from '@/pages/forum/PostDetail';
import CreatePost from '@/pages/forum/CreatePost';
import Courses from '@/pages/courses/Courses';
import Legal from '@/pages/legal/Legal';
import Profile from '@/pages/profile/Profile';
import AdminDashboard from '@/pages/admin/AdminDashboard';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.email !== 'admin@lullabea.kz') return <Navigate to="/home" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex items-start justify-center">
        <div className="w-full max-w-[430px] min-h-screen bg-white shadow-2xl relative overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/admin" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />

            <Route element={
              <ProtectedRoute><AppShell /></ProtectedRoute>
            }>
              <Route path="/home" element={<Home />} />
              <Route path="/monitor" element={<Monitor />} />
              <Route path="/mood" element={<Mood />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/create" element={<CreatePost />} />
              <Route path="/forum/:id" element={<PostDetail />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
