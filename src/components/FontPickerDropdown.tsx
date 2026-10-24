import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AVAILABLE_FONTS, FontItem, ensureFontLoaded } from '../utils/fonts';
import { ChevronDown, Check, Search, Sparkles } from 'lucide-react';

interface FontPickerDropdownProps {
  currentFont: string;
  onSelectFont: (fontFamily: string) => void;
}

export const FontPickerDropdown: React.FC<FontPickerDropdownProps> = ({
  currentFont,
  onSelectFont,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find active font name
  const activeFont = AVAILABLE_FONTS.find(
    f => f.family.toLowerCase().replace(/['"]/g, '') === currentFont.toLowerCase().replace(/['"]/g, '')
  ) || AVAILABLE_FONTS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
      setActiveCategory('All');
    }
  }, [isOpen]);

  const categories = ['All', 'Modern Sans', 'Editorial Serif', 'Display', 'Monospace', 'Handwriting', 'Decorative'];

  const filteredFonts = useMemo(() => {
    return AVAILABLE_FONTS.filter((font) => {
      const matchesSearch = font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            font.preview.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || font.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleSelect = (font: FontItem) => {
    ensureFontLoaded(font.family);
    onSelectFont(font.family);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded hover:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors shadow-xs"
        title="Change Font Family"
      >
        <span className="truncate font-semibold text-neutral-800 text-[11px]" style={{ fontFamily: activeFont.family }}>
          {activeFont.name}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-neutral-500 shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-80 max-h-96 bg-white border border-neutral-300 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col text-xs animate-in fade-in zoom-in-95 duration-100">
          {/* Search Header */}
          <div className="p-2.5 border-b border-neutral-200 bg-neutral-50 space-y-2">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 55+ fonts..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors font-medium ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-200/80 text-neutral-700 hover:bg-neutral-300'
                  }`}
                >
                  {cat === 'Modern Sans' ? 'Sans' : cat === 'Editorial Serif' ? 'Serif' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Fonts List */}
          <div className="overflow-y-auto flex-1 divide-y divide-neutral-100 p-1">
            {filteredFonts.length === 0 ? (
              <div className="py-6 text-center text-neutral-400 text-xs">
                No matching fonts found
              </div>
            ) : (
              filteredFonts.map((font) => {
                const isSelected = font.id === activeFont.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => handleSelect(font)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50/70 transition-colors rounded-sm ${
                      isSelected ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-neutral-800'
                    }`}
                  >
                    <div className="flex-1 pr-2 truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs" style={{ fontFamily: font.family }}>
                          {font.name}
                        </span>
                        <span className="text-[9px] text-neutral-400 uppercase font-sans">
                          {font.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5 truncate font-normal" style={{ fontFamily: font.family }}>
                        {font.preview}
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer count */}
          <div className="px-3 py-1.5 border-t border-neutral-200 bg-neutral-50 text-[10px] text-neutral-400 flex items-center justify-between">
            <span>{filteredFonts.length} of {AVAILABLE_FONTS.length} fonts shown</span>
            <span className="flex items-center gap-1 text-blue-600 font-medium">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Google Fonts Loaded</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
