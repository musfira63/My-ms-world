import React, { useRef, useEffect, useState } from 'react';
import { PageSettings } from '../types/document';
import { Bold, Italic, Sparkles } from 'lucide-react';

interface DocumentCanvasProps {
  contentHtml: string;
  onChangeContent: (html: string) => void;
  pageSettings: PageSettings;
  zoomLevel: number;
  onOpenAiAssistantWithSelection: (selectedText: string) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  contentHtml,
  onChangeContent,
  pageSettings,
  zoomLevel,
  onOpenAiAssistantWithSelection,
  canvasRef,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState('');
  const [floatingToolbarPos, setFloatingToolbarPos] = useState<{ top: number; left: number } | null>(null);

  // Sync incoming HTML content when editor doesn't match
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== contentHtml) {
      editorRef.current.innerHTML = contentHtml;
    }
  }, [contentHtml]);

  // Handle selection for floating mini-toolbar
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setFloatingToolbarPos(null);
      setSelectedText('');
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setFloatingToolbarPos({
        top: rect.top - 42,
        left: rect.left + rect.width / 2 - 80,
      });
    } else {
      setFloatingToolbarPos(null);
      setSelectedText('');
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChangeContent(editorRef.current.innerHTML);
    }
  };

  // Dimensions based on page size and orientation
  const isLandscape = pageSettings.orientation === 'landscape';
  let pageWidthInches = 8.5;
  let pageHeightInches = 11.0;

  if (pageSettings.size === 'a4') {
    pageWidthInches = 8.27;
    pageHeightInches = 11.69;
  } else if (pageSettings.size === 'legal') {
    pageWidthInches = 8.5;
    pageHeightInches = 14.0;
  } else if (pageSettings.size === 'executive') {
    pageWidthInches = 7.25;
    pageHeightInches = 10.5;
  }

  if (isLandscape) {
    const temp = pageWidthInches;
    pageWidthInches = pageHeightInches;
    pageHeightInches = temp;
  }

  // Calculate paper width in pixels for 96 DPI baseline
  const baseDpi = 96;
  const paperWidthPx = pageWidthInches * baseDpi;
  const paperMinHeightPx = pageHeightInches * baseDpi;

  return (
    <div className="flex-1 bg-[#E5E7EB] overflow-auto flex flex-col items-center py-8 px-4 select-text relative">
      {/* Visual Word Ruler */}
      {pageSettings.showRuler && (
        <div 
          className="bg-white border border-neutral-300 shadow-xs mb-3 flex items-end h-6 select-none rounded-t-xs text-[9px] text-neutral-400 font-mono relative overflow-hidden"
          style={{ width: `${paperWidthPx * (zoomLevel / 100)}px` }}
        >
          <div className="absolute inset-0 flex justify-between px-2 items-center">
            {Array.from({ length: Math.ceil(pageWidthInches) }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span>{idx}</span>
                <div className="h-2 w-px bg-neutral-300" />
              </div>
            ))}
          </div>
          {/* Margin markers */}
          <div 
            className="absolute top-0 bottom-0 bg-neutral-100/70 border-r border-blue-400"
            style={{ width: `${pageSettings.margins.left * baseDpi * (zoomLevel / 100)}px` }}
          />
          <div 
            className="absolute top-0 bottom-0 right-0 bg-neutral-100/70 border-l border-blue-400"
            style={{ width: `${pageSettings.margins.right * baseDpi * (zoomLevel / 100)}px` }}
          />
        </div>
      )}

      {/* Paginated Paper Canvas Sheet */}
      <div
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.12s ease-out',
        }}
      >
        <div
          id="document-page-canvas"
          ref={canvasRef}
          className="relative bg-white shadow-xl transition-all border border-neutral-300/80 rounded-xs"
          style={{
            width: `${paperWidthPx}px`,
            minHeight: `${paperMinHeightPx}px`,
            backgroundColor: pageSettings.backgroundColor || '#FFFFFF',
            paddingTop: `${pageSettings.margins.top}in`,
            paddingRight: `${pageSettings.margins.right}in`,
            paddingBottom: `${pageSettings.margins.bottom}in`,
            paddingLeft: `${pageSettings.margins.left}in`,
            boxSizing: 'border-box',
          }}
        >
          {/* Watermark overlay if enabled */}
          {pageSettings.watermarkText && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
              style={{
                color: pageSettings.watermarkColor || 'rgba(0, 0, 0, 0.05)',
                transform: 'rotate(-45deg)',
                fontSize: '76pt',
                fontWeight: 900,
                letterSpacing: '0.1em',
              }}
            >
              {pageSettings.watermarkText}
            </div>
          )}

          {/* Real ContentEditable Document Editor */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onMouseUp={handleMouseUp}
            onKeyUp={handleMouseUp}
            className="relative z-10 outline-none min-h-[500px] leading-relaxed text-neutral-900 prose max-w-none focus:outline-none"
            style={{
              fontSize: '11pt',
            }}
          />

          {/* Footer Page Number */}
          {pageSettings.showPageNumbers && (
            <div
              className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-neutral-400 select-none font-mono"
            >
              Page 1 of 1
            </div>
          )}
        </div>
      </div>

      {/* Floating Mini Context Toolbar on Selection (like Microsoft Word) */}
      {floatingToolbarPos && selectedText && (
        <div
          className="fixed z-50 bg-neutral-900/90 text-white backdrop-blur-md rounded-lg shadow-xl px-2 py-1 flex items-center gap-1 text-xs border border-neutral-700/80 animate-in fade-in zoom-in-95 duration-100"
          style={{
            top: `${Math.max(10, floatingToolbarPos.top)}px`,
            left: `${Math.max(10, floatingToolbarPos.left)}px`,
          }}
        >
          <button
            type="button"
            onClick={() => document.execCommand('bold')}
            className="p-1 hover:bg-white/20 rounded font-bold"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => document.execCommand('italic')}
            className="p-1 hover:bg-white/20 rounded italic"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <div className="h-3 w-px bg-neutral-600 mx-0.5" />

          <button
            type="button"
            onClick={() => onOpenAiAssistantWithSelection(selectedText)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 font-semibold text-[11px] text-white"
            title="Rewrite, Polish or Summarize with AI"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>AI Polish</span>
          </button>
        </div>
      )}
    </div>
  );
};
