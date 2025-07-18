'use client';

import type { Task } from '@/types';

interface TaskDashboardProps {
  tasks: Task[];
}

export const TaskDashboard = ({ tasks }: TaskDashboardProps) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High': return 'bg-red-900 text-red-200 border border-red-600';
      case 'Medium': return 'bg-yellow-900 text-yellow-200 border border-yellow-600';
      case 'Low': return 'bg-green-900 text-green-200 border border-green-600';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-2xl p-6 font-mono border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-green-400">📋 Task Dashboard</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`p-4 rounded-lg border-l-4 transition-all ${
              task.isActive 
                ? 'border-cyan-400 bg-cyan-900/20 shadow-lg shadow-cyan-500/20' 
                : 'border-gray-600 bg-gray-800/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-medium ${task.isActive ? 'text-cyan-300' : 'text-gray-300'}`}>
                {task.isActive ? '▶️' : '⏸️'} {task.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority === 'High' ? '🔥' : task.priority === 'Medium' ? '⚠️' : '📋'} {task.priority}
              </span>
            </div>
            
            <div className="text-sm text-gray-400 mb-2 font-mono">
              Type: {task.type} • Duration: {task.duration}min
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    task.isActive ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 font-mono">{task.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
