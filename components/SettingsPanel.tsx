'use client';

import { useState } from 'react';
import type { Settings } from '@/types';

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  isMinimal?: boolean;
}

export const SettingsPanel = ({ settings, onSettingsChange, isMinimal = false }: SettingsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSetting = (key: keyof Settings) => {
    if (key === 'monitoringEnabled') {
      onSettingsChange({
        ...settings,
        [key]: !settings[key]
      });
    }
  };

  const changePromptStyle = (style: Settings['promptStyle']) => {
    onSettingsChange({
      ...settings,
      promptStyle: style
    });
  };

  return (
    <>
      {/* Floating Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-12 h-12 ${
          isMinimal ? 'bg-gray-600' : 'bg-purple-600'
        } text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50`}
      >
        ⚙️
      </button>

      {/* Settings Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Settings Panel */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-black shadow-2xl transform transition-transform z-50 border-l border-gray-800 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Settings</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Monitoring Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Monitoring</span>
              <button
                onClick={() => toggleSetting('monitoringEnabled')}
                className={`w-12 h-6 rounded-full transition-all ${
                  settings.monitoringEnabled ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.monitoringEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Prompt Style */}
            <div>
              <label className="block text-gray-300 mb-2">Prompt Style</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={settings.promptStyle === 'concise'}
                    onChange={() => changePromptStyle('concise')}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Concise</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={settings.promptStyle === 'conversational'}
                    onChange={() => changePromptStyle('conversational')}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Conversational</span>
                </label>
              </div>
            </div>

            {/* Mode Override (only in minimal mode) */}
            {isMinimal && (
              <div className="pt-4 border-t border-gray-700">
                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors">
                  Return to Standard Mode
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
