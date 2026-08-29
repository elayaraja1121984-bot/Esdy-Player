import React from 'react';
import { TopDeckBar } from './TopDeckBar';
import { VUMeterDisplay } from './VUMeterDisplay';
import { TapeCounter } from './TapeCounter';
import { CassetteDeck } from './CassetteDeck';
import { TrackCardAndControls } from './TrackCardAndControls';
import { Track, SoundFXState, VUMeterStyle, CassetteSkinId, Translations } from '../types';

interface PlayerViewProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  soundFX: SoundFXState;
  vuMeterStyle: VUMeterStyle;
  cassetteSkin: CassetteSkinId;
  tapeSide: 'A' | 'B';
  tapeCounter: number;
  isShuffle: boolean;
  repeatMode: 'all' | 'one' | 'off';
  t: Translations;
  onPlayPause: () => void;
  onStop: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleFavorite: () => void;
  onSoundFXChange: (fx: Partial<SoundFXState>) => void;
  onResetTapeCounter: () => void;
  onToggleDolby: () => void;
  onToggleTapeSide: () => void;
  onOpenDrawer: () => void;
  onOpenPlaylist: () => void;
  onOpenSettings: () => void;
  onOpenInfo: () => void;
  onOpenInstall?: () => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  progress,
  soundFX,
  vuMeterStyle,
  cassetteSkin,
  tapeSide,
  tapeCounter,
  isShuffle,
  repeatMode,
  t,
  onPlayPause,
  onStop,
  onPrev,
  onNext,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
  onToggleFavorite,
  onSoundFXChange,
  onResetTapeCounter,
  onToggleDolby,
  onToggleTapeSide,
  onOpenDrawer,
  onOpenPlaylist,
  onOpenSettings,
  onOpenInfo,
  onOpenInstall
}) => {
  return (
    <div className="w-full flex flex-col gap-3 max-w-xl mx-auto pb-4">
      {/* Top Deck Bar with volume slider and knobs */}
      <TopDeckBar
        soundFX={soundFX}
        onSoundFXChange={onSoundFXChange}
        onOpenDrawer={onOpenDrawer}
        onOpenPlaylist={onOpenPlaylist}
        onOpenInfo={onOpenInfo}
        onOpenInstall={onOpenInstall}
        isFavorite={currentTrack?.isFavorite || false}
        onToggleFavorite={onToggleFavorite}
      />

      {/* VU Meters Row with Mechanical Tape Counter */}
      <div className="flex items-center gap-2 px-1">
        <div className="flex-1">
          <VUMeterDisplay
            style={vuMeterStyle}
            isPlaying={isPlaying}
          />
        </div>

        {/* Tape Counter */}
        <TapeCounter
          counter={tapeCounter}
          onReset={onResetTapeCounter}
        />
      </div>

      {/* Stereo Cassette Deck Label Banner (Red ribbon badge from Screenshot 1 & 3) */}
      <div className="flex items-center justify-between px-2 text-[10px] font-tech text-zinc-400 tracking-wider">
        <span className="font-bold uppercase tracking-widest text-zinc-300">
          {t.stereoCassetteDeck}
        </span>
        <span className="px-2 py-0.5 rounded bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-[9px] tracking-widest shadow-md">
          {soundFX.stereoMode}
        </span>
      </div>

      {/* Cassette Deck Bay with spinning reels */}
      <CassetteDeck
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        progress={progress}
        skinId={cassetteSkin}
        tapeSide={tapeSide}
        dolbyNR={soundFX.dolbyNR}
        onToggleDolby={onToggleDolby}
        onToggleSide={onToggleTapeSide}
      />

      {/* Track info card, progress slider & transport buttons */}
      <TrackCardAndControls
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        isShuffle={isShuffle}
        repeatMode={repeatMode}
        soundFX={soundFX}
        onPlayPause={onPlayPause}
        onStop={onStop}
        onPrev={onPrev}
        onNext={onNext}
        onSeek={onSeek}
        onToggleShuffle={onToggleShuffle}
        onToggleRepeat={onToggleRepeat}
        onToggleFavorite={onToggleFavorite}
        onSoundFXChange={onSoundFXChange}
        onOpenSettings={onOpenSettings}
        onOpenPlaylist={onOpenPlaylist}
      />
    </div>
  );
};
