'use client';

import type { MachineStatus } from '@/types';

interface MachineStatusPanelProps {
  status: MachineStatus;
}

export const MachineStatusPanel = ({ status }: MachineStatusPanelProps) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow-2xl p-6 font-mono border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-green-400">🏭 Machine Status</h2>
      
      <div className="space-y-4">
        {/* Engine Load Gauge */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">⚡ Engine Load</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-3 bg-gray-800 rounded-full">
              <div 
                className={`h-3 rounded-full transition-all ${
                  status.engineLoad > 80 ? 'bg-red-400' : 
                  status.engineLoad > 60 ? 'bg-yellow-400' : 'bg-green-400'
                }`}
                style={{ width: `${status.engineLoad}%` }}
              />
            </div>
            <span className="text-sm font-medium font-mono text-white">{status.engineLoad}%</span>
          </div>
        </div>

        {/* Fuel Level */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">⛽ Fuel Level</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-3 bg-gray-800 rounded-full">
              <div 
                className={`h-3 rounded-full transition-all ${
                  status.fuelLevel < 20 ? 'bg-red-400' : 
                  status.fuelLevel < 40 ? 'bg-yellow-400' : 'bg-green-400'
                }`}
                style={{ width: `${status.fuelLevel}%` }}
              />
            </div>
            <span className="text-sm font-medium font-mono text-white">{status.fuelLevel}%</span>
          </div>
        </div>

        {/* Idling Time */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">⏰ Idling Time</span>
          <span className="text-sm font-medium font-mono text-white">{status.idlingTime}min</span>
        </div>

        {/* Safety Alerts */}
        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">🛡️ Safety Status</span>
            <span className={`text-sm px-2 py-1 rounded font-mono border ${
              status.seatbeltFastened ? 'bg-green-900 text-green-200 border-green-600' : 'bg-red-900 text-red-200 border-red-600'
            }`}>
              Seatbelt {status.seatbeltFastened ? '✅' : '❌'}
            </span>
          </div>
          
          {status.alerts.length > 0 && (
            <div className="space-y-1">
              {status.alerts.map((alert, index) => (
                <div key={index} className="text-sm bg-yellow-900 text-yellow-200 px-2 py-1 rounded font-mono border border-yellow-600">
                  ⚠️ {alert}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
