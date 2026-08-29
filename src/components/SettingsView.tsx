import React from 'react';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Globe, 
  Volume2, 
  HardDrive, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  HelpCircle, 
  RotateCcw,
  Palette,
  Smartphone,
  Download
} from 'lucide-react';
import { ThemeId, LanguageId, Translations } from '../types';
import { translations } from '../utils/i18n';
import { EsdyLogo } from './EsdyLogo';

interface SettingsViewProps {
  currentTheme: ThemeId;
  currentLanguage: LanguageId;
  isDarkMode: boolean;
  mechanicalSounds: boolean;
  autoTapeFlip: boolean;
  hiResAudio: boolean;
  t: Translations;
  onSelectTheme: (theme: ThemeId) => void;
  onSelectLanguage: (lang: LanguageId) => void;
  onToggleDarkMode: () => void;
  onToggleMechanicalSounds: () => void;
  onToggleAutoTapeFlip: () => void;
  onToggleHiResAudio: () => void;
  onClearCache: () => void;
  onResetSettings: () => void;
  onOpenInstall?: () => void;
}

interface ThemeOption {
  id: ThemeId;
  name: string;
  desc: string;
  previewClass: string;
  borderClass: string;
}

const themeOptions: ThemeOption[] = [
  {
    id: 'dark-titanium',
    name: 'Dark Titanium',
    desc: 'Brushed dark steel alloy chassis',
    previewClass: 'from-zinc-800 to-zinc-950',
    borderClass: 'border-zinc-700'
  },
  {
    id: 'brushed-silver',
    name: 'Brushed Silver',
    desc: '1970s Hi-Fi aluminum faceplate',
    previewClass: 'from-slate-300 to-slate-500',
    borderClass: 'border-slate-400'
  },
  {
    id: 'deep-onyx',
    name: 'Deep Onyx',
    desc: 'Pitch black stealth matte finish',
    previewClass: 'from-zinc-950 to-black',
    borderClass: 'border-zinc-800'
  },
  {
    id: 'vintage-wood',
    name: 'Vintage Rosewood',
    desc: 'Audiophile walnut wood cabinet',
    previewClass: 'from-amber-900 to-stone-950',
    borderClass: 'border-amber-700'
  },
  {
    id: 'champagne-gold',
    name: 'Champagne Gold',
    desc: 'High-end Marantz luxury gold',
    previewClass: 'from-amber-600 via-amber-800 to-stone-900',
    borderClass: 'border-amber-500'
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon 1984',
    desc: 'Synthwave magenta & cyan glow',
    previewClass: 'from-fuchsia-950 via-purple-950 to-cyan-950',
    borderClass: 'border-fuchsia-600'
  }
];

const languageList: { id: LanguageId; name: string; nativeName: string }[] = [
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { id: 'en', name: 'English', nativeName: 'English' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { id: 'es', name: 'Spanish', nativeName: 'Español' },
  { id: 'fr', name: 'French', nativeName: 'Français' },
  { id: 'ja', name: 'Japanese', nativeName: '日本語' },
  { id: 'de', name: 'German', nativeName: 'Deutsch' }
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentTheme,
  currentLanguage,
  isDarkMode,
  mechanicalSounds,
  autoTapeFlip,
  hiResAudio,
  t,
  onSelectTheme,
  onSelectLanguage,
  onToggleDarkMode,
  onToggleMechanicalSounds,
  onToggleAutoTapeFlip,
  onToggleHiResAudio,
  onClearCache,
  onResetSettings,
  onOpenInstall
}) => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4 pb-20 select-none px-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-zinc-900/90 border-b border-zinc-800 rounded-t-xl shadow-md">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-red-500" />
          <h2 className="font-retro-header text-lg font-bold text-zinc-100 uppercase tracking-wider">
            {t.settings}
          </h2>
        </div>
        <span className="text-xs font-tech text-zinc-400">
          Preferences & Audio Engine
        </span>
      </div>

      {/* Theme Selection Section (Screenshot 7) */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 sm:p-4 flex flex-col gap-3 shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-red-500" />
            {t.themeOptions}
          </span>
          <span className="text-[11px] text-zinc-400 font-tech">Chassis Finishes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {themeOptions.map((th) => {
            const isSelected = currentTheme === th.id;

            return (
              <button
                key={th.id}
                onClick={() => onSelectTheme(th.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 relative overflow-hidden ${
                  isSelected
                    ? 'bg-zinc-800 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)] ring-1 ring-red-500'
                    : 'bg-zinc-950/80 hover:bg-zinc-850 border-zinc-800'
                }`}
              >
                {/* Visual Color Swatch */}
                <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${th.previewClass} border ${th.borderClass} shadow-inner flex items-center justify-end px-2`}>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,1)]" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-zinc-200 font-tech leading-tight">
                    {th.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">
                    {th.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Selector */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col gap-3 shadow">
        <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-cyan-400" />
          {t.languageOptions}
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {languageList.map((lang) => {
            const isSelected = currentLanguage === lang.id;

            return (
              <button
                key={lang.id}
                onClick={() => onSelectLanguage(lang.id)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)] font-bold'
                    : 'bg-zinc-950 text-zinc-300 hover:text-white border-zinc-800'
                }`}
              >
                <span className="text-xs font-semibold block">{lang.nativeName}</span>
                <span className="text-[9px] opacity-70 block">{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio Engine & Mechanical Settings */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col gap-3 shadow">
        <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-amber-400" />
          Mechanical Audio & Engine
        </span>

        {/* Mechanical Click Sounds */}
        <div className="flex items-center justify-between py-1 border-b border-zinc-800">
          <div>
            <span className="text-xs font-semibold text-zinc-200">Mechanical Click & Solenoid SFX</span>
            <p className="text-[10px] text-zinc-400">Authentic tape head engage & button relay clicks</p>
          </div>
          <button
            onClick={onToggleMechanicalSounds}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors flex items-center border ${
              mechanicalSounds ? 'bg-red-600 border-red-400 justify-end' : 'bg-zinc-800 border-zinc-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Auto Tape Flip (Side A -> Side B) */}
        <div className="flex items-center justify-between py-1 border-b border-zinc-800">
          <div>
            <span className="text-xs font-semibold text-zinc-200">Auto Tape Reverse (Side A/B)</span>
            <p className="text-[10px] text-zinc-400">Automatically flips tape side when track reaches 100%</p>
          </div>
          <button
            onClick={onToggleAutoTapeFlip}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors flex items-center border ${
              autoTapeFlip ? 'bg-red-600 border-red-400 justify-end' : 'bg-zinc-800 border-zinc-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Hi-Res 24-Bit Audio Master Mode */}
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-xs font-semibold text-zinc-200">Hi-Res 24-Bit / 96kHz Decoding</span>
            <p className="text-[10px] text-zinc-400">Studio high-fidelity lossless streaming pipeline</p>
          </div>
          <button
            onClick={onToggleHiResAudio}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors flex items-center border ${
              hiResAudio ? 'bg-red-600 border-red-400 justify-end' : 'bg-zinc-800 border-zinc-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>
      </div>

      {/* Storage & Offline Cache Management */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2 shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            Offline Storage & Cache
          </span>
          <span className="text-[10px] font-digital text-zinc-400">48.2 MB / 512 MB</span>
        </div>

        <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }} />
        </div>

        <div className="flex justify-between items-center mt-1">
          <span className="text-[11px] text-zinc-400">5 tracks stored in offline cache</span>
          <button
            onClick={onClearCache}
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-red-400 text-xs font-tech font-bold uppercase rounded border border-zinc-700"
          >
            Clear Offline Cache
          </button>
        </div>
      </div>

      {/* ESDY Ecosystem Branding Banner & APK Installer */}
      <div className="bg-gradient-to-r from-blue-950/50 via-zinc-900 to-indigo-950/50 border border-blue-800/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow">
        <div className="flex items-center gap-3">
          <EsdyLogo size={44} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-tech font-bold text-sm text-zinc-100 uppercase tracking-wider">
                ESDY Smart Ecosystem
              </span>
              <span className="px-1.5 py-0.2 text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded font-tech">
                MK-IV
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Official universal brand design across all ESDY applications.
            </p>
          </div>
        </div>

        {onOpenInstall && (
          <button
            onClick={onOpenInstall}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow border border-blue-400/40"
          >
            <Smartphone className="w-4 h-4" />
            <span>Install / Get APK</span>
          </button>
        )}
      </div>

      {/* Reset all settings button */}
      <div className="flex justify-center mt-1">
        <button
          onClick={onResetSettings}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-xl text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All Deck Defaults
        </button>
      </div>
    </div>
  );
};
