'use client';

import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { InstallModal } from './InstallModal';

export const PwaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Register service worker if supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('PWA Service Worker registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('PWA Service worker registration failed:', err);
          });
      });
    }

    // Check if running in standalone app mode
    if (typeof window !== 'undefined') {
      const isApp =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isApp);

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        // If not already dismissed in this session and not in standalone mode
        if (!isApp && !sessionStorage.getItem('fs_pwa_banner_dismissed')) {
          setShowInstallBanner(true);
        }
      };

      const handleOpenModal = () => {
        setIsModalOpen(true);
      };

      // Auto-recovery for Next.js ChunkLoadError when a new version deploys
      const handleChunkError = (event: ErrorEvent | PromiseRejectionEvent) => {
        const errorMsg = (event as any)?.message || (event as any)?.reason?.message || '';
        if (
          errorMsg.includes('Loading chunk') ||
          errorMsg.includes('ChunkLoadError') ||
          errorMsg.includes('Failed to fetch dynamically imported module')
        ) {
          console.warn('Recovering from stale chunk cache after new deployment...');
          const hasReloaded = sessionStorage.getItem('fs_chunk_reload');
          if (!hasReloaded) {
            sessionStorage.setItem('fs_chunk_reload', 'true');
            window.location.reload();
          }
        }
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('open-install-modal', handleOpenModal);
      window.addEventListener('error', handleChunkError);
      window.addEventListener('unhandledrejection', handleChunkError);

      const timer = setTimeout(() => {
        sessionStorage.removeItem('fs_chunk_reload');
      }, 5000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('open-install-modal', handleOpenModal);
        window.removeEventListener('error', handleChunkError);
        window.removeEventListener('unhandledrejection', handleChunkError);
      };
    }
  }, []);

  const handleDismissBanner = () => {
    setShowInstallBanner(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fs_pwa_banner_dismissed', 'true');
    }
  };

  const handleBannerInstallClick = () => {
    setIsModalOpen(true);
    setShowInstallBanner(false);
  };

  return (
    <>
      {children}

      {/* Global Interactive Install & Download Guide Modal */}
      <InstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstallAccepted={() => {
          setShowInstallBanner(false);
          setDeferredPrompt(null);
        }}
      />

      {/* Non-intrusive Floating Mobile & Desktop Install Prompt */}
      {showInstallBanner && !isStandalone && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 max-w-sm z-50 bg-slate-950/95 text-white p-4 rounded-3xl shadow-2xl border border-blue-500/40 backdrop-blur-md flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400">
            <Smartphone className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-black text-white flex items-center gap-1">
              <span>Fast Services Mobile App</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-[11px] text-slate-300 truncate">
              Install for instant offline & 1-tap booking
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleBannerInstallClick}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-blue-600/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismissBanner}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
              aria-label="Close install prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
