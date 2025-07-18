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
    <div className="bg-gray-900 rounded-lg shadow-2xl p-6 font-mono border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-green-400">🎙️ Voice & Motivation</h2>
      
      <div className="space-y-4">
        {/* Last Voice Message */}
        {lastVoiceMessage && (
          <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getMessageIcon(lastVoiceMessage.type)}</span>
              <span className="text-sm text-gray-300 font-mono">Last Voice Message</span>
            </div>
            <p className="text-orange-300 italic font-mono">"{lastVoiceMessage.message}"</p>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              {isHydrated ? lastVoiceMessage.timestamp.toLocaleTimeString() : 'Loading...'}
            </div>
          </div>
        )}

        {/* Motivational Prompt */}
        <div className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎯</span>
            <span className="text-sm font-medium text-purple-300 font-mono">Motivation</span>
          </div>
          <p className="text-purple-200 font-medium font-mono">{motivationalPrompt}</p>
        </div>

        {/* Voice Controls */}
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 transition-colors text-sm font-mono border border-blue-600">
            🔊 Play Last Message
          </button>
          <button className="px-3 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors text-sm font-mono border border-gray-600">
            🔇 Mute
          </button>
        </div>
      </div>
    </div>
  );
};
