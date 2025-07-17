'use client';

import { useState, useEffect } from 'react';

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

  // Simulate API call to fetch cognitive load score
  useEffect(() => {
    if (!isHydrated) return;

    const fetchCognitiveLoad = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a random score between 20-90 for demo purposes
      const newScore = Math.floor(Math.random() * 70) + 20;
      setScore(newScore);
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
