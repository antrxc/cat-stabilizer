'use client';

import type { UIMode } from '@/types';

interface HeaderProps {
  score: number;
  mode: UIMode;
  isLoading: boolean;
}

export const Header = ({ score, mode, isLoading }: HeaderProps) => {
  const isMinimal = mode === 'minimal';
  
  return (
    <header className={`w-full p-4 ${isMinimal ? 'bg-gray-600' : 'bg-blue-600'} text-white`}>
      <div className="flex items-center justify-between">
        <h1 className={`font-bold ${isMinimal ? 'text-xl' : 'text-2xl'}`}>
          Cognitive Load Balancer
        </h1>
        
        <div className="flex items-center gap-4">
          {/* Score Indicator */}
          <div className="flex flex-col items-end">
            <div className={`text-sm opacity-80 ${isMinimal ? 'text-base' : ''}`}>
              Score: {isLoading ? '...' : score}
            </div>
            <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  score > 70 ? 'bg-red-400' : score > 40 ? 'bg-yellow-400' : 'bg-green-400'
                }`}
                style={{ width: `${Math.min(score, 100)}%` }}
              />
            </div>
          </div>
          
          {/* Mode Status Chip */}
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isMinimal 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {isMinimal ? 'Minimal Mode (High Load)' : 'Standard Mode'}
          </div>
        </div>
      </div>
    </header>
  );
};
