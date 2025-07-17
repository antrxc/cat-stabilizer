'use client';

import { useState } from 'react';
import { useCognitiveLoad } from '@/hooks/useCognitiveLoad';
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
  const { score, mode, isLoading, lastUpdated } = useCognitiveLoad();
  const [settings, setSettings] = useState<Settings>(mockSettings);

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
      <div className="min-h-screen bg-gray-100">
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
    <div className="min-h-screen bg-gray-50">
      <Header score={score} mode={mode} isLoading={isLoading} />
      
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
