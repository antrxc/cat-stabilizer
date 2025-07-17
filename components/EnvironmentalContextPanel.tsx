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
    if (level > 80) return 'text-red-600';
    if (level > 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Environmental Context</h2>
      
      <div className="space-y-4">
        {/* Weather Widget */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getWeatherIcon(data.weatherCondition)}</span>
            <div>
              <div className="font-medium text-gray-800">{data.weatherCondition}</div>
              <div className="text-sm text-gray-600">{data.temperature}°C</div>
            </div>
          </div>
        </div>

        {/* Site Activity */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Site Activity</span>
          <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
            {data.nearbyMachines} machines nearby
          </span>
        </div>

        {/* Noise Level */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Noise Level</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full transition-all ${
                  data.noiseLevel > 80 ? 'bg-red-500' : 
                  data.noiseLevel > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(data.noiseLevel, 100)}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${getNoiseColor(data.noiseLevel)}`}>
              {data.noiseLevel} dB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
