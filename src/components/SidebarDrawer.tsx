import React from 'react';
import { 
  X, 
  Disc, 
  ListMusic, 
  Sliders, 
  Activity, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Radio, 
  ShieldCheck, 
  Sparkles,
  Volume2,
  Smartphone,
  Download
} from 'lucide-react';
import { TabType, Translations, Track } from '../types';
import { EsdyLogo } from './EsdyLogo';

interface SidebarDrawerProps {
  isOpen: boolean;
  activeTab: TabType;
  currentTrack: Track | null;
  isPlaying: boolean;
  t: Translations;
  onClose: () => void;
  onSelectTab: (tab: TabType) => void;
  onOpenInstall?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  activeTab,
  currentTrack,
  isPlaying,
  t,
  onClose,
  onSelectTab,
  onOpenInstall
}) => {
  if (!isOpen) return null;

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'player', label: t.player, icon: Disc },
    { id: 'playlist', label: t.playlist, icon: ListMusic },
    { id: 'equalizer', label: t.bassBoost, icon: Sliders },
    { id: 'vumeters', label: t.vumeters, icon: Activity },
    { id: 'cassettes', label: t.cassettes, icon: Radio },
    { id: 'analytics', label: t.analytics, icon: BarChart3 },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
      {/* Drawer Container */}
      <div className="w-72 sm:w-80 h-full bg-zinc-950 border-r border-zinc-800 shadow-2xl flex flex-col justify-between p-4 animate-in slide-in-from-left duration-200">
        <div className="flex flex-col gap-4">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2.5">
              <EsdyLogo size={36} />
              <div>
                <h3 className="font-retro-header text-base font-bold text-zinc-100 tracking-wider">
                  ESDY PLAYER
                </h3>
                <span className="text-[10px] text-zinc-400 font-tech uppercase tracking-wider">
                  Studio Deck MK-IV
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isSelected = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-tech font-bold uppercase tracking-wider transition-all text-left ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Direct APK / Install Option */}
            {onOpenInstall && (
              <button
                onClick={() => {
                  onOpenInstall();
                  onClose();
                }}
                className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-tech font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/50 hover:to-indigo-600/50 text-blue-300 border border-blue-500/40 transition-all text-left shadow-sm"
              >
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>Install App / Get APK</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Active Deck Status Pill */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-tech text-zinc-400 uppercase font-semibold">
              Now Loaded in Deck:
            </span>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
              <span className="text-[9px] font-tech text-zinc-400">{isPlaying ? 'PLAYING' : 'STOP'}</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-zinc-200 truncate">
            {currentTrack?.title || 'No Tape Inserted'}
          </span>
          <span className="text-[10px] text-red-400 truncate">
            {currentTrack?.artist || 'Standby'}
          </span>
        </div>
      </div>

      {/* Outside Click Area */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
