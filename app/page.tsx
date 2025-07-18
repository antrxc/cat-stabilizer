'use client';

import { useState, useEffect } from 'react';
import { useCognitiveLoadContext } from '@/hooks/useCognitiveLoadContext';
import { Header } from '@/components/Header';
import { TaskDashboard } from '@/components/TaskDashboard';
import { MachineStatusPanel } from '@/components/MachineStatusPanel';
import { EnvironmentalContextPanel } from '@/components/EnvironmentalContextPanel';
import { OperatorInteractionStats } from '@/components/OperatorInteractionStats';
import { VoiceMotivationPanel } from '@/components/VoiceMotivationPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Footer } from '@/components/Footer';
import { FocusTaskDisplay } from '@/components/FocusTaskDisplay';
import { CriticalAlertPanel } from '@/components/CriticalAlertPanel';
import { VoicePromptBanner } from '@/components/VoicePromptBanner';
import { ResetPausePrompt } from '@/components/ResetPausePrompt';
import { 
  mockTasks, 
  mockMachineStatus, 
  mockEnvironmentalData, 
  mockOperatorStats, 
  mockVoicePrompts, 
  mockSettings,
  mockCriticalAlerts,
  getMotivationalPrompt 
} from '@/utils/mockData';
import type { Settings } from '@/types';

export default function Home() {
  const { score, mode, isLoading, lastUpdated, updateScore } = useCognitiveLoadContext();
  console.log('Dashboard page rendering with score:', score, 'mode:', mode);
  const [settings, setSettings] = useState<Settings>(mockSettings);
  const [forceRender, setForceRender] = useState(0);

  // Force re-render when score changes to ensure real-time updates
  useEffect(() => {
    console.log('Dashboard: Score changed to', score, 'mode:', mode);
    setForceRender(prev => prev + 1);
  }, [score, mode]);

  // Listen for API score updates and auto-reload
  useEffect(() => {
    // Check if dashboard should reload on mount
    const shouldReload = localStorage.getItem('dashboardShouldReload');
    if (shouldReload === 'true') {
      localStorage.removeItem('dashboardShouldReload');
      console.log('Dashboard: Reloading due to API score update');
      window.location.reload();
      return;
    }

    // Listen for storage events (from features page API calls)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cognitiveLoadScore' && e.newValue) {
        console.log('Dashboard: Detected API score update, reloading page...');
        setTimeout(() => {
          window.location.reload();
        }, 500); // Small delay to ensure localStorage is fully updated
      }
    };

    // Listen for reload signals
    const handleReloadCheck = () => {
      const shouldReload = localStorage.getItem('dashboardShouldReload');
      const reloadTimestamp = localStorage.getItem('dashboardReloadTimestamp');
      
      if (shouldReload === 'true' && reloadTimestamp) {
        const timeDiff = Date.now() - parseInt(reloadTimestamp);
        // Only reload if the signal is recent (within 5 seconds)
        if (timeDiff < 5000) {
          localStorage.removeItem('dashboardShouldReload');
          localStorage.removeItem('dashboardReloadTimestamp');
          console.log('Dashboard: Auto-reloading due to API score update');
          window.location.reload();
        }
      }
    };

    // Check for reload signals every second
    const reloadInterval = setInterval(handleReloadCheck, 1000);
    
    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(reloadInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Test function to manually update score
  const testScoreUpdate = () => {
    const randomScore = Math.floor(Math.random() * 100);
    console.log('Dashboard: Manually updating score to', randomScore);
    updateScore(randomScore);
  };

  const currentTask = mockTasks.find(task => task.isActive) || null;
  const lastVoiceMessage = mockVoicePrompts[mockVoicePrompts.length - 1] || null;
  const motivationalPrompt = getMotivationalPrompt(currentTask?.progress || 0);

  const handlePlayAudio = () => {
    // Implement Web Speech API or audio playback
    console.log('Playing audio:', lastVoiceMessage?.message);
  };

  const handlePausePrompt = () => {
    console.log('Pausing voice prompts');
  };

  const handleAcknowledgeBreak = () => {
    console.log('User acknowledged break suggestion');
  };

  const handleSkipBreak = () => {
    console.log('User skipped break suggestion');
  };

  if (mode === 'minimal') {
    return (
      <div className="min-h-screen bg-white" key={`minimal-${score}-${forceRender}`}>
        <Header score={score} mode={mode} isLoading={isLoading} />
        
        <main className="container mx-auto px-6 py-8 space-y-8">
          <FocusTaskDisplay currentTask={currentTask} />
          
          <CriticalAlertPanel alerts={mockCriticalAlerts} />
          
          <VoicePromptBanner 
            currentPrompt={lastVoiceMessage}
            onPlayAudio={handlePlayAudio}
            onPausePrompt={handlePausePrompt}
          />
          
          <ResetPausePrompt 
            onAcknowledge={handleAcknowledgeBreak}
            onSkip={handleSkipBreak}
          />
        </main>

        <SettingsPanel 
          settings={settings}
          onSettingsChange={setSettings}
          isMinimal={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" key={`standard-${score}-${forceRender}`}>
      <Header score={score} mode={mode} isLoading={isLoading} />
      
      {/* Debug Panel 
      <div className="bg-purple-900/30 border border-purple-600 p-4 m-4 rounded-lg">
        <h3 className="text-purple-300 font-bold">DEBUG - Dashboard Auto-Reload System (Render #{forceRender}):</h3>
        <p className="text-white">Score: {score}</p>
        <p className="text-white">Mode: {mode}</p>
        <p className="text-white">Loading: {isLoading.toString()}</p>
        <p className="text-white">Last Updated: {lastUpdated}</p>
        <p className="text-xs text-purple-400 mt-2">
          🔄 Auto-reload: Page will reload automatically when API score is fetched from features page
        </p>
        <p className="text-xs text-green-400 mt-1">
          ✅ Monitoring localStorage and storage events for score changes
        </p>
        <button 
          onClick={testScoreUpdate}
          className="mt-2 px-3 py-1 bg-cyan-600 text-white rounded text-sm hover:bg-cyan-700"
        >
          🧪 Test Random Score Update
        </button>
      </div>*/}
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <TaskDashboard tasks={mockTasks} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MachineStatusPanel status={mockMachineStatus} />
              <EnvironmentalContextPanel data={mockEnvironmentalData} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <OperatorInteractionStats stats={mockOperatorStats} />
            <VoiceMotivationPanel 
              lastVoiceMessage={lastVoiceMessage}
              motivationalPrompt={motivationalPrompt}
            />
          </div>
        </div>
      </main>

      <Footer lastUpdated={lastUpdated} />

      <SettingsPanel 
        settings={settings}
        onSettingsChange={setSettings}
        isMinimal={false}
      />
    </div>
  );
}
