'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'white';
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  asLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  showSubtitle = true,
  size = 'md',
  asLink = true,
}) => {
  const sizeClasses = {
    sm: { icon: 'w-7 h-7', title: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', title: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', title: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', title: 'text-3xl', sub: 'text-sm' },
  }[size];

  const textColor = {
    dark: 'text-slate-900',
    light: 'text-slate-100',
    white: 'text-white',
  }[variant];

  const subColor = {
    dark: 'text-slate-500',
    light: 'text-slate-400',
    white: 'text-blue-200',
  }[variant];

  const logoContent = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-Precision Engineering Brand Icon */}
      <div className={`relative flex-shrink-0 ${sizeClasses.icon} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 rounded-xl shadow-md rotate-3 transition-transform group-hover:rotate-6"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-amber-400 opacity-90 rounded-xl blur-[2px] -z-10 transform scale-95"></div>
        
        {/* Dynamic Vector SVG Geometry */}
        <svg
          viewBox="0 0 40 40"
          className="relative w-4/5 h-4/5 text-white drop-shadow"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Engineering Gear/Hexagon Matrix */}
          <polygon
            points="20,4 34,12 34,28 20,36 6,28 6,12"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-100/90"
          />
          {/* Lightning Velocity Bolt */}
          <path
            d="M22 8L12 21H20L18 32L28 19H20L22 8Z"
            fill="#F59E0B"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Corporate Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight ${sizeClasses.title} ${textColor}`}>
            FAST
          </span>
          <span className={`font-extrabold tracking-tight ${sizeClasses.title} text-blue-600`}>
            SERVICES
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`font-semibold tracking-widest uppercase mt-0.5 ${sizeClasses.sub} ${subColor}`}
          >
            FAST ENGINEERING SOLUTIONS
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="group inline-flex items-center focus:outline-none">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};
