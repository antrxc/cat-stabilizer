'use client';

import type { OperatorStats } from '@/types';

interface OperatorInteractionStatsProps {
  stats: OperatorStats;
}

export const OperatorInteractionStats = ({ stats }: OperatorInteractionStatsProps) => {
  const getPatternColor = (pattern: OperatorStats['joystickPattern']) => {
    switch (pattern) {
      case 'Steady': return 'bg-green-100 text-green-800';
      case 'Normal': return 'bg-blue-100 text-blue-800';
      case 'Erratic': return 'bg-red-100 text-red-800';
    }
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 200) return 'text-green-600';
    if (time < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Operator Interaction Stats</h2>
      
      <div className="space-y-4">
        {/* Clicks per Minute */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Clicks per Minute</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-8 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-lg font-bold text-blue-600">{stats.clicksPerMinute}</span>
            </div>
            <span className="text-xs text-gray-500">CPM</span>
          </div>
        </div>

        {/* Alert Response Time */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Alert Response Time</span>
          <span className={`text-sm font-medium ${getResponseTimeColor(stats.alertResponseTime)}`}>
            {stats.alertResponseTime}ms
          </span>
        </div>

        {/* Joystick Pattern */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Joystick Pattern</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPatternColor(stats.joystickPattern)}`}>
            {stats.joystickPattern}
          </span>
        </div>

        {/* Performance Graph Placeholder */}
        <div className="pt-2 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Performance Trend</div>
          <div className="h-16 bg-gray-100 rounded flex items-end justify-between px-2 py-2">
            {[65, 72, 68, 75, 80, 78, 82].map((value, index) => (
              <div 
                key={index}
                className="bg-blue-500 rounded-t w-4 transition-all duration-300"
                style={{ height: `${(value / 100) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
