'use client';

import type { MachineStatus } from '@/types';

interface MachineStatusPanelProps {
  status: MachineStatus;
}

export const MachineStatusPanel = ({ status }: MachineStatusPanelProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Machine Status</h2>
      
      <div className="space-y-4">
        {/* Engine Load Gauge */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Engine Load</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-3 bg-gray-200 rounded-full">
              <div 
                className={`h-3 rounded-full transition-all ${
                  status.engineLoad > 80 ? 'bg-red-500' : 
                  status.engineLoad > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${status.engineLoad}%` }}
              />
            </div>
            <span className="text-sm font-medium">{status.engineLoad}%</span>
          </div>
        </div>

        {/* Fuel Level */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Fuel Level</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-3 bg-gray-200 rounded-full">
              <div 
                className={`h-3 rounded-full transition-all ${
                  status.fuelLevel < 20 ? 'bg-red-500' : 
                  status.fuelLevel < 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${status.fuelLevel}%` }}
              />
            </div>
            <span className="text-sm font-medium">{status.fuelLevel}%</span>
          </div>
        </div>

        {/* Idling Time */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Idling Time</span>
          <span className="text-sm font-medium">{status.idlingTime}min</span>
        </div>

        {/* Safety Alerts */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Safety Status</span>
            <span className={`text-sm px-2 py-1 rounded ${
              status.seatbeltFastened ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              Seatbelt {status.seatbeltFastened ? '✅' : '❌'}
            </span>
          </div>
          
          {status.alerts.length > 0 && (
            <div className="space-y-1">
              {status.alerts.map((alert, index) => (
                <div key={index} className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
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
