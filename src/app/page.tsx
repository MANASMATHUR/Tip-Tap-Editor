'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { FileText } from 'lucide-react';

const EditorLoading = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
            <FileText size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800">OpenSphere</span>
        </div>

        {/* Loader */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-gray-500 text-sm">Loading editor...</span>
        </div>
      </div>
    </div>
  );
};

const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
  loading: () => <EditorLoading />,
});

export default function Home() {
  return (
    <main>
      <Editor />
    </main>
  );
}
