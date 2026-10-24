import React, { useState, useMemo, useRef } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Sliders, 
  Layers, 
  Info,
  SlidersHorizontal,
  Upload,
  AlertTriangle,
  FileCheck,
  PowerOff
} from 'lucide-react';
import { 
  ACCESSIBLE_FONTS, 
  AccessibleFontItem, 
  FontCategory, 
  FontSource,
  FONT_SIZES 
} from '../../utils/accessibleFonts';
import { ensureFontLoaded } from '../../utils/fonts';
import { useAccessibility } from '../../context/AccessibilityContext';

interface AccessibleFontModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFont: string;
  onApplyFont: (
    fontFamily: string, 
    size?: number, 
    spacing?: { letter?: number; word?: number; lineHeight?: number },
    applyToDocument?: boolean
  ) => void;
  sampleText?: string;
}

export const AccessibleFontModal: React.FC<AccessibleFontModalProps> = ({
  isOpen,
  onClose,
  currentFont,
  onApplyFont,
  sampleText = 'The quick brown fox jumps over the lazy dog. 1234567890 (O vs 0, l vs 1 vs I)',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [applyScope, setApplyScope] = useState<'selection' | 'document'>('document');
  const [customFonts, setCustomFonts] = useState<AccessibleFontItem[]>([]);
  const [fontUploadSuccess, setFontUploadSuccess] = useState<string>('');
  const [fontUploadError, setFontUploadError] = useState<string>('');
  const fontFileInputRef = useRef<HTMLInputElement>(null);

  const allAvailableFonts = useMemo(() => {
    return [...customFonts, ...ACCESSIBLE_FONTS];
  }, [customFonts]);

  const [selectedFont, setSelectedFont] = useState<AccessibleFontItem>(() => {
    const safeCurrent = (currentFont || '').replace(/['"]/g, '').trim().toLowerCase();
    return allAvailableFonts.find(f => f.family.toLowerCase().includes(safeCurrent)) || allAvailableFonts[0];
  });

  // Typography micro-adjustments
  const [previewFontSize, setPreviewFontSize] = useState<number>(14);
  const [letterSpacing, setLetterSpacing] = useState<number>(0);
  const [wordSpacing, setWordSpacing] = useState<number>(0);
  const [lineHeight, setLineHeight] = useState<number>(1.6);
  const [customSampleText, setCustomSampleText] = useState(sampleText);

  // Check if system font is available locally
  const isFontVerified = useMemo(() => {
    if (selectedFont.source !== 'System Font') return true;
    try {
      if (typeof document !== 'undefined' && 'fonts' in document) {
        return (document.fonts as any).check(`14px ${selectedFont.family}`);
      }
    } catch {
      return true;
    }
    return true;
  }, [selectedFont]);

  const handleImportFontFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fontName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const buffer = event.target?.result as ArrayBuffer;
        const fontFace = new FontFace(fontName, buffer);
        const loadedFace = await fontFace.load();
        (document.fonts as any).add(loadedFace);

        const newFontItem: AccessibleFontItem = {
          id: `custom-${Date.now()}`,
          name: fontName,
          family: `"${fontName}", sans-serif`,
          category: 'Sans-Serif',
          source: 'Bundled' as FontSource,
          description: `Custom font imported from "${file.name}". Registered in browser typography cache.`,
          bestFor: 'Custom brand guidelines and user typography',
          isPopular: true,
        };

        setCustomFonts(prev => [newFontItem, ...prev]);
        setSelectedFont(newFontItem);
        setFontUploadSuccess(`Successfully installed and loaded "${fontName}"!`);
        setTimeout(() => setFontUploadSuccess(''), 5000);
      } catch (err: any) {
        setFontUploadError(`Failed to load font file: ${err?.message || 'Unsupported format'}`);
        setTimeout(() => setFontUploadError(''), 6000);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const categories: (string | FontCategory)[] = [
    'All',
    'Accessibility-Focused',
    'Sans-Serif',
    'Serif',
    'Monospace',
    'Handwriting & Script',
  ];

  const filteredFonts = allAvailableFonts.filter((font) => {
    const matchesSearch = 
      font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      font.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      font.bestFor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || font.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectFont = (font: AccessibleFontItem) => {
    setSelectedFont(font);
    if (font.source === 'Google Fonts') {
      ensureFontLoaded(font.family);
    }
  };

  const handleApply = () => {
    if (selectedFont.source === 'Google Fonts') {
      ensureFontLoaded(selectedFont.family);
    }
    onApplyFont(
      selectedFont.family, 
      previewFontSize, 
      {
        letter: letterSpacing,
        word: wordSpacing,
        lineHeight: lineHeight,
      },
      applyScope === 'document'
    );
    onClose();
  };

  const samplePresets = [
    { label: 'Pangram', text: 'The quick brown fox jumps over the lazy dog.' },
    { label: 'Confusables', text: 'Distinct glyphs: 1234567890 | O vs 0 | l vs 1 vs I | rn vs m' },
    { label: 'Prose', text: 'Document accessibility ensures every individual can read, understand, and navigate textual content with dignity and independence.' },
    { label: 'Financial', text: 'Q3 Financial Disclosures: Total Assets $48,290,150.00 — YoY Growth +14.8%' },
  ];

  const { settings: accessibilitySettings, updateSettings } = useAccessibility();

  const handleTurnOffEngine = () => {
    updateSettings({
      dyslexiaFriendly: false,
      customLetterSpacing: 0,
      customWordSpacing: 0,
      customLineHeight: 1.5,
      customParagraphSpacing: 8,
    });
    setLetterSpacing(0);
    setWordSpacing(0);
    setLineHeight(1.5);
    onApplyFont('Calibri, Arial, sans-serif', 11, { letter: 0, word: 0, lineHeight: 1.5 }, true);
    onClose();
  };

  const handleResetTypography = () => {
    setLetterSpacing(0);
    setWordSpacing(0);
    setLineHeight(1.5);
    setPreviewFontSize(11);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="font-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <span className="font-serif font-black text-base">Aa</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="font-modal-title" className="text-base font-bold text-neutral-900">
                  Accessible Font System &amp; Typography Engine
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  accessibilitySettings.dyslexiaFriendly || letterSpacing > 0 || wordSpacing > 0
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {accessibilitySettings.dyslexiaFriendly || letterSpacing > 0 || wordSpacing > 0 ? 'Engine Active' : 'Standard Mode'}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Choose any font, customize spacing, or turn off the engine to use standard Microsoft Word typography.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTurnOffEngine}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
              title="Turn off accessible typography engine and reset to standard Word typography"
            >
              <PowerOff className="w-3.5 h-3.5 text-rose-600" />
              <span>Turn Off Engine</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label="Close font dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content split */}
        <div className="flex-1 flex overflow-hidden divide-x divide-neutral-200">
          {/* Left Column: Font list and search */}
          <div className="w-1/2 flex flex-col p-4 bg-neutral-50/40">
            {/* Custom font upload notification */}
            {fontUploadSuccess && (
              <div className="mb-2 p-2 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>{fontUploadSuccess}</span>
              </div>
            )}
            {fontUploadError && (
              <div className="mb-2 p-2 rounded bg-rose-50 border border-rose-300 text-rose-800 text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                <span>{fontUploadError}</span>
              </div>
            )}

            {/* Custom font import row */}
            <div className="flex items-center justify-between mb-2">
              <input
                type="file"
                ref={fontFileInputRef}
                accept=".ttf,.otf,.woff,.woff2"
                className="hidden"
                onChange={handleImportFontFile}
              />
              <button
                type="button"
                onClick={() => fontFileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
              >
                <Upload className="w-3 h-3" />
                <span>Import Font (.ttf, .otf, .woff)</span>
              </button>
              <span className="text-[11px] text-neutral-400 font-mono">{filteredFonts.length} fonts available</span>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fonts by name, legibility, or source..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Search font catalog"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Fonts list */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredFonts.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400">
                  No matching fonts found for &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                filteredFonts.map((font) => {
                  const isSelected = selectedFont.id === font.id;
                  return (
                    <div
                      key={font.id}
                      onClick={() => handleSelectFont(font)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 ring-1 ring-blue-500 shadow-xs'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 
                            className="text-sm font-semibold text-neutral-900"
                            style={{ fontFamily: font.family }}
                          >
                            {font.name}
                          </h4>
                          {font.isPopular && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              Recommended
                            </span>
                          )}
                        </div>

                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          font.source === 'Google Fonts'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        }`}>
                          {font.source}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                        {font.description}
                      </p>

                      <div className="mt-2 text-[10px] text-neutral-400 flex items-center justify-between">
                        <span>Best for: {font.bestFor}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Live Reading Preview & Spacing Controls */}
          <div className="w-1/2 flex flex-col p-5 bg-white overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Live Reading Preview
              </span>
              <button
                type="button"
                onClick={handleResetTypography}
                className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900"
                title="Reset to default spacing"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Spacing</span>
              </button>
            </div>

            {/* Custom sample text input */}
            <div className="mb-3">
              <input
                type="text"
                value={customSampleText}
                onChange={(e) => setCustomSampleText(e.target.value)}
                placeholder="Type your own preview sentence..."
                className="w-full px-2.5 py-1 text-xs border border-neutral-300 rounded bg-neutral-50/50"
              />
            </div>

            {/* System font availability warning */}
            {!isFontVerified && (
              <div className="flex items-center gap-2 p-2.5 mb-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-[11px] leading-tight">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  <strong>Font Notice:</strong> &ldquo;{selectedFont.name}&rdquo; is a system font that might not exist on all user devices. A high-clarity sans-serif/serif fallback will be utilized if not present.
                </span>
              </div>
            )}

            {/* Interactive Preview Canvas & Preset Chooser */}
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-600">Sample Text:</span>
              <div className="flex items-center gap-1">
                {samplePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setCustomSampleText(preset.text)}
                    className="text-[10px] px-2 py-0.5 rounded bg-neutral-200/70 hover:bg-neutral-300 text-neutral-700 font-medium transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div 
              className="p-4 rounded-lg border border-neutral-300 bg-neutral-50/30 min-h-[140px] flex flex-col justify-center mb-4 transition-all"
              style={{
                fontFamily: selectedFont.family,
                fontSize: `${previewFontSize}px`,
                letterSpacing: `${letterSpacing}em`,
                wordSpacing: `${wordSpacing}em`,
                lineHeight: lineHeight,
              }}
            >
              <p className="text-neutral-900 m-0">
                {customSampleText}
              </p>
              <p className="text-neutral-500 text-[85%] mt-2 mb-0">
                &ldquo;Accessibility is not a feature; it is an intrinsic human right for information access.&rdquo;
              </p>
            </div>

            {/* Spacing & Micro-Typography Sliders */}
            <div className="space-y-3.5 border-t border-neutral-200 pt-4">
              <h3 className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span>Spacing &amp; Readability Metrics</span>
              </h3>

              {/* Font Size */}
              <div>
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>Font Size:</span>
                  <span className="font-mono font-bold text-neutral-900">{previewFontSize} pt</span>
                </div>
                <input
                  type="range"
                  min="9"
                  max="36"
                  step="1"
                  value={previewFontSize}
                  onChange={(e) => setPreviewFontSize(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Letter Spacing */}
              <div>
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>Letter Spacing (Visual Crowding Reduction):</span>
                  <span className="font-mono font-bold text-neutral-900">+{letterSpacing.toFixed(2)} em</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.25"
                  step="0.02"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Word Spacing */}
              <div>
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>Word Spacing:</span>
                  <span className="font-mono font-bold text-neutral-900">+{wordSpacing.toFixed(2)} em</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.4"
                  step="0.05"
                  value={wordSpacing}
                  onChange={(e) => setWordSpacing(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Line Height */}
              <div>
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>Line Height (Leading):</span>
                  <span className="font-mono font-bold text-neutral-900">{lineHeight.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="2.4"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-600 font-medium">Apply Scope:</span>
            <div className="inline-flex rounded-lg border border-neutral-300 p-0.5 bg-neutral-200/60 text-xs">
              <button
                type="button"
                onClick={() => setApplyScope('selection')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  applyScope === 'selection'
                    ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Selection / Cursor
              </button>
              <button
                type="button"
                onClick={() => setApplyScope('document')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  applyScope === 'document'
                    ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Entire Document
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTurnOffEngine}
              className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Turn off typography engine and restore standard Calibri defaults"
            >
              <PowerOff className="w-3.5 h-3.5" />
              <span>Turn Off Engine</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Apply to {applyScope === 'document' ? 'Entire Document' : 'Selection'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
