import React from 'react';
import { Menu, Heart, ListMusic, MoreVertical, Maximize2, Info, Volume2, VolumeX, Smartphone, Download } from 'lucide-react';
import { RotaryKnob } from './RotaryKnob';
import { EsdyLogo } from './EsdyLogo';
import { SoundFXState } from '../types';

interface TopDeckBarProps {
  soundFX: SoundFXState;
  onSoundFXChange: (fx: Partial<SoundFXState>) => void;
  onOpenDrawer: () => void;
  onOpenPlaylist: () => void;
  onOpenInfo: () => void;
  onOpenInstall?: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const TopDeckBar: React.FC<TopDeckBarProps> = ({
  soundFX,
  onSoundFXChange,
  onOpenDrawer,
  onOpenPlaylist,
  onOpenInfo,
  onOpenInstall,
  isFavorite,
  onToggleFavorite
}) => {
  const toggleMute = () => {
    if (soundFX.volume > 0) {
      onSoundFXChange({ volume: 0 });
    } else {
      onSoundFXChange({ volume: 80 });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 rounded-t-xl shadow-md">
        {/* Drawer Menu Button */}
        <button
          onClick={onOpenDrawer}
          title="Open Drawer Menu"
          className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 shadow active:scale-95 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title & Subtitle Branding */}
        <div className="flex items-center gap-2">
          <EsdyLogo size={28} />
          <div className="flex flex-col items-start sm:items-center">
            <h1 className="font-retro-header text-sm sm:text-base font-bold tracking-wider text-zinc-100 uppercase">
              ESDY PLAYER
            </h1>
            <span className="text-[9px] sm:text-[10px] text-zinc-400 font-tech uppercase tracking-widest">
              Retro Cassette Deck MK-IV
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {onOpenInstall && (
            <button
              onClick={onOpenInstall}
              title="Install App on Phone / Download APK"
              className="px-2 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-tech font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 border border-blue-400/50 shadow active:scale-95 transition-all"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>APK</span>
            </button>
          )}

          <button
            onClick={onToggleFavorite}
            title="Add to Favorites"
            className={`p-2 rounded-lg border shadow active:scale-95 transition-all ${
              isFavorite
                ? 'bg-red-950/80 text-red-500 border-red-500/60'
                : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border-zinc-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
          </button>

          <button
            onClick={onOpenPlaylist}
            title="Open Playlist"
            className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 shadow active:scale-95 transition-all"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenInfo}
            title="Settings & Deck Options"
            className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 shadow active:scale-95 transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-bar: Fullscreen / Info / Volume Slider / Bass / Treble / Balance Knobs */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-zinc-900/60 border border-zinc-800/80 rounded-lg shadow-inner">
        {/* Fullscreen & Info Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700 shadow-sm"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenInfo}
            title="About Deck & Audio Engine"
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700 shadow-sm"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Volume Scrubber with Glowing Red Knob */}
        <div className="flex-1 min-w-[140px] flex items-center gap-2 px-2">
          <div className="flex-1 relative flex flex-col items-center">
            <span className="text-[8px] font-tech text-zinc-400 uppercase tracking-wider mb-0.5">
              VOLUME
            </span>
            <div className="w-full relative flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={soundFX.volume}
                onChange={(e) => onSoundFXChange({ volume: Number(e.target.value) })}
                className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer border border-zinc-700/80 relative z-10 accent-red-600"
              />
              {/* Glowing Red Track Fill */}
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-red-800 to-red-500 rounded-l shadow-[0_0_8px_rgba(239,68,68,0.8)] pointer-events-none"
                style={{ width: `${soundFX.volume}%` }}
              />
            </div>
          </div>

          <button
            onClick={toggleMute}
            className="p-1 text-zinc-400 hover:text-zinc-200"
          >
            {soundFX.volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-zinc-300" />
            )}
          </button>
        </div>

        {/* Rotary Knobs: Bass, Treble, Balance (Right Side) */}
        <div className="flex items-center gap-3">
          <RotaryKnob
            size="sm"
            label="BASS"
            min={0}
            max={10}
            value={soundFX.bassBoostLevel}
            onChange={(val) => onSoundFXChange({ bassBoostLevel: val, bassBoostEnabled: true })}
          />

          <RotaryKnob
            size="sm"
            label="TREBLE"
            min={-10}
            max={10}
            value={soundFX.trebleLevel}
            onChange={(val) => onSoundFXChange({ trebleLevel: val })}
          />

          <RotaryKnob
            size="sm"
            label="BALANCE"
            min={-10}
            max={10}
            value={soundFX.balance}
            onChange={(val) => onSoundFXChange({ balance: val })}
          />
        </div>
      </div>
    </div>
  );
};
