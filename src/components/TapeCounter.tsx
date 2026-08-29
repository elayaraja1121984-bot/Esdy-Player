import React from 'react';
import { RotateCcw } from 'lucide-react';

interface TapeCounterProps {
  counter: number;
  onReset: () => void;
}

export const TapeCounter: React.FC<TapeCounterProps> = ({ counter, onReset }) => {
  // Format counter to 4 digits: e.g. 0027
  const padded = Math.floor(Math.max(0, counter) % 10000).toString().padStart(4, '0');
  const digits = padded.split('');

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-md p-1.5 shadow-inner flex flex-col items-center select-none">
      <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-tech font-semibold mb-1">
        TAPE COUNTER
      </div>
      
      <div className="flex items-center gap-1.5">
        {/* Mechanical 4-digit roller window */}
        <div className="flex items-center bg-black border border-zinc-700/80 rounded px-1.5 py-0.5 shadow-inner">
          {digits.map((d, i) => (
            <div
              key={i}
              className="relative w-4 h-6 bg-zinc-950 text-amber-500 font-digital font-bold text-base flex items-center justify-center border-r border-zinc-800/80 last:border-r-0 overflow-hidden"
              style={{ textShadow: '0 0 4px rgba(245, 158, 11, 0.6)' }}
            >
              {/* Digit separator subtle line */}
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-zinc-800/40 pointer-events-none" />
              <span>{d}</span>
            </div>
          ))}
        </div>

        {/* Reset button */}
        <button
          onClick={onReset}
          title="Reset Tape Counter"
          className="px-2 py-1 bg-gradient-to-b from-zinc-700 to-zinc-900 hover:from-zinc-600 hover:to-zinc-800 text-zinc-300 hover:text-white border border-zinc-600 rounded text-[9px] font-tech font-bold uppercase tracking-wider shadow active:scale-95 transition-transform flex items-center gap-0.5"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>RESET</span>
        </button>
      </div>
    </div>
  );
};
