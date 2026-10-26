import React, { useState } from 'react';
import { 
  FileText, 
  FolderOpen, 
  Save, 
  Check, 
  RotateCcw, 
  Share2, 
  Download, 
  Eye, 
  Sparkles,
  HelpCircle,
  AlertCircle,
  BookOpen,
  Sliders,
  PenTool
} from 'lucide-react';
import { SaveStatus, AppMode } from '../../types/document';

interface TopBarProps {
  title: string;
  onUpdateTitle: (title: string) => void;
  saveStatus: SaveStatus;
  lastSavedAt: number;
  onSaveNow: () => void;
  onSaveMus?: () => void;
  onOpenDocManager: () => void;
  onOpenExport: () => void;
  onOpenAccessibility: () => void;
  onOpenAiAssistant: () => void;
  onOpenShortcuts: () => void;
  onOpenNovelStudio?: () => void;
  onOpenPageSetup?: () => void;
  appMode?: AppMode;
  onToggleAppMode?: (mode: AppMode) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  onUpdateTitle,
  saveStatus,
  lastSavedAt,
  onSaveNow,
  onSaveMus,
  onOpenDocManager,
  onOpenExport,
  onOpenAccessibility,
  onOpenAiAssistant,
  onOpenShortcuts,
  onOpenNovelStudio,
  onOpenPageSetup,
  appMode = 'word',
  onToggleAppMode,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim()) {
      onUpdateTitle(tempTitle.trim());
    } else {
      setTempTitle(title);
    }
  };

  return (
    <div className="w-full bg-[#1E293B] text-white select-none">
      {/* Universal 3-zone Header Contract */}
      <header className="flex items-center justify-between gap-6 px-6 py-2 border-b border-slate-700/60">
        {/* Zone 1: Single text element wordmark with original brand mark and Mode Switcher */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-serif font-black text-sm shadow-xs border border-blue-400/30">
              V
            </div>
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              Velum Writer Pro
            </span>
          </div>

          {/* Mode Switcher Segmented Control */}
          <div className="flex items-center bg-slate-800/90 p-0.5 rounded-lg border border-slate-700 text-xs shadow-inner">
            <button
              type="button"
              onClick={() => onToggleAppMode?.('word')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                appMode === 'word'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Document</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleAppMode?.('pdf_studio')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                appMode === 'pdf_studio'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>PDF Studio</span>
            </button>
          </div>
        </div>

        {/* Zone 2: Navigation controls - always accessible on all viewports */}
        <nav className="flex items-center gap-2.5 sm:gap-4 md:gap-6 text-xs font-medium text-slate-300 overflow-x-auto py-1">
          <button
            type="button"
            onClick={onOpenDocManager}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:ring-1 focus-visible:ring-blue-400"
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Document Library</span>
          </button>

          <button
            type="button"
            onClick={onOpenAccessibility}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:ring-1 focus-visible:ring-blue-400"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Accessibility</span>
          </button>

          {onOpenPageSetup && (
            <button
              type="button"
              onClick={onOpenPageSetup}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:ring-1 focus-visible:ring-blue-400 text-blue-300 hover:text-white"
              title="Page Setup & Document Configuration (Margins, Paper Dimensions, Headers/Footers, Default Font)"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>Page Setup</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAiAssistant}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-amber-200 hover:text-white focus-visible:ring-1 focus-visible:ring-blue-400"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Assistant</span>
          </button>

          <button
            type="button"
            onClick={onOpenNovelStudio}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-purple-200 hover:text-white focus-visible:ring-1 focus-visible:ring-purple-400"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Novel Studio</span>
          </button>

          <button
            type="button"
            onClick={onOpenShortcuts}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:ring-1 focus-visible:ring-blue-400"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Shortcuts</span>
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onSaveMus && (
            <button
              type="button"
              onClick={onSaveMus}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors whitespace-nowrap shadow-xs focus-visible:ring-2 focus-visible:ring-white border border-emerald-400/30"
              title="Save directly into native .mus file extension"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save as .mus</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors whitespace-nowrap shadow-xs focus-visible:ring-2 focus-visible:ring-white"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export As...</span>
          </button>
        </div>
      </header>

      {/* Secondary Quick Access Bar with Inline Title & IndexedDB Status */}
      <div className="flex items-center justify-between px-6 py-1.5 bg-[#0F172A] text-[11px] text-slate-300 border-b border-slate-900/60">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSaveNow}
            title="Save Document to IndexedDB (Ctrl+S)"
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-white/10"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          {onSaveMus && (
            <button
              type="button"
              onClick={onSaveMus}
              title="Quick save to native .mus file"
              className="flex items-center gap-1 text-emerald-400 hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-emerald-600/20 font-medium"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save .mus</span>
            </button>
          )}

          <div className="h-3 w-px bg-slate-700" />

          {/* Editable Document Title */}
          <div className="flex items-center gap-1.5">
            {isEditingTitle ? (
              <input
                type="text"
                value={tempTitle}
                autoFocus
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                className="bg-white text-neutral-900 px-2 py-0.5 rounded text-xs font-semibold focus:outline-none"
                aria-label="Document Title Input"
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTempTitle(title);
                  setIsEditingTitle(true);
                }}
                className="text-white font-bold hover:bg-white/10 px-2 py-0.5 rounded transition-colors text-xs flex items-center gap-1.5"
                title="Click to rename document"
              >
                <span>{title}</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-500/40">.mus</span>
              </button>
            )}
          </div>
        </div>

        {/* Real Persistence Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px]">
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-1 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Saving to IndexedDB...</span>
              </div>
            )}
            {saveStatus === 'saved_local' && (
              <div className="flex items-center gap-1 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Saved locally (IndexedDB) &middot; {new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center gap-1 text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Storage Error (Quota exceeded)</span>
              </div>
            )}
            {saveStatus === 'idle' && (
              <div className="flex items-center gap-1 text-slate-400">
                <span>Local Storage Active</span>
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono">
            <span>OFFLINE READY &middot; A4 SPECS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
