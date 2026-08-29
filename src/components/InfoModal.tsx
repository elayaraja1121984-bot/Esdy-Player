import React from 'react';
import { X, Disc, Cpu, Radio, Shield, Sparkles } from 'lucide-react';
import { EsdyLogo } from './EsdyLogo';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border-2 border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <EsdyLogo size={26} />
            <h3 className="font-retro-header text-sm font-bold text-zinc-100 uppercase tracking-wider">
              ESDY Player Deck MK-IV
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3 text-xs text-zinc-300">
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex flex-col gap-2">
            <span className="font-tech font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              Web Audio Processing Engine
            </span>
            <p className="text-zinc-400 leading-relaxed">
              Equipped with a real-time 10-band studio graphic equalizer, dual low-shelf sub-bass harmonic exciter, stereo panner, Dolby B/C simulation, and mechanical solenoid audio feedback.
            </p>
          </div>

          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex flex-col gap-1.5 font-tech text-[11px]">
            <div className="flex justify-between py-0.5 border-b border-zinc-800">
              <span className="text-zinc-400">Head Configuration:</span>
              <span className="text-zinc-200 font-bold">Hard Permalloy 4-Track / 2-Channel</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-zinc-800">
              <span className="text-zinc-400">Tape Speed:</span>
              <span className="text-zinc-200 font-bold">4.76 cm/s (1.875 ips)</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-zinc-800">
              <span className="text-zinc-400">Frequency Response:</span>
              <span className="text-zinc-200 font-bold">20 Hz – 20,000 Hz (CrO2 / Metal)</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-zinc-400">Wow & Flutter:</span>
              <span className="text-zinc-200 font-bold">0.035% WRMS</span>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 italic text-center">
            Designed for authentic 1980s retro aesthetics, warm cassette tape saturation, and pristine modern streaming fidelity.
          </p>

          <button
            onClick={onClose}
            className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-tech font-bold uppercase tracking-wider shadow"
          >
            Close Deck Info
          </button>
        </div>
      </div>
    </div>
  );
};
