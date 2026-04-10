import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { useChatStore } from '@/store/useChatStore';
import { MessageCircle } from 'lucide-react';
import { useBabyStore } from '@/store/useBabyStore';
import { AlertModal } from '@/components/monitor/AlertModal';

export function AppShell() {
  const { setOpen, isOpen } = useChatStore();
  const { showDangerModal, setShowDangerModal, dangerVitals } = useBabyStore();

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-20 animate-fade-in">
        <Outlet />
      </main>

      <BottomNav />

      {/* Floating AI Chat Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 w-13 h-13 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center"
        style={{ width: 52, height: 52 }}
        aria-label="ИИ-ассистент"
      >
        <MessageCircle size={22} />
      </button>

      <ChatPanel isOpen={isOpen} onClose={() => setOpen(false)} />

      {showDangerModal && dangerVitals && (
        <AlertModal
          vitals={dangerVitals}
          onClose={() => setShowDangerModal(false)}
        />
      )}
    </div>
  );
}
