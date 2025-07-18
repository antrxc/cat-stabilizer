'use client';

import { useEffect, useState } from 'react';

interface CriticalAlert {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

interface CriticalAlertPanelProps {
  alerts: CriticalAlert[];
}

export const CriticalAlertPanel = ({ alerts }: CriticalAlertPanelProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const getSeverityStyles = (severity: CriticalAlert['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-900/30 border-red-600 text-red-200';
      case 'medium': return 'bg-yellow-900/30 border-yellow-600 text-yellow-200';
      case 'low': return 'bg-cyan-900/30 border-cyan-600 text-cyan-200';
    }
  };

  const getSeverityIcon = (severity: CriticalAlert['severity']) => {
    switch (severity) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-green-900/30 border border-green-700 rounded-lg p-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <div className="text-2xl font-bold text-green-200">All Systems Normal</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Critical Alerts</h2>
      {alerts.map((alert) => (
        <div 
          key={alert.id}
          className={`border-2 rounded-lg p-6 ${getSeverityStyles(alert.severity)}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getSeverityIcon(alert.severity)}</span>
            <div>
              <div className="text-2xl font-bold mb-1">{alert.message}</div>
              <div className="text-sm opacity-75">
                {isHydrated ? alert.timestamp.toLocaleTimeString() : 'Loading...'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
