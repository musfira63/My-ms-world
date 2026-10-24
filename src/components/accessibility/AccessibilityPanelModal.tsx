import React from 'react';
import { 
  X, 
  Eye, 
  Type, 
  Sliders, 
  Sparkles, 
  Maximize2, 
  RotateCcw, 
  Check, 
  Sun, 
  Moon, 
  Contrast, 
  BookOpen,
  Volume2,
  PowerOff
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface AccessibilityPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanelModal: React.FC<AccessibilityPanelModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateSettings, resetSettings } = useAccessibility();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-panel-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 id="accessibility-panel-title" className="text-base font-bold text-neutral-900">
                Accessibility &amp; Assistive Studio
              </h2>
              <p className="text-xs text-neutral-500">
                Configure your reading comfort, visual contrast, dyslexia preferences, and focus modes (WCAG 2.2 AA).
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                resetSettings();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
              title="Turn off all accessibility and dyslexia font overrides"
            >
              <PowerOff className="w-3.5 h-3.5 text-rose-600" />
              <span>Turn Off All</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label="Close accessibility settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-800">
          {/* Section 1: Visual Reading Themes */}
          <div>
            <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Contrast className="w-4 h-4 text-indigo-600" />
              <span>Document Canvas Theme</span>
            </h3>
            <p className="text-neutral-500 mb-3">
              Switch color contrast levels to prevent optical fatigue or glare.
            </p>

            <div className="grid grid-cols-5 gap-2.5">
              {[
                { id: 'default', label: 'Default', bg: '#FFFFFF', text: '#0F172A', border: '#CBD5E1' },
                { id: 'sepia', label: 'Warm Sepia', bg: '#FBF0D9', text: '#382A1B', border: '#D7C7A8' },
                { id: 'dark', label: 'Dark Slate', bg: '#1E293B', text: '#F1F5F9', border: '#475569' },
                { id: 'high_contrast', label: 'High Contrast', bg: '#000000', text: '#FFFF00', border: '#FFFF00' },
                { id: 'solarized', label: 'Solarized', bg: '#FDF6E3', text: '#586E75', border: '#EEE8D5' },
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => updateSettings({ readingTheme: th.id as any })}
                  className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center justify-between h-20 ${
                    settings.readingTheme === th.id
                      ? 'ring-2 ring-indigo-600 font-bold shadow-xs'
                      : 'hover:border-neutral-400'
                  }`}
                  style={{ backgroundColor: th.bg, borderColor: th.border, color: th.text }}
                >
                  <span className="text-[11px]">{th.label}</span>
                  <span className="text-base font-serif font-black">Aa</span>
                  {settings.readingTheme === th.id && (
                    <span className="text-[9px] uppercase tracking-wider font-mono">Active</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: UI Interface Scaling */}
          <div className="border-t border-neutral-200 pt-4">
            <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-indigo-600" />
              <span>Interface &amp; Toolbar Scaling</span>
            </h3>
            <div className="flex items-center gap-2">
              {[90, 100, 110, 125].map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => updateSettings({ uiScale: scale as any })}
                  className={`px-3 py-1.5 rounded-md border text-xs font-semibold transition-all ${
                    settings.uiScale === scale
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {scale}%
                </button>
              ))}
              <span className="text-neutral-400 text-[11px] ml-2">
                Increases button sizes and toolbar text for easy targeting.
              </span>
            </div>
          </div>

          {/* Section 3: Reading Assistive Modes */}
          <div className="border-t border-neutral-200 pt-4 space-y-3">
            <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Assistive Modes</span>
            </h3>

            {/* Dyslexia-friendly toggle */}
            <div className="flex items-start justify-between p-3 rounded-lg border border-neutral-200 bg-neutral-50/50">
              <div className="pr-4">
                <span className="font-bold text-neutral-900 block text-xs">
                  Dyslexia-Friendly Reading Mode
                </span>
                <p className="text-neutral-500 text-[11px] leading-relaxed mt-0.5">
                  Activates Atkinson Hyperlegible character geometry, expands line height to 1.8, and widens character intervals to prevent crowding.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={settings.dyslexiaFriendly}
                  onChange={(e) => updateSettings({ dyslexiaFriendly: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Focus mode toggle */}
            <div className="flex items-start justify-between p-3 rounded-lg border border-neutral-200 bg-neutral-50/50">
              <div className="pr-4">
                <span className="font-bold text-neutral-900 block text-xs">
                  Distraction-Free Focus Mode
                </span>
                <p className="text-neutral-500 text-[11px] leading-relaxed mt-0.5">
                  Hides the upper ribbon toolbar and sidebars, allowing you to write in uninterrupted visual silence.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={settings.focusMode}
                  onChange={(e) => updateSettings({ focusMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Reduced motion toggle */}
            <div className="flex items-start justify-between p-3 rounded-lg border border-neutral-200 bg-neutral-50/50">
              <div className="pr-4">
                <span className="font-bold text-neutral-900 block text-xs">
                  Reduced Motion &amp; Animation Suppression
                </span>
                <p className="text-neutral-500 text-[11px] leading-relaxed mt-0.5">
                  Eliminates zoom transforms, sliding menus, and transition effects for individuals sensitive to screen motion.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-200 bg-neutral-50">
          <button
            type="button"
            onClick={() => {
              resetSettings();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Settings</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Save &amp; Return to Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};
