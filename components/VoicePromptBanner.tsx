'use client';

import { useState, useEffect } from 'react';
import type { VoicePrompt } from '@/types';

interface VoicePromptBannerProps {
  currentPrompt: VoicePrompt | null;
  onPlayAudio: () => void;
  onPausePrompt: () => void;
}

export const VoicePromptBanner = ({ currentPrompt, onPlayAudio, onPausePrompt }: VoicePromptBannerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handlePlayAudio = () => {
    setIsPlaying(true);
    onPlayAudio();
    // Simulate audio playback duration
    setTimeout(() => setIsPlaying(false), 3000);
  };

  if (!currentPrompt) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
        <div className="text-2xl text-gray-400 mb-2">🔇</div>
        <div className="text-xl text-gray-300">No active voice prompt</div>
      </div>
    );
  }

  return (
    <div className="bg-purple-900/30 border-2 border-purple-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-purple-200">Voice Prompt</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePlayAudio}
            disabled={isPlaying}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isPlaying 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-cyan-600 text-white hover:bg-cyan-700'
            }`}
          >
            {isPlaying ? '🔊 Playing...' : '🔊 Play Audio'}
          </button>
          <button
            onClick={onPausePrompt}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ⏸️ Pause
          </button>
        </div>
      </div>

      <div className="bg-black rounded-lg p-4 border border-purple-600">
        <div className="text-2xl text-purple-200 font-bold mb-2">
          "{currentPrompt.message}"
        </div>
        <div className="text-sm text-purple-300">
          {currentPrompt.type.charAt(0).toUpperCase() + currentPrompt.type.slice(1)} • {isHydrated ? currentPrompt.timestamp.toLocaleTimeString() : 'Loading...'}
        </div>
      </div>

      {/* Audio Visualization */}
      {isPlaying && isHydrated && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-end gap-1 h-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <div 
                key={index}
                className="w-2 bg-cyan-400 rounded-t animate-pulse"
                style={{ 
                  height: `${(index % 3 + 1) * 8 + 8}px`,
                  animationDelay: `${index * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
