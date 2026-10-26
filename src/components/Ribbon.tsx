import React, { useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Subscript, 
  Superscript, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Table as TableIcon, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Scissors, 
  Copy, 
  Clipboard, 
  Undo2, 
  Redo2, 
  Search, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  HelpCircle, 
  Sliders, 
  Minus, 
  Layers, 
  Calendar, 
  BookOpen, 
  BookmarkCheck, 
  ShieldCheck, 
  Palette, 
  Type, 
  Maximize2, 
  RotateCcw, 
  Download, 
  Printer, 
  FolderOpen, 
  FilePlus, 
  Upload,
  PenTool,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Feather,
  Hash,
  ChevronDown
} from 'lucide-react';
import { RibbonTab, PageSettings } from '../../types/document';
import { FONT_SIZES, ACCESSIBLE_FONTS } from '../../utils/accessibleFonts';
import { ColorPickerPopover } from '../ColorPickerPopover';
import { RibbonFontPicker } from '../font/RibbonFontPicker';

interface RibbonProps {
  activeTab: RibbonTab;
  onSelectTab: (tab: RibbonTab) => void;
  editor: any;
  pageSettings: PageSettings;
  onUpdatePageSettings: (settings: Partial<PageSettings>) => void;
  onOpenFontModal: () => void;
  onOpenAccessibilityModal: () => void;
  onOpenTableModal: () => void;
  onOpenImageModal: () => void;
  onOpenLinkModal: () => void;
  onOpenExportModal: () => void;
  onOpenDocManagerModal: () => void;
  onOpenFindReplaceModal: () => void;
  onOpenAiAssistantModal: () => void;
  onOpenShortcutsModal: () => void;
  onImportDocx: () => void;
  onSaveMus?: () => void;
  onOpenMusFile?: () => void;
  onOpenPdfStudio?: () => void;
  onOpenNovelModal?: () => void;
  onOpenDrawingModal?: () => void;
  onOpenSymbolsModal?: () => void;
  onOpenPageSetupModal?: () => void;
  isDictating?: boolean;
  onToggleDictation?: () => void;
  isSpeaking?: boolean;
  onToggleReadAloud?: () => void;
  zoomLevel: number;
  onUpdateZoom: (zoom: number) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  wordCount: number;
  charCount: number;
}

export const Ribbon: React.FC<RibbonProps> = ({
  activeTab,
  onSelectTab,
  editor,
  pageSettings,
  onUpdatePageSettings,
  onOpenFontModal,
  onOpenAccessibilityModal,
  onOpenTableModal,
  onOpenImageModal,
  onOpenLinkModal,
  onOpenExportModal,
  onOpenDocManagerModal,
  onOpenFindReplaceModal,
  onOpenAiAssistantModal,
  onOpenShortcutsModal,
  onImportDocx,
  onSaveMus,
  onOpenMusFile,
  onOpenPdfStudio,
  onOpenNovelModal,
  onOpenDrawingModal,
  onOpenSymbolsModal,
  onOpenPageSetupModal,
  isDictating = false,
  onToggleDictation,
  isSpeaking = false,
  onToggleReadAloud,
  zoomLevel,
  onUpdateZoom,
  isSidebarOpen,
  onToggleSidebar,
  wordCount,
  charCount,
}) => {
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showCaseMenu, setShowCaseMenu] = useState(false);
  const [showSpacingMenu, setShowSpacingMenu] = useState(false);
  const [currentColor, setCurrentColor] = useState('#0F172A');
  const [currentHighlight, setCurrentHighlight] = useState('transparent');

  // Dismiss dropdown menus when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setShowCaseMenu(false);
      setShowSpacingMenu(false);
    };
    if (showCaseMenu || showSpacingMenu) {
      const timer = setTimeout(() => {
        window.addEventListener('click', handleGlobalClick);
      }, 10);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('click', handleGlobalClick);
      };
    }
  }, [showCaseMenu, showSpacingMenu]);

  const tabs: { id: RibbonTab; label: string }[] = [
    { id: 'file', label: 'File' },
    { id: 'home', label: 'Home' },
    { id: 'insert', label: 'Insert' },
    { id: 'layout', label: 'Layout' },
    { id: 'references', label: 'References' },
    { id: 'review', label: 'Review' },
    { id: 'view', label: 'View' },
    { id: 'novel', label: 'Novel & Book' },
    { id: 'pdf_studio', label: 'PDF Studio' },
    { id: 'help', label: 'Help' },
  ];

  const handleChangeCase = (mode: 'upper' | 'lower' | 'title' | 'sentence') => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) return;
    const text = editor.state.doc.textBetween(from, to, ' ');
    if (!text) return;
    let transformed = text;
    if (mode === 'upper') transformed = text.toUpperCase();
    else if (mode === 'lower') transformed = text.toLowerCase();
    else if (mode === 'title') {
      transformed = text.replace(/\b\w+/g, (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());
    } else if (mode === 'sentence') {
      transformed = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
    editor.chain().focus().insertContentAt({ from, to }, transformed).run();
    setShowCaseMenu(false);
  };

  // Helper for active styling
  const isActive = (name: string | Record<string, any>, opts?: any) => {
    return editor ? editor.isActive(name as any, opts) : false;
  };

  return (
    <div className="w-full bg-[#F8FAFC] border-b border-neutral-300 select-none shadow-xs text-xs">
      {/* Ribbon Tab Strip */}
      <div className="flex items-center px-4 bg-white border-b border-neutral-200">
        <div className="flex items-center space-x-1" role="tablist">
          {tabs.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={selected}
                type="button"
                onClick={() => {
                  if (tab.id === 'pdf_studio' && onOpenPdfStudio) {
                    onOpenPdfStudio();
                  } else {
                    onSelectTab(tab.id);
                  }
                }}
                className={`px-4 py-2 font-semibold transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  selected
                    ? 'text-blue-700 bg-neutral-100 border-b-2 border-blue-700 font-bold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Quick Accessibility Button on Top Right */}
        <div className="ml-auto flex items-center gap-2 py-1">
          <button
            type="button"
            onClick={onOpenAccessibilityModal}
            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md border border-indigo-200 font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600"
            title="Open Accessibility Settings (WCAG 2.2 AA)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Accessibility Studio</span>
          </button>
        </div>
      </div>

      {/* Ribbon Toolbar Commands Strip */}
      <div className="px-4 py-2 min-h-[74px] flex items-center gap-4 overflow-x-auto bg-[#F8FAFC]">
        {/* ======================================================== */}
        {/* TAB 1: FILE */}
        {/* ======================================================== */}
        {activeTab === 'file' && (
          <div className="flex items-center gap-3">
            {onSaveMus && (
              <button
                type="button"
                onClick={onSaveMus}
                className="flex flex-col items-center px-3.5 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition-colors shadow-2xs"
                title="Save document in native .mus file extension"
              >
                <Download className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="font-bold text-xs">Save as .mus</span>
              </button>
            )}

            {onOpenMusFile && (
              <button
                type="button"
                onClick={onOpenMusFile}
                className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
                title="Open a native .mus document file"
              >
                <Upload className="w-5 h-5 text-emerald-600 mb-1" />
                <span>Open .mus File</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenDocManagerModal}
              className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
            >
              <FolderOpen className="w-5 h-5 text-blue-600 mb-1" />
              <span>Document Library</span>
            </button>

            <button
              type="button"
              onClick={onImportDocx}
              className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
            >
              <Upload className="w-5 h-5 text-neutral-600 mb-1" />
              <span>Import .docx File</span>
            </button>

            <button
              type="button"
              onClick={onOpenPdfStudio}
              className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
            >
              <PenTool className="w-5 h-5 text-rose-600 mb-1" />
              <span>PDF Studio &amp; Annotator</span>
            </button>

            <button
              type="button"
              onClick={onOpenExportModal}
              className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
            >
              <Download className="w-5 h-5 text-indigo-600 mb-1" />
              <span>Export As...</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
            >
              <Printer className="w-5 h-5 text-neutral-700 mb-1" />
              <span>Print Document</span>
            </button>

            {onOpenPageSetupModal && (
              <button
                type="button"
                onClick={onOpenPageSetupModal}
                className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
                title="Configure margins, paper size, orientation, headers/footers, and default typography"
              >
                <Sliders className="w-5 h-5 text-blue-600 mb-1" />
                <span>Page Setup</span>
              </button>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: HOME */}
        {/* ======================================================== */}
        {activeTab === 'home' && (
          <div className="flex items-center gap-3">
            {/* Clipboard & History */}
            <div className="flex flex-col items-center border-r border-neutral-300 pr-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={!editor?.can().undo()}
                  onClick={() => editor?.chain().focus().undo().run()}
                  className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 disabled:opacity-30"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={!editor?.can().redo()}
                  onClick={() => editor?.chain().focus().redo().run()}
                  className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 disabled:opacity-30"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[10px] text-neutral-400 mt-1">Undo / Redo</span>
            </div>

            {/* Font Family & Size */}
            <div className="flex flex-col border-r border-neutral-300 pr-3">
              <div className="flex items-center gap-1.5">
                <RibbonFontPicker editor={editor} onOpenFontModal={onOpenFontModal} />

                {/* Font Size Selector */}
                <select
                  value={parseInt(editor?.getAttributes('textStyle').fontSize) || 11}
                  onChange={(e) => {
                    const size = e.target.value;
                    const { from, to } = editor?.state.selection || { from: 0, to: 0 };
                    if (from === to) {
                      editor?.chain().focus().selectAll().setMark('textStyle', { fontSize: `${size}pt` }).run();
                    } else {
                      editor?.chain().focus().setMark('textStyle', { fontSize: `${size}pt` }).run();
                    }
                  }}
                  className="px-1.5 py-1 text-xs bg-white border border-neutral-300 rounded hover:border-neutral-400 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  title="Font Size"
                  aria-label="Font Size"
                >
                  {FONT_SIZES.map((sz) => (
                    <option key={sz} value={sz}>{sz} pt</option>
                  ))}
                </select>

                {/* Grow Font Size (A^) */}
                <button
                  type="button"
                  onClick={() => {
                    const current = parseInt(editor?.getAttributes('textStyle').fontSize) || 11;
                    const next = FONT_SIZES.find(s => s > current) || current + 2;
                    const { from, to } = editor?.state.selection || { from: 0, to: 0 };
                    if (from === to) {
                      editor?.chain().focus().selectAll().setMark('textStyle', { fontSize: `${next}pt` }).run();
                    } else {
                      editor?.chain().focus().setMark('textStyle', { fontSize: `${next}pt` }).run();
                    }
                  }}
                  className="p-1 px-1.5 rounded hover:bg-neutral-200 text-neutral-800 text-xs font-bold leading-none"
                  title="Increase Font Size (Grow Font)"
                  aria-label="Increase Font Size"
                >
                  A<span className="text-[9px] text-blue-600 ml-0.5">▲</span>
                </button>

                {/* Shrink Font Size (Av) */}
                <button
                  type="button"
                  onClick={() => {
                    const current = parseInt(editor?.getAttributes('textStyle').fontSize) || 11;
                    const prev = [...FONT_SIZES].reverse().find(s => s < current) || Math.max(8, current - 2);
                    const { from, to } = editor?.state.selection || { from: 0, to: 0 };
                    if (from === to) {
                      editor?.chain().focus().selectAll().setMark('textStyle', { fontSize: `${prev}pt` }).run();
                    } else {
                      editor?.chain().focus().setMark('textStyle', { fontSize: `${prev}pt` }).run();
                    }
                  }}
                  className="p-1 px-1.5 rounded hover:bg-neutral-200 text-neutral-800 text-xs font-bold leading-none"
                  title="Decrease Font Size (Shrink Font)"
                  aria-label="Decrease Font Size"
                >
                  A<span className="text-[9px] text-blue-600 ml-0.5">▼</span>
                </button>
              </div>

              {/* Formatting marks */}
              <div className="flex items-center gap-0.5 mt-1.5">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-1 rounded transition-colors ${isActive('bold') ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-neutral-200 text-neutral-800'}`}
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-1 rounded transition-colors ${isActive('italic') ? 'bg-blue-100 text-blue-700 italic' : 'hover:bg-neutral-200 text-neutral-800'}`}
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={`p-1 rounded transition-colors ${isActive('underline') ? 'bg-blue-100 text-blue-700' : 'hover:bg-neutral-200 text-neutral-800'}`}
                  title="Underline (Ctrl+U)"
                >
                  <UnderlineIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  className={`p-1 rounded transition-colors ${isActive('strike') ? 'bg-blue-100 text-blue-700' : 'hover:bg-neutral-200 text-neutral-800'}`}
                  title="Strikethrough"
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleSubscript().run()}
                  className={`p-1 rounded transition-colors ${isActive('subscript') ? 'bg-blue-100 text-blue-700' : 'hover:bg-neutral-200 text-neutral-800'}`}
                  title="Subscript"
                >
                  <Subscript className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleSuperscript().run()}
                  className={`p-1 rounded transition-colors ${isActive('superscript') ? 'bg-blue-100 text-blue-700' : 'hover:bg-neutral-200 text-neutral-800'}`}
                  title="Superscript"
                >
                  <Superscript className="w-3.5 h-3.5" />
                </button>

                <div className="h-3 w-px bg-neutral-300 mx-1" />

                {/* Font Color */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTextColorPicker(!showTextColorPicker);
                      setShowHighlightPicker(false);
                    }}
                    className="p-1 rounded hover:bg-neutral-200 flex flex-col items-center"
                    title="Text Color"
                  >
                    <span className="font-serif font-black text-xs leading-none">A</span>
                    <div className="w-3.5 h-1 mt-0.5 rounded-xs" style={{ backgroundColor: currentColor }} />
                  </button>

                  {showTextColorPicker && (
                    <ColorPickerPopover
                      currentColor={currentColor}
                      type="text"
                      onSelectColor={(color) => {
                        setCurrentColor(color);
                        editor?.chain().focus().setColor(color).run();
                      }}
                      onClose={() => setShowTextColorPicker(false)}
                    />
                  )}
                </div>

                {/* Highlighter */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowHighlightPicker(!showHighlightPicker);
                      setShowTextColorPicker(false);
                    }}
                    className="p-1 rounded hover:bg-neutral-200 flex flex-col items-center"
                    title="Highlight Color"
                  >
                    <span className="text-[10px] font-bold border border-neutral-400 px-0.5 leading-none">ab</span>
                    <div className="w-3.5 h-1 mt-0.5 rounded-xs" style={{ backgroundColor: currentHighlight === 'transparent' ? '#FACC15' : currentHighlight }} />
                  </button>

                  {showHighlightPicker && (
                    <ColorPickerPopover
                      currentColor={currentHighlight}
                      type="highlight"
                      onSelectColor={(color) => {
                        setCurrentHighlight(color);
                        if (color === 'transparent') {
                          editor?.chain().focus().unsetHighlight().run();
                        } else {
                          editor?.chain().focus().toggleHighlight({ color }).run();
                        }
                      }}
                      onClose={() => setShowHighlightPicker(false)}
                    />
                  )}
                </div>

                {/* Case Changer Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCaseMenu(!showCaseMenu);
                      setShowSpacingMenu(false);
                    }}
                    className="p-1 px-1.5 rounded hover:bg-neutral-200 text-neutral-700 flex items-center gap-0.5"
                    title="Change Case (UPPERCASE, lowercase, Title Case, Sentence case)"
                  >
                    <span className="font-bold text-xs">Aa</span>
                    <ChevronDown className="w-2.5 h-2.5 text-neutral-400" />
                  </button>

                  {showCaseMenu && (
                    <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-neutral-300 rounded-lg shadow-xl z-50 py-1 text-xs">
                      <button
                        type="button"
                        onClick={() => handleChangeCase('sentence')}
                        className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Sentence case.
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChangeCase('lower')}
                        className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700"
                      >
                        lowercase
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChangeCase('upper')}
                        className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 font-bold"
                      >
                        UPPERCASE
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChangeCase('title')}
                        className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Capitalize Each Word
                      </button>
                    </div>
                  )}
                </div>

                {/* Clear formatting */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
                  className="p-1 rounded hover:bg-neutral-200 text-neutral-600"
                  title="Clear All Formatting"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Paragraph & Alignment */}
            <div className="flex flex-col border-r border-neutral-300 pr-3">
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                  className={`p-1.5 rounded transition-colors ${isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-neutral-200 text-neutral-800'}`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                  className={`p-1.5 rounded transition-colors ${isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-neutral-200 text-neutral-800'}`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                  className={`p-1.5 rounded transition-colors ${isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-neutral-200 text-neutral-800'}`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                  className={`p-1.5 rounded transition-colors ${isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-neutral-200 text-neutral-800'}`}
                  title="Justify"
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>

                <div className="h-3 w-px bg-neutral-300 mx-1" />

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-1.5 rounded transition-colors ${isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'hover:bg-neutral-200 text-neutral-800'}`}
                  title="Bulleted List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`p-1.5 rounded transition-colors ${isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'hover:bg-neutral-200 text-neutral-800'}`}
                  title="Numbered List"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>

                <div className="h-3 w-px bg-neutral-300 mx-1" />

                {/* Line Spacing Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSpacingMenu(!showSpacingMenu);
                      setShowCaseMenu(false);
                    }}
                    className="p-1 px-1.5 rounded hover:bg-neutral-200 text-neutral-700 flex items-center gap-0.5"
                    title="Line & Paragraph Spacing"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <ChevronDown className="w-2.5 h-2.5 text-neutral-400" />
                  </button>

                  {showSpacingMenu && (
                    <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-neutral-300 rounded-lg shadow-xl z-50 py-1 text-xs">
                      {[1.0, 1.15, 1.5, 2.0, 2.5, 3.0].map((lh) => (
                        <button
                          key={lh}
                          type="button"
                          onClick={() => {
                            const page = window.document.getElementById('velum-document-page');
                            if (page) {
                              page.style.lineHeight = `${lh}`;
                            }
                            setShowSpacingMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700"
                        >
                          {lh.toFixed(2)} spacing
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <span className="text-[10px] text-neutral-400 mt-1">Paragraph &amp; Lists</span>
            </div>

            {/* Styles Gallery */}
            <div className="flex flex-col border-r border-neutral-300 pr-3">
              <div className="flex items-center gap-1.5">
                {[
                  { label: 'Normal', action: () => editor?.chain().focus().setParagraph().run(), active: isActive('paragraph') },
                  { label: 'Heading 1', action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), active: isActive('heading', { level: 1 }) },
                  { label: 'Heading 2', action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: isActive('heading', { level: 2 }) },
                  { label: 'Heading 3', action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: isActive('heading', { level: 3 }) },
                  { label: 'Quote', action: () => editor?.chain().focus().toggleBlockquote().run(), active: isActive('blockquote') },
                  { label: 'Code', action: () => editor?.chain().focus().toggleCodeBlock().run(), active: isActive('codeBlock') },
                ].map((st) => (
                  <button
                    key={st.label}
                    type="button"
                    onClick={st.action}
                    className={`px-2 py-1 rounded text-center transition-all border ${
                      st.active
                        ? 'bg-blue-50 border-blue-500 font-bold text-blue-900'
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-neutral-400 mt-1">Heading Styles</span>
            </div>

            {/* Voice Dictation & Read Aloud Fast Controls */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onToggleDictation}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold text-xs transition shadow-2xs ${
                    isDictating
                      ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                      : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-300'
                  }`}
                  title={isDictating ? 'Stop Voice Typing' : 'Start Voice Typing / Dictation'}
                >
                  {isDictating ? <MicOff className="w-3.5 h-3.5 text-white" /> : <Mic className="w-3.5 h-3.5 text-rose-600" />}
                  <span>{isDictating ? 'Listening...' : 'Dictate'}</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleReadAloud}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold text-xs transition shadow-2xs ${
                    isSpeaking
                      ? 'bg-indigo-600 text-white border-indigo-700'
                      : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-300'
                  }`}
                  title={isSpeaking ? 'Stop Read Aloud' : 'Read Aloud / Text-to-Speech'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
                  <span>{isSpeaking ? 'Reading...' : 'Read Aloud'}</span>
                </button>
              </div>
              <span className="text-[10px] text-neutral-400 mt-1">Voice &amp; Audio</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: INSERT */}
        {/* ======================================================== */}
        {activeTab === 'insert' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenTableModal}
              className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
            >
              <TableIcon className="w-5 h-5 text-blue-600 mb-1" />
              <span>Table</span>
            </button>

            <button
              type="button"
              onClick={onOpenImageModal}
              className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
            >
              <ImageIcon className="w-5 h-5 text-emerald-600 mb-1" />
              <span>Picture / Alt Text</span>
            </button>

            <button
              type="button"
              onClick={onOpenLinkModal}
              className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
            >
              <LinkIcon className="w-5 h-5 text-indigo-600 mb-1" />
              <span>Hyperlink</span>
            </button>

            <button
              type="button"
              onClick={onOpenDrawingModal}
              className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
              title="Draw freehand ink sketches, signatures, and fantasy maps"
            >
              <PenTool className="w-5 h-5 text-amber-600 mb-1" />
              <span>Draw &amp; Ink</span>
            </button>

            <button
              type="button"
              onClick={onOpenSymbolsModal}
              className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
              title="Insert special typography, copyright, currency, and math formulas"
            >
              <Hash className="w-5 h-5 text-purple-600 mb-1" />
              <span>Symbols &amp; Math</span>
            </button>

            <div className="h-8 w-px bg-neutral-300" />

            <button
              type="button"
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              className="flex flex-col items-center px-2 py-1 rounded hover:bg-neutral-200 text-neutral-700"
            >
              <Minus className="w-5 h-5 text-neutral-600 mb-0.5" />
              <span>Divider Line</span>
            </button>

            <button
              type="button"
              onClick={() => {
                editor?.chain().focus().insertContent('<div style="page-break-after: always; border-top: 2px dashed #94A3B8; margin: 24pt 0;"></div><p></p>').run();
              }}
              className="flex flex-col items-center px-2 py-1 rounded hover:bg-neutral-200 text-neutral-700"
            >
              <Layers className="w-5 h-5 text-neutral-600 mb-0.5" />
              <span>Page Break</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const now = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                editor?.chain().focus().insertContent(now).run();
              }}
              className="flex flex-col items-center px-2 py-1 rounded hover:bg-neutral-200 text-neutral-700"
            >
              <Calendar className="w-5 h-5 text-neutral-600 mb-0.5" />
              <span>Date &amp; Time</span>
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: LAYOUT */}
        {/* ======================================================== */}
        {activeTab === 'layout' && (
          <div className="flex items-center gap-4">
            {/* Page Setup Dialog Launcher */}
            {onOpenPageSetupModal && (
              <button
                type="button"
                onClick={onOpenPageSetupModal}
                className="flex flex-col items-center px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-900 transition-colors shadow-2xs group"
                title="Open Complete Page Setup & Document Configuration (Margins, Paper Dimensions, Headers/Footers, Default Font)"
              >
                <Sliders className="w-5 h-5 text-blue-600 mb-0.5 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-[11px]">Page Setup</span>
              </button>
            )}

            {onOpenPageSetupModal && <div className="h-8 w-px bg-neutral-300" />}

            {/* Page Size */}
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 mb-1 font-semibold">Page Size</span>
              <select
                value={pageSettings.size}
                onChange={(e) => onUpdatePageSettings({ size: e.target.value as any })}
                className="px-2 py-1 bg-white border border-neutral-300 rounded text-neutral-800 font-medium"
              >
                <option value="a4">A4 (210 &times; 297 mm)</option>
                <option value="letter">Letter (8.5 &times; 11 in)</option>
                <option value="legal">Legal (8.5 &times; 14 in)</option>
                <option value="executive">Executive (7.25 &times; 10.5 in)</option>
              </select>
            </div>

            <div className="h-8 w-px bg-neutral-300" />

            {/* Orientation */}
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 mb-1 font-semibold">Orientation</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onUpdatePageSettings({ orientation: 'portrait' })}
                  className={`px-3 py-1 rounded border transition-colors ${
                    pageSettings.orientation === 'portrait'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => onUpdatePageSettings({ orientation: 'landscape' })}
                  className={`px-3 py-1 rounded border transition-colors ${
                    pageSettings.orientation === 'landscape'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-300" />

            {/* Margins */}
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 mb-1 font-semibold">Margins</span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'normal', label: 'Normal (1")', m: 1.0 },
                  { id: 'narrow', label: 'Narrow (0.5")', m: 0.5 },
                  { id: 'wide', label: 'Wide (1.5")', m: 1.5 },
                ].map((mg) => (
                  <button
                    key={mg.id}
                    type="button"
                    onClick={() => onUpdatePageSettings({ margins: { top: mg.m, right: mg.m, bottom: mg.m, left: mg.m } })}
                    className={`px-2.5 py-1 rounded border transition-colors ${
                      pageSettings.margins.top === mg.m
                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                        : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {mg.label}
                  </button>
                ))}
                {onOpenPageSetupModal && (
                  <button
                    type="button"
                    onClick={onOpenPageSetupModal}
                    className="px-2.5 py-1 rounded border border-dashed border-neutral-300 text-neutral-600 hover:text-blue-700 hover:border-blue-400 bg-white hover:bg-neutral-50 transition-colors font-medium text-xs"
                    title="Define custom top, bottom, left, and right margins in inches"
                  >
                    Custom...
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: REFERENCES */}
        {/* ======================================================== */}
        {activeTab === 'references' && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                editor?.chain().focus().insertContent(`
                  <div style="background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; padding: 14pt; margin: 18pt 0;">
                    <p style="font-weight: bold; font-size: 13pt; margin-bottom: 8pt; border-bottom: 1px solid #E2E8F0; padding-bottom: 4pt;">Table of Contents</p>
                    <ul style="margin: 0; padding-left: 18pt; line-height: 1.8;">
                      <li><a href="#h1" style="color: #2563EB; text-decoration: none;">1. Executive Summary .................................................... Page 1</a></li>
                      <li><a href="#h2" style="color: #2563EB; text-decoration: none;">2. Key Technical Findings ............................................. Page 1</a></li>
                      <li><a href="#h3" style="color: #2563EB; text-decoration: none;">3. Strategic Roadmap &amp; Milestones ............................. Page 1</a></li>
                    </ul>
                  </div>
                  <p></p>
                `).run();
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-300 rounded hover:bg-neutral-100 text-neutral-800 font-medium"
            >
              <BookmarkCheck className="w-4 h-4 text-blue-600" />
              <span>Insert Table of Contents</span>
            </button>

            <button
              type="button"
              onClick={() => {
                editor?.chain().focus().insertContent(' <sup>[1]</sup> ').run();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded hover:bg-neutral-100 text-neutral-800 font-medium"
            >
              <span>Insert Citation Footnote</span>
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: REVIEW */}
        {/* ======================================================== */}
        {activeTab === 'review' && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenAiAssistantModal}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md shadow-xs font-semibold"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Smart AI Writing Assistant</span>
            </button>

            {/* Word count summary */}
            <div className="flex items-center gap-4 bg-white px-3 py-1.5 rounded border border-neutral-200">
              <div className="text-center">
                <div className="font-mono text-xs font-bold text-neutral-900 tabular-nums">
                  {wordCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-neutral-400">Words</div>
              </div>
              <div className="h-5 w-px bg-neutral-200" />
              <div className="text-center">
                <div className="font-mono text-xs font-bold text-neutral-900 tabular-nums">
                  {charCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-neutral-400">Characters</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleSidebar}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border transition-colors ${
                isSidebarOpen ? 'bg-blue-50 text-blue-800 border-blue-300 font-semibold' : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Document Outline Pane</span>
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: VIEW */}
        {/* ======================================================== */}
        {activeTab === 'view' && (
          <div className="flex items-center gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded border border-neutral-200">
              <span className="text-xs text-neutral-600 font-medium">Zoom:</span>
              <button
                type="button"
                onClick={() => onUpdateZoom(Math.max(50, zoomLevel - 10))}
                className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded font-bold"
              >
                -
              </button>
              <span className="font-mono font-semibold w-12 text-center tabular-nums">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => onUpdateZoom(Math.min(200, zoomLevel + 10))}
                className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded font-bold"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => onUpdateZoom(100)}
                className="ml-2 text-[11px] text-blue-600 hover:underline"
              >
                100%
              </button>
            </div>

            <div className="h-8 w-px bg-neutral-300" />

            <label className="flex items-center gap-2 text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={pageSettings.showRuler}
                onChange={(e) => onUpdatePageSettings({ showRuler: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Top Ruler</span>
            </label>

            <label className="flex items-center gap-2 text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={pageSettings.showPageNumbers}
                onChange={(e) => onUpdatePageSettings({ showPageNumbers: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Page Numbers</span>
            </label>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: NOVEL & BOOK STUDIO */}
        {/* ======================================================== */}
        {activeTab === 'novel' && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenNovelModal}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white rounded-lg shadow-xs font-semibold"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Open Novel &amp; Book Studio</span>
            </button>

            <div className="h-8 w-px bg-neutral-300" />

            {/* Quick Novel Actions */}
            <button
              type="button"
              onClick={() => {
                editor?.chain().focus().insertContent('<div style="text-align: center; margin: 28pt 0; font-size: 14pt; color: #64748B; letter-spacing: 4px;">❦</div><p></p>').run();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded-md hover:bg-neutral-100 text-neutral-800 font-medium"
              title="Insert ornamental fiction scene break"
            >
              <span>Insert Scene Break (❦)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                editor?.chain().focus().insertContent('<div style="text-align: center; margin: 28pt 0; font-size: 14pt; color: #64748B; letter-spacing: 6px;">* * *</div><p></p>').run();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded-md hover:bg-neutral-100 text-neutral-800 font-medium"
              title="Insert classic asterisks scene break"
            >
              <span>Asterisks Break (* * *)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const page = window.document.getElementById('velum-document-page');
                if (page) {
                  page.classList.toggle('novel-fiction-indent');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded-md hover:bg-neutral-100 text-neutral-800 font-medium"
              title="Toggle standard novel first-line paragraph indentation"
            >
              <span>Toggle Fiction Indents</span>
            </button>

            <div className="h-8 w-px bg-neutral-300" />

            <button
              type="button"
              onClick={onOpenNovelModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-300 text-indigo-700 hover:bg-indigo-100 rounded-md font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>1-Click Publish to EPUB / PDF</span>
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: HELP */}
        {/* ======================================================== */}
        {activeTab === 'help' && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenShortcutsModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded hover:bg-neutral-100 text-neutral-800 font-medium"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Keyboard Shortcuts (WCAG 2.2)</span>
            </button>

            <button
              type="button"
              onClick={onOpenAccessibilityModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded hover:bg-neutral-100 text-neutral-800 font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Accessibility Compliance Guide</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
