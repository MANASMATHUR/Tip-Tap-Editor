'use client';

import dynamic from 'next/dynamic';

const PremiumEditor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-50 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">OpenSphere Editorial</h2>
          <p className="text-slate-500 text-sm font-medium animate-pulse">Preparing your workspace...</p>
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main>
      <PremiumEditor />
    </main>
  );
}
