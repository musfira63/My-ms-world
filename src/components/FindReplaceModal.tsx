import React, { useState } from 'react';
import { X, Search, Replace, ArrowRight } from 'lucide-react';

interface FindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFind: (query: string, matchCase: boolean) => number;
  onReplace: (query: string, replacement: string, matchCase: boolean) => void;
  onReplaceAll: (query: string, replacement: string, matchCase: boolean) => number;
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  isOpen,
  onClose,
  onFind,
  onReplace,
  onReplaceAll,
}) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSearch = () => {
    if (!findText) return;
    const count = onFind(findText, matchCase);
    setMatchCount(count);
  };

  const handleReplace = () => {
    if (!findText) return;
    onReplace(findText, replaceText, matchCase);
    const count = onFind(findText, matchCase);
    setMatchCount(count);
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    const replaced = onReplaceAll(findText, replaceText, matchCase);
    setMatchCount(0);
  };

  return (
    <div className="fixed top-24 right-8 z-50 bg-white border border-neutral-300 shadow-xl rounded-lg p-4 w-80 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
      <div className="flex items-center justify-between mb-3 border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-1.5 font-semibold text-neutral-800">
          <Search className="w-3.5 h-3.5 text-blue-600" />
          <span>Find and Replace</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2.5">
        <div>
          <label className="text-[11px] font-medium text-neutral-600 block mb-1">Find</label>
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search in document..."
              className="flex-1 px-2.5 py-1.5 border border-neutral-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded font-medium text-neutral-700"
            >
              Find
            </button>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium text-neutral-600 block mb-1">Replace With</label>
          <input
            type="text"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replacement text..."
            className="w-full px-2.5 py-1.5 border border-neutral-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-1.5 text-[11px] text-neutral-600 cursor-pointer">
            <input
              type="checkbox"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span>Match case</span>
          </label>
          {matchCount !== null && (
            <span className="text-[11px] text-blue-600 font-medium">
              {matchCount} {matchCount === 1 ? 'match' : 'matches'}
            </span>
          )}
        </div>

        <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={handleReplace}
            disabled={!findText}
            className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded font-medium text-neutral-700 disabled:opacity-50"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={handleReplaceAll}
            disabled={!findText}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:opacity-50"
          >
            Replace All
          </button>
        </div>
      </div>
    </div>
  );
};
