'use client';

import { useState } from 'react';

interface ResetPausePromptProps {
  onAcknowledge: () => void;
  onSkip: () => void;
}

export const ResetPausePrompt = ({ onAcknowledge, onSkip }: ResetPausePromptProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleAcknowledge = () => {
    setIsVisible(false);
    onAcknowledge();
    // Show again after a delay
    setTimeout(() => setIsVisible(true), 300000); // 5 minutes
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip();
    // Show again after a shorter delay
    setTimeout(() => setIsVisible(true), 60000); // 1 minute
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
      <div className="text-center">
        <div className="text-4xl mb-4">🧘</div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">Take a Breather</h2>
        <p className="text-lg text-green-700 mb-6">
          High cognitive load detected. Consider taking a 10-second break to reset your focus.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleAcknowledge}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-lg"
          >
            ✅ Acknowledge & Resume
          </button>
          <button
            onClick={handleSkip}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors text-lg"
          >
            ⏭️ Skip for Now
          </button>
        </div>

        <div className="mt-4 text-sm text-green-600">
          Taking short breaks can improve focus and reduce errors
        </div>
      </div>
    </div>
  );
};
