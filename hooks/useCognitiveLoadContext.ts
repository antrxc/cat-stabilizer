'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CognitiveLoadContextType {
  score: number;
  mode: 'standard' | 'minimal';
  lastUpdated: string;
  isLoading: boolean;
  updateScore: (score: number) => void;
  setLoading: (loading: boolean) => void;
}

const CognitiveLoadContext = createContext<CognitiveLoadContextType | undefined>(undefined);

export function CognitiveLoadProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState<number>(45);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Handle hydration and load from localStorage
  useEffect(() => {
    setIsHydrated(true);
    console.log('Context: Hydrating...');
    
    // Load score and timestamp from localStorage if available
    const savedScore = localStorage.getItem('cognitiveLoadScore');
    const savedTimestamp = localStorage.getItem('lastUpdated');
    
    console.log('Context: Loading from localStorage - score:', savedScore, 'timestamp:', savedTimestamp);
    
    if (savedScore) {
      const parsedScore = parseInt(savedScore, 10);
      console.log('Context: Setting score from localStorage:', parsedScore);
      setScore(parsedScore);
    }
    
    if (savedTimestamp) {
      setLastUpdated(savedTimestamp);
    } else {
      setLastUpdated(new Date().toLocaleTimeString());
    }
  }, []);

  const updateScore = (newScore: number) => {
    console.log('Context: Updating score from', score, 'to', newScore, 'at', new Date().toLocaleTimeString());
    
    // Use React's flushSync to ensure immediate updates for real-time UX
    const timestamp = new Date().toLocaleTimeString();
    
    setScore(newScore);
    setLastUpdated(timestamp);
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('cognitiveLoadScore', newScore.toString());
      localStorage.setItem('lastUpdated', timestamp);
    }
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const mode: 'standard' | 'minimal' = score > 70 ? 'minimal' : 'standard';

  const value = {
    score,
    mode,
    lastUpdated: isHydrated ? lastUpdated : '',
    isLoading,
    updateScore,
    setLoading,
  };

  return React.createElement(
    CognitiveLoadContext.Provider,
    { value },
    children
  );
}

export function useCognitiveLoadContext() {
  const context = useContext(CognitiveLoadContext);
  if (context === undefined) {
    throw new Error('useCognitiveLoadContext must be used within a CognitiveLoadProvider');
  }
  return context;
}
