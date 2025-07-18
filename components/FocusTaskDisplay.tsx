'use client';

import type { Task } from '@/types';

interface FocusTaskDisplayProps {
  currentTask: Task | null;
}

export const FocusTaskDisplay = ({ currentTask }: FocusTaskDisplayProps) => {
  if (!currentTask) {
    return (
      <div className="bg-black rounded-lg shadow-md p-8 text-center border border-gray-800">
        <div className="text-gray-400 text-2xl mb-4">📋</div>
        <h2 className="text-3xl font-bold text-white mb-2">No Active Task</h2>
        <p className="text-gray-300 text-lg">Please select a task to begin</p>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg shadow-md p-8 border border-gray-800">
      <div className="text-center">
        <div className="text-4xl mb-4">🎯</div>
        <div className="text-sm text-gray-400 mb-2">CURRENT TASK</div>
        <h2 className="text-4xl font-bold text-white mb-4">{currentTask.title}</h2>
        
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="text-lg text-gray-300">
            Duration: <span className="font-semibold">{currentTask.duration} min</span>
          </div>
          <div className="w-px h-6 bg-gray-600" />
          <div className="text-lg text-gray-300">
            Progress: <span className="font-semibold">{currentTask.progress}%</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="w-full bg-gray-800 rounded-full h-4">
            <div 
              className="bg-green-400 h-4 rounded-full transition-all duration-500"
              style={{ width: `${currentTask.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-400">
          <span>🎯</span>
          <span>Stay Focused</span>
        </div>
      </div>
    </div>
  );
};
