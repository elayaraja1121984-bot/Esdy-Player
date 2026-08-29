import React, { useState, useEffect } from 'react';
import { X, Smartphone, Download, ExternalLink, Copy, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { EsdyLogo } from './EsdyLogo';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    setAppUrl(window.location.href);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        onClose();
      }
    } else {
      // Guide the user
      alert('To install on Android:\n1. Tap the 3 dots (⋮) in Chrome menu\n2. Tap "Install App" or "Add to Home screen"');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl || window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const pwaBuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(appUrl || window.location.href)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-zinc-900 border-2 border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <EsdyLogo size={28} />
            <div>
              <h3 className="font-retro-header text-sm sm:text-base font-bold text-zinc-100 uppercase tracking-wider">
                Install ESDY Player / APK
              </h3>
              <span className="text-[10px] text-zinc-400 font-tech">Android & Mobile Setup</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex flex-col gap-4 text-xs text-zinc-200">
          
          {/* Method 1: Instant 1-Tap Mobile Install */}
          <div className="bg-gradient-to-br from-blue-950/60 via-zinc-950 to-zinc-900 border border-blue-500/40 rounded-xl p-3.5 flex flex-col gap-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-tech font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                <Smartphone className="w-4 h-4 text-blue-400" />
                Method 1: Direct Android Install (PWA)
              </span>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/40 rounded-full text-[9px] font-tech font-bold">
                Fastest
              </span>
            </div>

            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Install <strong>ESDY Player</strong> straight to your Android phone home screen with full offline access and native player window.
            </p>

            <button
              onClick={handleInstallClick}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              {deferredPrompt ? 'Tap to Install Now' : 'Install on Android Phone'}
            </button>
          </div>

          {/* Method 2: Convert to Standalone .APK File */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-tech font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                <Download className="w-4 h-4 text-red-400" />
                Method 2: Generate .APK Package
              </span>
              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full text-[9px] font-tech">
                PWABuilder
              </span>
            </div>

            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Want a downloadable <code className="text-red-300 bg-red-950/60 px-1 py-0.5 rounded">.apk</code> installer file? You can generate signed APK packages using PWABuilder:
            </p>

            <a
              href={pwaBuilderUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-zinc-700 shadow"
            >
              <ExternalLink className="w-4 h-4 text-red-400" />
              Build .APK File on PWABuilder
            </a>
          </div>

          {/* Quick Steps for Android Chrome */}
          <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-1.5 font-tech text-[11px]">
            <span className="text-zinc-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              How to install in 3 steps on your phone:
            </span>
            <div className="flex items-start gap-2 text-zinc-400">
              <span className="w-4 h-4 rounded-full bg-zinc-800 text-zinc-200 flex items-center justify-center text-[9px] shrink-0 font-bold">1</span>
              <span>Open this link in <strong>Google Chrome</strong> on your phone.</span>
            </div>
            <div className="flex items-start gap-2 text-zinc-400">
              <span className="w-4 h-4 rounded-full bg-zinc-800 text-zinc-200 flex items-center justify-center text-[9px] shrink-0 font-bold">2</span>
              <span>Tap the <strong>3 vertical dots (⋮)</strong> in Chrome menu.</span>
            </div>
            <div className="flex items-start gap-2 text-zinc-400">
              <span className="w-4 h-4 rounded-full bg-zinc-800 text-zinc-200 flex items-center justify-center text-[9px] shrink-0 font-bold">3</span>
              <span>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.</span>
            </div>
          </div>

          {/* Copy Link */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-tech font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-zinc-700"
            >
              {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {isCopied ? 'Link Copied!' : 'Copy App Link'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-tech font-bold uppercase tracking-wider"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
