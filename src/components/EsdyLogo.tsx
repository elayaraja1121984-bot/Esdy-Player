import React from 'react';

interface EsdyLogoProps {
  size?: number;
  className?: string;
  variant?: 'icon' | 'badge' | 'emblem' | 'flat';
  showText?: boolean;
  text?: string;
  subtext?: string;
  rounded?: boolean;
}

export const EsdyLogo: React.FC<EsdyLogoProps> = ({
  size = 36,
  className = '',
  variant = 'icon',
  showText = false,
  text = 'ESDY Smart',
  subtext,
  rounded = true
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* App Squircle Icon */}
      <div 
        style={{ width: size, height: size }}
        className={`relative shrink-0 flex items-center justify-center shadow-md overflow-hidden ${
          rounded ? 'rounded-[22%]' : ''
        } ${
          variant === 'emblem'
            ? 'border border-blue-400/40 shadow-[0_0_12px_rgba(0,128,255,0.4)]'
            : variant === 'flat'
            ? ''
            : 'border border-blue-200/60 shadow-sm'
        }`}
      >
        {/* Soft Background Gradient like logo1.png */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#cce4ff] via-[#e2ecff] to-[#d6d8fb]" />
        
        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

        {/* The Exact Vector ESDY Infinity-Arrow Symbol */}
        <svg
          viewBox="0 0 100 100"
          className="w-[82%] h-[82%] relative z-10 drop-shadow-[0_1px_1px_rgba(0,50,150,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="esdyGradPrimary" x1="15%" y1="70%" x2="85%" y2="20%">
              <stop offset="0%" stopColor="#0072ff" />
              <stop offset="50%" stopColor="#0084ff" />
              <stop offset="100%" stopColor="#0057d9" />
            </linearGradient>
            <linearGradient id="esdyGradArrow" x1="20%" y1="80%" x2="90%" y2="15%">
              <stop offset="0%" stopColor="#0088ff" />
              <stop offset="100%" stopColor="#0050d0" />
            </linearGradient>
          </defs>

          {/* Left Loop of Infinity (forms 'e' glyph with horizontal bar) */}
          <path
            d="M 46 38 
               C 42 28, 24 28, 20 40 
               C 16 52, 22 66, 36 66 
               C 46 66, 52 56, 56 50"
            stroke="url(#esdyGradPrimary)"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Middle bar for the letter 'E' inside left loop */}
          <path
            d="M 19 46 L 36 46"
            stroke="url(#esdyGradPrimary)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Right Loop of Infinity */}
          <path
            d="M 52 48
               C 56 40, 64 33, 74 36 
               C 84 39, 86 52, 80 62 
               C 74 72, 60 70, 52 60
               C 48 55, 45 48, 41 43"
            stroke="url(#esdyGradPrimary)"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Ascending Diagonal Arrow Shaft */}
          <path
            d="M 37 66 L 79 24"
            stroke="url(#esdyGradArrow)"
            strokeWidth="7.5"
            strokeLinecap="round"
          />

          {/* Arrow Head (pointing ↗) */}
          <path
            d="M 64 22 L 82 21 L 83 39"
            stroke="url(#esdyGradArrow)"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Optional Text Labels */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span className="font-sans font-bold text-sm sm:text-base leading-tight tracking-tight text-blue-600 dark:text-blue-400 drop-shadow-sm">
            {text}
          </span>
          {subtext && (
            <span className="text-[10px] text-zinc-400 font-tech uppercase tracking-wider">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
