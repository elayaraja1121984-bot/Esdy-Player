import React from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';
import { VUMeterStyle, Translations } from '../types';
import { VUMeterDisplay } from './VUMeterDisplay';

interface VUMetersGalleryViewProps {
  currentStyle: VUMeterStyle;
  isPlaying: boolean;
  t: Translations;
  onSelectStyle: (style: VUMeterStyle) => void;
}

interface MeterOption {
  id: VUMeterStyle;
  name: string;
  vintage: string;
  description: string;
  category: 'analog' | 'digital';
}

const meterOptions: MeterOption[] = [
  {
    id: 'analog-green',
    name: '1980 AD-F77M Cassette Deck',
    vintage: 'Early 80s Vintage Analog',
    description: 'Backlit warm amber-green needle meters with red peak deflection.',
    category: 'analog'
  },
  {
    id: 'analog-tcd-red',
    name: '1985 TCD-3014 Master Studio',
    vintage: 'Mid 80s Studio Precision',
    description: 'Dual red-orange needle meters with precision metal bezel.',
    category: 'analog'
  },
  {
    id: 'analog-integra-blue',
    name: '1986 Grand Integra M-508',
    vintage: 'Late 80s Blue Backlit Power',
    description: 'High-visibility fluorescent blue backlit needle gauges.',
    category: 'analog'
  },
  {
    id: 'led-tri-color',
    name: '1978 AD-L400 Tri-Color LED',
    vintage: '16-Segment Multi-Color',
    description: 'Green, yellow, and red responsive LED bar graphs.',
    category: 'digital'
  },
  {
    id: 'lcd-vintage-blue',
    name: '1979 CT-F600 Digital LCD',
    vintage: 'Late 70s Cyan Matrix',
    description: 'Fluoroscan blue vacuum fluorescent display simulation.',
    category: 'digital'
  },
  {
    id: 'boombox-spectrum',
    name: '1990s Boombox Spectrum Analyzer',
    vintage: '90s Graphic Dynamic Bar',
    description: 'Real-time 10-band audio frequency analyzer bars.',
    category: 'digital'
  }
];

export const VUMetersGalleryView: React.FC<VUMetersGalleryViewProps> = ({
  currentStyle,
  isPlaying,
  t,
  onSelectStyle
}) => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4 pb-20 select-none px-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-zinc-900/90 border-b border-zinc-800 rounded-t-xl shadow-md">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-500" />
          <h2 className="font-retro-header text-lg font-bold text-zinc-100 uppercase tracking-wider">
            {t.vumeters}
          </h2>
        </div>
        <span className="text-xs font-tech text-zinc-400">
          {isPlaying ? 'Live Audio Signal Active' : 'Deck in Standby'}
        </span>
      </div>

      {/* Analog Meters Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-1 px-1">
          <span className="text-xs font-tech font-bold uppercase tracking-wider text-amber-400">
            {t.analogMeters}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {meterOptions.filter(m => m.category === 'analog').map((option) => {
            const isSelected = currentStyle === option.id;

            return (
              <div
                key={option.id}
                onClick={() => onSelectStyle(option.id)}
                className={`relative rounded-xl p-3 border transition-all cursor-pointer flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-zinc-900 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] ring-1 ring-red-500/50'
                    : 'bg-zinc-900/70 hover:bg-zinc-850 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Meta details */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 font-tech">
                      {option.name}
                    </h3>
                    <span className="text-[11px] text-zinc-400">
                      {option.vintage}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1 text-red-400 text-xs font-tech font-bold bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ACTIVE
                    </div>
                  )}
                </div>

                {/* Live VU Meter Preview */}
                <div className="w-full bg-zinc-950 p-2 rounded-lg border border-zinc-800 shadow-inner">
                  <VUMeterDisplay
                    style={option.id}
                    isPlaying={isPlaying}
                    compact={true}
                  />
                </div>

                <p className="text-[11px] text-zinc-500">
                  {option.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Digital Meters Section */}
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-1 px-1">
          <span className="text-xs font-tech font-bold uppercase tracking-wider text-cyan-400">
            {t.digitalMeters}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {meterOptions.filter(m => m.category === 'digital').map((option) => {
            const isSelected = currentStyle === option.id;

            return (
              <div
                key={option.id}
                onClick={() => onSelectStyle(option.id)}
                className={`relative rounded-xl p-3 border transition-all cursor-pointer flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-zinc-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500/50'
                    : 'bg-zinc-900/70 hover:bg-zinc-850 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Meta details */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 font-tech">
                      {option.name}
                    </h3>
                    <span className="text-[11px] text-zinc-400">
                      {option.vintage}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1 text-cyan-400 text-xs font-tech font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ACTIVE
                    </div>
                  )}
                </div>

                {/* Live VU Meter Preview */}
                <div className="w-full bg-zinc-950 p-2 rounded-lg border border-zinc-800 shadow-inner">
                  <VUMeterDisplay
                    style={option.id}
                    isPlaying={isPlaying}
                    compact={true}
                  />
                </div>

                <p className="text-[11px] text-zinc-500">
                  {option.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
