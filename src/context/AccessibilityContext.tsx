import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilitySettings } from '../types/document';

const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  uiScale: 100,
  readingTheme: 'default',
  dyslexiaFriendly: false,
  focusMode: false,
  reducedMotion: false,
  disableAnimations: false,
  customLetterSpacing: 0,
  customWordSpacing: 0,
  customLineHeight: 1.6,
  customParagraphSpacing: 10,
};

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (partial: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('velum_accessibility_settings');
    if (saved) {
      try {
        return { ...DEFAULT_ACCESSIBILITY_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse accessibility settings:', e);
      }
    }
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  });

  const updateSettings = (partial: Partial<AccessibilitySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem('velum_accessibility_settings', JSON.stringify(next));
      return next;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
    localStorage.removeItem('velum_accessibility_settings');
  };

  // Sync reduced motion and UI scale to root HTML element
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${(settings.uiScale / 100) * 16}px`;

    if (settings.reducedMotion || settings.disableAnimations) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [settings.uiScale, settings.reducedMotion, settings.disableAnimations]);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return ctx;
}
