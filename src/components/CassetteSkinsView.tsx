import React, { useState } from 'react';
import { Disc, Sparkles, CheckCircle2, Download, Palette, PenTool } from 'lucide-react';
import { CassetteSkinId, Translations, Track } from '../types';
import { CassetteDeck } from './CassetteDeck';

interface CassetteSkinsViewProps {
  currentSkin: CassetteSkinId;
  currentTrack: Track | null;
  isPlaying: boolean;
  t: Translations;
  onSelectSkin: (skinId: CassetteSkinId) => void;
  customTapeTitle: string;
  onChangeCustomTapeTitle: (title: string) => void;
}

interface SkinOption {
  id: CassetteSkinId;
  name: string;
  tamilName: string;
  decade: string;
  badge: string;
  colorClass: string;
  iconBg: string;
}

const skinsList: SkinOption[] = [
  {
    id: 'raks-chrome',
    name: '1980s RAKS Super Chrome',
    tamilName: '1980களின் குரோம் கேசட்',
    decade: '1980s',
    badge: 'CrO2 Type II',
    colorClass: 'text-amber-400',
    iconBg: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'studio52-reel',
    name: 'Studio 52 Reel-to-Reel',
    tamilName: 'ஸ்டுடியோ 52 ரீல் கேசட்',
    decade: 'Studio Edition',
    badge: 'Open Spool',
    colorClass: 'text-zinc-200',
    iconBg: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'type4-metal',
    name: 'Type IV Pure Metal Master',
    tamilName: 'மெட்டல் வகை IV கேசட்',
    decade: '1990s Audiophile',
    badge: '70μs EQ',
    colorClass: 'text-orange-400',
    iconBg: 'from-purple-600 to-pink-700'
  },
  {
    id: '70s-gold',
    name: '1970s Golden Vintage Deck',
    tamilName: '1970களின் கோல்டன் கேசட்',
    decade: '1970s Classic',
    badge: 'Ferro-Extra',
    colorClass: 'text-amber-500',
    iconBg: 'from-orange-600 to-amber-700'
  },
  {
    id: '80s-transparent',
    name: '1980s Clear Smoke Acrylic',
    tamilName: 'தெளிவான அக்ரிலிக் கேசட்',
    decade: '1980s Boombox',
    badge: 'High Output',
    colorClass: 'text-cyan-400',
    iconBg: 'from-emerald-600 to-teal-700'
  },
  {
    id: '90s-neon',
    name: '1990s Neon Cyber Synth',
    tamilName: '90களின் நியான் சைபர் கேசட்',
    decade: '1990s Vaporwave',
    badge: 'Chrome Extra',
    colorClass: 'text-fuchsia-400',
    iconBg: 'from-fuchsia-600 to-rose-600'
  }
];

export const CassetteSkinsView: React.FC<CassetteSkinsViewProps> = ({
  currentSkin,
  currentTrack,
  isPlaying,
  t,
  onSelectSkin,
  customTapeTitle,
  onChangeCustomTapeTitle
}) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'expansions'>('standard');
  const [downloadedSkins, setDownloadedSkins] = useState<string[]>(['raks-chrome', 'studio52-reel', 'type4-metal']);

  const handleDownloadSkin = (skinId: string) => {
    if (!downloadedSkins.includes(skinId)) {
      setDownloadedSkins([...downloadedSkins, skinId]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4 pb-20 select-none px-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-zinc-900/90 border-b border-zinc-800 rounded-t-xl shadow-md">
        <div className="flex items-center gap-2">
          <Disc className="w-5 h-5 text-red-500" />
          <h2 className="font-retro-header text-lg font-bold text-zinc-100 uppercase tracking-wider">
            {t.cassettes}
          </h2>
        </div>

        <span className="text-xs font-tech text-zinc-400">
          Skin Gallery & DIY
        </span>
      </div>

      {/* Live Cassette Preview */}
      <div className="w-full bg-zinc-950 p-2 sm:p-3 rounded-xl border border-zinc-800 shadow-inner flex flex-col gap-2">
        <span className="text-[11px] font-tech font-bold uppercase tracking-wider text-zinc-400 px-1">
          Active Deck Preview:
        </span>
        <CassetteDeck
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          progress={0.35}
          skinId={currentSkin}
          tapeSide="A"
          dolbyNR={true}
          customLabel={customTapeTitle}
        />
      </div>

      {/* DIY Cassette Label Customizer */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2 shadow">
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-200">
            Write on Cassette Label (Handwritten Marker)
          </span>
        </div>
        <input
          type="text"
          value={customTapeTitle}
          onChange={(e) => onChangeCustomTapeTitle(e.target.value)}
          placeholder="e.g. My Mixtape '84 - Ilaiyaraaja Hits"
          className="w-full bg-zinc-950 text-zinc-100 font-handwriting text-lg border border-zinc-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Top Banner (Screenshot 5) */}
      <div className="text-center py-2 px-3 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 border border-zinc-800 rounded-xl">
        <p className="text-xs sm:text-sm font-tech font-bold text-zinc-300">
          {t.moreCassettesHeading}
        </p>
      </div>

      {/* Tab Switcher: Standard vs Expansion Packs (Screenshot 5 bottom tabs) */}
      <div className="flex items-center justify-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
        <button
          onClick={() => setActiveTab('standard')}
          className={`flex-1 py-2 rounded-lg text-xs font-tech font-bold uppercase tracking-wider transition-all ${
            activeTab === 'standard'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {t.standardPacks}
        </button>

        <button
          onClick={() => setActiveTab('expansions')}
          className={`flex-1 py-2 rounded-lg text-xs font-tech font-bold uppercase tracking-wider transition-all ${
            activeTab === 'expansions'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {t.expansionPacks}
        </button>
      </div>

      {/* Grid of Cassette Packs (Screenshot 5 icon grid style) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {skinsList.map((skin) => {
          const isSelected = currentSkin === skin.id;
          const isDownloaded = downloadedSkins.includes(skin.id);

          return (
            <div
              key={skin.id}
              onClick={() => {
                if (isDownloaded) {
                  onSelectSkin(skin.id);
                } else {
                  handleDownloadSkin(skin.id);
                  onSelectSkin(skin.id);
                }
              }}
              className={`relative rounded-xl p-3 border transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                isSelected
                  ? 'bg-zinc-900 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] ring-1 ring-red-500/50'
                  : 'bg-zinc-900/70 hover:bg-zinc-850 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Retro Pack Icon with gradient badge */}
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${skin.iconBg} flex items-center justify-center shadow-lg border border-white/20 relative group`}>
                <Disc className="w-8 h-8 text-white animate-[spin_8s_linear_infinite]" />
                <span className="absolute bottom-1 font-tech font-bold text-[8px] text-white bg-black/60 px-1 rounded">
                  {skin.decade}
                </span>
              </div>

              {/* Title & Badge */}
              <div className="flex flex-col items-center">
                <h4 className="text-xs font-bold text-zinc-200 font-tech leading-tight">
                  {skin.name}
                </h4>
                <span className="text-[10px] text-zinc-400 font-tech mt-0.5">
                  {skin.tamilName}
                </span>
                <span className="text-[9px] text-amber-400 font-digital mt-1">
                  {skin.badge}
                </span>
              </div>

              {/* Active or Download status */}
              {isSelected ? (
                <div className="flex items-center gap-1 text-[10px] font-tech font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                  <CheckCircle2 className="w-3 h-3" />
                  EQUIPPED
                </div>
              ) : isDownloaded ? (
                <span className="text-[10px] font-tech text-zinc-400">
                  Ready to Load
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadSkin(skin.id);
                  }}
                  className="flex items-center gap-1 text-[10px] font-tech font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 hover:bg-cyan-900"
                >
                  <Download className="w-3 h-3" />
                  Install Pack
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
