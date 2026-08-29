import React from 'react';
import { Sliders, Zap, Disc3, Radio, Volume2, Sparkles } from 'lucide-react';
import { RotaryKnob } from './RotaryKnob';
import { SoundFXState, Translations } from '../types';
import { equalizerPresets } from '../data/mockTracks';
import { EQ_FREQUENCIES } from '../utils/audioEngine';

interface EqualizerViewProps {
  soundFX: SoundFXState;
  t: Translations;
  onSoundFXChange: (fx: Partial<SoundFXState>) => void;
  onResetEQ: () => void;
}

export const EqualizerView: React.FC<EqualizerViewProps> = ({
  soundFX,
  t,
  onSoundFXChange,
  onResetEQ
}) => {
  const handleBandChange = (index: number, val: number) => {
    const newBands = [...soundFX.eqBands];
    newBands[index] = val;
    onSoundFXChange({ eqBands: newBands, eqPreset: 'Custom' });
  };

  const handleSelectPreset = (presetName: string) => {
    const preset = equalizerPresets.find(p => p.name === presetName);
    if (preset) {
      onSoundFXChange({
        eqPreset: preset.name,
        eqBands: [...preset.bands]
      });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4 pb-20 select-none px-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-zinc-900/90 border-b border-zinc-800 rounded-t-xl shadow-md">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-red-500" />
          <h2 className="font-retro-header text-lg font-bold text-zinc-100 uppercase tracking-wider">
            {t.bassEnhanceEngine}
          </h2>
        </div>

        <button
          onClick={onResetEQ}
          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-tech font-bold uppercase border border-zinc-700 shadow transition-colors"
        >
          Reset EQ
        </button>
      </div>

      {/* Main Rotary Mega Bass Stage (Screenshot 4 Centerpiece) */}
      <div className="relative w-full bg-brushed-titanium border-2 border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle Brushed Metal Grid texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

        {/* Top Toggle Switches: Power (Left) and +3dB Sub-bass (Right) */}
        <div className="w-full flex items-center justify-between mb-4 z-10 px-2 sm:px-4">
          {/* Main FX Power Switch */}
          <div className="flex flex-col items-start gap-1">
            <button
              onClick={() => onSoundFXChange({ bassBoostEnabled: !soundFX.bassBoostEnabled })}
              className={`w-14 h-7 rounded-full p-1 transition-colors flex items-center border shadow-md ${
                soundFX.bassBoostEnabled
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-400 justify-end'
                  : 'bg-zinc-800 border-zinc-700 justify-start'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center text-[8px] font-tech font-bold ${
                soundFX.bassBoostEnabled ? 'text-red-600' : 'text-zinc-700'
              }`}>
                {soundFX.bassBoostEnabled ? 'ON' : 'OFF'}
              </div>
            </button>
            <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-300">
              {t.enableSoundFX}
            </span>
          </div>

          {/* +3dB Sub-bass Switch (Screenshot 4 top right) */}
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => onSoundFXChange({ subBass3dB: !soundFX.subBass3dB, bassBoostEnabled: true })}
              className={`w-14 h-7 rounded-full p-1 transition-colors flex items-center border shadow-md ${
                soundFX.subBass3dB
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-400 justify-end'
                  : 'bg-zinc-800 border-zinc-700 justify-start'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center text-[8px] font-tech font-bold ${
                soundFX.subBass3dB ? 'text-red-600' : 'text-zinc-700'
              }`}>
                {soundFX.subBass3dB ? 'ON' : 'OFF'}
              </div>
            </button>
            <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-300 text-right">
              {t.subBassMode}
            </span>
          </div>
        </div>

        {/* Huge Brushed Metal Rotary Knob with Surrounding Red Glowing LEDs */}
        <div className="my-2 sm:my-4">
          <RotaryKnob
            size="xl"
            min={0}
            max={10}
            step={0.5}
            value={soundFX.bassBoostLevel}
            onChange={(val) => onSoundFXChange({ bassBoostLevel: val, bassBoostEnabled: true })}
            showLedArc={true}
            ledCount={24}
          />
        </div>

        {/* Readout stats */}
        <div className="flex items-center gap-6 mt-2 text-zinc-400 font-tech text-xs uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-red-500" />
            <span>Heavy Low-End: {soundFX.bassBoostLevel * 10}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-amber-500" />
            <span>Harmonic Punch: {soundFX.subBass3dB ? '+6 dB' : '+0 dB'}</span>
          </div>
        </div>
      </div>

      {/* Preset Chips Carousel */}
      <div className="flex flex-col gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 shadow-inner">
        <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-400">
          {t.preset}
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {equalizerPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleSelectPreset(preset.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                soundFX.eqPreset === preset.name
                  ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)] border border-red-400'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* 10-Band Graphic Equalizer Sliders */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 sm:p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-300">
            10-Band Graphic Studio Equalizer
          </span>
          <span className="text-[10px] font-digital text-zinc-500">
            Range: -12dB to +12dB
          </span>
        </div>

        {/* Sliders row */}
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-44 sm:h-48 pt-4 pb-2 px-1 bg-zinc-950/80 rounded-lg border border-zinc-800/80 shadow-inner">
          {EQ_FREQUENCIES.map((freq, idx) => {
            const gain = soundFX.eqBands[idx] || 0;
            const freqLabel = freq >= 1000 ? `${freq / 1000}k` : `${freq}`;

            return (
              <div key={freq} className="flex-1 flex flex-col items-center justify-between h-full">
                {/* dB Readout */}
                <span className="text-[9px] font-digital font-bold text-zinc-400">
                  {gain > 0 ? `+${gain.toFixed(0)}` : gain.toFixed(0)}
                </span>

                {/* Vertical Slider Track */}
                <div className="relative w-full flex items-center justify-center h-28 sm:h-32">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="0.5"
                    value={gain}
                    onChange={(e) => handleBandChange(idx, Number(e.target.value))}
                    className="w-28 sm:w-32 -rotate-90 appearance-none bg-zinc-800 rounded h-1.5 cursor-pointer accent-red-500"
                  />
                  {/* Center 0dB Reference notch */}
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-zinc-700/60 pointer-events-none" />
                </div>

                {/* Frequency Label */}
                <span className="text-[9px] sm:text-[10px] font-tech text-zinc-400 font-bold">
                  {freqLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Retro Analog Sound Enhancements (Tape Hiss & 3D Spatializer) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 3D Spatial Surround */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2 shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech font-bold uppercase text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {t.surround3D}
            </span>
            <button
              onClick={() => onSoundFXChange({ surround3D: !soundFX.surround3D })}
              className={`text-[10px] font-tech font-bold px-2 py-0.5 rounded transition-colors ${
                soundFX.surround3D ? 'bg-cyan-600 text-white' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {soundFX.surround3D ? 'ON' : 'OFF'}
            </button>
          </div>
          <p className="text-[10px] text-zinc-500">
            Broadens soundstage width for immersive headphone listening.
          </p>
        </div>

        {/* Vintage Tape Hiss Simulation */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2 shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech font-bold uppercase text-zinc-300 flex items-center gap-1.5">
              <Disc3 className="w-3.5 h-3.5 text-amber-400" />
              {t.tapeHissSim}
            </span>
            <button
              onClick={() => onSoundFXChange({ tapeHissNoise: !soundFX.tapeHissNoise })}
              className={`text-[10px] font-tech font-bold px-2 py-0.5 rounded transition-colors ${
                soundFX.tapeHissNoise ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {soundFX.tapeHissNoise ? 'ON' : 'OFF'}
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={soundFX.tapeHissVolume}
            onChange={(e) => onSoundFXChange({ tapeHissVolume: Number(e.target.value), tapeHissNoise: true })}
            className="w-full h-1.5 bg-black rounded accent-amber-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
