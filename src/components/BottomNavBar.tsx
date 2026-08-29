import React from 'react';
import { 
  Disc, 
  ListMusic, 
  Sliders, 
  Activity, 
  Radio, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import { TabType, Translations } from '../types';

interface BottomNavBarProps {
  activeTab: TabType;
  t: Translations;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  t,
  onSelectTab
}) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'player', label: t.player, icon: Disc },
    { id: 'playlist', label: t.playlist, icon: ListMusic },
    { id: 'equalizer', label: t.bassBoost, icon: Sliders },
    { id: 'vumeters', label: t.vumeters, icon: Activity },
    { id: 'cassettes', label: t.cassettes, icon: Radio },
    { id: 'analytics', label: t.analytics, icon: BarChart3 },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.8)] select-none">
      <div className="max-w-xl mx-auto flex items-center justify-around px-1 py-1.5 sm:py-2">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-lg transition-all ${
                isSelected
                  ? 'text-red-500 scale-105 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className={`p-1 rounded-full transition-all ${
                isSelected ? 'bg-red-950/80 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : ''
              }`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-tech uppercase tracking-tighter truncate max-w-[54px] mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
