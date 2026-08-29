import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Repeat, 
  Shuffle, 
  Heart, 
  Settings as SettingsIcon, 
  ListMusic 
} from 'lucide-react';
import { Track, SoundFXState, TapeType } from '../types';
import { equalizerPresets } from '../data/mockTracks';

interface TrackCardAndControlsProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isShuffle: boolean;
  repeatMode: 'all' | 'one' | 'off';
  soundFX: SoundFXState;
  onPlayPause: () => void;
  onStop: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleFavorite: () => void;
  onSoundFXChange: (fx: Partial<SoundFXState>) => void;
  onOpenSettings: () => void;
  onOpenPlaylist: () => void;
}

export const TrackCardAndControls: React.FC<TrackCardAndControlsProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  isShuffle,
  repeatMode,
  soundFX,
  onPlayPause,
  onStop,
  onPrev,
  onNext,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
  onToggleFavorite,
  onSoundFXChange,
  onOpenSettings,
  onOpenPlaylist
}) => {
  const formatTime = (secs: number) => {
    if (!Number.isFinite(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSliderSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const seekTime = (val / 100) * (duration || currentTrack?.duration || 260);
    onSeek(seekTime);
  };

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* Current Song Information Badge */}
      <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-xl p-3 shadow-lg flex items-center justify-between gap-3">
        {/* Cover Art Thumbnail */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-zinc-700 shadow-md flex-shrink-0 bg-zinc-950">
          <img
            src={currentTrack?.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80'}
            alt={currentTrack?.title}
            className={`w-full h-full object-cover ${isPlaying ? 'scale-105' : ''} transition-transform duration-500`}
            referrerPolicy="no-referrer"
          />
          {/* Vinyl Ring Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />
        </div>

        {/* Track Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span className="text-red-400 font-tech font-bold text-xs sm:text-sm tracking-wide truncate">
            {currentTrack?.artist || 'Unknown Artist'}
          </span>
          <h3 className="text-zinc-100 font-semibold text-sm sm:text-base leading-tight truncate">
            {currentTrack?.title || 'No Track Selected'}
          </h3>
          <span className="text-zinc-400 text-xs truncate mt-0.5">
            {currentTrack?.album || 'Retro Album'}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-tech text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700">
              {currentTrack?.year || 1984} • {currentTrack?.genre || 'Tamil • Melody'}
            </span>
            <span className="text-[10px] font-digital text-amber-400/90 hidden sm:inline">
              {currentTrack?.bitrate || '320 kbps'}
            </span>
          </div>
        </div>

        {/* Quick Shuffle, Repeat, Heart buttons */}
        <div className="flex flex-col items-center justify-between gap-1.5 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleRepeat}
              title={`Repeat: ${repeatMode}`}
              className={`p-1.5 rounded-md border shadow-sm active:scale-95 transition-all ${
                repeatMode !== 'off'
                  ? 'bg-red-950/80 text-red-400 border-red-500/60'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-700'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onToggleShuffle}
              title={`Shuffle: ${isShuffle ? 'ON' : 'OFF'}`}
              className={`p-1.5 rounded-md border shadow-sm active:scale-95 transition-all ${
                isShuffle
                  ? 'bg-red-950/80 text-red-400 border-red-500/60'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-700'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onToggleFavorite}
            title="Favorite Track"
            className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
          >
            <Heart className={`w-5 h-5 ${currentTrack?.isFavorite ? 'text-red-500 fill-red-500 glow-red' : 'text-zinc-500 hover:text-zinc-300'}`} />
          </button>
        </div>
      </div>

      {/* Scrubber Progress Bar */}
      <div className="flex flex-col gap-1 px-1">
        <div className="relative w-full flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={progressPercent || 0}
            onChange={handleSliderSeek}
            className="w-full h-2 bg-zinc-950 rounded-lg appearance-none cursor-pointer border border-zinc-800 relative z-10 accent-red-500"
          />
          {/* Glowing Red Progress Track Fill */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-red-700 to-red-500 rounded-l shadow-[0_0_8px_rgba(239,68,68,0.9)] pointer-events-none"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Timestamps */}
        <div className="flex justify-between items-center text-xs font-digital font-bold px-1">
          <span className="text-red-400">{formatTime(currentTime)}</span>
          <span className="text-zinc-400">{formatTime(duration || currentTrack?.duration || 263)}</span>
        </div>
      </div>

      {/* Main Transport Control Buttons (Screenshot 1 & 3 style) */}
      <div className="flex items-center justify-around py-2 px-1 bg-zinc-900/70 border border-zinc-800/80 rounded-xl shadow-inner">
        {/* Settings gear */}
        <button
          onClick={onOpenSettings}
          title="Audio Engine Settings"
          className="w-11 h-11 rounded-full bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:to-zinc-800 border-2 border-zinc-600/70 flex items-center justify-center text-zinc-300 hover:text-white shadow-lg active:scale-95 transition-transform"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>

        {/* Previous / Rewind (<<) */}
        <button
          onClick={onPrev}
          title="Previous Track"
          className="w-12 h-12 rounded-full bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:to-zinc-800 border-2 border-zinc-600 flex items-center justify-center text-zinc-200 hover:text-white shadow-lg active:scale-95 transition-transform"
        >
          <SkipBack className="w-6 h-6 fill-zinc-200" />
        </button>

        {/* Master Large Play / Pause Button (Beveled metallic button) */}
        <button
          onClick={onPlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-b from-zinc-600 via-zinc-800 to-black border-4 border-zinc-500/80 flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-transform relative group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 flex items-center justify-center border border-zinc-600 shadow-inner">
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-white text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            ) : (
              <Play className="w-7 h-7 fill-white text-white translate-x-0.5 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            )}
          </div>
        </button>

        {/* Next / Fast Forward (>>) */}
        <button
          onClick={onNext}
          title="Next Track"
          className="w-12 h-12 rounded-full bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:to-zinc-800 border-2 border-zinc-600 flex items-center justify-center text-zinc-200 hover:text-white shadow-lg active:scale-95 transition-transform"
        >
          <SkipForward className="w-6 h-6 fill-zinc-200" />
        </button>

        {/* Stop Button */}
        <button
          onClick={onStop}
          title="Stop Playback"
          className="w-11 h-11 rounded-full bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:to-zinc-800 border-2 border-zinc-600/70 flex items-center justify-center text-zinc-300 hover:text-white shadow-lg active:scale-95 transition-transform"
        >
          <Square className="w-4 h-4 fill-zinc-300 text-zinc-300" />
        </button>

        {/* Playlist button */}
        <button
          onClick={onOpenPlaylist}
          title="Open Playlist"
          className="w-11 h-11 rounded-full bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:to-zinc-800 border-2 border-zinc-600/70 flex items-center justify-center text-zinc-300 hover:text-white shadow-lg active:scale-95 transition-transform"
        >
          <ListMusic className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Sound Deck Controls (Screenshot 1 bottom row) */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-2.5 shadow-md flex flex-wrap items-center justify-between gap-2">
        {/* Repeat Dropdown */}
        <div className="flex flex-col">
          <span className="text-[9px] font-tech uppercase text-zinc-400 font-bold mb-1">REPEAT</span>
          <select
            value={repeatMode}
            onChange={(e) => onToggleRepeat()}
            className="bg-zinc-950 text-zinc-200 border border-zinc-700 rounded px-2 py-1 text-xs font-tech focus:outline-none focus:border-red-500"
          >
            <option value="all">All</option>
            <option value="one">One</option>
            <option value="off">Off</option>
          </select>
        </div>

        {/* Equalizer Preset Dropdown */}
        <div className="flex flex-col">
          <span className="text-[9px] font-tech uppercase text-zinc-400 font-bold mb-1">EQUALIZER</span>
          <select
            value={soundFX.eqPreset}
            onChange={(e) => {
              const selected = equalizerPresets.find(p => p.name === e.target.value);
              if (selected) {
                onSoundFXChange({ eqPreset: selected.name, eqBands: [...selected.bands] });
              }
            }}
            className="bg-zinc-950 text-zinc-200 border border-zinc-700 rounded px-2 py-1 text-xs font-tech focus:outline-none focus:border-red-500"
          >
            {equalizerPresets.map(preset => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bass Slider (-10 to +10) */}
        <div className="flex flex-col items-center w-16">
          <div className="flex justify-between w-full text-[8px] font-digital text-zinc-400">
            <span>-10</span>
            <span className="font-tech text-zinc-300 font-bold">BASS</span>
            <span>+10</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={soundFX.bassBoostLevel}
            onChange={(e) => onSoundFXChange({ bassBoostLevel: Number(e.target.value), bassBoostEnabled: true })}
            className="w-full h-1.5 bg-black rounded accent-red-500 cursor-pointer mt-1"
          />
        </div>

        {/* Treble Slider */}
        <div className="flex flex-col items-center w-16">
          <div className="flex justify-between w-full text-[8px] font-digital text-zinc-400">
            <span>-0</span>
            <span className="font-tech text-zinc-300 font-bold">TREBLE</span>
            <span>+10</span>
          </div>
          <input
            type="range"
            min="-10"
            max="10"
            value={soundFX.trebleLevel}
            onChange={(e) => onSoundFXChange({ trebleLevel: Number(e.target.value) })}
            className="w-full h-1.5 bg-black rounded accent-red-500 cursor-pointer mt-1"
          />
        </div>

        {/* Balance Slider */}
        <div className="flex flex-col items-center w-16">
          <div className="flex justify-between w-full text-[8px] font-digital text-zinc-400">
            <span>L</span>
            <span className="font-tech text-zinc-300 font-bold">BALANCE</span>
            <span>R</span>
          </div>
          <input
            type="range"
            min="-10"
            max="10"
            value={soundFX.balance}
            onChange={(e) => onSoundFXChange({ balance: Number(e.target.value) })}
            className="w-full h-1.5 bg-black rounded accent-red-500 cursor-pointer mt-1"
          />
        </div>

        {/* Tape Selector Switch (TYPE I / TYPE II) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-tech uppercase text-zinc-400 font-bold mb-1">TAPE SELECTOR</span>
          <div className="flex items-center gap-1.5 bg-black border border-zinc-800 rounded px-1.5 py-0.5">
            <button
              onClick={() => onSoundFXChange({ tapeType: 'TYPE I' })}
              className={`text-[9px] font-tech font-bold px-1 rounded transition-colors ${
                soundFX.tapeType === 'TYPE I' ? 'bg-amber-600 text-white' : 'text-zinc-500'
              }`}
            >
              TYPE I
            </button>
            <button
              onClick={() => onSoundFXChange({ tapeType: 'TYPE II' })}
              className={`text-[9px] font-tech font-bold px-1 rounded transition-colors ${
                soundFX.tapeType === 'TYPE II' ? 'bg-red-600 text-white' : 'text-zinc-500'
              }`}
            >
              TYPE II
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
