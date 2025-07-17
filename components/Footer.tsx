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
    <footer className="bg-gray-50 border-t border-gray-200 p-4 mt-8">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>Last Updated: {isHydrated ? lastUpdated || 'Loading...' : 'Loading...'}</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Data processed locally</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span>🔒 Privacy Protected</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};
