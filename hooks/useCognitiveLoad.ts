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
          "features": [
            3,     // active_tasks
            30,    // avg_task_duration
            0.3,   // priority_high
            0.5,   // priority_medium
            0.2,   // priority_low
            1,     // task_type_excavation
            0,     // task_type_navigation
            0,     // task_type_communication
            0,     // task_type_other
            60,    // noise_level
            25,    // site_activity
            25,    // temperature
            20,    // touchscreen_inputs
            3,     // alert_response_time
            0,     // joystick_pattern_erratic
          ]
        };
        
        const response = await ApiService.predictScore(defaultFeatures);
        console.log('Fetched cognitive load score from API:', response.score);
        setScore(response.score);
      } catch (error) {
        // Fallback calculation using cognitive load formula if API fails
        console.error('Failed to fetch cognitive load:', error);
        
        // Use the same default features for fallback calculation
        const active_tasks = 3;
        const avg_task_duration = 30;
        const priority_high = 0.3;
        const noise_level = 60;
        const site_activity = 25;
        const touchscreen_inputs = 20;
        const alert_response_time = 3;
        const joystick_pattern_erratic = 0;
        
        // Apply cognitive load formula
        const cognitive_load_score = (
          0.3 * active_tasks / 10 +
          0.2 * avg_task_duration / 60 +
          0.2 * priority_high +
          0.1 * noise_level / 120 +
          0.1 * site_activity / 50 +
          0.05 * touchscreen_inputs / 50 +
          0.05 * alert_response_time / 10 +
          0.05 * joystick_pattern_erratic
        ) * 100;
        
        const newScore = Math.min(95, Math.max(20, Math.floor(cognitive_load_score)));
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
