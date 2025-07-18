'use client';

import type { EnvironmentalData } from '@/types';

interface EnvironmentalContextPanelProps {
  data: EnvironmentalData;
}

export const EnvironmentalContextPanel = ({ data }: EnvironmentalContextPanelProps) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      default: return '🌤️';
    }
  };

  const getNoiseColor = (level: number) => {
    if (level > 80) return 'text-red-400';
    if (level > 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-2xl p-6 font-mono border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-green-400">🌍 Environmental Context</h2>
      
      <div className="space-y-4">
        {/* Weather Widget */}
        <div className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg border border-purple-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getWeatherIcon(data.weatherCondition)}</span>
            <div>
              <div className="font-medium text-purple-200">{data.weatherCondition}</div>
              <div className="text-sm text-purple-300">{data.temperature}°C</div>
            </div>
          </div>
        </div>

        {/* Site Activity */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">📡 Site Activity</span>
          <span className="text-sm font-medium bg-gray-800 text-cyan-300 px-2 py-1 rounded border border-gray-700">
            {data.nearbyMachines} machines nearby
          </span>
        </div>

        {/* Noise Level */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">🔊 Noise Level</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-800 rounded-full">
              <div 
                className={`h-2 rounded-full transition-all ${
                  data.noiseLevel > 80 ? 'bg-red-400' : 
                  data.noiseLevel > 60 ? 'bg-yellow-400' : 'bg-green-400'
                }`}
                style={{ width: `${Math.min(data.noiseLevel, 100)}%` }}
              />
            </div>
            <span className={`text-sm font-medium font-mono ${getNoiseColor(data.noiseLevel)}`}>
              {data.noiseLevel} dB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
