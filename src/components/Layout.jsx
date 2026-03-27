import React from 'react';
import Sidebar from './Sidebar';
import FloatingChatbot from './FloatingChatbot';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#1A0F0A] via-[#2D1B10] to-[#1A0F0A]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
      <FloatingChatbot />
    </div>
  );
}
