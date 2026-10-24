import React, { useState } from 'react';
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
  CheckSquare,
  Indent,
  Outdent,
  Table as TableIcon,
  Image as ImageIcon,
  PenTool,
  Sparkles,
  Download,
  Search,
  Undo2,
  Redo2,
  RemoveFormatting,
  Volume2,
  VolumeX,
  FileCheck,
  FileText,
  Calendar,
  Layers,
  Palette,
  Minus
} from 'lucide-react';
import { ActiveRibbonTab, PageSettings, AppMode } from '../types/document';
import { FontPickerDropdown } from './FontPickerDropdown';
import { ColorPickerPopover } from './ColorPickerPopover';
import { FONT_SIZES } from '../utils/fonts';
import { PAGE_TINT_COLORS } from '../utils/colors';

interface RibbonProps {
  activeTab: ActiveRibbonTab;
  onSelectTab: (tab: ActiveRibbonTab) => void;
  appMode: AppMode;
  onSwitchMode: (mode: AppMode) => void;
  currentFont: string;
  onApplyFont: (font: string) => void;
  currentFontSize: number;
  onApplyFontSize: (size: number) => void;
  onExecCommand: (command: string, value?: string) => void;
  pageSettings: PageSettings;
  onUpdatePageSettings: (settings: Partial<PageSettings>) => void;
  onOpenTableModal: () => void;
  onOpenSignatureModal: () => void;
  onOpenAiAssistantModal: () => void;
  onOpenFindReplaceModal: () => void;
  onOpenExportModal: () => void;
  onInsertImage: (fileOrUrl: string) => void;
  onInsertCallout: (type: 'info' | 'warning' | 'success' | 'quote') => void;
  onInsertPageBreak: () => void;
  onInsertHorizontalRule: () => void;
  onInsertDateTime: () => void;
  zoomLevel: number;
  onUpdateZoom: (zoom: number) => void;
  wordCount: number;
  characterCount: number;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
}

export const Ribbon: React.FC<RibbonProps> = ({
  activeTab,
  onSelectTab,
  appMode,
  onSwitchMode,
  currentFont,
  onApplyFont,
  currentFontSize,
  onApplyFontSize,
  onExecCommand,
  pageSettings,
  onUpdatePageSettings,
  onOpenTableModal,
  onOpenSignatureModal,
  onOpenAiAssistantModal,
  onOpenFindReplaceModal,
  onOpenExportModal,
  onInsertImage,
  onInsertCallout,
  onInsertPageBreak,
  onInsertHorizontalRule,
  onInsertDateTime,
  zoomLevel,
  onUpdateZoom,
  wordCount,
  characterCount,
  isSpeaking,
  onToggleSpeech,
}) => {
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showPageColorPicker, setShowPageColorPicker] = useState(false);
  const [currentTextColor, setCurrentTextColor] = useState('#1F2937');
  const [currentHighlightColor, setCurrentHighlightColor] = useState('transparent');

  const tabs: { id: ActiveRibbonTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'insert', label: 'Insert' },
    { id: 'layout', label: 'Layout' },
    { id: 'review', label: 'Review & AI' },
    { id: 'view', label: 'View' },
    { id: 'pdf', label: 'PDF Studio' },
    { id: 'export', label: 'Export / Convert' },
  ];

  const handleImageUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          if (re.target?.result) {
            onInsertImage(re.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="w-full bg-[#F3F4F6] border-b border-neutral-300 select-none shadow-xs">
      {/* Ribbon Tab Strip */}
      <div className="flex items-center px-4 bg-white border-b border-neutral-200">
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  onSelectTab(tab.id);
                  if (tab.id === 'pdf') {
                    onSwitchMode('pdf_studio');
                  } else if (appMode === 'pdf_studio') {
                    onSwitchMode('word');
                  }
                }}
                className={`px-4 py-2 text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'text-blue-700 bg-neutral-100 border-b-2 border-blue-700 font-bold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Quick Search Action */}
        <div className="ml-auto flex items-center gap-2 py-1">
          <button
            type="button"
            onClick={onOpenFindReplaceModal}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded border border-neutral-200 transition-colors"
            title="Find & Replace in Document"
          >
            <Search className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline">Find / Replace</span>
          </button>
        </div>
      </div>

      {/* Ribbon Command Strip */}
      <div className="px-4 py-2 min-h-[76px] flex items-center gap-4 overflow-x-auto bg-[#F9FAFB]">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="flex items-center gap-3">
            {/* Group: Undo/Redo */}
            <div className="flex flex-col items-center border-r border-neutral-300 pr-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onExecCommand('undo')}
                  className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onExecCommand('redo')}
                  className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[10px] text-neutral-500 mt-1">History</span>
            </div>

            {/* Group: Font Family & Size */}
            <div className="flex flex-col border-r border-neutral-300 pr-3">
              <div className="flex items-center gap-1.5">
                <FontPickerDropdown
                  currentFont={currentFont}
                  onSelectFont={onApplyFont}
                />

                {/* Font Size Selector */}
                <select
                  value={currentFontSize}
                  onChange={(e) => onApplyFontSize(Number(e.target.value))}
                  className="px-2 py-1 text-xs bg-white border border-neutral-300 rounded hover:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-600 text-neutral-800"
                  title="Font Size (pt)"
                >
                  {FONT_SIZES.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz} pt
                    </option>
                  ))}
                </select>

                {/* Increase / Decrease Font Size Buttons */}
                <button
                  type="button"
                  onClick={() => {
                    const idx = FONT_SIZES.indexOf(currentFontSize);
                    if (idx < FONT_SIZES.length - 1) onApplyFontSize(FONT_SIZES[idx + 1]);
                  }}
                  className="px-1.5 py-1 text-xs font-bold text-neutral-700 hover:bg-neutral-200 rounded"
                  title="Increase Font Size"
                >
                  A&#9650;
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const idx = FONT_SIZES.indexOf(currentFontSize);
                    if (idx > 0) onApplyFontSize(FONT_SIZES[idx - 1]);
                  }}
                  className="px-1.5 py-1 text-xs text-neutral-700 hover:bg-neutral-200 rounded"
                  title="Decrease Font Size"
                >
                  A&#9660;
                </button>
              </div>

              {/* Text formatting bar */}
              <div className="flex items-center gap-0.5 mt-1.5">
                <button
                  type="button"
                  onClick={() => onExecCommand('bold')}
                  className="p-1 rounded hover:bg-neutral-200 text-neutral-800 font-bold"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onExecCommand('italic')}
                  className="p-1 rounded hover:bg-neutral-200 text-neutral-800 italic"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onExecCommand('underline')}
                  className="p-1 rounded hover:bg-neutral-200 text-neutral-800"
                  title="Underline (Ctrl+U)"
                >
                  <UnderlineIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onExecCommand('strikeThrough')}
                  className="p-1 rounded hover:bg-neutral-200 text-neutral-800"
                  title="Strikethrough"
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onExecCommand('subscript')}
                  className="p-1 rounded hover:bg-neutral-200 text-neutral-800"
                  title="Subscript"
                >
                  <Subscript className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onExecCommand('superscript')}
                  className="p-1 rounded hover:bg-neutral-200 text-neutral-800"
                  title="Superscript"
                >
                  <Superscript className="w-3.5 h-3.5" />
                </button>

                <div className="h-3 w-px bg-neutral-300 mx-1" />

                {/* Text Color Picker */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTextColorPicker(!showTextColorPicker);
                      setShowHighlightPicker(false);
                    }}
                    className="flex items-center gap-0.5 p-1 rounded hover:bg-neutral-200"
                    title="Font Color"
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-serif font-black text-xs leading-none">A</span>
                      <div
                        className="w-3.5 h-1 mt-0.5 rounded-xs"
                        style={{ backgroundColor: currentTextColor }}
                      />
                    </div>
                  </button>

                  {showTextColorPicker && (
                    <ColorPickerPopover
                      currentColor={currentTextColor}
                      type="text"
                      onSelectColor={(color) => {
                        setCurrentTextColor(color);
                        onExecCommand('foreColor', color);
                      }}
                      onClose={() => setShowTextColorPicker(false)}
                    />
                  )}
                </div>

                {/* Text Highlighter Color */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowHighlightPicker(!showHighlightPicker);
                      setShowTextColorPicker(false);
                    }}
                    className="flex items-center gap-0.5 p-1 rounded hover:bg-neutral-200"
                    title="Text Highlight Color"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold border border-neutral-400 px-0.5 leading-none">ab</span>
                      <div
                        className="w-3.5 h-1 mt-0.5 rounded-xs"
                        style={{ backgroundColor: currentHighlightColor === 'transparent' ? '#FACC15' : currentHighlightColor }}
                      />
                    </div>
                  </button>

                  {showHighlightPicker && (
                    <ColorPickerPopover
                      currentColor={currentHighlightColor}
                      type="highlight"
                      onSelectColor={(color) => {
                        setCurrentHighlightColor(color);
                        if (color === 'transparent') {
                          onExecCommand('hiliteColor', 'transparent');
                        } else {
                          onExecCommand('hiliteColor', color);
                        }
                      }}
                      onClose={() => setShowHighlightPicker(false)}
                    />
                  )}
                </div>

                {/* Clear formatting */}
                <button
                  type="button"
                  onClick={() => onExecCommand('removeFormat')}
                  className="p-1 rounded hover:bg-neutral-200 text-neutral-600"
                  title="Clear All Formatting"
                >
                  <RemoveFormatting className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Group: Paragraph & Alignment */}
            <div className="flex flex-col border-r border-neutral-300 pr-3">
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => onExecCommand('justifyLeft')}
                  className="p-1.5 rounded hover:bg-neutral-200 text-neutral-800"
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onExecCommand('justifyCenter')}
                  className="p-1.5 rounded hover:bg-neutral-200 text-neutral-800"
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onExecCommand('justifyRight')}
                  className="p-1.5 rounded hover:bg-neutral-200 text-neutral-800"
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onExecCommand('justifyFull')}
                  className="p-1.5 rounded hover:bg-neutral-200 text-neutral-800"
                  title="Justify"
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>

                <div className="h-3 w-px bg-neutral-300 mx-1" />

                <button
                  type="button"
                  onClick={() => onExecCommand('insertUnorderedList')}
                  className="p-1.5 rounded hover:bg-neutral-200 text-neutral-800"
                  title="Bulleted List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onExecCommand('insertOrderedList')}
                  className="p-1.5 rounded hover:bg-neutral-200 text-neutral-800"
                  title="Numbered List"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onExecCommand('insertHTML', '<p><input type="checkbox" style="margin-right: 6px;" /> Task item</p>');
                  }}
                  className="p-1.5 rounded hover:bg-neutral-200 text-neutral-800"
                  title="Interactive Checklist Item"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1 mt-1 text-[11px] text-neutral-600">
                <button
                  type="button"
                  onClick={() => onExecCommand('outdent')}
                  className="p-1 rounded hover:bg-neutral-200"
                  title="Decrease Indent"
                >
                  <Outdent className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onExecCommand('indent')}
                  className="p-1 rounded hover:bg-neutral-200"
                  title="Increase Indent"
                >
                  <Indent className="w-3.5 h-3.5" />
                </button>

                <span className="text-[10px] text-neutral-400 ml-1">Paragraph</span>
              </div>
            </div>

            {/* Group: Quick Styles Gallery */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                {[
                  { label: 'Normal', tag: 'p', style: 'text-xs text-neutral-800' },
                  { label: 'Heading 1', tag: 'h1', style: 'text-xs font-bold text-neutral-900' },
                  { label: 'Heading 2', tag: 'h2', style: 'text-xs font-semibold text-blue-900' },
                  { label: 'Heading 3', tag: 'h3', style: 'text-xs font-semibold text-neutral-700' },
                  { label: 'Quote', tag: 'blockquote', style: 'text-xs italic text-neutral-600' },
                ].map((st) => (
                  <button
                    key={st.label}
                    type="button"
                    onClick={() => onExecCommand('formatBlock', `<${st.tag}>`)}
                    className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-neutral-200 rounded text-center transition-all hover:border-blue-400"
                  >
                    <span className={st.style}>{st.label}</span>
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-neutral-500 mt-1">Styles Gallery</span>
            </div>
          </div>
        )}

        {/* TAB 2: INSERT */}
        {activeTab === 'insert' && (
          <div className="flex items-center gap-3">
            {/* Table */}
            <button
              type="button"
              onClick={onOpenTableModal}
              className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
            >
              <TableIcon className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-xs font-medium">Table</span>
            </button>

            {/* Pictures */}
            <button
              type="button"
              onClick={handleImageUploadClick}
              className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
            >
              <ImageIcon className="w-5 h-5 text-emerald-600 mb-1" />
              <span className="text-xs font-medium">Picture</span>
            </button>

            {/* Digital Signature */}
            <button
              type="button"
              onClick={onOpenSignatureModal}
              className="flex flex-col items-center px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-800 transition-colors"
            >
              <PenTool className="w-5 h-5 text-indigo-600 mb-1" />
              <span className="text-xs font-medium">Signature</span>
            </button>

            <div className="h-8 w-px bg-neutral-300" />

            {/* Callout Cards */}
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 mb-1 font-medium">Callout Boxes</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onInsertCallout('info')}
                  className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded text-xs"
                >
                  Info Box
                </button>
                <button
                  type="button"
                  onClick={() => onInsertCallout('warning')}
                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs"
                >
                  Warning
                </button>
                <button
                  type="button"
                  onClick={() => onInsertCallout('success')}
                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-xs"
                >
                  Key Takeaway
                </button>
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-300" />

            {/* Separators */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onInsertHorizontalRule}
                className="flex flex-col items-center px-2 py-1 rounded hover:bg-neutral-200 text-neutral-700"
                title="Insert Horizontal Divider Line"
              >
                <Minus className="w-5 h-5 text-neutral-600 mb-0.5" />
                <span className="text-[11px]">Divider</span>
              </button>

              <button
                type="button"
                onClick={onInsertPageBreak}
                className="flex flex-col items-center px-2 py-1 rounded hover:bg-neutral-200 text-neutral-700"
                title="Insert Page Break"
              >
                <Layers className="w-5 h-5 text-neutral-600 mb-0.5" />
                <span className="text-[11px]">Page Break</span>
              </button>

              <button
                type="button"
                onClick={onInsertDateTime}
                className="flex flex-col items-center px-2 py-1 rounded hover:bg-neutral-200 text-neutral-700"
                title="Insert Today's Date & Time"
              >
                <Calendar className="w-5 h-5 text-neutral-600 mb-0.5" />
                <span className="text-[11px]">Date Stamp</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: LAYOUT */}
        {activeTab === 'layout' && (
          <div className="flex items-center gap-4">
            {/* Margins */}
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 mb-1 font-medium">Margins</span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'normal', label: 'Normal (1")', m: 1.0 },
                  { id: 'narrow', label: 'Narrow (0.5")', m: 0.5 },
                  { id: 'wide', label: 'Wide (1.5")', m: 1.5 },
                ].map((mg) => (
                  <button
                    key={mg.id}
                    type="button"
                    onClick={() =>
                      onUpdatePageSettings({
                        margins: { top: mg.m, right: mg.m, bottom: mg.m, left: mg.m },
                      })
                    }
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      pageSettings.margins.top === mg.m
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {mg.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-300" />

            {/* Orientation */}
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 mb-1 font-medium">Orientation</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onUpdatePageSettings({ orientation: 'portrait' })}
                  className={`px-3 py-1 text-xs rounded border transition-colors ${
                    pageSettings.orientation === 'portrait'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => onUpdatePageSettings({ orientation: 'landscape' })}
                  className={`px-3 py-1 text-xs rounded border transition-colors ${
                    pageSettings.orientation === 'landscape'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-300" />

            {/* Paper Size */}
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 mb-1 font-medium">Paper Size</span>
              <select
                value={pageSettings.size}
                onChange={(e) => onUpdatePageSettings({ size: e.target.value as any })}
                className="px-2 py-1 text-xs bg-white border border-neutral-300 rounded text-neutral-800"
              >
                <option value="letter">Letter (8.5 &times; 11 in)</option>
                <option value="a4">A4 (210 &times; 297 mm)</option>
                <option value="legal">Legal (8.5 &times; 14 in)</option>
                <option value="executive">Executive (7.25 &times; 10.5 in)</option>
              </select>
            </div>

            <div className="h-8 w-px bg-neutral-300" />

            {/* Page Color / Tint */}
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 mb-1 font-medium">Page Background</span>
              <div className="flex items-center gap-1">
                {PAGE_TINT_COLORS.slice(0, 5).map((tint) => (
                  <button
                    key={tint.name}
                    type="button"
                    onClick={() => onUpdatePageSettings({ backgroundColor: tint.color })}
                    className={`w-6 h-6 rounded border transition-transform ${
                      pageSettings.backgroundColor === tint.color
                        ? 'ring-2 ring-blue-600 scale-110'
                        : 'border-neutral-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: tint.color }}
                    title={tint.name}
                  />
                ))}
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-300" />

            {/* Watermark Quick Toggle */}
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 mb-1 font-medium">Watermark</span>
              <select
                value={pageSettings.watermarkText || ''}
                onChange={(e) => onUpdatePageSettings({ watermarkText: e.target.value || undefined })}
                className="px-2 py-1 text-xs bg-white border border-neutral-300 rounded text-neutral-800"
              >
                <option value="">No Watermark</option>
                <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                <option value="DRAFT">DRAFT</option>
                <option value="DO NOT COPY">DO NOT COPY</option>
                <option value="SAMPLE">SAMPLE</option>
                <option value="TOP SECRET">TOP SECRET</option>
              </select>
            </div>
          </div>
        )}

        {/* TAB 4: REVIEW & AI */}
        {activeTab === 'review' && (
          <div className="flex items-center gap-4">
            {/* AI Assistant Launcher */}
            <button
              type="button"
              onClick={onOpenAiAssistantModal}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md shadow-xs transition-all font-semibold text-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Smart Writing Assistant</span>
            </button>

            {/* Read Aloud TTS */}
            <button
              type="button"
              onClick={onToggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium transition-colors ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-300'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-700" />
                  <span>Pause Reading</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>Read Aloud</span>
                </>
              )}
            </button>

            <div className="h-8 w-px bg-neutral-300" />

            {/* Word & Metrics Counter */}
            <div className="flex items-center gap-4 bg-white px-3 py-1.5 rounded border border-neutral-200">
              <div className="text-center">
                <div className="font-mono text-xs font-bold text-neutral-900 tabular-nums">
                  {wordCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-neutral-400">Words</div>
              </div>
              <div className="h-6 w-px bg-neutral-200" />
              <div className="text-center">
                <div className="font-mono text-xs font-bold text-neutral-900 tabular-nums">
                  {characterCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-neutral-400">Characters</div>
              </div>
              <div className="h-6 w-px bg-neutral-200" />
              <div className="text-center">
                <div className="font-mono text-xs font-bold text-neutral-900 tabular-nums">
                  {Math.max(1, Math.ceil(wordCount / 200))} min
                </div>
                <div className="text-[10px] text-neutral-400">Read Time</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: VIEW */}
        {activeTab === 'view' && (
          <div className="flex items-center gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded border border-neutral-200">
              <span className="text-xs text-neutral-600 font-medium">Zoom:</span>
              <button
                type="button"
                onClick={() => onUpdateZoom(Math.max(50, zoomLevel - 15))}
                className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded text-xs font-bold"
              >
                -
              </button>
              <span className="font-mono text-xs font-semibold w-12 text-center tabular-nums">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => onUpdateZoom(Math.min(200, zoomLevel + 15))}
                className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded text-xs font-bold"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => onUpdateZoom(100)}
                className="ml-2 text-[11px] text-blue-600 hover:underline"
              >
                Reset 100%
              </button>
            </div>

            <div className="h-8 w-px bg-neutral-300" />

            {/* Ruler Toggle */}
            <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={pageSettings.showRuler}
                onChange={(e) => onUpdatePageSettings({ showRuler: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Display Page Ruler</span>
            </label>

            {/* Page Numbers */}
            <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={pageSettings.showPageNumbers}
                onChange={(e) => onUpdatePageSettings({ showPageNumbers: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Page Numbers in Footer</span>
            </label>
          </div>
        )}

        {/* TAB 6: PDF STUDIO */}
        {activeTab === 'pdf' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSwitchMode('pdf_studio')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold transition-colors"
            >
              <FileCheck className="w-4 h-4" />
              <span>Launch PDF Studio Canvas</span>
            </button>

            <span className="text-xs text-neutral-500">
              Annotate, sign, highlight, redact, stamp, and convert any PDF document.
            </span>
          </div>
        )}

        {/* TAB 7: EXPORT / CONVERT */}
        {activeTab === 'export' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Open File Converter Hub</span>
            </button>

            <div className="h-8 w-px bg-neutral-300 mx-1" />

            <span className="text-xs text-neutral-500">
              One-click export to: Word (.docx), PDF (.pdf), HTML (.html), Markdown (.md), Plain Text (.txt), JSON (.json).
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
