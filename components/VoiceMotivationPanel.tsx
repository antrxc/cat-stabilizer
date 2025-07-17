'use client';

import { useEffect, useState } from 'react';
import type { VoicePrompt } from '@/types';

interface VoiceMotivationPanelProps {
  lastVoiceMessage: VoicePrompt | null;
  motivationalPrompt: string;
}

export const VoiceMotivationPanel = ({ lastVoiceMessage, motivationalPrompt }: VoiceMotivationPanelProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const getMessageIcon = (type: VoicePrompt['type']) => {
    switch (type) {
      case 'motivation': return '💪';
      case 'instruction': return '📋';
      case 'alert': return '⚠️';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Voice & Motivation</h2>
      
      <div className="space-y-4">
        {/* Last Voice Message */}
        {lastVoiceMessage && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getMessageIcon(lastVoiceMessage.type)}</span>
              <span className="text-sm text-gray-600">Last Voice Message</span>
            </div>
            <p className="text-gray-800 italic">"{lastVoiceMessage.message}"</p>
            <div className="text-xs text-gray-500 mt-1">
              {isHydrated ? lastVoiceMessage.timestamp.toLocaleTimeString() : 'Loading...'}
            </div>
          </div>
        )}

        {/* Motivational Prompt */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎯</span>
            <span className="text-sm font-medium text-blue-800">Motivation</span>
          </div>
          <p className="text-blue-900 font-medium">{motivationalPrompt}</p>
        </div>

        {/* Voice Controls */}
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
            🔊 Play Last Message
          </button>
          <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm">
            🔇 Mute
          </button>
        </div>
      </div>
    </div>
  );
};
