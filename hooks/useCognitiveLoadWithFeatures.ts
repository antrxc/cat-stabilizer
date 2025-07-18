'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/utils/apiService';
import type { MLFeatures, PredictionResponse } from '@/types';

interface CognitiveLoadData {
  score: number;
  mode: 'standard' | 'minimal';
  isLoading: boolean;
  lastUpdated: string;
  features: MLFeatures;
  updateFeatures: (features: MLFeatures) => void;
  predictWithCurrentFeatures: () => Promise<void>;
}

// Default feature values based on typical working conditions
const defaultFeatures: MLFeatures = {
  active_tasks: 3,
  avg_task_duration: 25,
  priority_high: 0.2,
  priority_medium: 0.5,
  priority_low: 0.3,
  task_type_excavation: 1,
  task_type_navigation: 0,
  task_type_communication: 0,
  task_type_other: 0,
  noise_level: 65,
  site_activity: 8,
  temperature: 22,
  touchscreen_inputs: 15,
  alert_response_time: 2.5,
  joystick_pattern_erratic: 0.3,
};

export function useCognitiveLoadWithFeatures(): CognitiveLoadData {
  const [score, setScore] = useState<number>(45);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [features, setFeatures] = useState<MLFeatures>(defaultFeatures);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  // Fetch cognitive load using current features
  const fetchCognitiveLoad = async (currentFeatures: MLFeatures = features) => {
    setIsLoading(true);
    
    try {
      const result = await apiService.predictCognitiveLoad(currentFeatures);
      setScore(result.score);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      // This should rarely happen since apiService handles errors internally
      console.warn('Unexpected error in cognitive load fetch:', error);
      // Final fallback
      const fallbackScore = Math.floor(Math.random() * 70) + 20;
      setScore(fallbackScore);
      setLastUpdated(new Date().toLocaleTimeString());
    }
    
    setIsLoading(false);
  };

  // Initial fetch and periodic updates
  useEffect(() => {
    if (!isHydrated) return;

    // Initial fetch
    fetchCognitiveLoad();

    // Set up interval to fetch every 30 seconds with current features
    const interval = setInterval(() => fetchCognitiveLoad(), 30000);

    return () => clearInterval(interval);
  }, [isHydrated, features]);

  const updateFeatures = (newFeatures: MLFeatures) => {
    setFeatures(newFeatures);
  };

  const predictWithCurrentFeatures = async () => {
    await fetchCognitiveLoad(features);
  };

  const mode: 'standard' | 'minimal' = score > 70 ? 'minimal' : 'standard';

  return {
    score,
    mode,
    isLoading,
    lastUpdated: isHydrated ? lastUpdated : '',
    features,
    updateFeatures,
    predictWithCurrentFeatures,
  };
}
