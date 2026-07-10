import React from "react";

interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  iconSize = 32,
  showText = true,
  showSubtitle = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* SVG Icon */}
      <svg
        width={iconSize}
        height={iconSize * 0.8}
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          {/* Main linear gradient for the infinity loop path */}
          <linearGradient id="logo-grad-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FA5C30" />
            <stop offset="50%" stopColor="#FC2A6D" />
            <stop offset="100%" stopColor="#8F3DFF" />
          </linearGradient>
          
          {/* Mask to create the clean diagonal cut on the upper right loop */}
          <mask id="logo-cut-mask">
            <rect x="0" y="0" width="100" height="80" fill="white" />
            <line
              x1="64"
              y1="34"
              x2="74"
              y2="24"
              stroke="black"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          </mask>
        </defs>

        {/* Base Infinity Loop */}
        <path
          d="M 50 42 C 37 26, 16 26, 16 42 C 16 58, 37 58, 50 42 C 63 26, 84 26, 84 42 C 84 58, 63 58, 50 42"
          fill="none"
          stroke="url(#logo-grad-line)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          mask="url(#logo-cut-mask)"
        />

        {/* Overlapping segment to create the 3D ribbon crossover */}
        <path
          d="M 40 51 L 60 33"
          fill="none"
          stroke="url(#logo-grad-line)"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* The two decorative dots above the loop */}
        <circle cx="43" cy="18" r="4.5" fill="#FA5C30" />
        <circle cx="57" cy="18" r="4.5" fill="#8F3DFF" />
      </svg>

      {showText && (
        <div className="flex flex-col justify-center leading-none text-left">
          <span className="font-display text-xl font-bold text-foreground tracking-tight select-none">
            event<span className="text-gradient font-extrabold">wa</span>
          </span>
          {showSubtitle && (
            <div className="text-[9px] font-display font-bold tracking-[0.18em] uppercase mt-1 select-none whitespace-nowrap">
              <span className="text-[#FA5C30]">experiences.</span>{" "}
              <span className="text-[#8F3DFF]">connected.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
