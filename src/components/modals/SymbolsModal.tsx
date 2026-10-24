import React, { useState } from 'react';
import { X, Search, Check, Calculator, Sparkles, Hash } from 'lucide-react';

interface SymbolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSymbol: (symbol: string) => void;
}

export const SymbolsModal: React.FC<SymbolsModalProps> = ({
  isOpen,
  onClose,
  onInsertSymbol,
}) => {
  const [activeCategory, setActiveCategory] = useState<'typography' | 'math' | 'greek' | 'currency' | 'arrows' | 'equations' | 'emojis'>('typography');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>(['—', '…', '“', '”', '©', '™', '±', 'π']);

  if (!isOpen) return null;

  const categories = {
    typography: [
      { char: '—', name: 'Em Dash' },
      { char: '–', name: 'En Dash' },
      { char: '…', name: 'Ellipsis' },
      { char: '“', name: 'Left Double Quote' },
      { char: '”', name: 'Right Double Quote' },
      { char: '‘', name: 'Left Single Quote' },
      { char: '’', name: 'Right Single Quote / Apostrophe' },
      { char: '«', name: 'Left Guimet' },
      { char: '»', name: 'Right Guimet' },
      { char: '§', name: 'Section' },
      { char: '¶', name: 'Pilcrow / Paragraph' },
      { char: '©', name: 'Copyright' },
      { char: '®', name: 'Registered Trademark' },
      { char: '™', name: 'Trademark' },
      { char: '†', name: 'Dagger' },
      { char: '‡', name: 'Double Dagger' },
      { char: '•', name: 'Bullet' },
      { char: '·', name: 'Middle Dot' },
      { char: '‰', name: 'Per Mille' },
      { char: '°', name: 'Degree' },
      { char: '№', name: 'Numero' },
      { char: '¿', name: 'Inverted Question' },
      { char: '¡', name: 'Inverted Exclamation' },
    ],
    math: [
      { char: '±', name: 'Plus-Minus' },
      { char: '×', name: 'Multiplication' },
      { char: '÷', name: 'Division' },
      { char: '≠', name: 'Not Equal' },
      { char: '≈', name: 'Almost Equal' },
      { char: '≤', name: 'Less or Equal' },
      { char: '≥', name: 'Greater or Equal' },
      { char: '√', name: 'Square Root' },
      { char: '∛', name: 'Cube Root' },
      { char: '∞', name: 'Infinity' },
      { char: '∫', name: 'Integral' },
      { char: '∬', name: 'Double Integral' },
      { char: '∑', name: 'Summation' },
      { char: '∏', name: 'Product' },
      { char: '∂', name: 'Partial Derivative' },
      { char: '∇', name: 'Nabla / Gradient' },
      { char: '∆', name: 'Delta' },
      { char: '∈', name: 'Element Of' },
      { char: '∉', name: 'Not Element Of' },
      { char: '⊂', name: 'Subset' },
      { char: '⊃', name: 'Superset' },
      { char: '∪', name: 'Union' },
      { char: '∩', name: 'Intersection' },
      { char: '∅', name: 'Empty Set' },
      { char: '∀', name: 'For All' },
      { char: '∃', name: 'There Exists' },
      { char: '¬', name: 'Logical Not' },
      { char: '∧', name: 'Logical And' },
      { char: '∨', name: 'Logical Or' },
    ],
    greek: [
      { char: 'α', name: 'Alpha' },
      { char: 'β', name: 'Beta' },
      { char: 'γ', name: 'Gamma' },
      { char: 'δ', name: 'Delta' },
      { char: 'ε', name: 'Epsilon' },
      { char: 'ζ', name: 'Zeta' },
      { char: 'η', name: 'Eta' },
      { char: 'θ', name: 'Theta' },
      { char: 'ι', name: 'Iota' },
      { char: 'κ', name: 'Kappa' },
      { char: 'λ', name: 'Lambda' },
      { char: 'μ', name: 'Mu' },
      { char: 'ν', name: 'Nu' },
      { char: 'ξ', name: 'Xi' },
      { char: 'π', name: 'Pi' },
      { char: 'ρ', name: 'Rho' },
      { char: 'σ', name: 'Sigma' },
      { char: 'τ', name: 'Tau' },
      { char: 'υ', name: 'Upsilon' },
      { char: 'φ', name: 'Phi' },
      { char: 'χ', name: 'Chi' },
      { char: 'ψ', name: 'Psi' },
      { char: 'ω', name: 'Omega' },
      { char: 'Ω', name: 'Capital Omega' },
      { char: 'Σ', name: 'Capital Sigma' },
      { char: 'Δ', name: 'Capital Delta' },
    ],
    currency: [
      { char: '$', name: 'Dollar' },
      { char: '€', name: 'Euro' },
      { char: '£', name: 'Pound Sterling' },
      { char: '¥', name: 'Yen / Yuan' },
      { char: '₹', name: 'Indian Rupee' },
      { char: '₽', name: 'Russian Ruble' },
      { char: '₩', name: 'Korean Won' },
      { char: '₺', name: 'Turkish Lira' },
      { char: '₿', name: 'Bitcoin' },
      { char: '¢', name: 'Cent' },
    ],
    arrows: [
      { char: '←', name: 'Left Arrow' },
      { char: '→', name: 'Right Arrow' },
      { char: '↑', name: 'Up Arrow' },
      { char: '↓', name: 'Down Arrow' },
      { char: '↔', name: 'Left Right Arrow' },
      { char: '↕', name: 'Up Down Arrow' },
      { char: '⇒', name: 'Double Right Arrow' },
      { char: '⇐', name: 'Double Left Arrow' },
      { char: '⇔', name: 'Double Left Right Arrow' },
      { char: '↵', name: 'Return Arrow' },
      { char: '➔', name: 'Heavy Arrow' },
    ],
    emojis: [
      { char: '✍️', name: 'Writing Hand' },
      { char: '📖', name: 'Open Book' },
      { char: '📜', name: 'Scroll' },
      { char: '🖋️', name: 'Fountain Pen' },
      { char: '💡', name: 'Light Bulb' },
      { char: '⭐', name: 'Star' },
      { char: '⚡', name: 'Lightning' },
      { char: '🔥', name: 'Fire' },
      { char: '🏰', name: 'Castle' },
      { char: '⚔️', name: 'Crossed Swords' },
      { char: '🛡️', name: 'Shield' },
      { char: '🔍', name: 'Magnifying Glass' },
      { char: '📌', name: 'Pushpin' },
      { char: '✔️', name: 'Checkmark' },
      { char: '❌', name: 'Cross Mark' },
    ],
    equations: [
      { char: 'x = (-b ± √(b² - 4ac)) / (2a)', name: 'Quadratic Formula' },
      { char: 'a² + b² = c²', name: 'Pythagorean Theorem' },
      { char: 'E = mc²', name: 'Mass-Energy Equivalence' },
      { char: 'e^(iπ) + 1 = 0', name: 'Euler’s Identity' },
      { char: 'A = πr²', name: 'Area of Circle' },
      { char: 'F = G(m₁m₂)/r²', name: 'Newton’s Law of Gravitation' },
      { char: 'df/dx = lim(h→0) [f(x+h) - f(x)] / h', name: 'Definition of Derivative' },
      { char: '∫ e^x dx = e^x + C', name: 'Exponential Integral' },
    ],
  };

  const currentList = categories[activeCategory] || [];
  const filtered = searchQuery
    ? currentList.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.char.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentList;

  const handleSelect = (symbol: string) => {
    onInsertSymbol(symbol);
    setRecentlyUsed((prev) => [symbol, ...prev.filter((s) => s !== symbol).slice(0, 7)]);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-neutral-800">Symbols, Special Characters &amp; Equations</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recently Used */}
        <div className="px-5 py-2 bg-neutral-100 border-b border-neutral-200 flex items-center gap-2">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase">Recent:</span>
          <div className="flex items-center gap-1">
            {recentlyUsed.map((sym, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(sym)}
                className="w-7 h-7 flex items-center justify-center bg-white border border-neutral-300 hover:border-blue-500 hover:text-blue-600 rounded text-sm font-semibold transition"
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs & Search */}
        <div className="p-4 border-b border-neutral-200 space-y-3">
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'typography', label: 'Typography' },
              { id: 'math', label: 'Math' },
              { id: 'greek', label: 'Greek' },
              { id: 'currency', label: 'Currency' },
              { id: 'arrows', label: 'Arrows' },
              { id: 'emojis', label: 'Novel Icons' },
              { id: 'equations', label: 'Equations' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeCategory === tab.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search symbol or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-neutral-50 rounded-lg border border-neutral-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Symbols Grid */}
        <div className="p-5 max-h-[340px] overflow-y-auto">
          {activeCategory === 'equations' ? (
            <div className="space-y-2">
              {filtered.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(item.char)}
                  className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-blue-500 hover:bg-blue-50/40 transition group flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-neutral-900 group-hover:text-blue-700 block">
                      {item.char}
                    </span>
                    <span className="text-[11px] text-neutral-500">{item.name}</span>
                  </div>
                  <span className="text-[10px] bg-neutral-100 group-hover:bg-blue-100 text-neutral-600 px-2 py-0.5 rounded font-medium">
                    Insert
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {filtered.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(item.char)}
                  title={item.name}
                  className="h-11 flex flex-col items-center justify-center bg-neutral-50 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 border border-neutral-200 rounded-lg transition p-1 group"
                >
                  <span className="text-base font-semibold group-hover:scale-110 transition-transform">
                    {item.char}
                  </span>
                  <span className="text-[9px] text-neutral-400 truncate w-full text-center px-0.5">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-200 bg-neutral-50 text-xs text-neutral-500">
          <span>Click any symbol to insert it immediately at cursor.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
