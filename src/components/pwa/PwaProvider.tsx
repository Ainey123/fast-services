'use client';

import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export const PwaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Register service worker if supported
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Service worker registration failed:', err);
        });
      });
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {children}
      {showInstallBanner && (
        <div className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-auto md:right-6 max-w-sm z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
          <div className="flex-1">
            <div className="text-xs font-bold text-amber-400">Install Fast Services App</div>
            <div className="text-xs text-slate-300">Add to your home screen for quick offline access</div>
          </div>
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={() => setShowInstallBanner(false)}
            className="text-slate-400 hover:text-white p-1"
            aria-label="Close install prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};
