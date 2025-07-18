'use client';

import { useEffect, useState } from 'react';

interface FooterProps {
  lastUpdated: string;
}

export const Footer = ({ lastUpdated }: FooterProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <footer className="bg-gray-900 border-t border-gray-800 p-4 mt-8">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <span>Last Updated: {isHydrated ? lastUpdated || 'Loading...' : 'Loading...'}</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Data processed locally</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span>🔒 Privacy Protected</span>
          <span className="text-cyan-400">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};
