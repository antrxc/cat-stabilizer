import type { Task, MachineStatus, EnvironmentalData, OperatorStats, VoicePrompt, Settings } from '@/types';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Excavate Sector A',
    type: 'Excavation',
    duration: 45,
    progress: 75,
    priority: 'High',
    isActive: true
  },
  {
    id: '2',
    title: 'Load Material Transport',
    type: 'Loading',
    duration: 30,
    progress: 45,
    priority: 'Medium',
    isActive: false
  },
  {
    id: '3',
    title: 'Safety Inspection',
    type: 'Inspection',
    duration: 15,
    progress: 90,
    priority: 'Low',
    isActive: false
  }
];

export const mockMachineStatus: MachineStatus = {
  engineLoad: 72,
  fuelLevel: 85,
  idlingTime: 12,
  seatbeltFastened: true,
  alerts: ['Scheduled maintenance due in 2 hours']
};

export const mockEnvironmentalData: EnvironmentalData = {
  temperature: 22,
  weatherCondition: 'Cloudy',
  nearbyMachines: 5,
  noiseLevel: 68
};

export const mockOperatorStats: OperatorStats = {
  clicksPerMinute: 45,
  alertResponseTime: 320,
  joystickPattern: 'Steady'
};

export const mockVoicePrompts: VoicePrompt[] = [
  {
    message: 'Great progress on the excavation! You\'re 75% complete.',
    timestamp: new Date('2024-01-01T10:00:00Z'), // Fixed timestamp to prevent hydration issues
    type: 'motivation'
  },
  {
    message: 'Focus on excavation in Sector A',
    timestamp: new Date('2024-01-01T10:05:00Z'), // Fixed timestamp to prevent hydration issues
    type: 'instruction'
  }
];

export const mockSettings: Settings = {
  monitoringEnabled: true,
  promptStyle: 'conversational'
};

export const mockCriticalAlerts = [
  {
    id: '1',
    message: 'Low Fuel Level',
    severity: 'medium' as const,
    timestamp: new Date('2024-01-01T09:30:00Z')
  },
  {
    id: '2',
    message: 'Obstacle Ahead',
    severity: 'high' as const,
    timestamp: new Date('2024-01-01T09:45:00Z')
  }
];

export const getMotivationalPrompt = (progress: number): string => {
  if (progress >= 80) return 'Excellent work! You\'re almost done – keep up the momentum!';
  if (progress >= 60) return 'You\'re 60% done – great pace! Stay focused.';
  if (progress >= 40) return 'Making solid progress! Keep pushing forward.';
  if (progress >= 20) return 'Good start! Building momentum nicely.';
  return 'Ready to tackle this task! You\'ve got this.';
};
