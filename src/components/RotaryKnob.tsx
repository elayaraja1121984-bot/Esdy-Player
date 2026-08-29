import React, { useRef, useState, useEffect, useCallback } from 'react';
import { audioEngine } from '../utils/audioEngine';

interface RotaryKnobProps {
  value: number; // Current value
  min: number;
  max: number;
  step?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onChange: (val: number) => void;
  showLedArc?: boolean;
  ledCount?: number;
  unit?: string;
}

export const RotaryKnob: React.FC<RotaryKnobProps> = ({
  value,
  min,
  max,
  step = 1,
  label,
  size = 'md',
  onChange,
  showLedArc = false,
  ledCount = 18,
  unit = ''
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startValRef = useRef(value);

  // Map value to angle (-135deg to +135deg = 270 degree sweep)
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const angle = -135 + normalized * 270;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValRef.current = value;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    audioEngine.playMechanicalSound('click');
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = startYRef.current - e.clientY;
    const range = max - min;
    // 150px drag for full range
    const change = (deltaY / 150) * range;
    let newVal = startValRef.current + change;
    newVal = Math.round(newVal / step) * step;
    newVal = Math.max(min, Math.min(max, newVal));
    if (newVal !== value) {
      onChange(newVal);
    }
  }, [isDragging, max, min, onChange, step, value]);

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? step : -step;
    const newVal = Math.max(min, Math.min(max, value + delta));
    if (newVal !== value) {
      onChange(newVal);
      audioEngine.playMechanicalSound('click');
    }
  };

  // Dimensions based on size
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-48 h-48 sm:w-56 sm:h-56' // Mega Bass Dial from screenshot 4
  }[size];

  // Generate LED dot points around circle
  const ledDots = [];
  if (showLedArc) {
    for (let i = 0; i < ledCount; i++) {
      const dotNormalized = i / (ledCount - 1);
      const dotAngle = -135 + dotNormalized * 270;
      const rad = (dotAngle - 90) * (Math.PI / 180);
      const radiusPercent = size === 'xl' ? 58 : 60; // outer percentage
      const x = 50 + radiusPercent * Math.cos(rad);
      const y = 50 + radiusPercent * Math.sin(rad);
      const isActive = dotNormalized <= normalized;
      ledDots.push({ x, y, isActive, i });
    }
  }

  return (
    <div className="flex flex-col items-center select-none">
      <div 
        className={`relative flex items-center justify-center ${size === 'xl' ? 'w-64 h-64 sm:w-72 sm:h-72' : ''}`}
        onWheel={handleWheel}
      >
        {/* Surrounding Glowing LED Arc (Screenshot 4 style) */}
        {showLedArc && (
          <div className="absolute inset-0 pointer-events-none">
            {ledDots.map(dot => (
              <div
                key={dot.i}
                className={`absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-150 transform -translate-x-1/2 -translate-y-1/2 ${
                  dot.isActive
                    ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)] border border-red-300'
                    : 'bg-zinc-800 border border-zinc-900 opacity-60'
                }`}
                style={{
                  left: `${dot.x}%`,
                  top: `${dot.y}%`
                }}
              />
            ))}
          </div>
        )}

        {/* Large Scale Markers (e.g. 2, 4, 6, 8, MIN, MAX) */}
        {size === 'xl' && (
          <div className="absolute inset-0 pointer-events-none text-zinc-400 font-tech font-bold text-xs sm:text-sm">
            <span className="absolute bottom-4 left-6 text-zinc-500">MIN</span>
            <span className="absolute bottom-4 right-6 text-zinc-500">MAX</span>
            <span className="absolute top-1/2 left-2 -translate-y-1/2 text-zinc-300">2</span>
            <span className="absolute top-8 left-1/4 text-zinc-300">4</span>
            <span className="absolute top-8 right-1/4 text-zinc-300">6</span>
            <span className="absolute top-1/2 right-2 -translate-y-1/2 text-zinc-300">8</span>
          </div>
        )}

        {/* Outer Bezel Rim */}
        <div
          ref={knobRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`${sizeClasses} rounded-full cursor-grab active:cursor-grabbing relative flex items-center justify-center p-1 bg-gradient-to-b from-zinc-600 via-zinc-800 to-black shadow-2xl border border-zinc-700/80`}
          style={{ touchAction: 'none' }}
        >
          {/* Inner Machined Brushed Knob Body */}
          <div 
            className="w-full h-full rounded-full bg-knob-metallic flex items-center justify-center relative overflow-hidden shadow-inner border border-zinc-600/50"
            style={{
              transform: `rotate(${angle}deg)`,
              transition: isDragging ? 'none' : 'transform 0.1s cubic-bezier(0.2, 0.9, 0.3, 1)'
            }}
          >
            {/* Radial light glint */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

            {/* Glowing Red Indicator Notch */}
            <div 
              className={`absolute top-1.5 rounded-full ${
                size === 'xl' 
                  ? 'w-3 h-5 bg-gradient-to-b from-red-400 to-red-600 shadow-[0_0_10px_rgba(239,68,68,1)]' 
                  : 'w-1 h-2.5 bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.9)]'
              }`}
            />

            {/* Center concentric accent cap */}
            <div className={`rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 border border-zinc-700 shadow-md ${
              size === 'xl' ? 'w-24 h-24' : 'w-1/2 h-1/2'
            }`} />
          </div>
        </div>
      </div>

      {/* Label and Value readout */}
      {label && (
        <div className="mt-1 flex flex-col items-center">
          <span className="text-[10px] sm:text-xs font-tech font-bold uppercase tracking-wider text-zinc-400">
            {label}
          </span>
          <span className="text-[9px] font-digital text-zinc-300">
            {value > 0 && min < 0 ? `+${value}` : value}{unit}
          </span>
        </div>
      )}
    </div>
  );
};
