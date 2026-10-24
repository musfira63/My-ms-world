import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sliders, 
  FileText, 
  Layout, 
  Type, 
  Check, 
  RotateCcw, 
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2
} from 'lucide-react';
import { PageSettings, PageSize, PageOrientation } from '../../types/document';
import { FONT_SIZES } from '../../utils/accessibleFonts';

interface PageSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageSettings: PageSettings;
  onSavePageSettings: (settings: PageSettings) => void;
}

export const PageSetupModal: React.FC<PageSetupModalProps> = ({
  isOpen,
  onClose,
  pageSettings,
  onSavePageSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'margins' | 'paper' | 'typography' | 'header_footer' | 'watermark'>('margins');

  // Form state initialized from current settings
  const [size, setSize] = useState<PageSize>(pageSettings.size || 'a4');
  const [orientation, setOrientation] = useState<PageOrientation>(pageSettings.orientation || 'portrait');
  const [margins, setMargins] = useState({
    top: pageSettings.margins?.top ?? 1.0,
    bottom: pageSettings.margins?.bottom ?? 1.0,
    left: pageSettings.margins?.left ?? 1.0,
    right: pageSettings.margins?.right ?? 1.0,
  });
  const [backgroundColor, setBackgroundColor] = useState(pageSettings.backgroundColor || '#FFFFFF');
  const [showRuler, setShowRuler] = useState(pageSettings.showRuler ?? true);
  const [showPageNumbers, setShowPageNumbers] = useState(pageSettings.showPageNumbers ?? true);
  const [defaultFontFamily, setDefaultFontFamily] = useState(pageSettings.defaultFontFamily || 'Calibri, Arial, sans-serif');
  const [defaultFontSize, setDefaultFontSize] = useState(pageSettings.defaultFontSize || 11);
  const [defaultLineHeight, setDefaultLineHeight] = useState(pageSettings.defaultLineHeight || 1.5);
  const [headerText, setHeaderText] = useState(pageSettings.headerText || '');
  const [footerText, setFooterText] = useState(pageSettings.footerText || '');
  const [watermarkText, setWatermarkText] = useState(pageSettings.watermarkText || '');

  useEffect(() => {
    if (isOpen) {
      setSize(pageSettings.size || 'a4');
      setOrientation(pageSettings.orientation || 'portrait');
      setMargins({
        top: pageSettings.margins?.top ?? 1.0,
        bottom: pageSettings.margins?.bottom ?? 1.0,
        left: pageSettings.margins?.left ?? 1.0,
        right: pageSettings.margins?.right ?? 1.0,
      });
      setBackgroundColor(pageSettings.backgroundColor || '#FFFFFF');
      setShowRuler(pageSettings.showRuler ?? true);
      setShowPageNumbers(pageSettings.showPageNumbers ?? true);
      setDefaultFontFamily(pageSettings.defaultFontFamily || 'Calibri, Arial, sans-serif');
      setDefaultFontSize(pageSettings.defaultFontSize || 11);
      setDefaultLineHeight(pageSettings.defaultLineHeight || 1.5);
      setHeaderText(pageSettings.headerText || '');
      setFooterText(pageSettings.footerText || '');
      setWatermarkText(pageSettings.watermarkText || '');
    }
  }, [isOpen, pageSettings]);

  if (!isOpen) return null;

  const handleApplyPresetMargins = (top: number, bottom: number, left: number, right: number) => {
    setMargins({ top, bottom, left, right });
  };

  const handleSave = () => {
    onSavePageSettings({
      size,
      orientation,
      margins,
      backgroundColor,
      showRuler,
      showPageNumbers,
      defaultFontFamily,
      defaultFontSize,
      defaultLineHeight,
      headerText,
      footerText,
      watermarkText,
    });
    onClose();
  };

  const handleResetToStandardWord = () => {
    setSize('a4');
    setOrientation('portrait');
    setMargins({ top: 1.0, bottom: 1.0, left: 1.0, right: 1.0 });
    setBackgroundColor('#FFFFFF');
    setShowRuler(true);
    setShowPageNumbers(true);
    setDefaultFontFamily('Calibri, Arial, sans-serif');
    setDefaultFontSize(11);
    setDefaultLineHeight(1.15);
    setHeaderText('');
    setFooterText('');
    setWatermarkText('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Layout className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Page Setup &amp; Document Configuration
              </h2>
              <p className="text-xs text-neutral-500">
                Configure page margins, paper dimensions, orientation, headers/footers, and default typography.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-200 transition"
            aria-label="Close setup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab strip */}
        <div className="flex items-center px-6 border-b border-neutral-200 bg-neutral-100/60 text-xs">
          {[
            { id: 'margins', label: 'Margins' },
            { id: 'paper', label: 'Paper & Orientation' },
            { id: 'typography', label: 'Default Typography' },
            { id: 'header_footer', label: 'Headers & Footers' },
            { id: 'watermark', label: 'Watermark & Color' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-800 flex-1">
          {/* TAB 1: MARGINS */}
          {activeTab === 'margins' && (
            <div className="space-y-4">
              <div>
                <span className="font-bold text-neutral-900 text-xs uppercase tracking-wider block mb-2">
                  Margin Presets
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Normal', top: 1.0, bottom: 1.0, left: 1.0, right: 1.0, desc: '1.0" all sides' },
                    { label: 'Narrow', top: 0.5, bottom: 0.5, left: 0.5, right: 0.5, desc: '0.5" all sides' },
                    { label: 'Moderate', top: 1.0, bottom: 1.0, left: 0.75, right: 0.75, desc: 'Top/Bot 1", L/R 0.75"' },
                    { label: 'Wide', top: 1.0, bottom: 1.0, left: 1.5, right: 1.5, desc: 'Top/Bot 1", L/R 1.5"' },
                  ].map((preset) => {
                    const isSelected = 
                      margins.top === preset.top && 
                      margins.bottom === preset.bottom && 
                      margins.left === preset.left && 
                      margins.right === preset.right;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleApplyPresetMargins(preset.top, preset.bottom, preset.left, preset.right)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50'
                        }`}
                      >
                        <span className="font-bold block text-xs">{preset.label}</span>
                        <span className="text-[10px] text-neutral-500 mt-0.5 block">{preset.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4">
                <span className="font-bold text-neutral-900 text-xs uppercase tracking-wider block mb-2">
                  Custom Margins (Inches)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Top Margin</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.2"
                      max="3.0"
                      value={margins.top}
                      onChange={(e) => setMargins({ ...margins, top: parseFloat(e.target.value) || 1.0 })}
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Bottom Margin</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.2"
                      max="3.0"
                      value={margins.bottom}
                      onChange={(e) => setMargins({ ...margins, bottom: parseFloat(e.target.value) || 1.0 })}
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Left Margin</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.2"
                      max="3.0"
                      value={margins.left}
                      onChange={(e) => setMargins({ ...margins, left: parseFloat(e.target.value) || 1.0 })}
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Right Margin</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.2"
                      max="3.0"
                      value={margins.right}
                      onChange={(e) => setMargins({ ...margins, right: parseFloat(e.target.value) || 1.0 })}
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAPER & ORIENTATION */}
          {activeTab === 'paper' && (
            <div className="space-y-4">
              <div>
                <span className="font-bold text-neutral-900 text-xs uppercase tracking-wider block mb-2">
                  Paper Dimensions
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'a4', label: 'A4', desc: '210 × 297 mm (Standard)' },
                    { id: 'letter', label: 'Letter', desc: '8.5 × 11 in (US)' },
                    { id: 'legal', label: 'Legal', desc: '8.5 × 14 in' },
                    { id: 'executive', label: 'Executive', desc: '7.25 × 10.5 in' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSize(p.id as any)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        size === p.id
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <span className="font-bold block text-xs">{p.label}</span>
                      <span className="text-[10px] text-neutral-500 mt-0.5 block">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4">
                <span className="font-bold text-neutral-900 text-xs uppercase tracking-wider block mb-2">
                  Page Orientation
                </span>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <button
                    type="button"
                    onClick={() => setOrientation('portrait')}
                    className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                      orientation === 'portrait'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600 font-bold'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="w-5 h-7 border-2 border-current rounded-xs shrink-0" />
                    <div>
                      <span className="block text-xs">Portrait</span>
                      <span className="text-[10px] text-neutral-500 font-normal">Tall vertical format</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrientation('landscape')}
                    className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                      orientation === 'landscape'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600 font-bold'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="w-7 h-5 border-2 border-current rounded-xs shrink-0" />
                    <div>
                      <span className="block text-xs">Landscape</span>
                      <span className="text-[10px] text-neutral-500 font-normal">Wide horizontal format</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DEFAULT TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Default Document Font Family
                </label>
                <select
                  value={defaultFontFamily}
                  onChange={(e) => setDefaultFontFamily(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-xs bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none font-medium"
                >
                  <option value="Calibri, Candara, Arial, sans-serif">Calibri (Microsoft Word Default)</option>
                  <option value="Aptos, 'Segoe UI', Arial, sans-serif">Aptos (Modern Office Default)</option>
                  <option value="Arial, Helvetica, sans-serif">Arial</option>
                  <option value="'Times New Roman', Times, Georgia, serif">Times New Roman</option>
                  <option value="Georgia, Cambria, serif">Georgia</option>
                  <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="'Courier New', Courier, monospace">Courier New</option>
                  <option value="'Atkinson Hyperlegible', sans-serif">Atkinson Hyperlegible (Accessible)</option>
                  <option value="'Lexend', sans-serif">Lexend (Accessible)</option>
                </select>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Sets the default typeface inherited by all unstyled paragraphs across the document.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Default Base Font Size
                  </label>
                  <select
                    value={defaultFontSize}
                    onChange={(e) => setDefaultFontSize(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-xs bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  >
                    {[9, 10, 11, 12, 14, 16].map((s) => (
                      <option key={s} value={s}>{s} pt</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Default Line Spacing
                  </label>
                  <select
                    value={defaultLineHeight}
                    onChange={(e) => setDefaultLineHeight(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-xs bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value={1.0}>1.0 (Single)</option>
                    <option value={1.15}>1.15 (Office Standard)</option>
                    <option value={1.5}>1.5 (Readable)</option>
                    <option value={2.0}>2.0 (Double)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HEADERS & FOOTERS */}
          {activeTab === 'header_footer' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Header Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Project Whitepaper | Confidential"
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Footer Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Internal Circulation Only"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-neutral-200">
                <div>
                  <span className="font-semibold block text-xs text-neutral-800">Show Page Numbers</span>
                  <span className="text-[11px] text-neutral-500">Prints automatic page numbering in bottom right footer</span>
                </div>
                <input
                  type="checkbox"
                  checked={showPageNumbers}
                  onChange={(e) => setShowPageNumbers(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-neutral-200">
                <div>
                  <span className="font-semibold block text-xs text-neutral-800">Show Top Ruler</span>
                  <span className="text-[11px] text-neutral-500">Displays inch markers and margin guidelines above document page</span>
                </div>
                <input
                  type="checkbox"
                  checked={showRuler}
                  onChange={(e) => setShowRuler(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 5: WATERMARK & COLOR */}
          {activeTab === 'watermark' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Document Watermark
                </label>
                <div className="flex gap-2 mb-2">
                  {['DRAFT', 'CONFIDENTIAL', 'SAMPLE', 'DO NOT COPY'].map((wm) => (
                    <button
                      key={wm}
                      type="button"
                      onClick={() => setWatermarkText(wm)}
                      className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] border border-neutral-200"
                    >
                      {wm}
                    </button>
                  ))}
                  {watermarkText && (
                    <button
                      type="button"
                      onClick={() => setWatermarkText('')}
                      className="px-2 py-1 text-rose-600 hover:underline text-[11px]"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom watermark text..."
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none uppercase font-mono"
                />
              </div>

              <div className="border-t border-neutral-200 pt-4">
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Page Background Color
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { label: 'White', color: '#FFFFFF' },
                    { label: 'Cream', color: '#FFFDF5' },
                    { label: 'Warm Sepia', color: '#FBF0D9' },
                    { label: 'Slate', color: '#F8FAFC' },
                  ].map((bg) => (
                    <button
                      key={bg.color}
                      type="button"
                      onClick={() => setBackgroundColor(bg.color)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${
                        backgroundColor === bg.color ? 'ring-2 ring-blue-600 font-bold' : 'hover:border-neutral-400'
                      }`}
                      style={{ backgroundColor: bg.color }}
                    >
                      <div className="w-3 h-3 rounded-full border border-neutral-400" style={{ backgroundColor: bg.color }} />
                      <span>{bg.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-200 bg-neutral-50 text-xs">
          <button
            type="button"
            onClick={handleResetToStandardWord}
            className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-600 hover:text-neutral-900 rounded-md border border-neutral-300 hover:bg-neutral-100 font-medium"
            title="Revert all settings to standard Microsoft Word defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Word Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-700 hover:bg-neutral-200 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-sm transition"
            >
              <Check className="w-4 h-4" />
              <span>Apply Page Setup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
