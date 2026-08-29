import React from 'react';
import { CassetteSkinId, Track } from '../types';
import { EsdyLogo } from './EsdyLogo';

interface CassetteDeckProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number; // 0 to 1 (current / duration)
  skinId: CassetteSkinId;
  tapeSide?: 'A' | 'B';
  dolbyNR: boolean;
  onToggleDolby?: () => void;
  onToggleSide?: () => void;
  customLabel?: string;
}

export const CassetteDeck: React.FC<CassetteDeckProps> = ({
  currentTrack,
  isPlaying,
  progress,
  skinId = 'raks-chrome',
  tapeSide = 'A',
  dolbyNR,
  onToggleDolby,
  onToggleSide,
  customLabel
}) => {
  // Tape spools radius based on progress:
  // Left spool shrinks from 46px to 22px
  // Right spool grows from 22px to 46px
  const clampedProgress = Math.max(0, Math.min(1, progress || 0));
  const leftSpoolRadius = 46 - clampedProgress * 24;
  const rightSpoolRadius = 22 + clampedProgress * 24;

  const displayTitle = customLabel || currentTrack?.tapeLabelText || currentTrack?.title || "Retro Cassette Tape";

  // Skin color styling
  const getSkinStyles = () => {
    switch (skinId) {
      case 'studio52-reel':
        return {
          casingBg: 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-black',
          reelColor: '#d4d4d8',
          reelText: 'STUDIO 52',
          subText: 'REEL-TO-REEL',
          labelBg: 'bg-zinc-200 text-zinc-900',
          accentBorder: 'border-zinc-600'
        };
      case 'type4-metal':
        return {
          casingBg: 'bg-gradient-to-b from-[#1c1917] via-[#0c0a09] to-black',
          reelColor: '#b45309',
          reelText: 'METAL TYPE IV',
          subText: 'PRO POSITION',
          labelBg: 'bg-[#292524] text-amber-300',
          accentBorder: 'border-amber-700/60'
        };
      case '70s-gold':
        return {
          casingBg: 'bg-gradient-to-b from-[#292211] via-[#1a150b] to-[#0d0a05]',
          reelColor: '#fbbf24',
          reelText: 'GOLDEN 70s',
          subText: 'HIGH FIDELITY',
          labelBg: 'bg-[#fef3c7] text-[#78350f]',
          accentBorder: 'border-amber-600/60'
        };
      case '80s-transparent':
        return {
          casingBg: 'bg-zinc-900/60 backdrop-blur-md',
          reelColor: '#f1f5f9',
          reelText: 'CLEAR SMOKE',
          subText: 'FERRIC EXTRA',
          labelBg: 'bg-red-950/80 text-red-200 border border-red-500/40',
          accentBorder: 'border-cyan-500/40'
        };
      case '90s-neon':
        return {
          casingBg: 'bg-gradient-to-b from-[#20052b] via-[#12031a] to-black',
          reelColor: '#f43f5e',
          reelText: 'NEON WAVE',
          subText: 'TYPE II CHROME',
          labelBg: 'bg-fuchsia-950 text-cyan-300 border border-fuchsia-500/50',
          accentBorder: 'border-fuchsia-600/60'
        };
      case 'raks-chrome':
      default:
        return {
          casingBg: 'bg-gradient-to-b from-zinc-800/95 via-zinc-900 to-black',
          reelColor: '#d4af37', // Gold / Chrome
          reelText: 'RAKS',
          subText: 'SUPER CHROME',
          labelBg: 'bg-[#f5eedc] text-[#1c1917]',
          accentBorder: 'border-zinc-700'
        };
    }
  };

  const skin = getSkinStyles();

  // Single spinning reel component
  const renderReel = (isLeft: boolean, tapeRadius: number) => {
    return (
      <div className="relative flex items-center justify-center">
        {/* Dark Magnetic Tape Pack wrapped around spool */}
        <div
          className="absolute rounded-full bg-gradient-to-br from-[#120f0e] via-[#1f1a18] to-[#0a0807] shadow-inner border border-zinc-900 transition-all duration-300"
          style={{
            width: `${tapeRadius * 2}px`,
            height: `${tapeRadius * 2}px`
          }}
        />

        {/* Outer Golden/Chrome Metallic Reel Spool with Cutouts */}
        <div
          className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full relative flex items-center justify-center shadow-lg border-2 border-zinc-700/60 ${
            isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
          }`}
          style={{
            background: `radial-gradient(circle, ${skin.reelColor} 0%, #856d28 60%, #443714 100%)`,
            animationPlayState: isPlaying ? 'running' : 'paused'
          }}
        >
          {/* Reel Cutout Windows (3 triangular openings) */}
          <div className="absolute w-7 h-16 bg-black/85 rounded-sm transform rotate-0 border border-zinc-700" />
          <div className="absolute w-7 h-16 bg-black/85 rounded-sm transform rotate-60 border border-zinc-700" />
          <div className="absolute w-7 h-16 bg-black/85 rounded-sm transform -rotate-60 border border-zinc-700" />

          {/* Reel Printed Branding Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-black font-tech font-extrabold tracking-tight">
            <span className="text-[10px] sm:text-xs leading-none drop-shadow-sm">{skin.reelText}</span>
            <span className="text-[7px] sm:text-[8px] leading-none opacity-80">{skin.subText}</span>
          </div>

          {/* Center Spindle & Drive Teeth Hub */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-b from-zinc-200 to-zinc-400 border-2 border-zinc-800 flex items-center justify-center shadow-md relative z-10">
            <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center relative">
              {/* 3 Mechanical Drive Teeth */}
              <div className="absolute w-1.5 h-6 bg-zinc-300 rounded-[1px]" />
              <div className="absolute w-1.5 h-6 bg-zinc-300 rounded-[1px] rotate-60" />
              <div className="absolute w-1.5 h-6 bg-zinc-300 rounded-[1px] -rotate-60" />
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-zinc-500 z-10" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative w-full rounded-xl ${skin.casingBg} border-2 ${skin.accentBorder} p-3 sm:p-4 shadow-2xl overflow-hidden select-none`}>
      {/* 4 Corner Screws for Skeuomorphic Realism */}
      <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-b from-zinc-500 to-zinc-800 border border-zinc-900 flex items-center justify-center shadow-inner">
        <div className="w-2 h-0.5 bg-zinc-400 rotate-45" />
      </div>
      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-b from-zinc-500 to-zinc-800 border border-zinc-900 flex items-center justify-center shadow-inner">
        <div className="w-2 h-0.5 bg-zinc-400 -rotate-45" />
      </div>
      <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-b from-zinc-500 to-zinc-800 border border-zinc-900 flex items-center justify-center shadow-inner">
        <div className="w-2 h-0.5 bg-zinc-400 rotate-12" />
      </div>
      <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gradient-to-b from-zinc-500 to-zinc-800 border border-zinc-900 flex items-center justify-center shadow-inner">
        <div className="w-2 h-0.5 bg-zinc-400 -rotate-30" />
      </div>

      {/* Top Header Label Strip (with A/B Side Badge & Dolby Switch) */}
      <div className="flex items-stretch justify-between gap-2 mb-2 px-1">
        {/* Side Indicator Badge ("A" / "B") */}
        <button
          onClick={onToggleSide}
          title="Toggle Tape Side A/B"
          className="w-8 h-8 rounded bg-gradient-to-b from-amber-600 to-amber-800 text-white font-tech font-bold text-lg flex items-center justify-center border border-amber-500 shadow-md active:scale-95 transition-transform"
        >
          {tapeSide}
        </button>

        {/* Paper Handwritten Cassette Title Strip (Caveat Cursive Font) */}
        <div className={`flex-1 ${skin.labelBg} px-3 py-1 rounded shadow-inner border border-zinc-400/40 flex items-center justify-center overflow-hidden`}>
          <span className="font-handwriting text-lg sm:text-xl font-bold truncate tracking-wide text-blue-900">
            {displayTitle}
          </span>
        </div>

        {/* Dolby Noise Reduction Switch */}
        <button
          onClick={onToggleDolby}
          title="Toggle Dolby Noise Reduction"
          className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded text-[9px] font-tech font-bold uppercase tracking-wider flex flex-col items-center justify-center shadow transition-colors"
        >
          <span className="text-zinc-400 text-[8px]">N.R.</span>
          <span className={dolbyNR ? 'text-green-400 font-extrabold' : 'text-zinc-500'}>
            {dolbyNR ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Center Transparent Acrylic Window with Spinning Tape Reels */}
      <div className="relative w-full h-36 sm:h-44 bg-zinc-950/80 border-2 border-zinc-800 rounded-lg p-2 flex items-center justify-around overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)]">
        {/* Acrylic Glass Reflection diagonal streaks */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

        {/* Left Supply Reel */}
        {renderReel(true, leftSpoolRadius)}

        {/* Center Guide Window & Tape Level Gauge */}
        <div className="flex flex-col items-center justify-center gap-1 z-10 text-zinc-500 font-tech text-[8px]">
          <div className="w-12 h-6 border border-zinc-800 bg-zinc-950/60 rounded flex items-center justify-center">
            {/* Moving magnetic tape bridge line */}
            <div className="w-full h-1.5 bg-[#1f1a18] shadow-inner" />
          </div>
          <span className="tracking-widest uppercase text-zinc-400 font-bold">STEREO</span>
        </div>

        {/* Right Takeup Reel */}
        {renderReel(false, rightSpoolRadius)}
      </div>

      {/* Bottom Cassette Specs Footer (Type II, 90 mins, Rollers) */}
      <div className="mt-2 flex items-center justify-between text-[9px] sm:text-[10px] font-tech text-zinc-400 px-3 uppercase tracking-wider font-semibold">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-zinc-400" />
          </div>
          <span>TYPE II (CrO₂) POSITION</span>
        </div>

        {/* Center ESDY Emblem */}
        <div className="flex items-center gap-1 bg-zinc-950/70 border border-zinc-700/60 rounded px-1.5 py-0.5">
          <EsdyLogo size={14} />
          <span className="font-tech font-bold text-[9px] text-zinc-300 tracking-wider">ESDY</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span>90 MINUTES (45 × 2)</span>
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-zinc-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
