'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  X,
  Share,
  PlusSquare,
  Smartphone,
  CheckCircle2,
  Zap,
  MapPin,
  ShieldCheck,
  Globe,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
  onInstallAccepted?: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallAccepted,
}) => {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('android');
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already installed & running in standalone mode
    const isApp =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isApp);

    // Detect user platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          if (onInstallAccepted) onInstallAccepted();
          onClose();
        }
      } catch (err) {
        console.error('PWA install prompt error:', err);
      } finally {
        setIsInstalling(false);
      }
    } else if (platform === 'android') {
      alert(
        'To install on Android:\n1. Tap the three dots menu (⋮) in your browser (top right).\n2. Select "Install app" or "Add to Home screen".'
      );
    } else if (platform === 'desktop') {
      alert(
        'To install on Desktop:\n1. Look for the Install icon (⊕ or computer with arrow) in your browser address bar.\n2. Click "Install".'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Logo & Badges */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-xl shadow-blue-600/30 flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center p-1">
              <span className="text-blue-500 font-black text-sm tracking-tighter">FAST</span>
              <span className="text-[8px] font-bold text-amber-400 tracking-wider">SERVICES</span>
            </div>
          </div>

          <div className="space-y-1 pr-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Official Mobile App (PWA)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Install Fast Services App
            </h2>
            <p className="text-xs text-slate-400">
              FAST ENGINEERING SOLUTIONS — Pakistan
            </p>
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setPlatform('android')}
            className={`py-2 px-3 rounded-xl transition-all ${
              platform === 'android'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Android
          </button>
          <button
            onClick={() => setPlatform('ios')}
            className={`py-2 px-3 rounded-xl transition-all ${
              platform === 'ios'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            iPhone / iPad
          </button>
          <button
            onClick={() => setPlatform('desktop')}
            className={`py-2 px-3 rounded-xl transition-all ${
              platform === 'desktop'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Desktop PC
          </button>
        </div>

        {/* Already Installed Alert */}
        {isStandalone && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>You are already using the standalone Fast Services Mobile App!</span>
          </div>
        )}

        {/* Platform Specific Instructions */}
        {platform === 'ios' && (
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3.5">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              <span>How to Install on iOS Safari (3 Quick Steps):</span>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Tap the <strong className="text-white">Share</strong> button{' '}
                  <Share className="w-3.5 h-3.5 inline text-blue-400 mx-0.5 -mt-0.5" /> at the
                  bottom of Safari.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Scroll down the menu and tap{' '}
                  <strong className="text-white">&ldquo;Add to Home Screen&rdquo;</strong>{' '}
                  <PlusSquare className="w-3.5 h-3.5 inline text-amber-400 mx-0.5 -mt-0.5" />.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Tap <strong className="text-white">&ldquo;Add&rdquo;</strong> in the top right
                  corner. The app icon will appear on your home screen!
                </span>
              </li>
            </ol>
          </div>
        )}

        {platform === 'android' && (
          <div className="space-y-4">
            {deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                <span>{isInstalling ? 'Installing App...' : '1-Tap Direct Install on Mobile'}</span>
              </button>
            ) : (
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>Android Installation:</span>
                </div>
                <p>
                  1. Tap the <strong className="text-white">three dots menu (⋮)</strong> at the top right of Chrome/browser.
                </p>
                <p>
                  2. Select <strong className="text-white">&ldquo;Install app&rdquo;</strong> or{' '}
                  <strong className="text-white">&ldquo;Add to Home screen&rdquo;</strong>.
                </p>
                <button
                  onClick={handleInstallClick}
                  className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Open Browser Install Prompt</span>
                </button>
              </div>
            )}
          </div>
        )}

        {platform === 'desktop' && (
          <div className="space-y-4">
            {deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02]"
              >
                <Download className="w-5 h-5" />
                <span>{isInstalling ? 'Installing...' : 'Install Fast Services on PC'}</span>
              </button>
            ) : (
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  <span>Desktop Chrome / Edge / Windows / Mac:</span>
                </div>
                <p>
                  Look at your browser address bar on the right side. Click the{' '}
                  <strong className="text-white">Install App</strong> icon (⊕) or open the browser menu and click{' '}
                  <strong className="text-white">&ldquo;Install Fast Services&rdquo;</strong>.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Why Install Mobile App Features */}
        <div className="space-y-2.5 border-t border-slate-800 pt-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Why Install Fast Services App:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-slate-200">Instant offline loading</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-slate-200">1-Tap GPS Site Booking</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-200">Real-time status tracking</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-slate-200">No App Store download needed</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <a
            href="/download"
            onClick={onClose}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View Full App Download Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
