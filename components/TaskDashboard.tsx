'use client';

import type { Task } from '@/types';

interface TaskDashboardProps {
  tasks: Task[];
}

export const TaskDashboard = ({ tasks }: TaskDashboardProps) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Task Dashboard</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`p-4 rounded-lg border-l-4 transition-all ${
              task.isActive 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-medium ${task.isActive ? 'text-blue-800' : 'text-gray-800'}`}>
                {task.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              Type: {task.type} • Duration: {task.duration}min
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    task.isActive ? 'bg-blue-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{task.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
