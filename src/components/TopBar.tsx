import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  FolderOpen, 
  LayoutTemplate, 
  Check, 
  Save, 
  FileSpreadsheet,
  FileCheck
} from 'lucide-react';
import { AppMode } from '../types/document';

interface TopBarProps {
  documentTitle: string;
  onUpdateTitle: (title: string) => void;
  appMode: AppMode;
  onSwitchMode: (mode: AppMode) => void;
  onOpenTemplates: () => void;
  onOpenExport: () => void;
  onOpenAiAssistant: () => void;
  onOpenDocManager: () => void;
  onSaveDocument: () => void;
  lastSavedTime: number | null;
}

export const TopBar: React.FC<TopBarProps> = ({
  documentTitle,
  onUpdateTitle,
  appMode,
  onSwitchMode,
  onOpenTemplates,
  onOpenExport,
  onOpenAiAssistant,
  onOpenDocManager,
  onSaveDocument,
  lastSavedTime,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(documentTitle);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim()) {
      onUpdateTitle(tempTitle.trim());
    } else {
      setTempTitle(documentTitle);
    }
  };

  return (
    <div className="w-full bg-[#104A8E] text-white select-none">
      {/* Universal 3-zone Header Contract */}
      <header className="flex items-center justify-between gap-8 px-6 py-2.5 border-b border-blue-900/40">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded bg-white text-[#104A8E] flex items-center justify-center font-black text-sm shadow-xs">
            W
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            DocuCraft Office Pro
          </span>
        </div>

        {/* Zone 2: 4-5 clean single-line navigation buttons */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-blue-100">
          <button
            type="button"
            onClick={() => onSwitchMode('word')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              appMode === 'word' ? 'text-white font-bold underline underline-offset-4' : ''
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Word Canvas</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchMode('pdf_studio')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              appMode === 'pdf_studio' ? 'text-white font-bold underline underline-offset-4' : ''
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>PDF Studio &amp; Editor</span>
          </button>

          <button
            type="button"
            onClick={onOpenTemplates}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          <button
            type="button"
            onClick={onOpenAiAssistant}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-blue-200 hover:text-white"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Smart Assistant</span>
          </button>

          <button
            type="button"
            onClick={onOpenDocManager}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>My Documents</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-blue-900 bg-white hover:bg-blue-50 rounded-md transition-colors whitespace-nowrap shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#104A8E]" />
            <span>Turn Into Any File</span>
          </button>
        </div>
      </header>

      {/* Secondary Quick Access Bar with Inline Title & Auto-Save */}
      <div className="flex items-center justify-between px-6 py-1.5 bg-[#0D3B73] text-[11px] text-blue-200 border-b border-blue-950/40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSaveDocument}
            title="Save Document (Ctrl+S)"
            className="flex items-center gap-1 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          <div className="h-3 w-px bg-blue-800" />

          {/* Title input */}
          <div className="flex items-center gap-1.5">
            {isEditingTitle ? (
              <input
                type="text"
                value={tempTitle}
                autoFocus
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                className="bg-white text-neutral-900 px-2 py-0.5 rounded text-xs font-medium focus:outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTempTitle(documentTitle);
                  setIsEditingTitle(true);
                }}
                className="text-white font-semibold hover:bg-white/10 px-2 py-0.5 rounded transition-colors text-xs flex items-center gap-1"
                title="Click to rename document"
              >
                <span>{documentTitle}</span>
                <span className="text-[10px] text-blue-300 font-normal">.docx</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 text-blue-200">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>
              {lastSavedTime
                ? `Saved to Local Storage (${new Date(lastSavedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
                : 'All changes saved'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-blue-900/80 px-2 py-0.5 rounded text-[10px] text-blue-200 font-mono">
            <span>OFFICE 365 ENGINE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
