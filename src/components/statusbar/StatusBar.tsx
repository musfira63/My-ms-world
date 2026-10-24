import React from 'react';
import { 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Check, 
  Eye, 
  BookOpen 
} from 'lucide-react';
import { SaveStatus, PageSettings, AppMode } from '../../types/document';
import { useAccessibility } from '../../context/AccessibilityContext';

interface StatusBarProps {
  wordCount: number;
  charCount: number;
  pageSettings: PageSettings;
  zoomLevel: number;
  onUpdateZoom: (zoom: number) => void;
  saveStatus: SaveStatus;
  lastSavedAt: number;
  appMode?: AppMode;
  totalPages?: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  wordCount,
  charCount,
  pageSettings,
  zoomLevel,
  onUpdateZoom,
  saveStatus,
  lastSavedAt,
  appMode = 'word',
  totalPages = 1,
}) => {
  const { settings, updateSettings } = useAccessibility();

  return (
    <footer 
      className="w-full bg-[#0F172A] text-slate-300 border-t border-slate-800 px-6 py-1 flex items-center justify-between text-[11px] select-none"
      role="contentinfo"
      aria-label="Document Status and Zoom Controls"
    >
      {/* Left zone: Page and Word metrics */}
      <div className="flex items-center gap-4">
        {appMode === 'pdf_studio' ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-semibold text-rose-300">PDF Studio &amp; Annotator Active</span>
            <span className="text-slate-500">&middot;</span>
            <span className="text-slate-400">Canvas Rendering &amp; OpenXML Conversion Ready</span>
          </div>
        ) : (
          <>
            <span className="font-medium text-slate-300">
              Page 1 of {totalPages || 1}
            </span>

            <div className="h-3 w-px bg-slate-700" />

            <div className="flex items-center gap-2">
              <span>{wordCount.toLocaleString()} words</span>
              <span className="text-slate-500">&middot;</span>
              <span>{charCount.toLocaleString()} characters</span>
            </div>

            <div className="h-3 w-px bg-slate-700" />

            <span className="text-slate-400 uppercase font-mono text-[10px]">
              {pageSettings.size.toUpperCase()} &middot; {pageSettings.orientation.toUpperCase()}
            </span>
          </>
        )}
      </div>

      {/* Right zone: Zoom slider & Assistive toggles */}
      <div className="flex items-center gap-4">
        {/* Quick Dyslexia Mode Toggle */}
        <button
          type="button"
          onClick={() => updateSettings({ dyslexiaFriendly: !settings.dyslexiaFriendly })}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors flex items-center gap-1 ${
            settings.dyslexiaFriendly
              ? 'bg-indigo-600 text-white font-bold'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
          title="Toggle Dyslexia-Friendly Reading Typography"
        >
          <BookOpen className="w-3 h-3" />
          <span>Dyslexia Mode</span>
        </button>

        {/* Quick Focus Mode */}
        <button
          type="button"
          onClick={() => updateSettings({ focusMode: !settings.focusMode })}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors flex items-center gap-1 ${
            settings.focusMode
              ? 'bg-blue-600 text-white font-bold'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
          title="Toggle Distraction-Free Focus Mode"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Focus Mode</span>
        </button>

        <div className="h-3 w-px bg-slate-700" />

        {/* Zoom controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onUpdateZoom(Math.max(50, zoomLevel - 10))}
            className="p-0.5 hover:text-white rounded hover:bg-slate-800 text-slate-400"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <input
            type="range"
            min="50"
            max="200"
            step="10"
            value={zoomLevel}
            onChange={(e) => onUpdateZoom(Number(e.target.value))}
            className="w-20 accent-blue-500 cursor-pointer h-1.5"
            aria-label="Zoom document percentage"
          />

          <button
            type="button"
            onClick={() => onUpdateZoom(Math.min(200, zoomLevel + 10))}
            className="p-0.5 hover:text-white rounded hover:bg-slate-800 text-slate-400"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onUpdateZoom(100)}
            className="font-mono text-slate-300 hover:text-white w-9 text-right tabular-nums text-[11px]"
            title="Reset zoom to 100%"
          >
            {zoomLevel}%
          </button>
        </div>
      </div>
    </footer>
  );
};
