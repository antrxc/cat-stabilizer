'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '@/utils/apiService';
import type { ApiPredictionRequest } from '@/types';

interface CognitiveLoadData {
  score: number;
  mode: 'standard' | 'minimal';
  isLoading: boolean;
  lastUpdated: string;
}

export function useCognitiveLoad(): CognitiveLoadData {
  const [score, setScore] = useState<number>(45);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  // Fetch cognitive load score from API
  useEffect(() => {
    if (!isHydrated) return;

    const fetchCognitiveLoad = async () => {
      setIsLoading(true);
      
      try {
        // Get score from API with default operational features
        const defaultFeatures: ApiPredictionRequest = {
          active_tasks: 3,
          avg_task_duration: 30,
          priority_high: 0.3,
          priority_medium: 0.5,
          priority_low: 0.2,
          task_type_excavation: 1,
          task_type_navigation: 0,
          task_type_communication: 0,
          task_type_other: 0,
          noise_level: 60,
          site_activity: 25,
          temperature: 25,
          touchscreen_inputs: 20,
          alert_response_time: 3,
          joystick_pattern_erratic: 0,
        };
        
        const response = await ApiService.predictScore(defaultFeatures);
        setScore(response.score);
      } catch (error) {
        // Fallback to random score if API fails
        const newScore = Math.floor(Math.random() * 70) + 20;
        setScore(newScore);
      }
      
      setLastUpdated(new Date().toLocaleTimeString());
      setIsLoading(false);
    };

    // Initial fetch
    fetchCognitiveLoad();

    // Set up interval to fetch every 30 seconds
    const interval = setInterval(fetchCognitiveLoad, 30000);

    return () => clearInterval(interval);
  }, [isHydrated]);

  const mode: 'standard' | 'minimal' = score > 70 ? 'minimal' : 'standard';

  return {
    score,
    mode,
    isLoading,
    lastUpdated: isHydrated ? lastUpdated : '',
  };
}
