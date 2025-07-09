import React from 'react';
import { YouTubeIcon } from './icons';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-red-600 p-[6px] rounded-lg shadow-sm">
        <YouTubeIcon className="text-white w-5 h-5" />
      </div>
      <span className="text-2xl font-bold tracking-tight">
        <span className="text-red-600">shorts</span>
        <span className="text-purple-700">hub</span>
        <span className="text-sky-500">.app</span>
      </span>
    </div>
  );
};
