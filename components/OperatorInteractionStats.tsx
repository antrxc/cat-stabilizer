'use client';

import type { OperatorStats } from '@/types';

interface OperatorInteractionStatsProps {
  stats: OperatorStats;
}

export const OperatorInteractionStats = ({ stats }: OperatorInteractionStatsProps) => {
  const getPatternColor = (pattern: OperatorStats['joystickPattern']) => {
    switch (pattern) {
      case 'Steady': return 'bg-green-900 text-green-200 border border-green-600';
      case 'Normal': return 'bg-orange-900 text-orange-200 border border-orange-600';
      case 'Erratic': return 'bg-red-900 text-red-200 border border-red-600';
    }
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 200) return 'text-green-400';
    if (time < 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-2xl p-6 font-mono border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-green-400">👤 Operator Interaction Stats</h2>
      
      <div className="space-y-4">
        {/* Clicks per Minute */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">🖱️ Clicks per Minute</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700">
              <span className="text-lg font-bold text-pink-400 font-mono">{stats.clicksPerMinute}</span>
            </div>
            <span className="text-xs text-gray-400 font-mono">CPM</span>
          </div>
        </div>

        {/* Alert Response Time */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">⚡ Alert Response Time</span>
          <span className={`text-sm font-medium font-mono ${getResponseTimeColor(stats.alertResponseTime)}`}>
            {stats.alertResponseTime}ms
          </span>
        </div>

        {/* Joystick Pattern */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">🕹️ Joystick Pattern</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium font-mono ${getPatternColor(stats.joystickPattern)}`}>
            {stats.joystickPattern}
          </span>
        </div>

        {/* Performance Graph Placeholder */}
        <div className="pt-2 border-t border-gray-700">
          <div className="text-sm text-gray-300 mb-2">📈 Performance Trend</div>
          <div className="h-16 bg-gray-800 rounded flex items-end justify-between px-2 py-2 border border-gray-700">
            {[65, 72, 68, 75, 80, 78, 82].map((value, index) => (
              <div 
                key={index}
                className="bg-cyan-400 rounded-t w-4 transition-all duration-300"
                style={{ height: `${(value / 100) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
