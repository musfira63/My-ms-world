import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Editor } from '@tiptap/react';
import { Search, ChevronDown, Check, Sparkles, SlidersHorizontal, Accessibility, CheckCircle2 } from 'lucide-react';
import { ACCESSIBLE_FONTS, AccessibleFontItem, FontCategory } from '../../utils/accessibleFonts';
import { ensureFontLoaded } from '../../utils/fonts';

interface RibbonFontPickerProps {
  editor: Editor | null;
  onOpenFontModal: () => void;
}

export const RibbonFontPicker: React.FC<RibbonFontPickerProps> = ({
  editor,
  onOpenFontModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get current font family from editor selection
  const rawFont = editor?.getAttributes('textStyle').fontFamily || '';
  const currentFontFamily = rawFont.replace(/['"]/g, '').split(',')[0].trim() || 'Plus Jakarta Sans';

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus search input
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const categories = ['All', 'Accessibility-Focused', 'Sans-Serif', 'Serif', 'Monospace', 'Handwriting & Script'];

  const filteredFonts = useMemo(() => {
    return ACCESSIBLE_FONTS.filter((font) => {
      const matchSearch =
        font.name.toLowerCase().includes(search.toLowerCase()) ||
        font.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'All' || font.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  const handleSelectFont = (font: AccessibleFontItem) => {
    if (!editor) return;
    if (font.source === 'Google Fonts') {
      ensureFontLoaded(font.family);
    }
    const { from, to } = editor.state.selection;
    if (from === to) {
      editor.chain().focus().selectAll().setFontFamily(font.family).run();
    } else {
      editor.chain().focus().setFontFamily(font.family).run();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef} onKeyDown={handleKeyDown}>
      {/* Combobox Button */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Select font family. Current: ${currentFontFamily}`}
          className="flex items-center justify-between w-40 sm:w-44 px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded-l hover:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors font-medium text-neutral-800 shadow-xs"
          title="Choose Font Family (Searchable & Accessible)"
        >
          <span className="truncate font-medium text-neutral-900" style={{ fontFamily: rawFont || undefined }}>
            {currentFontFamily}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-500 ml-1 shrink-0" />
        </button>

        {/* Studio Modal Trigger Button */}
        <button
          type="button"
          onClick={onOpenFontModal}
          className="p-1 px-1.5 bg-neutral-100 border border-l-0 border-neutral-300 rounded-r hover:bg-neutral-200 text-indigo-700 hover:text-indigo-900 transition-colors"
          title="Open Full Accessible Typography & Spacing Studio"
          aria-label="Open Accessible Typography & Spacing Studio"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Font families"
          className="absolute top-full left-0 mt-1 w-80 bg-white border border-neutral-300 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col text-xs text-neutral-800 animate-in fade-in duration-100"
          style={{ maxHeight: '380px' }}
        >
          {/* Search Bar */}
          <div className="p-2 border-b border-neutral-200 bg-neutral-50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search font name..."
                aria-label="Search fonts"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex gap-1 mt-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-0.5 text-[10px] rounded-full whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white font-medium shadow-2xs'
                      : 'bg-neutral-200/80 text-neutral-600 hover:bg-neutral-300'
                  }`}
                >
                  {cat === 'Accessibility-Focused' ? 'Accessible' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Font List */}
          <div className="overflow-y-auto flex-1 divide-y divide-neutral-100">
            {filteredFonts.length === 0 ? (
              <div className="p-4 text-center text-neutral-500">
                <p>No fonts match &quot;{search}&quot;</p>
              </div>
            ) : (
              filteredFonts.map((font) => {
                const isSelected = currentFontFamily.toLowerCase() === font.name.toLowerCase();
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => handleSelectFont(font)}
                    role="option"
                    aria-selected={isSelected}
                    className={`w-full text-left px-3 py-2 hover:bg-blue-50/80 flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-neutral-800'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium" style={{ fontFamily: font.family }}>
                          {font.name}
                        </span>
                        {font.category === 'Accessibility-Focused' && (
                          <span className="inline-flex items-center text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                            Accessible
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 block truncate" style={{ fontFamily: font.family }}>
                        The quick brown fox jumps over the lazy dog
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[9px] text-neutral-400 font-mono">
                        {font.source === 'Google Fonts' ? 'Web' : font.source === 'Bundled' ? 'App' : 'Local'}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 ml-1" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Trigger for Full Modal */}
          <div className="p-2 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <span className="text-[10px] text-neutral-500">
              {filteredFonts.length} fonts available
            </span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenFontModal();
              }}
              className="flex items-center gap-1 text-[11px] text-indigo-700 hover:text-indigo-900 font-semibold hover:underline"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Full Font &amp; Spacing Studio</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
