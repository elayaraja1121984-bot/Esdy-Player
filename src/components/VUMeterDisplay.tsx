import React, { useEffect, useState, useRef } from 'react';
import { VUMeterStyle } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface VUMeterDisplayProps {
  style?: VUMeterStyle;
  isPlaying?: boolean;
  compact?: boolean;
}

export const VUMeterDisplay: React.FC<VUMeterDisplayProps> = ({
  style = 'analog-green',
  isPlaying = false,
  compact = false
}) => {
  const [leftLevel, setLeftLevel] = useState(0);
  const [rightLevel, setRightLevel] = useState(0);
  const [isPeak, setIsPeak] = useState(false);
  const [freqData, setFreqData] = useState<Uint8Array>(new Uint8Array(16));
  const animFrameRef = useRef<number | null>(null);

  // Smooth needle damping with inertia
  const leftSmoothedRef = useRef(0);
  const rightSmoothedRef = useRef(0);

  useEffect(() => {
    const updateMeters = () => {
      if (isPlaying) {
        const { left, right, peak, freqs } = audioEngine.getMeterLevels();
        
        // Needle physics: snappy attack (0.35), gentle release (0.12)
        const attack = 0.35;
        const release = 0.12;
        
        leftSmoothedRef.current += (left - leftSmoothedRef.current) * (left > leftSmoothedRef.current ? attack : release);
        rightSmoothedRef.current += (right - rightSmoothedRef.current) * (right > rightSmoothedRef.current ? attack : release);

        setLeftLevel(leftSmoothedRef.current);
        setRightLevel(rightSmoothedRef.current);
        setIsPeak(peak);
        setFreqData(new Uint8Array(freqs));
      } else {
        // Drop smoothly to 0
        leftSmoothedRef.current *= 0.85;
        rightSmoothedRef.current *= 0.85;
        setLeftLevel(leftSmoothedRef.current);
        setRightLevel(rightSmoothedRef.current);
        setIsPeak(false);
      }
      animFrameRef.current = requestAnimationFrame(updateMeters);
    };

    animFrameRef.current = requestAnimationFrame(updateMeters);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Convert level 0..1 to needle rotation angle (-45deg to +45deg)
  const leftAngle = -45 + leftLevel * 90;
  const rightAngle = -45 + rightLevel * 90;

  // Single Analog Needle Gauge Component
  const renderAnalogGauge = (channel: 'L' | 'R', angle: number, title: string) => {
    const isBlue = style === 'analog-integra-blue';
    const isTcd = style === 'analog-tcd-red';

    const bgGradient = isBlue
      ? 'bg-gradient-to-b from-[#0b1c2d] via-[#081522] to-[#040a12]'
      : isTcd
      ? 'bg-gradient-to-b from-[#2d1b10] via-[#1a0e07] to-[#0d0703]'
      : 'bg-gradient-to-b from-[#18201a] via-[#101712] to-[#090d0a]';

    const scaleColor = isBlue ? '#38bdf8' : isTcd ? '#f97316' : '#22c55e';
    const needleColor = isBlue ? '#7dd3fc' : isTcd ? '#ef4444' : '#f59e0b';

    return (
      <div className={`relative flex-1 ${compact ? 'h-16' : 'h-24'} ${bgGradient} border-2 border-zinc-700/80 rounded-md overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)] p-1 flex flex-col justify-between`}>
        {/* Vintage Glass Reflection Glint */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

        {/* Top Scale Numbers */}
        <div className="flex justify-between items-center px-1 text-[8px] font-digital font-bold text-zinc-400 z-10">
          <span className="text-zinc-500">-20</span>
          <span>10</span>
          <span>5</span>
          <span className="text-zinc-300">3</span>
          <span className="text-zinc-300">2</span>
          <span className="text-amber-400">0</span>
          <span className="text-red-500">1</span>
          <span className="text-red-500">2</span>
          <span className="text-red-600 font-extrabold">+3</span>
        </div>

        {/* Dial Scale Curved Arc SVG */}
        <div className="relative w-full h-10 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 45">
            {/* Scale background ticks */}
            <path
              d="M 12 36 Q 50 16 88 36"
              fill="none"
              stroke="#374151"
              strokeWidth="1.2"
            />
            {/* Green / Normal zone */}
            <path
              d="M 12 36 Q 44 19 68 25"
              fill="none"
              stroke={scaleColor}
              strokeWidth="2"
              strokeDasharray="2 2"
            />
            {/* Red / Overload zone */}
            <path
              d="M 68 25 Q 78 30 88 36"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
            />
          </svg>

          {/* Needle pivot & moving needle */}
          <div
            className="absolute bottom-[-6px] left-1/2 w-0.5 origin-bottom transform transition-none"
            style={{
              height: compact ? '48px' : '65px',
              backgroundColor: needleColor,
              boxShadow: `0 0 4px ${needleColor}`,
              transform: `translateX(-50%) rotate(${angle}deg)`
            }}
          >
            {/* Fine needle tip */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-red-400 rounded-full" />
          </div>

          {/* Pivot screw base */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-b from-zinc-600 to-black border border-zinc-700 shadow-md" />
        </div>

        {/* Bottom Label & VU Indicator */}
        <div className="flex justify-between items-center px-2 text-[8px] font-tech text-zinc-400 font-bold z-10">
          <span className="text-zinc-500">{channel}</span>
          <span className="text-zinc-300 tracking-widest">VU</span>
          <span className="text-zinc-500">dB</span>
        </div>
      </div>
    );
  };

  // Digital Tri-Color Segmented LED Meter
  const renderDigitalLEDMeter = () => {
    const totalSegments = 16;
    const activeLeft = Math.round(leftLevel * totalSegments);
    const activeRight = Math.round(rightLevel * totalSegments);

    const renderBar = (activeCount: number, channel: string) => (
      <div className="flex items-center gap-1 w-full">
        <span className="text-[9px] font-tech font-bold text-zinc-400 w-3">{channel}</span>
        <div className="flex-1 flex gap-[2px] bg-black/80 p-1 rounded border border-zinc-800">
          {Array.from({ length: totalSegments }).map((_, idx) => {
            const isLit = idx < activeCount;
            let color = 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]';
            if (idx >= 11 && idx < 14) color = 'bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.8)]';
            if (idx >= 14) color = 'bg-red-600 shadow-[0_0_6px_rgba(239,68,68,1)]';

            return (
              <div
                key={idx}
                className={`flex-1 h-3 rounded-[1px] transition-colors duration-75 ${
                  isLit ? color : 'bg-zinc-800/60 opacity-30'
                }`}
              />
            );
          })}
        </div>
      </div>
    );

    return (
      <div className="flex-1 bg-zinc-950 border-2 border-zinc-800 rounded-md p-2 flex flex-col justify-center gap-2 shadow-inner">
        <div className="flex justify-between text-[8px] font-digital text-zinc-400 px-4">
          <span>-20</span>
          <span>-10</span>
          <span>-5</span>
          <span>-1</span>
          <span>0</span>
          <span className="text-amber-400">+2</span>
          <span className="text-red-500">+6</span>
        </div>
        {renderBar(activeLeft, 'L')}
        {renderBar(activeRight, 'R')}
      </div>
    );
  };

  // 1979 Retro Blue LCD Display
  const renderLCDMeter = () => {
    const bands = Array.from(freqData.slice(0, 10));
    return (
      <div className="flex-1 bg-[#05131e] border-2 border-cyan-900/60 rounded-md p-2 flex flex-col justify-between shadow-[inset_0_0_12px_rgba(6,182,212,0.2)]">
        <div className="flex justify-between text-[8px] font-digital text-cyan-400/80">
          <span>60Hz</span>
          <span>250Hz</span>
          <span>1kHz</span>
          <span>4kHz</span>
          <span>16kHz</span>
        </div>
        <div className="flex justify-between items-end gap-1 h-12 pt-1">
          {bands.map((val: number, i: number) => {
            const numVal = Number(val) || 0;
            const heightPercent = isPlaying ? Math.min(100, Math.max(8, (numVal / 255) * 100)) : 8;
            return (
              <div key={i} className="flex-1 bg-cyan-950/50 rounded-t h-full flex items-end">
                <div
                  className="w-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] rounded-t transition-all duration-75"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const isDigital = style === 'led-tri-color';
  const isLCD = style === 'lcd-vintage-blue' || style === 'lcd-amber-matrix' || style === 'boombox-spectrum';

  return (
    <div className="w-full flex items-center gap-2 select-none">
      {isDigital ? (
        renderDigitalLEDMeter()
      ) : isLCD ? (
        renderLCDMeter()
      ) : (
        <div className="w-full flex items-center gap-2">
          {renderAnalogGauge('L', leftAngle, 'LEFT CHANNEL')}

          {/* Central Peak Indicator LED */}
          <div className="flex flex-col items-center justify-center px-1">
            <div
              className={`w-3 h-3 rounded-full transition-all duration-100 border border-zinc-800 ${
                isPeak
                  ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)] border-red-300 scale-110'
                  : 'bg-zinc-800 opacity-70'
              }`}
            />
            <span className="text-[8px] font-tech font-bold text-zinc-400 mt-1 uppercase">
              PEAK
            </span>
          </div>

          {renderAnalogGauge('R', rightAngle, 'RIGHT CHANNEL')}
        </div>
      )}
    </div>
  );
};
