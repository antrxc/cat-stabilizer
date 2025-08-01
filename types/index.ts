export interface CognitiveScore {
  score: number;
  timestamp: Date;
}

export interface Task {
  id: string;
  title: string;
  type: string;
  duration: number;
  progress: number;
  priority: 'High' | 'Medium' | 'Low';
  isActive: boolean;
}

export interface MachineStatus {
  engineLoad: number;
  fuelLevel: number;
  idlingTime: number;
  seatbeltFastened: boolean;
  alerts: string[];
}

export interface EnvironmentalData {
  temperature: number;
  weatherCondition: string;
  nearbyMachines: number;
  noiseLevel: number;
}

export interface OperatorStats {
  clicksPerMinute: number;
  alertResponseTime: number;
  joystickPattern: 'Steady' | 'Erratic' | 'Normal';
}

export interface VoicePrompt {
  message: string;
  timestamp: Date;
  type: 'motivation' | 'instruction' | 'alert';
}

export type UIMode = 'standard' | 'minimal';

export interface Settings {
  monitoringEnabled: boolean;
  promptStyle: 'concise' | 'conversational';
}

export interface FeatureLevel {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  description: string;
  unit?: string;
}

export interface FeatureAdjustment {
  features: FeatureLevel[];
}

export interface ApiPredictionRequest {
  features: number[];
}

export interface ApiPredictionResponse {
  score: number;
  prediction?: string;
  confidence?: number;
}
