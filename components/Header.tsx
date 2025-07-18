'use client';

import Link from 'next/link';
import type { UIMode } from '@/types';

interface HeaderProps {
  score: number;
  mode: UIMode;
  isLoading: boolean;
}

export const Header = ({ score, mode, isLoading }: HeaderProps) => {
  console.log('Header rendering with score:', score, 'mode:', mode, 'timestamp:', new Date().toLocaleTimeString());
  const isMinimal = mode === 'minimal';
  
  return (
    <header className={`w-full p-4 ${isMinimal ? 'bg-gray-900' : 'bg-gray-900'} text-white font-mono border-b border-gray-800`}>
      <div className="flex items-center justify-between">
        <h1 className={`font-bold ${isMinimal ? 'text-xl' : 'text-2xl'} text-green-400`}>
          ⚡ Cognitive Load Balancer
        </h1>
        
        <div className="flex items-center gap-4">
          {/* Navigation Links */}
          <div className="flex gap-2">
            <Link 
              href="/"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              Dashboard
            </Link>
            <Link 
              href="/features"
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
            >
              Features
            </Link>
          </div>
          
          {/* Score Indicator */}
          <div className="flex flex-col items-end">
            <div className={`text-sm opacity-80 ${isMinimal ? 'text-base' : ''} font-mono text-gray-300`}>
              Score: {isLoading ? '...' : `${score}/100`}
            </div>
            <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  score > 70 ? 'bg-red-400' : score > 40 ? 'bg-yellow-400' : 'bg-green-400'
                }`}
                style={{ width: `${Math.min(score, 100)}%` }}
              />
            </div>
          </div>
          
          {/* Mode Status Chip */}
          <div className={`px-3 py-1 rounded-full text-sm font-medium font-mono border ${
            isMinimal 
              ? 'bg-red-900 text-red-200 border-red-600' 
              : 'bg-green-900 text-green-200 border-green-600'
          }`}>
            {isMinimal ? '🔻 Minimal Mode (High Load)' : '📊 Standard Mode'}
          </div>
        </div>
      </div>
    </header>
  );
};
