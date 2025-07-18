'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ApiService } from '@/utils/apiService';
import { useCognitiveLoadContext } from '@/hooks/useCognitiveLoadContext';
import type { FeatureLevel, ApiPredictionRequest } from '@/types';

const INITIAL_FEATURES: FeatureLevel[] = [
  {
    id: 'active_tasks',
    name: 'Active Tasks',
    value: 3,
    min: 0,
    max: 10,
    description: 'Number of concurrent tasks',
    unit: ''
  },
  {
    id: 'avg_task_duration',
    name: 'Average Task Duration',
    value: 30,
    min: 0,
    max: 60,
    description: 'Average task duration in minutes',
    unit: 'min'
  },
  {
    id: 'priority_high',
    name: 'High Priority Tasks',
    value: 0.3,
    min: 0,
    max: 1,
    description: 'Fraction of high-priority tasks',
    unit: ''
  },
  {
    id: 'priority_medium',
    name: 'Medium Priority Tasks',
    value: 0.5,
    min: 0,
    max: 1,
    description: 'Fraction of medium-priority tasks',
    unit: ''
  },
  {
    id: 'priority_low',
    name: 'Low Priority Tasks',
    value: 0.2,
    min: 0,
    max: 1,
    description: 'Fraction of low-priority tasks',
    unit: ''
  },
  {
    id: 'task_type_excavation',
    name: 'Excavation Task',
    value: 1,
    min: 0,
    max: 1,
    description: '1 if task is excavation, 0 otherwise',
    unit: ''
  },
  {
    id: 'task_type_navigation',
    name: 'Navigation Task',
    value: 0,
    min: 0,
    max: 1,
    description: '1 if task is navigation, 0 otherwise',
    unit: ''
  },
  {
    id: 'task_type_communication',
    name: 'Communication Task',
    value: 0,
    min: 0,
    max: 1,
    description: '1 if task is communication, 0 otherwise',
    unit: ''
  },
  {
    id: 'task_type_other',
    name: 'Other Task Type',
    value: 0,
    min: 0,
    max: 1,
    description: '1 if task is other type, 0 otherwise',
    unit: ''
  },
  {
    id: 'noise_level',
    name: 'Noise Level',
    value: 60,
    min: 0,
    max: 120,
    description: 'Noise level in decibels',
    unit: 'dB'
  },
  {
    id: 'site_activity',
    name: 'Site Activity',
    value: 25,
    min: 0,
    max: 50,
    description: 'Site activity level (e.g., number of active machines)',
    unit: ''
  },
  {
    id: 'temperature',
    name: 'Temperature',
    value: 25,
    min: -50,
    max: 60,
    description: 'Temperature in Celsius',
    unit: '°C'
  },
  {
    id: 'touchscreen_inputs',
    name: 'Touchscreen Inputs',
    value: 20,
    min: 0,
    max: 50,
    description: 'Number of touchscreen interactions',
    unit: ''
  },
  {
    id: 'alert_response_time',
    name: 'Alert Response Time',
    value: 3,
    min: 0,
    max: 10,
    description: 'Time to respond to alerts in seconds',
    unit: 's'
  },
  {
    id: 'joystick_pattern_erratic',
    name: 'Erratic Joystick Pattern',
    value: 0,
    min: 0,
    max: 1,
    description: 'Indicator of erratic joystick movements',
    unit: ''
  }
];

export default function FeatureAdjustmentPage() {
  const [features, setFeatures] = useState<FeatureLevel[]>(INITIAL_FEATURES);
  const [predictedScore, setPredictedScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [lastPrediction, setLastPrediction] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [autoPredict, setAutoPredict] = useState<boolean>(true);
  const autoPredictTimeout = useRef<NodeJS.Timeout | null>(null);
  const [lastGlobalUpdate, setLastGlobalUpdate] = useState<string>('');
  
  // Use context to update global cognitive load state
  const { updateScore, setLoading, mode: currentMode, score: globalScore } = useCognitiveLoadContext();
  console.log('Features page rendering with globalScore:', globalScore, 'currentMode:', currentMode);

  // Function to trigger main dashboard reload
  const triggerDashboardReload = (newScore: number) => {
    // Set a flag in localStorage to indicate dashboard should reload
    localStorage.setItem('dashboardShouldReload', 'true');
    localStorage.setItem('dashboardReloadTimestamp', Date.now().toString());
    console.log('Features: Set dashboard reload flag for score:', newScore);
    
    // Also broadcast to other tabs/windows using storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'cognitiveLoadScore',
      newValue: newScore.toString(),
      storageArea: localStorage
    }));
  };

  useEffect(() => {
    // Test API connection on mount
    ApiService.testConnection().then(setApiConnected);
    
    // Make initial prediction to set dashboard state
    handlePredict();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoPredictTimeout.current) {
        clearTimeout(autoPredictTimeout.current);
      }
    };
  }, []);

  const handleFeatureChange = (featureId: string, newValue: number) => {
    setFeatures(prev => 
      prev.map(feature => 
        feature.id === featureId 
          ? { ...feature, value: newValue }
          : feature
      )
    );
    
    // Auto-predict after a short delay when values change
    if (autoPredict) {
      if (autoPredictTimeout.current) {
        clearTimeout(autoPredictTimeout.current);
      }
      autoPredictTimeout.current = setTimeout(() => {
        handlePredict();
      }, 1000); // 1 second delay after user stops changing values
    }
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setLoading(true); // Update global loading state
    setError('');
    
    // Convert features to API request format
    const apiRequest: ApiPredictionRequest = {
      active_tasks: features.find(f => f.id === 'active_tasks')?.value || 0,
      avg_task_duration: features.find(f => f.id === 'avg_task_duration')?.value || 0,
      priority_high: features.find(f => f.id === 'priority_high')?.value || 0,
      priority_medium: features.find(f => f.id === 'priority_medium')?.value || 0,
      priority_low: features.find(f => f.id === 'priority_low')?.value || 0,
      task_type_excavation: features.find(f => f.id === 'task_type_excavation')?.value || 0,
      task_type_navigation: features.find(f => f.id === 'task_type_navigation')?.value || 0,
      task_type_communication: features.find(f => f.id === 'task_type_communication')?.value || 0,
      task_type_other: features.find(f => f.id === 'task_type_other')?.value || 0,
      noise_level: features.find(f => f.id === 'noise_level')?.value || 0,
      site_activity: features.find(f => f.id === 'site_activity')?.value || 0,
      temperature: features.find(f => f.id === 'temperature')?.value || 0,
      touchscreen_inputs: features.find(f => f.id === 'touchscreen_inputs')?.value || 0,
      alert_response_time: features.find(f => f.id === 'alert_response_time')?.value || 0,
      joystick_pattern_erratic: features.find(f => f.id === 'joystick_pattern_erratic')?.value || 0,
    };

    try {
      const response = await ApiService.predictScore(apiRequest);
      setPredictedScore(response.score);
      setLastPrediction(new Date().toLocaleTimeString());
      
      // Update global cognitive load state
      console.log('Features page: Updating global score to', response.score);
      updateScore(response.score);
      setLastGlobalUpdate(new Date().toLocaleTimeString());
      
      // Update API connection status
      setApiConnected(true);
      
      // Trigger main dashboard reload with new score
      triggerDashboardReload(response.score);
      
    } catch (error) {
      console.error('Prediction failed:', error);
      setError('Failed to get prediction from API. Using fallback value.');
      setApiConnected(false);
      
      // Fallback score
      const fallbackScore = Math.floor(Math.random() * 70) + 20;
      setPredictedScore(fallbackScore);
      setLastPrediction(new Date().toLocaleTimeString());
      
      // Update global cognitive load state even with fallback
      console.log('Features page: Updating global score to fallback', fallbackScore);
      updateScore(fallbackScore);
      setLastGlobalUpdate(new Date().toLocaleTimeString());
      
      // Trigger main dashboard reload with fallback score
      triggerDashboardReload(fallbackScore);
      
    } finally {
      setIsLoading(false);
      setLoading(false); // Update global loading state
    }
  };

  const resetFeatures = () => {
    setFeatures(INITIAL_FEATURES);
    setPredictedScore(null);
    setError('');
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score > 70) return 'text-red-400';
    if (score > 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getScoreStatus = (score: number | null) => {
    if (score === null) return 'No Prediction';
    if (score > 70) return 'High Load (Minimal Mode)';
    if (score > 40) return 'Medium Load';
    return 'Low Load (Standard Mode)';
  };

  const formatValue = (feature: FeatureLevel) => {
    if (feature.max === 1 && feature.min === 0) {
      // Binary features
      return feature.value.toString();
    } else if (feature.id.includes('priority')) {
      // Priority fractions
      return feature.value.toFixed(1);
    } else {
      // Regular numeric features
      return Math.round(feature.value).toString();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-green-400">🎛️ Feature Adjustment Panel</h1>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                apiConnected ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  apiConnected ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                API {apiConnected ? 'Connected' : 'Disconnected'}
              </div>
              <Link 
                href="/"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
          
          {/* Debug Panel */}
          <div className="bg-purple-900/30 border border-purple-600 p-4 mb-4 rounded-lg">
            <h3 className="text-purple-300 font-bold">DEBUG - Features Context State:</h3>
            <p className="text-white">Global Score: {globalScore}</p>
            <p className="text-white">Current Mode: {currentMode}</p>
            <p className="text-white">Local Predicted Score: {predictedScore}</p>
            <p className="text-white">Last Prediction: {lastPrediction}</p>
            <p className="text-green-400">Last Dashboard Update: {lastGlobalUpdate}</p>
            <p className="text-xs text-purple-400 mt-2">
              🔄 API Integration: When API score is fetched, main dashboard will auto-reload
            </p>
            <p className="text-xs text-yellow-400 mt-1">
              ⚡ Reload Trigger: Dashboard reload signal sent after each API prediction
            </p>
          </div>
          
          <p className="text-gray-300">
            Adjust the 15 model features to simulate different cognitive load conditions and get real-time predictions.
          </p>
          <div className="mt-2 p-3 bg-cyan-900/30 border border-cyan-600 rounded-lg">
            <p className="text-cyan-200 text-sm">
              ℹ️ Predictions made here will update the main dashboard's display mode in real-time.
            </p>
          </div>
          {error && (
            <div className="mt-2 p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg">
              <p className="text-yellow-200 text-sm">⚠️ {error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feature Controls */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-orange-400 mb-6">📊 Model Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature) => (
                  <div key={feature.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-gray-300 font-medium text-sm">
                        {feature.name}
                      </label>
                      <span className="text-cyan-400 font-mono text-sm">
                        {formatValue(feature)}{feature.unit}
                      </span>
                    </div>
                    
                    <input
                      type="range"
                      min={feature.min}
                      max={feature.max}
                      step={feature.max === 1 ? 1 : feature.id.includes('priority') ? 0.1 : 1}
                      value={feature.value}
                      onChange={(e) => handleFeatureChange(feature.id, Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    
                    <p className="text-xs text-gray-400">
                      {feature.description}
                    </p>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{feature.min}{feature.unit}</span>
                      <span>{feature.max}{feature.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isLoading
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isLoading ? '🔄 Predicting...' : '🎯 Predict Score'}
                </button>
                
                <button
                  onClick={resetFeatures}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  🔄 Reset
                </button>
              </div>
              
              {/* Auto-predict toggle */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-700">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPredict}
                    onChange={(e) => setAutoPredict(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm">🔄 Auto-predict on slider changes</span>
                </label>
                <span className="text-xs text-gray-500">
                  (Updates dashboard automatically after 1 second)
                </span>
              </div>
            </div>
          </div>

          {/* Prediction Results */}
          <div className="space-y-6">
            {/* Score Display */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-purple-400 mb-4">🎯 Prediction Results</h2>
              
              <div className="text-center">
                <div className="text-6xl font-bold font-mono mb-2">
                  <span className={getScoreColor(predictedScore)}>
                    {predictedScore !== null ? predictedScore : '--'}
                  </span>
                </div>
                <div className="text-lg text-gray-300 mb-2">Cognitive Load Score</div>
                <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                  predictedScore !== null && predictedScore > 70 
                    ? 'bg-red-900 text-red-200' 
                    : predictedScore !== null && predictedScore > 40
                    ? 'bg-yellow-900 text-yellow-200'
                    : 'bg-green-900 text-green-200'
                }`}>
                  {getScoreStatus(predictedScore)}
                </div>
                
                {/* Dashboard Mode Update Indicator */}
                <div className="mt-3 p-2 bg-purple-900/30 border border-purple-600 rounded-lg">
                  <div className="text-xs text-purple-300 text-center">
                    🎯 Dashboard Mode: <span className="font-bold">{currentMode.toUpperCase()}</span>
                  </div>
                  <div className="text-xs text-purple-400 text-center mt-1">
                    Global Score: {globalScore}
                  </div>
                </div>
                
                {lastPrediction && (
                  <div className="text-xs text-gray-400 mt-3">
                    Last updated: {lastPrediction}
                  </div>
                )}
              </div>
            </div>

            {/* Feature Summary */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-pink-400 mb-4">📋 Current Settings</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {features.map((feature) => (
                  <div key={feature.id} className="flex justify-between text-sm">
                    <span className="text-gray-400 truncate mr-2">{feature.name}:</span>
                    <span className="text-white font-mono flex-shrink-0">
                      {formatValue(feature)}{feature.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* API Info */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">🔗 API Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Endpoint:</span>
                  <span className="text-white font-mono">localhost:8000/predict</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Method:</span>
                  <span className="text-white">POST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Features:</span>
                  <span className="text-white">15 inputs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={apiConnected ? 'text-green-400' : 'text-red-400'}>
                    {apiConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
