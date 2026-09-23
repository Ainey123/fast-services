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
    sm: { icon: 'w-8 h-8', title: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', title: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', title: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', title: 'text-3xl', sub: 'text-sm' },
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
      {/* Official FES Company Logo Emblem */}
      <div
        className={`relative flex-shrink-0 ${sizeClasses.icon} rounded-full bg-white p-0.5 shadow-md border border-slate-200/80 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105`}
      >
        <img
          src="/fes-logo.png"
          alt="FAST ENGINEERING SOLUTIONS"
          className="w-full h-full object-contain rounded-full"
        />
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

